import React from "react";
import { FileText, Eye, ExternalLink } from "lucide-react";
import { getFilePreviewUrl } from "../../../../utils/fileUtils";

export default function AttachedDocuments({ docs, selectedDoc, handleSelectDoc }) {
  return (
    <div style={{
      background: "white", borderRadius: 16, padding: 24,
      border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
    }}>
      <h3 style={{ margin: "0 0 16px", fontWeight: 800, fontSize: 15, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
        <FileText size={18} color="#FF6B35" /> Danh sách tài liệu đính kèm
      </h3>
      <p style={{ margin: "-10px 0 16px", fontSize: 12, color: "#64748B" }}>
        Bấm trực tiếp vào tài liệu bên dưới để mở trình xem trước ở khung phía trên
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {docs.map((doc, i) => {
          const isSelected = selectedDoc?.filePath === doc.filePath && doc.filePath;
          return (
            <div key={i} onClick={() => doc.filePath && handleSelectDoc(doc)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", borderRadius: 12,
                background: isSelected ? "#FFF7F4" : "#F8FAFC",
                border: isSelected ? "2px solid #FF6B35" : "1px solid #E2E8F0",
                cursor: doc.filePath ? "pointer" : "default",
                transition: "all 0.2s"
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <FileText size={18} color={isSelected ? "#FF6B35" : "#94A3B8"} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: isSelected ? "#E85A2A" : "#1E293B" }}>{doc.name}</div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Loại: {doc.desc}</div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={e => e.stopPropagation()}>
                {doc.filePath ? (
                  <>
                    <button onClick={() => handleSelectDoc(doc)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4, padding: "5px 10px",
                        border: "1px solid #FFD8C9", background: isSelected ? "#FF6B35" : "white",
                        color: isSelected ? "white" : "#FF6B35", borderRadius: 6, fontSize: 11,
                        fontWeight: 700, cursor: "pointer"
                      }}>
                      <Eye size={12} /> Xem trước
                    </button>
                    <a href={getFilePreviewUrl(doc.filePath)} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: "flex", alignItems: "center", gap: 4, padding: "5px 10px",
                        border: "1px solid #E2E8F0", background: "white",
                        color: "#475569", borderRadius: 6, fontSize: 11,
                        fontWeight: 700, textDecoration: "none", cursor: "pointer"
                      }}>
                      <ExternalLink size={12} /> Tải / Mở mới
                    </a>
                  </>
                ) : (
                  <span style={{ fontSize: 11, color: "#94A3B8", fontStyle: "italic" }}>Chưa tải lên</span>
                )}
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
                  background: doc.status === "uploaded" ? "#D1FAE5" : doc.status === "rejected" ? "#FEE2E2" : "#FEF3C7",
                  color: doc.status === "uploaded" ? "#065F46" : doc.status === "rejected" ? "#991B1B" : "#92400E"
                }}>
                  {doc.status === "uploaded" ? "✓ Đã verify" : doc.status === "rejected" ? "Từ chối" : "Đang chờ"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
