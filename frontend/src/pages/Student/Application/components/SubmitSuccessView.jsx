import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function SubmitSuccessView() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Nộp hồ sơ thành công!</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          Hồ sơ tuyển sinh của bạn đã được lưu và đồng bộ sang trang quản trị của cán bộ tuyển sinh. Chúng tôi sẽ phản hồi sớm nhất!
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/student/applications")} className="btn btn-primary">
            Xem hồ sơ của tôi
          </button>
          <button onClick={() => navigate("/student/dashboard")} className="btn btn-ghost">
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
