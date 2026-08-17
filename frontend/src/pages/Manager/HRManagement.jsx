import { useState } from "react";
import { Users, Award, Briefcase, GraduationCap, TrendingUp, Search, Filter, Download, UserPlus, Star, MapPin } from "lucide-react";

const HR_KPIS = [
  { label: "Tổng số nhân sự", val: "1,248", delta: "+8.4% YoY", color: "#2563EB", bg: "#EFF6FF" },
  { label: "Giảng viên & Nghiên cứu", val: "842", delta: "67.5% tổng số", color: "#16A34A", bg: "#F0FDF4" },
  { label: "Tiến sĩ / Phó Giáo sư", val: "318", delta: "37.8% GV", color: "#7C3AED", bg: "#F5F3FF" },
  { label: "Tỷ lệ SV / Giảng viên", val: "21.8 : 1", delta: "Chuẩn Bộ GD: ≤25", color: "#FF6B35", bg: "#FFF7F4" },
];

const DEPARTMENTS = [
  { name: "Khoa Công nghệ thông tin", headCount: 310, phdCount: 142, avgRating: 4.85, budget: "42.5 Tỷ" },
  { name: "Khoa Quản trị kinh doanh", headCount: 220, phdCount: 88, avgRating: 4.78, budget: "28.0 Tỷ" },
  { name: "Khoa Ngôn ngữ (Anh, Nhật, Hàn)", headCount: 145, phdCount: 42, avgRating: 4.82, budget: "18.5 Tỷ" },
  { name: "Khoa Thiết kế Mỹ thuật số", headCount: 95, phdCount: 24, avgRating: 4.90, budget: "14.2 Tỷ" },
  { name: "Phòng Tuyển sinh & Hướng nghiệp", headCount: 128, phdCount: 6, avgRating: 4.75, budget: "22.0 Tỷ" },
  { name: "Phòng Đào tạo & Quản lý SV", headCount: 86, phdCount: 12, avgRating: 4.70, budget: "12.8 Tỷ" },
];

const EMPLOYEES = [
  { code: "FPT-EMP-104", name: "PGS.TS. Trần Quốc Tuấn", position: "Trưởng khoa CNTT", dept: "Khoa CNTT", campus: "Hà Nội", degree: "Phó Giáo sư", papers: 42, kpi: 98 },
  { code: "FPT-EMP-208", name: "TS. Lê Thị Mai Hoa", position: "Phó khoa QTKD", dept: "Khoa QTKD", campus: "TP.HCM", degree: "Tiến sĩ", papers: 19, kpi: 95 },
  { code: "FPT-EMP-312", name: "ThS. Hoàng Minh Đức", position: "Giảng viên Senior", dept: "Khoa CNTT", campus: "Đà Nẵng", degree: "Thạc sĩ", papers: 8, kpi: 92 },
  { code: "FPT-EMP-415", name: "TS. Nguyễn Hải Đăng", position: "Trưởng lab AI", dept: "Khoa CNTT", campus: "Quy Nhơn", degree: "Tiến sĩ", papers: 27, kpi: 99 },
  { code: "FPT-EMP-519", name: "ThS. Đỗ Thị Thu Trang", position: "Trưởng ban Tuyển sinh", dept: "Phòng Tuyển sinh", campus: "Hà Nội", degree: "Thạc sĩ", papers: 2, kpi: 96 }
];

export default function HRManagement() {
  const [search, setSearch] = useState("");

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #DC2626, #B91C1C)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(220,38,38,0.3)" }}>
            <Users size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0 }}>Quản Trị Nhân Sự & Cán Bộ Giảng Viên</h1>
            <p style={{ fontSize: 13.5, color: "#64748B", margin: "2px 0 0" }}>FACT_HR & DIM_EMPLOYEE • Dữ liệu năng lực đội ngũ giảng viên & KPI</p>
          </div>
        </div>

        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "#0F172A", color: "#fff", border: "none", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
          <Download size={15} /> Xuất Báo Cáo Nhân Sự
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 28 }}>
        {HR_KPIS.map((kpi, idx) => (
          <div key={idx} style={{ background: kpi.bg, borderRadius: 16, padding: "20px 22px", border: `1px solid ${kpi.color}25` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>{kpi.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>{kpi.val}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: kpi.color, marginTop: 6 }}>{kpi.delta}</div>
          </div>
        ))}
      </div>

      {/* Department Analytics */}
      <div style={{ background: "#fff", borderRadius: 18, padding: 24, border: "1px solid #E2E8F0", marginBottom: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 20px 0" }}>Cơ Cấu Nhân Lực Theo Khoa / Phòng Ban</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {DEPARTMENTS.map((dept, idx) => (
            <div key={idx} style={{ padding: 18, background: "#F8FAFC", borderRadius: 14, border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>{dept.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 13 }}>
                <div>
                  <span style={{ color: "#64748B" }}>Nhân sự:</span> <strong style={{ color: "#0F172A" }}>{dept.headCount}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748B" }}>TS/PGS:</span> <strong style={{ color: "#7C3AED" }}>{dept.phdCount}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748B" }}>Đánh giá:</span> <strong style={{ color: "#16A34A" }}>★ {dept.avgRating}</strong>
                </div>
                <div>
                  <span style={{ color: "#64748B" }}>Quỹ lương/Năm:</span> <strong style={{ color: "#2563EB" }}>{dept.budget}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff List */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Danh Sách Cán Bộ Tiêu Biểu & Nghiên Cứu</h3>
          <span style={{ fontSize: 12.5, color: "#64748B" }}>Đồng bộ từ DIM_EMPLOYEE</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>MÃ CB</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>HỌ VÀ TÊN</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>CHỨC VỤ / HỌC VỊ</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>ĐƠN VỊ</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>CƠ SỞ</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>BÀI BÁO ISI/SCOPUS</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>ĐIỂM KPI</th>
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.map((emp, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "14px 20px", fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>{emp.code}</td>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: "#0F172A" }}>{emp.name}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ fontWeight: 600, color: "#1E293B" }}>{emp.position}</div>
                    <div style={{ fontSize: 12, color: "#7C3AED" }}>{emp.degree}</div>
                  </td>
                  <td style={{ padding: "14px 20px", color: "#475569" }}>{emp.dept}</td>
                  <td style={{ padding: "14px 20px", color: "#64748B" }}>{emp.campus}</td>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: "#2563EB" }}>{emp.papers} bài</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 800, background: "#DCFCE7", color: "#16A34A" }}>{emp.kpi}/100</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
