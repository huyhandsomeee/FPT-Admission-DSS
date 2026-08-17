import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Calendar, LifeBuoy, BarChart3, LayoutDashboard,
  Search, Bell, HelpCircle, Download, Plus, CheckCircle,
  AlertTriangle, Filter, Check, X, ChevronRight, ChevronLeft,
  TrendingUp, TrendingDown, Eye, FileSpreadsheet, RefreshCw,
  LogOut, Mail, Settings, HelpCircle as SupportIcon, MoreVertical,
  Building, Megaphone, Users, Award, ShieldAlert, SlidersHorizontal,
  Clock, CheckCircle2, XCircle, Star, MessageSquare, Send,
  UserCheck, ShieldCheck, ArrowRight, PhoneCall, CheckCheck,
  Smile, Flame, FileCheck, Layers, ClipboardList
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell, PieChart, Pie, ScatterChart,
  Scatter, LineChart, Line
} from "recharts";
import * as XLSX from "xlsx";

export default function StudentAffairsOfficerPortal() {
  const navigate = useNavigate();

  // Active Tab State (4 tabs matching 4 screenshots + dashboard)
  // onestop: Dịch vụ một cửa (Ảnh 1)
  // events: Quản lý Sự kiện & Hoạt động (Ảnh 2)
  // counseling: Hỗ trợ sinh viên & Tư vấn (Ảnh 3)
  // reports: Báo cáo & Thống kê (Ảnh 4)
  // dashboard: Dashboard Tổng quan
  const [activeTab, setActiveTab] = useState("onestop");

  // ─── Search & Notification State ───
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── MODAL STATES ───
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showRequestDetailModal, setShowRequestDetailModal] = useState(null);

  // ─── TAB 1: DỊCH VỤ MỘT CỬA (ẢNH 1) ───
  const [oneStopFilterType, setOneStopFilterType] = useState("ALL");
  const [oneStopSemester, setOneStopSemester] = useState("SP24");
  const [oneStopSearch, setOneStopSearch] = useState("");

  const [oneStopRequests, setOneStopRequests] = useState([
    {
      id: "REQ-01",
      mssv: "SE160234",
      studentName: "Nguyễn Văn A",
      major: "Kỹ thuật phần mềm",
      type: "Xin giấy xác nhận sinh viên",
      date: "24/05/2024",
      status: "PENDING",
      statusText: "Chờ duyệt",
      statusColor: "#D97706",
      statusBg: "#FEF3C7",
      note: "Cần giấy xác nhận để làm thủ tục vay vốn ngân hàng chính sách."
    },
    {
      id: "REQ-02",
      mssv: "SS171098",
      studentName: "Trần Thị B",
      major: "Quản trị kinh doanh",
      type: "Cấp lại thẻ sinh viên",
      date: "23/05/2024",
      status: "PROCESSING",
      statusText: "Đang xử lý",
      statusColor: "#2563EB",
      statusBg: "#DBEAFE",
      note: "Bị mất thẻ sinh viên tại thư viện cơ sở Hòa Lạc, đã đóng lệ phí 50.000đ."
    },
    {
      id: "REQ-03",
      mssv: "SA150421",
      studentName: "Lê Hoàng C",
      major: "Thiết kế đồ họa",
      type: "Mượn phòng tự học",
      date: "22/05/2024",
      status: "COMPLETED",
      statusText: "Đã hoàn thành",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7",
      note: "Mượn phòng AL 204 từ 18:00 - 21:00 cho nhóm đồ án Capstone."
    },
    {
      id: "REQ-04",
      mssv: "SE160888",
      studentName: "Phạm Văn D",
      major: "An toàn thông tin",
      type: "Xin tạm hoãn nghĩa vụ quân sự",
      date: "21/05/2024",
      status: "REJECTED",
      statusText: "Từ chối",
      statusColor: "#DC2626",
      statusBg: "#FEE2E2",
      note: "Hồ sơ thiếu giấy gọi khám nghĩa vụ quân sự từ Ban chỉ huy quân sự địa phương."
    },
    {
      id: "REQ-05",
      mssv: "SE170111",
      studentName: "Đỗ Trọng E",
      major: "Kỹ thuật phần mềm",
      type: "Xin giấy xác nhận sinh viên",
      date: "20/05/2024",
      status: "COMPLETED",
      statusText: "Đã hoàn thành",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7",
      note: "Cấp giấy điện tử có mã QR xác thực cho cơ quan thực tập."
    }
  ]);

  const filteredRequests = useMemo(() => {
    return oneStopRequests.filter(r => {
      const matchType = oneStopFilterType === "ALL" || r.type.includes(oneStopFilterType);
      const q = oneStopSearch.toLowerCase().trim();
      const matchQ = !q || r.studentName.toLowerCase().includes(q) || r.mssv.toLowerCase().includes(q) || r.type.toLowerCase().includes(q);
      return matchType && matchQ;
    });
  }, [oneStopRequests, oneStopFilterType, oneStopSearch]);

  const handleApproveRequest = (req) => {
    setOneStopRequests(prev => prev.map(r => r.id === req.id ? {
      ...r, status: "COMPLETED", statusText: "Đã hoàn thành", statusColor: "#16A34A", statusBg: "#DCFCE7"
    } : r));
    showToast(`Đã duyệt hoàn tất yêu cầu "${req.type}" cho sinh viên ${req.studentName} (${req.mssv})!`);
    setShowRequestDetailModal(null);
  };

  const handleRejectRequest = (req) => {
    setOneStopRequests(prev => prev.map(r => r.id === req.id ? {
      ...r, status: "REJECTED", statusText: "Từ chối", statusColor: "#DC2626", statusBg: "#FEE2E2"
    } : r));
    showToast(`Đã từ chối yêu cầu của sinh viên ${req.studentName}`);
    setShowRequestDetailModal(null);
  };

  // ─── TAB 2: QUẢN LÝ SỰ KIỆN & HOẠT ĐỘNG (ẢNH 2) ───
  const eventParticipationData = [
    { month: "T1", rate: 60, isPeak: false },
    { month: "T2", rate: 75, isPeak: false },
    { month: "T3", rate: 100, isPeak: true }, // Peak Orange Bar
    { month: "T4", rate: 65, isPeak: false },
    { month: "T5", rate: 80, isPeak: false },
    { month: "T6", rate: 60, isPeak: false },
  ];

  const [selectedCalendarDay, setSelectedCalendarDay] = useState(11);

  const [clubEvents, setClubEvents] = useState([
    {
      id: "EV-01",
      title: "Hội thảo AI & Tương lai việc làm",
      club: "CLB FPTU Tech",
      location: "Hội trường Beta",
      date: "15/10/2023 - 14:00",
      expected: "300 SV",
      budget: "5.000.000đ",
      status: "PENDING",
      statusText: "CHỜ DUYỆT",
      statusColor: "#D97706",
      statusBg: "#FEF3C7",
      day: 15
    },
    {
      id: "EV-02",
      title: "Lễ hội Văn hóa Nhật Bản (Matsuri)",
      club: "CLB Tiếng Nhật JVC",
      location: "Sân trường tòa Alpha",
      date: "20/10/2023 - 08:00",
      registered: "450/500",
      status: "APPROVED",
      statusText: "ĐÃ DUYỆT",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7",
      day: 20
    },
    {
      id: "EV-03",
      title: "Cuộc thi Thiết kế Web (WebDesign Contest)",
      club: "Phòng CTSV",
      location: "Lab 101, 102",
      date: "11/10/2023 - 09:00",
      status: "FINISHED",
      statusText: "ĐÃ KẾT THÚC",
      statusColor: "#64748B",
      statusBg: "#F1F5F9",
      day: 11
    }
  ]);

  const handleApproveEvent = (event) => {
    setClubEvents(prev => prev.map(e => e.id === event.id ? {
      ...e, status: "APPROVED", statusText: "ĐÃ DUYỆT", statusColor: "#16A34A", statusBg: "#DCFCE7"
    } : e));
    showToast(`Đã phê duyệt sự kiện "${event.title}" của ${event.club}!`);
  };

  const handleDisburseEventBudget = (event) => {
    showToast(`Đã duyệt cấp ngân sách tổ chức cho sự kiện "${event.title}"!`);
  };

  // ─── TAB 3: HỖ TRỢ SINH VIÊN & TƯ VẤN (ẢNH 3) ───
  const [counselingCases, setCounselingCases] = useState([
    {
      id: "CASE-8992",
      priority: "HIGH",
      priorityText: "ƯU TIÊN CAO",
      priorityColor: "#DC2626",
      priorityBg: "#FEE2E2",
      title: "Tư vấn tâm lý khẩn cấp - Áp lực học tập",
      time: "10 phút trước",
      studentName: "Trần Văn Hoàng",
      studentCode: "HE150xxx",
      major: "Kỹ thuật phần mềm",
      gpa: "2.1 / 4.0",
      status: "Cảnh báo học tập",
      content: "Sinh viên có dấu hiệu stress nặng sau kỳ thi PE môn CSD201, cần gặp chuyên gia tâm lý trong ngày.",
      history: "12/04/2023: Đã tư vấn học vụ lần 1"
    },
    {
      id: "CASE-8991",
      priority: "MEDIUM",
      priorityText: "TRUNG BÌNH",
      priorityColor: "#D97706",
      priorityBg: "#FEF3C7",
      title: "Hỗ trợ gia hạn học phí do hoàn cảnh",
      time: "2 giờ trước",
      studentName: "Lê Quang Linh",
      studentCode: "SE160xxx",
      major: "Kỹ thuật phần mềm (K16)",
      gpa: "3.2 / 4.0",
      status: "Bình thường",
      content: "Sinh viên xin gia hạn đóng học phí kỳ Fall 2023 thêm 2 tuần. Lý do: Gia đình ở quê bị ảnh hưởng bởi bão lũ, chưa kịp xoay xở tài chính. Đã đính kèm giấy xác nhận của địa phương.",
      history: "10/05/2023: Đã hỗ trợ tư vấn tâm lý và miễn giảm học phí kỳ trước."
    },
    {
      id: "CASE-8985",
      priority: "LOW",
      priorityText: "THẤP",
      priorityColor: "#16A34A",
      priorityBg: "#DCFCE7",
      title: "Khiếu nại về thái độ bảo vệ cơ sở",
      time: "1 ngày trước",
      studentName: "Phạm Thị Lan",
      studentCode: "SS170xxx",
      major: "Quản trị kinh doanh",
      gpa: "3.5 / 4.0",
      status: "Bình thường",
      content: "Sinh viên phản ánh nhân viên bảo vệ cổng 2 có thái độ chưa chuẩn mực khi kiểm tra thẻ sinh viên giờ cao điểm.",
      history: "Chưa có tiền sử khiếu nại"
    }
  ]);

  const [selectedCase, setSelectedCase] = useState(counselingCases[1]); // #CASE-8991

  // ─── TAB 4: BÁO CÁO & THỐNG KÊ (ẢNH 4) ───
  const [reportSemester, setReportSemester] = useState("Spring 2024");

  // Donut chart data: Phân bổ dịch vụ (Ảnh 4)
  const serviceDistributionData = [
    { name: "Giấy tờ", value: 45, color: "#9A3412" }, // 45% Brown/Orange
    { name: "Học vụ", value: 30, color: "#2563EB" },  // 30% Blue
    { name: "Tài chính", value: 15, color: "#1D4ED8" }, // 15% Deep Blue
    { name: "Khác", value: 10, color: "#E2E8F0" },    // 10% Gray
  ];

  // Scatter/Line points: Lưu lượng yêu cầu theo tháng (Ảnh 4)
  const monthlyVolumeData = [
    { month: "Tháng 1", requests: 3.5 },
    { month: "Tháng 2", requests: 2.5 },
    { month: "Tháng 3", requests: 1.3 },
    { month: "Tháng 4", requests: 2.2 },
    { month: "Tháng 5", requests: 1.0 },
  ];

  const clubRankings = [
    { rank: "#1", badge: "FE", name: "FPT Event Club", events: 24, participants: "1,502", score: 9.5, trend: "up" },
    { rank: "#2", badge: "M", name: "Melody Club", events: 18, participants: "1,240", score: 9.0, trend: "up" },
    { rank: "#3", badge: "JVC", name: "CLB Tiếng Nhật (JVC)", events: 15, participants: "980", score: 8.8, trend: "up" },
    { rank: "#4", badge: "BC", name: "CLB Sách & Hành Động", events: 12, participants: "650", score: 8.5, trend: "up" },
    { rank: "#5", badge: "TC", name: "CLB Truyền Thông & Marketing", events: 10, participants: "520", score: 8.2, trend: "up" },
  ];

  // ─── EXPORT ACTIONS ───
  const handleExportOneStopExcel = () => {
    const data = oneStopRequests.map(r => ({
      "Mã Đơn": r.id,
      "MSSV": r.mssv,
      "Họ và Tên": r.studentName,
      "Ngành": r.major,
      "Loại Yêu Cầu": r.type,
      "Ngày Gửi": r.date,
      "Trạng Thái": r.statusText,
      "Ghi Chú": r.note
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DichVu_MotCua");
    XLSX.writeFile(wb, "BaoCao_DichVuMotCua_FPT.xlsx");
    showToast("Đã xuất báo cáo Dịch vụ một cửa (Excel) thành công!");
  };

  const handleExportAllReports = () => {
    showToast("Đã xuất toàn bộ báo cáo phân tích CTSV học kỳ Spring 2024 ra file Excel!");
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F8FAFC", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div style={{
          position: "fixed", top: 24, right: 32, zIndex: 9999,
          background: toastMessage.type === "success" ? "#0F172A" : "#B91C1C",
          color: "#FFFFFF", padding: "14px 20px", borderRadius: 12,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex",
          alignItems: "center", gap: 10, fontSize: 13.5, fontWeight: 600
        }}>
          <CheckCircle size={18} color={toastMessage.type === "success" ? "#4ADE80" : "#F87171"} />
          {toastMessage.text}
        </div>
      )}

      {/* ── SIDEBAR CÁN BỘ CTSV (SAO Admin - FPT University) ── */}
      <aside style={{
        width: 256, background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        flexShrink: 0, zIndex: 30
      }}>
        <div>
          {/* Brand Header */}
          <div style={{ padding: "24px 20px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "#9A3412", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FFFFFF", fontWeight: 900,
              fontSize: 18, boxShadow: "0 4px 12px rgba(154,52,18,0.25)"
            }}>
              S
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.3px", lineHeight: 1.15 }}>
                SAO Admin
              </div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, marginTop: 2 }}>
                FPT University
              </div>
            </div>
          </div>

          {/* New Request Button */}
          <div style={{ padding: "0 14px 14px" }}>
            <button
              onClick={() => setShowNewRequestModal(true)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                background: "#9A3412", color: "#FFFFFF", border: "none",
                fontWeight: 700, fontSize: 13.5, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(154,52,18,0.25)", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#7C2D12"}
              onMouseLeave={e => e.currentTarget.style.background = "#9A3412"}
            >
              <Plus size={18} strokeWidth={2.5} /> New Request
            </button>
          </div>

          {/* Navigation Links (Khớp 4 màn hình của người dùng) */}
          <nav style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { id: "onestop", icon: FileText, label: "Dịch vụ một cửa" },
              { id: "events", icon: Calendar, label: "Sự kiện & Hoạt động" },
              { id: "counseling", icon: LifeBuoy, label: "Hỗ trợ sinh viên" },
              { id: "reports", icon: BarChart3, label: "Báo cáo & Thống kê" },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 14,
                    padding: "11px 16px", borderRadius: 10, fontSize: 13.5,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#9A3412" : "#475569",
                    background: isActive ? "#FFEDD5" : "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s ease"
                  }}
                >
                  <tab.icon size={18} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#9A3412" : "#64748B"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom */}
        <div>
          <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
            <button
              onClick={() => showToast("Đã mở cấu hình tham số dịch vụ CTSV")}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "#475569", background: "transparent", border: "none", cursor: "pointer"
              }}
            >
              <Settings size={17} /> Settings
            </button>
            <button
              onClick={() => setShowHelpModal(true)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "#475569", background: "transparent", border: "none", cursor: "pointer"
              }}
            >
              <SupportIcon size={17} /> Support
            </button>
          </div>

          <div style={{ padding: "14px 18px", borderTop: "1px solid #F1F5F9", background: "#FAFBFD", marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#FFEDD5", color: "#9A3412", display: "flex",
                  alignItems: "center", justifyContent: "center", fontWeight: 800,
                  fontSize: 13, border: "1.5px solid #FDBA74"
                }}>
                  SV
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Nguyễn Thị A.</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Cán bộ CTSV</div>
                </div>
              </div>
              <button
                onClick={() => navigate("/login")}
                title="Đăng xuất"
                style={{
                  width: 32, height: 32, borderRadius: 8, border: "1px solid #E2E8F0",
                  background: "#FFFFFF", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "#64748B"
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main style={{ flex: 1, height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* ── TOP NAVBAR ── */}
        <header style={{
          height: 64, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
          padding: "0 32px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 20
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#9A3412", letterSpacing: "-0.2px" }}>
            SAO Portal - FPT University
          </div>

          <div style={{ position: "relative", width: 440, maxWidth: "45%" }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder={
                activeTab === "onestop" ? "Search requests..." :
                activeTab === "events" ? "Search events..." :
                activeTab === "counseling" ? "Tìm kiếm case, MSSV..." :
                "Tìm kiếm báo cáo, câu lạc bộ..."
              }
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              style={{
                width: "100%", padding: "9px 14px 9px 38px", borderRadius: 10,
                border: "1px solid #CBD5E1", fontSize: 13, outline: "none",
                background: "#F8FAFC", boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: 36, height: 36, borderRadius: "50%", border: "1px solid #E2E8F0",
                  background: "#FFFFFF", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "#475569"
                }}
              >
                <Bell size={16} />
                <span style={{
                  position: "absolute", top: 7, right: 7, width: 7, height: 7,
                  borderRadius: "50%", background: "#DC2626"
                }} />
              </button>

              {showNotifications && (
                <div style={{
                  position: "absolute", top: 46, right: 0, width: 320,
                  background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)", padding: "14px 16px", zIndex: 100
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: "#0F172A" }}>Thông Báo CTSV</span>
                    <span style={{ fontSize: 11, color: "#2563EB", cursor: "pointer" }} onClick={() => setShowNotifications(false)}>Đóng</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12.5 }}>
                    <div style={{ padding: "8px 10px", background: "#FEF3C7", borderRadius: 8, color: "#92400E" }}>
                      ⚠️ Có <strong>7 case khẩn cấp</strong> cần tư vấn tâm lý và hỗ trợ học phí.
                    </div>
                    <div style={{ padding: "8px 10px", background: "#EFF6FF", borderRadius: 8, color: "#1E40AF" }}>
                      🎪 <strong>CLB FPTU Tech</strong> vừa gửi đề xuất hội thảo AI chờ duyệt.
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowHelpModal(true)}
              style={{
                width: 36, height: 36, borderRadius: "50%", border: "1px solid #E2E8F0",
                background: "#FFFFFF", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", color: "#475569"
              }}
            >
              <HelpCircle size={16} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 6 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "#FFEDD5", color: "#9A3412", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 12.5, fontWeight: 800
              }}>
                NA
              </div>
              <span onClick={() => navigate("/login")} style={{ fontSize: 13, fontWeight: 700, color: "#475569", cursor: "pointer" }}>
                Sign Out
              </span>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT OUTLET ── */}
        <div style={{ flex: 1, padding: "28px 32px 48px", maxWidth: 1440, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

          {/* =========================================================================
              MÀN HÌNH 1: DỊCH VỤ MỘT CỬA (EXACT SCREENSHOT 1)
             ========================================================================= */}
          {(activeTab === "onestop" || activeTab === "dashboard") && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.4px" }}>
                    Dịch vụ một cửa
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: "4px 0 0", fontWeight: 500 }}>
                    Quản lý và xử lý các yêu cầu hành chính của sinh viên.
                  </p>
                </div>

                <button
                  onClick={handleExportOneStopExcel}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
                    borderRadius: 10, border: "1.5px solid #CBD5E1", background: "#FFFFFF",
                    color: "#1E293B", fontWeight: 700, fontSize: 13.5, cursor: "pointer"
                  }}
                >
                  <Download size={16} strokeWidth={2.2} /> Xuất báo cáo
                </button>
              </div>

              {/* 3 KPI Cards (Ảnh 1) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr 1.2fr", gap: 18, marginBottom: 24 }}>
                {/* Card 1: Yêu cầu mới */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700, color: "#334155" }}>
                      <FileText size={17} color="#EA580C" /> Yêu cầu mới trong ngày
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, background: "#FFEDD5", color: "#C2410C", padding: "2px 8px", borderRadius: 6 }}>
                      📈 +12%
                    </span>
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px" }}>
                    48
                  </div>
                </div>

                {/* Card 2: Thời gian xử lý TB */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700, color: "#334155" }}>
                      <Clock size={17} color="#2563EB" /> Thời gian xử lý TB
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, background: "#ECFDF5", color: "#065F46", padding: "2px 8px", borderRadius: 6 }}>
                      📉 -2h
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px" }}>1.5</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#475569" }}>ngày</span>
                  </div>
                </div>

                {/* Card 3: Tỷ lệ hoàn thành (SLA) */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700, color: "#334155", marginBottom: 8 }}>
                    <CheckCircle size={17} color="#16A34A" /> Tỷ lệ hoàn thành (SLA)
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px" }}>
                    94.2%
                  </div>
                  <div style={{ width: "100%", height: 8, borderRadius: 4, background: "#0F172A", marginTop: 12, overflow: "hidden" }}>
                    <div style={{ width: "94.2%", height: "100%", background: "#EA580C" }} />
                  </div>
                </div>
              </div>

              {/* Filter Bar (Ảnh 1) */}
              <div style={{
                background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0",
                padding: "12px 18px", display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: 14, marginBottom: 16
              }}>
                <div style={{ position: "relative", width: 340 }}>
                  <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                  <input
                    placeholder="Tìm MSSV, Tên SV..."
                    value={oneStopSearch}
                    onChange={e => setOneStopSearch(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <select
                    value={oneStopFilterType}
                    onChange={e => setOneStopFilterType(e.target.value)}
                    style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFFFFF", outline: "none" }}
                  >
                    <option value="ALL">Tất cả loại yêu cầu</option>
                    <option value="giấy xác nhận">Xin giấy xác nhận sinh viên</option>
                    <option value="thẻ sinh viên">Cấp lại thẻ sinh viên</option>
                    <option value="phòng tự học">Mượn phòng tự học</option>
                    <option value="nghĩa vụ quân sự">Tạm hoãn nghĩa vụ quân sự</option>
                  </select>

                  <select
                    value={oneStopSemester}
                    onChange={e => setOneStopSemester(e.target.value)}
                    style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFFFFF", outline: "none" }}
                  >
                    <option value="SP24">Học kỳ SP24</option>
                    <option value="SU24">Học kỳ SU24</option>
                    <option value="FA23">Học kỳ FA23</option>
                  </select>

                  <button
                    onClick={() => showToast("Đã kích hoạt bộ lọc nâng cao")}
                    style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#475569" }}
                  >
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              {/* Data Table (Ảnh 1) */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>MSSV</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>SINH VIÊN</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>LOẠI YÊU CẦU</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>NGÀY GỬI</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>TRẠNG THÁI</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5, textAlign: "right" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => (
                      <tr key={req.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "16px 18px", fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>
                          {req.mssv}
                        </td>

                        <td style={{ padding: "16px 18px" }}>
                          <div style={{ fontWeight: 800, color: "#0F172A" }}>{req.studentName}</div>
                          <div style={{ fontSize: 11.5, color: "#64748B" }}>{req.major}</div>
                        </td>

                        <td style={{ padding: "16px 18px", color: "#334155", fontWeight: 600 }}>
                          {req.type}
                        </td>

                        <td style={{ padding: "16px 18px", color: "#64748B" }}>
                          {req.date}
                        </td>

                        <td style={{ padding: "16px 18px" }}>
                          <span style={{
                            padding: "4px 12px", borderRadius: 100, fontSize: 11.5, fontWeight: 700,
                            background: req.statusBg, color: req.statusColor, display: "inline-flex", alignItems: "center", gap: 5
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: req.statusColor }} />
                            {req.statusText}
                          </span>
                        </td>

                        <td style={{ padding: "16px 18px", textAlign: "right" }}>
                          <button
                            onClick={() => setShowRequestDetailModal(req)}
                            style={{ border: "none", background: "transparent", cursor: "pointer", color: "#2563EB" }}
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer Pagination (Ảnh 1) */}
                <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", background: "#FFFFFF", fontSize: 12.5, color: "#64748B" }}>
                  <div>Hiển thị 1-5 trong 48 yêu cầu</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569" }}>&lt;</button>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #EA580C", background: "#EA580C", color: "#FFFFFF", fontWeight: 700 }}>1</button>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569" }}>2</button>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569" }}>3</button>
                    <span>...</span>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569" }}>10</button>
                    <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569" }}>&gt;</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 2: QUẢN LÝ SỰ KIỆN & HOẠT ĐỘNG (EXACT SCREENSHOT 2)
             ========================================================================= */}
          {activeTab === "events" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.4px" }}>
                    Quản lý Sự kiện & Hoạt động
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: "4px 0 0", fontWeight: 500 }}>
                    Tổng quan lịch trình và phê duyệt đề xuất từ các CLB
                  </p>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => showToast("Đã kích hoạt bộ lọc sự kiện theo CLB")}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, border: "1.5px solid #CBD5E1", background: "#FFFFFF", color: "#1E293B", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                  >
                    <Filter size={15} /> Filter
                  </button>
                  <button
                    onClick={() => setShowNewEventModal(true)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 10, border: "none", background: "#9A3412", color: "#FFFFFF", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                  >
                    <Plus size={16} /> Tạo sự kiện mới
                  </button>
                </div>
              </div>

              {/* Hàng 1: Biểu đồ Tỷ lệ tham gia + Thống kê Chờ duyệt & Ngân sách (Ảnh 2) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 20, marginBottom: 24 }}>

                {/* Biểu đồ Tỷ lệ SV tham gia hoạt động */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 800, color: "#0F172A" }}>
                      <BarChart3 size={17} color="#9A3412" /> Tỷ lệ sinh viên tham gia hoạt động (2023)
                    </div>
                    <select style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12, background: "#FFFFFF" }}>
                      <option>Năm nay</option>
                      <option>Năm ngoái</option>
                    </select>
                  </div>

                  <div style={{ width: "100%", height: 160 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={eventParticipationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="month" fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
                        <Tooltip contentStyle={{ background: "#0F172A", borderRadius: 8, color: "#FFF", fontSize: 12 }} formatter={v => [`${v}%`, "Tỷ lệ tham gia"]} />
                        <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                          {eventParticipationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.isPeak ? "#9A3412" : "#0284C7"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2 Card Nhỏ Bên Phải */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Chờ duyệt */}
                  <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Chờ duyệt</span>
                      <ClipboardList size={18} color="#EA580C" />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>12</div>
                    <div style={{ fontSize: 11.5, color: "#64748B" }}>Sự kiện cần xử lý tuần này</div>
                  </div>

                  {/* Ngân sách đã cấp */}
                  <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Ngân sách đã cấp</span>
                      <Award size={18} color="#2563EB" />
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>450M / 1B VNĐ</div>
                    <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#E2E8F0", overflow: "hidden" }}>
                      <div style={{ width: "45%", height: "100%", background: "#0284C7" }} />
                    </div>
                  </div>
                </div>

              </div>

              {/* Hàng 2: Lịch Tháng 10 + Danh sách Đề xuất & Sự kiện sắp tới (Ảnh 2) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: 20, alignItems: "start" }}>

                {/* Cột trái: Mini Calendar */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <strong style={{ fontSize: 14.5, color: "#0F172A" }}>Lịch Tháng 10</strong>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}><ChevronLeft size={16} /></button>
                      <button style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}><ChevronRight size={16} /></button>
                    </div>
                  </div>

                  {/* Lưới ngày */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, textAlign: "center", fontSize: 11.5 }}>
                    <span style={{ color: "#DC2626", fontWeight: 700 }}>T2</span>
                    <span style={{ color: "#64748B", fontWeight: 700 }}>T3</span>
                    <span style={{ color: "#64748B", fontWeight: 700 }}>T4</span>
                    <span style={{ color: "#64748B", fontWeight: 700 }}>T5</span>
                    <span style={{ color: "#64748B", fontWeight: 700 }}>T6</span>
                    <span style={{ color: "#64748B", fontWeight: 700 }}>T7</span>
                    <span style={{ color: "#DC2626", fontWeight: 700 }}>CN</span>

                    {[28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day, idx) => {
                      const isSelected = day === selectedCalendarDay;
                      const isEventDay = [8, 11, 15, 20].includes(day);
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedCalendarDay(day)}
                          style={{
                            padding: "8px 0", borderRadius: "50%", cursor: "pointer",
                            background: isSelected ? "#0284C7" : "transparent",
                            color: isSelected ? "#FFFFFF" : idx < 3 ? "#CBD5E1" : "#334155",
                            fontWeight: isSelected ? 800 : 500, position: "relative"
                          }}
                        >
                          {day}
                          {isEventDay && !isSelected && (
                            <span style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "#EA580C" }} />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 14, marginTop: 14, fontSize: 12, color: "#64748B" }}>
                    Sự kiện ngày <strong>{selectedCalendarDay}/10</strong>: {selectedCalendarDay === 11 ? "Cuộc thi Thiết kế Web (WebDesign Contest)" : selectedCalendarDay === 15 ? "Hội thảo AI & Việc làm" : "Không có lịch tổ chức"}
                  </div>
                </div>

                {/* Cột phải: Danh sách Đề xuất & Sự kiện sắp tới (Ảnh 2) */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h3 style={{ fontSize: 15.5, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                      Danh sách Đề xuất & Sự kiện sắp tới
                    </h3>
                    <div style={{ display: "flex", gap: 12, fontSize: 12, fontWeight: 700 }}>
                      <span style={{ color: "#D97706", display: "flex", alignItems: "center", gap: 4 }}>
                        ● Chờ duyệt
                      </span>
                      <span style={{ color: "#16A34A", display: "flex", alignItems: "center", gap: 4 }}>
                        ● Đã duyệt
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {clubEvents.map((ev) => (
                      <div key={ev.id} style={{ padding: "16px 18px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                          <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: 0 }}>{ev.title}</h4>
                          <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800, color: ev.statusColor, background: ev.statusBg }}>
                            {ev.statusText}
                          </span>
                        </div>

                        <div style={{ fontSize: 12.5, color: "#475569", display: "flex", gap: 16, marginBottom: 8 }}>
                          <span>👥 {ev.club}</span>
                          <span>🏛️ {ev.location}</span>
                        </div>

                        <div style={{ fontSize: 12, color: "#64748B", display: "flex", gap: 16, marginBottom: 14 }}>
                          <span>📅 {ev.date}</span>
                          {ev.expected && <span>👤 Dự kiến: {ev.expected}</span>}
                          {ev.registered && <span>👤 Đăng ký: {ev.registered}</span>}
                          {ev.budget && <span>💰 Đề xuất: {ev.budget}</span>}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: 10 }}>
                          {ev.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleApproveEvent(ev)}
                                style={{ padding: "7px 14px", borderRadius: 8, background: "#10B981", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                              >
                                <Check size={14} /> Duyệt sự kiện
                              </button>
                              <button
                                onClick={() => showToast(`Xem chi tiết đề xuất ${ev.title}`)}
                                style={{ padding: "7px 14px", borderRadius: 8, background: "#FFFFFF", color: "#334155", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                              >
                                ℹ️ Chi tiết
                              </button>
                            </>
                          )}

                          {ev.status === "APPROVED" && (
                            <>
                              <button
                                onClick={() => handleDisburseEventBudget(ev)}
                                style={{ padding: "7px 14px", borderRadius: 8, background: "#0284C7", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                              >
                                💳 Cấp ngân sách
                              </button>
                              <button
                                onClick={() => showToast(`Cộng điểm rèn luyện cho sự kiện ${ev.title}`)}
                                style={{ padding: "7px 14px", borderRadius: 8, background: "#FFFFFF", color: "#0F172A", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                              >
                                🏆 Theo dõi điểm Rèn luyện
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 3: HỖ TRỢ SINH VIÊN & TƯ VẤN (EXACT SCREENSHOT 3)
             ========================================================================= */}
          {activeTab === "counseling" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.4px" }}>
                  Hỗ trợ sinh viên & Tư vấn
                </h1>
              </div>

              {/* 3 KPI Cards (Ảnh 3) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, marginBottom: 24 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#64748B", letterSpacing: "0.5px" }}>ĐANG XỬ LÝ</span>
                    <Clock size={16} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A" }}>42</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>↓ 12% so với tuần trước</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#DC2626", letterSpacing: "0.5px" }}>KHẨN CẤP</span>
                    <ShieldAlert size={16} color="#DC2626" />
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A" }}>7</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginTop: 4 }}>↑ Cần xử lý ngay</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#16A34A", letterSpacing: "0.5px" }}>ĐỘ HÀI LÒNG</span>
                    <Smile size={16} color="#16A34A" />
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 34, fontWeight: 900, color: "#0F172A" }}>4.8</span>
                    <span style={{ fontSize: 13, color: "#64748B" }}>/ 5.0 (tháng này)</span>
                  </div>
                </div>
              </div>

              {/* 2 Cột: Danh sách Case bên trái + Chi tiết Case bên phải (Ảnh 3) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1.1fr", gap: 22, alignItems: "start" }}>

                {/* Danh sách Case */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 900, color: "#0F172A" }}>
                      Danh sách Case <span style={{ fontSize: 12, background: "#F1F5F9", padding: "2px 8px", borderRadius: 10 }}>42</span>
                    </div>
                    <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      <Filter size={13} /> Lọc
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {counselingCases.map((c) => {
                      const isSelected = selectedCase?.id === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCase(c)}
                          style={{
                            padding: "16px 18px", borderRadius: 12,
                            background: isSelected ? "#F8FAFC" : "#FFFFFF",
                            border: isSelected ? "2px solid #0284C7" : "1px solid #E2E8F0",
                            cursor: "pointer", transition: "all 0.15s"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10.5, fontWeight: 800, color: c.priorityColor, background: c.priorityBg }}>
                                {c.priorityText}
                              </span>
                              <span style={{ fontSize: 11.5, color: "#64748B", fontFamily: "monospace" }}>#{c.id}</span>
                            </div>
                            <span style={{ fontSize: 11.5, color: "#94A3B8" }}>{c.time}</span>
                          </div>

                          <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
                            {c.title}
                          </div>

                          <div style={{ fontSize: 12, color: "#64748B", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span>👤 {c.studentName} ({c.studentCode})</span>
                            <ChevronRight size={15} color="#94A3B8" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chi tiết Case đang chọn (Ảnh 3) */}
                {selectedCase && (
                  <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <span style={{ fontSize: 11.5, fontFamily: "monospace", fontWeight: 800, color: "#0284C7" }}>#{selectedCase.id}</span>
                      <MoreVertical size={16} color="#94A3B8" />
                    </div>

                    <h3 style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", margin: "0 0 16px", lineHeight: 1.3 }}>
                      {selectedCase.title}
                    </h3>

                    {/* Profile Box */}
                    <div style={{ padding: "14px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#DBEAFE", color: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15 }}>
                        {selectedCase.studentName.split(" ").pop()[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{selectedCase.studentName}</div>
                        <div style={{ fontSize: 11.5, color: "#64748B" }}>{selectedCase.studentCode} • {selectedCase.major}</div>
                      </div>
                    </div>

                    {/* GPA & Trạng thái */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16, fontSize: 12.5 }}>
                      <div>
                        <div style={{ color: "#64748B", fontSize: 11, fontWeight: 700 }}>GPA HIỆN TẠI</div>
                        <strong style={{ color: "#0F172A", fontSize: 14 }}>{selectedCase.gpa}</strong>
                      </div>
                      <div>
                        <div style={{ color: "#64748B", fontSize: 11, fontWeight: 700 }}>TRẠNG THÁI HỌC TẬP</div>
                        <span style={{ color: "#16A34A", fontWeight: 700 }}>{selectedCase.status}</span>
                      </div>
                    </div>

                    {/* Chi tiết yêu cầu */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 800, color: "#64748B", marginBottom: 6 }}>CHI TIẾT YÊU CẦU</div>
                      <p style={{ fontSize: 13, color: "#334155", background: "#F8FAFC", padding: "12px 14px", borderRadius: 10, border: "1px solid #F1F5F9", lineHeight: 1.6, margin: 0 }}>
                        {selectedCase.content}
                      </p>
                    </div>

                    {/* Lịch sử hỗ trợ */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 800, color: "#64748B", marginBottom: 6 }}>LỊCH SỬ HỖ TRỢ</div>
                      <div style={{ fontSize: 12, color: "#64748B", borderLeft: "2px solid #CBD5E1", paddingLeft: 10 }}>
                        {selectedCase.history}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <button
                        onClick={() => setShowAppointmentModal(true)}
                        style={{
                          width: "100%", padding: "11px", borderRadius: 10,
                          background: "#9A3412", color: "#FFFFFF", border: "none",
                          fontWeight: 700, fontSize: 13.5, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                        }}
                      >
                        <Calendar size={16} /> Đặt lịch hẹn tư vấn
                      </button>

                      <button
                        onClick={() => showToast(`Đã gửi thông báo nhắc nhở tới sinh viên ${selectedCase.studentName}`)}
                        style={{
                          width: "100%", padding: "11px", borderRadius: 10,
                          background: "#FFFFFF", color: "#2563EB", border: "1.5px solid #CBD5E1",
                          fontWeight: 700, fontSize: 13.5, cursor: "pointer",
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                        }}
                      >
                        <Send size={15} /> Gửi thông báo nhắc nhở
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 4: BÁO CÁO & THỐNG KÊ (EXACT SCREENSHOT 4)
             ========================================================================= */}
          {activeTab === "reports" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.4px" }}>
                    Báo cáo & Thống kê
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: "4px 0 0", fontWeight: 500 }}>
                    Học kỳ Spring 2024 (01/01/2024 - 30/04/2024)
                  </p>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <select
                    value={reportSemester}
                    onChange={e => setReportSemester(e.target.value)}
                    style={{ padding: "9px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", background: "#FFFFFF", fontSize: 13, fontWeight: 700, color: "#0F172A" }}
                  >
                    <option>Học kỳ Spring 2024</option>
                    <option>Học kỳ Fall 2023</option>
                    <option>Học kỳ Summer 2023</option>
                  </select>

                  <button
                    onClick={handleExportAllReports}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, border: "1.5px solid #CBD5E1", background: "#FFFFFF", color: "#1E293B", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                  >
                    <Download size={16} /> Export All
                  </button>
                </div>
              </div>

              {/* 4 KPI Cards (Ảnh 4) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 22 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Tổng Yêu Cầu</span>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FFEDD5", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FileText size={15} />
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>12,450</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>📈 +15% so với kỳ trước</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Điểm Rèn Luyện TB</span>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#DBEAFE", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Star size={15} />
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>82.5</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>— Không đổi so với kỳ trước</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Sự Kiện Tổ Chức</span>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Calendar size={15} />
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>145</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>📈 +8 sự kiện</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Sinh Viên Vi Phạm</span>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ShieldAlert size={15} />
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>32</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 4 }}>📉 -12% so với kỳ trước</div>
                </div>
              </div>

              {/* Hàng giữa: Phân Bổ Dịch Vụ + Lưu Lượng Yêu Cầu Theo Tháng (Ảnh 4) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 20, marginBottom: 22 }}>

                {/* Donut Chart: Phân Bổ Dịch Vụ */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: 0 }}>Phân Bổ Dịch Vụ</h3>
                    <MoreVertical size={16} color="#94A3B8" />
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 180, position: "relative" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={serviceDistributionData} innerRadius={55} outerRadius={75} paddingAngle={2} dataKey="value">
                          {serviceDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position: "absolute", textAlign: "center" }}>
                      <div style={{ fontSize: 20, fontWeight: 900, color: "#0F172A" }}>100%</div>
                      <div style={{ fontSize: 10.5, color: "#64748B" }}>Đã xử lý</div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, fontWeight: 600, marginTop: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 10, height: 10, background: "#9A3412", borderRadius: 2 }} /> Giấy tờ (45%)
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 10, height: 10, background: "#2563EB", borderRadius: 2 }} /> Học vụ (30%)
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 10, height: 10, background: "#1D4ED8", borderRadius: 2 }} /> Tài chính (15%)
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 10, height: 10, background: "#E2E8F0", borderRadius: 2 }} /> Khác (10%)
                    </div>
                  </div>
                </div>

                {/* Biểu đồ Lưu Lượng Yêu Cầu Theo Tháng */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: 0 }}>Lưu Lượng Yêu Cầu Theo Tháng</h3>
                      <div style={{ fontSize: 11.5, color: "#64748B" }}>So sánh với cùng kỳ năm ngoái</div>
                    </div>
                    <span onClick={() => showToast("Đã xuất biểu đồ lưu lượng ra file PDF")} style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                      📄 PDF
                    </span>
                  </div>

                  <div style={{ width: "100%", height: 210 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyVolumeData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="month" fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} tickFormatter={v => `${v}k`} domain={[0, 4]} />
                        <Tooltip formatter={v => [`${v}k yêu cầu`, "Lưu lượng"]} contentStyle={{ background: "#0F172A", borderRadius: 8, color: "#FFF", fontSize: 12 }} />
                        <Line type="monotone" dataKey="requests" stroke="#9A3412" strokeWidth={2} dot={{ r: 5, fill: "#9A3412" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Hàng dưới: Xếp Hạng Hoạt Động Câu Lạc Bộ (Ảnh 4) */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 15.5, fontWeight: 900, color: "#0F172A", margin: 0 }}>Xếp Hạng Hoạt Động Câu Lạc Bộ</h3>
                    <div style={{ fontSize: 12, color: "#64748B" }}>Top 5 câu lạc bộ có chỉ số hoạt động cao nhất</div>
                  </div>

                  <button
                    onClick={() => {
                      const data = clubRankings.map(c => ({
                        "Hạng": c.rank,
                        "Tên CLB": c.name,
                        "Số Sự Kiện": c.events,
                        "Sinh Viên Tham Gia": c.participants,
                        "Điểm Đánh Giá": c.score
                      }));
                      const ws = XLSX.utils.json_to_sheet(data);
                      const wb = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wb, ws, "CLB_Ranking");
                      XLSX.writeFile(wb, "XepHang_CLB_FPT.xlsx");
                      showToast("Đã xuất bảng xếp hạng CLB ra file Excel!");
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  >
                    <FileSpreadsheet size={14} color="#16A34A" /> Excel
                  </button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "10px 14px", fontWeight: 700, width: 60 }}>Hạng</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>Tên Câu Lạc Bộ</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700, textAlign: "center" }}>Số Sự Kiện</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700, textAlign: "center" }}>Sinh Viên Tham Gia</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700, textAlign: "center" }}>Điểm Đánh Giá</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700, textAlign: "right" }}>Xu Hướng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clubRankings.map((c) => (
                      <tr key={c.rank} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "14px", fontWeight: 900, color: "#9A3412" }}>{c.rank}</td>
                        <td style={{ padding: "14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 6, background: "#0284C7", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11 }}>
                              {c.badge}
                            </div>
                            <strong style={{ color: "#0F172A" }}>{c.name}</strong>
                          </div>
                        </td>
                        <td style={{ padding: "14px", textAlign: "center", fontWeight: 700 }}>{c.events}</td>
                        <td style={{ padding: "14px", textAlign: "center", color: "#475569" }}>{c.participants}</td>
                        <td style={{ padding: "14px", textAlign: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                            <div style={{ width: 80, height: 6, borderRadius: 3, background: "#E2E8F0", overflow: "hidden" }}>
                              <div style={{ width: `${(c.score / 10) * 100}%`, height: "100%", background: "#10B981" }} />
                            </div>
                            <span style={{ fontWeight: 800, color: "#0F172A" }}>{c.score}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px", textAlign: "right", color: "#16A34A", fontWeight: 800 }}>
                          ↗
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* =========================================================================
          MODALS
         ========================================================================= */}
      {/* Modal 1: Chi tiết yêu cầu một cửa */}
      {showRequestDetailModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 480, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                  Chi Tiết Yêu Cầu Một Cửa
                </h3>
                <span style={{ fontSize: 12, color: "#64748B" }}>Mã đơn: {showRequestDetailModal.id}</span>
              </div>
              <button onClick={() => setShowRequestDetailModal(null)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 0", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Sinh viên:</span>
                <strong style={{ color: "#0F172A" }}>{showRequestDetailModal.studentName} ({showRequestDetailModal.mssv})</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Chuyên ngành:</span>
                <span style={{ color: "#334155" }}>{showRequestDetailModal.major}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Loại yêu cầu:</span>
                <strong style={{ color: "#9A3412" }}>{showRequestDetailModal.type}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Ngày gửi:</span>
                <span style={{ color: "#475569" }}>{showRequestDetailModal.date}</span>
              </div>
              <div style={{ marginTop: 6, padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, fontSize: 12.5, color: "#475569" }}>
                📝 <strong>Nội dung:</strong> {showRequestDetailModal.note}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 12, marginTop: 18 }}>
              <button onClick={() => handleRejectRequest(showRequestDetailModal)} style={{ padding: "10px", borderRadius: 8, background: "#FEE2E2", color: "#DC2626", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Từ chối đơn
              </button>
              <button onClick={() => handleApproveRequest(showRequestDetailModal)} style={{ padding: "10px", borderRadius: 8, background: "#16A34A", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                ✓ Phê Duyệt & Xuất Giấy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Tạo yêu cầu mới */}
      {showNewRequestModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 460, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Tạo Yêu Cầu Một Cửa Mới
              </h3>
              <button onClick={() => setShowNewRequestModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>MÃ SỐ SINH VIÊN (MSSV)</label>
                <input placeholder="VD: SE160234" style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>LOẠI GIẤY TỜ / DỊCH VỤ</label>
                <select style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFF" }}>
                  <option>Xin giấy xác nhận sinh viên</option>
                  <option>Cấp lại thẻ sinh viên</option>
                  <option>Mượn phòng tự học / Phòng sinh hoạt CLB</option>
                  <option>Tạm hoãn nghĩa vụ quân sự</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>GHI CHÚ / YÊU CẦU ĐẶC BIỆT</label>
                <textarea rows={3} placeholder="Mục đích sử dụng, số bản in..." style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => setShowNewRequestModal(false)} style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Hủy</button>
              <button onClick={() => { setShowNewRequestModal(false); showToast("Đã tiếp nhận yêu cầu hành chính mới của sinh viên!"); }} style={{ padding: "10px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Tạo Đơn</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Đặt lịch hẹn tư vấn */}
      {showAppointmentModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 460, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Đặt Lịch Hẹn Tư Vấn Tâm Lý / Học Vụ
              </h3>
              <button onClick={() => setShowAppointmentModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, marginBottom: 14, fontSize: 12.5 }}>
              Sinh viên: <strong>{selectedCase?.studentName}</strong> ({selectedCase?.studentCode})
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>NGÀY HẸN GẶP</label>
                <input type="date" defaultValue="2023-10-18" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>GIỜ HẸN</label>
                <input type="time" defaultValue="09:30" style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>ĐỊA ĐIỂM / HÌNH THỨC</label>
                <select style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFF" }}>
                  <option>Phòng Tư Vấn Tâm Lý (P.108 Tòa Alpha)</option>
                  <option>Phòng Công Tác Sinh Viên (P.102 Tòa Beta)</option>
                  <option>Online qua Google Meet</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => setShowAppointmentModal(false)} style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Hủy</button>
              <button onClick={() => { setShowAppointmentModal(false); showToast(`Đã gửi thư mời hẹn tư vấn tới sinh viên ${selectedCase?.studentName}!`); }} style={{ padding: "10px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Xác Nhận Lịch Hẹn</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Tạo sự kiện mới */}
      {showNewEventModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 460, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Đề Xuất Sự Kiện CLB Mới
              </h3>
              <button onClick={() => setShowNewEventModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>TÊN SỰ KIỆN</label>
                <input placeholder="VD: Ngày hội việc làm Job Fair 2024" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>CÂU LẠC BỘ TỔ CHỨC</label>
                <select style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFF" }}>
                  <option>CLB FPTU Tech</option>
                  <option>CLB Tiếng Nhật JVC</option>
                  <option>CLB Melody Club</option>
                  <option>CLB Sách & Hành Động</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>ĐỊA ĐIỂM DỰ KIẾN</label>
                <input placeholder="VD: Hội trường Gamma hoặc Sân Alpha" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>DỰ TRÙ KINH PHÍ (VND)</label>
                <input placeholder="VD: 10.000.000" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => setShowNewEventModal(false)} style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Hủy</button>
              <button onClick={() => { setShowNewEventModal(false); showToast("Đã tạo đề xuất sự kiện mới đưa vào danh sách chờ duyệt!"); }} style={{ padding: "10px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Tạo Sự Kiện</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: Help & Support */}
      {showHelpModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 480, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: "0 0 10px" }}>
              Hướng Dẫn Nghiệp Vụ Cán Bộ CTSV
            </h3>
            <ul style={{ fontSize: 13, color: "#334155", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <li><strong>Dịch vụ một cửa:</strong> Tiếp nhận, phê duyệt và cấp phát giấy xác nhận sinh viên, thẻ SV, giấy hoãn nghĩa vụ quân sự và phòng tự học.</li>
              <li><strong>Sự kiện & Hoạt động:</strong> Phê duyệt kế hoạch sự kiện các CLB, cấp kinh phí tổ chức và chấm điểm rèn luyện.</li>
              <li><strong>Hỗ trợ sinh viên & Tư vấn:</strong> Xử lý case tư vấn tâm lý, hoàn cảnh khó khăn và đặt lịch hẹn tư vấn 1-1.</li>
              <li><strong>Báo cáo & Thống kê:</strong> Theo dõi lưu lượng xử lý yêu cầu, phân bổ dịch vụ và bảng xếp hạng hoạt động CLB.</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowHelpModal(false)} style={{ padding: "10px 20px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
