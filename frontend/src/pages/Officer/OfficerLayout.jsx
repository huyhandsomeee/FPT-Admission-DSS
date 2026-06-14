import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { LayoutDashboard, Users, MessageSquare, LogOut, Menu, ChevronRight, User, Bell } from "lucide-react";

const navItems = [
  { to: "/officer/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/officer/applicants", icon: Users, label: "Danh sách hồ sơ" },
  { to: "/officer/communication", icon: MessageSquare, label: "Liên lạc" },
];

export default function OfficerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside style={{
        width: collapsed ? 72 : 260,
        background: "linear-gradient(180deg, #1E3A8A 0%, #1D4ED8 50%, #2563EB 100%)",
        height: "100vh", position: "fixed", left: 0, top: 0,
        display: "flex", flexDirection: "column", transition: "width 0.3s", zIndex: 50,
        overflow: "hidden"
      }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#1D4ED8", fontWeight: 900, fontSize: 18 }}>F</span>
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>FPT University</div>
              <div style={{ color: "rgba(147,197,253,1)", fontSize: 12 }}>Nhân viên tuyển sinh</div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ marginLeft: "auto", color: "rgba(147,197,253,1)", background: "none", border: "none", cursor: "pointer" }}>
            {collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {!collapsed && (
          <div style={{ margin: "16px 12px 0", padding: 12, background: "rgba(255,255,255,0.1)", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={16} color="white" />
              </div>
              <div>
                <div style={{ color: "white", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>{user?.fullName}</div>
                <div style={{ color: "rgba(147,197,253,1)", fontSize: 11 }}>Nhân viên TS</div>
              </div>
            </div>
          </div>
        )}

        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} title={collapsed ? item.label : ""}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                borderRadius: 12, textDecoration: "none", fontWeight: 500, fontSize: 14,
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                color: isActive ? "white" : "rgba(147,197,253,1)",
                transition: "all 0.15s"
              })}>
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={async () => { await logout(); navigate("/login"); }}
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", borderRadius: 12, background: "none", border: "none", color: "rgba(147,197,253,1)", cursor: "pointer", fontSize: 14 }}>
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: collapsed ? 72 : 260, flex: 1, minHeight: "100vh", background: "#F1F5F9", transition: "margin-left 0.3s" }}>
        <header className="portal-header justify-between" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Portal Nhân viên tuyển sinh</h2>
            <p className="text-xs text-gray-500">Admission Officer Portal</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors">
              <Bell size={18} className="text-blue-600" />
            </div>
          </div>
        </header>
        <div className="portal-content page-fade"><Outlet /></div>
      </main>
    </div>
  );
}
