import React from "react";
import {
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, AlertCircle,
  HelpCircle, ArrowRight, RefreshCw, FileText
} from "lucide-react";
import { evaluateEligibility } from "../../services/candidateAdmissionEngine";

export default function StepEligibilityCheck({ application, setApplication, onSaveAndNext, onBack, onJumpToStep, showToast }) {
  const preferences = application.preferences || [];

  // Evaluate all preferences
  const evaluations = preferences.map(pref => {
    return {
      preference: pref,
      result: evaluateEligibility(application, pref)
    };
  });

  const totalEligible = evaluations.filter(e => e.result.isEligible).length;

  const handleProceed = () => {
    if (totalEligible === 0) {
      showToast("Hồ sơ chưa có nguyện vọng nào đủ điều kiện. Vui lòng rà soát lại thông tin hoặc bổ sung giấy tờ.", "error");
      return;
    }
    showToast(`Hồ sơ đã đạt ${totalEligible}/${preferences.length} nguyện vọng đủ điều kiện xét tuyển!`);
    onSaveAndNext();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Top Banner Status */}
      <div style={{
        background: totalEligible > 0 ? "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)" : "linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)",
        borderRadius: 14,
        border: totalEligible > 0 ? "1px solid #A7F3D0" : "1px solid #FECACA",
        padding: "24px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: totalEligible > 0 ? "#10B981" : "#EF4444",
            color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {totalEligible > 0 ? <ShieldCheck size={28} /> : <AlertTriangle size={28} />}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: totalEligible > 0 ? "#065F46" : "#991B1B", margin: 0 }}>
              {totalEligible > 0 ? "Kết Quả Kiểm Tra: Đủ Điều Kiện Xét Tuyển!" : "Cảnh Báo: Chưa Đủ Điều Kiện Xét Tuyển"}
            </h2>
            <p style={{ fontSize: 13, color: totalEligible > 0 ? "#047857" : "#B91C1C", margin: "4px 0 0", fontWeight: 500 }}>
              Hệ thống Eligibility Engine đã đối soát dữ liệu điểm số, phương thức và giấy tờ minh chứng của bạn.
            </p>
          </div>
        </div>

        <div style={{
          padding: "8px 18px", borderRadius: 10,
          background: totalEligible > 0 ? "#059669" : "#DC2626",
          color: "#FFFFFF", fontWeight: 800, fontSize: 14
        }}>
          {totalEligible}/{preferences.length} Nguyện vọng Đạt
        </div>
      </div>

      {/* Detailed Diagnostics per Preference */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            Chi Tiết Đối Soát Điều Kiện Tuyển Sinh Từng Nguyện Vọng
          </h3>
          <p style={{ fontSize: 12.5, color: "#64748B", margin: "2px 0 0" }}>
            Hệ thống đưa ra giải thích lý do cụ thể nếu chưa đạt điều kiện để bạn kịp thời bổ sung.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {evaluations.map(({ preference, result }) => {
            const isEligible = result.isEligible;

            return (
              <div
                key={preference.id}
                style={{
                  background: isEligible ? "#F0FDF4" : "#FFF1F2",
                  borderRadius: 12,
                  border: isEligible ? "1.5px solid #86EFAC" : "1.5px solid #FCA5A5",
                  padding: "18px 22px",
                  display: "flex", flexDirection: "column", gap: 12
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: isEligible ? "#16A34A" : "#DC2626",
                      color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 12
                    }}>
                      NV{preference.priority}
                    </div>

                    <div>
                      <strong style={{ fontSize: 15, color: "#0F172A" }}>{preference.majorName}</strong>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                        📍 {preference.campusName} • 🎓 {preference.admissionMethodName} (Tổ hợp: {preference.combinationCode})
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#64748B" }}>Điểm xét của bạn</div>
                      <strong style={{ fontSize: 16, color: isEligible ? "#16A34A" : "#DC2626" }}>
                        {result.calculatedScore} <span style={{ fontSize: 11.5, color: "#64748B" }}>(Sàn: {result.benchmarkScore})</span>
                      </strong>
                    </div>

                    <span style={{
                      padding: "6px 12px", borderRadius: 8,
                      background: isEligible ? "#DCFCE7" : "#FEE2E2",
                      color: isEligible ? "#15803D" : "#B91C1C",
                      fontWeight: 800, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6
                    }}>
                      {isEligible ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                      {isEligible ? "ĐỦ ĐIỀU KIỆN" : "CHƯA ĐỦ ĐIỀU KIỆN"}
                    </span>
                  </div>
                </div>

                {/* Reasoning Details */}
                <div style={{
                  background: isEligible ? "#DCFCE780" : "#FEE2E280",
                  borderRadius: 8, padding: "10px 14px", fontSize: 12.5,
                  color: isEligible ? "#14532D" : "#7F1D1D", display: "flex", flexDirection: "column", gap: 4
                }}>
                  {result.reasons.map((r, rIdx) => (
                    <div key={rIdx} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <span>{isEligible ? "✓" : "•"}</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>

                {/* Action if Ineligible */}
                {!isEligible && (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => onJumpToStep && onJumpToStep(4)} // Step 5: Documents
                      style={{ padding: "5px 12px", borderRadius: 6, background: "#DC2626", color: "#FFF", border: "none", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                    >
                      Bổ sung giấy tờ ngay →
                    </button>
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
          ← Quay Lại Bước 6 (Nguyện Vọng)
        </button>
        <button
          type="button"
          onClick={handleProceed}
          style={{
            padding: "11px 26px", borderRadius: 8, background: "#EA580C",
            color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 13.5,
            cursor: "pointer", boxShadow: "0 4px 14px rgba(234,88,12,0.3)"
          }}
        >
          Rà Soát & Ký Cam Đoan (Bước 8) →
        </button>
      </div>
    </div>
  );
}
