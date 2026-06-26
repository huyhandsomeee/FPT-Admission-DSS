package com.fpt.admission.service.impl;

import com.fpt.admission.entity.*;
import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.entity.enums.UserRole;
import com.fpt.admission.repository.*;
import com.fpt.admission.service.OfficerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OfficerServiceImpl implements OfficerService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationRepository notificationRepository;
    private final AdmissionYearRepository admissionYearRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public Map<String, Object> getDashboard(Long userId) {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalApplications", applicationRepository.count());
        data.put("submitted", applicationRepository.countByStatus(ApplicationStatus.SUBMITTED));
        data.put("underReview", applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW));
        data.put("approved", applicationRepository.countByStatus(ApplicationStatus.APPROVED));
        data.put("rejected", applicationRepository.countByStatus(ApplicationStatus.REJECTED));
        data.put("enrolled", applicationRepository.countByStatus(ApplicationStatus.ENROLLED));

        var activeYear = admissionYearRepository.findByStatus("ACTIVE")
                .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElse(null));
        if (activeYear != null) {
            data.put("activeYear", activeYear.getYear());
            data.put("quota", activeYear.getQuotaTotal());
        } else {
            data.put("activeYear", 2026);
            data.put("quota", 18000);
        }
        return data;
    }

    @Override
    public List<Map<String, Object>> getApplications(String status, String search, int size) {
        ApplicationStatus appStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                appStatus = ApplicationStatus.valueOf(status);
            } catch (Exception ignored) {}
        }
        String searchParam = (search != null && !search.isBlank()) ? search : null;

        Page<Application> apps = applicationRepository.findWithFilters(
                appStatus, null, null, null, searchParam,
                PageRequest.of(0, size, Sort.by("createdAt").descending())
        );

        return apps.getContent().stream().map(this::toSummary).toList();
    }

    @Override
    public List<Map<String, Object>> getStudents(String search, int size) {
        String searchParam = (search != null && !search.isBlank()) ? search : null;
        var users = userRepository.findByRoleAndSearch(UserRole.STUDENT, searchParam,
                PageRequest.of(0, size, Sort.by("createdAt").descending()));

        return users.getContent().stream().map(u -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId());
            m.put("email", u.getEmail());
            m.put("fullName", u.getFullName());
            m.put("phone", u.getPhone() != null ? u.getPhone() : "");
            m.put("isActive", u.getIsActive());
            m.put("createdAt", u.getCreatedAt());
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
        }).toList();
    }

    @Override
    public Map<String, Object> getApplicationDetail(Long id) {
        return applicationRepository.findById(id)
                .map(this::toDetail)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ"));
    }

    @Override
    @Transactional
    public Map<String, Object> updateApplicationStatus(Long id, String status, String notes, String reason, String score) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ"));

        app.setStatus(ApplicationStatus.valueOf(status));
        if (reason != null) app.setRejectionReason(reason);
        if (notes != null) app.setOfficerNotes(notes);

        if (score != null && !score.isBlank()) {
            app.setTotalScore(new BigDecimal(score.trim()));
        }

        app.setReviewedAt(LocalDateTime.now());
        applicationRepository.save(app);

        // Create notification for student
        try {
            Notification studentNotif = Notification.builder()
                    .user(app.getStudentProfile().getUser())
                    .relatedEntityType("APPLICATION")
                    .relatedEntityId(app.getId())
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();

            switch (status) {
                case "APPROVED" -> {
                    studentNotif.setTitle("Hồ sơ đã được duyệt");
                    studentNotif.setMessage("Chúc mừng! Hồ sơ " + app.getApplicationCode() + " của bạn đã được chấp thuận.");
                    studentNotif.setType(com.fpt.admission.entity.enums.NotificationType.RESULT);
                }
                case "REJECTED" -> {
                    studentNotif.setTitle("Hồ sơ bị từ chối");
                    studentNotif.setMessage("Rất tiếc! Hồ sơ xét tuyển của bạn bị từ chối. Lý do: " + reason);
                    studentNotif.setType(com.fpt.admission.entity.enums.NotificationType.RESULT);
                }
                case "UNDER_REVIEW" -> {
                    studentNotif.setTitle("Nhắc nhở: Bổ sung tài liệu");
                    studentNotif.setMessage("Hồ sơ xét tuyển của bạn cần bổ sung tài liệu. Chi tiết yêu cầu: " + notes);
                    studentNotif.setType(com.fpt.admission.entity.enums.NotificationType.REMINDER);
                }
                default -> {
                    studentNotif.setTitle("Cập nhật trạng thái hồ sơ");
                    studentNotif.setMessage("Trạng thái hồ sơ của bạn đã được cập nhật thành: " + status);
                    studentNotif.setType(com.fpt.admission.entity.enums.NotificationType.ADMISSION_UPDATE);
                }
            }
            notificationRepository.save(studentNotif);
        } catch (Exception e) {
            System.err.println("Lỗi tạo thông báo: " + e.getMessage());
        }

        return Map.of("message", "Cập nhật trạng thái thành công");
    }

    @Override
    public List<Map<String, Object>> getNewRequests() {
        List<StudentProfile> profiles = studentProfileRepository.findAll().stream()
                .filter(p -> "PENDING".equals(p.getNewApplicationRequest()))
                .toList();

        return profiles.stream().map(p -> {
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
    }

    @Override
    @Transactional
    public Map<String, Object> allowNewApplication(Long userId, boolean allow) {
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

        Notification notif = Notification.builder()
                .user(profile.getUser())
                .title(allow ? "Yêu cầu tạo hồ sơ mới được phê duyệt" : "Yêu cầu tạo hồ sơ mới bị từ chối")
                .message(allow
                        ? "Cán bộ tuyển sinh đã chấp thuận yêu cầu tạo hồ sơ mới của bạn. Bạn có thể nộp hồ sơ xét tuyển mới ngay bây giờ."
                        : "Cán bộ tuyển sinh đã từ chối yêu cầu tạo hồ sơ mới của bạn.")
                .type(com.fpt.admission.entity.enums.NotificationType.ADMISSION_UPDATE)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notif);

        return Map.of("message", "Xử lý yêu cầu thành công");
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
        return m;
    }

    private Map<String, Object> toDetail(Application a) {
        Map<String, Object> m = toSummary(a);
        m.put("rejectionReason", a.getRejectionReason());
        m.put("officerNotes", a.getOfficerNotes());
        m.put("reviewedAt", a.getReviewedAt());
        m.put("studentPhone", a.getStudentProfile().getUser().getPhone());

        try {
            List<Map<String, Object>> academicList = jdbcTemplate.queryForList(
                    "SELECT school_name as schoolName, graduation_year as graduationYear, " +
                            "gpa_10 as gpa10, gpa_11 as gpa11, gpa_12 as gpa12, " +
                            "math_score as mathScore, literature_score as literatureScore, english_score as englishScore, " +
                            "total_score as totalScore, ielts_score as ieltsScore, sat_score as satScore, toefl_score as toeflScore " +
                            "FROM academic_backgrounds WHERE student_profile_id = ?",
                    a.getStudentProfile().getId()
            );
            m.put("academicBackground", academicList.isEmpty() ? null : academicList.get(0));
        } catch (Exception e) {
            m.put("academicBackground", null);
        }

        try {
            List<Map<String, Object>> docs = jdbcTemplate.queryForList(
                    "SELECT ad.file_name as name, dt.name as descName, ad.status, ad.file_path as filePath " +
                            "FROM application_documents ad " +
                            "JOIN document_types dt ON ad.document_type_id = dt.id " +
                            "WHERE ad.application_id = ?",
                    a.getId()
            );
            List<Map<String, Object>> formattedDocs = docs.stream().map(doc -> {
                Map<String, Object> docMap = new LinkedHashMap<>();
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
}
