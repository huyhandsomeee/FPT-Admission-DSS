import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Database, Server, Layers, Table, RefreshCw, Download, CheckCircle2,
  Cpu, HardDrive, Key, ArrowRight, ShieldCheck, Activity, Search,
  Play, FileCode, CheckCircle, BarChart3, Users, DollarSign,
  GraduationCap, BookOpen, FlaskConical, LayoutGrid, Clock
} from "lucide-react";
import { DWH_DIMENSIONS, DWH_FACTS, getDWHSummaryMetrics } from "../../services/dwhService";

export default function DataWarehouseStudio() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("schema"); // schema | query | etl | dictionary
  const [selectedTable, setSelectedTable] = useState("FACT_ADMISSION");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Danh mục 7 FACT TABLES & 14 DIMENSION TABLES theo sơ đồ người dùng cung cấp
  const factTables = [
    { name: "FACT_ADMISSION", desc: "Dữ liệu Sự kiện Tuyển sinh & Trúng tuyển", icon: Users, color: "#EA580C", records: "145,280", size: "18.4 MB", columns: ["admission_fact_key", "student_key", "program_key", "campus_key", "date_key", "admission_method_key", "status_key", "exam_score", "priority_score", "total_score", "scholarship_amount", "offer_result", "enrollment_result", "application_number"] },
    { name: "FACT_LEARNING", desc: "Dữ liệu Điểm số, Chuyên cần & Học tập", icon: GraduationCap, color: "#2563EB", records: "680,420", size: "84.2 MB", columns: ["learning_fact_key", "student_key", "course_key", "campus_key", "date_key", "lecturer_key", "semester_key", "attendance_rate", "assignment_score", "midterm_score", "final_score", "gpa", "credit_earned", "learning_result"] },
    { name: "FACT_FINANCE", desc: "Dữ liệu Thu học phí & Giao dịch tài chính", icon: DollarSign, color: "#16A34A", records: "312,000", size: "42.0 MB", columns: ["finance_fact_key", "student_key", "payment_key", "campus_key", "date_key", "tuition_fee", "scholarship", "discount", "paid_amount", "outstanding_amount", "payment_status"] },
    { name: "FACT_LMS", desc: "Dữ liệu Hành vi Học tập trực tuyến LMS", icon: Activity, color: "#9333EA", records: "1,450,000", size: "192.5 MB", columns: ["lms_fact_key", "student_key", "course_key", "activity_key", "date_key", "login_count", "learning_time", "assignment_completed", "quiz_score"] },
    { name: "FACT_LIBRARY", desc: "Dữ liệu Mượn trả & Thư viện số", icon: BookOpen, color: "#0284C7", records: "95,400", size: "12.8 MB", columns: ["library_fact_key", "date_key", "student_key", "resource_key", "borrow_count", "return_count", "overdue_day", "fine_amount"] },
    { name: "FACT_RESEARCH", desc: "Dữ liệu Đề tài NCKH & Công bố Scopus", icon: FlaskConical, color: "#D97706", records: "4,200", size: "1.2 MB", columns: ["research_fact_key", "date_key", "employee_key", "project_key", "budget", "publication_count", "citation_count", "project_progress"] },
    { name: "FACT_HR", desc: "Dữ liệu Nhân sự, Biên chế & Tiền lương", icon: Users, color: "#DC2626", records: "28,600", size: "4.6 MB", columns: ["hr_fact_key", "date_key", "employee_key", "department_key", "position_key", "basic_salary", "allowance", "bonus", "insurance", "overtime_hour"] },
  ];

  const dimTables = [
    { name: "DIM_STUDENT", type: "Entity Dimension", keys: "student_key (PK)", desc: "Hồ sơ Thí sinh & Sinh viên (CCCD, Họ tên, Giới tính, Năm tuyển sinh)" },
    { name: "DIM_CAMPUS", type: "Org Dimension", keys: "campus_key (PK)", desc: "5 Phân hiệu (Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ, Quy Nhơn)" },
    { name: "DIM_PROGRAM", type: "Academic Dimension", keys: "program_key (PK)", desc: "Chương trình Đào tạo & Khối ngành tuyển sinh" },
    { name: "DIM_FACULTY", type: "Org Dimension", keys: "faculty_key (PK)", desc: "Khoa đào tạo (CNTT, QTKD, Mỹ thuật số, Ngôn ngữ)" },
    { name: "DIM_DATE", type: "Time Dimension", keys: "date_key (PK)", desc: "Chiều thời gian (Ngày, Tháng, Quý, Năm, Học kỳ)" },
    { name: "DIM_SEMESTER", type: "Time Dimension", keys: "semester_key (PK)", desc: "Học kỳ (Spring, Summer, Fall) theo Năm học" },
    { name: "DIM_LOCATION", type: "Snowflake Location", keys: "location_key (PK)", desc: "Địa chỉ chi tiết (Tỉnh/Thành, Quận/Huyện, Phường/Xã)" },
    { name: "DIM_PROVINCE", type: "Geographic Dimension", keys: "province_key (PK)", desc: "Tỉnh / Thành phố toàn quốc" },
    { name: "DIM_ADMISSION_METHOD", type: "Method Dimension", keys: "admission_method_key (PK)", desc: "Phương thức tuyển sinh (THPT, SchoolRank, ĐGNL, Tuyển thẳng)" },
    { name: "DIM_STATUS", type: "Status Dimension", keys: "status_key (PK)", desc: "Trạng thái hồ sơ tuyển sinh & học vụ" },
    { name: "DIM_EMPLOYEE", type: "HR Dimension", keys: "employee_key (PK)", desc: "Cán bộ / Giảng viên Đại học FPT" },
    { name: "DIM_DEPARTMENT", type: "Org Dimension", keys: "department_key (PK)", desc: "Phòng ban chức năng (Tuyển sinh, Đào tạo, Tài chính, CTSV)" },
    { name: "DIM_COURSE", type: "Academic Dimension", keys: "course_key (PK)", desc: "Môn học trong khung chương trình tín chỉ" },
    { name: "DIM_PAYMENT", type: "Finance Dimension", keys: "payment_key (PK)", desc: "Phương thức & Kênh thanh toán học phí" },
  ];

  const currentFact = factTables.find(f => f.name === selectedTable) || factTables[0];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#0F172A" }}>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: "fixed", top: 20, right: 28, zIndex: 9999, background: "#0F172A", color: "#FFFFFF", padding: "12px 20px", borderRadius: 10, boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600 }}>
          <CheckCircle size={16} color="#4ADE80" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header style={{ height: 62, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: 900, fontSize: 16 }}>
            <Database size={20} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#9A3412", lineHeight: 1.15 }}>
              Kiến Trúc Kho Dữ Liệu Tập Trung (FPT Enterprise Data Warehouse)
            </div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, marginTop: 1 }}>
              Mô hình Star & Snowflake Schema • Tích hợp Dữ liệu Đa Phân hệ & Hệ thống Ra Quyết Định (DSS)
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => showToast("Đã kích hoạt tiến trình ETL Pipeline đồng bộ dữ liệu lúc " + new Date().toLocaleTimeString("vi-VN"))}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, background: "#9A3412", color: "#FFF", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            <RefreshCw size={14} /> Chạy ETL Pipeline
          </button>
          <button
            onClick={() => navigate("/bod/dashboard")}
            style={{ padding: "7px 14px", borderRadius: 8, background: "#0F172A", color: "#FFF", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            Trở về BOD Portal
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 28px 48px" }}>

        {/* 4 Thẻ KPI Tình trạng Kho Dữ Liệu */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>TỔNG BẢNG SỰ KIỆN (FACT TABLES)</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#EA580C" }}>7 Bảng Fact</div>
            <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 600, marginTop: 4 }}>Tuyển sinh, Học tập, Tài chính, LMS, HR, NCKH, Thư viện</div>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>BẢNG CHIỀU DỮ LIỆU (DIMENSIONS)</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#2563EB" }}>14 Bảng Dim</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>Thí sinh, Campus, Ngành học, Khoa, Địa phương...</div>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>TỔNG BẢN GHI SỰ KIỆN (DATA LAKE)</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#10B981" }}>2,725,900</div>
            <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 600, marginTop: 4 }}>Dung lượng: 356.9 MB • Tốc độ truy vấn: 0.04s</div>
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", marginBottom: 4 }}>TRẠNG THÁI ĐỒNG BỘ DWH (ETL STATUS)</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#16A34A", display: "flex", alignItems: "center", gap: 6, margin: "2px 0" }}>
              <CheckCircle2 size={24} color="#16A34A" /> REALTIME
            </div>
            <div style={{ fontSize: 11, color: "#64748B" }}>Tự động làm mới mỗi 15 phút từ 5 Cơ sở</div>
          </div>
        </div>

        {/* 2 Cột: Danh sách Fact & Trực quan hóa Cấu trúc Bảng */}
        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>

          {/* Cột Trái: Danh sách 7 Fact Tables */}
          <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px" }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: "#0F172A", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <Layers size={16} color="#EA580C" /> 7 BẢNG SỰ KIỆN CHÍNH (FACTS)
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {factTables.map((f) => {
                const isSelected = selectedTable === f.name;
                return (
                  <button
                    key={f.name}
                    onClick={() => setSelectedTable(f.name)}
                    style={{
                      padding: "12px 14px", borderRadius: 8, textAlign: "left",
                      border: isSelected ? `2px solid ${f.color}` : "1px solid #E2E8F0",
                      background: isSelected ? "#FFF7ED" : "#FFFFFF", cursor: "pointer",
                      display: "flex", flexDirection: "column", gap: 3, transition: "all 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ fontSize: 13, color: f.color, fontFamily: "monospace" }}>{f.name}</strong>
                      <span style={{ fontSize: 10.5, fontWeight: 700, background: "#F1F5F9", padding: "1px 6px", borderRadius: 4, color: "#475569" }}>
                        {f.records} dòng
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "#64748B" }}>{f.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Link tải Schema SQL DDL */}
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #F1F5F9" }}>
              <button
                onClick={() => showToast("Đã tải về mã nguồn SQL Schema DDL (schema_dwh_fpt.sql)")}
                style={{ width: "100%", padding: "9px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", fontSize: 11.5, fontWeight: 700, color: "#0F172A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <Download size={14} /> Tải Schema DDL (SQL Script)
              </button>
            </div>
          </div>

          {/* Cột Phải: Chi tiết Bảng Sự Kiện Đang Chọn & Các Khóa Ngoại Liên Kết (FK) */}
          <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "22px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ padding: "3px 8px", borderRadius: 4, background: "#EA580C", color: "#FFF", fontSize: 11, fontWeight: 800 }}>FACT TABLE</span>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", margin: 0, fontFamily: "monospace" }}>{currentFact.name}</h2>
                </div>
                <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>{currentFact.desc} • Dung lượng: {currentFact.size}</p>
              </div>

              <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 700, background: "#DCFCE7", padding: "4px 10px", borderRadius: 6 }}>
                ✓ Đã liên kết Star Schema
              </span>
            </div>

            {/* Danh sách Cột thuộc Bảng Fact */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 8, letterSpacing: "0.5px" }}>DANH SÁCH TRƯỜNG DỮ LIỆU (ATTRIBUTES):</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {currentFact.columns.map((col, idx) => (
                  <div key={idx} style={{ padding: "8px 12px", background: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0", fontSize: 12, fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{col}</span>
                    {col.includes("_key") ? (
                      <span style={{ fontSize: 10, fontWeight: 800, color: col === currentFact.columns[0] ? "#DC2626" : "#2563EB", background: col === currentFact.columns[0] ? "#FEE2E2" : "#EFF6FF", padding: "1px 5px", borderRadius: 3 }}>
                        {col === currentFact.columns[0] ? "PRIMARY KEY" : "FOREIGN KEY"}
                      </span>
                    ) : (
                      <span style={{ fontSize: 10, color: "#64748B" }}>DECIMAL / VARCHAR</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bảng Chiều liên quan (Connected Dimension Tables) */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#475569", marginBottom: 8, letterSpacing: "0.5px" }}>CÁC BẢNG CHIỀU LIÊN KẾT (CONNECTED DIMENSIONS):</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {dimTables.slice(0, 6).map((dim, idx) => (
                  <div key={idx} style={{ padding: "10px 12px", background: "#EFF6FF", borderRadius: 8, border: "1px solid #DBEAFE", fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <strong style={{ color: "#1D4ED8", fontFamily: "monospace" }}>{dim.name}</strong>
                      <span style={{ fontSize: 10, color: "#2563EB", fontWeight: 700 }}>{dim.type}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#475569" }}>{dim.desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
