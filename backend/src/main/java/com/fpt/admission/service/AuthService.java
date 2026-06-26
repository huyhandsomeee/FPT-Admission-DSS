package com.fpt.admission.service;

import com.fpt.admission.dto.request.LoginRequest;
import com.fpt.admission.dto.request.RegisterRequest;
import com.fpt.admission.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse getMe(String token);
    boolean validateToken(String token);
}
