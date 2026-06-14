import { Lightbulb, ArrowRight } from "lucide-react";

const RECS = [
  { title: "Phê duyệt tăng chỉ tiêu AI 2026", priority: "CẦN QUYẾT ĐỊNH", detail: "Tăng 200 chỉ tiêu AI đáp ứng nhu cầu thị trường. Doanh thu tăng thêm ~5.6 tỷ VNĐ/năm.", color: "#7C3AED" },
  { title: "Đầu tư học bổng thu hút nhân tài miền Trung", priority: "CHIẾN LƯỢC DÀI HẠN", detail: "Ngân sách 2 tỷ VNĐ cho 50 học bổng toàn phần tại cơ sở Đà Nẵng.", color: "#2563EB" },
  { title: "Xây dựng chương trình alumni referral", priority: "KHUYẾN NGHỊ", detail: "Tận dụng mạng lưới 50,000+ cựu sinh viên để tuyển sinh. Chi phí thấp, hiệu quả cao.", color: "#059669" },
];

export default function BodRecommendations() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Đề xuất chiến lược</h1>
        <p className="text-gray-500 text-sm mt-1">Khuyến nghị từ ban phân tích và hệ thống AI</p>
      </div>
      {RECS.map((rec, i) => (
        <div key={i} className="card p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${rec.color}15` }}>
              <Lightbulb size={22} style={{ color: rec.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `${rec.color}20`, color: rec.color }}>{rec.priority}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg">{rec.title}</h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">{rec.detail}</p>
              <button className="mt-4 flex items-center gap-2 text-sm font-semibold" style={{ color: rec.color }}>
                Xem chi tiết <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
