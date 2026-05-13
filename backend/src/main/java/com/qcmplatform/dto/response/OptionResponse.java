package com.qcmplatform.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OptionResponse {
    private Long id;
    private String contenu;
}
