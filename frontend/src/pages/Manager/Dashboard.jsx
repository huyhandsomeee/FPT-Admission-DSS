import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/axiosConfig";
import {
  Database, TrendingUp, BarChart3, Target, AlertTriangle,
  Lightbulb, Layers, Users, DollarSign, BookOpen, Globe,
  ArrowUpRight, ArrowRight, RefreshCw, Download, CheckCircle2,
  Sparkles, SlidersHorizontal, Cpu, ShieldCheck
} from "lucide-react";

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const DW_FACT_SUMMARY = [
    { fact: "FACT_ADMISSION", label: "Tuyển Sinh 2026", count: "124,890 Hồ sơ", status: "96.5% Chỉ tiêu", color: "#FF6B35", bg: "#FFF7F4", path: "/manager/analytics/overview" },
    { fact: "FACT_LEARNING", label: "Học Vụ & Đào Tạo", count: "38,520 Sinh viên", status: "89.2% Qua môn", color: "#2563EB", bg: "#EFF6FF", path: "/manager/analytics/majors" },
    { fact: "FACT_FINANCE", label: "Tài Chính & Học Phí", count: "482.5 Tỷ VNĐ", status: "103.4% Target", color: "#16A34A", bg: "#F0FDF4", path: "/manager/financial" },
    { fact: "FACT_HR", label: "Cán Bộ & Giảng Viên", count: "1,248 Nhân sự", status: "37.8% Tiến sĩ/PGS", color: "#7C3AED", bg: "#F5F3FF", path: "/manager/human-resources" },
  ];

  const CAMPUS_STATS = [
    { campus: "FPT Hà Nội (Hoà Lạc)", applicants: "48,200", enrolled: "9,850", quota: "10,000", rate: 98.5, color: "#FF6B35" },
    { campus: "FPT TP. Hồ Chí Minh", applicants: "44,100", enrolled: "8,920", quota: "9,000", rate: 99.1, color: "#2563EB" },
    { campus: "FPT Đà Nẵng", applicants: "15,300", enrolled: "2,480", quota: "2,500", rate: 99.2, color: "#16A34A" },
    { campus: "FPT Cần Thơ", applicants: "10,200", enrolled: "1,450", quota: "1,600", rate: 90.6, color: "#7C3AED" },
    { campus: "FPT Quy Nhơn (AI Campus)", applicants: "7,090", enrolled: "1,120", quota: "900", rate: 124.4, color: "#0891B2" }
  ];

  const AI_INSIGHTS = [
    { title: "Xu hướng bùng nổ ngành AI & Vi Mạch Bán Dẫn", desc: "Tăng trưởng nguyện vọng +45% tại Quy Nhơn và Hà Nội. Khuyến nghị tăng 15% chỉ tiêu đợt bổ sung.", type: "OPPORTUNITY", color: "#16A34A" },
    { title: "Cảnh báo chỉ tiêu ngành Ngôn ngữ Nhật & Hàn tại Cần Thơ", desc: "Tỷ lệ xác nhận nhập học đạt 78% (thấp hơn kỳ vọng 85%). Khuyến nghị tăng học bổng khuyến khích vùng SCL.", type: "RISK", color: "#D97706" }
  ];

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* ── Top Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #0891B2, #0E7490)",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(8,145,178,0.3)"
          }}>
            <Database size={26} color="#fff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Trung Tâm Điều Hành Dữ Liệu Toàn Trường (DSS Manager)</h1>
              <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#ECFEFF", color: "#0891B2", border: "1px solid #A5F3FC" }}>
                Enterprise Data Warehouse
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: "#64748B", margin: "3px 0 0" }}>
              Tổng hợp thời gian thực từ 7 Fact Tables & Master Data 5 Cơ sở Đào tạo FPT University
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => navigate("/manager/data-warehouse")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, background: "#0F172A", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
          >
            <Database size={15} /> Xem Star Schema DWH
          </button>
          <button
            onClick={() => navigate("/manager/simulation")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, background: "linear-gradient(135deg, #FF6B35, #E85A2A)", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
          >
            <SlidersHorizontal size={15} /> Chạy Mô Phỏng What-If
          </button>
        </div>
      </div>

      {/* ── 4 Key Fact Tables Summary Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, marginBottom: 28 }}>
        {DW_FACT_SUMMARY.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.path)}
            style={{
              background: item.bg, borderRadius: 18, padding: "20px 22px", border: `1.5px solid ${item.color}25`,
              cursor: "pointer", transition: "all 0.25s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 10px 24px ${item.color}25`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 800, fontFamily: "monospace", color: item.color, background: "#fff", padding: "2px 8px", borderRadius: 6 }}>
                {item.fact}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.status}</span>
            </div>
            <div style={{ fontSize: 13.5, color: "#64748B", fontWeight: 600 }}>{item.label}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", marginTop: 4 }}>{item.count}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: item.color, marginTop: 10 }}>
              Xem phân tích chi tiết <ArrowRight size={13} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Campus Performance & AI Decision Support ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Left: Campus Performance */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Hiệu Suất Tuyển Sinh & Đào Tạo Theo Cơ Sở</h3>
              <p style={{ fontSize: 12.5, color: "#64748B", margin: "2px 0 0" }}>DIM_CAMPUS • Tỷ lệ hoàn thành chỉ tiêu năm 2026</p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "4px 10px", borderRadius: 100 }}>
              Toàn trường: 98.2%
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {CAMPUS_STATS.map((c, idx) => (
              <div key={idx}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13.5, marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: "#1E293B" }}>{c.campus}</span>
                  <span style={{ color: "#0F172A" }}>
                    <strong>{c.enrolled}</strong> / {c.quota} SV (<strong style={{ color: c.rate >= 100 ? "#16A34A" : "#2563EB" }}>{c.rate}%</strong>)
                  </span>
                </div>
                <div style={{ width: "100%", height: 10, background: "#F1F5F9", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(100, c.rate)}%`, height: "100%", background: c.color, borderRadius: 100 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Recommendations & Quick DSS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* AI Insights */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={18} color="#7C3AED" />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Khuyến Nghị Tối Ưu Hóa AI</h3>
                <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>DSS AI Model • Khuyến nghị cho Quản lý</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {AI_INSIGHTS.map((ins, idx) => (
                <div key={idx} style={{ padding: 14, background: "#F8FAFC", borderRadius: 14, border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: `${ins.color}15`, color: ins.color }}>
                      {ins.type}
                    </span>
                    <strong style={{ fontSize: 13.5, color: "#0F172A" }}>{ins.title}</strong>
                  </div>
                  <p style={{ fontSize: 12.5, color: "#64748B", margin: 0, lineHeight: 1.4 }}>{ins.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/manager/recommendations")}
              style={{ width: "100%", marginTop: 14, padding: "10px", borderRadius: 10, background: "#F5F3FF", color: "#7C3AED", border: "1px solid #DDD6FE", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              Xem Toàn Bộ 8 Đề Xuất Chiến Lược →
            </button>
          </div>

          {/* Quick DSS Tools */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 22, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: "0 0 12px 0" }}>Công Cụ Khai Thác & Quản Trị</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Phân tích tuyển sinh theo ngành", path: "/manager/analytics/majors" },
                { label: "Phân tích địa bàn & nguồn thí sinh", path: "/manager/analytics/regional" },
                { label: "Giám sát chất lượng dữ liệu DWH", path: "/manager/data-quality" },
                { label: "Quản lý nhân sự & năng lực GV", path: "/manager/human-resources" }
              ].map((link, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(link.path)}
                  style={{ padding: "10px 14px", borderRadius: 10, background: "#F8FAFC", fontSize: 13, fontWeight: 600, color: "#334155", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
                >
                  <span>{link.label}</span>
                  <ArrowRight size={13} color="#94A3B8" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
