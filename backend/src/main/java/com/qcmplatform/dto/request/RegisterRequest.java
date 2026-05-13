package com.qcmplatform.dto.request;

import com.qcmplatform.entity.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    private String firebaseUid;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    @NotNull
    private Role role;
}
