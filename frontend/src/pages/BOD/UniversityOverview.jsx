import { useState } from "react";
import { GraduationCap, Users, DollarSign, Award, TrendingUp, Globe, Building, BookOpen, Compass, ShieldAlert } from "lucide-react";

const STRATEGIC_KPIS = [
  { label: "Quy mô sinh viên toàn quốc", val: "38,520 SV", growth: "+16.8% YoY", color: "#FF6B35", bg: "#FFF7F4" },
  { label: "Doanh thu năm 2026", val: "1,250 Tỷ VNĐ", growth: "+18.2% YoY", color: "#16A34A", bg: "#F0FDF4" },
  { label: "Chỉ số việc làm sau TN (QS)", val: "98.2%", growth: "Top 1 Việt Nam", color: "#2563EB", bg: "#EFF6FF" },
  { label: "Công bố Scopus/ISI năm 2026", val: "680 Bài", growth: "+24.5% YoY", color: "#7C3AED", bg: "#F5F3FF" }
];

const CAMPUS_DATA = [
  { name: "Hà Nội (Khu CNC Hoà Lạc)", students: "16,200", growth: "+14%", staff: "480", target: "102%" },
  { name: "TP. Hồ Chí Minh (Khu CNC Q9)", students: "14,500", growth: "+18%", staff: "420", target: "105%" },
  { name: "Đà Nẵng (Khu Đô Thị FPT City)", students: "4,200", growth: "+22%", staff: "160", target: "110%" },
  { name: "Cần Thơ (Đồng Bằng SCL)", students: "2,400", growth: "+12%", staff: "95", target: "98%" },
  { name: "Quy Nhơn (Tổ hợp AI Quốc tế)", students: "1,220", growth: "+45%", staff: "93", target: "125%" },
];

export default function UniversityOverview() {
  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>Toàn Cảnh Chiến Lược Đại Học FPT</h1>
          <p style={{ fontSize: 13.5, color: "#64748B", margin: "3px 0 0" }}>Báo Cáo Tổng Hợp Điều Hành Dành Cho Ban Giám Đốc (Executive Summary 2026)</p>
        </div>
        <span style={{ padding: "6px 14px", borderRadius: 100, background: "#0F172A", color: "#fff", fontSize: 12.5, fontWeight: 700 }}>
          Chu kỳ chiến lược 2025 - 2030
        </span>
      </div>

      {/* Strategic KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginBottom: 28 }}>
        {STRATEGIC_KPIS.map((kpi, idx) => (
          <div key={idx} style={{ background: kpi.bg, borderRadius: 18, padding: "22px 24px", border: `1px solid ${kpi.color}25` }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>{kpi.label}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A" }}>{kpi.val}</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: kpi.color, marginTop: 8 }}>{kpi.growth}</div>
          </div>
        ))}
      </div>

      {/* Campus Performance */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, marginBottom: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", margin: "0 0 20px 0" }}>Hiệu Quả Hoạt Động Theo 5 Cơ Sở Chiến Lược (DIM_CAMPUS)</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>CƠ SỞ</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>QUY MÔ SV</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>TĂNG TRƯỞNG</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>CÁN BỘ / GV</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>TIẾN ĐỘ TUYỂN SINH</th>
              </tr>
            </thead>
            <tbody>
              {CAMPUS_DATA.map((c, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "16px 20px", fontWeight: 800, color: "#0F172A" }}>{c.name}</td>
                  <td style={{ padding: "16px 20px", fontWeight: 700, color: "#2563EB" }}>{c.students}</td>
                  <td style={{ padding: "16px 20px", fontWeight: 700, color: "#16A34A" }}>{c.growth}</td>
                  <td style={{ padding: "16px 20px", color: "#475569" }}>{c.staff} người</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 800, background: "#DCFCE7", color: "#16A34A" }}>{c.target} Chỉ tiêu</span>
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
