package com.qcmplatform.service.impl;

import com.qcmplatform.dto.ml.QuestionGeneree;
import com.qcmplatform.dto.request.EvaluationRequest;
import com.qcmplatform.dto.request.PromptUpdateRequest;
import com.qcmplatform.dto.response.EvaluationResponse;
import com.qcmplatform.dto.response.OptionResponse;
import com.qcmplatform.dto.response.QuestionResponse;
import com.qcmplatform.entity.Evaluation;
import com.qcmplatform.entity.Option;
import com.qcmplatform.entity.Question;
import com.qcmplatform.entity.User;
import com.qcmplatform.entity.enums.StatutEvaluation;
import com.qcmplatform.exception.ResourceNotFoundException;
import com.qcmplatform.exception.UnauthorizedException;
import com.qcmplatform.entity.enums.Role;
import com.qcmplatform.repository.EvaluationRepository;
import com.qcmplatform.repository.UserRepository;
import com.qcmplatform.service.interfaces.EmailServiceI;
import com.qcmplatform.service.interfaces.EvaluationServiceI;
import com.qcmplatform.service.interfaces.MlClientServiceI;
import com.qcmplatform.service.interfaces.UserServiceI;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationServiceI {

    private final EvaluationRepository evaluationRepository;
    private final UserServiceI userService;
    private final MlClientServiceI mlClientService;
    private final EmailServiceI emailService;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public EvaluationResponse creer(EvaluationRequest request, String firebaseUid) {
        User enseignant = userService.findByFirebaseUid(firebaseUid);

        List<QuestionGeneree> questionsGenerees = mlClientService.genererQcm(
                request.getObjectifs(),
                request.getPrompt(),
                request.getNbQuestions()
        );

        Evaluation evaluation = Evaluation.builder()
                .titre(request.getTitre())
                .objectifs(request.getObjectifs())
                .prompt(request.getPrompt())
                .enseignant(enseignant)
                .build();

        for (QuestionGeneree qg : questionsGenerees) {
            Question question = Question.builder()
                    .contenu(qg.getContenu())
                    .bonneReponse(qg.getBonneReponse())
                    .evaluation(evaluation)
                    .build();

            for (QuestionGeneree.OptionGeneree og : qg.getOptions()) {
                Option option = Option.builder()
                        .contenu(og.getContenu())
                        .estCorrecte(og.isEstCorrecte())
                        .question(question)
                        .build();
                question.getOptions().add(option);
            }
            evaluation.getQuestions().add(question);
        }

        return toResponse(evaluationRepository.save(evaluation));
    }

    @Override
    @Transactional
    public EvaluationResponse publier(Long id, String firebaseUid) {
        Evaluation evaluation = getEvaluationOwnedBy(id, firebaseUid);
        evaluation.setStatut(StatutEvaluation.PUBLIEE);
        EvaluationResponse response = toResponse(evaluationRepository.save(evaluation));

        // Notifier tous les étudiants de façon asynchrone (ne bloque pas la réponse)
        List<User> etudiants = userRepository.findByRole(Role.ETUDIANT);
        String enseignantNom = evaluation.getEnseignant().getPrenom() + " " + evaluation.getEnseignant().getNom();
        emailService.notifierNouveauTest(etudiants, evaluation, enseignantNom);

        return response;
    }

    @Override
    @Transactional
    public EvaluationResponse updatePrompt(Long id, PromptUpdateRequest request, String firebaseUid) {
        Evaluation evaluation = getEvaluationOwnedBy(id, firebaseUid);
        if (evaluation.getStatut() == StatutEvaluation.PUBLIEE) {
            throw new UnauthorizedException("Impossible de modifier une évaluation publiée");
        }
        evaluation.setPrompt(request.getPrompt());
        return toResponse(evaluationRepository.save(evaluation));
    }

    @Override
    public EvaluationResponse findById(Long id) {
        return evaluationRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation introuvable : " + id));
    }

    @Override
    public List<EvaluationResponse> findAllPubliees() {
        return evaluationRepository.findByStatut(StatutEvaluation.PUBLIEE)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<EvaluationResponse> findByEnseignant(String firebaseUid) {
        User enseignant = userService.findByFirebaseUid(firebaseUid);
        return evaluationRepository.findByEnseignantId(enseignant.getId())
                .stream().map(this::toResponse).toList();
    }

    private Evaluation getEvaluationOwnedBy(Long id, String firebaseUid) {
        Evaluation evaluation = evaluationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation introuvable : " + id));
        User enseignant = userService.findByFirebaseUid(firebaseUid);
        if (!evaluation.getEnseignant().getId().equals(enseignant.getId())) {
            throw new UnauthorizedException("Accès refusé à cette évaluation");
        }
        return evaluation;
    }

    private EvaluationResponse toResponse(Evaluation e) {
        List<QuestionResponse> questions = e.getQuestions().stream()
                .map(q -> QuestionResponse.builder()
                        .id(q.getId())
                        .contenu(q.getContenu())
                        .options(q.getOptions().stream()
                                .map(o -> OptionResponse.builder()
                                        .id(o.getId())
                                        .contenu(o.getContenu())
                                        .build())
                                .toList())
                        .build())
                .toList();

        return EvaluationResponse.builder()
                .id(e.getId())
                .titre(e.getTitre())
                .objectifs(e.getObjectifs())
                .prompt(e.getPrompt())
                .statut(e.getStatut())
                .enseignantNom(e.getEnseignant().getNom() + " " + e.getEnseignant().getPrenom())
                .createdAt(e.getCreatedAt())
                .questions(questions)
                .build();
    }
}
