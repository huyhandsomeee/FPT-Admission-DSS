import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/axiosConfig";
import {
  FileText, CheckCircle, Clock, XCircle, Bell, ArrowRight,
  BookOpen, Award, AlertCircle, Calendar
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
      code: "APP2025001001",
      status: "UNDER_REVIEW",
      majorName: "Kỹ thuật phần mềm",
      campusName: "FPT University Hà Nội",
    },
  ],
};

const deadlines = [
  { label: "Nộp hồ sơ đợt 1", date: "30/03/2025", urgent: false },
  { label: "Nộp hồ sơ đợt 2", date: "30/04/2025", urgent: false },
  { label: "Công bố kết quả", date: "15/05/2025", urgent: false },
  { label: "Xác nhận nhập học", date: "30/06/2025", urgent: false },
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
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #FF6B35 0%, #E85A2A 50%, #C8420E 100%)" }}>
        <div className="absolute right-0 top-0 w-64 h-full opacity-10">
          <div className="w-64 h-64 rounded-full bg-white absolute -right-16 -top-16"></div>
          <div className="w-48 h-48 rounded-full bg-white absolute -right-8 bottom-0"></div>
        </div>
        <div className="relative z-10">
          <p className="text-orange-200 text-sm font-medium mb-1">Xin chào 👋</p>
          <h1 className="text-2xl font-bold text-white mb-2">{user?.fullName}</h1>
          <p className="text-orange-100 text-sm mb-4">
            Chào mừng đến với Cổng tuyển sinh FPT University 2025
          </p>
          {!data.hasProfile && (
            <Link to="/student/apply"
              className="inline-flex items-center gap-2 bg-white text-orange-500 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-orange-50 transition-colors shadow-lg">
              Bắt đầu nộp hồ sơ <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Hồ sơ đã nộp", value: data.totalApplications, icon: FileText, textColor: "#F97316" },
          { label: "Thông báo mới", value: data.unreadNotifications, icon: Bell, textColor: "#2563EB" },
          { label: "Đợt xét tuyển", value: "2025", icon: Calendar, textColor: "#7C3AED" },
          { label: "Trạng thái", value: currentStatus?.label || "Chưa nộp", icon: CheckCircle, textColor: "#059669" },
        ].map((kpi) => (
          <div key={kpi.label} className="card p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10"
              style={{ background: kpi.textColor, transform: "translate(30%, -30%)" }}></div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${kpi.textColor}15` }}>
              <kpi.icon size={20} style={{ color: kpi.textColor }} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Progress */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold text-gray-900">Tiến trình hồ sơ</h3>
              <Link to="/student/applications" className="text-sm text-orange-500 font-medium flex items-center gap-1">
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>
            <div className="card-body">
              {currentApp ? (
                <div>
                  {/* Status Steps */}
                  <div className="flex items-center justify-between mb-6 relative">
                    <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 z-0"></div>
                    {steps.map((step, idx) => {
                      const isDone = idx <= currentStepIdx;
                      const isCurrent = idx === currentStepIdx;
                      return (
                        <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all
                            ${isDone ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-white border-2 border-gray-200 text-gray-400"}`}>
                            {isDone && !isCurrent ? "✓" : idx + 1}
                          </div>
                          <span className={`text-xs font-medium ${isDone ? "text-orange-600" : "text-gray-400"}`}>
                            {STATUS_CONFIG[step]?.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* App Info */}
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{currentApp.majorName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{currentApp.campusName}</div>
                        <div className="text-xs text-gray-400 mt-1">Mã HS: {currentApp.code}</div>
                      </div>
                      <span className={`badge ${currentStatus?.color}`}>
                        {currentStatus?.label}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText size={28} className="text-orange-400" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Bạn chưa có hồ sơ nào</h4>
                  <p className="text-sm text-gray-500 mb-4">Bắt đầu hành trình vào FPT University ngay hôm nay!</p>
                  <Link to="/student/apply" className="btn btn-primary btn-sm">
                    Nộp hồ sơ ngay
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Important Deadlines */}
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Lịch quan trọng</h3>
          </div>
          <div className="card-body space-y-3">
            {deadlines.map((d) => (
              <div key={d.label}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${d.urgent ? "bg-red-500" : "bg-orange-400"}`}></div>
                  <span className="text-sm text-gray-700">{d.label}</span>
                </div>
                <span className="text-xs font-medium text-gray-500">{d.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: "/student/apply", icon: "📝", label: "Nộp hồ sơ", desc: "Tạo hồ sơ mới" },
          { to: "/student/applications", icon: "📋", label: "Hồ sơ của tôi", desc: "Xem trạng thái" },
          { to: "/student/documents", icon: "📁", label: "Tài liệu", desc: "Upload giấy tờ" },
          { to: "/student/notifications", icon: "🔔", label: "Thông báo", desc: "Xem tin nhắn" },
        ].map((action) => (
          <Link key={action.to} to={action.to}
            className="card p-5 hover:border-orange-200 hover:shadow-lg transition-all group">
            <div className="text-3xl mb-3">{action.icon}</div>
            <div className="font-semibold text-gray-900 text-sm group-hover:text-orange-600 transition-colors">
              {action.label}
            </div>
            <div className="text-xs text-gray-500 mt-1">{action.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
