import React, { useState } from "react";
import {
  FileText, CheckCircle2, ShieldCheck, Download, CreditCard,
  Printer, Sparkles, Clock, Check, AlertTriangle, QrCode, Lock
} from "lucide-react";
import { logAuditEvent } from "../../services/candidateAdmissionEngine";

export default function StepReviewAndSubmit({ application, setApplication, onBack, showToast, onOpenPaymentModal }) {
  const [agreed, setAgreed] = useState(application.confirmation?.agreedTerms || false);
  const [submitting, setSubmitting] = useState(false);

  const isSubmitted = application.status === "SUBMITTED" || application.status === "UNDER_REVIEW" || application.status === "VERIFIED" || application.status === "ADMITTED";

  const p = application.personalInfo || {};
  const academic = application.academicInfo || {};
  const preferences = application.preferences || [];
  const documents = application.documents || [];
  const selectedMethods = application.selectedMethods || [];

  const handleFinalSubmit = () => {
    if (!agreed) {
      showToast("Vui lòng tích chọn cam kết tính chính xác của hồ sơ trước khi nộp.", "error");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      const appCode = application.applicationId || "FPT-2026-" + Math.floor(100000 + Math.random() * 900000);
      const submittedTime = new Date().toLocaleString("vi-VN");

      setApplication(prev => ({
        ...prev,
        applicationId: appCode,
        status: "SUBMITTED",
        submittedAt: submittedTime,
        confirmation: {
          ...prev.confirmation,
          agreedTerms: true,
          confirmedAt: submittedTime
        }
      }));

      logAuditEvent("SUBMIT_APPLICATION", `Thí sinh nộp hồ sơ xét tuyển thành công. Mã hồ sơ: ${appCode}`);
      showToast("🎉 Nộp hồ sơ tuyển sinh thành công! Hội đồng tuyển sinh FPTU đã tiếp nhận hồ sơ của bạn.", "success");
    }, 1200);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Submitted Success Status Banner */}
      {isSubmitted && (
        <div style={{
          background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
          borderRadius: 14, border: "2px solid #10B981", padding: "24px 28px",
          boxShadow: "0 10px 25px rgba(16,185,129,0.15)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#10B981", color: "#FFFFFF", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 800, marginBottom: 8 }}>
                <CheckCircle2 size={15} /> HỒ SƠ ĐÃ ĐƯỢC TIẾP NHẬN CHÍNH THỨC
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#065F46", margin: "0 0 6px" }}>
                Hồ Sơ Xét Tuyển Đang Được Xét Duyệt
              </h2>
              <div style={{ fontSize: 13.5, color: "#047857", fontWeight: 600 }}>
                Mã hồ sơ: <strong style={{ fontFamily: "monospace", fontSize: 16 }}>{application.applicationId}</strong> • Thời gian nộp: {application.submittedAt || "16:25 hôm nay"}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => showToast("Đã tải Phiếu Đăng Ký Xét Tuyển (PDF) có chữ ký điện tử!")}
                style={{ padding: "9px 18px", borderRadius: 8, background: "#059669", color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <Download size={15} /> Tải Phiếu Đăng Ký (PDF)
              </button>
              <button
                type="button"
                onClick={onOpenPaymentModal}
                style={{ padding: "9px 18px", borderRadius: 8, background: "#0F172A", color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <CreditCard size={15} /> Nộp Lệ Phí Tuyển Sinh (200K)
              </button>
            </div>
          </div>

          {/* Timeline of Application */}
          <div style={{ marginTop: 22, paddingTop: 16, borderTop: "1px solid #A7F3D0" }}>
            <strong style={{ fontSize: 13, color: "#065F46", display: "block", marginBottom: 12 }}>
              Tiến Trình Xử Lý Hồ Sơ Tuyển Sinh FPTU:
            </strong>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, textAlign: "center" }}>
              {[
                { step: "Tạo hồ sơ", status: "DONE" },
                { step: "Hoàn thiện thông tin", status: "DONE" },
                { step: "Tải lên giấy tờ", status: "DONE" },
                { step: "Nộp hồ sơ", status: "DONE" },
                { step: "Cán bộ xét duyệt", status: "CURRENT" },
                { step: "Kết quả trúng tuyển", status: "WAITING" },
              ].map((st, sIdx) => {
                const isDone = st.status === "DONE";
                const isCurrent = st.status === "CURRENT";

                return (
                  <div key={sIdx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: isDone ? "#10B981" : isCurrent ? "#EA580C" : "#E2E8F0",
                      color: isDone || isCurrent ? "#FFF" : "#64748B",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: 12
                    }}>
                      {isDone ? "✓" : sIdx + 1}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: isCurrent ? 800 : 600, color: isCurrent ? "#EA580C" : isDone ? "#047857" : "#64748B" }}>
                      {st.step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Summary Review Sections */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: 14, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", margin: 0 }}>
              Tổng Hợp & Rà Soát Toàn Bộ Hồ Sơ Trước Khi Nộp
            </h2>
            <p style={{ fontSize: 12.5, color: "#64748B", margin: "2px 0 0" }}>
              Kiểm tra kỹ lưỡng các thông tin cá nhân, điểm học bạ, chứng chỉ và danh sách nguyện vọng.
            </p>
          </div>
          {isSubmitted && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#F1F5F9", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#475569", fontWeight: 700 }}>
              <Lock size={13} /> Hồ sơ đã khóa chỉnh sửa
            </span>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18, marginBottom: 20 }}>
          {/* Section 1: Thông tin cá nhân */}
          <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "16px", border: "1px solid #E2E8F0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <strong style={{ fontSize: 13.5, color: "#0F172A" }}>1. Thông tin cá nhân</strong>
              <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 800 }}>✓ Đã hoàn thành</span>
            </div>
            <div style={{ fontSize: 12, color: "#475569", display: "flex", flexDirection: "column", gap: 4 }}>
              <div><strong>Họ tên:</strong> {p.fullName} ({p.gender})</div>
              <div><strong>Số CCCD:</strong> {p.citizenId} • Ngày sinh: {p.dob}</div>
              <div><strong>Số điện thoại:</strong> {p.phone} • Email: {p.email}</div>
              <div><strong>Địa chỉ:</strong> {p.permanentAddress}, {p.permanentWard}, {p.permanentProvince}</div>
              <div><strong>Người liên hệ khẩn cấp:</strong> {p.emergencyContactName} ({p.emergencyContactPhone})</div>
            </div>
          </div>

          {/* Section 2: Học tập THPT */}
          <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "16px", border: "1px solid #E2E8F0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <strong style={{ fontSize: 13.5, color: "#0F172A" }}>2. Học tập THPT & Điểm số</strong>
              <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 800 }}>✓ Đã hoàn thành</span>
            </div>
            <div style={{ fontSize: 12, color: "#475569", display: "flex", flexDirection: "column", gap: 4 }}>
              <div><strong>Trường THPT:</strong> {academic.highSchoolName} ({academic.highSchoolProvince})</div>
              <div><strong>Điểm TB các năm:</strong> Lớp 10 ({academic.grade10Gpa}) • Lớp 11 ({academic.grade11Gpa}) • Lớp 12 ({academic.grade12Gpa})</div>
              <div><strong>Điểm môn Lớp 12:</strong> Toán: {academic.subjectScores?.math} | Lý: {academic.subjectScores?.physics} | Anh: {academic.subjectScores?.english}</div>
              <div><strong>Số báo danh THPT:</strong> {academic.thptExam?.sbd || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Section 3: Nguyện vọng đã đăng ký */}
        <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "16px", border: "1px solid #E2E8F0", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <strong style={{ fontSize: 13.5, color: "#0F172A" }}>3. Danh sách {preferences.length} Nguyện Vọng Tuyển Sinh</strong>
            <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 800 }}>✓ Đủ điều kiện</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {preferences.map(pref => (
              <div key={pref.id} style={{ background: "#FFF", borderRadius: 8, padding: "10px 14px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: 13, color: "#0F172A" }}>NV{pref.priority}: {pref.majorName}</strong>
                  <span style={{ fontSize: 11.5, color: "#64748B", marginLeft: 8 }}>({pref.campusName} - {pref.admissionMethodName})</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#16A34A" }}>
                  {pref.myScore}đ (Chuẩn: {pref.benchmarkScore}đ)
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Giấy tờ & Minh chứng */}
        <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "16px", border: "1px solid #E2E8F0", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <strong style={{ fontSize: 13.5, color: "#0F172A" }}>4. Hồ sơ minh chứng đính kèm ({documents.length} tài liệu)</strong>
            <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 800 }}>✓ Đã tải lên</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, fontSize: 12 }}>
            {documents.map(d => (
              <div key={d.id} style={{ background: "#FFF", padding: "8px 10px", borderRadius: 6, border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 6 }}>
                <Check size={14} color="#16A34A" />
                <span style={{ fontWeight: 600, color: "#334155" }}>{d.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cam kết của thí sinh */}
        {!isSubmitted && (
          <div style={{ background: "#FFF7ED", borderRadius: 10, padding: "18px 20px", border: "1.5px solid #FED7AA", marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ width: 18, height: 18, marginTop: 2, accentColor: "#EA580C" }}
              />
              <div style={{ fontSize: 13, color: "#7C2D12", lineHeight: 1.45 }}>
                <strong>LỜI CAM ĐOAN CỦA THÍ SINH:</strong> Tôi xin cam đoan toàn bộ thông tin khai báo trên phiếu đăng ký và các văn bằng, chứng chỉ, giấy tờ minh chứng tải lên là hoàn toàn chính xác, trung thực. Nếu có bất kỳ sự sai lệch nào, tôi xin chịu hoàn toàn trách nhiệm trước Hội đồng Tuyển sinh Đại học FPT và quy định của pháp luật.
              </div>
            </label>
          </div>
        )}

        {/* Submit Actions */}
        {!isSubmitted ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={onBack}
              style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              ← Quay Lại Kiểm Tra
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleFinalSubmit}
              style={{
                padding: "12px 36px", borderRadius: 8, background: "#EA580C",
                color: "#FFFFFF", border: "none", fontWeight: 900, fontSize: 15,
                cursor: submitting ? "not-allowed" : "pointer",
                boxShadow: "0 6px 18px rgba(234,88,12,0.35)",
                display: "flex", alignItems: "center", gap: 8
              }}
            >
              <Sparkles size={18} />
              {submitting ? "Đang gửi hồ sơ..." : "XÁC NHẬN NỘP HỒ SƠ CHÍNH THỨC"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={() => showToast("Hồ sơ đã được gửi đến Hội đồng Tuyển sinh. Kết quả sẽ được thông báo qua SMS & Email.")}
              style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              📄 Xem Chi Tiết Trạng Thái Hồ Sơ
            </button>

            <button
              type="button"
              onClick={onOpenPaymentModal}
              style={{
                padding: "11px 28px", borderRadius: 8, background: "#16A34A",
                color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 13.5,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 8
              }}
            >
              <CreditCard size={16} /> Thanh Toán Lệ Phí Tuyển Sinh (VietQR)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
