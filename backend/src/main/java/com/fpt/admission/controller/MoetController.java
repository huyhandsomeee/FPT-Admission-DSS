package com.fpt.admission.controller;

import com.fpt.admission.entity.Application;
import com.fpt.admission.entity.AcademicBackground;
import com.fpt.admission.entity.MoetResult;
import com.fpt.admission.entity.Notification;
import com.fpt.admission.entity.enums.ApplicationStatus;
import com.fpt.admission.entity.enums.NotificationType;
import com.fpt.admission.repository.ApplicationRepository;
import com.fpt.admission.repository.MoetResultRepository;
import com.fpt.admission.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/officer/moet")
@RequiredArgsConstructor
public class MoetController {

    private final MoetResultRepository moetResultRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;

    @GetMapping("/results")
    public ResponseEntity<?> getResults() {
        return ResponseEntity.ok(moetResultRepository.findAll());
    }

    @PostMapping("/import")
    public ResponseEntity<?> importExcel(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng chọn file Excel để upload"));
        }

        List<MoetResult> importedResults = new ArrayList<>();
        Set<String> excelCodes = new HashSet<>();
        int successCount = 0;
        int passCount = 0;
        int failCount = 0;

        try (InputStream is = file.getInputStream();
             Workbook workbook = WorkbookFactory.create(is)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            // Skip header if present
            if (rowIterator.hasNext()) {
                rowIterator.next(); // Skip header
            }

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                
                // Read columns: Mã hồ sơ, Họ tên, Ngành, Nguyện vọng, Kết quả
                Cell cellCode = row.getCell(0);
                Cell cellName = row.getCell(1);
                Cell cellMajor = row.getCell(2);
                Cell cellChoice = row.getCell(3);
                Cell cellResult = row.getCell(4);

                if (cellCode == null || cellCode.toString().trim().isEmpty()) {
                    continue; // Skip empty rows
                }

                String code = cellCode.toString().trim();
                excelCodes.add(code);
                String name = cellName != null ? cellName.toString().trim() : "";
                String major = cellMajor != null ? cellMajor.toString().trim() : "";
                
                int choice = 1;
                if (cellChoice != null) {
                    try {
                        choice = (int) Double.parseDouble(cellChoice.toString().trim());
                    } catch (Exception ignored) {
                        try {
                            choice = Integer.parseInt(cellChoice.toString().trim());
                        } catch (Exception ignored2) {}
                    }
                }

                String rawResult = cellResult != null ? cellResult.toString().trim() : "FAIL";
                String result = (rawResult.equalsIgnoreCase("PASS") || rawResult.contains("Trúng tuyển") || rawResult.contains("Đỗ")) ? "PASS" : "FAIL";

                MoetResult moetRes = MoetResult.builder()
                        .applicationCode(code)
                        .fullName(name)
                        .major(major)
                        .choice(choice)
                        .result(result)
                        .syncedAt(LocalDateTime.now())
                        .build();

                moetResultRepository.save(moetRes);
                importedResults.add(moetRes);
                successCount++;

                // Update application
                Optional<Application> appOpt = applicationRepository.findByApplicationCode(code);
                if (appOpt.isPresent()) {
                    Application app = appOpt.get();
                    if (result.equals("PASS")) {
                        app.setStatus(ApplicationStatus.ACCEPTED_MOET);
                        app.setMoetReleasedAt(LocalDateTime.now());
                        passCount++;

                        // Notify portal
                        String enrollLink = "/student/enrollment/" + app.getId();
                        Notification notif = Notification.builder()
                                .user(app.getStudentProfile().getUser())
                                .title("🎉 Chúc mừng! Bạn đã trúng tuyển chính thức – Vui lòng hoàn tất thủ tục nhập học")
                                .message("Bạn đã trúng tuyển vào ngành " + app.getMajor().getName() +
                                        " – Đại học FPT. Vui lòng truy cập hướng dẫn nhập học và điền đầy đủ form thủ tục trước hạn quy định.")
                                .type(NotificationType.RESULT)
                                .relatedEntityType("ENROLLMENT")
                                .relatedEntityId(app.getId())
                                .isRead(false)
                                .createdAt(LocalDateTime.now())
                                .build();
                        notificationRepository.save(notif);

                        // Auto-create enrollment notification so student sees it immediately
                        autoCreateEnrollmentNotif(app);

                        System.out.println("LOG [EMAIL]: Sent PASS enrollment link email to " + app.getStudentProfile().getUser().getEmail());
                        System.out.println("LOG [SMS]: Sent PASS SMS to " + app.getStudentProfile().getUser().getPhone());

                    } else {
                        app.setStatus(ApplicationStatus.REJECTED);
                        app.setRejectionReason("Không trúng tuyển theo kết quả đồng bộ từ Bộ GD&ĐT");
                        app.setMoetReleasedAt(LocalDateTime.now());
                        failCount++;

                        // Notify
                        Notification notif = Notification.builder()
                                .user(app.getStudentProfile().getUser())
                                .title("Kết quả xét tuyển từ Bộ GD&ĐT")
                                .message("Đại học FPT rất tiếc phải thông báo bạn chưa trúng tuyển trong đợt lọc ảo chính thức của Bộ GD&ĐT.")
                                .type(NotificationType.SYSTEM)
                                .relatedEntityType("APPLICATION")
                                .relatedEntityId(app.getId())
                                .isRead(false)
                                .createdAt(LocalDateTime.now())
                                .build();
                        notificationRepository.save(notif);

                        // Mock SMS
                        System.out.println("LOG [SMS ALERT]: Sent FAIL SMS to " + app.getStudentProfile().getUser().getPhone());
                    }
                    applicationRepository.save(app);
                }
            }

            // Find apps that are eligible/registered/waiting but NOT matched in the imported excel list, and reject them
            // Only applies to THPT method — HOC_BA and PRIORITY methods are NOT processed by MOET
            List<Application> allApps = applicationRepository.findAll();
            for (Application app : allApps) {
                String methodCode = app.getAdmissionMethod() != null ? app.getAdmissionMethod().getCode() : "";
                boolean isMoetMethod = "THPT".equals(methodCode);
                if (isMoetMethod
                    && (app.getStatus() == ApplicationStatus.APPROVED 
                     || app.getStatus() == ApplicationStatus.REGISTERED_MOET 
                     || app.getStatus() == ApplicationStatus.WAITING_MOET)
                    && !excelCodes.contains(app.getApplicationCode())) {
                    
                    app.setStatus(ApplicationStatus.REJECTED);
                    app.setRejectionReason("Không trúng tuyển theo kết quả đồng bộ từ Bộ GD&ĐT (không có tên trong danh sách của Bộ)");
                    app.setMoetReleasedAt(LocalDateTime.now());
                    applicationRepository.save(app);
                    failCount++;

                    // Notify
                    Notification notif = Notification.builder()
                            .user(app.getStudentProfile().getUser())
                            .title("Kết quả xét tuyển từ Bộ GD&ĐT")
                            .message("Đại học FPT rất tiếc phải thông báo bạn chưa trúng tuyển trong đợt lọc ảo chính thức của Bộ GD&ĐT.")
                            .type(NotificationType.SYSTEM)
                            .relatedEntityType("APPLICATION")
                            .relatedEntityId(app.getId())
                            .isRead(false)
                            .createdAt(LocalDateTime.now())
                            .build();
                    notificationRepository.save(notif);

                    // Mock alerts:
                    System.out.println("LOG [SMS ALERT]: Sent FAIL SMS to " + app.getStudentProfile().getUser().getPhone());
                }
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Lỗi xử lý file Excel: " + e.getMessage()));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Đồng bộ file Excel thành công",
                "totalImported", successCount,
                "passCount", passCount,
                "failCount", failCount
        ));
    }

    @PostMapping("/sync")
    public ResponseEntity<?> triggerSync() {
        List<Application> apps = applicationRepository.findAll();

        // HOC_BA & PRIORITY: tự xét dựa trên điểm sàn, không qua lọc ảo Bộ
        List<Application> internalApps = apps.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.REGISTERED_MOET
                          && a.getAdmissionMethod() != null
                          && !"THPT".equals(a.getAdmissionMethod().getCode()))
                .toList();

        // THPT: đồng bộ qua Bộ GD&ĐT (mock random)
        List<Application> thptApps = apps.stream()
                .filter(a -> (a.getStatus() == ApplicationStatus.REGISTERED_MOET
                          || a.getStatus() == ApplicationStatus.WAITING_MOET
                          || a.getStatus() == ApplicationStatus.APPROVED)
                          && a.getAdmissionMethod() != null
                          && "THPT".equals(a.getAdmissionMethod().getCode()))
                .toList();

        int passCount = 0;
        int failCount = 0;
        Random random = new Random();

        // Xử lý HOC_BA / PRIORITY: HOC_BA xét điểm sàn (tổng GPA10+GPA11+GPA12), các phương thức khác tự động pass
        for (Application app : internalApps) {
            String methodCode = app.getAdmissionMethod().getCode();
            String majorCode = app.getMajor() != null ? app.getMajor().getCode() : "";
            boolean pass;
            String failReason = "";

            if ("HOC_BA".equals(methodCode)) {
                // Tính lại tổng GPA từ AcademicBackground để tránh lỗi dữ liệu cũ
                AcademicBackground ab = app.getStudentProfile().getAcademicBackground();
                double gpa10 = ab != null && ab.getGpa10() != null ? ab.getGpa10().doubleValue() : 0.0;
                double gpa11 = ab != null && ab.getGpa11() != null ? ab.getGpa11().doubleValue() : 0.0;
                double gpa12 = ab != null && ab.getGpa12() != null ? ab.getGpa12().doubleValue() : 0.0;
                double totalGpa = gpa10 + gpa11 + gpa12;

                // Cập nhật lại totalScore đúng vào DB
                app.setTotalScore(java.math.BigDecimal.valueOf(totalGpa).setScale(2, java.math.RoundingMode.HALF_UP));

                double minScore = "CST".equalsIgnoreCase(majorCode) ? 21.0 : 18.0;
                pass = totalGpa >= minScore;
                failReason = String.format("Điểm không đạt ngưỡng xét tuyển (Tổng GPA: %.2f < %.1f)", totalGpa, minScore);
            } else {
                // PRIORITY / THANG_DIEM: tự động trúng tuyển nếu đã được duyệt
                pass = true;
            }

            MoetResult moetRes = MoetResult.builder()
                    .applicationCode(app.getApplicationCode())
                    .fullName(app.getStudentProfile().getUser().getFullName())
                    .major(app.getMajor().getName())
                    .choice(1)
                    .result(pass ? "PASS" : "FAIL")
                    .syncedAt(LocalDateTime.now())
                    .build();
            moetResultRepository.save(moetRes);

            if (pass) {
                app.setStatus(ApplicationStatus.ACCEPTED_MOET);
                app.setMoetReleasedAt(LocalDateTime.now());
                passCount++;
                notificationRepository.save(Notification.builder()
                        .user(app.getStudentProfile().getUser())
                        .title("🎉 Chúc mừng! Bạn đã trúng tuyển chính thức – Vui lòng hoàn tất thủ tục nhập học")
                        .message("Bạn đã trúng tuyển vào ngành " + app.getMajor().getName() +
                                " – Đại học FPT. Vui lòng vào mục hướng dẫn nhập học và điền đầy đủ form thủ tục.")
                        .type(NotificationType.RESULT)
                        .relatedEntityType("ENROLLMENT")
                        .relatedEntityId(app.getId())
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build());
                autoCreateEnrollmentNotif(app);
            } else {
                app.setStatus(ApplicationStatus.REJECTED);
                app.setRejectionReason(failReason);
                app.setMoetReleasedAt(LocalDateTime.now());
                failCount++;
                notificationRepository.save(Notification.builder()
                        .user(app.getStudentProfile().getUser())
                        .title("Kết quả xét tuyển")
                        .message("Rất tiếc, hồ sơ của bạn không đạt điểm sàn xét tuyển. " + failReason)
                        .type(NotificationType.RESULT)
                        .relatedEntityType("APPLICATION")
                        .relatedEntityId(app.getId())
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build());
            }
            applicationRepository.save(app);
        }

        // Xử lý THPT: mock đồng bộ Bộ GD&ĐT
        for (Application app : thptApps) {
            String result = random.nextInt(100) < 85 ? "PASS" : "FAIL";
            int choice = random.nextInt(3) + 1;

            MoetResult moetRes = MoetResult.builder()
                    .applicationCode(app.getApplicationCode())
                    .fullName(app.getStudentProfile().getUser().getFullName())
                    .major(app.getMajor().getName())
                    .choice(choice)
                    .result(result)
                    .syncedAt(LocalDateTime.now())
                    .build();
            moetResultRepository.save(moetRes);

            if (result.equals("PASS")) {
                app.setStatus(ApplicationStatus.ACCEPTED_MOET);
                app.setMoetReleasedAt(LocalDateTime.now());
                passCount++;
                notificationRepository.save(Notification.builder()
                        .user(app.getStudentProfile().getUser())
                        .title("🎉 Chúc mừng! Bạn đã trúng tuyển chính thức – Vui lòng hoàn tất thủ tục nhập học")
                        .message("Bạn đã trúng tuyển vào ngành " + app.getMajor().getName() +
                                " – Đại học FPT. Vui lòng vào mục hướng dẫn nhập học và điền đầy đủ form thủ tục.")
                        .type(NotificationType.RESULT)
                        .relatedEntityType("ENROLLMENT")
                        .relatedEntityId(app.getId())
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build());
                autoCreateEnrollmentNotif(app);
            } else {
                app.setStatus(ApplicationStatus.REJECTED);
                app.setRejectionReason("Không trúng tuyển theo kết quả đồng bộ từ Bộ GD&ĐT");
                app.setMoetReleasedAt(LocalDateTime.now());
                failCount++;
                notificationRepository.save(Notification.builder()
                        .user(app.getStudentProfile().getUser())
                        .title("Kết quả xét tuyển từ Bộ GD&ĐT")
                        .message("Đại học FPT rất tiếc phải thông báo bạn chưa trúng tuyển trong đợt lọc ảo chính thức của Bộ GD&ĐT.")
                        .type(NotificationType.SYSTEM)
                        .relatedEntityType("APPLICATION")
                        .relatedEntityId(app.getId())
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build());
            }
            applicationRepository.save(app);
        }

        int totalSynced = internalApps.size() + thptApps.size();
        return ResponseEntity.ok(Map.of(
                "message", "Đồng bộ kết quả tuyển sinh thành công",
                "totalSynced", totalSynced,
                "passCount", passCount,
                "failCount", failCount
        ));
    }

    // ── Helper: auto-create enrollment_notifications row when student passes MOET ──
    private final org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    private void autoCreateEnrollmentNotif(Application app) {
        try {
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS enrollment_notifications (" +
                "  id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "  application_id BIGINT NOT NULL, " +
                "  title VARCHAR(512), content TEXT, deadline VARCHAR(100), documents TEXT, " +
                "  tuition_amount VARCHAR(100), tuition_link VARCHAR(512), schedule_link VARCHAR(512), " +
                "  download_link VARCHAR(512), hotline VARCHAR(100), contact_person VARCHAR(200), " +
                "  channels VARCHAR(100), sent_at DATETIME, sent_by_name VARCHAR(200), " +
                "  read_at DATETIME, confirmed_at DATETIME, tuition_paid_at DATETIME, " +
                "  scheduled_at DATETIME, completed_at DATETIME, " +
                "  created_at DATETIME DEFAULT NOW())" );

            // Create enrollment_forms table for student form submission
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS enrollment_forms (" +
                "  id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "  application_id BIGINT NOT NULL UNIQUE, " +
                "  full_name VARCHAR(255), " +
                "  dob VARCHAR(20), " +
                "  gender VARCHAR(10), " +
                "  id_number VARCHAR(50), " +
                "  id_issued_date VARCHAR(20), " +
                "  id_issued_place VARCHAR(255), " +
                "  permanent_address TEXT, " +
                "  contact_address TEXT, " +
                "  phone VARCHAR(20), " +
                "  email VARCHAR(255), " +
                "  parent_name VARCHAR(255), " +
                "  parent_phone VARCHAR(20), " +
                "  high_school VARCHAR(255), " +
                "  graduation_year VARCHAR(10), " +
                "  exam_score DECIMAL(5,2), " +
                "  preferred_campus VARCHAR(100), " +
                "  expected_start VARCHAR(20), " +
                "  scholarship_apply TINYINT(1) DEFAULT 0, " +
                "  dormitory_apply TINYINT(1) DEFAULT 0, " +
                "  additional_notes TEXT, " +
                "  submitted_at DATETIME, " +
                "  reviewed_at DATETIME, " +
                "  review_notes TEXT, " +
                "  status VARCHAR(50) DEFAULT 'PENDING', " +
                "  created_at DATETIME DEFAULT NOW())" );

            // Only insert if not already exists
            Integer cnt = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM enrollment_notifications WHERE application_id = ?",
                Integer.class, app.getId());
            if (cnt == null || cnt == 0) {
                jdbcTemplate.update(
                    "INSERT INTO enrollment_notifications " +
                    "(application_id, title, content, deadline, documents, tuition_amount, tuition_link, " +
                    " schedule_link, download_link, hotline, contact_person, channels, sent_at, sent_by_name) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)",
                    app.getId(),
                    "🎓 Hướng dẫn nhập học – Đại học FPT 2026",
                    "Chúc mừng bạn đã chính thức trúng tuyển vào Đại học FPT năm học 2026!\n\n" +
                    "Vui lòng đọc kỹ hướng dẫn nhập học và hoàn thành các bước theo đúng thời hạn để đảm bảo suất học.\n\n" +
                    "📋 Bước 1: Đọc & xác nhận hướng dẫn nhập học\n" +
                    "💳 Bước 2: Đóng học phí đúng hạn\n" +
                    "📅 Bước 3: Đặt lịch đến trường nhập học\n" +
                    "📁 Bước 4: Chuẩn bị đầy đủ hồ sơ giấy tờ gốc\n" +
                    "📝 Bước 5: Điền và nộp Form thủ tục nhập học trực tuyến",
                    "15/09/2026",
                    "- Căn cước công dân (bản gốc + 2 bản sao)\n" +
                    "- Bằng tốt nghiệp THPT (bản gốc)\n" +
                    "- Học bạ THPT (bản gốc)\n" +
                    "- 4 ảnh thẻ 3x4 (nền trắng)\n" +
                    "- Giấy khai sinh (bản sao công chứng)\n" +
                    "- Giấy chứng nhận trúng tuyển (in từ hệ thống)",
                    "22.000.000 VNĐ/kỳ",
                    "https://payments.fpt.edu.vn",
                    "https://nhaphoc.fpt.edu.vn",
                    "https://tuyensinh.fpt.edu.vn/giaybao",
                    "1800 6036",
                    "Phòng Tuyển sinh – Đại học FPT",
                    "PORTAL,EMAIL",
                    "HỆ THỐNG TỰ ĐỘNG"
                );
            }
        } catch (Exception ex) {
            System.err.println("[WARN] autoCreateEnrollmentNotif failed: " + ex.getMessage());
        }
    }
}
