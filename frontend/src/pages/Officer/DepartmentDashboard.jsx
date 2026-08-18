import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Users, CheckCircle2, Clock, BarChart3, TrendingUp,
  Award, ShieldCheck, FileCheck, ArrowRight, Download, Filter,
  Layers, AlertTriangle, Calendar, Send, Sparkles, CheckSquare,
  DollarSign, GraduationCap, Check, X, RefreshCw, Eye,
  FileSpreadsheet, MessageSquare, Briefcase, Bot, ChevronRight,
  Database, UserCheck, Flame, Bell, Settings, HelpCircle, LogOut,
  TrendingDown, FileText, ArrowUpRight, ArrowDownRight, Compass, Cpu
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell, AreaChart, Area, LineChart, Line
} from "recharts";
import * as XLSX from "xlsx";
import { DWH_DIMENSIONS, DWH_FACTS } from "../../services/dwhService";

export default function DepartmentDashboard() {
  const navigate = useNavigate();

  // Selected Department / Faculty Key
  const [selectedDept, setSelectedDept] = useState("PHONG_TUYEN_SINH");
  const [selectedSemester, setSelectedSemester] = useState("Thu 2026");
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dữ liệu Nghiệp vụ & KPI của từng Phòng ban / Khoa (Liên kết Kho Dữ Liệu DWH)
  const departmentsData = {
    PHONG_TUYEN_SINH: {
      id: "PHONG_TUYEN_SINH",
      name: "Ban Tuyển Sinh & Truyền Thông Toàn Quốc",
      manager: "ThS. Đỗ Thị Thu Trang",
      role: "Trưởng Ban Tuyển Sinh",
      staffCount: 28,
      connectedFact: "FACT_ADMISSION",
      kpis: [
        { label: "Tổng chỉ tiêu đạt được", val: "14,350 SV", target: "14,000 SV (102.5%)", color: "#16A34A", bg: "#DCFCE7", change: "+12.4% YoY" },
        { label: "Hồ sơ thẩm định chờ Trưởng ban duyệt", val: "24 Hồ sơ", target: "Đợt 2 THPT & ĐGNL", color: "#EA580C", bg: "#FFEDD5", change: "Hạn 18:00 hôm nay" },
        { label: "Ngân sách Học bổng đã cấp", val: "45.2 Tỷ VNĐ", target: "Hạn mức 50 Tỷ VNĐ", color: "#2563EB", bg: "#EFF6FF", change: "Đạt 90.4% ngân sách" },
        { label: "Tỷ lệ chuẩn hóa dữ liệu DWH", val: "99.9%", target: "FACT_ADMISSION (Realtime)", color: "#7C3AED", bg: "#F5F3FF", change: "Đã đồng bộ 5 Campus" }
      ],
      pendingApprovals: [
        { id: "APPR-TS-01", title: "Phê duyệt danh sách 320 thí sinh trúng tuyển đợt 2 theo điểm thi ĐHQG", submitter: "Lê Thị Thảo (Tổ thẩm định)", time: "15 phút trước", category: "Xét tuyển", count: "320 Thí sinh" },
        { id: "APPR-TS-02", title: "Duyệt cấp 45 suất Học bổng Tài năng FPT (30% - 100%) cho học sinh giỏi QG", submitter: "Hoàng Minh Đức (Tổ học bổng)", time: "40 phút trước", category: "Học bổng", count: "45 Thí sinh" },
        { id: "APPR-TS-03", title: "Phê duyệt kế hoạch truyền thông Ngày hội Open Day Campus Hòa Lạc & TP.HCM", submitter: "Phạm Hải Yến (MKT)", time: "2 giờ trước", category: "Kế hoạch", count: "Dự kiến 3,500 HS" },
      ],
      staffList: [
        { name: "Phạm Văn Long", role: "Tổ trưởng Tư vấn Tuyển sinh", tasks: 85, sla: "99.5%", quality: "Xuất sắc", status: "Active" },
        { name: "Lê Thị Thảo", role: "Chuyên viên Thẩm định hồ sơ", tasks: 76, sla: "98.2%", quality: "Tốt", status: "Active" },
        { name: "Hoàng Minh Đức", role: "Chuyên viên Học bổng", tasks: 62, sla: "97.8%", quality: "Tốt", status: "Active" },
        { name: "Nguyễn Mỹ Hạnh", role: "Tư vấn viên Telesales", tasks: 94, sla: "99.1%", quality: "Xuất sắc", status: "Active" },
      ],
      chartData: [
        { name: "Khu vực Bắc (HN)", actual: 5200, target: 5000 },
        { name: "Khu vực Nam (HCM)", actual: 4850, target: 4600 },
        { name: "Miền Trung (Đà Nẵng)", actual: 2150, target: 2200 },
        { name: "ĐBSCL (Cần Thơ)", actual: 1450, target: 1400 },
        { name: "Tây Nguyên & Nam Trung Bộ (QN)", actual: 700, target: 800 },
      ]
    },

    PHONG_DAO_TAO: {
      id: "PHONG_DAO_TAO",
      name: "Phòng Quản Lý Đào Tạo & Khảo Thí",
      manager: "TS. Trần Quốc Tuấn",
      role: "Trưởng Phòng Đào Tạo",
      staffCount: 22,
      connectedFact: "FACT_LEARNING",
      kpis: [
        { label: "Tiến độ chuẩn hóa điểm học kỳ", val: "98.8%", target: "Học kỳ Thu 2026", color: "#16A34A", bg: "#DCFCE7", change: "+3.2% so với Summer" },
        { label: "Đơn phúc khảo & Học vụ chờ duyệt", val: "12 Hồ sơ", target: "Toán & Lập trình C", color: "#EA580C", bg: "#FFEDD5", change: "Xử lý trong 24h" },
        { label: "Tỷ lệ sinh viên đạt chuẩn tiến độ", val: "91.8%", target: "Chỉ tiêu > 90.0%", color: "#2563EB", bg: "#EFF6FF", change: "Đạt chuẩn kiểm định" },
        { label: "Độ sẵn sàng dữ liệu DWH", val: "100%", target: "FACT_LEARNING", color: "#7C3AED", bg: "#F5F3FF", change: "480 Môn học kích hoạt" }
      ],
      pendingApprovals: [
        { id: "APPR-DT-01", title: "Phê duyệt mở bổ sung 14 lớp học phần chuyên sâu AI & Kỹ thuật Vi Mạch", submitter: "ThS. Nguyễn Văn Thắng (Xếp TKB)", time: "25 phút trước", category: "Thời khóa biểu", count: "14 Lớp" },
        { id: "APPR-DT-02", title: "Phê duyệt biên bản chấm phúc khảo 18 bài thi trắc nghiệm học phần PRJ301", submitter: "Tổ Khảo Thí Trung Tâm", time: "1 giờ trước", category: "Khảo thí", count: "18 Sinh viên" },
        { id: "APPR-DT-03", title: "Duyệt danh sách 420 sinh viên đủ điều kiện làm Đồ án Tốt nghiệp (Capstone Project)", submitter: "Nguyễn Thị Mai (Văn phòng khoa)", time: "3 giờ trước", category: "Tốt nghiệp", count: "420 Sinh viên" }
      ],
      staffList: [
        { name: "ThS. Nguyễn Văn Thắng", role: "Chuyên viên TKB & Phòng học", tasks: 68, sla: "99.0%", quality: "Xuất sắc", status: "Active" },
        { name: "Nguyễn Thị Mai", role: "Chuyên viên Học vụ & Điểm số", tasks: 72, sla: "98.5%", quality: "Tốt", status: "Active" },
        { name: "Vũ Trọng Khang", role: "Quản trị Hệ thống Khảo thí", tasks: 54, sla: "97.5%", quality: "Tốt", status: "Active" },
      ],
      chartData: [
        { name: "Khoa CNTT (FIT)", actual: 94, target: 90 },
        { name: "Khoa QTKD (FBA)", actual: 91, target: 88 },
        { name: "Khoa Mỹ Thuật (FDN)", actual: 92, target: 90 },
        { name: "Khoa Ngôn Ngữ (FLA)", actual: 90, target: 88 },
      ]
    },

    PHONG_TAI_CHINH: {
      id: "PHONG_TAI_CHINH",
      name: "Phòng Kế Toán & Quản Trị Tài Chính",
      manager: "ThS. Phạm Thị Dung",
      role: "Kế Toán Trưởng",
      staffCount: 16,
      connectedFact: "FACT_FINANCE",
      kpis: [
        { label: "Doanh thu học phí thu được", val: "2,308 Tỷ", target: "2,450 Tỷ VNĐ (94.2%)", color: "#16A34A", bg: "#DCFCE7", change: "+14.8% YoY" },
        { label: "Lệnh giải ngân học bổng chờ duyệt", val: "8 Phiếu chi", target: "Trị giá 4.2 Tỷ VNĐ", color: "#EA580C", bg: "#FFEDD5", change: "Hạn phê duyệt 20/10" },
        { label: "Dự toán hạ tầng đã giải ngân", val: "292.5 Tỷ", target: "Kế hoạch 450 Tỷ (65%)", color: "#2563EB", bg: "#EFF6FF", change: "Campus Cần Thơ GĐ2" },
        { label: "Đồng bộ hóa Sổ Cái DWH", val: "99.8%", target: "FACT_FINANCE", color: "#7C3AED", bg: "#F5F3FF", change: "Tự động đối soát VNPAY" }
      ],
      pendingApprovals: [
        { id: "APPR-TC-01", title: "Phê duyệt chi trả thù lao giảng dạy & phụ cấp giờ phụ đạo tháng 10/2024", submitter: "Lê Văn Tuấn (Kế toán tiền lương)", time: "30 phút trước", category: "Lương & Giảng dạy", count: "820 Giảng viên" },
        { id: "APPR-TC-02", title: "Duyệt hoàn phí & chuyển tiền thừa kỳ trước cho 48 sinh viên xin thôi học/chuyển ngành", submitter: "Nguyễn Mỹ Lan (Kế toán thu)", time: "2 giờ trước", category: "Hoàn phí", count: "48 Sinh viên" },
      ],
      staffList: [
        { name: "Lê Văn Tuấn", role: "Kế toán Tổng hợp & Lương", tasks: 62, sla: "99.4%", quality: "Xuất sắc", status: "Active" },
        { name: "Nguyễn Mỹ Lan", role: "Kế toán Công nợ & Học phí", tasks: 74, sla: "98.1%", quality: "Tốt", status: "Active" },
      ],
      chartData: [
        { name: "Tháng 07", actual: 320, target: 300 },
        { name: "Tháng 08", actual: 850, target: 800 },
        { name: "Tháng 09", actual: 980, target: 950 },
        { name: "Tháng 10", actual: 158, target: 400 },
      ]
    },

    KHOA_CNTT: {
      id: "KHOA_CNTT",
      name: "Khoa Công Nghệ Thông Tin & Bán Dẫn (FIT)",
      manager: "PGS.TS. Huỳnh Quyết Thắng",
      role: "Trưởng Khoa CNTT",
      staffCount: 145,
      connectedFact: "FACT_LEARNING, FACT_RESEARCH",
      kpis: [
        { label: "Tổng sinh viên đang theo học", val: "6,500 SV", target: "Chiếm 45% toàn trường", color: "#16A34A", bg: "#DCFCE7", change: "+18.2% YoY" },
        { label: "Giảng viên có trình độ TS (PhD)", val: "48.5%", target: "Chuẩn FPT > 40%", color: "#2563EB", bg: "#EFF6FF", change: "68 Tiến sĩ" },
        { label: "Bài báo khoa học Scopus năm 2024", val: "142 Bài", target: "Chỉ tiêu 130 Bài", color: "#7C3AED", bg: "#F5F3FF", change: "Vượt 109% KPI" },
        { label: "Tỷ lệ việc làm sau 6 tháng", val: "98.6%", target: "Lương TB: 18.5M", color: "#EA580C", bg: "#FFEDD5", change: "Top 1 Việt Nam" }
      ],
      pendingApprovals: [
        { id: "APPR-FIT-01", title: "Phê duyệt khung chương trình đào tạo Ngành Thiết Kế Vi Mạch Bán Dẫn K21", submitter: "Bộ môn Phần cứng & IoT", time: "10 phút trước", category: "Khung đào tạo", count: "152 Tín chỉ" },
        { id: "APPR-FIT-02", title: "Duyệt thành lập Hội đồng nghiệm thu Đề tài Nghiên cứu AI cấp Tập đoàn FPT", submitter: "Lab AI Quốc tế", time: "1 giờ trước", category: "NCKH", count: "3 Đề tài" }
      ],
      staffList: [
        { name: "TS. Nguyễn Hoàng Nam", role: "Chủ nhiệm Bộ môn AI", tasks: 48, sla: "99.5%", quality: "Xuất sắc", status: "Active" },
        { name: "ThS. Trần Thị Kim Cúc", role: "Chủ nhiệm Bộ môn SE", tasks: 52, sla: "98.8%", quality: "Xuất sắc", status: "Active" },
        { name: "TS. Lê Quang Dũng", role: "Giám đốc Lab Vi Mạch", tasks: 39, sla: "97.6%", quality: "Tốt", status: "Active" },
      ],
      chartData: [
        { name: "Kỹ thuật phần mềm (SE)", actual: 3850, target: 3600 },
        { name: "Trí tuệ nhân tạo (AI)", actual: 1450, target: 1300 },
        { name: "An toàn thông tin (IA)", actual: 780, target: 750 },
        { name: "Thiết kế Vi mạch (IC)", actual: 420, target: 400 },
      ]
    }
  };

  const currentDept = departmentsData[selectedDept] || departmentsData.PHONG_TUYEN_SINH;

  // Xuất Báo Cáo KPI Phòng Ban Excel
  const handleExportDepartmentExcel = () => {
    const wsData = [
      [`BÁO CÁO HOẠT ĐỘNG & ĐIỀU HÀNH - ${currentDept.name.toUpperCase()}`],
      ["Thời gian xuất:", new Date().toLocaleString("vi-VN")],
      ["Trưởng đơn vị phê duyệt:", `${currentDept.manager} (${currentDept.role})`],
      ["Bảng sự kiện DWH liên kết:", currentDept.connectedFact],
      [],
      ["1. CHỈ SỐ KPI TRỌNG TÂM"],
      ["CHỈ SỐ", "GIÁ TRỊ HIỆN TẠI", "CHỈ TIÊU / ĐÁNH GIÁ", "TĂNG TRƯỞNG / TIẾN ĐỘ"],
      ...currentDept.kpis.map(k => [k.label, k.val, k.target, k.change]),
      [],
      ["2. DANH SÁCH TÁC VỤ PHÊ DUYỆT"],
      ["MÃ TÁC VỤ", "TIÊU ĐỀ NỘI DUNG", "NGƯỜI TRÌNH DUYỆT", "THỜI GIAN", "PHÂN LOẠI", "QUY MÔ"],
      ...currentDept.pendingApprovals.map(p => [p.id, p.title, p.submitter, p.time, p.category, p.count]),
      [],
      ["3. ĐÁNH GIÁ HIỆU SUẤT NHÂN SỰ TRONG PHÒNG"],
      ["HỌ VÀ TÊN", "CHỨC DANH", "TÁC VỤ HOÀN THÀNH", "TỶ LỆ SLA", "ĐÁNH GIÁ CHẤT LƯỢNG"],
      ...currentDept.staffList.map(s => [s.name, s.role, s.tasks, s.sla, s.quality])
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Department_KPI_Report");
    XLSX.writeFile(wb, `BaoCao_${currentDept.id}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast(`Đã xuất báo cáo ${currentDept.name} thành công (Excel)!`);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#0F172A" }}>

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div style={{
          position: "fixed", top: 20, right: 28, zIndex: 9999,
          background: toastMessage.type === "success" ? "#0F172A" : "#B91C1C",
          color: "#FFFFFF", padding: "12px 20px", borderRadius: 10,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600
        }}>
          <CheckCircle2 size={17} color={toastMessage.type === "success" ? "#4ADE80" : "#F87171"} />
          {toastMessage.text}
        </div>
      )}

      {/* ── TOP HEADER ── */}
      <header style={{
        height: 62, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
        padding: "0 28px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30
      }}>
        {/* Brand & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg, #7C3AED, #9333EA)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#FFFFFF", fontWeight: 900, fontSize: 16,
            boxShadow: "0 4px 12px rgba(124,58,237,0.3)"
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.2px", lineHeight: 1.15 }}>
              Cổng Điều Hành Trưởng Phòng Ban & Khoa (Department Portal)
            </div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, marginTop: 1 }}>
              Kết Nối Dữ Liệu Thực Thời Gian Thực Với Kho DWH & Ban Giám Hiệu FPT
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Semester Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: 8, padding: "5px 10px" }}>
            <Calendar size={13} color="#64748B" />
            <select
              value={selectedSemester}
              onChange={(e) => {
                setSelectedSemester(e.target.value);
                showToast(`Đã chuyển bộ lọc sang kỳ: ${e.target.value}`);
              }}
              style={{ border: "none", background: "transparent", fontSize: 12, fontWeight: 700, color: "#0F172A", cursor: "pointer", outline: "none" }}
            >
              <option value="Thu 2026">Kỳ Thu 2024 (Thu 2026)</option>
              <option value="Xuan 2026">Kỳ Xuân 2025 (Xuan 2026)</option>
              <option value="Thu 2026">Kỳ Thu 2025 (Thu 2026)</option>
            </select>
          </div>

          <button
            onClick={handleExportDepartmentExcel}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12, fontWeight: 700, color: "#334155", cursor: "pointer" }}
          >
            <Download size={14} /> Xuất Báo Cáo (Excel)
          </button>

          <button
            onClick={() => navigate("/bod")}
            style={{ padding: "7px 14px", borderRadius: 8, background: "#0F172A", color: "#FFFFFF", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
          >
            Về BOD Portal
          </button>
        </div>
      </header>

      {/* ── MAIN BODY CONTAINER ── */}
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "24px 28px 48px" }}>

        {/* ── THANH CHỌN PHÒNG BAN / KHOA (DEPARTMENT SWITCHER) ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", padding: "16px 20px", marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#64748B", letterSpacing: "0.5px" }}>CHỌN PHÒNG BAN / KHOA ĐIỀU HÀNH:</span>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: "2px 0 0" }}>
                {currentDept.name}
              </h2>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 12, color: "#475569" }}>
                Trưởng đơn vị: <strong style={{ color: "#7C3AED" }}>{currentDept.manager}</strong> ({currentDept.staffCount} Cán bộ)
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 4, background: "#EFF6FF", color: "#2563EB", fontFamily: "monospace" }}>
                DWH: {currentDept.connectedFact}
              </span>
            </div>
          </div>

          {/* Tab Buttons */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              { id: "PHONG_TUYEN_SINH", label: "Ban Tuyển Sinh & Truyền Thông", icon: Users, color: "#EA580C" },
              { id: "PHONG_DAO_TAO", label: "Phòng Quản Lý Đào Tạo", icon: GraduationCap, color: "#2563EB" },
              { id: "PHONG_TAI_CHINH", label: "Phòng Kế Toán & Tài Chính", icon: DollarSign, color: "#16A34A" },
              { id: "KHOA_CNTT", label: "Khoa CNTT & Bán Dẫn (FIT)", icon: Cpu, color: "#7C3AED" },
            ].map(dept => {
              const isSelected = selectedDept === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => {
                    setSelectedDept(dept.id);
                    showToast(`Đã chuyển quyền điều hành sang: ${dept.label}`);
                  }}
                  style={{
                    padding: "10px 14px", borderRadius: 8,
                    border: isSelected ? `2px solid ${dept.color}` : "1px solid #E2E8F0",
                    background: isSelected ? "#FFF" : "#F8FAFC",
                    color: isSelected ? dept.color : "#475569",
                    fontWeight: isSelected ? 800 : 600, fontSize: 12.5,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    boxShadow: isSelected ? "0 4px 12px rgba(0,0,0,0.06)" : "none",
                    textAlign: "left"
                  }}
                >
                  <dept.icon size={16} />
                  <span>{dept.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 4 THẺ KPI CHÍNH CỦA ĐƠN VỊ (TÍCH HỢP DATA WAREHOUSE) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
          {currentDept.kpis.map((kpi, idx) => (
            <div key={idx} style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>{kpi.label}</span>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: kpi.color, background: kpi.bg, padding: "2px 7px", borderRadius: 4 }}>
                  {kpi.change}
                </span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                {kpi.val}
              </div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                Mục tiêu: <strong>{kpi.target}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* ── 2 CỘT: TRUNG TÂM PHÊ DUYỆT (APPROVAL HUB) & BIỂU ĐỒ TIẾN ĐỘ ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 20 }}>

          {/* Cột Trái: Danh sách Tác vụ Chờ Trưởng phòng / Trưởng khoa Duyệt */}
          <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CheckSquare size={17} color="#7C3AED" />
                <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                  Trung Tâm Phê Duyệt Cấp Quản Lý ({currentDept.pendingApprovals.length} Yêu cầu)
                </h3>
              </div>
              <span style={{ fontSize: 11, color: "#64748B" }}>Cập nhật 2 phút trước</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {currentDept.pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#FAFAFA", borderRadius: 10, border: "1px solid #E2E8F0",
                    padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 10, fontFamily: "monospace", fontWeight: 800, background: "#EFF6FF", color: "#1D4ED8", padding: "1px 5px", borderRadius: 3 }}>
                          {item.id}
                        </span>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: "#7C3AED", background: "#F5F3FF", padding: "1px 6px", borderRadius: 4 }}>
                          {item.category}
                        </span>
                        <span style={{ fontSize: 11, color: "#94A3B8" }}>• {item.time}</span>
                      </div>
                      <strong style={{ fontSize: 13, color: "#0F172A", lineHeight: 1.3, display: "block" }}>
                        {item.title}
                      </strong>
                    </div>

                    <span style={{ fontSize: 11, fontWeight: 800, color: "#0F172A", background: "#FFFFFF", border: "1px solid #CBD5E1", padding: "3px 8px", borderRadius: 4, flexShrink: 0 }}>
                      {item.count}
                    </span>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 8, borderTop: "1px solid #F1F5F9" }}>
                    <span style={{ fontSize: 11.5, color: "#64748B" }}>
                      Người trình: <strong>{item.submitter}</strong>
                    </span>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => showToast(`Đã yêu cầu điều chỉnh bổ sung cho ${item.id}`, "error")}
                        style={{ padding: "5px 10px", borderRadius: 5, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 11, fontWeight: 700, color: "#DC2626", cursor: "pointer" }}
                      >
                        Yêu Cầu Sửa
                      </button>
                      <button
                        onClick={() => showToast(`Đã phê duyệt thành công tác vụ ${item.id}! Dữ liệu tự động đẩy vào ${currentDept.connectedFact}.`)}
                        style={{ padding: "5px 14px", borderRadius: 5, border: "none", background: "#16A34A", color: "#FFF", fontSize: 11, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Check size={13} /> Phê Duyệt
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cột Phải: Biểu đồ Tiến độ Chỉ tiêu Thực tế vs Kế hoạch */}
          <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Thực Tế vs Chỉ Tiêu Kế Hoạch
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 11 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#7C3AED" }} /> Thực tế</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#CBD5E1" }} /> Kế hoạch</div>
              </div>
            </div>

            <div style={{ width: "100%", height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={currentDept.chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                  <XAxis dataKey="name" fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="actual" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Thực tế" />
                  <Bar dataKey="target" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Kế hoạch" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 12px", border: "1px solid #E2E8F0", marginTop: 12, fontSize: 11.5, color: "#475569" }}>
              💡 <strong>Khuyến nghị DWH:</strong> Tỷ lệ hoàn thành nhiệm vụ của đơn vị đạt <strong>102.4%</strong>. Khuyến nghị Ban Giám Hiệu giữ nguyên định biên cho kỳ tiếp theo.
            </div>
          </div>

        </div>

        {/* ── BẢNG ĐÁNH GIÁ HIỆU SUẤT & SLA NHÂN VIÊN TRONG PHÒNG ── */}
        <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: "0 0 2px" }}>
                Giám Sát Tiến Độ & Đánh Giá SLA Nhân Viên ({currentDept.staffCount} Cán Bộ)
              </h3>
              <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                Theo dõi hiệu suất giải quyết công việc theo đúng cam kết thời gian (SLA)
              </p>
            </div>

            <button
              onClick={() => showToast("Đã gửi thông báo nhắc nhở tiến độ tới toàn thể cán bộ trong đơn vị!")}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, background: "#F1F5F9", border: "1px solid #CBD5E1", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
            >
              <Send size={13} /> Nhắc Nhở Tiến Độ Toàn Đơn Vị
            </button>
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", fontSize: 11.5 }}>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>HỌ VÀ TÊN</th>
                <th style={{ padding: "10px 12px", fontWeight: 700 }}>CHỨC VỤ / TỔ CÔNG TÁC</th>
                <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>TÁC VỤ HOÀN THÀNH</th>
                <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>TỶ LỆ ĐÁP ỨNG SLA</th>
                <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>ĐÁNH GIÁ CHẤT LƯỢNG</th>
                <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {currentDept.staffList.map((staff, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "12px", fontWeight: 800, color: "#0F172A" }}>
                    {staff.name}
                  </td>
                  <td style={{ padding: "12px", color: "#475569" }}>
                    {staff.role}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center", fontWeight: 700, color: "#0F172A" }}>
                    {staff.tasks} Nhiệm vụ
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <span style={{ padding: "3px 8px", borderRadius: 4, background: "#DCFCE7", color: "#16A34A", fontWeight: 800, fontSize: 11.5 }}>
                      {staff.sla}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <span style={{ padding: "3px 8px", borderRadius: 4, background: staff.quality === "Xuất sắc" ? "#F5F3FF" : "#EFF6FF", color: staff.quality === "Xuất sắc" ? "#7C3AED" : "#2563EB", fontWeight: 700, fontSize: 11.5 }}>
                      ⭐ {staff.quality}
                    </span>
                  </td>
                  <td style={{ padding: "12px", textAlign: "right" }}>
                    <button
                      onClick={() => showToast(`Đã giao thêm nhiệm vụ mới cho ${staff.name}`)}
                      style={{ padding: "4px 10px", borderRadius: 5, background: "#FFFFFF", border: "1px solid #CBD5E1", fontSize: 11, fontWeight: 700, color: "#0F172A", cursor: "pointer" }}
                    >
                      Giao Việc
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
