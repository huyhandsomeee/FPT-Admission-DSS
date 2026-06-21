import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard, FileText, FolderOpen, Bell, LogOut,
  User, ChevronRight, Menu, GraduationCap
} from "lucide-react";

const navItems = [
  { to: "/student/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/student/apply", icon: FileText, label: "Nộp hồ sơ" },
  { to: "/student/applications", icon: FolderOpen, label: "Hồ sơ của tôi" },
  { to: "/student/documents", icon: FileText, label: "Tài liệu" },
  { to: "/student/notifications", icon: Bell, label: "Thông báo" },
  { to: "/student/university-info", icon: GraduationCap, label: "Thông tin trường" },
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
        <div style={{
          padding: collapsed ? "16px 0" : "20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: collapsed ? "column" : "row",
          alignItems: "center",
          gap: collapsed ? 10 : 12,
          justifyContent: "center"
        }}>
          <div style={{ width: 40, height: 40, background: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#EA580C", fontWeight: 900, fontSize: 18 }}>F</span>
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>FPT University</div>
              <div style={{ color: "rgba(254,215,170,1)", fontSize: 12 }}>Cổng thí sinh</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              marginLeft: collapsed ? "0" : "auto",
              color: "rgba(254,215,170,1)",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              cursor: "pointer",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
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
                <div style={{ color: "rgba(254,215,170,1)", fontSize: 11 }}>Thí sinh 2026</div>
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
        <header className="portal-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E2E8F0", padding: "0 24px", height: "64px" }}>
          <div>
            <h2 className="text-lg font-semibold text-gray-800" style={{ margin: 0 }}>Cổng thí sinh</h2>
            <p className="text-xs text-gray-500" style={{ margin: 0, marginTop: "2px" }}>FPT University Admission Portal 2026</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <NavLink to="/student/notifications"
              style={{
                position: "relative",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                backgroundColor: "#FFF7F4",
                cursor: "pointer",
                textDecoration: "none"
              }}
            >
              <Bell size={18} style={{ color: "#FF6B35" }} />
              <span style={{ position: "absolute", top: "8px", right: "8px", width: "8px", height: "8px", backgroundColor: "#EF4444", borderRadius: "50%", border: "1.5px solid white" }}></span>
            </NavLink>
            <NavLink to="/student/dashboard"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "10px",
                textDecoration: "none",
                cursor: "pointer",
                backgroundColor: "transparent"
              }}
            >
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#FFF7F4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={16} style={{ color: "#FF6B35" }} />
              </div>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#334155" }} className="hidden sm:block">
                {user?.fullName?.split(' ').slice(-1)[0]}
              </span>
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
