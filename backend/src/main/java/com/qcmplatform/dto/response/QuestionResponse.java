package com.qcmplatform.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class QuestionResponse {
    private Long id;
    private String contenu;
    private List<OptionResponse> options;
}
