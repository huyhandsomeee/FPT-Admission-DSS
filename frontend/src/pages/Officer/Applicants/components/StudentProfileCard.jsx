import React from "react";
import { getInitials } from "../../../../utils/fileUtils";

export default function StudentProfileCard({ app }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: 24,
      border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: 800, fontSize: 22, flexShrink: 0,
          boxShadow: "0 4px 12px rgba(255,107,53,0.3)"
        }}>
          {getInitials(app.studentName)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 800, fontSize: 18, color: "#0F172A" }}>{app.studentName}</span>
            <span style={{
              padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
              background: "#FFF7F4", color: "#FF6B35", border: "1px solid #FFD8C9"
            }}>Thí sinh</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "8px 24px", marginTop: 8 }}>
            <div style={{ fontSize: 13, color: "#475569" }}>Mã hồ sơ: <strong style={{ color: "#0F172A" }}>{app.applicationCode}</strong></div>
            <div style={{ fontSize: 13, color: "#475569" }}>Cơ sở: <strong style={{ color: "#0F172A" }}>{app.campusName}</strong></div>
            <div style={{ fontSize: 13, color: "#475569" }}>Chuyên ngành: <strong style={{ color: "#0F172A" }}>{app.majorName}</strong></div>
            <div style={{ fontSize: 13, color: "#475569" }}>Phương thức: <strong style={{ color: "#0F172A" }}>{app.methodName}</strong></div>
            <div style={{ fontSize: 13, color: "#475569" }}>SĐT liên hệ: <strong style={{ color: "#0F172A" }}>{app.studentPhone || "Chưa cung cấp"}</strong></div>
            <div style={{ fontSize: 13, color: "#475569" }}>Email: <strong style={{ color: "#0F172A" }}>{app.studentEmail}</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
}
