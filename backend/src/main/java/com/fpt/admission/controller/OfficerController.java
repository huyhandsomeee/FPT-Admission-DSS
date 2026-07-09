package com.fpt.admission.controller;
 
import com.fpt.admission.entity.*;
import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.entity.enums.UserRole;
import com.fpt.admission.repository.*;
import com.fpt.admission.security.JwtUtil;
import com.fpt.admission.service.OfficerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.*;
import java.util.ArrayList;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
public class OfficerController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationRepository notificationRepository;
    private final JwtUtil jwtUtil;
    private final JdbcTemplate jdbcTemplate;
    private final OfficerService officerService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(officerService.getDashboardStats());
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStatsAlias() {
        return ResponseEntity.ok(officerService.getDashboardStats());
    }

    @GetMapping("/dashboard/by-major")
    public ResponseEntity<?> getStatsByMajor() {
        return ResponseEntity.ok(officerService.getStatsByMajor());
    }

    @GetMapping("/dashboard/by-status")
    public ResponseEntity<?> getStatsByStatus() {
        return ResponseEntity.ok(officerService.getStatsByStatus());
    }

    @GetMapping("/dashboard/by-method")
    public ResponseEntity<?> getStatsByMethod() {
        return ResponseEntity.ok(officerService.getStatsByMethod());
    }

    @GetMapping("/dashboard/by-campus")
    public ResponseEntity<?> getStatsByCampus() {
        return ResponseEntity.ok(officerService.getStatsByCampus());
    }

    @GetMapping("/dashboard/daily-trend")
    public ResponseEntity<?> getDailyTrend(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(officerService.getDailyTrend(Math.min(days, 90)));
    }

    @GetMapping("/dashboard/trend")
    public ResponseEntity<?> getDashboardTrend(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(officerService.getDailyTrend(Math.min(days, 90)));
    }

    @GetMapping("/dashboard/conversion-rates")
    public ResponseEntity<?> getConversionRates() {
        return ResponseEntity.ok(officerService.getConversionRates());
    }

    @GetMapping("/dashboard/ai-prediction")
    public ResponseEntity<?> getAIPrediction() {
        return ResponseEntity.ok(officerService.getAIPrediction());
    }

    @GetMapping("/dashboard/top-potential")
    public ResponseEntity<?> getTopPotential(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(officerService.getTopPotentialApplications(Math.min(limit, 50)));
    }

    @GetMapping("/dashboard/smart-suggestions")
    public ResponseEntity<?> getSmartSuggestions() {
        return ResponseEntity.ok(officerService.getSmartSuggestions());
    }


    @GetMapping("/applications")
    public ResponseEntity<?> getApplications(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long campusId,
            @RequestParam(required = false) Long majorId,
            @RequestParam(required = false) Long methodId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        ApplicationStatus appStatus = null;
        if (status != null && !status.isEmpty()) {
            try { appStatus = ApplicationStatus.valueOf(status); } catch (Exception ignored) {}
        }
        // Convert empty string to null for JPQL IS NULL check
        String searchParam = (search != null && !search.isBlank()) ? search : null;

        // Sort: ưu tiên SUBMITTED/UNDER_REVIEW lên trên, sau đó theo createdAt desc
        Sort sort = appStatus == null
            ? Sort.by(Sort.Order.asc("status"), Sort.Order.desc("createdAt"))
            : Sort.by("createdAt").descending();

        Page<Application> apps = applicationRepository.findWithFilters(
            appStatus, campusId, majorId, methodId, searchParam,
            PageRequest.of(page, size, sort)
        );

        return ResponseEntity.ok(Map.of(
            "content", apps.getContent().stream().map(this::toSummary).toList(),
            "totalElements", apps.getTotalElements(),
            "totalPages", apps.getTotalPages(),
            "currentPage", page
        ));
    }

    @GetMapping("/students")
    public ResponseEntity<?> getStudents(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        var pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        // Convert empty string to null for JPQL IS NULL check
        String searchParam = (search != null && !search.isBlank()) ? search : null;
        var users = userRepository.findByRoleAndSearch(UserRole.STUDENT, searchParam, pageable);
        return ResponseEntity.ok(Map.of(
            "content", users.getContent().stream().map(u -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", u.getId());
                m.put("email", u.getEmail());
                m.put("fullName", u.getFullName());
                m.put("phone", u.getPhone() != null ? u.getPhone() : "");
                m.put("isActive", u.getIsActive());
                m.put("createdAt", u.getCreatedAt());
                // Get student profile and application info
                var profile = studentProfileRepository.findByUserId(u.getId()).orElse(null);
                m.put("hasProfile", profile != null);
                m.put("studentCode", profile != null ? profile.getStudentCode() : null);
                if (profile != null) {
                    var apps = applicationRepository.findByStudentProfileId(profile.getId());
                    m.put("totalApplications", apps.size());
                    m.put("latestStatus", apps.isEmpty() ? null : apps.get(0).getStatus().name());
                    m.put("latestApplicationCode", apps.isEmpty() ? null : apps.get(0).getApplicationCode());
                } else {
                    m.put("totalApplications", 0);
                    m.put("latestStatus", null);
                    m.put("latestApplicationCode", null);
                }
                return m;
            }).toList(),
            "totalElements", users.getTotalElements(),
            "totalPages", users.getTotalPages(),
            "currentPage", page
        ));
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<?> getApplication(@PathVariable Long id) {
        return applicationRepository.findById(id)
            .map(a -> ResponseEntity.ok(toDetail(a)))
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @RequestHeader("Authorization") String authHeader) {

        return applicationRepository.findById(id).map(app -> {
            String newStatus = body.get("status");
            String reason = body.get("reason");
            try {
                app.setStatus(ApplicationStatus.valueOf(newStatus));
                if (reason != null) app.setRejectionReason(reason);
                if (body.containsKey("notes")) app.setOfficerNotes(body.get("notes"));
                
                // Parse and save total score if provided
                if (body.containsKey("score") || body.containsKey("totalScore")) {
                    String scoreStr = body.containsKey("score") ? body.get("score") : body.get("totalScore");
                    if (scoreStr != null && !scoreStr.isBlank()) {
                        app.setTotalScore(new java.math.BigDecimal(scoreStr.trim()));
                    } else {
                        app.setTotalScore(null);
                    }
                }
                
                app.setReviewedAt(java.time.LocalDateTime.now());
                applicationRepository.save(app);

                // Create student notification
                try {
                    Notification studentNotif = Notification.builder()
                        .user(app.getStudentProfile().getUser())
                        .relatedEntityType("APPLICATION")
                        .relatedEntityId(app.getId())
                        .isRead(false)
                        .createdAt(java.time.LocalDateTime.now())
                        .build();

                    if ("APPROVED".equals(newStatus)) {
                        studentNotif.setTitle("Hồ sơ đã được duyệt");
                        studentNotif.setMessage("Chúc mừng! Hồ sơ " + app.getApplicationCode() + " của bạn đã được duyệt. Tuy nhiên, bạn vẫn phải đăng ký trên cổng tuyển sinh của Bộ Giáo dục và Đào tạo để hoàn tất thủ tục nhập học.");
                        studentNotif.setType(com.fpt.admission.entity.enums.NotificationType.RESULT);
                    } else if ("REJECTED".equals(newStatus)) {
                        studentNotif.setTitle("Hồ sơ bị từ chối");
                        studentNotif.setMessage("Rất tiếc! Hồ sơ xét tuyển của bạn bị từ chối. Lý do: " + reason);
                        studentNotif.setType(com.fpt.admission.entity.enums.NotificationType.RESULT);
                    } else if ("UNDER_REVIEW".equals(newStatus)) {
                        studentNotif.setTitle("Nhắc nhở: Bổ sung tài liệu");
                        studentNotif.setMessage("Hồ sơ xét tuyển của bạn cần bổ sung tài liệu. Chi tiết yêu cầu: " + body.get("notes"));
                        studentNotif.setType(com.fpt.admission.entity.enums.NotificationType.REMINDER);
                    } else {
                        studentNotif.setTitle("Cập nhật trạng thái hồ sơ");
                        studentNotif.setMessage("Trạng thái hồ sơ của bạn đã được cập nhật thành: " + newStatus);
                        studentNotif.setType(com.fpt.admission.entity.enums.NotificationType.ADMISSION_UPDATE);
                    }
                    notificationRepository.save(studentNotif);
                } catch (Exception notifEx) {
                    System.err.println("Lỗi tạo thông báo: " + notifEx.getMessage());
                }

                return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái thành công"));
            } catch (Exception e) {
                return ResponseEntity.<Object>badRequest().body(Map.of("message", "Trạng thái không hợp lệ"));
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toSummary(Application a) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", a.getId());
        m.put("applicationCode", a.getApplicationCode());
        m.put("studentName", a.getStudentProfile().getUser().getFullName());
        m.put("studentEmail", a.getStudentProfile().getUser().getEmail());
        m.put("majorName", a.getMajor().getName());
        m.put("campusName", a.getCampus().getName());
        m.put("methodName", a.getAdmissionMethod().getName());
        m.put("status", a.getStatus().name());
        m.put("totalScore", a.getTotalScore());
        m.put("submittedAt", a.getSubmittedAt());
        m.put("createdAt", a.getCreatedAt());

        var ab = a.getStudentProfile() != null ? a.getStudentProfile().getAcademicBackground() : null;
        double gpa10 = ab != null && ab.getGpa10() != null ? ab.getGpa10().doubleValue() : 0.0;
        double gpa11 = ab != null && ab.getGpa11() != null ? ab.getGpa11().doubleValue() : 0.0;
        double gpa12 = ab != null && ab.getGpa12() != null ? ab.getGpa12().doubleValue() : 0.0;
        double potentialScore = Math.round((gpa10 + gpa11 + gpa12) * 100.0) / 100.0;
        m.put("potentialScore", potentialScore);

        return m;
    }

    private Map<String, Object> toDetail(Application a) {
        Map<String, Object> m = toSummary(a);
        m.put("rejectionReason", a.getRejectionReason());
        m.put("officerNotes", a.getOfficerNotes());
        m.put("reviewedAt", a.getReviewedAt());
        m.put("studentPhone", a.getStudentProfile().getUser().getPhone());

        // Fetch academic background
        try {
            List<Map<String, Object>> academicList = jdbcTemplate.queryForList(
                "SELECT school_name as schoolName, graduation_year as graduationYear, " +
                "gpa_10 as gpa10, gpa_11 as gpa11, gpa_12 as gpa12, " +
                "math_score as mathScore, literature_score as literatureScore, english_score as englishScore, " +
                "total_score as totalScore, ielts_score as ieltsScore, sat_score as satScore, toefl_score as toeflScore " +
                "FROM academic_backgrounds WHERE student_profile_id = ?",
                a.getStudentProfile().getId()
            );
            if (!academicList.isEmpty()) {
                m.put("academicBackground", academicList.get(0));
            } else {
                m.put("academicBackground", null);
            }
        } catch (Exception e) {
            m.put("academicBackground", null);
        }

        // Fetch admission preference confirmation
        try {
            List<Map<String, Object>> confList = jdbcTemplate.queryForList(
                "SELECT confirmation_date as confirmationDate, preference_order as preferenceOrder, " +
                "major_code as majorCode, major_name as majorName, evidence_image as evidenceImage, note " +
                "FROM admission_preference_confirmations WHERE application_id = ?",
                a.getId()
            );
            if (!confList.isEmpty()) {
                m.put("preferenceConfirmation", confList.get(0));
            } else {
                m.put("preferenceConfirmation", null);
            }
        } catch (Exception e) {
            m.put("preferenceConfirmation", null);
        }

        // Fetch documents
        try {
            List<Map<String, Object>> docs = jdbcTemplate.queryForList(
                "SELECT ad.id, ad.file_name as name, dt.name as descName, ad.status, ad.file_path as filePath " +
                "FROM application_documents ad " +
                "JOIN document_types dt ON ad.document_type_id = dt.id " +
                "WHERE ad.application_id = ?",
                a.getId()
            );
            List<Map<String, Object>> formattedDocs = docs.stream().map(doc -> {
                Map<String, Object> docMap = new LinkedHashMap<>();
                docMap.put("id", doc.get("id"));
                docMap.put("name", doc.get("name"));
                docMap.put("desc", doc.get("descName"));
                docMap.put("filePath", doc.get("filePath"));
                String statusStr = String.valueOf(doc.get("status")).toLowerCase();
                docMap.put("status", statusStr.equals("verified") ? "uploaded" : statusStr);
                return docMap;
            }).toList();
            m.put("documents", formattedDocs);
        } catch (Exception e) {
            m.put("documents", List.of());
        }

        return m;
    }

    @PatchMapping("/documents/{id}/status")
    public ResponseEntity<?> updateDocumentStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Trạng thái không được để trống"));
        }
        try {
            String upperStatus = status.toUpperCase();
            if (!List.of("PENDING", "VERIFIED", "REJECTED").contains(upperStatus)) {
                return ResponseEntity.badRequest().body(Map.of("message", "Trạng thái không hợp lệ"));
            }
            jdbcTemplate.update(
                "UPDATE application_documents SET status = ?, verified_at = ? WHERE id = ?",
                upperStatus,
                java.time.LocalDateTime.now(),
                id
            );
            return ResponseEntity.ok(Map.of("message", "Cập nhật trạng thái tài liệu thành công", "status", upperStatus.toLowerCase()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi khi cập nhật trạng thái tài liệu: " + e.getMessage()));
        }
    }

    @GetMapping("/applications/new-requests")
    public ResponseEntity<?> getNewApplicationRequests() {
        List<StudentProfile> profiles = studentProfileRepository.findAll().stream()
            .filter(p -> "PENDING".equals(p.getNewApplicationRequest()))
            .toList();

        var result = profiles.stream().map(p -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("profileId", p.getId());
            m.put("userId", p.getUser().getId());
            m.put("fullName", p.getUser().getFullName());
            m.put("email", p.getUser().getEmail());
            m.put("phone", p.getUser().getPhone() != null ? p.getUser().getPhone() : "");
            m.put("studentCode", p.getStudentCode());
            m.put("requestedAt", p.getUpdatedAt() != null ? p.getUpdatedAt().toString() : "");
            return m;
        }).toList();

        return ResponseEntity.ok(result);
    }

    @PostMapping("/students/{userId}/allow-new-application")
    public ResponseEntity<?> handleAllowNewApplication(
            @PathVariable Long userId,
            @RequestParam boolean allow,
            @RequestHeader("Authorization") String authHeader) {
        
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ sinh viên"));
        
        if (allow) {
            profile.setAllowNewApplication(true);
            profile.setNewApplicationRequest("APPROVED");
        } else {
            profile.setAllowNewApplication(false);
            profile.setNewApplicationRequest("REJECTED");
        }
        studentProfileRepository.save(profile);

        // Notify the student
        Notification notif = Notification.builder()
            .user(profile.getUser())
            .title(allow ? "Yêu cầu tạo hồ sơ mới được phê duyệt" : "Yêu cầu tạo hồ sơ mới bị từ chối")
            .message(allow 
                ? "Cán bộ tuyển sinh đã chấp thuận yêu cầu tạo hồ sơ mới của bạn. Bạn có thể nộp hồ sơ xét tuyển mới ngay bây giờ." 
                : "Cán bộ tuyển sinh đã từ chối yêu cầu tạo hồ sơ mới của bạn.")
            .type(com.fpt.admission.entity.enums.NotificationType.ADMISSION_UPDATE)
            .isRead(false)
            .createdAt(java.time.LocalDateTime.now())
            .build();
        notificationRepository.save(notif);

        return ResponseEntity.ok(Map.of("message", "Xử lý yêu cầu thành công"));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ENROLLMENT NOTIFICATION ENDPOINTS
    // ─────────────────────────────────────────────────────────────────────────

    /** List all ACCEPTED_MOET applicants with their enrollment notification status */
    @GetMapping("/enrollment/notifications")
    public ResponseEntity<?> getEnrollmentList(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        String sql =
            "SELECT a.id, a.application_code, a.status, " +
            "  u.full_name, u.email, u.phone, " +
            "  m.name AS major_name, c.name AS campus_name, " +
            "  a.reviewed_at AS accepted_at, " +
            "  COALESCE(en.notif_status, 'NOT_SENT') AS notif_status, " +
            "  en.sent_at, en.read_at, en.confirmed_at, en.tuition_paid_at, " +
            "  en.scheduled_at, en.completed_at, en.sent_by_name " +
            "FROM applications a " +
            "JOIN student_profiles sp ON a.student_profile_id = sp.id " +
            "JOIN users u ON sp.user_id = u.id " +
            "JOIN majors m ON a.major_id = m.id " +
            "JOIN campuses c ON a.campus_id = c.id " +
            "LEFT JOIN (" +
            "  SELECT application_id, " +
            "    CASE " +
            "      WHEN completed_at IS NOT NULL THEN 'COMPLETED' " +
            "      WHEN tuition_paid_at IS NOT NULL OR scheduled_at IS NOT NULL THEN 'IN_PROGRESS' " +
            "      WHEN confirmed_at IS NOT NULL THEN 'CONFIRMED' " +
            "      WHEN read_at IS NOT NULL THEN 'READ' " +
            "      WHEN sent_at IS NOT NULL THEN 'SENT' " +
            "      ELSE 'NOT_SENT' END AS notif_status, " +
            "    sent_at, read_at, confirmed_at, tuition_paid_at, scheduled_at, completed_at, sent_by_name " +
            "  FROM enrollment_notifications " +
            "  WHERE id IN (SELECT MAX(id) FROM enrollment_notifications GROUP BY application_id) " +
            ") en ON en.application_id = a.id " +
            "WHERE a.status = 'ACCEPTED_MOET' ";
        if (status != null && !status.isBlank() && !status.equals("ALL")) {
            sql += "AND COALESCE(en.notif_status, 'NOT_SENT') = '" + status.replace("'", "") + "' ";
        }
        sql += "ORDER BY a.reviewed_at DESC " +
               "LIMIT " + size + " OFFSET " + (page * size);
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            long total = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM applications WHERE status = 'ACCEPTED_MOET'", Long.class);
            return ResponseEntity.ok(Map.of("content", rows, "totalElements", total, "page", page, "size", size));
        } catch (Exception e) {
            // Table may not exist yet – return empty list gracefully
            return ResponseEntity.ok(Map.of("content", List.of(), "totalElements", 0L, "page", 0, "size", size));
        }
    }

    /** Send enrollment notification to one or multiple applicants */
    @PostMapping("/enrollment/send")
    public ResponseEntity<?> sendEnrollmentNotification(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String senderEmail = jwtUtil.extractEmail(token);
        var senderUser = userRepository.findByEmail(senderEmail).orElse(null);
        String senderName = senderUser != null ? senderUser.getFullName() : "Cán bộ tuyển sinh";

        @SuppressWarnings("unchecked")
        List<Object> appIds = (List<Object>) payload.get("applicationIds");
        String title    = (String) payload.getOrDefault("title", "Thông báo nhập học ĐH FPT 2026");
        String content  = (String) payload.getOrDefault("content", "");
        String deadline = (String) payload.getOrDefault("deadline", "");
        String hotline  = (String) payload.getOrDefault("hotline", "1800 6036");
        String tuitionAmount = (String) payload.getOrDefault("tuitionAmount", "");
        String tuitionLink   = (String) payload.getOrDefault("tuitionLink", "");
        String scheduleLink  = (String) payload.getOrDefault("scheduleLink", "");
        String downloadLink  = (String) payload.getOrDefault("downloadLink", "");
        String contactPerson = (String) payload.getOrDefault("contactPerson", senderName);
        String documents = (String) payload.getOrDefault("documents", "");
        String channels  = payload.getOrDefault("channels", "PORTAL").toString();

        if (appIds == null || appIds.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng chọn ít nhất một thí sinh."));
        }

        int sentCount = 0;
        for (Object idObj : appIds) {
            long appId = Long.parseLong(idObj.toString());
            var appOpt = applicationRepository.findById(appId);
            if (appOpt.isEmpty()) continue;
            var app = appOpt.get();

            // Upsert enrollment_notifications table (create if needed)
            try {
                jdbcTemplate.execute(
                    "CREATE TABLE IF NOT EXISTS enrollment_notifications (" +
                    "  id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                    "  application_id BIGINT NOT NULL, " +
                    "  title VARCHAR(512), " +
                    "  content TEXT, " +
                    "  deadline VARCHAR(100), " +
                    "  documents TEXT, " +
                    "  tuition_amount VARCHAR(100), " +
                    "  tuition_link VARCHAR(512), " +
                    "  schedule_link VARCHAR(512), " +
                    "  download_link VARCHAR(512), " +
                    "  hotline VARCHAR(100), " +
                    "  contact_person VARCHAR(200), " +
                    "  channels VARCHAR(100), " +
                    "  sent_at DATETIME, " +
                    "  sent_by_name VARCHAR(200), " +
                    "  read_at DATETIME, " +
                    "  confirmed_at DATETIME, " +
                    "  tuition_paid_at DATETIME, " +
                    "  scheduled_at DATETIME, " +
                    "  completed_at DATETIME, " +
                    "  created_at DATETIME DEFAULT NOW()" +
                    ")"
                );
                jdbcTemplate.update(
                    "INSERT INTO enrollment_notifications " +
                    "(application_id, title, content, deadline, documents, tuition_amount, tuition_link, " +
                    " schedule_link, download_link, hotline, contact_person, channels, sent_at, sent_by_name) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)",
                    appId, title, content, deadline, documents, tuitionAmount,
                    tuitionLink, scheduleLink, downloadLink, hotline, contactPerson, channels, senderName
                );
            } catch (Exception ex) {
                continue;
            }

            // Portal notification
            try {
                Notification notif = Notification.builder()
                    .user(app.getStudentProfile().getUser())
                    .title(title)
                    .message(content.length() > 200 ? content.substring(0, 200) + "..." : content)
                    .type(com.fpt.admission.entity.enums.NotificationType.ADMISSION_UPDATE)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();
                notificationRepository.save(notif);
            } catch (Exception ignored) {}

            sentCount++;
        }

        return ResponseEntity.ok(Map.of(
            "message", "Đã gửi thông báo nhập học thành công",
            "sentCount", sentCount
        ));
    }

    /** Get enrollment notification logs for a given application */
    @GetMapping("/enrollment/logs")
    public ResponseEntity<?> getEnrollmentLogs(
            @RequestParam(required = false) Long applicationId) {
        try {
            String sql = "SELECT en.*, a.application_code, u.full_name, u.email " +
                "FROM enrollment_notifications en " +
                "JOIN applications a ON en.application_id = a.id " +
                "JOIN student_profiles sp ON a.student_profile_id = sp.id " +
                "JOIN users u ON sp.user_id = u.id ";
            if (applicationId != null) sql += "WHERE en.application_id = " + applicationId + " ";
            sql += "ORDER BY en.sent_at DESC LIMIT 100";
            return ResponseEntity.ok(jdbcTemplate.queryForList(sql));
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    /** Officer marks enrollment as completed for a student */
    @PostMapping("/enrollment/{id}/complete")
    public ResponseEntity<?> markEnrollmentComplete(@PathVariable Long id) {
        try {
            jdbcTemplate.update(
                "UPDATE enrollment_notifications SET completed_at = NOW() WHERE application_id = ? AND completed_at IS NULL",
                id);
            return ResponseEntity.ok(Map.of("message", "Đã đánh dấu hoàn tất nhập học"));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("message", "Cập nhật thành công"));
        }
    }
}

