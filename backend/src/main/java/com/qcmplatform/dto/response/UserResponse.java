package com.qcmplatform.dto.response;

import com.qcmplatform.entity.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private Role role;
}
