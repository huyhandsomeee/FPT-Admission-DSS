import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { LayoutDashboard, TrendingUp, AlertTriangle, Lightbulb, Download, LogOut, Menu, ChevronRight, User } from "lucide-react";

const navItems = [
  { to: "/bod/dashboard", icon: LayoutDashboard, label: "Executive Dashboard" },
  { to: "/bod/forecast", icon: TrendingUp, label: "Báo cáo dự báo" },
  { to: "/bod/risks", icon: AlertTriangle, label: "Giám sát rủi ro" },
  { to: "/bod/recommendations", icon: Lightbulb, label: "Đề xuất chiến lược" },
  { to: "/bod/export", icon: Download, label: "Xuất báo cáo" },
];

export default function BodLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside style={{
        width: collapsed ? 72 : 270,
        background: "linear-gradient(180deg, #0F172A 0%, #1E293B 60%, #334155 100%)",
        height: "100vh", position: "fixed", left: 0, top: 0,
        display: "flex", flexDirection: "column", transition: "width 0.3s", zIndex: 50, overflow: "hidden"
      }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, background: "linear-gradient(135deg, #FF6B35, #E85A2A)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "white", fontWeight: 900, fontSize: 20 }}>F</span>
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>FPT University</div>
              <div style={{ color: "rgba(148,163,184,1)", fontSize: 11 }}>Ban Giám hiệu</div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: "auto", color: "rgba(148,163,184,1)", background: "none", border: "none", cursor: "pointer" }}>
            {collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {!collapsed && (
          <div style={{ margin: "16px 12px 8px", padding: "14px 16px", background: "rgba(255,255,255,0.06)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ color: "rgba(148,163,184,1)", fontSize: 11, marginBottom: 6 }}>ĐĂNG NHẬP LÚC</div>
            <div style={{ color: "white", fontWeight: 600, fontSize: 13 }}>{user?.fullName}</div>
            <div style={{ color: "rgba(148,163,184,1)", fontSize: 11, marginTop: 2 }}>Ban Giám hiệu • Quản lý cấp cao</div>
          </div>
        )}

        <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} title={collapsed ? item.label : ""}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
                borderRadius: 12, textDecoration: "none", fontWeight: 500, fontSize: 13,
                background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                color: isActive ? "white" : "rgba(148,163,184,1)",
                borderLeft: isActive ? "3px solid #FF6B35" : "3px solid transparent",
                transition: "all 0.15s"
              })}>
              <item.icon size={19} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={async () => { await logout(); navigate("/login"); }}
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", borderRadius: 12, background: "none", border: "none", color: "rgba(148,163,184,1)", cursor: "pointer", fontSize: 13 }}>
            <LogOut size={19} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: collapsed ? 72 : 270, flex: 1, minHeight: "100vh", background: "#F8FAFC", transition: "margin-left 0.3s" }}>
        <header className="portal-header justify-between" style={{ background: "#0F172A", borderBottom: "1px solid #1E293B" }}>
          <div>
            <h2 className="text-lg font-semibold text-white">Executive Dashboard</h2>
            <p className="text-xs" style={{ color: "rgba(148,163,184,1)" }}>Board of Directors Portal • FPT University</p>
          </div>
        </header>
        <div className="portal-content page-fade"><Outlet /></div>
      </main>
    </div>
  );
}
