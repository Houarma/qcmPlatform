package com.qcmplatform.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class ResultatRequest {

    @NotNull
    private Long evaluationId;

    // questionId -> reponseChoisie (ex: "A", "B", "C", "D")
    @NotNull
    private Map<Long, String> reponses;
}
