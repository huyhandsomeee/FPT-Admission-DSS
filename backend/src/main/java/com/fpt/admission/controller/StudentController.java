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
    private final com.fpt.admission.repository.AdmissionPreferenceConfirmationRepository admissionPreferenceConfirmationRepository;

    private Long getUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.extractUserId(token);
    }

    /**
     * Generate application code in format: {MAJOR_CODE}{COHORT}{SEQUENCE}
     * Example: SE260001 — SE (Software Engineering) + 26 (cohort 2026) + 0001 (sequential)
     */
    private String generateApplicationCode(String majorCode, int year) {
        String cohort = String.valueOf(year).substring(2);
        long count = applicationRepository.countByMajorCodeAndYear(majorCode, year);
        int seqNum = (int) count + 1;
        String code = majorCode + cohort + String.format("%04d", seqNum);
        while (applicationRepository.findByApplicationCode(code).isPresent()) {
            seqNum++;
            code = majorCode + cohort + String.format("%04d", seqNum);
        }
        return code;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestHeader("Authorization") String authHeader) {
        Long userId = getUserId(authHeader);
        var profile = studentProfileRepository.findByUserId(userId).orElse(null);

        Map<String, Object> data = new LinkedHashMap<>();
        if (profile != null) {
            var apps = applicationRepository.findByStudentProfileId(profile.getId());
            data.put("totalApplications", apps.size());
            data.put("applications", apps.stream().map(a -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", a.getId());
                m.put("code", a.getApplicationCode() != null ? a.getApplicationCode() : "");
                m.put("status", a.getStatus().name());
                m.put("majorName", a.getMajor().getName());
                m.put("majorCode", a.getMajor().getCode());
                m.put("campusName", a.getCampus().getName());
                m.put("chkConfirmEnrollment", a.getChkConfirmEnrollment());
                m.put("chkPayFee", a.getChkPayFee());
                m.put("chkDeclareInfo", a.getChkDeclareInfo());
                m.put("chkUploadCccd", a.getChkUploadCccd());
                m.put("chkUploadPhoto", a.getChkUploadPhoto());
                m.put("chkRegisterDorm", a.getChkRegisterDorm());
                m.put("chkPrintLetter", a.getChkPrintLetter());
                m.put("moetRegisteredAt", a.getMoetRegisteredAt());
                m.put("moetReleasedAt", a.getMoetReleasedAt());
                m.put("enrolledAt", a.getEnrolledAt());
                m.put("feePaidAt", a.getFeePaidAt());
                return m;
            }).toList());
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
        var result = apps.stream().map(a -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", a.getId());
            m.put("applicationCode", a.getApplicationCode() != null ? a.getApplicationCode() : "");
            m.put("status", a.getStatus().name());
            m.put("majorName", a.getMajor().getName());
            m.put("campusName", a.getCampus().getName());
            m.put("methodName", a.getAdmissionMethod().getName());
            m.put("totalScore", a.getTotalScore() != null ? a.getTotalScore() : "");
            m.put("submittedAt", a.getSubmittedAt() != null ? a.getSubmittedAt().toString() : "");
            m.put("reviewedAt", a.getReviewedAt() != null ? a.getReviewedAt().toString() : "");
            m.put("moetRegisteredAt", a.getMoetRegisteredAt() != null ? a.getMoetRegisteredAt().toString() : "");
            m.put("moetReleasedAt", a.getMoetReleasedAt() != null ? a.getMoetReleasedAt().toString() : "");
            m.put("enrolledAt", a.getEnrolledAt() != null ? a.getEnrolledAt().toString() : "");
            m.put("feePaidAt", a.getFeePaidAt() != null ? a.getFeePaidAt().toString() : "");
            m.put("createdAt", a.getCreatedAt().toString());
            return m;
        }).toList();
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
            @RequestParam(value = "physicsScore", required = false) Double physicsScore,
            @RequestParam(value = "chemistryScore", required = false) Double chemistryScore,
            @RequestParam(value = "biologyScore", required = false) Double biologyScore,
            @RequestParam(value = "historyScore", required = false) Double historyScore,
            @RequestParam(value = "geographyScore", required = false) Double geographyScore,
            @RequestParam(value = "gdplScore", required = false) Double gdplScore,
            @RequestParam(value = "itScore", required = false) Double itScore,
            @RequestParam(value = "technologyScore", required = false) Double technologyScore,
            @RequestParam(value = "combinationCode", required = false) String combinationCode,
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
            @RequestParam(value = "gpa10File", required = false) MultipartFile gpa10File,
            @RequestParam(value = "gpa11File", required = false) MultipartFile gpa11File,
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
        ab.setPhysicsScore(physicsScore != null ? BigDecimal.valueOf(physicsScore) : null);
        ab.setChemistryScore(chemistryScore != null ? BigDecimal.valueOf(chemistryScore) : null);
        ab.setBiologyScore(biologyScore != null ? BigDecimal.valueOf(biologyScore) : null);
        ab.setHistoryScore(historyScore != null ? BigDecimal.valueOf(historyScore) : null);
        ab.setGeographyScore(geographyScore != null ? BigDecimal.valueOf(geographyScore) : null);
        ab.setGdplScore(gdplScore != null ? BigDecimal.valueOf(gdplScore) : null);
        ab.setItScore(itScore != null ? BigDecimal.valueOf(itScore) : null);
        ab.setTechnologyScore(technologyScore != null ? BigDecimal.valueOf(technologyScore) : null);
        ab.setGpa10(BigDecimal.valueOf(gpa10));
        ab.setGpa11(BigDecimal.valueOf(gpa11));
        ab.setGpa12(BigDecimal.valueOf(gpa12));
        
        double calculatedTotalScore = calculateCombinationScore(combinationCode, mathScore, literatureScore, englishScore,
                physicsScore, chemistryScore, biologyScore, historyScore, geographyScore, gdplScore, itScore, technologyScore);
        ab.setTotalScore(BigDecimal.valueOf(calculatedTotalScore));
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

        String code = generateApplicationCode(major.getCode(), year.getYear());

        profile.setStudentCode(code);
        studentProfileRepository.save(profile);

        java.math.BigDecimal appTotalScore = method.getCode().equals("HOC_BA")
            ? BigDecimal.valueOf(gpa10).add(BigDecimal.valueOf(gpa11)).add(BigDecimal.valueOf(gpa12))
            : ab.getTotalScore();

        var app = Application.builder()
            .applicationCode(code)
            .studentProfile(profile)
            .admissionYear(year)
            .campus(campus)
            .major(major)
            .admissionMethod(method)
            .totalScore(appTotalScore)
            .combinationCode(combinationCode)
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
            if (gpa10File != null && !gpa10File.isEmpty()) {
                saveAppDoc(app.getId(), 2L, gpa10File, userId);
            }
            if (gpa11File != null && !gpa11File.isEmpty()) {
                saveAppDoc(app.getId(), 2L, gpa11File, userId);
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
            m.put("majorCode", a.getMajor().getCode());
            m.put("campusName", a.getCampus().getName());
            m.put("methodName", a.getAdmissionMethod().getName());
            m.put("totalScore", a.getTotalScore());
            m.put("rejectionReason", a.getRejectionReason());
            m.put("officerNotes", a.getOfficerNotes());
            m.put("submittedAt", a.getSubmittedAt());
            m.put("reviewedAt", a.getReviewedAt());
            m.put("moetRegisteredAt", a.getMoetRegisteredAt());
            m.put("moetReleasedAt", a.getMoetReleasedAt());
            m.put("enrolledAt", a.getEnrolledAt());
            m.put("feePaidAt", a.getFeePaidAt());
            m.put("chkConfirmEnrollment", a.getChkConfirmEnrollment());
            m.put("chkPayFee", a.getChkPayFee());
            m.put("chkDeclareInfo", a.getChkDeclareInfo());
            m.put("chkUploadCccd", a.getChkUploadCccd());
            m.put("chkUploadPhoto", a.getChkUploadPhoto());
            m.put("chkRegisterDorm", a.getChkRegisterDorm());
            m.put("chkPrintLetter", a.getChkPrintLetter());
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

            String code = generateApplicationCode(major.getCode(), year.getYear());
            profile.setStudentCode(code);
            studentProfileRepository.save(profile);

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

    @org.springframework.transaction.annotation.Transactional
    @PostMapping("/applications/{id}/confirm-moet")
    public ResponseEntity<?> confirmMoet(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserId(authHeader);
        return applicationRepository.findById(id).map(app -> {
            if (!app.getStudentProfile().getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("message", "Bạn không có quyền thao tác trên hồ sơ này"));
            }
            if (app.getStatus() != ApplicationStatus.APPROVED) {
                return ResponseEntity.badRequest().body(Map.of("message", "Hồ sơ phải ở trạng thái Đủ điều kiện mới có thể xác nhận nguyện vọng"));
            }
            app.setStatus(ApplicationStatus.REGISTERED_MOET);
            app.setMoetRegisteredAt(java.time.LocalDateTime.now());
            applicationRepository.save(app);

            // Save preference confirmation details
            int preferenceOrder = body.get("preferenceOrder") != null ? Integer.parseInt(body.get("preferenceOrder").toString()) : 1;
            String majorCode = body.get("majorCode") != null ? body.get("majorCode").toString() : app.getMajor().getCode();
            String majorName = body.get("majorName") != null ? body.get("majorName").toString() : app.getMajor().getName();
            String evidenceImage = body.get("evidenceImage") != null ? body.get("evidenceImage").toString() : null;
            String note = body.get("note") != null ? body.get("note").toString() : "";

            var conf = admissionPreferenceConfirmationRepository.findByApplicationId(app.getId())
                    .orElse(new com.fpt.admission.entity.AdmissionPreferenceConfirmation());
            conf.setApplication(app);
            conf.setStudentId(app.getStudentProfile().getUser().getId());
            conf.setConfirmationDate(java.time.LocalDateTime.now());
            conf.setPreferenceOrder(preferenceOrder);
            conf.setMajorCode(majorCode);
            conf.setMajorName(majorName);
            conf.setEvidenceImage(evidenceImage);
            conf.setNote(note);
            conf.setStatus("CONFIRMED");
            admissionPreferenceConfirmationRepository.save(conf);

            // Create notification
            Notification studentNotif = Notification.builder()
                .user(app.getStudentProfile().getUser())
                .title("Đăng ký nguyện vọng thành công")
                .message("Hệ thống ghi nhận bạn đã đăng ký nguyện vọng Đại học FPT trên cổng Bộ GD&ĐT (Nguyện vọng " + preferenceOrder + ", Ngành " + majorName + "). Vui lòng chờ kết quả lọc ảo chính thức.")
                .type(com.fpt.admission.entity.enums.NotificationType.RESULT)
                .relatedEntityType("APPLICATION")
                .relatedEntityId(app.getId())
                .isRead(false)
                .createdAt(java.time.LocalDateTime.now())
                .build();
            notificationRepository.save(studentNotif);

            // Mock automatic alerts:
            System.out.println("LOG [EMAIL ALERT]: Sent email to " + app.getStudentProfile().getUser().getEmail() + " confirming MOET registration.");
            System.out.println("LOG [SMS ALERT]: Sent SMS to " + app.getStudentProfile().getUser().getPhone() + " confirming registration.");

            return ResponseEntity.ok(Map.of("message", "Xác nhận đăng ký nguyện vọng Bộ thành công", "status", app.getStatus().name()));
        }).orElse(ResponseEntity.notFound().build());
    }

    @org.springframework.transaction.annotation.Transactional
    @PutMapping("/applications/{id}/checklist")
    public ResponseEntity<?> updateChecklist(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> body,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserId(authHeader);
        return applicationRepository.findById(id).map(app -> {
            if (!app.getStudentProfile().getUser().getId().equals(userId)) {
                return ResponseEntity.status(403).body(Map.of("message", "Bạn không có quyền thao tác trên hồ sơ này"));
            }

            boolean prevConfirm = Boolean.TRUE.equals(app.getChkConfirmEnrollment());
            boolean prevPay = Boolean.TRUE.equals(app.getChkPayFee());

            if (body.containsKey("chkConfirmEnrollment")) app.setChkConfirmEnrollment(body.get("chkConfirmEnrollment"));
            if (body.containsKey("chkPayFee")) app.setChkPayFee(body.get("chkPayFee"));
            if (body.containsKey("chkDeclareInfo")) app.setChkDeclareInfo(body.get("chkDeclareInfo"));
            if (body.containsKey("chkUploadCccd")) app.setChkUploadCccd(body.get("chkUploadCccd"));
            if (body.containsKey("chkUploadPhoto")) app.setChkUploadPhoto(body.get("chkUploadPhoto"));
            if (body.containsKey("chkRegisterDorm")) app.setChkRegisterDorm(body.get("chkRegisterDorm"));
            if (body.containsKey("chkPrintLetter")) app.setChkPrintLetter(body.get("chkPrintLetter"));

            // Check triggers
            if (Boolean.TRUE.equals(app.getChkConfirmEnrollment()) && !prevConfirm) {
                app.setEnrolledAt(java.time.LocalDateTime.now());
                if (app.getStatus() == ApplicationStatus.ACCEPTED_MOET) {
                    app.setStatus(ApplicationStatus.ENROLLED);
                    
                    // Create notification
                    Notification studentNotif = Notification.builder()
                        .user(app.getStudentProfile().getUser())
                        .title("Xác nhận nhập học thành công")
                        .message("Bạn đã hoàn tất xác nhận nhập học trực tuyến vào Đại học FPT. Vui lòng hoàn thành các thủ tục học phí còn lại để chính thức trở thành sinh viên.")
                        .type(com.fpt.admission.entity.enums.NotificationType.RESULT)
                        .relatedEntityType("APPLICATION")
                        .relatedEntityId(app.getId())
                        .isRead(false)
                        .createdAt(java.time.LocalDateTime.now())
                        .build();
                    notificationRepository.save(studentNotif);

                    // Mock SMS
                    System.out.println("LOG [SMS ALERT]: Sent SMS to " + app.getStudentProfile().getUser().getPhone() + " for admitting application.");
                }
            }

            if (Boolean.TRUE.equals(app.getChkPayFee()) && !prevPay) {
                app.setFeePaidAt(java.time.LocalDateTime.now());
                // Create notification
                Notification studentNotif = Notification.builder()
                    .user(app.getStudentProfile().getUser())
                    .title("Học phí đã được xác nhận")
                    .message("Chúc mừng! Đại học FPT đã xác nhận nhận đủ học phí nhập học của bạn. Bạn đã chính thức trở thành tân sinh viên Đại học FPT.")
                    .type(com.fpt.admission.entity.enums.NotificationType.RESULT)
                    .relatedEntityType("APPLICATION")
                    .relatedEntityId(app.getId())
                    .isRead(false)
                    .createdAt(java.time.LocalDateTime.now())
                    .build();
                notificationRepository.save(studentNotif);

                // Mock SMS & Email
                System.out.println("LOG [EMAIL ALERT]: Sent email to " + app.getStudentProfile().getUser().getEmail() + " for successful fee payment.");
                System.out.println("LOG [SMS ALERT]: Sent SMS to " + app.getStudentProfile().getUser().getPhone() + " for successful fee payment.");
            }

            applicationRepository.save(app);

            // Compute progress
            int checkedCount = 0;
            if (Boolean.TRUE.equals(app.getChkConfirmEnrollment())) checkedCount++;
            if (Boolean.TRUE.equals(app.getChkPayFee())) checkedCount++;
            if (Boolean.TRUE.equals(app.getChkDeclareInfo())) checkedCount++;
            if (Boolean.TRUE.equals(app.getChkUploadCccd())) checkedCount++;
            if (Boolean.TRUE.equals(app.getChkUploadPhoto())) checkedCount++;
            if (Boolean.TRUE.equals(app.getChkRegisterDorm())) checkedCount++;
            if (Boolean.TRUE.equals(app.getChkPrintLetter())) checkedCount++;
            int progress = (int) Math.round((double) checkedCount / 7 * 100);

            return ResponseEntity.ok(Map.of(
                "message", "Cập nhật tiến trình thủ tục nhập học thành công", 
                "progress", progress,
                "status", app.getStatus().name(),
                "application", toDetailMap(app)
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toDetailMap(Application app) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", app.getId());
        m.put("status", app.getStatus().name());
        m.put("chkConfirmEnrollment", app.getChkConfirmEnrollment());
        m.put("chkPayFee", app.getChkPayFee());
        m.put("chkDeclareInfo", app.getChkDeclareInfo());
        m.put("chkUploadCccd", app.getChkUploadCccd());
        m.put("chkUploadPhoto", app.getChkUploadPhoto());
        m.put("chkRegisterDorm", app.getChkRegisterDorm());
        m.put("chkPrintLetter", app.getChkPrintLetter());
        m.put("moetRegisteredAt", app.getMoetRegisteredAt());
        m.put("moetReleasedAt", app.getMoetReleasedAt());
        m.put("enrolledAt", app.getEnrolledAt());
        m.put("feePaidAt", app.getFeePaidAt());
        return m;
    }

    private double calculateCombinationScore(String combinationCode, double math, double literature, double english,
            Double physics, Double chemistry, Double biology, Double history, Double geography, Double gdpl, Double it, Double tech) {
        if (combinationCode == null || combinationCode.trim().isEmpty()) {
            return math + literature + english; // Default D01
        }
        
        double p = physics != null ? physics : 0.0;
        double c = chemistry != null ? chemistry : 0.0;
        double b = biology != null ? biology : 0.0;
        double h = history != null ? history : 0.0;
        double g = geography != null ? geography : 0.0;
        double l = gdpl != null ? gdpl : 0.0;
        double i = it != null ? it : 0.0;
        double t = tech != null ? tech : 0.0;
        
        switch (combinationCode.trim().toUpperCase()) {
            case "A00": return math + p + c;
            case "A01": return math + p + english;
            case "B00": return math + c + b;
            case "C00": return literature + h + g;
            case "F01": return (math + literature + i + t) * 3.0 / 4.0;
            case "F02": return (math + literature + l + h) * 3.0 / 4.0;
            case "F03": return (math + literature + p + i) * 3.0 / 4.0;
            case "F05": return (math + literature + english + l) * 3.0 / 4.0;
            case "D01":
            default:
                return math + literature + english;
        }
    }
}
