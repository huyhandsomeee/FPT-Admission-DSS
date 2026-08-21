import { useState, useMemo, useEffect } from "react";
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
  ArrowRight, CornerDownRight, ListCheck, History, Send, Share2, Flame,
  TrendingUp as TrendingUpIcon, Award as AwardIcon, CheckSquare as CheckSquareIcon
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell, LineChart, Line, AreaChart, Area, ReferenceLine,
  PieChart as RechartsPieChart, Pie
} from "recharts";
import * as XLSX from "xlsx";

import { bodEngine } from "../../services/bodDecisionEngine";

export default function BODExecutivePortal() {
  const navigate = useNavigate();

  // Active Tab State:
  // ── NHÓM TRỌNG TÂM: TRUNG TÂM RA QUYẾT ĐỊNH & ĐIỀU HÀNH ──
  // 1. "decision_center": Trung tâm Quyết định & Phê duyệt Đề xuất (Decision Hub)
  // 2. "decision_history": Lịch sử Quyết định & Audit Trail
  //
  // ── NHÓM 1: HỆ THỐNG HỖ TRỢ RA QUYẾT ĐỊNH TUYỂN SINH (DSS CORE) ──
  // 3. "dss_forecast": Dự báo & Mô phỏng Kịch bản Ngân sách (What-If Simulation)
  // 4. "dss_funnel": Phân tích Phễu Tuyển sinh & Khuyến nghị AI
  // 5. "dss_marketing": Hiệu quả Marketing, Phân bổ Kênh & Bản đồ nhiệt
  // 6. "dss_trends": Xu hướng Khối ngành & Chiến lược Mở ngành mới
  //
  // ── NHÓM 2: GIÁM SÁT CHIẾN LƯỢC & VẬN HÀNH TOÀN KHỐI (GOVERNANCE & RISK) ──
  // 7. "gov_strategic": Tổng quan Chiến lược & KPI 5 Phân hiệu
  // 8. "gov_risk": Cảnh báo Rủi ro Sớm & Kiểm soát Chỉ tiêu Năm (Risk Center)
  // 9. "gov_crossdept": Giám sát Hoạt động & SLA Liên Phòng ban
  // 10. "gov_finance": Kế hoạch Tài chính Dài hạn & Đầu tư Hạ tầng
  const [activeTab, setActiveTab] = useState("gov_strategic");

  // Global Engine State
  const [proposals, setProposals] = useState(() => bodEngine.getProposals());
  const [tasks, setTasks] = useState(() => bodEngine.getTasks());
  const [risks, setRisks] = useState(() => bodEngine.getRisks());
  const [notifications, setNotifications] = useState(() => bodEngine.getNotifications());
  const [auditLogs, setAuditLogs] = useState(() => bodEngine.getAuditLogs());
  const departmentSLAs = useMemo(() => bodEngine.getDepartmentSLAs(), []);

  // Global Filters
  const [selectedSemester, setSelectedSemester] = useState("Thu 2026");
  const [selectedCampus, setSelectedCampus] = useState("all");
  const [proposalCategoryFilter, setProposalCategoryFilter] = useState("all");

  // What-If Simulation State
  const [tuitionIncrease, setTuitionIncrease] = useState(5); // 0% - 15%
  const [scholarshipRate, setScholarshipRate] = useState(12); // 5% - 25%
  const [marketingBudgetMode, setMarketingBudgetMode] = useState("attack"); // attack, normal, saving

  // Interactive Modals & Drawers
  const [selectedProposalForApproval, setSelectedProposalForApproval] = useState(null);
  const [approvalComment, setApprovalComment] = useState("");
  const [isConditionalApproval, setIsConditionalApproval] = useState(false);
  const [conditionalParams, setConditionalParams] = useState({
    conditions: "Duy trì CPA dưới 450k/lead và nghiệm thu theo tuần",
    deadline: "2026-08-25",
    maxBudget: "8.8 Tỷ VND",
    kpiCommitment: "+150 SV nhập học"
  });

  const [selectedKPIDetail, setSelectedKPIDetail] = useState(null);
  const [selectedRiskForAction, setSelectedRiskForAction] = useState(null);
  const [riskActionPlan, setRiskActionPlan] = useState("");
  const [riskAssignedDept, setRiskAssignedDept] = useState("");
  const [riskAssignee, setRiskAssignee] = useState("");
  const [riskDeadline, setRiskDeadline] = useState("2026-08-23 17:00");

  const [selectedDepartmentDetail, setSelectedDepartmentDetail] = useState(null);
  const [selectedDecisionForHistory, setSelectedDecisionForHistory] = useState(null);
  const [showNewMajorModal, setShowNewMajorModal] = useState(false);
  const [newMajorForm, setNewMajorForm] = useState({
    name: "Kỹ thuật Thiết kế Vi mạch Bán dẫn (Semiconductor & IC Design)",
    code: "7480201SC",
    faculty: "Khoa Công nghệ Thông tin & Điện tử",
    firstYearQuota: 350,
    capex: "15.0 Tỷ VND",
    opexYear: "5.5 Tỷ VND/năm",
    breakEven: "2.5 Năm",
    facultyCount: "4 Tiến sĩ & 6 Thạc sĩ Vi mạch",
    expectedTuition: "38 Triệu/học kỳ",
    strategicPartner: "FPT Semiconductor & Viện Nghiên cứu Bán dẫn Quốc tế"
  });

  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync state helper
  const reloadEngineData = () => {
    setProposals(bodEngine.getProposals());
    setTasks(bodEngine.getTasks());
    setRisks(bodEngine.getRisks());
    setNotifications(bodEngine.getNotifications());
    setAuditLogs(bodEngine.getAuditLogs());
  };

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Unread notification count
  const unreadNotifsCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Pending Proposals count for BOD
  const pendingProposalsCount = useMemo(() => {
    return proposals.filter(p => p.status === "WAITING_APPROVAL" || p.status === "UNDER_REVIEW").length;
  }, [proposals]);

  const highRisksCount = useMemo(() => {
    return risks.filter(r => (r.severity === "HIGH" || r.severity === "CRITICAL") && r.status !== "CLOSED").length;
  }, [risks]);

  const overdueTasksCount = useMemo(() => {
    return tasks.filter(t => t.isOverdue && t.status !== "COMPLETED").length;
  }, [tasks]);

  // What-If Dynamic Calculation
  const simulatedForecastData = useMemo(() => {
    const factor = 1 + (tuitionIncrease - 5) * 0.03 - (scholarshipRate - 12) * 0.02 + (marketingBudgetMode === "attack" ? 0.1 : marketingBudgetMode === "saving" ? -0.08 : 0);
    return [
      { quarter: "Q1", base: 450, sim: Math.round(460 * factor) },
      { quarter: "Q2", base: 820, sim: Math.round(890 * factor) },
      { quarter: "Q3", base: 1650, sim: Math.round(1820 * factor) },
      { quarter: "Q4", base: 2200, sim: Math.round(2450 * factor) },
    ];
  }, [tuitionIncrease, scholarshipRate, marketingBudgetMode]);

  // Handle Approve Action
  const handleApproveProposal = (proposal) => {
    const res = bodEngine.approveProposal(
      proposal.id,
      approvalComment,
      isConditionalApproval,
      isConditionalApproval ? conditionalParams : null
    );
    if (res.success) {
      showToast(`✓ Đã phê duyệt Quyết định ${res.decisionId}. Tự động tạo ${res.tasksGenerated} nhiệm vụ liên phòng ban!`);
      setSelectedProposalForApproval(null);
      setApprovalComment("");
      setIsConditionalApproval(false);
      reloadEngineData();
    } else {
      showToast(res.message, "error");
    }
  };

  // Handle Reject Action
  const handleRejectProposal = (proposal) => {
    const res = bodEngine.rejectProposal(proposal.id, approvalComment || "Chưa phù hợp với định hướng tài chính.");
    if (res.success) {
      showToast("✕ Đã từ chối đề xuất và thông báo cho phòng ban.", "info");
      setSelectedProposalForApproval(null);
      setApprovalComment("");
      reloadEngineData();
    }
  };

  // Handle Request More Info
  const handleRequestMoreInfo = (proposal) => {
    const res = bodEngine.requestMoreInfo(proposal.id, approvalComment || "Yêu cầu làm rõ ROI và cam kết số lượng sinh viên.");
    if (res.success) {
      showToast("⚠ Đã gửi yêu cầu bổ sung thông tin tới phòng ban.", "info");
      setSelectedProposalForApproval(null);
      setApprovalComment("");
      reloadEngineData();
    }
  };

  // Handle Create Proposal from What-If Simulation
  const handleCreateProposalFromWhatIf = () => {
    const res = bodEngine.createProposalFromWhatIf({
      tuitionIncrease,
      scholarshipRate,
      marketingBudgetMode
    });
    if (res.success) {
      showToast(`✓ Đã tạo đề xuất quyết định ${res.proposalId} từ mô phỏng DSS!`);
      reloadEngineData();
      setActiveTab("decision_center");
    }
  };

  // Handle Risk -> Action Workflow
  const handleCreateActionFromRisk = () => {
    if (!selectedRiskForAction) return;
    const res = bodEngine.createActionFromRisk(
      selectedRiskForAction.id,
      riskActionPlan,
      riskAssignedDept || selectedRiskForAction.department,
      riskAssignee || selectedRiskForAction.owner,
      riskDeadline
    );
    if (res.success) {
      showToast(`✓ ${res.message}`);
      setSelectedRiskForAction(null);
      setRiskActionPlan("");
      reloadEngineData();
    }
  };

  // Handle Mitigate Risk
  const handleMitigateRisk = (riskId) => {
    const res = bodEngine.mitigateRisk(riskId, "Đã hoàn thành các biện pháp kiểm soát và giảm thiểu rủi ro.");
    if (res.success) {
      showToast(`✓ ${res.message}`);
      reloadEngineData();
    }
  };

  // Handle Urge Department
  const handleUrgeDepartment = (deptId) => {
    const res = bodEngine.urgeDepartment(deptId, "BOD yêu cầu xử lý dứt điểm các hồ sơ tồn đọng trong 24h.");
    if (res.success) {
      showToast(`✓ ${res.message}`);
      reloadEngineData();
    }
  };

  // Handle New Major Submission
  const handleApproveNewMajor = () => {
    const propId = `PROP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const decId = `DEC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    bodEngine.proposals.unshift({
      id: propId,
      decisionId: decId,
      title: `Phê duyệt mở mới chuyên ngành: ${newMajorForm.name}`,
      department: newMajorForm.faculty,
      proposedBy: "Hội đồng Khoa học & Đào tạo",
      category: "Mở ngành mới",
      priority: "HIGH",
      currentBudget: 0,
      proposedBudget: 15000000000,
      budgetDelta: 15000000000,
      currency: "VND",
      deadline: "2026-08-30",
      urgency: "Tháng này",
      status: "APPROVED",
      reason: `Chiến lược đào tạo ${newMajorForm.firstYearQuota} kỹ sư vi mạch bán dẫn K21. Hợp tác với ${newMajorForm.strategicPartner}.`,
      impacts: {
        leads: "+3,500 leads",
        applicants: "+600 hồ sơ",
        enrollment: `${newMajorForm.firstYearQuota} SV K21`,
        revenue: "+22 Tỷ VND/năm",
        roi: "2.8x (Hòa vốn 2.5 năm)",
        riskLevel: "Medium"
      },
      decisionScore: { strategic: 10, financial: 8, enrollment: 9, risk: 4, urgency: 8, overall: 8.8, aiConfidence: 92 },
      aiRecommendation: { status: "APPROVED", headline: "ĐÃ PHÊ DUYỆT MỞ NGÀNH BÁN DẪN" },
      createdDate: new Date().toLocaleString("vi-VN"),
      workflowTasks: []
    });
    reloadEngineData();
    setShowNewMajorModal(false);
    showToast(`✓ Đã phê duyệt đề xuất mở ngành ${newMajorForm.name} (Quyết định ${decId})!`);
  };

  // Export Comprehensive Excel Report
  const handleExportComprehensiveReport = () => {
    const wsData = [
      ["CỔNG DỮ LIỆU ĐẠI HỌC FPT - TRUNG TÂM RA QUYẾT ĐỊNH & ĐIỀU HÀNH BAN GIÁM HIỆU (BOD)"],
      ["BÁO CÁO CHIẾN LƯỢC TOÀN DIỆN & DANH MỤC QUYẾT ĐỊNH"],
      ["Thời gian xuất:", new Date().toLocaleString("vi-VN")],
      ["Kỳ tuyển sinh mục tiêu:", selectedSemester],
      ["Người phê duyệt:", "Hội đồng Tuyển sinh & Ban Giám Hiệu FPT University"],
      [],
      ["═══════════════════════════════════════════════════════════════════"],
      ["1. DANH SÁCH QUYẾT ĐỊNH ĐÃ PHÊ DUYỆT (DECISIONS IN PROGRESS)"],
      ["═══════════════════════════════════════════════════════════════════"],
      ["Mã Quyết Định", "Tên Đề Xuất", "Phòng Ban", "Ngân Sách (VND)", "Trạng Thái", "Điểm Đánh Giá", "SLA Tasks"],
      ...proposals.map(p => [
        p.decisionId,
        p.title,
        p.department,
        p.proposedBudget ? (p.proposedBudget / 1e9).toFixed(2) + " Tỷ" : "0",
        p.status,
        p.decisionScore ? `${p.decisionScore.overall}/10` : "N/A",
        p.workflowTasks ? `${p.workflowTasks.length} nhiệm vụ` : "0"
      ]),
      [],
      ["═══════════════════════════════════════════════════════════════════"],
      ["2. DANH MỤC RỦI RO & TIẾN ĐỘ XỬ LÝ (RISK MATRIX)"],
      ["═══════════════════════════════════════════════════════════════════"],
      ["Mã Rủi Ro", "Tên Rủi Ro", "Mức Độ", "Xác Suất", "Tác Động Tài Chính", "Phòng Ban Chịu Trách Nhiệm", "Trạng Thái"],
      ...risks.map(r => [
        r.id,
        r.title,
        r.severity,
        `${r.probability}%`,
        r.financialImpact,
        r.department,
        r.status
      ]),
      [],
      ["═══════════════════════════════════════════════════════════════════"],
      ["3. HIỆU SUẤT & SLA LIÊN PHÒNG BAN"],
      ["═══════════════════════════════════════════════════════════════════"],
      ["Phòng Ban", "Tổng Yêu Cầu", "Đã Xử Lý", "Tồn Đọng", "Quá Hạn", "Tỷ Lệ SLA", "Điểm Nghẽn Chính"],
      ...departmentSLAs.map(d => [
        d.name,
        d.totalRequests,
        d.processed,
        d.pending,
        d.overdue,
        `${d.slaRate}%`,
        d.topBottleneck
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BOD_Decisions_Operations");
    XLSX.writeFile(wb, `BOD_Decision_Operations_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Đã xuất báo cáo chiến lược điều hành & quyết định BOD thành công (Excel)!");
  };

  // Navigation Groups in Sidebar
  const navigationGroups = [
    {
      groupTitle: "TRUNG TÂM ĐIỀU HÀNH & QUYẾT ĐỊNH",
      items: [
        { id: "decision_center", icon: Zap, label: "Trung tâm Quyết định", desc: "8 Đề xuất chờ duyệt & Workflow liên phòng ban", badge: pendingProposalsCount > 0 ? `${pendingProposalsCount}` : null, badgeColor: "#EA580C" },
        { id: "gov_strategic", icon: Activity, label: "Tổng quan Chiến lược", desc: "Executive KPI, Portfolio 5 Phân hiệu & Action Center" },
        { id: "decision_history", icon: History, label: "Lịch sử Quyết định", desc: "Timeline thực thi, Audit Trail & Kết quả" },
      ]
    },
    {
      groupTitle: "HỆ THỐNG RA QUYẾT ĐỊNH (DSS CORE)",
      items: [
        { id: "dss_forecast", icon: Sliders, label: "Dự báo & Mô phỏng", desc: "What-If Simulation & Tạo quyết định từ kịch bản" },
        { id: "dss_funnel", icon: UserPlus, label: "DSS Phễu Tuyển sinh", desc: "Leads -> Applicants -> Admits -> Yield & AI Insights" },
        { id: "dss_marketing", icon: Megaphone, label: "Nguồn & ROI Marketing", desc: "Hiệu quả kênh, CAC, Bản đồ nhiệt & Phân bổ ngân sách" },
        { id: "dss_trends", icon: Globe, label: "Xu hướng & Mở ngành", desc: "Nhu cầu thị trường lao động, Vi mạch AI & Feasibility" },
      ]
    },
    {
      groupTitle: "GIÁM SÁT RỦI RO & LIÊN PHÒNG BAN",
      items: [
        { id: "gov_risk", icon: ShieldAlert, label: "Cảnh báo Rủi ro Sớm", desc: "Cảnh báo chỉ tiêu, hồ sơ ảo & Giao việc xử lý", badge: highRisksCount > 0 ? `${highRisksCount}` : null, badgeColor: "#DC2626" },
        { id: "gov_crossdept", icon: TrendingUp, label: "SLA Liên Phòng ban", desc: "Giám sát hiệu suất Tuyển sinh, Tài chính, Đào tạo", badge: overdueTasksCount > 0 ? `${overdueTasksCount}` : null, badgeColor: "#F59E0B" },
        { id: "gov_finance", icon: Wallet, label: "Kế hoạch Tài chính", desc: "Doanh thu 5 năm, CAPEX hạ tầng & Ngân sách dài hạn" },
      ]
    }
  ];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F1F5F9", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div style={{
          position: "fixed", top: 20, right: 28, zIndex: 9999,
          background: toastMessage.type === "error" ? "#991B1B" : toastMessage.type === "info" ? "#1E3A8A" : "#0F172A",
          color: "#FFFFFF", padding: "14px 22px", borderRadius: 12,
          boxShadow: "0 14px 35px rgba(0,0,0,0.3)", display: "flex",
          alignItems: "center", gap: 12, fontSize: 13.5, fontWeight: 600,
          border: "1px solid rgba(255,255,255,0.15)",
          animation: "fadeIn 0.2s ease-out"
        }}>
          {toastMessage.type === "error" ? <AlertCircle size={18} color="#F87171" /> : <CheckCircle size={18} color="#4ADE80" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 260, background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        flexShrink: 0, zIndex: 30, overflowY: "auto"
      }}>
        <div>
          {/* Logo & Brand Identity */}
          <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #F1F5F9" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#FFFFFF", fontWeight: 900, fontSize: 18,
              boxShadow: "0 4px 12px rgba(234,88,12,0.35)"
            }}>
              FPT
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.3px", lineHeight: 1.15 }}>
                ĐẠI HỌC FPT
              </div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                <span>Executive DSS</span>
                <span style={{ fontSize: 9.5, background: "#FFEDD5", color: "#C2410C", padding: "1px 6px", borderRadius: 4, fontWeight: 800 }}>
                  BOD
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Groups */}
          <nav style={{ padding: "14px 10px", display: "flex", flexDirection: "column", gap: 16 }}>
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
                        style={{
                          width: "100%", textAlign: "left",
                          padding: "9px 12px", borderRadius: 10,
                          background: isActive ? "linear-gradient(90deg, #FFF7ED 0%, #FFEDD5 100%)" : "transparent",
                          border: isActive ? "1px solid #FDBA74" : "1px solid transparent",
                          color: isActive ? "#C2410C" : "#475569",
                          fontWeight: isActive ? 700 : 500,
                          fontSize: 13, display: "flex", alignItems: "center", gap: 10,
                          cursor: "pointer", transition: "all 0.15s ease"
                        }}
                      >
                        <tab.icon size={17} color={isActive ? "#EA580C" : "#64748B"} />
                        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {tab.label}
                        </span>
                        {tab.badge && (
                          <span style={{
                            fontSize: 10, fontWeight: 800,
                            background: tab.badgeColor || "#EA580C",
                            color: "#FFFFFF", padding: "2px 6px",
                            borderRadius: 100, lineHeight: 1
                          }}>
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Account / Sign out */}
        <div style={{ padding: "14px", borderTop: "1px solid #F1F5F9", background: "#FAFAFA" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#0F172A", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>
                BOD
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1E293B" }}>Ban Giám Hiệu</div>
                <div style={{ fontSize: 11, color: "#64748B" }}>TS. Hoàng Việt Hà</div>
              </div>
            </div>
            <button
              onClick={() => navigate("/login")}
              title="Đăng xuất"
              style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer", padding: 6 }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        
        {/* ── TOP HEADER / EXECUTIVE COMMAND BAR ── */}
        <header style={{
          height: 68, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", flexShrink: 0, zIndex: 20
        }}>
          {/* Left: Global Command Center Trigger & Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setShowCommandPalette(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
                background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10,
                color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              <Zap size={15} color="#EA580C" />
              <span>⚡ BOD Command Center</span>
              <span style={{ fontSize: 10.5, padding: "2px 6px", background: "#E2E8F0", borderRadius: 4, color: "#64748B", fontFamily: "monospace" }}>
                Ctrl + K
              </span>
            </button>

            {/* Quick Filter: Semester & Campus */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select
                value={selectedSemester}
                onChange={e => setSelectedSemester(e.target.value)}
                style={{
                  padding: "7px 12px", borderRadius: 8, border: "1px solid #CBD5E1",
                  fontSize: 12.5, fontWeight: 600, color: "#1E293B", background: "#FFF", cursor: "pointer"
                }}
              >
                <option value="Thu 2026">Kỳ Thu 2026 (Chính)</option>
                <option value="Hè 2026">Kỳ Hè 2026</option>
                <option value="Xuân 2026">Kỳ Xuân 2026</option>
              </select>

              <select
                value={selectedCampus}
                onChange={e => setSelectedCampus(e.target.value)}
                style={{
                  padding: "7px 12px", borderRadius: 8, border: "1px solid #CBD5E1",
                  fontSize: 12.5, fontWeight: 600, color: "#1E293B", background: "#FFF", cursor: "pointer"
                }}
              >
                <option value="all">Toàn bộ 5 Cơ sở</option>
                <option value="HN">Hà Nội (Hòa Lạc)</option>
                <option value="HCM">TP. Hồ Chí Minh</option>
                <option value="DN">Đà Nẵng</option>
                <option value="CT">Cần Thơ</option>
                <option value="QN">Quy Nhơn</option>
              </select>
            </div>
          </div>

          {/* Right: Quick Action Buttons, Notifications & Export */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            
            {/* Quick Action: Open Decision Center */}
            <button
              onClick={() => setActiveTab("decision_center")}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 9,
                color: "#C2410C", fontSize: 13, fontWeight: 700, cursor: "pointer"
              }}
            >
              <CheckSquare size={15} color="#EA580C" />
              <span>Phê duyệt ({pendingProposalsCount})</span>
            </button>

            {/* Quick Action: Open Risk Center */}
            <button
              onClick={() => setActiveTab("gov_risk")}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                background: highRisksCount > 0 ? "#FEF2F2" : "#F8FAFC",
                border: highRisksCount > 0 ? "1px solid #FCA5A5" : "1px solid #E2E8F0",
                borderRadius: 9,
                color: highRisksCount > 0 ? "#B91C1C" : "#475569",
                fontSize: 13, fontWeight: 600, cursor: "pointer"
              }}
            >
              <ShieldAlert size={15} color={highRisksCount > 0 ? "#DC2626" : "#64748B"} />
              <span>Rủi ro ({highRisksCount})</span>
            </button>

            {/* Notification Bell */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: showNotificationDrawer ? "#EFF6FF" : "#F8FAFC",
                  border: "1px solid #E2E8F0", display: "flex",
                  alignItems: "center", justifyContent: "center", cursor: "pointer",
                  color: "#475569", position: "relative"
                }}
              >
                <Bell size={18} />
                {unreadNotifsCount > 0 && (
                  <span style={{
                    position: "absolute", top: -3, right: -3,
                    background: "#DC2626", color: "#FFF", fontSize: 10,
                    fontWeight: 900, width: 18, height: 18, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 8px rgba(220,38,38,0.5)"
                  }}>
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer Dropdown */}
              {showNotificationDrawer && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  width: 380, background: "#FFFFFF", borderRadius: 16,
                  boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
                  border: "1px solid #E2E8F0", zIndex: 100, overflow: "hidden"
                }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFC" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0F172A" }}>
                      Thông báo Chỉ đạo & SLA ({unreadNotifsCount} chưa đọc)
                    </div>
                    <button
                      onClick={() => {
                        notifications.forEach(n => bodEngine.markNotificationAsRead(n.id));
                        reloadEngineData();
                      }}
                      style={{ background: "none", border: "none", color: "#2563EB", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}
                    >
                      Đọc tất cả
                    </button>
                  </div>

                  <div style={{ maxHeight: 360, overflowY: "auto", padding: "8px 0" }}>
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          bodEngine.markNotificationAsRead(n.id);
                          reloadEngineData();
                          setShowNotificationDrawer(false);
                          if (n.targetType === "proposal") setActiveTab("decision_center");
                          else if (n.targetType === "risk") setActiveTab("gov_risk");
                          else if (n.targetType === "task" || n.targetType === "department") setActiveTab("gov_crossdept");
                        }}
                        style={{
                          padding: "12px 18px",
                          borderBottom: "1px solid #F1F5F9",
                          background: n.isRead ? "#FFFFFF" : "#FFF7ED",
                          cursor: "pointer", transition: "background 0.15s"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{
                            fontSize: 10.5, fontWeight: 700, textTransform: "uppercase",
                            color: n.severity === "CRITICAL" ? "#DC2626" : n.severity === "HIGH" ? "#EA580C" : "#2563EB"
                          }}>
                            {n.title}
                          </span>
                          <span style={{ fontSize: 10.5, color: "#94A3B8" }}>{n.timestamp}</span>
                        </div>
                        <p style={{ fontSize: 12.5, color: "#334155", margin: 0, lineHeight: 1.45 }}>
                          {n.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export Comprehensive Excel Report */}
            <button
              onClick={handleExportComprehensiveReport}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "8px 16px",
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                border: "none", borderRadius: 9, color: "#FFFFFF",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                boxShadow: "0 2px 6px rgba(15,23,42,0.25)"
              }}
            >
              <Download size={15} />
              <span>Xuất Báo Cáo BOD (Excel)</span>
            </button>
          </div>
        </header>

        {/* ── TAB CONTENT RENDERER ── */}
        <main style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          
          {/* =========================================================================
              TAB 1: TRUNG TÂM RA QUYẾT ĐỊNH (DECISION CENTER - P0 CORE)
              ========================================================================= */}
          {activeTab === "decision_center" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* Section Header with Stats */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ padding: "3px 8px", borderRadius: 6, background: "#FFEDD5", color: "#C2410C", fontSize: 11, fontWeight: 800 }}>
                      WORKFLOW & APPROVAL HUB
                    </span>
                    <span style={{ fontSize: 12, color: "#64748B" }}>Đồng bộ thời gian thực với Ban Tài chính, Tuyển sinh, Marketing</span>
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                    Trung Tâm Phê Duyệt & Ra Quyết Định BOD
                  </h1>
                </div>

                {/* Filter Pills */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { id: "all", label: "Tất cả đề xuất" },
                    { id: "Marketing / Tuyển sinh", label: "Marketing / Tuyển sinh" },
                    { id: "Học bổng & Chỉ tiêu", label: "Học bổng & Chỉ tiêu" },
                    { id: "Mở ngành mới", label: "Mở ngành mới" },
                    { id: "Đầu tư / CAPEX", label: "Đầu tư / Hạ tầng" },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setProposalCategoryFilter(cat.id)}
                      style={{
                        padding: "7px 14px", borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                        border: proposalCategoryFilter === cat.id ? "1px solid #EA580C" : "1px solid #E2E8F0",
                        background: proposalCategoryFilter === cat.id ? "#FFF7ED" : "#FFFFFF",
                        color: proposalCategoryFilter === cat.id ? "#EA580C" : "#64748B",
                        cursor: "pointer"
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proposals Action Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 20 }}>
                {proposals
                  .filter(p => proposalCategoryFilter === "all" || p.category === proposalCategoryFilter)
                  .map(prop => {
                    const isPending = prop.status === "WAITING_APPROVAL" || prop.status === "UNDER_REVIEW";
                    const isApproved = prop.status === "APPROVED" || prop.status === "CONDITIONAL_APPROVED";
                    const isRejected = prop.status === "REJECTED";

                    return (
                      <div
                        key={prop.id}
                        style={{
                          background: "#FFFFFF",
                          border: isPending ? "1.5px solid #FDBA74" : isApproved ? "1.5px solid #86EFAC" : "1px solid #E2E8F0",
                          borderRadius: 16,
                          padding: 22,
                          display: "flex",
                          flexDirection: "column",
                          boxShadow: isPending ? "0 8px 24px rgba(234,88,12,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                          position: "relative"
                        }}
                      >
                        {/* Card Header: Category, Priority, Status */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>
                              {prop.category}
                            </span>
                            <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                              Đề xuất bởi: <strong style={{ color: "#334155" }}>{prop.proposedBy}</strong>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 100,
                              background: prop.priority === "HIGH" ? "#FEE2E2" : "#FEF3C7",
                              color: prop.priority === "HIGH" ? "#DC2626" : "#D97706"
                            }}>
                              {prop.priority}
                            </span>
                            <span style={{
                              fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 100,
                              background: isApproved ? "#DCFCE7" : isPending ? "#FFEDD5" : isRejected ? "#FEE2E2" : "#F1F5F9",
                              color: isApproved ? "#15803D" : isPending ? "#C2410C" : isRejected ? "#B91C1C" : "#475569"
                            }}>
                              {prop.status}
                            </span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 style={{ fontSize: 16.5, fontWeight: 800, color: "#0F172A", lineHeight: 1.35, marginBottom: 10 }}>
                          {prop.title}
                        </h3>

                        {/* Reason / Context */}
                        <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.55, marginBottom: 16, flex: 1 }}>
                          {prop.reason}
                        </p>

                        {/* Decision Score & Impact Matrix Pill */}
                        <div style={{
                          background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12,
                          padding: "12px 14px", marginBottom: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10
                        }}>
                          <div>
                            <div style={{ fontSize: 11, color: "#64748B" }}>Ngân sách đề xuất:</div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                              {prop.budgetDelta > 0 ? `+${(prop.budgetDelta / 1e6).toLocaleString()} Triệu` : "0 phát sinh"}
                            </div>
                            <div style={{ fontSize: 11, color: "#94A3B8" }}>Tổng: {(prop.proposedBudget / 1e9).toFixed(1)} Tỷ VND</div>
                          </div>

                          <div>
                            <div style={{ fontSize: 11, color: "#64748B" }}>Tác động Tuyển sinh:</div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#16A34A" }}>
                              {prop.impacts?.enrollment || "+0 SV"}
                            </div>
                            <div style={{ fontSize: 11, color: "#64748B" }}>Doanh thu: <strong style={{ color: "#2563EB" }}>{prop.impacts?.revenue || "0"}</strong></div>
                          </div>
                        </div>

                        {/* AI Recommendation Summary */}
                        {prop.aiRecommendation && (
                          <div style={{
                            background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10,
                            padding: "10px 12px", marginBottom: 18, display: "flex", alignItems: "flex-start", gap: 8
                          }}>
                            <Bot size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                            <div>
                              <div style={{ fontSize: 11.5, fontWeight: 800, color: "#B45309" }}>
                                AI SCORE: {prop.decisionScore?.overall}/10 • {prop.aiRecommendation.headline}
                              </div>
                              <div style={{ fontSize: 11.5, color: "#78350F", marginTop: 2 }}>
                                {prop.aiRecommendation.evidence?.[0]}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4 Standard Action Buttons */}
                        <div style={{ display: "flex", gap: 8, alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: 14 }}>
                          {isPending ? (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedProposalForApproval(prop);
                                  setIsConditionalApproval(false);
                                }}
                                style={{
                                  flex: 1, padding: "9px 14px", borderRadius: 9,
                                  background: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)",
                                  border: "none", color: "#FFFFFF", fontSize: 13, fontWeight: 700,
                                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                  boxShadow: "0 2px 8px rgba(234,88,12,0.3)"
                                }}
                              >
                                <Check size={15} /> Phê duyệt ngay
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedProposalForApproval(prop);
                                  setIsConditionalApproval(true);
                                }}
                                style={{
                                  padding: "9px 12px", borderRadius: 9,
                                  background: "#FFF7ED", border: "1px solid #FDBA74",
                                  color: "#C2410C", fontSize: 12.5, fontWeight: 600,
                                  cursor: "pointer"
                                }}
                                title="Phê duyệt có điều kiện"
                              >
                                Điều kiện
                              </button>

                              <button
                                onClick={() => handleRejectProposal(prop)}
                                style={{
                                  padding: "9px 12px", borderRadius: 9,
                                  background: "#FEF2F2", border: "1px solid #FCA5A5",
                                  color: "#DC2626", fontSize: 12.5, fontWeight: 600,
                                  cursor: "pointer"
                                }}
                                title="Từ chối"
                              >
                                <X size={15} />
                              </button>
                            </>
                          ) : (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                              <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                                <CheckCircle size={14} /> Quyết định: {prop.decisionId}
                              </span>
                              <button
                                onClick={() => setSelectedDecisionForHistory(prop)}
                                style={{
                                  padding: "6px 12px", borderRadius: 8,
                                  background: "#F1F5F9", border: "1px solid #CBD5E1",
                                  fontSize: 12, fontWeight: 600, color: "#334155", cursor: "pointer"
                                }}
                              >
                                Xem Workflow Tasks & Timeline
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Multi-Department Linked Tasks Overview */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      Nhiệm Vụ Thực Thi Liên Phòng Ban (Cross-Department Tasks)
                    </h3>
                    <p style={{ fontSize: 12.5, color: "#64748B", margin: "3px 0 0" }}>
                      Tự động phân rã từ các quyết định đã phê duyệt của BOD, giám sát tiến độ theo SLA thời gian thực
                    </p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#EA580C", background: "#FFEDD5", padding: "4px 10px", borderRadius: 100 }}>
                    {tasks.filter(t => t.status === "IN_PROGRESS").length} Nhiệm vụ đang triển khai
                  </span>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0", fontSize: 12, textTransform: "uppercase" }}>
                        <th style={{ padding: "12px 16px" }}>Mã Task</th>
                        <th style={{ padding: "12px 16px" }}>Mã Quyết Định</th>
                        <th style={{ padding: "12px 16px" }}>Nội Dung Nhiệm Vụ</th>
                        <th style={{ padding: "12px 16px" }}>Phòng Ban Phụ Trách</th>
                        <th style={{ padding: "12px 16px" }}>Người Thực Hiện</th>
                        <th style={{ padding: "12px 16px" }}>Hạn Chót / SLA</th>
                        <th style={{ padding: "12px 16px" }}>Trạng Thái</th>
                        <th style={{ padding: "12px 16px", textAlign: "right" }}>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "14px 16px", fontFamily: "monospace", fontWeight: 700, color: "#2563EB" }}>
                            {task.id}
                          </td>
                          <td style={{ padding: "14px 16px", fontFamily: "monospace", color: "#64748B" }}>
                            {task.decisionId}
                          </td>
                          <td style={{ padding: "14px 16px", fontWeight: 600, color: "#0F172A", maxWidth: 300 }}>
                            {task.title}
                          </td>
                          <td style={{ padding: "14px 16px", color: "#334155" }}>
                            {task.department}
                          </td>
                          <td style={{ padding: "14px 16px", color: "#475569" }}>
                            {task.assignee}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{
                              fontSize: 11.5, fontWeight: 700,
                              color: task.isOverdue ? "#DC2626" : "#D97706"
                            }}>
                              {task.isOverdue ? `🚨 ${task.slaRemaining}` : `⏳ ${task.slaRemaining}`}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 100,
                              background: task.status === "COMPLETED" ? "#DCFCE7" : task.status === "ESCALATED" ? "#FEE2E2" : "#EFF6FF",
                              color: task.status === "COMPLETED" ? "#15803D" : task.status === "ESCALATED" ? "#B91C1C" : "#2563EB"
                            }}>
                              {task.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "right" }}>
                            <button
                              onClick={() => {
                                handleUrgeDepartment(task.department);
                              }}
                              style={{
                                padding: "5px 10px", borderRadius: 6,
                                background: "#FFF7ED", border: "1px solid #FDBA74",
                                color: "#C2410C", fontSize: 11.5, fontWeight: 700, cursor: "pointer"
                              }}
                            >
                              Đốc thúc
                            </button>
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
              TAB 2: TỔNG QUAN CHIẾN LƯỢC (GOV_STRATEGIC) - WITH ACTIONABLE DRILL-DOWNS
              ========================================================================= */}
          {activeTab === "gov_strategic" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* Executive Top Cards (Clickable to open Drill-Down Drawer) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                {[
                  {
                    id: "kpi_enrollment",
                    title: "DỰ BÁO NHẬP HỌC K21",
                    value: "14,250 SV",
                    target: "15,000 SV (Đạt 95.0%)",
                    gap: "-750 SV",
                    trend: "↓ -2.3% YoY",
                    color: "#EA580C",
                    causes: [
                      "Tỷ lệ chuyển đổi Admit → Enrolled khu vực Miền Tây giảm 8.2%",
                      "Cạnh tranh gay gắt từ các trường công lập mở thêm chỉ tiêu ngành CNTT",
                      "Chi phí thu hút thí sinh (CAC) tăng ở kênh tìm kiếm"
                    ],
                    aiAction: "Tăng ngân sách Digital Miền Tây +800M và bổ sung 200 suất học bổng Talent ngành AI."
                  },
                  {
                    id: "kpi_revenue",
                    title: "DOANH THU HỌC PHÍ DỰ PHÓNG",
                    value: "2,450 Tỷ VND",
                    target: "2,200 Tỷ VND (+11.3%)",
                    gap: "+250 Tỷ VND",
                    trend: "↑ +14.8% YoY",
                    color: "#16A34A",
                    causes: [
                      "Doanh thu các ngành chất lượng cao và AI tăng trưởng vượt kỳ vọng",
                      "Tỷ lệ sinh viên đóng học phí đúng hạn đạt 95.2%"
                    ],
                    aiAction: "Tiếp tục duy trì chính sách học phí ổn định và phân bổ 15 Tỷ đầu tư phòng Lab AI."
                  },
                  {
                    id: "kpi_marketing",
                    title: "HIỆU SUẤT MARKETING (CAC)",
                    value: "2.4 Triệu/SV",
                    target: "Dưới 2.6 Triệu/SV",
                    gap: "Tiết kiệm 8%",
                    trend: "↓ Tối ưu tốt",
                    color: "#2563EB",
                    causes: [
                      "Kênh TikTok Video và Open Day trường THPT có ROI vượt trội 3.4x",
                      "Chi phí Lead chuyển đổi giảm nhờ hệ thống AI Telesales"
                    ],
                    aiAction: "Tái cơ cấu 20% ngân sách từ Google Search sang TikTok Ads."
                  },
                  {
                    id: "kpi_sla",
                    title: "TỶ LỆ ĐÁP ỨNG SLA LIÊN PHÒNG",
                    value: "97.8%",
                    target: "Mục tiêu: > 96%",
                    gap: "+1.8%",
                    trend: "Ổn định",
                    color: "#7C3AED",
                    causes: [
                      "Ban Tuyển sinh và IT giải quyết 98.3% hồ sơ dưới 3h",
                      "Phòng Nhân sự còn chậm trễ trong khâu tuyển Tiến sĩ ngành mới"
                    ],
                    aiAction: "Đốc thúc Phòng Nhân sự duyệt gói thu hút nhân tài giảng viên 1 Tỷ/Tiến sĩ."
                  },
                  {
                    id: "kpi_risks",
                    title: "RỦI RO CẦN BOD XỬ LÝ",
                    value: `${highRisksCount} Rủi ro`,
                    target: "0 Rủi ro Critical",
                    gap: "Cần hành động",
                    trend: "Khẩn cấp",
                    color: "#DC2626",
                    causes: [
                      "Hồ sơ ảo khu vực Miền Tây",
                      "Tiến độ thi công AI Lab Hòa Lạc",
                      "Thiếu hụt giảng viên bán dẫn K21"
                    ],
                    aiAction: "Mở ngay Risk Center để giao việc xử lý cho các phòng ban."
                  }
                ].map((kpi) => (
                  <div
                    key={kpi.id}
                    onClick={() => setSelectedKPIDetail(kpi)}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: 16,
                      padding: "20px 18px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.borderColor = kpi.color;
                      e.currentTarget.style.boxShadow = `0 10px 25px rgba(0,0,0,0.08), 0 0 15px ${kpi.color}22`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "#E2E8F0";
                      e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.03)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5 }}>
                        {kpi.title}
                      </span>
                      <ChevronRight size={15} color="#94A3B8" />
                    </div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", lineHeight: 1.1, marginBottom: 6 }}>
                      {kpi.value}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: kpi.color }}>
                      {kpi.target} • {kpi.trend}
                    </div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 8, borderTop: "1px solid #F1F5F9", paddingTop: 8 }}>
                      👉 Click xem nguyên nhân & hành động BOD
                    </div>
                  </div>
                ))}
              </div>

              {/* Strategic Charts & Portfolio 5 Campuses */}
              <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: 20 }}>
                
                {/* Left: 5 Campus Enrollment & Quota Breakdown */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 16.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                        Tiến Độ Tuyển Sinh 5 Phân Hiệu Toàn Quốc (Thu 2026)
                      </h3>
                      <p style={{ fontSize: 12, color: "#64748B", margin: "2px 0 0" }}>
                        Chỉ tiêu vs Hồ sơ nộp vs Nhập học thực tế (Yield Rate)
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("dss_funnel")}
                      style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#334155", cursor: "pointer" }}
                    >
                      Phân tích chi tiết phễu
                    </button>
                  </div>

                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { campus: "Hà Nội", target: 5500, enrolled: 5320, yield: 96.7 },
                          { campus: "TP.HCM", target: 5000, enrolled: 4890, yield: 97.8 },
                          { campus: "Đà Nẵng", target: 2000, enrolled: 1910, yield: 95.5 },
                          { campus: "Cần Thơ", target: 1500, enrolled: 1280, yield: 85.3 },
                          { campus: "Quy Nhơn", target: 1000, enrolled: 850, yield: 85.0 },
                        ]}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="campus" stroke="#64748B" fontSize={12} />
                        <YAxis stroke="#64748B" fontSize={12} />
                        <Tooltip
                          contentStyle={{ background: "#0F172A", borderRadius: 8, border: "none", color: "#FFF", fontSize: 12 }}
                          formatter={(val, name) => [name === "target" ? `${val} SV (Chỉ tiêu)` : `${val} SV (Nhập học)`, name === "target" ? "Chỉ tiêu" : "Nhập học"]}
                        />
                        <Bar dataKey="target" fill="#CBD5E1" radius={[4, 4, 0, 0]} barSize={24} name="target" />
                        <Bar dataKey="enrolled" fill="#EA580C" radius={[4, 4, 0, 0]} barSize={24} name="enrolled" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10, fontSize: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 12, height: 12, background: "#CBD5E1", borderRadius: 3 }} />
                      <span style={{ color: "#64748B" }}>Chỉ tiêu tuyển sinh</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 12, height: 12, background: "#EA580C", borderRadius: 3 }} />
                      <span style={{ color: "#0F172A", fontWeight: 700 }}>Sinh viên nhập học thực tế</span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Board for BOD */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    <Zap size={18} color="#EA580C" />
                    <h3 style={{ fontSize: 16.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      Hành Động & Điều Hành Nhanh (BOD Actions)
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                    <button
                      onClick={() => setActiveTab("decision_center")}
                      style={{
                        padding: "12px 14px", borderRadius: 10, background: "#FFF7ED",
                        border: "1px solid #FDBA74", color: "#9A3412", textAlign: "left",
                        display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>✓ Phê duyệt {pendingProposalsCount} Đề xuất ngân sách</div>
                        <div style={{ fontSize: 11.5, color: "#C2410C" }}>Ban Tuyển sinh & Marketing đang chờ ý kiến</div>
                      </div>
                      <ChevronRight size={16} />
                    </button>

                    <button
                      onClick={() => setActiveTab("gov_risk")}
                      style={{
                        padding: "12px 14px", borderRadius: 10, background: "#FEF2F2",
                        border: "1px solid #FCA5A5", color: "#991B1B", textAlign: "left",
                        display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>🚨 Xử lý {highRisksCount} Rủi ro tuyển sinh</div>
                        <div style={{ fontSize: 11.5, color: "#B91C1C" }}>Hồ sơ ảo Miền Tây & Hạ tầng Lab GPU</div>
                      </div>
                      <ChevronRight size={16} />
                    </button>

                    <button
                      onClick={() => setActiveTab("dss_forecast")}
                      style={{
                        padding: "12px 14px", borderRadius: 10, background: "#EFF6FF",
                        border: "1px solid #BFDBFE", color: "#1E40AF", textAlign: "left",
                        display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>🎛️ Chạy mô phỏng What-If Ngân sách</div>
                        <div style={{ fontSize: 11.5, color: "#2563EB" }}>Tối ưu học phí, học bổng & doanh thu</div>
                      </div>
                      <ChevronRight size={16} />
                    </button>

                    <button
                      onClick={() => setShowNewMajorModal(true)}
                      style={{
                        padding: "12px 14px", borderRadius: 10, background: "#F0FDF4",
                        border: "1px solid #BBF7D0", color: "#166534", textAlign: "left",
                        display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>🏫 Phê duyệt mở ngành Bán dẫn & AI</div>
                        <div style={{ fontSize: 11.5, color: "#15803D" }}>Chiến lược K21 & Đào tạo nhân lực vi mạch</div>
                      </div>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: DỰ BÁO & MÔ PHỎNG WHAT-IF (DSS FORECAST) - DIRECT PROPOSAL CREATION
              ========================================================================= */}
          {activeTab === "dss_forecast" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#EA580C", textTransform: "uppercase" }}>
                    DSS WHAT-IF SIMULATION & DECISION GENERATOR
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "4px 0 0" }}>
                    Dự Báo & Mô Phỏng Kịch Bản Quyết Định
                  </h1>
                </div>

                <button
                  onClick={handleCreateProposalFromWhatIf}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                    background: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)",
                    border: "none", borderRadius: 10, color: "#FFFFFF",
                    fontSize: 13.5, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(234,88,12,0.35)"
                  }}
                >
                  <Sparkles size={16} /> Tạo Đề Xuất Quyết Định Từ Kịch Bản Này
                </button>
              </div>

              {/* Simulation Sliders Control Matrix */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                {/* Parameter 1: Tuition */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Điều chỉnh Học phí:</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#EA580C" }}>+{tuitionIncrease}%</span>
                  </div>
                  <input
                    type="range" min={0} max={15} step={1}
                    value={tuitionIncrease}
                    onChange={e => setTuitionIncrease(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#EA580C", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94A3B8", marginTop: 6 }}>
                    <span>0% (Giữ nguyên)</span>
                    <span>5% (Khuyên dùng)</span>
                    <span>15% (Tối đa)</span>
                  </div>
                </div>

                {/* Parameter 2: Scholarship */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>Tỷ lệ Học bổng Talent:</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#2563EB" }}>{scholarshipRate}%</span>
                  </div>
                  <input
                    type="range" min={5} max={25} step={1}
                    value={scholarshipRate}
                    onChange={e => setScholarshipRate(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#2563EB", cursor: "pointer" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94A3B8", marginTop: 6 }}>
                    <span>5% (Thấp)</span>
                    <span>12% (Mục tiêu)</span>
                    <span>25% (Thu hút tài năng)</span>
                  </div>
                </div>

                {/* Parameter 3: Marketing Strategy */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 10 }}>Chiến dịch Marketing Tuyển sinh:</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[
                      { id: "attack", label: "Tấn công (+10%)", color: "#EA580C" },
                      { id: "normal", label: "Cơ bản (Giữ nguyên)", color: "#475569" },
                      { id: "saving", label: "Tiết kiệm (-8%)", color: "#16A34A" },
                    ].map(mode => (
                      <button
                        key={mode.id}
                        onClick={() => setMarketingBudgetMode(mode.id)}
                        style={{
                          flex: 1, padding: "8px 6px", borderRadius: 8, fontSize: 11.5, fontWeight: 700,
                          border: marketingBudgetMode === mode.id ? `1.5px solid ${mode.color}` : "1px solid #E2E8F0",
                          background: marketingBudgetMode === mode.id ? "#F8FAFC" : "#FFFFFF",
                          color: marketingBudgetMode === mode.id ? mode.color : "#64748B",
                          cursor: "pointer"
                        }}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simulation Results Chart */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      Dự Phóng Doanh Thu & Nhập Học 4 Quý (Kịch Bản Cơ Bản vs Mô Phỏng)
                    </h3>
                    <p style={{ fontSize: 12.5, color: "#64748B", margin: "2px 0 0" }}>
                      Đơn vị tính: Tỷ VND • Dự báo Doanh thu FY26 đạt <strong>2,450 Tỷ VND</strong> (+12.5%)
                    </p>
                  </div>
                </div>

                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulatedForecastData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="quarter" stroke="#64748B" fontSize={12} />
                      <YAxis stroke="#64748B" fontSize={12} />
                      <Tooltip contentStyle={{ background: "#0F172A", borderRadius: 8, border: "none", color: "#FFF", fontSize: 12 }} />
                      <Line type="monotone" dataKey="base" stroke="#94A3B8" strokeWidth={2} name="Kế hoạch gốc" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="sim" stroke="#EA580C" strokeWidth={3} name="Kịch bản mô phỏng" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: DSS PHỄU TUYỂN SINH & KHUYẾN NGHỊ CHUYỂN ĐỔI (DSS FUNNEL COMPLETE)
              ========================================================================= */}
          {activeTab === "dss_funnel" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#2563EB", textTransform: "uppercase" }}>
                    ADMISSION FUNNEL CONVERSION & STAGE-BY-STAGE INTELLIGENCE
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "4px 0 0" }}>
                    DSS Phễu Tuyển Sinh & Tối Ưu Hóa Tỷ Lệ Nhập Học (Yield Rate)
                  </h1>
                </div>

                <button
                  onClick={() => {
                    const prop = proposals.find(p => p.id === "PROP-2026-001");
                    if (prop) setSelectedProposalForApproval(prop);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "9px 18px",
                    background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 10,
                    color: "#C2410C", fontSize: 13, fontWeight: 700, cursor: "pointer"
                  }}
                >
                  <Zap size={15} /> Xử lý Điểm nghẽn Phễu Miền Tây (+800M)
                </button>
              </div>

              {/* 4 Funnel Stage Cards with Conversion Rates */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20, borderTop: "4px solid #3B82F6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: "#1E40AF", textTransform: "uppercase" }}>1. TỔNG LEADS</span>
                    <span style={{ fontSize: 11, background: "#EFF6FF", color: "#2563EB", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>+12% YoY</span>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", margin: "8px 0 4px" }}>24,500</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>Đăng ký tư vấn trực tuyến & THPT</div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20, borderTop: "4px solid #F59E0B" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: "#92400E", textTransform: "uppercase" }}>2. HỒ SƠ (APPLICANTS)</span>
                    <span style={{ fontSize: 11, background: "#FEF3C7", color: "#D97706", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>33.5% Chuyển đổi</span>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", margin: "8px 0 4px" }}>8,200</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>Đã nộp hồ sơ xét tuyển hợp lệ</div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20, borderTop: "4px solid #8B5CF6" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: "#5B21B6", textTransform: "uppercase" }}>3. ĐỦ ĐIỀU KIỆN (ADMITS)</span>
                    <span style={{ fontSize: 11, background: "#F5F3FF", color: "#7C3AED", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>62.2% Trúng tuyển</span>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", margin: "8px 0 4px" }}>5,100</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>Đủ điểm chuẩn THPT & Học bạ</div>
                </div>

                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20, borderTop: "4px solid #10B981" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: "#065F46", textTransform: "uppercase" }}>4. NHẬP HỌC (ENROLLED)</span>
                    <span style={{ fontSize: 11, background: "#ECFDF5", color: "#059669", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>75.5% Yield Rate</span>
                  </div>
                  <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", margin: "8px 0 4px" }}>3,850</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>Đã nộp học phí chính thức đợt 1</div>
                </div>
              </div>

              {/* Conversion Waterfall Chart & Campus Breakdown Matrix */}
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr", gap: 20 }}>
                
                {/* Funnel Waterfall Chart */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22 }}>
                  <h3 style={{ fontSize: 16.5, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>
                    Tỷ Lệ Chuyển Đổi & Rơi Rụng Từng Tầng Phễu (Drop-off Analysis)
                  </h3>
                  <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 16px" }}>
                    Rơi rụng nhiều nhất ở tầng Lead ➔ Applicant (-66.5%) và Admit ➔ Enrolled (-24.5%)
                  </p>

                  <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { stage: "Leads (Tiếp cận)", volume: 24500, drop: 0 },
                          { stage: "Applicants (Nộp hồ sơ)", volume: 8200, drop: 16300 },
                          { stage: "Admits (Đủ điều kiện)", volume: 5100, drop: 3100 },
                          { stage: "Enrolled (Nhập học)", volume: 3850, drop: 1250 },
                        ]}
                        margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="stage" stroke="#64748B" fontSize={11.5} />
                        <YAxis stroke="#64748B" fontSize={11.5} />
                        <Tooltip contentStyle={{ background: "#0F172A", borderRadius: 8, color: "#FFF", fontSize: 12 }} />
                        <Area type="monotone" dataKey="volume" stroke="#2563EB" fill="#DBEAFE" strokeWidth={3} name="Số lượng thí sinh" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Campus Funnel Breakdown Table */}
                <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22 }}>
                  <h3 style={{ fontSize: 16.5, fontWeight: 800, color: "#0F172A", margin: "0 0 14px" }}>
                    Hiệu Suất Phễu Theo 5 Phân Hiệu
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                        <th style={{ padding: "8px 10px" }}>Cơ Sở</th>
                        <th style={{ padding: "8px 10px" }}>Chỉ Tiêu</th>
                        <th style={{ padding: "8px 10px" }}>Applicants</th>
                        <th style={{ padding: "8px 10px" }}>Enrolled</th>
                        <th style={{ padding: "8px 10px" }}>Tỷ Lệ Yield</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { campus: "Hà Nội", target: 5500, app: 3200, enrolled: 1550, yield: "78.2%", status: "Tốt" },
                        { campus: "TP.HCM", target: 5000, app: 2900, enrolled: 1420, yield: "80.5%", status: "Rất tốt" },
                        { campus: "Đà Nẵng", target: 2000, app: 1100, enrolled: 460, yield: "74.0%", status: "Ổn định" },
                        { campus: "Cần Thơ", target: 1500, app: 620, enrolled: 240, yield: "64.5%", status: "Cảnh báo" },
                        { campus: "Quy Nhơn", target: 1000, app: 380, enrolled: 180, yield: "72.0%", status: "Ổn định" },
                      ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "10px", fontWeight: 700, color: "#0F172A" }}>{row.campus}</td>
                          <td style={{ padding: "10px", color: "#64748B" }}>{row.target}</td>
                          <td style={{ padding: "10px", color: "#2563EB", fontWeight: 600 }}>{row.app}</td>
                          <td style={{ padding: "10px", color: "#16A34A", fontWeight: 800 }}>{row.enrolled}</td>
                          <td style={{ padding: "10px" }}>
                            <span style={{
                              fontWeight: 800, padding: "2px 6px", borderRadius: 4, fontSize: 11,
                              background: row.yield >= "75%" ? "#DCFCE7" : row.yield >= "70%" ? "#FEF3C7" : "#FEE2E2",
                              color: row.yield >= "75%" ? "#15803D" : row.yield >= "70%" ? "#B45309" : "#B91C1C"
                            }}>
                              {row.yield}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Conversion Strategy Cards */}
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 16, padding: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Bot size={32} color="#D97706" />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#92400E" }}>
                      AI Recommendation: Rút ngắn chu kỳ xác nhận nhập học tại Campus Cần Thơ
                    </div>
                    <div style={{ fontSize: 13, color: "#78350F", marginTop: 2 }}>
                      Phân tích 620 hồ sơ trúng tuyển tại ĐBSCL cho thấy 35.5% thí sinh hủy vé do chờ trường công lập. Cần áp dụng gói Voucher KTX và cam kết học bổng sớm.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const prop = proposals.find(p => p.id === "PROP-2026-001");
                    if (prop) setSelectedProposalForApproval(prop);
                  }}
                  style={{ padding: "10px 18px", borderRadius: 10, background: "#EA580C", color: "#FFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  ⚡ Duyệt gói ngân sách giữ chân thí sinh
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 5: NGUỒN & ROI MARKETING (DSS MARKETING COMPLETE)
              ========================================================================= */}
          {activeTab === "dss_marketing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#EA580C", textTransform: "uppercase" }}>
                    MARKETING ATTRIBUTION & ROI OPTIMIZATION
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "4px 0 0" }}>
                    Hiệu Quả Kênh Marketing, Chi Phí CAC & Bản Đồ Nhiệt
                  </h1>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      const prop = proposals.find(p => p.id === "PROP-2026-001");
                      if (prop) setSelectedProposalForApproval(prop);
                    }}
                    style={{ padding: "9px 18px", borderRadius: 10, background: "#EA580C", color: "#FFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                  >
                    + Phê duyệt phân bổ ngân sách 800M
                  </button>
                </div>
              </div>

              {/* Marketing KPI Bar */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 18 }}>
                  <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 700 }}>TỔNG NGÂN SÁCH MARKETING</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "6px 0 2px" }}>15.2 Tỷ VND</div>
                  <div style={{ fontSize: 12, color: "#16A34A" }}>Đã giải ngân: 11.8 Tỷ (77.6%)</div>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 18 }}>
                  <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 700 }}>CHI PHÍ MỖI TÂN SV (CAC)</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#2563EB", margin: "6px 0 2px" }}>2.4 Triệu/SV</div>
                  <div style={{ fontSize: 12, color: "#16A34A" }}>Tiết kiệm 8% vs định mức 2.6 Tr</div>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 18 }}>
                  <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 700 }}>ROI TRUNG BÌNH TOÀN KÊNH</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#EA580C", margin: "6px 0 2px" }}>3.2x</div>
                  <div style={{ fontSize: 12, color: "#EA580C" }}>Doanh thu học phí / Chi phí MKT</div>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 18 }}>
                  <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 700 }}>TỶ LỆ LEAD ➔ ENROLLED</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#7C3AED", margin: "6px 0 2px" }}>15.7%</div>
                  <div style={{ fontSize: 12, color: "#64748B" }}>Mục tiêu cả năm: 15.0%</div>
                </div>
              </div>

              {/* Marketing Channels Table with ROI & CAC */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>
                  Hiệu Suất Từng Kênh Tiếp Thị & Tỷ Lệ Hoàn Vốn (Attribution Model)
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0", fontSize: 12, textTransform: "uppercase" }}>
                        <th style={{ padding: "12px 14px" }}>Kênh Tiếp Thị</th>
                        <th style={{ padding: "12px 14px" }}>Ngân Sách Đã Chi</th>
                        <th style={{ padding: "12px 14px" }}>Leads Thu Được</th>
                        <th style={{ padding: "12px 14px" }}>Số SV Nhập Học</th>
                        <th style={{ padding: "12px 14px" }}>Chi Phí / SV (CAC)</th>
                        <th style={{ padding: "12px 14px" }}>Tỷ Lệ ROI</th>
                        <th style={{ padding: "12px 14px" }}>Đánh Giá AI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { channel: "TikTok Ads & KOC Video", spend: "3.2 Tỷ", leads: "8,500", enrolled: "1,450", cac: "2.2 Tr", roi: "3.8x", eval: "Hiệu quả cao nhất", color: "#16A34A" },
                        { channel: "Meta Ads (Facebook/Instagram)", spend: "4.8 Tỷ", leads: "9,200", enrolled: "1,200", cac: "4.0 Tr", roi: "2.8x", eval: "Hiệu quả ổn định", color: "#2563EB" },
                        { channel: "Google Search & Youtube Ads", spend: "3.0 Tỷ", leads: "3,400", enrolled: "550", cac: "5.4 Tr", roi: "2.1x", eval: "Bị đẩy giá thầu", color: "#DC2626" },
                        { channel: "THPT Roadshow & School Tour", spend: "2.5 Tỷ", leads: "2,200", enrolled: "480", cac: "5.2 Tr", roi: "3.1x", eval: "Chất lượng lead tốt", color: "#16A34A" },
                        { channel: "Open Day Trải Nghiệm Campus", spend: "1.2 Tỷ", leads: "900", enrolled: "380", cac: "3.1 Tr", roi: "4.2x", eval: "Tỷ lệ chốt cao", color: "#16A34A" },
                        { channel: "Referral Cựu SV & Giới thiệu", spend: "0.5 Tỷ", leads: "300", enrolled: "190", cac: "2.6 Tr", roi: "5.5x", eval: "Chi phí thấp", color: "#16A34A" },
                      ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0F172A" }}>{row.channel}</td>
                          <td style={{ padding: "12px 14px", color: "#334155" }}>{row.spend}</td>
                          <td style={{ padding: "12px 14px", color: "#2563EB", fontWeight: 600 }}>{row.leads}</td>
                          <td style={{ padding: "12px 14px", color: "#16A34A", fontWeight: 800 }}>{row.enrolled}</td>
                          <td style={{ padding: "12px 14px", fontWeight: 600 }}>{row.cac}</td>
                          <td style={{ padding: "12px 14px", fontWeight: 800, color: "#EA580C" }}>{row.roi}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: row.color, background: `${row.color}15`, padding: "3px 8px", borderRadius: 100 }}>
                              {row.eval}
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
              TAB 6: XU HƯỚNG KHỐI NGÀNH & MỞ NGÀNH MỚI (DSS TRENDS COMPLETE)
              ========================================================================= */}
          {activeTab === "dss_trends" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", textTransform: "uppercase" }}>
                    MARKET DEMAND & ACADEMIC FEASIBILITY INTELLIGENCE
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "4px 0 0" }}>
                    Xu Hướng Thị Trường Lao Động & Đề Xuất Mở Ngành Mới
                  </h1>
                </div>

                <button
                  onClick={() => setShowNewMajorModal(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                    background: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)",
                    border: "none", borderRadius: 10, color: "#FFFFFF",
                    fontSize: 13.5, fontWeight: 700, cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(234,88,12,0.35)"
                  }}
                >
                  <Sparkles size={16} /> + Đề Xuất Phê Duyệt Mở Ngành Mới
                </button>
              </div>

              {/* Industry Trends Matrix Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 18 }}>
                {[
                  {
                    name: "Công nghệ Bán dẫn & Vi mạch (Semiconductor)",
                    growth: "+45% Nhu cầu",
                    salary: "25 - 40 Triệu/tháng",
                    feasibility: "9.1/10 (Rất khả thi)",
                    color: "#EA580C",
                    desc: "Chiến lược quốc gia 50.000 kỹ sư vi mạch đến 2030. FPT Semiconductor cam kết tiếp nhận 200 thực tập sinh.",
                    status: "Đang trình phê duyệt"
                  },
                  {
                    name: "Trí tuệ Nhân tạo & GenAI (Artificial Intelligence)",
                    growth: "+38% Nhu cầu",
                    salary: "22 - 35 Triệu/tháng",
                    feasibility: "9.5/10 (Trọng điểm)",
                    color: "#2563EB",
                    desc: "Ngành mũi nhọn của Đại học FPT với cụm Lab Siêu máy tính GPU NVIDIA H100 tại Hòa Lạc.",
                    status: "Đang đào tạo K20"
                  },
                  {
                    name: "Công nghệ Y sinh số (Digital Health & MedTech)",
                    growth: "+30% Nhu cầu",
                    salary: "20 - 32 Triệu/tháng",
                    feasibility: "8.2/10 (Khả thi)",
                    color: "#059669",
                    desc: "Kết hợp CNTT với Y tế số, hợp tác nghiên cứu cùng FPT Long Châu và các bệnh viện quốc tế.",
                    status: "Đang lập đề cương"
                  },
                  {
                    name: "Công nghệ Hàng không Vũ trụ (Aerospace & Space AI)",
                    growth: "+22% Nhu cầu",
                    salary: "25 - 45 Triệu/tháng",
                    feasibility: "7.6/10 (Cần đối tác)",
                    color: "#7C3AED",
                    desc: "Định hướng phát triển vệ tinh tầm thấp và xử lý ảnh viễn thám phục vụ nông nghiệp thông minh.",
                    status: "Nghiên cứu thị trường"
                  },
                ].map((item, idx) => (
                  <div key={idx} style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 22, borderTop: `4px solid ${item.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: item.color, background: `${item.color}15`, padding: "3px 8px", borderRadius: 100 }}>
                        {item.growth}
                      </span>
                      <span style={{ fontSize: 11, color: "#64748B" }}>{item.status}</span>
                    </div>

                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 8px", lineHeight: 1.35 }}>
                      {item.name}
                    </h3>

                    <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, marginBottom: 14 }}>
                      {item.desc}
                    </p>

                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#64748B" }}>Lương khởi điểm:</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A" }}>{item.salary}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#64748B" }}>Điểm Khả thi:</div>
                        <div style={{ fontSize: 13, fontWeight: 800, color: item.color }}>{item.feasibility}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 7: KẾ HOẠCH TÀI CHÍNH DÀI HẠN (GOV_FINANCE COMPLETE)
              ========================================================================= */}
          {activeTab === "gov_finance" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#059669", textTransform: "uppercase" }}>
                    LONG-TERM FINANCIAL PLAN & INFRASTRUCTURE CAPEX (5-YEAR)
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "4px 0 0" }}>
                    Kế Hoạch Tài Chính & Đầu Tư Hạ Tầng Dài Hạn (2026 - 2030)
                  </h1>
                </div>

                <button
                  onClick={() => {
                    const prop = proposals.find(p => p.id === "PROP-2026-005");
                    if (prop) setSelectedProposalForApproval(prop);
                  }}
                  style={{ padding: "9px 18px", borderRadius: 10, background: "#059669", color: "#FFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  ⚡ Xem Gói Đầu tư Lab AI GPU (18.5 Tỷ)
                </button>
              </div>

              {/* 5-Year Revenue Forecast Chart */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", margin: "0 0 4px" }}>
                  Dự Phóng Doanh Thu & Lợi Nhuận Giai Đoạn 2026 - 2030 (Tỷ VND)
                </h3>
                <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 16px" }}>
                  Tốc độ tăng trưởng kép hàng năm (CAGR) dự kiến đạt <strong>15.8%</strong>
                </p>

                <div style={{ height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { year: "2026", revenue: 2450, profit: 590, capex: 180 },
                        { year: "2027", revenue: 2850, profit: 690, capex: 210 },
                        { year: "2028", revenue: 3300, profit: 820, capex: 240 },
                        { year: "2029", revenue: 3800, profit: 960, capex: 270 },
                        { year: "2030", revenue: 4400, profit: 1150, capex: 300 },
                      ]}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="year" stroke="#64748B" fontSize={12} />
                      <YAxis stroke="#64748B" fontSize={12} />
                      <Tooltip contentStyle={{ background: "#0F172A", borderRadius: 8, color: "#FFF", fontSize: 12 }} />
                      <Bar dataKey="revenue" fill="#EA580C" radius={[4, 4, 0, 0]} name="Doanh thu (Tỷ VND)" />
                      <Bar dataKey="profit" fill="#16A34A" radius={[4, 4, 0, 0]} name="Lợi nhuận (Tỷ VND)" />
                      <Bar dataKey="capex" fill="#2563EB" radius={[4, 4, 0, 0]} name="Đầu tư CAPEX (Tỷ VND)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Major CAPEX Projects Portfolio */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 22 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 14 }}>
                  Danh Mục Dự Án Đầu Tư Cơ Sở Vật Chất & Công Nghệ Trọng Điểm
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0", fontSize: 12, textTransform: "uppercase" }}>
                        <th style={{ padding: "12px 14px" }}>Dự Án Đầu Tư</th>
                        <th style={{ padding: "12px 14px" }}>Phân Hiệu</th>
                        <th style={{ padding: "12px 14px" }}>Tổng Ngân Sách</th>
                        <th style={{ padding: "12px 14px" }}>Tiến Độ</th>
                        <th style={{ padding: "12px 14px" }}>Thời Gian Bàn Giao</th>
                        <th style={{ padding: "12px 14px" }}>Trạng Thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { project: "Siêu máy tính GPU AI NVIDIA H100", campus: "Hà Nội (Hòa Lạc)", budget: "18.5 Tỷ", progress: "85%", eta: "Tháng 09/2026", status: "Đang lắp đặt" },
                        { project: "Tòa nhà Đào tạo & KTX Giai đoạn 3", campus: "TP. Hồ Chí Minh", budget: "65.0 Tỷ", progress: "40%", eta: "Tháng 06/2027", status: "Đang thi công" },
                        { project: "Viện Nghiên cứu Trí tuệ Nhân tạo & Bán dẫn", campus: "Quy Nhơn", budget: "42.0 Tỷ", progress: "60%", eta: "Tháng 12/2026", status: "Đang hoàn thiện" },
                        { project: "Khu phức hợp Thể thao & Sáng tạo SV", campus: "Đà Nẵng", budget: "22.0 Tỷ", progress: "100%", eta: "Đã nghiệm thu", status: "Hoàn thành" },
                      ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "12px 14px", fontWeight: 700, color: "#0F172A" }}>{row.project}</td>
                          <td style={{ padding: "12px 14px", color: "#334155" }}>{row.campus}</td>
                          <td style={{ padding: "12px 14px", fontWeight: 800, color: "#EA580C" }}>{row.budget}</td>
                          <td style={{ padding: "12px 14px", color: "#2563EB", fontWeight: 700 }}>{row.progress}</td>
                          <td style={{ padding: "12px 14px", color: "#64748B" }}>{row.eta}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ fontSize: 11, fontWeight: 700, background: row.progress === "100%" ? "#DCFCE7" : "#EFF6FF", color: row.progress === "100%" ? "#15803D" : "#1D4ED8", padding: "3px 8px", borderRadius: 100 }}>
                              {row.status}
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
              TAB 8: CẢNH BÁO RỦI RO & QUY TRÌNH XỬ LÝ (RISK CENTER - P0 CORE)
              ========================================================================= */}
          {activeTab === "gov_risk" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#DC2626", textTransform: "uppercase" }}>
                    ENTERPRISE RISK MANAGEMENT & ESCALATION CENTER
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "4px 0 0" }}>
                    Trung Tâm Cảnh Báo Rủi Ro Tuyển Sinh & Vận Hành
                  </h1>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ padding: "6px 12px", borderRadius: 8, background: "#FEE2E2", color: "#DC2626", fontSize: 12.5, fontWeight: 700 }}>
                    🚨 {highRisksCount} Rủi ro Nghiêm trọng
                  </span>
                </div>
              </div>

              {/* Risk Matrix Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 20 }}>
                {risks.map((risk) => (
                  <div
                    key={risk.id}
                    style={{
                      background: "#FFFFFF",
                      border: risk.severity === "CRITICAL" ? "2px solid #DC2626" : risk.severity === "HIGH" ? "1.5px solid #FCA5A5" : "1px solid #E2E8F0",
                      borderRadius: 16,
                      padding: 22,
                      display: "flex",
                      flexDirection: "column",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.04)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#DC2626", textTransform: "uppercase" }}>
                          {risk.id} • {risk.category}
                        </span>
                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
                          Chủ trì: <strong style={{ color: "#1E293B" }}>{risk.owner}</strong> ({risk.department})
                        </div>
                      </div>
                      <span style={{
                        fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 100,
                        background: risk.severity === "CRITICAL" ? "#DC2626" : risk.severity === "HIGH" ? "#FEE2E2" : "#FEF3C7",
                        color: risk.severity === "CRITICAL" ? "#FFFFFF" : risk.severity === "HIGH" ? "#DC2626" : "#D97706"
                      }}>
                        {risk.severity} • {risk.probability}%
                      </span>
                    </div>

                    <h3 style={{ fontSize: 16.5, fontWeight: 800, color: "#0F172A", marginBottom: 8, lineHeight: 1.35 }}>
                      {risk.title}
                    </h3>

                    <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, marginBottom: 14, flex: 1 }}>
                      {risk.reason}
                    </p>

                    <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 12px", marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#991B1B" }}>TÁC ĐỘNG TỔNG THỂ:</div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#B91C1C", marginTop: 2 }}>
                        {risk.financialImpact} • {risk.enrollmentImpact}
                      </div>
                      <div style={{ fontSize: 11, color: "#7F1D1D", marginTop: 4 }}>
                        SLA còn lại: <strong>{risk.slaRemaining}</strong>
                      </div>
                    </div>

                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 12px", marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B" }}>ĐỀ XUẤT XỬ LÝ (AI RECOMMENDATION):</div>
                      <div style={{ fontSize: 12, color: "#334155", marginTop: 2 }}>
                        {risk.recommendedAction}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: "flex", gap: 8, borderTop: "1px solid #F1F5F9", paddingTop: 14 }}>
                      <button
                        onClick={() => {
                          setSelectedRiskForAction(risk);
                          setRiskActionPlan(risk.recommendedAction);
                          setRiskAssignedDept(risk.department);
                          setRiskAssignee(risk.owner);
                        }}
                        style={{
                          flex: 1, padding: "9px 12px", borderRadius: 8,
                          background: "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                          border: "none", color: "#FFFFFF", fontSize: 12.5, fontWeight: 700,
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                        }}
                      >
                        <Zap size={14} /> Giao việc xử lý ngay
                      </button>

                      {risk.status !== "CLOSED" && (
                        <button
                          onClick={() => handleMitigateRisk(risk.id)}
                          style={{
                            padding: "9px 12px", borderRadius: 8,
                            background: "#F0FDF4", border: "1px solid #BBF7D0",
                            color: "#166534", fontSize: 12, fontWeight: 600, cursor: "pointer"
                          }}
                        >
                          Đóng rủi ro
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 9: LỊCH SỬ QUYẾT ĐỊNH & AUDIT LOG (DECISION HISTORY) - P0 CORE
              ========================================================================= */}
          {activeTab === "decision_history" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#2563EB", textTransform: "uppercase" }}>
                    EXECUTIVE AUDIT TRAIL & DECISION GOVERNANCE
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "4px 0 0" }}>
                    Lịch Sử Quyết Định & Nhật Ký Kiểm Toán (Audit Log)
                  </h1>
                </div>
              </div>

              {/* Audit Trail Table */}
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E2E8F0", padding: 24 }}>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0F172A", marginBottom: 16 }}>
                  Nhật Ký Thao Tác Quyết Định Cấp Ban Giám Hiệu
                </h3>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0", fontSize: 12, textTransform: "uppercase" }}>
                        <th style={{ padding: "12px 16px" }}>Mã Log</th>
                        <th style={{ padding: "12px 16px" }}>Thời Gian</th>
                        <th style={{ padding: "12px 16px" }}>Người Thực Hiện</th>
                        <th style={{ padding: "12px 16px" }}>Hành Động</th>
                        <th style={{ padding: "12px 16px" }}>Đối Tượng / Quyết Định</th>
                        <th style={{ padding: "12px 16px" }}>Giá Trị Thay Đổi</th>
                        <th style={{ padding: "12px 16px" }}>Lý Do & Ghi Chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map((log, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "14px 16px", fontFamily: "monospace", fontWeight: 700, color: "#EA580C" }}>
                            {log.id}
                          </td>
                          <td style={{ padding: "14px 16px", color: "#64748B", whiteSpace: "nowrap" }}>
                            {log.timestamp}
                          </td>
                          <td style={{ padding: "14px 16px", fontWeight: 600, color: "#0F172A" }}>
                            {log.actor}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{
                              fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 6,
                              background: "#EFF6FF", color: "#1E40AF"
                            }}>
                              {log.action}
                            </span>
                          </td>
                          <td style={{ padding: "14px 16px", fontWeight: 600, color: "#334155" }}>
                            {log.target}
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: 12, color: "#475569" }}>
                            <div>{log.beforeValue} ➔ <strong>{log.afterValue}</strong></div>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#64748B", fontSize: 12 }}>
                            {log.reason}
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
              TAB 10: SLA LIÊN PHÒNG BAN (GOV_CROSSDEPT COMPLETE)
              ========================================================================= */}
          {activeTab === "gov_crossdept" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#D97706", textTransform: "uppercase" }}>
                    CROSS-DEPARTMENT SLA COORDINATION & BOTTLENECK MONITOR
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "4px 0 0" }}>
                    Giám Sát SLA & Phối Hợp Xử Lý Hồ Sơ Liên Phòng Ban
                  </h1>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      departmentSLAs.forEach(d => handleUrgeDepartment(d.id));
                    }}
                    style={{ padding: "9px 18px", borderRadius: 10, background: "#EA580C", color: "#FFF", border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                  >
                    ⚡ Đốc thúc toàn khối phòng ban
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
                {departmentSLAs.map((dept) => (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDepartmentDetail(dept)}
                    style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20, cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.03)" }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{dept.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: dept.slaRate >= 97 ? "#16A34A" : "#D97706" }}>
                        {dept.slaRate}% SLA
                      </span>
                    </div>
                    <div style={{ fontSize: 12.5, color: "#64748B", marginBottom: 6 }}>
                      Trưởng bộ phận: <strong>{dept.lead}</strong> • Thời gian phản hồi TB: <strong>{dept.avgResponseHours}</strong>
                    </div>
                    <div style={{ fontSize: 12, color: "#DC2626", background: "#FEF2F2", padding: "8px 12px", borderRadius: 8, marginBottom: 12 }}>
                      ⚠️ Điểm nghẽn: {dept.topBottleneck}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: 10 }}>
                      <span style={{ fontSize: 12, color: "#64748B" }}>Tồn đọng: <strong>{dept.pending}</strong> | Quá hạn: <strong style={{ color: "#DC2626" }}>{dept.overdue}</strong></span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUrgeDepartment(dept.id);
                        }}
                        style={{ padding: "5px 12px", borderRadius: 6, background: "#FFF7ED", border: "1px solid #FDBA74", color: "#C2410C", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                      >
                        Đốc thúc
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODAL 1: APPROVAL MODAL (CORE DECISION WORKFLOW)
          ========================================================================= */}
      {selectedProposalForApproval && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 680, background: "#FFFFFF",
            borderRadius: 20, boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            overflow: "hidden", border: "1px solid #E2E8F0", animation: "scaleIn 0.2s ease-out"
          }}>
            {/* Modal Header */}
            <div style={{ padding: "18px 24px", background: "#0F172A", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#FB923C", letterSpacing: 0.8, textTransform: "uppercase" }}>
                  HỘI ĐỒNG PHÊ DUYỆT BAN GIÁM HIỆU
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2 }}>
                  Phê Duyệt Đề Xuất: {selectedProposalForApproval.id}
                </div>
              </div>
              <button
                onClick={() => setSelectedProposalForApproval(null)}
                style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 24, maxHeight: "75vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
              
              {/* Proposal Info */}
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: "0 0 6px" }}>
                  {selectedProposalForApproval.title}
                </h3>
                <div style={{ fontSize: 12.5, color: "#64748B" }}>
                  Đề xuất bởi: <strong>{selectedProposalForApproval.proposedBy}</strong> ({selectedProposalForApproval.department})
                </div>
              </div>

              {/* Financial Matrix Comparison */}
              <div style={{
                background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12,
                padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12
              }}>
                <div>
                  <div style={{ fontSize: 11.5, color: "#64748B" }}>Ngân sách hiện tại:</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#334155" }}>
                    {(selectedProposalForApproval.currentBudget / 1e9).toFixed(1)} Tỷ
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, color: "#64748B" }}>Ngân sách đề xuất:</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#EA580C" }}>
                    {(selectedProposalForApproval.proposedBudget / 1e9).toFixed(1)} Tỷ
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, color: "#64748B" }}>Chênh lệch tăng:</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: "#16A34A" }}>
                    +{selectedProposalForApproval.budgetDelta > 0 ? (selectedProposalForApproval.budgetDelta / 1e6).toLocaleString() + " Tr" : "0"}
                  </div>
                </div>
              </div>

              {/* AI Score & Recommendation */}
              {selectedProposalForApproval.aiRecommendation && (
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#B45309" }}>
                      AI DECISION SCORE: {selectedProposalForApproval.decisionScore?.overall}/10
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#92400E" }}>
                      Độ tin cậy: {selectedProposalForApproval.decisionScore?.aiConfidence}%
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#78350F", marginBottom: 4 }}>
                    {selectedProposalForApproval.aiRecommendation.headline}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "#92400E" }}>
                    {selectedProposalForApproval.aiRecommendation.evidence?.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conditional Options */}
              {isConditionalApproval && (
                <div style={{ background: "#FFF7ED", border: "1.5px dashed #FDBA74", borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#9A3412", marginBottom: 10 }}>
                    ⚙️ Thiết Lập Điều Kiện Phê Duyệt Của BOD:
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11.5, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>
                        Hạn chót nghiệm thu:
                      </label>
                      <input
                        type="date"
                        value={conditionalParams.deadline}
                        onChange={e => setConditionalParams({ ...conditionalParams, deadline: e.target.value })}
                        style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 11.5, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>
                        KPI Cam Kết Tối Thiểu:
                      </label>
                      <input
                        type="text"
                        value={conditionalParams.kpiCommitment}
                        onChange={e => setConditionalParams({ ...conditionalParams, kpiCommitment: e.target.value })}
                        style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* BOD Comment / Direction */}
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 6 }}>
                  Ý kiến chỉ đạo của Ban Giám Hiệu:
                </label>
                <textarea
                  rows={3}
                  value={approvalComment}
                  onChange={e => setApprovalComment(e.target.value)}
                  placeholder="Nhập ý kiến chỉ đạo, yêu cầu đối soát tài chính hoặc điều kiện ràng buộc..."
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 8,
                    border: "1px solid #CBD5E1", fontSize: 13, outline: "none", boxSizing: "border-box"
                  }}
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => handleRequestMoreInfo(selectedProposalForApproval)}
                style={{ padding: "9px 16px", borderRadius: 8, background: "#FFFFFF", border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer" }}
              >
                Yêu cầu bổ sung
              </button>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => handleRejectProposal(selectedProposalForApproval)}
                  style={{ padding: "9px 16px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FCA5A5", fontSize: 13, fontWeight: 700, color: "#DC2626", cursor: "pointer" }}
                >
                  Từ chối
                </button>

                <button
                  onClick={() => handleApproveProposal(selectedProposalForApproval)}
                  style={{
                    padding: "9px 24px", borderRadius: 8,
                    background: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)",
                    border: "none", color: "#FFFFFF", fontSize: 13.5, fontWeight: 800,
                    cursor: "pointer", boxShadow: "0 4px 12px rgba(234,88,12,0.35)"
                  }}
                >
                  {isConditionalApproval ? "Xác nhận Phê duyệt có điều kiện" : "Xác nhận Phê duyệt Quyết định"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DRAWER 1: KPI DRILL-DOWN DRAWER (EVERY KPI CLICKABLE)
          ========================================================================= */}
      {selectedKPIDetail && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15,23,42,0.5)", display: "flex", justifyContent: "flex-end"
        }}>
          <div style={{
            width: "100%", maxWidth: 520, background: "#FFFFFF", height: "100%",
            boxShadow: "-10px 0 35px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column"
          }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0F172A", color: "#FFF" }}>
              <div>
                <div style={{ fontSize: 11, color: "#FB923C", fontWeight: 800 }}>CHI TIẾT CHỈ SỐ KPI CHIẾN LƯỢC</div>
                <div style={{ fontSize: 17, fontWeight: 800 }}>{selectedKPIDetail.title}</div>
              </div>
              <button onClick={() => setSelectedKPIDetail(null)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Metrics Summary */}
              <div style={{ background: "#F8FAFC", borderRadius: 12, padding: 18, border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 12, color: "#64748B" }}>Giá trị thực tế / Mục tiêu:</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "4px 0" }}>
                  {selectedKPIDetail.value} <span style={{ fontSize: 14, color: selectedKPIDetail.color, fontWeight: 700 }}>({selectedKPIDetail.gap})</span>
                </div>
                <div style={{ fontSize: 12, color: "#475569" }}>{selectedKPIDetail.target}</div>
              </div>

              {/* Causes */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginBottom: 8 }}>
                  🔍 Phân tích Nguyên nhân gốc rễ (Root Causes):
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "#334155", display: "flex", flexDirection: "column", gap: 6 }}>
                  {selectedKPIDetail.causes?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* AI Recommended Action */}
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#B45309", marginBottom: 4 }}>
                  💡 Khuyến nghị hành động của AI:
                </div>
                <div style={{ fontSize: 12.5, color: "#78350F" }}>
                  {selectedKPIDetail.aiAction}
                </div>
              </div>

              {/* 4 Action Buttons */}
              <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  onClick={() => {
                    setSelectedKPIDetail(null);
                    setActiveTab("decision_center");
                  }}
                  style={{
                    padding: "11px", borderRadius: 9, background: "#EA580C",
                    border: "none", color: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer"
                  }}
                >
                  ⚡ Mở Quyết định Phê duyệt liên quan
                </button>
                <button
                  onClick={() => {
                    setSelectedKPIDetail(null);
                    setActiveTab("dss_forecast");
                  }}
                  style={{
                    padding: "10px", borderRadius: 9, background: "#F1F5F9",
                    border: "1px solid #CBD5E1", color: "#334155", fontSize: 13, fontWeight: 600, cursor: "pointer"
                  }}
                >
                  🎛️ Chạy Mô phỏng What-If
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: RISK TO ACTION WORKFLOW MODAL
          ========================================================================= */}
      {selectedRiskForAction && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{ width: "100%", maxWidth: 600, background: "#FFFFFF", borderRadius: 20, overflow: "hidden", border: "1px solid #E2E8F0" }}>
            <div style={{ padding: "18px 24px", background: "#DC2626", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Giao Việc Xử Lý Rủi Ro: {selectedRiskForAction.id}</div>
              <button onClick={() => setSelectedRiskForAction(null)} style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 12, color: "#64748B" }}>Rủi ro:</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A" }}>{selectedRiskForAction.title}</div>
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 4 }}>
                  Nhiệm vụ / Kế hoạch hành động cụ thể:
                </label>
                <textarea
                  rows={3}
                  value={riskActionPlan}
                  onChange={e => setRiskActionPlan(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Phòng ban chịu trách nhiệm:</label>
                  <input
                    type="text"
                    value={riskAssignedDept}
                    onChange={e => setRiskAssignedDept(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Người phụ trách trực tiếp:</label>
                  <input
                    type="text"
                    value={riskAssignee}
                    onChange={e => setRiskAssignee(e.target.value)}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Hạn chót hoàn thành (SLA):</label>
                <input
                  type="text"
                  value={riskDeadline}
                  onChange={e => setRiskDeadline(e.target.value)}
                  style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ padding: "14px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setSelectedRiskForAction(null)} style={{ padding: "8px 16px", borderRadius: 8, background: "#FFF", border: "1px solid #CBD5E1", fontSize: 12.5, cursor: "pointer" }}>
                Hủy
              </button>
              <button
                onClick={handleCreateActionFromRisk}
                style={{ padding: "8px 20px", borderRadius: 8, background: "#DC2626", color: "#FFF", border: "none", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
              >
                Giao việc và Bật SLA Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: NEW MAJOR PROPOSAL MODAL (MỞ NGÀNH MỚI)
          ========================================================================= */}
      {showNewMajorModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1100,
          background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 660, background: "#FFFFFF",
            borderRadius: 20, boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            overflow: "hidden", border: "1px solid #E2E8F0"
          }}>
            <div style={{ padding: "18px 24px", background: "#EA580C", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 16.5, fontWeight: 800 }}>Đề Xuất Phê Duyệt Mở Chuyên Ngành Mới</div>
              <button onClick={() => setShowNewMajorModal(false)} style={{ background: "none", border: "none", color: "#FFF", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 24, maxHeight: "75vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A", display: "block", marginBottom: 4 }}>
                  Tên chuyên ngành đào tạo:
                </label>
                <input
                  type="text"
                  value={newMajorForm.name}
                  onChange={e => setNewMajorForm({ ...newMajorForm, name: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Mã ngành / Khoa quản lý:</label>
                  <input
                    type="text"
                    value={newMajorForm.faculty}
                    onChange={e => setNewMajorForm({ ...newMajorForm, faculty: e.target.value })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Chỉ tiêu tuyển sinh năm đầu:</label>
                  <input
                    type="number"
                    value={newMajorForm.firstYearQuota}
                    onChange={e => setNewMajorForm({ ...newMajorForm, firstYearQuota: Number(e.target.value) })}
                    style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Dự toán Đầu tư (CAPEX):</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#EA580C" }}>{newMajorForm.capex}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Thời gian hòa vốn (Break-even):</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#16A34A" }}>{newMajorForm.breakEven}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Đội ngũ giảng viên cam kết:</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{newMajorForm.facultyCount}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Đối tác bảo trợ thực tập:</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>{newMajorForm.strategicPartner}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button onClick={() => setShowNewMajorModal(false)} style={{ padding: "9px 16px", borderRadius: 8, background: "#FFF", border: "1px solid #CBD5E1", fontSize: 13, cursor: "pointer" }}>
                Hủy
              </button>
              <button
                onClick={handleApproveNewMajor}
                style={{ padding: "9px 22px", borderRadius: 8, background: "#EA580C", color: "#FFF", border: "none", fontWeight: 800, fontSize: 13.5, cursor: "pointer" }}
              >
                Xác Nhận Phê Duyệt Mở Ngành (K21)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: GLOBAL COMMAND PALETTE (CTRL + K)
          ========================================================================= */}
      {showCommandPalette && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1100,
          background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh"
        }}>
          <div style={{
            width: "100%", maxWidth: 620, background: "#FFFFFF",
            borderRadius: 18, boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
            overflow: "hidden", border: "1px solid #E2E8F0"
          }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 12 }}>
              <Search size={18} color="#94A3B8" />
              <input
                type="text"
                autoFocus
                placeholder="Tìm kiếm quyết định, rủi ro, phòng ban, kịch bản What-If..."
                value={commandQuery}
                onChange={e => setCommandQuery(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", fontSize: 14, fontWeight: 500 }}
              />
              <button onClick={() => setShowCommandPalette(false)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 14, maxHeight: 340, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { title: "Phê duyệt Đề xuất Tăng ngân sách Digital Miền Tây (+800M)", category: "Decision Proposal", tab: "decision_center" },
                { title: "Xem 3 Rủi ro Tuyển sinh Nghiêm trọng (Hồ sơ ảo Miền Tây)", category: "Risk Center", tab: "gov_risk" },
                { title: "Chạy mô phỏng What-If Kịch bản Học phí & Học bổng K21", category: "Simulation", tab: "dss_forecast" },
                { title: "Phân tích Phễu Tuyển sinh & Yield Rate từng phân hiệu", category: "DSS Funnel", tab: "dss_funnel" },
                { title: "Xem Hiệu quả Kênh Marketing & Chi phí CAC 2.4 Tr/SV", category: "Marketing ROI", tab: "dss_marketing" },
                { title: "Đề xuất Mở Ngành Bán dẫn & Vi mạch Semiconductor", category: "Trends & Majors", tab: "dss_trends" },
                { title: "Kế hoạch Tài chính 5 Năm & Đầu tư Hạ tầng Lab GPU Hòa Lạc", category: "Finance & CAPEX", tab: "gov_finance" },
                { title: "Xem tiến độ giải ngân & SLA Ban Tài chính (97.6% SLA)", category: "SLA Coordination", tab: "gov_crossdept" },
              ].map((cmd, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setActiveTab(cmd.tab);
                    setShowCommandPalette(false);
                  }}
                  style={{
                    padding: "10px 14px", borderRadius: 8, background: "#F8FAFC",
                    display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer"
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{cmd.title}</span>
                  <span style={{ fontSize: 11, color: "#64748B", background: "#E2E8F0", padding: "2px 8px", borderRadius: 4 }}>
                    {cmd.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DRAWER 2: DECISION HISTORY & TIMELINE DRAWER
          ========================================================================= */}
      {selectedDecisionForHistory && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: "rgba(15,23,42,0.5)", display: "flex", justifyContent: "flex-end"
        }}>
          <div style={{
            width: "100%", maxWidth: 540, background: "#FFFFFF", height: "100%",
            boxShadow: "-10px 0 35px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column"
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0F172A", color: "#FFF" }}>
              <div>
                <div style={{ fontSize: 11, color: "#FB923C", fontWeight: 800 }}>DECISION TIMELINE & WORKFLOW</div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{selectedDecisionForHistory.decisionId}</div>
              </div>
              <button onClick={() => setSelectedDecisionForHistory(null)} style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: 24, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 18 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                {selectedDecisionForHistory.title}
              </h3>

              {/* Timeline Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, borderLeft: "2px solid #E2E8F0", paddingLeft: 18, marginLeft: 8 }}>
                {[
                  { time: "19/08 09:30", title: "Tạo đề xuất mới", desc: "Ban Tuyển sinh lập tờ trình bổ sung ngân sách", done: true },
                  { time: "19/08 10:45", title: "Ban Tài chính thẩm định", desc: "Xác nhận nguồn tiền dự phòng Q3 khả dụng", done: true },
                  { time: "19/08 11:30", title: "BOD Phê duyệt Quyết định", desc: "TS. Hoàng Việt Hà ký duyệt quyết định số DEC-2026-00124", done: true },
                  { time: "19/08 11:35", title: "Tự động phân bổ nhiệm vụ liên phòng", desc: "Tạo 4 Tasks cho Finance, Marketing, Admission, Data/BI", done: true },
                  { time: "Đang diễn ra", title: "Thực thi & Giám sát SLA", desc: "Marketing đang chạy ads TikTok, Tuyển sinh gọi tư vấn 1-1", done: false },
                ].map((st, i) => (
                  <div key={i} style={{ position: "relative" }}>
                    <div style={{
                      position: "absolute", left: -25, top: 2,
                      width: 12, height: 12, borderRadius: "50%",
                      background: st.done ? "#16A34A" : "#EA580C"
                    }} />
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{st.time}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{st.title}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{st.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS Animation Helpers */}
      <style>{`
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
