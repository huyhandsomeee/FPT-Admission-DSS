import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Globe, Search, Calculator, Menu, X, LogIn, Database,
  GraduationCap, Users, BarChart3, TrendingUp, Server,
  ChevronDown, Phone, Mail, MapPin, ShieldCheck, Sparkles, ExternalLink, ArrowRight
} from "lucide-react";

const navItems = [
  { to: "/portal", label: "Tổng quan Cổng dữ liệu", end: true },
  { to: "/portal/apply", label: "Nộp hồ sơ Online", badge: "HOT" },
  { to: "/portal/admission-lookup", label: "Tra cứu điểm chuẩn" },
  { to: "/portal/score-calculator", label: "Tính điểm xét tuyển" },
];

const PORTAL_SHORTCUTS = [
  {
    category: "Thí sinh & Sinh viên",
    items: [
      { label: "Cổng Thí sinh & Phụ huynh", desc: "Nộp hồ sơ, tra cứu học bổng & điểm chuẩn", path: "/candidate", icon: Users, color: "#FF6B35" },
      { label: "Cổng Sinh viên chính quy", desc: "Xem GPA, học phí, LMS và tài nguyên số", path: "/student/dashboard", icon: GraduationCap, color: "#2563EB" },
    ]
  },
  {
    category: "Cán bộ & Đào tạo",
    items: [
      { label: "Cổng Cán bộ Tuyển sinh & Đào tạo", desc: "Xét duyệt hồ sơ, tiếp nhận và điều phối", path: "/officer/dashboard", icon: ShieldCheck, color: "#7C3AED" },
      { label: "Cán bộ Tài chính & Kế toán", desc: "Quản lý dòng thu học phí, định mức ngân sách", path: "/officer/finance", icon: Database, color: "#0891B2" },
      { label: "Cán bộ Nhân sự (HR)", desc: "Giảng viên, định mức giờ dạy & đánh giá", path: "/officer/hr", icon: Users, color: "#059669" },
    ]
  },
  {
    category: "Quản lý & Điều hành",
    items: [
      { label: "Cổng Quản lý Khoa & Phòng ban", desc: "DSS Analytics, dự báo ML/AI & What-if", path: "/manager/dashboard", icon: BarChart3, color: "#D97706" },
      { label: "Executive Portal (Ban Giám Đốc)", desc: "KPI chiến lược toàn trường & Data Lineage", path: "/bod/dashboard", icon: TrendingUp, color: "#DC2626" },
      { label: "Data Governance & IT Studio", desc: "Quản trị Data Catalog, Pipeline ETL & Security", path: "/admin/dashboard", icon: Server, color: "#059669" },
    ]
  }
];

export default function PublicLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPortals, setShowPortals] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showCocAssistant, setShowCocAssistant] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#0B132B", display: "flex", flexDirection: "column", color: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* ── Top Alert / System Status Bar ── */}
      <div style={{
        background: "linear-gradient(90deg, #091124 0%, #11224D 50%, #091124 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "6px 20px",
        fontSize: "12px",
        color: "#94A3B8"
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(16, 185, 129, 0.15)", color: "#34D399",
              padding: "2px 8px", borderRadius: 100, fontSize: "11px", fontWeight: 600
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
              DWH ONLINE
            </span>
            <span style={{ color: "#CBD5E1" }}>
              Hệ thống Kho Dữ liệu & Hỗ trợ Ra Quyết định Tuyển sinh Đại học FPT
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8" }}>
              <Phone size={12} color="#FF8C5A" /> Hotline Tuyển sinh: <strong style={{ color: "#FF8C5A" }}>1800 6616</strong>
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8" }}>
              <Mail size={12} color="#60A5FA" /> it@fpt.edu.vn
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Sticky Header ── */}
      <header style={{
        background: scrolled ? "rgba(11, 19, 43, 0.95)" : "rgba(11, 19, 43, 0.82)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.4)" : "none"
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 72, gap: 24, justifyContent: "space-between" }}>
          
          {/* Logo Brand with Cóc FPT Cute Mascot */}
          <button 
            onClick={() => navigate("/portal")} 
            style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
          >
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #FF6B35 0%, #E85A2A 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 20px rgba(255,107,53,0.5)",
              border: "2px solid rgba(255,255,255,0.25)",
              overflow: "hidden", position: "relative"
            }}>
              <img
                src="/fpt_toad_mascot.jpg"
                alt="Linh vật Cóc FPT"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ color: "#fff", fontWeight: 900, fontSize: 18, letterSpacing: -0.3 }}>CỔNG DỮ LIỆU FPT</span>
              </div>
              <div style={{ color: "#FF8C5A", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
                FPT UNIVERSITY DATA PORTAL
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav style={{ display: "none", gap: 6, alignItems: "center" }} className="desktop-nav">
            {navItems.map(item => (
              <NavLink 
                key={item.to} 
                to={item.to} 
                end={item.end}
                style={({ isActive }) => ({
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "#FF8C5A" : "#CBD5E1",
                  background: isActive ? "rgba(255, 107, 53, 0.12)" : "transparent",
                  textDecoration: "none",
                  border: isActive ? "1px solid rgba(255, 107, 53, 0.35)" : "1px solid transparent",
                  transition: "all 0.2s ease"
                })}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 800,
                    padding: "2px 5px",
                    borderRadius: 6,
                    letterSpacing: 0.5
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}

            {/* Portal Hub Dropdown Button */}
            <div style={{ position: "relative" }} onMouseLeave={() => setShowPortals(false)}>
              <button
                onMouseEnter={() => setShowPortals(true)}
                onClick={() => setShowPortals(!showPortals)}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
                  borderRadius: 10, fontSize: 14, fontWeight: 500,
                  background: showPortals ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  color: "#F8FAFC", cursor: "pointer", transition: "all 0.2s"
                }}
              >
                <Globe size={15} color="#60A5FA" />
                <span>Cổng Phân Hệ</span>
                <ChevronDown size={14} style={{ transform: showPortals ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>

              {/* Mega Dropdown Menu */}
              {showPortals && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 10px)",
                  right: -100,
                  width: 580,
                  background: "#0D1836",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 16,
                  boxShadow: "0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,107,53,0.15)",
                  padding: 18,
                  zIndex: 200,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16
                }}>
                  <div style={{ gridColumn: "1 / -1", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#FF8C5A", textTransform: "uppercase", letterSpacing: 1 }}>
                      Chọn Phân Hệ Người Dùng
                    </span>
                    <span style={{ fontSize: 11, color: "#64748B" }}>Single Sign-On (SSO) Active</span>
                  </div>

                  {PORTAL_SHORTCUTS.map((group, idx) => (
                    <div key={idx} style={{ gridColumn: idx === 2 ? "1 / -1" : "auto" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {group.category}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {group.items.map((p) => (
                          <button
                            key={p.path}
                            onClick={() => {
                              setShowPortals(false);
                              navigate(p.path);
                            }}
                            style={{
                              display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px",
                              borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid transparent",
                              color: "#F8FAFC", cursor: "pointer", textAlign: "left", transition: "all 0.15s"
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                              e.currentTarget.style.borderColor = "rgba(255,107,53,0.3)";
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                              e.currentTarget.style.borderColor = "transparent";
                            }}
                          >
                            <div style={{
                              width: 32, height: 32, borderRadius: 8,
                              background: `${p.color}22`, display: "flex", alignItems: "center",
                              justifyContent: "center", flexShrink: 0, marginTop: 2
                            }}>
                              <p.icon size={16} color={p.color} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}>{p.label}</div>
                              <div style={{ fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => navigate("/portal/apply")}
              style={{
                display: "none",
                alignItems: "center",
                gap: 8,
                padding: "9px 18px",
                background: "rgba(255, 107, 53, 0.15)",
                border: "1px solid rgba(255, 107, 53, 0.4)",
                borderRadius: 10,
                color: "#FF8C5A",
                fontWeight: 600,
                fontSize: 13.5,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              className="apply-cta-btn"
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,107,53,0.25)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,107,53,0.15)"; }}
            >
              <Sparkles size={15} color="#FF8C5A" /> Nộp hồ sơ xét tuyển
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "9px 20px",
                background: "linear-gradient(135deg, #FF6B35 0%, #E85A2A 100%)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontWeight: 600,
                fontSize: 13.5,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(255,107,53,0.4)",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,107,53,0.55)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,107,53,0.4)";
              }}
            >
              <LogIn size={15} /> Đăng nhập DSS
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                cursor: "pointer"
              }}
              className="mobile-menu-btn"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div style={{
            background: "#091124",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 12
          }}>
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isActive ? "#FF8C5A" : "#CBD5E1",
                  background: isActive ? "rgba(255, 107, 53, 0.15)" : "rgba(255,255,255,0.03)",
                  textDecoration: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                })}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{ background: "#FF6B35", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4 }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12, marginTop: 4 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", marginBottom: 8, textTransform: "uppercase" }}>
                Phân hệ người dùng:
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button onClick={() => { setMobileOpen(false); navigate("/candidate"); }} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: 12.5, textAlign: "left", cursor: "pointer" }}>
                  🎯 Cổng Thí sinh
                </button>
                <button onClick={() => { setMobileOpen(false); navigate("/student/dashboard"); }} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: 12.5, textAlign: "left", cursor: "pointer" }}>
                  🎓 Cổng Sinh viên
                </button>
                <button onClick={() => { setMobileOpen(false); navigate("/officer/dashboard"); }} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: 12.5, textAlign: "left", cursor: "pointer" }}>
                  🏢 Cán bộ Đào tạo
                </button>
                <button onClick={() => { setMobileOpen(false); navigate("/manager/dashboard"); }} style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#F8FAFC", fontSize: 12.5, textAlign: "left", cursor: "pointer" }}>
                  📊 Cổng Quản lý
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Main Portal Content Outlet ── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── Comprehensive Enterprise Footer ── */}
      <footer style={{
        background: "#060D1E",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        color: "#94A3B8",
        padding: "60px 24px 30px"
      }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 40, marginBottom: 50 }}>
            {/* Col 1: University Info */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: "linear-gradient(135deg, #FF6B35 0%, #E85A2A 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Database size={20} color="#fff" />
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>TRƯỜNG ĐẠI HỌC FPT</div>
                  <div style={{ color: "#FF8C5A", fontSize: 11, fontWeight: 600 }}>ENTERPRISE DATA PLATFORM</div>
                </div>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "#94A3B8", marginBottom: 20 }}>
                Hệ thống Kho Dữ liệu & Phân tích Hỗ trợ Ra Quyết định Tuyển sinh (DSS), tích hợp dữ liệu đa nguồn phục vụ đào tạo chất lượng cao chuẩn quốc tế.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#CBD5E1" }}>
                  🔒 ISO/IEC 27001
                </span>
                <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#CBD5E1" }}>
                  ⭐ QS 3-Stars
                </span>
                <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#CBD5E1" }}>
                  🏛️ ACBSP Accredited
                </span>
              </div>
            </div>

            {/* Col 2: Major Campuses */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>
                Phân Hiệu Đào Tạo Toàn Quốc
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 13 }}>
                <li style={{ display: "flex", gap: 8 }}>
                  <MapPin size={16} color="#FF6B35" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div><strong>Hà Nội:</strong> Khu CNC Hòa Lạc, Km 29 ĐL Thăng Long, Thạch Thất</div>
                </li>
                <li style={{ display: "flex", gap: 8 }}>
                  <MapPin size={16} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div><strong>TP. Hồ Chí Minh:</strong> Lô E2a-7, Đường D1 Khu CNC, P. Long Thạnh Mỹ, TP. Thủ Đức</div>
                </li>
                <li style={{ display: "flex", gap: 8 }}>
                  <MapPin size={16} color="#7C3AED" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div><strong>Đà Nẵng:</strong> Khu đô thị FPT City, P. Hòa Hải, Q. Ngũ Hành Sơn</div>
                </li>
                <li style={{ display: "flex", gap: 8 }}>
                  <MapPin size={16} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div><strong>Cần Thơ & Quy Nhơn:</strong> Cầu Rau Răm, Ninh Kiều & Khu Đô thị An Phú Thịnh</div>
                </li>
              </ul>
            </div>

            {/* Col 3: Quick Direct Services */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 16 }}>
                Dịch Vụ & Tra Cứu Trực Tuyến
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, fontSize: 13.5 }}>
                <li>
                  <button onClick={() => navigate("/portal/apply")} style={{ background: "none", border: "none", color: "#CBD5E1", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <ArrowRight size={13} color="#FF6B35" /> Đăng ký & Nộp hồ sơ Tuyển sinh 2026
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/portal/admission-lookup")} style={{ background: "none", border: "none", color: "#CBD5E1", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <ArrowRight size={13} color="#FF6B35" /> Tra cứu điểm chuẩn 5 năm gần nhất
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/portal/score-calculator")} style={{ background: "none", border: "none", color: "#CBD5E1", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <ArrowRight size={13} color="#FF6B35" /> Máy tính xét điểm THPT & Học bạ tự động
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/candidate")} style={{ background: "none", border: "none", color: "#CBD5E1", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <ArrowRight size={13} color="#FF6B35" /> Tra cứu học bổng FPT University Talent
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/login")} style={{ background: "none", border: "none", color: "#CBD5E1", padding: 0, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <ArrowRight size={13} color="#FF6B35" /> Đăng nhập hệ thống Cán bộ & Quản lý
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            fontSize: 12.5
          }}>
            <div>
              © 2026 <strong>Trường Đại học FPT</strong>. Bản quyền thuộc về Ban Đào tạo & Hệ thống DSS Đại học FPT.
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <span style={{ color: "#64748B" }}>Data Warehouse v2.4.0 (Enterprise)</span>
              <span style={{ color: "#64748B" }}>SLA: 99.98%</span>
              <span style={{ color: "#64748B" }}>Quy chế Tuyển sinh 2026</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── FLOATING CÓC FPT AI ASSISTANT WIDGET ── */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999 }}>
        {/* Cute Speech Bubble */}
        {!showCocAssistant && (
          <div
            onClick={() => setShowCocAssistant(true)}
            style={{
              position: "absolute", bottom: 70, right: 0, width: 240,
              background: "#0D1836", border: "1px solid #FF6B35",
              borderRadius: 14, padding: "10px 14px", color: "#FFFFFF",
              fontSize: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              cursor: "pointer", animation: "bounce 2s infinite"
            }}
          >
            <div style={{ fontWeight: 800, color: "#FF8C5A", marginBottom: 2 }}>🐸 Cóc FPT xin chào!</div>
            <div>Bạn cần tra cứu điểm chuẩn, học bổng hay cổng phân hệ? Bấm vào mình nhé!</div>
            <div style={{
              position: "absolute", bottom: -8, right: 24, width: 14, height: 14,
              background: "#0D1836", borderRight: "1px solid #FF6B35", borderBottom: "1px solid #FF6B35",
              transform: "rotate(45deg)"
            }} />
          </div>
        )}

        {/* Mascot Floating Action Button */}
        <button
          onClick={() => setShowCocAssistant(!showCocAssistant)}
          style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "linear-gradient(135deg, #FF6B35 0%, #EA580C 100%)",
            border: "2px solid rgba(255,255,255,0.4)",
            boxShadow: "0 0 25px rgba(255,107,53,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", overflow: "hidden", position: "relative",
            transition: "transform 0.2s"
          }}
          title="Trợ lý Dữ liệu Cóc FPT"
        >
          <img
            src="/fpt_toad_mascot.jpg"
            alt="Cóc FPT"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </button>

        {/* Interactive Assistant Drawer / Modal */}
        {showCocAssistant && (
          <div style={{
            position: "absolute", bottom: 75, right: 0, width: 360,
            background: "#0D1836", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 20, boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            overflow: "hidden", display: "flex", flexDirection: "column",
            animation: "fadeIn 0.2s ease-out"
          }}>
            {/* Header */}
            <div style={{
              padding: "16px 18px", background: "linear-gradient(135deg, #FF6B35 0%, #C2410C 100%)",
              display: "flex", alignItems: "center", justifyContent: "space-between", color: "#FFF"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "1.5px solid #FFF" }}>
                  <img src="/fpt_toad_mascot.jpg" alt="Cóc FPT" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900 }}>Trợ Lý Dữ Liệu Cóc FPT</div>
                  <div style={{ fontSize: 11, opacity: 0.9 }}>AI Data Assistant v2.6</div>
                </div>
              </div>
              <button
                onClick={() => setShowCocAssistant(false)}
                style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Actions & FAQ List */}
            <div style={{ padding: 18, maxHeight: 380, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, color: "#94A3B8" }}>
                Chào bạn! Mình có thể giúp bạn giải đáp tức thì các thông tin tuyển sinh & cổng dữ liệu:
              </div>

              {[
                { title: "🎯 Tra cứu điểm chuẩn 2026", desc: "Xem điểm sàn 47 ngành & lịch sử 5 năm", path: "/portal/admission-lookup" },
                { title: "🧮 Máy tính điểm xét tuyển tự động", desc: "Tính điểm THPT, Học bạ & ĐGNL", path: "/portal/score-calculator" },
                { title: "📝 Nộp hồ sơ xét tuyển trực tuyến", desc: "Đăng ký nguyện vọng & nhận mã hồ sơ", path: "/portal/apply" },
                { title: "🏆 Quy chế Học bổng FPT Talent", desc: "Học bổng 30% - 100% tài năng", path: "/candidate" },
                { title: "🏛️ Cổng Ban Giám Đốc (BOD Executive)", desc: "DSS Phê duyệt, chỉ đạo & điều hành", path: "/bod/dashboard" },
                { title: "🏢 Cổng Cán Bộ Tuyển Sinh", desc: "Thẩm định học bạ & hồ sơ", path: "/officer/admission" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setShowCocAssistant(false);
                    navigate(item.path);
                  }}
                  style={{
                    padding: "10px 12px", background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
                    cursor: "pointer", transition: "all 0.15s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,107,53,0.15)";
                    e.currentTarget.style.borderColor = "#FF6B35";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FF8C5A" }}>{item.title}</div>
                  <div style={{ fontSize: 11.5, color: "#CBD5E1", marginTop: 2 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Style Helpers */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .apply-cta-btn { display: flex !important; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
