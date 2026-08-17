import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/axiosConfig";
import {
  FileText, CheckCircle2, Clock, XCircle, Users, ArrowRight,
  TrendingUp, BarChart3, Target, Monitor, Briefcase, RefreshCw,
  Download, Eye, Building2, Layers, Filter, CheckSquare, Search,
  AlertCircle, Send, Sparkles
} from "lucide-react";

const DEPARTMENTS_DATA = {
  ADMISSION: {
    name: "Phòng Tuyển Sinh & Hướng Nghiệp",
    code: "TS-HN",
    kpis: [
      { label: "Hồ sơ tiếp nhận hôm nay", val: "148", change: "+12.4%", color: "#2563EB", bg: "#EFF6FF" },
      { label: "Đã duyệt & Đủ điều kiện", val: "112", change: "75.6% Tỷ lệ duyệt", color: "#16A34A", bg: "#F0FDF4" },
      { label: "Chờ thẩm định điểm THPT/Học bạ", val: "28", change: "Cần xử lý gấp", color: "#D97706", bg: "#FFFBEB" },
      { label: "Đã gửi Thông báo nhập học", val: "84", change: "+18 gửi mới", color: "#7C3AED", bg: "#F5F3FF" }
    ],
    tasks: [
      { id: "HS-2026-8812", name: "Nguyễn Hoàng Nam", major: "Khoa học máy tính (AI)", method: "Điểm THPT (27.5đ)", time: "10 phút trước", status: "Chờ duyệt" },
      { id: "HS-2026-8811", name: "Trần Thuỳ Linh", major: "Quản trị kinh doanh Quốc tế", method: "Xét học bạ (28.2đ)", time: "25 phút trước", status: "Chờ duyệt" },
      { id: "HS-2026-8810", name: "Lê Minh Quân", major: "Kỹ thuật phần mềm", method: "IELTS 7.5 + THPT", time: "40 phút trước", status: "Đã duyệt" },
      { id: "HS-2026-8809", name: "Phạm Gia Huy", major: "Thiết kế Mỹ thuật số", method: "ĐGNL ĐHQG (890đ)", time: "1 giờ trước", status: "Chờ thẩm định" }
    ]
  },
  ACADEMIC: {
    name: "Phòng Đào Tạo & Khảo Thí",
    code: "DT-HN",
    kpis: [
      { label: "Đơn phúc khảo bài thi", val: "19", change: "Học kỳ SU25", color: "#2563EB", bg: "#EFF6FF" },
      { label: "Sinh viên đăng ký bảo lưu", val: "12", change: "3 đơn mới", color: "#D97706", bg: "#FFFBEB" },
      { label: "Lớp học phần đã xếp lịch", val: "248", change: "100% Kế hoạch", color: "#16A34A", bg: "#F0FDF4" },
      { label: "Báo cáo học vụ đã đồng bộ DWH", val: "47 Ngành", change: "FACT_LEARNING", color: "#7C3AED", bg: "#F5F3FF" }
    ],
    tasks: [
      { id: "PK-SU25-042", name: "Đặng Thị Phương (SE1715)", major: "Môn MAE101 - Toán kỹ thuật", method: "Chấm lại bài cuối kỳ", time: "15 phút trước", status: "Chờ phân công GV" },
      { id: "BL-FA26-018", name: "Vũ Hồng Hà (SE1715)", major: "Xin tạm hoãn kỳ Fall 2026", method: "Lý do cá nhân / Đi du học", time: "1 giờ trước", status: "Chờ duyệt" },
      { id: "CD-FA26-009", name: "Bùi Văn Nam (KD1720)", major: "Chuyển ngành từ QTKD sang CNTT", method: "Đủ điều kiện GPA 3.4", time: "2 giờ trước", status: "Đã duyệt" }
    ]
  },
  STUDENT_AFFAIRS: {
    name: "Phòng Công Tác Sinh Viên & Hỗ Trợ",
    code: "CTSV-HN",
    kpis: [
      { label: "Yêu cầu cấp giấy tờ / Thẻ SV", val: "64", change: "+15 hôm nay", color: "#2563EB", bg: "#EFF6FF" },
      { label: "Hồ sơ đăng ký Ký túc xá", val: "142", change: "Đạt 95% công suất", color: "#16A34A", bg: "#F0FDF4" },
      { label: "Hồ sơ xét học bổng khuyến khích", val: "88", change: "Chờ hội đồng", color: "#7C3AED", bg: "#F5F3FF" },
      { label: "Hỗ trợ tân sinh viên K22", val: "210", change: "Tư vấn KTX/Đưa đón", color: "#FF6B35", bg: "#FFF7F4" }
    ],
    tasks: [
      { id: "GT-2026-501", name: "Nguyễn Minh Khoa (HS172345)", major: "Xin giấy xác nhận SV làm thẻ xe", method: "Xác nhận online", time: "5 phút trước", status: "Đã duyệt" },
      { id: "KTX-2026-104", name: "Lê Văn Tùng (Tân SV K22)", major: "Đăng ký phòng KTX 4 người", method: "Khu Dom A - Hoà Lạc", time: "30 phút trước", status: "Chờ xếp phòng" }
    ]
  }
};

export default function OfficerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedDeptKey, setSelectedDeptKey] = useState("ADMISSION");
  const currentDept = DEPARTMENTS_DATA[selectedDeptKey];

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* ── Top Header & Department Switcher ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(37,99,235,0.3)"
          }}>
            <Building2 size={26} color="#fff" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Cổng Nghiệp Vụ Cán Bộ Phòng Ban</h1>
              <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}>
                {currentDept.code}
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: "#64748B", margin: "3px 0 0" }}>
              Cán bộ: <strong>{user?.fullName || "Nguyễn Văn Hùng"}</strong> • {currentDept.name}
            </p>
          </div>
        </div>

        {/* Department Switcher for Demo */}
        <div style={{ display: "flex", gap: 8, background: "#F1F5F9", padding: 4, borderRadius: 12 }}>
          {[
            { key: "ADMISSION", label: "🏢 Tuyển Sinh" },
            { key: "ACADEMIC", label: "📚 Đào Tạo" },
            { key: "STUDENT_AFFAIRS", label: "🎓 CTSV & KTX" }
          ].map(d => (
            <button
              key={d.key}
              onClick={() => setSelectedDeptKey(d.key)}
              style={{
                padding: "8px 16px", borderRadius: 9, fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
                background: selectedDeptKey === d.key ? "#fff" : "transparent",
                color: selectedDeptKey === d.key ? "#2563EB" : "#64748B",
                boxShadow: selectedDeptKey === d.key ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s"
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards for the department ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 28 }}>
        {currentDept.kpis.map((kpi, idx) => (
          <div key={idx} style={{ background: kpi.bg, borderRadius: 18, padding: "20px 22px", border: `1.5px solid ${kpi.color}25` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A" }}>{kpi.val}</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: kpi.color, marginTop: 6 }}>{kpi.change}</div>
          </div>
        ))}
      </div>

      {/* ── Department Workflows & Tasks Table ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Left: Task Queue */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Hàng Đợi Xử Lý Nghiệp Vụ Hôm Nay</h3>
              <p style={{ fontSize: 12.5, color: "#64748B", margin: "2px 0 0" }}>Cập nhật tự động từ cổng tiếp nhận dữ liệu</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => navigate(selectedDeptKey === "ADMISSION" ? "/officer/applicants" : "/officer/students")}
                style={{ padding: "7px 14px", borderRadius: 8, background: "#2563EB", color: "#fff", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Mở Toàn Bộ Danh Sách →
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {currentDept.tasks.map((task, idx) => (
              <div key={idx} style={{ padding: "16px 18px", borderRadius: 14, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "monospace", background: "#E2E8F0", padding: "2px 8px", borderRadius: 6, color: "#334155" }}>
                      {task.id}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{task.name}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "#475569" }}>
                    {task.major} • <span style={{ color: "#2563EB", fontWeight: 600 }}>{task.method}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 2 }}>{task.time}</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{
                    padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700,
                    background: task.status === "Đã duyệt" ? "#DCFCE7" : task.status === "Chờ duyệt" ? "#FEF3C7" : "#EFF6FF",
                    color: task.status === "Đã duyệt" ? "#16A34A" : task.status === "Chờ duyệt" ? "#B45309" : "#2563EB"
                  }}>
                    {task.status}
                  </span>
                  <button style={{ padding: "6px 12px", borderRadius: 8, background: "#0F172A", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Xử lý
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick Tools & Department Shortcuts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Quick Actions */}
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 16px 0" }}>Thao Tác Nhanh Theo Nghiệp Vụ</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Gửi Thông Báo Trúng Tuyển & Nhập Học", path: "/officer/enrollment", icon: Send, color: "#2563EB" },
                { label: "Quản Lý Danh Sách Sinh Viên (DIM_STUDENT)", path: "/officer/students", icon: Users, color: "#7C3AED" },
                { label: "Tạo Báo Cáo Học Vụ & Thi Lại (FACT_LEARNING)", path: "/officer/academic-reports", icon: FileText, color: "#16A34A" },
                { label: "Bảng Điều Khiển Trưởng Phòng (KPIs Khoa)", path: "/officer/department", icon: BarChart3, color: "#FF6B35" }
              ].map((btn, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(btn.path)}
                  style={{
                    padding: "13px 16px", borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.borderColor = "#BFDBFE"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <btn.icon size={17} color={btn.color} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{btn.label}</span>
                  </div>
                  <ArrowRight size={14} color="#94A3B8" />
                </div>
              ))}
            </div>
          </div>

          {/* DWH Staging Sync Box */}
          <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", borderRadius: 20, padding: 22, color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Sparkles size={18} color="#FF8C5A" />
              <h4 style={{ fontSize: 14.5, fontWeight: 800, margin: 0, color: "#fff" }}>Đồng Bộ Dữ Liệu Lên Data Warehouse</h4>
            </div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, margin: "0 0 14px 0" }}>
              Dữ liệu sau khi cán bộ duyệt sẽ tự động chuyển vào tầng <strong>Staging Data Mart</strong> và hợp nhất vào <strong>FACT_ADMISSION / FACT_LEARNING</strong> theo chu kỳ 15 phút.
            </p>
            <div style={{ fontSize: 11.5, color: "#4ADE80", fontWeight: 700 }}>
              ● Trạng thái kết nối AGN Agent Node: Online (Latency 18ms)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
