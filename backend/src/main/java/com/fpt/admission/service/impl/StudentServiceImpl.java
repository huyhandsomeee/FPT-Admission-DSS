package com.fpt.admission.service.impl;

import com.fpt.admission.dto.response.DashboardResponse;
import com.fpt.admission.entity.*;
import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.entity.enums.UserRole;
import com.fpt.admission.repository.*;
import com.fpt.admission.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ProvinceRepository provinceRepository;
    private final AcademicBackgroundRepository academicBackgroundRepository;
    private final CampusRepository campusRepository;
    private final MajorRepository majorRepository;
    private final AdmissionMethodRepository admissionMethodRepository;
    private final AdmissionYearRepository admissionYearRepository;
    private final JdbcTemplate jdbcTemplate;
    private final FileStorageServiceImpl fileStorageService;

    @Override
    public DashboardResponse getDashboard(Long userId) {
        var profile = studentProfileRepository.findByUserId(userId).orElse(null);
        DashboardResponse response = new DashboardResponse();

        if (profile != null) {
            var apps = applicationRepository.findByStudentProfileId(profile.getId());
            response.setTotalApplications(apps.size());
            response.setApplications(apps.stream().map(a -> Map.<String, Object>of(
                    "id", a.getId(),
                    "code", a.getApplicationCode() != null ? a.getApplicationCode() : "",
                    "status", a.getStatus().name(),
                    "majorName", a.getMajor().getName(),
                    "campusName", a.getCampus().getName()
            )).toList());
            response.setHasProfile(true);
            response.setAllowNewApplication(profile.getAllowNewApplication() != null ? profile.getAllowNewApplication() : false);
            response.setNewApplicationRequest(profile.getNewApplicationRequest() != null ? profile.getNewApplicationRequest() : "NONE");
        } else {
            response.setHasProfile(false);
            response.setAllowNewApplication(false);
            response.setNewApplicationRequest("NONE");
        }

        long unreadNotifications = profile != null ?
                notificationRepository.countByUserIdAndIsReadFalse(userId) : 0;
        response.setUnreadNotifications(unreadNotifications);

        return response;
    }

    @Override
    public List<Map<String, Object>> getMyApplications(Long userId) {
        var profile = studentProfileRepository.findByUserId(userId).orElse(null);
        if (profile == null) return List.of();

        var apps = applicationRepository.findByStudentProfileId(profile.getId());
        return apps.stream().map(a -> Map.<String, Object>of(
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
    }

    @Override
    @Transactional
    public Map<String, Object> createApplication(
            Long userId, String fullName, String dob, String gender,
            String phone, String cccd, String permanentAddress, Long provinceId,
            String parentName, String parentPhone, String schoolName, int graduationYear,
            double mathScore, double literatureScore, double englishScore,
            double gpa10, double gpa11, double gpa12,
            Long campusId, Long majorId, Long methodId,
            MultipartFile cccdFile, MultipartFile hocBaFile, MultipartFile bangTNFile,
            MultipartFile anhTheFile, MultipartFile giayKhaiSinhFile,
            MultipartFile chungChiFile, MultipartFile hoKhauFile) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // 1. Save / Update Student Profile
        StudentProfile profile = studentProfileRepository.findByUserId(userId).orElse(null);
        if (profile == null) {
            profile = new StudentProfile();
            profile.setUser(user);
            String studentCode = "TS2026" + String.format("%04d", (long) (Math.random() * 9999));
            profile.setStudentCode(studentCode);
        }
        profile.setDob(LocalDate.parse(dob));
        profile.setGender(gender);
        profile.setPermanentAddress(permanentAddress);
        profile.setCccdNumber(cccd);
        profile.setParentName(parentName);
        profile.setParentPhone(parentPhone);
        if (provinceId != null) {
            profile.setProvince(provinceRepository.findById(provinceId).orElse(null));
        }
        profile = studentProfileRepository.save(profile);

        // 2. Save / Update Academic Background
        AcademicBackground ab = academicBackgroundRepository.findByStudentProfileId(profile.getId()).orElse(null);
        if (ab == null) {
            ab = new AcademicBackground();
            ab.setStudentProfile(profile);
        }
        ab.setSchoolName(schoolName);
        ab.setGraduationYear(graduationYear);
        ab.setMathScore(BigDecimal.valueOf(mathScore));
        ab.setLiteratureScore(BigDecimal.valueOf(literatureScore));
        ab.setEnglishScore(BigDecimal.valueOf(englishScore));
        ab.setGpa10(BigDecimal.valueOf(gpa10));
        ab.setGpa11(BigDecimal.valueOf(gpa11));
        ab.setGpa12(BigDecimal.valueOf(gpa12));
        ab.setTotalScore(BigDecimal.valueOf(mathScore + literatureScore + englishScore));
        academicBackgroundRepository.save(ab);

        // 3. Create Application
        var campus = campusRepository.findById(campusId).orElseThrow();
        var major = majorRepository.findById(majorId).orElseThrow();
        var method = admissionMethodRepository.findById(methodId).orElseThrow();
        var year = admissionYearRepository.findByStatus("ACTIVE")
                .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElseThrow());

        String code = "APP" + year.getYear() + String.format("%06d", (long) (Math.random() * 999999));

        var app = Application.builder()
                .applicationCode(code)
                .studentProfile(profile)
                .admissionYear(year)
                .campus(campus)
                .major(major)
                .admissionMethod(method)
                .totalScore(ab.getTotalScore())
                .status(ApplicationStatus.SUBMITTED)
                .submittedAt(LocalDateTime.now())
                .build();

        applicationRepository.save(app);

        // 4. Save documents
        saveAppDoc(app.getId(), 1L, cccdFile, userId);
        saveAppDoc(app.getId(), 2L, hocBaFile, userId);
        saveAppDoc(app.getId(), 3L, bangTNFile, userId);
        saveAppDoc(app.getId(), 5L, anhTheFile, userId);
        if (giayKhaiSinhFile != null && !giayKhaiSinhFile.isEmpty()) {
            saveAppDoc(app.getId(), 6L, giayKhaiSinhFile, userId);
        }
        if (chungChiFile != null && !chungChiFile.isEmpty()) {
            saveAppDoc(app.getId(), 4L, chungChiFile, userId);
        }
        if (hoKhauFile != null && !hoKhauFile.isEmpty()) {
            saveAppDoc(app.getId(), 7L, hoKhauFile, userId);
        }

        // Reset permissions
        profile.setAllowNewApplication(false);
        profile.setNewApplicationRequest("NONE");
        studentProfileRepository.save(profile);

        // Create notification
        Notification studentNotif = Notification.builder()
                .user(user)
                .title("Nộp hồ sơ thành công")
                .message("Bạn đã nộp hồ sơ xét tuyển thành công (Mã HS: " + code + "). Hồ sơ đang được chờ xét duyệt.")
                .type(com.fpt.admission.entity.enums.NotificationType.ADMISSION_UPDATE)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(studentNotif);

        return Map.of("message", "Nộp hồ sơ thành công", "applicationCode", code, "id", app.getId());
    }

    private void saveAppDoc(Long appId, Long docTypeId, MultipartFile file, Long userId) {
        fileStorageService.saveApplicationDoc(appId, docTypeId, file, userId);
    }

    @Override
    public Map<String, Object> getApplicationDetails(Long id, Long userId) {
        var profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Hồ sơ sinh viên chưa được tạo"));

        var app = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ"));

        if (!app.getStudentProfile().getId().equals(profile.getId())) {
            throw new RuntimeException("Bạn không có quyền xem hồ sơ này");
        }

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", app.getId());
        m.put("applicationCode", app.getApplicationCode());
        m.put("status", app.getStatus().name());
        m.put("majorName", app.getMajor().getName());
        m.put("campusName", app.getCampus().getName());
        m.put("methodName", app.getAdmissionMethod().getName());
        m.put("totalScore", app.getTotalScore());
        m.put("rejectionReason", app.getRejectionReason());
        m.put("officerNotes", app.getOfficerNotes());
        m.put("submittedAt", app.getSubmittedAt());
        m.put("createdAt", app.getCreatedAt());
        m.put("fullName", profile.getUser().getFullName());
        m.put("dob", profile.getDob() != null ? profile.getDob().toString() : "");
        m.put("gender", profile.getGender());
        m.put("phone", profile.getUser().getPhone());
        m.put("cccd", profile.getCccdNumber());
        m.put("permanentAddress", profile.getPermanentAddress());
        m.put("provinceId", profile.getProvince() != null ? profile.getProvince().getId() : "");
        m.put("parentName", profile.getParentName());
        m.put("parentPhone", profile.getParentPhone());

        // Fetch academic background
        try {
            List<Map<String, Object>> academicList = jdbcTemplate.queryForList(
                    "SELECT school_name as schoolName, graduation_year as graduationYear, " +
                            "gpa_10 as gpa10, gpa_11 as gpa11, gpa_12 as gpa12, " +
                            "math_score as mathScore, literature_score as literatureScore, english_score as englishScore, " +
                            "total_score as totalScore, ielts_score as ieltsScore, sat_score as satScore, toefl_score as toeflScore " +
                            "FROM academic_backgrounds WHERE student_profile_id = ?",
                    profile.getId()
            );
            m.put("academicBackground", academicList.isEmpty() ? null : academicList.get(0));
        } catch (Exception e) {
            m.put("academicBackground", null);
        }

        // Fetch documents
        try {
            List<Map<String, Object>> docs = jdbcTemplate.queryForList(
                    "SELECT ad.file_name as name, dt.name as descName, dt.code as typeCode, ad.status, ad.file_path as filePath " +
                            "FROM application_documents ad " +
                            "JOIN document_types dt ON ad.document_type_id = dt.id " +
                            "WHERE ad.application_id = ?",
                    app.getId()
            );
            List<Map<String, Object>> formattedDocs = docs.stream().map(doc -> {
                Map<String, Object> docMap = new LinkedHashMap<>();
                docMap.put("name", doc.get("name"));
                docMap.put("desc", doc.get("descName"));
                docMap.put("typeCode", doc.get("typeCode"));
                docMap.put("filePath", doc.get("filePath"));
                docMap.put("status", doc.get("status"));
                return docMap;
            }).toList();
            m.put("documents", formattedDocs);
        } catch (Exception e) {
            m.put("documents", List.of());
        }

        return m;
    }

    @Override
    public Map<String, Object> submitApplication(Long id) {
        return applicationRepository.findById(id).map(app -> {
            if (app.getStatus() != ApplicationStatus.DRAFT) {
                throw new RuntimeException("Hồ sơ không ở trạng thái Draft");
            }
            app.setStatus(ApplicationStatus.SUBMITTED);
            app.setSubmittedAt(LocalDateTime.now());
            applicationRepository.save(app);
            return Map.<String, Object>of("message", "Nộp hồ sơ thành công");
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ"));
    }

    @Override
    @Transactional
    public Map<String, Object> requestNewApplication(Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Hồ sơ sinh viên chưa được tạo"));

        profile.setNewApplicationRequest("PENDING");
        studentProfileRepository.save(profile);

        List<User> officers = userRepository.findAll().stream()
                .filter(u -> u.getRole() == UserRole.ADMISSION_OFFICER
                        || u.getRole() == UserRole.ADMISSION_MANAGER)
                .toList();

        for (User officer : officers) {
            Notification notif = Notification.builder()
                    .user(officer)
                    .title("Yêu cầu tạo hồ sơ mới")
                    .message("Thí sinh " + profile.getUser().getFullName() + " (Mã HS: " + profile.getStudentCode() + ") đã gửi yêu cầu được tạo hồ sơ mới.")
                    .type(com.fpt.admission.entity.enums.NotificationType.MESSAGE)
                    .isRead(false)
                    .createdAt(LocalDateTime.now())
                    .build();
            notificationRepository.save(notif);
        }

        return Map.of("message", "Gửi yêu cầu tạo hồ sơ mới thành công");
    }

    @Override
    public Map<String, Object> getNotifications(Long userId, int page, int size) {
        var pageable = PageRequest.of(page, size);
        var notifs = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<Map<String, Object>> contentList = notifs.getContent().stream().map(n -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", n.getId());
            m.put("title", n.getTitle());
            m.put("message", n.getMessage());
            m.put("type", n.getType() != null ? n.getType().name() : "SYSTEM");
            m.put("isRead", n.getIsRead() != null ? n.getIsRead() : false);
            m.put("relatedEntityType", n.getRelatedEntityType());
            m.put("relatedEntityId", n.getRelatedEntityId());
            m.put("createdAt", n.getCreatedAt() != null ? n.getCreatedAt().toString() : "");
            return m;
        }).toList();

        return Map.of(
                "content", contentList,
                "totalElements", notifs.getTotalElements(),
                "unreadCount", notificationRepository.countByUserIdAndIsReadFalse(userId)
        );
    }

    @Override
    public Map<String, Object> markNotificationAsRead(Long id) {
        return notificationRepository.findById(id).map(notif -> {
            notif.setIsRead(true);
            notificationRepository.save(notif);
            return Map.<String, Object>of("message", "Đã đọc thông báo");
        }).orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));
    }

    @Override
    @Transactional
    public Map<String, Object> markAllNotificationsAsRead(Long userId) {
        notificationRepository.markAllAsRead(userId);
        return Map.of("message", "Đã đọc tất cả thông báo");
    }

    @Override
    public List<Map<String, Object>> getUploadedDocuments(Long userId) {
        var profile = studentProfileRepository.findByUserId(userId).orElse(null);
        if (profile == null) return List.of();

        var apps = applicationRepository.findByStudentProfileId(profile.getId());
        if (apps.isEmpty()) return List.of();

        var latestApp = apps.stream()
                .max(Comparator.comparing(Application::getCreatedAt))
                .orElse(null);

        if (latestApp == null) return List.of();

        try {
            List<Map<String, Object>> docs = jdbcTemplate.queryForList(
                    "SELECT ad.file_name as name, dt.name as descName, dt.code as typeCode, dt.id as typeId, ad.status, ad.file_path as filePath, ad.file_size as size " +
                            "FROM application_documents ad " +
                            "JOIN document_types dt ON ad.document_type_id = dt.id " +
                            "WHERE ad.application_id = ?",
                    latestApp.getId()
            );
            return docs.stream().map(doc -> {
                Map<String, Object> docMap = new LinkedHashMap<>();
                docMap.put("name", doc.get("name"));
                docMap.put("desc", doc.get("descName"));
                String dbCode = String.valueOf(doc.get("typeCode"));
                String feCode = switch (dbCode) {
                    case "CCCD" -> "CCCD";
                    case "HOC_BA" -> "TRANSCRIPT";
                    case "BANG_TN" -> "CERTIFICATE";
                    case "ANH_THE" -> "PHOTO";
                    default -> "OTHER";
                };
                docMap.put("typeCode", feCode);
                docMap.put("typeId", doc.get("typeId"));
                docMap.put("filePath", doc.get("filePath"));
                docMap.put("status", doc.get("status"));
                docMap.put("size", doc.get("size"));
                return docMap;
            }).toList();
        } catch (Exception e) {
            return List.of();
        }
    }

    @Override
    @Transactional
    public Map<String, Object> uploadOrReplaceDocument(Long userId, MultipartFile file, String typeCode) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        StudentProfile profile = studentProfileRepository.findByUserId(userId).orElse(null);
        if (profile == null) {
            profile = new StudentProfile();
            profile.setUser(user);
            String studentCode = "TS2026" + String.format("%04d", (long) (Math.random() * 9999));
            profile.setStudentCode(studentCode);
            profile = studentProfileRepository.save(profile);
        }

        var apps = applicationRepository.findByStudentProfileId(profile.getId());
        Application app;
        if (apps.isEmpty()) {
            var campus = campusRepository.findAll().stream().findFirst().orElseThrow();
            var major = majorRepository.findAll().stream().findFirst().orElseThrow();
            var method = admissionMethodRepository.findAll().stream().findFirst().orElseThrow();
            var year = admissionYearRepository.findByStatus("ACTIVE")
                    .orElse(admissionYearRepository.findTopByOrderByYearDesc().orElseThrow());

            String code = "APP" + year.getYear() + String.format("%06d", (long) (Math.random() * 999999));
            app = Application.builder()
                    .applicationCode(code)
                    .studentProfile(profile)
                    .admissionYear(year)
                    .campus(campus)
                    .major(major)
                    .admissionMethod(method)
                    .status(ApplicationStatus.DRAFT)
                    .build();
            app = applicationRepository.save(app);
        } else {
            app = apps.stream()
                    .max(Comparator.comparing(Application::getCreatedAt))
                    .orElseThrow();
        }

        Long docTypeId = switch (typeCode) {
            case "CCCD" -> 1L;
            case "TRANSCRIPT" -> 2L;
            case "CERTIFICATE" -> 3L;
            case "PHOTO" -> 5L;
            default -> 4L;
        };

        jdbcTemplate.update("DELETE FROM application_documents WHERE application_id = ? AND document_type_id = ?",
                app.getId(), docTypeId);
        saveAppDoc(app.getId(), docTypeId, file, userId);

        return Map.of("message", "Upload tài liệu thành công", "typeCode", typeCode);
    }
}
