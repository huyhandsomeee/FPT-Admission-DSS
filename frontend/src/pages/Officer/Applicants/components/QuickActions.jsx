import React from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function QuickActions({ onAction }) {
  const actions = [
    { key: "APPROVED", label: "Chấp thuận hồ sơ (Duyệt)", icon: CheckCircle, bg: "#ECFDF5", color: "#059669", hover: "#D1FAE5" },
    { key: "UNDER_REVIEW", label: "Yêu cầu tài liệu bổ sung", icon: Clock, bg: "#FFFBEB", color: "#D97706", hover: "#FEF3C7" },
    { key: "REJECTED", label: "Từ chối hồ sơ (Không đạt)", icon: XCircle, bg: "#FEF2F2", color: "#DC2626", hover: "#FEE2E2" },
  ];

  return (
    <div style={{
      background: "white", borderRadius: 16, padding: 20,
      border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
    }}>
      <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 800, color: "#0F172A" }}>Hành động nhanh</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {actions.map(a => (
          <button key={a.key} onClick={() => onAction(a.key)}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
              background: a.bg, color: a.color, fontWeight: 700, fontSize: 13,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = a.hover}
            onMouseLeave={e => e.currentTarget.style.background = a.bg}>
            <a.icon size={16} /> {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
