import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LayoutDashboard, TrendingUp, AlertTriangle, Lightbulb, Download, Settings, LogOut, Bell, User } from "lucide-react";

const navItems = [
  { to: "/bod/dashboard", icon: LayoutDashboard, label: "Bảng điều khiển" },
  { to: "/bod/forecast", icon: TrendingUp, label: "Báo cáo dự báo" },
  { to: "/bod/risks", icon: AlertTriangle, label: "Giám sát rủi ro" },
  { to: "/bod/recommendations", icon: Lightbulb, label: "Đề xuất chiến lược" },
  { to: "/bod/export", icon: Download, label: "Xuất báo cáo" },
];

const PAGE_TITLES = {
  "/bod/dashboard": "Executive Decision Portal",
  "/bod/forecast": "Executive Dashboard",
  "/bod/risks": "Executive Dashboard",
  "/bod/recommendations": "Chi Tiết Đề xuất",
  "/bod/export": "Xuất báo cáo",
};

const PAGE_SUBTITLES = {
  "/bod/dashboard": "FPT University • 2026 Admissions Cycle",
  "/bod/forecast": "Board of Directors Portal • FPT University",
  "/bod/risks": "Board of Directors Portal • FPT University",
  "/bod/recommendations": "Board of Directors Portal • FPT University",
  "/bod/export": "Board of Directors Portal • FPT University",
};

export default function BodLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const DARK = "#0d1b3e";
  const DARKER = "#091429";
  const MUTED = "rgba(148,163,184,0.85)";
  const ACTIVE_BG = "rgba(255,107,53,0.15)";
  const ORANGE = "#FF6B35";

  const title = PAGE_TITLES[pathname] || "Executive Decision Portal";
  const subtitle = PAGE_SUBTITLES[pathname] || "FPT University • 2026 Admissions Cycle";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 220,
        background: DARK,
        height: "100vh", position: "fixed", left: 0, top: 0,
        display: "flex", flexDirection: "column",
        zIndex: 50,
        borderRight: "1px solid rgba(255,255,255,0.05)"
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{
              width: 40, height: 40,
              background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
              borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 18 }}>F</span>
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 13.5 }}>FPT University</div>
              <div style={{ color: MUTED, fontSize: 10.5, marginTop: 1 }}>Ban Giám hiệu</div>
            </div>
          </div>
        </div>

        {/* Session identity */}
        <div style={{ margin: "14px 14px 6px", padding: "12px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(148,163,184,0.6)", letterSpacing: "0.6px", marginBottom: 5 }}>SESSION IDENTITY</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
            <span style={{ color: "white", fontSize: 12, fontWeight: 600 }}>Quản lý cấp cao</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "6px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 11,
                padding: "10px 13px", borderRadius: 9,
                textDecoration: "none",
                fontWeight: isActive ? 700 : 400,
                fontSize: 13,
                background: isActive ? ACTIVE_BG : "transparent",
                color: isActive ? ORANGE : MUTED,
                borderLeft: isActive ? `3px solid ${ORANGE}` : "3px solid transparent",
                transition: "all 0.15s"
              })}>
              <item.icon size={17} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Settings + Logout */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "10px 10px 16px" }}>
          <button style={{
            width: "100%", padding: "9px 13px", background: "none",
            border: "none", color: MUTED, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 11,
            fontSize: 13, borderRadius: 9, transition: "all 0.15s", marginBottom: 2
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = MUTED; }}
          >
            <Settings size={17} />
            <span>Cài đặt hệ thống</span>
          </button>
          <button onClick={async () => { await logout(); navigate("/login"); }}
            style={{
              width: "100%", padding: "9px 13px", background: "none",
              border: "none", color: MUTED, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 11,
              fontSize: 13, borderRadius: 9, transition: "all 0.15s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = MUTED; }}
          >
            <LogOut size={17} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh", background: "#F8FAFC" }}>
        {/* Header */}
        <header style={{
          height: 56, background: "white",
          borderBottom: "1px solid #E2E8F0",
          display: "flex", alignItems: "center",
          padding: "0 28px", gap: 12,
          position: "sticky", top: 0, zIndex: 40,
          justifyContent: "space-between"
        }}>
          {/* Left: title + subtitle */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#1E293B" }}>{title}</span>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>| {subtitle}</span>
          </div>

          {/* Right: Bell + User */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 6, borderRadius: 8 }}>
              <Bell size={18} />
            </button>
            <button style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <User size={15} color="#475569" />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>Admin Executive</div>
                <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.3px" }}>SUPER USER</div>
              </div>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: 13, flexShrink: 0
              }}>
                {(user?.fullName || "AE").slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div style={{ padding: 28 }} className="page-fade">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
