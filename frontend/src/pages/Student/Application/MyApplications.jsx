import { useEffect, useState } from "react";
import api from "../../../config/axiosConfig";
import { FileText, Clock, CheckCircle, XCircle, Award, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_CONFIG = {
  DRAFT: { label: "Bản nháp", badge: "badge-draft", icon: FileText, step: 0 },
  SUBMITTED: { label: "Đã nộp", badge: "badge-submitted", icon: Clock, step: 1 },
  UNDER_REVIEW: { label: "Đang xét duyệt", badge: "badge-review", icon: Clock, step: 2 },
  APPROVED: { label: "Được chấp thuận", badge: "badge-approved", icon: CheckCircle, step: 3 },
  REJECTED: { label: "Bị từ chối", badge: "badge-rejected", icon: XCircle, step: 3 },
  ENROLLED: { label: "Đã nhập học", badge: "badge-enrolled", icon: Award, step: 4 },
};

const MOCK_APPS = [
  {
    id: 1, applicationCode: "APP2025001001", status: "UNDER_REVIEW",
    majorName: "Kỹ thuật phần mềm", campusName: "FPT University Hà Nội",
    methodName: "Xét điểm thi THPT", totalScore: "25.00", submittedAt: "2025-03-15T09:30:00", createdAt: "2025-03-10T08:00:00"
  }
];

export default function MyApplications() {
  const [apps, setApps] = useState(MOCK_APPS);

  useEffect(() => {
    api.get("/api/student/applications").then(r => setApps(r.data)).catch(() => {});
  }, []);

  return (
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
            const steps = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "ENROLLED"];
            const stepIdx = steps.indexOf(app.status);
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

                {/* Progress Bar */}
                <div className="relative mb-6" style={{ marginBottom: "24px" }}>
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2" style={{ padding: "0 4px" }}>
                    {steps.slice(0, 5).map((s, i) => (
                      <span key={s} className={i <= stepIdx ? "text-orange-600 font-semibold" : ""}>
                        {STATUS_CONFIG[s]?.label}
                      </span>
                    ))}
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${((stepIdx + 1) / 5) * 100}%`, background: "linear-gradient(90deg, #FF6B35, #E85A2A)" }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm pt-2">
                  <div className="flex gap-4">
                    <span className="text-gray-500">Phương thức: <span className="font-semibold text-gray-700">{app.methodName}</span></span>
                    {app.totalScore && <span className="text-gray-500" style={{ marginLeft: "16px" }}>Điểm: <span className="font-bold text-orange-600">{app.totalScore}</span></span>}
                  </div>
                  <button className="text-orange-500 font-semibold text-sm hover:underline" style={{ background: "none", border: "none", cursor: "pointer" }}>
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
