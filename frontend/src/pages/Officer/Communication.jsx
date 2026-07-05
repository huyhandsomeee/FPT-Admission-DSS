import {
  Send, Mail, Paperclip, Bold, Image,
  Clock, CheckCircle, ArrowUpRight, Eye,
  AlertCircle, ChevronRight, Sparkles
} from "lucide-react";
import { useState } from "react";

const CONTACT_HISTORY = [
  {
    name: "Nguyễn Văn Anh",
    subject: "Kết quả Tuyển sinh - Kỳ Thu 2024",
    preview: "Chào em, Chúc mừng em! Chúng tôi rất vui mừng thông báo em đã trúng tuyển vào...",
    time: "2 GIỜ TRƯỚC",
    tags: [{ label: "ĐÃ GỬI", bg: "#D1FAE5", color: "#065F46" }, { label: "ĐÃ MỞ", bg: "#DBEAFE", color: "#1D4ED8" }],
    dot: "#FF6B35"
  },
  {
    name: "Lê Thị Bình",
    subject: "Bổ sung hồ sơ: Bằng Tốt nghiệp THPT",
    preview: "Hồ sơ của em hiện chưa hoàn thiện. Vui lòng tải lên bản quét rõ nét của bằng tốt...",
    time: "HÔM QUA",
    tags: [{ label: "ĐÃ GỬI", bg: "#D1FAE5", color: "#065F46" }],
    dot: "#94A3B8"
  },
  {
    name: "Trần Minh Hoàng",
    subject: "Thư mời Phỏng vấn",
    preview: "Nhà trường trân trọng mời em tham dự buổi phỏng vấn trực tuyến vào lúc 09:00 sáng...",
    time: "12 TH10",
    tags: [{ label: "BỊ TRẢ LẠI", bg: "#FEE2E2", color: "#991B1B" }],
    dot: "#94A3B8"
  },
  {
    name: "Phạm Minh Tú",
    subject: "Thông báo Trao Học bổng",
    preview: "Tin vui! Em đã được trao Học bổng Tài năng FPT cho năm học 2024 sắp tới nhờ...",
    time: "11 TH10",
    tags: [{ label: "ĐÃ GỬI", bg: "#D1FAE5", color: "#065F46" }, { label: "ĐÃ MỞ", bg: "#DBEAFE", color: "#1D4ED8" }],
    dot: "#94A3B8"
  },
];

const TEMPLATES = [
  "Chọn mẫu thông báo...",
  "Thông báo trúng tuyển",
  "Yêu cầu bổ sung hồ sơ",
  "Thư mời phỏng vấn",
  "Thông báo học bổng",
  "Từ chối hồ sơ"
];

export default function OfficerCommunication() {
  const [form, setForm] = useState({ to: "", template: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ to: "", template: "", subject: "", message: "" });
  };

  const handleSaveDraft = () => {
    alert("Đã lưu bản nháp thành công!");
  };

  const stats = [
    { label: "Đã gửi hôm nay", value: "42", change: "↑12% so với hôm qua", changeColor: "#16A34A" },
    { label: "Tỷ lệ Mở thư", value: "84.2%", change: "↑5.4% trung bình", changeColor: "#16A34A" },
    { label: "Đợi Phản hồi", value: "08", change: "⚠ Cần xử lý ngay", changeColor: "#F59E0B" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: "#FF6B35" }}>
          Liên hệ Sinh viên
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748B" }}>
          Trao đổi với thí sinh và theo dõi lịch sử thông báo một cách hiệu quả.
        </p>
      </div>

      {sent && (
        <div style={{
          padding: "14px 20px", background: "#ECFDF5", border: "1px solid #A7F3D0",
          color: "#065F46", borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
          fontSize: 14, fontWeight: 600
        }}>
          <CheckCircle size={18} /> Đã gửi email thông báo thành công!
        </div>
      )}

      {/* Main content: Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, alignItems: "flex-start" }}>

        {/* Left: Compose form */}
        <div style={{
          background: "white", borderRadius: 16, padding: "24px",
          border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <Mail size={20} color="#1E293B" />
            <span style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Gửi Thông báo Mới</span>
          </div>

          <form onSubmit={handleSend}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                  Email Người nhận
                </label>
                <input
                  type="email"
                  value={form.to}
                  onChange={e => setForm({ ...form, to: e.target.value })}
                  placeholder="sinhvien@example.com"
                  required
                  style={{
                    width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0",
                    borderRadius: 10, fontSize: 13, color: "#475569", outline: "none",
                    transition: "border-color 0.2s", boxSizing: "border-box", fontFamily: "inherit"
                  }}
                  onFocus={e => e.target.style.borderColor = "#FF6B35"}
                  onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                  Mẫu Thông báo
                </label>
                <select
                  value={form.template}
                  onChange={e => setForm({ ...form, template: e.target.value })}
                  style={{
                    width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0",
                    borderRadius: 10, fontSize: 13, color: "#475569", outline: "none",
                    background: "white", cursor: "pointer", boxSizing: "border-box",
                    fontFamily: "inherit"
                  }}
                >
                  {TEMPLATES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                Tiêu đề
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                placeholder="VD: Cập nhật kết quả xét tuyển năm 2024"
                required
                style={{
                  width: "100%", padding: "10px 14px", border: "1px solid #E2E8F0",
                  borderRadius: 10, fontSize: 13, color: "#475569", outline: "none",
                  transition: "border-color 0.2s", boxSizing: "border-box", fontFamily: "inherit"
                }}
                onFocus={e => e.target.style.borderColor = "#FF6B35"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
                Nội dung Thông báo
              </label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Nhập nội dung tin nhắn tại đây..."
                required
                rows={8}
                style={{
                  width: "100%", padding: "14px", border: "1px solid #E2E8F0",
                  borderRadius: 10, fontSize: 13, color: "#475569", outline: "none",
                  resize: "none", transition: "border-color 0.2s", lineHeight: 1.6,
                  boxSizing: "border-box", fontFamily: "inherit"
                }}
                onFocus={e => e.target.style.borderColor = "#FF6B35"}
                onBlur={e => e.target.style.borderColor = "#E2E8F0"}
              />
            </div>

            {/* Toolbar + Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { icon: Paperclip, title: "Đính kèm" },
                  { icon: Bold, title: "In đậm" },
                  { icon: Image, title: "Chèn ảnh" },
                ].map((btn, i) => (
                  <button key={i} type="button" title={btn.title} style={{
                    width: 36, height: 36, borderRadius: 8, border: "1px solid #E2E8F0",
                    background: "white", color: "#64748B", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s"
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#F7F8FA"; e.currentTarget.style.color = "#1E293B"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "#64748B"; }}
                  >
                    <btn.icon size={16} />
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" onClick={handleSaveDraft} style={{
                  padding: "10px 20px", background: "white", border: "1px solid #E2E8F0",
                  borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569",
                  cursor: "pointer", transition: "all 0.15s"
                }}>
                  Lưu Bản nháp
                </button>
                <button type="submit" style={{
                  padding: "10px 24px",
                  background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                  border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600,
                  color: "white", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6,
                  boxShadow: "0 4px 12px rgba(255,107,53,0.3)",
                  transition: "all 0.2s"
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <Send size={14} /> Gửi Email
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right: Contact History */}
        <div style={{
          background: "white", borderRadius: 16, padding: "24px",
          border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#0F172A" }}>Lịch sử Liên lạc</span>
            <button style={{
              fontSize: 13, color: "#FF6B35", fontWeight: 600, background: "none",
              border: "none", cursor: "pointer"
            }}>
              Xem tất cả
            </button>
          </div>

          {/* Timeline */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {CONTACT_HISTORY.map((item, idx) => (
              <div key={idx} style={{
                position: "relative", paddingLeft: 24, paddingBottom: idx < CONTACT_HISTORY.length - 1 ? 24 : 0,
                borderLeft: idx < CONTACT_HISTORY.length - 1 ? "2px solid #E8ECF1" : "2px solid transparent",
                marginLeft: 6
              }}>
                {/* Dot */}
                <div style={{
                  position: "absolute", left: -5, top: 4,
                  width: 10, height: 10, borderRadius: "50%",
                  background: item.dot, border: "2px solid white",
                  boxShadow: "0 0 0 2px " + (item.dot === "#FF6B35" ? "rgba(255,107,53,0.2)" : "#E8ECF1")
                }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{item.name}</div>
                  <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.3px", whiteSpace: "nowrap" }}>
                    {item.time}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#FF6B35", marginBottom: 4 }}>
                  {item.subject}
                </div>
                <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 8px", lineHeight: 1.5 }}>
                  {item.preview}
                </p>
                <div style={{ display: "flex", gap: 6 }}>
                  {item.tags.map((tag, ti) => (
                    <span key={ti} style={{
                      fontSize: 10, fontWeight: 700, padding: "3px 8px",
                      borderRadius: 999, background: tag.bg, color: tag.color
                    }}>{tag.label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* AI tip */}
          <div style={{
            marginTop: 20, background: "#FFF7ED", borderRadius: 10,
            padding: "12px 14px", border: "1px solid #FED7AA",
            display: "flex", gap: 10, alignItems: "flex-start"
          }}>
            <Sparkles size={16} color="#FF6B35" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", marginBottom: 2 }}>Gợi ý chuyên gia:</div>
              <div style={{ fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>
                Cá nhân hóa email bằng tên thí sinh giúp tăng tỷ lệ phản hồi lên đến 35%.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {stats.map((stat, i) => (
          <div key={i} style={{
            background: "white", borderRadius: 14, padding: "18px 20px",
            border: "1px solid #F1F5F9", boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
          }}>
            <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500, marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#FF6B35", marginBottom: 4 }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: stat.changeColor, fontWeight: 600 }}>{stat.change}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
