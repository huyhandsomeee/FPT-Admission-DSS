import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import { getFilePreviewUrl, isPdfFile, isImgFile } from "../../utils/fileUtils";

export default function FilePreview({ selectedDoc }) {
  if (!selectedDoc) {
    return (
      <div style={{ color: "#E2E8F0", textAlign: "center", padding: 24 }}>
        <FileText size={40} style={{ margin: "0 auto 12px", color: "#94A3B8" }} />
        <div style={{ fontSize: 14, fontWeight: 600 }}>Chưa chọn tài liệu minh chứng nào</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Vui lòng bấm chọn một tài liệu trong danh sách đính kèm.</div>
      </div>
    );
  }

  if (!selectedDoc.filePath) {
    return (
      <div style={{ color: "#E2E8F0", textAlign: "center", padding: 24 }}>
        <FileText size={40} style={{ margin: "0 auto 12px", color: "#94A3B8" }} />
        <div style={{ fontSize: 14, fontWeight: 600 }}>Tài liệu chưa được tải lên</div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Tài liệu "{selectedDoc.name}" chưa có tệp đính kèm.</div>
      </div>
    );
  }

  const previewUrl = getFilePreviewUrl(selectedDoc.filePath);

  if (isPdfFile(selectedDoc.filePath)) {
    return <iframe src={previewUrl} title="File preview" style={{ width: "100%", height: "100%", border: "none" }} />;
  }

  if (isImgFile(selectedDoc.filePath)) {
    return (
      <div style={{ width: "100%", height: "100%", overflow: "auto", display: "flex", alignItems: "center", justifyContent: "center", background: "#262626", padding: 12, boxSizing: "border-box" }}>
        <img src={previewUrl} alt={selectedDoc.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 4, boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }} />
      </div>
    );
  }

  return (
    <div style={{ color: "#E2E8F0", textAlign: "center", padding: 24, maxWidth: "400px" }}>
      <FileText size={48} style={{ margin: "0 auto 16px", color: "#FF6B35" }} />
      <div style={{ fontSize: 14, fontWeight: 700 }}>Định dạng tệp không được hỗ trợ preview</div>
      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 6, lineHeight: 1.6 }}>
        Hệ thống chỉ xem trước trực tiếp các tệp PDF hoặc ảnh (PNG, JPG, JPEG, WebP).
      </div>
      <a href={previewUrl} target="_blank" rel="noopener noreferrer"
        style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px",
          borderRadius: 8, background: "#FF6B35", color: "white", fontSize: 13,
          fontWeight: 700, textDecoration: "none", marginTop: 16, border: "none",
          boxShadow: "0 4px 12px rgba(255,107,53,0.3)" }}>
        <ExternalLink size={14} /> Tải tài liệu về máy
      </a>
    </div>
  );
}
