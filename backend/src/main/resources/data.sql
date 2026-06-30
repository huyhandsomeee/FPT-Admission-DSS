    -- ============================================================
    -- FPT University Admission Management System
    -- Database Setup Script (Run once in MySQL Workbench)
    -- Mật khẩu mặc định tất cả users: 1234
    -- Năm tuyển sinh hiện tại: 2026
    -- Cập nhật lần cuối: 2026-06-21
    -- ============================================================
    -- HƯỚNG DẪN:
    --   1. Mở MySQL Workbench, kết nối server
    --   2. Mở file này (File > Open SQL Script)
    --   3. Nhấn Ctrl+Shift+Enter để chạy toàn bộ
    --   4. Sau đó khởi động backend Spring Boot
    -- ============================================================
    -- LƯU Ý VỀ ĐỒNG BỘ USERS:
    --   - Users tạo mới qua API đăng ký sẽ được lưu trực tiếp vào database
    --   - File này chỉ là dữ liệu mẫu ban đầu (seed data)
    --   - Để xuất users hiện có ra file SQL, chạy lệnh sau trong MySQL Workbench:
    --     SELECT CONCAT("INSERT IGNORE INTO users (id,email,password_hash,full_name,phone,role,is_active) VALUES (",
    --            id,",''",email,"'',''",password_hash,"'',''",full_name,"'',''",IFNULL(phone,''),"'',''",role,"'',",is_active,");") 
    --     FROM users WHERE role='STUDENT' AND id > 25;
    -- ============================================================

    -- Tạo database nếu chưa tồn tại và chọn nó
    CREATE DATABASE IF NOT EXISTS fpt_admission
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_unicode_ci;

    USE fpt_admission;

    SET FOREIGN_KEY_CHECKS = 0;

    -- ============================================================
    -- SCHEMA (tạo bảng nếu chưa tồn tại)
    -- ============================================================

    CREATE TABLE IF NOT EXISTS provinces (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        code VARCHAR(10),
        region ENUM('NORTH', 'CENTRAL', 'SOUTH') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(200) NOT NULL,
        phone VARCHAR(20),
        avatar_url VARCHAR(500),
        role ENUM('STUDENT','ADMISSION_OFFICER','ADMISSION_MANAGER','BOD','ADMIN') NOT NULL DEFAULT 'STUDENT',
        is_active BOOLEAN DEFAULT TRUE,
        last_login_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS student_profiles (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL UNIQUE,
        student_code VARCHAR(20) UNIQUE,
        dob DATE,
        gender ENUM('MALE','FEMALE','OTHER'),
        ethnicity VARCHAR(100),
        permanent_address TEXT,
        current_address TEXT,
        province_id BIGINT,
        cccd_number VARCHAR(20),
        cccd_issue_date DATE,
        cccd_issue_place VARCHAR(200),
        parent_name VARCHAR(200),
        parent_phone VARCHAR(20),
        parent_email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (province_id) REFERENCES provinces(id)
    );

    CREATE TABLE IF NOT EXISTS academic_backgrounds (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        student_profile_id BIGINT NOT NULL,
        school_name VARCHAR(300),
        school_province_id BIGINT,
        graduation_year INT,
        gpa_10 DECIMAL(4,2),
        gpa_11 DECIMAL(4,2),
        gpa_12 DECIMAL(4,2),
        math_score DECIMAL(4,2),
        literature_score DECIMAL(4,2),
        english_score DECIMAL(4,2),
        total_score DECIMAL(5,2),
        sat_score INT,
        ielts_score DECIMAL(3,1),
        toefl_score INT,
        academic_achievement TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_profile_id) REFERENCES student_profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (school_province_id) REFERENCES provinces(id)
    );

    CREATE TABLE IF NOT EXISTS admission_years (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        year INT NOT NULL,
        name VARCHAR(200),
        start_date DATE,
        end_date DATE,
        quota_total INT DEFAULT 0,
        status ENUM('UPCOMING','ACTIVE','CLOSED') DEFAULT 'UPCOMING',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS campuses (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(10) NOT NULL UNIQUE,
        name VARCHAR(200) NOT NULL,
        city VARCHAR(100),
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS majors (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(20) NOT NULL,
        name VARCHAR(200) NOT NULL,
        name_en VARCHAR(200),
        faculty VARCHAR(200),
        campus_id BIGINT,
        quota INT DEFAULT 0,
        tuition_fee BIGINT DEFAULT 0,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (campus_id) REFERENCES campuses(id)
    );

    CREATE TABLE IF NOT EXISTS admission_methods (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        min_score DECIMAL(5,2),
        priority_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS applications (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        application_code VARCHAR(30) UNIQUE,
        student_profile_id BIGINT NOT NULL,
        admission_year_id BIGINT NOT NULL,
        campus_id BIGINT NOT NULL,
        major_id BIGINT NOT NULL,
        admission_method_id BIGINT NOT NULL,
        priority_number INT DEFAULT 1,
        total_score DECIMAL(5,2),
        status ENUM('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','ENROLLED') DEFAULT 'DRAFT',
        submitted_at TIMESTAMP NULL,
        reviewed_at TIMESTAMP NULL,
        reviewed_by BIGINT NULL,
        rejection_reason TEXT,
        officer_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_profile_id) REFERENCES student_profiles(id),
        FOREIGN KEY (admission_year_id) REFERENCES admission_years(id),
        FOREIGN KEY (campus_id) REFERENCES campuses(id),
        FOREIGN KEY (major_id) REFERENCES majors(id),
        FOREIGN KEY (admission_method_id) REFERENCES admission_methods(id),
        FOREIGN KEY (reviewed_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS application_status_history (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        application_id BIGINT NOT NULL,
        old_status VARCHAR(30),
        new_status VARCHAR(30) NOT NULL,
        changed_by BIGINT,
        reason TEXT,
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
        FOREIGN KEY (changed_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS document_types (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(20) NOT NULL UNIQUE,
        name VARCHAR(200) NOT NULL,
        description TEXT,
        is_required BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS application_documents (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        application_id BIGINT NOT NULL,
        document_type_id BIGINT NOT NULL,
        file_name VARCHAR(300),
        file_path VARCHAR(500),
        file_size BIGINT,
        mime_type VARCHAR(100),
        status ENUM('PENDING','VERIFIED','REJECTED') DEFAULT 'PENDING',
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified_by BIGINT NULL,
        verified_at TIMESTAMP NULL,
        rejection_reason TEXT,
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
        FOREIGN KEY (document_type_id) REFERENCES document_types(id),
        FOREIGN KEY (verified_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT NOT NULL,
        title VARCHAR(300) NOT NULL,
        message TEXT,
        type ENUM('ADMISSION_UPDATE','SYSTEM','RESULT','REMINDER','MESSAGE') DEFAULT 'SYSTEM',
        is_read BOOLEAN DEFAULT FALSE,
        related_entity_type VARCHAR(50),
        related_entity_id BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT,
        user_email VARCHAR(255),
        action VARCHAR(100) NOT NULL,
        entity_type VARCHAR(100),
        entity_id BIGINT,
        old_value JSON,
        new_value JSON,
        ip_address VARCHAR(50),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS recruitment_channels (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        code VARCHAR(30) UNIQUE,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE IF NOT EXISTS application_sources (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        application_id BIGINT NOT NULL,
        channel_id BIGINT,
        campaign_name VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
        FOREIGN KEY (channel_id) REFERENCES recruitment_channels(id)
    );

    CREATE TABLE IF NOT EXISTS password_reset_otps (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- ============================================================
    -- SEED DATA (INSERT IGNORE = bỏ qua nếu đã tồn tại)
    -- ============================================================

    -- 1. Provinces
    INSERT IGNORE INTO provinces (id, name, code, region) VALUES
    (1,  'Hà Nội',              'HN',  'NORTH'),
    (2,  'TP. Hồ Chí Minh',    'HCM', 'SOUTH'),
    (3,  'Đà Nẵng',             'DN',  'CENTRAL'),
    (4,  'Cần Thơ',             'CT',  'SOUTH'),
    (5,  'Bình Định',            'BD',  'CENTRAL'),
    (6,  'Hải Phòng',           'HP',  'NORTH'),
    (7,  'Hưng Yên',            'HY',  'NORTH'),
    (8,  'Nam Định',            'ND',  'NORTH'),
    (9,  'Thanh Hóa',           'TH',  'CENTRAL'),
    (10, 'Nghệ An',             'NA',  'CENTRAL'),
    (11, 'Hà Tĩnh',             'HT',  'CENTRAL'),
    (12, 'Quảng Bình',          'QB',  'CENTRAL'),
    (13, 'Thừa Thiên Huế',      'TTH', 'CENTRAL'),
    (14, 'Quảng Nam',           'QNM', 'CENTRAL'),
    (15, 'Quảng Ngãi',          'QNG', 'CENTRAL'),
    (16, 'Khánh Hòa',           'KH',  'CENTRAL'),
    (17, 'Đắk Lắk',             'DKL', 'CENTRAL'),
    (18, 'Lâm Đồng',            'LDG', 'CENTRAL'),
    (19, 'Đồng Nai',            'DNI', 'SOUTH'),
    (20, 'Bình Dương',          'BDG', 'SOUTH'),
    (21, 'Bà Rịa - Vũng Tàu',  'VT',  'SOUTH'),
    (22, 'Long An',             'LA',  'SOUTH'),
    (23, 'Tiền Giang',          'TG',  'SOUTH'),
    (24, 'An Giang',            'AG',  'SOUTH'),
    (25, 'Kiên Giang',          'KG',  'SOUTH');

    -- 2. Campuses
    INSERT IGNORE INTO campuses (id, code, name, city, address, phone, email, is_active) VALUES
    (1, 'FU-HL',  'FPT Hòa Lạc',       'Hà Nội',           'Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội',              '02473001866', 'daihocfpt@fpt.edu.vn',        true),
    (2, 'FU-HCM', 'FPT Hồ Chí Minh',   'TP. Hồ Chí Minh',  'Lô E2a-7, Đường D1, Khu Công nghệ cao, TP Thủ Đức',         '02873001866', 'daihocfpt.hcm@fpt.edu.vn',    true),
    (3, 'FU-DN',  'FPT Đà Nẵng',        'Đà Nẵng',           'Khu Đô thị FPT City, Ngũ Hành Sơn, Đà Nẵng',               '02367300999', 'daihocfpt.dn@fpt.edu.vn',     true),
    (4, 'FU-CT',  'FPT Cần Thơ',        'Cần Thơ',           'Số 600 Đường Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ',           '02927303636', 'daihocfpt.ct@fpt.edu.vn',     true),
    (5, 'FU-QN',  'FPT Quy Nhơn',       'Bình Định',         'Khu Đô thị An Phú Thịnh, Quy Nhơn, Bình Định',              '02567300999', 'daihocfpt.qn@fpt.edu.vn',     true);

    -- 3. Majors
    INSERT IGNORE INTO majors (id, code, name, name_en, faculty, campus_id, quota, tuition_fee, is_active) VALUES
    (1,  'SE',  'Kỹ thuật phần mềm',          'Software Engineering',      'CNTT',      1, 1500, 27300000, true),
    (2,  'AI',  'Trí tuệ nhân tạo',            'Artificial Intelligence',   'CNTT',      1,  500, 27300000, true),
    (3,  'IS',  'An toàn thông tin',            'Information Assurance',     'CNTT',      1,  300, 27300000, true),
    (4,  'BA',  'Quản trị kinh doanh',          'Business Administration',   'Kinh tế',   1, 1200, 27300000, true),
    (5,  'MK',  'Digital Marketing',            'Digital Marketing',         'Kinh tế',   1,  800, 27300000, true),
    (6,  'MC',  'Truyền thông đa phương tiện',  'Multimedia Communication',  'Thiết kế',  1,  600, 27300000, true),
    (7,  'GD',  'Thiết kế đồ họa',              'Graphic Design',            'Thiết kế',  1,  400, 27300000, true),
    (8,  'SE',  'Kỹ thuật phần mềm',          'Software Engineering',      'CNTT',      2, 2000, 27300000, true),
    (9,  'AI',  'Trí tuệ nhân tạo',            'Artificial Intelligence',   'CNTT',      2,  800, 27300000, true),
    (10, 'BA',  'Quản trị kinh doanh',          'Business Administration',   'Kinh tế',   2, 1500, 27300000, true),
    (11, 'FIN', 'Tài chính - Ngân hàng',        'Finance and Banking',       'Kinh tế',   2,  700, 27300000, true),
    (12, 'GD',  'Thiết kế đồ họa',              'Graphic Design',            'Thiết kế',  2,  500, 27300000, true),
    (13, 'SE',  'Kỹ thuật phần mềm',          'Software Engineering',      'CNTT',      3, 1000, 27300000, true),
    (14, 'BA',  'Quản trị kinh doanh',          'Business Administration',   'Kinh tế',   3,  800, 27300000, true),
    (15, 'HT',  'Quản trị khách sạn',           'Hotel Administration',      'Du lịch',   3,  400, 27300000, true),
    (16, 'SE',  'Kỹ thuật phần mềm',          'Software Engineering',      'CNTT',      4,  600, 27300000, true),
    (17, 'BA',  'Quản trị kinh doanh',          'Business Administration',   'Kinh tế',   4,  500, 27300000, true);

    -- 4. Admission Methods
    INSERT IGNORE INTO admission_methods (id, code, name, description, min_score, priority_order, is_active) VALUES
    (1, 'HOC_BA',    'Xét học bạ THPT',            'Xét tuyển dựa trên điểm học bạ THPT 3 năm',                       21.0, 1, true),
    (2, 'THPT',      'Xét điểm thi THPT quốc gia', 'Xét tuyển dựa trên điểm thi tốt nghiệp THPT',                    21.0, 2, false),
    (3, 'DGNL',      'Xét điểm ĐGNL',              'Xét điểm Đánh giá năng lực của ĐHQG HN/HCM',                      90.0, 3, true),
    (4, 'SAT_IELTS', 'Chứng chỉ quốc tế',          'Xét tuyển bằng chứng chỉ IELTS (>= 6.0) hoặc SAT (>= 1100)',      6.0, 4, true);

    -- 5. Admission Years
    INSERT IGNORE INTO admission_years (id, year, name, start_date, end_date, quota_total, status) VALUES
    (1, 2024, 'Tuyển sinh Đại học năm 2024', '2024-01-01', '2024-09-30', 12000, 'CLOSED'),
    (2, 2025, 'Tuyển sinh Đại học năm 2025', '2025-01-01', '2025-09-30', 15000, 'CLOSED'),
    (3, 2026, 'Tuyển sinh Đại học năm 2026', '2026-01-01', '2026-09-30', 18000, 'ACTIVE'),
    (4, 2027, 'Tuyển sinh Đại học năm 2027', '2027-01-01', '2027-09-30', 20000, 'UPCOMING');

    -- 6. Document Types
    INSERT IGNORE INTO document_types (id, code, name, description, is_required) VALUES
    (1, 'CCCD',      'Căn cước công dân',   'Bản sao CCCD 2 mặt có công chứng',                       true),
    (2, 'HOC_BA',    'Học bạ THPT',         'Bản sao học bạ 3 năm THPT có công chứng',                true),
    (3, 'BANG_TN',   'Bằng/Giấy CNTN',     'Giấy chứng nhận tốt nghiệp hoặc Bằng tốt nghiệp',       true),
    (4, 'CHUNG_CHI', 'Chứng chỉ quốc tế',  'Chứng chỉ IELTS/TOEFL/SAT nếu xét theo phương thức QT', false),
    (5, 'ANH_THE',   'Ảnh 3x4',            'Ảnh thẻ chụp trong vòng 6 tháng',                        true),
    (6, 'GK_THPT',   'Giấy khai sinh',     'Bản sao giấy khai sinh',                                  true),
    (7, 'HO_KHAU',   'Sổ hộ khẩu / KT3',  'Bản sao sổ hộ khẩu hoặc giấy KT3 (nếu có)',             false);

    -- 7. Recruitment Channels
    INSERT IGNORE INTO recruitment_channels (id, name, code, description, is_active) VALUES
    (1, 'Website FPT University', 'WEBSITE',  'Đăng ký qua trang web chính thức',       true),
    (2, 'Facebook Fanpage',       'FACEBOOK', 'Tư vấn và đăng ký qua Facebook',         true),
    (3, 'Hội nghị tuyển sinh',   'HNTV',     'Gặp gỡ tư vấn tuyển sinh trực tiếp',     true),
    (4, 'Giới thiệu từ bạn bè',  'REFERRAL', 'Được giới thiệu bởi sinh viên/bạn bè',   true),
    (5, 'Zalo OA',                'ZALO',     'Tư vấn qua Zalo Official Account',        true),
    (6, 'YouTube / TikTok',       'SOCIAL',   'Qua các kênh mạng xã hội video',         true),
    (7, 'Trường THPT đối tác',   'SCHOOL',   'Tư vấn trực tiếp tại trường THPT',       true);

    -- 8. Users (mật khẩu: 1234)
    INSERT IGNORE INTO users (id, email, password_hash, full_name, phone, role, is_active) VALUES
    (1,  'admin@fpt.edu.vn',        '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Quản trị viên Hệ thống', '0901000001', 'ADMIN',             true),
    (2,  'bod.nguyen@fpt.edu.vn',   '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Nguyễn Văn Đức',         '0901000002', 'BOD',               true),
    (3,  'bod.tran@fpt.edu.vn',     '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Trần Thị Hương',         '0901000003', 'BOD',               true),
    (4,  'manager.hl@fpt.edu.vn',   '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Lê Minh Quân',           '0901000004', 'ADMISSION_MANAGER', true),
    (5,  'manager.hcm@fpt.edu.vn',  '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Phạm Thu Hà',            '0901000005', 'ADMISSION_MANAGER', true),
    (6,  'officer.a@fpt.edu.vn',    '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Hoàng Văn An',           '0901000006', 'ADMISSION_OFFICER', true),
    (7,  'officer.b@fpt.edu.vn',    '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Đinh Thị Bình',          '0901000007', 'ADMISSION_OFFICER', true),
    (8,  'officer.c@fpt.edu.vn',    '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Vũ Quốc Cường',          '0901000008', 'ADMISSION_OFFICER', true),
    (9,  'nguyen.vana@gmail.com',   '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Nguyễn Văn A',           '0911001001', 'STUDENT',           true),
    (10, 'tran.thib@gmail.com',     '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Trần Thị B',             '0911001002', 'STUDENT',           true),
    (11, 'le.vanc@gmail.com',       '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Lê Văn C',               '0911001003', 'STUDENT',           true),
    (12, 'pham.thid@gmail.com',     '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Phạm Thị D',             '0911001004', 'STUDENT',           true),
    (13, 'hoang.vane@gmail.com',    '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Hoàng Văn E',            '0911001005', 'STUDENT',           true),
    (14, 'nguyen.thif@gmail.com',   '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Nguyễn Thị F',           '0911001006', 'STUDENT',           true),
    (15, 'do.vang@gmail.com',       '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Đỗ Văn G',               '0911001007', 'STUDENT',           true),
    (16, 'bui.thih@gmail.com',      '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Bùi Thị H',              '0911001008', 'STUDENT',           true),
    (17, 'duong.vani@gmail.com',    '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Dương Văn I',            '0911001009', 'STUDENT',           true),
    (18, 'phan.thij@gmail.com',     '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Phan Thị J',             '0911001010', 'STUDENT',           true),
    (19, 'vo.vank@gmail.com',       '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Võ Văn K',               '0911001011', 'STUDENT',           true),
    (20, 'ngo.thil@gmail.com',      '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Ngô Thị L',              '0911001012', 'STUDENT',           true),
    (21, 'trinh.vanm@gmail.com',    '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Trịnh Văn M',            '0911001013', 'STUDENT',           true),
    (22, 'cao.thin@gmail.com',      '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Cao Thị N',              '0911001014', 'STUDENT',           true),
    (23, 'dinh.vano@gmail.com',     '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Đinh Văn O',             '0911001015', 'STUDENT',           true),
    (24, 'vu.thip@gmail.com',       '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Vũ Thị P',               '0911001016', 'STUDENT',           true),
    (25, 'ly.vanq@gmail.com',       '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Lý Văn Q',               '0911001017', 'STUDENT',           true);

    -- 9. Student Profiles
    INSERT IGNORE INTO student_profiles (id, user_id, student_code, dob, gender, permanent_address, province_id, cccd_number, parent_name, parent_phone) VALUES
    (1,  9,  'TS2026001', '2007-03-15', 'MALE',   '12 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',     1, '001207001001', 'Nguyễn Văn Toàn', '0912000001'),
    (2,  10, 'TS2026002', '2007-07-22', 'FEMALE', '45 Nguyễn Huệ, Q1, TP. HCM',               2, '079207002002', 'Trần Văn Minh',   '0912000002'),
    (3,  11, 'TS2026003', '2007-11-08', 'MALE',   '88 Trần Phú, Hải Châu, Đà Nẵng',           3, '048207003003', 'Lê Văn Hùng',     '0912000003'),
    (4,  12, 'TS2026004', '2007-05-30', 'FEMALE', '22 Nguyễn Trãi, Ninh Kiều, Cần Thơ',       4, '092207004004', 'Phạm Văn Thành',  '0912000004'),
    (5,  13, 'TS2026005', '2007-09-14', 'MALE',   '5 Lê Lợi, TP. Quy Nhơn, Bình Định',        5, '052207005005', 'Hoàng Văn Bình',  '0912000005'),
    (6,  14, 'TS2026006', '2007-01-25', 'FEMALE', '77 Trần Hưng Đạo, Ngô Quyền, Hải Phòng',  6, '031207006006', 'Nguyễn Văn Lực',  '0912000006'),
    (7,  15, 'TS2026007', '2007-06-18', 'MALE',   '33 Bà Triệu, Hai Bà Trưng, Hà Nội',        1, '001207007007', 'Đỗ Văn Sáng',     '0912000007'),
    (8,  16, 'TS2026008', '2007-12-03', 'FEMALE', '99 Nguyễn Đình Chiểu, Bình Thạnh, HCM',   2, '079207008008', 'Bùi Văn Chính',   '0912000008'),
    (9,  17, 'TS2026009', '2007-04-10', 'MALE',   '15 Điện Biên Phủ, Thanh Khê, Đà Nẵng',    3, '048207009009', 'Dương Văn Hải',   '0912000009'),
    (10, 18, 'TS2026010', '2007-08-27', 'FEMALE', '44 Cách Mạng Tháng 8, Ninh Kiều, Cần Thơ',4, '092207010010', 'Phan Văn Khoa',   '0912000010'),
    (11, 19, 'TS2026011', '2007-02-14', 'MALE',   '60 Lê Duẩn, Đống Đa, Hà Nội',              1, '001207011011', 'Võ Văn Quý',      '0912000011'),
    (12, 20, 'TS2026012', '2007-10-19', 'FEMALE', '18 Phan Xích Long, Phú Nhuận, TP. HCM',    2, '079207012012', 'Ngô Văn Tốt',     '0912000012'),
    (13, 21, 'TS2026013', '2007-07-07', 'MALE',   '7 Hùng Vương, Hải Châu, Đà Nẵng',          3, '048207013013', 'Trịnh Văn Nam',   '0912000013'),
    (14, 22, 'TS2026014', '2007-03-28', 'FEMALE', '30 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ',    4, '092207014014', 'Cao Văn Lợi',     '0912000014'),
    (15, 23, 'TS2026015', '2007-11-11', 'MALE',   '55 Trần Quang Khải, Hà Nội',               1, '001207015015', 'Đinh Văn Phú',    '0912000015'),
    (16, 24, 'TS2026016', '2007-06-06', 'FEMALE', '123 Nguyễn Thị Thập, Q7, TP. HCM',        2, '079207016016', 'Vũ Văn Tài',      '0912000016'),
    (17, 25, 'TS2026017', '2007-09-09', 'MALE',   '9 Quang Trung, TP. Quy Nhơn, Bình Định',   5, '052207017017', 'Lý Văn Ân',       '0912000017');

    -- 10. Academic Backgrounds
    INSERT IGNORE INTO academic_backgrounds (id, student_profile_id, school_name, school_province_id, graduation_year, gpa_10, gpa_11, gpa_12, math_score, literature_score, english_score, total_score, ielts_score) VALUES
    (1,  1,  'THPT Chu Văn An',              1, 2026, 8.5, 8.7, 8.9, 8.5, 7.5, 9.0, 25.00, 7.0),
    (2,  2,  'THPT Lê Hồng Phong',          2, 2026, 7.8, 8.0, 8.2, 7.5, 8.0, 7.0, 22.50, NULL),
    (3,  3,  'THPT Trần Phú',               3, 2026, 8.0, 8.2, 8.5, 8.0, 7.0, 8.5, 23.50, NULL),
    (4,  4,  'THPT Châu Văn Liêm',          4, 2026, 7.5, 7.8, 8.0, 7.0, 7.5, 7.0, 21.50, NULL),
    (5,  5,  'THPT Quốc Học Quy Nhơn',      5, 2026, 9.0, 9.2, 9.3, 9.0, 8.5, 9.5, 27.00, 8.0),
    (6,  6,  'THPT Thái Phiên',             6, 2026, 8.2, 8.4, 8.6, 8.5, 7.8, 8.0, 24.30, NULL),
    (7,  7,  'THPT Việt Đức',               1, 2026, 7.2, 7.5, 7.8, 7.5, 7.0, 7.5, 22.00, NULL),
    (8,  8,  'THPT Marie Curie',            2, 2026, 8.8, 9.0, 9.1, 8.5, 8.8, 9.0, 26.30, 7.5),
    (9,  9,  'THPT Phan Châu Trinh',        3, 2026, 7.0, 7.2, 7.5, 7.0, 7.5, 6.5, 21.00, NULL),
    (10, 10, 'THPT Thủ Khoa Nghĩa',         4, 2026, 8.5, 8.7, 8.8, 8.0, 8.5, 8.0, 24.50, NULL),
    (11, 11, 'THPT Nguyễn Trãi',           1, 2026, 7.9, 8.1, 8.3, 8.0, 7.5, 8.0, 23.50, NULL),
    (12, 12, 'THPT Nguyễn Thị Minh Khai',  2, 2026, 9.2, 9.4, 9.5, 9.5, 9.0, 9.5, 28.00, 8.5),
    (13, 13, 'THPT Hoàng Hoa Thám',        3, 2026, 7.5, 7.7, 7.9, 7.5, 7.8, 7.0, 22.30, NULL),
    (14, 14, 'THPT Châu Thành',             4, 2026, 8.0, 8.2, 8.4, 8.0, 8.0, 7.5, 23.50, NULL),
    (15, 15, 'THPT Kim Liên',               1, 2026, 8.6, 8.8, 9.0, 9.0, 8.0, 8.5, 25.50, NULL),
    (16, 16, 'THPT Gia Định',               2, 2026, 7.3, 7.6, 7.8, 7.5, 7.5, 7.0, 22.00, NULL),
    (17, 17, 'THPT Quang Trung',            5, 2026, 8.3, 8.5, 8.7, 8.5, 8.0, 8.5, 25.00, NULL);

    -- 11. Applications
    INSERT IGNORE INTO applications (id, application_code, student_profile_id, admission_year_id, campus_id, major_id, admission_method_id, priority_number, total_score, status, submitted_at, reviewed_at, reviewed_by, officer_notes) VALUES
    (1,  'SE260001',  1,  3, 1, 1,  1, 1, 25.00, 'APPROVED',     '2026-03-01 09:00:00', '2026-03-05 14:30:00', 6, 'Hồ sơ đầy đủ, điểm tốt'),
    (2,  'SE260002',  2,  3, 2, 8,  2, 1, 22.50, 'UNDER_REVIEW', '2026-03-03 10:15:00', NULL,                  NULL, NULL),
    (3,  'SE260003',  3,  3, 3, 13, 1, 1, 23.50, 'SUBMITTED',    '2026-03-05 11:30:00', NULL,                  NULL, NULL),
    (4,  'SE260004',  4,  3, 4, 16, 2, 1, 21.50, 'REJECTED',     '2026-03-02 08:45:00', '2026-03-06 09:00:00', 7, 'Điểm chưa đủ yêu cầu'),
    (5,  'AI260001',  5,  3, 1, 2,  3, 1, 27.00, 'ENROLLED',     '2026-02-28 14:00:00', '2026-03-04 10:00:00', 6, 'Xuất sắc, ưu tiên nhập học'),
    (6,  'SE260005',  6,  3, 1, 1,  3, 1, 24.30, 'APPROVED',     '2026-03-04 09:30:00', '2026-03-08 11:00:00', 6, 'Hồ sơ đầy đủ, đạt yêu cầu'),
    (7,  'SE260006',  7,  3, 1, 1,  2, 2, 22.00, 'SUBMITTED',    '2026-03-06 13:00:00', NULL,                  NULL, NULL),
    (8,  'SE260007',  8,  3, 2, 8,  4, 1, 26.30, 'APPROVED',     '2026-03-01 10:30:00', '2026-03-07 14:00:00', 7, 'IELTS cao, hồ sơ tốt'),
    (9,  'SE260008',  9,  3, 3, 13, 2, 2, 21.00, 'UNDER_REVIEW', '2026-03-07 08:00:00', NULL,                  NULL, NULL),
    (10, 'SE260009',  10, 3, 4, 16, 1, 1, 24.50, 'SUBMITTED',    '2026-03-08 15:00:00', NULL,                  NULL, NULL),
    (11, 'SE260010',  11, 3, 1, 1,  1, 1, 23.50, 'UNDER_REVIEW', '2026-03-09 09:00:00', NULL,                  NULL, NULL),
    (12, 'BA260001',  12, 3, 2, 10, 4, 1, 28.00, 'ENROLLED',     '2026-02-25 10:00:00', '2026-03-01 09:00:00', 7, 'IELTS 8.5, học lực xuất sắc'),
    (13, 'HT260001',  13, 3, 3, 15, 2, 1, 22.30, 'SUBMITTED',    '2026-03-10 11:00:00', NULL,                  NULL, NULL),
    (14, 'BA260002',  14, 3, 4, 17, 1, 1, 23.50, 'APPROVED',     '2026-03-03 14:30:00', '2026-03-09 10:00:00', 8, 'Đạt yêu cầu'),
    (15, 'SE260011',  15, 3, 1, 1,  1, 1, 25.50, 'UNDER_REVIEW', '2026-03-05 08:30:00', NULL,                  NULL, NULL),
    (16, 'GD260001',  16, 3, 2, 12, 1, 1, 22.00, 'REJECTED',     '2026-03-04 10:00:00', '2026-03-10 15:00:00', 8, 'Thiếu học bạ năm lớp 10'),
    (17, 'AI260002',  17, 3, 5, 2,  3, 1, 25.00, 'SUBMITTED',    '2026-03-11 09:00:00', NULL,                  NULL, NULL);

    -- 12. Application Status History
    INSERT IGNORE INTO application_status_history (id, application_id, old_status, new_status, changed_by, reason) VALUES
    (1,  1,  'DRAFT',        'SUBMITTED',    9,  NULL),
    (2,  1,  'SUBMITTED',    'UNDER_REVIEW', 6,  NULL),
    (3,  1,  'UNDER_REVIEW', 'APPROVED',     6,  'Hồ sơ đầy đủ, điểm tốt'),
    (4,  2,  'DRAFT',        'SUBMITTED',    10, NULL),
    (5,  2,  'SUBMITTED',    'UNDER_REVIEW', 7,  NULL),
    (6,  3,  'DRAFT',        'SUBMITTED',    11, NULL),
    (7,  4,  'DRAFT',        'SUBMITTED',    12, NULL),
    (8,  4,  'SUBMITTED',    'UNDER_REVIEW', 7,  NULL),
    (9,  4,  'UNDER_REVIEW', 'REJECTED',     7,  'Điểm chưa đủ yêu cầu xét tuyển'),
    (10, 5,  'DRAFT',        'SUBMITTED',    13, NULL),
    (11, 5,  'SUBMITTED',    'UNDER_REVIEW', 6,  NULL),
    (12, 5,  'UNDER_REVIEW', 'APPROVED',     6,  'Xuất sắc'),
    (13, 5,  'APPROVED',     'ENROLLED',     6,  'Xác nhận nhập học'),
    (14, 6,  'DRAFT',        'SUBMITTED',    14, NULL),
    (15, 6,  'SUBMITTED',    'UNDER_REVIEW', 6,  NULL),
    (16, 6,  'UNDER_REVIEW', 'APPROVED',     6,  'Đạt yêu cầu'),
    (17, 8,  'DRAFT',        'SUBMITTED',    16, NULL),
    (18, 8,  'SUBMITTED',    'UNDER_REVIEW', 7,  NULL),
    (19, 8,  'UNDER_REVIEW', 'APPROVED',     7,  'IELTS cao, hồ sơ tốt'),
    (20, 12, 'DRAFT',        'SUBMITTED',    20, NULL),
    (21, 12, 'SUBMITTED',    'UNDER_REVIEW', 7,  NULL),
    (22, 12, 'UNDER_REVIEW', 'APPROVED',     7,  'IELTS 8.5'),
    (23, 12, 'APPROVED',     'ENROLLED',     7,  'Nhập học'),
    (24, 14, 'DRAFT',        'SUBMITTED',    22, NULL),
    (25, 14, 'SUBMITTED',    'UNDER_REVIEW', 8,  NULL),
    (26, 14, 'UNDER_REVIEW', 'APPROVED',     8,  'Đạt yêu cầu'),
    (27, 16, 'DRAFT',        'SUBMITTED',    24, NULL),
    (28, 16, 'SUBMITTED',    'UNDER_REVIEW', 8,  NULL),
    (29, 16, 'UNDER_REVIEW', 'REJECTED',     8,  'Thiếu học bạ năm lớp 10');

    -- 13. Application Documents
    INSERT IGNORE INTO application_documents (id, application_id, document_type_id, file_name, status, verified_by) VALUES
    (1,  1, 1, 'cccd_nguyen_van_a.pdf',     'VERIFIED', 6),
    (2,  1, 2, 'hoc_ba_nguyen_van_a.pdf',   'VERIFIED', 6),
    (3,  1, 3, 'bang_tn_nva.pdf',           'VERIFIED', 6),
    (4,  1, 5, 'anh_the_nva.jpg',           'VERIFIED', 6),
    (5,  2, 1, 'cccd_tran_thi_b.pdf',       'VERIFIED', 7),
    (6,  2, 2, 'hoc_ba_tran_thi_b.pdf',     'PENDING',  NULL),
    (7,  2, 5, 'anh_the_ttb.jpg',           'PENDING',  NULL),
    (8,  5, 1, 'cccd_hoang_van_e.pdf',      'VERIFIED', 6),
    (9,  5, 2, 'hoc_ba_hve.pdf',            'VERIFIED', 6),
    (10, 5, 3, 'bang_tn_hve.pdf',           'VERIFIED', 6),
    (11, 5, 4, 'ielts_hve.pdf',             'VERIFIED', 6),
    (12, 5, 5, 'anh_the_hve.jpg',           'VERIFIED', 6),
    (13, 8, 1, 'cccd_bui_thi_h.pdf',        'VERIFIED', 7),
    (14, 8, 2, 'hoc_ba_bth.pdf',            'VERIFIED', 7),
    (15, 8, 4, 'ielts_bth.pdf',             'VERIFIED', 7),
    (16, 8, 5, 'anh_the_bth.jpg',           'VERIFIED', 7),
    (17, 16,1, 'cccd_vu_thi_p.pdf',         'VERIFIED', 8),
    (18, 16,2, 'hoc_ba_vtp_partial.pdf',    'REJECTED', 8),
    (19, 16,5, 'anh_the_vtp.jpg',           'VERIFIED', 8);

    -- 14. Notifications
    INSERT IGNORE INTO notifications (id, user_id, title, message, type, is_read, related_entity_type, related_entity_id) VALUES
    (1,  9,  'Hồ sơ đã được duyệt',          'Chúc mừng! Hồ sơ SE260001 của bạn đã được chấp thuận.',      'RESULT',           true,  'APPLICATION', 1),
    (2,  13, 'Hồ sơ đã được duyệt',          'Chúc mừng! Hồ sơ AI260001 đã được duyệt và nhập học.',       'RESULT',           true,  'APPLICATION', 5),
    (3,  12, 'Hồ sơ bị từ chối',             'Hồ sơ SE260004 chưa đạt yêu cầu xét tuyển.',                 'RESULT',           false, 'APPLICATION', 4),
    (4,  10, 'Hồ sơ đang được xét duyệt',    'Hồ sơ SE260002 đang được xem xét. Vui lòng chờ kết quả.',    'ADMISSION_UPDATE', false, 'APPLICATION', 2),
    (5,  20, 'Hồ sơ đã được duyệt',          'Chúc mừng! Hồ sơ BA260001 của bạn đã được chấp thuận.',      'RESULT',           true,  'APPLICATION', 12),
    (6,  6,  'Có hồ sơ mới cần xét duyệt',   '3 hồ sơ mới vừa được nộp và cần xem xét.',                       'REMINDER',         false, NULL,          NULL),
    (7,  7,  'Có hồ sơ mới cần xét duyệt',   '2 hồ sơ mới vừa được nộp và cần xem xét.',                       'REMINDER',         true,  NULL,          NULL),
    (8,  9,  'Nhắc nhở: Bổ sung tài liệu',   'Vui lòng kiểm tra và bổ sung đầy đủ tài liệu cho hồ sơ.',       'REMINDER',         true,  'APPLICATION', 1),
    (9,  4,  'Báo cáo tháng 3/2026',          'Báo cáo tình hình tuyển sinh tháng 3 đã sẵn sàng.',              'SYSTEM',           false, NULL,          NULL),
    (10, 24, 'Hồ sơ bị từ chối',             'Hồ sơ GD260001 bị từ chối do thiếu học bạ năm lớp 10.',       'RESULT',           false, 'APPLICATION', 16);

    -- 15. Application Sources
    INSERT IGNORE INTO application_sources (id, application_id, channel_id, campaign_name) VALUES
    (1,  1,  1, 'Tuyển sinh 2026 - Online'),
    (2,  2,  2, 'FPT Open Day HCM 2026'),
    (3,  3,  3, 'Hội nghị tuyển sinh Đà Nẵng'),
    (4,  4,  5, 'Zalo Tuyển sinh 2026'),
    (5,  5,  1, 'Tuyển sinh 2026 - Website'),
    (6,  6,  7, 'THPT đối tác Hà Nội'),
    (7,  7,  4, 'Giới thiệu bạn bè'),
    (8,  8,  1, 'Tuyển sinh 2026 - Online'),
    (9,  9,  6, 'TikTok FPT University'),
    (10, 10, 5, 'Zalo Tuyển sinh 2026'),
    (11, 11, 2, 'Facebook FPT University'),
    (12, 12, 1, 'Website FPT University'),
    (13, 13, 3, 'Hội thảo tuyển sinh DN'),
    (14, 14, 4, 'Giới thiệu từ anh/chị'),
    (15, 15, 7, 'THPT đối tác Hà Nội'),
    (16, 16, 2, 'FPT Open Day HCM'),
    (17, 17, 1, 'Website tuyển sinh');

    -- 16. Audit Logs
    INSERT IGNORE INTO audit_logs (id, user_id, user_email, action, entity_type, entity_id, ip_address) VALUES
    (1,  6,  'officer.a@fpt.edu.vn', 'APPROVE_APPLICATION', 'APPLICATION', 1,  '192.168.1.10'),
    (2,  7,  'officer.b@fpt.edu.vn', 'REJECT_APPLICATION',  'APPLICATION', 4,  '192.168.1.11'),
    (3,  6,  'officer.a@fpt.edu.vn', 'APPROVE_APPLICATION', 'APPLICATION', 5,  '192.168.1.10'),
    (4,  6,  'officer.a@fpt.edu.vn', 'ENROLL_APPLICATION',  'APPLICATION', 5,  '192.168.1.10'),
    (5,  1,  'admin@fpt.edu.vn',     'CREATE_USER',          'USER',        25, '192.168.1.1'),
    (6,  7,  'officer.b@fpt.edu.vn', 'APPROVE_APPLICATION', 'APPLICATION', 8,  '192.168.1.11'),
    (7,  7,  'officer.b@fpt.edu.vn', 'APPROVE_APPLICATION', 'APPLICATION', 12, '192.168.1.11'),
    (8,  7,  'officer.b@fpt.edu.vn', 'ENROLL_APPLICATION',  'APPLICATION', 12, '192.168.1.11'),
    (9,  8,  'officer.c@fpt.edu.vn', 'APPROVE_APPLICATION', 'APPLICATION', 14, '192.168.1.12'),
    (10, 8,  'officer.c@fpt.edu.vn', 'REJECT_APPLICATION',  'APPLICATION', 16, '192.168.1.12');

    -- ============================================================
    -- 17. High Schools (Trường THPT theo tỉnh/thành phố)
    -- ============================================================
    CREATE TABLE IF NOT EXISTS high_schools (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(300) NOT NULL,
        school_type ENUM('PUBLIC','PRIVATE') DEFAULT 'PUBLIC',
        province_id BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (province_id) REFERENCES provinces(id)
    );

    -- Hà Nội (province_id = 1)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (1, 'THPT Chu Văn An', 'PUBLIC', 1),
    (2, 'THPT Kim Liên', 'PUBLIC', 1),
    (3, 'THPT Phan Đình Phùng', 'PUBLIC', 1),
    (4, 'THPT Việt Đức', 'PUBLIC', 1),
    (5, 'THPT Trần Phú - Hoàn Kiếm', 'PUBLIC', 1),
    (6, 'THPT Nguyễn Huệ', 'PUBLIC', 1),
    (7, 'THPT Sơn Tây', 'PUBLIC', 1),
    (8, 'THPT Hoàng Văn Thụ', 'PUBLIC', 1),
    (9, 'THPT Cầu Giấy', 'PUBLIC', 1),
    (10, 'THPT Yên Hòa', 'PUBLIC', 1),
    (11, 'THPT Lương Thế Vinh', 'PRIVATE', 1),
    (12, 'THPT FPT', 'PRIVATE', 1),
    (13, 'THPT Đoàn Thị Điểm', 'PRIVATE', 1),
    (14, 'THPT Nguyễn Siêu', 'PRIVATE', 1),
    (15, 'THPT Marie Curie Hà Nội', 'PRIVATE', 1);

    -- TP. Hồ Chí Minh (province_id = 2)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (16, 'THPT Lê Hồng Phong', 'PUBLIC', 2),
    (17, 'THPT Bùi Thị Xuân', 'PUBLIC', 2),
    (18, 'THPT Nguyễn Thị Minh Khai', 'PUBLIC', 2),
    (19, 'THPT Trần Đại Nghĩa', 'PUBLIC', 2),
    (20, 'THPT Nguyễn Thượng Hiền', 'PUBLIC', 2),
    (21, 'THPT Gia Định', 'PUBLIC', 2),
    (22, 'THPT Mạc Đĩnh Chi', 'PUBLIC', 2),
    (23, 'THPT Nguyễn Hữu Huân', 'PUBLIC', 2),
    (24, 'THPT Thủ Đức', 'PUBLIC', 2),
    (25, 'THPT Marie Curie TP.HCM', 'PUBLIC', 2),
    (26, 'THPT Hoa Sen', 'PRIVATE', 2),
    (27, 'THPT Nguyễn Khuyến', 'PRIVATE', 2),
    (28, 'THPT Trần Hưng Đạo - TPHCM', 'PRIVATE', 2),
    (29, 'THPT Vinschool Grand Park', 'PRIVATE', 2),
    (30, 'THPT Quốc tế Á Châu (AIS)', 'PRIVATE', 2);

    -- Đà Nẵng (province_id = 3)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (31, 'THPT Phan Châu Trinh', 'PUBLIC', 3),
    (32, 'THPT Trần Phú - Đà Nẵng', 'PUBLIC', 3),
    (33, 'THPT Hoàng Hoa Thám', 'PUBLIC', 3),
    (34, 'THPT Nguyễn Trãi - Đà Nẵng', 'PUBLIC', 3),
    (35, 'THPT Thái Phiên', 'PUBLIC', 3),
    (36, 'THPT Ngô Quyền - Đà Nẵng', 'PUBLIC', 3),
    (37, 'THPT FPT Đà Nẵng', 'PRIVATE', 3),
    (38, 'THPT Nguyễn Khuyến - Đà Nẵng', 'PRIVATE', 3);

    -- Cần Thơ (province_id = 4)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (39, 'THPT Châu Văn Liêm', 'PUBLIC', 4),
    (40, 'THPT Lý Tự Trọng - Cần Thơ', 'PUBLIC', 4),
    (41, 'THPT Thực hành Sư phạm', 'PUBLIC', 4),
    (42, 'THPT Phan Ngọc Hiển', 'PUBLIC', 4),
    (43, 'THPT Bùi Hữu Nghĩa', 'PUBLIC', 4),
    (44, 'THPT Nguyễn Việt Hồng', 'PUBLIC', 4),
    (45, 'THPT Quốc tế Nam Cần Thơ', 'PRIVATE', 4);

    -- Bình Định (province_id = 5)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (46, 'THPT Quốc học Quy Nhơn', 'PUBLIC', 5),
    (47, 'THPT Trần Cao Vân', 'PUBLIC', 5),
    (48, 'THPT Nguyễn Thái Học', 'PUBLIC', 5),
    (49, 'THPT Lê Lợi - Bình Định', 'PUBLIC', 5),
    (50, 'THPT Nguyễn Diêu', 'PUBLIC', 5),
    (51, 'THPT Chu Văn An - Bình Định', 'PRIVATE', 5);

    -- Hải Phòng (province_id = 6)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (52, 'THPT Trần Nguyên Hãn', 'PUBLIC', 6),
    (53, 'THPT Ngô Quyền - Hải Phòng', 'PUBLIC', 6),
    (54, 'THPT Lê Quý Đôn - Hải Phòng', 'PUBLIC', 6),
    (55, 'THPT Thái Phiên - Hải Phòng', 'PUBLIC', 6),
    (56, 'THPT Marie Curie Hải Phòng', 'PUBLIC', 6),
    (57, 'THPT Quốc tế Hải Phòng', 'PRIVATE', 6);

    -- Hưng Yên (province_id = 7)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (58, 'THPT Hưng Yên', 'PUBLIC', 7),
    (59, 'THPT Ân Thi', 'PUBLIC', 7),
    (60, 'THPT Văn Giang', 'PUBLIC', 7),
    (61, 'THPT Mỹ Hào', 'PUBLIC', 7),
    (62, 'THPT Trần Quang Khải - Hưng Yên', 'PRIVATE', 7);

    -- Nam Định (province_id = 8)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (63, 'THPT Trần Hưng Đạo - Nam Định', 'PUBLIC', 8),
    (64, 'THPT Lê Quý Đôn - Nam Định', 'PUBLIC', 8),
    (65, 'THPT Nguyễn Khuyến - Nam Định', 'PUBLIC', 8),
    (66, 'THPT Trần Văn Lan', 'PUBLIC', 8),
    (67, 'THPT Nguyễn Huệ - Nam Định', 'PUBLIC', 8);

    -- Thanh Hóa (province_id = 9)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (68, 'THPT Lam Sơn', 'PUBLIC', 9),
    (69, 'THPT Đào Duy Từ - Thanh Hóa', 'PUBLIC', 9),
    (70, 'THPT Hàm Rồng', 'PUBLIC', 9),
    (71, 'THPT Triệu Sơn', 'PUBLIC', 9),
    (72, 'THPT Ba Đình - Thanh Hóa', 'PUBLIC', 9);

    -- Nghệ An (province_id = 10)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (73, 'THPT Phan Bội Châu', 'PUBLIC', 10),
    (74, 'THPT Huỳnh Thúc Kháng', 'PUBLIC', 10),
    (75, 'THPT Lê Viết Thuật', 'PUBLIC', 10),
    (76, 'THPT Nguyễn Trường Tộ', 'PUBLIC', 10),
    (77, 'THPT Đô Lương', 'PUBLIC', 10);

    -- Hà Tĩnh (province_id = 11)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (78, 'THPT Phan Đình Phùng - Hà Tĩnh', 'PUBLIC', 11),
    (79, 'THPT Hà Huy Tập', 'PUBLIC', 11),
    (80, 'THPT Trần Phú - Hà Tĩnh', 'PUBLIC', 11),
    (81, 'THPT Lê Quý Đôn - Hà Tĩnh', 'PUBLIC', 11);

    -- Quảng Bình (province_id = 12)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (82, 'THPT Đào Duy Từ - Quảng Bình', 'PUBLIC', 12),
    (83, 'THPT Lệ Thủy', 'PUBLIC', 12),
    (84, 'THPT Đồng Hới', 'PUBLIC', 12),
    (85, 'THPT Quảng Trạch', 'PUBLIC', 12);

    -- Thừa Thiên Huế (province_id = 13)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (86, 'THPT Quốc học Huế', 'PUBLIC', 13),
    (87, 'THPT Hai Bà Trưng - Huế', 'PUBLIC', 13),
    (88, 'THPT Nguyễn Huệ - Huế', 'PUBLIC', 13),
    (89, 'THPT Gia Hội', 'PUBLIC', 13),
    (90, 'THPT Phú Bài', 'PUBLIC', 13);

    -- Quảng Nam (province_id = 14)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (91, 'THPT Trần Quý Cáp', 'PUBLIC', 14),
    (92, 'THPT Sào Nam', 'PUBLIC', 14),
    (93, 'THPT Nguyễn Duy Hiệu', 'PUBLIC', 14),
    (94, 'THPT Huỳnh Thúc Kháng - Quảng Nam', 'PUBLIC', 14);

    -- Quảng Ngãi (province_id = 15)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (95, 'THPT Trần Quốc Tuấn - Quảng Ngãi', 'PUBLIC', 15),
    (96, 'THPT Lê Trung Đình', 'PUBLIC', 15),
    (97, 'THPT Bình Sơn', 'PUBLIC', 15),
    (98, 'THPT Võ Nguyên Giáp - Quảng Ngãi', 'PUBLIC', 15);

    -- Khánh Hòa (province_id = 16)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (99, 'THPT Lý Tự Trọng - Nha Trang', 'PUBLIC', 16),
    (100, 'THPT Nguyễn Văn Trỗi', 'PUBLIC', 16),
    (101, 'THPT Hoàng Văn Thụ - Khánh Hòa', 'PUBLIC', 16),
    (102, 'THPT Ninh Hòa', 'PUBLIC', 16);

    -- Đắk Lắk (province_id = 17)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (103, 'THPT Buôn Ma Thuột', 'PUBLIC', 17),
    (104, 'THPT Nguyễn Bỉnh Khiêm - Đắk Lắk', 'PUBLIC', 17),
    (105, 'THPT Lê Quý Đôn - Đắk Lắk', 'PUBLIC', 17),
    (106, 'THPT Krông Bông', 'PUBLIC', 17);

    -- Lâm Đồng (province_id = 18)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (107, 'THPT Trần Phú - Đà Lạt', 'PUBLIC', 18),
    (108, 'THPT Bùi Thị Xuân - Đà Lạt', 'PUBLIC', 18),
    (109, 'THPT Đà Lạt', 'PUBLIC', 18),
    (110, 'THPT Bảo Lộc', 'PUBLIC', 18);

    -- Đồng Nai (province_id = 19)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (111, 'THPT Ngô Quyền - Biên Hòa', 'PUBLIC', 19),
    (112, 'THPT Trấn Biên', 'PUBLIC', 19),
    (113, 'THPT Long Khánh', 'PUBLIC', 19),
    (114, 'THPT Lê Quý Đôn - Đồng Nai', 'PUBLIC', 19),
    (115, 'THPT iSchool Biên Hòa', 'PRIVATE', 19);

    -- Bình Dương (province_id = 20)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (116, 'THPT Trịnh Hoài Đức', 'PUBLIC', 20),
    (117, 'THPT Võ Minh Đức', 'PUBLIC', 20),
    (118, 'THPT Dĩ An', 'PUBLIC', 20),
    (119, 'THPT Bình Phú', 'PUBLIC', 20),
    (120, 'THPT Bình Dương', 'PRIVATE', 20);

    -- Bà Rịa - Vũng Tàu (province_id = 21)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (121, 'THPT Vũng Tàu', 'PUBLIC', 21),
    (122, 'THPT Châu Thành - BR-VT', 'PUBLIC', 21),
    (123, 'THPT Xuyên Mộc', 'PUBLIC', 21),
    (124, 'THPT Nguyễn Huệ - Vũng Tàu', 'PUBLIC', 21);

    -- Long An (province_id = 22)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (125, 'THPT Long An', 'PUBLIC', 22),
    (126, 'THPT Nguyễn Hữu Thọ', 'PUBLIC', 22),
    (127, 'THPT Đức Hòa', 'PUBLIC', 22),
    (128, 'THPT Bến Lức', 'PUBLIC', 22);

    -- Tiền Giang (province_id = 23)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (129, 'THPT Nguyễn Đình Chiểu - Tiền Giang', 'PUBLIC', 23),
    (130, 'THPT Trương Định', 'PUBLIC', 23),
    (131, 'THPT Gò Công', 'PUBLIC', 23),
    (132, 'THPT Cai Lậy', 'PUBLIC', 23);

    -- An Giang (province_id = 24)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (133, 'THPT Thoại Ngọc Hầu', 'PUBLIC', 24),
    (134, 'THPT Chau Phu', 'PUBLIC', 24),
    (135, 'THPT Long Xuyên', 'PUBLIC', 24),
    (136, 'THPT Nguyễn Quang Diêu', 'PUBLIC', 24);

    -- Kiên Giang (province_id = 25)
    INSERT IGNORE INTO high_schools (id, name, school_type, province_id) VALUES
    (137, 'THPT Nguyễn Trung Trực', 'PUBLIC', 25),
    (138, 'THPT Rạch Giá', 'PUBLIC', 25),
    (139, 'THPT Hà Tiên', 'PUBLIC', 25),
    (140, 'THPT Phú Quốc', 'PUBLIC', 25);

    SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- MIGRATION: Cập nhật mã hồ sơ cũ sang format mới
-- Format: {MAJOR_CODE}{COHORT}{SEQUENTIAL}
-- Ví dụ: SE260001 (SE + 26 + 0001)
-- Chạy section này nếu DB đã có data cũ dạng FPT2026-xxx / APP2026xxxxxx
-- ============================================================

-- Migration: Update application_code to new format
SET @row_se := 0, @row_ai := 0, @row_ba := 0, @row_gd := 0, @row_ht := 0, @row_mc := 0, @row_is := 0, @row_mk := 0, @row_fin := 0;

UPDATE applications a
JOIN majors m ON a.major_id = m.id
JOIN admission_years ay ON a.admission_year_id = ay.id
SET a.application_code = CONCAT(
    m.code,
    RIGHT(ay.year, 2),
    LPAD(
      CASE m.code
        WHEN 'SE'  THEN (@row_se  := @row_se  + 1)
        WHEN 'AI'  THEN (@row_ai  := @row_ai  + 1)
        WHEN 'BA'  THEN (@row_ba  := @row_ba  + 1)
        WHEN 'GD'  THEN (@row_gd  := @row_gd  + 1)
        WHEN 'HT'  THEN (@row_ht  := @row_ht  + 1)
        WHEN 'MC'  THEN (@row_mc  := @row_mc  + 1)
        WHEN 'IS'  THEN (@row_is  := @row_is  + 1)
        WHEN 'MK'  THEN (@row_mk  := @row_mk  + 1)
        WHEN 'FIN' THEN (@row_fin := @row_fin + 1)
        ELSE 1
      END
    , 4, '0')
)
WHERE a.application_code LIKE 'FPT%' OR a.application_code LIKE 'APP%'
ORDER BY a.created_at ASC;

-- Verify migration
SELECT id, application_code, status, created_at
FROM applications
ORDER BY created_at;

