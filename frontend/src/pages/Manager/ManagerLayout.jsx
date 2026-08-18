import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../../config/axiosConfig";
import {
  LayoutDashboard, TrendingUp, BarChart2, Map, LineChart, Lightbulb,
  Settings, HelpCircle, Bell, FileText, Search, LogOut, Layers,
  Database, DollarSign, Users, ShieldCheck
} from "lucide-react";

const navItems = [
  { to: "/manager/dashboard", icon: LayoutDashboard, label: "Bảng điều khiển" },
  { to: "/manager/data-warehouse", icon: Database, label: "Data Warehouse" },
  { to: "/manager/analytics/overview", icon: TrendingUp, label: "Xu hướng tuyển sinh" },
  { to: "/manager/analytics/majors", icon: BarChart2, label: "Phân tích theo ngành" },
  { to: "/manager/analytics/regional", icon: Map, label: "Phân tích theo vùng" },
  { to: "/manager/forecast", icon: LineChart, label: "Dự báo tuyển sinh" },
  { to: "/manager/financial", icon: DollarSign, label: "Quản lý tài chính" },
  { to: "/manager/human-resources", icon: Users, label: "Quản lý nhân sự" },
  { to: "/manager/data-quality", icon: ShieldCheck, label: "Chất lượng dữ liệu" },
  { to: "/manager/recommendations", icon: Lightbulb, label: "Đề xuất AI" },
  { to: "/manager/simulation", icon: Layers, label: "Mô phỏng \"What-If\"" },
];

export default function ManagerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = () => {
    api.get("/api/student/notifications?page=0&size=10")
      .then(r => {
        if (r.data && r.data.content) {
          setNotifications(r.data.content);
          setUnreadCount(r.data.unreadCount || 0);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = () => {
    api.post("/api/student/notifications/read-all")
      .then(() => fetchNotifications())
      .catch(() => {});
  };

  const SIDEBAR_BG = "#2E3A50";
  const NAV_HOVER = "rgba(255,255,255,0.06)";
  const NAV_ACTIVE = "#FF6B35";
  const TEXT_MUTED = "#94A3B8";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F9" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 230,
        background: SIDEBAR_BG,
        height: "100vh",
        position: "fixed", left: 0, top: 0,
        display: "flex", flexDirection: "column",
        zIndex: 50,
        borderRight: "1px solid rgba(255,255,255,0.05)"
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <span style={{ color: "white", fontWeight: 800, fontSize: 18, letterSpacing: "0.5px" }}>Đại học FPT</span>
            <span style={{ color: TEXT_MUTED, fontSize: 11, fontWeight: 500 }}>Cổng Tuyển sinh</span>
          </div>
        </div>

        {/* Nav list */}
        <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 16px", borderRadius: 8,
                textDecoration: "none", fontWeight: isActive ? 600 : 400,
                fontSize: 13.5,
                background: isActive ? "rgba(255,107,53,0.12)" : "transparent",
                color: isActive ? NAV_ACTIVE : "#D1D5DB",
                transition: "all 0.15s",
                borderLeft: isActive ? `3px solid ${NAV_ACTIVE}` : "3px solid transparent",
              })}>
              <item.icon size={17} style={{ flexShrink: 0, color: item.to === window.location.pathname ? NAV_ACTIVE : "#9CA3AF" }} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Add Record button */}
        <div style={{ padding: "0 14px 14px" }}>
          <button 
            onClick={() => alert("Chức năng tạo hồ sơ mới chỉ dành cho học sinh hoặc cán bộ nhập liệu!")}
            style={{
              width: "100%", padding: "10px 14px",
              background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
              border: "none",
              borderRadius: 10, color: "white",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 12px rgba(255,107,53,0.25)",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <span style={{ fontSize: 16, fontWeight: 800 }}>+</span> Hồ sơ mới
          </button>
        </div>

        {/* Logout */}
        <div style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button 
            onClick={() => { logout(); navigate("/login"); }}
            style={{
              width: "100%", padding: "10px 14px", background: "none",
              border: "none", color: "#EF4444", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              fontSize: 13.5, borderRadius: 8, transition: "all 0.15s",
              fontWeight: 500
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <main style={{ marginLeft: 230, flex: 1, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{
          height: 64, background: "white",
          borderBottom: "1px solid #E2E8F0",
          display: "flex", alignItems: "center",
          padding: "0 28px",
          position: "sticky", top: 0, zIndex: 40,
          justifyContent: "space-between"
        }}>
          {/* Search bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#F8FAFC", borderRadius: 10, padding: "8px 16px", width: 280,
            border: "1px solid #E2E8F0"
          }}>
            <Search size={15} color="#94A3B8" />
            <input type="text" placeholder="Tìm kiếm dữ liệu, xu hướng..."
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#334155", width: "100%" }} />
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Bell icon with dropdown popup */}
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ background: "none", border: "none", cursor: "pointer", position: "relative", color: "#64748B", display: "flex", alignItems: "center" }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <div style={{
                    position: "absolute", top: -4, right: -4, 
                    background: "#EF4444", color: "white", borderRadius: "50%",
                    fontSize: "9px", fontWeight: "800", minWidth: "14px", height: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px"
                  }}>
                    {unreadCount}
                  </div>
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: "absolute", right: 0, top: 32, width: 340,
                  backgroundColor: "white", borderRadius: 12, border: "1px solid #E2E8F0",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100, overflow: "hidden"
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFC" }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: "#1E293B" }}>Thông báo tuyển sinh</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} style={{ background: "none", border: "none", color: "#2563EB", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>
                  <div style={{ maxHeight: 280, overflowY: "auto" }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: 24, textAlign: "center", color: "#94A3B8", fontSize: 12.5 }}>
                        Không có thông báo mới nào
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} style={{
                          padding: "12px 16px", borderBottom: "1px solid #F8FAFC",
                          background: n.isRead ? "white" : "#EFF6FF", transition: "background 0.2s",
                          textAlign: "left"
                        }}>
                          <div style={{ fontWeight: 700, fontSize: 12.5, color: "#1E293B", marginBottom: 3 }}>{n.title}</div>
                          <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{n.message}</div>
                          <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 6, fontWeight: 500 }}>
                            {n.createdAt ? new Date(n.createdAt).toLocaleString("vi-VN") : ""}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Question icon */}
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}>
              <HelpCircle size={18} />
            </button>

            {/* Divider line */}
            <div style={{ width: 1, height: 24, background: "#E2E8F0" }} />

            {/* Profile info */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{user?.fullName || "Quản lý Tuyển sinh"}</div>
                <div style={{ fontSize: 10.5, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.3px", marginTop: 1 }}>QUẢN LÝ TUYỂN SINH</div>
              </div>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#FF6B35",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: 13,
                boxShadow: "0 2px 6px rgba(255,107,53,0.2)"
              }}>
                AT
              </div>
            </div>
          </div>
        </header>

        {/* Content container */}
        <div style={{ padding: "28px", flex: 1, background: "#F8FAFC" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
