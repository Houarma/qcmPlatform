package com.qcmplatform.service.interfaces;

import com.qcmplatform.dto.request.RegisterRequest;
import com.qcmplatform.dto.response.UserResponse;
import com.qcmplatform.entity.User;

public interface UserServiceI {
    UserResponse register(RegisterRequest request);
    User findByFirebaseUid(String firebaseUid);
    boolean existsByFirebaseUid(String firebaseUid);
}
