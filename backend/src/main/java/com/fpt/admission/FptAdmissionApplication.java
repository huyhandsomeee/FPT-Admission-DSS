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
    public org.springframework.boot.CommandLineRunner databaseCleanup(org.springframework.jdbc.core.JdbcTemplate jdbcTemplate) {
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
                // Also clean up gpa_10 and gpa_11 to NULL as requested
                jdbcTemplate.update(
                    "UPDATE academic_backgrounds SET gpa_10 = NULL, gpa_11 = NULL"
                );
                System.out.println("[DB-MIGRATION] Successfully sync'ed HOC_BA applications scores, min_score, and cleared gpa_10/11.");
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
