package com.fpt.admission.controller;

import com.fpt.admission.entity.*;
import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.repository.*;
import com.fpt.admission.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
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
    private final ProvinceRepository provinceRepository;
    private final AcademicBackgroundRepository academicBackgroundRepository;
    private final HighSchoolRepository highSchoolRepository;
    private final JdbcTemplate jdbcTemplate;

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
            data.put("allowNewApplication", profile.getAllowNewApplication() != null ? profile.getAllowNewApplication() : false);
            data.put("newApplicationRequest", profile.getNewApplicationRequest() != null ? profile.getNewApplicationRequest() : "NONE");
        } else {
            data.put("totalApplications", 0);
            data.put("applications", List.of());
            data.put("hasProfile", false);
            data.put("allowNewApplication", false);
            data.put("newApplicationRequest", "NONE");
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

    @PostMapping(value = "/applications", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createApplication(
            @RequestParam("fullName") String fullName,
            @RequestParam("dob") String dob,
            @RequestParam("gender") String gender,
            @RequestParam("phone") String phone,
            @RequestParam("cccd") String cccd,
            @RequestParam(value = "permanentAddress", required = false, defaultValue = "") String permanentAddress,
            @RequestParam(value = "provinceId", required = false) Long provinceId,
            @RequestParam(value = "parentName", required = false) String parentName,
            @RequestParam(value = "parentPhone", required = false) String parentPhone,
            @RequestParam("schoolName") String schoolName,
            @RequestParam("graduationYear") int graduationYear,
            @RequestParam(value = "mathScore", required = false, defaultValue = "0") double mathScore,
            @RequestParam(value = "literatureScore", required = false, defaultValue = "0") double literatureScore,
            @RequestParam(value = "englishScore", required = false, defaultValue = "0") double englishScore,
            @RequestParam(value = "gpa10", required = false, defaultValue = "0") double gpa10,
            @RequestParam(value = "gpa11", required = false, defaultValue = "0") double gpa11,
            @RequestParam(value = "gpa12", required = false, defaultValue = "0") double gpa12,
            @RequestParam("campusId") Long campusId,
            @RequestParam("majorId") Long majorId,
            @RequestParam("methodId") Long methodId,
            @RequestParam(value = "cccdFile", required = false) MultipartFile cccdFile,
            @RequestParam(value = "cccdFrontFile", required = false) MultipartFile cccdFrontFile,
            @RequestParam(value = "cccdBackFile", required = false) MultipartFile cccdBackFile,
            @RequestParam(value = "hocBaFile", required = false) MultipartFile hocBaFile,
            @RequestParam(value = "bangTNFile", required = false) MultipartFile bangTNFile,
            @RequestParam(value = "anhTheFile", required = false) MultipartFile anhTheFile,
            @RequestParam(value = "giayKhaiSinhFile", required = false) MultipartFile giayKhaiSinhFile,
            @RequestParam(value = "chungChiFile", required = false) MultipartFile chungChiFile,
            @RequestParam(value = "hoKhauFile", required = false) MultipartFile hoKhauFile,
            @RequestParam(value = "cccdIssueDate", required = false) String cccdIssueDate,
            @RequestParam(value = "cccdIssuePlace", required = false) String cccdIssuePlace,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "academicAchievement", required = false) String academicAchievement,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = getUserId(authHeader);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Update User Email if changed and unique
        if (email != null && !email.trim().isEmpty() && !email.trim().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(email.trim())) {
                throw new RuntimeException("Email đã được sử dụng bởi tài khoản khác");
            }
            user.setEmail(email.trim());
            userRepository.save(user);
        }

        // 1. Save / Update Student Profile
        StudentProfile profile = studentProfileRepository.findByUserId(userId).orElse(null);
        if (profile == null) {
            profile = new StudentProfile();
            profile.setUser(user);
            String studentCode = "TS2026" + String.format("%04d", (long)(Math.random() * 9999));
            profile.setStudentCode(studentCode);
        }
        profile.setDob(LocalDate.parse(dob));
        profile.setGender(gender);
        profile.setPermanentAddress(permanentAddress);
        profile.setCccdNumber(cccd);
        profile.setParentName(parentName);
        profile.setParentPhone(parentPhone);
        if (cccdIssueDate != null && !cccdIssueDate.trim().isEmpty()) {
            profile.setCccdIssueDate(LocalDate.parse(cccdIssueDate.trim()));
        }
        if (cccdIssuePlace != null && !cccdIssuePlace.trim().isEmpty()) {
            profile.setCccdIssuePlace(cccdIssuePlace.trim());
        }
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
        if (academicAchievement != null && !academicAchievement.trim().isEmpty()) {
            ab.setAcademicAchievement(academicAchievement.trim());
        }
        academicBackgroundRepository.save(ab);

        // 3. Create Application
        var campus = campusRepository.findById(campusId).orElseThrow();
        var major = majorRepository.findById(majorId).orElseThrow();
        var method = admissionMethodRepository.findById(methodId).orElseThrow();
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
            .totalScore(ab.getTotalScore())
            .status(ApplicationStatus.SUBMITTED)
            .submittedAt(LocalDateTime.now())
            .build();

        applicationRepository.save(app);

        // 4. Save and record Documents
        try {
            if (cccdFile != null && !cccdFile.isEmpty()) {
                saveAppDoc(app.getId(), 1L, cccdFile, userId);
            }
            if (cccdFrontFile != null && !cccdFrontFile.isEmpty()) {
                saveAppDoc(app.getId(), 1L, cccdFrontFile, userId);
            }
            if (cccdBackFile != null && !cccdBackFile.isEmpty()) {
                saveAppDoc(app.getId(), 1L, cccdBackFile, userId);
            }
            if (hocBaFile != null && !hocBaFile.isEmpty()) {
                saveAppDoc(app.getId(), 2L, hocBaFile, userId);
            }
            if (bangTNFile != null && !bangTNFile.isEmpty()) {
                saveAppDoc(app.getId(), 3L, bangTNFile, userId);
            }
            if (anhTheFile != null && !anhTheFile.isEmpty()) {
                saveAppDoc(app.getId(), 5L, anhTheFile, userId);
            }
            if (giayKhaiSinhFile != null && !giayKhaiSinhFile.isEmpty()) {
                saveAppDoc(app.getId(), 6L, giayKhaiSinhFile, userId);
            }
            if (chungChiFile != null && !chungChiFile.isEmpty()) {
                saveAppDoc(app.getId(), 4L, chungChiFile, userId);
            }
            if (hoKhauFile != null && !hoKhauFile.isEmpty()) {
                saveAppDoc(app.getId(), 7L, hoKhauFile, userId);
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu file tài liệu: " + e.getMessage());
        }

        // Reset new application permission & request
        profile.setAllowNewApplication(false);
        profile.setNewApplicationRequest("NONE");
        studentProfileRepository.save(profile);

        // Create student notification
        Notification studentNotif = Notification.builder()
            .user(user)
            .title("Nộp hồ sơ thành công")
            .message("Bạn đã nộp hồ sơ xét tuyển thành công (Mã HS: " + code + "). Hồ sơ đang được chờ xét duyệt.")
            .type(com.fpt.admission.entity.enums.NotificationType.ADMISSION_UPDATE)
            .isRead(false)
            .createdAt(LocalDateTime.now())
            .build();
        notificationRepository.save(studentNotif);

        return ResponseEntity.ok(Map.of("message", "Nộp hồ sơ thành công", "applicationCode", code, "id", app.getId()));
    }

    private void saveAppDoc(Long appId, Long docTypeId, MultipartFile file, Long userId) throws Exception {
        if (file == null || file.isEmpty()) return;
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = userId + "_" + docTypeId + "_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;
        Path uploadPath = Paths.get("./uploads");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String relativePath = "/api/public/documents/" + fileName;

        jdbcTemplate.update(
            "INSERT INTO application_documents (application_id, document_type_id, file_name, file_path, file_size, mime_type, status) " +
            "VALUES (?, ?, ?, ?, ?, ?, 'PENDING')",
            appId, docTypeId, originalFilename, relativePath, file.getSize(), file.getContentType()
        );
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

        return ResponseEntity.ok(Map.of(
            "content", contentList,
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

    @GetMapping("/config/provinces")
    public ResponseEntity<?> getProvinces() {
        return ResponseEntity.ok(provinceRepository.findAllByOrderByName());
    }

    @GetMapping("/config/schools")
    public ResponseEntity<?> getSchoolsByProvince(@RequestParam Long provinceId) {
        var schools = highSchoolRepository.findByProvinceIdOrderByName(provinceId);
        var result = schools.stream().map(s -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", s.getId());
            m.put("name", s.getName());
            m.put("schoolType", s.getSchoolType());
            return m;
        }).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<?> getApplicationDetails(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserId(authHeader);
        var profile = studentProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Hồ sơ sinh viên chưa được tạo"));
        
        return applicationRepository.findById(id).map(a -> {
            if (!a.getStudentProfile().getId().equals(profile.getId())) {
                return ResponseEntity.status(403).body(Map.of("message", "Bạn không có quyền xem hồ sơ này"));
            }
            
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", a.getId());
            m.put("applicationCode", a.getApplicationCode());
            m.put("status", a.getStatus().name());
            m.put("majorName", a.getMajor().getName());
            m.put("campusName", a.getCampus().getName());
            m.put("methodName", a.getAdmissionMethod().getName());
            m.put("totalScore", a.getTotalScore());
            m.put("rejectionReason", a.getRejectionReason());
            m.put("officerNotes", a.getOfficerNotes());
            m.put("submittedAt", a.getSubmittedAt());
            m.put("createdAt", a.getCreatedAt());
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
                if (!academicList.isEmpty()) {
                    m.put("academicBackground", academicList.get(0));
                } else {
                    m.put("academicBackground", null);
                }
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
                    a.getId()
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
            
            return ResponseEntity.ok(m);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/applications/request-new")
    public ResponseEntity<?> requestNewApplication(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserId(authHeader);
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Hồ sơ sinh viên chưa được tạo"));

        profile.setNewApplicationRequest("PENDING");
        studentProfileRepository.save(profile);

        // Notify officers
        List<User> officers = userRepository.findAll().stream()
            .filter(u -> u.getRole() == com.fpt.admission.entity.enums.UserRole.ADMISSION_OFFICER 
                      || u.getRole() == com.fpt.admission.entity.enums.UserRole.ADMISSION_MANAGER)
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

        return ResponseEntity.ok(Map.of("message", "Gửi yêu cầu tạo hồ sơ mới thành công"));
    }

    @GetMapping("/documents")
    public ResponseEntity<?> getUploadedDocuments(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserId(authHeader);
        var profile = studentProfileRepository.findByUserId(userId).orElse(null);
        if (profile == null) return ResponseEntity.ok(List.of());

        // Get the latest application of the student
        var apps = applicationRepository.findByStudentProfileId(profile.getId());
        if (apps.isEmpty()) return ResponseEntity.ok(List.of());
        
        var latestApp = apps.stream()
            .max(Comparator.comparing(Application::getCreatedAt))
            .orElse(null);
            
        if (latestApp == null) return ResponseEntity.ok(List.of());

        try {
            List<Map<String, Object>> docs = jdbcTemplate.queryForList(
                "SELECT ad.file_name as name, dt.name as descName, dt.code as typeCode, dt.id as typeId, ad.status, ad.file_path as filePath, ad.file_size as size " +
                "FROM application_documents ad " +
                "JOIN document_types dt ON ad.document_type_id = dt.id " +
                "WHERE ad.application_id = ?",
                latestApp.getId()
            );
            List<Map<String, Object>> formattedDocs = docs.stream().map(doc -> {
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
            return ResponseEntity.ok(formattedDocs);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @PostMapping(value = "/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadOrReplaceDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("typeCode") String typeCode,
            @RequestHeader("Authorization") String authHeader) {
        
        Long userId = getUserId(authHeader);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        StudentProfile profile = studentProfileRepository.findByUserId(userId).orElse(null);
        if (profile == null) {
            profile = new StudentProfile();
            profile.setUser(user);
            String studentCode = "TS2026" + String.format("%04d", (long)(Math.random() * 9999));
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

            String code = "APP" + year.getYear() + String.format("%06d", (long)(Math.random() * 999999));
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

        try {
            jdbcTemplate.update("DELETE FROM application_documents WHERE application_id = ? AND document_type_id = ?", app.getId(), docTypeId);
            saveAppDoc(app.getId(), docTypeId, file, userId);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu file: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "Upload tài liệu thành công", "typeCode", typeCode));
    }

    @PostMapping("/notifications/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        return notificationRepository.findById(id).map(notif -> {
            notif.setIsRead(true);
            notificationRepository.save(notif);
            return ResponseEntity.ok(Map.of("message", "Đã đọc thông báo"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @org.springframework.transaction.annotation.Transactional
    @PostMapping("/notifications/read-all")
    public ResponseEntity<?> markAllAsRead(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserId(authHeader);
        notificationRepository.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "Đã đọc tất cả thông báo"));
    }
}
