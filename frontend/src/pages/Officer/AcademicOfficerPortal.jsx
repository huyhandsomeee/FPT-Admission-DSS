import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, BookOpen, GraduationCap, Clock, FileText,
  Search, Bell, HelpCircle, Download, Plus, CheckCircle,
  AlertTriangle, Filter, Check, X, ChevronRight, ChevronLeft,
  TrendingUp, TrendingDown, Eye, FileSpreadsheet, RefreshCw,
  LogOut, Mail, Settings, HelpCircle as SupportIcon, MoreVertical,
  Building, Megaphone, Wrench, DollarSign, UserCheck, ShieldAlert,
  SlidersHorizontal, ExternalLink, Printer, CheckCheck, Sparkles,
  ClipboardList, Users, CheckCircle2, XCircle, Edit3, Flame,
  FileCheck, ArrowRight, ShieldCheck, Award
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell
} from "recharts";
import * as XLSX from "xlsx";

export default function AcademicOfficerPortal() {
  const navigate = useNavigate();

  // Active navigation tab (5 tabs matching 5 screenshots)
  // schedule: Thời khóa biểu & Phòng học (Ảnh 1)
  // reports: Thống kê & Báo cáo học thuật (Ảnh 2)
  // curriculum: Quản lý Chương trình đào tạo (Ảnh 3)
  // graduation: Xét Tốt nghiệp & Cấp bằng (Ảnh 4)
  // exams: Quản lý Khảo thí & Tổ chức Thi (Ảnh 5)
  const [activeTab, setActiveTab] = useState("schedule");

  // ─── Search & Notifications State ───
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── TAB 1: THỜI KHÓA BIỂU & PHÒNG HỌC (ẢNH 1) ───
  const [selectedCampus, setSelectedCampus] = useState("Hòa Lạc");
  const [selectedBuilding, setSelectedBuilding] = useState("Alpha");
  const [selectedRoomType, setSelectedRoomType] = useState("Tất cả");

  const [waitingClasses, setWaitingClasses] = useState([
    {
      id: "CLS-01",
      code: "MAD101 - Lớp SE1701",
      lecturer: "VuF",
      students: 30,
      req: "2 buổi/tuần (Lý thuyết)",
      type: "theory"
    },
    {
      id: "CLS-02",
      code: "JPD113 - Lớp JP1705",
      lecturer: "SatoK",
      students: 25,
      req: "3 buổi/tuần (Sáng)",
      type: "theory"
    },
    {
      id: "CLS-03",
      code: "CSG101 - Lớp IA1702",
      lecturer: "NguyenG",
      students: 35,
      req: "Phòng thực hành (Lab máy tính)",
      type: "lab"
    }
  ]);

  // Modal xếp phòng
  const [assigningClass, setAssigningClass] = useState(null);
  const [targetRoomInput, setTargetRoomInput] = useState("AL 102");
  const [targetDayInput, setTargetDayInput] = useState("Thứ 4 (18)");
  const [targetSlotInput, setTargetSlotInput] = useState("Ca 1 (07:30 - 09:50)");

  const handleAssignRoom = () => {
    if (!assigningClass) return;
    setWaitingClasses(prev => prev.filter(c => c.id !== assigningClass.id));
    showToast(`Đã xếp phòng ${targetRoomInput} (${targetDayInput}, ${targetSlotInput}) cho ${assigningClass.code} thành công!`);
    setAssigningClass(null);
  };

  // ─── TAB 2: THỐNG KÊ & BÁO CÁO HỌC THUẬT (ẢNH 2) ───
  const gpaDistributionData = [
    { range: "< 2.0", count: 180, fill: "#BFDBFE" },
    { range: "2.0-2.5", count: 420, fill: "#93C5FD" },
    { range: "2.5-3.0", count: 860, fill: "#3B82F6" },
    { range: "3.0-3.5", count: 1250, fill: "#C2410C" }, // highest bar
    { range: "3.5-4.0", count: 540, fill: "#7C2D12" },
  ];

  const academicWarnings = [
    { id: "SE150012", name: "Nguyễn Văn A", gpa: 1.8, level: "Mức 1", levelColor: "#D97706", levelBg: "#FEF3C7" },
    { id: "SA160234", name: "Trần Thị B", gpa: 1.4, level: "Mức 2", levelColor: "#DC2626", levelBg: "#FEE2E2" },
    { id: "SS170881", name: "Lê Hoàng C", gpa: 1.9, level: "Mức 1", levelColor: "#D97706", levelBg: "#FEF3C7" },
    { id: "IA170512", name: "Phạm Quốc Dũng", gpa: 1.5, level: "Mức 2", levelColor: "#DC2626", levelBg: "#FEE2E2" }
  ];

  const teachingLoads = [
    { name: "ThS. Phạm Ngọc D", current: 320, max: 300, pct: "100%", color: "#1D4ED8" },
    { name: "TS. Hoàng Lê E", current: 285, max: 300, pct: "95%", color: "#2563EB" },
    { name: "ThS. Vũ Hữu F", current: 250, max: 300, pct: "83.3%", color: "#9A3412" }
  ];

  // ─── TAB 3: CHƯƠNG TRÌNH ĐÀO TẠO & ĐỀ CƯƠNG (ẢNH 3) ───
  const [selectedCourse, setSelectedCourse] = useState({
    code: "CSI104",
    name: "Introduction to Computing",
    credits: 3,
    prereq: "Không có",
    department: "Software Engineering (SE)",
    status: "Đã phê duyệt",
    description: "Môn học cung cấp kiến thức nền tảng về máy tính, hệ điều hành, mạng máy tính, internet và các khái niệm cơ bản về lập trình. Sinh viên sẽ làm quen với tư duy thuật toán và giải quyết vấn đề cơ bản."
  });

  const [pendingSyllabus, setPendingSyllabus] = useState([
    {
      code: "PRJ301",
      name: "Java Web Application Development",
      note: "Thêm nội dung Spring Boot",
      updatedDate: "12/10/2023"
    },
    {
      code: "SWP391",
      name: "Application Development Project",
      note: "Cập nhật tiêu chí đánh giá",
      updatedDate: "10/10/2023"
    }
  ]);

  const [reviewingSyllabus, setReviewingSyllabus] = useState(null);

  const handleApproveSyllabus = () => {
    if (!reviewingSyllabus) return;
    setPendingSyllabus(prev => prev.filter(s => s.code !== reviewingSyllabus.code));
    showToast(`Đã phê duyệt đề cương môn học ${reviewingSyllabus.code} - ${reviewingSyllabus.name}!`);
    setReviewingSyllabus(null);
  };

  // ─── TAB 4: XÉT TỐT NGHIỆP & CẤP BẰNG (ẢNH 4) ───
  const [gradSearch, setGradSearch] = useState("");
  const [gradFilterStatus, setGradFilterStatus] = useState("ALL");
  const [selectedGradIds, setSelectedGradIds] = useState([]);

  const [gradStudents, setGradStudents] = useState([
    {
      id: "SE150123",
      name: "Nguyễn Văn Hoàng",
      initials: "NH",
      avatarBg: "#EFF6FF",
      avatarColor: "#2563EB",
      major: "Kỹ thuật Phần mềm",
      creditsEarned: 145,
      creditsReq: 145,
      gpa: 8.5,
      toeic: true,
      ojt: true,
      pe: true,
      status: "APPROVED",
      statusText: "Đã duyệt",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7"
    },
    {
      id: "IB150456",
      name: "Trần Thị Mai",
      initials: "TM",
      avatarBg: "#EFF6FF",
      avatarColor: "#2563EB",
      major: "Kinh doanh Quốc tế",
      creditsEarned: 138,
      creditsReq: 138,
      gpa: 7.2,
      toeic: false, // Thiếu chuẩn đầu ra
      ojt: true,
      pe: true,
      status: "PENDING_CERT",
      statusText: "Thiếu chứng chỉ",
      statusColor: "#D97706",
      statusBg: "#FEF3C7"
    },
    {
      id: "GD160789",
      name: "Lê Minh Đạt",
      initials: "LD",
      avatarBg: "#EFF6FF",
      avatarColor: "#2563EB",
      major: "Thiết kế Đồ họa",
      creditsEarned: 142,
      creditsReq: 145,
      gpa: 8.0,
      toeic: true,
      ojt: true,
      pe: true,
      status: "CREDITS_SHORT",
      statusText: "Thiếu tín chỉ",
      statusColor: "#DC2626",
      statusBg: "#FEE2E2"
    },
    {
      id: "MC150999",
      name: "Phạm Thu Hương",
      initials: "PH",
      avatarBg: "#EFF6FF",
      avatarColor: "#2563EB",
      major: "Truyền thông Đa phương tiện",
      creditsEarned: 138,
      creditsReq: 138,
      gpa: 8.9,
      toeic: true,
      ojt: true,
      pe: true,
      status: "APPROVED",
      statusText: "Đã duyệt",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7"
    },
    {
      id: "AI160234",
      name: "Hoàng Đức Nam",
      initials: "HN",
      avatarBg: "#EFF6FF",
      avatarColor: "#2563EB",
      major: "Trí tuệ Nhân tạo (AI)",
      creditsEarned: 145,
      creditsReq: 145,
      gpa: 9.1,
      toeic: true,
      ojt: true,
      pe: true,
      status: "APPROVED",
      statusText: "Đã duyệt",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7"
    }
  ]);

  const filteredGradStudents = useMemo(() => {
    return gradStudents.filter(s => {
      const matchStatus = gradFilterStatus === "ALL" || s.status === gradFilterStatus;
      const q = gradSearch.toLowerCase().trim();
      const matchQ = !q || s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.major.toLowerCase().includes(q);
      return matchStatus && matchQ;
    });
  }, [gradStudents, gradFilterStatus, gradSearch]);

  const handleSelectAllGrad = (e) => {
    if (e.target.checked) {
      setSelectedGradIds(filteredGradStudents.map(s => s.id));
    } else {
      setSelectedGradIds([]);
    }
  };

  const handleSelectGrad = (id) => {
    if (selectedGradIds.includes(id)) {
      setSelectedGradIds(selectedGradIds.filter(x => x !== id));
    } else {
      setSelectedGradIds([...selectedGradIds, id]);
    }
  };

  const handleBatchApproveGrad = () => {
    if (selectedGradIds.length === 0) {
      showToast("Vui lòng tích chọn sinh viên để duyệt tốt nghiệp hàng loạt", "error");
      return;
    }
    setGradStudents(prev => prev.map(s => {
      if (selectedGradIds.includes(s.id)) {
        return { ...s, status: "APPROVED", statusText: "Đã duyệt", statusColor: "#16A34A", statusBg: "#DCFCE7" };
      }
      return s;
    }));
    showToast(`Đã phê duyệt điều kiện tốt nghiệp cho ${selectedGradIds.length} sinh viên được chọn!`);
    setSelectedGradIds([]);
  };

  const handleBatchFlagGrad = () => {
    if (selectedGradIds.length === 0) {
      showToast("Vui lòng tích chọn sinh viên để gắn cờ nghi vấn", "error");
      return;
    }
    showToast(`Đã gắn cờ nghi vấn hồ sơ cho ${selectedGradIds.length} sinh viên để xác minh lại chuẩn đầu ra.`);
  };

  const handleExportGraduationList = () => {
    const data = gradStudents.map(s => ({
      "Mã SV": s.id,
      "Họ và Tên": s.name,
      "Chuyên Ngành": s.major,
      "Tín Chỉ Đạt": `${s.creditsEarned}/${s.creditsReq}`,
      "Điểm GPA": s.gpa,
      "Chứng chỉ Ngoại ngữ": s.toeic ? "Đạt" : "Chưa đạt",
      "Thực tập OJT": s.ojt ? "Đạt" : "Chưa đạt",
      "Giáo dục Thể chất PE": s.pe ? "Đạt" : "Chưa đạt",
      "Trạng thái Tốt nghiệp": s.statusText
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TotNghiep_K17");
    XLSX.writeFile(wb, "DanhSach_XetTotNghiep_FPT.xlsx");
    showToast("Đã xuất danh sách xét tốt nghiệp ra file Excel thành công!");
  };

  // ─── TAB 5: QUẢN LÝ KHẢO THÍ & TỔ CHỨC THI (ẢNH 5) ───
  const [examSemester, setExamSemester] = useState("Fall 2023");
  const [examSubjectFilter, setExamSubjectFilter] = useState("Tất cả môn học");
  const [examCampusFilter, setExamCampusFilter] = useState("Cơ sở Hòa Lạc");

  const [examResults, setExamResults] = useState([
    {
      id: "EX-01",
      code: "CSD201",
      name: "Data Structures and Algorithms",
      group: "SE1601",
      date: "20/10/2023",
      status: "GRADED",
      statusText: "Đã chấm điểm",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7",
      appeals: 0
    },
    {
      id: "EX-02",
      code: "MKT101",
      name: "Marketing Principles",
      group: "IB1502",
      date: "21/10/2023",
      status: "PENDING",
      statusText: "Chờ nhập điểm",
      statusColor: "#D97706",
      statusBg: "#FEF3C7",
      appeals: 0
    },
    {
      id: "EX-03",
      code: "FIN202",
      name: "Corporate Finance",
      group: "FN1605",
      date: "18/10/2023",
      status: "APPEALED",
      statusText: "Phúc khảo (2 đơn)",
      statusColor: "#DC2626",
      statusBg: "#FEE2E2",
      appeals: 2
    },
    {
      id: "EX-04",
      code: "SWE302",
      name: "Software Architecture",
      group: "SE1703",
      date: "15/10/2023",
      status: "GRADED",
      statusText: "Đã chấm điểm",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7",
      appeals: 0
    }
  ]);

  const [selectedExamItem, setSelectedExamItem] = useState(null);
  const [showScheduleExamModal, setShowScheduleExamModal] = useState(false);

  // Form thêm ca thi
  const [newExamSubject, setNewExamSubject] = useState("PRJ301 - Java Web");
  const [newExamDate, setNewExamDate] = useState("2023-10-30");
  const [newExamTime, setNewExamTime] = useState("08:00");
  const [newExamRoom, setNewExamRoom] = useState("Phòng 301, Tòa Alpha");

  const handleCreateNewExam = () => {
    showToast(`Đã lên lịch ca thi môn ${newExamSubject} vào ngày ${newExamDate} lúc ${newExamTime} tại ${newExamRoom}!`);
    setShowScheduleExamModal(false);
  };

  const handleGradeExam = (exam) => {
    setExamResults(prev => prev.map(e => e.id === exam.id ? { ...e, status: "GRADED", statusText: "Đã chấm điểm", statusColor: "#16A34A", statusBg: "#DCFCE7" } : e));
    showToast(`Đã lưu bảng điểm hoàn tất cho lớp ${exam.group} môn ${exam.code}!`);
  };

  const handleResolveAppeal = (exam) => {
    setExamResults(prev => prev.map(e => e.id === exam.id ? { ...e, status: "GRADED", statusText: "Đã xử lý phúc khảo", statusColor: "#16A34A", statusBg: "#DCFCE7", appeals: 0 } : e));
    showToast(`Đã xử lý xong 2 đơn phúc khảo môn ${exam.code} (${exam.group}). Điểm số đã được cập nhật vào FAP!`);
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

      {/* ── SIDEBAR CÁN BỘ ĐÀO TẠO (FPT Academic / Education) ── */}
      <aside style={{
        width: 260, background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        flexShrink: 0, zIndex: 30
      }}>
        <div>
          {/* Brand Header */}
          <div style={{ padding: "24px 20px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "#EA580C", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(234,88,12,0.3)"
            }}>
              <GraduationCap size={24} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.3px", lineHeight: 1.15 }}>
                FPT Academic
              </div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, letterSpacing: "0.5px", marginTop: 2, textTransform: "uppercase" }}>
                CỔNG CÁN BỘ ĐÀO TẠO
              </div>
            </div>
          </div>

          {/* Navigation Links (Khớp 5 màn hình người dùng yêu cầu) */}
          <nav style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { id: "schedule", icon: Calendar, label: "Thời khóa biểu & Phòng" },
              { id: "reports", icon: FileText, label: "Báo cáo học thuật" },
              { id: "curriculum", icon: BookOpen, label: "Chương trình đào tạo" },
              { id: "graduation", icon: Award, label: "Xét tốt nghiệp & Bằng" },
              { id: "exams", icon: Clock, label: "Khảo thí & Lịch thi" },
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
                    color: isActive ? "#FFFFFF" : "#334155",
                    background: isActive ? "#60A5FA" : "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s ease",
                    boxShadow: isActive ? "0 4px 12px rgba(96,165,250,0.3)" : "none"
                  }}
                >
                  <tab.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom */}
        <div>
          {/* Action Button */}
          <div style={{ padding: "0 14px 14px" }}>
            <button
              onClick={() => {
                if (activeTab === "schedule") setAssigningClass(waitingClasses[0]);
                else if (activeTab === "exams") setShowScheduleExamModal(true);
                else showToast("Mở biểu mẫu cập nhật nghiệp vụ đào tạo");
              }}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                background: "#EA580C", color: "#FFFFFF", border: "none",
                fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(234,88,12,0.3)"
              }}
            >
              <Plus size={18} strokeWidth={2.5} /> + Thao tác nhanh
            </button>
          </div>

          <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
            <button
              onClick={() => showToast("Đã mở thiết lập cấu hình học kỳ & phòng học")}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "#475569", background: "transparent", border: "none", cursor: "pointer"
              }}
            >
              <Settings size={17} /> Cài đặt học kỳ
            </button>
            <button
              onClick={() => setShowHelpModal(true)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "#475569", background: "transparent", border: "none", cursor: "pointer"
              }}
            >
              <SupportIcon size={17} /> Hướng dẫn đào tạo
            </button>
          </div>

          {/* User Profile */}
          <div style={{ padding: "14px 18px", borderTop: "1px solid #F1F5F9", background: "#FAFBFD", marginTop: 8 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "#EFF6FF", color: "#2563EB", display: "flex",
                  alignItems: "center", justifyContent: "center", fontWeight: 800,
                  fontSize: 13, border: "2px solid #DBEAFE"
                }}>
                  ĐT
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Cán bộ Đào tạo</div>
                  <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>Phòng Quản lý Đào tạo</div>
                </div>
              </div>
              <button
                onClick={() => navigate("/login")}
                title="Đổi vai trò"
                style={{
                  width: 32, height: 32, borderRadius: 8, border: "1px solid #E2E8F0",
                  background: "#FFFFFF", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "#64748B"
                }}
              >
                <LogOut size={15} />
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
            {activeTab === "schedule" && "Quản Lý Thời Khóa Biểu & Phòng Học"}
            {activeTab === "reports" && "Thống Kê & Báo Cáo Học Thuật"}
            {activeTab === "curriculum" && "Quản Lý Chương Trình Đào Tạo & Syllabus"}
            {activeTab === "graduation" && "Xét Tốt Nghiệp & Quản Lý Văn Bằng"}
            {activeTab === "exams" && "Quản Lý Khảo Thí & Tổ Chức Thi"}
          </div>

          <div style={{ position: "relative", width: 440, maxWidth: "45%" }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder={
                activeTab === "schedule" ? "Tìm kiếm phòng, lớp học..." :
                activeTab === "curriculum" ? "Tìm kiếm chương trình, môn học..." :
                activeTab === "graduation" ? "Tìm kiếm sinh viên theo MSSV, Họ tên..." :
                "Tìm kiếm thông tin học vụ, ca thi..."
              }
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              style={{
                width: "100%", padding: "9px 14px 9px 38px", borderRadius: 10,
                border: "1px solid #CBD5E1", fontSize: 13, outline: "none",
                background: "#F8FAFC", boxSizing: "border-box"
              }}
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch("")}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}
              >
                <X size={14} />
              </button>
            )}
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
                    <span style={{ fontWeight: 800, fontSize: 13, color: "#0F172A" }}>Thông Báo Đào Tạo</span>
                    <span style={{ fontSize: 11, color: "#2563EB", cursor: "pointer" }} onClick={() => setShowNotifications(false)}>Đóng</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12.5 }}>
                    <div style={{ padding: "8px 10px", background: "#FEF3C7", borderRadius: 8, color: "#92400E" }}>
                      ⚠️ Có <strong>15 lớp</strong> đang chờ xếp lịch phòng học cho tuần mới.
                    </div>
                    <div style={{ padding: "8px 10px", background: "#EFF6FF", borderRadius: 8, color: "#1E40AF" }}>
                      📚 Bộ môn SE vừa gửi <strong>2 đề cương môn học</strong> chờ phê duyệt.
                    </div>
                    <div style={{ padding: "8px 10px", background: "#DCFCE7", borderRadius: 8, color: "#166534" }}>
                      🎓 <strong>982 sinh viên</strong> đã đủ điều kiện tốt nghiệp đợt tháng 10/2023.
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
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #FFEDD5, #FED7AA)",
                border: "1.5px solid #EA580C", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#9A3412"
              }}>
                ĐT
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Cán bộ Đào tạo</span>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT OUTLET ── */}
        <div style={{ flex: 1, padding: "28px 32px 48px", maxWidth: 1440, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

          {/* =========================================================================
              MÀN HÌNH 1: THỜI KHÓA BIỂU & PHÒNG HỌC (EXACT SCREENSHOT 1)
             ========================================================================= */}
          {activeTab === "schedule" && (
            <div>
              {/* Filter Bar trên cùng (Ảnh 1) */}
              <div style={{
                background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0",
                padding: "16px 20px", display: "flex", alignItems: "flex-end",
                justifyContent: "space-between", gap: 16, marginBottom: 22
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, flex: 1 }}>
                  {/* CƠ SỞ */}
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 800, color: "#64748B", marginBottom: 6 }}>
                      CƠ SỞ (CAMPUS)
                    </label>
                    <select
                      value={selectedCampus}
                      onChange={e => setSelectedCampus(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 600, color: "#0F172A", background: "#FFFFFF", outline: "none" }}
                    >
                      <option>Hòa Lạc</option>
                      <option>TP. Hồ Chí Minh</option>
                      <option>Đà Nẵng</option>
                      <option>Cần Thơ</option>
                      <option>Quy Nhơn</option>
                    </select>
                  </div>

                  {/* TÒA NHÀ */}
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 800, color: "#64748B", marginBottom: 6 }}>
                      TÒA NHÀ
                    </label>
                    <select
                      value={selectedBuilding}
                      onChange={e => setSelectedBuilding(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 600, color: "#0F172A", background: "#FFFFFF", outline: "none" }}
                    >
                      <option>Alpha</option>
                      <option>Beta</option>
                      <option>Gamma</option>
                      <option>Delta</option>
                    </select>
                  </div>

                  {/* LOẠI PHÒNG */}
                  <div>
                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 800, color: "#64748B", marginBottom: 6 }}>
                      LOẠI PHÒNG
                    </label>
                    <select
                      value={selectedRoomType}
                      onChange={e => setSelectedRoomType(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 600, color: "#0F172A", background: "#FFFFFF", outline: "none" }}
                    >
                      <option>Tất cả</option>
                      <option>Lý thuyết</option>
                      <option>Thực hành (Lab)</option>
                      <option>Hội trường lớn</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      setSelectedCampus("Hòa Lạc");
                      setSelectedBuilding("Alpha");
                      setSelectedRoomType("Tất cả");
                      showToast("Đã đặt lại bộ lọc");
                    }}
                    style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", color: "#334155", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => showToast(`Đã áp dụng bộ lọc Tòa ${selectedBuilding} - Cơ sở ${selectedCampus}`)}
                    style={{ padding: "10px 22px", borderRadius: 8, border: "none", background: "#9A3412", color: "#FFFFFF", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Filter size={15} /> Áp dụng
                  </button>
                </div>
              </div>

              {/* 3 KPI Cards (Ảnh 1) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr 1fr", gap: 18, marginBottom: 24 }}>
                {/* Card 1 */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Tỷ lệ lấp đầy phòng (Hôm nay)</span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#DBEAFE", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Building size={16} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontSize: 34, fontWeight: 900, color: "#0F172A" }}>84%</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A" }}>📈 +2%</span>
                  </div>
                  <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#E2E8F0", marginTop: 10, overflow: "hidden" }}>
                    <div style={{ width: "84%", height: "100%", background: "#2563EB" }} />
                  </div>
                </div>

                {/* Card 2 */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Tổng số ca học (Tuần này)</span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FFEDD5", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock size={16} />
                    </div>
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A" }}>1,248</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Trong đó <strong>42</strong> ca thực hành Lab</div>
                </div>

                {/* Card 3 */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Lớp chờ xếp lịch</span>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ClipboardList size={16} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                    <span style={{ fontSize: 34, fontWeight: 900, color: "#0F172A" }}>{waitingClasses.length}</span>
                    <span style={{ fontSize: 14, color: "#64748B", fontWeight: 600 }}>lớp</span>
                  </div>
                  <div
                    onClick={() => setAssigningClass(waitingClasses[0])}
                    style={{ fontSize: 12, fontWeight: 800, color: "#EA580C", marginTop: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                  >
                    XỬ LÝ NGAY <ArrowRight size={13} />
                  </div>
                </div>
              </div>

              {/* Main Content 2 Cột (Lịch Phòng Học + Lớp Chờ Xếp) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 22, alignItems: "start" }}>

                {/* Cột trái: Lịch Phòng Học Tòa Alpha */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                      <Calendar size={18} color="#EA580C" /> Lịch Phòng Học (Tòa {selectedBuilding})
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: "#475569" }}>
                      <button style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}><ChevronLeft size={16} /></button>
                      <span>Tuần 42 (16/10 - 22/10)</span>
                      <button style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}><ChevronRight size={16} /></button>
                    </div>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                        <th style={{ padding: "12px 14px", fontWeight: 700, width: 80 }}>Phòng</th>
                        <th style={{ padding: "12px 14px", fontWeight: 700 }}>Thứ 2 (16)</th>
                        <th style={{ padding: "12px 14px", fontWeight: 700 }}>Thứ 3 (17)</th>
                        <th style={{ padding: "12px 14px", fontWeight: 700 }}>Thứ 4 (18)</th>
                        <th style={{ padding: "12px 14px", fontWeight: 700 }}>Thứ 5 (19)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* AL 101 */}
                      <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "16px 14px", fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>AL 101</td>
                        <td style={{ padding: "10px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ padding: "8px 10px", background: "#EFF6FF", borderLeft: "3px solid #3B82F6", borderRadius: 6 }}>
                              <div style={{ fontWeight: 700, color: "#1E40AF", fontSize: 12 }}>SWE201c - Ca 1</div>
                              <div style={{ fontSize: 11, color: "#64748B" }}>GV: NguyenVA</div>
                            </div>
                            <div style={{ padding: "8px 10px", background: "#EFF6FF", borderLeft: "3px solid #3B82F6", borderRadius: 6 }}>
                              <div style={{ fontWeight: 700, color: "#1E40AF", fontSize: 12 }}>PRJ301 - Ca 3</div>
                              <div style={{ fontSize: 11, color: "#64748B" }}>GV: TranB</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "10px" }}>
                          <div style={{ padding: "10px", background: "#FFF7ED", borderLeft: "3px solid #EA580C", borderRadius: 6 }}>
                            <div style={{ fontWeight: 700, color: "#9A3412", fontSize: 12 }}>Sự kiện Đoàn</div>
                            <div style={{ fontSize: 11, color: "#64748B" }}>Ca 2 - Ca 4</div>
                          </div>
                        </td>
                        <td style={{ padding: "10px" }}>
                          <div style={{ padding: "8px 10px", background: "#EFF6FF", borderLeft: "3px solid #3B82F6", borderRadius: 6 }}>
                            <div style={{ fontWeight: 700, color: "#1E40AF", fontSize: 12 }}>SWE201c - Ca 1</div>
                            <div style={{ fontSize: 11, color: "#64748B" }}>GV: NguyenVA</div>
                          </div>
                        </td>
                        <td style={{ padding: "10px", color: "#94A3B8", textAlign: "center" }}>--</td>
                      </tr>

                      {/* AL 102 */}
                      <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "16px 14px", fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>AL 102</td>
                        <td style={{ padding: "10px", color: "#94A3B8", textAlign: "center" }}>--</td>
                        <td style={{ padding: "10px" }}>
                          <div style={{ padding: "8px 10px", background: "#F1F5F9", borderLeft: "3px solid #64748B", borderRadius: 6 }}>
                            <div style={{ fontWeight: 700, color: "#334155", fontSize: 12 }}>MAS291 - Ca 2</div>
                            <div style={{ fontSize: 11, color: "#64748B" }}>GV: LeCD</div>
                          </div>
                        </td>
                        <td style={{ padding: "10px", color: "#94A3B8", textAlign: "center" }}>--</td>
                        <td style={{ padding: "10px" }}>
                          <div style={{ padding: "8px 10px", background: "#F1F5F9", borderLeft: "3px solid #64748B", borderRadius: 6 }}>
                            <div style={{ fontWeight: 700, color: "#334155", fontSize: 12 }}>MAS291 - Ca 2</div>
                            <div style={{ fontSize: 11, color: "#64748B" }}>GV: LeCD</div>
                          </div>
                        </td>
                      </tr>

                      {/* AL 103 (Lab) */}
                      <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "16px 14px", fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>
                          💻 AL 103
                        </td>
                        <td style={{ padding: "10px" }}>
                          <div style={{ padding: "8px 10px", background: "#ECFDF5", borderLeft: "3px solid #10B981", borderRadius: 6 }}>
                            <div style={{ fontWeight: 700, color: "#065F46", fontSize: 12 }}>DBI202 - Ca 1-2</div>
                            <div style={{ fontSize: 11, color: "#64748B" }}>GV: PhamE (Thực hành)</div>
                          </div>
                        </td>
                        <td style={{ padding: "10px", color: "#94A3B8", textAlign: "center" }}>--</td>
                        <td style={{ padding: "10px", color: "#94A3B8", textAlign: "center" }}>--</td>
                        <td style={{ padding: "10px" }}>
                          <div style={{ padding: "8px 10px", background: "#ECFDF5", borderLeft: "3px solid #10B981", borderRadius: 6 }}>
                            <div style={{ fontWeight: 700, color: "#065F46", fontSize: 12 }}>DBI202 - Ca 1-2</div>
                            <div style={{ fontSize: 11, color: "#64748B" }}>GV: PhamE (Thực hành)</div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Cột phải: Lớp chờ xếp lịch (Ảnh 1) */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                      <AlertTriangle size={18} color="#D97706" /> Lớp chờ xếp lịch
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 800, background: "#FEF3C7", color: "#B45309", padding: "2px 8px", borderRadius: 100 }}>
                      {waitingClasses.length}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {waitingClasses.map((cls) => (
                      <div key={cls.id} style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                          <span style={{ fontWeight: 800, color: "#0F172A", fontSize: 13.5 }}>{cls.code}</span>
                          <MoreVertical size={14} color="#94A3B8" />
                        </div>
                        <div style={{ fontSize: 12, color: "#64748B", display: "flex", gap: 12, marginBottom: 6 }}>
                          <span>👤 GV: <strong>{cls.lecturer}</strong></span>
                          <span>👥 SV: <strong>{cls.students}</strong></span>
                        </div>
                        <div style={{ fontSize: 12, color: "#475569", marginBottom: 12 }}>
                          {cls.type === "lab" ? "💻" : "🕒"} Yêu cầu: {cls.req}
                        </div>
                        <button
                          onClick={() => setAssigningClass(cls)}
                          style={{
                            width: "100%", padding: "8px 12px", borderRadius: 8,
                            border: "1.5px solid #EA580C", background: "#FFFFFF",
                            color: "#EA580C", fontWeight: 700, fontSize: 12.5, cursor: "pointer",
                            transition: "all 0.15s"
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#EA580C"; e.currentTarget.style.color = "#FFF"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "#FFF"; e.currentTarget.style.color = "#EA580C"; }}
                        >
                          {cls.type === "lab" ? "Tìm phòng Lab trống" : "Tìm phòng trống"}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div style={{ textAlign: "center", marginTop: 16 }}>
                    <span onClick={() => showToast("Đang tải danh sách 15 lớp chờ xếp lịch")} style={{ fontSize: 12.5, fontWeight: 700, color: "#9A3412", cursor: "pointer" }}>
                      Xem tất cả (15 lớp)
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 2: THỐNG KÊ & BÁO CÁO HỌC THUẬT (EXACT SCREENSHOT 2)
             ========================================================================= */}
          {activeTab === "reports" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                    Thống kê & Báo cáo học thuật
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: "4px 0 0", fontWeight: 500 }}>
                    Phòng Đào tạo - Học kỳ Thu 2024
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => showToast("Đã xuất báo cáo học thuật toàn trường ra file PDF")}
                    style={{ padding: "10px 18px", borderRadius: 10, border: "1.5px solid #CBD5E1", background: "#FFFFFF", color: "#1E293B", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                  >
                    Xuất báo cáo
                  </button>
                  <button
                    onClick={() => showToast("Đã đồng bộ và cập nhật dữ liệu điểm FAP mới nhất!")}
                    style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "#9A3412", color: "#FFFFFF", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                  >
                    Cập nhật dữ liệu
                  </button>
                </div>
              </div>

              {/* Hàng 1: Pass Rate + Fail Rate + Phân bổ GPA (Ảnh 2) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.6fr", gap: 18, marginBottom: 24 }}>
                {/* Tỷ lệ Pass */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Tỷ lệ sinh viên đạt (Pass Rate)</span>
                    <CheckCircle size={18} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px" }}>87.5%</div>
                  <div style={{ width: "100%", height: 8, borderRadius: 4, background: "#E2E8F0", marginTop: 14, overflow: "hidden", display: "flex" }}>
                    <div style={{ width: "87.5%", height: "100%", background: "#9A3412" }} />
                    <div style={{ width: "12.5%", height: "100%", background: "#1E40AF" }} />
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A", marginTop: 10 }}>
                    📈 +2.1% so với kỳ trước
                  </div>
                </div>

                {/* Tỷ lệ Fail */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Tỷ lệ sinh viên trượt (Fail Rate)</span>
                    <XCircle size={18} color="#DC2626" />
                  </div>
                  <div style={{ fontSize: 36, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px" }}>12.5%</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#DC2626", marginTop: 32 }}>
                    📉 -0.5% so với kỳ trước
                  </div>
                </div>

                {/* Phân bổ GPA toàn trường */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A" }}>Phân bổ GPA toàn trường</span>
                    <MoreVertical size={16} color="#94A3B8" />
                  </div>

                  <div style={{ width: "100%", height: 130 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={gpaDistributionData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <XAxis dataKey="range" fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: "#0F172A", borderRadius: 8, color: "#FFF", fontSize: 12 }} />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {gpaDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Hàng 2: Cảnh báo học tập + Khối lượng giảng dạy (Ảnh 2) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
                {/* Cảnh báo học tập */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 800, color: "#D97706" }}>
                      <AlertTriangle size={17} /> Cảnh báo học tập (Mức 1 & 2)
                    </div>
                    <span onClick={() => showToast("Hiển thị danh sách 54 sinh viên bị cảnh báo học vụ")} style={{ fontSize: 12, fontWeight: 700, color: "#2563EB", cursor: "pointer" }}>
                      Xem tất cả
                    </span>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                        <th style={{ padding: "8px 0", fontWeight: 700 }}>MSSV</th>
                        <th style={{ padding: "8px 12px", fontWeight: 700 }}>Họ & Tên</th>
                        <th style={{ padding: "8px 12px", fontWeight: 700 }}>GPA Tích lũy</th>
                        <th style={{ padding: "8px 0", fontWeight: 700, textAlign: "right" }}>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {academicWarnings.map((w, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "12px 0", fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>{w.id}</td>
                          <td style={{ padding: "12px 12px", fontWeight: 700, color: "#0F172A" }}>{w.name}</td>
                          <td style={{ padding: "12px 12px", fontWeight: 800, color: "#DC2626" }}>{w.gpa}</td>
                          <td style={{ padding: "12px 0", textAlign: "right" }}>
                            <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800, background: w.levelBg, color: w.levelColor }}>
                              {w.level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Khối lượng giảng dạy */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 800, color: "#0F172A" }}>
                      <Users size={17} color="#2563EB" /> Khối lượng giảng dạy (Top Giảng viên)
                    </div>
                    <SlidersHorizontal size={15} color="#94A3B8" />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {teachingLoads.map((gv, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                          <strong style={{ color: "#0F172A" }}>{gv.name}</strong>
                          <span style={{ fontSize: 11.5, color: "#64748B" }}>{gv.current} giờ / {gv.max} giờ chuẩn</span>
                        </div>
                        <div style={{ width: "100%", height: 8, borderRadius: 4, background: "#E2E8F0", overflow: "hidden" }}>
                          <div style={{ width: gv.pct, height: "100%", background: gv.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 3: QUẢN LÝ CHƯƠNG TRÌNH ĐÀO TẠO (EXACT SCREENSHOT 3)
             ========================================================================= */}
          {activeTab === "curriculum" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                    Quản lý Chương trình đào tạo
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: "4px 0 0", fontWeight: 500 }}>
                    Ngành Kỹ thuật Phần mềm (Software Engineering) - Khóa 17
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => showToast("Đã mở chế độ chỉnh sửa khung chương trình đào tạo K17")}
                    style={{ padding: "10px 18px", borderRadius: 10, border: "1.5px solid #2563EB", background: "#FFFFFF", color: "#2563EB", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                  >
                    Sửa Khung Chương Trình
                  </button>
                  <button
                    onClick={() => setReviewingSyllabus(pendingSyllabus[0])}
                    style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "#9A3412", color: "#FFFFFF", fontWeight: 700, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <CheckCircle size={16} /> Phê duyệt Đề cương
                  </button>
                </div>
              </div>

              {/* 2 Cột: Khung CTĐT bên trái + Chi tiết môn & Đề cương chờ duyệt bên phải */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 22, alignItems: "start" }}>

                {/* Cột trái: Khung học kỳ */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Học kỳ 1 */}
                  <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <strong style={{ fontSize: 15, color: "#0F172A" }}>Học kỳ 1</strong>
                      <span style={{ fontSize: 11.5, fontWeight: 700, background: "#F1F5F9", color: "#475569", padding: "3px 8px", borderRadius: 6 }}>15 Tín chỉ</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[
                        { code: "CSI104", name: "Introduction to Computing", tc: "3 TC" },
                        { code: "PRF192", name: "Programming Fundamentals", tc: "3 TC" },
                        { code: "MAE101", name: "Mathematics for Engineering", tc: "3 TC" },
                      ].map((item) => {
                        const isSelected = selectedCourse.code === item.code;
                        return (
                          <div
                            key={item.code}
                            onClick={() => setSelectedCourse({
                              code: item.code,
                              name: item.name,
                              credits: 3,
                              prereq: item.code === "CSI104" ? "Không có" : "CSI104",
                              department: "Software Engineering (SE)",
                              status: "Đã phê duyệt",
                              description: `Môn học ${item.name} (${item.code}) thuộc khối kiến thức cơ sở ngành công nghệ thông tin tại Đại học FPT.`
                            })}
                            style={{
                              padding: "12px 14px", borderRadius: 10,
                              background: isSelected ? "#FFF7ED" : "#F8FAFC",
                              borderLeft: isSelected ? "4px solid #EA580C" : "1px solid #E2E8F0",
                              display: "flex", justifyContent: "space-between", alignItems: "center",
                              cursor: "pointer", transition: "all 0.15s"
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 800, color: isSelected ? "#9A3412" : "#0F172A", fontSize: 13 }}>{item.code}</div>
                              <div style={{ fontSize: 12, color: "#64748B" }}>{item.name}</div>
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>{item.tc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Học kỳ 2 */}
                  <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <strong style={{ fontSize: 15, color: "#0F172A" }}>Học kỳ 2</strong>
                      <span style={{ fontSize: 11.5, fontWeight: 700, background: "#F1F5F9", color: "#475569", padding: "3px 8px", borderRadius: 6 }}>16 Tín chỉ</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B", fontStyle: "italic" }}>5 môn học (CSD201, PRO192, MAS291, LAB211, JPD113)...</div>
                  </div>
                </div>

                {/* Cột phải: Chi tiết môn + Đề cương chờ duyệt */}
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                  {/* Chi tiết môn học được chọn */}
                  <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px 26px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ padding: "3px 10px", borderRadius: 6, background: "#FFEDD5", color: "#C2410C", fontWeight: 800, fontSize: 12 }}>
                            {selectedCourse.code}
                          </span>
                          <span style={{ padding: "3px 10px", borderRadius: 6, background: "#DCFCE7", color: "#166534", fontWeight: 700, fontSize: 11.5, display: "flex", alignItems: "center", gap: 4 }}>
                            <Check size={13} /> {selectedCourse.status}
                          </span>
                        </div>
                        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                          {selectedCourse.name}
                        </h2>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#64748B", letterSpacing: "0.5px" }}>SỐ TÍN CHỈ</div>
                        <div style={{ fontSize: 36, fontWeight: 900, color: "#EA580C", lineHeight: 1 }}>
                          {selectedCourse.credits}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
                      <div style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                        <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>Môn tiên quyết</div>
                        <strong style={{ color: "#0F172A", fontSize: 13 }}>{selectedCourse.prereq}</strong>
                      </div>
                      <div style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                        <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>Bộ môn quản lý</div>
                        <strong style={{ color: "#0F172A", fontSize: 13 }}>{selectedCourse.department}</strong>
                      </div>
                    </div>

                    <div style={{ padding: "14px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9", marginBottom: 18 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Mô tả tóm tắt</div>
                      <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                        {selectedCourse.description}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: 20, fontSize: 12.5, fontWeight: 700 }}>
                      <span onClick={() => showToast(`Đang tải file Syllabus chi tiết môn ${selectedCourse.code}`)} style={{ color: "#2563EB", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        📄 Xem chi tiết Syllabus
                      </span>
                      <span onClick={() => showToast("Lịch sử cập nhật: Phiên bản 2.4 cập nhật tháng 08/2023")} style={{ color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        🕒 Lịch sử cập nhật
                      </span>
                    </div>
                  </div>

                  {/* Đề cương chờ phê duyệt mới (Ảnh 3) */}
                  <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 800, color: "#0F172A" }}>
                        <Clock size={16} color="#EA580C" /> Đề cương chờ phê duyệt mới
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: 800, background: "#F1F5F9", color: "#475569", padding: "3px 8px", borderRadius: 6 }}>
                        {pendingSyllabus.length} Yêu cầu
                      </span>
                    </div>

                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                          <th style={{ padding: "8px 0", fontWeight: 700 }}>Mã Môn</th>
                          <th style={{ padding: "8px 12px", fontWeight: 700 }}>Tên Môn & Nội dung sửa</th>
                          <th style={{ padding: "8px 12px", fontWeight: 700 }}>Cập nhật</th>
                          <th style={{ padding: "8px 0", fontWeight: 700, textAlign: "right" }}>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingSyllabus.map((item) => (
                          <tr key={item.code} style={{ borderBottom: "1px solid #F1F5F9" }}>
                            <td style={{ padding: "12px 0", fontFamily: "monospace", fontWeight: 800, color: "#0F172A" }}>{item.code}</td>
                            <td style={{ padding: "12px 12px" }}>
                              <div style={{ fontWeight: 700, color: "#0F172A" }}>{item.name}</div>
                              <div style={{ fontSize: 11.5, color: "#64748B" }}>{item.note}</div>
                            </td>
                            <td style={{ padding: "12px 12px", color: "#64748B" }}>{item.updatedDate}</td>
                            <td style={{ padding: "12px 0", textAlign: "right" }}>
                              <button
                                onClick={() => setReviewingSyllabus(item)}
                                style={{ padding: "5px 12px", borderRadius: 6, background: "#FFF7ED", color: "#9A3412", border: "none", fontWeight: 800, fontSize: 11.5, cursor: "pointer" }}
                              >
                                REVIEW
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 4: XÉT TỐT NGHIỆP & CẤP BẰNG (EXACT SCREENSHOT 4)
             ========================================================================= */}
          {activeTab === "graduation" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#64748B", fontWeight: 600, marginBottom: 4 }}>
                    Academic Affairs &gt; Degree Processing
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                    Xét Tốt Nghiệp & Cấp Bằng (Graduation Processing)
                  </h1>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={handleExportGraduationList}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, border: "1.5px solid #CBD5E1", background: "#FFFFFF", color: "#1E293B", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                  >
                    <Download size={16} /> Xuất danh sách (Excel)
                  </button>
                  <button
                    onClick={() => showToast("Đã ban hành quyết định công nhận tốt nghiệp đợt Thu 2023 cho 982 sinh viên!")}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 10, border: "none", background: "#9A3412", color: "#FFFFFF", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                  >
                    <Award size={16} /> Ban hành quyết định tốt nghiệp
                  </button>
                </div>
              </div>

              {/* 4 Thẻ KPI (Ảnh 4) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 22 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Sinh viên đủ điều kiện xét</span>
                    <Users size={16} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>1,248</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginTop: 6 }}>📈 +12% so với đợt trước</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Đã đủ điều kiện tốt nghiệp</span>
                    <CheckCircle size={16} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>982</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>Sẵn sàng in bằng tốt nghiệp</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Chờ xác minh chứng chỉ</span>
                    <Clock size={16} color="#D97706" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>215</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>Đang chờ điểm chuẩn đầu ra</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Hồ sơ có vướng mắc</span>
                    <AlertTriangle size={16} color="#DC2626" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>51</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#DC2626", marginTop: 6 }}>Cần xử lý ngay</div>
                </div>
              </div>

              {/* Action & Filter Bar */}
              <div style={{
                background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0",
                padding: "12px 18px", display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 16
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <div style={{ position: "relative", width: 340 }}>
                    <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                    <input
                      placeholder="Tìm kiếm theo MSSV hoặc họ tên..."
                      value={gradSearch}
                      onChange={e => setGradSearch(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px 8px 36px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12.5, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <select
                    value={gradFilterStatus}
                    onChange={e => setGradFilterStatus(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12.5, background: "#FFFFFF" }}
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="APPROVED">Đã duyệt (Approved)</option>
                    <option value="PENDING_CERT">Thiếu chứng chỉ ngoại ngữ</option>
                    <option value="CREDITS_SHORT">Thiếu tín chỉ</option>
                  </select>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 12.5, color: "#64748B", fontWeight: 600 }}>Thao tác hàng loạt:</span>
                  <button
                    onClick={handleBatchApproveGrad}
                    style={{ padding: "8px 16px", borderRadius: 8, background: "#1D4ED8", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                  >
                    Duyệt các mục đã chọn ({selectedGradIds.length})
                  </button>
                  <button
                    onClick={handleBatchFlagGrad}
                    style={{ padding: "8px 16px", borderRadius: 8, background: "#FFFFFF", color: "#DC2626", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                  >
                    Gắn cờ nghi vấn
                  </button>
                </div>
              </div>

              {/* Bảng dữ liệu xét tốt nghiệp (Ảnh 4) */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", marginBottom: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "14px 18px", width: 36 }}>
                        <input
                          type="checkbox"
                          checked={selectedGradIds.length === filteredGradStudents.length && filteredGradStudents.length > 0}
                          onChange={handleSelectAllGrad}
                          style={{ cursor: "pointer" }}
                        />
                      </th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>SINH VIÊN</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>NGÀNH HỌC</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5, textAlign: "center" }}>TÍN CHỈ / GPA</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5, textAlign: "center" }}>TOEIC</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5, textAlign: "center" }}>OJT</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5, textAlign: "center" }}>GDTC (PE)</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5, textAlign: "right" }}>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGradStudents.map((st) => {
                      const isSelected = selectedGradIds.includes(st.id);
                      return (
                        <tr key={st.id} style={{ borderBottom: "1px solid #F1F5F9", background: isSelected ? "#F8FAFC" : "#FFFFFF" }}>
                          <td style={{ padding: "16px 18px" }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectGrad(st.id)}
                              style={{ cursor: "pointer" }}
                            />
                          </td>

                          <td style={{ padding: "16px 18px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 36, height: 36, borderRadius: "50%", background: st.avatarBg, color: st.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12.5 }}>
                                {st.initials}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: "#0F172A", fontSize: 13.5 }}>{st.name}</div>
                                <div style={{ fontSize: 11.5, color: "#94A3B8" }}>{st.id}</div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: "16px 18px", color: "#334155", fontWeight: 600 }}>{st.major}</td>

                          <td style={{ padding: "16px 18px", textAlign: "center" }}>
                            <div style={{ fontSize: 11.5, color: st.creditsEarned < st.creditsReq ? "#DC2626" : "#64748B" }}>
                              {st.creditsEarned} / {st.creditsReq}
                            </div>
                            <div style={{ fontWeight: 800, color: "#16A34A", fontSize: 13 }}>{st.gpa}</div>
                          </td>

                          <td style={{ padding: "16px 18px", textAlign: "center" }}>
                            {st.toeic ? <CheckCircle size={17} color="#16A34A" /> : <XCircle size={17} color="#DC2626" />}
                          </td>

                          <td style={{ padding: "16px 18px", textAlign: "center" }}>
                            {st.ojt ? <CheckCircle size={17} color="#16A34A" /> : <XCircle size={17} color="#DC2626" />}
                          </td>

                          <td style={{ padding: "16px 18px", textAlign: "center" }}>
                            {st.pe ? <CheckCircle size={17} color="#16A34A" /> : <XCircle size={17} color="#DC2626" />}
                          </td>

                          <td style={{ padding: "16px 18px", textAlign: "right" }}>
                            <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 11.5, fontWeight: 800, color: st.statusColor, background: st.statusBg }}>
                              {st.statusText}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", background: "#FFFFFF", fontSize: 12.5, color: "#64748B" }}>
                  <div>Hiển thị 1 đến {filteredGradStudents.length} trong tổng số 1.248 hồ sơ</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569", fontSize: 12 }}>Trước</button>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #0F172A", background: "#0F172A", color: "#FFFFFF", fontWeight: 700, fontSize: 12 }}>1</button>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569", fontSize: 12 }}>2</button>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569", fontSize: 12 }}>3</button>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569", fontSize: 12 }}>Sau</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 5: QUẢN LÝ KHẢO THÍ & TỔ CHỨC THI (EXACT SCREENSHOT 5)
             ========================================================================= */}
          {activeTab === "exams" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                    Quản Lý Khảo Thí & Tổ Chức Thi
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: "4px 0 0", fontWeight: 500 }}>
                    Tổng quan các ca thi sắp diễn ra, kết quả và trạng thái phúc khảo.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => showToast("Đã xuất báo cáo khảo thí và tổng kết điểm kỳ Fall 2023")}
                    style={{ padding: "10px 18px", borderRadius: 10, border: "1.5px solid #CBD5E1", background: "#FFFFFF", color: "#1E293B", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                  >
                    Xuất báo cáo
                  </button>
                  <button
                    onClick={() => setShowScheduleExamModal(true)}
                    style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: "#9A3412", color: "#FFFFFF", fontWeight: 700, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <Plus size={16} /> Lên lịch thi mới
                  </button>
                </div>
              </div>

              {/* 3 KPI Cards (Ảnh 5) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 24 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Ca thi chờ nhập điểm</span>
                    <Clock size={18} color="#D97706" />
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A" }}>1,240</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#DC2626", marginTop: 6 }}>↑ +12% so với tuần trước</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Đã chấm & vào điểm</span>
                    <CheckCircle size={18} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A" }}>8,532</div>
                  <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#E2E8F0", marginTop: 10, overflow: "hidden" }}>
                    <div style={{ width: "88%", height: "100%", background: "#9A3412" }} />
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A", marginTop: 6 }}>↑ +5% so với tuần trước</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 22px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Đơn phúc khảo</span>
                    <Flame size={18} color="#DC2626" />
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A" }}>45</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A", marginTop: 6 }}>↓ -2% so với tuần trước</div>
                </div>
              </div>

              {/* 2 Cột: Ca thi sắp diễn ra (Left) + Kết quả thi các môn (Right) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 22, alignItems: "start" }}>

                {/* Cột trái: Ca thi sắp diễn ra (Ảnh 5) */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: "0 0 16px" }}>
                    Ca thi sắp diễn ra
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, color: "#0F172A", fontSize: 14 }}>Software Architecture</span>
                        <span style={{ fontSize: 11, fontWeight: 800, background: "#DBEAFE", color: "#1D4ED8", padding: "2px 8px", borderRadius: 4 }}>
                          SWE302
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>📅 24/10/2023 • 08:00 AM</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>🏛️ Phòng 402, Tòa Alpha</div>
                    </div>

                    <div style={{ padding: "14px 16px", borderRadius: 12, border: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <span style={{ fontWeight: 800, color: "#0F172A", fontSize: 14 }}>Advanced Database</span>
                        <span style={{ fontSize: 11, fontWeight: 800, background: "#DBEAFE", color: "#1D4ED8", padding: "2px 8px", borderRadius: 4 }}>
                          DBI202
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>📅 25/10/2023 • 13:30 PM</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>🏛️ Phòng 105, Tòa Beta</div>
                    </div>
                  </div>

                  <div style={{ textAlign: "center", marginTop: 18 }}>
                    <span onClick={() => showToast("Đang tải danh sách 32 ca thi sắp diễn ra")} style={{ fontSize: 13, fontWeight: 700, color: "#2563EB", cursor: "pointer" }}>
                      Xem tất cả ca thi →
                    </span>
                  </div>
                </div>

                {/* Cột phải: Bảng kết quả thi & Phúc khảo (Ảnh 5) */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                      Kết quả thi các môn
                    </h3>

                    <div style={{ display: "flex", gap: 8 }}>
                      <select value={examSemester} onChange={e => setExamSemester(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12, background: "#FFFFFF" }}>
                        <option>Fall 2023</option>
                        <option>Summer 2023</option>
                        <option>Spring 2023</option>
                      </select>
                      <select value={examSubjectFilter} onChange={e => setExamSubjectFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12, background: "#FFFFFF" }}>
                        <option>Tất cả môn học</option>
                        <option>CSD201</option>
                        <option>MKT101</option>
                        <option>FIN202</option>
                      </select>
                      <select value={examCampusFilter} onChange={e => setExamCampusFilter(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12, background: "#FFFFFF" }}>
                        <option>Cơ sở Hòa Lạc</option>
                        <option>Cơ sở TP.HCM</option>
                      </select>
                    </div>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                        <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11.5 }}>MÔN HỌC</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11.5 }}>LỚP / NHÓM</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11.5 }}>NGÀY THI</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11.5 }}>TRẠNG THÁI</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11.5, textAlign: "right" }}>HÀNH ĐỘNG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examResults.map((ex) => (
                        <tr key={ex.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "14px" }}>
                            <div style={{ fontWeight: 800, color: "#0F172A" }}>{ex.name}</div>
                            <div style={{ fontSize: 11.5, color: "#64748B", fontFamily: "monospace" }}>{ex.code}</div>
                          </td>

                          <td style={{ padding: "14px", fontWeight: 700, color: "#334155" }}>{ex.group}</td>
                          <td style={{ padding: "14px", color: "#64748B" }}>{ex.date}</td>

                          <td style={{ padding: "14px" }}>
                            <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 11.5, fontWeight: 800, color: ex.statusColor, background: ex.statusBg }}>
                              {ex.statusText}
                            </span>
                          </td>

                          <td style={{ padding: "14px", textAlign: "right" }}>
                            {ex.status === "GRADED" && (
                              <button onClick={() => showToast(`Đang mở sổ điểm chi tiết lớp ${ex.group}`)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#2563EB" }}>
                                <Eye size={17} />
                              </button>
                            )}
                            {ex.status === "PENDING" && (
                              <button onClick={() => handleGradeExam(ex)} style={{ padding: "4px 10px", borderRadius: 6, background: "#EFF6FF", color: "#2563EB", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                                <Edit3 size={13} style={{ display: "inline", marginRight: 4 }} /> Nhập điểm
                              </button>
                            )}
                            {ex.status === "APPEALED" && (
                              <button onClick={() => handleResolveAppeal(ex)} style={{ padding: "4px 10px", borderRadius: 6, background: "#FEF2F2", color: "#DC2626", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                                ⚖️ Xử lý ({ex.appeals})
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ padding: "12px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: "#64748B" }}>
                    <span>Hiển thị 1 đến {examResults.length} trong số 45 ca thi</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #0F172A", background: "#0F172A", color: "#FFF", fontWeight: 700 }}>1</button>
                      <button style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFF" }}>2</button>
                      <button style={{ padding: "4px 10px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFF" }}>3</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* =========================================================================
          MODALS
         ========================================================================= */}
      {/* Modal xếp phòng học (Tab 1) */}
      {assigningClass && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 460, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Xếp Phòng Học & Ca Dạy
              </h3>
              <button onClick={() => setAssigningClass(null)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, marginBottom: 16, fontSize: 13 }}>
              <div>Lớp học phần: <strong style={{ color: "#0F172A" }}>{assigningClass.code}</strong></div>
              <div>Giảng viên phụ trách: <strong>{assigningClass.lecturer}</strong> (Sĩ số: {assigningClass.students} SV)</div>
              <div>Yêu cầu: <strong>{assigningClass.req}</strong></div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>CHỌN PHÒNG HỌC CÒN TRỐNG</label>
                <select value={targetRoomInput} onChange={e => setTargetRoomInput(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFF" }}>
                  <option>AL 102 (Sức chứa 40 SV)</option>
                  <option>AL 103 (Lab máy tính - 40 máy)</option>
                  <option>AL 201 (Sức chứa 50 SV)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>THỨ TRONG TUẦN</label>
                <select value={targetDayInput} onChange={e => setTargetDayInput(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFF" }}>
                  <option>Thứ 2 & Thứ 5 (Ca 1)</option>
                  <option>Thứ 3 & Thứ 6 (Ca 2)</option>
                  <option>Thứ 4 & Thứ 7 (Ca 3)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => setAssigningClass(null)} style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Hủy
              </button>
              <button onClick={handleAssignRoom} style={{ padding: "10px", borderRadius: 8, background: "#EA580C", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Lưu & Đưa lên FAP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Review đề cương (Tab 3) */}
      {reviewingSyllabus && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 520, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                  Thẩm Định Đề Cương Môn Học
                </h3>
                <div style={{ fontSize: 12.5, color: "#64748B" }}>
                  {reviewingSyllabus.code} - {reviewingSyllabus.name}
                </div>
              </div>
              <button onClick={() => setReviewingSyllabus(null)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", marginBottom: 18, fontSize: 13, lineHeight: 1.6 }}>
              <div>📌 <strong>Nội dung cập nhật:</strong> {reviewingSyllabus.note}</div>
              <div>📅 <strong>Ngày gửi duyệt:</strong> {reviewingSyllabus.updatedDate}</div>
              <div>🏢 <strong>Bộ môn đề xuất:</strong> Ban chủ nhiệm bộ môn Kỹ thuật phần mềm</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 12 }}>
              <button onClick={() => setReviewingSyllabus(null)} style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Yêu cầu sửa lại
              </button>
              <button onClick={handleApproveSyllabus} style={{ padding: "10px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Phê Duyệt Đề Cương
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lên lịch thi mới (Tab 5) */}
      {showScheduleExamModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 460, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Lên Lịch Ca Thi Mới
              </h3>
              <button onClick={() => setShowScheduleExamModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>MÔN THI / HỌC PHẦN</label>
                <select value={newExamSubject} onChange={e => setNewExamSubject(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFF" }}>
                  <option>PRJ301 - Java Web Application Development</option>
                  <option>SWE302 - Software Architecture</option>
                  <option>DBI202 - Database Systems</option>
                  <option>CSD201 - Data Structures</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>NGÀY THI</label>
                  <input type="date" value={newExamDate} onChange={e => setNewExamDate(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12.5, boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>GIỜ BẮT ĐẦU</label>
                  <input type="time" value={newExamTime} onChange={e => setNewExamTime(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12.5, boxSizing: "border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>PHÒNG THI</label>
                <input value={newExamRoom} onChange={e => setNewExamRoom(e.target.value)} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => setShowScheduleExamModal(false)} style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Hủy
              </button>
              <button onClick={handleCreateNewExam} style={{ padding: "10px", borderRadius: 8, background: "#EA580C", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Tạo Ca Thi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Trợ giúp */}
      {showHelpModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 480, background: "#FFFFFF", borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: "0 0 10px" }}>
              Hướng Dẫn Nghiệp Vụ Cán Bộ Đào Tạo
            </h3>
            <ul style={{ fontSize: 13, color: "#334155", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <li><strong>Thời khóa biểu & Phòng học:</strong> Quản lý lấp đầy phòng học theo tòa nhà, xếp phòng cho các lớp chờ lịch.</li>
              <li><strong>Báo cáo học thuật:</strong> Theo dõi tỷ lệ Pass/Fail, phân bổ GPA, cảnh báo học vụ và tải giờ dạy của giảng viên.</li>
              <li><strong>Chương trình đào tạo:</strong> Quản lý khung chương trình theo học kỳ, thẩm định và phê duyệt đề cương Syllabus môn học.</li>
              <li><strong>Xét tốt nghiệp & Cấp bằng:</strong> Kiểm tra chuẩn đầu ra (Tín chỉ, GPA, TOEIC, OJT, GDTC) và duyệt công nhận tốt nghiệp hàng loạt.</li>
              <li><strong>Khảo thí & Lịch thi:</strong> Lên lịch ca thi, theo dõi tiến độ chấm điểm và xử lý đơn phúc khảo của sinh viên.</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowHelpModal(false)} style={{ padding: "10px 20px", borderRadius: 8, background: "#EA580C", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
