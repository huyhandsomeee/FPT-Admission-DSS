import { useState } from "react";
import {
  Building2, Users, DollarSign, Award, CheckCircle2,
  TrendingUp, BarChart3, ArrowRight, Download, Filter,
  ShieldCheck, AlertCircle, BookOpen, Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEPARTMENTS_OVERVIEW = [
  {
    id: "TS",
    name: "Phòng Tuyển Sinh & Hướng Nghiệp",
    head: "ThS. Đỗ Thị Thu Trang",
    staff: 24,
    kpiScore: 98.5,
    budget: "38.5 Tỷ",
    spent: "32.1 Tỷ",
    keyMetric: "Đạt 96.5% Chỉ tiêu 2026",
    status: "Vượt tiến độ",
    description: "Chịu trách nhiệm toàn bộ chuỗi tuyển sinh, tư vấn hướng nghiệp và xác nhận nhập học 5 cơ sở."
  },
  {
    id: "DT",
    name: "Phòng Quản Lý Đào Tạo & Khảo Thí",
    head: "TS. Trần Quốc Tuấn",
    staff: 18,
    kpiScore: 97.8,
    budget: "24.0 Tỷ",
    spent: "21.5 Tỷ",
    keyMetric: "89.2% SV đạt chuẩn tín chỉ",
    status: "Đạt mục tiêu",
    description: "Quản lý chương trình đào tạo 47 ngành, xếp thời khóa biểu FAP và tổ chức thi học kỳ chuẩn quốc tế."
  },
  {
    id: "TC",
    name: "Phòng Tài Chính - Kế Toán",
    head: "Phạm Minh Tú (Kế toán trưởng)",
    staff: 12,
    kpiScore: 99.4,
    budget: "15.0 Tỷ",
    spent: "13.2 Tỷ",
    keyMetric: "Doanh thu 1.250 Tỷ (103.4%)",
    status: "Vượt tiến độ",
    description: "Quản lý dòng tiền học phí SAP ERP, quỹ học bổng và thanh toán lương thưởng toàn trường."
  },
  {
    id: "CTSV",
    name: "Phòng Công Tác Sinh Viên & Ký Túc Xá",
    head: "ThS. Hoàng Văn Nam",
    staff: 15,
    kpiScore: 96.2,
    budget: "18.2 Tỷ",
    spent: "16.8 Tỷ",
    keyMetric: "Hỗ trợ 100% KTX Tân SV K22",
    status: "Đạt mục tiêu",
    description: "Chăm lo đời sống sinh viên, quản lý ký túc xá, câu lạc bộ và các chế độ chính sách miễn giảm."
  },
  {
    id: "HR",
    name: "Phòng Tổ Chức & Quản Trị Nhân Sự",
    head: "TS. Lê Thị Mai Hoa",
    staff: 8,
    kpiScore: 98.0,
    budget: "12.0 Tỷ",
    spent: "11.1 Tỷ",
    keyMetric: "37.8% GV đạt học vị TS/PGS",
    status: "Đạt mục tiêu",
    description: "Tuyển dụng chuyên gia, giảng viên đầu ngành và quản trị KPI cán bộ nhân viên."
  },
  {
    id: "NCKH",
    name: "Viện Nghiên Cứu & Đổi Mới Sáng Tạo",
    head: "TS. Nguyễn Hải Đăng",
    staff: 10,
    kpiScore: 104.2,
    budget: "45.0 Tỷ",
    spent: "42.0 Tỷ",
    keyMetric: "680 bài báo Scopus/ISI",
    status: "Xuất sắc",
    description: "Chủ trì các đề tài NCKH trọng điểm về AI, Bán dẫn và chuyển giao công nghệ cho doanh nghiệp."
  }
];

export default function DepartmentOverview() {
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState(null);

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #0F172A, #2563EB)",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(37,99,235,0.25)"
          }}>
            <Building2 size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>
              Tổng Quan Năng Lực & Hiệu Suất Các Phòng Ban (DIM_DEPARTMENT)
            </h1>
            <p style={{ fontSize: 13.5, color: "#64748B", margin: "2px 0 0" }}>
              Báo cáo giám sát hiệu quả hoạt động, ngân sách & chỉ tiêu dành riêng cho Ban Giám Đốc
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/bod/directives")}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12,
            background: "linear-gradient(135deg, #FF6B35, #E85A2A)", color: "#fff", border: "none", fontWeight: 800, fontSize: 13.5, cursor: "pointer", boxShadow: "0 4px 14px rgba(255,107,53,0.35)"
          }}
        >
          <Send size={15} /> Giao Chỉ Thị Tới Phòng Ban
        </button>
      </div>

      {/* Grid of Department Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 20 }}>
        {DEPARTMENTS_OVERVIEW.map((dept) => (
          <div
            key={dept.id}
            style={{
              background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24,
              boxShadow: "0 4px 14px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.03)"; }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, padding: "3px 8px", borderRadius: 6, background: "#EFF6FF", color: "#2563EB", fontFamily: "monospace" }}>
                  {dept.id}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 800, padding: "4px 10px", borderRadius: 100,
                  background: dept.status === "Xuất sắc" ? "#F5F3FF" : dept.status === "Vượt tiến độ" ? "#DCFCE7" : "#E0F2FE",
                  color: dept.status === "Xuất sắc" ? "#7C3AED" : dept.status === "Vượt tiến độ" ? "#16A34A" : "#0284C7"
                }}>
                  {dept.status}
                </span>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", margin: "0 0 6px 0" }}>{dept.name}</h3>
              <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 14px 0", lineHeight: 1.4 }}>{dept.description}</p>

              {/* Metrics Box */}
              <div style={{ padding: 14, background: "#F8FAFC", borderRadius: 14, border: "1px solid #F1F5F9", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13, marginBottom: 16 }}>
                <div>
                  <span style={{ color: "#64748B" }}>Trưởng đơn vị:</span>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>{dept.head}</div>
                </div>
                <div>
                  <span style={{ color: "#64748B" }}>Nhân sự:</span>
                  <div style={{ fontWeight: 700, color: "#2563EB" }}>{dept.staff} Cán bộ</div>
                </div>
                <div>
                  <span style={{ color: "#64748B" }}>Ngân sách / Đã chi:</span>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>{dept.spent} / {dept.budget}</div>
                </div>
                <div>
                  <span style={{ color: "#64748B" }}>Điểm KPI Phòng:</span>
                  <div style={{ fontWeight: 800, color: "#16A34A" }}>★ {dept.kpiScore}/100</div>
                </div>
              </div>
            </div>

            {/* Key Metric Highlight */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#FF6B35" }}>🎯 {dept.keyMetric}</span>
              <button
                onClick={() => navigate("/bod/directives")}
                style={{ padding: "6px 12px", borderRadius: 8, background: "#0F172A", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                Giao việc →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
