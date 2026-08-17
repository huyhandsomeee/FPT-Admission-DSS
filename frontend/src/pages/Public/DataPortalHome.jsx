import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Database, Users, GraduationCap, BarChart3, TrendingUp, Shield,
  Globe, ArrowRight, Layers, CheckCircle, Zap, Activity,
  BookOpen, DollarSign, UserCheck, Server, Search, Calculator
} from "lucide-react";

/* ── Mock DW Stats ── */
const DW_STATS = [
  { label: "Sinh viên đang học", value: "18,423", delta: "+12%", icon: GraduationCap, color: "#FF6B35" },
  { label: "Tổng hồ sơ tuyển sinh", value: "124,891", delta: "+8.3%", icon: Users, color: "#2563EB" },
  { label: "Ngành đào tạo", value: "47", delta: "+3", icon: BookOpen, color: "#7C3AED" },
  { label: "Cơ sở đào tạo", value: "8", delta: "Toàn quốc", icon: Globe, color: "#059669" },
];

const PORTALS = [
  {
    id: "thisinh", role: "Thí sinh", icon: Search, color: "#FF8C00", bg: "linear-gradient(135deg,#FFF7ED,#FFEDD5)",
    border: "#FDBA74",
    title: "Tra cứu thông tin tuyển sinh",
    desc: "Tra cứu điểm chuẩn, tính điểm xét tuyển, tìm hiểu ngành học và học bổng FPT University.",
    features: ["Điểm chuẩn lịch sử 5 năm", "Máy tính điểm xét tuyển", "Thông tin 47 ngành học", "Lịch thi & sự kiện"],
    path: "/portal/admission-lookup", cta: "Tra cứu ngay"
  },
  {
    id: "sinhvien", role: "Sinh viên", icon: GraduationCap, color: "#2563EB", bg: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
    border: "#93C5FD",
    title: "Cổng sinh viên",
    desc: "Kết quả học tập, học phí, tài nguyên LMS, thư viện và hồ sơ sinh viên.",
    features: ["Bảng điểm & GPA realtime", "Quản lý học phí & học bổng", "Tài nguyên LMS & Thư viện", "Hồ sơ sinh viên"],
    path: "/login", cta: "Đăng nhập"
  },
  {
    id: "canbo", role: "Cán bộ phòng ban", icon: UserCheck, color: "#7C3AED", bg: "linear-gradient(135deg,#F5F3FF,#EDE9FE)",
    border: "#C4B5FD",
    title: "Cổng cán bộ",
    desc: "Dashboard phòng ban, quản lý sinh viên, báo cáo học vụ và tài liệu nội bộ.",
    features: ["Dashboard phòng ban theo KPI", "Quản lý danh sách sinh viên", "Báo cáo học vụ học kỳ", "Hệ thống thông báo"],
    path: "/login", cta: "Đăng nhập"
  },
  {
    id: "quanly", role: "Quản lý", icon: BarChart3, color: "#0891B2", bg: "linear-gradient(135deg,#ECFEFF,#CFFAFE)",
    border: "#67E8F9",
    title: "Cổng quản lý",
    desc: "Data Warehouse tổng quan, quản lý tài chính, nhân sự và giám sát chất lượng dữ liệu.",
    features: ["Trực quan hóa Data Warehouse", "Tài chính & Ngân sách", "Nhân sự & Lương thưởng", "Giám sát Data Quality"],
    path: "/login", cta: "Đăng nhập"
  },
  {
    id: "bod", role: "Ban Giám Đốc", icon: TrendingUp, color: "#DC2626", bg: "linear-gradient(135deg,#FFF1F2,#FFE4E6)",
    border: "#FCA5A5",
    title: "Executive Portal",
    desc: "KPI toàn trường, phân tích tài chính chiến lược, nghiên cứu khoa học và Data Lineage.",
    features: ["KPI Executive Dashboard", "Tài chính chiến lược", "Nghiên cứu & Xuất bản", "Data Lineage toàn hệ thống"],
    path: "/login", cta: "Đăng nhập"
  },
  {
    id: "admin", role: "Quản trị IT", icon: Server, color: "#059669", bg: "linear-gradient(135deg,#ECFDF5,#D1FAE5)",
    border: "#6EE7B7",
    title: "Data Governance Portal",
    desc: "Data Catalog, giám sát ETL pipeline, chính sách dữ liệu và kiểm soát truy cập.",
    features: ["Data Catalog toàn hệ thống", "ETL Pipeline Monitor", "Data Quality Rules", "Access Control & Audit"],
    path: "/login", cta: "Đăng nhập"
  },
];

const DW_LAYERS = [
  { label: "Nguồn dữ liệu", items: ["LMS", "Tài chính", "Nhân sự", "CRM", "Bộ GD&ĐT"], color: "#3B82F6" },
  { label: "Tích hợp & ETL", items: ["API Gateway", "Streaming", "Batch ETL", "AGN Agent"], color: "#8B5CF6" },
  { label: "Data Warehouse", items: ["FACT_ADMISSION", "FACT_LEARNING", "FACT_FINANCE", "FACT_HR"], color: "#F59E0B" },
  { label: "Data Mart & BI", items: ["Tuyển sinh", "Học vụ", "Tài chính", "Nhân sự"], color: "#10B981" },
  { label: "Ứng dụng", items: ["Cổng SV", "Cổng CB", "Executive", "Data Portal"], color: "#EF4444" },
];

export default function DataPortalHome() {
  const navigate = useNavigate();
  const [activePortal, setActivePortal] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(135deg, #091429 0%, #0d1b3e 50%, #1a2f5e 100%)",
        padding: "80px 24px 100px",
        position: "relative", overflow: "hidden"
      }}>
        {/* Animated orbs */}
        <div style={{
          position: "absolute", top: -80, right: -80, width: 400, height: 400,
          borderRadius: "50%", background: "radial-gradient(circle,rgba(255,107,53,0.12),transparent)",
          animation: "pulse 4s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60, width: 300, height: 300,
          borderRadius: "50%", background: "radial-gradient(circle,rgba(37,99,235,0.1),transparent)",
          animation: "pulse 6s ease-in-out infinite"
        }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", position: "relative" }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px",
            background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.4)",
            borderRadius: 100, marginBottom: 28
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B35", animation: "pulse 1.5s ease-in-out infinite" }} />
            <span style={{ color: "#FF8C5A", fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>
              CỔNG DỮ LIỆU CHÍNH THỨC — ĐẠI HỌC FPT
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900, color: "#fff", lineHeight: 1.15,
            marginBottom: 24, letterSpacing: -1
          }}>
            FPT University<br />
            <span style={{ background: "linear-gradient(90deg,#FF6B35,#FF8C5A,#FFAC80)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Data Portal
            </span>
          </h1>

          <p style={{
            fontSize: 18, color: "rgba(255,255,255,0.65)", maxWidth: 620, margin: "0 auto 40px",
            lineHeight: 1.7
          }}>
            Nền tảng dữ liệu thống nhất phục vụ tuyển sinh, quản lý sinh viên, tài chính và nhân sự —
            được xây dựng trên kiến trúc <strong style={{ color: "#FF8C5A" }}>Data Warehouse</strong> chuẩn quốc tế.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/portal/admission-lookup")} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "14px 28px",
              background: "linear-gradient(135deg,#FF6B35,#E85A2A)", border: "none", borderRadius: 12,
              color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
              boxShadow: "0 8px 24px rgba(255,107,53,0.45)", transition: "all 0.3s"
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <Search size={17} /> Tra cứu điểm chuẩn
            </button>
            <button onClick={() => navigate("/portal/score-calculator")} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "14px 28px",
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 12,
              color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", transition: "all 0.3s"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
            >
              <Calculator size={17} /> Tính điểm xét tuyển
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{
          maxWidth: 1100, margin: "60px auto 0", display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2,
          background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 4,
          border: "1px solid rgba(255,255,255,0.1)"
        }}>
          {DW_STATS.map((s, i) => (
            <div key={i} style={{ padding: "20px 24px", borderRadius: 16, background: "rgba(255,255,255,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <s.icon size={18} color={s.color} />
                <span style={{ color: s.color, fontSize: 11, fontWeight: 600, letterSpacing: 0.5 }}>{s.delta}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{s.value}</div>
              <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PORTALS GRID ── */}
      <section style={{ padding: "80px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#FF6B35", marginBottom: 10, textTransform: "uppercase" }}>
            CÁC CỔNG TRUY CẬP
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0d1b3e", marginBottom: 14 }}>
            Giao diện riêng cho từng đối tượng
          </h2>
          <p style={{ color: "#6B7280", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
            Mỗi cổng được thiết kế riêng biệt với dữ liệu và tính năng phù hợp với vai trò của từng người dùng.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 24 }}>
          {PORTALS.map((portal) => (
            <div key={portal.id}
              onMouseEnter={() => setActivePortal(portal.id)}
              onMouseLeave={() => setActivePortal(null)}
              style={{
                background: portal.bg, border: `1px solid ${activePortal === portal.id ? portal.color : portal.border}`,
                borderRadius: 20, padding: 28, cursor: "pointer", transition: "all 0.3s",
                transform: activePortal === portal.id ? "translateY(-4px)" : "translateY(0)",
                boxShadow: activePortal === portal.id ? `0 16px 40px rgba(0,0,0,0.12)` : "0 2px 8px rgba(0,0,0,0.05)"
              }}
              onClick={() => navigate(portal.path)}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: portal.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 4px 12px ${portal.color}44`
                }}>
                  <portal.icon size={22} color="#fff" />
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
                  padding: "4px 10px", borderRadius: 100, background: `${portal.color}18`, color: portal.color
                }}>
                  {portal.role}
                </span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0d1b3e", marginBottom: 8 }}>{portal.title}</h3>
              <p style={{ fontSize: 13.5, color: "#6B7280", marginBottom: 18, lineHeight: 1.6 }}>{portal.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
                {portal.features.map((f, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#374151", marginBottom: 6 }}>
                    <CheckCircle size={13} color={portal.color} />
                    {f}
                  </li>
                ))}
              </ul>
              <button style={{
                display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 700,
                color: portal.color, background: "none", border: "none", cursor: "pointer", padding: 0
              }}>
                {portal.cta} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── DATA WAREHOUSE ARCHITECTURE ── */}
      <section style={{
        background: "linear-gradient(135deg, #0d1b3e 0%, #1a2f5e 100%)",
        padding: "80px 24px"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#FF8C5A", marginBottom: 10, textTransform: "uppercase" }}>
              KIẾN TRÚC HỆ THỐNG
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 14 }}>
              Data Warehouse Pipeline
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
              Dữ liệu được thu thập, tích hợp và phân phối qua 5 lớp kiến trúc chuẩn.
            </p>
          </div>

          <div style={{ display: "flex", gap: 0, alignItems: "stretch", overflowX: "auto", padding: "0 0 16px" }}>
            {DW_LAYERS.map((layer, i) => (
              <div key={i} style={{ flex: "1 1 180px", minWidth: 160 }}>
                <div style={{
                  background: `${layer.color}18`, border: `1px solid ${layer.color}44`,
                  borderRadius: i === 0 ? "16px 0 0 16px" : i === DW_LAYERS.length - 1 ? "0 16px 16px 0" : "0",
                  borderLeft: i > 0 ? "none" : undefined,
                  padding: "24px 16px", height: "100%"
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: layer.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 800, color: "#fff", marginBottom: 14
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: layer.color, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    {layer.label}
                  </div>
                  {layer.items.map((item, j) => (
                    <div key={j} style={{
                      padding: "6px 10px", marginBottom: 6, borderRadius: 6,
                      background: "rgba(255,255,255,0.06)", fontSize: 11.5,
                      color: "rgba(255,255,255,0.7)", fontWeight: 500
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
                {i < DW_LAYERS.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 0 }} />
                )}
              </div>
            ))}
          </div>

          {/* Flow arrows between layers */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24, alignItems: "center" }}>
            {DW_LAYERS.map((l, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 11, color: l.color, fontWeight: 600 }}>{l.label}</div>
                {i < DW_LAYERS.length - 1 && (
                  <ArrowRight size={14} color="rgba(255,255,255,0.3)" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK ACCESS ── */}
      <section style={{ padding: "72px 24px", background: "#F8FAFC" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0d1b3e", marginBottom: 12 }}>
            Bắt đầu ngay hôm nay
          </h2>
          <p style={{ color: "#6B7280", fontSize: 15, marginBottom: 36 }}>
            Tra cứu thông tin tuyển sinh hoặc đăng nhập để truy cập cổng dữ liệu của bạn.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/portal/admission-lookup")} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "14px 28px",
              background: "linear-gradient(135deg,#FF6B35,#E85A2A)", border: "none", borderRadius: 12,
              color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
              boxShadow: "0 8px 20px rgba(255,107,53,0.35)"
            }}>
              <Search size={17} /> Tra cứu điểm chuẩn
            </button>
            <button onClick={() => navigate("/portal/score-calculator")} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "14px 28px",
              background: "#fff", border: "2px solid #E5E7EB", borderRadius: 12,
              color: "#374151", fontWeight: 600, fontSize: 15, cursor: "pointer"
            }}>
              <Calculator size={17} /> Tính điểm xét tuyển
            </button>
            <button onClick={() => navigate("/login")} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "14px 28px",
              background: "#0d1b3e", border: "none", borderRadius: 12,
              color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer"
            }}>
              <Layers size={17} /> Đăng nhập cổng nội bộ
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
