import { useState } from "react";
import {
  BookOpen, CheckCircle2, Clock, AlertCircle, FileText,
  Search, Filter, Download, Plus, Calendar, GraduationCap,
  Award, ShieldCheck, Check, X, Users, RefreshCw
} from "lucide-react";

export default function AcademicOfficerPortal() {
  const [activeTab, setActiveTab] = useState("overview"); // overview | gradebook | appeals | courses

  const [selectedAppeal, setSelectedAppeal] = useState({
    id: "PK-SU25-042",
    student: "Đặng Thị Phương",
    code: "SE1715",
    subject: "MAE101 - Toán kỹ thuật",
    currentScore: "6.5",
    expectedScore: "8.0",
    reason: "Em đối chiếu với barem đáp án thấy câu 3 và câu 4 làm đúng hoàn toàn nhưng bị chấm thiếu 1.5 điểm.",
    status: "Chờ phân công GV",
    lecturer: "Chưa chỉ định",
    examDate: "10/07/2026"
  });

  const appealList = [
    { id: "PK-SU25-042", student: "Đặng Thị Phương", code: "SE1715", subject: "MAE101 - Toán kỹ thuật", score: "6.5", status: "Chờ phân công GV", color: "#D97706", bg: "#FEF3C7" },
    { id: "PK-SU25-041", student: "Nguyễn Văn Hùng", code: "SE1712", subject: "PRF192 - C Programming", score: "7.0", status: "Đang chấm lại", color: "#2563EB", bg: "#DBEAFE" },
    { id: "PK-SU25-040", student: "Lê Thị Mai", code: "KD1720", subject: "MKT101 - Marketing căn bản", score: "8.0", status: "Đã có kết quả (8.5)", color: "#16A34A", bg: "#DCFCE7" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Sub Sidebar */}
      <div style={{ width: 240, background: "#fff", borderRight: "1px solid #E2E8F0", padding: "24px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingLeft: 6 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16 }}>
              ĐT
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#1E3A8A", lineHeight: 1.1 }}>FPT Academic</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Staff Portal</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { key: "overview", label: "Overview", icon: BookOpen },
              { key: "gradebook", label: "Sổ Điểm & Học Phần", icon: FileText },
              { key: "appeals", label: "Xử Lý Phúc Khảo", icon: Clock },
              { key: "courses", label: "Thời Khóa Biểu (FAP)", icon: Calendar }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                  display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  background: activeTab === tab.key ? "#60A5FA" : "transparent",
                  color: activeTab === tab.key ? "#fff" : "#475569"
                }}
              >
                <tab.icon size={17} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#2563EB", fontSize: 12 }}>
              ĐT
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Cán Bộ Đào Tạo</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Academic Affairs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1E3A8A" }}>
            Academic Management • FACT_LEARNING
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Quản lý Học vụ & Khảo thí</h1>
              <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0" }}>Tổng hợp kết quả học tập kỳ Hè 2026 & Kế hoạch học kỳ Fall 2026</p>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "none", background: "#2563EB", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              <Download size={15} /> Xuất Báo Cáo Học Vụ
            </button>
          </div>

          {/* 3 KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 28 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Sinh Viên Đang Học</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", marginTop: 6 }}>38,520</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>89.2% Tỷ lệ qua môn</div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Lớp Học Phần Đã Xếp</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", marginTop: 6 }}>1,480 Lớp</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginTop: 4 }}>100% Hoàn tất TKB Fall 2026</div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Đơn Phúc Khảo Kỳ Này</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", marginTop: 6 }}>19 Đơn</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#D97706", marginTop: 4 }}>Đang giải quyết 16 đơn</div>
            </div>
          </div>

          {/* Appeals Table & Detail Review */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }}>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
                Danh Sách Đơn Phúc Khảo Bài Thi
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>MÃ ĐƠN</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>SINH VIÊN</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>HỌC PHẦN</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>ĐIỂM CŨ</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  {appealList.map((app, idx) => (
                    <tr
                      key={idx}
                      onClick={() => setSelectedAppeal(app)}
                      style={{ borderBottom: "1px solid #F1F5F9", cursor: "pointer", background: selectedAppeal.id === app.id ? "#EFF6FF" : "#fff" }}
                    >
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>{app.id}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0F172A" }}>{app.student}</td>
                      <td style={{ padding: "12px 14px", color: "#475569" }}>{app.subject}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 800, color: "#DC2626" }}>{app.score}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: app.bg, color: app.color }}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Appeal Detail Box */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: 0 }}>Chi Tiết Đơn Phúc Khảo</h3>
                <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 800, color: "#2563EB" }}>{selectedAppeal.id}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, borderBottom: "1px solid #F1F5F9", paddingBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Sinh viên:</span>
                  <strong style={{ color: "#0F172A" }}>{selectedAppeal.student} ({selectedAppeal.code})</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Môn học:</span>
                  <strong style={{ color: "#0F172A" }}>{selectedAppeal.subject}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Điểm đã công bố:</span>
                  <span style={{ color: "#DC2626", fontWeight: 800 }}>{selectedAppeal.score} / 10</span>
                </div>
                <div style={{ padding: "10px", background: "#F8FAFC", borderRadius: 8, fontSize: 12, color: "#334155", fontStyle: "italic" }}>
                  "{selectedAppeal.reason}"
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
                <button style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  Bác bỏ đơn
                </button>
                <button style={{ padding: "10px", borderRadius: 8, background: "#2563EB", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  Phân công Chấm lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
