import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock, User, FileText, ChevronDown } from "lucide-react";
import api from "../../../config/axiosConfig";

const MOCK_APP = {
  id: 1, applicationCode: "FPT2024-001",
  studentName: "Nguyễn Văn A",
  studentEmail: "nva@gmail.com", studentPhone: "0987654321",
  majorName: "Kỹ thuật phần mềm", campusName: "FPT University Hà Nội",
  methodName: "Xét điểm thi THPT Quốc gia", status: "UNDER_REVIEW",
  totalScore: "25.00", submittedAt: "2025-03-15T09:30:00",
  officerNotes: "", rejectionReason: "",
};

const MOCK_DOCS = [
  { name: "Học bạ THPT", desc: "Học bạ lên", status: "uploaded" },
  { name: "CCCD/CMND", desc: "Kỹ thuật phần mềm", status: "uploaded" },
  { name: "Chứng chỉ Tiếng Anh", desc: "Chứng chỉ Tiếng Anh", status: "pending" },
];

const DECISION_OPTIONS = ["Duyệt", "Bổ sung", "Từ chối"];

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app] = useState(MOCK_APP);
  const [notes, setNotes] = useState("");
  const [score, setScore] = useState("");
  const [decision, setDecision] = useState("Duyệt");
  const [showDecisionDropdown, setShowDecisionDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");

  const updateStatus = async (status) => {
    setLoading(true);
    setAction(status);
    try {
      await api.patch(`/api/officer/applications/${id}/status`, { status, notes });
      navigate("/officer/applicants");
    } catch {
      setTimeout(() => navigate("/officer/applicants"), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    const statusMap = { "Duyệt": "APPROVED", "Bổ sung": "UNDER_REVIEW", "Từ chối": "REJECTED" };
    updateStatus(statusMap[decision] || "UNDER_REVIEW");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Back + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "white", border: "1px solid #E2E8F0",
            borderRadius: 10, padding: "8px 14px",
            fontSize: 13, fontWeight: 600, color: "#475569",
            cursor: "pointer"
          }}>
          <ArrowLeft size={16} /> Quay lại
        </button>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: "#0F172A" }}>Chi tiết đánh giá hồ sơ thí sinh</h1>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, alignItems: "flex-start" }}>

        {/* Left: Document Viewer + Student Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* PDF Viewer Mock */}
          <div style={{
            background: "white", borderRadius: 16, border: "1px solid #F1F5F9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden"
          }}>
            {/* PDF toolbar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
              background: "#F8FAFC", borderBottom: "1px solid #F1F5F9"
            }}>
              {["−", "+", "1 / 3", "—", "100%", "+"].map((t, i) => (
                <button key={i} style={{ fontSize: 12, color: "#64748B", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}>{t}</button>
              ))}
              <div style={{ flex: 1 }} />
              {["⊡", "📅", "🖨", "✕"].map((t, i) => (
                <button key={i} style={{ fontSize: 14, color: "#64748B", background: "none", border: "none", cursor: "pointer", padding: "4px 8px" }}>{t}</button>
              ))}
            </div>
            {/* Simulated document */}
            <div style={{ padding: 24, background: "#404040", minHeight: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{
                background: "white", width: "100%", maxWidth: 560, borderRadius: 4,
                padding: "28px 32px", boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
              }}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#374151", lineHeight: 1.8 }}>
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
                    <strong>Độc lập - Tự do - Hạnh phúc</strong>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 15, fontWeight: 800, color: "#111827" }}>HỌC BẠ THPT</div>
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>Mã hồ sơ: {app.applicationCode}</div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
                  <thead>
                    <tr style={{ background: "#F3F4F6" }}>
                      {["STT", "Môn học", "Điểm TB", "Điểm tốt nghiệp"].map(h => (
                        <th key={h} style={{ padding: "5px 8px", textAlign: "left", border: "1px solid #E5E7EB", color: "#374151" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[["1", "Toán", "8.5", "8.2"], ["2", "Vật lý", "7.5", "7.8"], ["3", "Hóa học", "8.0", "7.9"], ["4", "Tiếng Anh", "9.0", "8.5"]].map(([n, m, d1, d2]) => (
                      <tr key={n}>
                        <td style={{ padding: "5px 8px", border: "1px solid #E5E7EB" }}>{n}</td>
                        <td style={{ padding: "5px 8px", border: "1px solid #E5E7EB" }}>{m}</td>
                        <td style={{ padding: "5px 8px", border: "1px solid #E5E7EB" }}>{d1}</td>
                        <td style={{ padding: "5px 8px", border: "1px solid #E5E7EB" }}>{d2}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: 16, textAlign: "right", fontSize: 10, color: "#6B7280" }}>
                  <em>Hà Nội, ngày 12 tháng 11 năm 2022</em>
                  <div style={{ marginTop: 8, fontWeight: 700, color: "#374151" }}>HIỆU TRƯỞNG<br />Nguyễn Văn Xuân</div>
                </div>
              </div>
            </div>
          </div>

          {/* Student profile card */}
          <div style={{
            background: "white", borderRadius: 16, padding: 24,
            border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                background: "linear-gradient(135deg, #64748B, #94A3B8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: 20, flexShrink: 0
              }}>
                {getInitials(app.studentName)}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#0F172A" }}>{app.studentName}</div>
                <div style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>Mã hồ sơ: {app.applicationCode}</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>Ngành: {app.majorName}</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>Email: {app.studentEmail}</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>SĐT: {app.studentPhone}</div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div style={{
            background: "white", borderRadius: 16, padding: 24,
            border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ margin: "0 0 16px", fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Danh sách tài liệu</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {MOCK_DOCS.map((doc, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", background: "#F8FAFC", borderRadius: 12,
                  border: "1px solid #F1F5F9"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <FileText size={18} color="#94A3B8" />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13, color: "#1E293B" }}>{doc.name}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{doc.desc}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
                    background: doc.status === "uploaded" ? "#D1FAE5" : "#FEF3C7",
                    color: doc.status === "uploaded" ? "#065F46" : "#92400E"
                  }}>
                    {doc.status === "uploaded" ? "✓ Đã tải lên" : "Đang chờ"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Evaluation Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            background: "white", borderRadius: 16, padding: 20,
            border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ margin: "0 0 18px", fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Đánh giá của Cán bộ</h3>

            {/* Score */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Điểm xét tuyển
              </label>
              <input
                value={score}
                onChange={(e) => setScore(e.target.value)}
                type="text"
                placeholder={app.totalScore}
                style={{
                  width: "100%", padding: "9px 12px",
                  border: "1px solid #D1D5DB", borderRadius: 10,
                  fontSize: 13, color: "#111827", outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {/* Expert notes */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Nhận xét chuyên môn
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập nhận xét về hồ sơ..."
                rows={4}
                style={{
                  width: "100%", padding: "9px 12px",
                  border: "1px solid #D1D5DB", borderRadius: 10,
                  fontSize: 13, color: "#111827", outline: "none",
                  resize: "none", boxSizing: "border-box"
                }}
              />
            </div>

            {/* Decision Dropdown */}
            <div style={{ marginBottom: 18, position: "relative" }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Quyết định
              </label>
              <button
                onClick={() => setShowDecisionDropdown(!showDecisionDropdown)}
                style={{
                  width: "100%", padding: "9px 12px",
                  border: "1px solid #D1D5DB", borderRadius: 10,
                  fontSize: 13, color: "#111827",
                  background: "white", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  boxSizing: "border-box"
                }}>
                <span style={{ fontWeight: 600, color: decision === "Duyệt" ? "#059669" : decision === "Từ chối" ? "#DC2626" : "#D97706" }}>
                  {decision}
                </span>
                <ChevronDown size={16} color="#94A3B8" />
              </button>
              {showDecisionDropdown && (
                <div style={{
                  position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                  background: "white", border: "1px solid #E2E8F0", borderRadius: 10,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, overflow: "hidden"
                }}>
                  {DECISION_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => { setDecision(opt); setShowDecisionDropdown(false); }}
                      style={{
                        width: "100%", padding: "10px 14px", textAlign: "left",
                        background: opt === decision ? "#F0FDF4" : "white",
                        border: "none", fontSize: 13, cursor: "pointer",
                        color: opt === "Duyệt" ? "#059669" : opt === "Từ chối" ? "#DC2626" : "#D97706",
                        fontWeight: 600, transition: "background 0.15s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                      onMouseLeave={e => e.currentTarget.style.background = opt === decision ? "#F0FDF4" : "white"}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  flex: 1, padding: "11px", borderRadius: 10, border: "none",
                  background: decision === "Duyệt" ? "#059669" : decision === "Từ chối" ? "#DC2626" : "#D97706",
                  color: "white", fontWeight: 700, fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                }}>
                {loading && action ? "Đang xử lý..." : "Lưu đánh giá"}
              </button>
              <button
                onClick={() => navigate(-1)}
                style={{
                  padding: "11px 16px", borderRadius: 10,
                  border: "1px solid #E2E8F0", background: "white",
                  color: "#64748B", fontWeight: 600, fontSize: 14, cursor: "pointer"
                }}>
                Hủy
              </button>
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 700, color: "#1E293B" }}>Hành động nhanh</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => updateStatus("APPROVED")} disabled={loading}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                  background: "#ECFDF5", color: "#059669", fontWeight: 600, fontSize: 13,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8
                }}>
                <CheckCircle size={16} /> Chấp thuận hồ sơ
              </button>
              <button
                onClick={() => updateStatus("UNDER_REVIEW")} disabled={loading}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                  background: "#FFFBEB", color: "#D97706", fontWeight: 600, fontSize: 13,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8
                }}>
                <Clock size={16} /> Yêu cầu bổ sung
              </button>
              <button
                onClick={() => updateStatus("REJECTED")} disabled={loading}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                  background: "#FEF2F2", color: "#DC2626", fontWeight: 600, fontSize: 13,
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 8
                }}>
                <XCircle size={16} /> Từ chối hồ sơ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
