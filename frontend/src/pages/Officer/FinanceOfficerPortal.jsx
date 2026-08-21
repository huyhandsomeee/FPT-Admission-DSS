import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useStaff } from "../../context/StaffContext";
import {
  Landmark, CreditCard, Wallet, Award, FileText,
  Search, Bell, HelpCircle, Download, Plus, CheckCircle,
  AlertTriangle, Filter, Check, X, ChevronRight, ChevronLeft,
  TrendingUp, TrendingDown, Eye, FileSpreadsheet, RefreshCw,
  LogOut, Mail, Settings, HelpCircle as SupportIcon, MoreVertical,
  Building, Megaphone, Wrench, DollarSign, Calendar, Clock,
  ArrowUpRight, ArrowDownRight, UserCheck, ShieldAlert, SlidersHorizontal,
  ExternalLink, Printer, CheckCheck, Sparkles
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid, BarChart, Bar, Cell, Legend
} from "recharts";
import * as XLSX from "xlsx";

export default function FinanceOfficerPortal() {
  const navigate = useNavigate();
  const { staffList, isPayrollApproved, approvePayroll } = useStaff();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("transactions"); // transactions (Lương & Bảng lương) | reports (Báo cáo tài chính) | overview | tuition | scholarships

  // ─── Search & Notification State ───
  const [globalSearch, setGlobalSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ─── Modals State ───
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);
  const [showApprovePayrollModal, setShowApprovePayrollModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(null); // staff object
  const [showTeachingHrsModal, setShowTeachingHrsModal] = useState(null); // staff object for inputting pending hours
  const [showViewAllExpenditures, setShowViewAllExpenditures] = useState(false);
  const [showTuitionReminderModal, setShowTuitionReminderModal] = useState(null);
  const [showScholarshipApproveModal, setShowScholarshipApproveModal] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // ─── TRANSACTIONS / SALARY & PAYROLL STATE (IMAGE 1) ───
  const [payrollCycle, setPayrollCycle] = useState("Tháng 10/2023");
  // const [isPayrollApproved, setIsPayrollApproved] = useState(false); // Using Context
  const [staffTab, setStaffTab] = useState("ALL"); // ALL | ACADEMIC | ADMIN
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [teachingHoursInput, setTeachingHoursInput] = useState(36);
  const [hourlyRateInput, setHourlyRateInput] = useState(200000);

  // Initial staff payroll data matching Image 1
  // staffList is now managed by StaffContext

  // Filtered staff list
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchCategory = staffTab === "ALL" || s.category === staffTab;
      const q = globalSearch.toLowerCase().trim();
      const matchSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.dept.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [staffList, staffTab, globalSearch]);

  // Personnel costs trend data for Card 4 in Image 1
  const personnelTrendData = [
    { month: "T7", cost: 11.2, isCurrent: false },
    { month: "T8", cost: 11.5, isCurrent: false },
    { month: "T9", cost: 11.8, isCurrent: false },
    { month: "T10", cost: 12.4, isCurrent: true },
  ];

  // ─── REPORTS STATE (IMAGE 2) ───
  const [fiscalYear, setFiscalYear] = useState("2023");

  // Chart data: Doanh thu vs Chi phí (FY23)
  const revenueExpenditureTrend = [
    { period: "Quý 1", revenue: 950, expenditure: 880, surplus: 70 },
    { period: "Quý 2", revenue: 1100, expenditure: 940, surplus: 160 },
    { period: "Quý 3", revenue: 980, expenditure: 910, surplus: 70 },
    { period: "Quý 4", revenue: 1170, expenditure: 1070, surplus: 100 },
  ];

  const expenditureBreakdownList = [
    {
      title: "Lương & Phúc Lợi Cán Bộ - Giảng Viên",
      subtitle: "Khối Đào tạo & Khối Vận hành",
      amount: "₫1.8T",
      change: "+5.2% so cùng kỳ",
      changeType: "up-red",
      icon: Building,
      bg: "#F1F5F9"
    },
    {
      title: "Cơ Sở Vật Chất & Bảo Trì Phân Hiệu",
      subtitle: "Hạ tầng giảng đường, phòng Lab & KTX",
      amount: "₫1.2T",
      change: "-2.1% so cùng kỳ",
      changeType: "down-green",
      icon: Wrench,
      bg: "#F1F5F9"
    },
    {
      title: "Marketing, Truyền Thông & Tuyển Sinh",
      subtitle: "Chiến dịch tuyển sinh toàn quốc",
      amount: "₫400B",
      change: "+15.4% so cùng kỳ",
      changeType: "up-red",
      icon: Megaphone,
      bg: "#F1F5F9"
    }
  ];

  const yoySummaryData = [
    { metric: "Doanh thu hoạt động (Operating Revenue)", fy2022: "₫3.7T", fy2023: "₫4.2T", change: "+13.5%", positive: true },
    { metric: "Chi phí hoạt động (Operating Expenses)", fy2022: "₫3.5T", fy2023: "₫3.8T", change: "+8.5%", positive: false },
    { metric: "Thặng dư hoạt động ròng (Net Operating Income)", fy2022: "₫200B", fy2023: "₫400B", change: "+100%", positive: true },
  ];

  // ─── TUITION & SCHOLARSHIP STATE (SUPPORTING TABS) ───
  const [tuitionYear, setTuitionYear] = useState("2026 - 2027");
  const [tuitionTerm, setTuitionTerm] = useState("Kỳ Thu 2026");
  const [tuitionStatus, setTuitionStatus] = useState("ALL");
  const [tuitionDebts, setTuitionDebts] = useState([
    { id: "DEBT-01", name: "Nguyễn Văn A", code: "HE150123", amount: "25,500,000", deadline: "15/09/2026", status: "Quá hạn", color: "#DC2626", bg: "#FEE2E2" },
    { id: "DEBT-02", name: "Trần Thị B", code: "SS160456", amount: "12,000,000", deadline: "20/09/2026", status: "Đã nhắc nợ", color: "#2563EB", bg: "#DBEAFE" },
    { id: "DEBT-03", name: "Lê Văn C", code: "SE170789", amount: "5,500,000", deadline: "30/09/2026", status: "Chờ xử lý", color: "#D97706", bg: "#FEF3C7" },
    { id: "DEBT-04", name: "Hoàng Minh D", code: "SE180234", amount: "18,200,000", deadline: "25/09/2026", status: "Đã nhắc nợ", color: "#2563EB", bg: "#DBEAFE" },
    { id: "DEBT-05", name: "Đỗ Thu E", code: "GD170990", amount: "29,700,000", deadline: "10/09/2026", status: "Quá hạn", color: "#DC2626", bg: "#FEE2E2" }
  ]);

  const [scholarshipsData, setScholarshipsData] = useState([
    { id: "SCH-01", name: "Nguyễn Văn A", code: "SE150123", major: "CNTT", type: "Tài năng", rate: "100%", amount: "25.000.000đ", remaining: "0đ", status: "Đủ điều kiện", gpa: 9.2, gpaReq: 8.5, conduct: "Tốt", conductReq: "Tốt", discipline: "Không" },
    { id: "SCH-02", name: "Trần Thị B", code: "IA150456", major: "ATTT", type: "Khuyến khích", rate: "50%", amount: "12.500.000đ", remaining: "12.500.000đ", status: "Chờ duyệt", gpa: 8.5, gpaReq: 8.0, conduct: "Khá", conductReq: "Tốt", discipline: "Không" },
    { id: "SCH-03", name: "Lê Hoàng C", code: "SS150789", major: "QTKD", type: "Hỗ trợ TC", rate: "—", amount: "10.000.000đ", remaining: "10.000.000đ", status: "Vi phạm", gpa: 7.2, gpaReq: 7.5, conduct: "Trung bình", conductReq: "Khá", discipline: "Cảnh cáo" }
  ]);

  // ─── ACTION HANDLERS ───
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStaffIds(filteredStaff.map(s => s.id));
    } else {
      setSelectedStaffIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedStaffIds.includes(id)) {
      setSelectedStaffIds(selectedStaffIds.filter(x => x !== id));
    } else {
      setSelectedStaffIds([...selectedStaffIds, id]);
    }
  };

  const handleCalculatePendingHrs = () => {
    if (!showTeachingHrsModal) return;
    const hours = Number(teachingHoursInput) || 0;
    const rate = Number(hourlyRateInput) || 200000;
    const teachingPay = hours * rate;
    const base = showTeachingHrsModal.baseSalary;
    const totalIncome = base + teachingPay;
    const insurance = Math.round(base * 0.105);
    const taxableIncome = Math.max(0, totalIncome - insurance - 11000000);
    const pit = Math.round(taxableIncome * 0.1);
    const deductions = insurance + pit;
    const net = totalIncome - deductions;

    setStaffList(prev => prev.map(s => {
      if (s.id === showTeachingHrsModal.id) {
        return {
          ...s,
          teachingHrs: hours,
          teachingRate: rate,
          teachingPay: teachingPay,
          deductions: deductions,
          netPayable: net,
          status: "CALCULATED"
        };
      }
      return s;
    }));

    showToast(`Đã tính lương cho giảng viên ${showTeachingHrsModal.name}: +₫${net.toLocaleString("vi-VN")}`);
    setShowTeachingHrsModal(null);
  };

  const handleApprovePayroll = async () => {
    await approvePayroll();
    setShowApprovePayrollModal(false);
    showToast("🎉 Bảng lương Tháng 10/2023 đã được PHÊ DUYỆT thành công và chuyển sang giải ngân!");
  };

  const handleExportPayrollDraft = () => {
    const exportData = staffList.map(s => ({
      "Mã Nhân Viên": s.id,
      "Họ và Tên": s.name,
      "Phòng Ban": s.dept,
      "Vị Trí": s.role,
      "Lương Cơ Bản (VND)": s.baseSalary,
      "Giờ Giảng Dạy": s.teachingHrs === null ? "Đang chờ" : s.teachingHrs,
      "Tiền Giảng Dạy (VND)": s.teachingPay,
      "Khoản Khấu Trừ (VND)": s.deductions || 0,
      "Lương Thực Nhận (VND)": s.netPayable || 0,
      "Trạng Thái": s.status === "CALCULATED" ? "Đã tính" : "Chờ dữ liệu giờ giảng",
      "Ngân Hàng": s.bankName,
      "Số Tài Khoản": s.bankAccount
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BangLuong_T10_2023");
    XLSX.writeFile(wb, `FPT_Bang_Luong_${payrollCycle.replace(/\s+/g, "_")}.xlsx`);
    showToast("Đã xuất bản thảo bảng lương (Excel) thành công!");
  };

  const handleExportAnnualReportExcel = () => {
    const revenueData = [
      { "Nguồn Thu": "Học Phí Chính Khóa (Tuition Fees)", "Tỷ Trọng": "65%", "Số Tiền (VND)": "2.730.000.000.000" },
      { "Nguồn Thu": "Tài Trợ Nghiên Cứu (Research Grants)", "Tỷ Trọng": "20%", "Số Tiền (VND)": "840.000.000.000" },
      { "Nguồn Thu": "Dịch Vụ Phụ Trợ (Auxiliary Services)", "Tỷ Trọng": "15%", "Số Tiền (VND)": "630.000.000.000" },
      { "Nguồn Thu": "TỔNG CỘNG DOANH THU (FY23)", "Tỷ Trọng": "100%", "Số Tiền (VND)": "4.200.000.000.000" }
    ];
    const expenseData = [
      { "Khoản Chi": "Lương & Phúc Lợi Cán Bộ - Giảng Viên", "Số Tiền": "1.800.000.000.000", "Biến Động YoY": "+5.2%" },
      { "Khoản Chi": "Cơ Sở Vật Chất & Vận Hành Hạ Tầng", "Số Tiền": "1.200.000.000.000", "Biến Động YoY": "-2.1%" },
      { "Khoản Chi": "Marketing & Tuyển Sinh", "Số Tiền": "400.000.000.000", "Biến Động YoY": "+15.4%" },
      { "Khoản Chi": "Khác & Chi Phí Quản Lý", "Số Tiền": "400.000.000.000", "Biến Động YoY": "+4.0%" },
      { "Khoản Chi": "TỔNG CỘNG CHI PHÍ (FY23)", "Số Tiền": "3.800.000.000.000", "Biến Động YoY": "+8.2%" }
    ];

    const wb = XLSX.utils.book_new();
    const wsRev = XLSX.utils.json_to_sheet(revenueData);
    const wsExp = XLSX.utils.json_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(wb, wsRev, "DoanhThu_FY23");
    XLSX.utils.book_append_sheet(wb, wsExp, "ChiPhi_FY23");
    XLSX.writeFile(wb, `BaoCao_TaiChinh_Nam_FY${fiscalYear}.xlsx`);
    showToast("Đã xuất báo cáo tài chính thường niên (Excel) thành công!");
  };

  const handleExportAnnualReportPDF = () => {
    window.print();
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

      {/* ── SIDEBAR (Tiếng Việt 100%) ── */}
      <aside style={{
        width: 256, background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        flexShrink: 0, zIndex: 30
      }}>
        <div>
          {/* Brand Header */}
          <div style={{ padding: "24px 20px 18px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "#F97316", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(249,115,22,0.3)"
            }}>
              <Award size={24} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.3px", lineHeight: 1.15 }}>
                FPT Finance
              </div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, letterSpacing: "0.5px", marginTop: 2, textTransform: "uppercase" }}>
                CỔNG CÁN BỘ TÀI CHÍNH
              </div>
            </div>
          </div>

          {/* Navigation Links (Tiếng Việt) */}
          <nav style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { id: "overview", icon: Landmark, label: "Tổng quan" },
              { id: "tuition", icon: CreditCard, label: "Quản lý học phí" },
              { id: "transactions", icon: Wallet, label: "Lương & Giao dịch" },
              { id: "scholarships", icon: Award, label: "Học bổng & Hỗ trợ" },
              { id: "reports", icon: FileText, label: "Báo cáo tài chính" },
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
          {/* New Entry Button */}
          <div style={{ padding: "0 14px 14px" }}>
            <button
              onClick={() => setShowNewEntryModal(true)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 12,
                background: "#EA580C", color: "#FFFFFF", border: "none",
                fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8, cursor: "pointer",
                boxShadow: "0 4px 14px rgba(234,88,12,0.3)", transition: "all 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#C2410C"}
              onMouseLeave={e => e.currentTarget.style.background = "#EA580C"}
            >
              <Plus size={18} strokeWidth={2.5} /> + Thêm bản ghi mới
            </button>
          </div>

          <div style={{ padding: "0 12px", display: "flex", flexDirection: "column", gap: 2 }}>
            <button
              onClick={() => setShowSettingsModal(true)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "#475569", background: "transparent", border: "none", cursor: "pointer"
              }}
            >
              <Settings size={17} /> Cài đặt hệ thống
            </button>
            <button
              onClick={() => setShowHelpModal(true)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500,
                color: "#475569", background: "transparent", border: "none", cursor: "pointer"
              }}
            >
              <SupportIcon size={17} /> Hỗ trợ nghiệp vụ
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
                  TC
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>Cán bộ Tài chính</div>
                  <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>Phòng Tài chính - Kế toán</div>
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
            Quản Lý Tài Chính & Ngân Sách
          </div>

          <div style={{ position: "relative", width: 440, maxWidth: "45%" }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên, mã cán bộ, phòng ban..."
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
                    <span style={{ fontWeight: 800, fontSize: 13, color: "#0F172A" }}>Thông Báo Tài Chính</span>
                    <span style={{ fontSize: 11, color: "#2563EB", cursor: "pointer" }} onClick={() => setShowNotifications(false)}>Đóng</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12.5 }}>
                    <div style={{ padding: "8px 10px", background: "#FEF3C7", borderRadius: 8, color: "#92400E" }}>
                      ⚠️ Giảng viên <strong>Lê Thị Hoa</strong> chưa cập nhật giờ giảng dạy tháng 10/2023.
                    </div>
                    <div style={{ padding: "8px 10px", background: "#EFF6FF", borderRadius: 8, color: "#1E40AF" }}>
                      💼 Dự thảo bảng lương <strong>Tháng 10/2023</strong> đã sẵn sàng để phê duyệt.
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
                border: "1.5px solid #F97316", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#C2410C"
              }}>
                TC
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Cán bộ Tài chính</span>
            </div>
          </div>
        </header>

        {/* ── MAIN CONTENT AREA ── */}
        <div style={{ flex: 1, padding: "28px 32px 48px", maxWidth: 1440, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

          {/* =========================================================================
              TAB 1: LƯƠNG & BẢNG LƯƠNG (EXACT IMAGE 1 - TIẾNG VIỆT)
             ========================================================================= */}
          {activeTab === "transactions" && (
            <div>
              {/* Header Title & Action Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.4px" }}>
                    Quản Lý Lương & Thù Lao Giảng Dạy
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: "4px 0 0", fontWeight: 500 }}>
                    Kỳ Lương {payrollCycle} • Khối Giảng viên & Khối Hành chính
                  </p>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={handleExportPayrollDraft}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
                      borderRadius: 10, border: "1.5px solid #CBD5E1", background: "#FFFFFF",
                      color: "#1E293B", fontWeight: 700, fontSize: 13.5, cursor: "pointer",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                    }}
                  >
                    <Download size={16} strokeWidth={2.2} /> Xuất bản thảo Excel
                  </button>

                  <button
                    onClick={() => setShowApprovePayrollModal(true)}
                    disabled={isPayrollApproved}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 22px",
                      borderRadius: 10, border: "none",
                      background: isPayrollApproved ? "#16A34A" : "#EA580C",
                      color: "#FFFFFF", fontWeight: 700, fontSize: 13.5,
                      cursor: isPayrollApproved ? "default" : "pointer",
                      boxShadow: "0 4px 14px rgba(234,88,12,0.25)"
                    }}
                  >
                    <CheckCircle size={17} strokeWidth={2.4} />
                    {isPayrollApproved ? "Đã Phê Duyệt Bảng Lương" : "Phê Duyệt Bảng Lương"}
                  </button>
                </div>
              </div>

              {/* 4 Metric KPI Cards (Tiếng Việt) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.1fr 1.3fr", gap: 18, marginBottom: 26 }}>

                {/* Card 1: TỔNG LƯƠNG GROSS */}
                <div style={{
                  background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0",
                  padding: "22px 24px", display: "flex", flexDirection: "column",
                  justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: "#64748B", letterSpacing: "0.6px", textTransform: "uppercase" }}>
                        TỔNG LƯƠNG GROSS
                      </span>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB" }}>
                        <Eye size={15} />
                      </div>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                      ₫12.4 Tỷ
                    </div>
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A", marginTop: 14, display: "flex", alignItems: "center", gap: 4 }}>
                    <TrendingUp size={14} /> +2.4% so với tháng trước
                  </div>
                </div>

                {/* Card 2: THUẾ & BẢO HIỂM */}
                <div style={{
                  background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0",
                  padding: "22px 24px", display: "flex", flexDirection: "column",
                  justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: "#64748B", letterSpacing: "0.6px", textTransform: "uppercase" }}>
                        THUẾ & BẢO HIỂM
                      </span>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626" }}>
                        <FileText size={15} />
                      </div>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                      ₫1.8 Tỷ
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500, marginTop: 14 }}>
                    Tỷ lệ khấu trừ thực tế 14.5%
                  </div>
                </div>

                {/* Card 3: TỔNG LƯƠNG THỰC NHẬN (NET) */}
                <div style={{
                  background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0",
                  padding: "22px 24px", display: "flex", flexDirection: "column",
                  justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
                }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: "#64748B", letterSpacing: "0.6px", textTransform: "uppercase" }}>
                        TỔNG LƯƠNG THỰC NHẬN (NET)
                      </span>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center", color: "#C2410C" }}>
                        <Landmark size={15} />
                      </div>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                      ₫10.6 Tỷ
                    </div>
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: 600, marginTop: 14,
                    color: isPayrollApproved ? "#16A34A" : "#64748B",
                    display: "flex", alignItems: "center", gap: 4
                  }}>
                    {isPayrollApproved ? (
                      <><CheckCheck size={14} color="#16A34A" /> Đã duyệt & Sẵn sàng giải ngân</>
                    ) : (
                      "Chờ Ban Giám Đốc phê duyệt lần cuối"
                    )}
                  </div>
                </div>

                {/* Card 4: Xu Hướng Chi Phí Nhân Sự */}
                <div style={{
                  background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0",
                  padding: "18px 20px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                  display: "flex", flexDirection: "column", justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A" }}>
                      Xu Hướng Quỹ Lương
                    </span>
                    <button style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div style={{
                    background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9",
                    padding: "10px 14px 4px", height: 86, display: "flex", alignItems: "flex-end",
                    justifyContent: "space-around", position: "relative"
                  }}>
                    {personnelTrendData.map((item, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 28, height: "100%", justifyContent: "flex-end" }}>
                        {item.isCurrent && (
                          <span style={{ fontSize: 9.5, fontWeight: 800, color: "#EA580C", marginBottom: 2 }}>
                            {item.month}
                          </span>
                        )}
                        <div style={{
                          width: 22,
                          height: `${(item.cost / 14) * 100}%`,
                          borderRadius: "4px 4px 0 0",
                          background: item.isCurrent ? "#EA580C" : "#DBEAFE",
                          transition: "height 0.3s"
                        }} />
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Filter Tabs & Legends Row */}
              <div style={{
                background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0",
                padding: "12px 18px", display: "flex", alignItems: "center",
                justifyContent: "space-between", marginBottom: 16
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {[
                    { key: "ALL", label: "Tất cả cán bộ (1.240)" },
                    { key: "ACADEMIC", label: "Khối Giảng viên (840)" },
                    { key: "ADMIN", label: "Khối Hành chính (400)" }
                  ].map(t => {
                    const isSelected = staffTab === t.key;
                    return (
                      <button
                        key={t.key}
                        onClick={() => setStaffTab(t.key)}
                        style={{
                          padding: "7px 14px", borderRadius: 8, border: "none",
                          fontSize: 12.5, fontWeight: isSelected ? 700 : 600,
                          background: isSelected ? "#E2E8F0" : "transparent",
                          color: isSelected ? "#0F172A" : "#64748B",
                          cursor: "pointer"
                        }}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#334155" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A" }} />
                    Đã tính lương
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#334155" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D97706" }} />
                    Chờ dữ liệu giờ giảng
                  </div>

                  <button
                    onClick={() => setShowFilterModal(true)}
                    style={{
                      width: 32, height: 32, borderRadius: 8, border: "1px solid #E2E8F0",
                      background: "#FFFFFF", display: "flex", alignItems: "center",
                      justifyContent: "center", cursor: "pointer", color: "#64748B"
                    }}
                  >
                    <SlidersHorizontal size={14} />
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div style={{
                background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0",
                overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", marginBottom: 16
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "14px 18px", width: 36 }}>
                        <input
                          type="checkbox"
                          checked={selectedStaffIds.length === filteredStaff.length && filteredStaff.length > 0}
                          onChange={handleSelectAll}
                          style={{ cursor: "pointer" }}
                        />
                      </th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>CÁN BỘ / GIẢNG VIÊN</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>PHÒNG BAN / VỊ TRÍ</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>LƯƠNG CƠ BẢN</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>GIỜ GIẢNG DẠY</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>KHOẢN KHẤU TRỪ</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5 }}>LƯƠNG THỰC NHẬN</th>
                      <th style={{ padding: "14px 18px", fontWeight: 700, fontSize: 11.5, textAlign: "right" }}>TRẠNG THÁI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((staff) => {
                      const isSelected = selectedStaffIds.includes(staff.id);
                      return (
                        <tr
                          key={staff.id}
                          style={{
                            borderBottom: "1px solid #F1F5F9",
                            background: isSelected ? "#F8FAFC" : "#FFFFFF"
                          }}
                        >
                          <td style={{ padding: "16px 18px" }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectOne(staff.id)}
                              style={{ cursor: "pointer" }}
                            />
                          </td>

                          <td style={{ padding: "16px 18px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{
                                width: 36, height: 36, borderRadius: "50%",
                                background: staff.avatarBg, color: staff.avatarColor,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 800, fontSize: 12.5, flexShrink: 0
                              }}>
                                {staff.initials}
                              </div>
                              <div>
                                <div
                                  onClick={() => setShowDetailModal(staff)}
                                  style={{ fontWeight: 700, color: "#0F172A", fontSize: 13.5, cursor: "pointer" }}
                                  onMouseEnter={e => e.currentTarget.style.color = "#2563EB"}
                                  onMouseLeave={e => e.currentTarget.style.color = "#0F172A"}
                                >
                                  {staff.name}
                                </div>
                                <div style={{ fontSize: 11.5, color: "#94A3B8", fontWeight: 500 }}>
                                  {staff.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td style={{ padding: "16px 18px" }}>
                            <div style={{ fontWeight: 600, color: "#334155" }}>{staff.dept}</div>
                            <div style={{ fontSize: 11.5, color: "#64748B" }}>{staff.role}</div>
                          </td>

                          <td style={{ padding: "16px 18px", color: "#64748B", fontWeight: 600, fontFamily: "monospace" }}>
                            ₫{staff.baseSalary?.toLocaleString("vi-VN")}
                          </td>

                          <td style={{ padding: "16px 18px" }}>
                            {staff.teachingHrs === null ? (
                              <button
                                onClick={() => {
                                  setShowTeachingHrsModal(staff);
                                  setTeachingHoursInput(36);
                                }}
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: 4,
                                  color: "#D97706", fontWeight: 600, fontSize: 12.5,
                                  background: "#FEF3C7", padding: "3px 8px", borderRadius: 6,
                                  border: "none", cursor: "pointer"
                                }}
                              >
                                <RefreshCw size={12} className="animate-spin" /> Chờ giờ giảng (Nhập)
                              </button>
                            ) : staff.teachingHrs === "N/A" ? (
                              <span style={{ color: "#94A3B8", fontWeight: 500 }}>N/A (Hành chính)</span>
                            ) : (
                              <div>
                                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#16A34A", fontWeight: 700, fontSize: 12.5 }}>
                                  🔗 {staff.teachingHrs} giờ
                                </div>
                                <div style={{ fontSize: 11.5, color: "#64748B", fontFamily: "monospace" }}>
                                  ₫{staff.teachingPay?.toLocaleString("vi-VN")}
                                </div>
                              </div>
                            )}
                          </td>

                          <td style={{ padding: "16px 18px" }}>
                            {staff.deductions ? (
                              <span style={{ color: "#DC2626", fontWeight: 600, fontFamily: "monospace" }}>
                                -₫{staff.deductions?.toLocaleString("vi-VN")}
                              </span>
                            ) : (
                              <span style={{ color: "#94A3B8" }}>--</span>
                            )}
                          </td>

                          <td style={{ padding: "16px 18px" }}>
                            {staff.netPayable ? (
                              <span style={{ color: "#9A3412", fontWeight: 800, fontSize: 13.5, fontFamily: "monospace" }}>
                                ₫{staff.netPayable?.toLocaleString("vi-VN")}
                              </span>
                            ) : (
                              <span style={{ color: "#94A3B8" }}>--</span>
                            )}
                          </td>

                          <td style={{ padding: "16px 18px", textAlign: "right" }}>
                            {staff.status === "CALCULATED" ? (
                              <span style={{
                                display: "inline-block", padding: "4px 12px", borderRadius: 100,
                                fontSize: 11, fontWeight: 800, color: "#16A34A",
                                border: "1px solid #86EFAC", background: "#F0FDF4"
                              }}>
                                ĐÃ TÍNH LƯƠNG
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  setShowTeachingHrsModal(staff);
                                  setTeachingHoursInput(36);
                                }}
                                style={{
                                  display: "inline-block", padding: "4px 12px", borderRadius: 100,
                                  fontSize: 11, fontWeight: 800, color: "#D97706",
                                  border: "1px solid #FDE68A", background: "#FFFBEB",
                                  cursor: "pointer"
                                }}
                              >
                                CHỜ GIỜ GIẢNG
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Footer Pagination */}
                <div style={{
                  padding: "14px 20px", display: "flex", justifyContent: "space-between",
                  alignItems: "center", borderTop: "1px solid #F1F5F9", background: "#FFFFFF",
                  fontSize: 12.5, color: "#64748B"
                }}>
                  <div>
                    Hiển thị 1 đến {filteredStaff.length} trong tổng số 1.240 cán bộ
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                      Trước
                    </button>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #0F172A", background: "#0F172A", color: "#FFFFFF", fontWeight: 700, fontSize: 12 }}>
                      1
                    </button>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                      2
                    </button>
                    <button style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                      Sau
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: BÁO CÁO TÀI CHÍNH THƯỜNG NIÊN (EXACT IMAGE 2 - TIẾNG VIỆT)
             ========================================================================= */}
          {activeTab === "reports" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.4px" }}>
                    Báo Cáo Tài Chính Thường Niên
                  </h1>
                  <p style={{ fontSize: 13.5, color: "#64748B", margin: "4px 0 0", fontWeight: 500 }}>
                    Năm Tài Khóa {fiscalYear} - Đánh Giá & Thống Kê Toàn Diện
                  </p>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <select
                    value={fiscalYear}
                    onChange={(e) => {
                      setFiscalYear(e.target.value);
                      showToast(`Đã tải báo cáo tài chính năm tài khóa FY${e.target.value}`);
                    }}
                    style={{
                      padding: "9px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1",
                      background: "#FFFFFF", fontSize: 13, fontWeight: 700, color: "#0F172A",
                      cursor: "pointer", outline: "none"
                    }}
                  >
                    <option value="2023">Năm tài khóa 2023</option>
                    <option value="2024">Năm tài khóa 2024</option>
                    <option value="2025">Năm tài khóa 2025</option>
                  </select>

                  <button
                    onClick={handleExportAnnualReportPDF}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
                      borderRadius: 10, border: "1.5px solid #CBD5E1", background: "#FFFFFF",
                      color: "#1E293B", fontWeight: 700, fontSize: 13.5, cursor: "pointer"
                    }}
                  >
                    <FileText size={16} strokeWidth={2.2} /> Xuất PDF
                  </button>

                  <button
                    onClick={handleExportAnnualReportExcel}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
                      borderRadius: 10, border: "1.5px solid #CBD5E1", background: "#FFFFFF",
                      color: "#1E293B", fontWeight: 700, fontSize: 13.5, cursor: "pointer"
                    }}
                  >
                    <FileSpreadsheet size={16} strokeWidth={2.2} color="#16A34A" /> Xuất Excel
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 24 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Tổng Doanh Thu</span>
                    <TrendingUp size={18} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                    ₫4.2T
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A", marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
                    <TrendingUp size={14} /> +12.5% so cùng kỳ
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Tổng Chi Phí</span>
                    <TrendingDown size={18} color="#EA580C" />
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                    ₫3.8T
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#EA580C", marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
                    <TrendingUp size={14} /> +8.2% so cùng kỳ
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Thặng Dư Hoạt Động (Lãi)</span>
                    <Landmark size={18} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                    ₫400B
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A", marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
                    <TrendingUp size={14} /> +22.4% so cùng kỳ
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Độ Lệch Ngân Sách</span>
                    <SlidersHorizontal size={18} color="#64748B" />
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.6px", lineHeight: 1.1 }}>
                    -1.2%
                  </div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A", marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle size={14} /> Nằm trong ngưỡng an toàn
                  </div>
                </div>
              </div>

              {/* Middle Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 20, marginBottom: 24 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      So Sánh Doanh Thu vs Chi Phí (FY23)
                    </h3>
                    <button style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div style={{ width: "100%", height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueExpenditureTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EA580C" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#EA580C" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="period" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `₫${v}B`} />
                        <Tooltip
                          contentStyle={{ background: "#0F172A", borderRadius: 10, border: "none", color: "#FFF", fontSize: 12 }}
                          formatter={(val, name) => [`₫${val} Tỷ`, name === "revenue" ? "Doanh Thu" : "Chi Phí"]}
                        />
                        <Area type="monotone" dataKey="revenue" name="revenue" stroke="#EA580C" strokeWidth={3} fillOpacity={1} fill="url(#revGrad)" />
                        <Area type="monotone" dataKey="expenditure" name="expenditure" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#expGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8, fontSize: 12.5, fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#EA580C" }}>
                      <span style={{ width: 12, height: 3, background: "#EA580C", borderRadius: 2 }} /> Doanh Thu (Thu học phí & tài trợ)
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#2563EB" }}>
                      <span style={{ width: 12, height: 3, background: "#2563EB", borderRadius: 2 }} /> Chi Phí Vận Hành (Lương, cơ sở vật chất)
                    </div>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: "0 0 20px" }}>
                      Cơ Cấu Nguồn Thu
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                          <span>Học phí chính khóa & chuyên ngành</span>
                          <span style={{ fontWeight: 800, color: "#0F172A" }}>65%</span>
                        </div>
                        <div style={{ width: "100%", height: 10, borderRadius: 5, background: "#E2E8F0", overflow: "hidden" }}>
                          <div style={{ width: "65%", height: "100%", background: "#0284C7", borderRadius: 5 }} />
                        </div>
                        <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>₫2.730 Tỷ • Đào tạo đại học chính quy & liên kết</div>
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                          <span>Tài trợ nghiên cứu & dự án chuyển giao</span>
                          <span style={{ fontWeight: 800, color: "#0F172A" }}>20%</span>
                        </div>
                        <div style={{ width: "100%", height: 10, borderRadius: 5, background: "#E2E8F0", overflow: "hidden" }}>
                          <div style={{ width: "20%", height: "100%", background: "#1E3A8A", borderRadius: 5 }} />
                        </div>
                        <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>₫840 Tỷ • Quỹ nghiên cứu AI, Bán dẫn & Chuyển giao công nghệ</div>
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: "#334155", marginBottom: 6 }}>
                          <span>Dịch vụ phụ trợ & Đào tạo ngắn hạn</span>
                          <span style={{ fontWeight: 800, color: "#0F172A" }}>15%</span>
                        </div>
                        <div style={{ width: "100%", height: 10, borderRadius: 5, background: "#E2E8F0", overflow: "hidden" }}>
                          <div style={{ width: "15%", height: "100%", background: "#EA580C", borderRadius: 5 }} />
                        </div>
                        <div style={{ fontSize: 11, color: "#64748B", marginTop: 3 }}>₫630 Tỷ • Ký túc xá, dịch vụ căn tin & chứng chỉ nghề</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 14, marginTop: 14, fontSize: 12, color: "#64748B", textAlign: "center" }}>
                    Tổng doanh thu ghi nhận FY23: <strong style={{ color: "#0F172A" }}>₫4.200.000.000.000</strong>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h3 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      Phân Bổ Chi Phí Vận Hành
                    </h3>
                    <span
                      onClick={() => setShowViewAllExpenditures(true)}
                      style={{ fontSize: 12.5, fontWeight: 700, color: "#475569", cursor: "pointer", textDecoration: "underline" }}
                    >
                      Xem tất cả
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {expenditureBreakdownList.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          padding: "12px 14px", borderRadius: 12, background: "#F8FAFC",
                          border: "1px solid #F1F5F9"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
                            <item.icon size={20} />
                          </div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{item.title}</div>
                            <div style={{ fontSize: 11.5, color: "#64748B" }}>{item.subtitle}</div>
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: "#0F172A", fontFamily: "monospace" }}>
                            {item.amount}
                          </div>
                          <div style={{ fontSize: 11.5, fontWeight: 700, color: item.changeType === "up-red" ? "#DC2626" : "#16A34A" }}>
                            {item.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <h3 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      Tổng Hợp Chỉ Số So Với Cùng Kỳ (YoY)
                    </h3>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                        <th style={{ padding: "10px 0", fontWeight: 700, fontSize: 11.5 }}>CHỈ TIÊU TÀI CHÍNH</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11.5, textAlign: "right" }}>FY 2022</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700, fontSize: 11.5, textAlign: "right" }}>FY 2023</th>
                        <th style={{ padding: "10px 0", fontWeight: 700, fontSize: 11.5, textAlign: "right" }}>TĂNG TRƯỞNG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yoySummaryData.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "16px 0", fontWeight: 700, color: "#0F172A" }}>
                            {row.metric}
                          </td>
                          <td style={{ padding: "16px 14px", textAlign: "right", color: "#64748B", fontFamily: "monospace" }}>
                            {row.fy2022}
                          </td>
                          <td style={{ padding: "16px 14px", textAlign: "right", color: "#0F172A", fontWeight: 700, fontFamily: "monospace" }}>
                            {row.fy2023}
                          </td>
                          <td style={{ padding: "16px 0", textAlign: "right", fontWeight: 800, color: row.positive ? "#16A34A" : "#DC2626", fontFamily: "monospace" }}>
                            {row.change}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ padding: "14px", background: "#EFF6FF", borderRadius: 10, marginTop: 14, fontSize: 12, color: "#1E40AF" }}>
                    💡 <strong>Nhận định chuyên viên:</strong> Biên lợi nhuận hoạt động tăng 100% nhờ tối ưu chi phí hạ tầng và doanh thu các dịch vụ liên kết tăng trưởng vượt kế hoạch.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: TỔNG QUAN TÀI CHÍNH
             ========================================================================= */}
          {activeTab === "overview" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Tổng quan Tài chính Trường Đại học FPT</h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: "4px 0 0" }}>Tổng hợp số liệu doanh thu, công nợ và chi phí vận hành toàn hệ thống</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setActiveTab("reports")} style={{ padding: "9px 16px", borderRadius: 8, border: "1.5px solid #2563EB", background: "#FFFFFF", color: "#2563EB", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    Xem Báo Cáo Chi Tiết
                  </button>
                  <button onClick={() => setShowNewEntryModal(true)} style={{ padding: "9px 16px", borderRadius: 8, border: "none", background: "#EA580C", color: "#FFFFFF", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    + Thêm Bản Ghi Mới
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 24 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Tổng Thu Học Phí (Kỳ Hiện Tại)</span>
                    <TrendingUp size={18} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A" }}>₫348.5 Tỷ</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#16A34A", marginTop: 6 }}>↑ Đạt 94.2% chỉ tiêu thu</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Tổng Quỹ Lương & Thù Lao</span>
                    <Wallet size={18} color="#EA580C" />
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A" }}>₫12.4 Tỷ / Tháng</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#2563EB", marginTop: 6 }}>
                    <span onClick={() => setActiveTab("transactions")} style={{ cursor: "pointer", textDecoration: "underline" }}>Xem chi tiết bảng lương →</span>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22, boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#334155" }}>Công Nợ Cần Thu Hồi</span>
                    <AlertTriangle size={18} color="#D97706" />
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#DC2626" }}>₫2.4 Tỷ</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#D97706", marginTop: 6 }}>124 sinh viên trễ hạn nộp</div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: QUẢN LÝ CÔNG NỢ HỌC PHÍ
             ========================================================================= */}
          {activeTab === "tuition" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Quản lý Công nợ Học phí</h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0" }}>Theo dõi và xử lý các khoản nợ học phí của sinh viên</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowTuitionReminderModal("ALL")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", color: "#334155", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    <Mail size={15} /> Gửi Email Nhắc nợ
                  </button>
                  <button onClick={() => { showToast("Đang chuẩn bị file Excel..."); setTimeout(() => showToast("Đã xuất danh sách công nợ ra file Excel thành công!"), 1500); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", color: "#334155", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    <Download size={15} /> Xuất Danh sách
                  </button>
                </div>
              </div>

              <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ padding: "12px 18px", width: 40 }}><input type="checkbox" /></th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>MSSV / SINH VIÊN</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>TỔNG NỢ (VND)</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>HẠN CHÓT</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>TRẠNG THÁI</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tuitionDebts.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "14px 18px" }}><input type="checkbox" /></td>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ fontWeight: 700, color: "#0F172A" }}>{item.name}</div>
                          <div style={{ fontSize: 11.5, color: "#64748B" }}>{item.code}</div>
                        </td>
                        <td style={{ padding: "14px 18px", fontWeight: 800, color: "#DC2626", fontFamily: "monospace" }}>₫{item.amount}</td>
                        <td style={{ padding: "14px 18px", color: "#475569" }}>{item.deadline}</td>
                        <td style={{ padding: "14px 18px" }}>
                          <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: item.bg, color: item.color }}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <button onClick={() => setShowTuitionReminderModal(item)} disabled={item.status === "Đã nhắc nợ"} style={{ padding: "5px 12px", borderRadius: 6, background: "#EFF6FF", color: "#2563EB", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                            {item.status === "Đã nhắc nợ" ? "Đã nhắc" : "Nhắc nợ"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: HỌC BỔNG
             ========================================================================= */}
          {activeTab === "scholarships" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>Quản lý Học bổng & Hỗ trợ Tài chính</h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: "3px 0 0" }}>Duyệt giải ngân học bổng tài năng, khuyến khích học tập kỳ Spring 2026</p>
              </div>

              <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>HỌ TÊN / MSSV</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>NGÀNH HỌC</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>LOẠI HB</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>MỨC HB</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>SỐ TIỀN</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>TRẠNG THÁI</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scholarshipsData.map((s, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "14px 18px" }}>
                          <div style={{ fontWeight: 700, color: "#0F172A" }}>{s.name}</div>
                          <div style={{ fontSize: 11.5, color: "#64748B" }}>{s.code}</div>
                        </td>
                        <td style={{ padding: "14px 18px", color: "#334155" }}>{s.major}</td>
                        <td style={{ padding: "14px 18px" }}>
                          <span style={{ padding: "3px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.type === "Tài năng" ? "#DBEAFE" : "#FFEDD5", color: s.type === "Tài năng" ? "#1D4ED8" : "#C2410C" }}>
                            {s.type}
                          </span>
                        </td>
                        <td style={{ padding: "14px 18px", fontWeight: 700 }}>{s.rate}</td>
                        <td style={{ padding: "14px 18px", fontWeight: 800, color: "#0F172A", fontFamily: "monospace" }}>{s.amount}</td>
                        <td style={{ padding: "14px 18px" }}>
                          <span style={{ padding: "3px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: s.status === "Đủ điều kiện" ? "#DCFCE7" : "#FEF3C7", color: s.status === "Đủ điều kiện" ? "#16A34A" : "#B45309" }}>
                            {s.status}
                          </span>
                        </td>
                        <td style={{ padding: "14px 18px" }}>
                          <button onClick={() => setShowScholarshipApproveModal(s)} disabled={s.status !== "Chờ duyệt" && s.status !== "Đủ điều kiện"} style={{ padding: "6px 12px", borderRadius: 6, background: "#10B981", color: "#FFFFFF", border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                            {s.status === "Đã giải ngân" ? "Đã duyệt" : s.status === "Vi phạm" ? "Từ chối" : "Duyệt"}
                          </button>
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
      {showTeachingHrsModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 460, background: "#FFFFFF",
            borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                  Cập Nhật Giờ Giảng Dạy
                </h3>
                <p style={{ fontSize: 12.5, color: "#64748B", margin: "3px 0 0" }}>
                  {showTeachingHrsModal.name} ({showTeachingHrsModal.id})
                </p>
              </div>
              <button
                onClick={() => setShowTeachingHrsModal(null)}
                style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                  LƯƠNG CƠ BẢN (VND)
                </label>
                <input
                  type="text"
                  disabled
                  value={`₫${showTeachingHrsModal.baseSalary?.toLocaleString("vi-VN")}`}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#F8FAFC", fontWeight: 700, color: "#475569", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                  SỐ GIỜ GIẢNG DẠY TRONG THÁNG (HOURS)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={teachingHoursInput}
                  onChange={e => setTeachingHoursInput(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #2563EB", background: "#FFFFFF", fontSize: 15, fontWeight: 800, color: "#0F172A", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                  ĐƠN GIÁ GIỜ GIẢNG (VND / GIỜ)
                </label>
                <input
                  type="number"
                  step="10000"
                  value={hourlyRateInput}
                  onChange={e => setHourlyRateInput(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 13, fontWeight: 600, color: "#0F172A", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ padding: "12px 14px", background: "#EFF6FF", borderRadius: 10, fontSize: 12.5, color: "#1E40AF" }}>
                💰 <strong>Tạm tính:</strong> Tiền dạy = {(teachingHoursInput * hourlyRateInput).toLocaleString("vi-VN")} VND. Hệ thống sẽ tự động trừ BHXH (10.5%) và Thuế TNCN lũy tiến.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button
                onClick={() => setShowTeachingHrsModal(null)}
                style={{ padding: "11px", borderRadius: 10, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
              >
                Hủy
              </button>
              <button
                onClick={handleCalculatePendingHrs}
                style={{ padding: "11px", borderRadius: 10, background: "#EA580C", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
              >
                Tính & Lưu Bảng Lương
              </button>
            </div>
          </div>
        </div>
      )}

      {showApprovePayrollModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 480, background: "#FFFFFF",
            borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <ShieldAlert size={26} />
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", margin: "0 0 8px" }}>
              Xác nhận Phê duyệt Bảng lương?
            </h3>
            <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.5, margin: "0 0 18px" }}>
              Bạn đang phê duyệt chu kỳ lương <strong>{payrollCycle}</strong> cho toàn bộ <strong>1.240 cán bộ & giảng viên</strong> với tổng giá trị chi trả ròng là <strong style={{ color: "#9A3412" }}>₫10.6 Tỷ VND</strong>.
            </p>

            <div style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 12.5, color: "#334155", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>Tổng Gross:</span>
                <strong>₫12.400.000.000</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>Thuế & Bảo hiểm:</span>
                <strong style={{ color: "#DC2626" }}>-₫1.800.000.000</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E2E8F0", paddingTop: 4 }}>
                <span>Thực nhận (Net Payable):</span>
                <strong style={{ color: "#9A3412", fontSize: 13.5 }}>₫10.600.000.000</strong>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 12 }}>
              <button
                onClick={() => setShowApprovePayrollModal(false)}
                style={{ padding: "11px", borderRadius: 10, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
              >
                Xem lại
              </button>
              <button
                onClick={handleApprovePayroll}
                style={{ padding: "11px", borderRadius: 10, background: "#EA580C", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
              >
                Xác Nhận & Giải Ngân
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 520, background: "#FFFFFF",
            borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: showDetailModal.avatarBg, color: showDetailModal.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 16 }}>
                  {showDetailModal.initials}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                    {showDetailModal.name}
                  </h3>
                  <div style={{ fontSize: 12, color: "#64748B" }}>
                    {showDetailModal.id} • {showDetailModal.dept} ({showDetailModal.role})
                  </div>
                </div>
              </div>
              <button onClick={() => setShowDetailModal(null)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 0", borderTop: "1px solid #F1F5F9", borderBottom: "1px solid #F1F5F9", fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Lương Hợp Đồng Cơ Bản:</span>
                <strong style={{ color: "#0F172A", fontFamily: "monospace" }}>₫{showDetailModal.baseSalary?.toLocaleString("vi-VN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Thù Lao Giảng Dạy ({showDetailModal.teachingHrs} giờ):</span>
                <strong style={{ color: "#16A34A", fontFamily: "monospace" }}>+₫{(showDetailModal.teachingPay || 0).toLocaleString("vi-VN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Tổng Thu Nhập Trước Thuế (Gross):</span>
                <strong style={{ color: "#0F172A", fontFamily: "monospace" }}>₫{((showDetailModal.baseSalary + (showDetailModal.teachingPay || 0))).toLocaleString("vi-VN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Khấu Trừ BHXH, BHYT, BHTN & Thuế:</span>
                <strong style={{ color: "#DC2626", fontFamily: "monospace" }}>-₫{(showDetailModal.deductions || 0).toLocaleString("vi-VN")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #F1F5F9", paddingTop: 10 }}>
                <span style={{ fontWeight: 800, color: "#0F172A" }}>Lương Thực Nhận (Net):</span>
                <strong style={{ color: "#9A3412", fontSize: 16, fontFamily: "monospace" }}>₫{(showDetailModal.netPayable || 0).toLocaleString("vi-VN")}</strong>
              </div>
            </div>

            <div style={{ marginTop: 14, padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, fontSize: 12.5, color: "#334155" }}>
              <div style={{ fontWeight: 700, marginBottom: 4, color: "#0F172A" }}>Tài khoản chuyển khoản:</div>
              <div>Ngân hàng: <strong>{showDetailModal.bankName}</strong></div>
              <div>Số tài khoản: <strong style={{ fontFamily: "monospace" }}>{showDetailModal.bankAccount}</strong></div>
            </div>

            <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowDetailModal(null)}
                style={{ padding: "10px 20px", borderRadius: 8, background: "#0F172A", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewEntryModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 480, background: "#FFFFFF",
            borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Tạo Bản Ghi Tài Chính Mới
              </h3>
              <button onClick={() => setShowNewEntryModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>LOẠI BẢN GHI</label>
                <select style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFFFFF" }}>
                  <option>Phụ cấp / Thưởng Giảng viên</option>
                  <option>Thu học phí trực tiếp tại quầy</option>
                  <option>Khoản chi cơ sở vật chất</option>
                  <option>Học bổng đặc cách</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>MÃ NHÂN VIÊN / MSSV</label>
                <input placeholder="VD: EMP-00124 hoặc SE150001" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>SỐ TIỀN (VND)</label>
                <input placeholder="VD: 5.000.000" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>NỘI DUNG / CHỨNG TỪ</label>
                <textarea rows={3} placeholder="Ghi chú chi tiết về khoản phát sinh..." style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => setShowNewEntryModal(false)} style={{ padding: "11px", borderRadius: 10, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
                Hủy
              </button>
              <button
                onClick={() => {
                  setShowNewEntryModal(false);
                  showToast("Đã thêm bản ghi tài chính mới thành công!");
                }}
                style={{ padding: "11px", borderRadius: 10, background: "#EA580C", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
              >
                Lưu Bản Ghi
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewAllExpenditures && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 640, background: "#FFFFFF",
            borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Chi Tiết Cơ Cấu Chi Phí Vận Hành (FY23)
              </h3>
              <button onClick={() => setShowViewAllExpenditures(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 380, overflowY: "auto", marginBottom: 20 }}>
              {[
                { name: "Lương & Phúc lợi Cán bộ - Giảng viên", val: "₫1.8T", pct: "47.4%", yoy: "+5.2%" },
                { name: "Cơ sở vật chất & Bảo trì phân hiệu", val: "₫1.2T", pct: "31.6%", yoy: "-2.1%" },
                { name: "Marketing, Truyền thông & Tuyển sinh", val: "₫400B", pct: "10.5%", yoy: "+15.4%" },
                { name: "Hạ tầng Công nghệ thông tin & Bản quyền", val: "₫220B", pct: "5.8%", yoy: "+8.0%" },
                { name: "Học bổng & Hỗ trợ sinh viên vượt khó", val: "₫180B", pct: "4.7%", yoy: "+12.1%" },
              ].map((item, i) => (
                <div key={i} style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>{item.name}</div>
                    <div style={{ fontSize: 11.5, color: "#64748B" }}>Tỷ trọng chi: {item.pct}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "#0F172A", fontFamily: "monospace" }}>{item.val}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: item.yoy.startsWith("+") ? "#DC2626" : "#16A34A" }}>{item.yoy} so cùng kỳ</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowViewAllExpenditures(false)}
                style={{ padding: "10px 22px", borderRadius: 8, background: "#0F172A", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {showHelpModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 480, background: "#FFFFFF",
            borderRadius: 18, padding: "26px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: "0 0 10px" }}>
              Hướng Dẫn Nghiệp Vụ Tài Chính
            </h3>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.5, marginBottom: 16 }}>
              Hệ thống <strong>FPT Finance Portal</strong> hỗ trợ 2 nghiệp vụ cốt lõi:
            </p>
            <ul style={{ fontSize: 13, color: "#334155", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <li><strong>Quản lý Lương & Thù Lao Giảng Dạy:</strong> Kiểm tra lương cơ bản, tính thù lao giờ giảng, trừ thuế TNCN & bảo hiểm, duyệt bảng lương tháng và xuất bản thảo Excel.</li>
              <li><strong>Báo Cáo Tài Chính Thường Niên:</strong> Theo dõi doanh thu theo nguồn (học phí, nghiên cứu, dịch vụ), cơ cấu chi phí vận hành và bảng tổng hợp YoY so sánh cùng kỳ.</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowHelpModal(false)}
                style={{ padding: "10px 20px", borderRadius: 8, background: "#EA580C", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
