package com.fpt.admission.service.impl;

import com.fpt.admission.dto.request.LoginRequest;
import com.fpt.admission.dto.request.RegisterRequest;
import com.fpt.admission.dto.response.AuthResponse;
import com.fpt.admission.entity.User;
import com.fpt.admission.entity.enums.UserRole;
import com.fpt.admission.repository.UserRepository;
import com.fpt.admission.security.JwtUtil;
import com.fpt.admission.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .filter(u -> Boolean.TRUE.equals(u.getIsActive()))
                .filter(u -> passwordEncoder.matches(request.getPassword(), u.getPasswordHash()))
                .orElseThrow(() -> new RuntimeException("Email hoặc mật khẩu không đúng"));

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return buildAuthResponse(token, user);
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được đăng ký");
        }

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .role(UserRole.STUDENT)
                .isActive(true)
                .build();
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return buildAuthResponse(token, user);
    }

    @Override
    public AuthResponse getMe(String token) {
        String cleanToken = token.replace("Bearer ", "");
        if (!jwtUtil.isTokenValid(cleanToken)) {
            throw new RuntimeException("Token không hợp lệ");
        }
        String email = jwtUtil.extractEmail(cleanToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        return buildAuthResponse(null, user);
    }

    @Override
    public boolean validateToken(String token) {
        String cleanToken = token.replace("Bearer ", "");
        return jwtUtil.isTokenValid(cleanToken);
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole().name());
        response.setPhone(user.getPhone());
        response.setAvatarUrl(user.getAvatarUrl());
        return response;
    }
}
