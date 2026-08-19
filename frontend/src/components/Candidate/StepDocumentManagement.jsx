import React, { useState } from "react";
import {
  FileText, Upload, CheckCircle2, Clock, AlertCircle, AlertTriangle,
  Eye, RefreshCw, Trash2, Check, X, ShieldCheck, HelpCircle
} from "lucide-react";
import { ADMISSION_METHODS } from "../../data/admissionRulesData";

export default function StepDocumentManagement({ application, setApplication, onSaveAndNext, onBack, showToast }) {
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploadingDocId, setUploadingDocId] = useState(null);

  const documents = application.documents || [];
  const selectedMethods = application.selectedMethods || [];

  // Generate dynamic required documents based on selected admission methods
  const requiredDocTypes = [
    { type: "CITIZEN_ID", title: "Căn cước công dân (CCCD 2 mặt / CMND)", required: true },
    { type: "PORTRAIT_PHOTO", title: "Ảnh thẻ chân dung 3x4 (Phông nền trắng)", required: true },
    { type: "GRADUATION_CERT", title: "Giấy chứng nhận tốt nghiệp THPT (Tạm thời hoặc Bằng chính thức)", required: true }
  ];

  selectedMethods.forEach(mId => {
    const methodObj = ADMISSION_METHODS.find(m => m.id === mId);
    if (methodObj?.requiredDocuments) {
      methodObj.requiredDocuments.forEach(rd => {
        if (!requiredDocTypes.some(r => r.type === rd.type)) {
          requiredDocTypes.push({ type: rd.type, title: rd.label, required: rd.required });
        }
      });
    }
  });

  const verifiedCount = documents.filter(d => d.status === "VERIFIED").length;

  const handleSimulateUpload = (docType, title) => {
    setUploadingDocId(docType);
    setTimeout(() => {
      setUploadingDocId(null);
      const newDoc = {
        id: "doc-" + Date.now(),
        type: docType,
        title: title,
        fileName: `${docType}_NguyenVanAn_${Date.now().toString().slice(-4)}.pdf`,
        fileSize: "2.8 MB",
        mimeType: "application/pdf",
        uploadedAt: new Date().toLocaleString("vi-VN"),
        status: "UNDER_REVIEW",
        reviewerNotes: "Tài liệu mới tải lên đang chờ cán bộ tuyển sinh đối soát.",
        reviewedAt: null
      };

      setApplication(prev => {
        const existingDocs = prev.documents.filter(d => d.type !== docType);
        return {
          ...prev,
          documents: [...existingDocs, newDoc]
        };
      });

      showToast(`Đã tải lên tài liệu [${title}] thành công!`);
    }, 1000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "VERIFIED":
        return { label: "Đã xác minh (Verified)", color: "#16A34A", bg: "#DCFCE7", icon: CheckCircle2 };
      case "UNDER_REVIEW":
        return { label: "Đang xét duyệt (Under Review)", color: "#D97706", bg: "#FEF3C7", icon: Clock };
      case "NEEDS_UPDATE":
        return { label: "Yêu cầu bổ sung (Needs Update)", color: "#DC2626", bg: "#FEE2E2", icon: AlertTriangle };
      case "REJECTED":
        return { label: "Bị từ chối (Rejected)", color: "#DC2626", bg: "#FEE2E2", icon: AlertCircle };
      default:
        return { label: "Chưa tải lên (Required)", color: "#64748B", bg: "#F1F5F9", icon: Clock };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top Banner: Verification Status & Guidelines */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 16 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Tiến Độ Xác Minh Giấy Tờ</span>
            <ShieldCheck size={18} color="#16A34A" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>
            {verifiedCount}/{requiredDocTypes.length} <span style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>Tài liệu hợp lệ</span>
          </div>
          <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#EFF6FF", overflow: "hidden", marginTop: 10 }}>
            <div style={{ width: `${(verifiedCount / Math.max(1, requiredDocTypes.length)) * 100}%`, height: "100%", background: "#EA580C" }} />
          </div>
        </div>

        <div style={{ background: "#EFF6FF", borderRadius: 12, border: "1px solid #DBEAFE", padding: "18px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, color: "#1D4ED8", fontSize: 13.5, marginBottom: 6 }}>
            <AlertCircle size={17} /> Quy Định Về Hồ Sơ & Giấy Tờ Minh Chứng
          </div>
          <div style={{ fontSize: 12, color: "#1E40AF", display: "flex", flexDirection: "column", gap: 3.5, lineHeight: 1.4 }}>
            <div>✓ Định dạng file hợp lệ: <strong>PDF, JPG, JPEG, PNG</strong> (Dung lượng tối đa 5MB/file).</div>
            <div>✓ Bản chụp / scan phải rõ nét, đủ 4 góc, không bị lóa sáng hay mất thông tin.</div>
            <div>✓ Đối với ảnh thẻ 3x4: Chụp chính diện phông nền trắng, thời hạn không quá 6 tháng.</div>
          </div>
        </div>
      </div>

      {/* Dynamic Documents List */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: "0 0 2px" }}>
            Danh Mục Hồ Sơ Tuyển Sinh Cần Nộp (Cấu hình tự động theo Phương thức)
          </h2>
          <p style={{ fontSize: 12.5, color: "#64748B", margin: 0 }}>
            Vui lòng tải lên đầy đủ các tài liệu dưới đây để hoàn tất hồ sơ xét tuyển.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {requiredDocTypes.map((req, idx) => {
            const uploadedDoc = documents.find(d => d.type === req.type);
            const status = uploadedDoc ? uploadedDoc.status : "REQUIRED";
            const badge = getStatusBadge(status);
            const isNeedsUpdate = status === "NEEDS_UPDATE" || status === "REJECTED";
            const isUploading = uploadingDocId === req.type;

            return (
              <div
                key={req.type}
                style={{
                  background: isNeedsUpdate ? "#FFF1F2" : "#FFFFFF",
                  borderRadius: 10,
                  border: isNeedsUpdate ? "1.5px solid #FCA5A5" : "1px solid #E2E8F0",
                  padding: "16px 20px",
                  display: "flex", flexDirection: "column", gap: 10,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: badge.bg, color: badge.color,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                    }}>
                      <FileText size={20} />
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <strong style={{ fontSize: 14, color: "#0F172A" }}>
                          {idx + 1}. {req.title}
                        </strong>
                        {req.required && <span style={{ fontSize: 11, color: "#DC2626", fontWeight: 700 }}>*Bắt buộc</span>}
                      </div>

                      {uploadedDoc ? (
                        <div style={{ fontSize: 11.5, color: isNeedsUpdate ? "#DC2626" : "#64748B", marginTop: 2 }}>
                          📄 {uploadedDoc.fileName} • {uploadedDoc.fileSize} • Đã tải lên: {uploadedDoc.uploadedAt}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 2 }}>
                          Chưa có file nào được tải lên
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status Badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: badge.color, background: badge.bg, padding: "4px 10px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <badge.icon size={13} /> {badge.label}
                    </span>

                    {uploadedDoc && (
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(uploadedDoc)}
                        style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Eye size={13} /> Xem trước
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => handleSimulateUpload(req.type, req.title)}
                      style={{
                        padding: "6px 14px", borderRadius: 6,
                        background: isNeedsUpdate ? "#DC2626" : "#EA580C",
                        color: "#FFFFFF", border: "none", fontSize: 12, fontWeight: 800,
                        cursor: isUploading ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", gap: 6
                      }}
                    >
                      <Upload size={13} className={isUploading ? "animate-spin" : ""} />
                      {isUploading ? "Đang tải..." : isNeedsUpdate ? "Tải Lại File Mới" : uploadedDoc ? "Cập Nhật File" : "Tải Lên File"}
                    </button>
                  </div>
                </div>

                {/* Reviewer Note / Rejection Reason Box */}
                {uploadedDoc?.reviewerNotes && (
                  <div style={{
                    background: isNeedsUpdate ? "#FEE2E2" : "#F8FAFC",
                    borderRadius: 6, padding: "8px 12px", fontSize: 12,
                    color: isNeedsUpdate ? "#991B1B" : "#475569",
                    borderLeft: `3px solid ${isNeedsUpdate ? "#DC2626" : "#CBD5E1"}`
                  }}>
                    <strong>💬 Nhận xét của Cán bộ Tuyển sinh:</strong> {uploadedDoc.reviewerNotes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          onClick={onBack}
          style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          ← Quay Lại Bước 4
        </button>
        <button
          type="button"
          onClick={onSaveAndNext}
          style={{
            padding: "11px 26px", borderRadius: 8, background: "#EA580C",
            color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 13.5,
            cursor: "pointer", boxShadow: "0 4px 14px rgba(234,88,12,0.3)"
          }}
        >
          Lưu Giấy Tờ & Sang Bước 6 (Nguyện Vọng) →
        </button>
      </div>

      {/* Preview Document Modal */}
      {previewDoc && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.7)", zIndex: 9999, display: "flex",
          alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{ background: "#FFFFFF", borderRadius: 14, maxWidth: 640, width: "100%", padding: "24px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                  Xem Trước Tài Liệu: {previewDoc.title}
                </h3>
                <span style={{ fontSize: 11.5, color: "#64748B" }}>Tên file: {previewDoc.fileName}</span>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Document Preview Placeholder */}
            <div style={{
              height: 280, borderRadius: 10, background: "#F1F5F9", border: "1px solid #CBD5E1",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#475569", gap: 10
            }}>
              <FileText size={48} color="#94A3B8" />
              <div style={{ textAlign: "center" }}>
                <strong style={{ fontSize: 14, color: "#0F172A" }}>{previewDoc.fileName}</strong>
                <p style={{ fontSize: 12, color: "#64748B", margin: "4px 0 0" }}>Dung lượng: {previewDoc.fileSize} • MIME: {previewDoc.mimeType}</p>
              </div>
              <div style={{ fontSize: 11.5, color: "#16A34A", fontWeight: 700, background: "#DCFCE7", padding: "3px 10px", borderRadius: 100 }}>
                ✓ Bản quét công chứng hợp lệ
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                style={{ padding: "8px 20px", borderRadius: 6, background: "#0F172A", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Đóng Xem Trước
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
