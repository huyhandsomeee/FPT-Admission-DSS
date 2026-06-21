import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/axiosConfig";
import {
  FileText, CheckCircle, Clock, XCircle, Bell, ArrowRight,
  BookOpen, Award, AlertCircle, Calendar, GraduationCap
} from "lucide-react";

const STATUS_CONFIG = {
  DRAFT: { label: "Bản nháp", color: "badge-draft", icon: FileText },
  SUBMITTED: { label: "Đã nộp", color: "badge-submitted", icon: Clock },
  UNDER_REVIEW: { label: "Đang xét duyệt", color: "badge-review", icon: Clock },
  APPROVED: { label: "Được chấp thuận", color: "badge-approved", icon: CheckCircle },
  REJECTED: { label: "Bị từ chối", color: "badge-rejected", icon: XCircle },
  ENROLLED: { label: "Đã nhập học", color: "badge-enrolled", icon: Award },
};

const MOCK_DATA = {
  totalApplications: 1,
  hasProfile: true,
  unreadNotifications: 2,
  applications: [
    {
      id: 1,
      code: "APP2026001001",
      status: "UNDER_REVIEW",
      majorName: "Kỹ thuật phần mềm",
      campusName: "FPT University Hà Nội",
    },
  ],
};

const deadlines = [
  { label: "Nộp hồ sơ đợt 1", date: "30/03/2026", urgent: false },
  { label: "Nộp hồ sơ đợt 2", date: "30/04/2026", urgent: false },
  { label: "Công bố kết quả", date: "15/07/2026", urgent: false },
  { label: "Xác nhận nhập học", date: "30/08/2026", urgent: false },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(MOCK_DATA);

  useEffect(() => {
    api.get("/api/student/dashboard")
      .then((r) => setData(r.data))
      .catch(() => setData(MOCK_DATA));
  }, []);

  const currentApp = data.applications?.[0];
  const currentStatus = currentApp ? STATUS_CONFIG[currentApp.status] : null;

  const steps = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "ENROLLED"];
  const currentStepIdx = currentApp ? steps.indexOf(currentApp.status) : -1;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "8px 0" }}>
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
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)", textDecoration: "none",
                transition: "all 0.2s"
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
          { label: "Trạng thái", value: currentStatus?.label || "Chưa nộp", icon: CheckCircle, textColor: "#059669" },
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
                  <div className="student-step-container">
                    <div className="student-step-line"></div>
                    {steps.map((step, idx) => {
                      const isDone = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={step} className="student-step-node">
                          <div className="student-step-circle" style={{
                            background: isDone ? "linear-gradient(135deg, #FF6B35, #E85A2A)" : "white",
                            color: isDone ? "white" : "#94A3B8",
                            border: isDone ? "none" : "2px solid #E2E8F0",
                            boxShadow: isDone ? "0 4px 12px rgba(255,107,53,0.25)" : "none"
                          }}>
                            {isDone && !isCurrent ? "✓" : idx + 1}
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: "600", color: isDone ? "#E85A2A" : "#94A3B8" }}>
                            {STATUS_CONFIG[step]?.label}
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
                      <span className={`badge ${currentStatus?.color}`} style={{ borderRadius: "20px", padding: "6px 12px" }}>
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

      {/* FPT Info Promo Card */}
      <Link to="/student/university-info" style={{ textDecoration: "none" }}>
        <div style={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          borderRadius: "18px", padding: "24px 28px",
          display: "flex", alignItems: "center", gap: "20px",
          position: "relative", overflow: "hidden",
          cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 4px 16px rgba(15,23,42,0.15)"
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.15)"; }}
        >
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
            display: "flex", alignItems: "center", gap: "6px",
            padding: "10px 18px", borderRadius: "12px",
            background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
            color: "white", fontWeight: "600", fontSize: "13px",
            flexShrink: 0, zIndex: 1,
            boxShadow: "0 4px 12px rgba(232,90,42,0.35)"
          }}>
            Khám phá <ArrowRight size={15} />
          </div>
        </div>
      </Link>
    </div>
  );
}
