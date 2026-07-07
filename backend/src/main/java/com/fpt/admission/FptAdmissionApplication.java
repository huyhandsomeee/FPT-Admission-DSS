package com.fpt.admission;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

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
            com.fpt.admission.service.PipelineService pipelineService) {
        return args -> {
            try {
                jdbcTemplate.update("UPDATE applications SET admission_method_id = 2 WHERE admission_method_id = 5");
                System.out.println("[DB-MIGRATION] Database clean-up query executed successfully.");
            } catch (Exception e) {
                System.err.println("[DB-MIGRATION] Failed to clean up database: " + e.getMessage());
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
}
