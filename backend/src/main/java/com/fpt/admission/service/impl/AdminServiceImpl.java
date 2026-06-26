package com.fpt.admission.service.impl;

import com.fpt.admission.entity.User;
import com.fpt.admission.entity.enums.UserRole;
import com.fpt.admission.repository.*;
import com.fpt.admission.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final AuditLogRepository auditLogRepository;
    private final CampusRepository campusRepository;
    private final MajorRepository majorRepository;
    private final AdmissionYearRepository admissionYearRepository;
    private final AdmissionMethodRepository admissionMethodRepository;

    @Override
    public Map<String, Object> getDashboard() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalUsers", userRepository.count());
        data.put("totalStudents", userRepository.countByRole(UserRole.STUDENT));
        data.put("totalOfficers", userRepository.countByRole(UserRole.ADMISSION_OFFICER));
        data.put("totalApplications", applicationRepository.count());
        data.put("pendingReview", applicationRepository.countByStatus(com.fpt.admission.entity.enums.ApplicationStatus.UNDER_REVIEW));
        data.put("totalCampuses", campusRepository.count());
        data.put("totalMajors", majorRepository.count());
        return data;
    }

    @Override
    public Map<String, Object> getUsers(int page, int size, String search) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        var users = userRepository.findByRoleAndSearch(null, search, pageable);

        var content = users.getContent().stream().map(u -> Map.<String, Object>of(
                "id", u.getId(), "email", u.getEmail(),
                "fullName", u.getFullName(), "phone", u.getPhone() != null ? u.getPhone() : "",
                "role", u.getRole().name(), "isActive", u.getIsActive(),
                "createdAt", u.getCreatedAt()
        )).toList();

        return Map.of(
                "content", content,
                "totalElements", users.getTotalElements(),
                "totalPages", users.getTotalPages()
        );
    }

    @Override
    public Map<String, Object> createUser(String email, String password, String fullName, String phone, String role) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email đã tồn tại");
        }
        var encoder = new BCryptPasswordEncoder();
        var user = User.builder()
                .email(email)
                .fullName(fullName)
                .phone(phone != null ? phone : "")
                .passwordHash(encoder.encode(password != null ? password : "Admin@123"))
                .role(UserRole.valueOf(role != null ? role : "STUDENT"))
                .isActive(true)
                .build();
        userRepository.save(user);
        return Map.of("message", "Tạo người dùng thành công", "id", user.getId());
    }

    @Override
    public Map<String, Object> updateUser(Long id, Map<String, Object> updates) {
        return userRepository.findById(id).map(u -> {
            if (updates.containsKey("fullName")) u.setFullName((String) updates.get("fullName"));
            if (updates.containsKey("phone")) u.setPhone((String) updates.get("phone"));
            if (updates.containsKey("isActive")) u.setIsActive((Boolean) updates.get("isActive"));
            if (updates.containsKey("role")) {
                try {
                    u.setRole(UserRole.valueOf((String) updates.get("role")));
                } catch (Exception ignored) {}
            }
            userRepository.save(u);
            return Map.<String, Object>of("message", "Cập nhật thành công");
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    }

    @Override
    public Map<String, Object> deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy người dùng");
        }
        userRepository.deleteById(id);
        return Map.of("message", "Xóa người dùng thành công");
    }

    @Override
    public Map<String, Object> getAuditLogs(int page, int size) {
        var pageable = PageRequest.of(page, size);
        var logs = auditLogRepository.findByOrderByCreatedAtDesc(pageable);
        return Map.of(
                "content", logs.getContent(),
                "totalElements", logs.getTotalElements()
        );
    }

    @Override
    public List<?> getCampuses() { return campusRepository.findAll(); }

    @Override
    public List<?> getMajors() { return majorRepository.findAll(); }

    @Override
    public List<?> getAdmissionYears() { return admissionYearRepository.findAll(); }

    @Override
    public List<?> getAdmissionMethods() { return admissionMethodRepository.findAll(); }
}
