package com.qcmplatform.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ResultatResponse {
    private Long id;
    private Double score;
    private LocalDateTime datePassage;
    private String evaluationTitre;
    private Long evaluationId;
    private String etudiantNom;
}
