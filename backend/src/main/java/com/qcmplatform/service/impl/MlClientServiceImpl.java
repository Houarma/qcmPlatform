package com.qcmplatform.service.impl;

import com.qcmplatform.dto.ml.QuestionGeneree;
import com.qcmplatform.dto.response.AnalyseResponse;
import com.qcmplatform.entity.Resultat;
import com.qcmplatform.repository.ResultatRepository;
import com.qcmplatform.service.interfaces.MlClientServiceI;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MlClientServiceImpl implements MlClientServiceI {

    private final RestTemplate restTemplate;
    private final ResultatRepository resultatRepository;

    @Value("${app.ml-service.url}")
    private String mlServiceUrl;

    @Override
    public List<QuestionGeneree> genererQcm(String objectifs, String prompt, int nbQuestions) {
        Map<String, Object> body = new HashMap<>();
        body.put("objectifs", objectifs);
        body.put("prompt", prompt != null ? prompt : "");
        body.put("nb_questions", nbQuestions);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                mlServiceUrl + "/generate",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {}
        );

        List<Map<String, Object>> rawQuestions = (List<Map<String, Object>>) response.getBody().get("questions");
        return parseQuestions(rawQuestions);
    }

    @Override
    public AnalyseResponse analyser(Long evaluationId) {
        List<Resultat> resultats = resultatRepository.findByEvaluationId(evaluationId);

        List<Map<String, Object>> dataset = resultats.stream().map(r -> {
            Map<String, Object> entry = new HashMap<>();
            entry.put("etudiant_id", r.getEtudiant().getId());
            entry.put("etudiant_nom", r.getEtudiant().getNom() + " " + r.getEtudiant().getPrenom());
            entry.put("score", r.getScore());
            List<Map<String, Object>> reponses = r.getReponses().stream().map(rep -> {
                Map<String, Object> repMap = new HashMap<>();
                repMap.put("question_id", rep.getQuestion().getId());
                repMap.put("est_correcte", rep.isEstCorrecte());
                return repMap;
            }).toList();
            entry.put("reponses", reponses);
            return entry;
        }).toList();

        Map<String, Object> body = new HashMap<>();
        body.put("evaluation_id", evaluationId);
        body.put("resultats", dataset);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<AnalyseResponse> response = restTemplate.exchange(
                mlServiceUrl + "/analyse",
                HttpMethod.POST,
                entity,
                AnalyseResponse.class
        );

        return response.getBody();
    }

    private List<QuestionGeneree> parseQuestions(List<Map<String, Object>> raw) {
        List<QuestionGeneree> result = new ArrayList<>();
        for (Map<String, Object> q : raw) {
            QuestionGeneree qg = new QuestionGeneree();
            qg.setContenu((String) q.get("contenu"));
            qg.setBonneReponse((String) q.get("bonne_reponse"));

            List<Map<String, Object>> rawOptions = (List<Map<String, Object>>) q.get("options");
            List<QuestionGeneree.OptionGeneree> options = rawOptions.stream().map(o -> {
                QuestionGeneree.OptionGeneree og = new QuestionGeneree.OptionGeneree();
                og.setLabel((String) o.get("label"));
                og.setContenu((String) o.get("contenu"));
                og.setEstCorrecte(Boolean.TRUE.equals(o.get("est_correcte")));
                return og;
            }).toList();

            qg.setOptions(options);
            result.add(qg);
        }
        return result;
    }
}
