package com.fpt.admission.mapper;

import com.fpt.admission.dto.response.AuthResponse;
import com.fpt.admission.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public AuthResponse toAuthResponse(String token, User user) {
        if (user == null) return null;

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole() != null ? user.getRole().name() : null);
        response.setAvatarUrl(user.getAvatarUrl());
        return response;
    }
}
