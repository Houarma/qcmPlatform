package com.qcmplatform.service.impl;

import com.qcmplatform.dto.request.RegisterRequest;
import com.qcmplatform.dto.response.UserResponse;
import com.qcmplatform.entity.User;
import com.qcmplatform.exception.ResourceNotFoundException;
import com.qcmplatform.repository.UserRepository;
import com.qcmplatform.service.interfaces.UserServiceI;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserServiceI {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        User user = User.builder()
                .firebaseUid(request.getFirebaseUid())
                .email(request.getEmail())
                .nom(request.getNom())
                .prenom(request.getPrenom())
                .role(request.getRole())
                .build();
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    @Override
    public User findByFirebaseUid(String firebaseUid) {
        return userRepository.findByFirebaseUid(firebaseUid)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
    }

    @Override
    public boolean existsByFirebaseUid(String firebaseUid) {
        return userRepository.existsByFirebaseUid(firebaseUid);
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .role(user.getRole())
                .build();
    }
}
