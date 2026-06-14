package com.fpt.admission.controller;

import com.fpt.admission.entity.*;
import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.repository.*;
import com.fpt.admission.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationRepository notificationRepository;
    private final CampusRepository campusRepository;
    private final MajorRepository majorRepository;
    private final AdmissionMethodRepository admissionMethodRepository;
    private final AdmissionYearRepository admissionYearRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    private Long getUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserId(authHeader);
        var profile = studentProfileRepository.findByUserId(userId).orElse(null);

        Map<String, Object> data = new LinkedHashMap<>();
        if (profile != null) {
            var apps = applicationRepository.findByStudentProfileId(profile.getId());
            data.put("totalApplications", apps.size());
            data.put("applications", apps.stream().map(a -> Map.of(
                "id", a.getId(),
                "code", a.getApplicationCode() != null ? a.getApplicationCode() : "",
                "status", a.getStatus().name(),
                "majorName", a.getMajor().getName(),
                "campusName", a.getCampus().getName()
            )).toList());
            data.put("hasProfile", true);
        } else {
            data.put("totalApplications", 0);
            data.put("applications", List.of());
            data.put("hasProfile", false);
        }

        long unreadNotifications = profile != null ?
            notificationRepository.countByUserIdAndIsReadFalse(userId) : 0;
        data.put("unreadNotifications", unreadNotifications);

        return ResponseEntity.ok(data);
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getMyApplications(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserId(authHeader);
        var profile = studentProfileRepository.findByUserId(userId).orElse(null);
        if (profile == null) return ResponseEntity.ok(List.of());

        var apps = applicationRepository.findByStudentProfileId(profile.getId());
        var result = apps.stream().map(a -> Map.of(
            "id", a.getId(),
            "applicationCode", a.getApplicationCode() != null ? a.getApplicationCode() : "",
            "status", a.getStatus().name(),
            "majorName", a.getMajor().getName(),
            "campusName", a.getCampus().getName(),
            "methodName", a.getAdmissionMethod().getName(),
            "totalScore", a.getTotalScore() != null ? a.getTotalScore() : "",
            "submittedAt", a.getSubmittedAt() != null ? a.getSubmittedAt().toString() : "",
            "createdAt", a.getCreatedAt().toString()
        )).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/applications")
    public ResponseEntity<?> createApplication(
            @RequestBody Map<String, Object> body,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = getUserId(authHeader);
        var profile = studentProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Chưa có hồ sơ sinh viên"));

        var campus = campusRepository.findById(Long.parseLong(body.get("campusId").toString())).orElseThrow();
        var major = majorRepository.findById(Long.parseLong(body.get("majorId").toString())).orElseThrow();
        var method = admissionMethodRepository.findById(Long.parseLong(body.get("methodId").toString())).orElseThrow();
        var year = admissionYearRepository.findByStatus("ACTIVE")
            .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElseThrow());

        String code = "APP" + year.getYear() + String.format("%06d", (long)(Math.random() * 999999));

        var app = Application.builder()
            .applicationCode(code)
            .studentProfile(profile)
            .admissionYear(year)
            .campus(campus)
            .major(major)
            .admissionMethod(method)
            .status(ApplicationStatus.DRAFT)
            .build();

        applicationRepository.save(app);
        return ResponseEntity.ok(Map.of("message", "Tạo hồ sơ thành công", "applicationCode", code, "id", app.getId()));
    }

    @PostMapping("/applications/{id}/submit")
    public ResponseEntity<?> submitApplication(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        return applicationRepository.findById(id).map(app -> {
            if (app.getStatus() != ApplicationStatus.DRAFT) {
                return ResponseEntity.badRequest().body(Map.of("message", "Hồ sơ không ở trạng thái Draft"));
            }
            app.setStatus(ApplicationStatus.SUBMITTED);
            app.setSubmittedAt(LocalDateTime.now());
            applicationRepository.save(app);
            return ResponseEntity.ok(Map.of("message", "Nộp hồ sơ thành công"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotifications(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Long userId = getUserId(authHeader);
        var pageable = org.springframework.data.domain.PageRequest.of(page, size);
        var notifs = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return ResponseEntity.ok(Map.of(
            "content", notifs.getContent(),
            "totalElements", notifs.getTotalElements(),
            "unreadCount", notificationRepository.countByUserIdAndIsReadFalse(userId)
        ));
    }

    // Public config data
    @GetMapping("/config/campuses")
    public ResponseEntity<?> getCampuses() { return ResponseEntity.ok(campusRepository.findByIsActiveTrue()); }

    @GetMapping("/config/majors")
    public ResponseEntity<?> getMajors(@RequestParam(required = false) Long campusId) {
        if (campusId != null) return ResponseEntity.ok(majorRepository.findByCampusIdAndIsActiveTrue(campusId));
        return ResponseEntity.ok(majorRepository.findByIsActiveTrue());
    }

    @GetMapping("/config/methods")
    public ResponseEntity<?> getMethods() { return ResponseEntity.ok(admissionMethodRepository.findByIsActiveTrueOrderByPriorityOrder()); }
}
