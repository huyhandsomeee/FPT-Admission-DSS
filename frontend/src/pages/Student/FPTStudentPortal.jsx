import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Calendar, GraduationCap, BookOpen, DollarSign,
  Award, LifeBuoy, Search, Bell, HelpCircle, Download, Plus,
  CheckCircle, AlertTriangle, Filter, Check, X, ChevronRight,
  ChevronLeft, TrendingUp, TrendingDown, Eye, FileSpreadsheet,
  RefreshCw, LogOut, Mail, Settings, MoreVertical, Building,
  Clock, CheckCircle2, XCircle, Star, MessageSquare, Send,
  UserCheck, ShieldCheck, ArrowRight, Smile, Flame, FileCheck,
  Layers, Upload, CreditCard, Receipt, ExternalLink, Library,
  FileText, Utensils, AlertCircle, Sparkles, BookMarked, Users,
  Activity, MapPin, Tag, FilePlus, Inbox, History, Compass
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import * as XLSX from "xlsx";

export default function FPTStudentPortal() {
  const navigate = useNavigate();

  // Active Tab State:
  // dashboard: Dashboard (Ảnh 1)
  // schedule: Lịch học & Lịch thi / Schedule (Ảnh 3)
  // gradebook: Kết quả học tập / Gradebook (Ảnh 2)
  // lms: Quản lý Bài tập / LMS (Ảnh 4)
  // finance: Tài chính & Học phí / Finance (Ảnh 5)
  // events: Sự Kiện & Hoạt Động (Mới - Khớp ảnh)
  // services: Dịch vụ một cửa sinh viên (Mới - Gửi yêu cầu lên phòng CTSV)
  const [activeTab, setActiveTab] = useState("dashboard");

  // ─── Search & Toast ───
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── MODALS ───
  const [showSupportTicketModal, setShowSupportTicketModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showSubmitAssignmentModal, setShowSubmitAssignmentModal] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEventDetailModal, setShowEventDetailModal] = useState(null);
  const [showCreateServiceRequestModal, setShowCreateServiceRequestModal] = useState(null);

  // ─── TAB 1: DASHBOARD (ẢNH 1) ───
  const gpaTrendData = [
    { semester: "SP23", gpa: 8.2, termGpa: 8.2 },
    { semester: "SU23", gpa: 8.0, termGpa: 7.6 },
    { semester: "FA23", gpa: 8.4, termGpa: 8.5 },
    { semester: "SP24", gpa: 8.4, termGpa: 8.4 },
    { semester: "SU24", gpa: 8.4, termGpa: 8.4 },
  ];

  const [deadlines, setDeadlines] = useState([
    {
      id: "DL-01",
      code: "PRJ",
      title: "Assignment 2: Java Web Application",
      due: "Còn 12 giờ",
      badgeColor: "#FEE2E2",
      textColor: "#DC2626",
      urgent: true
    },
    {
      id: "DL-02",
      code: "SWT",
      title: "Lab 4: JUnit Test Cases",
      due: "26/05/2024",
      badgeColor: "#EFF6FF",
      textColor: "#2563EB",
      urgent: true
    },
    {
      id: "DL-03",
      code: "ITE",
      title: "Quiz 3: Ethics in Computing",
      due: "28/05/2024",
      badgeColor: "#F1F5F9",
      textColor: "#475569",
      urgent: false
    }
  ]);

  // ─── TAB 2: GRADEBOOK - KẾT QUẢ HỌC TẬP (ẢNH 2) ───
  const [gradeSemesterFilter, setGradeSemesterFilter] = useState("ALL");

  const gradeHistoryData = [
    { sem: "SP22", termGpa: 7.8, cumGpa: 7.8 },
    { sem: "SU22", termGpa: 8.2, cumGpa: 8.0 },
    { sem: "FA22", termGpa: 8.0, cumGpa: 8.0 },
    { sem: "SP23", termGpa: 8.2, cumGpa: 8.1 },
    { sem: "SU23", termGpa: 6.8, cumGpa: 7.8 },
    { sem: "FA23", termGpa: 8.5, cumGpa: 8.5 },
  ];

  const gradebookData = [
    {
      semester: "Fall 2023",
      courses: [
        { code: "PRJ301", name: "Java Web Application Development", credits: 3, score: 8.5, status: "Đạt", color: "#16A34A", bg: "#DCFCE7" },
        { code: "SWE201c", name: "Introduction to Software Engineering", credits: 3, score: 9.0, status: "Đạt", color: "#16A34A", bg: "#DCFCE7" },
        { code: "ITE302c", name: "Ethics in IT", credits: 3, score: 7.5, status: "Đạt", color: "#16A34A", bg: "#DCFCE7" }
      ]
    },
    {
      semester: "Summer 2023",
      courses: [
        { code: "DBI202", name: "Database Systems", credits: 3, score: 8.0, status: "Đạt", color: "#16A34A", bg: "#DCFCE7" },
        { code: "JPD113", name: "Elementary Japanese 1-A1.1", credits: 3, score: 4.5, status: "Không đạt", color: "#DC2626", bg: "#FEE2E2" }
      ]
    },
    {
      semester: "Spring 2023",
      courses: [
        { code: "PRO192", name: "Object-Oriented Programming", credits: 3, score: 8.2, status: "Đạt", color: "#16A34A", bg: "#DCFCE7" },
        { code: "CEA201", name: "Computer Organization and Architecture", credits: 3, score: 7.8, status: "Đạt", color: "#16A34A", bg: "#DCFCE7" }
      ]
    }
  ];

  // ─── TAB 3: SCHEDULE - LỊCH HỌC & LỊCH THI (ẢNH 3) ───
  const [scheduleType, setScheduleType] = useState("study"); // study | exam
  const [scheduleSemester, setScheduleSemester] = useState("Fall 2023");

  // ─── TAB 4: LMS - QUẢN LÝ BÀI TẬP (ẢNH 4) ───
  const [lmsTab, setLmsTab] = useState("ongoing"); // ongoing | submitted | graded

  const [assignments, setAssignments] = useState([
    {
      id: "ASM-01",
      code: "PRJ301",
      statusBadge: "Chưa nộp",
      statusColor: "#D97706",
      statusBg: "#FEF3C7",
      title: "Assignment 1: Java Web Application",
      deadline: "Hôm nay, 23:59 (Còn 8 tiếng)",
      deadlineColor: "#DC2626",
      iconType: "code",
      tab: "ongoing"
    },
    {
      id: "ASM-02",
      code: "HCI201",
      statusBadge: "Đã nộp",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7",
      title: "Wireframe Project Prototype",
      deadline: "Hạn nộp: 15/10/2023, 23:59",
      deadlineColor: "#64748B",
      iconType: "design",
      tab: "submitted"
    },
    {
      id: "ASM-03",
      code: "DBI202",
      statusBadge: "Đã chấm",
      statusColor: "#2563EB",
      statusBg: "#DBEAFE",
      title: "SQL Query Optimization Quiz",
      deadline: "Hoàn thành lúc: 10/10/2023",
      deadlineColor: "#64748B",
      score: "8.5 /10",
      iconType: "brackets",
      tab: "graded"
    }
  ]);

  // ─── TAB 5: FINANCE - TÀI CHÍNH & HỌC PHÍ (ẢNH 5) ───
  const [financeTransactions, setFinanceTransactions] = useState([
    {
      date: "10/08/2024",
      content: "Đóng học phí kỳ Summer 2024",
      amount: "25,500,000",
      status: "Thành công",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7"
    },
    {
      date: "05/04/2024",
      content: "Đóng học phí kỳ Spring 2024",
      amount: "25,500,000",
      status: "Thành công",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7"
    },
    {
      date: "12/12/2023",
      content: "Đóng học phí kỳ Fall 2023",
      amount: "24,000,000",
      status: "Thành công",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7"
    }
  ]);

  // ─── TAB 6: SỰ KIỆN & HOẠT ĐỘNG (KHỚP 100% ẢNH USER GỬI) ───
  const [eventCategoryFilter, setEventCategoryFilter] = useState("ALL");
  const [eventSearch, setEventSearch] = useState("");

  const eventsList = [
    {
      id: "EV-01",
      category: "Học thuật",
      categoryType: "academic",
      badgeColor: "#9A3412",
      badgeBg: "#FFEDD5",
      isFeatured: true,
      title: "FPT Hackathon 2024: AI cho tương lai",
      description: "Cuộc thi lập trình lớn nhất năm với tổng giải thưởng lên tới 100 triệu đồng. Cơ hội cọ xát kỹ năng công nghệ và giải quyết các bài toán thực tiễn.",
      time: "15 - 17 Tháng 11, 2024",
      location: "Alpha Building, Hola Campus",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "EV-02",
      category: "Văn hóa",
      categoryType: "culture",
      badgeColor: "#059669",
      badgeBg: "#ECFDF5",
      isFeatured: false,
      title: "Hòa nhạc Mùa Thu: Melody of Heart",
      description: "Đêm nhạc thường niên do Melody Club tổ chức với sự tham gia của các ban nhạc acoustic sinh viên.",
      time: "19:00, 20/10/2024",
      location: "Quảng trường 30, ĐH FPT",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "EV-03",
      category: "Học thuật",
      categoryType: "academic",
      badgeColor: "#9A3412",
      badgeBg: "#FFEDD5",
      isFeatured: false,
      title: "Workshop: Kỹ năng quản lý dự án Agile & Scrum",
      description: "Buổi chia sẻ từ chuyên gia Tech Lead FPT Software về quy trình làm việc chuẩn trong doanh nghiệp IT.",
      time: "08:30, 25/10/2024",
      location: "Phòng 201, Tòa Beta",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "EV-04",
      category: "Thể thao",
      categoryType: "sports",
      badgeColor: "#D97706",
      badgeBg: "#FEF3C7",
      isFeatured: false,
      title: "Giải bóng rổ sinh viên FPT Basketball League 2024",
      description: "Giải đấu thường niên quy tụ 16 đội bóng xuất sắc nhất các khối ngành tranh cúp vô địch.",
      time: "16:00, 01/11/2024",
      location: "Nhà thi đấu FPT",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const filteredEvents = useMemo(() => {
    return eventsList.filter(ev => {
      const matchCategory = eventCategoryFilter === "ALL" || ev.category === eventCategoryFilter;
      const q = eventSearch.toLowerCase().trim();
      const matchQ = !q || ev.title.toLowerCase().includes(q) || ev.location.toLowerCase().includes(q);
      return matchCategory && matchQ;
    });
  }, [eventsList, eventCategoryFilter, eventSearch]);

  // ─── TAB 7: DỊCH VỤ SINH VIÊN (GỬI YÊU CẦU LÊN PHÒNG CTSV) ───
  const serviceCatalog = [
    {
      id: "SRV-01",
      title: "Xin giấy xác nhận sinh viên",
      desc: "Phục vụ vay vốn ngân hàng, xin thị thực visa hoặc làm thủ tục hành chính địa phương.",
      fee: "Miễn phí",
      sla: "1 ngày làm việc",
      icon: FileText,
      color: "#2563EB",
      bg: "#EFF6FF"
    },
    {
      id: "SRV-02",
      title: "Cấp lại thẻ sinh viên (Mất / Hỏng)",
      desc: "Làm lại thẻ sinh viên từ / thẻ chip tích hợp ra vào khuôn viên và thư viện.",
      fee: "50.000 VNĐ",
      sla: "3 - 5 ngày làm việc",
      icon: CreditCard,
      color: "#D97706",
      bg: "#FEF3C7"
    },
    {
      id: "SRV-03",
      title: "Tạm hoãn nghĩa vụ quân sự",
      desc: "Cấp giấy chứng nhận đang theo học đại học chính quy gửi về Ban chỉ huy quân sự địa phương.",
      fee: "Miễn phí",
      sla: "1 ngày làm việc",
      icon: ShieldCheck,
      color: "#16A34A",
      bg: "#DCFCE7"
    },
    {
      id: "SRV-04",
      title: "Mượn phòng tự học / Sinh hoạt CLB",
      desc: "Đăng ký sử dụng phòng học, hội trường hoặc không gian sinh hoạt nhóm ngoài giờ.",
      fee: "Miễn phí",
      sla: "Duyệt trong ngày",
      icon: Building,
      color: "#9333EA",
      bg: "#F3E8FF"
    },
    {
      id: "SRV-05",
      title: "Đăng ký / Gia hạn chỗ ở Ký túc xá",
      desc: "Nộp đơn xin cấp chỗ ở KTX Dom A/B/C/D, chọn loại phòng 4 - 6 người có điều hòa.",
      fee: "Theo kỳ",
      sla: "2 ngày làm việc",
      icon: Library,
      color: "#EA580C",
      bg: "#FFEDD5"
    },
    {
      id: "SRV-06",
      title: "Đơn phúc khảo bài thi kết thúc môn",
      desc: "Yêu cầu chấm thẩm định lại bài thi trắc nghiệm, tự luận hoặc đồ án Assignment.",
      fee: "100.000 VNĐ / môn",
      sla: "5 ngày làm việc",
      icon: AlertCircle,
      color: "#DC2626",
      bg: "#FEE2E2"
    }
  ];

  const [studentSubmittedRequests, setStudentSubmittedRequests] = useState([
    {
      id: "REQ-2024-881",
      service: "Xin giấy xác nhận sinh viên",
      date: "24/05/2024",
      reason: "Bổ sung hồ sơ vay vốn ngân hàng chính sách xã hội",
      status: "Chờ duyệt",
      statusColor: "#D97706",
      statusBg: "#FEF3C7",
      sla: "Dự kiến 25/05/2024"
    },
    {
      id: "REQ-2024-742",
      service: "Mượn phòng tự học",
      date: "20/05/2024",
      reason: "Làm bài tập nhóm Capstone môn PRJ301 (P.204 Alpha)",
      status: "Đã hoàn thành",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7",
      sla: "Đã cấp mã mở khóa phòng"
    }
  ]);

  // Form gửi dịch vụ mới
  const [newReqService, setNewReqService] = useState("Xin giấy xác nhận sinh viên");
  const [newReqPurpose, setNewReqPurpose] = useState("");
  const [newReqCopies, setNewReqCopies] = useState("1");
  const [newReqNote, setNewReqNote] = useState("");

  const handleCreateServiceRequest = () => {
    if (!newReqPurpose.trim()) {
      showToast("Vui lòng nhập mục đích hoặc lý do yêu cầu!", "error");
      return;
    }
    const newReq = {
      id: `REQ-2024-${Math.floor(100 + Math.random() * 900)}`,
      service: newReqService,
      date: new Date().toLocaleDateString("vi-VN"),
      reason: newReqPurpose,
      status: "Chờ duyệt",
      statusColor: "#D97706",
      statusBg: "#FEF3C7",
      sla: "Dự kiến trong 24h tới"
    };
    setStudentSubmittedRequests([newReq, ...studentSubmittedRequests]);
    showToast(`Đã gửi yêu cầu "${newReqService}" lên Phòng Công tác Sinh viên (Mã đơn: ${newReq.id})!`);
    setShowCreateServiceRequestModal(false);
    setNewReqPurpose("");
    setNewReqNote("");
  };

  const handleOnlinePaymentSuccess = () => {
    showToast("Thanh toán học phí trực tuyến 25,500,000 VNĐ qua VNPay thành công!");
    setShowPaymentModal(false);
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

      {/* ── SIDEBAR CỔNG SINH VIÊN (FPT Student Portal / Academic Hub) ── */}
      <aside style={{
        width: 240, background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        flexShrink: 0, zIndex: 30
      }}>
        <div>
          {/* Brand Header */}
          <div style={{ padding: "24px 20px 18px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "#9A3412", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(154,52,18,0.25)"
            }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.3px", lineHeight: 1.15 }}>
                FPT Portal
              </div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, marginTop: 1 }}>
                Academic Hub
              </div>
            </div>
          </div>

          {/* Navigation Links (Khớp toàn bộ các phân hệ của sinh viên) */}
          <nav style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { id: "schedule", icon: Calendar, label: "Schedule" },
              { id: "gradebook", icon: BookOpen, label: "Gradebook" },
              { id: "lms", icon: BookMarked, label: "LMS" },
              { id: "finance", icon: DollarSign, label: "Finance" },
              { id: "events", icon: Compass, label: "Events" },
              { id: "services", icon: LifeBuoy, label: "Services" },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 10, fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#9A3412" : "#475569",
                    background: isActive ? "#FFEDD5" : "transparent",
                    borderLeft: isActive ? "3.5px solid #9A3412" : "none",
                    border: "none", cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s ease"
                  }}
                >
                  <tab.icon size={17} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#9A3412" : "#64748B"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom */}
        <div>
          {/* Submit Support Ticket Button */}
          <div style={{ padding: "0 14px 12px" }}>
            <button
              onClick={() => setShowSupportTicketModal(true)}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 10,
                background: "#9A3412", color: "#FFFFFF", border: "none",
                fontWeight: 700, fontSize: 12.5, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 6, cursor: "pointer",
                boxShadow: "0 4px 12px rgba(154,52,18,0.25)"
              }}
            >
              <Plus size={16} strokeWidth={2.5} /> Submit Support Ticket
            </button>
          </div>

          <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
            <button
              onClick={() => showToast("Đã mở Cài đặt tài khoản sinh viên")}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 500,
                color: "#475569", background: "transparent", border: "none", cursor: "pointer"
              }}
            >
              <Settings size={16} /> Settings
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "8px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 500,
                color: "#475569", background: "transparent", border: "none", cursor: "pointer"
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          {/* Student Profile Info */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #F1F5F9", background: "#FAFBFD", marginTop: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "#EFF6FF", color: "#2563EB", display: "flex",
                alignItems: "center", justifyContent: "center", fontWeight: 800,
                fontSize: 13, border: "1.5px solid #BFDBFE"
              }}>
                NA
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Nguyễn Văn A</div>
                <div style={{ fontSize: 11, color: "#64748B", fontFamily: "monospace" }}>SE123456</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main style={{ flex: 1, height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* ── TOP NAVBAR ── */}
        <header style={{
          height: 60, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
          padding: "0 32px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 20
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#9A3412", letterSpacing: "-0.2px" }}>
            FPT Student Portal
          </div>

          <div style={{ position: "relative", width: 440, maxWidth: "45%" }}>
            <Search size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder={
                activeTab === "lms" ? "Tìm kiếm bài tập, môn học..." :
                activeTab === "events" ? "Tìm kiếm sự kiện..." :
                activeTab === "services" ? "Tìm dịch vụ một cửa..." :
                "Tìm kiếm..."
              }
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              style={{
                width: "100%", padding: "8px 14px 8px 36px", borderRadius: 10,
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
                  width: 34, height: 34, borderRadius: "50%", border: "1px solid #E2E8F0",
                  background: "#FFFFFF", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "#475569"
                }}
              >
                <Bell size={15} />
                <span style={{
                  position: "absolute", top: 6, right: 6, width: 6, height: 6,
                  borderRadius: "50%", background: "#DC2626"
                }} />
              </button>

              {showNotifications && (
                <div style={{
                  position: "absolute", top: 44, right: 0, width: 300,
                  background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)", padding: "14px 16px", zIndex: 100
                }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#0F172A", marginBottom: 8 }}>Thông báo học tập</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                    <div style={{ padding: "6px 8px", background: "#FEF3C7", borderRadius: 6, color: "#92400E" }}>
                      ⚠️ <strong>PRJ301</strong>: Assignment 1 sắp hết hạn lúc 23:59 hôm nay!
                    </div>
                    <div style={{ padding: "6px 8px", background: "#EFF6FF", borderRadius: 6, color: "#1E40AF" }}>
                      🎪 <strong>FPT Hackathon 2024</strong> đã mở cổng đăng ký tham gia!
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowHelpModal(true)}
              style={{
                width: 34, height: 34, borderRadius: "50%", border: "1px solid #E2E8F0",
                background: "#FFFFFF", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", color: "#475569"
              }}
            >
              <HelpCircle size={15} />
            </button>

            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#DBEAFE", color: "#2563EB", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800
            }}>
              A
            </div>
          </div>
        </header>

        {/* ── MAIN BODY ── */}
        <div style={{ flex: 1, padding: "26px 32px 48px", maxWidth: 1440, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

          {/* =========================================================================
              MÀN HÌNH 1: DASHBOARD (EXACT SCREENSHOT 1)
             ========================================================================= */}
          {activeTab === "dashboard" && (
            <div>
              {/* Header Greeting (Ảnh 1) */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                  <div style={{ fontSize: 12.5, color: "#64748B", fontWeight: 600, marginBottom: 4 }}>
                    ☀️ Thứ Tư, 24 Tháng 5, 2024
                  </div>
                  <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
                    Chào buổi sáng, <span style={{ color: "#9A3412" }}>Nguyễn Văn A 👋</span>
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Chúc bạn một ngày học tập và làm việc hiệu quả. Kỳ Thu 2026 đã đi được nửa chặng đường.
                  </p>
                </div>

                <div style={{ background: "#FFFFFF", padding: "10px 16px", borderRadius: 12, border: "1px solid #E2E8F0", textAlign: "right" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, color: "#64748B", letterSpacing: "0.5px" }}>MÃ SINH VIÊN</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: "#9A3412", fontFamily: "monospace" }}>SE150xxx</div>
                </div>
              </div>

              {/* Hàng 1: Lịch học hôm nay + Deadlines sắp tới + Học phí Kỳ Thu 2026 (Ảnh 1) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.15fr", gap: 18, marginBottom: 24 }}>

                {/* Card 1: Lịch học hôm nay */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                        <Calendar size={16} color="#9A3412" /> Lịch học hôm nay
                      </div>
                      <span onClick={() => setActiveTab("schedule")} style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", cursor: "pointer" }}>
                        Xem tất cả
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ padding: "10px 12px", background: "#F8FAFC", borderRadius: 10, borderLeft: "3px solid #9A3412" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <strong style={{ fontSize: 13.5, color: "#0F172A" }}>PRJ301</strong>
                          <span style={{ fontSize: 11, background: "#E2E8F0", padding: "2px 6px", borderRadius: 4, color: "#475569" }}>Slot 1</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748B", marginBottom: 4 }}>Java Web Application</div>
                        <div style={{ fontSize: 11.5, color: "#475569", display: "flex", gap: 10 }}>
                          <span>🕒 07:30 - 09:50</span>
                          <span>🏛️ Phòng 202-Beta</span>
                        </div>
                      </div>

                      <div style={{ padding: "10px 12px", background: "#F8FAFC", borderRadius: 10, borderLeft: "3px solid #CBD5E1" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <strong style={{ fontSize: 13.5, color: "#0F172A" }}>SWT301</strong>
                          <span style={{ fontSize: 11, background: "#E2E8F0", padding: "2px 6px", borderRadius: 4, color: "#475569" }}>Slot 3</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748B", marginBottom: 4 }}>Software Testing</div>
                        <div style={{ fontSize: 11.5, color: "#475569", display: "flex", gap: 10 }}>
                          <span>🕒 12:50 - 15:10</span>
                          <span>🏛️ Phòng 105-Alpha</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowCheckInModal(true)}
                    style={{ marginTop: 14, width: "100%", padding: "9px", borderRadius: 8, background: "#FFFFFF", border: "1.5px solid #CBD5E1", color: "#0F172A", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                  >
                    Check-in Attendance
                  </button>
                </div>

                {/* Card 2: Deadlines sắp tới */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                      <AlertTriangle size={16} color="#D97706" /> Deadlines sắp tới
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, background: "#FEE2E2", color: "#DC2626", padding: "2px 8px", borderRadius: 100 }}>
                      2 Urgent
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {deadlines.map((dl) => (
                      <div
                        key={dl.id}
                        onClick={() => { setActiveTab("lms"); showToast(`Mở bài tập ${dl.title}`); }}
                        style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", background: "#FFFFFF" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: dl.badgeColor, color: dl.textColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11 }}>
                            {dl.code}
                          </div>
                          <div>
                            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>{dl.title}</div>
                            <div style={{ fontSize: 11, color: dl.urgent ? "#DC2626" : "#64748B", fontWeight: 600 }}>
                              {dl.urgent ? "⏰ " : "📅 "} {dl.due}
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={15} color="#94A3B8" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 3: Học phí Kỳ Thu 2026 (Card xanh đen đậm chuẩn Ảnh 1) */}
                <div style={{ background: "#0F172A", borderRadius: 16, padding: "22px 24px", color: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 14px rgba(15,23,42,0.15)" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800 }}>
                        <CreditCard size={17} color="#38BDF8" /> Học phí Kỳ Thu 2026
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(16,185,129,0.2)", color: "#34D399", padding: "3px 8px", borderRadius: 6, display: "flex", alignItems: "center", gap: 4 }}>
                        <Check size={12} /> Đã hoàn thành
                      </span>
                    </div>

                    <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, letterSpacing: "0.5px" }}>TỔNG ĐÃ NỘP</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#FFFFFF", marginTop: 2, letterSpacing: "-0.5px" }}>
                      27,500,000 <span style={{ fontSize: 14, fontWeight: 600, color: "#94A3B8" }}>VND</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 12, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 10 }}>
                      <span style={{ color: "#94A3B8" }}>Hạn nộp: <strong style={{ color: "#FFFFFF" }}>15/08/2024</strong></span>
                      <span style={{ color: "#94A3B8" }}>Dư nợ hiện tại: <strong style={{ color: "#34D399" }}>0 VND</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("finance")}
                    style={{ marginTop: 16, width: "100%", padding: "9px", borderRadius: 8, background: "rgba(255,255,255,0.1)", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                  >
                    Xem Chi Tiết Giao Dịch
                  </button>
                </div>

              </div>

              {/* Hàng 2: Tiến độ Học tập GPA + Truy cập nhanh (Ảnh 1) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 20, alignItems: "start" }}>

                {/* Tiến độ Học tập GPA */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 800, color: "#0F172A" }}>
                        <TrendingUp size={17} color="#2563EB" /> Tiến độ Học tập (GPA)
                      </div>
                      <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 2 }}>
                        Trung bình tích lũy: <strong style={{ color: "#9A3412", fontSize: 14 }}>8.4</strong> / 10
                      </div>
                    </div>

                    <select style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12, background: "#FFFFFF" }}>
                      <option>Tất cả các kỳ</option>
                      <option>Năm 2024</option>
                      <option>Năm 2023</option>
                    </select>
                  </div>

                  <div style={{ width: "100%", height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={gpaTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9A3412" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#9A3412" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="semester" fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <YAxis domain={[0, 10]} fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: "#0F172A", borderRadius: 8, color: "#FFF", fontSize: 12 }} />
                        <Area type="monotone" dataKey="gpa" stroke="#9A3412" strokeWidth={2.5} fillOpacity={1} fill="url(#gpaGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Truy cập nhanh (Ảnh 1 - 4 ô vuông) */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ fontSize: 14.5, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>
                    :: Truy cập nhanh
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div
                      onClick={() => showToast("Đang mở Cổng Thư viện số FPT Digital Library")}
                      style={{ padding: "16px 12px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", textAlign: "center", cursor: "pointer", transition: "all 0.15s" }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                        <Library size={18} />
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>Thư viện số</div>
                    </div>

                    <div
                      onClick={() => { setActiveTab("services"); showToast("Mở dịch vụ gửi yêu cầu trực tuyến tới CTSV"); }}
                      style={{ padding: "16px 12px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", textAlign: "center", cursor: "pointer", transition: "all 0.15s" }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#ECFDF5", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                        <FileText size={18} />
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>Xin giấy tờ</div>
                    </div>

                    <div
                      onClick={() => showToast("Đang kết nối khóa học Coursera for FPTU")}
                      style={{ padding: "16px 12px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", textAlign: "center", cursor: "pointer", transition: "all 0.15s" }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF7ED", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                        <MessageSquare size={18} />
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>Coursera</div>
                    </div>

                    <div
                      onClick={() => showToast("Đang tải thực đơn Canteen Hòa Lạc Campus hôm nay")}
                      style={{ padding: "16px 12px", background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", textAlign: "center", cursor: "pointer", transition: "all 0.15s" }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                        <Utensils size={18} />
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>Thực đơn Canteen</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 2: GRADEBOOK - KẾT QUẢ HỌC TẬP (EXACT SCREENSHOT 2)
             ========================================================================= */}
          {activeTab === "gradebook" && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
                  Kết quả học tập
                </h1>
                <p style={{ fontSize: 13.5, color: "#64748B", margin: 0, fontWeight: 500 }}>
                  Theo dõi quá trình học tập và bảng điểm chi tiết các kỳ.
                </p>
              </div>

              {/* Hàng 1: GPA Tích lũy + Tín chỉ tích lũy + Tiến độ GPA (Ảnh 2) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr", gap: 18, marginBottom: 24 }}>

                {/* Card 1: GPA Tích lũy */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700, color: "#334155", marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FFEDD5", color: "#9A3412", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Award size={15} />
                    </div>
                    GPA Tích lũy
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px" }}>
                    8.5 <span style={{ fontSize: 14, color: "#64748B", fontWeight: 500 }}>/ 10.0</span>
                  </div>
                  <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#E2E8F0", marginTop: 14, overflow: "hidden" }}>
                    <div style={{ width: "85%", height: "100%", background: "#9A3412" }} />
                  </div>
                  <div style={{ textAlign: "right", fontSize: 11.5, fontWeight: 700, color: "#9A3412", marginTop: 6 }}>Xuất sắc</div>
                </div>

                {/* Card 2: Tín chỉ tích lũy */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 700, color: "#334155", marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#DBEAFE", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <BookOpen size={15} />
                    </div>
                    Tín chỉ tích lũy
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px" }}>
                    112 <span style={{ fontSize: 14, color: "#64748B", fontWeight: 500 }}>/ 145</span>
                  </div>
                  <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#E2E8F0", marginTop: 14, overflow: "hidden" }}>
                    <div style={{ width: "77%", height: "100%", background: "#2563EB" }} />
                  </div>
                  <div style={{ textAlign: "right", fontSize: 11.5, fontWeight: 700, color: "#2563EB", marginTop: 6 }}>Tiến độ: 77%</div>
                </div>

                {/* Card 3: Biểu đồ Tiến độ GPA */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A", marginBottom: 6 }}>
                    Tiến độ GPA
                  </div>

                  <div style={{ width: "100%", height: 110 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={gradeHistoryData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <XAxis dataKey="sem" fontSize={10} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <YAxis domain={[4, 10]} fontSize={10} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="termGpa" stroke="#9A3412" strokeWidth={2} dot={{ r: 3, fill: "#9A3412" }} />
                        <Line type="monotone" dataKey="cumGpa" stroke="#2563EB" strokeDasharray="3 3" strokeWidth={1.5} dot={{ r: 3, fill: "#2563EB" }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", gap: 14, fontSize: 10.5, color: "#64748B", marginTop: 4 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#9A3412" }} /> GPA Học kỳ
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB" }} /> GPA Tích lũy
                    </span>
                  </div>
                </div>

              </div>

              {/* Hàng 2: Bảng điểm chi tiết (Ảnh 2) */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                    Bảng điểm chi tiết
                  </h3>

                  <div style={{ display: "flex", gap: 10 }}>
                    <select
                      value={gradeSemesterFilter}
                      onChange={e => setGradeSemesterFilter(e.target.value)}
                      style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12.5, background: "#FFFFFF" }}
                    >
                      <option value="ALL">Tất cả học kỳ</option>
                      <option value="Fall 2023">Fall 2023</option>
                      <option value="Summer 2023">Summer 2023</option>
                      <option value="Spring 2023">Spring 2023</option>
                    </select>

                    <button
                      onClick={() => showToast("Đã xuất bảng điểm chi tiết ra file PDF thành công!")}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                    >
                      <Download size={14} /> Xuất PDF
                    </button>
                  </div>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "12px 14px", fontWeight: 700, width: 120 }}>HỌC KỲ</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, width: 110 }}>MÃ MÔN</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700 }}>TÊN MÔN</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, textAlign: "center", width: 90 }}>TÍN CHỈ</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, textAlign: "center", width: 100 }}>ĐIỂM TB</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, textAlign: "right", width: 110 }}>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradebookData
                      .filter(g => gradeSemesterFilter === "ALL" || g.semester === gradeSemesterFilter)
                      .map((semGroup, groupIdx) => (
                        semGroup.courses.map((course, cIdx) => (
                          <tr key={`${groupIdx}-${cIdx}`} style={{ borderBottom: "1px solid #F1F5F9" }}>
                            {cIdx === 0 ? (
                              <td rowSpan={semGroup.courses.length} style={{ padding: "14px", fontWeight: 900, color: "#0F172A", verticalAlign: "top", borderRight: "1px solid #F1F5F9" }}>
                                {semGroup.semester}
                              </td>
                            ) : null}

                            <td style={{ padding: "14px", fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>
                              {course.code}
                            </td>

                            <td style={{ padding: "14px", color: "#0F172A", fontWeight: 600 }}>
                              {course.name}
                            </td>

                            <td style={{ padding: "14px", textAlign: "center", color: "#64748B" }}>
                              {course.credits}
                            </td>

                            <td style={{ padding: "14px", textAlign: "center", fontWeight: 800, color: course.score >= 5 ? "#0F172A" : "#DC2626" }}>
                              {course.score}
                            </td>

                            <td style={{ padding: "14px", textAlign: "right" }}>
                              <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11.5, fontWeight: 800, color: course.color, background: course.bg }}>
                                {course.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 3: SCHEDULE - LỊCH HỌC & LỊCH THI (EXACT SCREENSHOT 3)
             ========================================================================= */}
          {activeTab === "schedule" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                    Lịch học & Lịch thi
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Tuần 42: 16/10/2023 - 22/10/2023
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ display: "flex", background: "#E2E8F0", padding: 3, borderRadius: 8 }}>
                    <button
                      onClick={() => setScheduleType("study")}
                      style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: scheduleType === "study" ? "#EA580C" : "transparent", color: scheduleType === "study" ? "#FFF" : "#475569", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                    >
                      Lịch học
                    </button>
                    <button
                      onClick={() => setScheduleType("exam")}
                      style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: scheduleType === "exam" ? "#EA580C" : "transparent", color: scheduleType === "exam" ? "#FFF" : "#475569", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                    >
                      Lịch thi
                    </button>
                  </div>

                  <select
                    value={scheduleSemester}
                    onChange={e => setScheduleSemester(e.target.value)}
                    style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12.5, background: "#FFFFFF" }}
                  >
                    <option>Fall 2023</option>
                    <option>Summer 2023</option>
                    <option>Spring 2023</option>
                  </select>
                </div>
              </div>

              {/* Lưới Lịch Thời Khóa Biểu (Ảnh 3) */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "14px 16px", width: 90, textAlign: "center" }}>
                        <Clock size={16} color="#64748B" />
                      </th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>
                        <div>Thứ 2</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#0F172A" }}>16/10</div>
                      </th>
                      <th style={{ padding: "14px 16px", fontWeight: 700, background: "#FFF7ED" }}>
                        <div style={{ color: "#EA580C" }}>Thứ 3</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#EA580C" }}>17/10</div>
                      </th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>
                        <div>Thứ 4</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#0F172A" }}>18/10</div>
                      </th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>
                        <div>Thứ 5</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#0F172A" }}>19/10</div>
                      </th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>
                        <div>Thứ 6</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#0F172A" }}>20/10</div>
                      </th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>
                        <div>Thứ 7</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#0F172A" }}>21/10</div>
                      </th>
                      <th style={{ padding: "14px 16px", fontWeight: 700 }}>
                        <div>CN</div>
                        <div style={{ fontSize: 15, fontWeight: 900, color: "#0F172A" }}>22/10</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Slot 1: 07:30 - 09:50 */}
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "16px 10px", textAlign: "center", background: "#F8FAFC", borderRight: "1px solid #E2E8F0" }}>
                        <strong style={{ display: "block", color: "#0F172A" }}>Slot 1</strong>
                        <span style={{ fontSize: 11, color: "#64748B" }}>07:30<br />09:50</span>
                      </td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10, background: "#FFFBF7" }}>
                        <div style={{ padding: "10px 12px", background: "#FFF7ED", borderLeft: "3px solid #EA580C", borderRadius: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ color: "#9A3412", fontSize: 13 }}>PRJ301</strong>
                            <span style={{ fontSize: 10, background: "#FFEDD5", color: "#C2410C", padding: "1px 5px", borderRadius: 4 }}>Lec</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: "#0F172A", fontWeight: 600, marginTop: 2 }}>Java Web Application</div>
                          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>📍 AL-301 • 👤 NguyenVA</div>
                        </div>
                      </td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}>
                        <div style={{ padding: "10px 12px", background: "#F8FAFC", borderLeft: "3px solid #64748B", borderRadius: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ color: "#0F172A", fontSize: 13 }}>SWE201</strong>
                            <span style={{ fontSize: 10, background: "#E2E8F0", color: "#475569", padding: "1px 5px", borderRadius: 4 }}>Lec</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: "#0F172A", fontWeight: 600, marginTop: 2 }}>Software Engineering</div>
                          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>📍 DE-205 • 👤 TranTB</div>
                        </div>
                      </td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}></td>
                    </tr>

                    {/* Slot 2: 10:00 - 12:20 */}
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "16px 10px", textAlign: "center", background: "#F8FAFC", borderRight: "1px solid #E2E8F0" }}>
                        <strong style={{ display: "block", color: "#0F172A" }}>Slot 2</strong>
                        <span style={{ fontSize: 11, color: "#64748B" }}>10:00<br />12:20</span>
                      </td>
                      <td style={{ padding: 10 }}>
                        <div style={{ padding: "10px 12px", background: "#EFF6FF", borderLeft: "3px solid #2563EB", borderRadius: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ color: "#1D4ED8", fontSize: 13 }}>DBI202</strong>
                            <span style={{ fontSize: 10, background: "#DBEAFE", color: "#1E40AF", padding: "1px 5px", borderRadius: 4 }}>Lab</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: "#0F172A", fontWeight: 600, marginTop: 2 }}>Database Systems</div>
                          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>📍 BE-411 • 👤 LeTC</div>
                        </div>
                      </td>
                      <td style={{ padding: 10, background: "#FFFBF7" }}></td>
                      <td style={{ padding: 10 }}>
                        <div style={{ padding: "10px 12px", background: "#EFF6FF", borderLeft: "3px solid #2563EB", borderRadius: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ color: "#1D4ED8", fontSize: 13 }}>DBI202</strong>
                            <span style={{ fontSize: 10, background: "#DBEAFE", color: "#1E40AF", padding: "1px 5px", borderRadius: 4 }}>Lab</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: "#0F172A", fontWeight: 600, marginTop: 2 }}>Database Systems</div>
                          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>📍 BE-411 • 👤 LeTC</div>
                        </div>
                      </td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}>
                        <div style={{ padding: "10px 12px", background: "#EFF6FF", borderLeft: "3px solid #2563EB", borderRadius: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <strong style={{ color: "#1D4ED8", fontSize: 13 }}>DBI202</strong>
                            <span style={{ fontSize: 10, background: "#DBEAFE", color: "#1E40AF", padding: "1px 5px", borderRadius: 4 }}>Lab</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: "#0F172A", fontWeight: 600, marginTop: 2 }}>Database Systems</div>
                          <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>📍 BE-411 • 👤 LeTC</div>
                        </div>
                      </td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}></td>
                    </tr>

                    {/* Break Time */}
                    <tr style={{ background: "#F1F5F9", borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "6px", textAlign: "center" }}>🍴</td>
                      <td colSpan={7} style={{ padding: "6px 14px", fontSize: 11, fontWeight: 700, color: "#64748B" }}>
                        Break Time (12:20 - 12:50)
                      </td>
                    </tr>

                    {/* Slot 3: 12:50 - 15:10 */}
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "16px 10px", textAlign: "center", background: "#F8FAFC", borderRight: "1px solid #E2E8F0" }}>
                        <strong style={{ display: "block", color: "#0F172A" }}>Slot 3</strong>
                        <span style={{ fontSize: 11, color: "#64748B" }}>12:50<br />15:10</span>
                      </td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10, background: "#FFFBF7" }}></td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}></td>
                    </tr>

                    {/* Slot 4: 15:20 - 17:40 */}
                    <tr>
                      <td style={{ padding: "16px 10px", textAlign: "center", background: "#F8FAFC", borderRight: "1px solid #E2E8F0" }}>
                        <strong style={{ display: "block", color: "#0F172A" }}>Slot 4</strong>
                        <span style={{ fontSize: 11, color: "#64748B" }}>15:20<br />17:40</span>
                      </td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10, background: "#FFFBF7", position: "relative" }}>
                        <div style={{ position: "absolute", left: 0, right: 0, top: "45%", height: 2, background: "#DC2626" }}>
                          <span style={{ position: "absolute", left: -4, top: -3, width: 8, height: 8, borderRadius: "50%", background: "#DC2626" }} />
                        </div>
                      </td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}></td>
                      <td style={{ padding: 10 }}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 4: LMS - QUẢN LÝ BÀI TẬP (EXACT SCREENSHOT 4)
             ========================================================================= */}
          {activeTab === "lms" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                    Quản lý Bài tập
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Hệ thống Quản lý Học tập LMS
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <select style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12.5, background: "#FFFFFF" }}>
                    <option>Tất cả học kỳ</option>
                    <option>Fall 2023</option>
                  </select>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                    <Filter size={14} /> Bộ lọc
                  </button>
                </div>
              </div>

              {/* Banner Chú ý màu vàng nhạt (Ảnh 4) */}
              <div style={{ padding: "14px 18px", borderRadius: 12, background: "#FFFBEB", border: "1px solid #FEF3C7", display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: 13.5, color: "#92400E", display: "block" }}>Chú ý: 2 bài tập sắp đến hạn</strong>
                  <span style={{ fontSize: 12.5, color: "#B45309" }}>Bạn có bài tập cần nộp trong vòng 24h tới. Vui lòng kiểm tra và hoàn thành sớm.</span>
                </div>
              </div>

              {/* Tabs trạng thái (Ảnh 4) */}
              <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #E2E8F0", marginBottom: 20 }}>
                {[
                  { id: "ongoing", label: "Đang diễn ra (5)" },
                  { id: "submitted", label: "Đã nộp (12)" },
                  { id: "graded", label: "Đã chấm điểm (8)" },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setLmsTab(t.id)}
                    style={{
                      padding: "10px 4px", background: "transparent", border: "none",
                      borderBottom: lmsTab === t.id ? "3px solid #9A3412" : "3px solid transparent",
                      color: lmsTab === t.id ? "#9A3412" : "#64748B",
                      fontWeight: lmsTab === t.id ? 800 : 600, fontSize: 14, cursor: "pointer"
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Danh sách bài tập (Ảnh 4) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {assignments.map((asm) => (
                  <div
                    key={asm.id}
                    style={{
                      background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0",
                      borderLeft: asm.id === "ASM-01" ? "4px solid #EA580C" : "1px solid #E2E8F0",
                      padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.02)"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: asm.iconType === "code" ? "#EFF6FF" : asm.iconType === "design" ? "#F1F5F9" : "#F8FAFC",
                        color: asm.iconType === "code" ? "#2563EB" : "#475569",
                        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16
                      }}>
                        {asm.iconType === "code" ? "</>" : asm.iconType === "design" ? "🛠️" : "{}"}
                      </div>

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 11, fontFamily: "monospace", fontWeight: 700, color: "#64748B" }}>{asm.code}</span>
                          <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 10.5, fontWeight: 800, color: asm.statusColor, background: asm.statusBg }}>
                            {asm.statusBadge}
                          </span>
                        </div>
                        <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>
                          {asm.title}
                        </h4>
                        <div style={{ fontSize: 12, color: asm.deadlineColor, fontWeight: 600 }}>
                          🕒 {asm.deadline}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      {asm.score && (
                        <div style={{ textAlign: "right", marginRight: 8 }}>
                          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>Điểm số</div>
                          <div style={{ fontSize: 18, fontWeight: 900, color: "#0F172A" }}>{asm.score}</div>
                        </div>
                      )}

                      <button
                        onClick={() => showToast(`Xem chi tiết bài tập ${asm.title}`)}
                        style={{ padding: "8px 14px", borderRadius: 8, background: "#FFFFFF", color: "#334155", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                      >
                        {asm.id === "ASM-02" ? "Xem lại" : asm.id === "ASM-03" ? "Chi tiết" : "Xem chi tiết"}
                      </button>

                      {asm.id === "ASM-01" && (
                        <button
                          onClick={() => setShowSubmitAssignmentModal(asm)}
                          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                        >
                          <Upload size={14} /> Nộp bài
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 5: FINANCE - TÀI CHÍNH & HỌC PHÍ (EXACT SCREENSHOT 5)
             ========================================================================= */}
          {activeTab === "finance" && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: "0 0 6px", letterSpacing: "-0.4px" }}>
                  Tài chính & Học phí
                </h1>
                <p style={{ fontSize: 13.5, color: "#64748B", margin: 0, fontWeight: 500 }}>
                  Quản lý các khoản thanh toán, học bổng và lịch sử giao dịch của bạn.
                </p>
              </div>

              {/* Hàng 1: Học phí cần đóng + Thông tin học bổng (Ảnh 5) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, marginBottom: 24 }}>

                {/* Khối 1: Học phí cần đóng kỳ Thu 2026 */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px 26px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: "#9A3412", marginBottom: 10 }}>
                    <CreditCard size={17} /> Học phí cần đóng kỳ Thu 2026
                  </div>

                  <div style={{ fontSize: 36, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px", marginBottom: 6 }}>
                    25,500,000 <span style={{ fontSize: 18, color: "#475569" }}>VNĐ</span>
                  </div>

                  <div style={{ fontSize: 12.5, color: "#64748B", display: "flex", alignItems: "center", gap: 6, marginBottom: 22 }}>
                    <Clock size={14} /> Hạn chót thanh toán: <strong>15/09/2024</strong>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                    >
                      <CreditCard size={16} /> Thanh toán trực tuyến
                    </button>

                    <button
                      onClick={() => showToast("Đang tải hóa đơn điện tử học phí kỳ Thu 2026")}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, background: "#FFFFFF", color: "#2563EB", border: "1.5px solid #CBD5E1", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                    >
                      <Receipt size={16} /> Xem chi tiết hóa đơn
                    </button>
                  </div>
                </div>

                {/* Khối 2: Thông tin Học bổng (Ảnh 5 - Thẻ xanh nhạt) */}
                <div style={{ background: "#EFF6FF", borderRadius: 16, border: "1px solid #DBEAFE", padding: "24px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 900, color: "#1E3A8A" }}>
                        Thông tin Học bổng
                      </div>
                      <Award size={18} color="#2563EB" />
                    </div>

                    <div style={{ background: "#FFFFFF", borderRadius: 12, padding: "14px 16px", border: "1px solid #DBEAFE" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748B", letterSpacing: "0.5px" }}>HỌC BỔNG TÀI NĂNG</div>
                      <div style={{ fontSize: 26, fontWeight: 900, color: "#2563EB", marginTop: 2 }}>
                        30%
                      </div>
                      <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>Áp dụng toàn khóa học</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 14, borderTop: "1px solid #DBEAFE", paddingTop: 12 }}>
                    <span style={{ fontSize: 12.5, color: "#475569" }}>Mức giảm trừ kỳ này:</span>
                    <strong style={{ fontSize: 16, fontWeight: 900, color: "#059669" }}>-7,650,000 VNĐ</strong>
                  </div>
                </div>

              </div>

              {/* Hàng 2: Lịch sử Giao dịch (Ảnh 5) */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 900, color: "#0F172A" }}>
                    <RefreshCw size={16} color="#9A3412" /> Lịch sử Giao dịch
                  </div>

                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    <Filter size={13} /> Lọc
                  </button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "12px 14px", fontWeight: 700, width: 140 }}>NGÀY GD</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700 }}>NỘI DUNG</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, textAlign: "right", width: 160 }}>SỐ TIỀN (VNĐ)</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, textAlign: "right", width: 130 }}>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financeTransactions.map((tx, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "14px", color: "#64748B", fontFamily: "monospace" }}>{tx.date}</td>
                        <td style={{ padding: "14px", fontWeight: 600, color: "#0F172A" }}>{tx.content}</td>
                        <td style={{ padding: "14px", textAlign: "right", fontWeight: 800, color: "#0F172A" }}>{tx.amount}</td>
                        <td style={{ padding: "14px", textAlign: "right" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11.5, fontWeight: 700, color: tx.statusColor, background: tx.statusBg }}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ textAlign: "right", marginTop: 14 }}>
                  <span onClick={() => showToast("Đang tải toàn bộ 14 giao dịch tài chính")} style={{ fontSize: 12.5, fontWeight: 700, color: "#9A3412", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    Xem tất cả <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 6: SỰ KIỆN & HOẠT ĐỘNG (EXACT SCREENSHOT MỚI)
             ========================================================================= */}
          {activeTab === "events" && (
            <div>
              {/* Header Title & Subtitle */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                    Sự Kiện & Hoạt Động
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Khám phá và tham gia các hoạt động sôi nổi tại Campus!
                  </p>
                </div>

                {/* Filter Chips (Tất cả, Học thuật, Văn hóa, Thể thao) */}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {[
                    { id: "ALL", label: "Tất cả" },
                    { id: "Học thuật", label: "Học thuật" },
                    { id: "Văn hóa", label: "Văn hóa" },
                    { id: "Thể thao", label: "Thể thao" }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setEventCategoryFilter(f.id)}
                      style={{
                        padding: "7px 16px", borderRadius: 100, border: "none",
                        background: eventCategoryFilter === f.id ? "#9A3412" : "#FFFFFF",
                        color: eventCategoryFilter === f.id ? "#FFFFFF" : "#475569",
                        fontWeight: eventCategoryFilter === f.id ? 700 : 600,
                        fontSize: 12.5, cursor: "pointer",
                        boxShadow: eventCategoryFilter === f.id ? "0 2px 6px rgba(154,52,18,0.25)" : "0 1px 3px rgba(0,0,0,0.06)",
                        transition: "all 0.15s"
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Sự kiện: Featured Card bên trái + Card bên phải (Ảnh mới) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gap: 20, marginBottom: 20 }}>

                {/* FEATURED CARD: FPT Hackathon 2024 */}
                <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", display: "flex", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                  <div style={{ width: "48%", position: "relative", minHeight: 250 }}>
                    <img
                      src={eventsList[0].image}
                      alt={eventsList[0].title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <span style={{ position: "absolute", top: 12, left: 12, background: "#9A3412", color: "#FFFFFF", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
                      Học thuật
                    </span>
                  </div>

                  <div style={{ width: "52%", padding: "24px 26px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", margin: "0 0 10px", lineHeight: 1.3 }}>
                        {eventsList[0].title}
                      </h2>
                      <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, margin: "0 0 16px" }}>
                        {eventsList[0].description}
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "#64748B", marginBottom: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <Calendar size={15} color="#9A3412" /> {eventsList[0].time}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <MapPin size={15} color="#9A3412" /> {eventsList[0].location}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => { showToast(`Đã đăng ký tham gia ${eventsList[0].title} (+10 Điểm Rèn Luyện)!`); }}
                      style={{
                        padding: "11px 18px", borderRadius: 10, background: "#9A3412",
                        color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13.5,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                      }}
                    >
                      Đăng ký tham gia <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

                {/* CARD 2: Hòa nhạc Mùa Thu: Melody... */}
                <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                  <div style={{ height: 130, position: "relative" }}>
                    <img
                      src={eventsList[1].image}
                      alt={eventsList[1].title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#059669", color: "#FFFFFF", padding: "3px 8px", borderRadius: 6, fontSize: 10.5, fontWeight: 800 }}>
                      Văn hóa
                    </span>
                  </div>

                  <div style={{ padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontSize: 15.5, fontWeight: 900, color: "#0F172A", margin: "0 0 8px", lineHeight: 1.3 }}>
                        {eventsList[1].title}
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#64748B", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Clock size={13} /> {eventsList[1].time}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <MapPin size={13} /> {eventsList[1].location}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowEventDetailModal(eventsList[1])}
                      style={{ width: "100%", padding: "8px", borderRadius: 8, background: "#FFFFFF", color: "#2563EB", border: "1.5px solid #CBD5E1", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>

              </div>

              {/* HÀNG DƯỚI: 2 CARDS TIẾP THEO (Ảnh mới) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                {/* CARD 3: Workshop: Kỹ năng quản lý... */}
                <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                  <div style={{ height: 140, position: "relative" }}>
                    <img
                      src={eventsList[2].image}
                      alt={eventsList[2].title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#9A3412", color: "#FFFFFF", padding: "3px 8px", borderRadius: 6, fontSize: 10.5, fontWeight: 800 }}>
                      Học thuật
                    </span>
                  </div>

                  <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: "0 0 8px" }}>
                        {eventsList[2].title}
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#64748B", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Clock size={13} /> {eventsList[2].time}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <MapPin size={13} /> {eventsList[2].location}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowEventDetailModal(eventsList[2])}
                      style={{ width: "100%", padding: "8px", borderRadius: 8, background: "#FFFFFF", color: "#2563EB", border: "1.5px solid #CBD5E1", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>

                {/* CARD 4: Giải bóng rổ sinh viên FPT... */}
                <div style={{ background: "#FFFFFF", borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                  <div style={{ height: 140, position: "relative" }}>
                    <img
                      src={eventsList[3].image}
                      alt={eventsList[3].title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <span style={{ position: "absolute", top: 10, left: 10, background: "#D97706", color: "#FFFFFF", padding: "3px 8px", borderRadius: 6, fontSize: 10.5, fontWeight: 800 }}>
                      Thể thao
                    </span>
                  </div>

                  <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: "0 0 8px" }}>
                        {eventsList[3].title}
                      </h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: "#64748B", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Clock size={13} /> {eventsList[3].time}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <MapPin size={13} /> {eventsList[3].location}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowEventDetailModal(eventsList[3])}
                      style={{ width: "100%", padding: "8px", borderRadius: 8, background: "#FFFFFF", color: "#2563EB", border: "1.5px solid #CBD5E1", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 7: SERVICES - DỊCH VỤ SINH VIÊN (GỬI YÊU CẦU LÊN PHÒNG CTSV)
             ========================================================================= */}
          {activeTab === "services" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                <div>
                  <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                    Dịch Vụ Một Cửa Sinh Viên (SAO Online)
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Nộp hồ sơ trực tuyến, yêu cầu cấp phát giấy tờ và theo dõi tiến độ xử lý của Phòng CTSV.
                  </p>
                </div>

                <button
                  onClick={() => setShowCreateServiceRequestModal(true)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13.5, cursor: "pointer", boxShadow: "0 4px 12px rgba(154,52,18,0.25)" }}
                >
                  <Plus size={16} /> Gửi Yêu Cầu Mới
                </button>
              </div>

              {/* Danh mục dịch vụ */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
                {serviceCatalog.map((srv) => (
                  <div
                    key={srv.id}
                    style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 2px 6px rgba(0,0,0,0.02)" }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, background: srv.bg, color: srv.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <srv.icon size={20} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, background: "#F1F5F9", color: "#475569", padding: "2px 8px", borderRadius: 6 }}>
                          {srv.sla}
                        </span>
                      </div>

                      <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: "0 0 6px" }}>
                        {srv.title}
                      </h3>
                      <p style={{ fontSize: 12.5, color: "#64748B", margin: "0 0 14px", lineHeight: 1.5 }}>
                        {srv.desc}
                      </p>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>
                        Lệ phí: {srv.fee}
                      </span>
                      <button
                        onClick={() => {
                          setNewReqService(srv.title);
                          setShowCreateServiceRequestModal(true);
                        }}
                        style={{ padding: "6px 14px", borderRadius: 8, background: "#FFF7ED", color: "#9A3412", border: "1px solid #FDBA74", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                      >
                        Tạo Đơn
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lịch sử yêu cầu đã gửi của sinh viên */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15.5, fontWeight: 900, color: "#0F172A" }}>
                    <Inbox size={18} color="#9A3412" /> Lịch sử yêu cầu của tôi ({studentSubmittedRequests.length})
                  </div>
                  <button onClick={() => showToast("Đã đồng bộ trạng thái mới nhất từ FAP")} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#2563EB", fontSize: 12.5, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                    <RefreshCw size={13} /> Làm mới
                  </button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "12px 14px", fontWeight: 700, width: 130 }}>MÃ ĐƠN</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700 }}>DỊCH VỤ YÊU CẦU</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700 }}>MỤC ĐÍCH / LÝ DO</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, width: 110 }}>NGÀY GỬI</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, width: 130 }}>TRẠNG THÁI</th>
                      <th style={{ padding: "12px 14px", fontWeight: 700, textAlign: "right" }}>GHI CHÚ / KẾT QUẢ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentSubmittedRequests.map((req) => (
                      <tr key={req.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "14px", fontFamily: "monospace", fontWeight: 800, color: "#0F172A" }}>
                          {req.id}
                        </td>
                        <td style={{ padding: "14px", fontWeight: 700, color: "#0F172A" }}>
                          {req.service}
                        </td>
                        <td style={{ padding: "14px", color: "#475569" }}>
                          {req.reason}
                        </td>
                        <td style={{ padding: "14px", color: "#64748B" }}>
                          {req.date}
                        </td>
                        <td style={{ padding: "14px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11.5, fontWeight: 800, color: req.statusColor, background: req.statusBg }}>
                            ● {req.status}
                          </span>
                        </td>
                        <td style={{ padding: "14px", textAlign: "right", color: "#64748B", fontSize: 12 }}>
                          {req.sla}
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
      {/* Modal 1: Gửi yêu cầu dịch vụ sinh viên (One-stop student service) */}
      {showCreateServiceRequestModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 500, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                  Gửi Yêu Cầu Hành Chính Sinh Viên
                </h3>
                <span style={{ fontSize: 12, color: "#64748B" }}>Bộ phận tiếp nhận: Phòng Công tác Sinh viên (CTSV)</span>
              </div>
              <button onClick={() => setShowCreateServiceRequestModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>DỊCH VỤ CẦN YÊU CẦU</label>
                <select
                  value={newReqService}
                  onChange={e => setNewReqService(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFF" }}
                >
                  <option>Xin giấy xác nhận sinh viên</option>
                  <option>Cấp lại thẻ sinh viên (Mất / Hỏng)</option>
                  <option>Tạm hoãn nghĩa vụ quân sự</option>
                  <option>Mượn phòng tự học / Sinh hoạt CLB</option>
                  <option>Đăng ký / Gia hạn chỗ ở Ký túc xá</option>
                  <option>Đơn phúc khảo bài thi kết thúc môn</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>SỐ LƯỢNG BẢN IN</label>
                  <input type="number" min="1" max="5" value={newReqCopies} onChange={e => setNewReqCopies(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>HÌNH THỨC NHẬN</label>
                  <select style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFF" }}>
                    <option>Bản điện tử (PDF có mã QR)</option>
                    <option>Bản giấy (Nhận tại P.CTSV)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>MỤC ĐÍCH / LÝ DO XIN CẤP (*)</label>
                <input
                  placeholder="VD: Bổ sung hồ sơ vay vốn / Làm visa du học"
                  value={newReqPurpose}
                  onChange={e => setNewReqPurpose(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>GHI CHÚ THÊM (NẾU CÓ)</label>
                <textarea
                  rows={2}
                  placeholder="Thông tin thêm hoặc giấy tờ đính kèm..."
                  value={newReqNote}
                  onChange={e => setNewReqNote(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 12 }}>
              <button onClick={() => setShowCreateServiceRequestModal(false)} style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Hủy</button>
              <button onClick={handleCreateServiceRequest} style={{ padding: "10px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Gửi Lên Phòng CTSV</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Chi tiết sự kiện */}
      {showEventDetailModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 480, background: "#FFFFFF", borderRadius: 18, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ height: 160, position: "relative" }}>
              <img src={showEventDetailModal.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button onClick={() => setShowEventDetailModal(null)} style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.5)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: "20px 24px" }}>
              <span style={{ background: showEventDetailModal.badgeBg, color: showEventDetailModal.badgeColor, padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800 }}>
                {showEventDetailModal.category}
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: "8px 0" }}>
                {showEventDetailModal.title}
              </h3>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, marginBottom: 14 }}>
                {showEventDetailModal.description}
              </p>
              <div style={{ fontSize: 12.5, color: "#64748B", display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 }}>
                <div>📅 <strong>Thời gian:</strong> {showEventDetailModal.time}</div>
                <div>📍 <strong>Địa điểm:</strong> {showEventDetailModal.location}</div>
                <div>🏆 <strong>Quyền lợi:</strong> +5 đến +10 Điểm rèn luyện học kỳ</div>
              </div>
              <button
                onClick={() => {
                  showToast(`Đã đăng ký thành công sự kiện "${showEventDetailModal.title}"!`);
                  setShowEventDetailModal(null);
                }}
                style={{ width: "100%", padding: "10px", borderRadius: 10, background: "#9A3412", color: "#FFF", border: "none", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
              >
                Xác Nhận Đăng Ký Tham Gia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Submit Support Ticket */}
      {showSupportTicketModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 460, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Gửi Ticket Hỗ Trợ Sinh Viên
              </h3>
              <button onClick={() => setShowSupportTicketModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>BỘ PHẬN TIẾP NHẬN</label>
                <select style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFF" }}>
                  <option>Phòng Quản lý Đào tạo (Học vụ / Lịch học)</option>
                  <option>Phòng Công tác Sinh viên (CTSV / KTX / Giấy tờ)</option>
                  <option>Phòng Kế toán & Tài chính (Học phí / Học bổng)</option>
                  <option>Tổ CNTT (Hỗ trợ FAP / LMS / Mail)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>TIÊU ĐỀ YÊU CẦU</label>
                <input placeholder="VD: Khiếu nại điểm danh / Xin gia hạn học phí" style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>CHI TIẾT NỘI DUNG</label>
                <textarea rows={3} placeholder="Mô tả cụ thể vấn đề bạn cần nhà trường hỗ trợ..." style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => setShowSupportTicketModal(false)} style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Hủy</button>
              <button onClick={() => { setShowSupportTicketModal(false); showToast("Đã gửi ticket hỗ trợ thành công! Cán bộ sẽ phản hồi qua email."); }} style={{ padding: "10px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Gửi Ticket</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Check-in Attendance */}
      {showCheckInModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 420, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)", textAlign: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <CheckCircle size={26} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: "0 0 6px" }}>
              Điểm Danh Lớp Học (FAP Attendance)
            </h3>
            <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 16px" }}>
              Môn <strong>PRJ301 - Slot 1 (07:30 - 09:50)</strong> tại Phòng 202-Beta
            </p>
            <div style={{ padding: "12px", background: "#F8FAFC", borderRadius: 10, border: "1px dashed #CBD5E1", marginBottom: 18, fontSize: 12.5, color: "#0F172A" }}>
              📍 Đã xác thực vị trí GPS trong khuôn viên trường FPT University
            </div>
            <button onClick={() => { setShowCheckInModal(false); showToast("Đã điểm danh môn PRJ301 thành công (Trạng thái: Có mặt)!"); }} style={{ width: "100%", padding: "11px", borderRadius: 10, background: "#16A34A", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
              Xác Nhận Có Mặt
            </button>
          </div>
        </div>
      )}

      {/* Modal 5: Nộp bài tập (LMS Submit) */}
      {showSubmitAssignmentModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 480, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Nộp Bài Tập LMS
              </h3>
              <button onClick={() => setShowSubmitAssignmentModal(null)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
              <div>Môn học: <strong>{showSubmitAssignmentModal.code}</strong></div>
              <div>Bài tập: <strong>{showSubmitAssignmentModal.title}</strong></div>
              <div style={{ color: "#DC2626", fontWeight: 700, marginTop: 4 }}>Hạn nộp: {showSubmitAssignmentModal.deadline}</div>
            </div>

            <div style={{ border: "2px dashed #CBD5E1", borderRadius: 12, padding: "24px 16px", textAlign: "center", marginBottom: 18, background: "#FAFBFD" }}>
              <Upload size={28} color="#9A3412" style={{ margin: "0 auto 8px" }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Kéo thả file bài nộp hoặc bấm để chọn file</div>
              <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 4 }}>Chấp nhận .zip, .rar, .pdf (Tối đa 50MB)</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => setShowSubmitAssignmentModal(null)} style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Hủy</button>
              <button onClick={() => { setShowSubmitAssignmentModal(null); showToast(`Đã nộp bài ${showSubmitAssignmentModal.title} lên hệ thống LMS thành công!`); }} style={{ padding: "10px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Nộp Bài</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: Thanh toán học phí trực tuyến */}
      {showPaymentModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 460, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Thanh Toán Học Phí Trực Tuyến
              </h3>
              <button onClick={() => setShowPaymentModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "14px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", marginBottom: 16, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#64748B" }}>Học kỳ:</span>
                <strong>Thu 2026</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#64748B" }}>Học phí gốc:</span>
                <span>25,500,000 VNĐ</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "#64748B" }}>Học bổng tài năng (30%):</span>
                <span style={{ color: "#16A34A", fontWeight: 700 }}>-7,650,000 VNĐ</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E2E8F0", paddingTop: 8, fontSize: 14 }}>
                <strong style={{ color: "#0F172A" }}>Số tiền thanh toán:</strong>
                <strong style={{ color: "#9A3412", fontSize: 16 }}>17,850,000 VNĐ</strong>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>CHỌN CỔNG THANH TOÁN</div>
              <div style={{ padding: "10px 12px", borderRadius: 8, border: "1.5px solid #EA580C", background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontWeight: 700, color: "#9A3412", fontSize: 13 }}>🏦 VNPay QR / Thẻ ATM Nội Địa</span>
                <Check size={16} color="#EA580C" />
              </div>
              <div style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
                <span style={{ fontWeight: 600, color: "#334155", fontSize: 13 }}>💳 Thẻ Quốc Tế (Visa / Mastercard)</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => setShowPaymentModal(false)} style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Hủy</button>
              <button onClick={handleOnlinePaymentSuccess} style={{ padding: "10px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Thanh Toán Ngay</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 7: Help & Support */}
      {showHelpModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 480, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: "0 0 10px" }}>
              Hướng Dẫn Sử Dụng Cổng Sinh Viên FPT
            </h3>
            <ul style={{ fontSize: 13, color: "#334155", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <li><strong>Dashboard:</strong> Xem lịch học hôm nay, deadlines sắp tới, học phí kỳ hiện tại và tiến độ GPA.</li>
              <li><strong>Schedule:</strong> Theo dõi thời khóa biểu và lịch thi theo từng slot học.</li>
              <li><strong>Gradebook:</strong> Tra cứu bảng điểm chi tiết các môn học và tiến độ tích lũy tín chỉ.</li>
              <li><strong>LMS:</strong> Nhận bài tập, kiểm tra hạn nộp và nộp bài trực tuyến.</li>
              <li><strong>Finance:</strong> Theo dõi học phí, mức giảm trừ học bổng và đóng tiền trực tuyến.</li>
              <li><strong>Events:</strong> Khám phá sự kiện Campus (Hackathon, hòa nhạc, workshop, thể thao) và tích lũy điểm rèn luyện.</li>
              <li><strong>Services:</strong> Gửi yêu cầu hành chính trực tuyến lên Phòng Dịch vụ Sinh viên (CTSV).</li>
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
