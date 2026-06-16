import { useState } from "react";
import { TrendingUp, BarChart2, CheckCircle, Send } from "lucide-react";

// Recommendation detail page matching image 4
export default function BodRecommendations() {
  const [message, setMessage] = useState("");

  const BOARD_MESSAGES = [
    {
      name: "TS. Nguyễn Văn A",
      time: "10:12 AM",
      text: "Tôi lo ngại về đội ngũ giảng viên. Chúng ta đã có kế hoạch thu hút chuyên gia AI từ nước ngoài chưa?",
      initials: "A",
      color: "#1D4ED8",
    },
    {
      name: "Ths. Lê Thị B",
      time: "10:17 AM",
      text: "Mức đầu tư 12 tỷ cho Infrastructure là hợp lý. Tôi có thể tận dụng hạ tầng Cloud của FPT Smart Cloud để tiết kiệm chi phí.",
      initials: "B",
      color: "#16A34A",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Breadcrumb + Title */}
      <div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>
          <span style={{ color: "#64748B" }}>Chiến lược</span>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#FF6B35", fontWeight: 600 }}>Đào tạo AI</span>
        </div>
        <h1 style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 22, color: "#0F172A" }}>
          Phê duyệt tăng chỉ tiêu AI 2026
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 11, fontWeight: 700, background: "#FEE2E2", color: "#DC2626", padding: "3px 9px", borderRadius: 5, border: "1px solid #FCA5A5" }}>
            ✕ Cần quyết định
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, background: "#FFF7ED", color: "#D97706", padding: "3px 9px", borderRadius: 5, border: "1px solid #FCD34D" }}>
            ❗ Mức độ: Cao
          </span>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "9px 18px", background: "white", border: "1px solid #E2E8F0", borderRadius: 9, color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Yêu cầu điều chỉnh
          </button>
          <button style={{ padding: "9px 18px", background: "white", border: "1px solid #E2E8F0", borderRadius: 9, color: "#DC2626", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Từ chối
          </button>
          <button style={{ padding: "9px 18px", background: "#FF6B35", border: "none", borderRadius: 9, color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", boxShadow: "0 2px 8px rgba(255,107,53,0.3)" }}>
            Phê duyệt
          </button>
        </div>
      </div>

      {/* Main 3-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Tổng quan đề xuất */}
        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <BarChart2 size={15} color="#64748B" />
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#1E293B" }}>Tổng quan đề xuất</h3>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.3px", marginBottom: 5 }}>Vấn đề &amp; Bối cảnh</div>
            <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.7 }}>
              Hiện tại, nguồn cung nhân lực AI tại Việt Nam đang thiếu nghiêm trọng. Với tốc độ phát triển của hệ sinh thái FPT, nhu cầu tuyển dụng kỹ sư AI dự kiến tăng gấp 3 lần trong giai đoạn 2025-2028. Các đối thủ cạnh tranh đang mở rộng quy mô đào tạo nhanh chóng.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.3px", marginBottom: 8 }}>Mục tiêu chiến lược</div>
            {[
              "Nâng chỉ tiêu tuyển sinh ngành AI lên 1,500 sinh viên/năm.",
              "Tăng tỷ lệ việc làm sinh viên AI tại các Big Tech lên 25%.",
              "Xác lập vị thế dẫn đầu trong đào tạo AI ứng dụng tại khu vực.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 7 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0d1b3e", marginTop: 5, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Forecast */}
        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "2px solid #16A34A", boxShadow: "0 4px 16px rgba(22,163,74,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 32, height: 32, background: "#ECFDF5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={16} color="#16A34A" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#1E293B" }}>AI Forecast</span>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, background: "#DCFCE7", color: "#16A34A", padding: "3px 8px", borderRadius: 5, letterSpacing: "0.5px" }}>LIVE</span>
          </div>
          <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>
            Dự báo doanh thu tiềm năng từ việc mở rộng quy mô đào tạo và dịch vụ R&D:
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#16A34A", lineHeight: 1, marginBottom: 8 }}>~5.6 tỷ VNĐ/năm</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 16 }}>DỰ BÁO DOANH THU</div>

          {/* Confidence bar */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>Độ tin cậy dự báo</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A" }}>92.4%</span>
            </div>
            <div style={{ width: "100%", height: 5, background: "#F1F5F9", borderRadius: 99 }}>
              <div style={{ width: "92.4%", height: "100%", background: "#16A34A", borderRadius: 99 }} />
            </div>
          </div>
        </div>

        {/* Risk assessment */}
        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "2px solid #FF6B35", boxShadow: "0 4px 16px rgba(255,107,53,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 32, height: 32, background: "#FFF7ED", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#1E293B" }}>Đánh giá rủi ro &amp; Thách thức</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, background: "#FFF7ED", color: "#D97706", padding: "3px 8px", borderRadius: 5 }}>Trung bình</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ padding: "10px 12px", background: "#FFF7ED", borderRadius: 9, borderLeft: "3px solid #FF6B35" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#D97706", marginBottom: 4 }}>Thiếu hụt giảng viên chuyên môn</div>
              <div style={{ fontSize: 11, color: "#92400E", lineHeight: 1.5 }}>Giải pháp: Hợp tác với chuyên gia AI nước ngoài và đào tạo nội bộ cấp tốc.</div>
            </div>
            <div style={{ padding: "10px 12px", background: "#FFF7ED", borderRadius: 9, borderLeft: "3px solid #FF6B35" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#D97706", marginBottom: 4 }}>Biến động thị trường</div>
              <div style={{ fontSize: 11, color: "#92400E", lineHeight: 1.5 }}>Giải pháp: Theo dõi sát báo cáo quý và điều chỉnh linh hoạt chỉ tiêu.</div>
            </div>
          </div>

          {/* Risk score */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: "#64748B" }}>Chỉ số rủi ro tổng hợp</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#D97706" }}>45%</span>
            </div>
            <div style={{ width: "100%", height: 5, background: "#F1F5F9", borderRadius: 99 }}>
              <div style={{ width: "45%", height: "100%", background: "linear-gradient(90deg, #FF6B35, #D97706)", borderRadius: 99 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Evidence + roadmap */}
      <div style={{ background: "white", borderRadius: 14, padding: 22, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <BarChart2 size={15} color="#64748B" />
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1E293B" }}>Chứng minh tính khả thi</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {[
            { label: "NHU CẦU NHÂN LỰC AI", value: "+45%", sub: "Hàng năm", desc: "Tỷ lệ chọi", descValue: "1:8.4", color: "#1D4ED8", barPct: 65 },
            { label: "TỶ LỆ HỒ SƠ QUAN TÂM", value: "12.5k", sub: "Đăng ký/Năm", desc: "Tỷ lệ chọi", descValue: "1:8.4", color: "#16A34A", barPct: 80 },
            { label: "CÔNG SUẤT CƠ HẠ TẦNG", value: "85%", sub: "Đã tối ưu", desc: "Cần bổ sung 3 phòng Lab GPU thế hệ mới để đáp ứng quy mô 2026.", color: "#D97706", barPct: 85 },
          ].map((stat, i) => (
            <div key={i} style={{ padding: "14px 0", borderRight: i < 2 ? "1px solid #F1F5F9" : "none", paddingRight: i < 2 ? 20 : 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.4px", marginBottom: 6 }}>{stat.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: stat.color }}>{stat.value}</span>
                <span style={{ fontSize: 11, color: "#64748B", display: "flex", alignItems: "center", gap: 3 }}>
                  {i === 0 && <TrendingUp size={11} color={stat.color} />}
                  {i === 1 && <CheckCircle size={11} color={stat.color} />}
                  {stat.sub}
                </span>
              </div>
              {i < 2 && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#64748B" }}>{stat.desc}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: stat.color }}>{stat.descValue}</span>
                  </div>
                  <div style={{ width: "100%", height: 5, background: "#F1F5F9", borderRadius: 99 }}>
                    <div style={{ width: `${stat.barPct}%`, height: "100%", background: stat.color, borderRadius: 99 }} />
                  </div>
                </>
              )}
              {i === 2 && <p style={{ margin: 0, fontSize: 11, color: "#64748B", lineHeight: 1.6 }}>{stat.desc}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: Roadmap + Board chat */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Roadmap */}
        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <BarChart2 size={15} color="#64748B" />
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1E293B" }}>Lộ trình triển khai &amp; Nguồn lực</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                phase: 1, title: "Chuẩn bị cơ sở hạ tầng (Q1/2025)",
                desc: "Mua sắm thiết bị GPU, thiết kế lại chương trình AI nâng cao.",
                budget: "Ngân sách dự toán: 12 tỷ VNĐ",
                active: true,
              },
              {
                phase: 2, title: "Truyền thông & Tuyển sinh (Q2/2025)",
                desc: "Chiến dịch FPT Pioneer thu hút học sinh giỏi từ các trường chuyên.",
                budget: "Nhân sự: 15 chuyên viên Marketing",
                active: false,
              },
              {
                phase: 3, title: "Triển khai đào tạo khóa I (Q3/2026)",
                desc: "Chính thức áp dụng chỉ tiêu mới với 1,500 sinh viên.",
                active: false, future: true,
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: item.active ? "#FF6B35" : item.future ? "#F1F5F9" : "#E2E8F0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: item.active ? "white" : "#94A3B8",
                  fontWeight: 700, fontSize: 12
                }}>
                  {item.active ? item.phase : item.phase}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1E293B", marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, marginBottom: item.budget ? 4 : 0 }}>{item.desc}</div>
                  {item.budget && <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{item.budget}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Board chat */}
        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Send size={15} color="#64748B" />
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1E293B" }}>Theo luận Ban Giám hiệu</h3>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
            {BOARD_MESSAGES.map((msg, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: msg.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                    {msg.initials}
                  </div>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{msg.name}</span>
                    <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 8 }}>{msg.time}</span>
                  </div>
                </div>
                <div style={{ marginLeft: 38, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{msg.text}</div>
              </div>
            ))}
          </div>
          {/* Input */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #F1F5F9", paddingTop: 14 }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Nhập ý kiến của bạn..."
              style={{ flex: 1, border: "1px solid #E2E8F0", borderRadius: 9, padding: "8px 12px", fontSize: 13, outline: "none", color: "#475569" }}
            />
            <button onClick={() => setMessage("")} style={{ width: 34, height: 34, background: "#FF6B35", border: "none", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Send size={15} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
