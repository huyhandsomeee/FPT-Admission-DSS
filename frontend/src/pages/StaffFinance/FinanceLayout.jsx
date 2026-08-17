import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Landmark, CreditCard, Wallet, Award, FileText,
  LogOut, Bell, HelpCircle, User, Plus, Search, Mail
} from "lucide-react";

export default function FinanceLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: "/staff/finance/overview", icon: Landmark, label: "Overview" },
    { to: "/staff/finance/tuition", icon: CreditCard, label: "Tuition Management" },
    { to: "/staff/finance/transactions", icon: Wallet, label: "Transactions" },
    { to: "/staff/finance/scholarships", icon: Award, label: "Scholarships" },
    { to: "/staff/finance/reports", icon: FileText, label: "Reports" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F8FAFC", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* ── Finance Dedicated Sidebar (Matching User Reference Exactly) ── */}
      <aside style={{ width: 260, background: "#FFFFFF", borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", justifyContent: "space-between", flexShrink: 0, zIndex: 30 }}>
        <div>
          {/* Brand Header */}
          <div style={{ padding: "24px 20px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #EA580C)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16, boxShadow: "0 4px 12px rgba(234,88,12,0.25)" }}>
              FPT
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.3px", lineHeight: 1.1 }}>FPT Finance</div>
              <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600, marginTop: 2 }}>Staff Portal</div>
            </div>
          </div>

          {/* New Entry Action Button */}
          <div style={{ padding: "0 16px 18px" }}>
            <button
              onClick={() => navigate("/staff/finance/transactions")}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12, background: "#C2410C",
                color: "#fff", border: "none", fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                cursor: "pointer", boxShadow: "0 4px 14px rgba(194,65,12,0.28)", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#9A3412"}
              onMouseLeave={e => e.currentTarget.style.background = "#C2410C"}
            >
              <Plus size={18} strokeWidth={2.5} /> New Entry
            </button>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 16px",
                  borderRadius: 10,
                  fontSize: 13.5,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#FFFFFF" : "#475569",
                  background: isActive ? "#60A5FA" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease"
                })}
              >
                <item.icon size={18} strokeWidth={2} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer: User Profile & Switch / Logout */}
        <div style={{ padding: "16px 18px", borderTop: "1px solid #F1F5F9", background: "#FAFBFD" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, border: "2px solid #DBEAFE" }}>
                NV
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Admin User</div>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>Finance Dept</div>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              title="Đăng xuất / Về trang chọn vai trò"
              style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #E2E8F0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Outlet Area ── */}
      <main style={{ flex: 1, height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        {/* Top Navbar */}
        <header style={{ height: 64, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#9A3412" }}>
            Financial Management
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Quick search input */}
            <div style={{ position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                type="text"
                placeholder="Tìm kiếm sinh viên..."
                style={{ width: 220, padding: "8px 12px 8px 36px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12.5, outline: "none", background: "#F8FAFC" }}
              />
            </div>

            <button style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #E2E8F0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B", position: "relative" }}>
              <Bell size={16} />
              <span style={{ position: "absolute", top: 8, right: 8, width: 7, height: 7, borderRadius: "50%", background: "#DC2626" }} />
            </button>

            <button style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #E2E8F0", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748B" }}>
              <HelpCircle size={16} />
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{ padding: "6px 12px", borderRadius: 8, background: "#F1F5F9", border: "1px solid #CBD5E1", fontSize: 12, fontWeight: 700, color: "#475569", cursor: "pointer" }}
            >
              🔄 Đổi vai trò
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div style={{ flex: 1, padding: "28px 32px", maxWidth: 1400, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
