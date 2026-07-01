import React from "react";
import { X } from "lucide-react";
import { getFilePreviewUrl, isPdfFile, isImgFile } from "../../utils/fileUtils";
import { formatDateDisplay } from "../../utils/dateUtils";
import StatusBadge from "./StatusBadge";

export default function DetailModal({ show, onClose, appDetail, loading }) {
  if (!show) return null;

  const getDocStatusColor = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "verified" || s === "uploaded") return "bg-green-100 text-green-700";
    if (s === "rejected") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const getDocStatusLabel = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "verified" || s === "uploaded") return "Đã duyệt";
    if (s === "rejected") return "Từ chối";
    return "Chờ duyệt";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 relative"
        style={{ position: "relative", backgroundColor: "white", padding: "24px", borderRadius: "16px", maxWidth: "768px", width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold text-gray-900">Chi tiết hồ sơ đăng ký</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-lg"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>✕</button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">Đang tải dữ liệu hồ sơ...</div>
        ) : appDetail ? (
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="font-bold text-orange-600 text-sm mb-3 uppercase tracking-wider">👤 Thông tin cá nhân</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Họ và tên:</span> <strong className="text-gray-800">{appDetail.fullName}</strong></div>
                <div><span className="text-gray-500">Ngày sinh:</span> <strong className="text-gray-800">{formatDateDisplay(appDetail.dob)}</strong></div>
                <div><span className="text-gray-500">Giới tính:</span> <strong className="text-gray-800">{appDetail.gender === "MALE" ? "Nam" : "Nữ"}</strong></div>
                <div><span className="text-gray-500">CCCD/CMND:</span> <strong className="text-gray-800">{appDetail.cccd}</strong></div>
                <div><span className="text-gray-500">Số điện thoại:</span> <strong className="text-gray-800">{appDetail.phone}</strong></div>
                <div><span className="text-gray-500">Địa chỉ:</span> <strong className="text-gray-800">{appDetail.permanentAddress}</strong></div>
                <div><span className="text-gray-500">Họ tên phụ huynh:</span> <strong className="text-gray-800">{appDetail.parentName || "—"}</strong></div>
                <div><span className="text-gray-500">SĐT phụ huynh:</span> <strong className="text-gray-800">{appDetail.parentPhone || "—"}</strong></div>
              </div>
            </div>

            {/* Academic Profile */}
            {appDetail.academicBackground && (
              <div>
                <h4 className="font-bold text-orange-600 text-sm mb-3 uppercase tracking-wider">📚 Kết quả học tập</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-gray-500">Trường THPT:</span> <strong className="text-gray-800">{appDetail.academicBackground.schoolName}</strong></div>
                  <div><span className="text-gray-500">Năm tốt nghiệp:</span> <strong className="text-gray-800">{appDetail.academicBackground.graduationYear}</strong></div>
                  <div><span className="text-gray-500">Điểm Toán / Văn / Anh:</span> <strong className="text-gray-800">{appDetail.academicBackground.mathScore} / {appDetail.academicBackground.literatureScore} / {appDetail.academicBackground.englishScore}</strong></div>
                  <div><span className="text-gray-500">GPA Trung bình Lớp 12:</span> <strong className="text-gray-800">{appDetail.academicBackground.gpa12}</strong></div>
                  <div className="col-span-2"><span className="text-gray-500">Tổng điểm xét tuyển:</span> <strong className="text-orange-600 font-bold">{appDetail.academicBackground.totalScore}</strong></div>
                </div>
              </div>
            )}

            {/* Documents */}
            {appDetail.documents && appDetail.documents.length > 0 && (
              <div>
                <h4 className="font-bold text-orange-600 text-sm mb-3 uppercase tracking-wider">📄 Tài liệu minh chứng</h4>
                <div className="space-y-2">
                  {appDetail.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <div>
                        <span className="font-semibold text-gray-800">{doc.desc || doc.name}</span>
                        <div className="text-xs text-gray-400 mt-0.5">{doc.name}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getDocStatusColor(doc.status)}`}>
                          {getDocStatusLabel(doc.status)}
                        </span>
                        {doc.filePath && (
                          <a href={getFilePreviewUrl(doc.filePath)} target="_blank" rel="noreferrer" className="text-orange-600 font-semibold hover:underline">
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
          <button onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors"
            style={{ padding: "8px 20px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
