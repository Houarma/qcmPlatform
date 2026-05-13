package com.qcmplatform.service.impl;

import com.qcmplatform.dto.request.ResultatRequest;
import com.qcmplatform.dto.response.ResultatResponse;
import com.qcmplatform.entity.*;
import com.qcmplatform.entity.enums.StatutEvaluation;
import com.qcmplatform.exception.ResourceNotFoundException;
import com.qcmplatform.exception.UnauthorizedException;
import com.qcmplatform.repository.EvaluationRepository;
import com.qcmplatform.repository.QuestionRepository;
import com.qcmplatform.repository.ResultatRepository;
import com.qcmplatform.service.interfaces.ResultatServiceI;
import com.qcmplatform.service.interfaces.UserServiceI;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResultatServiceImpl implements ResultatServiceI {

    private final ResultatRepository resultatRepository;
    private final EvaluationRepository evaluationRepository;
    private final QuestionRepository questionRepository;
    private final UserServiceI userService;

    @Override
    @Transactional
    public ResultatResponse soumettre(ResultatRequest request, String firebaseUid) {
        User etudiant = userService.findByFirebaseUid(firebaseUid);

        Evaluation evaluation = evaluationRepository.findById(request.getEvaluationId())
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation introuvable"));

        if (evaluation.getStatut() != StatutEvaluation.PUBLIEE) {
            throw new UnauthorizedException("Cette évaluation n'est pas disponible");
        }

        List<Question> questions = questionRepository.findByEvaluationId(evaluation.getId());

        Resultat resultat = Resultat.builder()
                .etudiant(etudiant)
                .evaluation(evaluation)
                .reponses(new ArrayList<>())
                .build();

        int correctes = 0;
        Map<Long, String> reponsesMap = request.getReponses();

        for (Question question : questions) {
            String reponseChoisie = reponsesMap.get(question.getId());
            boolean estCorrecte = question.getBonneReponse().equals(reponseChoisie);
            if (estCorrecte) correctes++;

            ReponseEtudiant reponse = ReponseEtudiant.builder()
                    .reponseChoisie(reponseChoisie)
                    .estCorrecte(estCorrecte)
                    .question(question)
                    .resultat(resultat)
                    .build();
            resultat.getReponses().add(reponse);
        }

        double score = questions.isEmpty() ? 0 : ((double) correctes / questions.size()) * 100;
        resultat.setScore(score);

        return toResponse(resultatRepository.save(resultat));
    }

    @Override
    public List<ResultatResponse> findByEtudiant(String firebaseUid) {
        User etudiant = userService.findByFirebaseUid(firebaseUid);
        return resultatRepository.findByEtudiantIdOrderByDatePassageDesc(etudiant.getId())
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<ResultatResponse> findByEvaluation(Long evaluationId) {
        return resultatRepository.findByEvaluationId(evaluationId)
                .stream().map(this::toResponse).toList();
    }

    private ResultatResponse toResponse(Resultat r) {
        return ResultatResponse.builder()
                .id(r.getId())
                .score(r.getScore())
                .datePassage(r.getDatePassage())
                .evaluationId(r.getEvaluation().getId())
                .evaluationTitre(r.getEvaluation().getTitre())
                .etudiantNom(r.getEtudiant().getNom() + " " + r.getEtudiant().getPrenom())
                .build();
    }
}
