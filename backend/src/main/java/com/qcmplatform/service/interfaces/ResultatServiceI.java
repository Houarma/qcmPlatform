package com.qcmplatform.service.interfaces;

import com.qcmplatform.dto.request.ResultatRequest;
import com.qcmplatform.dto.response.ResultatResponse;

import java.util.List;

public interface ResultatServiceI {
    ResultatResponse soumettre(ResultatRequest request, String firebaseUid);
    List<ResultatResponse> findByEtudiant(String firebaseUid);
    List<ResultatResponse> findByEvaluation(Long evaluationId);
}
