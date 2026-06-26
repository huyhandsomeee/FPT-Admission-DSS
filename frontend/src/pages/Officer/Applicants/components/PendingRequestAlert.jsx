import React from "react";

export default function PendingRequestAlert({ requests, onAllowRequest }) {
  if (!requests || requests.length === 0) return null;

  return (
    <div style={{
      background: "#FFFBEB", border: "1px solid #FDE68A",
      borderRadius: 16, padding: "20px", display: "flex", flexDirection: "column", gap: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
    }}>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#92400E", display: "flex", alignItems: "center", gap: 6 }}>
        ⚠️ Có {requests.length} yêu cầu tạo hồ sơ mới chờ xét duyệt
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {requests.map(req => (
          <div key={req.userId} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
            padding: "12px 16px", background: "white", borderRadius: 12, border: "1px solid #FEF3C7"
          }}>
            <div style={{ fontSize: 13, color: "#475569" }}>
              Thí sinh: <strong style={{ color: "#1E293B" }}>{req.fullName}</strong> ({req.email}) — SĐT: <strong>{req.phone || "—"}</strong>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => onAllowRequest(req.userId, true)}
                style={{ padding: "6px 14px", background: "#10B981", border: "none", color: "white", fontWeight: 700, fontSize: 12, borderRadius: 8, cursor: "pointer" }}>
                Cho phép tạo
              </button>
              <button onClick={() => onAllowRequest(req.userId, false)}
                style={{ padding: "6px 14px", background: "#EF4444", border: "none", color: "white", fontWeight: 700, fontSize: 12, borderRadius: 8, cursor: "pointer" }}>
                Từ chối
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
