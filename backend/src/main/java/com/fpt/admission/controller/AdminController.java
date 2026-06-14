package com.fpt.admission.controller;

import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.entity.enums.UserRole;
import com.fpt.admission.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final AuditLogRepository auditLogRepository;
    private final CampusRepository campusRepository;
    private final MajorRepository majorRepository;
    private final AdmissionYearRepository admissionYearRepository;
    private final AdmissionMethodRepository admissionMethodRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalUsers", userRepository.count());
        data.put("totalStudents", userRepository.countByRole(UserRole.STUDENT));
        data.put("totalOfficers", userRepository.countByRole(UserRole.ADMISSION_OFFICER));
        data.put("totalApplications", applicationRepository.count());
        data.put("pendingReview", applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW));
        data.put("totalCampuses", campusRepository.count());
        data.put("totalMajors", majorRepository.count());
        return ResponseEntity.ok(data);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        var pageable = org.springframework.data.domain.PageRequest.of(page, size,
            org.springframework.data.domain.Sort.by("createdAt").descending());
        var users = userRepository.findByRoleAndSearch(null, search, pageable);
        return ResponseEntity.ok(Map.of(
            "content", users.getContent().stream().map(u -> Map.of(
                "id", u.getId(), "email", u.getEmail(),
                "fullName", u.getFullName(), "phone", u.getPhone() != null ? u.getPhone() : "",
                "role", u.getRole().name(), "isActive", u.getIsActive(),
                "createdAt", u.getCreatedAt()
            )).toList(),
            "totalElements", users.getTotalElements(),
            "totalPages", users.getTotalPages()
        ));
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email đã tồn tại"));
        }
        var encoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        var user = com.fpt.admission.entity.User.builder()
            .email(email)
            .fullName(body.get("fullName"))
            .phone(body.getOrDefault("phone", ""))
            .passwordHash(encoder.encode(body.getOrDefault("password", "Admin@123")))
            .role(com.fpt.admission.entity.enums.UserRole.valueOf(body.getOrDefault("role", "STUDENT")))
            .isActive(true)
            .build();
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Tạo người dùng thành công", "id", user.getId()));
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return userRepository.findById(id).map(u -> {
            if (body.containsKey("fullName")) u.setFullName((String) body.get("fullName"));
            if (body.containsKey("phone")) u.setPhone((String) body.get("phone"));
            if (body.containsKey("isActive")) u.setIsActive((Boolean) body.get("isActive"));
            if (body.containsKey("role")) {
                try { u.setRole(UserRole.valueOf((String) body.get("role"))); } catch (Exception ignored) {}
            }
            userRepository.save(u);
            return ResponseEntity.ok(Map.of("message", "Cập nhật thành công"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Xóa người dùng thành công"));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        var pageable = org.springframework.data.domain.PageRequest.of(page, size);
        var logs = auditLogRepository.findByOrderByCreatedAtDesc(pageable);
        return ResponseEntity.ok(Map.of(
            "content", logs.getContent(),
            "totalElements", logs.getTotalElements()
        ));
    }

    // Config endpoints
    @GetMapping("/config/campuses")
    public ResponseEntity<?> getCampuses() { return ResponseEntity.ok(campusRepository.findAll()); }

    @GetMapping("/config/majors")
    public ResponseEntity<?> getMajors() { return ResponseEntity.ok(majorRepository.findAll()); }

    @GetMapping("/config/years")
    public ResponseEntity<?> getYears() { return ResponseEntity.ok(admissionYearRepository.findAll()); }

    @GetMapping("/config/methods")
    public ResponseEntity<?> getMethods() { return ResponseEntity.ok(admissionMethodRepository.findAll()); }
}
