-- ==============================================================================
-- FPT UNIVERSITY - DATA WAREHOUSE & DECISION SUPPORT SYSTEM (DWH DSS SCHEMA)
-- Star & Snowflake Schema Architecture for Admission, Learning, Finance, HR, LMS
-- ==============================================================================

-- ==============================================================================
-- 1. LOCATION & GEOGRAPHIC DIMENSIONS (Bông tuyết vị trí địa lý)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS DIM_PROVINCE (
    province_key INT PRIMARY KEY AUTO_INCREMENT,
    province_code VARCHAR(20) NOT NULL UNIQUE,
    province_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS DIM_DISTRICT (
    district_key INT PRIMARY KEY AUTO_INCREMENT,
    province_key INT NOT NULL,
    district_code VARCHAR(20) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (province_key) REFERENCES DIM_PROVINCE(province_key)
);

CREATE TABLE IF NOT EXISTS DIM_WARD (
    ward_key INT PRIMARY KEY AUTO_INCREMENT,
    district_key INT NOT NULL,
    ward_code VARCHAR(20) NOT NULL,
    ward_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (district_key) REFERENCES DIM_DISTRICT(district_key)
);

CREATE TABLE IF NOT EXISTS DIM_LOCATION (
    location_key INT PRIMARY KEY AUTO_INCREMENT,
    province_key INT NOT NULL,
    district_key INT,
    ward_key INT,
    full_address VARCHAR(255),
    FOREIGN KEY (province_key) REFERENCES DIM_PROVINCE(province_key),
    FOREIGN KEY (district_key) REFERENCES DIM_DISTRICT(district_key),
    FOREIGN KEY (ward_key) REFERENCES DIM_WARD(ward_key)
);

-- ==============================================================================
-- 2. TIME & DATE DIMENSION
-- ==============================================================================

CREATE TABLE IF NOT EXISTS DIM_DATE (
    date_key INT PRIMARY KEY,              -- Format YYYYMMDD (e.g. 20241015)
    full_date DATE NOT NULL,
    day INT NOT NULL,
    month_key INT NOT NULL,
    quarter_key INT NOT NULL,
    weekday_key INT NOT NULL,
    week INT NOT NULL,
    year INT NOT NULL,
    semester VARCHAR(20) NOT NULL,         -- Spring, Summer, Fall
    academic_year VARCHAR(20) NOT NULL,    -- 2023-2024, 2024-2025
    is_holiday BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS DIM_SEMESTER (
    semester_key INT PRIMARY KEY AUTO_INCREMENT,
    semester_code VARCHAR(30) NOT NULL UNIQUE,
    semester_name VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL
);

-- ==============================================================================
-- 3. ORGANIZATIONAL & ACADEMIC DIMENSIONS (Campus, Khoa, Ngành, Phòng ban)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS DIM_CAMPUS (
    campus_key INT PRIMARY KEY AUTO_INCREMENT,
    campus_code VARCHAR(20) NOT NULL UNIQUE,
    campus_name VARCHAR(100) NOT NULL,
    location_key INT,
    campus_type VARCHAR(50) DEFAULT 'Main Campus',
    FOREIGN KEY (location_key) REFERENCES DIM_LOCATION(location_key)
);

CREATE TABLE IF NOT EXISTS DIM_FACULTY (
    faculty_key INT PRIMARY KEY AUTO_INCREMENT,
    faculty_code VARCHAR(20) NOT NULL UNIQUE,
    faculty_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS DIM_PROGRAM (
    program_key INT PRIMARY KEY AUTO_INCREMENT,
    program_code VARCHAR(30) NOT NULL UNIQUE,
    program_name VARCHAR(150) NOT NULL,
    faculty_key INT NOT NULL,
    education_level VARCHAR(50) DEFAULT 'Đại học chính quy',
    training_type VARCHAR(50) DEFAULT 'Tín chỉ',
    credit INT DEFAULT 145,
    duration INT DEFAULT 4,
    FOREIGN KEY (faculty_key) REFERENCES DIM_FACULTY(faculty_key)
);

CREATE TABLE IF NOT EXISTS DIM_DEPARTMENT (
    department_key INT PRIMARY KEY AUTO_INCREMENT,
    department_code VARCHAR(30) NOT NULL UNIQUE,
    department_name VARCHAR(100) NOT NULL,
    faculty_key INT,
    FOREIGN KEY (faculty_key) REFERENCES DIM_FACULTY(faculty_key)
);

CREATE TABLE IF NOT EXISTS DIM_COURSE (
    course_key INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(30) NOT NULL UNIQUE,
    course_name VARCHAR(150) NOT NULL,
    department_key INT NOT NULL,
    credit INT DEFAULT 3,
    course_type VARCHAR(50) DEFAULT 'Bắt buộc',
    FOREIGN KEY (department_key) REFERENCES DIM_DEPARTMENT(department_key)
);

-- ==============================================================================
-- 4. ADMISSION & STUDENT DIMENSIONS (Thí sinh, Phương thức, Trạng thái)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS DIM_STATUS (
    status_key INT PRIMARY KEY AUTO_INCREMENT,
    status_code VARCHAR(30) NOT NULL UNIQUE,
    status_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS DIM_ADMISSION_METHOD (
    admission_method_key INT PRIMARY KEY AUTO_INCREMENT,
    method_code VARCHAR(30) NOT NULL UNIQUE,
    method_name VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS DIM_STUDENT (
    student_key INT PRIMARY KEY AUTO_INCREMENT,
    student_code VARCHAR(30) NOT NULL UNIQUE,
    citizen_id VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    location_key INT,
    religion_code VARCHAR(30) DEFAULT 'Không',
    priority_group VARCHAR(30) DEFAULT 'KV3',
    admission_year INT DEFAULT 2024,
    ethnicity_code VARCHAR(30) DEFAULT 'Kinh',
    current_status VARCHAR(50) DEFAULT 'Đang học',
    FOREIGN KEY (location_key) REFERENCES DIM_LOCATION(location_key)
);

-- ==============================================================================
-- 5. HUMAN RESOURCES & RESEARCH DIMENSIONS
-- ==============================================================================

CREATE TABLE IF NOT EXISTS DIM_POSITION (
    position_key INT PRIMARY KEY AUTO_INCREMENT,
    position_code VARCHAR(30) NOT NULL UNIQUE,
    position_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS DIM_EMPLOYEE (
    employee_key INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    department_key INT NOT NULL,
    position_key INT NOT NULL,
    gender VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    employment_status VARCHAR(50) DEFAULT 'Active',
    FOREIGN KEY (department_key) REFERENCES DIM_DEPARTMENT(department_key),
    FOREIGN KEY (position_key) REFERENCES DIM_POSITION(position_key)
);

CREATE TABLE IF NOT EXISTS DIM_LECTURER (
    lecturer_key INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    department_key INT NOT NULL,
    academic_rank VARCHAR(50) DEFAULT 'Giảng viên',
    degree VARCHAR(50) DEFAULT 'Thạc sĩ',
    FOREIGN KEY (department_key) REFERENCES DIM_DEPARTMENT(department_key)
);

CREATE TABLE IF NOT EXISTS DIM_PAYMENT (
    payment_key INT PRIMARY KEY AUTO_INCREMENT,
    payment_method VARCHAR(50) NOT NULL,  -- VNPAY, Momo, Chuyển khoản, Thẻ
    payment_status VARCHAR(50) NOT NULL,  -- Thành công, Đang xử lý, Thất bại
    payment_channel VARCHAR(50) NOT NULL  -- Trực tuyến, Tại quầy
);

CREATE TABLE IF NOT EXISTS DIM_LIBRARY_RESOURCE (
    resource_key INT PRIMARY KEY AUTO_INCREMENT,
    resource_code VARCHAR(50) NOT NULL UNIQUE,
    resource_name VARCHAR(200) NOT NULL,
    resource_type VARCHAR(50) DEFAULT 'Giáo trình điện tử',
    publisher VARCHAR(100),
    publication_year INT
);

CREATE TABLE IF NOT EXISTS DIM_RESEARCH_PROJECT (
    project_key INT PRIMARY KEY AUTO_INCREMENT,
    project_code VARCHAR(50) NOT NULL UNIQUE,
    project_name VARCHAR(255) NOT NULL,
    research_type VARCHAR(50) DEFAULT 'Đề tài cấp FPT',
    sponsor VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Đang thực hiện'
);

-- ==============================================================================
-- 6. FACT TABLES (CÁC BẢNG SỰ KIỆN TRỌNG TÂM DWH)
-- ==============================================================================

-- 1. FACT TUYỂN SINH & HỖ TRỢ RA QUYẾT ĐỊNH (FACT_ADMISSION)
CREATE TABLE IF NOT EXISTS FACT_ADMISSION (
    admission_fact_key BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_key INT NOT NULL,
    program_key INT NOT NULL,
    campus_key INT NOT NULL,
    date_key INT NOT NULL,
    admission_method_key INT NOT NULL,
    status_key INT NOT NULL,
    exam_score DECIMAL(5,2),
    priority_score DECIMAL(4,2) DEFAULT 0.00,
    total_score DECIMAL(5,2),
    scholarship_amount DECIMAL(15,2) DEFAULT 0.00,
    offer_result VARCHAR(50) DEFAULT 'Trúng tuyển',
    enrollment_result VARCHAR(50) DEFAULT 'Đã nhập học',
    application_number VARCHAR(50) NOT NULL,
    FOREIGN KEY (student_key) REFERENCES DIM_STUDENT(student_key),
    FOREIGN KEY (program_key) REFERENCES DIM_PROGRAM(program_key),
    FOREIGN KEY (campus_key) REFERENCES DIM_CAMPUS(campus_key),
    FOREIGN KEY (date_key) REFERENCES DIM_DATE(date_key),
    FOREIGN KEY (admission_method_key) REFERENCES DIM_ADMISSION_METHOD(admission_method_key),
    FOREIGN KEY (status_key) REFERENCES DIM_STATUS(status_key)
);

-- 2. FACT HỌC TẬP & KẾT QUẢ ĐÀO TẠO (FACT_LEARNING)
CREATE TABLE IF NOT EXISTS FACT_LEARNING (
    learning_fact_key BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_key INT NOT NULL,
    course_key INT NOT NULL,
    campus_key INT NOT NULL,
    date_key INT NOT NULL,
    lecturer_key INT NOT NULL,
    semester_key INT NOT NULL,
    attendance_rate DECIMAL(5,2) DEFAULT 100.00,
    assignment_score DECIMAL(4,2),
    midterm_score DECIMAL(4,2),
    final_score DECIMAL(4,2),
    gpa DECIMAL(4,2),
    credit_earned INT DEFAULT 3,
    learning_result VARCHAR(50) DEFAULT 'Đạt',
    FOREIGN KEY (student_key) REFERENCES DIM_STUDENT(student_key),
    FOREIGN KEY (course_key) REFERENCES DIM_COURSE(course_key),
    FOREIGN KEY (campus_key) REFERENCES DIM_CAMPUS(campus_key),
    FOREIGN KEY (date_key) REFERENCES DIM_DATE(date_key),
    FOREIGN KEY (lecturer_key) REFERENCES DIM_LECTURER(lecturer_key),
    FOREIGN KEY (semester_key) REFERENCES DIM_SEMESTER(semester_key)
);

-- 3. FACT TÀI CHÍNH & THU HỌC PHÍ (FACT_FINANCE)
CREATE TABLE IF NOT EXISTS FACT_FINANCE (
    finance_fact_key BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_key INT NOT NULL,
    payment_key INT NOT NULL,
    campus_key INT NOT NULL,
    date_key INT NOT NULL,
    tuition_fee DECIMAL(15,2) NOT NULL,
    scholarship DECIMAL(15,2) DEFAULT 0.00,
    discount DECIMAL(15,2) DEFAULT 0.00,
    paid_amount DECIMAL(15,2) NOT NULL,
    outstanding_amount DECIMAL(15,2) DEFAULT 0.00,
    payment_status VARCHAR(50) DEFAULT 'Đã hoàn thành',
    FOREIGN KEY (student_key) REFERENCES DIM_STUDENT(student_key),
    FOREIGN KEY (payment_key) REFERENCES DIM_PAYMENT(payment_key),
    FOREIGN KEY (campus_key) REFERENCES DIM_CAMPUS(campus_key),
    FOREIGN KEY (date_key) REFERENCES DIM_DATE(date_key)
);

-- 4. FACT HỆ THỐNG LMS & HỌC TRỰC TUYẾN (FACT_LMS)
CREATE TABLE IF NOT EXISTS FACT_LMS (
    lms_fact_key BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_key INT NOT NULL,
    course_key INT NOT NULL,
    activity_key INT NOT NULL DEFAULT 1,
    date_key INT NOT NULL,
    login_count INT DEFAULT 1,
    learning_time INT DEFAULT 120, -- Thời gian học tính bằng phút
    assignment_completed INT DEFAULT 1,
    quiz_score DECIMAL(4,2),
    FOREIGN KEY (student_key) REFERENCES DIM_STUDENT(student_key),
    FOREIGN KEY (course_key) REFERENCES DIM_COURSE(course_key),
    FOREIGN KEY (date_key) REFERENCES DIM_DATE(date_key)
);

-- 5. FACT THƯ VIỆN & TÀI NGUYÊN HỌC TẬP (FACT_LIBRARY)
CREATE TABLE IF NOT EXISTS FACT_LIBRARY (
    library_fact_key BIGINT PRIMARY KEY AUTO_INCREMENT,
    date_key INT NOT NULL,
    student_key INT NOT NULL,
    resource_key INT NOT NULL,
    borrow_count INT DEFAULT 1,
    return_count INT DEFAULT 1,
    overdue_day INT DEFAULT 0,
    fine_amount DECIMAL(12,2) DEFAULT 0.00,
    FOREIGN KEY (date_key) REFERENCES DIM_DATE(date_key),
    FOREIGN KEY (student_key) REFERENCES DIM_STUDENT(student_key),
    FOREIGN KEY (resource_key) REFERENCES DIM_LIBRARY_RESOURCE(resource_key)
);

-- 6. FACT NGHIÊN CỨU KHOA HỌC (FACT_RESEARCH)
CREATE TABLE IF NOT EXISTS FACT_RESEARCH (
    research_fact_key BIGINT PRIMARY KEY AUTO_INCREMENT,
    date_key INT NOT NULL,
    employee_key INT NOT NULL,
    project_key INT NOT NULL,
    budget DECIMAL(15,2) DEFAULT 0.00,
    publication_count INT DEFAULT 1,
    citation_count INT DEFAULT 0,
    project_progress DECIMAL(5,2) DEFAULT 100.00,
    FOREIGN KEY (date_key) REFERENCES DIM_DATE(date_key),
    FOREIGN KEY (employee_key) REFERENCES DIM_EMPLOYEE(employee_key),
    FOREIGN KEY (project_key) REFERENCES DIM_RESEARCH_PROJECT(project_key)
);

-- 7. FACT NHÂN SỰ & TIỀN LƯƠNG (FACT_HR)
CREATE TABLE IF NOT EXISTS FACT_HR (
    hr_fact_key BIGINT PRIMARY KEY AUTO_INCREMENT,
    date_key INT NOT NULL,
    employee_key INT NOT NULL,
    department_key INT NOT NULL,
    position_key INT NOT NULL,
    basic_salary DECIMAL(15,2) NOT NULL,
    allowance DECIMAL(15,2) DEFAULT 0.00,
    bonus DECIMAL(15,2) DEFAULT 0.00,
    insurance DECIMAL(15,2) DEFAULT 0.00,
    overtime_hour DECIMAL(4,1) DEFAULT 0.0,
    FOREIGN KEY (date_key) REFERENCES DIM_DATE(date_key),
    FOREIGN KEY (employee_key) REFERENCES DIM_EMPLOYEE(employee_key),
    FOREIGN KEY (department_key) REFERENCES DIM_DEPARTMENT(department_key),
    FOREIGN KEY (position_key) REFERENCES DIM_POSITION(position_key)
);
