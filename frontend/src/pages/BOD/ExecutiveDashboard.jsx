import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axiosConfig";
import {
  TrendingUp, Award, DollarSign, Users, AlertTriangle,
  Lightbulb, Layers, Download, GitBranch, ArrowUpRight,
  ShieldAlert, Globe, GraduationCap, ChevronRight, BarChart3,
  Calendar, FileText, CheckCircle2, Sparkles
} from "lucide-react";

export default function ExecutiveDashboard() {
  const navigate = useNavigate();

  const BOD_METRICS = [
    { label: "Quy mô sinh viên toàn quốc", val: "38,520", growth: "+16.8% YoY", sub: "Mục tiêu 2026: 40.000 SV", color: "#FF6B35", bg: "#FFF7F4" },
    { label: "Doanh thu dự kiến 2026", val: "1,250 Tỷ", growth: "+18.2% YoY", sub: "EBITDA Margin: 28.4%", color: "#16A34A", bg: "#F0FDF4" },
    { label: "Tỷ lệ việc làm sau TN (QS)", val: "98.2%", growth: "Top 1 Việt Nam", sub: "Xếp hạng QS 3 Sao Quốc tế", color: "#2563EB", bg: "#EFF6FF" },
    { label: "Công bố ISI/Scopus 2026", val: "680 Bài", growth: "+24.5% YoY", sub: "18 Bằng sáng chế", color: "#7C3AED", bg: "#F5F3FF" }
  ];

  const STRATEGIC_RISKS = [
    { title: "Áp lực chỉ tiêu ngành Quản trị kinh doanh tại miền Trung", level: "HIGH", campus: "Đà Nẵng", impact: "Cần tăng cường liên kết doanh nghiệp Fintech", color: "#DC2626" },
    { title: "Thiếu hụt giảng viên đầu ngành Vi Mạch Bán Dẫn", level: "MEDIUM", campus: "Hà Nội / HCM", impact: "Cần xúc tiến gói học bổng đào tạo Tiến sĩ tại Đài Loan", color: "#D97706" },
    { title: "Biến động tỷ giá chi phí bản quyền giáo trình quốc tế", level: "LOW", campus: "Toàn quốc", impact: "Đã trích lập quỹ dự phòng rủi ro 12 Tỷ", color: "#2563EB" }
  ];

  const GROWTH_PROJECTIONS = [
    { year: "2022", actual: 26500, target: 25000, revenue: "780 Tỷ" },
    { year: "2023", actual: 29800, target: 28000, revenue: "920 Tỷ" },
    { year: "2024", actual: 33400, target: 32000, revenue: "1,050 Tỷ" },
    { year: "2025", actual: 35800, target: 35000, revenue: "1,140 Tỷ" },
    { year: "2026 (Kế hoạch)", actual: 38520, target: 40000, revenue: "1,250 Tỷ" }
  ];

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* ── Executive Header Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #091429 0%, #0d1b3e 60%, #172a59 100%)",
        borderRadius: 24, padding: "30px 34px", color: "#fff", marginBottom: 28,
        boxShadow: "0 14px 34px rgba(9,20,41,0.35)", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.25) 0%, transparent 70%)" }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, position: "relative" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 11.5, fontWeight: 800, padding: "4px 12px", borderRadius: 100, background: "rgba(255,107,53,0.2)", color: "#FF8C5A", border: "1px solid rgba(255,107,53,0.4)" }}>
                HỘI ĐỒNG QUẢN TRỊ & BAN GIÁM ĐỐC
              </span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Chu kỳ chiến lược 2025 - 2030</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 6px 0" }}>
              Bảng Điều Hành Chiến Lược (Executive BOD Portal)
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}>
              Hệ thống Hỗ Trợ Quyết Định Dựa Trên Dữ Liệu Lớn (Big Data & Data Warehouse DSS)
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => navigate("/bod/data-lineage")}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 12, background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              <GitBranch size={15} color="#38BDF8" /> Xem Data Lineage
            </button>
            <button
              onClick={() => navigate("/bod/export")}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #E85A2A)", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 14px rgba(255,107,53,0.4)" }}
            >
              <Download size={15} /> Xuất Báo Cáo HĐQT
            </button>
          </div>
        </div>
      </div>

      {/* ── 4 Strategic High-Level Metrics ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginBottom: 28 }}>
        {BOD_METRICS.map((kpi, idx) => (
          <div key={idx} style={{ background: kpi.bg, borderRadius: 20, padding: "22px 24px", border: `1.5px solid ${kpi.color}25` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#64748B" }}>{kpi.label}</span>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: kpi.color, background: "#fff", padding: "3px 10px", borderRadius: 20 }}>
                {kpi.growth}
              </span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>{kpi.val}</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ── 5-Year Growth Trends & Risk Matrix ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Left: 5-Year Projections */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Tăng Trưởng Quy Mô & Doanh Thu 5 Năm (2022 - 2026)</h3>
              <p style={{ fontSize: 12.5, color: "#64748B", margin: "2px 0 0" }}>Tổng hợp từ Data Mart Tuyển Sinh & Tài Chính</p>
            </div>
            <button
              onClick={() => navigate("/bod/forecast")}
              style={{ fontSize: 12.5, fontWeight: 700, color: "#2563EB", background: "none", border: "none", cursor: "pointer" }}
            >
              Xem Dự Báo 2027-2030 →
            </button>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13.5 }}>
              <thead>
                <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>NĂM</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>QUY MÔ SV</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>MỤC TIÊU</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>DOANH THU</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>TIẾN ĐỘ</th>
                </tr>
              </thead>
              <tbody>
                {GROWTH_PROJECTIONS.map((g, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 800, color: "#0F172A" }}>{g.year}</td>
                    <td style={{ padding: "14px 16px", fontWeight: 700, color: "#2563EB" }}>{g.actual.toLocaleString()}</td>
                    <td style={{ padding: "14px 16px", color: "#64748B" }}>{g.target.toLocaleString()}</td>
                    <td style={{ padding: "14px 16px", fontWeight: 800, color: "#16A34A" }}>{g.revenue}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: "#DCFCE7", color: "#16A34A" }}>
                        {Math.round((g.actual / g.target) * 100)}% Target
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Strategic Risk Monitor */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldAlert size={18} color="#DC2626" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Ma Trận Giám Sát Rủi Ro</h3>
                  <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>Cảnh báo sớm từ hệ thống DSS</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/bod/risks")}
                style={{ fontSize: 12.5, fontWeight: 700, color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}
              >
                Chi tiết →
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {STRATEGIC_RISKS.map((risk, idx) => (
                <div key={idx} style={{ padding: 14, background: "#F8FAFC", borderRadius: 14, border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <strong style={{ fontSize: 13, color: "#0F172A" }}>{risk.title}</strong>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 4, background: `${risk.color}15`, color: risk.color }}>
                      {risk.level}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>Cơ sở: <strong>{risk.campus}</strong></div>
                  <div style={{ fontSize: 12, color: "#475569", marginTop: 4, fontStyle: "italic" }}>
                    Giải pháp: {risk.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts for BOD */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 22, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: "0 0 12px 0" }}>Phân Hệ Chiến Lược Dành Cho Ban Giám Đốc</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Báo cáo toàn cảnh 5 cơ sở", path: "/bod/university-overview" },
                { label: "Phân tích tài chính chiến lược & EBITDA", path: "/bod/financial-analytics" },
                { label: "Công bố NCKH & Sở hữu trí tuệ", path: "/bod/research" },
                { label: "Đề xuất chiến lược thông minh (AI DSS)", path: "/bod/recommendations" }
              ].map((link, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(link.path)}
                  style={{ padding: "10px 14px", borderRadius: 10, background: "#F8FAFC", fontSize: 13, fontWeight: 600, color: "#334155", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                >
                  <span>{link.label}</span>
                  <ChevronRight size={14} color="#94A3B8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
