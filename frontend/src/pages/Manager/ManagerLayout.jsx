import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { LayoutDashboard, BarChart3, LineChart, Map, TrendingUp, Lightbulb, LogOut, Menu, ChevronRight, User, Bell } from "lucide-react";

const navItems = [
  { to: "/manager/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/manager/analytics/overview", icon: BarChart3, label: "Xu hướng tuyển sinh" },
  { to: "/manager/analytics/majors", icon: BarChart3, label: "Phân tích theo ngành" },
  { to: "/manager/analytics/regional", icon: Map, label: "Phân tích theo vùng" },
  { to: "/manager/forecast", icon: TrendingUp, label: "Dự báo" },
  { to: "/manager/recommendations", icon: Lightbulb, label: "Đề xuất" },
];

export default function ManagerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside style={{
        width: collapsed ? 72 : 260,
        background: "linear-gradient(180deg, #4C1D95 0%, #6D28D9 50%, #7C3AED 100%)",
        height: "100vh", position: "fixed", left: 0, top: 0,
        display: "flex", flexDirection: "column", transition: "width 0.3s", zIndex: 50, overflow: "hidden"
      }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#7C3AED", fontWeight: 900, fontSize: 18 }}>F</span>
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>FPT University</div>
              <div style={{ color: "rgba(196,181,253,1)", fontSize: 12 }}>Trưởng phòng tuyển sinh</div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: "auto", color: "rgba(196,181,253,1)", background: "none", border: "none", cursor: "pointer" }}>
            {collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} title={collapsed ? item.label : ""}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12, padding: "9px 14px",
                borderRadius: 12, textDecoration: "none", fontWeight: 500, fontSize: 13,
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                color: isActive ? "white" : "rgba(196,181,253,1)",
                transition: "all 0.15s"
              })}>
              <item.icon size={19} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={async () => { await logout(); navigate("/login"); }}
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", borderRadius: 12, background: "none", border: "none", color: "rgba(196,181,253,1)", cursor: "pointer", fontSize: 14 }}>
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: collapsed ? 72 : 260, flex: 1, minHeight: "100vh", background: "#FAF5FF", transition: "margin-left 0.3s" }}>
        <header className="portal-header justify-between" style={{ borderBottom: "1px solid #E9D5FF" }}>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Analytics & Decision Support</h2>
            <p className="text-xs text-gray-500">Manager Portal - FPT Admission</p>
          </div>
        </header>
        <div className="portal-content page-fade"><Outlet /></div>
      </main>
    </div>
  );
}
