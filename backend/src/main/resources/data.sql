-- ============================================================
-- FPT University Admission Management System - Seed Data
-- ============================================================

-- 1. Provinces
INSERT INTO provinces (id, name, code, region) VALUES
(1, 'Hà Nội', 'HN', 'NORTH'),
(2, 'TP. Hồ Chí Minh', 'SG', 'SOUTH'),
(3, 'Đà Nẵng', 'DN', 'CENTRAL'),
(4, 'Cần Thơ', 'CT', 'SOUTH'),
(5, 'Bình Định', 'BD', 'CENTRAL'),
(6, 'Hải Phòng', 'HP', 'NORTH');

-- 2. Campuses
INSERT INTO campuses (id, code, name, city, address, phone, email, is_active) VALUES
(1, 'FU-HL', 'FPT Hòa Lạc', 'Hà Nội', 'Khu Công nghệ cao Hòa Lạc, Thạch Thất, Hà Nội', '02473001866', 'daihocfpt@fpt.edu.vn', true),
(2, 'FU-HCM', 'FPT Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Lô E2a-7, Đường D1, Khu Công nghệ cao, TP Thủ Đức', '02873001866', 'daihocfpt.hcm@fpt.edu.vn', true),
(3, 'FU-DN', 'FPT Đà Nẵng', 'Đà Nẵng', 'Khu Đô thị FPT City, Ngũ Hành Sơn, Đà Nẵng', '02367300999', 'daihocfpt.dn@fpt.edu.vn', true),
(4, 'FU-CT', 'FPT Cần Thơ', 'Cần Thơ', 'Số 600 Đường Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ', '02927303636', 'daihocfpt.ct@fpt.edu.vn', true),
(5, 'FU-QN', 'FPT Quy Nhơn', 'Bình Định', 'Khu Đô thị An Phú Thịnh, Quy Nhơn, Bình Định', '02567300999', 'daihocfpt.qn@fpt.edu.vn', true);

-- 3. Majors
INSERT INTO majors (id, code, name, name_en, faculty, campus_id, quota, tuition_fee, is_active) VALUES
(1, 'SE', 'Kỹ thuật phần mềm', 'Software Engineering', 'IT', 1, 1500, 27300000, true),
(2, 'AI', 'Trí tuệ nhân tạo', 'Artificial Intelligence', 'IT', 1, 500, 27300000, true),
(3, 'IS', 'An toàn thông tin', 'Information Assurance', 'IT', 1, 300, 27300000, true),
(4, 'BA', 'Quản trị kinh doanh', 'Business Administration', 'Business', 1, 1200, 27300000, true),
(5, 'MK', 'Digital Marketing', 'Digital Marketing', 'Business', 1, 800, 27300000, true),
(6, 'MC', 'Truyền thông đa phương tiện', 'Multimedia Communication', 'Business', 1, 600, 27300000, true),
(7, 'GD', 'Thiết kế đồ họa', 'Graphic Design', 'Design', 1, 400, 27300000, true);

-- 4. Admission Methods
INSERT INTO admission_methods (id, code, name, description, min_score, priority_order, is_active) VALUES
(1, 'HOC_BA', 'Xét học bạ THPT', 'Xét tuyển dựa trên điểm học bạ THPT (SchoolRank Top 40)', 21.0, 1, true),
(2, 'THPT', 'Xét điểm thi THPT quốc gia', 'Xét tuyển dựa trên điểm thi tốt nghiệp THPT (SchoolRank Top 40)', 21.0, 2, true),
(3, 'DGNL', 'Xét điểm ĐGNL', 'Xét điểm Đánh giá năng lực của ĐHQG HN/HCM', 90.0, 3, true),
(4, 'SAT_IELTS', 'Chứng chỉ quốc tế', 'Xét tuyển bằng chứng chỉ IELTS (>= 6.0) hoặc SAT', 6.0, 4, true);

-- 5. Admission Years
INSERT INTO admission_years (id, year, name, start_date, end_date, quota_total, status) VALUES
(1, 2025, 'Tuyển sinh Đại học năm 2025', '2025-01-01', '2025-09-30', 15000, 'CLOSED'),
(2, 2026, 'Tuyển sinh Đại học năm 2026', '2026-01-01', '2026-09-30', 18000, 'ACTIVE'),
(3, 2027, 'Tuyển sinh Đại học năm 2027', '2027-01-01', '2027-09-30', 20000, 'UPCOMING');

-- 6. Document Types
INSERT INTO document_types (id, code, name, description, is_required) VALUES
(1, 'CCCD', 'Căn cước công dân', 'Bản sao CCCD 2 mặt', true),
(2, 'HOC_BA', 'Học bạ THPT', 'Bản sao học bạ 3 năm THPT', true),
(3, 'BANG_TN', 'Bằng/Giấy CNTN', 'Giấy chứng nhận tốt nghiệp tạm thời hoặc Bằng tốt nghiệp', true),
(4, 'CHUNG_CHI', 'Chứng chỉ quốc tế', 'Chứng chỉ IELTS/TOEFL/SAT nếu có', false),
(5, 'ANH_THE', 'Ảnh 3x4', 'Ảnh thẻ chụp không quá 6 tháng', true);

-- 7. Dummy Users (Passwords are all '1234' encrypted with BCrypt)
-- (assuming BCrypt rounds = 10, '$2a$10$8.UnVuG9HLda1Zim23O6Z.oF4Z4r1qT.3GZ.Bq8p8jQ.XhN.XhN.X')
INSERT INTO users (id, email, password_hash, full_name, role, is_active) VALUES
(1, 'student.a@fpt.edu.vn', '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Sinh viên A', 'STUDENT', true),
(2, 'officer.b@fpt.edu.vn', '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Cán bộ B', 'ADMISSION_OFFICER', true),
(3, 'manager.c@fpt.edu.vn', '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Trưởng phòng C', 'ADMISSION_MANAGER', true),
(4, 'bod.d@fpt.edu.vn', '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Ban giám hiệu D', 'BOD', true),
(5, 'admin@fpt.edu.vn', '$2a$10$.TAbLB9/FzvwP/hmD.rnPuWJoyX/i1FXDYMyJ6t/QRAg6kFY7V5nq', 'Quản trị viên', 'ADMIN', true);
