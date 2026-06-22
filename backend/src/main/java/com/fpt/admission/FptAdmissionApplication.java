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
