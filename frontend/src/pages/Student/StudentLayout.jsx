import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard, FileText, FolderOpen, Bell, LogOut,
  User, ChevronRight, Menu, X
} from "lucide-react";

const navItems = [
  { to: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/student/apply", icon: FileText, label: "Nộp hồ sơ" },
  { to: "/student/applications", icon: FolderOpen, label: "Hồ sơ của tôi" },
  { to: "/student/documents", icon: FileText, label: "Tài liệu" },
  { to: "/student/notifications", icon: Bell, label: "Thông báo" },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <aside
        style={{
          width: collapsed ? 72 : 260,
          background: "linear-gradient(180deg, #FF6B35 0%, #E85A2A 50%, #C8420E 100%)",
          height: "100vh", position: "fixed", left: 0, top: 0,
          display: "flex", flexDirection: "column", transition: "width 0.3s", zIndex: 50,
          overflow: "hidden"
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, background: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#EA580C", fontWeight: 900, fontSize: 18 }}>F</span>
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>FPT University</div>
              <div style={{ color: "rgba(254,215,170,1)", fontSize: 12 }}>Cổng thí sinh</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ marginLeft: "auto", color: "rgba(254,215,170,1)", background: "none", border: "none", cursor: "pointer" }}
          >
            {collapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div style={{ margin: "16px 12px 0", padding: 12, background: "rgba(255,255,255,0.1)", borderRadius: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={16} color="white" />
              </div>
              <div>
                <div style={{ color: "white", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>
                  {user?.fullName || "Sinh viên"}
                </div>
                <div style={{ color: "rgba(254,215,170,1)", fontSize: 11 }}>Thí sinh 2025</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : ""}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                borderRadius: 12, textDecoration: "none", fontWeight: 500, fontSize: 14,
                background: isActive ? "white" : "transparent",
                color: isActive ? "#EA580C" : "rgba(254,215,170,1)",
                boxShadow: isActive ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
                transition: "all 0.15s"
              })}
            >
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button
            onClick={handleLogout}
            title={collapsed ? "Đăng xuất" : ""}
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", borderRadius: 12, background: "none", border: "none", color: "rgba(254,215,170,1)", cursor: "pointer", fontSize: 14 }}
          >
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: collapsed ? 72 : 260, flex: 1, minHeight: "100vh", background: "#F9FAFB", transition: "margin-left 0.3s" }}>
        {/* Header */}
        <header className="portal-header justify-between" style={{ borderBottom: "1px solid #E2E8F0" }}>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Cổng thí sinh</h2>
            <p className="text-xs text-gray-500">FPT University Admission Portal 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to="/student/notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-orange-50 hover:bg-orange-100 cursor-pointer transition-colors">
              <Bell size={18} className="text-orange-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </NavLink>
            <NavLink to="/student/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <User size={16} className="text-orange-500" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.fullName?.split(' ').slice(-1)[0]}</span>
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <div className="portal-content page-fade">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
