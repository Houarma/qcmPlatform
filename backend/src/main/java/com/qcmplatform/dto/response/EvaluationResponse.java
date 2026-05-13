package com.qcmplatform.dto.response;

import com.qcmplatform.entity.enums.StatutEvaluation;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class EvaluationResponse {
    private Long id;
    private String titre;
    private String objectifs;
    private String prompt;
    private StatutEvaluation statut;
    private String enseignantNom;
    private LocalDateTime createdAt;
    private List<QuestionResponse> questions;
}
