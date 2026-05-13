package com.qcmplatform.service.interfaces;

import com.qcmplatform.dto.ml.QuestionGeneree;
import com.qcmplatform.dto.response.AnalyseResponse;

import java.util.List;

public interface MlClientServiceI {
    List<QuestionGeneree> genererQcm(String objectifs, String prompt, int nbQuestions);
    AnalyseResponse analyser(Long evaluationId);
}
