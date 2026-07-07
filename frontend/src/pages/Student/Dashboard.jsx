import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/axiosConfig";
import {
  FileText, CheckCircle, Clock, Bell, ArrowRight,
  Calendar, GraduationCap, X, Info, Trophy, MessageSquare
} from "lucide-react";
import { STATUS_CONFIG, STEPS } from "../../utils/statusUtils";

const NOTIF_TYPE_CONFIG = {
  ADMISSION_UPDATE: { icon: Clock, color: "#2563EB", bg: "#DBEAFE" },
  SYSTEM:           { icon: Info, color: "#64748B", bg: "#F1F5F9" },
  RESULT:           { icon: Trophy, color: "#059669", bg: "#D1FAE5" },
  REMINDER:         { icon: Bell, color: "#D97706", bg: "#FEF3C7" },
  MESSAGE:          { icon: MessageSquare, color: "#7C3AED", bg: "#EDE9FE" },
};

const deadlines = [
  { label: "Nộp hồ sơ đợt 1", date: "30/03/2026", urgent: false },
  { label: "Nộp hồ sơ đợt 2", date: "30/04/2026", urgent: false },
  { label: "Công bố kết quả", date: "15/07/2026", urgent: false },
  { label: "Xác nhận nhập học", date: "30/08/2026", urgent: false },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [latestNotif, setLatestNotif] = useState(null);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const [moetChecked, setMoetChecked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Preference confirmation modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmDate, setConfirmDate] = useState(new Date().toISOString().split("T")[0]);
  const [preferenceOrder, setPreferenceOrder] = useState("1");
  const [confirmMajorName, setConfirmMajorName] = useState("");
  const [confirmMajorCode, setConfirmMajorCode] = useState("");
  const [evidenceImage, setEvidenceImage] = useState("");
  const [confirmNote, setConfirmNote] = useState("");
  const [commitCheckbox, setCommitCheckbox] = useState(false);
  const [checklistState, setChecklistState] = useState({
    chkConfirmEnrollment: false,
    chkPayFee: false,
    chkDeclareInfo: false,
    chkUploadCccd: false,
    chkUploadPhoto: false,
    chkRegisterDorm: false,
    chkPrintLetter: false,
  });
  const [checklistProgress, setChecklistProgress] = useState(0);

  const VISUAL_STEPS = ["SUBMITTED", "APPROVED", "REGISTERED_MOET", "WAITING_MOET", "ACCEPTED_MOET", "ENROLLED"];
  const VISUAL_STEP_LABELS = {
    SUBMITTED: "Nộp hồ sơ",
    APPROVED: "Đủ điều kiện",
    REGISTERED_MOET: "Sinh viên đã xác nhận đăng ký NV",
    WAITING_MOET: "Chờ đồng bộ Bộ GDĐT",
    ACCEPTED_MOET: "Trúng tuyển chính thức",
    ENROLLED: "Nhập học",
  };

  const getVisualStepIdx = (status) => {
    const mapping = {
      DRAFT: -1,
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      APPROVED: 1,
      REGISTERED_MOET: 2,
      WAITING_MOET: 3,
      ACCEPTED_MOET: 4,
      ENROLLED: 5,
      REJECTED: -1,
    };
    return mapping[status] ?? -1;
  };

  useEffect(() => {
    if (data && data.applications && data.applications[0]) {
      const app = data.applications[0];
      const initialChecklist = {
        chkConfirmEnrollment: app.chkConfirmEnrollment || false,
        chkPayFee: app.chkPayFee || false,
        chkDeclareInfo: app.chkDeclareInfo || false,
        chkUploadCccd: app.chkUploadCccd || false,
        chkUploadPhoto: app.chkUploadPhoto || false,
        chkRegisterDorm: app.chkRegisterDorm || false,
        chkPrintLetter: app.chkPrintLetter || false,
      };
      setChecklistState(initialChecklist);

      const checked = Object.values(initialChecklist).filter(Boolean).length;
      setChecklistProgress(Math.round((checked / 7) * 100));
    }
  }, [data]);

  const handleConfirmModalSubmit = () => {
    if (!data.applications?.[0]) return;
    if (!commitCheckbox) {
      alert("Vui lòng tích chọn cam kết thông tin là đúng.");
      return;
    }
    const currentApp = data.applications[0];
    setActionLoading(true);
    api.post(`/api/student/applications/${currentApp.id}/confirm-moet`, {
      preferenceOrder: parseInt(preferenceOrder),
      majorCode: confirmMajorCode,
      majorName: confirmMajorName,
      evidenceImage: evidenceImage || null,
      note: confirmNote
    })
      .then(res => {
        alert("Xác nhận đăng ký nguyện vọng Bộ thành công!");
        setShowConfirmModal(false);
        api.get("/api/student/dashboard").then(r => setData(r.data));
      })
      .catch(err => {
        console.error(err);
        alert(err.response?.data?.message || "Lỗi khi xác nhận nguyện vọng.");
      })
      .finally(() => setActionLoading(false));
  };

  const handleChecklistChange = (key, val) => {
    const updated = { ...checklistState, [key]: val };
    setChecklistState(updated);
    const checked = Object.values(updated).filter(Boolean).length;
    setChecklistProgress(Math.round((checked / 7) * 100));
  };

  const handleSaveChecklist = () => {
    if (!data.applications?.[0]) return;
    const currentApp = data.applications[0];
    setActionLoading(true);
    api.put(`/api/student/applications/${currentApp.id}/checklist`, checklistState)
      .then(res => {
        alert("Lưu tiến độ làm thủ tục thành công!");
        api.get("/api/student/dashboard").then(r => setData(r.data));
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi khi lưu checklist.");
      })
      .finally(() => setActionLoading(false));
  };

  useEffect(() => {
    api.get("/api/student/dashboard")
      .then(r => setData(r.data))
      .catch(() => {
        setData({
          totalApplications: 0, hasProfile: false, unreadNotifications: 0, applications: [],
          allowNewApplication: false, newApplicationRequest: "NONE"
        });
      });
    // Load thông báo gần nhất
    api.get("/api/student/notifications?page=0&size=1")
      .then(r => {
        const list = r.data?.content || r.data || [];
        const first = Array.isArray(list) ? list[0] : null;
        if (first && !first.isRead) {
          setLatestNotif(first);
          setShowNotifModal(true);
        }
      })
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const currentApp = data.applications?.[0];
  const currentStatus = currentApp ? STATUS_CONFIG[currentApp.status] : null;
  const currentStepIdx = currentApp ? STEPS.indexOf(currentApp.status) : -1;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "8px 0" }}>

      {/* Modal thông báo gần nhất */}
      {showNotifModal && latestNotif && (() => {
        const cfg = NOTIF_TYPE_CONFIG[latestNotif.type] || NOTIF_TYPE_CONFIG.SYSTEM;
        const Icon = cfg.icon;
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "white", borderRadius: 20, maxWidth: 460, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <div style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)`, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} color="white" />
                  </div>
                  <div>
                    <div style={{ color: "white", fontWeight: 700, fontSize: 15 }}>Thông báo mới</div>
                    <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>{new Date(latestNotif.createdAt).toLocaleDateString("vi-VN")}</div>
                  </div>
                </div>
                <button onClick={() => setShowNotifModal(false)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: 6, cursor: "pointer", color: "white", display: "flex" }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ padding: "24px" }}>
                <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 700, color: "#0F172A" }}>{latestNotif.title}</h3>
                <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.7 }}>{latestNotif.message}</p>
              </div>
              <div style={{ padding: "0 24px 20px", display: "flex", gap: 10 }}>
                <Link to="/student/notifications"
                  onClick={() => setShowNotifModal(false)}
                  style={{ flex: 1, padding: "10px", background: "linear-gradient(135deg, #FF6B35, #E85A2A)", color: "white", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: "pointer", textAlign: "center", textDecoration: "none" }}>
                  Xem tất cả thông báo
                </Link>
                <button onClick={() => setShowNotifModal(false)}
                  style={{ padding: "10px 20px", background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Welcome Banner */}
      <div className="student-banner">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <div className="w-64 h-64 rounded-full bg-white absolute -right-16 -top-16"></div>
          <div className="w-48 h-48 rounded-full bg-white absolute -right-8 bottom-0"></div>
        </div>
        <div className="relative z-10">
          <p className="text-orange-200 text-sm font-medium mb-1" style={{ opacity: 0.9 }}>Xin chào 👋</p>
          <h1 className="text-2xl font-bold text-white mb-2">{user?.fullName}</h1>
          <p className="text-orange-100 text-sm mb-4" style={{ opacity: 0.85 }}>
            Chào mừng đến với Cổng tuyển sinh FPT University 2026
          </p>
          {!data.hasProfile && (
            <Link to="/student/apply"
              style={{
                backgroundColor: "white", color: "#E85A2A", padding: "10px 20px",
                borderRadius: "12px", fontWeight: "600", fontSize: "14px",
                display: "inline-flex", alignItems: "center", gap: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textDecoration: "none"
              }}
            >
              Bắt đầu nộp hồ sơ <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="student-grid-4">
        {[
          { label: "Hồ sơ đã nộp", value: data.totalApplications, icon: FileText, textColor: "#F97316" },
          { label: "Thông báo mới", value: data.unreadNotifications, icon: Bell, textColor: "#2563EB" },
          { label: "Đợt xét tuyển", value: "2026", icon: Calendar, textColor: "#7C3AED" },
          { label: "Trạng thái", value: currentStatus?.label || "Chưa nộp", icon: currentStatus?.icon || CheckCircle, textColor: "#059669" },
        ].map((kpi) => (
          <div key={kpi.label} className="student-card">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10"
              style={{ background: kpi.textColor, transform: "translate(30%, -30%)" }}></div>
            <div className="student-kpi-icon" style={{ background: `${kpi.textColor}15` }}>
              <kpi.icon size={20} style={{ color: kpi.textColor }} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Card Đăng ký nguyện vọng (nếu APPROVED) */}
      {currentApp && currentApp.status === "APPROVED" && (
        <div style={{
          background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
          borderRadius: "18px", padding: "24px 28px",
          border: "1px solid #FFEDD5",
          boxShadow: "0 10px 25px -5px rgba(253,186,116,0.2)",
          position: "relative", overflow: "hidden",
          animation: "slide-down 0.4s ease"
        }}>
          <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "180px", height: "180px", background: "rgba(255,107,53,0.06)", borderRadius: "50%" }} />
          <h3 style={{ margin: "0 0 12px", color: "#C2410C", fontWeight: "800", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🎉</span> Chúc mừng bạn đã Đủ Điều Kiện xét tuyển sơ bộ!
          </h3>
          <p style={{ margin: "0 0 16px", color: "#7C2D12", fontSize: "14px", lineHeight: "1.6" }}>
            Hồ sơ của bạn đã vượt qua vòng thẩm định học bạ. Để hoàn tất quy trình tuyển sinh theo đúng quy chế của Bộ GD&ĐT, bạn vui lòng đăng ký nguyện vọng Đại học FPT trên cổng thông tin tuyển sinh của Bộ:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "white", padding: "16px", borderRadius: "12px", border: "1px solid #FED7AA", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "12px", color: "#9A3412", fontWeight: "600" }}>Mã trường:</span>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#C2410C", marginTop: "2px" }}>FPT</div>
            </div>
            <div>
              <span style={{ fontSize: "12px", color: "#9A3412", fontWeight: "600" }}>Mã ngành xét tuyển:</span>
              <div style={{ fontSize: "18px", fontWeight: "800", color: "#C2410C", marginTop: "2px" }}>
                {currentApp.majorCode || "7480101"}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "#FFEDD5", padding: "10px 14px", borderRadius: "10px", borderLeft: "4px solid #FF6B35", fontSize: "13px", color: "#9A3412", fontWeight: "600", marginBottom: "20px" }}>
            <span>💡</span> Khuyến nghị: Vui lòng đặt nguyện vọng này ở vị trí <strong>Nguyện vọng 1</strong> để đảm bảo khả năng trúng tuyển cao nhất! Hạn chót Bộ GDĐT khóa cổng là 30/07/2026.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={() => {
                setConfirmMajorName(currentApp.majorName);
                setConfirmMajorCode(currentApp.majorCode || "7480101");
                setShowConfirmModal(true);
              }}
              style={{
                alignSelf: "flex-start",
                padding: "10px 24px",
                background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                color: "white",
                border: "none",
                borderRadius: "10px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(255,107,53,0.3)",
                transition: "all 0.2s"
              }}
            >
              Tôi đã đăng ký nguyện vọng
            </button>
          </div>
        </div>
      )}

      {/* Checklist Nhập học (nếu ACCEPTED_MOET hoặc ENROLLED) */}
      {currentApp && (currentApp.status === "ACCEPTED_MOET" || currentApp.status === "ENROLLED") && (
        <div className="student-card" style={{ padding: "24px 28px", border: "1px solid #E8ECF1", background: "white" }}>
          <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: "800", color: "#1E293B" }}>
            🎉 Chúc mừng! Bạn đã trúng tuyển chính thức.
          </h3>
          <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#64748B" }}>
            Chào mừng bạn đến với Đại học FPT! Vui lòng hoàn tất danh sách thủ tục dưới đây để chuẩn bị nhập học.
          </p>

          {/* Progress bar */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "700", color: "#FF6B35", marginBottom: "6px" }}>
              <span>Tiến trình hoàn thành</span>
              <span>{checklistProgress}%</span>
            </div>
            <div style={{ width: "100%", height: "8px", background: "#F1F5F9", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ width: `${checklistProgress}%`, height: "100%", background: "linear-gradient(90deg, #FF6B35, #E85A2A)", borderRadius: "99px", transition: "width 0.4s ease" }} />
            </div>
          </div>

          {/* Checklist items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            {[
              { key: "chkConfirmEnrollment", label: "Xác nhận nhập học trực tuyến trên hệ thống Bộ GDĐT", desc: "Xác nhận nguyện vọng nhập học chính thức vào Đại học FPT." },
              { key: "chkPayFee", label: "Nộp học phí kỳ đầu tiên (21.000.000 VNĐ)", desc: "Hoàn tất nộp phí giữ chỗ/học phí để nhận mã số sinh viên chính thức." },
              { key: "chkDeclareInfo", label: "Khai báo lý lịch thông tin cá nhân", desc: "Cập nhật hồ sơ học viên trực tuyến." },
              { key: "chkUploadCccd", label: "Tải lên bản sao công chứng CCCD/CMND", desc: "Cung cấp giấy tờ tùy thân hợp lệ." },
              { key: "chkUploadPhoto", label: "Tải lên ảnh chân dung 3x4 làm thẻ sinh viên", desc: "Ảnh nền trắng rõ mặt, chụp trong vòng 6 tháng." },
              { key: "chkRegisterDorm", label: "Đăng ký dịch vụ Ký túc xá (KTX) - Tùy chọn", desc: "Nếu bạn có nhu cầu đăng ký chỗ ở nội trú tại khu đô thị Đại học FPT." },
              { key: "chkPrintLetter", label: "In giấy báo trúng tuyển & nhập học", desc: "Lưu trữ bản giấy làm thủ tục nhập học thực tế ngày hội quân." }
            ].map(item => {
              const checked = checklistState[item.key] || false;
              return (
                <label key={item.key} style={{
                  display: "flex", alignItems: "flex-start", gap: "12px",
                  padding: "12px 14px", borderRadius: "10px",
                  border: checked ? "1px solid #FFEDD5" : "1px solid #F1F5F9",
                  background: checked ? "#FFFDFB" : "#FAFAFA",
                  cursor: "pointer", transition: "all 0.2s"
                }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleChecklistChange(item.key, e.target.checked)}
                    disabled={actionLoading}
                    style={{ width: "18px", height: "18px", accentColor: "#FF6B35", marginTop: "2px", cursor: "pointer" }}
                  />
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: checked ? "#C2410C" : "#334155" }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>
                      {item.desc}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <button
            onClick={handleSaveChecklist}
            disabled={actionLoading}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #1E293B, #0F172A)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(15,23,42,0.15)",
              transition: "all 0.2s"
            }}
          >
            {actionLoading ? "Đang lưu..." : "Lưu tiến độ làm thủ tục"}
          </button>
        </div>
      )}

      {/* Main Sections Grid */}
      <div className="student-grid-3">
        {/* Application Progress */}
        <div>
          <div className="student-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="flex items-center justify-between mb-6" style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: "16px" }}>
              <h3 className="font-semibold text-gray-900 text-lg">Tiến trình hồ sơ</h3>
              <Link to="/student/applications" className="text-sm text-orange-500 font-medium flex items-center gap-1" style={{ textDecoration: "none" }}>
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {currentApp ? (
                <div>
                  <div className="student-step-container" style={{ display: "flex", justifyContent: "space-between", position: "relative", marginBottom: "24px", padding: "0 8px" }}>
                    <div className="student-step-line" style={{ position: "absolute", top: "15px", left: "24px", right: "24px", height: "3px", backgroundColor: "#E2E8F0", zIndex: 0 }}>
                      <div style={{ width: getVisualStepIdx(currentApp.status) >= 0 ? `${(getVisualStepIdx(currentApp.status) / (VISUAL_STEPS.length - 1)) * 100}%` : "0%", height: "100%", background: "linear-gradient(90deg, #FF6B35, #E85A2A)", transition: "width 0.5s ease" }} />
                    </div>
                    {VISUAL_STEPS.map((step, idx) => {
                      const isDone = idx <= getVisualStepIdx(currentApp.status);
                      const isCurrent = idx === getVisualStepIdx(currentApp.status);
                      return (
                        <div key={step} className="student-step-node" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative", zIndex: 1, flex: 1 }}>
                          <div className="student-step-circle" style={{
                            width: "32px", height: "32px", borderRadius: "50%",
                            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800",
                            background: isDone ? "linear-gradient(135deg, #FF6B35, #E85A2A)" : "white",
                            color: isDone ? "white" : "#94A3B8",
                            border: isDone ? "none" : "2px solid #E2E8F0",
                            boxShadow: isDone ? "0 4px 12px rgba(255,107,53,0.25)" : "none",
                            transition: "all 0.3s ease"
                          }}>
                            {isDone && !isCurrent ? "✓" : idx + 1}
                          </div>
                          <span style={{ fontSize: "10px", fontWeight: "700", color: isCurrent ? "#E85A2A" : isDone ? "#FF6B35" : "#94A3B8", textAlign: "center", maxWidth: "80px" }}>
                            {VISUAL_STEP_LABELS[step]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ background: "#FFF7F4", borderRadius: "14px", padding: "16px", border: "1px solid #FFEDD5", marginTop: "24px" }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-base font-semibold text-gray-900">{currentApp.majorName}</div>
                        <div className="text-xs text-gray-500 mt-1">{currentApp.campusName}</div>
                        <div className="text-xs text-gray-400 mt-1">Mã HS: {currentApp.code}</div>
                      </div>
                      <span className={`badge ${currentStatus?.badge}`} style={{ borderRadius: "20px", padding: "6px 12px" }}>
                        {currentStatus?.label}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ color: "#FF6B35" }}>
                    <FileText size={28} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Bạn chưa có hồ sơ nào</h4>
                  <p className="text-sm text-gray-500 mb-4">Bắt đầu hành trình vào FPT University ngay hôm nay!</p>
                  <Link to="/student/apply" className="student-btn-primary">Nộp hồ sơ ngay</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Important Deadlines */}
        <div className="student-card">
          <div className="flex items-center mb-6" style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: "16px" }}>
            <h3 className="font-semibold text-gray-900 text-lg">Lịch quan trọng</h3>
          </div>
          <div className="space-y-3">
            {deadlines.map((d) => (
              <div key={d.label}
                style={{ display: "flex", alignItems: "center", padding: "12px", borderRadius: "12px", backgroundColor: "#F8FAFC" }}
                className="hover:bg-orange-50"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: d.urgent ? "#EF4444" : "#FF6B35" }}></div>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#334155" }}>{d.label}</span>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#64748B" }}>{d.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="student-action-grid">
        {[
          { to: "/student/apply", icon: "📝", label: "Nộp hồ sơ", desc: "Tạo hồ sơ mới" },
          { to: "/student/applications", icon: "📋", label: "Hồ sơ của tôi", desc: "Xem trạng thái" },
          { to: "/student/documents", icon: "📁", label: "Tài liệu", desc: "Upload giấy tờ" },
          { to: "/student/notifications", icon: "🔔", label: "Thông báo", desc: "Xem tin nhắn" },
        ].map((action) => (
          <Link key={action.to} to={action.to} className="student-action-card">
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>{action.icon}</div>
            <div style={{ fontWeight: "600", color: "#1E293B", fontSize: "14px" }}>{action.label}</div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>{action.desc}</div>
          </Link>
        ))}
      </div>

      {/* FPT University Info — đặt trước Quick Actions */}
      <div style={{
        background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        borderRadius: "18px", padding: "24px 28px",
        display: "flex", alignItems: "center", gap: "20px",
        position: "relative", overflow: "hidden",
        boxShadow: "0 4px 16px rgba(15,23,42,0.15)"
      }}>
        <div style={{ position: "absolute", right: "-10px", top: "-20px", width: "160px", height: "160px", background: "rgba(255,107,53,0.08)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: "80px", bottom: "-30px", width: "100px", height: "100px", background: "rgba(255,107,53,0.05)", borderRadius: "50%" }} />
        <div style={{ width: "52px", height: "52px", background: "rgba(255,107,53,0.15)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
          <GraduationCap size={26} color="#FF6B35" />
        </div>
        <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
          <div style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>
            Thông tin tuyển sinh FPT University 2026
          </div>
          <div style={{ color: "rgba(148,163,184,1)", fontSize: "13px" }}>
            Giới thiệu trường • Phương thức xét tuyển • Ngành học • Học phí • Học bổng
          </div>
        </div>
        <Link to="/student/university-info" style={{
          display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "12px",
          background: "linear-gradient(135deg, #FF6B35, #E85A2A)", color: "white", fontWeight: "600", fontSize: "13px",
          flexShrink: 0, zIndex: 1, boxShadow: "0 4px 12px rgba(232,90,42,0.35)", textDecoration: "none"
        }}>
          Khám phá <ArrowRight size={15} />
        </Link>
      </div>

      {/* FPT Info Promo Card (bottom) */}
      <Link to="/student/university-info" style={{ textDecoration: "none" }}>
        <div style={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          borderRadius: "18px", padding: "24px 28px",
          display: "flex", alignItems: "center", gap: "20px",
          position: "relative", overflow: "hidden", cursor: "pointer",
          boxShadow: "0 4px 16px rgba(15,23,42,0.15)"
        }}>
          <div style={{ position: "absolute", right: "-10px", top: "-20px", width: "160px", height: "160px", background: "rgba(255,107,53,0.08)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", right: "80px", bottom: "-30px", width: "100px", height: "100px", background: "rgba(255,107,53,0.05)", borderRadius: "50%" }} />
          <div style={{ width: "52px", height: "52px", background: "rgba(255,107,53,0.15)", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
            <GraduationCap size={26} color="#FF6B35" />
          </div>
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <div style={{ color: "white", fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>
              Thông tin tuyển sinh FPT University 2026
            </div>
            <div style={{ color: "rgba(148,163,184,1)", fontSize: "13px" }}>
              Giới thiệu trường • Phương thức xét tuyển • Ngành học • Học phí • Học bổng
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px", borderRadius: "12px",
            background: "linear-gradient(135deg, #FF6B35, #E85A2A)", color: "white", fontWeight: "600", fontSize: "13px",
            flexShrink: 0, zIndex: 1, boxShadow: "0 4px 12px rgba(232,90,42,0.35)"
          }}>
            Khám phá <ArrowRight size={15} />
          </div>
        </div>
      </Link>

      {/* Dialog Xác nhận Đăng ký nguyện vọng */}
      {showConfirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "white", borderRadius: 16, width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", boxShadow: "0 20px 50px rgba(0,0,0,0.2)", overflow: "hidden" }}>
            {/* Modal Header */}
            <div style={{ background: "linear-gradient(135deg, #FF6B35, #E85A2A)", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ color: "white", fontWeight: 800, fontSize: 16 }}>Xác nhận nguyện vọng tuyển sinh</div>
              <button onClick={() => setShowConfirmModal(false)} style={{ background: "transparent", border: "none", color: "white", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>
            {/* Modal Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>NGÀY ĐĂNG KÝ</label>
                <input
                  type="date"
                  value={confirmDate}
                  onChange={e => setConfirmDate(e.target.value)}
                  style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 13 }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>THỨ TỰ NGUYỆN VỌNG</label>
                <select
                  value={preferenceOrder}
                  onChange={e => setPreferenceOrder(e.target.value)}
                  style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 13, background: "white" }}
                >
                  <option value="1">Nguyện vọng 1 (Khuyến nghị)</option>
                  <option value="2">Nguyện vọng 2</option>
                  <option value="3">Nguyện vọng 3</option>
                  <option value="4">Nguyện vọng 4</option>
                  <option value="5">Nguyện vọng 5</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>NGÀNH ĐÃ ĐĂNG KÝ</label>
                <input
                  type="text"
                  value={confirmMajorName}
                  onChange={e => setConfirmMajorName(e.target.value)}
                  style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 13 }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>MÃ NGÀNH</label>
                <input
                  type="text"
                  value={confirmMajorCode}
                  onChange={e => setConfirmMajorCode(e.target.value)}
                  style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 13 }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>UPLOAD ẢNH MINH CHỨNG (KHÔNG BẮT BUỘC)</label>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>GHI CHÚ</label>
                <textarea
                  value={confirmNote}
                  onChange={e => setConfirmNote(e.target.value)}
                  rows={2}
                  style={{ padding: "8px 12px", border: "1px solid #CBD5E1", borderRadius: 8, fontSize: 13, resize: "none" }}
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
            <div style={{ padding: "12px 20px", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={() => setShowConfirmModal(false)} style={{ padding: "8px 16px", background: "white", border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 12, cursor: "pointer", fontWeight: 600, color: "#64748B" }}>Hủy</button>
              <button
                disabled={!commitCheckbox || actionLoading}
                onClick={handleConfirmModalSubmit}
                style={{
                  padding: "8px 18px",
                  background: commitCheckbox ? "linear-gradient(135deg, #FF6B35, #E85A2A)" : "#CBD5E1",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: commitCheckbox ? "pointer" : "not-allowed",
                  boxShadow: commitCheckbox ? "0 2px 6px rgba(255,107,53,0.2)" : "none"
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
