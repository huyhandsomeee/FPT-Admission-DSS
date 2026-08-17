import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UserPlus, GraduationCap, Database, TrendingUp,
  Activity, Bell, Download, Play, AlertTriangle, CheckCircle,
  HelpCircle, ChevronRight, Filter, RefreshCw, LogOut, Settings,
  MapPin, Users, DollarSign, Wallet, ShieldAlert, Sparkles,
  Layers, FileText, Printer, ArrowUpRight, ArrowDownRight,
  TrendingDown, Check, X, Clock, Building, Compass, BarChart3,
  Bot, Lightbulb, AlertCircle, PieChart, ShieldCheck,
  Brain, Megaphone, Shield, Globe, Target, Zap, Eye,
  Percent, BarChart2, Award, Star, Crosshair, Radio, Cpu,
  MessageSquare, ThumbsUp, ThumbsDown, Hash, Bookmark,
  Sliders, Calendar, Map, Maximize2, Briefcase, Mail,
  CreditCard, Grid, Search, Smile, ChevronDown, CheckSquare,
  UserCheck, UserMinus, Plus, ChevronLeft, Umbrella, HeartPulse,
  Award as AwardIcon
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell, LineChart, Line, AreaChart, Area, ReferenceLine,
  PieChart as RechartsPieChart, Pie
} from "recharts";
import * as XLSX from "xlsx";

export default function HROfficerPortal() {
  const navigate = useNavigate();

  // Active Tab State (Khớp 4 ảnh chính thức của Phòng Nhân sự FPT):
  // 1. "overview": Phòng Nhân sự - Tổng quan & KPI (Ảnh 1)
  // 2. "recruitment": Quản lý Tuyển dụng & Pipeline ứng viên (Ảnh 2)
  // 3. "personnel": Phòng Nhân sự - Quản lý Nhân sự & Danh bạ (Ảnh 3)
  // 4. "timekeeping": Chấm công & Phúc lợi (Ảnh 4)
  // 5. "dss_analytics": Phân tích Định biên & Tương quan Tuyển sinh (DSS FPT)
  const [activeTab, setActiveTab] = useState("overview");

  // State tìm kiếm & bộ lọc danh sách nhân sự (Ảnh 3)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  // State bộ lọc vị trí tuyển dụng (Ảnh 2)
  const [recruitmentDeptFilter, setRecruitmentDeptFilter] = useState("all");

  // Modals & Popups
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [selectedCandidateCV, setSelectedCandidateCV] = useState(null);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── DỮ LIỆU NHÂN SỰ (ẢNH 3) ───
  const [staffList, setStaffList] = useState([
    { id: "FPT-10024", name: "Nguyễn Văn A", dept: "Công nghệ thông tin", role: "Trưởng phòng IT", status: "Active", avatarBg: "#2563EB", avatarText: "NV", email: "anv@fpt.edu.vn", joinDate: "15/03/2020", phone: "0901234567" },
    { id: "FPT-10045", name: "Trần Thị B", dept: "Nhân sự", role: "Chuyên viên Tuyển dụng", status: "Active", avatarBg: "#0284C7", avatarText: "TB", email: "btt@fpt.edu.vn", joinDate: "10/06/2021", phone: "0912345678" },
    { id: "FPT-10088", name: "Lê Văn C", dept: "Đào tạo", role: "Giảng viên", status: "On Leave", avatarBg: "#EA580C", avatarText: "LC", email: "clv@fpt.edu.vn", joinDate: "01/09/2019", phone: "0923456789" },
    { id: "FPT-10112", name: "Phạm Thị D", dept: "Tài chính", role: "Kế toán trưởng", status: "Active", avatarBg: "#D97706", avatarText: "PD", email: "dpt@fpt.edu.vn", joinDate: "20/11/2018", phone: "0934567890" },
    { id: "FPT-10156", name: "Hoàng Minh Đức", dept: "Tuyển sinh", role: "Trưởng nhóm Telesales", status: "Active", avatarBg: "#059669", avatarText: "HD", email: "duchm@fpt.edu.vn", joinDate: "05/01/2022", phone: "0945678901" },
    { id: "FPT-10190", name: "Vũ Thị Hương", dept: "Công tác Sinh viên (CTSV)", role: "Chuyên viên Hoạt động", status: "Active", avatarBg: "#7C3AED", avatarText: "VH", email: "huongvt@fpt.edu.vn", joinDate: "12/04/2022", phone: "0956789012" },
  ]);

  // Lọc nhân sự
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()) || s.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = filterDepartment === "all" || s.dept.includes(filterDepartment);
      const matchRole = filterRole === "all" || s.role.includes(filterRole);
      return matchSearch && matchDept && matchRole;
    });
  }, [staffList, searchTerm, filterDepartment, filterRole]);

  // ─── DỮ LIỆU TUYỂN DỤNG PIPELINE (ẢNH 2) ───
  const [candidates, setCandidates] = useState({
    newApplied: [
      { id: "CAND-01", name: "Nguyễn Văn An", position: "Giảng Viên IT", time: "2h trước", exp: "5 years", edu: "Thạc sĩ KHTN", avatar: "A", status: "Reviewing", testScore: 92 },
      { id: "CAND-02", name: "Trần Thị Bích", position: "Chuyên Viên ĐT", time: "5h trước", exp: "2 years", edu: "ĐH Ngoại Thương", avatar: "B", status: "Reviewing", testScore: 85 },
      { id: "CAND-03", name: "Đặng Quang Huy", position: "Chuyên Viên MKT", time: "1 ngày trước", exp: "3 years", edu: "ĐH FPT", avatar: "H", status: "Reviewing", testScore: 88 },
    ],
    screening: [
      { id: "CAND-04", name: "Lê Hoàng Nam", position: "Giảng Viên IT", time: "Hôm qua", exp: "4 years", note: "Cần review technical test", status: "Technical Test", testScore: 78 },
      { id: "CAND-05", name: "Phạm Hải Yến", position: "Tư Vấn Tuyển Sinh", time: "2 ngày trước", exp: "2 years", note: "Đã qua sơ vấn vòng 1", status: "Pass Round 1", testScore: 90 },
    ],
    recentUpdates: [
      { name: "Đoàn Văn Thịnh", role: "Data Analyst", applied: "Applied 1h ago", status: "Reviewing", statusBg: "#FEF3C7", statusColor: "#D97706", avatarText: "Đ" },
      { name: "Ngô Thanh Mai", role: "Marketing Exec", applied: "2nd Interview", status: "Interview", statusBg: "#FFEDD5", statusColor: "#C2410C", avatarImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=60" },
      { name: "Vũ Trọng Khang", role: "System Admin", applied: "Applied 1 day ago", status: "New", statusBg: "#F1F5F9", statusColor: "#64748B", avatarText: "K" },
    ]
  });

  // ─── DỮ LIỆU BIỂU ĐỒ PHÂN BỔ NHÂN SỰ THEO PHÒNG BAN (ẢNH 1) ───
  const deptHeadcountData = [
    { department: "Tuyển sinh", count: 320, fill: "#EA580C" },
    { department: "Đào tạo", count: 540, fill: "#2563EB" },
    { department: "Tài chính", count: 185, fill: "#10B981" },
    { department: "CTSV", count: 200, fill: "#7C3AED" },
  ];

  // Xuất file Báo cáo Nhân sự Excel
  const handleExportHRExcel = () => {
    const wsData = [
      ["BÁO CÁO NHÂN SỰ & QUẢN LÝ ĐỊNH BIÊN - FPT UNIVERSITY"],
      ["Thời gian xuất:", new Date().toLocaleString("vi-VN")],
      ["Người thực hiện:", "Phòng Nhân Sự (HR Management Module)"],
      [],
      ["1. CHỈ SỐ NHÂN SỰ TỔNG QUAN"],
      ["Tổng Nhân sự toàn trường", "1,245 Cán bộ/GV", "+2.4% so với tháng trước"],
      ["Nhân sự mới tuyển (Tháng này)", "32 Cán bộ", "Mục tiêu: 35"],
      ["Tỷ lệ nghỉ việc (Turnover Rate)", "1.2%", "Mức an toàn (< 3.0%)"],
      ["Tỷ lệ hoàn thành đào tạo nội bộ", "87%", "Mục tiêu: 85%"],
      [],
      ["2. DANH SÁCH CÁN BỘ & GIẢNG VIÊN"],
      ["MÃ NV", "HỌ VÀ TÊN", "PHÒNG BAN", "CHỨC VỤ", "TRẠNG THÁI", "EMAIL", "SỐ ĐIỆN THOẠI"],
      ...staffList.map(s => [s.id, s.name, s.dept, s.role, s.status, s.email, s.phone])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FPT_HR_Staff_List");
    XLSX.writeFile(wb, `FPT_HR_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Đã xuất báo cáo nhân sự thành công (Excel)!");
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F8FAFC", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div style={{
          position: "fixed", top: 20, right: 28, zIndex: 9999,
          background: toastMessage.type === "success" ? "#0F172A" : "#B91C1C",
          color: "#FFFFFF", padding: "12px 20px", borderRadius: 10,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600
        }}>
          <CheckCircle size={17} color={toastMessage.type === "success" ? "#4ADE80" : "#F87171"} />
          {toastMessage.text}
        </div>
      )}

      {/* ── SIDEBAR PHÒNG NHÂN SỰ (KHỚP 100% 4 ẢNH CHỤP) ── */}
      <aside style={{
        width: 230, background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        flexShrink: 0, zIndex: 30
      }}>
        <div>
          {/* Brand Header */}
          <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: "#9A3412", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FFFFFF", fontWeight: 900,
              fontSize: 14, boxShadow: "0 2px 8px rgba(154,52,18,0.25)"
            }}>
              FPT
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.2px", lineHeight: 1.15 }}>
                Cổng Nhân Sự FPT
              </div>
              <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 600, marginTop: 1 }}>
                Hệ Thống Dữ Liệu Nhân Sự
              </div>
            </div>
          </div>

          {/* Nút + Thêm Cán Bộ Mới */}
          <div style={{ padding: "0 12px 14px" }}>
            <button
              onClick={() => setShowAddStaffModal(true)}
              style={{
                width: "100%", padding: "10px", borderRadius: 8,
                background: "#9A3412", color: "#FFFFFF", border: "none",
                fontWeight: 700, fontSize: 12.5, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 6, cursor: "pointer",
                boxShadow: "0 2px 6px rgba(154,52,18,0.25)"
              }}
            >
              <Plus size={15} /> Thêm Cán Bộ Mới
            </button>
          </div>

          {/* Menu Items (Khớp 4 ảnh của HR) */}
          <nav style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { id: "overview", icon: LayoutDashboard, label: "Tổng Quan & KPI", desc: "Tổng quan & KPI" },
              { id: "personnel", icon: Users, label: "Hồ Sơ & Danh Bạ", desc: "Quản lý Nhân sự" },
              { id: "recruitment", icon: UserPlus, label: "Quản Lý Tuyển Dụng", desc: "Quản lý Tuyển dụng" },
              { id: "timekeeping", icon: Clock, label: "Chấm Công & Phúc Lợi", desc: "Chấm công & Phúc lợi" },
              { id: "dss_analytics", icon: Brain, label: "Định Biên & DSS", desc: "Phân tích Định biên Tuyển sinh" },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", borderRadius: 8, fontSize: 12.5,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#9A3412" : "#475569",
                    background: isActive ? "#FFF7ED" : "transparent",
                    borderLeft: isActive ? "3px solid #9A3412" : "3px solid transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <tab.icon size={16} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#9A3412" : "#64748B"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: "12px 14px 18px", borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            onClick={() => showToast("Cấu hình chính sách Nhân sự FPT Edu")}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 10px", border: "none", background: "transparent", fontSize: 12, color: "#64748B", fontWeight: 600, cursor: "pointer", textAlign: "left" }}
          >
            <Settings size={15} /> Cài Đặt
          </button>
          <button
            onClick={() => showToast("Trung tâm Hỗ trợ Cán bộ / Giảng viên: hr-support@fpt.edu.vn")}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 10px", border: "none", background: "transparent", fontSize: 12, color: "#64748B", fontWeight: 600, cursor: "pointer", textAlign: "left" }}
          >
            <HelpCircle size={15} /> Trợ Giúp
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 10px", border: "none", background: "transparent", fontSize: 12, color: "#DC2626", fontWeight: 700, cursor: "pointer", textAlign: "left" }}
          >
            <LogOut size={15} /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main style={{ flex: 1, height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* ── TOP HEADER HR MODULE (KHỚP 4 ẢNH) ── */}
        <header style={{
          height: 58, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
          padding: "0 28px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 20
        }}>
          {/* Tiêu đề & Sub-nav Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.2px" }}>
              Phân Hệ Quản Trị Nhân Sự (HR Management)
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12.5, fontWeight: 600, color: "#475569" }}>
              <span onClick={() => handleExportHRExcel()} style={{ cursor: "pointer", color: "#0F172A" }}>Báo Cáo</span>
              <span onClick={() => setActiveTab("dss_analytics")} style={{ cursor: "pointer" }}>Phân Tích</span>
              <span onClick={() => showToast("Đang mở kho lưu trữ hồ sơ nhân sự")} style={{ cursor: "pointer" }}>Kho Lưu Trữ</span>
            </div>
          </div>

          {/* Quick Action & Profile Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {activeTab === "recruitment" && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#F1F5F9", borderRadius: 20, padding: "5px 12px", width: 180
              }}>
                <Search size={13} color="#94A3B8" />
                <input
                  type="text"
                  placeholder="Tìm kiếm ứng viên..."
                  style={{ border: "none", background: "transparent", outline: "none", fontSize: 11.5, width: "100%" }}
                />
              </div>
            )}

            <button
              onClick={() => showToast("Đã kích hoạt menu thao tác nhanh Phòng Nhân Sự")}
              style={{
                padding: "6px 14px", borderRadius: 6, background: "#9A3412",
                color: "#FFFFFF", border: "none", fontSize: 12, fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Thao Tác Nhanh
            </button>

            {/* Notification */}
            <button
              onClick={() => showToast("Bạn có 3 đơn xin nghỉ phép và 2 ứng viên mới cần duyệt")}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}
            >
              <Bell size={18} />
            </button>

            {/* Profile Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#F1F5F9", border: "1px solid #CBD5E1",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "#475569"
            }}>
              <Users size={16} />
            </div>
          </div>
        </header>

        {/* ── MAIN BODY ── */}
        <div style={{ flex: 1, padding: "22px 28px 48px", maxWidth: 1440, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

          {/* =========================================================================
              MÀN HÌNH 1: PHÒNG NHÂN SỰ - TỔNG QUAN & KPI (ẢNH 1)
             ========================================================================= */}
          {activeTab === "overview" && (
            <div>
              {/* Header Màn 1 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.3px" }}>
                  Phòng Nhân sự - Tổng quan & KPI
                </h1>

                <span style={{ fontSize: 12, background: "#F1F5F9", padding: "5px 12px", borderRadius: 6, color: "#64748B", fontWeight: 600 }}>
                  Báo cáo tháng: <strong style={{ color: "#9A3412" }}>Tháng 10, 2024</strong>
                </span>
              </div>

              {/* 4 Thẻ KPI chính (Ảnh 1) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>

                {/* Thẻ 1: Tổng Nhân sự */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Tổng Nhân sự</span>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Users size={15} />
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                    1,245
                  </div>
                  <div style={{ fontSize: 11.5, color: "#16A34A", fontWeight: 700, marginTop: 4 }}>
                    ↑ +2.4% so với tháng trước
                  </div>
                </div>

                {/* Thẻ 2: Nhân sự mới */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Nhân sự mới (Tháng này)</span>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#E0F2FE", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <UserPlus size={15} />
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                    32
                  </div>
                  <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600, marginTop: 4 }}>
                    — Mục tiêu: 35
                  </div>
                </div>

                {/* Thẻ 3: Tỷ lệ nghỉ việc */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Tỷ lệ nghỉ việc</span>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <UserMinus size={15} />
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#DC2626", letterSpacing: "-0.5px" }}>
                    1.2%
                  </div>
                  <div style={{ fontSize: 11.5, color: "#DC2626", fontWeight: 700, marginTop: 4 }}>
                    ↑ +0.3% so với quý trước
                  </div>
                </div>

                {/* Thẻ 4: Hoàn thành đào tạo */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Hoàn thành đào tạo</span>
                    <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FFEDD5", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <GraduationCap size={15} />
                    </div>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                    87%
                  </div>
                  <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden", marginTop: 8 }}>
                    <div style={{ width: "87%", height: "100%", background: "#9A3412" }} />
                  </div>
                </div>

              </div>

              {/* Hàng 2: Phân bổ Nhân sự theo Phòng ban + Hoạt động gần đây (Ảnh 1) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>

                {/* Phân bổ Nhân sự theo Phòng ban */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                      Phân bổ Nhân sự theo Phòng ban
                    </h3>
                    <span onClick={() => setActiveTab("personnel")} style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", cursor: "pointer" }}>
                      Chi tiết
                    </span>
                  </div>

                  <div style={{ width: "100%", height: 210 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptHeadcountData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                        <XAxis dataKey="department" fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {deptHeadcountData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Hoạt động Nhân sự gần đây */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: "0 0 14px" }}>
                    Hoạt động Nhân sự gần đây
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 10, borderBottom: "1px solid #F1F5F9" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FEE2E2", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <FileText size={14} />
                      </div>
                      <div style={{ flex: 1, fontSize: 12 }}>
                        <div><strong>Nguyễn Văn A</strong> ký hợp đồng mới.</div>
                        <div style={{ fontSize: 11, color: "#64748B" }}>Phòng Đào tạo • 2 giờ trước</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 10, borderBottom: "1px solid #F1F5F9" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <TrendingUp size={14} />
                      </div>
                      <div style={{ flex: 1, fontSize: 12 }}>
                        <div><strong>Trần Thị B</strong> được đề bạt lên Trưởng nhóm.</div>
                        <div style={{ fontSize: 11, color: "#64748B" }}>Phòng Tuyển sinh • 5 giờ trước</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#DBEAFE", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <Calendar size={14} />
                      </div>
                      <div style={{ flex: 1, fontSize: 12 }}>
                        <div><strong>Lê Văn C</strong> yêu cầu nghỉ phép.</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                          <span style={{ fontSize: 11, color: "#64748B" }}>CTSV • Hôm qua</span>
                          <span style={{ fontSize: 10, fontWeight: 800, background: "#EA580C", color: "#FFFFFF", padding: "1px 6px", borderRadius: 4 }}>
                            ĐANG CHỜ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "center", marginTop: 14, paddingTop: 10, borderTop: "1px solid #F1F5F9" }}>
                    <span onClick={() => showToast("Đã tải toàn bộ 48 nhật ký hoạt động nhân sự")} style={{ fontSize: 11.5, fontWeight: 700, color: "#9A3412", cursor: "pointer" }}>
                      Xem tất cả hoạt động
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 2: QUẢN LÝ TUYỂN DỤNG & PIPELINE ỨNG VIÊN (ẢNH 2)
             ========================================================================= */}
          {activeTab === "recruitment" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                    Quản lý Tuyển dụng
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Theo dõi tiến độ tuyển dụng và đánh giá ứng viên mới nhất.
                  </p>
                </div>

                <button
                  onClick={() => setShowJobModal(true)}
                  style={{
                    padding: "8px 18px", borderRadius: 6, background: "#9A3412",
                    color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                  }}
                >
                  <Plus size={15} /> Tạo Tin Tuyển Dụng
                </button>
              </div>

              {/* 3 Thẻ KPI Tuyển dụng (Ảnh 2) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Tổng Ứng Viên (Tháng)</span>
                    <Users size={16} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>248</div>
                  <div style={{ fontSize: 11.5, color: "#16A34A", fontWeight: 700, marginTop: 4 }}>
                    ↗ +12% so với tháng trước
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Đang Phỏng Vấn</span>
                    <Calendar size={16} color="#D97706" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>42</div>
                  <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 4 }}>
                    Cần sắp xếp lịch cho 15 người
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Đã Nhận Việc</span>
                    <CheckCircle size={16} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>18</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <div style={{ flex: 1, height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                      <div style={{ width: "60%", height: "100%", background: "#10B981" }} />
                    </div>
                    <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Đạt 60% KPI</span>
                  </div>
                </div>
              </div>

              {/* Hàng 2: Vị Trí Đang Mở (Pipeline) + Ứng Viên Mới Cập Nhật (Ảnh 2) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18 }}>

                {/* Pipeline Tuyển dụng */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                      <Briefcase size={16} color="#2563EB" /> Vị Trí Đang Mở (Pipeline)
                    </div>

                    <select
                      value={recruitmentDeptFilter}
                      onChange={(e) => setRecruitmentDeptFilter(e.target.value)}
                      style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 11.5, background: "#FFFFFF" }}
                    >
                      <option value="all">Tất cả phòng ban</option>
                      <option value="it">Khoa CNTT</option>
                      <option value="dt">Phòng Đào tạo</option>
                      <option value="ts">Phòng Tuyển sinh</option>
                    </select>
                  </div>

                  {/* 2 Cột Pipeline */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                    {/* Cột 1: MỚI ỨNG TUYỂN */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#64748B" }}>MỚI ỨNG TUYỂN</span>
                        <span style={{ fontSize: 10.5, fontWeight: 800, background: "#F1F5F9", padding: "1px 6px", borderRadius: 100, color: "#475569" }}>124</span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {candidates.newApplied.map((cand) => (
                          <div key={cand.id} style={{ background: "#FAFAFA", borderRadius: 8, padding: "12px 14px", border: "1px solid #E2E8F0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#2563EB", background: "#EFF6FF", padding: "1px 6px", borderRadius: 4 }}>
                                {cand.position}
                              </span>
                              <span style={{ fontSize: 10, color: "#94A3B8" }}>{cand.time}</span>
                            </div>
                            <strong style={{ fontSize: 13, color: "#0F172A", display: "block" }}>{cand.name}</strong>
                            <div style={{ fontSize: 11, color: "#64748B", margin: "2px 0 8px" }}>Exp: {cand.exp} • {cand.edu}</div>
                            <button
                              onClick={() => setSelectedCandidateCV(cand)}
                              style={{ width: "100%", padding: "5px", borderRadius: 5, background: "#F1F5F9", border: "1px solid #CBD5E1", fontSize: 11, fontWeight: 700, color: "#0F172A", cursor: "pointer" }}
                            >
                              Xem CV
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cột 2: ĐANG SÀNG LỌC */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#D97706" }}>ĐANG SÀNG LỌC</span>
                        <span style={{ fontSize: 10.5, fontWeight: 800, background: "#FEF3C7", padding: "1px 6px", borderRadius: 100, color: "#D97706" }}>45</span>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {candidates.screening.map((cand) => (
                          <div key={cand.id} style={{ background: "#FAFAFA", borderRadius: 8, padding: "12px 14px", border: "1px solid #E2E8F0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <span style={{ fontSize: 10.5, fontWeight: 700, color: "#2563EB", background: "#EFF6FF", padding: "1px 6px", borderRadius: 4 }}>
                                {cand.position}
                              </span>
                              <Clock size={12} color="#D97706" />
                            </div>
                            <strong style={{ fontSize: 13, color: "#0F172A", display: "block" }}>{cand.name}</strong>
                            <div style={{ fontSize: 11, color: "#475569", margin: "2px 0 8px" }}>{cand.note}</div>
                            <button
                              onClick={() => showToast(`Đã gửi thông báo phỏng vấn tới ${cand.name}`)}
                              style={{ width: "100%", padding: "5px", borderRadius: 5, background: "#9A3412", border: "none", fontSize: 11, fontWeight: 700, color: "#FFFFFF", cursor: "pointer" }}
                            >
                              Hẹn Phỏng Vấn
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Ứng Viên Mới Cập Nhật */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                      Ứng Viên Mới Cập Nhật
                    </h3>
                    <span style={{ color: "#94A3B8", cursor: "pointer" }}>⋮</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {candidates.recentUpdates.map((cand, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid #F1F5F9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: "50%",
                            background: "#DBEAFE", color: "#1E40AF", display: "flex",
                            alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12
                          }}>
                            {cand.avatarText || "U"}
                          </div>
                          <div>
                            <strong style={{ fontSize: 12.5, color: "#0F172A" }}>{cand.name}</strong>
                            <div style={{ fontSize: 11, color: "#64748B" }}>{cand.role} • {cand.applied}</div>
                          </div>
                        </div>

                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: cand.statusBg, color: cand.statusColor }}>
                          {cand.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 3: QUẢN LÝ NHÂN SỰ & DANH BẠ (ẢNH 3)
             ========================================================================= */}
          {activeTab === "personnel" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                    Phòng Nhân sự - Quản lý Nhân sự
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Staff Directory & Records Management
                  </p>
                </div>

                <button
                  onClick={() => setShowAddStaffModal(true)}
                  style={{
                    padding: "8px 18px", borderRadius: 6, background: "#9A3412",
                    color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                  }}
                >
                  <Plus size={15} /> Add New Staff
                </button>
              </div>

              {/* Thanh tìm kiếm & Bộ lọc (Ảnh 3) */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: 8, padding: "6px 12px" }}>
                    <Search size={14} color="#94A3B8" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm nhân viên theo tên, mã NV..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ border: "none", background: "transparent", outline: "none", fontSize: 12.5, width: "100%" }}
                    />
                  </div>

                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12, background: "#FFFFFF" }}
                  >
                    <option value="all">Phòng ban (Tất cả)</option>
                    <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                    <option value="Nhân sự">Nhân sự</option>
                    <option value="Đào tạo">Đào tạo</option>
                    <option value="Tài chính">Tài chính</option>
                    <option value="Tuyển sinh">Tuyển sinh</option>
                  </select>

                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12, background: "#FFFFFF" }}
                  >
                    <option value="all">Chức vụ (Tất cả)</option>
                    <option value="Trưởng phòng">Trưởng phòng</option>
                    <option value="Chuyên viên">Chuyên viên</option>
                    <option value="Giảng viên">Giảng viên</option>
                  </select>
                </div>
              </div>

              {/* Bảng Danh sách Nhân sự (Ảnh 3) */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "16px 20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ color: "#64748B", borderBottom: "1px solid #E2E8F0", fontSize: 11 }}>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>STAFF ID</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>HỌ VÀ TÊN</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>PHÒNG BAN</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>CHỨC VỤ</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>TRẠNG THÁI</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((staff) => (
                      <tr key={staff.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px", fontFamily: "monospace", color: "#2563EB", fontWeight: 700 }}>
                          {staff.id}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 28, height: 28, borderRadius: "50%",
                              background: staff.avatarBg, color: "#FFFFFF",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, fontWeight: 800
                            }}>
                              {staff.avatarText}
                            </div>
                            <strong style={{ color: "#0F172A" }}>{staff.name}</strong>
                          </div>
                        </td>
                        <td style={{ padding: "12px", color: "#475569" }}>{staff.dept}</td>
                        <td style={{ padding: "12px", color: "#475569" }}>{staff.role}</td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <span style={{
                            padding: "3px 9px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                            background: staff.status === "Active" ? "#DCFCE7" : "#FEF3C7",
                            color: staff.status === "Active" ? "#16A34A" : "#D97706"
                          }}>
                            {staff.status}
                          </span>
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <button
                            onClick={() => showToast(`Mở hồ sơ cán bộ: ${staff.name}`)}
                            style={{ padding: "4px 10px", borderRadius: 5, background: "#F1F5F9", border: "1px solid #CBD5E1", fontSize: 11.5, fontWeight: 700, color: "#0F172A", cursor: "pointer" }}
                          >
                            Chi tiết
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Phân trang (Ảnh 3) */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, paddingTop: 12, borderTop: "1px solid #F1F5F9", fontSize: 12, color: "#64748B" }}>
                  <span>Showing 1 to {filteredStaff.length} of 124 entries</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}>&lt;</button>
                    <button style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#9A3412", color: "#FFF", fontWeight: 700, cursor: "pointer" }}>1</button>
                    <button style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}>2</button>
                    <button style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}>3</button>
                    <button style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}>&gt;</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 4: CHẤM CÔNG & PHÚC LỢI (ẢNH 4)
             ========================================================================= */}
          {activeTab === "timekeeping" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                  Chấm công & Phúc lợi
                </h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                  Tháng 10, 2024 - Tổng quan dữ liệu nhân sự.
                </p>
              </div>

              {/* 3 Thẻ Hàng đầu (Ảnh 4) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1.5fr", gap: 16, marginBottom: 20 }}>

                {/* Thẻ 1: Giờ làm việc */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Giờ làm việc</span>
                    <Clock size={16} color="#DC2626" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#9A3412" }}>168h</div>
                  <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 700, marginBottom: 8 }}>+8h so với tháng trước</div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginBottom: 3 }}>
                    <span>Giờ hành chính</span>
                    <strong style={{ color: "#0F172A" }}>152h / 160h</strong>
                  </div>
                  <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ width: "95%", height: "100%", background: "#2563EB" }} />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginBottom: 3 }}>
                    <span>Làm thêm (OT)</span>
                    <strong style={{ color: "#EA580C" }}>16h</strong>
                  </div>
                  <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                    <div style={{ width: "30%", height: "100%", background: "#EA580C" }} />
                  </div>
                </div>

                {/* Thẻ 2: Quỹ nghỉ phép */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Quỹ nghỉ phép</span>
                    <Umbrella size={16} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0284C7" }}>14.5</div>
                  <div style={{ fontSize: 11, color: "#64748B", marginBottom: 12 }}>Ngày phép năm còn lại</div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div style={{ padding: "8px 10px", background: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                      <div style={{ fontSize: 10, color: "#64748B" }}>Đã dùng</div>
                      <strong style={{ fontSize: 13, color: "#0F172A" }}>3.5 ngày</strong>
                    </div>
                    <div style={{ padding: "8px 10px", background: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0" }}>
                      <div style={{ fontSize: 10, color: "#64748B" }}>Nghỉ ốm</div>
                      <strong style={{ fontSize: 13, color: "#DC2626" }}>1 ngày</strong>
                    </div>
                  </div>
                </div>

                {/* Thẻ 3: Phúc lợi sắp tới */}
                <div style={{ background: "#9A3412", borderRadius: 12, padding: "20px 22px", color: "#FFFFFF", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, marginBottom: 8 }}>
                      <HeartPulse size={17} /> Phúc lợi sắp tới
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 6 }}>
                      Khám sức khỏe định kỳ 2024
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "8px 12px", fontSize: 11.5 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                        <span>Hạn đăng ký:</span>
                        <strong style={{ color: "#FDE68A" }}>Còn 5 ngày</strong>
                      </div>
                      <div>Bệnh viện Đa khoa Quốc tế Thu Cúc</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowHealthModal(true)}
                    style={{ width: "100%", padding: "9px", borderRadius: 6, background: "#FFFFFF", color: "#9A3412", border: "none", fontWeight: 800, fontSize: 12.5, cursor: "pointer", marginTop: 12 }}
                  >
                    Đăng ký ngay
                  </button>
                </div>

              </div>

              {/* Lịch biểu nhân sự (Ảnh 4) */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                    <Calendar size={16} color="#2563EB" /> Lịch biểu nhân sự
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}>&lt;</button>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>Tháng 10, 2024</span>
                    <button style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}>&gt;</button>
                  </div>
                </div>

                {/* Lưới Lịch biểu */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, dIdx) => (
                    <div key={dIdx} style={{ textAlign: "center", fontSize: 11.5, fontWeight: 700, color: "#64748B", paddingBottom: 6 }}>
                      {day}
                    </div>
                  ))}

                  {/* Empty cells & days */}
                  <div style={{ minHeight: 75, background: "#FAFAFA", borderRadius: 8, border: "1px solid #F1F5F9" }} />
                  <div style={{ minHeight: 75, background: "#FAFAFA", borderRadius: 8, border: "1px solid #F1F5F9" }} />
                  <div style={{ minHeight: 75, background: "#FAFAFA", borderRadius: 8, border: "1px solid #F1F5F9", padding: 6, fontSize: 11, color: "#94A3B8" }}>1</div>

                  <div style={{ minHeight: 75, background: "#FAFAFA", borderRadius: 8, border: "1px solid #F1F5F9", padding: 6 }}>
                    <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6 }}>2</div>
                    <span style={{ fontSize: 9.5, fontWeight: 700, background: "#DCFCE7", color: "#16A34A", padding: "2px 5px", borderRadius: 4, display: "block", textAlign: "center" }}>
                      Chấm công đủ
                    </span>
                  </div>

                  <div style={{ minHeight: 75, background: "#FAFAFA", borderRadius: 8, border: "1px solid #F1F5F9", padding: 6, fontSize: 11, color: "#94A3B8" }}>3</div>

                  <div style={{ minHeight: 75, background: "#FAFAFA", borderRadius: 8, border: "1px solid #F1F5F9", padding: 6 }}>
                    <div style={{ fontSize: 11, color: "#DC2626", fontWeight: 700, marginBottom: 6 }}>4</div>
                    <span style={{ fontSize: 9.5, fontWeight: 700, background: "#FEE2E2", color: "#DC2626", padding: "2px 5px", borderRadius: 4, display: "block", textAlign: "center" }}>
                      Đi trễ (15m)
                    </span>
                  </div>

                  <div style={{ minHeight: 75, background: "#EFF6FF", borderRadius: 8, border: "1px solid #DBEAFE", padding: 6 }}>
                    <div style={{ fontSize: 11, color: "#2563EB", fontWeight: 700, marginBottom: 6 }}>5</div>
                    <span style={{ fontSize: 9.5, fontWeight: 700, background: "#DBEAFE", color: "#1D4ED8", padding: "2px 5px", borderRadius: 4, display: "block", textAlign: "center" }}>
                      Nghỉ phép (Sáng)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 5: PHÂN TÍCH ĐỊNH BIÊN & TƯƠNG QUAN TUYỂN SINH (DSS ANALYTICS)
             ========================================================================= */}
          {activeTab === "dss_analytics" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                    Phân tích Định biên & Tương quan Tuyển sinh (HR DSS)
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Tính toán tự động tỷ lệ Giảng viên / Sinh viên (Tỷ lệ Bộ GD&ĐT) theo từng ngành nghề tuyển sinh
                  </p>
                </div>

                <button
                  onClick={handleExportHRExcel}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                >
                  <Download size={14} /> Xuất Báo Cáo Định Biên
                </button>
              </div>

              {/* 3 Thẻ Chỉ số Định biên */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#64748B" }}>Tỷ lệ Giảng viên / Sinh viên Toàn trường</span>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#16A34A", margin: "6px 0" }}>1 : 18.2</div>
                  <div style={{ fontSize: 11.5, color: "#64748B" }}>Chuẩn Bộ GD&ĐT: Tối đa 1:20 (Đạt tiêu chuẩn)</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#64748B" }}>Nhu cầu tuyển dụng thêm cho Kỳ Thu 2025</span>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#9A3412", margin: "6px 0" }}>+45 GV</div>
                  <div style={{ fontSize: 11.5, color: "#C2410C" }}>Tập trung khối AI, Bán dẫn & Thiết kế Vi mạch</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#64748B" }}>Tỷ lệ Giảng viên có trình độ Tiến sĩ (PhD)</span>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#2563EB", margin: "6px 0" }}>42.8%</div>
                  <div style={{ fontSize: 11.5, color: "#2563EB" }}>Tăng 3.5% so với năm 2023</div>
                </div>
              </div>

              {/* Bảng Định biên theo Khối ngành Tuyển sinh */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: "0 0 14px" }}>
                  Định biên Nhân sự & Giảng viên theo Khối ngành Dự kiến
                </h3>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>KHỐI NGÀNH</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>CHỈ TIÊU TUYỂN SINH</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>GV HIỆN CÓ</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>GV CẦN BỔ SUNG</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { major: "Công nghệ thông tin & AI", quota: "6,500 SV", current: "280 GV", need: "+25 GV", status: "Đang tuyển dụng", statusBg: "#FEF3C7", statusColor: "#D97706" },
                      { major: "Thiết kế Vi mạch & Bán dẫn (Mới)", quota: "800 SV", current: "15 GV", need: "+15 GV", status: "Cấp bách", statusBg: "#FEE2E2", statusColor: "#DC2626" },
                      { major: "Kinh tế & Quản trị Kinh doanh", quota: "4,200 SV", current: "180 GV", need: "+5 GV", status: "Đủ định biên", statusBg: "#DCFCE7", statusColor: "#16A34A" },
                      { major: "Ngôn ngữ (Anh, Nhật, Hàn, Trung)", quota: "2,500 SV", current: "95 GV", need: "0 GV", status: "Ổn định", statusBg: "#EFF6FF", statusColor: "#2563EB" },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px", fontWeight: 700, color: "#0F172A" }}>{row.major}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#475569" }}>{row.quota}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#0F172A", fontWeight: 700 }}>{row.current}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#DC2626", fontWeight: 800 }}>{row.need}</td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <span style={{ padding: "3px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: row.statusBg, color: row.statusColor }}>
                            {row.status}
                          </span>
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
          MODALS CHO PHÒNG NHÂN SỰ
         ========================================================================= */}
      {/* Modal: Add New Staff */}
      {showAddStaffModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 500, background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Thêm Cán Bộ / Giảng Viên Mới
              </h3>
              <button onClick={() => setShowAddStaffModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setShowAddStaffModal(false);
              showToast("Đã tạo hồ sơ cán bộ mới thành công và cấp mã FPT-10245!");
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>HỌ VÀ TÊN</label>
                  <input type="text" placeholder="VD: Nguyễn Thị Mai" required style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>PHÒNG BAN</label>
                    <select style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }}>
                      <option>Công nghệ thông tin</option>
                      <option>Đào tạo</option>
                      <option>Tuyển sinh</option>
                      <option>Tài chính</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>CHỨC VỤ</label>
                    <input type="text" placeholder="VD: Giảng viên AI" required style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>EMAIL FPT EDU</label>
                  <input type="email" placeholder="maintt@fpt.edu.vn" required style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={() => setShowAddStaffModal(false)} style={{ padding: "8px 16px", borderRadius: 6, background: "#F1F5F9", border: "none", color: "#475569", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Hủy</button>
                <button type="submit" style={{ padding: "8px 20px", borderRadius: 6, background: "#9A3412", border: "none", color: "#FFFFFF", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Lưu Hồ Sơ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tạo Tin Tuyển Dụng */}
      {showJobModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 500, background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Tạo Tin Tuyển Dụng Mới
              </h3>
              <button onClick={() => setShowJobModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setShowJobModal(false);
              showToast("Đã đăng tin tuyển dụng lên cổng Việc làm FPT Education!");
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>VỊ TRÍ TUYỂN DỤNG</label>
                  <input type="text" placeholder="VD: Giảng viên Kỹ thuật Vi mạch Bán dẫn" required style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>SỐ LƯỢNG</label>
                    <input type="number" defaultValue={5} style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>MỨC LƯƠNG</label>
                    <input type="text" placeholder="25M - 45M VNĐ" style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" onClick={() => setShowJobModal(false)} style={{ padding: "8px 16px", borderRadius: 6, background: "#F1F5F9", border: "none", color: "#475569", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Hủy</button>
                <button type="submit" style={{ padding: "8px 20px", borderRadius: 6, background: "#9A3412", border: "none", color: "#FFFFFF", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Đăng Tin</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Xem CV Ứng viên */}
      {selectedCandidateCV && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 480, background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <strong style={{ fontSize: 16, color: "#0F172A" }}>Hồ Sơ Ứng Viên: {selectedCandidateCV.name}</strong>
              <button onClick={() => setSelectedCandidateCV(null)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "14px 16px", border: "1px solid #E2E8F0", fontSize: 12.5, display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <div><strong>Vị trí ứng tuyển:</strong> {selectedCandidateCV.position}</div>
              <div><strong>Kinh nghiệm:</strong> {selectedCandidateCV.exp}</div>
              <div><strong>Trình độ học vấn:</strong> {selectedCandidateCV.edu}</div>
              <div><strong>Điểm đánh giá CV (AI Score):</strong> <span style={{ color: "#16A34A", fontWeight: 800 }}>{selectedCandidateCV.testScore}/100</span></div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setSelectedCandidateCV(null)} style={{ padding: "8px 14px", borderRadius: 6, background: "#F1F5F9", border: "none", color: "#475569", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Đóng</button>
              <button
                onClick={() => {
                  setSelectedCandidateCV(null);
                  showToast(`Đã chuyển ứng viên ${selectedCandidateCV.name} sang vòng Phỏng Vấn Chuyên Môn!`);
                }}
                style={{ padding: "8px 18px", borderRadius: 6, background: "#9A3412", border: "none", color: "#FFFFFF", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
              >
                Mời Phỏng Vấn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Đăng ký Khám sức khỏe */}
      {showHealthModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 440, background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <strong style={{ fontSize: 16, color: "#0F172A" }}>Đăng ký Khám Sức Khỏe Định Kỳ</strong>
              <button onClick={() => setShowHealthModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.5, marginBottom: 16 }}>
              Chương trình phúc lợi hàng năm dành cho toàn thể Cán bộ - Giảng viên FPT University. Địa điểm: Bệnh viện Đa khoa Quốc tế Thu Cúc (Hà Nội / TP.HCM).
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowHealthModal(false)} style={{ padding: "8px 14px", borderRadius: 6, background: "#F1F5F9", border: "none", color: "#475569", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Hủy</button>
              <button
                onClick={() => {
                  setShowHealthModal(false);
                  showToast("Bạn đã đăng ký thành công gói Khám Sức Khỏe VIP 2024!");
                }}
                style={{ padding: "8px 18px", borderRadius: 6, background: "#9A3412", border: "none", color: "#FFFFFF", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
              >
                Xác Nhận Đăng Ký
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
