import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine
} from "recharts";

const FORECAST_DATA = [
  { year: "2021", actual: 12000, predicted: null },
  { year: "2022", actual: 14500, predicted: null },
  { year: "2023", actual: 15000, predicted: null },
  { year: "2024", actual: 17000, predicted: null },
  { year: "2025", actual: 20000, predicted: 20000 },
  { year: "2026", actual: null, predicted: 22500 },
  { year: "2027", actual: null, predicted: 25200 },
  { year: "2028", actual: null, predicted: 28200 },
];

const ENROLLMENT_FORECAST = [
  { year: "2025", actual: 12000, predicted: 12000 },
  { year: "2026", actual: null, predicted: 14200 },
  { year: "2027", actual: null, predicted: 16000 },
  { year: "2028", actual: null, predicted: 18000 },
];

export default function ManagerForecast() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dự báo tuyển sinh</h1>
        <p className="text-gray-500 text-sm mt-1">Mô hình hồi quy tuyến tính + ARIMA dự báo 3 năm tới</p>
      </div>

      {/* Model Info */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Mô hình", value: "Linear Regression + ARIMA", icon: "📊" },
          { label: "Độ chính xác", value: "R² = 0.94", icon: "🎯" },
          { label: "Dự báo 2026", value: "22,500 hồ sơ", icon: "🔮" },
        ].map((item) => (
          <div key={item.label} className="card p-5 text-center">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className="font-bold text-gray-900">{item.value}</div>
            <div className="text-sm text-gray-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Application Forecast */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-gray-900">Dự báo số lượng hồ sơ (2021-2028)</h3>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg font-medium">Linear Regression</span>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={FORECAST_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v) => v?.toLocaleString() ?? "N/A"} />
              <Legend />
              <ReferenceLine x="2025" stroke="#D97706" strokeDasharray="5 5" label={{ value: "Hiện tại", fill: "#D97706", fontSize: 12 }} />
              <Line type="monotone" dataKey="actual" stroke="#7C3AED" strokeWidth={3} dot={{ r: 5 }} connectNulls={false} name="Thực tế" />
              <Line type="monotone" dataKey="predicted" stroke="#D97706" strokeWidth={2} strokeDasharray="8 4" dot={{ r: 4 }} connectNulls={false} name="Dự báo" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enrollment Forecast */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-gray-900">Dự báo tỷ lệ nhập học (2025-2028)</h3>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-medium">ARIMA Model</span>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ENROLLMENT_FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v) => v?.toLocaleString() ?? "N/A"} />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#059669" strokeWidth={3} dot={{ r: 5 }} name="Thực tế" />
              <Line type="monotone" dataKey="predicted" stroke="#2563EB" strokeWidth={2} strokeDasharray="8 4" dot={{ r: 4 }} name="Dự báo" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insight */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
        <h4 className="font-semibold text-purple-900 mb-3">💡 Nhận định từ mô hình</h4>
        <div className="space-y-2 text-sm text-purple-800">
          <p>• Xu hướng tăng trưởng ổn định ~12% mỗi năm trong 3 năm tới</p>
          <p>• Ngành CNTT tiếp tục dẫn đầu về nhu cầu tuyển sinh</p>
          <p>• Cơ sở TP.HCM và Hà Nội chiếm &gt;75% tổng hồ sơ</p>
          <p>• Khuyến nghị tăng chỉ tiêu 15% cho năm 2026 để đáp ứng nhu cầu</p>
        </div>
      </div>
    </div>
  );
}
