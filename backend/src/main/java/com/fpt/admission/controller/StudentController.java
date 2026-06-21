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

    @PostMapping(value = "/applications", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createApplication(
            @RequestParam("fullName") String fullName,
            @RequestParam("dob") String dob,
            @RequestParam("gender") String gender,
            @RequestParam("phone") String phone,
            @RequestParam("cccd") String cccd,
            @RequestParam("permanentAddress") String permanentAddress,
            @RequestParam("provinceId") Long provinceId,
            @RequestParam(value = "parentName", required = false) String parentName,
            @RequestParam(value = "parentPhone", required = false) String parentPhone,
            @RequestParam("schoolName") String schoolName,
            @RequestParam("graduationYear") int graduationYear,
            @RequestParam("mathScore") double mathScore,
            @RequestParam("literatureScore") double literatureScore,
            @RequestParam("englishScore") double englishScore,
            @RequestParam("gpa10") double gpa10,
            @RequestParam("gpa11") double gpa11,
            @RequestParam("gpa12") double gpa12,
            @RequestParam("campusId") Long campusId,
            @RequestParam("majorId") Long majorId,
            @RequestParam("methodId") Long methodId,
            @RequestParam("cccdFile") MultipartFile cccdFile,
            @RequestParam("hocBaFile") MultipartFile hocBaFile,
            @RequestParam("bangTNFile") MultipartFile bangTNFile,
            @RequestParam("anhTheFile") MultipartFile anhTheFile,
            @RequestParam("giayKhaiSinhFile") MultipartFile giayKhaiSinhFile,
            @RequestParam(value = "chungChiFile", required = false) MultipartFile chungChiFile,
            @RequestParam(value = "hoKhauFile", required = false) MultipartFile hoKhauFile,
            @RequestHeader("Authorization") String authHeader) {

        Long userId = getUserId(authHeader);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

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
            saveAppDoc(app.getId(), 1L, cccdFile, userId);
            saveAppDoc(app.getId(), 2L, hocBaFile, userId);
            saveAppDoc(app.getId(), 3L, bangTNFile, userId);
            saveAppDoc(app.getId(), 5L, anhTheFile, userId);
            saveAppDoc(app.getId(), 6L, giayKhaiSinhFile, userId);
            if (chungChiFile != null && !chungChiFile.isEmpty()) {
                saveAppDoc(app.getId(), 4L, chungChiFile, userId);
            }
            if (hoKhauFile != null && !hoKhauFile.isEmpty()) {
                saveAppDoc(app.getId(), 7L, hoKhauFile, userId);
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi lưu file tài liệu: " + e.getMessage());
        }

        return ResponseEntity.ok(Map.of("message", "Nộp hồ sơ thành công", "applicationCode", code, "id", app.getId()));
    }

    private void saveAppDoc(Long appId, Long docTypeId, MultipartFile file, Long userId) throws Exception {
        if (file == null || file.isEmpty()) return;
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = userId + "_" + docTypeId + "_" + System.currentTimeMillis() + extension;
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

    @GetMapping("/config/provinces")
    public ResponseEntity<?> getProvinces() {
        return ResponseEntity.ok(provinceRepository.findAllByOrderByName());
    }
}
