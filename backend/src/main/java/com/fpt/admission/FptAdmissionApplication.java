package com.fpt.admission;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import com.fpt.admission.service.PipelineService;
import com.fpt.admission.entity.StrategicRecommendation;
import com.fpt.admission.entity.StrategicRisk;
import com.fpt.admission.repository.StrategicRecommendationRepository;
import com.fpt.admission.repository.StrategicRiskRepository;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class FptAdmissionApplication {

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry -> {
            String key = entry.getKey();
            String value = entry.getValue();
            if (value == null) return;
            String normalizedValue = value.trim();
            if ("MAIL_PASSWORD".equals(key)) {
                normalizedValue = normalizedValue.replaceAll("\\s+", "");
            }
            System.setProperty(key, normalizedValue);
        });
        SpringApplication.run(FptAdmissionApplication.class, args);
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.boot.CommandLineRunner databaseCleanup(
            org.springframework.jdbc.core.JdbcTemplate jdbcTemplate,
            PipelineService pipelineService) {
        return args -> {
            // Alter applications table status column enum to support the new state statuses
            try {
                jdbcTemplate.update("ALTER TABLE applications MODIFY COLUMN status ENUM('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REGISTERED_MOET','WAITING_MOET','ACCEPTED_MOET','REJECTED','ENROLLED') DEFAULT 'DRAFT'");
                System.out.println("[DB-MIGRATION] Successfully modified applications status column enum.");
            } catch (Exception e) {
                System.err.println("[DB-MIGRATION] Failed to alter applications status column: " + e.getMessage());
            }

            // 2026 Admissions Structure Migration: add elective subject columns and combination code
            try {
                jdbcTemplate.update("ALTER TABLE academic_backgrounds ADD COLUMN physics_score DECIMAL(4,2) NULL");
                System.out.println("[DB-MIGRATION] Added physics_score to academic_backgrounds.");
            } catch (Exception e) {}
            try {
                jdbcTemplate.update("ALTER TABLE academic_backgrounds ADD COLUMN chemistry_score DECIMAL(4,2) NULL");
                System.out.println("[DB-MIGRATION] Added chemistry_score to academic_backgrounds.");
            } catch (Exception e) {}
            try {
                jdbcTemplate.update("ALTER TABLE academic_backgrounds ADD COLUMN biology_score DECIMAL(4,2) NULL");
                System.out.println("[DB-MIGRATION] Added biology_score to academic_backgrounds.");
            } catch (Exception e) {}
            try {
                jdbcTemplate.update("ALTER TABLE academic_backgrounds ADD COLUMN history_score DECIMAL(4,2) NULL");
                System.out.println("[DB-MIGRATION] Added history_score to academic_backgrounds.");
            } catch (Exception e) {}
            try {
                jdbcTemplate.update("ALTER TABLE academic_backgrounds ADD COLUMN geography_score DECIMAL(4,2) NULL");
                System.out.println("[DB-MIGRATION] Added geography_score to academic_backgrounds.");
            } catch (Exception e) {}
            try {
                jdbcTemplate.update("ALTER TABLE academic_backgrounds ADD COLUMN gdpl_score DECIMAL(4,2) NULL");
                System.out.println("[DB-MIGRATION] Added gdpl_score to academic_backgrounds.");
            } catch (Exception e) {}
            try {
                jdbcTemplate.update("ALTER TABLE academic_backgrounds ADD COLUMN it_score DECIMAL(4,2) NULL");
                System.out.println("[DB-MIGRATION] Added it_score to academic_backgrounds.");
            } catch (Exception e) {}
            try {
                jdbcTemplate.update("ALTER TABLE academic_backgrounds ADD COLUMN technology_score DECIMAL(4,2) NULL");
                System.out.println("[DB-MIGRATION] Added technology_score to academic_backgrounds.");
            } catch (Exception e) {}
            try {
                jdbcTemplate.update("ALTER TABLE applications ADD COLUMN combination_code VARCHAR(10) NULL");
                System.out.println("[DB-MIGRATION] Added combination_code to applications.");
            } catch (Exception e) {}
            try {
                jdbcTemplate.update("UPDATE admission_methods SET is_active = true WHERE id = 2");
                System.out.println("[DB-MIGRATION] Activated THPT method (id = 2).");
            } catch (Exception e) {}
            try {
                // Populate default elective scores and combination codes if null
                jdbcTemplate.update("UPDATE applications SET combination_code = 'D01' WHERE combination_code IS NULL");
                jdbcTemplate.update("UPDATE academic_backgrounds SET physics_score = 8.5, chemistry_score = 8.0, biology_score = 7.5, history_score = 7.0, geography_score = 7.5, gdpl_score = 8.0, it_score = 9.0, technology_score = 8.5 WHERE physics_score IS NULL");
                System.out.println("[DB-MIGRATION] Populated default combination_code and elective scores.");
            } catch (Exception e) {}

            try {
                jdbcTemplate.update("UPDATE applications SET admission_method_id = 2 WHERE admission_method_id = 5");
                System.out.println("[DB-MIGRATION] Database clean-up query executed successfully.");
            } catch (Exception e) {
                System.err.println("[DB-MIGRATION] Failed to clean up database: " + e.getMessage());
            }

            // Fix admission year ID mismatch for seeded applications
            try {
                Long year2026Id = jdbcTemplate.queryForObject("SELECT id FROM admission_years WHERE year = 2026 LIMIT 1", Long.class);
                Long year2027Id = jdbcTemplate.queryForObject("SELECT id FROM admission_years WHERE year = 2027 LIMIT 1", Long.class);
                if (year2026Id != null && year2027Id != null && !year2026Id.equals(3L) && year2027Id.equals(3L)) {
                    int updated = jdbcTemplate.update(
                        "UPDATE applications SET admission_year_id = ? WHERE admission_year_id = ? AND (application_code LIKE '%26%' OR application_code LIKE '%27%')",
                        year2026Id, year2027Id
                    );
                    if (updated > 0) {
                        System.out.println("[DB-MIGRATION] Re-linked " + updated + " seeded applications from 2027 (ID 3) to 2026 (ID " + year2026Id + ").");
                        jdbcTemplate.update(
                            "UPDATE applications SET application_code = REPLACE(application_code, '270', '260') WHERE admission_year_id = ?",
                            year2026Id
                        );
                        jdbcTemplate.update(
                            "UPDATE applications SET application_code = REPLACE(application_code, '271', '261') WHERE admission_year_id = ?",
                            year2026Id
                        );
                        jdbcTemplate.update(
                            "UPDATE applications SET application_code = REPLACE(application_code, '272', '262') WHERE admission_year_id = ?",
                            year2026Id
                        );
                        jdbcTemplate.update(
                            "UPDATE applications SET application_code = REPLACE(application_code, '273', '263') WHERE admission_year_id = ?",
                            year2026Id
                        );
                    }
                }
            } catch (Exception e) {
                System.err.println("[DB-MIGRATION] Failed to fix admission year IDs: " + e.getMessage());
            }

            // Migration for old application codes (FPT% / APP%) to new format (SExxxxxx) and sync student codes
            try {
                java.util.List<java.util.Map<String, Object>> appsToMigrate = jdbcTemplate.queryForList(
                    "SELECT a.id, a.student_profile_id, m.code as major_code, ay.year " +
                    "FROM applications a " +
                    "JOIN majors m ON a.major_id = m.id " +
                    "JOIN admission_years ay ON a.admission_year_id = ay.id " +
                    "WHERE a.application_code LIKE 'FPT%' OR a.application_code LIKE 'APP%' " +
                    "ORDER BY a.created_at ASC"
                );

                if (!appsToMigrate.isEmpty()) {
                    System.out.println("[DB-MIGRATION] Found " + appsToMigrate.size() + " old applications to migrate.");
                    for (java.util.Map<String, Object> appInfo : appsToMigrate) {
                        Long appId = ((Number) appInfo.get("id")).longValue();
                        Object spIdObj = appInfo.get("student_profile_id");
                        Long spId = spIdObj != null ? ((Number) spIdObj).longValue() : null;
                        String majorCode = (String) appInfo.get("major_code");
                        int year = ((Number) appInfo.get("year")).intValue();
                        String cohort = String.valueOf(year).substring(2);

                        // Count applications with new format to get next sequence
                        String prefix = majorCode + cohort;
                        java.util.List<java.util.Map<String, Object>> existingApps = jdbcTemplate.queryForList(
                            "SELECT application_code FROM applications WHERE application_code LIKE ? AND application_code NOT LIKE 'FPT%' AND application_code NOT LIKE 'APP%'",
                            prefix + "%"
                        );
                        int count = existingApps.size();
                        String sequence = String.format("%04d", count + 1);
                        String newCode = prefix + sequence;

                        // Update application
                        jdbcTemplate.update(
                            "UPDATE applications SET application_code = ? WHERE id = ?",
                            newCode, appId
                        );
                        // Update student profile if exists
                        if (spId != null) {
                            jdbcTemplate.update(
                                "UPDATE student_profiles SET student_code = ? WHERE id = ?",
                                newCode, spId
                            );
                        }
                        System.out.println("[DB-MIGRATION] Migrated app ID " + appId + " and student profile ID " + spId + " to new code: " + newCode);
                    }
                }
            } catch (Exception e) {
                System.err.println("[DB-MIGRATION] Failed to migrate application and student codes: " + e.getMessage());
            }

            // Sync total_score with gpa_12 for HOC_BA applications in active DB
            try {
                jdbcTemplate.update(
                    "UPDATE applications a " +
                    "JOIN academic_backgrounds ab ON a.student_profile_id = ab.student_profile_id " +
                    "JOIN admission_methods am ON a.admission_method_id = am.id " +
                    "SET a.total_score = ab.gpa_12 " +
                    "WHERE am.code = 'HOC_BA'"
                );
                // Also update min_score of HOC_BA to 6.0
                jdbcTemplate.update(
                    "UPDATE admission_methods SET min_score = 6.0, description = 'Xét tuyển dựa trên điểm trung bình lớp 12' WHERE code = 'HOC_BA'"
                );
                // Restore GPAs if they are NULL
                jdbcTemplate.update(
                    "UPDATE academic_backgrounds SET gpa_10 = 8.50 WHERE gpa_10 IS NULL"
                );
                jdbcTemplate.update(
                    "UPDATE academic_backgrounds SET gpa_11 = 8.60 WHERE gpa_11 IS NULL"
                );
                jdbcTemplate.update(
                    "UPDATE academic_backgrounds SET gpa_12 = 8.80 WHERE gpa_12 IS NULL"
                );

                // Seed missing required documents for all applications
                try {
                    int[] reqDocTypes = {1, 2, 3, 5, 6};
                    String[] docTypeNames = {"cccd", "hoc_ba", "bang_tn", "anh_the", "giay_khai_sinh"};
                    String[] docExts = {"pdf", "pdf", "pdf", "jpg", "pdf"};
                    
                    java.util.List<Long> appIds = jdbcTemplate.queryForList("SELECT id FROM applications", Long.class);
                    for (Long appId : appIds) {
                        for (int i = 0; i < reqDocTypes.length; i++) {
                            int docTypeId = reqDocTypes[i];
                            String docName = docTypeNames[i];
                            String ext = docExts[i];
                            
                            Integer count = jdbcTemplate.queryForObject(
                                "SELECT COUNT(*) FROM application_documents WHERE application_id = ? AND document_type_id = ?",
                                Integer.class, appId, docTypeId
                            );
                            
                            if (count == null || count == 0) {
                                jdbcTemplate.update(
                                    "INSERT INTO application_documents (application_id, document_type_id, file_name, status, verified_by) " +
                                    "VALUES (?, ?, ?, 'VERIFIED', 6)",
                                    appId, docTypeId, docName + "_app_" + appId + "." + ext
                                );
                            }
                        }
                        
                        // Check if IELTS/TOEFL exists to add CHUNG_CHI
                        java.util.List<java.util.Map<String, Object>> scoreList = jdbcTemplate.queryForList(
                            "SELECT ab.ielts_score, ab.toefl_score FROM applications a " +
                            "JOIN academic_backgrounds ab ON a.student_profile_id = ab.student_profile_id " +
                            "WHERE a.id = ?",
                            appId
                        );
                        if (!scoreList.isEmpty()) {
                            java.util.Map<String, Object> scoreMap = scoreList.get(0);
                            if (scoreMap.get("ielts_score") != null || scoreMap.get("toefl_score") != null) {
                                Integer count = jdbcTemplate.queryForObject(
                                    "SELECT COUNT(*) FROM application_documents WHERE application_id = ? AND document_type_id = 4",
                                    Integer.class, appId
                                );
                                if (count == null || count == 0) {
                                    jdbcTemplate.update(
                                        "INSERT INTO application_documents (application_id, document_type_id, file_name, status, verified_by) " +
                                        "VALUES (?, 4, ?, 'VERIFIED', 6)",
                                        appId, "ielts_app_" + appId + ".pdf"
                                    );
                                }
                            }
                        }
                    }
                    
                    // Update cert_issue_date if null
                    jdbcTemplate.update(
                        "UPDATE academic_backgrounds SET cert_issue_date = '2025-05-15' WHERE (ielts_score IS NOT NULL OR toefl_score IS NOT NULL) AND cert_issue_date IS NULL"
                    );
                    
                    // Clear cached tables to force recalculation with correct GPA and documents
                    jdbcTemplate.update("DELETE FROM validation_results");
                    jdbcTemplate.update("DELETE FROM priority_scores");
                    jdbcTemplate.update("DELETE FROM ai_summaries");
                    
                    System.out.println("[DB-MIGRATION] Successfully seeded missing documents, updated cert issue dates, and cleared old caches.");
                    
                    // Pre-calculate pipeline in the background asynchronously in parallel
                    new Thread(() -> {
                        try {
                            Thread.sleep(3000); // wait for Tomcat server to bind
                            System.out.println("[DB-MIGRATION] Starting background parallel pre-calculation of pipelines...");
                            java.util.List<Long> pendingAppIds = jdbcTemplate.queryForList(
                                "SELECT id FROM applications WHERE status IN ('SUBMITTED', 'UNDER_REVIEW')", Long.class
                            );
                            pendingAppIds.parallelStream().forEach(id -> {
                                try {
                                    pipelineService.processPipeline(id);
                                } catch (Exception ex) {
                                    // ignore
                                }
                            });
                            System.out.println("[DB-MIGRATION] Background pre-calculation of pipelines complete!");
                        } catch (Exception ex) {
                            System.err.println("[DB-MIGRATION] Background pre-calculation error: " + ex.getMessage());
                        }
                    }).start();
                } catch (Exception docEx) {
                    System.err.println("[DB-MIGRATION] Failed to seed missing documents: " + docEx.getMessage());
                }

                System.out.println("[DB-MIGRATION] Successfully sync'ed HOC_BA applications scores, min_score, and restored gpa_10/11/12.");
            } catch (Exception e) {
                System.err.println("[DB-MIGRATION] Failed to sync HOC_BA database data: " + e.getMessage());
            }

            try {
                jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS high_schools (id BIGINT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(300) NOT NULL, school_type ENUM('PUBLIC','PRIVATE') DEFAULT 'PUBLIC', province_id BIGINT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (province_id) REFERENCES provinces(id))");
                
                java.nio.file.Path path = java.nio.file.Paths.get("seed_schools.sql");
                if (!java.nio.file.Files.exists(path)) {
                    path = java.nio.file.Paths.get("backend/seed_schools.sql");
                }
                if (java.nio.file.Files.exists(path)) {
                    java.util.List<String> lines = java.nio.file.Files.readAllLines(path, java.nio.charset.StandardCharsets.UTF_8);
                    jdbcTemplate.update("DELETE FROM high_schools");
                    for (String line : lines) {
                        String trimmed = line.trim();
                        if (trimmed.startsWith("INSERT")) {
                            jdbcTemplate.update(trimmed);
                        }
                    }
                    System.out.println("[DB-MIGRATION] UTF-8 high school names successfully seeded to repair encoding issue.");
                } else {
                    System.err.println("[DB-MIGRATION] seed_schools.sql not found at paths.");
                }
            } catch (Exception e) {
                System.err.println("[DB-MIGRATION] Failed to repair high school names: " + e.getMessage());
            }
        };
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.boot.CommandLineRunner seedStrategicData(
            StrategicRecommendationRepository recommendationRepository,
            StrategicRiskRepository riskRepository) {
        return args -> {
            if (recommendationRepository.count() == 0) {
                recommendationRepository.save(StrategicRecommendation.builder()
                    .title("Tăng chỉ tiêu ngành AI")
                    .description("Nhu cầu tăng 35% YoY. Đề xuất tăng 200 chỉ tiêu cho năm 2026 tại cơ sở Hà Nội và TP.HCM.")
                    .impact("Tiềm năng doanh thu: ~5.6 tỷ VNĐ")
                    .priority("HIGH")
                    .status("PENDING")
                    .category("AI_QUOTA")
                    .currentValue(500)
                    .targetValue(700)
                    .actionPlan("Chuẩn bị cơ sở hạ tầng (Q1/2026): Mua sắm thiết bị GPU, thiết kế lại chương trình AI nâng cao.")
                    .build());

                recommendationRepository.save(StrategicRecommendation.builder()
                    .title("Mở rộng tuyển sinh khu vực Miền Trung")
                    .description("Thị phần miền Trung chỉ 16.5%. Đề xuất tăng cường marketing tại Nghệ An, Huế và Đà Nẵng.")
                    .impact("Tiềm năng: +2,000 hồ sơ")
                    .priority("HIGH")
                    .status("PENDING")
                    .category("REGION_MID")
                    .currentValue(16)
                    .targetValue(20)
                    .actionPlan("Chiến dịch FPT Pioneer miền Trung và gói học bổng địa phương hỗ trợ 20% học phí.")
                    .build());

                recommendationRepository.save(StrategicRecommendation.builder()
                    .title("Cải thiện tỷ lệ chuyển đổi (Duyệt → Nhập học)")
                    .description("Tỷ lệ nhập học hiện tại là 83%. Cần tư vấn proactive sau khi duyệt hồ sơ.")
                    .impact("Tiềm năng: +800 sinh viên nhập học")
                    .priority("MEDIUM")
                    .status("PENDING")
                    .category("CONVERSION_RATE")
                    .currentValue(83)
                    .targetValue(90)
                    .actionPlan("Gọi điện hỗ trợ trực tiếp và tổ chức các buổi tham quan Campus cho thí sinh đã trúng tuyển.")
                    .build());

                recommendationRepository.save(StrategicRecommendation.builder()
                    .title("Tối ưu quy trình xét duyệt hồ sơ")
                    .description("Thời gian xét duyệt trung bình 8 ngày. Đề xuất tự động hóa để rút ngắn xuống 5 ngày.")
                    .impact("Hiệu quả: xử lý nhanh hơn 37.5%")
                    .priority("MEDIUM")
                    .status("PENDING")
                    .category("PROCESS_OPT")
                    .currentValue(8)
                    .targetValue(5)
                    .actionPlan("Tích hợp tự động quét OCR học bạ và đối chiếu điểm số với cơ sở dữ liệu Bộ GD&ĐT.")
                    .build());
                
                System.out.println("[DB-MIGRATION] Seeded 4 strategic recommendations.");
            }

            if (riskRepository.count() == 0) {
                riskRepository.save(StrategicRisk.builder()
                    .level("HIGH")
                    .levelLabel("Rủi ro cao")
                    .levelBg("#FEE2E2")
                    .levelColor("#DC2626")
                    .title("Tỷ lệ nhập học thấp hơn kỳ vọng")
                    .description("Tỷ lệ nhập học hiện tại đạt 60%, thấp hơn mục tiêu đã ra là 75%. Sự sụt giảm tập trung ở các khối ngành kỹ thuật. Cần can thiệp ngay để đảm bảo chỉ tiêu năm học.")
                    .suggestion("Tăng cường tư vấn hậu kết quả và tổ chức Workshop trải nghiệm thực tế cho thí sinh.")
                    .suggestionColor("#16A34A")
                    .iconType("ALERT")
                    .status("ACTIVE")
                    .actionPlan("Tổ chức 5 buổi hội thảo công nghệ thông tin lớn tại Hà Nội và TP.HCM, gửi thư mời trực tiếp tới nhóm thí sinh tiềm năng.")
                    .build());

                riskRepository.save(StrategicRisk.builder()
                    .level("HIGH")
                    .levelLabel("Rủi ro cao")
                    .levelBg("#FEE2E2")
                    .levelColor("#DC2626")
                    .title("Cạnh tranh từ các trường ĐH khác")
                    .description("RMIT, Hutech và một số trường tư thục đang tích cực tuyển sinh, mở các gói học bổng hấp dẫn và truyền thông mạnh mẽ, ảnh hưởng trực tiếp đến tập thí sinh tiềm năng của FPT.")
                    .suggestion("Đẩy mạnh USP với cơ hội việc làm toàn cầu và Học bổng tài năng 100%.")
                    .suggestionColor("#2563EB")
                    .iconType("TREND")
                    .status("ACTIVE")
                    .actionPlan("Công bố chương trình FPT Global Talent, cam kết cơ hội thực tập tại Nhật Bản/Mỹ cho top 10% sinh viên xuất sắc.")
                    .build());

                riskRepository.save(StrategicRisk.builder()
                    .level("MEDIUM")
                    .levelLabel("Rủi ro vừa")
                    .levelBg("#FEF3C7")
                    .levelColor("#D97706")
                    .title("Phụ thuộc cao vào Facebook Ads")
                    .description("55% nguồn hồ sơ đến từ kênh Facebook. Đây là rủi ro lớn nếu thuật toán thay đổi hoặc chi phí CPM tăng đột ngột trong giai đoạn cao điểm tuyển sinh.")
                    .suggestion("Đa dạng hóa kênh marketing sang LinkedIn (B2B), TikTok và đẩy mạnh SEO content.")
                    .suggestionColor("#D97706")
                    .iconType("SHARE")
                    .status("ACTIVE")
                    .actionPlan("Chuyển dịch 20% ngân sách marketing sang xây dựng kênh TikTok học sinh chuyên và chạy quảng cáo định hướng nghề nghiệp trên LinkedIn.")
                    .build());

                riskRepository.save(StrategicRisk.builder()
                    .level("LOW")
                    .levelLabel("Rủi ro thấp")
                    .levelBg("#DCFCE7")
                    .levelColor("#16A34A")
                    .title("Thiếu hụt nhân viên tuyển sinh")
                    .description("Hiện còn 2 vị trí nhân viên tuyển sinh cần tuyển dụng bổ sung cho Q3. Tuy nhiên, đội ngũ hiện tại vẫn đang xử lý tốt khối lượng công việc.")
                    .suggestion("Tiến hành phỏng vấn khẩn cấp và triển khai chương trình đào tạo nhân viên thực tập.")
                    .suggestionColor("#16A34A")
                    .iconType("USERS")
                    .status("ACTIVE")
                    .actionPlan("Hợp tác với khoa Quản trị Kinh doanh tuyển 5 cộng tác viên thực tập hỗ trợ tư vấn học đường.")
                    .build());

                System.out.println("[DB-MIGRATION] Seeded 4 strategic risks.");
            }
        };
    }
}
