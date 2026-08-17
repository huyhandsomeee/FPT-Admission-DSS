import { useState } from "react";
import {
  Send, Users, Building2, Bell, AlertTriangle, CheckCircle2,
  Clock, ShieldAlert, Sparkles, MessageSquare, ArrowRight,
  Filter, Search, UserCheck, Layers, FileText
} from "lucide-react";

const DEPARTMENTS = [
  { id: "ALL", name: "Toàn bộ cán bộ trường (Toàn hệ thống)" },
  { id: "TS", name: "Phòng Tuyển Sinh & Hướng Nghiệp (24 cán bộ)" },
  { id: "DT", name: "Phòng Quản Lý Đào Tạo & Khảo Thí (18 cán bộ)" },
  { id: "TC", name: "Phòng Tài Chính - Kế Toán (12 cán bộ)" },
  { id: "CTSV", name: "Phòng Công Tác Sinh Viên & KTX (15 cán bộ)" },
  { id: "HR", name: "Phòng Tổ Chức & Quản Trị Nhân Sự (8 cán bộ)" },
  { id: "NCKH", name: "Viện Nghiên Cứu & Đổi Mới Sáng Tạo (10 cán bộ)" }
];

const STAFF_LIST = [
  { id: "EMP-001", name: "ThS. Đỗ Thị Thu Trang", role: "Trưởng phòng Tuyển sinh", dept: "TS", email: "trangdtt@fpt.edu.vn" },
  { id: "EMP-002", name: "TS. Trần Quốc Tuấn", role: "Trưởng phòng Đào tạo", dept: "DT", email: "tuantq@fpt.edu.vn" },
  { id: "EMP-003", name: "ThS. Nguyễn Văn Hùng", role: "Chuyên viên Tuyển sinh", dept: "TS", email: "hungnv@fpt.edu.vn" },
  { id: "EMP-004", name: "Phạm Minh Tú", role: "Kế toán trưởng", dept: "TC", email: "tupm@fpt.edu.vn" },
  { id: "EMP-005", name: "TS. Nguyễn Hải Đăng", role: "Trưởng Lab AI Quy Nhơn", dept: "NCKH", email: "dangnh@fpt.edu.vn" },
  { id: "EMP-006", name: "ThS. Hoàng Minh Đức", role: "Chuyên viên Khảo thí", dept: "DT", email: "duchm@fpt.edu.vn" }
];

const SENT_DIRECTIVES = [
  {
    id: "DIR-2026-089",
    title: "Chỉ thị đẩy mạnh tư vấn học bổng ngành Bán Dẫn và AI đợt bổ sung",
    target: "Phòng Tuyển Sinh & Hướng Nghiệp",
    type: "Chiến lược",
    priority: "HIGH",
    sender: "Hiệu Trưởng / Giám Đốc",
    sentAt: "17/08/2026 09:30",
    status: "Đang thực hiện",
    progress: "85%",
    feedback: "Đã phân công 6 tư vấn viên phụ trách trực tiếp nhóm thí sinh đạt giải HSG."
  },
  {
    id: "DIR-2026-088",
    title: "Yêu cầu rà soát và chuẩn hóa dữ liệu điểm thi học kỳ SU25 trước 20/08",
    target: "Phòng Quản Lý Đào Tạo & Khảo Thí",
    type: "Học vụ & DWH",
    priority: "URGENT",
    sender: "Phó Hiệu Trưởng Học Thuật",
    sentAt: "16/08/2026 14:15",
    status: "Hoàn tất",
    progress: "100%",
    feedback: "Tổ Khảo thí đã hoàn tất đối soát và đẩy dữ liệu lên FACT_LEARNING."
  },
  {
    id: "DIR-2026-087",
    title: "Triển khai gói hỗ trợ miễn giảm học phí cho SV vùng bão lũ SCL",
    target: "Phòng Tài Chính - Kế Toán & CTSV",
    type: "Chính sách",
    priority: "MEDIUM",
    sender: "Ban Giám Đốc",
    sentAt: "15/08/2026 11:00",
    status: "Đang thực hiện",
    progress: "60%",
    feedback: "Đã tiếp nhận 42 đơn, đang thẩm định hồ sơ cùng chính quyền địa phương."
  }
];

export default function DirectivesManager() {
  const [recipientType, setRecipientType] = useState("DEPT"); // DEPT or INDIVIDUAL
  const [selectedDept, setSelectedDept] = useState("TS");
  const [selectedStaff, setSelectedStaff] = useState("EMP-001");
  const [priority, setPriority] = useState("HIGH");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deadline, setDeadline] = useState("2026-08-25");
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendDirective = (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setSentSuccess(true);
    setTimeout(() => {
      setTitle("");
      setContent("");
      setSentSuccess(false);
    }, 2500);
  };

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #0F172A, #334155)",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(15,23,42,0.3)"
          }}>
            <Send size={24} color="#38BDF8" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>
              Giao Chỉ Thị & Điều Hành Cán Bộ (Executive Directives)
            </h1>
            <p style={{ fontSize: 13.5, color: "#64748B", margin: "2px 0 0" }}>
              Kênh điều hành trực tiếp từ Ban Giám Đốc tới từng Trưởng phòng ban và Cán bộ chuyên trách
            </p>
          </div>
        </div>

        <span style={{ fontSize: 12.5, fontWeight: 800, padding: "6px 14px", borderRadius: 100, background: "#DCFCE7", color: "#16A34A", border: "1px solid #86EFAC" }}>
          ● Kênh Điều Hành Mã Hóa An Toàn
        </span>
      </div>

      {/* Main Grid: Form Left, Sent History Right */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.5fr", gap: 24, alignItems: "start" }}>
        {/* Form: Soạn chỉ thị mới */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 26, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <Sparkles size={18} color="#FF6B35" />
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Soạn Chỉ Thị / Yêu Cầu Điều Hành</h3>
          </div>

          {sentSuccess && (
            <div style={{ padding: "12px 16px", borderRadius: 12, background: "#DCFCE7", border: "1px solid #86EFAC", color: "#16A34A", fontSize: 13.5, fontWeight: 700, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={18} /> Đã gửi chỉ thị thành công đến tài khoản cán bộ!
            </div>
          )}

          <form onSubmit={handleSendDirective} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Recipient Type */}
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Đối tượng nhận chỉ thị</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setRecipientType("DEPT")}
                  style={{
                    padding: "9px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                    background: recipientType === "DEPT" ? "#0F172A" : "#F1F5F9",
                    color: recipientType === "DEPT" ? "#fff" : "#475569"
                  }}
                >
                  🏢 Theo Phòng Ban
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientType("INDIVIDUAL")}
                  style={{
                    padding: "9px", borderRadius: 10, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                    background: recipientType === "INDIVIDUAL" ? "#0F172A" : "#F1F5F9",
                    color: recipientType === "INDIVIDUAL" ? "#fff" : "#475569"
                  }}
                >
                  👤 Đích danh Cán bộ
                </button>
              </div>
            </div>

            {/* Target Select */}
            {recipientType === "DEPT" ? (
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Chọn phòng ban tiếp nhận *</label>
                <select
                  value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 13.5, background: "#fff" }}
                >
                  {DEPARTMENTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            ) : (
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Chọn cán bộ nhận chỉ đạo *</label>
                <select
                  value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 13.5, background: "#fff" }}
                >
                  {STAFF_LIST.map(s => <option key={s.id} value={s.id}>{s.name} ({s.role}) - {s.email}</option>)}
                </select>
              </div>
            )}

            {/* Priority & Deadline */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Mức độ ưu tiên</label>
                <select
                  value={priority} onChange={e => setPriority(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 13.5, background: "#fff" }}
                >
                  <option value="URGENT">🔴 Khẩn cấp (Xử lý ngay)</option>
                  <option value="HIGH">🟠 Cao (Trong 24h)</option>
                  <option value="MEDIUM">🔵 Bình thường</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Thời hạn báo cáo (SLA)</label>
                <input
                  type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 13.5, boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Tiêu đề chỉ thị / Yêu cầu *</label>
              <input
                type="text" required placeholder="VD: Đẩy nhanh rà soát hồ sơ xét tuyển ngành Bán Dẫn..."
                value={title} onChange={e => setTitle(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 13.5, boxSizing: "border-box" }}
              />
            </div>

            {/* Content */}
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Nội dung chỉ đạo & Yêu cầu hành động *</label>
              <textarea
                required rows={4} placeholder="Nhập chi tiết các chỉ đạo chiến lược, mốc thời gian và yêu cầu báo cáo kết quả..."
                value={content} onChange={e => setContent(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 13.5, boxSizing: "border-box", resize: "vertical" }}
              />
            </div>

            <button
              type="submit"
              style={{
                padding: "12px", borderRadius: 12, background: "linear-gradient(135deg, #0F172A, #1E293B)",
                color: "#fff", border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              <Send size={16} color="#38BDF8" /> Phát Lệnh Chỉ Đạo & Gửi Thông Báo
            </button>
          </form>
        </div>

        {/* History: Danh sách chỉ thị đã phát */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 26, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Lịch Sử Chỉ Đạo & Tiến Độ Xử Lý</h3>
              <p style={{ fontSize: 12.5, color: "#64748B", margin: "2px 0 0" }}>Theo dõi phản hồi và mức độ hoàn thành của các phòng ban</p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", background: "#EFF6FF", padding: "4px 10px", borderRadius: 100 }}>
              3 Chỉ thị gần nhất
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SENT_DIRECTIVES.map((item, idx) => (
              <div key={idx} style={{ padding: "16px 18px", borderRadius: 14, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#2563EB", background: "#EFF6FF", padding: "2px 6px", borderRadius: 4, marginRight: 6 }}>
                      {item.id}
                    </span>
                    <strong style={{ fontSize: 14, color: "#0F172A" }}>{item.title}</strong>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 4,
                    background: item.priority === "URGENT" ? "#FEE2E2" : item.priority === "HIGH" ? "#FEF3C7" : "#E0F2FE",
                    color: item.priority === "URGENT" ? "#DC2626" : item.priority === "HIGH" ? "#D97706" : "#0284C7"
                  }}>
                    {item.priority}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#475569", margin: "6px 0 8px" }}>
                  <span>Tiếp nhận: <strong>{item.target}</strong></span>
                  <span style={{ color: "#94A3B8" }}>{item.sentAt}</span>
                </div>

                {/* Feedback Box */}
                <div style={{ padding: "10px 12px", background: "#fff", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12.5, color: "#334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, color: "#16A34A" }}>💬 Báo cáo từ đơn vị ({item.progress}):</span>
                    <span style={{ fontWeight: 700, color: item.status === "Hoàn tất" ? "#16A34A" : "#D97706" }}>{item.status}</span>
                  </div>
                  <div style={{ color: "#64748B", fontStyle: "italic" }}>"{item.feedback}"</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
