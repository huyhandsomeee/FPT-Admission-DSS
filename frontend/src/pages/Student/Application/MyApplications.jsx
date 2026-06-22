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
  const [selectedAppDetail, setSelectedAppDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    api.get("/api/student/applications").then(r => setApps(r.data)).catch(() => {});
  }, []);

  const handleViewDetail = (id) => {
    setLoadingDetail(true);
    setShowDetailModal(true);
    setSelectedAppDetail(null);
    api.get(`/api/student/applications/${id}`)
      .then(res => {
        setSelectedAppDetail(res.data);
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi tải chi tiết hồ sơ.");
        setShowDetailModal(false);
      })
      .finally(() => {
        setLoadingDetail(false);
      });
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
                  <button onClick={() => handleViewDetail(app.id)} className="text-orange-500 font-semibold text-sm hover:underline" style={{ background: "none", border: "none", cursor: "pointer" }}>
                    Xem chi tiết →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 relative" style={{ position: "relative", backgroundColor: "white", padding: "24px", borderRadius: "16px", maxWidth: "768px", width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết hồ sơ đăng ký</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>✕</button>
            </div>

            {loadingDetail ? (
              <div className="py-12 text-center text-gray-500">Đang tải dữ liệu hồ sơ...</div>
            ) : selectedAppDetail ? (
              <div className="space-y-6" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Personal Information */}
                <div>
                  <h4 className="font-bold text-orange-600 text-sm mb-3 uppercase tracking-wider">👤 Thông tin cá nhân</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div><span className="text-gray-500">Họ và tên:</span> <strong className="text-gray-800">{selectedAppDetail.fullName}</strong></div>
                    <div><span className="text-gray-500">Ngày sinh:</span> <strong className="text-gray-800">{selectedAppDetail.dob}</strong></div>
                    <div><span className="text-gray-500">Giới tính:</span> <strong className="text-gray-800">{selectedAppDetail.gender === "MALE" ? "Nam" : "Nữ"}</strong></div>
                    <div><span className="text-gray-500">CCCD/CMND:</span> <strong className="text-gray-800">{selectedAppDetail.cccd}</strong></div>
                    <div><span className="text-gray-500">Số điện thoại:</span> <strong className="text-gray-800">{selectedAppDetail.phone}</strong></div>
                    <div><span className="text-gray-500">Địa chỉ:</span> <strong className="text-gray-800">{selectedAppDetail.permanentAddress}</strong></div>
                    <div><span className="text-gray-500">Họ tên phụ huynh:</span> <strong className="text-gray-800">{selectedAppDetail.parentName || "—"}</strong></div>
                    <div><span className="text-gray-500">SĐT phụ huynh:</span> <strong className="text-gray-800">{selectedAppDetail.parentPhone || "—"}</strong></div>
                  </div>
                </div>

                {/* Academic Profile */}
                {selectedAppDetail.academicBackground && (
                  <div>
                    <h4 className="font-bold text-orange-600 text-sm mb-3 uppercase tracking-wider">📚 Kết quả học tập</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div><span className="text-gray-500">Trường THPT:</span> <strong className="text-gray-800">{selectedAppDetail.academicBackground.schoolName}</strong></div>
                      <div><span className="text-gray-500">Năm tốt nghiệp:</span> <strong className="text-gray-800">{selectedAppDetail.academicBackground.graduationYear}</strong></div>
                      <div><span className="text-gray-500">Điểm Toán / Văn / Anh:</span> <strong className="text-gray-800">{selectedAppDetail.academicBackground.mathScore} / {selectedAppDetail.academicBackground.literatureScore} / {selectedAppDetail.academicBackground.englishScore}</strong></div>
                      <div><span className="text-gray-500">GPA Lớp 10 / 11 / 12:</span> <strong className="text-gray-800">{selectedAppDetail.academicBackground.gpa10} / {selectedAppDetail.academicBackground.gpa11} / {selectedAppDetail.academicBackground.gpa12}</strong></div>
                      <div className="col-span-2"><span className="text-gray-500">Tổng điểm xét tuyển:</span> <strong className="text-orange-600 font-bold">{selectedAppDetail.academicBackground.totalScore}</strong></div>
                    </div>
                  </div>
                )}

                {/* Documents list */}
                {selectedAppDetail.documents && selectedAppDetail.documents.length > 0 && (
                  <div>
                    <h4 className="font-bold text-orange-600 text-sm mb-3 uppercase tracking-wider">📄 Tài liệu minh chứng</h4>
                    <div className="space-y-2" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {selectedAppDetail.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                          <div>
                            <span className="font-semibold text-gray-800">{doc.desc || doc.name}</span>
                            <div className="text-xs text-gray-400 mt-0.5">{doc.name}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${doc.status === "VERIFIED" || doc.status === "verified" ? "bg-green-100 text-green-700" : doc.status === "REJECTED" || doc.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {doc.status === "VERIFIED" || doc.status === "verified" ? "Đã duyệt" : doc.status === "REJECTED" || doc.status === "rejected" ? "Từ chối" : "Chờ duyệt"}
                            </span>
                            {doc.filePath && (
                              <a href={`http://localhost:8081${doc.filePath}`} target="_blank" rel="noreferrer" className="text-orange-600 font-semibold hover:underline">
                                Xem file
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-red-500">Không tìm thấy thông tin chi tiết.</div>
            )}

            <div className="pt-4 border-t flex justify-end">
              <button onClick={() => setShowDetailModal(false)} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors" style={{ padding: "8px 20px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
