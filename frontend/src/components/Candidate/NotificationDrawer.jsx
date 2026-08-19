import React from "react";
import {
  Bell, CheckCircle2, AlertTriangle, AlertCircle, Info,
  X, Check, ExternalLink
} from "lucide-react";

export default function NotificationDrawer({ isOpen, onClose, notifications, onMarkAllRead, onSelectNotification }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 380,
      background: "#FFFFFF", zIndex: 9999, boxShadow: "-10px 0 30px rgba(0,0,0,0.15)",
      display: "flex", flexDirection: "column", borderLeft: "1px solid #E2E8F0"
    }}>
      {/* Header */}
      <div style={{ padding: "18px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Bell size={18} color="#EA580C" />
          <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: 0 }}>
            Thông Báo Tuyển Sinh
          </h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={onMarkAllRead}
            style={{ border: "none", background: "transparent", fontSize: 11.5, color: "#2563EB", fontWeight: 700, cursor: "pointer" }}
          >
            Đã đọc tất cả
          </button>
          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* List of Notifications */}
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#94A3B8", fontSize: 13 }}>
            Không có thông báo mới nào
          </div>
        ) : (
          notifications.map(notif => {
            const isWarning = notif.type === "WARNING";
            const isSuccess = notif.type === "SUCCESS";

            return (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                style={{
                  background: notif.read ? "#F8FAFC" : "#FFF7ED",
                  borderRadius: 10,
                  border: notif.read ? "1px solid #E2E8F0" : "1px solid #FED7AA",
                  padding: "14px",
                  cursor: "pointer",
                  display: "flex", flexDirection: "column", gap: 6,
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {isWarning ? <AlertTriangle size={15} color="#DC2626" /> : isSuccess ? <CheckCircle2 size={15} color="#16A34A" /> : <Info size={15} color="#2563EB" />}
                    <strong style={{ fontSize: 13, color: notif.read ? "#334155" : "#0F172A" }}>
                      {notif.title}
                    </strong>
                  </div>
                  {!notif.read && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#EA580C" }} />}
                </div>

                <p style={{ fontSize: 12, color: "#64748B", margin: 0, lineHeight: 1.4 }}>
                  {notif.content}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, fontSize: 11, color: "#94A3B8" }}>
                  <span>{notif.createdAt}</span>
                  <span style={{ color: "#EA580C", fontWeight: 700, display: "flex", alignItems: "center", gap: 3 }}>
                    Xem chi tiết <ExternalLink size={11} />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
