package com.fpt.admission.controller;

import com.fpt.admission.entity.Application;
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

                        // Notify
                        Notification notif = Notification.builder()
                                .user(app.getStudentProfile().getUser())
                                .title("Chúc mừng trúng tuyển chính thức!")
                                .message("Chúc mừng! Bạn đã trúng tuyển chính thức vào ngành " + app.getMajor().getName() + " của Đại học FPT. Vui lòng tiến hành các thủ tục xác nhận nhập học.")
                                .type(NotificationType.RESULT)
                                .relatedEntityType("APPLICATION")
                                .relatedEntityId(app.getId())
                                .isRead(false)
                                .createdAt(LocalDateTime.now())
                                .build();
                        notificationRepository.save(notif);

                        // Mock automatic email/SMS alerts:
                        System.out.println("LOG [EMAIL ALERT]: Sent PASS email to " + app.getStudentProfile().getUser().getEmail());
                        System.out.println("LOG [SMS ALERT]: Sent PASS SMS to " + app.getStudentProfile().getUser().getPhone());

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
            List<Application> allApps = applicationRepository.findAll();
            for (Application app : allApps) {
                if ((app.getStatus() == ApplicationStatus.APPROVED 
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
        // Find all apps with status in REGISTERED_MOET, WAITING_MOET or APPROVED (to cover transition states)
        List<Application> apps = applicationRepository.findAll();
        List<Application> targetApps = apps.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.REGISTERED_MOET 
                          || a.getStatus() == ApplicationStatus.WAITING_MOET
                          || a.getStatus() == ApplicationStatus.APPROVED)
                .toList();

        int passCount = 0;
        int failCount = 0;
        Random random = new Random();

        for (Application app : targetApps) {
            // 85% chance to PASS, 15% to FAIL
            String result = random.nextInt(100) < 85 ? "PASS" : "FAIL";
            int choice = random.nextInt(3) + 1; // Nguyện vọng 1, 2, 3

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

                // Notify
                Notification notif = Notification.builder()
                        .user(app.getStudentProfile().getUser())
                        .title("Chúc mừng trúng tuyển chính thức!")
                        .message("Chúc mừng! Bạn đã trúng tuyển chính thức vào ngành " + app.getMajor().getName() + " của Đại học FPT. Vui lòng tiến hành các thủ tục xác nhận nhập học.")
                        .type(NotificationType.RESULT)
                        .relatedEntityType("APPLICATION")
                        .relatedEntityId(app.getId())
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build();
                notificationRepository.save(notif);

                // Mock alerts:
                System.out.println("LOG [EMAIL ALERT]: Sent PASS email to " + app.getStudentProfile().getUser().getEmail());
                System.out.println("LOG [SMS ALERT]: Sent PASS SMS to " + app.getStudentProfile().getUser().getPhone());
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

        return ResponseEntity.ok(Map.of(
                "message", "Đồng bộ API trực tiếp từ Bộ GD&ĐT thành công",
                "totalSynced", targetApps.size(),
                "passCount", passCount,
                "failCount", failCount
        ));
    }
}
