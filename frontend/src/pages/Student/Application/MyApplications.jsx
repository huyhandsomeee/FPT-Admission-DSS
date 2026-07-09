import { useEffect, useState } from "react";
import api from "../../../config/axiosConfig";
import { FileText, Plus, Award, X, GraduationCap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProgressTracker from "../../../components/common/ProgressTracker";
import DetailModal from "../../../components/common/DetailModal";
import { STATUS_CONFIG } from "../../../utils/statusUtils";

const VISUAL_STEPS = ["SUBMITTED", "APPROVED", "REGISTERED_MOET", "WAITING_MOET", "ACCEPTED_MOET", "ENROLLED"];
const VISUAL_STEP_LABELS = {
  SUBMITTED: "Nộp hồ sơ",
  APPROVED: "Đủ điều kiện",
  REGISTERED_MOET: "Sinh viên đã xác nhận đăng ký NV",
  WAITING_MOET: "Chờ đồng bộ Bộ GDĐT",
  ACCEPTED_MOET: "Trúng tuyển chính thức",
  ENROLLED: "Nhập học",
};

const getVisualStatus = (status) => {
  if (status === "DRAFT" || status === "UNDER_REVIEW") return "SUBMITTED";
  if (status === "REJECTED") return "SUBMITTED";
  return status;
};

export default function MyApplications() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Preference confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeApp, setActiveApp] = useState(null);
  const [confirmDate, setConfirmDate] = useState(new Date().toISOString().split("T")[0]);
  const [preferenceOrder, setPreferenceOrder] = useState("1");
  const [confirmMajorName, setConfirmMajorName] = useState("");
  const [confirmMajorCode, setConfirmMajorCode] = useState("");
  const [evidenceImage, setEvidenceImage] = useState("");
  const [confirmNote, setConfirmNote] = useState("");
  const [commitCheckbox, setCommitCheckbox] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleConfirmModalSubmit = () => {
    if (!activeApp) return;
    if (!commitCheckbox) {
      alert("Vui lòng tích chọn cam kết thông tin là đúng.");
      return;
    }
    setActionLoading(true);
    api.post(`/api/student/applications/${activeApp.id}/confirm-moet`, {
      preferenceOrder: parseInt(preferenceOrder),
      majorCode: confirmMajorCode,
      majorName: confirmMajorName,
      evidenceImage: evidenceImage || null,
      note: confirmNote
    })
      .then(res => {
        alert("Xác nhận đăng ký nguyện vọng Bộ thành công!");
        setShowConfirmModal(false);
        api.get("/api/student/applications").then(r => setApps(r.data));
      })
      .catch(err => {
        console.error(err);
        alert(err.response?.data?.message || "Lỗi khi xác nhận nguyện vọng.");
      })
      .finally(() => setActionLoading(false));
  };

  useEffect(() => {
    api.get("/api/student/applications")
      .then(r => setApps(r.data))
      .catch(() => setApps([]));
  }, []);

  const handleViewDetail = (id) => {
    setLoadingDetail(true);
    setShowDetail(true);
    setSelectedApp(null);
    api.get(`/api/student/applications/${id}`)
      .then(res => setSelectedApp(res.data))
      .catch(err => {
        console.error(err);
        alert("Lỗi tải chi tiết hồ sơ.");
        setShowDetail(false);
      })
      .finally(() => setLoadingDetail(false));
  };

  return (
    <>
      {/* Detail Modal */}
      <DetailModal show={showDetail} onClose={() => setShowDetail(false)} appDetail={selectedApp} loading={loadingDetail} />

      {/* Dialog Xác nhận Đăng ký nguyện vọng */}
      {showConfirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(6px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 24, width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", overflow: "hidden" }}>
            {/* Modal Header */}
            <div style={{ background: "linear-gradient(135deg, #FF6B35, #E85A2A)", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ color: "white", fontWeight: 900, fontSize: 16, letterSpacing: "0.5px" }}>Xác nhận nguyện vọng tuyển sinh</div>
              <button onClick={() => setShowConfirmModal(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", cursor: "pointer", borderRadius: 8, padding: 6, display: "flex" }}>
                <X size={18} />
              </button>
            </div>
            {/* Modal Body */}
            <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>NGÀY ĐĂNG KÝ</label>
                <input
                  type="date"
                  value={confirmDate}
                  onChange={e => setConfirmDate(e.target.value)}
                  style={{ padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, outline: "none", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "#FF6B35"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>THỨ TỰ NGUYỆN VỌNG BỘ GD&ĐT</label>
                <select
                  value={preferenceOrder}
                  onChange={e => setPreferenceOrder(e.target.value)}
                  style={{ padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, outline: "none", background: "#FAFBFC" }}
                >
                  <option value="1">Nguyện vọng 1 (Khuyến nghị)</option>
                  <option value="2">Nguyện vọng 2</option>
                  <option value="3">Nguyện vọng 3</option>
                  <option value="4">Nguyện vọng 4</option>
                  <option value="5">Nguyện vọng 5 hoặc thấp hơn</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>NGÀNH ĐÃ ĐĂNG KÝ BỘ</label>
                <input
                  type="text"
                  value={confirmMajorName}
                  onChange={e => setConfirmMajorName(e.target.value)}
                  style={{ padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>MÃ NGÀNH</label>
                <input
                  type="text"
                  value={confirmMajorCode}
                  onChange={e => setConfirmMajorCode(e.target.value)}
                  style={{ padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, outline: "none" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>UPLOAD ẢNH MINH CHỨNG (KHÔNG BẮT BUỘC)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEvidenceImage(reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  style={{ fontSize: 12 }}
                />
                {evidenceImage && (
                  <div style={{ marginTop: 6, border: "1px solid #E2E8F0", borderRadius: 6, overflow: "hidden", maxWidth: 120 }}>
                    <img src={evidenceImage} alt="Minh chứng" style={{ width: "100%", height: "auto" }} />
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>GHI CHÚ</label>
                <textarea
                  value={confirmNote}
                  onChange={e => setConfirmNote(e.target.value)}
                  rows={2}
                  style={{ padding: "10px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, outline: "none", resize: "vertical" }}
                  placeholder="Ghi chú thêm nếu có..."
                />
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: "#334155", cursor: "pointer", marginTop: 4 }}>
                <input
                  type="checkbox"
                  checked={commitCheckbox}
                  onChange={e => setCommitCheckbox(e.target.checked)}
                  style={{ accentColor: "#FF6B35" }}
                />
                Tôi cam kết các thông tin trên là đúng.
              </label>
            </div>
            {/* Modal Footer */}
            <div style={{ padding: "16px 28px", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowConfirmModal(false)} style={{ padding: "10px 18px", background: "white", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, cursor: "pointer", fontWeight: 600, color: "#64748B" }}>Hủy</button>
              <button
                disabled={!commitCheckbox || actionLoading}
                onClick={handleConfirmModalSubmit}
                style={{
                  padding: "10px 22px",
                  background: commitCheckbox ? "linear-gradient(135deg, #FF6B35, #E85A2A)" : "#CBD5E1",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: commitCheckbox ? "pointer" : "not-allowed",
                  boxShadow: commitCheckbox ? "0 4px 12px rgba(255,107,53,0.3)" : "none"
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 animate-fade-in" style={{ padding: "8px 0" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hồ sơ của tôi</h1>
          <p className="text-gray-500 text-sm mt-1">{apps.length} hồ sơ đã tạo</p>
        </div>
        <Link to="/student/apply" className="student-btn-primary">
          <Plus size={18} /> Nộp hồ sơ mới
        </Link>
      </div>

      {apps.length === 0 ? (
        <div className="student-card p-12 text-center" style={{ padding: "48px 24px" }}>
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ color: "#FF6B35" }}>
            <FileText size={28} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 text-lg">Chưa có hồ sơ nào</h3>
          <p className="text-gray-500 text-sm mb-4">Bắt đầu nộp hồ sơ xét tuyển vào FPT University</p>
          <Link to="/student/apply" className="student-btn-primary">Nộp hồ sơ ngay</Link>
        </div>
      ) : (
        <div className="space-y-4" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {apps.map((app) => {
            const status = STATUS_CONFIG[app.status] || STATUS_CONFIG.DRAFT;
            return (
              <div key={app.id} className="student-card">
                <div className="flex items-start justify-between mb-4" style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: "16px", marginBottom: "16px" }}>
                  <div>
                    <div className="font-bold text-lg text-gray-900">{app.majorName}</div>
                    <div className="text-gray-500 text-sm mt-0.5">{app.campusName}</div>
                    <div className="text-xs text-gray-400 mt-1">Mã HS: {app.applicationCode}</div>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${status.badge}`} style={{ borderRadius: "20px", padding: "6px 12px" }}>{status.label}</span>
                    <div className="text-xs text-gray-400 mt-2">
                      {app.submittedAt ? `Nộp: ${new Date(app.submittedAt).toLocaleDateString("vi-VN")}` : "Chưa nộp"}
                    </div>
                  </div>
                </div>

                <ProgressTracker
                  steps={VISUAL_STEPS}
                  currentStatus={getVisualStatus(app.status)}
                  statusLabels={VISUAL_STEP_LABELS}
                />

                {/* 🎉 ACCEPTED_MOET: Congratulations card */}
                {app.status === "ACCEPTED_MOET" && (
                  <div style={{
                    background: "linear-gradient(135deg,#FFF7ED 0%,#FED7AA 100%)",
                    borderRadius: "14px", padding: "18px 20px",
                    border: "2px solid #FB923C", marginTop: "16px", marginBottom: "8px",
                    boxShadow: "0 4px 16px rgba(255,107,53,0.18)"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <GraduationCap size={22} color="#EA580C" />
                      <h4 style={{ margin: 0, color: "#C2410C", fontWeight: 800, fontSize: 15 }}>🎉 Chúc mừng! Bạn đã trúng tuyển chính thức</h4>
                    </div>
                    <p style={{ margin: "0 0 12px", color: "#7C2D12", fontSize: 13, lineHeight: 1.6 }}>
                      Ngành <strong>{app.majorName}</strong> tại <strong>{app.campusName}</strong>. Vui lòng đọc hướng dẫn nhập học và hoàn thành các thủ tục trước hạn quy định.
                    </p>
                    <button
                      onClick={() => navigate(`/student/enrollment/${app.id}`)}
                      style={{
                        padding: "10px 20px",
                        background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                        color: "white", border: "none", borderRadius: "10px",
                        fontWeight: "800", fontSize: "13px", cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(255,107,53,0.35)",
                        display: "flex", alignItems: "center", gap: 8
                      }}
                    >
                      <GraduationCap size={15} /> Xem hướng dẫn nhập học →
                    </button>
                  </div>
                )}

                {app.status === "APPROVED" && (
                  <div style={{
                    background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
                    borderRadius: "12px", padding: "16px",
                    border: "1px solid #FFEDD5",
                    marginTop: "16px", marginBottom: "8px"
                  }}>
                    <h4 style={{ margin: "0 0 8px", color: "#C2410C", fontWeight: "800", fontSize: "14px" }}>
                      🎉 Đủ điều kiện trúng tuyển sơ bộ
                    </h4>
                    <p style={{ margin: "0 0 12px", color: "#7C2D12", fontSize: "13px", lineHeight: "1.5" }}>
                      Vui lòng đăng ký nguyện vọng Đại học FPT trên cổng tuyển sinh Bộ GD&ĐT (Mã trường: <strong>FPT</strong>, Ngành: <strong>{app.majorName}</strong>, Mã ngành: <strong>{app.majorCode || "7480101"}</strong>). Sau đó xác nhận với trường bằng nút bên dưới:
                    </p>
                    <button
                      onClick={() => {
                        setActiveApp(app);
                        setConfirmMajorName(app.majorName);
                        setConfirmMajorCode(app.majorCode || "7480101");
                        setShowConfirmModal(true);
                      }}
                      style={{
                        padding: "8px 16px",
                        background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "700",
                        fontSize: "12px",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(255,107,53,0.2)"
                      }}
                    >
                      Tôi đã đăng ký nguyện vọng
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm pt-2">
                  <div className="flex gap-4">
                    <span className="text-gray-500">Phương thức: <span className="font-semibold text-gray-700">{app.methodName}</span></span>
                    {app.totalScore && <span className="text-gray-500" style={{ marginLeft: "16px" }}>Điểm: <span className="font-bold text-orange-600">{app.totalScore}</span></span>}
                  </div>
                  <button onClick={() => handleViewDetail(app.id)} className="text-orange-500 font-semibold text-sm hover:underline" style={{ background: "none", border: "none", cursor: "pointer" }}>
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
  </>
);
}
