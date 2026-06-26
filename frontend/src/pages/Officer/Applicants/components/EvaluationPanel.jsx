import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const DECISION_OPTIONS = ["Duyệt", "Bổ sung", "Từ chối"];

export default function EvaluationPanel({
  score, setScore, notes, setNotes,
  rejectionReason, setRejectionReason,
  decision, setDecision, onSave, loading, app
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div id="evaluation-panel" style={{
      background: "white", borderRadius: 16, padding: 24,
      border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
    }}>
      <h3 style={{ margin: "0 0 18px", fontWeight: 800, fontSize: 16, color: "#0F172A" }}>Bảng Đánh Giá</h3>

      {/* Score */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Điểm xét tuyển tổ hợp *</label>
        <input value={score} onChange={e => setScore(e.target.value)} type="text"
          placeholder="Nhập điểm tổ hợp thực tế..."
          style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E1", borderRadius: 10, fontSize: 13, color: "#0F172A", outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = "#FF6B35"}
          onBlur={e => e.target.style.borderColor = "#CBD5E1"} />
        <p style={{ margin: "4px 0 0", fontSize: 11, color: "#64748B" }}>
          Điểm khai báo: <strong>{app.totalScore || "Chưa có"}</strong>
        </p>
      </div>

      {/* Decision Dropdown */}
      <div style={{ marginBottom: 18, position: "relative" }}>
        <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Quyết định đánh giá *</label>
        <button onClick={() => setShowDropdown(!showDropdown)}
          style={{
            width: "100%", padding: "10px 14px", border: "1px solid #CBD5E1", borderRadius: 10,
            fontSize: 13, color: "#0F172A", background: "white", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box"
          }}>
          <span style={{ fontWeight: 700, color: decision === "Duyệt" ? "#059669" : decision === "Từ chối" ? "#DC2626" : "#D97706" }}>
            {decision}
          </span>
          <ChevronDown size={16} color="#64748B" />
        </button>

        {showDropdown && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
            background: "white", border: "1px solid #E2E8F0", borderRadius: 10,
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100, overflow: "hidden"
          }}>
            {DECISION_OPTIONS.map(opt => (
              <button key={opt} onClick={() => { setDecision(opt); setShowDropdown(false); }}
                style={{
                  width: "100%", padding: "10px 14px", textAlign: "left",
                  background: opt === decision ? "#FFF7F4" : "white",
                  border: "none", fontSize: 13, cursor: "pointer",
                  color: opt === "Duyệt" ? "#059669" : opt === "Từ chối" ? "#DC2626" : "#D97706",
                  fontWeight: 700, transition: "background 0.15s"
                }}>
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Conditional Textareas */}
      {decision === "Duyệt" && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Nhận xét (không bắt buộc)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Hồ sơ tốt, điểm số chính xác..." rows={4}
            style={{ width: "100%", padding: "10px 14px", border: "1px solid #CBD5E1", borderRadius: 10, fontSize: 13, color: "#0F172A", outline: "none", resize: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#FF6B35"}
            onBlur={e => e.target.style.borderColor = "#CBD5E1"} />
        </div>
      )}
      {decision === "Bổ sung" && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Yêu cầu bổ sung *</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Thí sinh vui lòng bổ sung ảnh chụp rõ mặt sau của CCCD..." rows={4}
            style={{ width: "100%", padding: "10px 14px", border: "2px solid #D97706", borderRadius: 10, fontSize: 13, color: "#0F172A", outline: "none", resize: "none", boxSizing: "border-box", background: "#FFFDF5" }} />
        </div>
      )}
      {decision === "Từ chối" && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Lý do từ chối *</label>
          <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)}
            placeholder="Điểm tổ hợp xét tốt nghiệp THPT chưa đạt yêu cầu tối thiểu..." rows={4}
            style={{ width: "100%", padding: "10px 14px", border: "2px solid #DC2626", borderRadius: 10, fontSize: 13, color: "#0F172A", outline: "none", resize: "none", boxSizing: "border-box", background: "#FEF2F2" }} />
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={onSave} disabled={loading}
          style={{
            flex: 1, padding: "12px", borderRadius: 10, border: "none",
            background: decision === "Duyệt" ? "#059669" : decision === "Từ chối" ? "#DC2626" : "#D97706",
            color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
          {loading ? "Đang xử lý..." : "Lưu đánh giá"}
        </button>
      </div>
    </div>
  );
}
