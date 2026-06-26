import { useEffect, useState } from "react";
import api from "../../../config/axiosConfig";
import { FileText, Plus, Award } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProgressTracker from "../../../components/common/ProgressTracker";
import DetailModal from "../../../components/common/DetailModal";
import { STATUS_CONFIG, STATUS_LABELS, STEPS } from "../../../utils/statusUtils";

export default function MyApplications() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

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

                {/* Progress Bar */}
                <ProgressTracker
                  steps={STEPS}
                  currentStatus={app.status}
                  statusLabels={STATUS_LABELS}
                />

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

      {/* Detail Modal */}
      <DetailModal show={showDetail} onClose={() => setShowDetail(false)} appDetail={selectedApp} loading={loadingDetail} />
    </div>
  );
}
