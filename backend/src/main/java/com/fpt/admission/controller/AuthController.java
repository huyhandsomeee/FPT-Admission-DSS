package com.fpt.admission.controller;

import com.fpt.admission.entity.User;
import com.fpt.admission.entity.enums.UserRole;
import com.fpt.admission.repository.UserRepository;
import com.fpt.admission.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        return userRepository.findByEmail(email)
            .filter(u -> Boolean.TRUE.equals(u.getIsActive()))
            .filter(u -> passwordEncoder.matches(password, u.getPasswordHash()))
            .map(u -> {
                u.setLastLoginAt(LocalDateTime.now());
                userRepository.save(u);
                String token = jwtUtil.generateToken(u.getEmail(), u.getRole().name(), u.getId());
                return ResponseEntity.ok(Map.of(
                    "token", token,
                    "id", u.getId(),
                    "email", u.getEmail(),
                    "fullName", u.getFullName(),
                    "role", u.getRole().name(),
                    "avatarUrl", u.getAvatarUrl() != null ? u.getAvatarUrl() : ""
                ));
            })
            .orElse(ResponseEntity.status(401).body(Map.of("message", "Email hoặc mật khẩu không đúng")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String fullName = body.get("fullName");
        String phone = body.getOrDefault("phone", "");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email đã được đăng ký"));
        }

        User user = User.builder()
            .email(email)
            .passwordHash(passwordEncoder.encode(password))
            .fullName(fullName)
            .phone(phone)
            .role(UserRole.STUDENT)
            .isActive(true)
            .build();
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), user.getId());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "id", user.getId(),
            "email", user.getEmail(),
            "fullName", user.getFullName(),
            "role", user.getRole().name()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtUtil.isTokenValid(token)) {
            return ResponseEntity.status(401).body(Map.of("message", "Token không hợp lệ"));
        }
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
            .map(u -> ResponseEntity.ok(Map.of(
                "id", u.getId(),
                "email", u.getEmail(),
                "fullName", u.getFullName(),
                "role", u.getRole().name(),
                "phone", u.getPhone() != null ? u.getPhone() : "",
                "avatarUrl", u.getAvatarUrl() != null ? u.getAvatarUrl() : ""
            )))
            .orElse(ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy người dùng")));
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validate(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return ResponseEntity.ok(Map.of("valid", jwtUtil.isTokenValid(token)));
    }
}
