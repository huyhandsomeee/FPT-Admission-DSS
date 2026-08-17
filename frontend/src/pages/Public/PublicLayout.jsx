import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Globe, Search, Calculator, Menu, X, LogIn, Bell, Database, BarChart3, ChevronDown } from "lucide-react";

const navItems = [
  { to: "/portal", label: "Trang chủ", end: true },
  { to: "/portal/apply", label: "📝 Nộp hồ sơ Online" },
  { to: "/portal/admission-lookup", label: "Tra cứu điểm chuẩn" },
  { to: "/portal/score-calculator", label: "Tính điểm xét tuyển" },
];

export default function PublicLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPortals, setShowPortals] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", flexDirection: "column" }}>
      {/* ── Header ── */}
      <header style={{
        background: "linear-gradient(135deg, #0d1b3e 0%, #1A3A6C 100%)",
        borderBottom: "1px solid rgba(255,107,53,0.3)",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 68, gap: 32 }}>
          {/* Logo */}
          <button onClick={() => navigate("/portal")} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", cursor: "pointer" }}>
            <div style={{
              width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg,#FF6B35,#E85A2A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 16px rgba(255,107,53,0.5)"
            }}>
              <Database size={20} color="#fff" />
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>FPT DATA PORTAL</div>
              <div style={{ color: "rgba(255,107,53,0.85)", fontSize: 10, fontWeight: 500, letterSpacing: 1 }}>CỔNG DỮ LIỆU ĐẠI HỌC</div>
            </div>
          </button>

          {/* Nav */}
          <nav style={{ display: "flex", gap: 4, flex: 1, alignItems: "center" }}>
            {navItems.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end}
                style={({ isActive }) => ({
                  padding: "8px 14px", borderRadius: 8, fontSize: 13.5, fontWeight: 500,
                  color: isActive ? "#FF6B35" : "rgba(255,255,255,0.75)",
                  background: isActive ? "rgba(255,107,53,0.15)" : "transparent",
                  textDecoration: "none", transition: "all 0.2s",
                  border: isActive ? "1px solid rgba(255,107,53,0.3)" : "1px solid transparent"
                })}>
                {item.label}
              </NavLink>
            ))}

            {/* Portal Access dropdown */}
            <div style={{ position: "relative", marginLeft: 8 }} onMouseLeave={() => setShowPortals(false)}>
              <button
                onMouseEnter={() => setShowPortals(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                  borderRadius: 8, fontSize: 13.5, fontWeight: 500, background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)", cursor: "pointer"
                }}>
                <Globe size={14} /> Truy cập Cổng <ChevronDown size={12} />
              </button>
              {showPortals && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0, minWidth: 220,
                  background: "#fff", borderRadius: 12, boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  border: "1px solid #E5E7EB", padding: 8, zIndex: 200
                }}>
                  {[
                    { label: "🎓 Sinh viên", path: "/student/dashboard", color: "#FF6B35" },
                    { label: "🏢 Cán bộ phòng ban", path: "/officer/dashboard", color: "#2563EB" },
                    { label: "📊 Quản lý", path: "/manager/dashboard", color: "#7C3AED" },
                    { label: "🎯 Ban Giám Đốc", path: "/bod/dashboard", color: "#0F172A" },
                    { label: "⚙️ Quản trị hệ thống", path: "/admin/dashboard", color: "#059669" },
                  ].map(p => (
                    <button key={p.path} onClick={() => navigate("/login")} style={{
                      display: "block", width: "100%", textAlign: "left", padding: "10px 14px",
                      borderRadius: 8, fontSize: 13.5, color: "#374151", background: "none",
                      border: "none", cursor: "pointer", fontWeight: 500,
                      transition: "background 0.15s"
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => navigate("/login")} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 18px",
              background: "linear-gradient(135deg,#FF6B35,#E85A2A)", border: "none", borderRadius: 10,
              color: "#fff", fontWeight: 600, fontSize: 13.5, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(255,107,53,0.4)", transition: "all 0.2s"
            }}>
              <LogIn size={15} /> Đăng nhập
            </button>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer style={{
        background: "#0d1b3e", color: "rgba(255,255,255,0.5)",
        textAlign: "center", padding: "20px 24px", fontSize: 13
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <span>© 2026 FPT University Data Portal — Cổng Dữ Liệu Đại Học FPT</span>
          <span style={{ display: "flex", gap: 16 }}>
            <span>Phòng CNTT: it@fpt.edu.vn</span>
            <span>Hotline: 1800 6616</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
