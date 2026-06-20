package com.fpt.admission.controller;

import com.fpt.admission.entity.Application;
import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.repository.*;
import com.fpt.admission.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.*;

@RestController
@RequestMapping("/api/officer")
@RequiredArgsConstructor
public class OfficerController {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final JdbcTemplate jdbcTemplate;
    private final AdmissionYearRepository admissionYearRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
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
        return ResponseEntity.ok(data);
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

        Page<Application> apps = applicationRepository.findWithFilters(
            appStatus, campusId, majorId, methodId, search,
            PageRequest.of(page, size, Sort.by("createdAt").descending())
        );

        return ResponseEntity.ok(Map.of(
            "content", apps.getContent().stream().map(this::toSummary).toList(),
            "totalElements", apps.getTotalElements(),
            "totalPages", apps.getTotalPages(),
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
                applicationRepository.save(app);
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

        // Fetch documents
        try {
            List<Map<String, Object>> docs = jdbcTemplate.queryForList(
                "SELECT ad.file_name as name, dt.name as descName, ad.status " +
                "FROM application_documents ad " +
                "JOIN document_types dt ON ad.document_type_id = dt.id " +
                "WHERE ad.application_id = ?",
                a.getId()
            );
            List<Map<String, Object>> formattedDocs = docs.stream().map(doc -> {
                Map<String, Object> docMap = new LinkedHashMap<>();
                docMap.put("name", doc.get("name"));
                docMap.put("desc", doc.get("descName"));
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
