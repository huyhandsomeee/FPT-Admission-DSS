import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock, User, BookOpen, MapPin } from "lucide-react";
import api from "../../../config/axiosConfig";

const MOCK_APP = {
  id: 1, applicationCode: "APP2025001001",
  studentName: "Phạm Hữu Hân", studentEmail: "student1@gmail.com", studentPhone: "0906789012",
  majorName: "Kỹ thuật phần mềm", campusName: "FPT University Hà Nội",
  methodName: "Xét điểm thi THPT Quốc gia", status: "UNDER_REVIEW",
  totalScore: "25.00", submittedAt: "2025-03-15T09:30:00", createdAt: "2025-03-10T08:00:00",
  officerNotes: "", rejectionReason: "",
};

export default function ApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app] = useState(MOCK_APP);
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");

  const updateStatus = async (status) => {
    setLoading(true);
    setAction(status);
    try {
      await api.patch(`/api/officer/applications/${id}/status`, { status, reason, notes });
      navigate("/officer/applicants");
    } catch {
      setTimeout(() => navigate("/officer/applicants"), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn btn-ghost flex items-center gap-2">
          <ArrowLeft size={18} /> Quay lại
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Xét duyệt hồ sơ</h1>
          <p className="text-gray-500 text-sm">{app.applicationCode}</p>
        </div>
        <span className="ml-auto badge badge-review">Đang xét duyệt</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card">
            <div className="card-header"><h3 className="font-semibold text-gray-900 flex items-center gap-2"><User size={18} />Thông tin thí sinh</h3></div>
            <div className="card-body grid grid-cols-2 gap-4">
              {[
                ["Họ và tên", app.studentName],
                ["Email", app.studentEmail],
                ["Số điện thoại", app.studentPhone],
                ["Mã hồ sơ", app.applicationCode],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-xs text-gray-400 font-medium">{label}</div>
                  <div className="text-sm font-semibold text-gray-900 mt-1">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3 className="font-semibold text-gray-900 flex items-center gap-2"><BookOpen size={18} />Thông tin xét tuyển</h3></div>
            <div className="card-body grid grid-cols-2 gap-4">
              {[
                ["Ngành học", app.majorName],
                ["Cơ sở", app.campusName],
                ["Phương thức", app.methodName],
                ["Điểm xét tuyển", app.totalScore],
                ["Ngày nộp", new Date(app.submittedAt).toLocaleDateString("vi-VN")],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-xs text-gray-400 font-medium">{label}</div>
                  <div className={`text-sm font-semibold mt-1 ${label === "Điểm xét tuyển" ? "text-blue-700 text-xl" : "text-gray-900"}`}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="card">
            <div className="card-header"><h3 className="font-semibold text-gray-900">Tài liệu đính kèm</h3></div>
            <div className="card-body space-y-2">
              {["CCCD/CMND", "Học bạ THPT", "Bảng điểm thi THPT", "Ảnh thẻ"].map((doc) => (
                <div key={doc} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-700">{doc}</span>
                  <span className="badge badge-submitted text-xs">Đã nộp</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Panel */}
        <div className="space-y-5">
          <div className="card">
            <div className="card-header"><h3 className="font-semibold text-gray-900">Ghi chú nhân viên</h3></div>
            <div className="card-body">
              <textarea
                value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Nhập nhận xét về hồ sơ..."
                className="form-input resize-none"
                rows={4}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3 className="font-semibold text-gray-900">Lý do từ chối (nếu có)</h3></div>
            <div className="card-body">
              <textarea
                value={reason} onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do từ chối hồ sơ..."
                className="form-input resize-none"
                rows={3}
              />
            </div>
          </div>

          <div className="card">
            <div className="card-body space-y-3">
              <button
                onClick={() => updateStatus("UNDER_REVIEW")} disabled={loading}
                className="w-full btn flex items-center justify-center gap-2"
                style={{ background: "#D97706", color: "white" }}>
                <Clock size={18} /> Chuyển sang Đang xét
              </button>
              <button
                onClick={() => updateStatus("APPROVED")} disabled={loading}
                className="w-full btn btn-green flex items-center justify-center gap-2">
                <CheckCircle size={18} /> {loading && action === "APPROVED" ? "Đang xử lý..." : "Chấp thuận hồ sơ"}
              </button>
              <button
                onClick={() => updateStatus("REJECTED")} disabled={loading}
                className="w-full btn flex items-center justify-center gap-2"
                style={{ background: "#DC2626", color: "white" }}>
                <XCircle size={18} /> {loading && action === "REJECTED" ? "Đang xử lý..." : "Từ chối hồ sơ"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
