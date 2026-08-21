import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import {
  Database, Users, GraduationCap, BarChart3, TrendingUp, Shield,
  Globe, ArrowRight, Layers, CheckCircle, Zap, Activity,
  BookOpen, DollarSign, UserCheck, Server, Search, Calculator,
  Sparkles, Award, ExternalLink, ChevronRight, Filter, Eye,
  Building2, Cpu, FileCheck, Landmark, Check, HelpCircle, Lock,
  Phone, Compass, BarChart4, PieChart, Info
} from "lucide-react";

/* ── Live Institutional KPIs ── */
const DW_STATS = [
  { label: "Sinh viên đang theo học", value: "18,420+", delta: "+12.4% YoY", icon: GraduationCap, color: "#FF6B35", subtext: "Toàn bộ 5 phân hiệu" },
  { label: "Tổng hồ sơ tuyển sinh", value: "124,890+", delta: "+18.2% YoY", icon: Users, color: "#3B82F6", subtext: "Đồng bộ real-time 2026" },
  { label: "Ngành & Chuyên ngành", value: "47+", delta: "ABET & ACBSP", icon: BookOpen, color: "#8B5CF6", subtext: "Kiểm định quốc tế" },
  { label: "Phân hiệu đào tạo", value: "05 Cơ sở", delta: "Toàn quốc", icon: Building2, color: "#10B981", subtext: "HN, HCM, ĐN, CT, QN" },
  { label: "Độ tin cậy DWH ETL", value: "99.98%", delta: "SLA Tier 3", icon: Server, color: "#EC4899", subtext: "Zero-data loss pipeline" },
];

/* ── Detailed Portal Roles Hub ── */
const PORTALS = [
  {
    id: "thisinh",
    category: "candidate",
    role: "Thí sinh & Phụ huynh",
    badge: "Truy cập mở",
    icon: Search,
    color: "#FF6B35",
    bgGradient: "linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(255,140,90,0.04) 100%)",
    border: "rgba(255,107,53,0.3)",
    title: "Cổng Tuyển Sinh & Tra Cứu Điểm",
    desc: "Nộp hồ sơ trực tuyến, tính điểm xét tuyển tự động, tra cứu học bổng và lịch sử điểm chuẩn 5 năm gần nhất.",
    features: [
      "Nộp hồ sơ xét tuyển Online nhanh chóng",
      "Tra cứu điểm chuẩn lịch sử 2022 - 2026",
      "Máy tính điểm thi THPT & Học bạ tự động",
      "Thông tin 47 chuyên ngành & Học bổng Talent"
    ],
    path: "/portal/admission-lookup",
    secondaryPath: "/portal/apply",
    cta: "Tra cứu điểm chuẩn",
    secondaryCta: "Nộp hồ sơ Online"
  },
  {
    id: "sinhvien",
    category: "student",
    role: "Sinh viên Đại học FPT",
    badge: "Xác thực SSO",
    icon: GraduationCap,
    color: "#2563EB",
    bgGradient: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(59,130,246,0.04) 100%)",
    border: "rgba(37,99,235,0.3)",
    title: "Cổng Sinh Viên Toàn Diện",
    desc: "Theo dõi kết quả học tập GPA, quản lý tiến độ học phí, đăng ký học phần, tài nguyên số LMS và thư viện điện tử.",
    features: [
      "Bảng điểm số & GPA realtime từng kỳ",
      "Quản lý học phí, học bổng & hoàn trả",
      "Tài nguyên học tập số & LMS FPT Edu",
      "Hồ sơ số sinh viên & xác nhận hành chính"
    ],
    path: "/student/dashboard",
    cta: "Truy cập Cổng Sinh viên"
  },
  {
    id: "canbo",
    category: "officer",
    role: "Cán bộ Phòng ban & Đào tạo",
    badge: "Phân quyền nghiệp vụ",
    icon: UserCheck,
    color: "#7C3AED",
    bgGradient: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(139,92,246,0.04) 100%)",
    border: "rgba(124,58,237,0.3)",
    title: "Cổng Cán Bộ Nghiệp Vụ",
    desc: "Xử lý hồ sơ tuyển sinh, quản lý dữ liệu học vụ, theo dõi dòng thu học phí, giờ giảng và điều phối sinh viên.",
    features: [
      "Xét duyệt & xác minh hồ sơ trực tuyến",
      "Dashboard phòng ban Tuyển sinh / Học vụ / CTSV",
      "Đồng bộ kết quả thi Bộ GD&ĐT (MOET)",
      "Báo cáo học vụ & phân bổ chỉ tiêu"
    ],
    path: "/officer/dashboard",
    cta: "Truy cập Cán bộ Nghiệp vụ"
  },
  {
    id: "quanly",
    category: "manager",
    role: "Quản lý Khoa & Trưởng Ban",
    badge: "DSS & BI Analytics",
    icon: BarChart3,
    color: "#0891B2",
    bgGradient: "linear-gradient(135deg, rgba(8,145,178,0.12) 0%, rgba(6,182,212,0.04) 100%)",
    border: "rgba(8,145,178,0.3)",
    title: "Cổng Quản Lý & Ra Quyết Định (DSS)",
    desc: "Trực quan hóa dữ liệu toàn diện, mô hình dự báo tuyển sinh ML/AI, What-if Simulation và giám sát chất lượng dữ liệu.",
    features: [
      "Trực quan hóa Data Warehouse Marts",
      "Mô hình AI dự báo xu hướng tuyển sinh",
      "Mô phỏng What-If Simulation chiến lược",
      "Giám sát Data Quality & chỉ số KPI Khoa"
    ],
    path: "/manager/dashboard",
    cta: "Truy cập Cổng Quản lý (DSS)"
  },
  {
    id: "bod",
    category: "executive",
    role: "Ban Giám Đốc (BOD)",
    badge: "Executive C-Level",
    icon: TrendingUp,
    color: "#DC2626",
    bgGradient: "linear-gradient(135deg, rgba(220,38,38,0.12) 0%, rgba(239,68,68,0.04) 100%)",
    border: "rgba(220,38,38,0.3)",
    title: "Executive Boardroom Portal",
    desc: "Bảng điều khiển chiến lược tổng thể toàn trường, phân tích tài chính chiến lược, NCKH, chỉ thị điều hành và Data Lineage.",
    features: [
      "Executive Dashboard & Strategic KPIs",
      "Tài chính chiến lược & Doanh thu 5 năm",
      "Quản lý chỉ thị điều hành các cơ sở",
      "Data Lineage truy xuất nguồn gốc dữ liệu"
    ],
    path: "/bod/dashboard",
    cta: "Truy cập Executive Portal"
  },
  {
    id: "admin",
    category: "governance",
    role: "Quản trị Hệ thống & DWH",
    badge: "IT Governance",
    icon: Server,
    color: "#059669",
    bgGradient: "linear-gradient(135deg, rgba(5,150,105,0.12) 0%, rgba(16,185,129,0.04) 100%)",
    border: "rgba(5,150,105,0.3)",
    title: "Data Governance & IT Studio",
    desc: "Data Catalog toàn hệ thống, giám sát đường ống dẫn dữ liệu ETL/ELT thời gian thực, RBAC và kiểm toán tuân thủ bảo mật.",
    features: [
      "Data Catalog & Dictionary toàn trường",
      "ETL Pipeline Monitor & Cảnh báo lỗi",
      "Data Quality Rules & Data Governance",
      "Quản trị người dùng & Audit Log an ninh"
    ],
    path: "/admin/dashboard",
    cta: "Truy cập Governance Studio"
  },
];



/* ── Top Majors Admission Insight ── */
const TOP_MAJORS = [
  { name: "Trí tuệ nhân tạo (AI)", code: "7480201AI", faculty: "Công nghệ thông tin", quota: 450, demand: 98, cutoff: "25.50", trend: "+0.5" },
  { name: "Kỹ thuật phần mềm (SE)", code: "7480103", faculty: "Công nghệ thông tin", quota: 1200, demand: 95, cutoff: "24.50", trend: "+0.25" },
  { name: "An toàn thông tin (IA)", code: "7480202", faculty: "Công nghệ thông tin", quota: 350, demand: 92, cutoff: "23.80", trend: "+0.3" },
  { name: "Quản trị kinh doanh Quốc tế", code: "7340101", faculty: "Kinh tế - Quản trị", quota: 850, demand: 89, cutoff: "22.50", trend: "+0.5" },
  { name: "Digital Marketing & Thương mại số", code: "7340115", faculty: "Kinh tế - Quản trị", quota: 600, demand: 94, cutoff: "23.00", trend: "+0.75" },
  { name: "Thiết kế Mỹ thuật số (Graphic Design)", code: "7210403", faculty: "Thiết kế & Đồ họa", quota: 400, demand: 90, cutoff: "22.50", trend: "+0.5" },
];

export default function DataPortalHome() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("majors");

  const filteredPortals = useMemo(() => {
    return PORTALS.filter(p => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const matchQuery = !searchQuery || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#060D1E", color: "#F8FAFC", minHeight: "100vh" }}>
      
      {/* ── 1. HERO SECTION WITH CÓC FPT MASCOT SHOWCASE ── */}
      <section style={{
        position: "relative",
        overflow: "hidden",
        padding: "80px 24px 90px",
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, #162c5b 0%, #060d1e 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}>
        {/* Background Grid Pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          pointerEvents: "none"
        }} />

        {/* Ambient Glows */}
        <div style={{
          position: "absolute", top: "10%", left: "15%", width: 500, height: 500,
          background: "radial-gradient(circle, rgba(255, 107, 53, 0.18) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(70px)", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", top: "20%", right: "15%", width: 550, height: 550,
          background: "radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none"
        }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 10 }}>
          
          {/* Main 2-Column Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.25fr 0.85fr", gap: 40, alignItems: "center" }}>
            
            {/* Left Column: Headline & Controls */}
            <div>
              {/* Tagline Badge */}
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 16px",
                background: "rgba(255, 107, 53, 0.12)",
                border: "1px solid rgba(255, 107, 53, 0.35)",
                borderRadius: 100,
                marginBottom: 20,
                boxShadow: "0 0 20px rgba(255, 107, 53, 0.2)"
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6B35", boxShadow: "0 0 10px #FF6B35" }} />
                <span style={{ color: "#FF8C5A", fontSize: 12, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase" }}>
                  CỔNG DỮ LIỆU FPT • DECISION SUPPORT SYSTEM
                </span>
              </div>

              {/* Main Title */}
              <h1 style={{
                fontSize: "clamp(34px, 4.5vw, 58px)",
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.15,
                letterSpacing: -1,
                marginBottom: 20
              }}>
                Cổng Dữ Liệu FPT
              </h1>

              {/* Subtitle */}
              <p style={{
                fontSize: 16,
                color: "#94A3B8",
                lineHeight: 1.7,
                marginBottom: 28,
                maxWidth: 620
              }}>
                Nền tảng hội tụ dữ liệu tuyển sinh, quản lý sinh viên, tài chính và phân tích hỗ trợ ra quyết định thông minh (<strong style={{ color: "#FF8C5A" }}>DSS</strong>) — được xây dựng trên kiến trúc <strong style={{ color: "#60A5FA" }}>Data Warehouse</strong> chuẩn quốc tế.
              </p>

              {/* Quick Search & Filter Bar */}
              <div style={{
                background: "rgba(13, 24, 54, 0.85)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 14,
                padding: "6px 8px 6px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                marginBottom: 24
              }}>
                <Search size={18} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Tìm kiếm phân hệ, ngành học, tra cứu điểm chuẩn, học bổng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 500
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#94A3B8", borderRadius: "50%", width: 22, height: 22, cursor: "pointer", fontSize: 11 }}
                  >
                    ✕
                  </button>
                )}
                <button
                  onClick={() => navigate("/portal/admission-lookup")}
                  style={{
                    background: "linear-gradient(135deg, #FF6B35 0%, #E85A2A 100%)",
                    border: "none",
                    borderRadius: 10,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13.5,
                    padding: "9px 18px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6
                  }}
                >
                  <span>Tìm kiếm</span>
                </button>
              </div>

              {/* Action CTAs Button Group */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate("/portal/apply")}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "13px 24px",
                    background: "linear-gradient(135deg, #FF6B35 0%, #E85A2A 100%)",
                    border: "none", borderRadius: 12, color: "#fff", fontWeight: 800, fontSize: 14,
                    cursor: "pointer", boxShadow: "0 8px 25px rgba(255,107,53,0.45)", transition: "all 0.2s"
                  }}
                >
                  <Sparkles size={16} /> Nộp hồ sơ Online 2026
                </button>

                <button
                  onClick={() => navigate("/portal/admission-lookup")}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "13px 20px",
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 12, color: "#F8FAFC", fontWeight: 700, fontSize: 14, cursor: "pointer"
                  }}
                >
                  <Search size={16} color="#FF8C5A" /> Tra cứu điểm chuẩn 5 năm
                </button>

                <button
                  onClick={() => navigate("/portal/score-calculator")}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "13px 20px",
                    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 12, color: "#F8FAFC", fontWeight: 700, fontSize: 14, cursor: "pointer"
                  }}
                >
                  <Calculator size={16} color="#60A5FA" /> Máy tính xét điểm
                </button>
              </div>
            </div>

            {/* Right Column: Cóc FPT Cute Mascot Holographic Showcase */}
            <div style={{ position: "relative" }}>
              <div style={{
                background: "linear-gradient(135deg, rgba(255,107,53,0.15) 0%, rgba(13,24,54,0.85) 100%)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,107,53,0.35)",
                borderRadius: 24,
                padding: "24px 24px 20px",
                boxShadow: "0 25px 60px rgba(0,0,0,0.6), inset 0 0 30px rgba(255,107,53,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative"
              }}>
                {/* Top Badge on Mascot Card */}
                <div style={{
                  position: "absolute", top: -14,
                  background: "linear-gradient(90deg, #FF6B35, #EA580C)",
                  padding: "4px 14px", borderRadius: 100, fontSize: 11, fontWeight: 900,
                  color: "#FFF", letterSpacing: 0.5, boxShadow: "0 4px 15px rgba(255,107,53,0.5)"
                }}>
                  🐸 LINH VẬT CÓC FPT • AI DATA GUIDE
                </div>

                {/* 3D Mascot Image with Glow Ring */}
                <div style={{
                  width: 220, height: 220, borderRadius: "50%",
                  padding: 6, background: "linear-gradient(135deg, #FF6B35 0%, #60A5FA 100%)",
                  boxShadow: "0 0 40px rgba(255,107,53,0.4)",
                  margin: "12px 0 16px", overflow: "hidden"
                }}>
                  <img
                    src="/fpt_toad_mascot.jpg"
                    alt="Linh vật Cóc FPT"
                    style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
                  />
                </div>

                {/* Speech Bubble */}
                <div style={{
                  background: "rgba(11,19,43,0.9)", border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 16, padding: "12px 16px", color: "#F1F5F9", fontSize: 13,
                  lineHeight: 1.5, marginBottom: 16, position: "relative"
                }}>
                  <div style={{ fontWeight: 800, color: "#FF8C5A", marginBottom: 2 }}>
                    &ldquo;Chào mừng bạn đến với Cổng Dữ Liệu FPT 🎓&rdquo;
                  </div>
                  <div>Trợ lý Dữ liệu Thông minh của Cổng Dữ Liệu FPT. Bạn cần tra cứu điểm chuẩn, học bổng hay tính điểm học bạ? Chọn nhanh bên dưới nhé!</div>
                </div>

                {/* Quick Interactive Chip Badges */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                  <button
                    onClick={() => navigate("/portal/admission-lookup")}
                    style={{
                      padding: "6px 12px", borderRadius: 8, background: "rgba(255,107,53,0.2)",
                      border: "1px solid rgba(255,107,53,0.4)", color: "#FF8C5A", fontSize: 12, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    🎯 Điểm chuẩn K21
                  </button>
                  <button
                    onClick={() => navigate("/candidate")}
                    style={{
                      padding: "6px 12px", borderRadius: 8, background: "rgba(37,99,235,0.2)",
                      border: "1px solid rgba(37,99,235,0.4)", color: "#60A5FA", fontSize: 12, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    🏆 Học bổng Talent
                  </button>
                  <button
                    onClick={() => navigate("/bod/dashboard")}
                    style={{
                      padding: "6px 12px", borderRadius: 8, background: "rgba(220,38,38,0.2)",
                      border: "1px solid rgba(220,38,38,0.4)", color: "#F87171", fontSize: 12, fontWeight: 700, cursor: "pointer"
                    }}
                  >
                    🏛️ BOD Executive
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Live Stats Ribbon ── */}
        <div style={{ maxWidth: 1240, margin: "64px auto 0", position: "relative", zIndex: 10 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 16,
            background: "rgba(11, 23, 50, 0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20,
            padding: 16,
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
          }}>
            {DW_STATS.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  padding: "20px 18px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${stat.color}1E`, border: `1px solid ${stat.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <stat.icon size={20} color={stat.color} />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: stat.color,
                    padding: "3px 8px", borderRadius: 100, background: `${stat.color}15`,
                    border: `1px solid ${stat.color}33`
                  }}>
                    {stat.delta}
                  </span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1" }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                  {stat.subtext}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. INTERACTIVE PORTAL ROLE HUB ── */}
      <section style={{ padding: "90px 24px", maxWidth: 1280, margin: "0 auto" }}>
        
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 700, letterSpacing: 2, color: "#FF8C5A",
            marginBottom: 12, textTransform: "uppercase"
          }}>
            <Globe size={14} /> HỆ SINH THÁI CÁC PHÂN HỆ
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 800, color: "#fff", marginBottom: 16 }}>
            Cổng Thông Tin & Dữ Liệu Theo Đối Tượng
          </h2>
          <p style={{ color: "#94A3B8", fontSize: 16, maxWidth: 640, margin: "0 auto" }}>
            Từng phân hệ được tối ưu hóa giao diện và bảo mật với cơ chế phân quyền truy cập (<strong style={{ color: "#fff" }}>RBAC</strong>) trực tiếp vào kho dữ liệu Data Warehouse.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 48 }}>
          {[
            { id: "all", label: "Tất cả các cổng (6)" },
            { id: "candidate", label: "🎯 Thí sinh & Phụ huynh" },
            { id: "student", label: "🎓 Sinh viên" },
            { id: "officer", label: "🏢 Cán bộ Đào tạo" },
            { id: "manager", label: "📊 Quản lý & Khoa" },
            { id: "executive", label: "🏛️ Ban Giám Đốc" },
            { id: "governance", label: "⚡ Quản trị IT & DWH" },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: "8px 18px",
                borderRadius: 100,
                fontSize: 13.5,
                fontWeight: 600,
                border: activeCategory === cat.id ? "1px solid #FF6B35" : "1px solid rgba(255,255,255,0.12)",
                background: activeCategory === cat.id ? "rgba(255,107,53,0.2)" : "rgba(255,255,255,0.04)",
                color: activeCategory === cat.id ? "#FF8C5A" : "#94A3B8",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Portals Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 26 }}>
          {filteredPortals.map((portal) => (
            <div
              key={portal.id}
              style={{
                background: portal.bgGradient,
                border: `1px solid ${portal.border}`,
                borderRadius: 22,
                padding: 30,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = portal.color;
                e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.5), 0 0 25px ${portal.color}33`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = portal.border;
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)";
              }}
            >
              {/* Header inside Card */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: portal.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 6px 18px ${portal.color}55`
                }}>
                  <portal.icon size={26} color="#fff" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
                    padding: "4px 10px", borderRadius: 100,
                    background: `${portal.color}22`, color: portal.color,
                    border: `1px solid ${portal.color}44`
                  }}>
                    {portal.role}
                  </span>
                  <span style={{ fontSize: 10, color: "#64748B" }}>
                    {portal.badge}
                  </span>
                </div>
              </div>

              {/* Title & Desc */}
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 10 }}>
                {portal.title}
              </h3>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, marginBottom: 24, flex: 1 }}>
                {portal.desc}
              </p>

              {/* Features List */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 18, marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
                  Tính năng cốt lõi:
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {portal.features.map((f, idx) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#CBD5E1" }}>
                      <CheckCircle size={15} color={portal.color} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate(portal.path)}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "12px 18px",
                    background: portal.color,
                    border: "none",
                    borderRadius: 12,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13.5,
                    cursor: "pointer",
                    boxShadow: `0 4px 14px ${portal.color}44`,
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  <span>{portal.cta}</span>
                  <ArrowRight size={15} />
                </button>

                {portal.secondaryPath && (
                  <button
                    onClick={() => navigate(portal.secondaryPath)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "12px 16px",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: 12,
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 13.5,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  >
                    <Sparkles size={14} color="#FF8C5A" />
                    <span>{portal.secondaryCta}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. LIVE ADMISSION & CAMPUS INTELLIGENCE ── */}
      <section style={{
        background: "#091226",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "80px 24px"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, marginBottom: 40 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#FF8C5A", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                DỮ LIỆU THỜI GIAN THỰC (REALTIME INTELLIGENCE)
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>
                Chỉ Tiêu & Xu Hướng Tuyển Sinh 2026
              </h2>
            </div>

            {/* Sub Tabs */}
            <div style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.05)", padding: 4, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
              <button
                onClick={() => setActiveTab("majors")}
                style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none",
                  background: activeTab === "majors" ? "#FF6B35" : "transparent",
                  color: "#fff", cursor: "pointer"
                }}
              >
                Top Ngành Đào Tạo
              </button>
              <button
                onClick={() => setActiveTab("methods")}
                style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none",
                  background: activeTab === "methods" ? "#FF6B35" : "transparent",
                  color: "#fff", cursor: "pointer"
                }}
              >
                Phương Thức Xét Tuyển
              </button>
              <button
                onClick={() => setActiveTab("campuses")}
                style={{
                  padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none",
                  background: activeTab === "campuses" ? "#FF6B35" : "transparent",
                  color: "#fff", cursor: "pointer"
                }}
              >
                Phân Hiệu Toàn Quốc
              </button>
            </div>
          </div>

          {/* Tab 1: Top Majors */}
          {activeTab === "majors" && (
            <div style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              overflow: "hidden"
            }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
                  Bảng tổng hợp chỉ tiêu & Dự báo điểm chuẩn các ngành thế mạnh FPT University
                </span>
                <button
                  onClick={() => navigate("/portal/admission-lookup")}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#FF8C5A", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                >
                  Xem toàn bộ 47 ngành <ChevronRight size={15} />
                </button>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)", color: "#94A3B8", borderBottom: "1px solid rgba(255,255,255,0.08)", fontSize: 12, textTransform: "uppercase" }}>
                      <th style={{ padding: "14px 20px" }}>Ngành Đào Tạo</th>
                      <th style={{ padding: "14px 20px" }}>Mã Ngành</th>
                      <th style={{ padding: "14px 20px" }}>Khoa Quản Lý</th>
                      <th style={{ padding: "14px 20px" }}>Chỉ Tiêu 2026</th>
                      <th style={{ padding: "14px 20px" }}>Độ Quan Tâm (AI Index)</th>
                      <th style={{ padding: "14px 20px" }}>Điểm Chuẩn Dự Kiến</th>
                      <th style={{ padding: "14px 20px", textAlign: "right" }}>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_MAJORS.map((m, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "16px 20px", fontWeight: 600, color: "#fff" }}>
                          {m.name}
                        </td>
                        <td style={{ padding: "16px 20px", color: "#94A3B8", fontFamily: "monospace" }}>
                          {m.code}
                        </td>
                        <td style={{ padding: "16px 20px", color: "#CBD5E1" }}>
                          {m.faculty}
                        </td>
                        <td style={{ padding: "16px 20px", color: "#fff", fontWeight: 600 }}>
                          {m.quota} sinh viên
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ flex: 1, height: 6, width: 90, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{ width: `${m.demand}%`, height: "100%", background: "linear-gradient(90deg, #FF6B35, #E85A2A)", borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#FF8C5A" }}>{m.demand}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "16px 20px" }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: "#34D399" }}>{m.cutoff}</span>
                          <span style={{ fontSize: 11, color: "#10B981", marginLeft: 4 }}>({m.trend})</span>
                        </td>
                        <td style={{ padding: "16px 20px", textAlign: "right" }}>
                          <button
                            onClick={() => navigate("/portal/apply")}
                            style={{
                              padding: "6px 14px",
                              borderRadius: 8,
                              background: "rgba(255,107,53,0.15)",
                              border: "1px solid rgba(255,107,53,0.35)",
                              color: "#FF8C5A",
                              fontSize: 12,
                              fontWeight: 600,
                              cursor: "pointer"
                            }}
                          >
                            Đăng ký
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 2: Admission Methods */}
          {activeTab === "methods" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20 }}>
              {[
                { title: "Xét Điểm THPT Quốc Gia", icon: Award, desc: "Sử dụng tổ hợp điểm thi tốt nghiệp THPT theo quy chế của Bộ GD&ĐT.", target: "40% Chỉ tiêu", color: "#FF6B35" },
                { title: "Xét Điểm Học Bạ THPT", icon: BookOpen, desc: "Xét điểm trung bình học bạ lớp 11 và học kỳ 1 lớp 12 bằng SchoolRank.", target: "30% Chỉ tiêu", color: "#2563EB" },
                { title: "Đánh Giá Năng Lực (ĐHQG)", icon: Cpu, desc: "Sử dụng điểm thi ĐGNL của ĐHQG Hà Nội (HSA) hoặc ĐHQG TP.HCM.", target: "15% Chỉ tiêu", color: "#7C3AED" },
                { title: "Học Bổng FPT Talent & Tuyển Thẳng", icon: Sparkles, desc: "Dành cho học sinh giỏi quốc gia, cuộc thi quốc tế và kỳ thi FPT Talent.", target: "15% Chỉ tiêu", color: "#059669" },
              ].map((method, idx) => (
                <div key={idx} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${method.color}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <method.icon size={22} color={method.color} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{method.title}</h3>
                  <p style={{ fontSize: 13.5, color: "#94A3B8", lineHeight: 1.6, marginBottom: 16 }}>{method.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12 }}>
                    <span style={{ fontSize: 12, color: "#64748B" }}>Tỉ lệ phân bổ:</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: method.color }}>{method.target}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Campuses */}
          {activeTab === "campuses" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
              {[
                { name: "Hà Nội Campus", address: "Khu Công Nghệ Cao Hòa Lạc, Km 29 ĐL Thăng Long", desc: "Trụ sở chính với quy mô 30ha, trung tâm R&D và Innovation Hub.", students: "10,000+ SV" },
                { name: "TP. Hồ Chí Minh Campus", address: "Lô E2a-7, Đường D1 Khu Công Nghệ Cao, TP. Thủ Đức", desc: "Nằm tại trung tâm Khu CNC TP.HCM, kết nối doanh nghiệp vi mạch & AI.", students: "8,500+ SV" },
                { name: "Đà Nẵng Campus", address: "Khu đô thị FPT City, P. Hòa Hải, Q. Ngũ Hành Sơn", desc: "Campus ven biển xanh hiện đại, trọng điểm đào tạo kỹ sư toàn cầu.", students: "4,000+ SV" },
                { name: "Cần Thơ & Quy Nhơn Campus", address: "Cầu Rau Răm & Trung tâm Trí Tuệ Nhân Tạo Quy Nhơn", desc: "Tổ hợp đào tạo AI & Khoa học Dữ liệu lớn nhất miền Trung - Tây Nam Bộ.", students: "3,500+ SV" },
              ].map((c, idx) => (
                <div key={idx} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: "#FF8C5A", marginBottom: 12 }}>{c.address}</div>
                  <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6, marginBottom: 14 }}>{c.desc}</p>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#34D399" }}>Quy mô: {c.students}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>



      {/* ── 5. CALL TO ACTION & CONSULTATION BANNER ── */}
      <section style={{
        padding: "80px 24px",
        background: "linear-gradient(180deg, #091226 0%, #060d1e 100%)",
        borderTop: "1px solid rgba(255,255,255,0.08)"
      }}>
        <div style={{
          maxWidth: 1000,
          margin: "0 auto",
          textAlign: "center",
          background: "radial-gradient(ellipse at center, rgba(255,107,53,0.15) 0%, rgba(13,24,54,0.6) 100%)",
          border: "1px solid rgba(255,107,53,0.3)",
          borderRadius: 28,
          padding: "50px 32px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5)"
        }}>
          <h2 style={{ fontSize: "clamp(26px, 3.5vw, 36px)", fontWeight: 800, color: "#fff", marginBottom: 14 }}>
            Sẵn Sàng Gia Nhập Đại Học FPT 2026?
          </h2>
          <p style={{ color: "#CBD5E1", fontSize: 16, maxWidth: 620, margin: "0 auto 36px", lineHeight: 1.6 }}>
            Tra cứu ngay điểm chuẩn xét tuyển, kiểm tra điều kiện học bổng và hoàn tất hồ sơ trực tuyến trong vòng 5 phút.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/portal/apply")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 36px",
                background: "linear-gradient(135deg, #FF6B35 0%, #E85A2A 100%)",
                border: "none",
                borderRadius: 14,
                color: "#fff",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(255,107,53,0.45)",
                transition: "all 0.2s"
              }}
            >
              <Sparkles size={20} /> Nộp hồ sơ xét tuyển ngay
            </button>

            <button
              onClick={() => navigate("/portal/admission-lookup")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 30px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 14,
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer"
              }}
            >
              <Search size={20} color="#FF8C5A" /> Tra cứu điểm chuẩn
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
