import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { LayoutDashboard, Users, MessageSquare, LogOut, Menu, ChevronRight, Bell, Search } from "lucide-react";

const navItems = [
  { to: "/officer/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/officer/applicants", icon: Users, label: "Danh sách hồ sơ" },
  { to: "/officer/communication", icon: MessageSquare, label: "Liên lạc" },
];

export default function OfficerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Lấy 2 chữ cái đầu của tên
  const getInitials = (name) => {
    if (!name) return "NV";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 72 : 260,
        background: "linear-gradient(180deg, #1E3A8A 0%, #1D4ED8 50%, #2563EB 100%)",
        height: "100vh", position: "fixed", left: 0, top: 0,
        display: "flex", flexDirection: "column", transition: "width 0.3s", zIndex: 50,
        overflow: "hidden"
      }}>
        {/* Logo */}
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

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
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

        {/* Logout */}
        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <button onClick={async () => { await logout(); navigate("/login"); }}
            style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 14px", borderRadius: 12, background: "none", border: "none", color: "rgba(147,197,253,1)", cursor: "pointer", fontSize: 14 }}>
            <LogOut size={20} style={{ flexShrink: 0 }} />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: collapsed ? 72 : 260, flex: 1, minHeight: "100vh", background: "#F1F5F9", transition: "margin-left 0.3s" }}>
        {/* Header */}
        <header style={{
          height: 64, background: "white", borderBottom: "1px solid #E2E8F0",
          display: "flex", alignItems: "center", padding: "0 24px",
          position: "sticky", top: 0, zIndex: 40, gap: 16,
          justifyContent: "space-between"
        }}>
          {/* Left: Title */}
          <div>
            <h2 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#1E293B" }}>Portal Nhân viên tuyển sinh</h2>
            <p style={{ margin: 0, fontSize: 12, color: "#94A3B8" }}>Admission Officer Portal</p>
          </div>

          {/* Right: Search + Bell + User */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Search bar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#F8FAFC", border: "1px solid #E2E8F0",
              borderRadius: 10, padding: "8px 14px", width: 220
            }}>
              <Search size={15} color="#94A3B8" />
              <input
                type="text"
                placeholder="Tìm kiếm hồ sơ..."
                style={{
                  border: "none", background: "transparent", outline: "none",
                  fontSize: 13, color: "#475569", width: "100%"
                }}
              />
            </div>

            {/* Bell notification */}
            <div style={{
              position: "relative", width: 38, height: 38,
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: 10, background: "#EFF6FF", cursor: "pointer",
              transition: "background 0.2s"
            }}>
              <Bell size={18} color="#2563EB" />
              {/* Notification dot */}
              <span style={{
                position: "absolute", top: 7, right: 7,
                width: 8, height: 8, background: "#EF4444",
                borderRadius: "50%", border: "2px solid white"
              }} />
            </div>

            {/* User info */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", lineHeight: 1.3 }}>
                  {user?.fullName || "Nhân viên"}
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>HÀ NỘI CAMPUS</div>
              </div>
              {/* Avatar */}
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: 13,
                flexShrink: 0, border: "2px solid #DBEAFE"
              }}>
                {getInitials(user?.fullName)}
              </div>
            </div>
          </div>
        </header>

        <div className="portal-content page-fade"><Outlet /></div>
      </main>
    </div>
  );
}
