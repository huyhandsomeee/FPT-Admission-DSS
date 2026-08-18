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
  CreditCard, Grid, Search, Smile, ChevronDown, CheckSquare
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell, LineChart, Line, AreaChart, Area, ReferenceLine,
  PieChart as RechartsPieChart, Pie
} from "recharts";
import * as XLSX from "xlsx";

export default function BODExecutivePortal() {
  const navigate = useNavigate();

  // Active Tab State (Được phân nhóm khoa học theo luồng Ra Quyết Định DSS Tuyển sinh):
  // ── NHÓM 1: HỆ THỐNG HỖ TRỢ RA QUYẾT ĐỊNH TUYỂN SINH (DSS CORE) ──
  // 1. "dss_forecast": Dự báo & Mô phỏng Kịch bản Ngân sách (What-If Simulation)
  // 2. "dss_funnel": Phân tích Phễu Tuyển sinh & Khuyến nghị AI
  // 3. "dss_marketing": Hiệu quả Marketing, Phân bổ Kênh & Bản đồ nhiệt
  // 4. "dss_trends": Xu hướng Khối ngành & Chiến lược Mở ngành mới
  //
  // ── NHÓM 2: GIÁM SÁT CHIẾN LƯỢC & VẬN HÀNH TOÀN KHỐI (GOVERNANCE & RISK) ──
  // 5. "gov_strategic": Tổng quan Chiến lược & KPI 5 Phân hiệu
  // 6. "gov_risk": Cảnh báo Rủi ro Sớm & Kiểm soát Chỉ tiêu Năm
  // 7. "gov_crossdept": Giám sát Hoạt động & SLA Liên Phòng ban
  // 8. "gov_finance": Kế hoạch Tài chính Dài hạn & Đầu tư Hạ tầng
  const [activeTab, setActiveTab] = useState("dss_forecast");

  // Global Filter: Kỳ học / Năm học tuyển sinh
  const [selectedSemester, setSelectedSemester] = useState("Thu 2026");
  const [selectedCampus, setSelectedCampus] = useState("all");

  // State cho Mô phỏng Kịch bản Ngân sách (What-If Simulation)
  const [tuitionIncrease, setTuitionIncrease] = useState(5); // 0% - 15%
  const [scholarshipRate, setScholarshipRate] = useState(12); // 5% - 25%
  const [marketingBudgetMode, setMarketingBudgetMode] = useState("attack"); // attack, normal, saving
  const [longTermMetric, setLongTermMetric] = useState("students"); // "students" hoặc "revenue"
  const [selectedIndustryField, setSelectedIndustryField] = useState("all");

  // Modals & Notifications
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showRunModelModal, setShowRunModelModal] = useState(false);
  const [showCampusMapModal, setShowCampusMapModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dữ liệu mô phỏng What-If Analysis
  const simulatedForecastData = useMemo(() => {
    const factor = 1 + (tuitionIncrease - 5) * 0.03 - (scholarshipRate - 12) * 0.02 + (marketingBudgetMode === "attack" ? 0.1 : marketingBudgetMode === "saving" ? -0.08 : 0);
    return [
      { quarter: "Q1", base: 450, sim: Math.round(460 * factor) },
      { quarter: "Q2", base: 820, sim: Math.round(890 * factor) },
      { quarter: "Q3", base: 1650, sim: Math.round(1820 * factor) },
      { quarter: "Q4", base: 2200, sim: Math.round(2450 * factor) },
    ];
  }, [tuitionIncrease, scholarshipRate, marketingBudgetMode]);

  // Export Báo cáo DSS Toàn diện
  const handleExportComprehensiveReport = () => {
    const wsData = [
      ["CỔNG DỮ LIỆU ĐẠI HỌC FPT - HỆ THỐNG HỖ TRỢ RA QUYẾT ĐỊNH TUYỂN SINH (DSS)"],
      ["BÁO CÁO CHIẾN LƯỢC DÀNH CHO BAN GIÁM HIỆU / BAN GIÁM ĐỐC"],
      ["Thời gian xuất:", new Date().toLocaleString("vi-VN")],
      ["Kỳ tuyển sinh mục tiêu:", selectedSemester],
      ["Người phê duyệt:", "Hội đồng Tuyển sinh & Ban Giám Hiệu FPT University"],
      [],
      ["═══════════════════════════════════════════════════════════════════"],
      ["PHẦN 1: DỰ PHÓNG CHỈ TIÊU & MÔ PHỎNG KỊCH BẢN (DSS WHAT-IF)"],
      ["═══════════════════════════════════════════════════════════════════"],
      ["Dự báo Doanh thu (FY25)", "2,450 Tỷ VND", "+12.5% vs Mục tiêu 2,200 Tỷ VND"],
      ["Dự báo Tân Sinh viên Nhập học (K21)", "15,200 SV", "+8.2% vs Chỉ tiêu 14,500 SV"],
      ["Tỷ lệ Tăng trưởng Lợi nhuận", "14.8%", "Biên an toàn 12.0%"],
      ["Tham số mô phỏng đang áp dụng", `Tăng học phí: ${tuitionIncrease}%`, `Học bổng: ${scholarshipRate}% | Chiến dịch MKT: ${marketingBudgetMode === "attack" ? "Tấn công (+10%)" : "Cơ bản"}`],
      [],
      ["═══════════════════════════════════════════════════════════════════"],
      ["PHẦN 2: PHÂN TÍCH PHỄU CHUYỂN ĐỔI & HIỆU QUẢ MARKETING"],
      ["═══════════════════════════════════════════════════════════════════"],
      ["1. Tổng Leads Đăng ký", "24,500 Thí sinh", "+12% so với kỳ trước"],
      ["2. Hồ sơ Xét tuyển (Applicants)", "8,200 Thí sinh", "Tỷ lệ chuyển đổi: 33.4% | Dự báo rớt: 15%"],
      ["3. Đủ điều kiện Trúng tuyển (Admits)", "5,100 Thí sinh", "Tỷ lệ chuyển đổi: 62.1%"],
      ["4. Nhập học chính thức (Enrolled)", "3,850 Tân SV", "Tỷ lệ Yield: 75.4%"],
      ["Chi phí chuyển đổi/SV (CAC)", "2.4 Triệu VNĐ", "Giảm 5% vs kỳ trước"],
      ["Ngân sách Marketing K20 dự kiến", "15.2 Tỷ VNĐ", "Phân bổ: FB Ads 40%, THPT 30%, TikTok 20%, Referral 10%"],
      [],
      ["═══════════════════════════════════════════════════════════════════"],
      ["PHẦN 3: MA TRẬN RỦI RO & KIỂM SOÁT VẬN HÀNH"],
      ["═══════════════════════════════════════════════════════════════════"],
      ["Rủi ro Nghiêm trọng (Mức Cao)", "4 Hạng mục", "Tỷ lệ hồ sơ ảo Miền Tây (+15%), Tỷ lệ bỏ học K1"],
      ["Rủi ro Cần theo dõi (Mức TB)", "12 Hạng mục", "Ngân sách Marketing ngành CNTT đạt ngưỡng 90%"],
      ["Hạng mục Kiểm soát Tốt", "48 Hạng mục", "SLA Tuyển sinh đạt 98.3%, Thu học phí kỳ Fall đạt 95.2%"],
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FPT_DSS_BOD_Report");
    XLSX.writeFile(wb, `BOD_Admission_DSS_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Đã xuất báo cáo chiến lược DSS Tuyển sinh thành công (Excel)!");
  };

  // Cấu trúc Sidebar phân nhóm chuẩn DSS
  const navigationGroups = [
    {
      groupTitle: "HỖ TRỢ RA QUYẾT ĐỊNH (DSS CORE)",
      items: [
        { id: "dss_forecast", icon: Sliders, label: "Dự báo & Mô phỏng", desc: "Mô phỏng ngân sách & chỉ tiêu tuyển sinh (What-If)" },
        { id: "dss_funnel", icon: UserPlus, label: "DSS Phễu Tuyển sinh", desc: "Hệ thống hỗ trợ ra quyết định & AI Recommendations" },
        { id: "dss_marketing", icon: Megaphone, label: "Nguồn & ROI Marketing", desc: "Phân bổ kênh, chi phí CAC & Bản đồ nhiệt thí sinh" },
        { id: "dss_trends", icon: Globe, label: "Xu hướng & Mở ngành", desc: "AI Insights thị trường lao động & Đề xuất ngành mới" },
      ]
    },
    {
      groupTitle: "GIÁM SÁT CHIẾN LƯỢC & VẬN HÀNH",
      items: [
        { id: "gov_strategic", icon: Activity, label: "Tổng quan Chiến lược", desc: "Chỉ số toàn khối & Theo dõi KPI 5 Phân hiệu" },
        { id: "gov_risk", icon: ShieldAlert, label: "Cảnh báo Rủi ro & Chỉ tiêu", desc: "Cảnh báo sớm, ma trận rủi ro & Dashboard chỉ tiêu năm" },
        { id: "gov_crossdept", icon: TrendingUp, label: "SLA Liên Phòng ban", desc: "Giám sát hiệu suất phối hợp Tuyển sinh, Đào tạo, Tài chính" },
        { id: "gov_finance", icon: Wallet, label: "Kế hoạch Tài chính Dài hạn", desc: "Tăng trưởng doanh thu 5 năm & Đầu tư hạ tầng trọng điểm" },
      ]
    }
  ];

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

      {/* ── SIDEBAR ĐỒNG BỘ CHO BAN GIÁM HIỆU (BOD) ── */}
      <aside style={{
        width: 250, background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        flexShrink: 0, zIndex: 30, overflowY: "auto"
      }}>
        <div>
          {/* Logo & Brand Identity */}
          <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #F1F5F9" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "#EA580C", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FFFFFF", fontWeight: 900,
              fontSize: 16, boxShadow: "0 4px 12px rgba(234,88,12,0.3)"
            }}>
              FP
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.3px", lineHeight: 1.15 }}>
                FPT University
              </div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, marginTop: 2 }}>
                Admission DSS Portal <span style={{ fontSize: 9.5, background: "#FFEDD5", color: "#C2410C", padding: "1px 5px", borderRadius: 4, fontWeight: 800 }}>BOD</span>
              </div>
            </div>
          </div>

          {/* Danh mục Chức năng Sidebar phân nhóm */}
          <nav style={{ padding: "12px 10px", display: "flex", flexDirection: "column", gap: 14 }}>
            {navigationGroups.map((group, gIdx) => (
              <div key={gIdx}>
                <div style={{ fontSize: 9.5, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.6px", padding: "0 10px 6px", textTransform: "uppercase" }}>
                  {group.groupTitle}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {group.items.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        title={tab.desc}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: 10,
                          padding: "9px 12px", borderRadius: 8, fontSize: 12.5,
                          fontWeight: isActive ? 800 : 600,
                          color: isActive ? "#FFFFFF" : "#475569",
                          background: isActive ? "#EA580C" : "transparent",
                          border: "none", cursor: "pointer", textAlign: "left",
                          transition: "all 0.15s ease",
                          boxShadow: isActive ? "0 3px 10px rgba(234,88,12,0.25)" : "none"
                        }}
                      >
                        <tab.icon size={16} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#FFFFFF" : "#64748B"} />
                        <span style={{ lineHeight: 1.2 }}>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer: User Member Info */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid #E2E8F0", background: "#FAFBFD" }}>
          <div style={{
            background: "#FFFFFF", borderRadius: 10, border: "1px solid #E2E8F0",
            padding: "10px 12px", display: "flex", alignItems: "center", gap: 10, marginBottom: 8
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#0F172A", color: "#FFFFFF", display: "flex",
              alignItems: "center", justifyContent: "center", fontWeight: 800,
              fontSize: 11
            }}>
              BOD
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>Admin User</div>
              <div style={{ fontSize: 10.5, color: "#64748B" }}>Hội đồng Tuyển sinh BGH</div>
            </div>
            <button
              onClick={() => navigate("/login")}
              title="Đăng xuất"
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}
            >
              <LogOut size={15} />
            </button>
          </div>
          <div style={{ fontSize: 10, color: "#94A3B8", textAlign: "center", fontWeight: 500 }}>
            Hệ thống Ra Quyết định DSS • v2.0.4
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main style={{ flex: 1, height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* ── TOP HEADER ĐỒNG BỘ ── */}
        <header style={{
          height: 60, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
          padding: "0 28px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 20
        }}>
          {/* Tiêu đề & Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.2px" }}>
              <Building size={18} /> Cổng Dữ Liệu Đại Học FPT
            </div>
            <span style={{ color: "#CBD5E1" }}>|</span>
            <span style={{ fontSize: 12, background: "#EFF6FF", color: "#1D4ED8", padding: "3px 9px", borderRadius: 100, fontWeight: 700 }}>
              Hệ Thống Ra Quyết Định Tuyển Sinh (DSS)
            </span>
          </div>

          {/* Bộ lọc Toàn Cục & Thao tác BGH */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Bộ lọc Kỳ Tuyển sinh */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: 8, padding: "5px 10px" }}>
              <Calendar size={13} color="#64748B" />
              <select
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  showToast(`Đã đồng bộ dữ liệu DSS cho kỳ: ${e.target.value}`);
                }}
                style={{ border: "none", background: "transparent", fontSize: 12, fontWeight: 700, color: "#0F172A", cursor: "pointer", outline: "none" }}
              >
                <option value="Thu 2026">Kỳ Thu 2024 (Thu 2026)</option>
                <option value="Xuan 2026">Kỳ Xuân 2025 (Xuan 2026)</option>
                <option value="Thu 2026">Dự phóng Kỳ Thu 2025 (Thu 2026)</option>
              </select>
            </div>

            {/* Nút Xuất Báo Cáo Excel Tổng Thể */}
            <button
              onClick={handleExportComprehensiveReport}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12, fontWeight: 700, color: "#334155", cursor: "pointer" }}
            >
              <Download size={14} /> Xuất Báo Cáo DSS
            </button>

            {/* Nút Huấn Luyện AI DSS */}
            <button
              onClick={() => setShowRunModelModal(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 6px rgba(154,52,18,0.25)" }}
            >
              <Bot size={14} /> Chạy Mô Hình DSS
            </button>

            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowNotificationModal(!showNotificationModal)}
                style={{
                  width: 34, height: 34, borderRadius: "50%", border: "1px solid #E2E8F0",
                  background: "#FFFFFF", display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "#475569"
                }}
              >
                <Bell size={15} />
                <span style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: "50%", background: "#DC2626" }} />
              </button>

              {showNotificationModal && (
                <div style={{
                  position: "absolute", top: 42, right: 0, width: 320,
                  background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.12)", padding: "14px 16px", zIndex: 100
                }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: "#0F172A", marginBottom: 8 }}>Chỉ thị Ban Giám Hiệu & Cảnh báo DSS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                    <div style={{ padding: "8px", background: "#FEE2E2", borderRadius: 6, color: "#991B1B" }}>
                      ⚠️ <strong>Cảnh báo:</strong> Tỷ lệ hồ sơ ảo khu vực Miền Tây tăng 15% so với cùng kỳ.
                    </div>
                    <div style={{ padding: "8px", background: "#EFF6FF", borderRadius: 6, color: "#1E40AF" }}>
                      📈 <strong>Dự báo:</strong> Tân sinh viên nhập học K21 dự kiến đạt 15,200 SV (+8.2%).
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* ── MAIN BODY CONTENT (RENDER 8 MÀN HÌNH CHUẨN) ── */}
        <div style={{ flex: 1, padding: "24px 28px 48px", maxWidth: 1440, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

          {/* =========================================================================
              MÀN HÌNH 1: DỰ BÁO TÀI CHÍNH & MÔ PHỎNG KỊCH BẢN (WHAT-IF SIMULATION)
             ========================================================================= */}
          {activeTab === "dss_forecast" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                    Hệ thống Dự báo Tài chính & Tuyển sinh
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Báo cáo dự phóng năm học 2025 - 2026 • Phân tích độ nhạy biến số ngân sách
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleExportComprehensiveReport}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, border: "1px solid #1D4ED8", background: "#FFFFFF", color: "#1D4ED8", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    <Download size={14} /> Xuất Báo Cáo
                  </button>
                  <button
                    onClick={() => showToast("Đã kích hoạt mô hình tối ưu hóa đa mục tiêu")}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 6, background: "#9A3412", color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    <Filter size={14} /> Bộ Lọc DSS
                  </button>
                </div>
              </div>

              {/* 3 Thẻ KPI chính */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr", gap: 18, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ color: "#DC2626" }}><CreditCard size={17} /></div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Dự báo Doanh thu (FY25)</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "2px 6px", borderRadius: 4 }}>
                      ↗ +12.5%
                    </span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px", margin: "4px 0" }}>
                    2,450 Tỷ VND
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                      <div style={{ width: "88%", height: "100%", background: "#9A3412" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginTop: 4, fontWeight: 600 }}>
                      <span>Mục tiêu</span>
                      <span>2,200 Tỷ VND</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ color: "#2563EB" }}><Users size={17} /></div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Dự báo Nhập học (Khóa 21)</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "2px 6px", borderRadius: 4 }}>
                      ↗ +8.2%
                    </span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px", margin: "4px 0" }}>
                    15,200 SV
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                      <div style={{ width: "95%", height: "100%", background: "#2563EB" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginTop: 4, fontWeight: 600 }}>
                      <span>Chỉ tiêu</span>
                      <span>14,500 SV</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ color: "#0284C7" }}><PieChart size={17} /></div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Tỷ lệ Tăng trưởng Lợi nhuận</span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#D97706", background: "#FEF3C7", padding: "2px 6px", borderRadius: 4 }}>
                      → Ổn định
                    </span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px", margin: "4px 0" }}>
                    14.8%
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                      <div style={{ width: "82%", height: "100%", background: "#EA580C" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginTop: 4, fontWeight: 600 }}>
                      <span>Biên an toàn</span>
                      <span>12.0%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mô phỏng kịch bản What-If + Khuyến nghị AI */}
              <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                        <div style={{ color: "#EA580C" }}><Sliders size={16} /></div>
                        Mô phỏng Kịch bản Ngân sách (What-If Analysis)
                      </div>
                      <p style={{ fontSize: 11.5, color: "#64748B", margin: "2px 0 0" }}>
                        Kéo thanh trượt để mô phỏng tác động tức thì tới dòng tiền và chỉ tiêu nhập học
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 14, background: "#FAFAFA", padding: "12px 14px", borderRadius: 8, border: "1px solid #F1F5F9", marginBottom: 14 }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        <span>Tăng Học phí (%)</span>
                        <span style={{ color: "#9A3412", fontWeight: 800 }}>{tuitionIncrease}%</span>
                      </div>
                      <input
                        type="range" min="0" max="15" value={tuitionIncrease}
                        onChange={(e) => setTuitionIncrease(Number(e.target.value))}
                        style={{ width: "100%", accentColor: "#9A3412", cursor: "pointer" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "#94A3B8", marginTop: 2 }}>
                        <span>0%</span>
                        <span>15%</span>
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        <span>Tỷ lệ Học bổng (%)</span>
                        <span style={{ color: "#2563EB", fontWeight: 800 }}>{scholarshipRate}%</span>
                      </div>
                      <input
                        type="range" min="5" max="25" value={scholarshipRate}
                        onChange={(e) => setScholarshipRate(Number(e.target.value))}
                        style={{ width: "100%", accentColor: "#2563EB", cursor: "pointer" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "#94A3B8", marginTop: 2 }}>
                        <span>5%</span>
                        <span>25%</span>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: 11.5, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                        Chi phí Marketing
                      </label>
                      <select
                        value={marketingBudgetMode}
                        onChange={(e) => setMarketingBudgetMode(e.target.value)}
                        style={{ width: "100%", padding: "5px 8px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 11.5, background: "#FFFFFF", fontWeight: 600, color: "#0F172A" }}
                      >
                        <option value="attack">Tăng 10% (Tấn công)</option>
                        <option value="normal">Giữ nguyên ngân sách</option>
                        <option value="saving">Cắt giảm 10% (Thận trọng)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ width: "100%", height: 190 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={simulatedForecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="quarter" fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="sim" stroke="#78350F" fill="#FDE68A" strokeWidth={3} fillOpacity={0.4} name="Dự phóng mô phỏng" />
                        <Line type="monotone" dataKey="base" stroke="#1E3A8A" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Kế hoạch cơ sở" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Khuyến nghị AI */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>
                    <div style={{ color: "#3B82F6" }}><Sparkles size={16} /></div>
                    Khuyến nghị AI
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#FFFFFF" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: "#FFEDD5", color: "#C2410C", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Cpu size={13} />
                        </div>
                        <strong style={{ fontSize: 12.5, color: "#0F172A" }}>Tăng ngân sách ngành AI & Robotics</strong>
                      </div>
                      <p style={{ fontSize: 11.5, color: "#475569", margin: "0 0 6px", lineHeight: 1.4 }}>
                        Dữ liệu thị trường cho thấy nhu cầu nhân lực tăng 25%. Đề xuất tăng 15% học bổng thu hút nhân tài.
                      </p>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span style={{ fontSize: 10, background: "#F1F5F9", padding: "2px 6px", borderRadius: 4, color: "#475569" }}>Tác động: <strong>Cao</strong></span>
                        <span style={{ fontSize: 10, background: "#F1F5F9", padding: "2px 6px", borderRadius: 4, color: "#475569" }}>Rủi ro: <strong>Thấp</strong></span>
                      </div>
                    </div>

                    <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#FFFFFF" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: "#DBEAFE", color: "#1D4ED8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Building size={13} />
                        </div>
                        <strong style={{ fontSize: 12.5, color: "#0F172A" }}>Mở rộng Campus tại Đà Nẵng</strong>
                      </div>
                      <p style={{ fontSize: 11.5, color: "#475569", margin: "0 0 6px", lineHeight: 1.4 }}>
                        Dự báo quá tải cơ sở hạ tầng hiện tại vào năm 2026. Cần khởi động giai đoạn 2 xây dựng.
                      </p>
                    </div>

                    <div style={{ padding: "12px 14px", borderRadius: 8, border: "1px solid #E2E8F0", background: "#FFFFFF" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: "#E0F2FE", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Megaphone size={13} />
                        </div>
                        <strong style={{ fontSize: 12.5, color: "#0F172A" }}>Tối ưu chi phí Marketing Digital</strong>
                      </div>
                      <p style={{ fontSize: 11.5, color: "#475569", margin: 0, lineHeight: 1.4 }}>
                        CAC đang tăng. Cần chuyển dịch 20% ngân sách sang Kênh trường THPT.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Xu hướng 10 năm */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                      <TrendingUp size={16} /> Phân tích Xu hướng Dài hạn (10 Năm)
                    </div>
                    <p style={{ fontSize: 11.5, color: "#64748B", margin: "2px 0 0" }}>
                      So sánh dữ liệu lịch sử (5 năm qua) và dự phóng (5 năm tới)
                    </p>
                  </div>

                  <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 6, padding: 2 }}>
                    <button
                      onClick={() => setLongTermMetric("students")}
                      style={{
                        padding: "5px 12px", borderRadius: 5, border: "none",
                        background: longTermMetric === "students" ? "#FFFFFF" : "transparent",
                        fontWeight: 700, fontSize: 11.5, color: "#0F172A", cursor: "pointer"
                      }}
                    >
                      Quy mô SV
                    </button>
                    <button
                      onClick={() => setLongTermMetric("revenue")}
                      style={{
                        padding: "5px 12px", borderRadius: 5, border: "none",
                        background: longTermMetric === "revenue" ? "#FFFFFF" : "transparent",
                        fontWeight: 700, fontSize: 11.5, color: "#0F172A", cursor: "pointer"
                      }}
                    >
                      Doanh thu
                    </button>
                  </div>
                </div>

                <div style={{ width: "100%", height: 210 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { year: "2020", history: 8500, projection: null },
                        { year: "2021", history: 9600, projection: null },
                        { year: "2022", history: 11200, projection: null },
                        { year: "2023", history: 12800, projection: null },
                        { year: "2024", history: 14250, projection: null },
                        { year: "2025 (H)", history: 15200, projection: 15200 },
                        { year: "2026 (P)", history: null, projection: 16800 },
                        { year: "2027 (P)", history: null, projection: 18500 },
                        { year: "2028 (P)", history: null, projection: 20400 },
                        { year: "2029 (P)", history: null, projection: 22600 },
                        { year: "2030 (P)", history: null, projection: 25000 },
                      ]}
                      margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                      <XAxis dataKey="year" fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                      <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                      <Tooltip />
                      <ReferenceLine x="2025 (H)" stroke="#F59E0B" strokeDasharray="3 3" label={{ value: "Hiện tại", position: "top", fill: "#B45309", fontSize: 10, fontWeight: 700 }} />
                      <Line type="monotone" dataKey="history" stroke="#2563EB" strokeWidth={3.5} dot={{ r: 3 }} name="Dữ liệu lịch sử" />
                      <Line type="monotone" dataKey="projection" stroke="#78350F" strokeWidth={3.5} strokeDasharray="6 6" dot={{ r: 3 }} name="Dự phóng 5 năm tới" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 2: DSS PHỄU TUYỂN SINH & KHUYẾN NGHỊ HÀNH ĐỘNG AI
             ========================================================================= */}
          {activeTab === "dss_funnel" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                    Hệ Thống Hỗ Trợ Ra Quyết Định Tuyển Sinh (DSS Funnel)
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Phân tích chuyển đổi đa tầng & Đề xuất hành động tức thời từ mô hình Machine Learning
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleExportComprehensiveReport}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    <Download size={14} /> Xuất Báo Cáo
                  </button>
                  <button
                    onClick={() => setShowRunModelModal(true)}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 6, background: "#9A3412", color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    <Bot size={14} /> Chạy Mô Hình
                  </button>
                </div>
              </div>

              {/* 4 Thẻ KPI DSS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#475569" }}>
                      <TrendingUp size={15} color="#9A3412" /> Dự Báo Nhập Học
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "2px 6px", borderRadius: 4 }}>
                      ↑ 12.4%
                    </span>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                    14,250
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                    Sinh viên (Độ tin cậy 94%)
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#475569" }}>
                      <Filter size={15} color="#2563EB" /> Tỷ Lệ Chuyển Đổi
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#D97706", background: "#FEF3C7", padding: "2px 6px", borderRadius: 4 }}>
                      — 0.2%
                    </span>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                    8.7%
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                    Leads → Nhập học
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#475569" }}>
                      <Megaphone size={15} color="#059669" /> ROI Marketing
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "2px 6px", borderRadius: 4 }}>
                      ↑ 4.1%
                    </span>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                    3.2x
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                    Trung bình các kênh
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#475569" }}>
                      <CreditCard size={15} color="#DC2626" /> Ngân Sách Học Bổng
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#DC2626", background: "#FEE2E2", padding: "2px 6px", borderRadius: 4 }}>
                      ⚠️ Vượt 2%
                    </span>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                    45B VNĐ
                  </div>
                  <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>
                    Đã giải ngân (Dự kiến 44B)
                  </div>
                </div>
              </div>

              {/* Phễu Tuyển Sinh & Khuyến Nghị Hành Động */}
              <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18, alignItems: "start" }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                      Phân Tích Phễu Tuyển Sinh (Conversion Funnel)
                    </h3>
                    <span onClick={() => showToast("Đang mở chi tiết phễu chuyển đổi từng phân hiệu")} style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", cursor: "pointer" }}>
                      Chi tiết
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
                    {[
                      { step: "1. Đăng ký nhận thông tin (Leads)", count: "165,000", percent: 100, barWidth: 100, color: "#582C1B" },
                      { step: "2. Nộp hồ sơ xét tuyển", count: "85,200", percent: 51.6, barWidth: 51.6, color: "#9A3412" },
                      { step: "3. Trúng tuyển", count: "42,600", percent: 50.0, barWidth: 25.8, color: "#C2410C" },
                      { step: "4. Nhập học chính thức", count: "14,350", percent: 33.6, barWidth: 8.7, color: "#EA580C" },
                    ].map((f, idx) => (
                      <div key={idx}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 5 }}>
                          <span>{f.step}</span>
                          <strong>{f.count} {f.percent < 100 ? `(${f.percent}%)` : ""}</strong>
                        </div>
                        <div style={{ width: "100%", height: 14, borderRadius: 3, background: "#0F172A", overflow: "hidden" }}>
                          <div style={{ width: `${f.barWidth}%`, height: "100%", background: f.color }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: "12px 14px", borderRadius: 8, background: "#FFF7ED", border: "1px solid #FFEDD5" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 900, color: "#9A3412", marginBottom: 3 }}>
                      <Lightbulb size={15} /> Đề xuất AI
                    </div>
                    <p style={{ fontSize: 11.5, color: "#7C2D12", margin: 0, lineHeight: 1.45 }}>
                      Tỷ lệ chuyển đổi từ Trúng tuyển sang Nhập học giảm 2% so với kỳ trước. Đề xuất tăng cường chiến dịch gọi điện chăm sóc (Telesales) cho nhóm đối tượng có điểm xét tuyển ở mức khá trong tuần tới.
                    </p>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 900, color: "#0F172A", marginBottom: 14 }}>
                    <Bot size={16} color="#9A3412" /> Khuyến Nghị Hành Động
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { id: "REC-01", title: "Điều chỉnh Học bổng Vùng", tag: "High", tagBg: "#FEE2E2", tagColor: "#DC2626", desc: "Mô hình dự báo số lượng thí sinh ĐBSCL giảm. Cân nhắc tăng 5% quota học bổng khu vực này để bù đắp.", actionText: "Tăng Quota Học bổng ĐBSCL" },
                      { id: "REC-02", title: "Tối ưu Kênh Digital", tag: "Medium", tagBg: "#FEF3C7", tagColor: "#D97706", desc: "ROI kênh TikTok Ads đang gấp 1.5 lần Facebook Ads. Đề xuất dịch chuyển 20% ngân sách.", actionText: "Dịch chuyển Ngân sách TikTok" },
                      { id: "REC-03", title: "Mở thêm Ngành Hot", tag: "Low", tagBg: "#DCFCE7", tagColor: "#16A34A", desc: "Nhu cầu tìm kiếm \"AI & Robotics\" tăng đột biến. Chuẩn bị nguồn lực truyền thông chuyên sâu.", actionText: "Phê duyệt Đề án Mở ngành" }
                    ].map((rec) => (
                      <div
                        key={rec.id}
                        style={{
                          padding: "12px 14px", borderRadius: 8, border: "1px solid #E2E8F0",
                          borderLeft: rec.tag === "High" ? "4px solid #DC2626" : rec.tag === "Medium" ? "4px solid #D97706" : "4px solid #16A34A",
                          background: "#FFFFFF"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <strong style={{ fontSize: 12.5, color: "#0F172A" }}>{rec.title}</strong>
                          <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 800, color: rec.tagColor, background: rec.tagBg }}>
                            {rec.tag}
                          </span>
                        </div>
                        <p style={{ fontSize: 11.5, color: "#475569", margin: "0 0 8px", lineHeight: 1.4 }}>
                          {rec.desc}
                        </p>
                        <button
                          onClick={() => showToast(`Ban Giám Hiệu đã phê duyệt chỉ thị: "${rec.actionText}"!`)}
                          style={{ padding: "5px 10px", borderRadius: 5, background: "#0F172A", color: "#FFFFFF", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                        >
                          Phê duyệt chỉ thị
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 3: HIỆU QUẢ MARKETING, NGUỒN TUYỂN SINH & BẢN ĐỒ NHIỆT
             ========================================================================= */}
          {activeTab === "dss_marketing" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                    Phân tích Nguồn Tuyển sinh & Hiệu quả Marketing
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Tối ưu hóa đa kênh • Đo lường chi phí thu hút sinh viên (CAC) & Phân bổ địa lý
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "1px solid #78350F", background: "#FFFFFF", color: "#78350F", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                    <Calendar size={14} /> Kỳ {selectedSemester}
                  </button>
                  <button
                    onClick={handleExportComprehensiveReport}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 6, background: "#9A3412", color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    <Download size={14} /> Xuất báo cáo
                  </button>
                </div>
              </div>

              {/* Phễu Tuyển sinh Thông minh + ROI Marketing */}
              <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                      <div style={{ color: "#DC2626" }}><Filter size={16} /></div>
                      Phễu tuyển sinh thông minh
                    </div>
                    <span style={{ fontSize: 11, color: "#475569", background: "#F1F5F9", padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>
                      Dự báo: Ổn định
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ background: "#EFF6FF", borderRadius: 8, padding: "12px 18px", border: "1px solid #DBEAFE" }}>
                      <div style={{ fontSize: 10.5, fontWeight: 800, color: "#64748B" }}>LEADS</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                        <span style={{ fontSize: 26, fontWeight: 900, color: "#1D4ED8" }}>24,500</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: "#16A34A" }}>↗ +12%</span>
                      </div>
                    </div>

                    <div style={{ width: "88%", margin: "0 auto", background: "#F0FDF4", borderRadius: 8, padding: "10px 16px", border: "1px solid #DCFCE7" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 800, color: "#64748B" }}>APPLICANTS</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: "#0369A1" }}>8,200</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: 11.5, color: "#64748B", fontWeight: 700 }}>33.4% Conv.</span>
                          <div style={{ fontSize: 11, color: "#DC2626", fontWeight: 700 }}>Dự báo rớt: 15%</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ width: "74%", margin: "0 auto", background: "#FFF7ED", borderRadius: 8, padding: "10px 16px", border: "1px solid #FFEDD5" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 800, color: "#64748B" }}>ADMITS</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: "#C2410C" }}>5,100</div>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 700 }}>62.1% Conv.</div>
                      </div>
                    </div>

                    <div style={{ width: "60%", margin: "0 auto", background: "#ECFDF5", borderRadius: 8, padding: "10px 16px", border: "1px solid #D1FAE5" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 800, color: "#64748B" }}>ENROLLED</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: "#047857" }}>3,850</div>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#065F46", fontWeight: 800 }}>75.4% Yield</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>
                    <div style={{ color: "#78350F" }}><CreditCard size={16} /></div>
                    Chỉ số ROI Marketing
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>CAC (Chi phí/Thí sinh)</span>
                      <span style={{ fontSize: 26, fontWeight: 900, color: "#0F172A" }}>2.4M VNĐ</span>
                    </div>
                    <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#9A3412", margin: "8px 0 4px" }} />
                    <div style={{ textAlign: "right", fontSize: 11, fontWeight: 700, color: "#16A34A" }}>-5% vs kỳ trước</div>
                  </div>

                  <div style={{ background: "#FAFAFA", borderRadius: 10, padding: "14px 16px", border: "1px solid #F1F5F9" }}>
                    <div style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>Dự báo ngân sách cần thiết (K20)</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#1D4ED8", margin: "4px 0 6px" }}>15.2 Tỷ VNĐ</div>
                    <p style={{ fontSize: 11.5, color: "#64748B", margin: 0 }}>
                      Dựa trên mục tiêu tăng trưởng 15% leads.
                    </p>
                  </div>
                </div>
              </div>

              {/* Attribution Donut & Bản đồ nhiệt */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: 18 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>
                    <div style={{ color: "#EA580C" }}><PieChart size={16} /></div>
                    Phân tích nguồn (Attribution)
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div style={{ width: 140, height: 140, position: "relative" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: "Facebook Ads", value: 40, color: "#78350F" },
                              { name: "Event THPT", value: 30, color: "#2563EB" },
                              { name: "TikTok", value: 20, color: "#0284C7" },
                              { name: "Referral", value: 10, color: "#059669" },
                            ]}
                            innerRadius={45} outerRadius={65} dataKey="value" stroke="none"
                          >
                            <Cell fill="#78350F" />
                            <Cell fill="#2563EB" />
                            <Cell fill="#0284C7" />
                            <Cell fill="#059669" />
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                        <span style={{ fontSize: 9.5, color: "#64748B", fontWeight: 600 }}>Tổng Leads</span>
                        <strong style={{ fontSize: 13, color: "#0F172A" }}>24.5k</strong>
                      </div>
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                      {[
                        { label: "Facebook Ads", pct: "40%", color: "#78350F" },
                        { label: "Event THPT", pct: "30%", color: "#2563EB" },
                        { label: "TikTok", pct: "20%", color: "#0284C7" },
                        { label: "Referral", pct: "10%", color: "#059669" },
                      ].map((s, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 9, height: 9, borderRadius: "50%", background: s.color }} />
                            <span style={{ color: "#334155", fontWeight: 600 }}>{s.label}</span>
                          </div>
                          <strong style={{ color: "#0F172A" }}>{s.pct}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px", position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                      <div style={{ color: "#DC2626" }}><Map size={16} /></div>
                      Bản đồ nhiệt Tuyển sinh
                    </div>
                    <button onClick={() => setShowCampusMapModal(true)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                      <Maximize2 size={15} />
                    </button>
                  </div>

                  <div style={{
                    height: 150, borderRadius: 8, background: "linear-gradient(135deg, #E0F2FE 0%, #DCFCE7 100%)",
                    border: "1px solid #BAE6FD", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: "radial-gradient(#0369A1 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
                    <div style={{ textAlign: "center", color: "#0369A1", fontSize: 12, fontWeight: 700 }}>
                      🗺️ Mạng lưới phân bổ nguồn thí sinh 5 Phân hiệu Toàn quốc
                    </div>

                    <div style={{
                      position: "absolute", bottom: 10, right: 10, background: "#FFFFFF",
                      borderRadius: 8, padding: "8px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      border: "1px solid #E2E8F0", fontSize: 11
                    }}>
                      <div style={{ fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>Top Khu vực</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><span>Hà Nội</span><strong style={{ color: "#9A3412" }}>45%</strong></div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><span>TP.HCM</span><strong style={{ color: "#2563EB" }}>30%</strong></div>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}><span>Đà Nẵng</span><strong style={{ color: "#059669" }}>15%</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 4: XU HƯỚNG THỊ TRƯỜNG & CHIẾN LƯỢC MỞ NGÀNH MỚI
             ========================================================================= */}
          {activeTab === "dss_trends" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                    Phân tích Xu hướng & Thị trường Lao động
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Dữ liệu hỗ trợ quyết định chiến lược mở ngành mới năm học 2025-2026
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleExportComprehensiveReport}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, border: "1px solid #1D4ED8", background: "#FFFFFF", color: "#1D4ED8", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    <Download size={14} /> Xuất Báo Cáo
                  </button>
                  <button
                    onClick={() => showToast("Đang mở biểu mẫu Tạo Đề Xuất Mở Ngành Mới cho BGH")}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 6, background: "#9A3412", color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    + Tạo Đề Xuất
                  </button>
                </div>
              </div>

              {/* Xu hướng Quan tâm Khối ngành + AI Insights */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1.1fr", gap: 18, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                      <TrendingUp size={16} color="#DC2626" />
                      Xu hướng Quan tâm Khối ngành (2020-2024)
                    </div>
                    <select
                      value={selectedIndustryField}
                      onChange={(e) => setSelectedIndustryField(e.target.value)}
                      style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 11.5, background: "#FFFFFF" }}
                    >
                      <option value="all">Tất cả Khối ngành</option>
                      <option value="it">Khối CNTT & AI</option>
                      <option value="biz">Khối Kinh tế & Quản trị</option>
                    </select>
                  </div>

                  <div style={{ width: "100%", height: 210 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { year: "2020", value: 38, fill: "#0284C7" },
                          { year: "2021", value: 58, fill: "#0284C7" },
                          { year: "2022", value: 45, fill: "#0284C7" },
                          { year: "2023", value: 75, fill: "#EA580C" },
                          { year: "2024", value: 92, fill: "#78350F" },
                        ]}
                        margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                        <XAxis dataKey="year" fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {[
                            { fill: "#0284C7" },
                            { fill: "#0284C7" },
                            { fill: "#0284C7" },
                            { fill: "#EA580C" },
                            { fill: "#78350F" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div style={{ textAlign: "center", fontSize: 11, color: "#64748B", marginTop: 6 }}>
                    Dữ liệu minh họa: Tăng trưởng khối ngành Kỹ thuật
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>
                    <div style={{ color: "#0284C7" }}><Briefcase size={16} /></div>
                    AI Insights: Thị trường Lao động
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ padding: "10px 14px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F1F5F9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#64748B" }}>NHU CẦU CAO NHẤT</span>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: "#16A34A" }}>+24% YoY</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "2px 0" }}>Kỹ sư AI & Dữ liệu</div>
                      <div style={{ fontSize: 11.5, color: "#475569" }}>Lương KĐ: 15M - 25M VNĐ</div>
                    </div>

                    <div style={{ padding: "10px 14px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F1F5F9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#64748B" }}>TĂNG TRƯỞNG NHANH</span>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: "#16A34A" }}>+18% YoY</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "2px 0" }}>Truyền thông Đa phương tiện</div>
                      <div style={{ fontSize: 11.5, color: "#475569" }}>Lương KĐ: 12M - 18M VNĐ</div>
                    </div>

                    <div style={{ padding: "10px 14px", background: "#FAFAFA", borderRadius: 8, border: "1px solid #F1F5F9" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#64748B" }}>BÃO HÒA NHẸ</span>
                        <span style={{ fontSize: 10.5, fontWeight: 800, color: "#DC2626" }}>-5% YoY</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", margin: "2px 0" }}>Quản trị Khách sạn truyền thống</div>
                      <div style={{ fontSize: 11.5, color: "#475569" }}>Lương KĐ: 8M - 12M VNĐ</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Đối thủ Cạnh tranh + Đề xuất Mở Ngành Mới */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 18 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>
                    <div style={{ color: "#0284C7" }}><PieChart size={16} /></div>
                    Phân tích Đối thủ Cạnh tranh
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div>
                      <strong style={{ fontSize: 12.5, color: "#0F172A" }}>Thiết kế Vi mạch (Semiconductor)</strong>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 4, marginBottom: 4 }}>
                        <span style={{ color: "#9A3412", fontWeight: 700 }}>FPT: Sẵn sàng 80%</span>
                        <span style={{ color: "#64748B" }}>ĐH Bách Khoa: Đã mở</span>
                      </div>
                      <div style={{ width: "100%", height: 7, borderRadius: 3.5, background: "#E2E8F0", overflow: "hidden" }}>
                        <div style={{ width: "80%", height: "100%", background: "#78350F" }} />
                      </div>
                    </div>

                    <div>
                      <strong style={{ fontSize: 12.5, color: "#0F172A" }}>Công nghệ Ô tô điện</strong>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginTop: 4, marginBottom: 4 }}>
                        <span style={{ color: "#EA580C", fontWeight: 700 }}>FPT: Đang nghiên cứu (40%)</span>
                        <span style={{ color: "#64748B" }}>ĐH SPKT: Đang mở rộng</span>
                      </div>
                      <div style={{ width: "100%", height: 7, borderRadius: 3.5, background: "#E2E8F0", overflow: "hidden" }}>
                        <div style={{ width: "40%", height: "100%", background: "#EA580C" }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>
                    <div style={{ color: "#EA580C" }}><Lightbulb size={16} /></div>
                    Đề xuất Mở Ngành Mới
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
                    <thead>
                      <tr style={{ color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                        <th style={{ padding: "8px 10px", fontWeight: 700 }}>NGÀNH ĐỀ XUẤT</th>
                        <th style={{ padding: "8px 10px", fontWeight: 700, textAlign: "center" }}>NHU CẦU TT</th>
                        <th style={{ padding: "8px 10px", fontWeight: 700, textAlign: "center" }}>NGUỒN LỰC FPT</th>
                        <th style={{ padding: "8px 10px", fontWeight: 700, textAlign: "right" }}>ĐÁNH GIÁ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Thiết kế Vi mạch", demand: "↑", demandColor: "#16A34A", resource: "Cao", evaluation: "Khả thi Cao", evalBg: "#DCFCE7", evalColor: "#16A34A" },
                        { name: "Kinh tế Tuần hoàn", demand: "→", demandColor: "#D97706", resource: "Trung bình", evaluation: "Cần theo dõi", evalBg: "#FEF3C7", evalColor: "#D97706" },
                        { name: "Nghệ thuật Game", demand: "↑", demandColor: "#16A34A", resource: "Tốt", evaluation: "Khả thi Cao", evalBg: "#DCFCE7", evalColor: "#16A34A" },
                      ].map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "10px", fontWeight: 800, color: "#0F172A" }}>{item.name}</td>
                          <td style={{ padding: "10px", textAlign: "center", fontWeight: 900, fontSize: 14, color: item.demandColor }}>{item.demand}</td>
                          <td style={{ padding: "10px", textAlign: "center", color: "#64748B" }}>{item.resource}</td>
                          <td style={{ padding: "10px", textAlign: "right" }}>
                            <span style={{ padding: "3px 8px", borderRadius: 4, fontSize: 10.5, fontWeight: 800, background: item.evalBg, color: item.evalColor }}>
                              {item.evaluation}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 5: TỔNG QUAN CHIẾN LƯỢC TOÀN KHỐI (GOVERNANCE STRATEGIC)
             ========================================================================= */}
          {activeTab === "gov_strategic" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                  Tổng quan Chiến lược Toàn khối
                </h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                  Bảng điều khiển dành cho Ban Giám Hiệu - Cập nhật số liệu thời gian thực từ 5 Phân hiệu.
                </p>
              </div>

              {/* 4 Thẻ KPI chính */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                {[
                  { title: "Tổng Tuyển sinh", value: "145,200", change: "+12.5% so với năm trước", isPositive: true, icon: Users, iconColor: "#2563EB" },
                  { title: "Doanh thu / Ngân sách", value: "94.2%", progress: 94.2, goal: "Mục tiêu: 100%", icon: CreditCard, iconColor: "#DC2626" },
                  { title: "Tỷ lệ Đạt (Học thuật)", value: "88.5%", note: "Ổn định", icon: GraduationCap, iconColor: "#2563EB" },
                  { title: "Độ hài lòng Sinh viên", value: "4.6/5", change: "+0.2 điểm", isPositive: true, icon: Smile, iconColor: "#0284C7" },
                ].map((kpi, idx) => (
                  <div key={idx} style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#475569" }}>{kpi.title}</span>
                      <kpi.icon size={17} color={kpi.iconColor} />
                    </div>

                    <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px", marginBottom: 6 }}>
                      {kpi.value}
                    </div>

                    {kpi.change && (
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#16A34A" }}>
                        ↑ {kpi.change}
                      </div>
                    )}

                    {kpi.progress && (
                      <div>
                        <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#E2E8F0", overflow: "hidden", marginTop: 4 }}>
                          <div style={{ width: `${kpi.progress}%`, height: "100%", background: "#EA580C" }} />
                        </div>
                        <div style={{ textAlign: "right", fontSize: 10.5, color: "#64748B", marginTop: 4 }}>{kpi.goal}</div>
                      </div>
                    )}

                    {kpi.note && (
                      <div style={{ fontSize: 11.5, color: "#D97706", fontWeight: 700 }}>
                        — {kpi.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Hàng 2: Theo dõi KPI Phòng ban + Bản đồ Hoạt động Cơ sở */}
              <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.1fr", gap: 18 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 900, color: "#0F172A", marginBottom: 16 }}>
                    <TrendingUp size={16} color="#0F172A" /> Theo dõi KPI Phòng ban
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { name: "Tuyển sinh (Admissions)", percent: 102, color: "#10B981" },
                      { name: "Tài chính (Finance)", percent: 94, color: "#EA580C" },
                      { name: "Đào tạo (Academic Affairs)", percent: 88, color: "#F59E0B" },
                    ].map((dep, idx) => (
                      <div key={idx}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>{dep.name}</span>
                          <strong style={{ fontSize: 12.5, color: "#0F172A" }}>{dep.percent}%</strong>
                        </div>
                        <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#E2E8F0", overflow: "hidden" }}>
                          <div style={{ width: `${Math.min(dep.percent, 100)}%`, height: "100%", background: dep.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "#F1F5F9", borderRadius: 12, border: "1px solid #E2E8F0", padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                  <div style={{ width: 50, height: 50, borderRadius: "50%", background: "#FFFFFF", color: "#9A3412", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                    <Map size={24} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: "0 0 14px" }}>
                    Bản đồ Hoạt động 5 Cơ sở
                  </h3>
                  <button
                    onClick={() => setShowCampusMapModal(true)}
                    style={{ padding: "8px 20px", borderRadius: 6, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                  >
                    Xem chi tiết mạng lưới
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 6: CẢNH BÁO RỦI RO SỚM & KIỂM SOÁT CHỈ TIÊU NĂM (GOVERNANCE RISK)
             ========================================================================= */}
          {activeTab === "gov_risk" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                    Cảnh báo Rủi ro Sớm & Kiểm soát Chỉ tiêu Năm
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Giám sát rủi ro hồ sơ ảo, tỷ lệ bỏ học, ngân sách và tiến độ chỉ tiêu tuyển sinh toàn hệ thống
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleExportComprehensiveReport}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, border: "1px solid #1D4ED8", background: "#FFFFFF", color: "#1D4ED8", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    <Download size={14} /> Xuất báo cáo
                  </button>
                  <button
                    onClick={() => showToast("Đã kích hoạt cảnh báo rủi ro toàn hệ thống!")}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 6, background: "#EA580C", color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
                  >
                    <Bell size={14} /> Thiết lập cảnh báo
                  </button>
                </div>
              </div>

              {/* Cảnh báo sớm + Dashboard chỉ tiêu */}
              <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.6fr", gap: 18, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 800, color: "#0F172A" }}>
                      <div style={{ color: "#DC2626" }}><AlertTriangle size={16} /></div>
                      Cảnh báo sớm
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#DC2626", background: "#FEE2E2", padding: "2px 8px", borderRadius: 4 }}>
                      3 Mới
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ padding: "10px 12px", background: "#FFF1F2", borderRadius: 8, borderLeft: "4px solid #DC2626" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 3 }}>
                        <strong style={{ color: "#DC2626" }}>📈 Mức cao</strong>
                        <span style={{ color: "#94A3B8", fontSize: 10.5 }}>10 phút trước</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#475569", margin: "0 0 6px", lineHeight: 1.4 }}>
                        Tỷ lệ hồ sơ ảo tại khu vực Miền Tây tăng 15% so với cùng kỳ.
                      </p>
                      <div style={{ display: "flex", gap: 12, fontSize: 11, fontWeight: 700 }}>
                        <span onClick={() => showToast("Đang mở chi tiết phân tích hồ sơ ảo Miền Tây")} style={{ color: "#9A3412", cursor: "pointer" }}>Chi tiết</span>
                        <span onClick={() => showToast("Đã gửi chỉ thị tới Giám đốc Tuyển sinh")} style={{ color: "#2563EB", cursor: "pointer" }}>Gửi GĐ Tuyển sinh</span>
                      </div>
                    </div>

                    <div style={{ padding: "10px 12px", background: "#FFFBEB", borderRadius: 8, borderLeft: "4px solid #D97706" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 3 }}>
                        <strong style={{ color: "#D97706" }}>— Mức trung bình</strong>
                        <span style={{ color: "#94A3B8", fontSize: 10.5 }}>1 giờ trước</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#475569", margin: "0 0 6px", lineHeight: 1.4 }}>
                        Ngân sách marketing ngành CNTT đạt ngưỡng 90% ngân sách quý.
                      </p>
                      <span onClick={() => showToast("Đang phân tích cấu trúc chi phí marketing ngành CNTT")} style={{ fontSize: 11, fontWeight: 700, color: "#9A3412", cursor: "pointer" }}>Phân tích</span>
                    </div>

                    <div style={{ padding: "10px 12px", background: "#F0FDF4", borderRadius: 8, borderLeft: "4px solid #2563EB" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, marginBottom: 3 }}>
                        <strong style={{ color: "#2563EB" }}>⏱ Mức thấp</strong>
                        <span style={{ color: "#94A3B8", fontSize: 10.5 }}>3 giờ trước</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#475569", margin: 0, lineHeight: 1.4 }}>
                        Tỷ lệ sinh viên vắng mặt môn Nhập môn lập trình tăng nhẹ 2%.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast("Toàn bộ 24 cảnh báo đã được lưu trữ tại Risk Center")}
                    style={{ width: "100%", padding: "8px", marginTop: 12, borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12, fontWeight: 700, color: "#475569", cursor: "pointer" }}
                  >
                    Xem tất cả cảnh báo
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    <div style={{ background: "#FFFFFF", borderRadius: 10, border: "1px solid #E2E8F0", padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#DC2626" }}>
                        <AlertCircle size={14} /> Rủi ro Cao
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 28, fontWeight: 900, color: "#DC2626" }}>4</span>
                        <span style={{ fontSize: 11.5, color: "#64748B" }}>hạng mục</span>
                      </div>
                    </div>

                    <div style={{ background: "#FFFFFF", borderRadius: 10, border: "1px solid #E2E8F0", padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#D97706" }}>
                        <AlertTriangle size={14} /> Rủi ro TB
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 28, fontWeight: 900, color: "#D97706" }}>12</span>
                        <span style={{ fontSize: 11.5, color: "#64748B" }}>hạng mục</span>
                      </div>
                    </div>

                    <div style={{ background: "#FFFFFF", borderRadius: 10, border: "1px solid #E2E8F0", padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "#16A34A" }}>
                        <CheckCircle size={14} /> Kiểm soát Tốt
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
                        <span style={{ fontSize: 28, fontWeight: 900, color: "#16A34A" }}>48</span>
                        <span style={{ fontSize: 11.5, color: "#64748B" }}>hạng mục</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <strong style={{ fontSize: 14, color: "#0F172A" }}>Dashboard Kiểm soát Chỉ tiêu Năm</strong>
                      <span style={{ fontSize: 11, color: "#64748B" }}>Năm học 2023-2024</span>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 3 }}>
                        <span style={{ color: "#334155" }}>👥 Tuyển sinh hệ Đại học</span>
                        <div>
                          <span style={{ color: "#64748B" }}>12,450 / 15,000 </span>
                          <span style={{ color: "#EA580C", fontWeight: 800 }}>Chậm tiến độ 5%</span>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                        <div style={{ width: "83%", height: "100%", background: "#EA580C" }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 3 }}>
                        <span style={{ color: "#334155" }}>💵 Thu học phí Kỳ Fall</span>
                        <div>
                          <span style={{ color: "#64748B" }}>95.2% </span>
                          <span style={{ color: "#16A34A", fontWeight: 800 }}>Đạt mục tiêu</span>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                        <div style={{ width: "95%", height: "100%", background: "#10B981" }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 3 }}>
                        <span style={{ color: "#334155" }}>🎓 Tỷ lệ SV duy trì (Retention Rate)</span>
                        <div>
                          <span style={{ color: "#64748B" }}>88.5% / 92% </span>
                          <span style={{ color: "#DC2626", fontWeight: 800 }}>Cảnh báo</span>
                        </div>
                      </div>
                      <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                        <div style={{ width: "88%", height: "100%", background: "#DC2626" }} />
                      </div>
                    </div>

                    <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #F1F5F9" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748B", marginBottom: 8 }}>CÔNG CỤ ĐIỀU HÀNH NHANH</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                        {[
                          { icon: MessageSquare, label: "Yêu cầu BC Tuyển sinh" },
                          { icon: Mail, label: "Gửi thông báo Tài chính" },
                          { icon: Calendar, label: "Lên lịch họp BGH" },
                          { icon: FileText, label: "Điều chỉnh Chỉ tiêu" },
                        ].map((btn, idx) => (
                          <button
                            key={idx}
                            onClick={() => showToast(`Đã kích hoạt hành động: "${btn.label}"`)}
                            style={{
                              padding: "10px 6px", borderRadius: 8, border: "1px solid #E2E8F0",
                              background: "#F8FAFC", display: "flex", flexDirection: "column",
                              alignItems: "center", gap: 6, cursor: "pointer", fontSize: 11,
                              fontWeight: 700, color: "#334155"
                            }}
                          >
                            <btn.icon size={15} />
                            <span style={{ textAlign: "center", lineHeight: 1.2 }}>{btn.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ma trận Rủi ro */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <strong style={{ fontSize: 15, color: "#0F172A" }}>Ma trận Rủi ro chi tiết</strong>
                  <button style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}>
                    <Filter size={15} />
                  </button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>PHÂN LOẠI</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>HẠNG MỤC RỦI RO</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>MỨC ĐỘ</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>PHÒNG BAN PHỤ TRÁCH</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: "Tuyển sinh", typeBg: "#FFEDD5", typeColor: "#C2410C", risk: "Tỷ lệ hồ sơ ảo khu vực Miền Tây", level: "● Cao", levelColor: "#DC2626", levelBg: "#FEE2E2", dept: "Ban Tuyển sinh" },
                      { type: "Tài chính", typeBg: "#DCFCE7", typeColor: "#16A34A", risk: "Ngân sách Marketing ngành CNTT", level: "● Trung bình", levelColor: "#D97706", levelBg: "#FEF3C7", dept: "Ban Tài chính & MKT" },
                      { type: "Đào tạo", typeBg: "#E0F2FE", typeColor: "#0284C7", risk: "Tỷ lệ vắng mặt môn NMLT", level: "● Thấp", levelColor: "#2563EB", levelBg: "#DBEAFE", dept: "Ban Đào tạo" },
                    ].map((r, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px" }}>
                          <span style={{ padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700, background: r.typeBg, color: r.typeColor }}>
                            {r.type}
                          </span>
                        </td>
                        <td style={{ padding: "12px", fontWeight: 700, color: "#0F172A" }}>{r.risk}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ padding: "3px 8px", borderRadius: 100, fontSize: 11, fontWeight: 800, background: r.levelBg, color: r.levelColor }}>
                            {r.level}
                          </span>
                        </td>
                        <td style={{ padding: "12px", color: "#475569" }}>{r.dept}</td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <button
                            onClick={() => showToast(`Xem chi tiết rủi ro: ${r.risk}`)}
                            style={{ border: "none", background: "transparent", color: "#2563EB", cursor: "pointer", fontWeight: 700 }}
                          >
                            <ChevronRight size={16} />
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
              MÀN HÌNH 7: SLA & ĐIỀU PHỐI HOẠT ĐỘNG LIÊN PHÒNG BAN (GOVERNANCE SLA)
             ========================================================================= */}
          {activeTab === "gov_crossdept" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                    Giám sát Hoạt động & SLA Liên Phòng ban
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Theo dõi tiến độ phối hợp giữa Phòng Tuyển sinh, Đào tạo, Tài chính và Công tác Sinh viên (CTSV)
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                    <Calendar size={14} /> Tháng này
                  </button>
                  <button onClick={handleExportComprehensiveReport} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, background: "#9A3412", color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                    <Download size={14} /> Xuất Báo cáo
                  </button>
                </div>
              </div>

              {/* 4 Thẻ Chỉ số Vận hành */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                {[
                  { title: "Chỉ số SLA Toàn khối", value: "94.2%", change: "+1.2% vs tháng trước", isPositive: true, icon: Clock, iconColor: "#EA580C", iconBg: "#FFEDD5" },
                  { title: "Yêu cầu Tồn đọng", value: "128", change: "+15 vs tuần trước", isNegative: true, icon: AlertTriangle, iconColor: "#D97706", iconBg: "#FEF3C7" },
                  { title: "Tỷ lệ Sử dụng Phòng", value: "87%", note: "Tối ưu hóa mức cao", progress: 87, icon: Building, iconColor: "#2563EB", iconBg: "#DBEAFE" },
                  { title: "Cảnh báo Trầm trọng", value: "3", note: "Liên quan đến Xếp thời khóa biểu", icon: ShieldAlert, iconColor: "#DC2626", iconBg: "#FEE2E2", isAlert: true },
                ].map((kpi, idx) => (
                  <div key={idx} style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#475569" }}>{kpi.title}</span>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: kpi.iconBg, color: kpi.iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <kpi.icon size={15} />
                      </div>
                    </div>

                    <div style={{ fontSize: 30, fontWeight: 900, color: kpi.isAlert ? "#DC2626" : "#0F172A", letterSpacing: "-0.5px", marginBottom: 4 }}>
                      {kpi.value}
                    </div>

                    {kpi.change && (
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: kpi.isNegative ? "#DC2626" : "#16A34A" }}>
                        ↑ {kpi.change}
                      </div>
                    )}

                    {kpi.progress && (
                      <div>
                        <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#E2E8F0", overflow: "hidden", marginTop: 4 }}>
                          <div style={{ width: `${kpi.progress}%`, height: "100%", background: "#9A3412" }} />
                        </div>
                        <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 3 }}>{kpi.note}</div>
                      </div>
                    )}

                    {kpi.isAlert && (
                      <div style={{ fontSize: 11, color: "#64748B" }}>
                        {kpi.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bảng Chi tiết Hiệu suất từng Phòng ban */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: "0 0 14px" }}>
                  Bảng Điều Phối & Xử Lý Yêu Cầu Liên Phòng Ban
                </h3>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>PHÒNG BAN</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>TỔNG YÊU CẦU</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>ĐÃ XỬ LÝ</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>TỒN ĐỌNG</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "center" }}>TỶ LỆ SLA</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Phòng Tuyển sinh", total: 4250, done: 4180, pending: 70, sla: "98.3%", slaColor: "#16A34A" },
                      { name: "Phòng Quản lý Đào tạo", total: 3100, done: 2820, pending: 280, sla: "90.9%", slaColor: "#D97706" },
                      { name: "Phòng Kế toán Tài chính", total: 1890, done: 1845, pending: 45, sla: "97.6%", slaColor: "#16A34A" },
                      { name: "Phòng Công tác Sinh viên (CTSV)", total: 2450, done: 2310, pending: 140, sla: "94.2%", slaColor: "#16A34A" },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px", fontWeight: 700, color: "#0F172A" }}>{row.name}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#475569" }}>{row.total.toLocaleString()}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#16A34A", fontWeight: 700 }}>{row.done.toLocaleString()}</td>
                        <td style={{ padding: "12px", textAlign: "center", color: "#DC2626", fontWeight: 700 }}>{row.pending}</td>
                        <td style={{ padding: "12px", textAlign: "center", fontWeight: 800, color: row.slaColor }}>{row.sla}</td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <button onClick={() => showToast(`Gửi thông báo đốc thúc tới Trưởng ${row.name}`)} style={{ padding: "4px 10px", borderRadius: 5, background: "#F1F5F9", color: "#0F172A", border: "1px solid #CBD5E1", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>
                            Đốc thúc
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
              MÀN HÌNH 8: KẾ HOẠCH TÀI CHÍNH DÀI HẠN & ĐẦU TƯ (GOVERNANCE FINANCE)
             ========================================================================= */}
          {activeTab === "gov_finance" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                    Kế hoạch Phát triển Chiến lược & Tài chính Dài hạn
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Theo dõi tiến độ giải ngân đầu tư hạ tầng các cơ sở và kiểm soát rủi ro tài khóa
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleExportComprehensiveReport} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                    <Download size={14} /> Xuất file
                  </button>
                  <button onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
                    <Printer size={14} /> In báo cáo
                  </button>
                </div>
              </div>

              {/* 3 Thẻ Chỉ số */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1fr", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#475569" }}>Tăng trưởng Doanh thu</span>
                    <TrendingUp size={16} color="#16A34A" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.5px" }}>
                    1.2B <span style={{ fontSize: 22, fontWeight: 700, textDecoration: "underline" }}>đ</span>
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#16A34A", marginTop: 3 }}>
                    +15.4% YoY <span style={{ color: "#64748B", fontWeight: 500 }}>vs Mục tiêu Q3</span>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#475569" }}>Tổng Đầu tư Hạ tầng</span>
                    <Building size={16} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#2563EB", letterSpacing: "-0.5px" }}>
                    450M <span style={{ fontSize: 22, fontWeight: 700, textDecoration: "underline" }}>đ</span>
                  </div>
                  <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#0F172A", overflow: "hidden" }}>
                    <div style={{ width: "65%", height: "100%", background: "#EA580C" }} />
                  </div>
                  <div style={{ textAlign: "right", fontSize: 10.5, color: "#64748B", marginTop: 3 }}>65% Giải ngân</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#475569" }}>Chỉ số Rủi ro Tổng thể</span>
                    <AlertTriangle size={16} color="#D97706" />
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.4px" }}>
                    Trung bình
                  </div>
                  <div style={{ fontSize: 11.5, color: "#D97706", fontWeight: 700, marginTop: 3 }}>
                    3 Cảnh báo Mới <span style={{ color: "#64748B", fontWeight: 500 }}>• Tháng 9/2023</span>
                  </div>
                </div>
              </div>

              {/* Xu hướng 5 Năm + Mục tiêu vs Thực tế */}
              <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                      Phân tích Xu hướng Dài hạn (5 Năm)
                    </h3>
                    <select style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 11.5, background: "#FFFFFF" }}>
                      <option>Doanh thu & Chi phí</option>
                      <option>Tăng trưởng Học phí</option>
                    </select>
                  </div>

                  <div style={{ width: "100%", height: 190 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { year: "2020", value: 380, fill: "#BFDBFE" },
                        { year: "2021", value: 540, fill: "#93C5FD" },
                        { year: "2022", value: 720, fill: "#60A5FA" },
                        { year: "2023", value: 960, fill: "#D97706" },
                        { year: "2024 (KH)", value: 1200, fill: "#9A3412" },
                      ]} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="year" fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <Tooltip />
                        <ReferenceLine y={1000} stroke="#10B981" strokeDasharray="3 3" />
                        <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                          {[
                            { fill: "#BFDBFE" },
                            { fill: "#93C5FD" },
                            { fill: "#60A5FA" },
                            { fill: "#D97706" },
                            { fill: "#9A3412" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", marginBottom: 14 }}>
                    Mục tiêu vs Thực tế
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>
                        <span>Mở rộng Campus Mới (Q4)</span>
                        <strong style={{ color: "#10B981" }}>82%</strong>
                      </div>
                      <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#0F172A", overflow: "hidden" }}>
                        <div style={{ width: "82%", height: "100%", background: "#10B981" }} />
                      </div>
                      <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 3 }}>Đúng tiến độ</div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>
                        <span>Tuyển sinh Sau Đại học</span>
                        <strong style={{ color: "#F59E0B" }}>45%</strong>
                      </div>
                      <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#0F172A", overflow: "hidden" }}>
                        <div style={{ width: "45%", height: "100%", background: "#F59E0B" }} />
                      </div>
                      <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 3 }}>Chậm so với kế hoạch (Mục tiêu: 60%)</div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 3 }}>
                        <span>Trang thiết bị Lab AI</span>
                        <strong style={{ color: "#EA580C" }}>95%</strong>
                      </div>
                      <div style={{ width: "100%", height: 6, borderRadius: 3, background: "#0F172A", overflow: "hidden" }}>
                        <div style={{ width: "95%", height: "100%", background: "#9A3412" }} />
                      </div>
                      <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 3 }}>Sắp hoàn thành</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Đầu tư trọng điểm & Rủi ro Ký Quỹ */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 900, color: "#0F172A", marginBottom: 14 }}>
                    <CreditCard size={15} color="#2563EB" /> Theo dõi Đầu tư Trọng điểm
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                        <th style={{ padding: "8px 10px", fontWeight: 700 }}>Dự án</th>
                        <th style={{ padding: "8px 10px", fontWeight: 700, textAlign: "center" }}>Ngân sách</th>
                        <th style={{ padding: "8px 10px", fontWeight: 700, textAlign: "center" }}>Đã chi</th>
                        <th style={{ padding: "8px 10px", fontWeight: 700, textAlign: "right" }}>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { project: "Campus Cần Thơ GĐ 2", budget: "200M", spent: "150M", status: "Đang triển khai", statusBg: "#DCFCE7", statusColor: "#16A34A" },
                        { project: "Nâng cấp HPC Lab", budget: "50M", spent: "48M", status: "Hoàn thành", statusBg: "#FFEDD5", statusColor: "#C2410C" },
                        { project: "Cơ sở vật chất KTX mới", budget: "120M", spent: "20M", status: "Khởi công", statusBg: "#FEF3C7", statusColor: "#D97706" },
                      ].map((inv, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "10px", fontWeight: 700, color: "#0F172A" }}>{inv.project}</td>
                          <td style={{ padding: "10px", textAlign: "center", color: "#64748B" }}>{inv.budget}</td>
                          <td style={{ padding: "10px", textAlign: "center", color: "#0F172A", fontWeight: 700 }}>{inv.spent}</td>
                          <td style={{ padding: "10px", textAlign: "right" }}>
                            <span style={{ padding: "2px 7px", borderRadius: 100, fontSize: 10.5, fontWeight: 700, color: inv.statusColor, background: inv.statusBg }}>
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 900, color: "#0F172A", marginBottom: 14 }}>
                    <ShieldAlert size={15} color="#DC2626" /> Cảnh báo Rủi ro Ký Quỹ
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ padding: "10px 12px", borderRadius: 8, background: "#FFF1F2", border: "1px solid #FFE4E6" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#DC2626", fontWeight: 800, fontSize: 12, marginBottom: 3 }}>
                        <TrendingDown size={14} /> Biến động Tỷ giá
                      </div>
                      <p style={{ fontSize: 11.5, color: "#475569", margin: "0 0 4px", lineHeight: 1.4 }}>
                        Ảnh hưởng đến chi phí nhập khẩu thiết bị Lab nước ngoài (+5% chi phí dự kiến).
                      </p>
                      <span onClick={() => showToast("Đã kích hoạt hợp đồng phòng ngừa rủi ro tỷ giá Forward Contract")} style={{ fontSize: 11, fontWeight: 700, color: "#9A3412", cursor: "pointer", textDecoration: "underline" }}>
                        Xem phương án phòng ngừa
                      </span>
                    </div>

                    <div style={{ padding: "10px 12px", borderRadius: 8, background: "#FFFBEB", border: "1px solid #FEF3C7" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#D97706", fontWeight: 800, fontSize: 12, marginBottom: 3 }}>
                        <Clock size={14} /> Chậm tiến độ Giấy phép
                      </div>
                      <p style={{ fontSize: 11.5, color: "#475569", margin: 0, lineHeight: 1.4 }}>
                        Dự án Tòa nhà Beta có nguy cơ chậm 2 tháng do thủ tục hành chính.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* =========================================================================
          MODALS BGH & DSS
         ========================================================================= */}
      {/* Modal: Chạy Mô Hình DSS Tuyển Sinh */}
      {showRunModelModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 520, background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 17, fontWeight: 900, color: "#0F172A" }}>
                <Bot size={20} color="#9A3412" /> Huấn Luyện & Chạy Mô Hình DSS Tuyển Sinh
              </div>
              <button onClick={() => setShowRunModelModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>THUẬT TOÁN HỖ TRỢ RA QUYẾT ĐỊNH</label>
                <select style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFF" }}>
                  <option>XGBoost Regression Model (Độ chính xác dự báo 94.2%)</option>
                  <option>Random Forest Ensemble (Phân tích đa biến số tuyển sinh)</option>
                  <option>Mô hình Tối ưu hóa Tuyến tính (Linear Programming Budget Allocation)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>KỲ DỰ BÁO MỤC TIÊU</label>
                <select style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, background: "#FFF" }}>
                  <option>Kỳ Thu 2024 (Thu 2026)</option>
                  <option>Kỳ Xuân 2025 (Xuan 2026)</option>
                  <option>Kỳ Thu 2025 (Thu 2026)</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button onClick={() => setShowRunModelModal(false)} style={{ padding: "10px", borderRadius: 8, background: "#F1F5F9", color: "#475569", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Hủy</button>
              <button
                onClick={() => {
                  setShowRunModelModal(false);
                  showToast("Mô hình DSS đã chạy xong và cập nhật dự báo 14,250 tân sinh viên!");
                }}
                style={{ padding: "10px", borderRadius: 8, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
              >
                Bắt Đầu Huấn Luyện
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Bản đồ Hoạt động 5 Cơ sở */}
      {showCampusMapModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 540, background: "#FFFFFF", borderRadius: 16, padding: "24px 26px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Mạng Lưới 5 Phân Hiệu FPT University
              </h3>
              <button onClick={() => setShowCampusMapModal(false)} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#94A3B8" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {[
                { name: "FPTU Hà Nội (Khu CNC Hòa Lạc)", students: "42,000 SV", status: "Hoạt động 100%" },
                { name: "FPTU TP.HCM (Khu CNC TP.Thủ Đức)", students: "38,500 SV", status: "Hoạt động 100%" },
                { name: "FPTU Đà Nẵng (Khu Đô thị FPT City)", students: "28,000 SV", status: "Hoạt động 98%" },
                { name: "FPTU Cần Thơ (An Bình, Ninh Kiều)", students: "22,500 SV", status: "Mở rộng GĐ 2" },
                { name: "FPTU Quy Nhơn (Trung tâm AI Quốc tế)", students: "14,200 SV", status: "Hoạt động 100%" },
              ].map((c, idx) => (
                <div key={idx} style={{ padding: "10px 14px", background: "#F8FAFC", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong style={{ fontSize: 13, color: "#0F172A" }}>{c.name}</strong>
                    <div style={{ fontSize: 11.5, color: "#64748B" }}>Quy mô: {c.students}</div>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#16A34A" }}>{c.status}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowCampusMapModal(false)} style={{ padding: "9px 20px", borderRadius: 8, background: "#0F172A", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
