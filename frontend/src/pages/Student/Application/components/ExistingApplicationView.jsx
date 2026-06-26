import React from "react";
import { CheckCircle } from "lucide-react";
import DetailModal from "../../../../components/common/DetailModal";
import { STATUS_STEP_INDEX, STATUS_LABELS, STEPS } from "../../../../utils/statusUtils";
import { getFilePreviewUrl } from "../../../../utils/fileUtils";
import { formatDateDisplay } from "../../../../utils/dateUtils";

export default function ExistingApplicationView({
  existingApp, allowNew, requestStatus,
  showDetailModal, setShowDetailModal,
  handleRequestNew
}) {
  if (!existingApp) return null;

  const appStatus = existingApp?.status || "SUBMITTED";
  const stepIdx = STATUS_STEP_INDEX[appStatus] || 1;

  const handleViewDetail = () => setShowDetailModal(true);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in" style={{ padding: "8px 0" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nộp hồ sơ xét tuyển</h1>
        <p className="text-gray-500 text-sm mt-1">FPT University - Mùa tuyển sinh 2026</p>
      </div>

      <div className="student-card text-center p-8 mb-6" style={{ padding: "40px" }}>
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6" style={{ color: "#22C55E", width: "80px", height: "80px" }}>
          <CheckCircle size={44} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hồ sơ xét tuyển đã được nộp hoàn tất!</h2>
        <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
          Hệ thống ghi nhận bạn đã nộp hồ sơ đăng ký xét tuyển. Bạn có thể theo dõi tiến độ xét duyệt dưới đây.
        </p>

        {/* Progress Tracker */}
        <div className="relative mb-8 max-w-xl mx-auto" style={{ border: "1px solid #E2E8F0", padding: "24px", borderRadius: "16px", backgroundColor: "#F8FAFC" }}>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3" style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
            {STEPS.map((s, i) => {
              const isCurrent = s === appStatus;
              const isDone = i <= stepIdx;
              let label = STATUS_LABELS[s];
              if (s === "APPROVED" && appStatus === "REJECTED") label = "Bị từ chối";
              return (
                <span key={s} className={isCurrent ? "text-orange-600 font-bold" : isDone ? "text-green-600 font-semibold" : ""}>
                  {label}
                </span>
              );
            })}
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${((stepIdx + 1) / 5) * 100}%`,
                background: appStatus === "REJECTED" ? "#EF4444" : "linear-gradient(90deg, #FF6B35, #E85A2A)"
              }}
            ></div>
          </div>
          <div className="mt-4 text-xs text-left text-gray-500">
            * Trạng thái hiện tại: <strong className={appStatus === "APPROVED" || appStatus === "ENROLLED" ? "text-green-600" : appStatus === "REJECTED" ? "text-red-500" : "text-blue-600"}>{STATUS_LABELS[appStatus]}</strong>
            {existingApp?.officerNotes && <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700"><strong>Nhận xét:</strong> {existingApp.officerNotes}</div>}
            {existingApp?.rejectionReason && <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 text-red-700"><strong>Lý do từ chối:</strong> {existingApp.rejectionReason}</div>}
          </div>
        </div>

        {/* Quick info card */}
        <div className="text-left text-sm space-y-3 max-w-xl mx-auto mb-8 p-6 bg-white rounded-xl border border-gray-100" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Mã hồ sơ:</span> <strong className="text-gray-800">{existingApp.applicationCode}</strong></div>
          <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Ngành học:</span> <strong className="text-gray-800">{existingApp.majorName}</strong></div>
          <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Cơ sở:</span> <strong className="text-gray-800">{existingApp.campusName}</strong></div>
          <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Phương thức:</span> <strong className="text-gray-800">{existingApp.methodName}</strong></div>
          <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Điểm xét tuyển:</span> <strong className="text-orange-600 font-bold">{existingApp.totalScore}</strong></div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={handleViewDetail} className="student-btn-primary" style={{ padding: "10px 24px", borderRadius: "10px" }}>
            Xem chi tiết hồ sơ
          </button>

          {requestStatus === "PENDING" ? (
            <button disabled className="px-5 py-2.5 bg-gray-100 text-gray-500 font-semibold rounded-xl cursor-not-allowed border border-gray-200">
              ⌛ Đang chờ duyệt tạo hồ sơ mới
            </button>
          ) : requestStatus === "REJECTED" ? (
            <div className="flex flex-col items-center gap-1">
              <button onClick={handleRequestNew} className="px-5 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-100 transition-colors">
                Yêu cầu lại tạo hồ sơ mới
              </button>
              <span className="text-xs text-red-500">* Yêu cầu trước bị từ chối</span>
            </div>
          ) : (
            <button onClick={handleRequestNew} className="px-5 py-2.5 bg-orange-50 text-orange-600 font-semibold rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors">
              Yêu cầu tạo hồ sơ mới
            </button>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal show={showDetailModal} onClose={() => setShowDetailModal(false)} appDetail={existingApp} loading={false} />
    </div>
  );
}
