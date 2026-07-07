package com.fpt.admission.service.impl;

import com.fpt.admission.entity.*;
import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.entity.enums.NotificationType;
import com.fpt.admission.repository.*;
import com.fpt.admission.service.PipelineService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class PipelineServiceImpl implements PipelineService {

    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    
    private final ValidationResultRepository validationResultRepository;
    private final ReviewRuleRepository reviewRuleRepository;
    private final PriorityScoreRepository priorityScoreRepository;
    private final AISummaryRepository aiSummaryRepository;
    
    private final JdbcTemplate jdbcTemplate;

    private static final Pattern CCCD_PATTERN = Pattern.compile("^\\d{9}$|^\\d{12}$");
    private static final List<String> REQUIRED_DOC_CODES = List.of("CCCD", "HOC_BA", "BANG_TN", "ANH_THE", "GK_THPT");
    private static final List<String> ALLOWED_EXTENSIONS = List.of("pdf", "png", "jpg", "jpeg", "gif");

    @PostConstruct
    @Override
    public void seedDefaultRules() {
        if (reviewRuleRepository.count() == 0) {
            log.info("Seeding default review rules into database...");
            
            reviewRuleRepository.save(ReviewRule.builder()
                    .name("Reject Recommended")
                    .description("Auto reject if candidate average GPA is below 5.0")
                    .minGpa(5.0)
                    .requireCompleteDocs(false)
                    .allowDuplicates(true)
                    .action("REJECT_RECOMMENDED")
                    .isActive(true)
                    .priority(1)
                    .build());

            reviewRuleRepository.save(ReviewRule.builder()
                    .name("Need More Document")
                    .description("Requires supplementary documents if any mandatory upload is missing")
                    .minGpa(0.0)
                    .requireCompleteDocs(true)
                    .allowDuplicates(true)
                    .action("NEED_MORE_DOCUMENT")
                    .isActive(true)
                    .priority(2)
                    .build());

            reviewRuleRepository.save(ReviewRule.builder()
                    .name("Manual Review Exceptions")
                    .description("Requires manual officer review if duplicate records or invalid formats exist")
                    .minGpa(0.0)
                    .requireCompleteDocs(false)
                    .allowDuplicates(false) // will trigger if duplicates are present
                    .action("MANUAL_REVIEW")
                    .isActive(true)
                    .priority(3)
                    .build());

            reviewRuleRepository.save(ReviewRule.builder()
                    .name("Ready For Approval")
                    .description("Highly qualified application: complete documents, GPA >= 8.0, and zero exceptions")
                    .minGpa(8.0)
                    .requireCompleteDocs(true)
                    .allowDuplicates(false)
                    .action("READY_FOR_APPROVAL")
                    .isActive(true)
                    .priority(4)
                    .build());
        }
    }

    @Override
    @Transactional
    public ValidationResult validateApplication(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        StudentProfile profile = app.getStudentProfile();
        User studentUser = profile.getUser();
        AcademicBackground ab = profile.getAcademicBackground();

        // 1. Check required documents uploaded
        List<Map<String, Object>> docs = getUploadedDocuments(applicationId);
        Set<String> uploadedCodes = new HashSet<>();
        boolean invalidFormatFound = false;
        List<String> invalidFormatFiles = new ArrayList<>();

        for (Map<String, Object> doc : docs) {
            String code = (String) doc.get("code");
            String fileName = (String) doc.get("file_name");
            if (code != null) {
                uploadedCodes.add(code);
            }
            if (fileName != null) {
                String ext = getFileExtension(fileName).toLowerCase();
                if (!ALLOWED_EXTENSIONS.contains(ext)) {
                    invalidFormatFound = true;
                    invalidFormatFiles.add(fileName + " (." + ext + ")");
                }
            }
        }

        List<String> requiredCodes = new java.util.ArrayList<>(List.of("CCCD", "BANG_TN"));
        if (ab != null && (ab.getIeltsScore() != null || ab.getToeflScore() != null)) {
            requiredCodes.add("CHUNG_CHI");
        }

        List<String> missingDocs = new ArrayList<>();
        for (String reqCode : requiredCodes) {
            if (!uploadedCodes.contains(reqCode)) {
                missingDocs.add(reqCode);
            }
        }
        boolean requiredDocsOk = missingDocs.isEmpty();

        // 2. CCCD format
        String cccd = profile.getCccdNumber();
        boolean cccdFormatOk = cccd != null && CCCD_PATTERN.matcher(cccd.trim()).matches();

        // 3. GPA validity
        boolean gpaValid = true;
        if (ab != null) {
            BigDecimal g10 = ab.getGpa10();
            BigDecimal g11 = ab.getGpa11();
            BigDecimal g12 = ab.getGpa12();
            if (g10 == null || g10.doubleValue() < 0.0 || g10.doubleValue() > 10.0) gpaValid = false;
            if (g11 == null || g11.doubleValue() < 0.0 || g11.doubleValue() > 10.0) gpaValid = false;
            if (g12 == null || g12.doubleValue() < 0.0 || g12.doubleValue() > 10.0) gpaValid = false;
        } else {
            gpaValid = false;
        }

        // 4. IELTS/TOEIC expiration
        boolean certNotExpired = true;
        if (ab != null && (ab.getIeltsScore() != null || ab.getToeflScore() != null)) {
            LocalDate issueDate = ab.getCertIssueDate();
            if (issueDate != null) {
                if (issueDate.plusYears(2).isBefore(LocalDate.now())) {
                    certNotExpired = false;
                }
            } else {
                // If there's a score but no issue date, flag it as expired/warning for verification
                certNotExpired = false;
            }
        }

        // 5. Duplicate CCCD
        long duplicateCccdCount = 0;
        if (cccd != null && !cccd.trim().isEmpty()) {
            duplicateCccdCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM student_profiles WHERE cccd_number = ? AND id != ?",
                    Long.class, cccd.trim(), profile.getId()
            );
        }
        boolean noDuplicateCccd = (duplicateCccdCount == 0);

        // 6. Duplicate Email
        long duplicateEmailCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE email = ? AND id != ?",
                Long.class, studentUser.getEmail().trim(), studentUser.getId()
        );
        boolean noDuplicateEmail = (duplicateEmailCount == 0);

        // 7. Duplicate Phone
        long duplicatePhoneCount = 0;
        if (studentUser.getPhone() != null && !studentUser.getPhone().trim().isEmpty()) {
            duplicatePhoneCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM users WHERE phone = ? AND id != ?",
                    Long.class, studentUser.getPhone().trim(), studentUser.getId()
            );
        }
        boolean noDuplicatePhone = (duplicatePhoneCount == 0);

        // 8. Missing information
        List<String> missingInfo = new ArrayList<>();
        if (studentUser.getFullName() == null || studentUser.getFullName().trim().isEmpty()) missingInfo.add("fullName");
        if (profile.getDob() == null) missingInfo.add("dob");
        if (profile.getGender() == null) missingInfo.add("gender");
        if (profile.getEthnicity() == null || profile.getEthnicity().trim().isEmpty()) missingInfo.add("ethnicity");
        if (profile.getPermanentAddress() == null || profile.getPermanentAddress().trim().isEmpty()) missingInfo.add("permanentAddress");
        if (profile.getCccdNumber() == null || profile.getCccdNumber().trim().isEmpty()) missingInfo.add("cccdNumber");

        // Status determination
        String status = "COMPLETE";
        if (!requiredDocsOk || !cccdFormatOk || !gpaValid || !certNotExpired || !noDuplicateCccd || !noDuplicateEmail || !noDuplicatePhone || invalidFormatFound || !missingInfo.isEmpty()) {
            // Check if errors or warnings
            if (!noDuplicateCccd || !noDuplicateEmail || !noDuplicatePhone || !gpaValid || !cccdFormatOk) {
                status = "ERROR"; // Critical exceptions needing manual review
            } else {
                status = "WARNING"; // Minor issue like missing docs or warnings
            }
        }

        // Save result
        ValidationResult vr = validationResultRepository.findByApplicationId(applicationId)
                .orElse(new ValidationResult());
        
        vr.setApplication(app);
        vr.setStatus(status);
        vr.setRequiredDocsOk(requiredDocsOk);
        vr.setCccdFormatOk(cccdFormatOk);
        vr.setGpaValid(gpaValid);
        vr.setCertNotExpired(certNotExpired);
        vr.setNoDuplicateCccd(noDuplicateCccd);
        vr.setNoDuplicateEmail(noDuplicateEmail);
        vr.setNoDuplicatePhone(noDuplicatePhone);
        vr.setMissingInfoDetails(String.join(",", missingInfo.isEmpty() ? List.of(missingDocs.isEmpty() ? "" : "missingDocs:" + String.join(";", missingDocs)) : missingInfo));
        vr.setInvalidFormatDetails(String.join(",", invalidFormatFiles));
        vr.setCheckedAt(LocalDateTime.now());

        return validationResultRepository.save(vr);
    }

    @Override
    @Transactional
    public PriorityScore calculatePriorityScore(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        StudentProfile profile = app.getStudentProfile();
        AcademicBackground ab = profile.getAcademicBackground();
        ValidationResult vr = validationResultRepository.findByApplicationId(applicationId)
                .orElseGet(() -> validateApplication(applicationId));

        // 1. GPA Component (40%)
        double gpaWeight = 40.0;
        double gpaScore = 0.0;
        if (ab != null && ab.getGpa10() != null && ab.getGpa11() != null && ab.getGpa12() != null) {
            double avgGpa = (ab.getGpa10().doubleValue() + ab.getGpa11().doubleValue() + ab.getGpa12().doubleValue()) / 3.0;
            gpaScore = (avgGpa / 10.0) * 100.0;
        }
        double gpaComponent = (gpaScore * gpaWeight) / 100.0;

        // 2. English Certificate Component (20%)
        double engWeight = 20.0;
        double certScore = 0.0;
        if (ab != null) {
            double ieltsEquiv = 0.0;
            if (ab.getIeltsScore() != null) {
                // scale linear to 6.5
                ieltsEquiv = Math.min(100.0, (ab.getIeltsScore().doubleValue() / 6.5) * 100.0);
            }
            double toeflEquiv = 0.0;
            if (ab.getToeflScore() != null) {
                toeflEquiv = Math.min(100.0, (ab.getToeflScore().doubleValue() / 80.0) * 100.0);
            }
            double satEquiv = 0.0;
            if (ab.getSatScore() != null) {
                satEquiv = Math.min(100.0, (ab.getSatScore().doubleValue() / 1200.0) * 100.0);
            }
            certScore = Math.max(ieltsEquiv, Math.max(toeflEquiv, satEquiv));
        }
        double englishComponent = (certScore * engWeight) / 100.0;

        // 3. Complete Documents Component (20%)
        double docWeight = 20.0;
        List<Map<String, Object>> docs = getUploadedDocuments(applicationId);
        Set<String> uploadedCodes = new HashSet<>();
        for (Map<String, Object> d : docs) {
            String code = (String) d.get("code");
            if (code != null) uploadedCodes.add(code);
        }
        long uploadedReqCount = REQUIRED_DOC_CODES.stream().filter(uploadedCodes::contains).count();
        double docScore = (uploadedReqCount / 5.0) * 100.0;
        double documentComponent = (docScore * docWeight) / 100.0;

        // 4. Achievements Component (10%)
        double achWeight = 10.0;
        double achScore = (ab != null && ab.getAcademicAchievement() != null && !ab.getAcademicAchievement().trim().isEmpty()) ? 100.0 : 0.0;
        double achievementComponent = (achScore * achWeight) / 100.0;

        // 5. Application Date Component (10%)
        double dateWeight = 10.0;
        double dateScore = 50.0; // Default
        AdmissionYear year = app.getAdmissionYear();
        if (year != null && year.getStartDate() != null && year.getEndDate() != null && app.getSubmittedAt() != null) {
            long totalDays = ChronoUnit.DAYS.between(year.getStartDate(), year.getEndDate());
            long elapsedDays = ChronoUnit.DAYS.between(year.getStartDate(), app.getSubmittedAt().toLocalDate());
            if (totalDays > 0) {
                dateScore = Math.max(0.0, 100.0 * (1.0 - (double) elapsedDays / totalDays));
            }
        }
        double dateComponent = (dateScore * dateWeight) / 100.0;

        int finalScore = (int) Math.round(gpaComponent + englishComponent + documentComponent + achievementComponent + dateComponent);
        finalScore = Math.max(0, Math.min(100, finalScore));

        PriorityScore ps = priorityScoreRepository.findByApplicationId(applicationId)
                .orElse(new PriorityScore());
        
        ps.setApplication(app);
        ps.setScore(finalScore);
        ps.setGpaComponent(gpaComponent);
        ps.setEnglishComponent(englishComponent);
        ps.setDocumentComponent(documentComponent);
        ps.setAchievementComponent(achievementComponent);
        ps.setDateComponent(dateComponent);
        ps.setCalculatedAt(LocalDateTime.now());

        return priorityScoreRepository.save(ps);
    }

    @Override
    @Transactional
    public AISummary generateAISummary(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        StudentProfile profile = app.getStudentProfile();
        AcademicBackground ab = profile.getAcademicBackground();
        
        ValidationResult vr = validationResultRepository.findByApplicationId(applicationId)
                .orElseGet(() -> validateApplication(applicationId));
        
        PriorityScore ps = priorityScoreRepository.findByApplicationId(applicationId)
                .orElseGet(() -> calculatePriorityScore(applicationId));

        // Evaluate Rules to get recommendation
        List<ReviewRule> rules = reviewRuleRepository.findByIsActiveOrderByPriorityAsc(true);
        String recommendation = "MANUAL_REVIEW"; // Fallback
        
        double avgGpa = 0.0;
        if (ab != null && ab.getGpa10() != null && ab.getGpa11() != null && ab.getGpa12() != null) {
            avgGpa = (ab.getGpa10().doubleValue() + ab.getGpa11().doubleValue() + ab.getGpa12().doubleValue()) / 3.0;
        }

        boolean hasDuplicates = !vr.getNoDuplicateCccd() || !vr.getNoDuplicateEmail() || !vr.getNoDuplicatePhone();
        boolean hasExceptions = !vr.getCccdFormatOk() || !vr.getGpaValid() || !vr.getCertNotExpired() || hasDuplicates;

        for (ReviewRule rule : rules) {
            boolean matches = false;
            if ("REJECT_RECOMMENDED".equals(rule.getAction())) {
                matches = avgGpa < rule.getMinGpa();
            } else if ("NEED_MORE_DOCUMENT".equals(rule.getAction())) {
                matches = rule.getRequireCompleteDocs() && !vr.getRequiredDocsOk();
            } else if ("MANUAL_REVIEW".equals(rule.getAction())) {
                matches = (!rule.getAllowDuplicates() && hasDuplicates) || hasExceptions;
            } else if ("READY_FOR_APPROVAL".equals(rule.getAction())) {
                matches = vr.getRequiredDocsOk() && avgGpa >= rule.getMinGpa() && !hasDuplicates && !hasExceptions;
            }
            
            if (matches) {
                recommendation = rule.getAction();
                break;
            }
        }

        // Build bullet summary string
        StringBuilder sb = new StringBuilder();
        
        // 1. Documents
        if (vr.getRequiredDocsOk()) {
            sb.append("✔ Complete documents\n");
        } else {
            sb.append("✖ Missing documents: ");
            List<Map<String, Object>> docs = getUploadedDocuments(applicationId);
            Set<String> uploaded = new HashSet<>();
            for (Map<String, Object> d : docs) {
                if (d.get("code") != null) uploaded.add((String) d.get("code"));
            }
            List<String> requiredCodes = new java.util.ArrayList<>(List.of("CCCD", "BANG_TN"));
            if (ab != null && (ab.getIeltsScore() != null || ab.getToeflScore() != null)) {
                requiredCodes.add("CHUNG_CHI");
            }
            List<String> missing = new ArrayList<>();
            for (String code : requiredCodes) {
                if (!uploaded.contains(code)) missing.add(code);
            }
            sb.append(String.join(", ", missing)).append("\n");
        }

        // 2. GPA
        if (vr.getGpaValid() && ab != null) {
            sb.append(String.format("✔ GPA %.2f\n", avgGpa));
        } else {
            sb.append(String.format("✖ GPA %.2f (Low or invalid range)\n", avgGpa));
        }

        // 3. IELTS / Certificate
        if (ab != null && (ab.getIeltsScore() != null || ab.getToeflScore() != null || ab.getSatScore() != null)) {
            if (ab.getIeltsScore() != null) {
                sb.append(String.format("✔ IELTS %s\n", ab.getIeltsScore()));
            } else if (ab.getToeflScore() != null) {
                sb.append(String.format("✔ TOEFL %d\n", ab.getToeflScore()));
            } else {
                sb.append(String.format("✔ SAT %d\n", ab.getSatScore()));
            }
            if (!vr.getCertNotExpired()) {
                sb.append("⚠ Certificate expired or missing issue date\n");
            }
        } else {
            sb.append("✔ Certificate not required\n");
        }

        // 4. Achievements
        if (ab != null && ab.getAcademicAchievement() != null && !ab.getAcademicAchievement().trim().isEmpty()) {
            sb.append(String.format("✔ Achievement: %s\n", ab.getAcademicAchievement().trim()));
        } else {
            sb.append("✔ No special achievements recorded\n");
        }

        // 5. Duplicates
        if (!hasDuplicates) {
            sb.append("✔ No duplicate records\n");
        } else {
            List<String> dups = new ArrayList<>();
            if (!vr.getNoDuplicateCccd()) dups.add("CCCD");
            if (!vr.getNoDuplicateEmail()) dups.add("Email");
            if (!vr.getNoDuplicatePhone()) dups.add("Phone");
            sb.append("✖ Duplicate records: ").append(String.join(", ", dups)).append("\n");
        }

        // Confidence calculation
        int confidence = 95;
        if ("MANUAL_REVIEW".equals(recommendation)) {
            confidence = 50;
        } else if ("NEED_MORE_DOCUMENT".equals(recommendation)) {
            confidence = 75;
        } else if ("REJECT_RECOMMENDED".equals(recommendation)) {
            confidence = 85;
        } else {
            // Ready for approval: tie to priority score
            confidence = Math.max(80, ps.getScore());
        }

        AISummary summary = aiSummaryRepository.findByApplicationId(applicationId)
                .orElse(new AISummary());
        
        summary.setApplication(app);
        summary.setSummary(sb.toString().trim());
        summary.setRecommendation(recommendation);
        summary.setConfidence(confidence);
        summary.setGeneratedAt(LocalDateTime.now());

        return aiSummaryRepository.save(summary);
    }

    @Override
    @Transactional
    public void processPipeline(Long applicationId) {
        validateApplication(applicationId);
        calculatePriorityScore(applicationId);
        generateAISummary(applicationId);
    }

    @Override
    public List<Map<String, Object>> getSmartReviewQueue() {
        // Query applications that are SUBMITTED or UNDER_REVIEW
        List<Application> apps = applicationRepository.findAll().stream()
                .filter(a -> a.getStatus() == ApplicationStatus.SUBMITTED || a.getStatus() == ApplicationStatus.UNDER_REVIEW)
                .toList();

        // Pass 1: Pre-calculate missing pipeline data in parallel
        apps.parallelStream().forEach(a -> {
            try {
                boolean hasVr = validationResultRepository.findByApplicationId(a.getId()).isPresent();
                boolean hasPs = priorityScoreRepository.findByApplicationId(a.getId()).isPresent();
                boolean hasAi = aiSummaryRepository.findByApplicationId(a.getId()).isPresent();
                if (!hasVr || !hasPs || !hasAi) {
                    processPipeline(a.getId());
                }
            } catch (Exception e) {
                log.error("Failed to pre-calculate pipeline for application ID: " + a.getId(), e);
            }
        });

        // Pass 2: Fast sequential queue construction using cached data
        List<Map<String, Object>> queue = new ArrayList<>();
        for (Application a : apps) {
            ValidationResult vr = validationResultRepository.findByApplicationId(a.getId()).orElse(null);
            PriorityScore ps = priorityScoreRepository.findByApplicationId(a.getId()).orElse(null);
            AISummary ai = aiSummaryRepository.findByApplicationId(a.getId()).orElse(null);

            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", a.getId());
            m.put("applicationCode", a.getApplicationCode());
            m.put("studentName", a.getStudentProfile().getUser().getFullName());
            m.put("studentEmail", a.getStudentProfile().getUser().getEmail());
            m.put("studentPhone", a.getStudentProfile().getUser().getPhone());
            m.put("majorName", a.getMajor().getName());
            m.put("campusName", a.getCampus().getName());
            m.put("methodName", a.getAdmissionMethod().getName());
            m.put("status", a.getStatus().name());
            m.put("submittedAt", a.getSubmittedAt());

            // Add pipeline details
            m.put("validationStatus", vr != null ? vr.getStatus() : "UNKNOWN");
            m.put("priorityScore", ps != null ? ps.getScore() : 0);
            m.put("aiRecommendation", ai != null ? ai.getRecommendation() : "MANUAL_REVIEW");
            m.put("aiConfidence", ai != null ? ai.getConfidence() : 50);
            m.put("aiSummaryText", ai != null ? ai.getSummary() : "");
            
            // Extract missing documents
            List<String> missingList = new ArrayList<>();
            if (vr != null && vr.getMissingInfoDetails() != null && vr.getMissingInfoDetails().contains("missingDocs:")) {
                String segment = vr.getMissingInfoDetails();
                int idx = segment.indexOf("missingDocs:");
                if (idx != -1) {
                    String sub = segment.substring(idx + "missingDocs:".length());
                    int nextComma = sub.indexOf(",");
                    String docsStr = (nextComma == -1) ? sub : sub.substring(0, nextComma);
                    if (!docsStr.trim().isEmpty()) {
                        missingList.addAll(Arrays.asList(docsStr.split(";")));
                    }
                }
            }
            m.put("missingDocuments", missingList);

            // Compute risk level
            String riskLevel = "Low";
            if (vr != null) {
                boolean hasDuplicates = !vr.getNoDuplicateCccd() || !vr.getNoDuplicateEmail() || !vr.getNoDuplicatePhone();
                if (hasDuplicates) {
                    riskLevel = "High";
                } else if ("ERROR".equals(vr.getStatus()) || !vr.getCertNotExpired() || !vr.getCccdFormatOk()) {
                    riskLevel = "Medium";
                }
            }
            m.put("riskLevel", riskLevel);

            queue.add(m);
        }

        // Sort the queue according to Feature 5:
        // Priority order:
        // 1. High Priority (score >= 80)
        // 2. Waiting too long (submitted date is oldest, so older dates first)
        // 3. Complete applications (validationStatus == COMPLETE)
        // 4. Missing documents (validationStatus == WARNING)
        // 5. Need manual verification (validationStatus == ERROR)
        queue.sort((o1, o2) -> {
            int score1 = (int) o1.get("priorityScore");
            int score2 = (int) o2.get("priorityScore");
            boolean high1 = score1 >= 80;
            boolean high2 = score2 >= 80;
            
            if (high1 && !high2) return -1;
            if (!high1 && high2) return 1;

            // Sort by submission date (oldest first - waiting too long)
            LocalDateTime date1 = (LocalDateTime) o1.get("submittedAt");
            LocalDateTime date2 = (LocalDateTime) o2.get("submittedAt");
            if (date1 != null && date2 != null) {
                int c = date1.compareTo(date2);
                if (c != 0) return c;
            }

            // Complete first
            String val1 = (String) o1.get("validationStatus");
            String val2 = (String) o2.get("validationStatus");
            
            int rank1 = "COMPLETE".equals(val1) ? 0 : "WARNING".equals(val1) ? 1 : 2;
            int rank2 = "COMPLETE".equals(val2) ? 0 : "WARNING".equals(val2) ? 1 : 2;
            
            return Integer.compare(rank1, rank2);
        });

        return queue;
    }

    @Override
    @Transactional
    public void approveApplication(Long applicationId, String officerEmail) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        User officer = userRepository.findByEmail(officerEmail)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        app.setStatus(ApplicationStatus.APPROVED);
        app.setReviewedAt(LocalDateTime.now());
        app.setReviewedBy(officer);
        app.setOfficerNotes("Hệ thống tự động phê duyệt qua Smart Pipeline");
        applicationRepository.save(app);

        // Add Notification
        Notification notif = Notification.builder()
                .user(app.getStudentProfile().getUser())
                .title("Hồ sơ đã được duyệt")
                .message("Chúc mừng! Hồ sơ " + app.getApplicationCode() + " của bạn đã được duyệt bởi Cán bộ tuyển sinh qua hệ thống Smart Pipeline.")
                .type(NotificationType.RESULT)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notif);
    }

    @Override
    @Transactional
    public void approveApplicationsBatch(List<Long> applicationIds, String officerEmail) {
        User officer = userRepository.findByEmail(officerEmail)
                .orElseThrow(() -> new RuntimeException("Officer not found"));
        LocalDateTime now = LocalDateTime.now();

        for (Long appId : applicationIds) {
            Application app = applicationRepository.findById(appId).orElse(null);
            if (app == null) continue;

            app.setStatus(ApplicationStatus.APPROVED);
            app.setReviewedAt(now);
            app.setReviewedBy(officer);
            app.setOfficerNotes("Hệ thống tự động phê duyệt hàng loạt qua Smart Pipeline");
            applicationRepository.save(app);

            Notification notif = Notification.builder()
                    .user(app.getStudentProfile().getUser())
                    .title("Hồ sơ đã được duyệt")
                    .message("Chúc mừng! Hồ sơ " + app.getApplicationCode() + " của bạn đã được duyệt hàng loạt bởi Cán bộ tuyển sinh qua hệ thống Smart Pipeline.")
                    .type(NotificationType.RESULT)
                    .isRead(false)
                    .createdAt(now)
                    .build();
            notificationRepository.save(notif);
        }
    }

    @Override
    @Transactional
    public void rejectApplication(Long applicationId, String reason, String officerEmail) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        User officer = userRepository.findByEmail(officerEmail)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        app.setStatus(ApplicationStatus.REJECTED);
        app.setReviewedAt(LocalDateTime.now());
        app.setReviewedBy(officer);
        app.setRejectionReason(reason);
        app.setOfficerNotes("Từ chối qua Smart Pipeline: " + reason);
        applicationRepository.save(app);

        // Add Notification
        Notification notif = Notification.builder()
                .user(app.getStudentProfile().getUser())
                .title("Hồ sơ bị từ chối")
                .message("Rất tiếc! Hồ sơ xét tuyển của bạn bị từ chối. Lý do: " + reason)
                .type(NotificationType.RESULT)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notif);
    }

    @Override
    @Transactional
    public void requestMoreDocuments(Long applicationId, String notes, String officerEmail) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        User officer = userRepository.findByEmail(officerEmail)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        app.setStatus(ApplicationStatus.UNDER_REVIEW);
        app.setReviewedAt(LocalDateTime.now());
        app.setReviewedBy(officer);
        app.setOfficerNotes("Yêu cầu bổ sung tài liệu: " + notes);
        applicationRepository.save(app);

        // Add Notification
        Notification notif = Notification.builder()
                .user(app.getStudentProfile().getUser())
                .title("Nhắc nhở: Bổ sung tài liệu")
                .message("Hồ sơ xét tuyển của bạn cần bổ sung tài liệu. Yêu cầu chi tiết: " + notes)
                .type(NotificationType.REMINDER)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notif);
    }

    private List<Map<String, Object>> getUploadedDocuments(Long applicationId) {
        try {
            return jdbcTemplate.queryForList(
                "SELECT ad.id, dt.code, ad.status, ad.file_name, ad.mime_type " +
                "FROM application_documents ad " +
                "JOIN document_types dt ON ad.document_type_id = dt.id " +
                "WHERE ad.application_id = ?",
                applicationId
            );
        } catch (Exception e) {
            log.error("Failed to query documents for app " + applicationId, e);
            return List.of();
        }
    }

    private String getFileExtension(String fileName) {
        int lastIdx = fileName.lastIndexOf('.');
        if (lastIdx == -1) return "";
        return fileName.substring(lastIdx + 1);
    }
}
