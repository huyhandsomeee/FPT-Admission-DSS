import { AlertTriangle, Info, CheckCircle, TrendingDown } from "lucide-react";

const RISKS = [
  { level: "HIGH", title: "Tỷ lệ nhập học thấp hơn kỳ vọng", description: "Tỷ lệ nhập học 60% thấp hơn mục tiêu 75%. Cần can thiệp ngay.", action: "Tăng cường tư vấn hậu kết quả", icon: AlertTriangle, color: "#DC2626" },
  { level: "HIGH", title: "Cạnh tranh từ các trường ĐH khác", description: "RMIT, Hutech và một số trường tư thục đang tích cực tuyển sinh.", action: "Đẩy mạnh USP và học bổng", icon: TrendingDown, color: "#D97706" },
  { level: "MEDIUM", title: "Phụ thuộc cao vào Facebook Ads", description: "55% nguồn hồ sơ từ Facebook. Rủi ro nếu thuật toán thay đổi.", action: "Đa dạng hóa kênh marketing", icon: Info, color: "#2563EB" },
  { level: "LOW", title: "Thiếu hụt nhân viên tuyển sinh", description: "2 vị trí tuyển sinh cần tuyển dụng cho Q3.", action: "Đăng tuyển và đào tạo", icon: CheckCircle, color: "#059669" },
];

const LEVEL_COLORS = { HIGH: "bg-red-100 text-red-700 border-red-200", MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200", LOW: "bg-blue-100 text-blue-700 border-blue-200" };
const LEVEL_LABELS = { HIGH: "Rủi ro cao", MEDIUM: "Rủi ro vừa", LOW: "Rủi ro thấp" };

export default function RiskMonitor() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Giám sát rủi ro</h1>
        <p className="text-gray-500 text-sm mt-1">Theo dõi các rủi ro chiến lược tuyển sinh</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { level: "HIGH", count: 2, label: "Rủi ro cao", color: "#DC2626", bg: "#FEF2F2" },
          { level: "MEDIUM", count: 1, label: "Rủi ro vừa", color: "#D97706", bg: "#FFFBEB" },
          { level: "LOW", count: 1, label: "Rủi ro thấp", color: "#059669", bg: "#F0FDF4" },
        ].map((item) => (
          <div key={item.level} className="card p-5 text-center" style={{ background: item.bg, borderColor: item.color + "30" }}>
            <div className="text-4xl font-black" style={{ color: item.color }}>{item.count}</div>
            <div className="text-sm font-medium mt-1" style={{ color: item.color }}>{item.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {RISKS.map((risk, i) => (
          <div key={i} className={`card p-5 border-l-4`} style={{ borderLeftColor: risk.color }}>
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${risk.color}15` }}>
                <risk.icon size={22} style={{ color: risk.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-gray-900">{risk.title}</h3>
                  <span className={`badge border ${LEVEL_COLORS[risk.level]}`}>{LEVEL_LABELS[risk.level]}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{risk.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-400">ĐỀ XUẤT:</span>
                  <span className="text-sm font-medium" style={{ color: risk.color }}>{risk.action}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
