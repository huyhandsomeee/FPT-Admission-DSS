import { AlertTriangle, TrendingDown, Share2, Users, Filter, Plus, Calendar } from "lucide-react";

const RISK_SUMMARY = [
  { count: 2, label: "RỦI RO CAO", badge: "CRITICAL", bg: "#FEF2F2", color: "#DC2626", badgeBg: "#FEE2E2", barColor: "#DC2626", barPct: 80 },
  { count: 1, label: "RỦI RO VỪA", badge: "MEDIUM", bg: "#FFFBEB", color: "#D97706", badgeBg: "#FEF3C7", barColor: "#D97706", barPct: 40 },
  { count: 1, label: "RỦI RO THẤP", badge: "STABLE", bg: "#F0FDF4", color: "#16A34A", badgeBg: "#DCFCE7", barColor: "#16A34A", barPct: 20 },
];

const RISKS = [
  {
    level: "HIGH", levelLabel: "Rủi ro cao",
    levelBg: "#FEE2E2", levelColor: "#DC2626",
    title: "Tỷ lệ nhập học thấp hơn kỳ vọng",
    description: "Tỷ lệ nhập học hiện tại đạt 60%, thấp hơn mục tiêu đã ra là 75%. Sự sụt giảm tập trung ở các khối ngành kỹ thuật. Cần can thiệp ngay để đảm bảo báo cáo báo cáo chỉ tiêu năm học.",
    suggestion: "Tăng cường tư vấn hậu kết quả và tổ chức Workshop trải nghiệm thực tế cho thí sinh.",
    suggestionColor: "#16A34A",
    icon: AlertTriangle, iconBg: "#FEF2F2", iconColor: "#DC2626",
  },
  {
    level: "HIGH", levelLabel: "Rủi ro cao",
    levelBg: "#FEE2E2", levelColor: "#DC2626",
    title: "Cạnh tranh từ các trường ĐH khác",
    description: "RMIT, Hutech và một số trường tư thục đang tích cực tuyển sinh, mở các gói học bổng hấp dẫn và truyền thông mạnh mẽ. ảnh hưởng trực tiếp đến tập thí sinh tiềm năng của FPT.",
    suggestion: "Đẩy mạnh USP với cơ hội việc làm toàn cầu và Học bổng tài năng 100%.",
    suggestionColor: "#2563EB",
    icon: TrendingDown, iconBg: "#FEF2F2", iconColor: "#DC2626",
  },
  {
    level: "MEDIUM", levelLabel: "Rủi ro vừa",
    levelBg: "#FEF3C7", levelColor: "#D97706",
    title: "Phụ thuộc cao vào Facebook Ads",
    description: "55% nguồn hồ sơ đến từ kênh Facebook. Đây là rủi ro lớn nếu thuật toán thay đổi hoặc chi phí CPM tăng đột ngột trong giai đoạn cao điểm tuyển sinh.",
    suggestion: "Đa dạng hóa kênh marketing sang LinkedIn (B2B), TikTok và đẩy mạnh SEO content.",
    suggestionColor: "#D97706",
    icon: Share2, iconBg: "#FFFBEB", iconColor: "#D97706",
  },
  {
    level: "LOW", levelLabel: "Rủi ro thấp",
    levelBg: "#DCFCE7", levelColor: "#16A34A",
    title: "Thiếu hụt nhân viên tuyển sinh",
    description: "Hiện còn 2 vị trí nhân viên tuyển sinh cần tuyển dụng bổ sung cho Q3. Tuy nhiên, đội ngũ hiện tại vẫn đang xử lý tốt khối lượng công việc.",
    suggestion: "Tiến hành phỏng vấn khẩn cấp và triển khai chương trình đào tạo nhân viên thực tập.",
    suggestionColor: "#16A34A",
    icon: Users, iconBg: "#F0FDF4", iconColor: "#16A34A",
  },
];

export default function RiskMonitor() {
  const [selectedRisk, setSelectedRisk] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 26, color: "#0F172A" }}>Giám sát rủi ro</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
            Theo dõi các rủi ro chiến lược tuyển sinh trong quý hiện tại để đưa ra quyết định kịp thời.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 7, background: "white", border: "1px solid #E2E8F0", borderRadius: 9, padding: "8px 14px", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <Filter size={14} /> Lọc rủi ro
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 7, background: "#0d1b3e", border: "none", borderRadius: 9, padding: "8px 14px", color: "white", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <Plus size={14} /> Thêm rủi ro mới
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {RISK_SUMMARY.map((item) => (
          <div key={item.label} style={{
            background: "white", borderRadius: 14, padding: "20px 22px",
            border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, background: item.bg, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={18} color={item.color} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", background: item.badgeBg, color: item.color, padding: "3px 8px", borderRadius: 5 }}>
                {item.badge}
              </span>
            </div>
            <div style={{ fontSize: 40, fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.count}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: item.color, letterSpacing: "0.4px", marginTop: 4, marginBottom: 10 }}>{item.label}</div>
            <div style={{ width: "100%", height: 4, background: "#F1F5F9", borderRadius: 99 }}>
              <div style={{ width: `${item.barPct}%`, height: "100%", background: item.barColor, borderRadius: 99 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Detail list */}
      <div>
        <h3 style={{ margin: "0 0 14px", fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Chi tiết các hạng mục</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {RISKS.map((risk, i) => (
            <div key={i} style={{
              background: "white", borderRadius: 14, padding: "20px 22px",
              border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              display: "flex", alignItems: "flex-start", gap: 16,
              transition: "all 0.2s"
            }}>
              {/* Icon */}
              <div style={{ width: 42, height: 42, background: risk.iconBg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <risk.icon size={20} color={risk.iconColor} />
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1E293B" }}>{risk.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", background: risk.levelBg, color: risk.levelColor, padding: "3px 9px", borderRadius: 5, flexShrink: 0 }}>
                      {risk.levelLabel}
                    </span>
                    <button 
                      onClick={() => setSelectedRisk(risk)}
                      style={{
                        background: "none", border: "none", color: "#2563EB", fontWeight: 700, fontSize: 12, cursor: "pointer", padding: "2px 6px"
                      }}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{risk.description}</p>
                <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "8px 12px" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.3px" }}>ĐỀ XUẤT: </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: risk.suggestionColor }}>{risk.suggestion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Chiến lược ứng phó */}
        <div style={{ background: "#0d1b3e", borderRadius: 16, padding: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: 20, top: 20, fontSize: 60, opacity: 0.12 }}>🚀</div>
          <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,107,53,0.25)", color: "#FF6B35", padding: "3px 9px", borderRadius: 5, letterSpacing: "0.5px", border: "1px solid rgba(255,107,53,0.4)" }}>
            STRATEGIC PLAN
          </span>
          <h3 style={{ margin: "12px 0 10px", fontWeight: 800, fontSize: 20, color: "white", lineHeight: 1.3 }}>
            Chiến lược Ứng phó<br />Tổng thể
          </h3>
          <p style={{ margin: "0 0 20px", fontSize: 13, color: "rgba(200,220,255,0.8)", lineHeight: 1.6 }}>
            Ban Giám hiệu cần phê duyệt ngân sách bổ sung cho chiến dịch "Mùa hè Công nghệ" để thu hút tập thí sinh đang bị phân tán bởi các đối thủ cạnh tranh.
          </p>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
            border: "none", borderRadius: 10, padding: "10px 18px",
            color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer"
          }}>
            Phê duyệt đề xuất ngay →
          </button>
        </div>

        {/* Khẩn cấp */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#DC2626" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}>KHẨN CẤP</span>
          </div>
          <h3 style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 16, color: "#1E293B", lineHeight: 1.4 }}>
            Cuộc họp khẩn cấp HĐQT sẽ diễn ra vào sáng mai lúc 09:00.
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, marginTop: 12 }}>
            <Calendar size={16} color="#64748B" />
            <div>
              <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600 }}>NGÀY DIỄN RA</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>24 tháng 05, 2024</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "12px 0", borderTop: "1px solid #F1F5F9" }}>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>
          © 2024 FPT University Executive Portal. Developed for Academic Management Excellence.
        </span>
        <span style={{ fontSize: 12, color: "#94A3B8", margin: "0 16px" }}>•</span>
        <a href="#" style={{ fontSize: 12, color: "#64748B", textDecoration: "none" }}>Chính sách bảo mật</a>
        <span style={{ fontSize: 12, color: "#94A3B8", margin: "0 10px" }}>•</span>
        <a href="#" style={{ fontSize: 12, color: "#64748B", textDecoration: "none" }}>Điều khoản sử dụng</a>
        <span style={{ fontSize: 12, color: "#94A3B8", margin: "0 10px" }}>•</span>
        <a href="#" style={{ fontSize: 12, color: "#64748B", textDecoration: "none" }}>Hỗ trợ kỹ thuật</a>
      </div>

      {selectedRisk && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: "white", borderRadius: 16, maxWidth: 500, width: "100%",
            padding: 24, boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            position: "relative"
          }}>
            <h3 style={{ margin: "0 0 10px", fontWeight: 800, fontSize: 18, color: selectedRisk.levelColor || "#DC2626" }}>
              {selectedRisk.title}
            </h3>
            <span style={{
              fontSize: 10, fontWeight: 700, background: selectedRisk.levelBg || "#FEF2F2", color: selectedRisk.levelColor || "#DC2626",
              padding: "3px 8px", borderRadius: 5, display: "inline-block", marginBottom: 14
            }}>
              MỨC ĐỘ: {selectedRisk.levelLabel || "N/A"}
            </span>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 16 }}>
              <strong>Mô tả chi tiết rủi ro:</strong>
              <p style={{ margin: "6px 0 0" }}>{selectedRisk.description}</p>
            </div>
            <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 20, background: "#F8FAFC", padding: 12, borderRadius: 10 }}>
              <strong>Giải pháp ứng phó được đề xuất:</strong>
              <p style={{ margin: "6px 0 0", color: selectedRisk.suggestionColor || "#1D4ED8" }}>{selectedRisk.suggestion}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button 
                onClick={() => setSelectedRisk(null)}
                style={{
                  padding: "8px 16px", background: "white", border: "1px solid #CBD5E1",
                  borderRadius: 8, color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer"
                }}>
                Đóng lại
              </button>
              <button 
                onClick={() => { alert(`Đã kích hoạt giải pháp ứng phó: ${selectedRisk.suggestion}`); setSelectedRisk(null); }}
                style={{
                  padding: "8px 16px", background: selectedRisk.levelColor || "#FF6B35", border: "none",
                  borderRadius: 8, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  boxShadow: `0 2px 8px rgba(0,0,0,0.1)`
                }}>
                Kích hoạt ứng phó
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
