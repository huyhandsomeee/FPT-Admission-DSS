import { TrendingUp, Map, CheckCircle, Clock, Sparkles, FileText, Users } from "lucide-react";

const RECOMMENDATIONS = [
  {
    priority: "HIGH",
    priorityLabel: "HIGH PRIORITY",
    priorityBg: "#FFF0F0",
    priorityColor: "#DC2626",
    title: "Tăng chỉ tiêu ngành AI",
    description: "Nhu cầu tăng 35% YoY. Đề xuất tăng 200 chỉ tiêu cho năm 2026 tại cơ sở Hà Nội và TP.HCM.",
    impact: "Tiềm năng doanh thu: ~5.6 tỷ VNĐ",
    impactIcon: FileText,
    impactColor: "#16A34A",
    icon: TrendingUp,
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
  },
  {
    priority: "HIGH",
    priorityLabel: "HIGH PRIORITY",
    priorityBg: "#FFF0F0",
    priorityColor: "#DC2626",
    title: "Mở rộng tuyển sinh khu vực Miền Trung",
    description: "Thị phần miền Trung chỉ 16.5%. Đề xuất tăng cường marketing tại Nghệ An, Huế và Đà Nẵng.",
    impact: "Tiềm năng: +2,000 hồ sơ",
    impactIcon: Users,
    impactColor: "#16A34A",
    icon: Map,
    iconBg: "#ECFDF5",
    iconColor: "#16A34A",
  },
  {
    priority: "MEDIUM",
    priorityLabel: "MEDIUM PRIORITY",
    priorityBg: "#FFFBEB",
    priorityColor: "#D97706",
    title: "Cải thiện tỷ lệ chuyển đổi (Duyệt → Nhập học)",
    description: "Tỷ lệ nhập học hiện tại là 83%. Cần tư vấn proactive sau khi duyệt hồ sơ.",
    impact: "Tiềm năng: +800 sinh viên nhập học",
    impactIcon: Users,
    impactColor: "#16A34A",
    icon: CheckCircle,
    iconBg: "#F5F3FF",
    iconColor: "#7C3AED",
  },
  {
    priority: "MEDIUM",
    priorityLabel: "MEDIUM PRIORITY",
    priorityBg: "#FFFBEB",
    priorityColor: "#D97706",
    title: "Tối ưu quy trình xét duyệt hồ sơ",
    description: "Thời gian xét duyệt trung bình 8 ngày. Đề xuất tự động hóa để rút ngắn xuống 5 ngày.",
    impact: "Hiệu quả: xử lý nhanh hơn 37.5%",
    impactIcon: Clock,
    impactColor: "#D97706",
    icon: Clock,
    iconBg: "#FFF7ED",
    iconColor: "#D97706",
  },
];

export default function ManagerRecommendations() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title */}
      <div>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 26, color: "#0F172A" }}>Đề xuất &amp; Khuyến nghị</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
          AI-powered recommendations dựa trên 5 năm dữ liệu phân tích tuyển sinh lịch sử.
        </p>
      </div>

      {/* AI Decision Support Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1a2e6e 0%, #1D4ED8 60%, #2563EB 100%)",
        borderRadius: 16, padding: "24px 28px",
        boxShadow: "0 4px 20px rgba(26,46,110,0.25)"
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          {/* Icon */}
          <div style={{
            width: 52, height: 52, background: "rgba(255,255,255,0.15)",
            borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <Sparkles size={24} color="white" />
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: "white", marginBottom: 6 }}>
              AI Decision Support System
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(180,210,255,0.9)" }}>
                <FileText size={12} /> Đang phân tích 78,500 hồ sơ lịch sử
              </span>
              <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(180,210,255,0.9)" }}>
                <Clock size={12} /> Cập nhật hàng tuần
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(210,230,255,0.85)", lineHeight: 1.6 }}>
              Hệ thống đã xử lý 78,500 hồ sơ và đề xuất {RECOMMENDATIONS.length} can thiệp chiến lược để tối ưu chu kỳ tuyển sinh 2026.
            </p>
          </div>
        </div>
      </div>

      {/* Recommendation cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {RECOMMENDATIONS.map((rec, i) => (
          <div key={i} style={{
            background: "white",
            borderRadius: 14,
            border: "1px solid #E8EDF5",
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            padding: "20px 24px",
            display: "flex", alignItems: "flex-start", gap: 16,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.05)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Icon */}
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              background: rec.iconBg, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <rec.icon size={20} color={rec.iconColor} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: "0 0 5px", fontWeight: 700, fontSize: 15, color: "#1a2e6e" }}>
                {rec.title}
              </h3>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#475569", lineHeight: 1.6 }}>
                {rec.description}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <rec.impactIcon size={13} color={rec.impactColor} />
                <span style={{ fontSize: 12, fontWeight: 600, color: rec.impactColor }}>
                  {rec.impact}
                </span>
              </div>
            </div>

            {/* Priority + Action */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.5px",
                background: rec.priorityBg, color: rec.priorityColor,
                padding: "4px 10px", borderRadius: 6,
                border: `1px solid ${rec.priorityColor}40`
              }}>
                {rec.priorityLabel}
              </span>
              <button style={{
                background: "none", border: "none", cursor: "pointer",
                color: "#1D4ED8", fontWeight: 700, fontSize: 13,
                padding: "4px 0",
                textDecoration: "none",
                display: "flex", alignItems: "center", gap: 3
              }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
