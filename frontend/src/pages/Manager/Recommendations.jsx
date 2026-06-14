import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

const RECOMMENDATIONS = [
  {
    priority: "HIGH",
    title: "Tăng chỉ tiêu ngành Trí tuệ nhân tạo",
    description: "Nhu cầu tăng 35% YoY. Đề xuất tăng 200 chỉ tiêu cho năm 2026 tại cơ sở Hà Nội và TP.HCM.",
    impact: "Tăng doanh thu ~5.6 tỷ VNĐ",
    icon: TrendingUp, color: "#7C3AED"
  },
  {
    priority: "HIGH",
    title: "Mở rộng tuyển sinh khu vực Miền Trung",
    description: "Thị phần miền Trung chỉ 16.5%. Đề xuất tăng cường hoạt động marketing tại Nghệ An, Huế, Đà Nẵng.",
    impact: "Tiềm năng 2,000 hồ sơ thêm",
    icon: TrendingUp, color: "#2563EB"
  },
  {
    priority: "MEDIUM",
    title: "Cải thiện tỷ lệ chuyển đổi Duyệt → Nhập học",
    description: "Tỷ lệ nhập học sau duyệt chỉ đạt 83%. Cần tư vấn proactive sau khi gửi kết quả.",
    impact: "Tăng 800 sinh viên nhập học",
    icon: CheckCircle, color: "#059669"
  },
  {
    priority: "MEDIUM",
    title: "Tối ưu quy trình xét duyệt hồ sơ",
    description: "Thời gian xét duyệt trung bình 8 ngày. Có thể rút ngắn xuống 5 ngày bằng tự động hóa.",
    impact: "Tăng trải nghiệm thí sinh",
    icon: Lightbulb, color: "#D97706"
  },
  {
    priority: "LOW",
    title: "Theo dõi xu hướng TikTok/Social Media",
    description: "Kênh TikTok đóng góp 12% hồ sơ trong Q1. Cần tăng ngân sách digital marketing.",
    impact: "Chi phí/chuyển đổi thấp hơn 40%",
    icon: AlertTriangle, color: "#6B7280"
  },
];

const PRIORITY_LABELS = { HIGH: "Ưu tiên cao", MEDIUM: "Ưu tiên vừa", LOW: "Ưu tiên thấp" };
const PRIORITY_COLORS = { HIGH: "bg-red-100 text-red-700", MEDIUM: "bg-yellow-100 text-yellow-700", LOW: "bg-gray-100 text-gray-700" };

export default function ManagerRecommendations() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đề xuất & Khuyến nghị</h1>
        <p className="text-gray-500 text-sm mt-1">AI-powered recommendations dựa trên phân tích dữ liệu tuyển sinh</p>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <Lightbulb size={20} />
          </div>
          <div>
            <div className="font-bold text-lg">AI Decision Support System</div>
            <div className="text-purple-200 text-sm">Phân tích 5 năm dữ liệu • Cập nhật hàng tuần</div>
          </div>
        </div>
        <p className="text-purple-100 text-sm">
          Hệ thống đã phân tích 78,500 hồ sơ lịch sử và đề xuất {RECOMMENDATIONS.length} khuyến nghị chiến lược.
        </p>
      </div>

      <div className="space-y-4">
        {RECOMMENDATIONS.map((rec, i) => (
          <div key={i} className="card p-6 hover:shadow-lg transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${rec.color}15` }}>
                <rec.icon size={22} style={{ color: rec.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-gray-900">{rec.title}</h3>
                  <span className={`badge flex-shrink-0 ${PRIORITY_COLORS[rec.priority]}`}>
                    {PRIORITY_LABELS[rec.priority]}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{rec.description}</p>
                <div className="mt-3 flex items-center gap-2">
                  <TrendingUp size={14} style={{ color: rec.color }} />
                  <span className="text-sm font-medium" style={{ color: rec.color }}>
                    Tác động: {rec.impact}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
