import { useState } from "react";
import {
  Users, UserCheck, CheckCircle2, Clock, XCircle, FileText,
  Search, Filter, Download, Plus, ArrowRight, Eye, ShieldCheck,
  Send, Award, Calendar, Check, X, Sparkles, Mail, Phone
} from "lucide-react";

export default function AdmissionOfficerPortal() {
  const [activeTab, setActiveTab] = useState("overview"); // overview | applications | verification | letters
  const [selectedApp, setSelectedApp] = useState({
    id: "HS-2026-8812",
    name: "Nguyễn Hoàng Nam",
    citizenId: "001205019842",
    email: "namnh@gmail.com",
    phone: "0912345678",
    major: "Khoa học máy tính (AI)",
    campus: "FPT Hà Nội (Hoà Lạc)",
    method: "Điểm thi THPT 2026",
    scores: { toan: 9.2, ly: 8.8, anh: 9.5, total: 27.5 },
    status: "Chờ thẩm định",
    submittedAt: "17/08/2026 09:15"
  });

  const applicants = [
    { id: "HS-2026-8812", name: "Nguyễn Hoàng Nam", citizenId: "001205019842", major: "Khoa học máy tính (AI)", method: "THPT (Toán+Lý+Anh)", score: "27.5đ", status: "Chờ thẩm định", color: "#D97706", bg: "#FEF3C7" },
    { id: "HS-2026-8811", name: "Trần Thuỳ Linh", citizenId: "079205008123", major: "Quản trị kinh doanh QT", method: "Xét học bạ THPT", score: "28.2đ", status: "Đã duyệt", color: "#16A34A", bg: "#DCFCE7" },
    { id: "HS-2026-8810", name: "Lê Minh Quân", citizenId: "048205001945", major: "Kỹ thuật phần mềm", method: "IELTS 7.5 + THPT", score: "26.8đ", status: "Đã duyệt", color: "#16A34A", bg: "#DCFCE7" },
    { id: "HS-2026-8809", name: "Phạm Gia Huy", citizenId: "031205004412", major: "Thiết kế Mỹ thuật số", method: "ĐGNL ĐHQG", score: "890/1200", status: "Chờ thẩm định", color: "#D97706", bg: "#FEF3C7" },
    { id: "HS-2026-8808", name: "Đặng Thị Phương", citizenId: "001205011982", major: "Vi Mạch Bán Dẫn", method: "Tuyển thẳng HSG", score: "Giải Nhì QG", status: "Đã cấp học bổng", color: "#7C3AED", bg: "#F5F3FF" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* ── Admission Sub-Sidebar ── */}
      <div style={{ width: 240, background: "#fff", borderRight: "1px solid #E2E8F0", padding: "24px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingLeft: 6 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16 }}>
              TS
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#9A3412", lineHeight: 1.1 }}>FPT Admission</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Staff Portal</div>
            </div>
          </div>

          {/* New Application Entry */}
          <button style={{
            width: "100%", padding: "10px 14px", borderRadius: 10, background: "linear-gradient(135deg, #EA580C, #C2410C)",
            color: "#fff", border: "none", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            cursor: "pointer", boxShadow: "0 4px 12px rgba(234,88,12,0.25)", marginBottom: 20
          }}>
            <Plus size={16} /> Nhập Hồ Sơ Mới
          </button>

          {/* Nav Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { key: "overview", label: "Overview", icon: Users },
              { key: "applications", label: "Hồ Sơ Xét Tuyển", icon: FileText },
              { key: "verification", label: "Thẩm Định & Học Bạ", icon: ShieldCheck },
              { key: "letters", label: "Thư Nhập Học (Offers)", icon: Send }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                  display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  background: activeTab === tab.key ? "#FB923C" : "transparent",
                  color: activeTab === tab.key ? "#fff" : "#475569"
                }}
              >
                <tab.icon size={17} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Staff footer */}
        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFF7F4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#EA580C", fontSize: 12 }}>
              TS
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Cán Bộ Tuyển Sinh</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Admission Office</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main View ── */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        {/* Breadcrumb Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#9A3412" }}>
            Admission Management • FACT_ADMISSION
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Tổng quan Tuyển sinh 2026</h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0" }}>Tiến độ chỉ tiêu 5 cơ sở đào tạo FPT University</p>
              </div>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "none", background: "#EA580C", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                <Download size={15} /> Xuất Báo Cáo Tuyển Sinh
              </button>
            </div>

            {/* 3 KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 28 }}>
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Hồ Sơ Tiếp Nhận</span>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", marginTop: 6 }}>124,890</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>↑ +16.2% so với 2025</div>
              </div>

              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Đã Duyệt Đủ Điều Kiện</span>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", marginTop: 6 }}>98,420</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginTop: 4 }}>78.8% Tỷ lệ đạt chuẩn</div>
              </div>

              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Xác Nhận Nhập Học</span>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", marginTop: 6 }}>21,240 <span style={{ fontSize: 14, color: "#64748B" }}>/ 22.000 SV</span></div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>🎯 96.5% Chỉ tiêu 2026</div>
              </div>
            </div>

            {/* Applications List & Detail View */}
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }}>
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
                  Hồ Sơ Xét Tuyển Cần Thẩm Định
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>MÃ HỒ SƠ</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>THÍ SINH</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>NGÀNH</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>ĐIỂM</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((app, idx) => (
                      <tr
                        key={idx}
                        onClick={() => setSelectedApp(app)}
                        style={{ borderBottom: "1px solid #F1F5F9", cursor: "pointer", background: selectedApp.id === app.id ? "#FFF7F4" : "#fff" }}
                      >
                        <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>{app.id}</td>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0F172A" }}>{app.name}</td>
                        <td style={{ padding: "12px 14px", color: "#475569" }}>{app.major}</td>
                        <td style={{ padding: "12px 14px", fontWeight: 800, color: "#EA580C" }}>{app.score}</td>
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

              {/* Detail Review Box */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: 0 }}>Chi Tiết Hồ Sơ Xét Tuyển</h3>
                  <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 800, color: "#EA580C" }}>{selectedApp.id}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, borderBottom: "1px solid #F1F5F9", paddingBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B" }}>Họ tên thí sinh:</span>
                    <strong style={{ color: "#0F172A" }}>{selectedApp.name}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B" }}>Số CCCD:</span>
                    <span style={{ color: "#475569", fontFamily: "monospace" }}>{selectedApp.citizenId}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B" }}>Nguyện vọng:</span>
                    <strong style={{ color: "#0F172A" }}>{selectedApp.major}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B" }}>Phương thức:</span>
                    <span style={{ color: "#2563EB", fontWeight: 600 }}>{selectedApp.method}</span>
                  </div>
                </div>

                <div style={{ padding: "12px 0", borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", marginBottom: 6 }}>ĐỐI SOÁT VỚI CSDL BỘ GD&ĐT</div>
                  <div style={{ display: "flex", gap: 6, fontSize: 12 }}>
                    <span style={{ padding: "3px 8px", background: "#DCFCE7", color: "#16A34A", borderRadius: 4, fontWeight: 700 }}>✓ CCCD Hợp lệ</span>
                    <span style={{ padding: "3px 8px", background: "#DCFCE7", color: "#16A34A", borderRadius: 4, fontWeight: 700 }}>✓ Điểm THPT Khớp 100%</span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
                  <button style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    Yêu cầu bổ sung
                  </button>
                  <button style={{ padding: "10px", borderRadius: 8, background: "#16A34A", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    ✓ Duyệt Trúng Tuyển
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
