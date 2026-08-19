import React from "react";
import {
  ShieldAlert, CheckCircle2, AlertTriangle, Sparkles, X,
  UserCheck, RefreshCw, Award, MessageSquare
} from "lucide-react";
import { logAuditEvent } from "../../services/candidateAdmissionEngine";

export default function ReviewerSimulatorModal({ isOpen, onClose, application, setApplication, showToast }) {
  if (!isOpen) return null;

  // 1. Simulate Officer Requesting Doc Update (e.g. Photo blurry)
  const triggerRequestPhotoUpdate = () => {
    setApplication(prev => {
      const updatedDocs = prev.documents.map(d => {
        if (d.type === "PORTRAIT_PHOTO") {
          return {
            ...d,
            status: "NEEDS_UPDATE",
            reviewerNotes: "Ảnh chân dung bị mờ, không rõ khuôn mặt. Vui lòng tải lại ảnh chụp phông nền trắng rõ nét.",
            reviewedAt: new Date().toLocaleString("vi-VN")
          };
        }
        return d;
      });

      return {
        ...prev,
        status: "NEEDS_UPDATE",
        documents: updatedDocs
      };
    });

    logAuditEvent("OFFICER_REVIEW", "Cán bộ tuyển sinh yêu cầu thí sinh cập nhật lại ảnh chân dung 3x4.", "Admission Officer (Trần Hoàng Nam)");
    showToast("⚠️ [Mô phỏng Cán bộ]: Đã gửi yêu cầu thí sinh bổ sung lại ảnh thẻ 3x4!", "warning");
    onClose();
  };

  // 2. Simulate Officer Verifying All Documents
  const triggerVerifyAllDocs = () => {
    setApplication(prev => {
      const updatedDocs = prev.documents.map(d => ({
        ...d,
        status: "VERIFIED",
        reviewerNotes: "Đã đối soát và xác thực hồ sơ hợp lệ.",
        reviewedAt: new Date().toLocaleString("vi-VN")
      }));

      return {
        ...prev,
        status: "VERIFIED",
        documents: updatedDocs
      };
    });

    logAuditEvent("OFFICER_VERIFY_ALL", "Cán bộ tuyển sinh đã duyệt và xác minh toàn bộ giấy tờ hợp lệ.", "Admission Officer (Trần Hoàng Nam)");
    showToast("✅ [Mô phỏng Cán bộ]: Toàn bộ hồ sơ minh chứng đã được xác minh (VERIFIED)!");
    onClose();
  };

  // 3. Simulate Officer Approving Admission & Scholarship
  const triggerApproveAdmission = () => {
    setApplication(prev => ({
      ...prev,
      status: "ADMITTED",
      applicationId: prev.applicationId || "FPT-2026-894120",
      scholarshipAwarded: "Học bổng Tài năng 30% FPT University (Khóa 21)"
    }));

    logAuditEvent("OFFICER_APPROVE_ADMISSION", "Hội đồng Tuyển sinh phê duyệt TRÚNG TUYỂN CHÍNH THỨC + Học bổng Tài năng 30%.", "Board of Admission");
    showToast("🎉 [Mô phỏng Cán bộ]: Đã phê duyệt TRÚNG TUYỂN CHÍNH THỨC vào Đại học FPT!", "success");
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(15,23,42,0.7)", zIndex: 9999, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div style={{ background: "#FFFFFF", borderRadius: 16, maxWidth: 560, width: "100%", padding: "26px 30px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#FEF3C7", color: "#B45309", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Giả Lập Nghiệp Vụ Cán Bộ Tuyển Sinh (Reviewer Simulator)
              </h3>
              <p style={{ fontSize: 12, color: "#64748B", margin: "2px 0 0" }}>
                Thực hiện hành động của Cán bộ Tuyển sinh để kiểm tra luồng phản hồi 2 chiều phía Thí sinh
              </p>
            </div>
          </div>

          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}>
            <X size={20} />
          </button>
        </div>

        {/* 3 Action Triggers */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {/* Action 1: Reject photo */}
          <div style={{ background: "#FFF1F2", borderRadius: 10, padding: "14px 16px", border: "1px solid #FECACA", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ fontSize: 13, color: "#991B1B", display: "block" }}>1. Yêu cầu thí sinh sửa lại ảnh chân dung</strong>
              <span style={{ fontSize: 11.5, color: "#B91C1C" }}>Trạng thái hồ sơ chuyển sang <strong>NEEDS_UPDATE</strong> và tạo task bổ sung.</span>
            </div>
            <button
              onClick={triggerRequestPhotoUpdate}
              style={{ padding: "7px 14px", borderRadius: 6, background: "#DC2626", color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
            >
              Gửi Yêu Cầu Sửa
            </button>
          </div>

          {/* Action 2: Verify all docs */}
          <div style={{ background: "#F0FDF4", borderRadius: 10, padding: "14px 16px", border: "1px solid #BBF7D0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ fontSize: 13, color: "#166534", display: "block" }}>2. Xác thực toàn bộ giấy tờ hợp lệ</strong>
              <span style={{ fontSize: 11.5, color: "#15803D" }}>Chuyển tất cả tài liệu sang <strong>VERIFIED</strong>.</span>
            </div>
            <button
              onClick={triggerVerifyAllDocs}
              style={{ padding: "7px 14px", borderRadius: 6, background: "#16A34A", color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
            >
              Duyệt Giấy Tờ
            </button>
          </div>

          {/* Action 3: Approve Admission */}
          <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "14px 16px", border: "1px solid #BFDBFE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <strong style={{ fontSize: 13, color: "#1E40AF", display: "block" }}>3. Phê duyệt Trúng Tuyển Chính Thức</strong>
              <span style={{ fontSize: 11.5, color: "#1D4ED8" }}>Cấp giấy báo trúng tuyển + Học bổng tài năng 30%.</span>
            </div>
            <button
              onClick={triggerApproveAdmission}
              style={{ padding: "7px 14px", borderRadius: 6, background: "#2563EB", color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
            >
              Duyệt Trúng Tuyển
            </button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{ padding: "8px 18px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
          >
            Đóng Hộp Thoại
          </button>
        </div>
      </div>
    </div>
  );
}
