import React from "react";
import { Upload, FolderUp } from "lucide-react";

const DOCUMENTS = [
  { name: "Căn cước công dân (CCCD) *", key: "cccdFile", desc: "Bản chụp rõ 2 mặt của CCCD" },
  { name: "Học bạ THPT *", key: "hocBaFile", desc: "Bản sao học bạ 3 năm cấp 3" },
  { name: "Bằng/Giấy chứng nhận tốt nghiệp *", key: "bangTNFile", desc: "Bản sao bằng tốt nghiệp hoặc giấy CNTN tạm thời" },
  { name: "Ảnh thẻ 3x4 *", key: "anhTheFile", desc: "Ảnh chân dung nền trắng (định dạng JPG/PNG)" },
  { name: "Chứng chỉ ngoại ngữ (Tùy chọn)", key: "chungChiFile", desc: "Chứng chỉ IELTS, SAT, TOEFL,... nếu có" },
];

export default function SectionDocuments({ files, setFiles }) {
  const handleFileChange = (key) => (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files[0] }));
    }
  };

  return (
    <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#FF6B35", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px", marginBottom: "20px" }}>
        <FolderUp size={18} /> 4. Tài liệu đính kèm minh chứng
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "14px", padding: "16px", fontSize: "13px", color: "#1E40AF" }}>
          💡 <strong>Yêu cầu tải tài liệu:</strong> Vui lòng đính kèm các tài liệu liên quan để cán bộ kiểm tra và đối chiếu. Tài liệu bắt buộc có dấu sao (*).
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {DOCUMENTS.map((doc) => (
            <div key={doc.key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px", borderRadius: "14px", border: "1px solid #E2E8F0",
              background: files[doc.key] ? "#F0FDF4" : "white",
              transition: "all 0.2s"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontWeight: "600", fontSize: "14px", color: "#1E293B" }}>{doc.name}</span>
                <span style={{ fontSize: "12px", color: "#64748B" }}>{doc.desc}</span>
                {files[doc.key] && (
                  <span style={{ fontSize: "12px", color: "#16A34A", fontWeight: "600", marginTop: "4px" }}>
                    ✓ Đã chọn: {files[doc.key].name} ({(files[doc.key].size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
              </div>
              <label style={{
                padding: "8px 16px", background: files[doc.key] ? "#DCFCE7" : "#F1F5F9",
                color: files[doc.key] ? "#15803D" : "#475569",
                borderRadius: "10px", fontSize: "13px", fontWeight: "600",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0
              }}>
                <Upload size={16} /> Chọn tệp
                <input type="file" onChange={handleFileChange(doc.key)} style={{ display: "none" }} />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
