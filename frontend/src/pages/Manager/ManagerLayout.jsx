import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard, TrendingUp, BarChart2, Map, LineChart, Lightbulb,
  Settings, HelpCircle, Bell, FileText, Search, LogOut
} from "lucide-react";

const navItems = [
  { to: "/manager/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/manager/analytics/overview", icon: TrendingUp, label: "Xu hướng tuyển sinh" },
  { to: "/manager/analytics/majors", icon: BarChart2, label: "Phân tích theo ngành" },
  { to: "/manager/analytics/regional", icon: Map, label: "Phân tích theo vùng" },
  { to: "/manager/forecast", icon: LineChart, label: "Dự báo" },
  { to: "/manager/recommendations", icon: Lightbulb, label: "Đề xuất" },
];

function getInitials(name) {
  if (!name) return "AM";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ManagerLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const NAVY = "#1a2e6e";
  const NAVY_DARK = "#152459";
  const NAVY_HOVER = "rgba(255,255,255,0.08)";
  const NAVY_ACTIVE = "rgba(255,255,255,0.15)";
  const TEXT_MUTED = "rgba(180,195,230,0.9)";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F0F4FA" }}>
      {/* ── Sidebar ── */}
      <aside style={{
        width: 210,
        background: NAVY,
        height: "100vh",
        position: "fixed", left: 0, top: 0,
        display: "flex", flexDirection: "column",
        zIndex: 50,
        borderRight: "1px solid rgba(255,255,255,0.06)"
      }}>
        {/* Logo */}
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: "white", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <span style={{ color: NAVY, fontWeight: 900, fontSize: 16 }}>AF</span>
            </div>
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Academic Fidelity</div>
              <div style={{ color: TEXT_MUTED, fontSize: 10, marginTop: 2 }}>Admissions Admin</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto" }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 8,
                textDecoration: "none", fontWeight: isActive ? 600 : 400,
                fontSize: 13,
                background: isActive ? NAVY_ACTIVE : "transparent",
                color: isActive ? "white" : TEXT_MUTED,
                transition: "all 0.15s",
                borderLeft: isActive ? "3px solid #4A9FE6" : "3px solid transparent",
              })}>
              <item.icon size={17} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Generate Report button */}
        <div style={{ padding: "0 10px 14px" }}>
          <button style={{
            width: "100%", padding: "10px 12px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10, color: "white",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            <FileText size={15} />
            Generate Report
          </button>
        </div>

        {/* Settings / Support / Logout */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "10px 10px 8px" }}>
          {[
            { icon: Settings, label: "Settings" },
            { icon: HelpCircle, label: "Support" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} style={{
              width: "100%", padding: "8px 12px", background: "none",
              border: "none", color: TEXT_MUTED, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              fontSize: 13, borderRadius: 8, transition: "all 0.15s"
            }}
              onMouseEnter={e => { e.currentTarget.style.background = NAVY_HOVER; e.currentTarget.style.color = "white"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = TEXT_MUTED; }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* User profile */}
        <div style={{ padding: "10px 10px 16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: 12, flexShrink: 0
            }}>
              {getInitials(user?.fullName)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "white", fontWeight: 600, fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 120 }}>
                {user?.fullName || "Manager"}
              </div>
              <div style={{ color: TEXT_MUTED, fontSize: 10 }}>Head of Admissions</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ marginLeft: 210, flex: 1, minHeight: "100vh", background: "#F0F4FA" }}>
        {/* Header */}
        <header style={{
          height: 60, background: "white",
          borderBottom: "1px solid #E2E8F0",
          display: "flex", alignItems: "center",
          padding: "0 28px", gap: 16,
          position: "sticky", top: 0, zIndex: 40,
          justifyContent: "space-between"
        }}>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#F1F5F9", borderRadius: 8, padding: "7px 14px", width: 240,
            border: "1px solid #E2E8F0"
          }}>
            <Search size={14} color="#94A3B8" />
            <input type="text" placeholder="Search data points, trends..."
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%" }} />
          </div>

          {/* Center: Portal title */}
          <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <span style={{ fontWeight: 700, fontSize: 17, color: "#1E293B", letterSpacing: "-0.3px" }}>Admissions Portal</span>
          </div>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Bell size={16} color="#475569" />
            </button>
            <button style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <FileText size={15} color="#475569" />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{user?.fullName || "Alex Thompson"}</div>
                <div style={{ fontSize: 11, color: "#94A3B8" }}>PRINCIPAL ADMIN</div>
              </div>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: 12,
                border: "2px solid #DBEAFE"
              }}>
                {getInitials(user?.fullName)}
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
