package com.qcmplatform.service.interfaces;

import com.qcmplatform.dto.request.EvaluationRequest;
import com.qcmplatform.dto.request.PromptUpdateRequest;
import com.qcmplatform.dto.response.EvaluationResponse;

import java.util.List;

public interface EvaluationServiceI {
    EvaluationResponse creer(EvaluationRequest request, String firebaseUid);
    EvaluationResponse publier(Long id, String firebaseUid);
    EvaluationResponse updatePrompt(Long id, PromptUpdateRequest request, String firebaseUid);
    EvaluationResponse findById(Long id);
    List<EvaluationResponse> findAllPubliees();
    List<EvaluationResponse> findByEnseignant(String firebaseUid);
}
