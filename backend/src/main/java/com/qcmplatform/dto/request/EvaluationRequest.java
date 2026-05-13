package com.qcmplatform.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EvaluationRequest {

    @NotBlank
    private String titre;

    @NotBlank
    private String objectifs;

    private String prompt;

    @Min(1)
    @Max(20)
    private int nbQuestions = 5;
}
