-- ============================================================
-- SEED DATA: 1000+ Mã hồ sơ tuyển sinh năm 2026
-- Chia đều theo ngành:
-- - SE (Kỹ thuật phần mềm): 350 hồ sơ
-- - AI (Trí tuệ nhân tạo): 100 hồ sơ
-- - IS (An toàn thông tin): 50 hồ sơ
-- - BA (Quản trị kinh doanh): 250 hồ sơ
-- - GD (Thiết kế đồ họa): 100 hồ sơ
-- - MC (Truyền thông đa phương tiện): 50 hồ sơ
-- - HT (Quản trị khách sạn): 50 hồ sơ
-- - FIN (Tài chính - Ngân hàng): 50 hồ sơ
-- Tổng: 1000 hồ sơ
-- ============================================================

USE fpt_admission;

-- Tạo procedure để generate 1000 applications
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS GenerateApplications()
BEGIN
    DECLARE v_counter INT DEFAULT 1;
    DECLARE v_major_id INT;
    DECLARE v_campus_id INT;
    DECLARE v_method_id INT;
    DECLARE v_status VARCHAR(30);
    DECLARE v_score DECIMAL(5,2);
    DECLARE v_submitted_at TIMESTAMP;
    DECLARE v_app_code VARCHAR(30);
    DECLARE v_major_code VARCHAR(10);
    DECLARE v_seq INT;
    
    -- Disable foreign key checks
    SET FOREIGN_KEY_CHECKS = 0;
    
    -- SE: 350 hồ sơ (major_id: 1, 8, 13, 16)
    WHILE v_counter <= 350 DO
        SET v_major_id = CASE (v_counter - 1) MOD 4
            WHEN 0 THEN 1
            WHEN 1 THEN 8
            WHEN 2 THEN 13
            ELSE 16
        END;
        
        SET v_campus_id = CASE v_major_id
            WHEN 1 THEN 1
            WHEN 8 THEN 2
            WHEN 13 THEN 3
            ELSE 4
        END;
        
        SET v_method_id = CASE (v_counter - 1) MOD 4
            WHEN 0 THEN 1
            WHEN 1 THEN 2
            WHEN 2 THEN 3
            ELSE 4
        END;
        
        SET v_status = CASE (v_counter - 1) MOD 6
            WHEN 0 THEN 'SUBMITTED'
            WHEN 1 THEN 'UNDER_REVIEW'
            WHEN 2 THEN 'APPROVED'
            WHEN 3 THEN 'REJECTED'
            WHEN 4 THEN 'ENROLLED'
            ELSE 'DRAFT'
        END;
        
        SET v_score = ROUND(6.0 + RAND() * 3.0, 2);
        SET v_submitted_at = DATE_ADD(NOW(), INTERVAL -FLOOR(RAND() * 30) DAY);
        SET v_seq = LPAD(v_counter, 4, '0');
        SET v_app_code = CONCAT('SE26', v_seq);
        
        INSERT IGNORE INTO applications 
        (application_code, student_profile_id, admission_year_id, campus_id, major_id, admission_method_id, 
         priority_number, total_score, status, submitted_at, created_at)
        VALUES 
        (v_app_code, (v_counter MOD 17) + 1, 3, v_campus_id, v_major_id, v_method_id, 
         1, v_score, v_status, v_submitted_at, v_submitted_at);
        
        SET v_counter = v_counter + 1;
    END WHILE;
    
    -- AI: 100 hồ sơ (major_id: 2, 9)
    SET v_counter = 1;
    WHILE v_counter <= 100 DO
        SET v_major_id = CASE (v_counter - 1) MOD 2
            WHEN 0 THEN 2
            ELSE 9
        END;
        
        SET v_campus_id = CASE v_major_id
            WHEN 2 THEN 1
            ELSE 2
        END;
        
        SET v_method_id = CASE (v_counter - 1) MOD 4
            WHEN 0 THEN 1
            WHEN 1 THEN 2
            WHEN 2 THEN 3
            ELSE 4
        END;
        
        SET v_status = CASE (v_counter - 1) MOD 6
            WHEN 0 THEN 'SUBMITTED'
            WHEN 1 THEN 'UNDER_REVIEW'
            WHEN 2 THEN 'APPROVED'
            WHEN 3 THEN 'REJECTED'
            WHEN 4 THEN 'ENROLLED'
            ELSE 'DRAFT'
        END;
        
        SET v_score = ROUND(6.5 + RAND() * 3.5, 2);
        SET v_submitted_at = DATE_ADD(NOW(), INTERVAL -FLOOR(RAND() * 30) DAY);
        SET v_seq = LPAD(v_counter, 4, '0');
        SET v_app_code = CONCAT('AI26', v_seq);
        
        INSERT IGNORE INTO applications 
        (application_code, student_profile_id, admission_year_id, campus_id, major_id, admission_method_id, 
         priority_number, total_score, status, submitted_at, created_at)
        VALUES 
        (v_app_code, (v_counter MOD 17) + 1, 3, v_campus_id, v_major_id, v_method_id, 
         1, v_score, v_status, v_submitted_at, v_submitted_at);
        
        SET v_counter = v_counter + 1;
    END WHILE;
    
    -- IS: 50 hồ sơ (major_id: 3)
    SET v_counter = 1;
    WHILE v_counter <= 50 DO
        SET v_major_id = 3;
        SET v_campus_id = 1;
        SET v_method_id = CASE (v_counter - 1) MOD 4
            WHEN 0 THEN 1
            WHEN 1 THEN 2
            WHEN 2 THEN 3
            ELSE 4
        END;
        
        SET v_status = CASE (v_counter - 1) MOD 6
            WHEN 0 THEN 'SUBMITTED'
            WHEN 1 THEN 'UNDER_REVIEW'
            WHEN 2 THEN 'APPROVED'
            WHEN 3 THEN 'REJECTED'
            WHEN 4 THEN 'ENROLLED'
            ELSE 'DRAFT'
        END;
        
        SET v_score = ROUND(7.0 + RAND() * 3.0, 2);
        SET v_submitted_at = DATE_ADD(NOW(), INTERVAL -FLOOR(RAND() * 30) DAY);
        SET v_seq = LPAD(v_counter, 4, '0');
        SET v_app_code = CONCAT('IS26', v_seq);
        
        INSERT IGNORE INTO applications 
        (application_code, student_profile_id, admission_year_id, campus_id, major_id, admission_method_id, 
         priority_number, total_score, status, submitted_at, created_at)
        VALUES 
        (v_app_code, (v_counter MOD 17) + 1, 3, v_campus_id, v_major_id, v_method_id, 
         1, v_score, v_status, v_submitted_at, v_submitted_at);
        
        SET v_counter = v_counter + 1;
    END WHILE;
    
    -- BA: 250 hồ sơ (major_id: 4, 10, 17)
    SET v_counter = 1;
    WHILE v_counter <= 250 DO
        SET v_major_id = CASE (v_counter - 1) MOD 3
            WHEN 0 THEN 4
            WHEN 1 THEN 10
            ELSE 17
        END;
        
        SET v_campus_id = CASE v_major_id
            WHEN 4 THEN 1
            WHEN 10 THEN 2
            ELSE 4
        END;
        
        SET v_method_id = CASE (v_counter - 1) MOD 4
            WHEN 0 THEN 1
            WHEN 1 THEN 2
            WHEN 2 THEN 3
            ELSE 4
        END;
        
        SET v_status = CASE (v_counter - 1) MOD 6
            WHEN 0 THEN 'SUBMITTED'
            WHEN 1 THEN 'UNDER_REVIEW'
            WHEN 2 THEN 'APPROVED'
            WHEN 3 THEN 'REJECTED'
            WHEN 4 THEN 'ENROLLED'
            ELSE 'DRAFT'
        END;
        
        SET v_score = ROUND(6.5 + RAND() * 3.5, 2);
        SET v_submitted_at = DATE_ADD(NOW(), INTERVAL -FLOOR(RAND() * 30) DAY);
        SET v_seq = LPAD(v_counter, 4, '0');
        SET v_app_code = CONCAT('BA26', v_seq);
        
        INSERT IGNORE INTO applications 
        (application_code, student_profile_id, admission_year_id, campus_id, major_id, admission_method_id, 
         priority_number, total_score, status, submitted_at, created_at)
        VALUES 
        (v_app_code, (v_counter MOD 17) + 1, 3, v_campus_id, v_major_id, v_method_id, 
         1, v_score, v_status, v_submitted_at, v_submitted_at);
        
        SET v_counter = v_counter + 1;
    END WHILE;
    
    -- GD: 100 hồ sơ (major_id: 7, 12)
    SET v_counter = 1;
    WHILE v_counter <= 100 DO
        SET v_major_id = CASE (v_counter - 1) MOD 2
            WHEN 0 THEN 7
            ELSE 12
        END;
        
        SET v_campus_id = CASE v_major_id
            WHEN 7 THEN 1
            ELSE 2
        END;
        
        SET v_method_id = CASE (v_counter - 1) MOD 4
            WHEN 0 THEN 1
            WHEN 1 THEN 2
            WHEN 2 THEN 3
            ELSE 4
        END;
        
        SET v_status = CASE (v_counter - 1) MOD 6
            WHEN 0 THEN 'SUBMITTED'
            WHEN 1 THEN 'UNDER_REVIEW'
            WHEN 2 THEN 'APPROVED'
            WHEN 3 THEN 'REJECTED'
            WHEN 4 THEN 'ENROLLED'
            ELSE 'DRAFT'
        END;
        
        SET v_score = ROUND(6.0 + RAND() * 3.0, 2);
        SET v_submitted_at = DATE_ADD(NOW(), INTERVAL -FLOOR(RAND() * 30) DAY);
        SET v_seq = LPAD(v_counter, 4, '0');
        SET v_app_code = CONCAT('GD26', v_seq);
        
        INSERT IGNORE INTO applications 
        (application_code, student_profile_id, admission_year_id, campus_id, major_id, admission_method_id, 
         priority_number, total_score, status, submitted_at, created_at)
        VALUES 
        (v_app_code, (v_counter MOD 17) + 1, 3, v_campus_id, v_major_id, v_method_id, 
         1, v_score, v_status, v_submitted_at, v_submitted_at);
        
        SET v_counter = v_counter + 1;
    END WHILE;
    
    -- MC: 50 hồ sơ (major_id: 6)
    SET v_counter = 1;
    WHILE v_counter <= 50 DO
        SET v_major_id = 6;
        SET v_campus_id = 1;
        SET v_method_id = CASE (v_counter - 1) MOD 4
            WHEN 0 THEN 1
            WHEN 1 THEN 2
            WHEN 2 THEN 3
            ELSE 4
        END;
        
        SET v_status = CASE (v_counter - 1) MOD 6
            WHEN 0 THEN 'SUBMITTED'
            WHEN 1 THEN 'UNDER_REVIEW'
            WHEN 2 THEN 'APPROVED'
            WHEN 3 THEN 'REJECTED'
            WHEN 4 THEN 'ENROLLED'
            ELSE 'DRAFT'
        END;
        
        SET v_score = ROUND(6.0 + RAND() * 3.0, 2);
        SET v_submitted_at = DATE_ADD(NOW(), INTERVAL -FLOOR(RAND() * 30) DAY);
        SET v_seq = LPAD(v_counter, 4, '0');
        SET v_app_code = CONCAT('MC26', v_seq);
        
        INSERT IGNORE INTO applications 
        (application_code, student_profile_id, admission_year_id, campus_id, major_id, admission_method_id, 
         priority_number, total_score, status, submitted_at, created_at)
        VALUES 
        (v_app_code, (v_counter MOD 17) + 1, 3, v_campus_id, v_major_id, v_method_id, 
         1, v_score, v_status, v_submitted_at, v_submitted_at);
        
        SET v_counter = v_counter + 1;
    END WHILE;
    
    -- HT: 50 hồ sơ (major_id: 15)
    SET v_counter = 1;
    WHILE v_counter <= 50 DO
        SET v_major_id = 15;
        SET v_campus_id = 3;
        SET v_method_id = CASE (v_counter - 1) MOD 4
            WHEN 0 THEN 1
            WHEN 1 THEN 2
            WHEN 2 THEN 3
            ELSE 4
        END;
        
        SET v_status = CASE (v_counter - 1) MOD 6
            WHEN 0 THEN 'SUBMITTED'
            WHEN 1 THEN 'UNDER_REVIEW'
            WHEN 2 THEN 'APPROVED'
            WHEN 3 THEN 'REJECTED'
            WHEN 4 THEN 'ENROLLED'
            ELSE 'DRAFT'
        END;
        
        SET v_score = ROUND(6.0 + RAND() * 3.0, 2);
        SET v_submitted_at = DATE_ADD(NOW(), INTERVAL -FLOOR(RAND() * 30) DAY);
        SET v_seq = LPAD(v_counter, 4, '0');
        SET v_app_code = CONCAT('HT26', v_seq);
        
        INSERT IGNORE INTO applications 
        (application_code, student_profile_id, admission_year_id, campus_id, major_id, admission_method_id, 
         priority_number, total_score, status, submitted_at, created_at)
        VALUES 
        (v_app_code, (v_counter MOD 17) + 1, 3, v_campus_id, v_major_id, v_method_id, 
         1, v_score, v_status, v_submitted_at, v_submitted_at);
        
        SET v_counter = v_counter + 1;
    END WHILE;
    
    -- FIN: 50 hồ sơ (major_id: 11)
    SET v_counter = 1;
    WHILE v_counter <= 50 DO
        SET v_major_id = 11;
        SET v_campus_id = 2;
        SET v_method_id = CASE (v_counter - 1) MOD 4
            WHEN 0 THEN 1
            WHEN 1 THEN 2
            WHEN 2 THEN 3
            ELSE 4
        END;
        
        SET v_status = CASE (v_counter - 1) MOD 6
            WHEN 0 THEN 'SUBMITTED'
            WHEN 1 THEN 'UNDER_REVIEW'
            WHEN 2 THEN 'APPROVED'
            WHEN 3 THEN 'REJECTED'
            WHEN 4 THEN 'ENROLLED'
            ELSE 'DRAFT'
        END;
        
        SET v_score = ROUND(6.5 + RAND() * 3.5, 2);
        SET v_submitted_at = DATE_ADD(NOW(), INTERVAL -FLOOR(RAND() * 30) DAY);
        SET v_seq = LPAD(v_counter, 4, '0');
        SET v_app_code = CONCAT('FIN26', v_seq);
        
        INSERT IGNORE INTO applications 
        (application_code, student_profile_id, admission_year_id, campus_id, major_id, admission_method_id, 
         priority_number, total_score, status, submitted_at, created_at)
        VALUES 
        (v_app_code, (v_counter MOD 17) + 1, 3, v_campus_id, v_major_id, v_method_id, 
         1, v_score, v_status, v_submitted_at, v_submitted_at);
        
        SET v_counter = v_counter + 1;
    END WHILE;
    
    -- Re-enable foreign key checks
    SET FOREIGN_KEY_CHECKS = 1;
    
    SELECT 'Đã tạo 1000 mã hồ sơ thành công!' AS message;
END$$

DELIMITER ;

-- Chạy procedure
CALL GenerateApplications();

-- Xóa procedure sau khi chạy
DROP PROCEDURE IF EXISTS GenerateApplications;

-- Verify: Kiểm tra số lượng hồ sơ theo ngành
SELECT 
    SUBSTRING(application_code, 1, 2) AS major_code,
    COUNT(*) AS total_applications,
    SUM(CASE WHEN status = 'SUBMITTED' THEN 1 ELSE 0 END) AS submitted,
    SUM(CASE WHEN status = 'UNDER_REVIEW' THEN 1 ELSE 0 END) AS under_review,
    SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) AS approved,
    SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) AS rejected,
    SUM(CASE WHEN status = 'ENROLLED' THEN 1 ELSE 0 END) AS enrolled
FROM applications
WHERE application_code LIKE '%26%'
GROUP BY SUBSTRING(application_code, 1, 2)
ORDER BY total_applications DESC;

-- Tổng số hồ sơ
SELECT COUNT(*) AS total_applications FROM applications;
