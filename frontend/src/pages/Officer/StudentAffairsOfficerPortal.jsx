import { useState } from "react";
import {
  GraduationCap, CheckCircle2, Clock, Home, Award,
  Search, Filter, Download, Plus, FileText, UserCheck,
  ShieldCheck, AlertCircle, Send, Check, X
} from "lucide-react";

export default function StudentAffairsOfficerPortal() {
  const [activeTab, setActiveTab] = useState("overview"); // overview | dorms | documents | conduct

  const [selectedDormApp, setSelectedDormApp] = useState({
    id: "KTX-2026-104",
    student: "Lê Văn Tùng",
    code: "Tân SV K22",
    major: "Kỹ thuật phần mềm",
    roomType: "Phòng 4 người (Điều hòa + Khép kín)",
    block: "Dom A - Hoà Lạc Campus",
    priority: "Hộ nghèo / Vùng sâu vùng xa (Ưu tiên 1)",
    status: "Chờ xếp phòng",
    appliedAt: "17/08/2026 10:20"
  });

  const dormList = [
    { id: "KTX-2026-104", student: "Lê Văn Tùng", code: "K22 Tân SV", roomType: "Phòng 4 người", block: "Dom A", priority: "UT1 (Hộ nghèo)", status: "Chờ xếp phòng", color: "#D97706", bg: "#FEF3C7" },
    { id: "KTX-2026-103", student: "Nguyễn Thị Hương", code: "K22 Tân SV", roomType: "Phòng 6 người", block: "Dom B", priority: "UT2 (Gia đình chính sách)", status: "Đã duyệt phòng A204", color: "#16A34A", bg: "#DCFCE7" },
    { id: "KTX-2026-102", student: "Hoàng Minh Đức", code: "SE1715", roomType: "Phòng 4 người", block: "Dom C", priority: "Bình thường", status: "Đã gia hạn kỳ Fall", color: "#2563EB", bg: "#DBEAFE" }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "Inter, sans-serif" }}>
      {/* Sub Sidebar */}
      <div style={{ width: 240, background: "#fff", borderRight: "1px solid #E2E8F0", padding: "24px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, paddingLeft: 6 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 16 }}>
              CT
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#065F46", lineHeight: 1.1 }}>FPT Affairs</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Student Services</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { key: "overview", label: "Overview", icon: GraduationCap },
              { key: "dorms", label: "Quản Lý Ký Túc Xá", icon: Home },
              { key: "documents", label: "Cấp Giấy Xác Nhận SV", icon: FileText },
              { key: "conduct", label: "Điểm Rèn Luyện & CLB", icon: Award }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 10, border: "none",
                  display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.2s",
                  background: activeTab === tab.key ? "#34D399" : "transparent",
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
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#10B981", fontSize: 12 }}>
              SV
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Cán Bộ CTSV</div>
              <div style={{ fontSize: 11, color: "#64748B" }}>Student Affairs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#065F46" }}>
            Student Services & Dormitory Portal
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Dịch Vụ Sinh Viên & Ký Túc Xá</h1>
              <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0" }}>Tiếp nhận đơn KTX, cấp thẻ sinh viên, giấy tờ xác nhận và đánh giá rèn luyện</p>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "none", background: "#10B981", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              <Download size={15} /> Xuất Báo Cáo KTX
            </button>
          </div>

          {/* 3 KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 28 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Công Suất Phòng KTX</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", marginTop: 6 }}>95.4%</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>4,820 / 5,000 Chỗ ở</div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Yêu Cầu Cấp Giấy Tờ Online</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", marginTop: 6 }}>142 Đơn</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", marginTop: 4 }}>Đã duyệt tự động 128 đơn</div>
            </div>

            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Câu Lạc Bộ & Hoạt Động</span>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", marginTop: 6 }}>48 CLB</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", marginTop: 4 }}>12 Sự kiện tháng này</div>
            </div>
          </div>

          {/* Dorm Applications Table & Detail Review */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, alignItems: "start" }}>
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", fontWeight: 800, fontSize: 14, color: "#0F172A" }}>
                Hồ Sơ Đăng Ký Chỗ Ở Ký Túc Xá
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>MÃ ĐƠN</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>SINH VIÊN</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>LOẠI PHÒNG</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>ƯU TIÊN</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody>
                  {dormList.map((item, idx) => (
                    <tr
                      key={idx}
                      onClick={() => setSelectedDormApp(item)}
                      style={{ borderBottom: "1px solid #F1F5F9", cursor: "pointer", background: selectedDormApp.id === item.id ? "#ECFDF5" : "#fff" }}
                    >
                      <td style={{ padding: "12px 14px", fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>{item.id}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0F172A" }}>{item.student}</td>
                      <td style={{ padding: "12px 14px", color: "#475569" }}>{item.roomType}</td>
                      <td style={{ padding: "12px 14px", fontWeight: 700, color: "#2563EB" }}>{item.priority}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: item.bg, color: item.color }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Detail Box */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E2E8F0", padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: 0 }}>Chi Tiết Đơn Đăng Ký KTX</h3>
                <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 800, color: "#10B981" }}>{selectedDormApp.id}</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, borderBottom: "1px solid #F1F5F9", paddingBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Sinh viên:</span>
                  <strong style={{ color: "#0F172A" }}>{selectedDormApp.student} ({selectedDormApp.code})</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Loại phòng:</span>
                  <strong style={{ color: "#0F172A" }}>{selectedDormApp.roomType}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Đối tượng:</span>
                  <span style={{ color: "#2563EB", fontWeight: 700 }}>{selectedDormApp.priority}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
                <button style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  Từ chối
                </button>
                <button style={{ padding: "10px", borderRadius: 8, background: "#10B981", color: "#fff", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  ✓ Xếp Phòng & Cấp Chỗ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
