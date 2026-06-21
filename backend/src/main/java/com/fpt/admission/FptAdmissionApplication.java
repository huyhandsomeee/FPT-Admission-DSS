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
        };
    }
}
