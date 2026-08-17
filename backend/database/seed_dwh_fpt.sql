-- ==============================================================================
-- FPT UNIVERSITY - DWH INITIAL SEED DATA
-- Populate 5 Campuses, Programs, Dimensions & Multi-Fact Records
-- ==============================================================================

-- 1. PROVINCES & LOCATIONS
INSERT INTO DIM_PROVINCE (province_key, province_code, province_name) VALUES
(1, 'HN', 'Hà Nội'),
(2, 'HCM', 'Hồ Chí Minh'),
(3, 'DN', 'Đà Nẵng'),
(4, 'CT', 'Cần Thơ'),
(5, 'QN', 'Bình Định (Quy Nhơn)')
ON DUPLICATE KEY UPDATE province_name=VALUES(province_name);

INSERT INTO DIM_DISTRICT (district_key, province_key, district_code, district_name) VALUES
(1, 1, 'TT', 'Thạch Thất (Khu CNC Hòa Lạc)'),
(2, 2, 'TD', 'TP. Thủ Đức (Khu CNC TP.HCM)'),
(3, 3, 'NHS', 'Ngũ Hành Sơn'),
(4, 4, 'NK', 'Ninh Kiều'),
(5, 5, 'QN', 'Thành phố Quy Nhơn')
ON DUPLICATE KEY UPDATE district_name=VALUES(district_name);

INSERT INTO DIM_LOCATION (location_key, province_key, district_key, full_address) VALUES
(1, 1, 1, 'Khu CNC Hòa Lạc, Km29 Đại lộ Thăng Long, Hà Nội'),
(2, 2, 2, 'Lô E2a-7, Đường D1 Khu CNC, TP. Thủ Đức, TP.HCM'),
(3, 3, 3, 'Khu đô thị FPT City, Ngũ Hành Sơn, Đà Nẵng'),
(4, 4, 4, 'Số 600 Đường Nguyễn Văn Cừ (nối dài), Cần Thơ'),
(5, 5, 5, 'Khu đô thị An Phú Thịnh, Quy Nhơn, Bình Định')
ON DUPLICATE KEY UPDATE full_address=VALUES(full_address);

-- 2. CAMPUSES
INSERT INTO DIM_CAMPUS (campus_key, campus_code, campus_name, location_key, campus_type) VALUES
(1, 'FU-HN', 'FPT University Hà Nội (Hòa Lạc)', 1, 'Main Campus'),
(2, 'FU-HCM', 'FPT University TP.HCM', 2, 'Branch Campus'),
(3, 'FU-DN', 'FPT University Đà Nẵng', 3, 'Branch Campus'),
(4, 'FU-CT', 'FPT University Cần Thơ', 4, 'Branch Campus'),
(5, 'FU-QN', 'FPT University Quy Nhơn (AI Campus)', 5, 'AI Special Campus')
ON DUPLICATE KEY UPDATE campus_name=VALUES(campus_name);

-- 3. FACULTIES & PROGRAMS
INSERT INTO DIM_FACULTY (faculty_key, faculty_code, faculty_name) VALUES
(1, 'FIT', 'Khoa Công Nghệ Thông Tin'),
(2, 'FBA', 'Khoa Quản Trị Kinh Doanh'),
(3, 'FDN', 'Khoa Thiết Kế & Mỹ Thuật Số'),
(4, 'FLA', 'Khoa Ngôn Ngữ & Văn Hóa')
ON DUPLICATE KEY UPDATE faculty_name=VALUES(faculty_name);

INSERT INTO DIM_PROGRAM (program_key, program_code, program_name, faculty_key, credit, duration) VALUES
(1, '7480103', 'Kỹ thuật Phần mềm (Software Engineering)', 1, 145, 4),
(2, '7480107', 'Trí tuệ Nhân tạo (Artificial Intelligence)', 1, 150, 4),
(3, '7480108', 'An toàn Thông tin (Information Assurance)', 1, 145, 4),
(4, '7340120', 'Thiết kế Vi mạch Bán dẫn (Semiconductor)', 1, 152, 4),
(5, '7340101', 'Quản trị Kinh doanh Quốc tế (International Business)', 2, 140, 4),
(6, '7210403', 'Thiết kế Mỹ thuật số (Digital Art & Design)', 3, 140, 4),
(7, '7220201', 'Ngôn ngữ Anh - Thương mại (Business English)', 4, 135, 4)
ON DUPLICATE KEY UPDATE program_name=VALUES(program_name);

-- 4. ADMISSION METHODS & STATUSES
INSERT INTO DIM_ADMISSION_METHOD (admission_method_key, method_code, method_name) VALUES
(1, 'THPT', 'Xét điểm thi Tốt nghiệp THPT Quốc gia'),
(2, 'SCHOOLRANK', 'Xét Học bạ THPT (Top 30 SchoolRank)'),
(3, 'DGNL', 'Xét điểm thi Đánh giá Năng lực (ĐHQG HN/TP.HCM)'),
(4, 'DIRECT', 'Tuyển thẳng theo Quy chế & Học bổng Tài năng')
ON DUPLICATE KEY UPDATE method_name=VALUES(method_name);

INSERT INTO DIM_STATUS (status_key, status_code, status_name) VALUES
(1, 'APPLIED', 'Đã nộp hồ sơ'),
(2, 'VERIFIED', 'Đã thẩm định học bạ'),
(3, 'OFFERED', 'Đã cấp giấy báo trúng tuyển'),
(4, 'ENROLLED', 'Đã hoàn tất nhập học'),
(5, 'WITHDRAWN', 'Đã rút hồ sơ')
ON DUPLICATE KEY UPDATE status_name=VALUES(status_name);

-- 5. SAMPLE FACT_ADMISSION (Dữ liệu phục vụ Báo cáo Tuyển sinh & Mô phỏng What-If DSS)
INSERT INTO FACT_ADMISSION (student_key, program_key, campus_key, date_key, admission_method_key, status_key, exam_score, priority_score, total_score, scholarship_amount, offer_result, enrollment_result, application_number) VALUES
(1, 1, 1, 20241015, 1, 4, 26.50, 0.50, 27.00, 30000000, 'Trúng tuyển', 'Đã nhập học', 'HS-2024-8912'),
(2, 2, 5, 20241015, 2, 4, 25.80, 0.00, 25.80, 50000000, 'Trúng tuyển', 'Đã nhập học', 'HS-2024-8913'),
(3, 4, 2, 20241016, 3, 4, 880.00, 20.00, 900.00, 70000000, 'Trúng tuyển', 'Đã nhập học', 'HS-2024-8914'),
(4, 5, 3, 20241016, 1, 4, 24.20, 0.00, 24.20, 0, 'Trúng tuyển', 'Đã nhập học', 'HS-2024-8915'),
(5, 1, 4, 20241017, 2, 4, 25.00, 1.00, 26.00, 30000000, 'Trúng tuyển', 'Đã nhập học', 'HS-2024-8916');
