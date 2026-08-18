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
  ZoomIn, ZoomOut, RotateCw, ChevronLeft, Send, CheckCircle2,
  FileCheck, ShieldQuestion
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell, LineChart, Line, AreaChart, Area, ReferenceLine,
  PieChart as RechartsPieChart, Pie
} from "recharts";
import * as XLSX from "xlsx";

export default function AdmissionOfficerPortal() {
  const navigate = useNavigate();

  // Active Tab State (Khớp 100% 2 ảnh tuyển sinh + mở rộng chuẩn DSS):
  // 1. "verification": Thẩm định Học bạ & Hồ sơ (Ảnh 1)
  // 2. "kpis": Hiệu suất Tuyển sinh & Báo cáo KPIs (Ảnh 2)
  // 3. "overview": Tổng quan Hồ sơ Tuyển sinh Hàng ngày
  // 4. "exam_scheduling": Xếp lịch Thi & Phỏng vấn Học bổng
  // 5. "results": Quản lý Kết quả & Phát hành Giấy Báo Trúng Tuyển
  // 6. "dss_directives": Kết nối Hệ Thống DSS & Chỉ thị Ban Giám Hiệu (BOD)
  const [activeTab, setActiveTab] = useState("verification");

  // State Thẩm định Hồ sơ (Ảnh 1)
  const [selectedCandidate, setSelectedCandidate] = useState({
    id: "FPT-2024-8912",
    name: "Nguyen Van A",
    dob: "15/08/2005",
    major: "Software Engineering",
    campus: "Hanoi (Hoa Lac)",
    submissionDate: "Oct 24, 2023",
    priority: "High",
    status: "Reviewing",
    mathScore: "8.5",
    confidence: "72%",
    reviewerComments: "",
    docs: [
      { id: "doc1", name: "Học bạ THPT", subname: "High School Transcript", status: "PENDING", statusColor: "#D97706", statusBg: "#FEF3C7" },
      { id: "doc2", name: "CMND / CCCD", subname: "National ID", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" },
      { id: "doc3", name: "Chứng chỉ IELTS", subname: "English Proficiency", status: "ACTION REQ", statusColor: "#DC2626", statusBg: "#FEE2E2" },
    ]
  });

  // State Zoom / Rotate scan
  const [zoomLevel, setZoomLevel] = useState(100);
  const [scanPage, setScanPage] = useState(1);

  // State Chỉ thị BGH áp dụng vào Tuyển sinh (DSS Integration)
  const [activeDirectives, setActiveDirectives] = useState([
    { id: "DIR-01", title: "Ưu tiên Quota Học bổng ĐBSCL (+5%)", targetGroup: "Thí sinh Cần Thơ & Miền Tây", status: "Đang áp dụng", action: "Tăng 5% học bổng cho thí sinh điểm TB > 8.0" },
    { id: "DIR-02", title: "Cảnh báo Hồ sơ Ảo Khu vực Miền Tây", targetGroup: "Đối soát CCCD & SĐT phụ huynh", status: "Cảnh báo Cao", action: "Yêu cầu nộp bản sao công chứng trước 15/11" },
    { id: "DIR-03", title: "Đẩy mạnh Telesales Nhóm Điểm Khá (21đ - 24đ)", targetGroup: "Thí sinh Khối A00, A01, D01", status: "Chiến dịch MKT", action: "Gọi điện tư vấn lộ trình học bổng doanh nghiệp" },
  ]);

  // Modal & Toast
  const [showDirectivesModal, setShowDirectivesModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dữ liệu Nguồn Tuyển sinh (Ảnh 2)
  const recruitmentSourceData = [
    { source: "School Visits", leads: "5,200", applied: "2,100", enrolled: "850", rate: "16.3%" },
    { source: "Facebook Ads", leads: "12,500", applied: "3,400", enrolled: "620", rate: "4.9%" },
    { source: "Organic Search", leads: "8,100", applied: "2,800", enrolled: "780", rate: "9.6%" },
    { source: "Referrals", leads: "1,800", applied: "1,500", enrolled: "950", rate: "52.7%" },
    { source: "Education Fairs", leads: "4,300", applied: "1,200", enrolled: "310", rate: "7.2%" },
  ];

  // Xuất Báo Cáo Tuyển Sinh Excel
  const handleExportAdmissionReport = () => {
    const wsData = [
      ["BÁO CÁO KẾT QUẢ & HIỆU SUẤT TUYỂN SINH - FPT UNIVERSITY"],
      ["Thời gian xuất:", new Date().toLocaleString("vi-VN")],
      ["Cán bộ thẩm định:", "Phòng Tuyển sinh (Admissions Management)"],
      [],
      ["1. HIỆU SUẤT TUYỂN SINH TỔNG THỂ"],
      ["Hồ sơ đăng ký (Applications)", "14,285", "+12% so với cùng kỳ"],
      ["Thí sinh dự thi (Exams Taken)", "8,940", "+5%"],
      ["Thí sinh phỏng vấn (Interviews)", "6,120", "-2%"],
      ["Tân sinh viên nhập học (Enrolled)", "4,050", "+8%"],
      [],
      ["2. PHÂN BỔ THEO NGUỒN TUYỂN SINH"],
      ["NGUỒN", "LEADS", "APPLIED", "ENROLLED", "TỶ LỆ CHUYỂN ĐỔI"],
      ...recruitmentSourceData.map(r => [r.source, r.leads, r.applied, r.enrolled, r.rate])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Admissions_Performance");
    XLSX.writeFile(wb, `FPT_Admissions_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Đã xuất báo cáo hiệu suất tuyển sinh thành công (Excel)!");
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

      {/* ── SIDEBAR NHÂN VIÊN TUYỂN SINH (KHỚP 100% CẢ 2 ẢNH) ── */}
      <aside style={{
        width: 235, background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
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
              🏛️
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.2px", lineHeight: 1.15 }}>
                Phòng Tuyển Sinh FPT
              </div>
              <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 600, marginTop: 1 }}>
                Quản Trị Tuyển Sinh & Thẩm Định
              </div>
            </div>
          </div>

          {/* Nút Thẩm Định Nhanh */}
          <div style={{ padding: "0 12px 12px" }}>
            <button
              onClick={() => {
                setActiveTab("verification");
                showToast("Đã tải hồ sơ tiếp theo sẵn sàng thẩm định OCR!");
              }}
              style={{
                width: "100%", padding: "10px", borderRadius: 8,
                background: "#9A3412", color: "#FFFFFF", border: "none",
                fontWeight: 700, fontSize: 12.5, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 6, cursor: "pointer",
                boxShadow: "0 2px 6px rgba(154,52,18,0.25)"
              }}
            >
              ⚡ Thẩm Định Nhanh (OCR)
            </button>
          </div>

          {/* Menu Items */}
          <nav style={{ padding: "0 10px", display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { id: "overview", icon: LayoutDashboard, label: "Tổng Quan Hồ Sơ", desc: "Tổng quan hồ sơ" },
              { id: "verification", icon: ShieldCheck, label: "Thẩm Định Học Bạ", desc: "Thẩm định học bạ OCR" },
              { id: "exam_scheduling", icon: Calendar, label: "Xếp Lịch Thi Tuyển", desc: "Xếp lịch thi & phỏng vấn" },
              { id: "results", icon: CheckSquare, label: "Kết Quả Trúng Tuyển", desc: "Quản lý kết quả" },
              { id: "kpis", icon: BarChart3, label: "Báo Cáo Hiệu Suất (KPI)", desc: "Báo cáo hiệu suất" },
              { id: "dss_directives", icon: Bot, label: "DSS & Chỉ Thị BGH", desc: "Đồng bộ quyết định BGH", badge: "HOT" },
              { id: "archive", icon: Database, label: "Kho Lưu Trữ Tuyển Sinh", desc: "Kho hồ sơ lưu trữ" },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "8.5px 12px", borderRadius: 8, fontSize: 12.5,
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
                    <span style={{ fontSize: 9, fontWeight: 800, background: "#EA580C", color: "#FFF", padding: "1px 5px", borderRadius: 4 }}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div style={{ padding: "12px 14px 18px", borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: 4 }}>
          <button
            onClick={() => showToast("Trung tâm Trợ giúp Tuyển sinh: Hotline 024.7300.1866")}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 10px", border: "none", background: "transparent", fontSize: 12, color: "#64748B", fontWeight: 600, cursor: "pointer", textAlign: "left" }}
          >
            <HelpCircle size={15} /> Trung Tâm Trợ Giúp
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

        {/* ── TOP HEADER (KHỚP CẢ 2 ẢNH) ── */}
        <header style={{
          height: 58, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
          padding: "0 28px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 20
        }}>
          {/* Search candidates */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8,
            padding: "6px 14px", width: 280
          }}>
            <Search size={14} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search candidates (ID, Name)..."
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 12, width: "100%", color: "#334155" }}
            />
          </div>

          {/* Right Icons & Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Banner Chỉ thị BGH nhanh */}
            <button
              onClick={() => setActiveTab("dss_directives")}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
                borderRadius: 6, background: "#FFF7ED", border: "1px solid #FFEDD5",
                fontSize: 11.5, fontWeight: 700, color: "#9A3412", cursor: "pointer"
              }}
            >
              <Bot size={14} /> 3 Chỉ thị BGH Đang Áp Dụng
            </button>

            <button
              onClick={() => showToast("Bạn có 5 hồ sơ ưu tiên cần thẩm định gấp")}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B", position: "relative" }}
            >
              <Bell size={18} />
              <span style={{ position: "absolute", top: -1, right: -1, width: 6, height: 6, borderRadius: "50%", background: "#DC2626" }} />
            </button>

            <button
              onClick={() => showToast("Cấu hình ngưỡng điểm sàn và bộ quy tắc thẩm định")}
              style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}
            >
              <Settings size={18} />
            </button>

            {/* Profile Avatar */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#0F172A", color: "#FFFFFF", display: "flex",
                alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11
              }}>
                AD
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>Admin User</span>
            </div>
          </div>
        </header>

        {/* ── MAIN BODY CONTENT ── */}
        <div style={{ flex: 1, padding: "20px 26px 40px", maxWidth: 1440, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

          {/* =========================================================================
              MÀN HÌNH 1: THẨM ĐỊNH HỌC BẠ & HỒ SƠ (ẢNH 1 - DOCUMENT VERIFICATION)
             ========================================================================= */}
          {activeTab === "verification" && (
            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr 340px", gap: 16, alignItems: "start" }}>

              {/* CỘT TRÁI: THÔNG TIN ỨNG VIÊN & HỒ SƠ YÊU CẦU */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Candidate Info Card */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "#F1F5F9", color: "#334155", display: "flex",
                      alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14,
                      border: "1px solid #E2E8F0"
                    }}>
                      NVA
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <strong style={{ fontSize: 14, color: "#0F172A" }}>{selectedCandidate.name}</strong>
                        <span style={{ fontSize: 10, background: "#F1F5F9", padding: "1px 6px", borderRadius: 4, fontWeight: 700, color: "#64748B" }}>
                          {selectedCandidate.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, fontFamily: "monospace", color: "#64748B" }}>
                        ID: {selectedCandidate.id}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 11.5, paddingTop: 10, borderTop: "1px solid #F1F5F9" }}>
                    <div>
                      <div style={{ color: "#94A3B8", fontWeight: 800, fontSize: 10 }}>MAJOR</div>
                      <strong style={{ color: "#0F172A" }}>{selectedCandidate.major}</strong>
                    </div>
                    <div>
                      <div style={{ color: "#94A3B8", fontWeight: 800, fontSize: 10 }}>CAMPUS</div>
                      <strong style={{ color: "#0F172A" }}>{selectedCandidate.campus}</strong>
                    </div>
                    <div>
                      <div style={{ color: "#94A3B8", fontWeight: 800, fontSize: 10 }}>SUBMISSION DATE</div>
                      <span style={{ color: "#475569" }}>{selectedCandidate.submissionDate}</span>
                    </div>
                    <div>
                      <div style={{ color: "#94A3B8", fontWeight: 800, fontSize: 10 }}>PRIORITY</div>
                      <strong style={{ color: "#DC2626" }}>! {selectedCandidate.priority}</strong>
                    </div>
                  </div>
                </div>

                {/* Required Documents Card */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800, color: "#0F172A" }}>
                      <FileText size={15} color="#2563EB" /> Required Documents
                    </div>
                    <span style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>1 / 3 Verified</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedCandidate.docs.map((doc) => (
                      <div
                        key={doc.id}
                        style={{
                          padding: "10px 12px", borderRadius: 8,
                          border: doc.status === "PENDING" ? "1.5px solid #FED7AA" : "1px solid #E2E8F0",
                          background: doc.status === "PENDING" ? "#FFF7ED" : "#FFFFFF",
                          display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{doc.name}</div>
                          <div style={{ fontSize: 10, color: "#64748B" }}>{doc.subname}</div>
                        </div>

                        <span style={{ fontSize: 10, fontWeight: 800, color: doc.statusColor, background: doc.statusBg, padding: "2px 7px", borderRadius: 4 }}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* CỘT GIỮA: TRÌNH SOI HỌC BẠ OCR VỚI KHUNG ĐỎ HIGHLIGHT ĐIỂM (ẢNH 1) */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                    <Eye size={16} color="#2563EB" /> Verifying: Học bạ THPT
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => setZoomLevel(Math.max(zoomLevel - 15, 70))} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}><ZoomOut size={13} /></button>
                    <button onClick={() => setZoomLevel(Math.min(zoomLevel + 15, 150))} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}><ZoomIn size={13} /></button>
                    <button onClick={() => setZoomLevel(100)} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}><RotateCw size={13} /></button>
                  </div>
                </div>

                {/* Scan Image Container với Khung Đỏ Highlight Điểm Toán 8.5 (Khớp Ảnh 1) */}
                <div style={{
                  height: 480, background: "#F1F5F9", borderRadius: 8, border: "1px solid #E2E8F0",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center"
                }}>
                  {/* Mô phỏng bảng điểm Học bạ THPT có Khung Đỏ */}
                  <div style={{
                    width: `${zoomLevel}%`, maxWidth: 440, background: "#FFFDF0",
                    border: "1px solid #CBD5E1", borderRadius: 6, padding: "14px 18px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)", position: "relative"
                  }}>
                    <div style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 8, borderBottom: "1px solid #E2E8F0", paddingBottom: 4 }}>
                      BỘ GIÁO DỤC VÀ ĐÀO TẠO • HỌC BẠ TRUNG HỌC PHỔ THÔNG
                    </div>

                    <table style={{ width: "100%", fontSize: 11, borderCollapse: "collapse", textAlign: "center" }}>
                      <thead>
                        <tr style={{ background: "#FEF9C3", borderBottom: "1px solid #CBD5E1", fontWeight: 700 }}>
                          <th style={{ padding: "4px", border: "1px solid #CBD5E1" }}>Môn học</th>
                          <th style={{ padding: "4px", border: "1px solid #CBD5E1" }}>HK1</th>
                          <th style={{ padding: "4px", border: "1px solid #CBD5E1" }}>HK2</th>
                          <th style={{ padding: "4px", border: "1px solid #CBD5E1" }}>Cả Năm</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Hàng Toán với Khung Đỏ Highlight */}
                        <tr style={{ background: "#FFFBEB" }}>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1", fontWeight: 800, textAlign: "left" }}>1. Toán học</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.8</td>
                          <td style={{
                            padding: "5px", border: "2px solid #DC2626", fontWeight: 900,
                            color: "#DC2626", background: "#FEE2E2", position: "relative"
                          }}>
                            8.7 ➔ 8.5
                          </td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1", fontWeight: 700 }}>8.6</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1", textAlign: "left" }}>2. Vật lý</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.8</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.9</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.9</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1", textAlign: "left" }}>3. Hóa học</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.6</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.9</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.8</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1", textAlign: "left" }}>4. Ngoại ngữ (Tiếng Anh)</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.9</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.8</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.9</td>
                        </tr>
                        <tr>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1", textAlign: "left" }}>5. Tin học</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.9</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.9</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.9</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Phân trang dưới đáy scan */}
                  <div style={{
                    position: "absolute", bottom: 10, background: "#FFFFFF",
                    borderRadius: 20, padding: "4px 14px", border: "1px solid #CBD5E1",
                    display: "flex", alignItems: "center", gap: 12, fontSize: 11, fontWeight: 700
                  }}>
                    <button onClick={() => setScanPage(Math.max(scanPage - 1, 1))} style={{ border: "none", background: "transparent", cursor: "pointer" }}>&lt;</button>
                    <span>Page {scanPage} of 4</span>
                    <button onClick={() => setScanPage(Math.min(scanPage + 1, 4))} style={{ border: "none", background: "transparent", cursor: "pointer" }}>&gt;</button>
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI: EXTRACTED DATA & APPROVE / REJECT (ẢNH 1) */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748B", letterSpacing: "0.5px" }}>EXTRACTED DATA</div>
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: "2px 0 0" }}>
                    Compare extracted values with the document scan.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 3 }}>Student Name</label>
                    <input
                      type="text" value={selectedCandidate.name} readOnly
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12, background: "#FAFAFA", fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 3 }}>Date of Birth</label>
                    <input
                      type="text" value={selectedCandidate.dob} readOnly
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12, background: "#FAFAFA" }}
                    />
                  </div>

                  {/* Warning Box AI Scored Math (Khớp Ảnh 1) */}
                  <div style={{ background: "#FFFBEB", borderRadius: 8, border: "1px solid #FDE68A", padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 800, color: "#D97706" }}>
                        ⚠️ Grade 12 Math Avg
                      </div>
                      <span style={{ fontSize: 9.5, color: "#92400E", background: "#FEF3C7", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>
                        Confidence: {selectedCandidate.confidence}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={selectedCandidate.mathScore}
                      onChange={(e) => setSelectedCandidate({ ...selectedCandidate, mathScore: e.target.value })}
                      style={{ width: "100%", padding: "6px 8px", borderRadius: 6, border: "1px solid #F59E0B", fontSize: 13, fontWeight: 900, color: "#0F172A", background: "#FFFFFF" }}
                    />
                    <div style={{ fontSize: 9.5, color: "#B45309", marginTop: 3 }}>
                      Verify against highlighted box on scan.
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 3 }}>Reviewer Comments (Optional)</label>
                    <textarea
                      placeholder="Add notes about discrepancies or reasons for rejection..."
                      value={selectedCandidate.reviewerComments}
                      onChange={(e) => setSelectedCandidate({ ...selectedCandidate, reviewerComments: e.target.value })}
                      rows={3}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 11.5, resize: "none" }}
                    />
                  </div>
                </div>

                {/* 2 Nút Phê Duyệt / Từ Chối Dưới Đáy (Ảnh 1) */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 8 }}>
                  <button
                    onClick={() => {
                      showToast("Đã từ chối hồ sơ & gửi thông báo bổ sung tới thí sinh!", "error");
                    }}
                    style={{ padding: "9px 10px", borderRadius: 6, border: "1px solid #FCA5A5", background: "#FFF", color: "#DC2626", fontWeight: 700, fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                  >
                    <X size={14} /> Reject Document
                  </button>

                  <button
                    onClick={() => {
                      showToast("Đã phê duyệt Học bạ THPT thành công! Tự động chuyển sang hồ sơ tiếp theo.");
                    }}
                    style={{ padding: "9px 10px", borderRadius: 6, border: "none", background: "#059669", color: "#FFFFFF", fontWeight: 800, fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, boxShadow: "0 2px 6px rgba(5,150,105,0.25)" }}
                  >
                    <Check size={14} /> Approve & Next
                  </button>
                </div>
                <div style={{ textAlign: "center", fontSize: 9.5, color: "#94A3B8", marginTop: 6 }}>
                  Press Ctrl+Enter to quick approve
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 2: BÁO CÁO HIỆU SUẤT TUYỂN SINH (ẢNH 2 - RECRUITMENT PERFORMANCE)
             ========================================================================= */}
          {activeTab === "kpis" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                    Recruitment Performance
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Nam hoc 2025-2026 • Đánh giá hiệu suất chuyển đổi toàn kênh
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFFFFF", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    <Calendar size={14} /> This Month
                  </button>
                  <button
                    onClick={handleExportAdmissionReport}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 6, background: "#EA580C", color: "#FFFFFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                  >
                    <Download size={14} /> Export Report
                  </button>
                </div>
              </div>

              {/* 4 Thẻ KPI Tuyển sinh (Ảnh 2) */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#475569" }}>
                      <FileText size={15} color="#2563EB" /> Applications
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "1px 6px", borderRadius: 4 }}>
                      +12%
                    </span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                    14,285
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#475569" }}>
                      <Calendar size={15} color="#D97706" /> Exams Taken
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "1px 6px", borderRadius: 4 }}>
                      +5%
                    </span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                    8,940
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#475569" }}>
                      <Users size={15} color="#0284C7" /> Interviews
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#DC2626", background: "#FEE2E2", padding: "1px 6px", borderRadius: 4 }}>
                      -2%
                    </span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                    6,120
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#475569" }}>
                      <CheckCircle size={15} color="#16A34A" /> Enrolled
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "1px 6px", borderRadius: 4 }}>
                      +8%
                    </span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.5px" }}>
                    4,050
                  </div>
                </div>
              </div>

              {/* Hàng giữa: Conversion Funnel + Application Volume vs Target (Ảnh 2) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 18, marginBottom: 20 }}>

                {/* Conversion Funnel */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: "0 0 14px" }}>
                    Conversion Funnel
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
                        <span>Applications</span>
                        <span>14,285</span>
                      </div>
                      <div style={{ width: "100%", height: 12, borderRadius: 3, background: "#1D4ED8" }} />
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
                        <span>Exam Phase</span>
                        <span>8,940 (62%)</span>
                      </div>
                      <div style={{ width: "100%", height: 12, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                        <div style={{ width: "62%", height: "100%", background: "#0369A1" }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
                        <span>Interview Phase</span>
                        <span>6,120 (42%)</span>
                      </div>
                      <div style={{ width: "100%", height: 12, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                        <div style={{ width: "42%", height: "100%", background: "#FDBA74" }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>
                        <span>Enrolled</span>
                        <span>4,050 (28%)</span>
                      </div>
                      <div style={{ width: "100%", height: 12, borderRadius: 3, background: "#F1F5F9", overflow: "hidden" }}>
                        <div style={{ width: "28%", height: "100%", background: "#EA580C" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Volume vs Target Chart */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                      Application Volume vs Target
                    </h3>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EA580C" }} /> Actual</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#94A3B8" }} /> Target</div>
                    </div>
                  </div>

                  <div style={{ width: "100%", height: 190 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={[
                          { date: "01/10", actual: 1200, target: 1000 },
                          { date: "08/10", actual: 3400, target: 2800 },
                          { date: "15/10", actual: 7200, target: 6000 },
                          { date: "22/10", actual: 11245, target: 9800 },
                          { date: "30/10", actual: 14285, target: 12500 },
                        ]}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                        <XAxis dataKey="date" fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <YAxis fontSize={11} stroke="#94A3B8" tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="actual" stroke="#EA580C" fill="#FFEDD5" strokeWidth={3} fillOpacity={0.5} name="Thực tế (Actual)" />
                        <Line type="monotone" dataKey="target" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Chỉ tiêu (Target)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Hàng dưới: Regional Distribution + Recruitment by Source (Ảnh 2) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 18 }}>

                {/* Regional Distribution */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: "0 0 12px" }}>
                    Regional Distribution
                  </h3>

                  <div style={{
                    height: 160, borderRadius: 8, background: "linear-gradient(135deg, #E0F2FE 0%, #DCFCE7 100%)",
                    border: "1px solid #BAE6FD", position: "relative", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <div style={{ textAlign: "center", color: "#0369A1", fontSize: 12, fontWeight: 700 }}>
                      🗺️ Phân bổ nguồn hồ sơ toàn quốc
                    </div>

                    <div style={{
                      position: "absolute", bottom: 8, right: 8, background: "#FFFFFF",
                      borderRadius: 6, padding: "6px 10px", border: "1px solid #E2E8F0", fontSize: 11
                    }}>
                      <div style={{ color: "#64748B", fontSize: 9.5 }}>Khu vực Nổi bật</div>
                      <div style={{ fontWeight: 800, color: "#0F172A" }}>TP.HCM, Hà Nội</div>
                      <div style={{ fontSize: 10, color: "#16A34A", fontWeight: 700 }}>Tỷ lệ Phản hồi: 81.2%</div>
                    </div>
                  </div>
                </div>

                {/* Recruitment by Source Table */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: "0 0 12px" }}>
                    Recruitment by Source
                  </h3>

                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12 }}>
                    <thead>
                      <tr style={{ color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                        <th style={{ padding: "6px 8px", fontWeight: 700 }}>Source</th>
                        <th style={{ padding: "6px 8px", fontWeight: 700, textAlign: "center" }}>Leads</th>
                        <th style={{ padding: "6px 8px", fontWeight: 700, textAlign: "center" }}>Applied</th>
                        <th style={{ padding: "6px 8px", fontWeight: 700, textAlign: "center" }}>Enrolled</th>
                        <th style={{ padding: "6px 8px", fontWeight: 700, textAlign: "right" }}>Conv. Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recruitmentSourceData.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "8px", fontWeight: 700, color: "#0F172A" }}>{row.source}</td>
                          <td style={{ padding: "8px", textAlign: "center", color: "#64748B" }}>{row.leads}</td>
                          <td style={{ padding: "8px", textAlign: "center", color: "#64748B" }}>{row.applied}</td>
                          <td style={{ padding: "8px", textAlign: "center", color: "#EA580C", fontWeight: 800 }}>{row.enrolled}</td>
                          <td style={{ padding: "8px", textAlign: "right", color: "#0F172A", fontWeight: 700 }}>{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              MÀN HÌNH 3: DSS & CHỈ THỊ BAN GIÁM HIỆU (KẾT NỐI TRỰC TIẾP BOD DSS)
             ========================================================================= */}
          {activeTab === "dss_directives" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.3px" }}>
                    Kết Nối Hệ Thống DSS & Chỉ Thị Ban Giám Hiệu (BOD)
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0, fontWeight: 500 }}>
                    Tiếp nhận chỉ đạo điều hành thời gian thực từ BGH và chuyển hóa thành hành động tuyển sinh cụ thể
                  </p>
                </div>

                <button
                  onClick={() => showToast("Đã đồng bộ chỉ thị mới nhất từ Hội đồng Tuyển sinh BGH!")}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 6, background: "#9A3412", color: "#FFFFFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                >
                  <RefreshCw size={14} /> Đồng Bộ Chỉ Thị
                </button>
              </div>

              {/* 3 Chỉ thị Trọng tâm từ BOD */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
                {activeDirectives.map((dir) => (
                  <div key={dir.id} style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748B", fontWeight: 700 }}>{dir.id}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, background: "#FEF3C7", color: "#D97706", padding: "2px 6px", borderRadius: 4 }}>
                        {dir.status}
                      </span>
                    </div>
                    <strong style={{ fontSize: 13.5, color: "#0F172A", display: "block", marginBottom: 6 }}>
                      {dir.title}
                    </strong>
                    <div style={{ fontSize: 11.5, color: "#475569", marginBottom: 8 }}>
                      <strong>Đối tượng:</strong> {dir.targetGroup}
                    </div>
                    <div style={{ background: "#F8FAFC", borderRadius: 6, padding: "8px 10px", fontSize: 11, color: "#0F172A", border: "1px solid #E2E8F0" }}>
                      👉 <strong>Hành động NV:</strong> {dir.action}
                    </div>
                    <button
                      onClick={() => showToast(`Đã áp dụng chỉ thị ${dir.id} vào danh sách lọc thí sinh!`)}
                      style={{ width: "100%", padding: "7px", marginTop: 10, borderRadius: 6, background: "#9A3412", color: "#FFFFFF", border: "none", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                    >
                      Kích hoạt bộ lọc thí sinh
                    </button>
                  </div>
                ))}
              </div>

              {/* Bảng Danh sách Thí sinh thuộc diện Chỉ thị BGH */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: "0 0 14px" }}>
                  Danh Sách Thí Sinh Cần Hành Động Theo Chỉ Thị BGH
                </h3>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>MÃ THÍ SINH</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>HỌ VÀ TÊN</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>KHU VỰC</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>ĐIỂM XÉT TUYỂN</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>CHỈ THỊ ÁP DỤNG</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "TS-2024-0012", name: "Lê Quốc Bảo", region: "Cần Thơ (ĐBSCL)", score: "25.5đ (THPT)", directive: "Cấp học bổng ĐBSCL 30%", dirColor: "#16A34A" },
                      { id: "TS-2024-0019", name: "Nguyễn Mỹ Duyên", region: "Kiên Giang", score: "24.0đ (Học bạ)", directive: "Cảnh báo xác minh CCCD", dirColor: "#DC2626" },
                      { id: "TS-2024-0045", name: "Trần Hữu Thắng", region: "Hà Nội", score: "22.5đ (A00)", directive: "Telesales chăm sóc K19", dirColor: "#2563EB" },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px", fontFamily: "monospace", color: "#2563EB", fontWeight: 700 }}>{row.id}</td>
                        <td style={{ padding: "12px", fontWeight: 800, color: "#0F172A" }}>{row.name}</td>
                        <td style={{ padding: "12px", color: "#475569" }}>{row.region}</td>
                        <td style={{ padding: "12px", fontWeight: 700, color: "#0F172A" }}>{row.score}</td>
                        <td style={{ padding: "12px", fontWeight: 700, color: row.dirColor }}>{row.directive}</td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <button
                            onClick={() => showToast(`Đã thực thi quy trình cho thí sinh ${row.name}`)}
                            style={{ padding: "5px 12px", borderRadius: 6, background: "#0F172A", color: "#FFFFFF", border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}
                          >
                            Xử lý ngay
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
              CÁC TABS BỔ TRỢ: OVERVIEW, EXAM SCHEDULING, RESULTS, ARCHIVE
             ========================================================================= */}
          {activeTab === "overview" && (
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", margin: "0 0 6px" }}>Tổng quan Khối Tuyển sinh FPT Edu</h2>
              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 18 }}>Theo dõi tiến độ nhận hồ sơ trực tuyến, số lượng hồ sơ chờ duyệt và tỷ lệ hoàn thành KPI ngày.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <div style={{ padding: 16, background: "#EFF6FF", borderRadius: 10, border: "1px solid #DBEAFE" }}>
                  <div style={{ fontSize: 12, color: "#1E40AF", fontWeight: 700 }}>HỒ SƠ CHỜ THẨM ĐỊNH</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#1D4ED8", marginTop: 4 }}>142</div>
                </div>
                <div style={{ padding: 16, background: "#ECFDF5", borderRadius: 10, border: "1px solid #D1FAE5" }}>
                  <div style={{ fontSize: 12, color: "#065F46", fontWeight: 700 }}>ĐÃ DUYỆT TRONG NGÀY</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#047857", marginTop: 4 }}>328</div>
                </div>
                <div style={{ padding: 16, background: "#FFF7ED", borderRadius: 10, border: "1px solid #FFEDD5" }}>
                  <div style={{ fontSize: 12, color: "#9A3412", fontWeight: 700 }}>TỶ LỆ CHUẨN XÁC OCR</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#EA580C", marginTop: 4 }}>98.6%</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "exam_scheduling" && (
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", margin: 0 }}>Xếp Lịch Thi Tuyển & Phỏng Vấn Học Bổng</h2>
                  <p style={{ fontSize: 13, color: "#64748B", margin: "2px 0 0" }}>Phân phòng thi tự động và gán hội đồng giám khảo phỏng vấn</p>
                </div>
                <button onClick={() => showToast("Đã gửi giấy báo dự thi tự động qua Email & SMS tới 450 thí sinh!")} style={{ padding: "8px 16px", borderRadius: 6, background: "#9A3412", color: "#FFFFFF", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>
                  Phát Hành Giấy Báo Thi
                </button>
              </div>
              <div style={{ padding: 16, background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 13, color: "#475569" }}>
                📅 Đợt thi ĐGNL & Phỏng vấn Học bổng gần nhất: <strong>Chủ Nhật, 10/11/2024 tại 5 Campus</strong> (Tổng: 1,850 Thí sinh đăng ký).
              </div>
            </div>
          )}

          {activeTab === "results" && (
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", margin: 0 }}>Quản lý Kết Quả & Giấy Báo Trúng Tuyển Số</h2>
                  <p style={{ fontSize: 13, color: "#64748B", margin: "2px 0 0" }}>Phê duyệt điểm chuẩn và phát hành Giấy Báo Nhập Học có mã QR bảo mật</p>
                </div>
                <button onClick={() => showToast("Đã ký số và phát hành 4,050 Giấy Báo Trúng Tuyển đợt 1!")} style={{ padding: "8px 16px", borderRadius: 6, background: "#059669", color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
                  Phát Hành Giấy Báo Số
                </button>
              </div>
            </div>
          )}

          {activeTab === "archive" && (
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#0F172A", margin: "0 0 6px" }}>Kho Lưu Trữ Hồ Sơ Tuyển Sinh (Data Lakehouse)</h2>
              <p style={{ fontSize: 13, color: "#64748B" }}>Tra cứu dữ liệu tuyển sinh từ khóa K15 đến K20 phục vụ phân tích học tập và dự báo sinh viên có nguy cơ thôi học.</p>
            </div>
          )}

        </div>
      </main>

    </div>
  );
}
