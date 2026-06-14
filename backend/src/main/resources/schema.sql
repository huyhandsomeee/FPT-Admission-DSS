-- ============================================================
-- FPT University Admission Management System - Database Schema
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- Provinces
DROP TABLE IF EXISTS provinces;
CREATE TABLE provinces (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    region ENUM('NORTH', 'CENTRAL', 'SOUTH') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
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

-- Student Profiles
DROP TABLE IF EXISTS student_profiles;
CREATE TABLE student_profiles (
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

-- Academic Backgrounds
DROP TABLE IF EXISTS academic_backgrounds;
CREATE TABLE academic_backgrounds (
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

-- Admission Years
DROP TABLE IF EXISTS admission_years;
CREATE TABLE admission_years (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    year INT NOT NULL,
    name VARCHAR(200),
    start_date DATE,
    end_date DATE,
    quota_total INT DEFAULT 0,
    status ENUM('UPCOMING','ACTIVE','CLOSED') DEFAULT 'UPCOMING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campuses
DROP TABLE IF EXISTS campuses;
CREATE TABLE campuses (
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

-- Majors
DROP TABLE IF EXISTS majors;
CREATE TABLE majors (
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

-- Admission Methods
DROP TABLE IF EXISTS admission_methods;
CREATE TABLE admission_methods (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    min_score DECIMAL(5,2),
    priority_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications
DROP TABLE IF EXISTS applications;
CREATE TABLE applications (
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

-- Application Status History
DROP TABLE IF EXISTS application_status_history;
CREATE TABLE application_status_history (
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

-- Document Types
DROP TABLE IF EXISTS document_types;
CREATE TABLE document_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application Documents
DROP TABLE IF EXISTS application_documents;
CREATE TABLE application_documents (
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

-- Notifications
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
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

-- Audit Logs
DROP TABLE IF EXISTS audit_logs;
CREATE TABLE audit_logs (
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

-- Recruitment Channels
DROP TABLE IF EXISTS recruitment_channels;
CREATE TABLE recruitment_channels (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(30) UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Application Sources
DROP TABLE IF EXISTS application_sources;
CREATE TABLE application_sources (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id BIGINT NOT NULL,
    channel_id BIGINT,
    campaign_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (channel_id) REFERENCES recruitment_channels(id)
);

-- Password Reset OTP
DROP TABLE IF EXISTS password_reset_otps;
CREATE TABLE password_reset_otps (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SET FOREIGN_KEY_CHECKS = 1;
