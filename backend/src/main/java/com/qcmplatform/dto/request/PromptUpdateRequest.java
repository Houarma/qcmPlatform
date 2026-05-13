package com.qcmplatform.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PromptUpdateRequest {

    @NotBlank
    private String prompt;
}
