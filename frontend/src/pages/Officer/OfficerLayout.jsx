import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../../config/axiosConfig";
import {
  LayoutDashboard, Users, MessageSquare,
  Settings, LogOut, Bell, HelpCircle, Search,
  PlusCircle
} from "lucide-react";

const navItems = [
  { to: "/officer/dashboard", icon: LayoutDashboard, label: "Bảng điều khiển" },
  { to: "/officer/applicants", icon: Users, label: "Danh sách hồ sơ" },
  { to: "/officer/communication", icon: MessageSquare, label: "Liên hệ sinh viên" },
];

const settingsItems = [
  { to: "/officer/settings", icon: Settings, label: "Cài đặt" },
];

function getInitials(name) {
  if (!name) return "NV";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function OfficerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

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

  const ORANGE = "#FF6B35";
  const ACTIVE_BG = "rgba(255,107,53,0.08)";
  const MUTED = "#94A3B8";
  const DARK_TEXT = "#1E293B";
  const SIDEBAR_BG = "#FFFFFF";
  const HEADER_DARK = "#2D3748";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F6FA" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 220,
        background: SIDEBAR_BG,
        height: "100vh",
        position: "fixed", left: 0, top: 0,
        display: "flex", flexDirection: "column",
        zIndex: 50,
        borderRight: "1px solid #E8ECF1",
        boxShadow: "2px 0 8px rgba(0,0,0,0.04)"
      }}>
        {/* Logo Area — dark gradient top */}
        <div style={{
          padding: "20px 18px 18px",
          background: "linear-gradient(135deg, #2D3748 0%, #1A202C 100%)",
          borderBottom: "3px solid " + ORANGE
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{
              width: 38, height: 38,
              background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
              borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 17 }}>F</span>
            </div>
            <div>
              <div style={{ color: ORANGE, fontWeight: 800, fontSize: 14, letterSpacing: "0.3px" }}>Đại học FPT</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 1 }}>Cổng Tuyển sinh</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 10px 6px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.to);
            return (
              <NavLink key={item.to} to={item.to}
                style={{
                  display: "flex", alignItems: "center", gap: 11,
                  padding: "11px 14px", borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13.5,
                  background: isActive ? ACTIVE_BG : "transparent",
                  color: isActive ? ORANGE : "#64748B",
                  borderLeft: isActive ? `3px solid ${ORANGE}` : "3px solid transparent",
                  transition: "all 0.2s ease"
                }}>
                <item.icon size={18} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Settings divider */}
          <div style={{
            margin: "18px 14px 8px",
            fontSize: 10,
            fontWeight: 700,
            color: "#CBD5E0",
            letterSpacing: "0.8px",
            textTransform: "uppercase"
          }}>
            CÀI ĐẶT CHUNG
          </div>

          {settingsItems.map((item) => {
            const isActive = pathname.startsWith(item.to);
            return (
              <NavLink key={item.to} to={item.to}
                style={{
                  display: "flex", alignItems: "center", gap: 11,
                  padding: "11px 14px", borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 13.5,
                  background: isActive ? ACTIVE_BG : "transparent",
                  color: isActive ? ORANGE : "#64748B",
                  borderLeft: isActive ? `3px solid ${ORANGE}` : "3px solid transparent",
                  transition: "all 0.2s ease"
                }}>
                <item.icon size={18} style={{ flexShrink: 0 }} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom: Create button + Logout */}
        <div style={{ padding: "12px 14px 16px", borderTop: "1px solid #E8ECF1" }}>
          <button
            onClick={() => navigate("/officer/applicants")}
            style={{
              width: "100%", padding: "11px 16px",
              background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
              border: "none", borderRadius: 10,
              color: "white", fontWeight: 700, fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8,
              boxShadow: "0 4px 12px rgba(255,107,53,0.3)",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(255,107,53,0.4)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(255,107,53,0.3)"; }}
          >
            <PlusCircle size={16} />
            Tạo hồ sơ mới
          </button>

          <button onClick={async () => { await logout(); navigate("/login"); }}
            style={{
              width: "100%", padding: "9px 14px", background: "none",
              border: "none", color: "#94A3B8", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              fontSize: 13, borderRadius: 9, transition: "all 0.15s",
              marginTop: 8
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#DC2626"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#94A3B8"; }}
          >
            <LogOut size={16} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ marginLeft: 220, flex: 1, minHeight: "100vh", background: "#F5F6FA" }}>
        {/* Header */}
        <header style={{
          height: 60, background: "white",
          borderBottom: "1px solid #E8ECF1",
          display: "flex", alignItems: "center",
          padding: "0 28px", gap: 16,
          position: "sticky", top: 0, zIndex: 40,
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
        }}>
          {/* Search bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#F7F8FA", border: "1px solid #E2E8F0",
            borderRadius: 10, padding: "8px 16px", flex: 1, maxWidth: 420
          }}>
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Tìm kiếm hồ sơ, tên học sinh..."
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%", fontFamily: "inherit" }}
            />
          </div>

          {/* Right: Bell + Help + User */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {/* Bell icon with dropdown popup */}
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#64748B", padding: 8, borderRadius: 10,
                  transition: "all 0.15s", position: "relative", display: "flex", alignItems: "center"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F7F8FA"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
              >
                <Bell size={19} />
                {unreadCount > 0 && (
                  <div style={{
                    position: "absolute", top: 2, right: 2, 
                    background: "#FF6B35", color: "white", borderRadius: "50%",
                    fontSize: "9px", fontWeight: "800", minWidth: "14px", height: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px",
                    border: "1px solid white"
                  }}>
                    {unreadCount}
                  </div>
                )}
              </button>

              {showNotifications && (
                <div style={{
                  position: "absolute", right: 0, top: 36, width: 340,
                  backgroundColor: "white", borderRadius: 12, border: "1px solid #E2E8F0",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100, overflow: "hidden"
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFC" }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5, color: "#1E293B" }}>Thông báo tuyển sinh</span>
                    {unreadCount > 0 && (
                      <button onClick={handleMarkAllRead} style={{ background: "none", border: "none", color: "#FF6B35", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
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
                          background: n.isRead ? "white" : "#FFF7ED", transition: "background 0.2s",
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
            <button style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#64748B", padding: 8, borderRadius: 10,
              transition: "all 0.15s"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "#F7F8FA"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
            >
              <HelpCircle size={19} />
            </button>

            <div style={{ width: 1, height: 28, background: "#E2E8F0", margin: "0 8px" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
              onClick={() => navigate("/officer/settings")}
            >
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: DARK_TEXT }}>{user?.fullName || "Cán bộ Tuyển sinh"}</div>
                <div style={{ fontSize: 10.5, color: MUTED, fontWeight: 500 }}>Phòng Tuyển sinh</div>
              </div>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: 13.5, flexShrink: 0,
                border: "2px solid #FED7AA"
              }}>
                {getInitials(user?.fullName)}
              </div>
            </div>
          </div>
        </header>

        <div style={{ padding: "24px 28px" }} className="page-fade">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
