import React, { useState, useEffect, useMemo } from "react";
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
  Upload, FileUp, AlertOctagon, CheckCircle2, ChevronUp,
  MoveUp, MoveDown, Trash2, Plus, PhoneCall, QrCode, FileCheck
} from "lucide-react";

// Sub-components
import StepPersonalInfo from "../../components/Candidate/StepPersonalInfo";
import StepAdmissionMethod from "../../components/Candidate/StepAdmissionMethod";
import StepAcademicInfo from "../../components/Candidate/StepAcademicInfo";
import StepCertificates from "../../components/Candidate/StepCertificates";
import StepDocumentManagement from "../../components/Candidate/StepDocumentManagement";
import StepPreferences from "../../components/Candidate/StepPreferences";
import StepEligibilityCheck from "../../components/Candidate/StepEligibilityCheck";
import StepReviewAndSubmit from "../../components/Candidate/StepReviewAndSubmit";
import ReviewerSimulatorModal from "../../components/Candidate/ReviewerSimulatorModal";
import FeePaymentModal from "../../components/Candidate/FeePaymentModal";
import CampusExplorer360 from "../../components/Candidate/CampusExplorer360";
import NotificationDrawer from "../../components/Candidate/NotificationDrawer";
import EnrollmentRegistrationModal from "../../components/Candidate/EnrollmentRegistrationModal";

// Engine & Data
import {
  loadApplicationState, saveApplicationState, calculateApplicationProgress,
  generateActionableTasks, getInitialNotifications, logAuditEvent
} from "../../services/candidateAdmissionEngine";
import { CAMPUSES, MAJORS, ADMISSION_METHODS } from "../../data/admissionRulesData";

export default function FPTCandidatePortal() {
  const navigate = useNavigate();

  // Active Main Navigation Tab
  // "dashboard" | "application_wizard" | "aspirations" | "documents" | "campus_life"
  const [activeTab, setActiveTab] = useState("dashboard");

  // Application Wizard Step (0 to 7)
  // 0: Personal Info | 1: Methods | 2: Academic | 3: Certs | 4: Docs | 5: Preferences | 6: Eligibility | 7: Review & Submit
  const [wizardStep, setWizardStep] = useState(0);

  // Application State
  const [application, setApplication] = useState(loadApplicationState);

  // Auto-Save Indicator
  const [lastSavedTime, setLastSavedTime] = useState(new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));

  // Notifications State
  const [notifications, setNotifications] = useState(getInitialNotifications);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Modals State
  const [isReviewerModalOpen, setIsReviewerModalOpen] = useState(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auto-Save Effect (Debounced saving to LocalStorage)
  useEffect(() => {
    const handler = setTimeout(() => {
      saveApplicationState(application);
      setLastSavedTime(new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }));
    }, 800);
    return () => clearTimeout(handler);
  }, [application]);

  // Derived Progress Calculation
  const progressData = useMemo(() => calculateApplicationProgress(application), [application]);
  const actionableTasks = useMemo(() => generateActionableTasks(application), [application]);
  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Search Filter Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results = [];

    // Search Application ID
    if (application.applicationId?.toLowerCase().includes(q)) {
      results.push({ type: "Mã Hồ Sơ", title: `Hồ sơ ${application.applicationId}`, target: "dashboard" });
    }

    // Search Majors
    MAJORS.forEach(m => {
      if (m.name.toLowerCase().includes(q) || m.code.includes(q)) {
        results.push({ type: "Ngành học", title: `${m.name} (${m.code})`, target: "aspirations" });
      }
    });

    // Search Campuses
    CAMPUSES.forEach(c => {
      if (c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)) {
        results.push({ type: "Cơ sở", title: c.name, target: "campus_life" });
      }
    });

    // Search Methods
    ADMISSION_METHODS.forEach(meth => {
      if (meth.name.toLowerCase().includes(q)) {
        results.push({ type: "Phương thức", title: meth.name, target: "application_wizard", step: 1 });
      }
    });

    return results.slice(0, 6);
  }, [searchQuery, application.applicationId]);

  // Wizard Steps Metadata
  const WIZARD_STEPS = [
    { num: 1, title: "Cá nhân", desc: "Thông tin định danh" },
    { num: 2, title: "Phương thức", desc: "Chọn cách xét tuyển" },
    { num: 3, title: "Học tập", desc: "Điểm THPT & Học bạ" },
    { num: 4, title: "Chứng chỉ", desc: "IELTS / Giải thưởng" },
    { num: 5, title: "Giấy tờ", desc: "Tải lên minh chứng" },
    { num: 6, title: "Nguyện vọng", desc: "Chọn ngành & Campus" },
    { num: 7, title: "Điều kiện", desc: "Eligibility Check" },
    { num: 8, title: "Nộp hồ sơ", desc: "Rà soát & Hoàn tất" },
  ];

  // Helper to jump to a wizard step
  const handleJumpToStep = (stepIdx) => {
    setActiveTab("application_wizard");
    setWizardStep(stepIdx);
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#F8FAFC", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div style={{
          position: "fixed", top: 20, right: 28, zIndex: 9999,
          background: toastMessage.type === "success" ? "#0F172A" : toastMessage.type === "warning" ? "#B45309" : "#B91C1C",
          color: "#FFFFFF", padding: "12px 20px", borderRadius: 10,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)", display: "flex",
          alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600
        }}>
          <CheckCircle size={17} color={toastMessage.type === "success" ? "#4ADE80" : "#FBBF24"} />
          {toastMessage.text}
        </div>
      )}

      {/* ── SIDEBAR CỔNG THÍ SINH FPT UNIVERSITY ── */}
      <aside style={{
        width: 250, background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        flexShrink: 0, zIndex: 30
      }}>
        <div>
          {/* Brand Header */}
          <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #F1F5F9" }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "#EA580C", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FFFFFF", fontWeight: 900,
              fontSize: 18, boxShadow: "0 2px 8px rgba(234,88,12,0.3)"
            }}>
              F
            </div>
            <div>
              <div style={{ fontSize: 15.5, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.2px", lineHeight: 1.15 }}>
                Tuyển Sinh Đại Học FPT
              </div>
              <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, marginTop: 2, letterSpacing: "0.5px" }}>
                CỔNG THÍ SINH TRỰC TUYẾN 2026
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: "12px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Tổng Quan Hồ Sơ", desc: "Tiến độ & Nhiệm vụ" },
              { id: "application_wizard", icon: UserPlus, label: "Khai Báo & Nộp Hồ Sơ", desc: "8 Bước hoàn thiện", badge: `${progressData.totalPercent}%` },
              { id: "aspirations", icon: Target, label: "Đặt Nguyện Vọng", desc: "Xếp thứ tự ưu tiên", badge: "MỚI" },
              { id: "documents", icon: FileText, label: "Quản Lý Giấy Tờ", desc: "Minh chứng & Xác minh" },
              { id: "campus_life", icon: Building, label: "Khám Phá Cơ Sở 360", desc: "5 Campus FPTU" },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "documents") {
                      setWizardStep(4);
                    }
                  }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", borderRadius: 8, fontSize: 12.5,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#FFFFFF" : "#475569",
                    background: isActive ? "#EA580C" : "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <tab.icon size={16} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#FFFFFF" : "#64748B"} />
                  <span style={{ flex: 1 }}>{tab.label}</span>
                  {tab.badge && (
                    <span style={{ fontSize: 9.5, fontWeight: 800, background: isActive ? "#FFFFFF" : "#FFEDD5", color: isActive ? "#EA580C" : "#9A3412", padding: "1px 6px", borderRadius: 4 }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & Reviewer Simulator Tool */}
        <div style={{ padding: "12px 14px 18px", borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Reviewer Simulation Tool */}
          <button
            onClick={() => setIsReviewerModalOpen(true)}
            style={{
              width: "100%", padding: "7px 10px", borderRadius: 6,
              background: "#FEF3C7", color: "#B45309", border: "1px solid #FDE68A",
              fontSize: 11.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
            }}
          >
            <ShieldAlert size={14} /> Giả Lập Cán Bộ Tuyển Sinh
          </button>

          <button
            onClick={() => {
              setActiveTab("application_wizard");
              setWizardStep(7); // Review and submit
            }}
            style={{
              width: "100%", padding: "10px", borderRadius: 8,
              background: "#EA580C", color: "#FFFFFF", border: "none",
              fontWeight: 800, fontSize: 13, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(234,88,12,0.3)"
            }}
          >
            {application.status === "SUBMITTED" ? "Xem Phiếu Nộp Hồ Sơ" : "Nộp Hồ Sơ Ngay"}
          </button>

          <button
            onClick={() => navigate("/login")}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "6px 8px", border: "none", background: "transparent", fontSize: 12, color: "#DC2626", fontWeight: 700, cursor: "pointer" }}
          >
            <LogOut size={15} /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main style={{ flex: 1, height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* ── TOP HEADER NAVBAR ── */}
        <header style={{
          height: 60, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
          padding: "0 28px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 20
        }}>
          {/* Search Box with Autocomplete */}
          <div style={{ position: "relative", width: 300 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#F1F5F9", borderRadius: 20, padding: "6px 14px"
            }}>
              <Search size={14} color="#94A3B8" />
              <input
                type="text"
                placeholder="Tìm mã hồ sơ, ngành học, cơ sở..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 12.5, width: "100%", color: "#334155" }}
              />
              {searchQuery && (
                <X size={13} color="#94A3B8" style={{ cursor: "pointer" }} onClick={() => setSearchQuery("")} />
              )}
            </div>

            {/* Search Dropdown Popup */}
            {showSearchResults && searchResults.length > 0 && (
              <div style={{
                position: "absolute", top: 40, left: 0, right: 0,
                background: "#FFFFFF", borderRadius: 10, border: "1px solid #E2E8F0",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)", padding: 6, zIndex: 50,
                display: "flex", flexDirection: "column", gap: 2
              }}>
                {searchResults.map((res, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveTab(res.target);
                      if (res.step !== undefined) setWizardStep(res.step);
                      setShowSearchResults(false);
                      setSearchQuery("");
                    }}
                    style={{
                      padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                      fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <div>
                      <span style={{ fontSize: 10, background: "#FFEDD5", color: "#EA580C", padding: "1px 5px", borderRadius: 3, fontWeight: 700, marginRight: 6 }}>
                        {res.type}
                      </span>
                      <strong style={{ color: "#0F172A" }}>{res.title}</strong>
                    </div>
                    <ChevronRight size={13} color="#94A3B8" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Auto Save Pill */}
            <div style={{ fontSize: 11.5, color: "#16A34A", background: "#DCFCE7", padding: "4px 10px", borderRadius: 100, fontWeight: 700, display: "flex", alignItems: "center", gap: 5 }}>
              <Check size={13} /> Đã lưu tự động lúc {lastSavedTime}
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B", position: "relative" }}
            >
              <Bell size={19} />
              {unreadNotificationCount > 0 && (
                <span style={{
                  position: "absolute", top: -2, right: -2, width: 16, height: 16,
                  borderRadius: "50%", background: "#DC2626", color: "#FFF",
                  fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Hotline Help */}
            <button
              onClick={() => showToast("Tổng đài Tuyển sinh Đại học FPT: 1800 1234 (Miễn phí 24/7)")}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}
            >
              <HelpCircle size={19} />
            </button>

            {/* Avatar Pill */}
            <div
              onClick={() => {
                setActiveTab("application_wizard");
                setWizardStep(0);
              }}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "4px 10px 4px 6px",
                borderRadius: 20, background: "#F1F5F9", cursor: "pointer", border: "1px solid #E2E8F0"
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#FFEDD5", color: "#EA580C", display: "flex",
                alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11
              }}>
                VA
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#334155" }}>
                {application.personalInfo?.fullName || "Nguyễn Văn An"}
              </span>
            </div>
          </div>
        </header>

        {/* ── MAIN BODY VIEWS ── */}
        <div style={{ flex: 1, padding: "24px 32px 48px", maxWidth: 1400, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

          {/* =========================================================================
              VIEW 1: DASHBOARD THÍ SINH (Ảnh 1 & 4 + Real-time Task Engine)
             ========================================================================= */}
          {activeTab === "dashboard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Welcome & Admission Success Banner */}
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                  Chào buổi sáng, {application.personalInfo?.fullName || "Nguyễn Văn An"}! 👋
                </h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                  Theo dõi tiến độ, hoàn tất các nhiệm vụ cần làm để nhận Giấy báo trúng tuyển chính thức vào Đại học FPT.
                </p>
              </div>

              {/* Congratulatory & Enrollment Form Banner when verified */}
              {(application.status === "VERIFIED_AND_COMPLETE" || application.status === "ADMITTED" || application.status === "VERIFIED") && (
                <div style={{
                  background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
                  borderRadius: 14, border: "1px solid #A7F3D0", padding: "18px 22px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.12)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, background: "#059669",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 10px rgba(5, 150, 105, 0.3)"
                    }}>
                      <Award size={26} color="#FFFFFF" />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#065F46" }}>
                        🎉 Chúc mừng! Hồ sơ của bạn đã được Cán bộ Tuyển sinh xác thực ĐẦY ĐỦ YÊU CẦU!
                      </div>
                      <div style={{ fontSize: 12.5, color: "#047857", marginTop: 2 }}>
                        Mẫu <strong>Phiếu Đăng Ký Đại Học FPT (Hệ đại học chính quy)</strong> đã được gửi tới tài khoản. Vui lòng mở và ký xác nhận để hoàn tất thủ tục nhập học.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEnrollmentModalOpen(true)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                      borderRadius: 8, background: "#059669", color: "#FFFFFF",
                      border: "none", fontSize: 13, fontWeight: 800, cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(5, 150, 105, 0.3)", whiteSpace: "nowrap"
                    }}
                  >
                    <FileCheck size={17} /> Mở Phiếu Đăng Ký
                  </button>
                </div>
              )}

              {/* Top Row: Progress Bar + Actionable Tasks */}
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.2fr", gap: 18 }}>

                {/* Progress Card (Weighted based) */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <div>
                        <strong style={{ fontSize: 15.5, color: "#0F172A" }}>Tiến độ nộp hồ sơ tuyển sinh</strong>
                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Mã hồ sơ: <strong style={{ fontFamily: "monospace" }}>{application.applicationId}</strong></div>
                      </div>
                      <div style={{ fontSize: 34, fontWeight: 900, color: "#EA580C" }}>
                        {progressData.totalPercent}%
                      </div>
                    </div>

                    <div style={{ width: "100%", height: 8, borderRadius: 4, background: "#0F172A", overflow: "hidden", margin: "14px 0 12px" }}>
                      <div style={{ width: `${progressData.totalPercent}%`, height: "100%", background: "#EA580C", transition: "width 0.4s ease" }} />
                    </div>
                  </div>

                  {/* Section status badges */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, fontSize: 11.5, fontWeight: 600, color: "#64748B", paddingTop: 10, borderTop: "1px solid #F1F5F9" }}>
                    <span>Cá nhân: <strong style={{ color: "#16A34A" }}>{progressData.breakdown.personal}/15%</strong></span>
                    <span>Học bạ: <strong style={{ color: "#EA580C" }}>{progressData.breakdown.academic}/20%</strong></span>
                    <span>Giấy tờ: <strong style={{ color: progressData.breakdown.documents >= 15 ? "#16A34A" : "#DC2626" }}>{progressData.breakdown.documents}/20%</strong></span>
                    <span>Nguyện vọng: <strong style={{ color: "#16A34A" }}>{progressData.breakdown.preferences}/10%</strong></span>
                  </div>
                </div>

                {/* Actionable Tasks ("Việc Cần Làm Ngay") */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 900, color: "#0F172A" }}>
                      <AlertCircle size={17} color="#DC2626" />
                      Việc Cần Làm Ngay ({actionableTasks.length})
                    </div>
                    <span style={{ fontSize: 11, color: "#64748B" }}>Tự động cập nhật</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {actionableTasks.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "16px", color: "#16A34A", fontSize: 12.5, fontWeight: 700 }}>
                        ✓ Bạn đã hoàn thành tất cả nhiệm vụ hồ sơ!
                      </div>
                    ) : (
                      actionableTasks.map(task => (
                        <div
                          key={task.id}
                          style={{
                            padding: "10px 14px", borderRadius: 8,
                            background: task.priority === "HIGH" ? "#FFF1F2" : "#FFF7ED",
                            border: task.priority === "HIGH" ? "1px solid #FFE4E6" : "1px solid #FED7AA",
                            display: "flex", alignItems: "center", justifyContent: "space-between"
                          }}
                        >
                          <div style={{ maxWidth: "72%" }}>
                            <strong style={{ color: "#0F172A", display: "block", fontSize: 12.5 }}>{task.title}</strong>
                            <span style={{ fontSize: 11, color: "#64748B", display: "block", lineHeight: 1.3 }}>{task.description}</span>
                          </div>

                          <button
                            onClick={() => {
                              if (task.targetTab === "enrollment_form") {
                                setIsEnrollmentModalOpen(true);
                              } else if (task.targetTab === "documents") {
                                handleJumpToStep(4);
                              } else if (task.targetTab === "review_and_submit") {
                                handleJumpToStep(7);
                              } else {
                                setActiveTab(task.targetTab);
                              }
                            }}
                            style={{
                              padding: "6px 12px", borderRadius: 6,
                              background: task.priorityColor, color: "#FFF", border: "none",
                              fontSize: 11.5, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap"
                            }}
                          >
                            {task.actionText}
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Bottom Row: Interview / Scholarship Schedule + Campus Explorer Preview */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 18 }}>

                {/* Interview Card */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <strong style={{ fontSize: 14, color: "#0F172A" }}>Lịch Phỏng Vấn Học Bổng FPTU</strong>
                    <Calendar size={16} color="#2563EB" />
                  </div>

                  <div style={{ textAlign: "center", padding: "6px 0" }}>
                    <div style={{ fontSize: 38, fontWeight: 900, color: "#1D4ED8", lineHeight: 1 }}>15</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#64748B", letterSpacing: "1px", marginTop: 4 }}>THÁNG 8</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#475569", margin: "10px 0 14px" }}>
                    <div>⏰ <strong>09:00 AM - 09:30 AM</strong></div>
                    <div>📍 Phòng 402, Tòa Alpha (Campus Hòa Lạc)</div>
                    <div>👥 Hội đồng xét tuyển & Học bổng FPT</div>
                  </div>

                  <button
                    onClick={() => showToast("Đã gửi thông tin phòng thi và sơ đồ Tòa Alpha qua email của bạn!")}
                    style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #2563EB", background: "#FFF", color: "#2563EB", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                  >
                    Xem Chi Tiết & Sơ Đồ Phòng Phỏng Vấn
                  </button>
                </div>

                {/* Campus Preview Card */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <strong style={{ fontSize: 14, color: "#0F172A" }}>Khám phá Cơ sở Đào tạo FPT 360°</strong>
                    <span onClick={() => setActiveTab("campus_life")} style={{ color: "#9A3412", cursor: "pointer", fontWeight: 700, fontSize: 12.5 }}>
                      Xem tất cả 5 cơ sở →
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div
                      onClick={() => setActiveTab("campus_life")}
                      style={{
                        height: 140, borderRadius: 8, cursor: "pointer",
                        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%), url(${CAMPUSES[0].image})`,
                        backgroundSize: "cover", padding: "12px", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#FFF"
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 800 }}>FPT Hà Nội (Hòa Lạc)</div>
                      <div style={{ fontSize: 11, color: "#CBD5E1", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <Eye size={12} /> Tòa nhà Alpha & KTX Xanh
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab("campus_life")}
                      style={{
                        height: 140, borderRadius: 8, cursor: "pointer",
                        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%), url(${CAMPUSES[1].image})`,
                        backgroundSize: "cover", padding: "12px", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#FFF"
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 800 }}>FPT TP.HCM (Thủ Đức)</div>
                      <div style={{ fontSize: 11, color: "#CBD5E1", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <Eye size={12} /> Khu CNC High-Tech Hub
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              VIEW 2: WIZARD 8 BƯỚC NỘP HỒ SƠ CHÍNH THỨC
             ========================================================================= */}
          {activeTab === "application_wizard" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Stepper Navigation Bar */}
              <div style={{
                background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", padding: "16px 20px",
                display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8
              }}>
                {WIZARD_STEPS.map((st, idx) => {
                  const isCurrent = wizardStep === idx;
                  const isDone = wizardStep > idx;

                  return (
                    <button
                      key={st.num}
                      onClick={() => setWizardStep(idx)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        padding: "8px 4px", borderRadius: 8, border: "none",
                        background: isCurrent ? "#FFF7ED" : "transparent",
                        cursor: "pointer", transition: "all 0.15s ease"
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: isCurrent ? "#EA580C" : isDone ? "#16A34A" : "#F1F5F9",
                        color: isCurrent || isDone ? "#FFF" : "#64748B",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 900, fontSize: 12, marginBottom: 4
                      }}>
                        {isDone ? "✓" : st.num}
                      </div>
                      <span style={{ fontSize: 11.5, fontWeight: isCurrent ? 800 : 600, color: isCurrent ? "#9A3412" : isDone ? "#16A34A" : "#64748B", whiteSpace: "nowrap" }}>
                        {st.title}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Step Content Routers */}
              {wizardStep === 0 && (
                <StepPersonalInfo
                  application={application}
                  setApplication={setApplication}
                  onSaveAndNext={() => setWizardStep(1)}
                  showToast={showToast}
                />
              )}

              {wizardStep === 1 && (
                <StepAdmissionMethod
                  application={application}
                  setApplication={setApplication}
                  onSaveAndNext={() => setWizardStep(2)}
                  onBack={() => setWizardStep(0)}
                  showToast={showToast}
                />
              )}

              {wizardStep === 2 && (
                <StepAcademicInfo
                  application={application}
                  setApplication={setApplication}
                  onSaveAndNext={() => setWizardStep(3)}
                  onBack={() => setWizardStep(1)}
                  showToast={showToast}
                />
              )}

              {wizardStep === 3 && (
                <StepCertificates
                  application={application}
                  setApplication={setApplication}
                  onSaveAndNext={() => setWizardStep(4)}
                  onBack={() => setWizardStep(2)}
                  showToast={showToast}
                />
              )}

              {wizardStep === 4 && (
                <StepDocumentManagement
                  application={application}
                  setApplication={setApplication}
                  onSaveAndNext={() => setWizardStep(5)}
                  onBack={() => setWizardStep(3)}
                  showToast={showToast}
                />
              )}

              {wizardStep === 5 && (
                <StepPreferences
                  application={application}
                  setApplication={setApplication}
                  onSaveAndNext={() => setWizardStep(6)}
                  onBack={() => setWizardStep(4)}
                  showToast={showToast}
                />
              )}

              {wizardStep === 6 && (
                <StepEligibilityCheck
                  application={application}
                  setApplication={setApplication}
                  onSaveAndNext={() => setWizardStep(7)}
                  onBack={() => setWizardStep(5)}
                  onJumpToStep={(stepIdx) => setWizardStep(stepIdx)}
                  showToast={showToast}
                />
              )}

              {wizardStep === 7 && (
                <StepReviewAndSubmit
                  application={application}
                  setApplication={setApplication}
                  onBack={() => setWizardStep(6)}
                  showToast={showToast}
                  onOpenPaymentModal={() => setIsFeeModalOpen(true)}
                />
              )}
            </div>
          )}

          {/* =========================================================================
              VIEW 3: ĐẶT & SẮP XẾP NGUYỆN VỌNG (DIRECT ACCESS)
             ========================================================================= */}
          {activeTab === "aspirations" && (
            <StepPreferences
              application={application}
              setApplication={setApplication}
              onSaveAndNext={() => {
                setActiveTab("application_wizard");
                setWizardStep(6); // Step 7: Eligibility Check
              }}
              onBack={() => setActiveTab("dashboard")}
              showToast={showToast}
            />
          )}

          {/* =========================================================================
              VIEW 4: QUẢN LÝ GIẤY TỜ & MINH CHỨNG (DOCUMENTS)
             ========================================================================= */}
          {activeTab === "documents" && (
            <StepDocumentManagement
              application={application}
              setApplication={setApplication}
              onSaveAndNext={() => {
                setActiveTab("application_wizard");
                setWizardStep(5);
              }}
              onBack={() => setActiveTab("dashboard")}
              showToast={showToast}
            />
          )}

          {/* =========================================================================
              VIEW 5: KHÁM PHÁ CƠ SỞ ĐÀO TẠO 360
             ========================================================================= */}
          {activeTab === "campus_life" && (
            <CampusExplorer360
              onSelectCampusForAspiration={(campusId, majorId) => {
                setActiveTab("aspirations");
                showToast("Đã chuyển sang bảng Đặt Nguyện Vọng để đăng ký ngành học tại cơ sở vừa chọn!");
              }}
              showToast={showToast}
            />
          )}

        </div>
      </main>

      {/* ── MODALS & DRAWERS ── */}
      {/* 1. Reviewer Simulator Modal */}
      <ReviewerSimulatorModal
        isOpen={isReviewerModalOpen}
        onClose={() => setIsReviewerModalOpen(false)}
        application={application}
        setApplication={setApplication}
        showToast={showToast}
      />

      {/* 2. Fee Payment Modal */}
      <FeePaymentModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        application={application}
        setApplication={setApplication}
        showToast={showToast}
      />

      {/* 3. Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
          showToast("Đã đánh dấu tất cả thông báo là đã đọc.");
        }}
        onSelectNotification={(notif) => {
          setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
          setIsNotificationOpen(false);
          if (notif.targetTab === "enrollment_form") {
            setIsEnrollmentModalOpen(true);
          } else if (notif.targetTab === "documents") {
            handleJumpToStep(4);
          } else {
            setActiveTab(notif.targetTab || "dashboard");
          }
        }}
      />

      {/* 4. Official Enrollment Registration Modal */}
      <EnrollmentRegistrationModal
        isOpen={isEnrollmentModalOpen}
        onClose={() => setIsEnrollmentModalOpen(false)}
        application={application}
        onConfirmEnrollment={() => {
          const nextApp = {
            ...application,
            status: "ADMITTED",
            confirmation: {
              ...application.confirmation,
              enrolledConfirmed: true,
              confirmedAt: new Date().toLocaleString("vi-VN")
            }
          };
          setApplication(nextApp);
          saveApplicationState(nextApp);
          logAuditEvent("CANDIDATE_SUBMIT_ENROLLMENT_FORM", "Thí sinh đã ký xác nhận nộp Phiếu Đăng Ký Đại Học FPT chính quy.", "Applicant");
          setIsEnrollmentModalOpen(false);
          showToast("🎉 Chúc mừng! Bạn đã hoàn tất ký nộp Phiếu Đăng Ký Đại Học FPT.");
        }}
        showToast={showToast}
      />

    </div>
  );
}

