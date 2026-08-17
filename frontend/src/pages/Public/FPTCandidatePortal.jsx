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
  Upload, FileUp, AlertOctagon, CheckCircle2, ChevronUp,
  MoveUp, MoveDown, Trash2, Plus, PhoneCall
} from "lucide-react";
import * as XLSX from "xlsx";

export default function FPTCandidatePortal() {
  const navigate = useNavigate();

  // Active Tab State (Khớp 4 ảnh của Thí Sinh + Tính năng Đặt Nguyện vọng & Lọc ảo Bộ GD&ĐT):
  // 1. "dashboard": Tổng quan Hồ sơ & Lịch phỏng vấn (Ảnh 1 & 4)
  // 2. "registration_steps": Hành trình Nộp hồ sơ 4 bước (Ảnh 3)
  // 3. "aspirations": Đặt & Sắp xếp Nguyện Vọng Tuyển sinh (Tính năng Đặt Nguyện Vọng)
  // 4. "moet_virtual_filter": Hệ Thống Lọc Ảo Bộ GD&ĐT (MOET API Virtual Filtering Engine)
  // 5. "documents": Quản lý Tài liệu & Giấy tờ (Ảnh 2 & 4)
  // 6. "campus_life": Khám phá Cơ sở Đào tạo FPTU 360 (Ảnh 1)
  const [activeTab, setActiveTab] = useState("dashboard");

  // State Thông tin thí sinh
  const [candidateProfile, setCandidateProfile] = useState({
    name: "Nguyễn Văn A",
    dob: "15/08/2005",
    citizenId: "001205019842",
    sbd: "01004589", // Số báo danh THPT
    email: "nguyenvana.fpt@gmail.com",
    phone: "0912345678",
    highSchool: "THPT Chuyên Hà Nội - Amsterdam",
    gpa12: 8.8,
    math12: 8.5,
    physics12: 8.9,
    english12: 8.9,
    thptScore: { math: 8.8, physics: 8.5, english: 9.2, total: 26.5 },
    progress: 65, // %
  });

  // State Danh sách Nguyện Vọng Thí sinh đặt vào FPT
  const [aspirations, setAspirations] = useState([
    {
      id: 1,
      priority: 1,
      majorCode: "7480103",
      majorName: "Kỹ thuật Phần mềm (Software Engineering)",
      campus: "FPT Hà Nội (Khu CNC Hòa Lạc)",
      method: "Xét điểm thi THPT (Khối A00, A01, D01)",
      benchmarkScore: 24.5,
      myScore: 26.5,
      status: "Đạt ngưỡng xét tuyển",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7"
    },
    {
      id: 2,
      priority: 2,
      majorCode: "7480107",
      majorName: "Trí tuệ Nhân tạo (Artificial Intelligence)",
      campus: "FPT Quy Nhơn (AI Center)",
      method: "Xét Học bạ THPT (Top 30 SchoolRank)",
      benchmarkScore: 25.0,
      myScore: 26.2,
      status: "Đạt ngưỡng xét tuyển",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7"
    },
    {
      id: 3,
      priority: 3,
      majorCode: "7340120",
      majorName: "Thiết kế Vi mạch Bán dẫn (Semiconductor)",
      campus: "FPT TP.HCM (Khu CNC TP.Thủ Đức)",
      method: "Xét điểm thi Đánh giá Năng lực (ĐHQG)",
      benchmarkScore: 800,
      myScore: 880,
      status: "Đạt ngưỡng xét tuyển",
      statusColor: "#16A34A",
      statusBg: "#DCFCE7"
    }
  ]);

  // State Quản lý Tài liệu (Ảnh 2 & 4)
  const [documents, setDocuments] = useState([
    { id: "doc1", title: "National ID / Passport (CMND / CCCD)", sub: "Uploaded on Sep 12, 2023 • Bản sao công chứng", status: "Verified", color: "#16A34A", bg: "#DCFCE7" },
    { id: "doc2", title: "Academic Transcript (Học bạ THPT)", sub: "Uploaded on Sep 14, 2023 • Bản sao công chứng", status: "Pending Review", color: "#D97706", bg: "#FEF3C7" },
    { id: "doc3", title: "Portrait Photo (Ảnh chân dung 3x4)", sub: "Issue: Image is blurry. Ảnh mờ, vui lòng tải lại.", status: "Needs Update", color: "#DC2626", bg: "#FEE2E2", needsUpload: true },
  ]);

  // State Giả Lập Lọc Ảo Bộ Giáo Dục & Đào Tạo (MOET Virtual Filtering Engine)
  const [moetFilteringState, setMoetFilteringState] = useState({
    isRunning: false,
    currentRound: 0,
    totalRounds: 6,
    logs: [],
    finalResult: null,
  });

  // State FAQ accordion
  const [openFaq, setOpenFaq] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Thao tác đổi thứ tự nguyện vọng (Lên / Xuống)
  const moveAspiration = (index, direction) => {
    const newItems = [...aspirations];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Cập nhật lại số thứ tự priority
    newItems.forEach((item, idx) => {
      item.priority = idx + 1;
    });

    setAspirations(newItems);
    showToast(`Đã thay đổi thứ tự: Nguyện vọng 1 hiện tại là ${newItems[0].majorName}`);
  };

  // Kích hoạt Chạy Thuật Toán Lọc Ảo Bộ GD&ĐT (MOET API)
  const runMOETVirtualFilter = () => {
    setMoetFilteringState({
      isRunning: true,
      currentRound: 1,
      totalRounds: 6,
      logs: ["📡 [API MOET] Kết nối thành công tới Cổng Tuyển sinh Quốc gia (thisinh.thitotnghiepthpt.edu.vn)..."],
      finalResult: null,
    });

    const steps = [
      { round: 1, log: "🔄 [Lọc ảo Đợt 1 - Toàn quốc] Đối soát thông tin SBD 01004589 với 1,024,000 thí sinh cả nước..." },
      { round: 2, log: "🔍 [Lọc ảo Đợt 2 - Nhóm trường phía Bắc] Xác định điểm chuẩn sơ bộ khối A00/A01 của FPT University (24.5đ)..." },
      { round: 3, log: "⚖️ [Lọc ảo Đợt 3 - Xử lý thí sinh ảo] Loại bỏ các trường hợp trúng tuyển nguyện vọng cao hơn tại ĐH Bách Khoa, ĐHQG..." },
      { round: 4, log: "📊 [Lọc ảo Đợt 4 - Chốt chỉ tiêu theo ngành] Khớp dữ liệu ngành Kỹ thuật Phần mềm (Mã: 7480103)..." },
      { round: 5, log: "🎯 [Lọc ảo Đợt 5 - Xác thực học bổng] Áp dụng mức điểm 26.5đ > Điểm sàn 24.5đ (+ Học bổng FPT 30%)..." },
      { round: 6, log: "✅ [Lọc ảo Đợt 6 - Khóa dữ liệu Quốc gia] XÁC NHẬN TRÚNG TUYỂN CHÍNH THỨC NGUYỆN VỌNG 1 VÀO ĐẠI HỌC FPT!" },
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setMoetFilteringState(prev => ({
          ...prev,
          currentRound: step.round,
          logs: [...prev.logs, step.log],
          isRunning: step.round < 6,
          finalResult: step.round === 6 ? {
            status: "TRÚNG TUYỂN CHÍNH THỨC",
            major: aspirations[0].majorName,
            majorCode: aspirations[0].majorCode,
            campus: aspirations[0].campus,
            priority: 1,
            score: candidateProfile.thptScore.total,
            scholarship: "Học bổng Tài năng 30% (Khóa 21)",
            admissionCode: "FPTU-2024-K21-8912",
            deadline: "17:00 ngày 25/08/2024"
          } : null
        }));

        if (step.round === 6) {
          showToast("🎉 Chúc mừng! Bạn đã trúng tuyển chính thức vào Đại học FPT!", "success");
        }
      }, (idx + 1) * 900);
    });
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

      {/* ── SIDEBAR CỔNG THÍ SINH (KHỚP 100% CẢ 4 ẢNH) ── */}
      <aside style={{
        width: 240, background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        flexShrink: 0, zIndex: 30
      }}>
        <div>
          {/* Brand Header */}
          <div style={{ padding: "18px 18px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: "#EA580C", display: "flex", alignItems: "center",
              justifyContent: "center", color: "#FFFFFF", fontWeight: 900,
              fontSize: 16, boxShadow: "0 2px 8px rgba(234,88,12,0.3)"
            }}>
              F
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.2px", lineHeight: 1.15 }}>
                Tuyển Sinh Đại Học FPT
              </div>
              <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 700, marginTop: 1, letterSpacing: "0.5px" }}>
                CỔNG THÍ SINH TRỰC TUYẾN
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { id: "dashboard", icon: LayoutDashboard, label: "Tổng Quan Hồ Sơ", desc: "Tổng quan nộp hồ sơ" },
              { id: "registration_steps", icon: UserPlus, label: "Hành Trình Nộp Hồ Sơ", desc: "4 Bước hoàn thiện hồ sơ" },
              { id: "aspirations", icon: Target, label: "Đặt Nguyện Vọng", desc: "Sắp xếp thứ tự nguyện vọng", badge: "MỚI" },
              { id: "moet_virtual_filter", icon: Brain, label: "Lọc Ảo Bộ GD&ĐT", desc: "Kiểm tra trúng tuyển API Bộ", badge: "API" },
              { id: "documents", icon: FileText, label: "Hồ Sơ & Giấy Tờ", desc: "Quản lý giấy tờ" },
              { id: "campus_life", icon: Building, label: "Khám Phá Cơ Sở 360", desc: "Khám phá 5 campus FPTU" },
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
                    color: isActive ? "#FFFFFF" : "#475569",
                    background: isActive ? "#EA580C" : "transparent",
                    border: "none", cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <tab.icon size={16} strokeWidth={isActive ? 2.5 : 2} color={isActive ? "#FFFFFF" : "#64748B"} />
                  <span style={{ flex: 1 }}>{tab.label}</span>
                  {tab.badge && (
                    <span style={{ fontSize: 9, fontWeight: 800, background: isActive ? "#FFFFFF" : "#FFEDD5", color: isActive ? "#EA580C" : "#9A3412", padding: "1px 5px", borderRadius: 4 }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer & Apply Now Button */}
        <div style={{ padding: "12px 14px 18px", borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={() => {
              setActiveTab("aspirations");
              showToast("Đang mở bảng Đặt & Xác nhận Nguyện vọng tuyển sinh!");
            }}
            style={{
              width: "100%", padding: "10px", borderRadius: 8,
              background: "#EA580C", color: "#FFFFFF", border: "none",
              fontWeight: 800, fontSize: 13, cursor: "pointer",
              boxShadow: "0 4px 12px rgba(234,88,12,0.3)"
            }}
          >
            Nộp Hồ Sơ Ngay
          </button>

          <button
            onClick={() => showToast("Cài đặt tài khoản thí sinh")}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "6px 8px", border: "none", background: "transparent", fontSize: 12, color: "#64748B", fontWeight: 600, cursor: "pointer" }}
          >
            <Settings size={15} /> Cài Đặt
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "6px 8px", border: "none", background: "transparent", fontSize: 12, color: "#DC2626", fontWeight: 700, cursor: "pointer" }}
          >
            <LogOut size={15} /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <main style={{ flex: 1, height: "100vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>

        {/* ── TOP NAVBAR ── */}
        <header style={{
          height: 58, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
          padding: "0 28px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 20
        }}>
          {/* Search Box */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#F1F5F9", borderRadius: 20, padding: "6px 14px", width: 260
          }}>
            <Search size={14} color="#94A3B8" />
            <input
              type="text"
              placeholder="Tìm kiếm hồ sơ, ngành học..."
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 12, width: "100%", color: "#334155" }}
            />
          </div>

          {/* Right Icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Trạng thái Lọc Ảo Bộ GD&ĐT */}
            <button
              onClick={() => setActiveTab("moet_virtual_filter")}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
                borderRadius: 6, background: "#EFF6FF", border: "1px solid #DBEAFE",
                fontSize: 11.5, fontWeight: 700, color: "#1D4ED8", cursor: "pointer"
              }}
            >
              <Brain size={14} /> Kiểm tra Lọc Ảo Bộ GD&ĐT
            </button>

            <button
              onClick={() => showToast("Thông báo: Bạn có lịch phỏng vấn học bổng vào ngày 15/08!")}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B", position: "relative" }}
            >
              <Bell size={18} />
              <span style={{ position: "absolute", top: -1, right: -1, width: 6, height: 6, borderRadius: "50%", background: "#DC2626" }} />
            </button>

            <button
              onClick={() => showToast("Hotline Tư Vấn Tuyển Sinh FPT: 1800 1234 (Miễn phí)")}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}
            >
              <HelpCircle size={18} />
            </button>

            {/* Profile Avatar */}
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#FFEDD5", color: "#EA580C", display: "flex",
              alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11,
              border: "1px solid #FED7AA", cursor: "pointer"
            }}>
              VA
            </div>
          </div>
        </header>

        {/* ── MAIN BODY CONTENT ── */}
        <div style={{ flex: 1, padding: "24px 28px 48px", maxWidth: 1440, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

          {/* =========================================================================
              MÀN HÌNH 1: DASHBOARD THÍ SINH (ẢNH 1 & 4)
             ========================================================================= */}
          {activeTab === "dashboard" && (
            <div>
              {/* Welcome Banner */}
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                  Chào buổi sáng, {candidateProfile.name}! 👋
                </h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                  Hãy hoàn thiện hồ sơ của bạn để sẵn sàng cho hành trình tại Đại học FPT.
                </p>
              </div>

              {/* Hàng 1: Tiến độ nộp hồ sơ + Việc cần làm ngay (Ảnh 1) */}
              <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18, marginBottom: 20 }}>

                {/* Khối Tiến độ nộp hồ sơ */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                      <div>
                        <strong style={{ fontSize: 15, color: "#0F172A" }}>Tiến độ nộp hồ sơ</strong>
                        <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>Hoàn thành các bước để nhận giấy báo trúng tuyển</div>
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 900, color: "#EA580C" }}>
                        65%
                      </div>
                    </div>

                    <div style={{ width: "100%", height: 7, borderRadius: 3.5, background: "#0F172A", overflow: "hidden", margin: "14px 0 10px" }}>
                      <div style={{ width: "65%", height: "100%", background: "#EA580C" }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontWeight: 600, color: "#64748B" }}>
                    <span>Thông tin cá nhân <strong style={{ color: "#16A34A" }}>(Đã xong)</strong></span>
                    <span>Học bạ <strong style={{ color: "#EA580C" }}>(Đang xử lý)</strong></span>
                    <span>Phí xét tuyển <strong style={{ color: "#94A3B8" }}>(Chưa)</strong></span>
                  </div>
                </div>

                {/* Khối Việc cần làm ngay */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 900, color: "#0F172A", marginBottom: 14 }}>
                    <div style={{ color: "#DC2626" }}><AlertCircle size={16} /></div>
                    Việc cần làm ngay
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ padding: "10px 12px", borderRadius: 8, background: "#FFF1F2", border: "1px solid #FFE4E6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 12 }}>
                        <strong style={{ color: "#0F172A", display: "block" }}>Bổ sung ảnh chân dung 3x4</strong>
                        <span style={{ fontSize: 11, color: "#64748B" }}>Cần thiết cho thẻ sinh viên.</span>
                      </div>
                      <button
                        onClick={() => setActiveTab("documents")}
                        style={{ padding: "5px 10px", borderRadius: 5, background: "#DC2626", color: "#FFF", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                      >
                        Tải lên ngay
                      </button>
                    </div>

                    <div style={{ padding: "10px 12px", borderRadius: 8, background: "#FAFAFA", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ fontSize: 12 }}>
                        <strong style={{ color: "#0F172A", display: "block" }}>Xác nhận thông tin liên hệ</strong>
                        <span style={{ fontSize: 11, color: "#64748B" }}>Kiểm tra SĐT và Email phụ huynh.</span>
                      </div>
                      <span onClick={() => showToast("Thông tin liên hệ của bạn đã chính xác!")} style={{ fontSize: 11.5, fontWeight: 700, color: "#9A3412", cursor: "pointer" }}>
                        Kiểm tra
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Hàng 2: Lịch Phỏng Vấn Học Bổng + Khám phá Cơ sở Đào tạo (Ảnh 1) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: 18 }}>

                {/* Lịch Phỏng Vấn Học Bổng (15 THÁNG 8) */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <strong style={{ fontSize: 14, color: "#0F172A" }}>Lịch Phỏng Vấn Học Bổng</strong>
                    <Calendar size={16} color="#2563EB" />
                  </div>

                  <div style={{ textAlign: "center", padding: "10px 0" }}>
                    <div style={{ fontSize: 40, fontWeight: 900, color: "#1D4ED8", lineHeight: 1 }}>15</div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#64748B", letterSpacing: "1px", marginTop: 4 }}>THÁNG 8</div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11.5, color: "#475569", margin: "10px 0 14px" }}>
                    <div>⏰ <strong>09:00 AM - 09:30 AM</strong></div>
                    <div>📍 Phòng 402, Tòa Alpha (Campus Hòa Lạc)</div>
                    <div>👥 Hội đồng xét tuyển FPTU</div>
                  </div>

                  <button
                    onClick={() => showToast("Đang mở chi tiết phòng thi và hướng dẫn chuẩn bị phỏng vấn")}
                    style={{ width: "100%", padding: "7px", borderRadius: 6, border: "1px solid #2563EB", background: "#FFF", color: "#2563EB", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                  >
                    Xem chi tiết
                  </button>
                </div>

                {/* Khám phá Cơ sở Đào tạo */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <strong style={{ fontSize: 14, color: "#0F172A" }}>Khám phá Cơ sở Đào tạo</strong>
                    <span onClick={() => setActiveTab("campus_life")} style={{ color: "#9A3412", cursor: "pointer" }}>→</span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div style={{
                      height: 140, borderRadius: 8, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%), #334155",
                      padding: "12px", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#FFF"
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>Modern Learning Facilities</div>
                      <div style={{ fontSize: 10.5, color: "#CBD5E1", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <Eye size={12} /> Xem không gian 360
                      </div>
                    </div>

                    <div style={{
                      height: 140, borderRadius: 8, background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%), #9A3412",
                      padding: "12px", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#FFF"
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 800 }}>Innovation Hubs</div>
                      <div style={{ fontSize: 10.5, color: "#CBD5E1", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <Play size={12} /> Xem video giới thiệu
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 2: ĐẶT & SẮP XẾP NGUYỆN VỌNG TUYỂN SINH (TÍNH NĂNG MỚI)
             ========================================================================= */}
          {activeTab === "aspirations" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                    Đăng Ký & Sắp Xếp Thứ Tự Nguyện Vọng
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Thí sinh được đăng ký tối đa các ngành học tại 5 phân hiệu FPT University và kéo thả ưu tiên
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTab("moet_virtual_filter");
                    showToast("Đang chuyển sang Cổng Lọc Ảo Bộ GD&ĐT để kiểm tra trúng tuyển!");
                  }}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, background: "#EA580C", color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 8px rgba(234,88,12,0.3)" }}
                >
                  <Brain size={15} /> Kiểm Tra Lọc Ảo (MOET API)
                </button>
              </div>

              {/* Danh sách Nguyện vọng */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                {aspirations.map((asp, idx) => (
                  <div
                    key={asp.id}
                    style={{
                      background: "#FFFFFF", borderRadius: 12, border: asp.priority === 1 ? "2px solid #EA580C" : "1px solid #E2E8F0",
                      padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
                      boxShadow: asp.priority === 1 ? "0 4px 12px rgba(234,88,12,0.08)" : "none"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      {/* Priority Badge */}
                      <div style={{
                        width: 42, height: 42, borderRadius: 10,
                        background: asp.priority === 1 ? "#EA580C" : "#F1F5F9",
                        color: asp.priority === 1 ? "#FFFFFF" : "#475569",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                        fontWeight: 900, flexShrink: 0
                      }}>
                        <span style={{ fontSize: 9, opacity: 0.8 }}>NV</span>
                        <span style={{ fontSize: 16, lineHeight: 1 }}>{asp.priority}</span>
                      </div>

                      {/* Major Details */}
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                          <strong style={{ fontSize: 14.5, color: "#0F172A" }}>{asp.majorName}</strong>
                          <span style={{ fontSize: 11, fontFamily: "monospace", background: "#F1F5F9", padding: "1px 6px", borderRadius: 4, color: "#64748B" }}>
                            Mã: {asp.majorCode}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748B" }}>
                          📍 {asp.campus} • 🎓 {asp.method}
                        </div>
                      </div>
                    </div>

                    {/* Điểm & Nút Di Chuyển */}
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#64748B" }}>Điểm xét tuyển của bạn</div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: "#16A34A" }}>
                          {asp.myScore} <span style={{ fontSize: 11, color: "#94A3B8" }}>(Chuẩn: {asp.benchmarkScore})</span>
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <button
                          disabled={idx === 0}
                          onClick={() => moveAspiration(idx, "up")}
                          style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: idx === 0 ? "#F8FAFC" : "#FFFFFF", cursor: idx === 0 ? "not-allowed" : "pointer" }}
                        >
                          <MoveUp size={13} />
                        </button>
                        <button
                          disabled={idx === aspirations.length - 1}
                          onClick={() => moveAspiration(idx, "down")}
                          style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: idx === aspirations.length - 1 ? "#F8FAFC" : "#FFFFFF", cursor: idx === aspirations.length - 1 ? "not-allowed" : "pointer" }}
                        >
                          <MoveDown size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Box Thêm Nguyện vọng */}
              <button
                onClick={() => showToast("Đã mở danh mục 25 ngành đào tạo bậc Đại học tại FPTU!")}
                style={{ width: "100%", padding: "12px", borderRadius: 10, border: "2px dashed #CBD5E1", background: "#FFFFFF", color: "#64748B", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                <Plus size={16} /> Thêm Nguyện Vọng Mới (Tối đa 10 Nguyện vọng)
              </button>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 3: HỆ THỐNG LỌC ẢO BỘ GD&ĐT (MOET API VIRTUAL FILTERING ENGINE)
             ========================================================================= */}
          {activeTab === "moet_virtual_filter" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                    Cổng Kết Nối Lọc Ảo Tuyển Sinh Quốc Gia (MOET API)
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Mô phỏng API Bộ Giáo Dục & Đào Tạo đối soát dữ liệu toàn quốc để xác định kết quả trúng tuyển chính thức
                  </p>
                </div>

                <button
                  disabled={moetFilteringState.isRunning}
                  onClick={runMOETVirtualFilter}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "9px 22px",
                    borderRadius: 8, background: moetFilteringState.isRunning ? "#94A3B8" : "#9A3412",
                    color: "#FFFFFF", border: "none", fontSize: 13, fontWeight: 800,
                    cursor: moetFilteringState.isRunning ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 12px rgba(154,52,18,0.25)"
                  }}
                >
                  <RefreshCw size={15} className={moetFilteringState.isRunning ? "animate-spin" : ""} />
                  {moetFilteringState.isRunning ? "Đang Lọc Ảo..." : "🔄 Chạy Lọc Ảo Bộ GD&ĐT"}
                </button>
              </div>

              {/* 3 Thẻ Thông tin Thí sinh kết nối MOET */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "16px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748B" }}>SỐ BÁO DANH THPT</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", fontFamily: "monospace", marginTop: 2 }}>{candidateProfile.sbd}</div>
                  <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 700, marginTop: 2 }}>Đã đồng bộ cơ sở dữ liệu Bộ GD&ĐT</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "16px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748B" }}>TỔ HỢP XÉT TUYỂN (A00, A01, D01)</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#2563EB", marginTop: 2 }}>{candidateProfile.thptScore.total} Điểm</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>Toán: 8.8 | Lý: 8.5 | Anh: 9.2</div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "16px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748B" }}>NGUYỆN VỌNG ƯU TIÊN 1</div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#9A3412", marginTop: 4 }}>Kỹ thuật Phần mềm</div>
                  <div style={{ fontSize: 11, color: "#64748B" }}>FPT Hà Nội (Hoà Lạc)</div>
                </div>
              </div>

              {/* Terminal Logs Lọc Ảo */}
              <div style={{ background: "#0F172A", borderRadius: 12, padding: "18px 22px", color: "#E2E8F0", fontFamily: "monospace", fontSize: 12, marginBottom: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: 10, marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F59E0B" }} />
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10B981" }} />
                    <strong style={{ color: "#94A3B8", marginLeft: 6 }}>MOET_Virtual_Filter_API_v4.2.log</strong>
                  </div>
                  <span style={{ fontSize: 11, color: "#64748B" }}>Tiến trình: Đợt {moetFilteringState.currentRound} / 6</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 120 }}>
                  {moetFilteringState.logs.length === 0 ? (
                    <div style={{ color: "#64748B" }}>Bấm nút [🔄 Chạy Lọc Ảo Bộ GD&ĐT] để bắt đầu quá trình đối soát dữ liệu tuyển sinh quốc gia...</div>
                  ) : (
                    moetFilteringState.logs.map((log, idx) => (
                      <div key={idx} style={{ color: idx === moetFilteringState.logs.length - 1 ? "#4ADE80" : "#94A3B8" }}>
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Card Kết Quả Trúng Tuyển Chính Thức Sau Khi Lọc Ảo Xong */}
              {moetFilteringState.finalResult && (
                <div style={{
                  background: "linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)",
                  borderRadius: 14, border: "2px solid #10B981", padding: "24px 28px",
                  boxShadow: "0 10px 25px rgba(16,185,129,0.15)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#10B981", color: "#FFFFFF", padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 800, marginBottom: 10 }}>
                        <CheckCircle size={15} /> {moetFilteringState.finalResult.status}
                      </div>
                      <h2 style={{ fontSize: 22, fontWeight: 900, color: "#065F46", margin: "0 0 6px" }}>
                        CHÚC MỪNG BẠN ĐÃ TRÚNG TUYỂN VÀO ĐẠI HỌC FPT!
                      </h2>
                      <div style={{ fontSize: 13.5, color: "#047857", fontWeight: 600 }}>
                        Ngành: <strong>{moetFilteringState.finalResult.major}</strong> (Mã ngành: {moetFilteringState.finalResult.majorCode})
                      </div>
                      <div style={{ fontSize: 12.5, color: "#065F46", marginTop: 4 }}>
                        Cơ sở: <strong>{moetFilteringState.finalResult.campus}</strong> • {moetFilteringState.finalResult.scholarship}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#047857" }}>MÃ HỒ SƠ NHẬP HỌC</div>
                      <strong style={{ fontSize: 18, fontFamily: "monospace", color: "#065F46" }}>{moetFilteringState.finalResult.admissionCode}</strong>
                      <div style={{ fontSize: 11, color: "#DC2626", fontWeight: 700, marginTop: 4 }}>Hạn xác nhận: {moetFilteringState.finalResult.deadline}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 18, paddingTop: 14, borderTop: "1px solid #D1FAE5" }}>
                    <button
                      onClick={() => showToast("Đã tải Giấy Báo Trúng Tuyển Số (PDF) có chữ ký số của Hiệu trưởng!")}
                      style={{ padding: "9px 20px", borderRadius: 8, background: "#059669", color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <Download size={15} /> Tải Giấy Báo Trúng Tuyển (PDF)
                    </button>
                    <button
                      onClick={() => {
                        showToast("Đã hoàn tất xác nhận nhập học trực tuyến!");
                      }}
                      style={{ padding: "9px 20px", borderRadius: 8, background: "#0F172A", color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 12.5, cursor: "pointer" }}
                    >
                      Xác Nhận Nhập Học Ngay
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 4: DOCUMENTS - QUẢN LÝ TÀI LIỆU (ẢNH 2 & 4)
             ========================================================================= */}
          {activeTab === "documents" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                  Documents
                </h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                  Manage and upload required verification documents for your application.
                </p>
              </div>

              {/* Hàng trên: Verification Status + Document Guidelines (Ảnh 2) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#475569" }}>Verification Status</span>
                    <Clock size={16} color="#D97706" />
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>
                    2/4 <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Verified</span>
                  </div>
                  <div style={{ width: "100%", height: 5, borderRadius: 3, background: "#EFF6FF", overflow: "hidden", marginTop: 8 }}>
                    <div style={{ width: "50%", height: "100%", background: "#9A3412" }} />
                  </div>
                </div>

                <div style={{ background: "#EFF6FF", borderRadius: 12, border: "1px solid #DBEAFE", padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, color: "#1D4ED8", fontSize: 13, marginBottom: 6 }}>
                    <AlertCircle size={16} /> Document Guidelines
                  </div>
                  <div style={{ fontSize: 11.5, color: "#1E40AF", display: "flex", flexDirection: "column", gap: 3 }}>
                    <div>✓ Accepted formats: PDF, JPG, PNG.</div>
                    <div>✓ Maximum file size: 5MB per document.</div>
                    <div>✓ Documents must be clear, well-lit, and all edges visible.</div>
                  </div>
                </div>
              </div>

              {/* Danh sách Documents (Ảnh 2 & 4) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      background: "#FFFFFF", borderRadius: 10,
                      border: doc.needsUpload ? "1.5px solid #FCA5A5" : "1px solid #E2E8F0",
                      padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: doc.bg, color: doc.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileText size={16} />
                      </div>
                      <div>
                        <strong style={{ fontSize: 13, color: "#0F172A" }}>{doc.title}</strong>
                        <div style={{ fontSize: 11, color: doc.needsUpload ? "#DC2626" : "#64748B" }}>{doc.sub}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: doc.color, background: doc.bg, padding: "2px 8px", borderRadius: 4 }}>
                        {doc.status}
                      </span>
                      {doc.needsUpload ? (
                        <button
                          onClick={() => showToast("Đã tải lên ảnh thẻ 3x4 mới thành công!")}
                          style={{ padding: "6px 14px", borderRadius: 6, background: "#9A3412", color: "#FFF", border: "none", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                        >
                          Upload New
                        </button>
                      ) : (
                        <button
                          onClick={() => showToast(`Xem tài liệu: ${doc.title}`)}
                          style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                        >
                          View
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Upload Foreign Language Certificate */}
                <div style={{
                  padding: "24px", borderRadius: 10, border: "2px dashed #CBD5E1",
                  background: "#FAFAFA", textAlign: "center", cursor: "pointer"
                }}
                  onClick={() => showToast("Đã tải lên Chứng chỉ IELTS 7.5!")}
                >
                  <Upload size={24} color="#94A3B8" style={{ margin: "0 auto 6px" }} />
                  <strong style={{ fontSize: 13, color: "#0F172A", display: "block" }}>Upload Foreign Language Certificate</strong>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>(Optional) PDF, JPG, PNG up to 5MB</span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 5: REGISTRATION STEPS (ẢNH 3)
             ========================================================================= */}
          {activeTab === "registration_steps" && (
            <div>
              <div style={{ marginBottom: 20 }}>
                <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                  Registration Journey
                </h1>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                  Complete the steps below to finalize your admission application.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: 18 }}>

                {/* 4 Steps Column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {/* Step 1 */}
                  <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>✓</div>
                        <strong style={{ fontSize: 13.5, color: "#0F172A" }}>1. Thông tin cá nhân</strong>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", background: "#DCFCE7", padding: "2px 8px", borderRadius: 4 }}>Hoàn thành</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 6px" }}>You have successfully submitted your basic personal details.</p>
                    <span onClick={() => showToast("Đang mở xem chi tiết thông tin cá nhân")} style={{ fontSize: 11.5, fontWeight: 700, color: "#9A3412", cursor: "pointer" }}>Review Details →</span>
                  </div>

                  {/* Step 2 */}
                  <div style={{ background: "#FFFFFF", borderRadius: 12, border: "2px solid #FED7AA", padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#FFEDD5", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>2</div>
                        <strong style={{ fontSize: 13.5, color: "#0F172A" }}>2. Học bạ THPT</strong>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#D97706", background: "#FEF3C7", padding: "2px 8px", borderRadius: 4 }}>Đang xử lý</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 12px" }}>Please upload your official high school transcripts. Ensure the scanned copies are clear and legible.</p>

                    <div style={{ padding: "16px", borderRadius: 8, border: "1.5px dashed #CBD5E1", background: "#FAFAFA", textAlign: "center", marginBottom: 12 }}>
                      <Upload size={20} color="#94A3B8" style={{ margin: "0 auto 4px" }} />
                      <div style={{ fontSize: 12, color: "#475569" }}>Drag & drop files here or click to browse</div>
                    </div>

                    <button onClick={() => showToast("Đã tải lên file học bạ THPT thành công!")} style={{ padding: "8px 18px", borderRadius: 6, background: "#9A3412", color: "#FFF", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                      Tải lên Học bạ
                    </button>
                  </div>

                  {/* Step 3 */}
                  <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px", opacity: 0.85 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <strong style={{ fontSize: 13.5, color: "#0F172A" }}>3. Tải hồ sơ bổ sung</strong>
                      <span style={{ fontSize: 11, color: "#64748B", background: "#F1F5F9", padding: "2px 8px", borderRadius: 4 }}>Chờ đợi</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>Upload ID cards, birth certificate, and other required documents after completing Step 2.</p>
                  </div>

                  {/* Step 4 */}
                  <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px", opacity: 0.85 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <strong style={{ fontSize: 13.5, color: "#0F172A" }}>4. Phỏng vấn</strong>
                      <span style={{ fontSize: 11, color: "#64748B", background: "#F1F5F9", padding: "2px 8px", borderRadius: 4 }}>Chờ đợi</span>
                    </div>
                    <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>Schedule and complete your admissions interview with our faculty members.</p>
                  </div>
                </div>

                {/* Right Column: Support & FAQ */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Support Box */}
                  <div style={{ background: "#EFF6FF", borderRadius: 12, border: "1px solid #DBEAFE", padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 900, color: "#1D4ED8", marginBottom: 8 }}>
                      <PhoneCall size={18} /> Hỗ trợ tuyển sinh
                    </div>
                    <p style={{ fontSize: 12, color: "#1E40AF", margin: "0 0 12px" }}>
                      Cần trợ giúp với hồ sơ của bạn? Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ.
                    </p>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>📞 1800 1234</div>
                    <div style={{ fontSize: 12, color: "#475569", marginBottom: 14 }}>✉️ admissions@fpt.edu.vn</div>
                    <button onClick={() => showToast("Đang kết nối Chuyên viên Tư vấn Tuyển sinh FPT...")} style={{ width: "100%", padding: "8px", borderRadius: 6, background: "#0369A1", color: "#FFF", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                      Live Chat
                    </button>
                  </div>

                  {/* FAQ */}
                  <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px" }}>
                    <strong style={{ fontSize: 14, color: "#0F172A", display: "block", marginBottom: 12 }}>Câu hỏi thường gặp</strong>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12 }}>
                      <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
                        <strong>Thời hạn nộp học bạ là khi nào?</strong>
                        <div style={{ color: "#64748B", marginTop: 2 }}>Trước ngày 15/08/2024.</div>
                      </div>
                      <div style={{ borderBottom: "1px solid #F1F5F9", paddingBottom: 8 }}>
                        <strong>Định dạng file nào được chấp nhận?</strong>
                        <div style={{ color: "#64748B", marginTop: 2 }}>PDF, JPG, PNG dung lượng dưới 5MB.</div>
                      </div>
                      <div>
                        <strong>Tôi có thể sửa thông tin sau khi nộp không?</strong>
                        <div style={{ color: "#64748B", marginTop: 2 }}>Có thể gửi yêu cầu trước khi có kết quả duyệt.</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 6: CAMPUS LIFE (ẢNH 1)
             ========================================================================= */}
          {activeTab === "campus_life" && (
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", margin: "0 0 6px" }}>Khám phá Không gian & Trải nghiệm FPT University 360</h2>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 18 }}>Tham quan 5 campus hiện đại tại Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ và Quy Nhơn.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { name: "FPT University Hà Nội (Hòa Lạc)", img: "Alpha Building & Dom", desc: "Tòa nhà Alpha đoạt giải kiến trúc quốc tế, KTX xanh" },
                  { name: "FPT University TP.HCM (Thủ Đức)", img: "Khu CNC High-Tech", desc: "Không gian công nghệ kết nối các tập đoàn hàng đầu" },
                  { name: "FPT University Quy Nhơn", img: "AI Campus Quốc tế", desc: "Trung tâm nghiên cứu AI và khoa học dữ liệu quốc tế" },
                ].map((c, idx) => (
                  <div key={idx} style={{ borderRadius: 10, border: "1px solid #E2E8F0", overflow: "hidden" }}>
                    <div style={{ height: 130, background: "linear-gradient(135deg, #1E3A8A 0%, #EA580C 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 800 }}>
                      {c.img}
                    </div>
                    <div style={{ padding: 14 }}>
                      <strong style={{ fontSize: 13, color: "#0F172A" }}>{c.name}</strong>
                      <p style={{ fontSize: 11.5, color: "#64748B", margin: "4px 0 0" }}>{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
