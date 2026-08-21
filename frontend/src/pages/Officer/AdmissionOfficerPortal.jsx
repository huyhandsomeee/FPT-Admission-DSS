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
  ZoomIn, ZoomOut, RotateCw, ChevronLeft, Send, CheckCircle2,
  FileCheck, ShieldQuestion, QrCode, AlertOctagon, UserCheck,
  SlidersHorizontal, CheckCheck, XCircle, SearchX, Phone,
  FileSpreadsheet, BadgePercent, CheckCheckIcon
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell, LineChart, Line, AreaChart, Area, ReferenceLine,
  PieChart as RechartsPieChart, Pie
} from "recharts";
import * as XLSX from "xlsx";

import {
  loadApplicationState, saveApplicationState, logAuditEvent, pushCandidateNotification
} from "../../services/candidateAdmissionEngine";
import { CAMPUSES, MAJORS, ADMISSION_METHODS } from "../../data/admissionRulesData";

export default function AdmissionOfficerPortal() {
  const navigate = useNavigate();

  // Active Navigation Tab (8 Required Modules):
  // 1. "fast_track": Thẩm Định Nhanh (OCR Fast-Track)
  // 2. "overview": Tổng Quan Hồ Sơ & Real-time KPIs (Dashboard)
  // 3. "verification": Thẩm Định Học Bạ & Giấy Tờ (Document Verification 3-column)
  // 4. "exam_scheduling": Xếp Lịch Thi Tuyển & Phỏng Vấn Học Bổng
  // 5. "results": Kết Quả Trúng Tuyển & Giấy Báo Nhập Học
  // 6. "kpis": Báo Cáo Hiệu Suất (Recruitment Performance KPI)
  // 7. "dss_directives": Kết Nối DSS & Chỉ Thị Ban Giám Hiệu (BOD Directives)
  // 8. "archive": Kho Lưu Trữ Tuyển Sinh (Data Lakehouse & Historical Archive)
  const [activeTab, setActiveTab] = useState("dss_directives");

  // Candidate Data loaded from shared application state
  const [appState, setAppState] = useState(loadApplicationState);

  // Verification Split-screen Candidate Selection
  const [candidateList, setCandidateList] = useState([
    {
      id: "FPT-2026-894120",
      name: "Nguyễn Văn An",
      dob: "15/08/2006",
      citizenId: "001206019842",
      phone: "0912.345.678",
      email: "an.nv2006@gmail.com",
      major: "Kỹ thuật Phần mềm (Software Engineering)",
      majorCode: "7480103",
      campus: "FPT Hà Nội (Khu CNC Hòa Lạc)",
      campusCode: "HN",
      method: "Xét Học bạ THPT (SchoolRank)",
      submissionDate: "14/08/2026 09:30",
      priority: "High",
      status: "UNDER_REVIEW",
      ocrMathScore: "8.5",
      declaredMathScore: "8.8",
      confidence: 72.0,
      isDiscrepant: true,
      reviewerComments: "Điểm môn Toán học kỳ 2 trên giấy là 8.5, cần điều chỉnh lại.",
      formSent: false,
      admissionResult: "Đủ điều kiện xét tuyển (26.5đ)",
      docs: [
        { id: "doc-transcript", type: "ACADEMIC_TRANSCRIPT", name: "Học bạ THPT (3 năm)", status: "UNDER_REVIEW", statusColor: "#D97706", statusBg: "#FEF3C7" },
        { id: "doc-cccd", type: "CITIZEN_ID", name: "CCCD gắn chip (2 mặt)", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" },
        { id: "doc-photo", type: "PORTRAIT_PHOTO", name: "Ảnh chân dung 3x4", status: "NEEDS_UPDATE", statusColor: "#DC2626", statusBg: "#FEE2E2" },
        { id: "doc-ielts", type: "INTERNATIONAL_CERT_FILE", name: "Chứng chỉ IELTS 7.0", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" }
      ]
    },
    {
      id: "FPT-2026-902144",
      name: "Trần Thị Mai Anh",
      dob: "20/11/2006",
      citizenId: "079206001234",
      phone: "0987.654.321",
      email: "maianh.tran@gmail.com",
      major: "Trí tuệ Nhân tạo (AI)",
      majorCode: "7480107",
      campus: "FPT Quy Nhơn (AI Center)",
      campusCode: "QN",
      method: "Xét SAT Quốc Tế + Học bạ",
      submissionDate: "15/08/2026 14:15",
      priority: "Normal",
      status: "VERIFIED_AND_COMPLETE",
      ocrMathScore: "9.2",
      declaredMathScore: "9.2",
      confidence: 98.8,
      isDiscrepant: false,
      reviewerComments: "Hồ sơ chuẩn khớp 100% với trích xuất OCR.",
      formSent: true,
      admissionResult: "Trúng tuyển chính thức - HB 50%",
      docs: [
        { id: "doc-transcript-2", type: "ACADEMIC_TRANSCRIPT", name: "Học bạ THPT (3 năm)", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" },
        { id: "doc-cccd-2", type: "CITIZEN_ID", name: "CCCD gắn chip", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" },
        { id: "doc-ielts-2", type: "INTERNATIONAL_CERT_FILE", name: "Chứng chỉ SAT 1380", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" }
      ]
    },
    {
      id: "FPT-2026-913821",
      name: "Lê Hoàng Phúc",
      dob: "05/03/2006",
      citizenId: "080206004921",
      phone: "0903.112.233",
      email: "phucle.ic@gmail.com",
      major: "Thiết kế Vi mạch Bán dẫn",
      majorCode: "7340120",
      campus: "FPT TP.HCM (Thủ Đức)",
      campusCode: "HCM",
      method: "Điểm ĐGNL ĐHQG (890đ)",
      submissionDate: "16/08/2026 10:20",
      priority: "High",
      status: "SUBMITTED",
      ocrMathScore: "8.8",
      declaredMathScore: "8.8",
      confidence: 96.5,
      isDiscrepant: false,
      reviewerComments: "",
      formSent: false,
      admissionResult: "Đủ điều kiện xét tuyển (27.0đ)",
      docs: [
        { id: "doc-transcript-3", type: "ACADEMIC_TRANSCRIPT", name: "Học bạ THPT", status: "UNDER_REVIEW", statusColor: "#D97706", statusBg: "#FEF3C7" },
        { id: "doc-cccd-3", type: "CITIZEN_ID", name: "CCCD gắn chip", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" }
      ]
    },
    {
      id: "FPT-2026-928410",
      name: "Phạm Quỳnh Nga",
      dob: "12/09/2006",
      citizenId: "048206007812",
      phone: "0934.556.677",
      email: "quynhnga.art@gmail.com",
      major: "Thiết kế Mỹ thuật số (Digital Art)",
      majorCode: "7210403",
      campus: "FPT Đà Nẵng (Ngũ Hành Sơn)",
      campusCode: "DN",
      method: "Điểm Thi THPT (Khối V00)",
      submissionDate: "16/08/2026 15:40",
      priority: "Normal",
      status: "VERIFIED_AND_COMPLETE",
      ocrMathScore: "8.2",
      declaredMathScore: "8.2",
      confidence: 99.1,
      isDiscrepant: false,
      reviewerComments: "Hồ sơ năng khiếu và học bạ đầy đủ hợp lệ.",
      formSent: true,
      admissionResult: "Trúng tuyển chính thức (25.5đ)",
      docs: [
        { id: "doc-transcript-4", type: "ACADEMIC_TRANSCRIPT", name: "Học bạ THPT", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" },
        { id: "doc-cccd-4", type: "CITIZEN_ID", name: "CCCD gắn chip", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" }
      ]
    },
    {
      id: "FPT-2026-934512",
      name: "Đặng Minh Khang",
      dob: "28/04/2006",
      citizenId: "001206089123",
      phone: "0945.667.788",
      email: "khang.cyber@gmail.com",
      major: "An toàn Thông tin (Cybersecurity)",
      majorCode: "7480202",
      campus: "FPT Hà Nội (Khu CNC Hòa Lạc)",
      campusCode: "HN",
      method: "Xét Học bạ THPT (SchoolRank)",
      submissionDate: "17/08/2026 08:50",
      priority: "Normal",
      status: "NEEDS_UPDATE",
      ocrMathScore: "8.6",
      declaredMathScore: "8.6",
      confidence: 91.2,
      isDiscrepant: false,
      reviewerComments: "Thiếu ảnh thẻ 3x4 nền trắng và giấy xác nhận hạnh kiểm.",
      formSent: false,
      admissionResult: "Đang chờ bổ sung giấy tờ",
      docs: [
        { id: "doc-transcript-5", type: "ACADEMIC_TRANSCRIPT", name: "Học bạ THPT", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" },
        { id: "doc-photo-5", type: "PORTRAIT_PHOTO", name: "Ảnh chân dung 3x4", status: "NEEDS_UPDATE", statusColor: "#DC2626", statusBg: "#FEE2E2" }
      ]
    },
    {
      id: "FPT-2026-945671",
      name: "Võ Thảo My",
      dob: "18/07/2006",
      citizenId: "092206005612",
      phone: "0977.889.900",
      email: "thaomy.vo@gmail.com",
      major: "Quản trị Kinh doanh Quốc tế",
      majorCode: "7340101",
      campus: "FPT Cần Thơ (Ninh Kiều)",
      campusCode: "CT",
      method: "Điểm Thi THPT (Khối D01)",
      submissionDate: "17/08/2026 11:10",
      priority: "Normal",
      status: "SUBMITTED",
      ocrMathScore: "7.8",
      declaredMathScore: "7.8",
      confidence: 97.4,
      isDiscrepant: false,
      reviewerComments: "",
      formSent: false,
      admissionResult: "Đủ điều kiện xét tuyển (24.8đ)",
      docs: [
        { id: "doc-transcript-6", type: "ACADEMIC_TRANSCRIPT", name: "Học bạ THPT", status: "UNDER_REVIEW", statusColor: "#D97706", statusBg: "#FEF3C7" }
      ]
    },
    {
      id: "FPT-2026-956782",
      name: "Bùi Quốc Hưng",
      dob: "09/12/2006",
      citizenId: "079206098214",
      phone: "0966.112.233",
      email: "hung.fintech@gmail.com",
      major: "Công nghệ Tài chính (Fintech)",
      majorCode: "7340205",
      campus: "FPT TP.HCM (Thủ Đức)",
      campusCode: "HCM",
      method: "Chứng chỉ IELTS 7.5 + Học bạ",
      submissionDate: "18/08/2026 09:15",
      priority: "High",
      status: "VERIFIED_AND_COMPLETE",
      ocrMathScore: "9.0",
      declaredMathScore: "9.0",
      confidence: 99.5,
      isDiscrepant: false,
      reviewerComments: "IELTS 7.5 đạt chuẩn học bổng 30% FPT Talent.",
      formSent: true,
      admissionResult: "Trúng tuyển chính thức - HB 30%",
      docs: [
        { id: "doc-transcript-7", type: "ACADEMIC_TRANSCRIPT", name: "Học bạ THPT", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" },
        { id: "doc-ielts-7", type: "INTERNATIONAL_CERT_FILE", name: "Chứng chỉ IELTS 7.5", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" }
      ]
    },
    {
      id: "FPT-2026-967893",
      name: "Lâm Gia Bảo",
      dob: "03/01/2006",
      citizenId: "093206001928",
      phone: "0918.223.344",
      email: "giabao.lam@gmail.com",
      major: "Kỹ thuật Phần mềm (Software Engineering)",
      majorCode: "7480103",
      campus: "FPT Cần Thơ (Ninh Kiều)",
      campusCode: "CT",
      method: "Xét Học bạ THPT",
      submissionDate: "18/08/2026 14:00",
      priority: "Normal",
      status: "REJECTED",
      ocrMathScore: "6.5",
      declaredMathScore: "7.0",
      confidence: 88.0,
      isDiscrepant: true,
      reviewerComments: "Tổng điểm chưa đạt ngưỡng Top40 SchoolRank theo quy chế tuyển sinh.",
      formSent: false,
      admissionResult: "Không đạt ngưỡng sàn tuyển sinh",
      docs: [
        { id: "doc-transcript-8", type: "ACADEMIC_TRANSCRIPT", name: "Học bạ THPT", status: "NEEDS_UPDATE", statusColor: "#DC2626", statusBg: "#FEE2E2" }
      ]
    },
    {
      id: "FPT-2026-978904",
      name: "Hoàng Yến Nhi",
      dob: "14/06/2006",
      citizenId: "001206078451",
      phone: "0988.334.455",
      email: "yennhi.media@gmail.com",
      major: "Truyền thông Đa phương tiện",
      majorCode: "7320104",
      campus: "FPT Hà Nội (Khu CNC Hòa Lạc)",
      campusCode: "HN",
      method: "Tuyển thẳng HSG Quốc Gia",
      submissionDate: "19/08/2026 08:30",
      priority: "High",
      status: "VERIFIED_AND_COMPLETE",
      ocrMathScore: "9.5",
      declaredMathScore: "9.5",
      confidence: 100.0,
      isDiscrepant: false,
      reviewerComments: "Giải Ba HSG Quốc Gia môn Văn - Cấp học bổng 100% Talent.",
      formSent: true,
      admissionResult: "Tuyển thẳng - Học bổng 100%",
      docs: [
        { id: "doc-transcript-9", type: "ACADEMIC_TRANSCRIPT", name: "Học bạ THPT", status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" }
      ]
    },
    {
      id: "FPT-2026-989015",
      name: "Trịnh Đình Trọng",
      dob: "22/10/2006",
      citizenId: "077206004812",
      phone: "0933.778.899",
      email: "trong.td@gmail.com",
      major: "Công nghệ Bán dẫn (Semiconductor)",
      majorCode: "7340120",
      campus: "FPT Quy Nhơn (AI Center)",
      campusCode: "QN",
      method: "Điểm ĐGNL ĐHQG (840đ)",
      submissionDate: "19/08/2026 10:45",
      priority: "High",
      status: "UNDER_REVIEW",
      ocrMathScore: "8.9",
      declaredMathScore: "8.9",
      confidence: 97.8,
      isDiscrepant: false,
      reviewerComments: "Đang đối soát bảng điểm ĐGNL với cổng thi ĐHQG.",
      formSent: false,
      admissionResult: "Đang thẩm định hồ sơ",
      docs: [
        { id: "doc-transcript-10", type: "ACADEMIC_TRANSCRIPT", name: "Bảng điểm ĐGNL", status: "UNDER_REVIEW", statusColor: "#D97706", statusBg: "#FEF3C7" }
      ]
    }
  ]);

  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState(0);
  const currentCandidate = candidateList[selectedCandidateIndex] || candidateList[0];

  // Viewer State (Zoom & Scan Page)
  const [zoomLevel, setZoomLevel] = useState(100);
  const [scanPage, setScanPage] = useState(1);
  const [activeDocType, setActiveDocType] = useState("ACADEMIC_TRANSCRIPT");

  // Fast-track OCR Queue
  const [fastTrackQueue, setFastTrackQueue] = useState([
    { id: "FT-01", candidateName: "Trần Thị Mai Anh", docName: "Bản scan Học bạ THPT", score: "GPA 9.1", confidence: 98.8, status: "READY", campus: "FPT Quy Nhơn" },
    { id: "FT-02", candidateName: "Hoàng Minh Đức", docName: "Chứng chỉ IELTS 7.5", score: "IELTS 7.5", confidence: 99.2, status: "READY", campus: "FPT Hà Nội" },
    { id: "FT-03", candidateName: "Nguyễn Lê Quỳnh", docName: "CCCD Gắn chip", score: "ID Verified", confidence: 97.5, status: "READY", campus: "FPT TP.HCM" },
    { id: "FT-04", candidateName: "Vũ Bảo Long", docName: "Học bạ THPT", score: "GPA 8.6", confidence: 74.2, status: "WARNING", campus: "FPT Đà Nẵng" }
  ]);

  // DSS BOD Directives
  const [activeDirectives, setActiveDirectives] = useState([
    {
      id: "DIR-01",
      title: "Ưu tiên Quota Học bổng ĐBSCL (+5%)",
      targetGroup: "Thí sinh Cần Thơ & Miền Tây",
      status: "Đang áp dụng",
      action: "Tăng 5% học bổng cho thí sinh điểm TB > 8.0",
      affectedCount: 284,
      condition: "Thí sinh thuộc KV3 hoặc các tỉnh ĐBSCL (Cần Thơ, An Giang, Kiên Giang, Đồng Tháp...) có ĐTB THPT >= 8.0",
      policyBonus: "Cấp học bổng FPT Talent Miền Tây 30% - 50%"
    },
    {
      id: "DIR-02",
      title: "Cảnh báo Hồ sơ Ảo Khu vực Miền Tây",
      targetGroup: "Đối soát CCCD & SĐT phụ huynh",
      status: "Cảnh báo Cao",
      action: "Yêu cầu nộp bản sao công chứng trước 15/11",
      affectedCount: 42,
      condition: "Hồ sơ có SĐT phụ huynh trùng lặp hoặc địa chỉ CCCD không đồng nhất với trường THPT đã khai",
      policyBonus: "Yêu cầu cung cấp CCCD công chứng & xác thực sinh trắc học"
    },
    {
      id: "DIR-03",
      title: "Đẩy mạnh Telesales Nhóm Điểm Khá (21đ - 24đ)",
      targetGroup: "Thí sinh Khối A00, A01, D01",
      status: "Chiến dịch MKT",
      action: "Gọi điện tư vấn lộ trình học bổng doanh nghiệp",
      affectedCount: 512,
      condition: "Thí sinh có điểm thi THPT hoặc DGNL từ 21.0 đến 24.0 điểm nhưng chưa xác nhận nguyện vọng 1",
      policyBonus: "Tặng voucher lệ phí nhập học 2,000,000đ + Cam kết việc làm"
    },
  ]);

  // Actionable Directive Candidates List
  const [directiveCandidates, setDirectiveCandidates] = useState([
    {
      id: "TS-2026-0012",
      name: "Lê Quốc Bảo",
      phone: "0912 345 678",
      parentPhone: "0903 112 233",
      region: "Cần Thơ (ĐBSCL)",
      score: "25.5đ (THPT)",
      directiveId: "DIR-01",
      directiveTitle: "Cấp học bổng ĐBSCL 30%",
      dirColor: "#16A34A",
      status: "PENDING_ACTION",
      major: "Kỹ thuật Phần mềm (Campus Cần Thơ)"
    },
    {
      id: "TS-2026-0019",
      name: "Nguyễn Mỹ Duyên",
      phone: "0987 654 321",
      parentPhone: "0987 654 321", // Flagged duplicate
      region: "Kiên Giang (Rạch Giá)",
      score: "24.0đ (Học bạ)",
      directiveId: "DIR-02",
      directiveTitle: "Cảnh báo xác minh CCCD & SĐT",
      dirColor: "#DC2626",
      status: "FLAGGED_RISK",
      major: "Quản trị Kinh doanh"
    },
    {
      id: "TS-2026-0045",
      name: "Trần Hữu Thắng",
      phone: "0934 889 900",
      parentPhone: "0918 776 655",
      region: "Hà Nội (Cầu Giấy)",
      score: "22.5đ (A00)",
      directiveId: "DIR-03",
      directiveTitle: "Telesales chăm sóc K21",
      dirColor: "#2563EB",
      status: "IN_CAMPAIGN",
      major: "Trí tuệ Nhân tạo (AI)"
    },
  ]);

  // =========================================================================
  // MODAL STATES
  // =========================================================================
  // 1. Executive Action Modal for Candidate Directive (Xử lý thí sinh theo chỉ thị)
  const [activeActionCandidate, setActiveActionCandidate] = useState(null);
  const [actionFormData, setActionFormData] = useState({
    scholarshipLevel: "30%",
    decisionCode: "HB-DBSCL-2026-0812",
    callStatus: "Đã liên hệ - Rất quan tâm",
    verificationDeadline: "15/11/2026",
    notes: ""
  });

  // 2. Directive Scanner & Batch Filter Modal (Kích hoạt bộ lọc thí sinh)
  const [activeFilterDirective, setActiveFilterDirective] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(100);

  // 3. BOD Sync Directives Modal (Đồng bộ chỉ thị BGH)
  const [isSyncDirectivesModalOpen, setIsSyncDirectivesModalOpen] = useState(false);

  // 4. Exam Schedule Batch Dispatch Modal (Phát hành giấy báo thi)
  const [isExamDispatchModalOpen, setIsExamDispatchModalOpen] = useState(false);

  // 5. Digital Admission Letter Batch Modal (Ký số & phát hành giấy báo trúng tuyển)
  const [isAdmissionLetterModalOpen, setIsAdmissionLetterModalOpen] = useState(false);

  // 6. Reject Document Reason Modal (Từ chối tài liệu kèm lý do chi tiết)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReasons, setRejectReasons] = useState({
    blurry: true,
    discrepancy: true,
    missingStamp: false,
    expiredId: false,
    customNote: "Điểm môn Toán học kỳ 2 trên giấy là 8.5 (thí sinh khai 8.8). Vui lòng cập nhật lại."
  });

  // 7. Modal Xác Nhận Hồ Sơ Đầy Đủ & Gửi Phiếu Đăng Ký Đại Học FPT
  const [isEnrollmentDispatchModalOpen, setIsEnrollmentDispatchModalOpen] = useState(false);
  const [enrollmentDispatchCandidate, setEnrollmentDispatchCandidate] = useState(null);
  const [dispatchChannels, setDispatchChannels] = useState({
    portal: true,
    email: true,
    sms: true
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  // Overview Table Filters & Selection
  const [overviewSearch, setOverviewSearch] = useState("");
  const [overviewCampusFilter, setOverviewCampusFilter] = useState("all");
  const [overviewStatusFilter, setOverviewStatusFilter] = useState("all");
  const [overviewMajorFilter, setOverviewMajorFilter] = useState("all");
  const [selectedCandidateIds, setSelectedCandidateIds] = useState([]);
  const [selectedStudentDetailModal, setSelectedStudentDetailModal] = useState(null);

  // Archive Filter State
  const [archiveSearch, setArchiveSearch] = useState("");
  const [archiveCohortFilter, setArchiveCohortFilter] = useState("all");

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Enrollment Form Dispatch Modal
  const handleOpenEnrollmentDispatch = (candidate = currentCandidate) => {
    setEnrollmentDispatchCandidate(candidate);
    setIsEnrollmentDispatchModalOpen(true);
  };

  // Handle Confirm Complete Profile & Send Enrollment Form
  const handleConfirmEnrollmentDispatch = () => {
    const cand = enrollmentDispatchCandidate || currentCandidate;
    if (!cand) return;

    // 1. Update Officer local candidate list
    setCandidateList(prev => prev.map(c => {
      if (c.id === cand.id) {
        return {
          ...c,
          status: "VERIFIED_AND_COMPLETE",
          formSent: true,
          docs: c.docs.map(d => ({ ...d, status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" }))
        };
      }
      return c;
    }));

    // 2. Sync to candidate's state in localStorage
    const savedApp = loadApplicationState();
    const updatedApp = {
      ...savedApp,
      status: "VERIFIED_AND_COMPLETE",
      documents: savedApp.documents.map(d => ({
        ...d,
        status: "VERIFIED",
        reviewerNotes: "Cán bộ tuyển sinh đã thẩm định: Hồ sơ ĐẦY ĐỦ YÊU CẦU & HỢP LỆ.",
        reviewedAt: new Date().toLocaleString("vi-VN")
      }))
    };
    saveApplicationState(updatedApp);

    // 3. Push real-time candidate notification
    pushCandidateNotification(
      "🎉 Hồ sơ xét tuyển đã ĐẦY ĐỦ & HỢP LỆ!",
      `Cán bộ tuyển sinh đã thẩm định thành công hồ sơ ${cand.id}. Mẫu Phiếu Đăng Ký Đại Học FPT (Hệ chính quy) đã được gửi đến tài khoản của bạn để hoàn tất nhập học.`,
      "SUCCESS",
      "enrollment_form"
    );

    // 4. Audit Log
    logAuditEvent(
      "OFFICER_SEND_ENROLLMENT_REGISTRATION_FORM",
      `Cán bộ xác nhận hồ sơ ${cand.id} (${cand.name}) ĐẦY ĐỦ YÊU CẦU và đã gửi Phiếu Đăng Ký Đại Học FPT kèm thông báo nhập học.`,
      "Admission Officer"
    );

    setIsEnrollmentDispatchModalOpen(false);
    showToast(`🎉 Đã xác nhận hồ sơ ${cand.name} ĐẦY ĐỦ và gửi Phiếu Đăng Ký Đại Học FPT thành công!`, "success");
  };

  // Keyboard shortcut: Ctrl + Enter to quick approve & next
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        handleApproveAndNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCandidateIndex, candidateList]);

  // Handle Approve and Next
  const handleApproveAndNext = () => {
    const candidate = currentCandidate;
    if (!candidate) return;

    // 1. Update Officer local candidate state
    const updatedCandidates = candidateList.map((c, idx) => {
      if (idx === selectedCandidateIndex) {
        return {
          ...c,
          status: "VERIFIED",
          docs: c.docs.map(d => ({ ...d, status: "VERIFIED", statusColor: "#16A34A", statusBg: "#DCFCE7" }))
        };
      }
      return c;
    });
    setCandidateList(updatedCandidates);

    // 2. Sync to candidate's actual application state in localStorage
    const savedApp = loadApplicationState();
    const updatedApp = {
      ...savedApp,
      status: "VERIFIED",
      documents: savedApp.documents.map(d => ({
        ...d,
        status: "VERIFIED",
        reviewerNotes: "Cán bộ tuyển sinh đã duyệt và xác thực hồ sơ hợp lệ.",
        reviewedAt: new Date().toLocaleString("vi-VN")
      }))
    };
    saveApplicationState(updatedApp);
    logAuditEvent("OFFICER_APPROVE_DOCUMENT", `Cán bộ tuyển sinh thẩm định hợp lệ hồ sơ ${candidate.id}`, "Admission Officer");

    showToast(`✅ Đã phê duyệt hồ sơ ${candidate.id} (${candidate.name})! Tự động chuyển sang hồ sơ tiếp theo.`);

    // Move to next candidate in queue
    if (selectedCandidateIndex < candidateList.length - 1) {
      setSelectedCandidateIndex(prev => prev + 1);
    }
  };

  // Handle Execute Candidate Action in Modal
  const handleConfirmCandidateAction = () => {
    if (!activeActionCandidate) return;

    const cand = activeActionCandidate;

    // Update directive candidates status
    setDirectiveCandidates(prev => prev.map(c => {
      if (c.id === cand.id) {
        return {
          ...c,
          status: cand.directiveId === "DIR-01" ? "SCHOLARSHIP_GRANTED" : cand.directiveId === "DIR-02" ? "VERIFICATION_SENT" : "CONSULTED",
          actionNote: actionFormData.notes || (cand.directiveId === "DIR-01" ? `Đã duyệt cấp học bổng ${actionFormData.scholarshipLevel}` : cand.directiveId === "DIR-02" ? "Đã gửi yêu cầu đối soát CCCD công chứng" : actionFormData.callStatus)
        };
      }
      return c;
    }));

    // Log audit event
    logAuditEvent("OFFICER_BOD_DIRECTIVE_APPLY", `Thực thi chỉ thị ${cand.directiveId} cho thí sinh ${cand.name} (${cand.id}): ${actionFormData.notes || actionFormData.decisionCode || actionFormData.callStatus}`, "Admission Officer");

    setActiveActionCandidate(null);
    showToast(`✅ Đã thực thi xong quy trình cho thí sinh ${cand.name}!`);
  };

  // Handle Execute Reject with Modal
  const handleConfirmReject = () => {
    const candidate = currentCandidate;
    if (!candidate) return;

    const reasonItems = [];
    if (rejectReasons.blurry) reasonItems.push("Ảnh chụp scan bị mờ/khó đọc");
    if (rejectReasons.discrepancy) reasonItems.push("Lệch điểm môn học giữa khai báo và học bạ");
    if (rejectReasons.missingStamp) reasonItems.push("Thiếu dấu giáp lai xác nhận THPT");
    if (rejectReasons.expiredId) reasonItems.push("Giấy tờ định danh hết hạn hoặc không khớp");
    if (rejectReasons.customNote) reasonItems.push(rejectReasons.customNote);

    const fullReason = reasonItems.join(". ");

    // 1. Update Officer local candidate state
    const updatedCandidates = candidateList.map((c, idx) => {
      if (idx === selectedCandidateIndex) {
        return {
          ...c,
          status: "NEEDS_UPDATE",
          reviewerComments: fullReason,
          docs: c.docs.map(d => d.type === activeDocType ? { ...d, status: "NEEDS_UPDATE", statusColor: "#DC2626", statusBg: "#FEE2E2" } : d)
        };
      }
      return c;
    });
    setCandidateList(updatedCandidates);

    // 2. Sync to candidate's actual application state in localStorage
    const savedApp = loadApplicationState();
    const updatedApp = {
      ...savedApp,
      status: "NEEDS_UPDATE",
      documents: savedApp.documents.map(d => {
        if (d.type === activeDocType || d.type === "PORTRAIT_PHOTO") {
          return {
            ...d,
            status: "NEEDS_UPDATE",
            reviewerNotes: fullReason,
            reviewedAt: new Date().toLocaleString("vi-VN")
          };
        }
        return d;
      })
    };
    saveApplicationState(updatedApp);
    logAuditEvent("OFFICER_REJECT_DOCUMENT", `Cán bộ tuyển sinh yêu cầu bổ sung hồ sơ ${candidate.id}: ${fullReason}`, "Admission Officer");

    setIsRejectModalOpen(false);
    showToast(`⚠️ Đã gửi yêu cầu bổ sung giấy tờ tới thí sinh ${candidate.name}!`, "warning");
  };

  // Export Admission Performance Report to Excel
  const handleExportAdmissionReport = () => {
    const wsData = [
      ["BÁO CÁO KẾT QUẢ & HIỆU SUẤT TUYỂN SINH - ĐẠI HỌC FPT 2026"],
      ["Thời gian xuất báo cáo:", new Date().toLocaleString("vi-VN")],
      ["Cán bộ thẩm định:", "Phòng Quản lý Tuyển sinh (Admissions Management)"],
      [],
      ["1. HIỆU SUẤT PHỄU TUYỂN SINH (CONVERSION FUNNEL)"],
      ["GIAI ĐOẠN", "SỐ LƯỢNG", "TỶ LỆ CHUYỂN ĐỔI", "TĂNG TRƯỞNG SO CÙNG KỲ"],
      ["Hồ sơ đăng ký (Applications)", "14,285", "100%", "+12%"],
      ["Thí sinh dự thi ĐGNL (Exams Taken)", "8,940", "62.5%", "+5%"],
      ["Phỏng vấn học bổng (Interviews)", "6,120", "42.8%", "-2%"],
      ["Nhập học chính thức (Enrolled)", "4,050", "28.3%", "+8%"],
      [],
      ["2. PHÂN BỔ NGUỒN TUYỂN SINH (RECRUITMENT BY SOURCE)"],
      ["NGUỒN", "LEADS", "APPLIED", "ENROLLED", "TỶ LỆ CHUYỂN ĐỔI"],
      ["School Visits (Trực tiếp THPT)", "5,200", "2,100", "850", "16.3%"],
      ["Digital Ads (Facebook, TikTok)", "12,500", "3,400", "620", "4.9%"],
      ["Organic Search / Cổng thông tin", "8,100", "2,800", "780", "9.6%"],
      ["Referrals (Giới thiệu)", "1,800", "1,500", "950", "52.7%"],
      ["Education Fairs (Ngày hội tư vấn)", "4,300", "1,200", "310", "7.2%"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Admissions_Report_2026");
    XLSX.writeFile(wb, `FPT_Admissions_Performance_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Đã xuất báo cáo hiệu suất tuyển sinh thành công (Excel)!");
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

      {/* ── SIDEBAR CÁN BỘ TUYỂN SINH FPTU ── */}
      <aside style={{
        width: 245, background: "#FFFFFF", borderRight: "1px solid #E2E8F0",
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
              fontSize: 17, boxShadow: "0 2px 8px rgba(234,88,12,0.3)"
            }}>
              🏛️
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#9A3412", letterSpacing: "-0.2px", lineHeight: 1.15 }}>
                Phòng Tuyển Sinh FPT
              </div>
              <div style={{ fontSize: 10, color: "#64748B", fontWeight: 700, marginTop: 2, letterSpacing: "0.5px" }}>
                HỆ THỐNG THẨM ĐỊNH & QUẢN TRỊ
              </div>
            </div>
          </div>

          {/* Quick Action: Thẩm Định Nhanh (OCR Fast-Track) */}
          <div style={{ padding: "12px 12px 6px" }}>
            <button
              onClick={() => {
                setActiveTab("fast_track");
                showToast("Đang mở Hàng đợi Thẩm định Nhanh OCR (Fast-Track)!");
              }}
              style={{
                width: "100%", padding: "9px 12px", borderRadius: 8,
                background: "#9A3412", color: "#FFFFFF", border: "none",
                fontWeight: 800, fontSize: 12.5, display: "flex", alignItems: "center",
                justifyContent: "center", gap: 6, cursor: "pointer",
                boxShadow: "0 3px 8px rgba(154,52,18,0.25)"
              }}
            >
              <Zap size={15} /> Thẩm Định Nhanh (OCR)
            </button>
          </div>

          {/* 8 Menu Modules */}
          <nav style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { id: "dss_directives", icon: Bot, label: "DSS & Chỉ Thị BGH", desc: "Đồng bộ quyết định BGH", badge: "3 MỚI" },
              { id: "verification", icon: ShieldCheck, label: "Thẩm Định Học Bạ", desc: "Soi học bạ & đối soát OCR", badge: "HOT" },
              { id: "overview", icon: LayoutDashboard, label: "Tổng Quan Hồ Sơ", desc: "KPIs & Tiến độ ngày", badge: "142" },
              { id: "fast_track", icon: Zap, label: "OCR Fast-Track", desc: "Duyệt hàng loạt AI >95%" },
              { id: "exam_scheduling", icon: Calendar, label: "Xếp Lịch Thi Tuyển", desc: "Xếp phòng & SBD" },
              { id: "results", icon: CheckSquare, label: "Kết Quả & Giấy Báo", desc: "Ký số & phát hành QR" },
              { id: "kpis", icon: BarChart3, label: "Báo Cáo Hiệu Suất", desc: "Conversion Funnel" },
              { id: "archive", icon: Database, label: "Kho Lưu Trữ Tuyển Sinh", desc: "Data Lakehouse K15-K20" },
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
                    <span style={{ fontSize: 9.5, fontWeight: 800, background: isActive ? "#FFFFFF" : "#FFEDD5", color: isActive ? "#EA580C" : "#9A3412", padding: "1px 6px", borderRadius: 4 }}>
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
            onClick={() => navigate("/candidate")}
            style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "7px 10px", border: "none", background: "transparent", fontSize: 12, color: "#2563EB", fontWeight: 700, cursor: "pointer", textAlign: "left" }}
          >
            <Globe size={15} /> Mở Cổng Thí Sinh (/candidate)
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

        {/* ── TOP HEADER NAVBAR ── */}
        <header style={{
          height: 58, background: "#FFFFFF", borderBottom: "1px solid #E2E8F0",
          padding: "0 28px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexShrink: 0, position: "sticky", top: 0, zIndex: 20
        }}>
          {/* Search candidates */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 8,
            padding: "6px 14px", width: 300
          }}>
            <Search size={14} color="#94A3B8" />
            <input
              type="text"
              placeholder="Tìm kiếm hồ sơ (Mã hồ sơ, Họ tên, SĐT)..."
              style={{ border: "none", background: "transparent", outline: "none", fontSize: 12.5, width: "100%", color: "#334155" }}
            />
          </div>

          {/* Right Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* Directives Banner */}
            <button
              onClick={() => setIsSyncDirectivesModalOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "5px 12px",
                borderRadius: 6, background: "#FFF7ED", border: "1px solid #FFEDD5",
                fontSize: 11.5, fontWeight: 700, color: "#9A3412", cursor: "pointer"
              }}
            >
              <Bot size={14} /> 3 Chỉ thị BGH Đang Áp Dụng
            </button>

            <button
              onClick={() => showToast("Hệ thống có 5 hồ sơ ưu tiên cần thẩm định gấp trong ngày")}
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
                CB
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0F172A" }}>Trần Hoàng Nam (Officer)</span>
            </div>
          </div>
        </header>

        {/* ── MAIN BODY CONTENT ── */}
        <div style={{ flex: 1, padding: "20px 26px 40px", maxWidth: 1440, width: "100%", margin: "0 auto", boxSizing: "border-box" }}>

          {/* =========================================================================
              MODULE 7: KẾT NỐI DSS & CHỈ THỊ BAN GIÁM HIỆU (BOD DIRECTIVES)
             ========================================================================= */}
          {activeTab === "dss_directives" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#EA580C", fontWeight: 800, fontSize: 12.5, marginBottom: 4 }}>
                    <Bot size={16} /> FPT UNIVERSITY ADMISSIONS DSS ENGINE
                  </div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                    Kết Nối Hệ Thống DSS &amp; Chỉ Thị Ban Giám Hiệu (BOD)
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: "2px 0 0" }}>
                    Tiếp nhận chỉ đạo điều hành thời gian thực từ BGH và chuyển hóa thành quy trình thẩm định &amp; xử lý hồ sơ tự động
                  </p>
                </div>

                <button
                  onClick={() => setIsSyncDirectivesModalOpen(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
                    borderRadius: 8, background: "#9A3412", color: "#FFFFFF",
                    border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer",
                    boxShadow: "0 3px 8px rgba(154,52,18,0.25)"
                  }}
                >
                  <RefreshCw size={14} /> Đồng Bộ Chỉ Thị Mới Nhất
                </button>
              </div>

              {/* 3 Directive Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {activeDirectives.map((dir) => (
                  <div key={dir.id} style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontFamily: "monospace", color: "#64748B", fontWeight: 700 }}>{dir.id}</span>
                        <span style={{ fontSize: 10, fontWeight: 800, background: "#FEF3C7", color: "#D97706", padding: "2px 6px", borderRadius: 4 }}>
                          {dir.status}
                        </span>
                      </div>
                      <strong style={{ fontSize: 14, color: "#0F172A", display: "block", marginBottom: 6 }}>
                        {dir.title}
                      </strong>
                      <div style={{ fontSize: 11.5, color: "#475569", marginBottom: 8 }}>
                        <strong>Đối tượng:</strong> {dir.targetGroup} (<strong style={{ color: "#EA580C" }}>{dir.affectedCount}</strong> hồ sơ)
                      </div>
                      <div style={{ background: "#F8FAFC", borderRadius: 6, padding: "8px 10px", fontSize: 11, color: "#0F172A", border: "1px solid #E2E8F0", marginBottom: 12 }}>
                        👉 <strong>Hành động NV:</strong> {dir.action}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveFilterDirective(dir);
                        setIsScanning(true);
                        setScanProgress(0);
                        let prog = 0;
                        const interval = setInterval(() => {
                          prog += 25;
                          setScanProgress(prog);
                          if (prog >= 100) {
                            clearInterval(interval);
                            setIsScanning(false);
                          }
                        }, 200);
                      }}
                      style={{ width: "100%", padding: "8px", borderRadius: 6, background: "#9A3412", color: "#FFFFFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                    >
                      <Filter size={14} /> Kích hoạt bộ lọc thí sinh
                    </button>
                  </div>
                ))}
              </div>

              {/* Candidate Action Table */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                      Danh Sách Thí Sinh Cần Hành Động Theo Chỉ Thị BGH
                    </h3>
                    <p style={{ fontSize: 12, color: "#64748B", margin: "2px 0 0" }}>
                      Bấm "Xử lý ngay" để mở màn hình thực thi quy trình cấp học bổng, xác thực hoặc tư vấn cho thí sinh
                    </p>
                  </div>
                  <span style={{ fontSize: 11.5, color: "#EA580C", fontWeight: 800, background: "#FFF7ED", padding: "4px 10px", borderRadius: 6, border: "1px solid #FFEDD5" }}>
                    3 Hồ sơ ưu tiên hành động
                  </span>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>MÃ THÍ SINH</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>HỌ VÀ TÊN</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>KHU VỰC</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>ĐIỂM XÉT TUYỂN</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>CHỈ THỊ ÁP DỤNG</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>TRẠNG THÁI HIỆN TẠI</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {directiveCandidates.map((row) => (
                      <tr key={row.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px", fontFamily: "monospace", color: "#2563EB", fontWeight: 700 }}>{row.id}</td>
                        <td style={{ padding: "12px", fontWeight: 800, color: "#0F172A" }}>
                          {row.name}
                          <div style={{ fontSize: 10.5, color: "#64748B", fontWeight: 500 }}>SĐT: {row.phone}</div>
                        </td>
                        <td style={{ padding: "12px", color: "#475569" }}>{row.region}</td>
                        <td style={{ padding: "12px", fontWeight: 700, color: "#0F172A" }}>{row.score}</td>
                        <td style={{ padding: "12px", fontWeight: 700, color: row.dirColor }}>
                          <span style={{ fontSize: 10.5, background: "#F1F5F9", padding: "2px 6px", borderRadius: 4, marginRight: 4, color: "#475569" }}>
                            {row.directiveId}
                          </span>
                          {row.directiveTitle}
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800,
                            background: row.status === "SCHOLARSHIP_GRANTED" ? "#DCFCE7" : row.status === "FLAGGED_RISK" ? "#FEE2E2" : "#FEF3C7",
                            color: row.status === "SCHOLARSHIP_GRANTED" ? "#16A34A" : row.status === "FLAGGED_RISK" ? "#DC2626" : "#D97706"
                          }}>
                            {row.status === "SCHOLARSHIP_GRANTED" ? "✓ Đã Cấp Học Bổng" : row.status === "FLAGGED_RISK" ? "⚠️ Cảnh Báo Ảo" : row.status === "VERIFICATION_SENT" ? "Đã Gửi Yêu Cầu" : "Chờ Thao Tác"}
                          </span>
                          {row.actionNote && (
                            <div style={{ fontSize: 10.5, color: "#64748B", marginTop: 2 }}>{row.actionNote}</div>
                          )}
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <button
                            onClick={() => {
                              setActiveActionCandidate(row);
                              setActionFormData({
                                scholarshipLevel: "30%",
                                decisionCode: `HB-DBSCL-${row.id.replace("TS-", "")}`,
                                callStatus: "Đã liên hệ - Rất quan tâm",
                                verificationDeadline: "15/11/2026",
                                notes: ""
                              });
                            }}
                            style={{
                              padding: "6px 14px", borderRadius: 6, background: "#0F172A",
                              color: "#FFFFFF", border: "none", fontSize: 11.5, fontWeight: 800,
                              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                            }}
                          >
                            <SlidersHorizontal size={13} /> Xử lý ngay
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
              MODULE 3: THẨM ĐỊNH HỌC BẠ & GIẤY TỜ (3-COLUMN SPLIT SCREEN)
             ========================================================================= */}
          {activeTab === "verification" && (
            <div style={{ display: "grid", gridTemplateColumns: "310px 1fr 350px", gap: 16, alignItems: "start" }}>

              {/* CỘT TRÁI: THÔNG TIN ỨNG VIÊN & HỒ SƠ YÊU CẦU */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Candidate Info Card */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "#FFEDD5", color: "#EA580C", display: "flex",
                      alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14,
                      border: "1px solid #FED7AA"
                    }}>
                      {currentCandidate.name.split(" ").map(w => w[0]).slice(-2).join("")}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <strong style={{ fontSize: 14, color: "#0F172A" }}>{currentCandidate.name}</strong>
                        <span style={{ fontSize: 10, background: "#F1F5F9", padding: "1px 6px", borderRadius: 4, fontWeight: 700, color: "#64748B" }}>
                          {currentCandidate.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, fontFamily: "monospace", color: "#64748B" }}>
                        ID: {currentCandidate.id}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 11.5, paddingTop: 10, borderTop: "1px solid #F1F5F9" }}>
                    <div>
                      <div style={{ color: "#94A3B8", fontWeight: 800, fontSize: 10 }}>MAJOR</div>
                      <strong style={{ color: "#0F172A", fontSize: 11 }}>{currentCandidate.major}</strong>
                    </div>
                    <div>
                      <div style={{ color: "#94A3B8", fontWeight: 800, fontSize: 10 }}>CAMPUS</div>
                      <strong style={{ color: "#0F172A", fontSize: 11 }}>{currentCandidate.campus}</strong>
                    </div>
                    <div>
                      <div style={{ color: "#94A3B8", fontWeight: 800, fontSize: 10 }}>SUBMISSION DATE</div>
                      <span style={{ color: "#475569" }}>{currentCandidate.submissionDate}</span>
                    </div>
                    <div>
                      <div style={{ color: "#94A3B8", fontWeight: 800, fontSize: 10 }}>PRIORITY</div>
                      <strong style={{ color: "#DC2626" }}>! {currentCandidate.priority}</strong>
                    </div>
                  </div>
                </div>

                {/* Required Documents Card */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800, color: "#0F172A" }}>
                      <FileText size={15} color="#2563EB" /> Required Documents
                    </div>
                    <span style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>
                      {currentCandidate.docs.filter(d => d.status === "VERIFIED").length} / {currentCandidate.docs.length} Verified
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {currentCandidate.docs.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setActiveDocType(doc.type)}
                        style={{
                          padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                          border: activeDocType === doc.type ? "2px solid #EA580C" : "1px solid #E2E8F0",
                          background: activeDocType === doc.type ? "#FFF7ED" : "#FFFFFF",
                          display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>{doc.name}</div>
                          <div style={{ fontSize: 10, color: "#64748B" }}>{doc.type}</div>
                        </div>

                        <span style={{ fontSize: 10, fontWeight: 800, color: doc.statusColor, background: doc.statusBg, padding: "2px 7px", borderRadius: 4 }}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Queue Navigator */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>
                    Hồ sơ {selectedCandidateIndex + 1} / {candidateList.length}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      disabled={selectedCandidateIndex === 0}
                      onClick={() => setSelectedCandidateIndex(prev => prev - 1)}
                      style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: selectedCandidateIndex === 0 ? "not-allowed" : "pointer" }}
                    >
                      &lt;
                    </button>
                    <button
                      disabled={selectedCandidateIndex === candidateList.length - 1}
                      onClick={() => setSelectedCandidateIndex(prev => prev + 1)}
                      style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: selectedCandidateIndex === candidateList.length - 1 ? "not-allowed" : "pointer" }}
                    >
                      &gt;
                    </button>
                  </div>
                </div>

              </div>

              {/* CỘT GIỮA: TRÌNH SOI HỌC BẠ OCR VỚI KHUNG ĐỎ HIGHLIGHT ĐIỂM */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "16px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 800, color: "#0F172A" }}>
                    <Eye size={16} color="#2563EB" /> Verifying: {activeDocType === "ACADEMIC_TRANSCRIPT" ? "Học bạ THPT (Bản scan)" : "Giấy tờ minh chứng"}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => setZoomLevel(Math.max(zoomLevel - 15, 70))} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}><ZoomOut size={13} /></button>
                    <button onClick={() => setZoomLevel(Math.min(zoomLevel + 15, 150))} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}><ZoomIn size={13} /></button>
                    <button onClick={() => setZoomLevel(100)} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: "#FFF", cursor: "pointer" }}><RotateCw size={13} /></button>
                  </div>
                </div>

                {/* Scan Image Container với Khung Đỏ Highlight Điểm Toán */}
                <div style={{
                  height: 480, background: "#F1F5F9", borderRadius: 8, border: "1px solid #E2E8F0",
                  position: "relative", overflow: "hidden", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center"
                }}>
                  {/* Bảng điểm Học bạ THPT có Khung Đỏ */}
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
                        <tr style={{ background: currentCandidate.isDiscrepant ? "#FFFBEB" : "transparent" }}>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1", fontWeight: 800, textAlign: "left" }}>1. Toán học</td>
                          <td style={{ padding: "5px", border: "1px solid #CBD5E1" }}>8.8</td>
                          <td style={{
                            padding: "5px", border: currentCandidate.isDiscrepant ? "2px solid #DC2626" : "1px solid #CBD5E1",
                            fontWeight: 900, color: currentCandidate.isDiscrepant ? "#DC2626" : "#0F172A",
                            background: currentCandidate.isDiscrepant ? "#FEE2E2" : "transparent"
                          }}>
                            {currentCandidate.isDiscrepant ? `${currentCandidate.declaredMathScore} ➔ ${currentCandidate.ocrMathScore}` : currentCandidate.ocrMathScore}
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

              {/* CỘT PHẢI: EXTRACTED DATA & APPROVE / REJECT */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "#64748B", letterSpacing: "0.5px" }}>EXTRACTED DATA</div>
                  <p style={{ fontSize: 11, color: "#94A3B8", margin: "2px 0 0" }}>
                    So sánh giá trị OCR trích xuất với giá trị thí sinh tự khai.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 3 }}>Họ và tên thí sinh</label>
                    <input
                      type="text" value={currentCandidate.name} readOnly
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12, background: "#FAFAFA", fontWeight: 700 }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 3 }}>Ngày sinh</label>
                    <input
                      type="text" value={currentCandidate.dob} readOnly
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12, background: "#FAFAFA" }}
                    />
                  </div>

                  {/* Warning Box AI Scored Math */}
                  <div style={{ background: currentCandidate.confidence < 80 ? "#FFFBEB" : "#F0FDF4", borderRadius: 8, border: currentCandidate.confidence < 80 ? "1px solid #FDE68A" : "1px solid #BBF7D0", padding: "10px 12px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 800, color: currentCandidate.confidence < 80 ? "#D97706" : "#166534" }}>
                        {currentCandidate.confidence < 80 ? "⚠️ Grade 12 Math Avg (Lệch)" : "✓ Grade 12 Math Avg (Khớp)"}
                      </div>
                      <span style={{ fontSize: 9.5, color: currentCandidate.confidence < 80 ? "#92400E" : "#15803D", background: currentCandidate.confidence < 80 ? "#FEF3C7" : "#DCFCE7", padding: "1px 5px", borderRadius: 4, fontWeight: 700 }}>
                        Confidence: {currentCandidate.confidence}%
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      <div>
                        <span style={{ fontSize: 9.5, color: "#64748B" }}>Thí sinh khai:</span>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#DC2626" }}>{currentCandidate.declaredMathScore}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: 9.5, color: "#64748B" }}>OCR bóc tách:</span>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "#16A34A" }}>{currentCandidate.ocrMathScore}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 3 }}>Ghi chú Cán bộ</label>
                    <textarea
                      placeholder="Nhập lý do chi tiết..."
                      value={currentCandidate.reviewerComments}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCandidateList(prev => prev.map((c, i) => i === selectedCandidateIndex ? { ...c, reviewerComments: val } : c));
                      }}
                      rows={3}
                      style={{ width: "100%", padding: "7px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 11.5, resize: "none" }}
                    />
                  </div>
                </div>

                {/* Approve & Reject Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 8 }}>
                    <button
                      onClick={() => setIsRejectModalOpen(true)}
                      style={{ padding: "9px 10px", borderRadius: 6, border: "1px solid #FCA5A5", background: "#FFF", color: "#DC2626", fontWeight: 700, fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                    >
                      <X size={14} /> Yêu cầu bổ sung
                    </button>

                    <button
                      onClick={handleApproveAndNext}
                      style={{ padding: "9px 10px", borderRadius: 6, border: "none", background: "#0F172A", color: "#FFFFFF", fontWeight: 800, fontSize: 11.5, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, boxShadow: "0 2px 6px rgba(15,23,42,0.25)" }}
                    >
                      <Check size={14} /> Duyệt &amp; Tiếp theo
                    </button>
                  </div>

                  {/* Primary Officer Action: Xác nhận hồ sơ đầy đủ & gửi phiếu đăng ký */}
                  <button
                    onClick={() => handleOpenEnrollmentDispatch(currentCandidate)}
                    style={{
                      width: "100%", padding: "10px 12px", borderRadius: 8,
                      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                      color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 12,
                      cursor: "pointer", display: "flex", alignItems: "center",
                      justifyContent: "center", gap: 6, boxShadow: "0 3px 10px rgba(5,150,105,0.3)"
                    }}
                  >
                    <FileCheck size={16} /> Xác Nhận Đầy Đủ &amp; Gửi Phiếu ĐK
                  </button>
                </div>
                <div style={{ textAlign: "center", fontSize: 9.5, color: "#94A3B8", marginTop: 6 }}>
                  Phím tắt: <strong>Ctrl + Enter</strong> để duyệt nhanh hồ sơ
                </div>
              </div>

            </div>
          )}

          {/* =========================================================================
              MODULE 1: THẨM ĐỊNH NHANH (OCR FAST-TRACK)
             ========================================================================= */}
          {activeTab === "fast_track" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#EA580C", fontWeight: 800, fontSize: 12.5, marginBottom: 4 }}>
                    <Zap size={16} /> AI OCR FAST-TRACK VERIFICATION
                  </div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                    Hàng Đợi Thẩm Định Nhanh OCR (Độ Chính Xác Cao)
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: "2px 0 0" }}>
                    Xử lý hàng loạt các hồ sơ có độ tin cậy AI &gt; 95% để giảm 70% thời gian thẩm định thủ công.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      setFastTrackQueue(prev => prev.map(item => ({ ...item, status: "APPROVED" })));
                      showToast("✅ Đã duyệt tự động toàn bộ hồ sơ đạt độ tin cậy >95%!");
                    }}
                    style={{
                      padding: "8px 18px", borderRadius: 8, background: "#16A34A",
                      color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 800,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                    }}
                  >
                    <CheckCheck size={16} /> Duyệt Nhanh Tất Cả (&gt;95%)
                  </button>
                </div>
              </div>

              {/* Fast Track Table */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>MÃ HỒ SƠ</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>HỌ VÀ TÊN</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>LOẠI TÀI LIỆU</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>KẾT QUẢ OCR</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>AI CONFIDENCE</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>CƠ SỞ</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fastTrackQueue.map((item) => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px", fontFamily: "monospace", color: "#2563EB", fontWeight: 700 }}>{item.id}</td>
                        <td style={{ padding: "12px", fontWeight: 800, color: "#0F172A" }}>{item.candidateName}</td>
                        <td style={{ padding: "12px", color: "#475569" }}>{item.docName}</td>
                        <td style={{ padding: "12px", fontWeight: 800, color: "#EA580C" }}>{item.score}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "3px 8px", borderRadius: 6, fontSize: 11.5, fontWeight: 800,
                            background: item.confidence >= 95 ? "#DCFCE7" : "#FEF3C7",
                            color: item.confidence >= 95 ? "#16A34A" : "#D97706"
                          }}>
                            {item.confidence}% {item.confidence >= 95 ? "✓ Cao" : "⚠️ Cần soi"}
                          </span>
                        </td>
                        <td style={{ padding: "12px", color: "#64748B" }}>{item.campus}</td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          {item.status === "APPROVED" ? (
                            <span style={{ color: "#16A34A", fontWeight: 800, fontSize: 12 }}>✓ Đã duyệt</span>
                          ) : (
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                              <button
                                onClick={() => {
                                  setActiveTab("verification");
                                  showToast(`Đã mở màn hình soi chi tiết học bạ của thí sinh ${item.candidateName}`);
                                }}
                                style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}
                              >
                                Soi chi tiết
                              </button>
                              <button
                                onClick={() => {
                                  setFastTrackQueue(prev => prev.map(q => q.id === item.id ? { ...q, status: "APPROVED" } : q));
                                  showToast(`Đã duyệt hồ sơ ${item.id} (${item.candidateName}) thành công!`);
                                }}
                                style={{ padding: "5px 12px", borderRadius: 6, background: "#16A34A", color: "#FFF", border: "none", fontSize: 11.5, fontWeight: 800, cursor: "pointer" }}
                              >
                                Duyệt ngay
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 2: TỔNG QUAN HỒ SƠ & DANH SÁCH THÍ SINH TOÀN DIỆN (DASHBOARD)
             ========================================================================= */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ padding: "2px 8px", background: "#EFF6FF", color: "#1D4ED8", fontSize: 11, fontWeight: 800, borderRadius: 4 }}>
                      HỆ THỐNG QUẢN TRỊ TUYỂN SINH FPTU
                    </span>
                    <span style={{ fontSize: 12, color: "#64748B" }}>Đồng bộ dữ liệu thời gian thực từ 5 Phân hiệu</span>
                  </div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                    Tổng Quan Hồ Sơ & Thẩm Định Thí Sinh Toàn Trường
                  </h1>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      showToast("🔄 Đã làm mới danh sách hồ sơ thí sinh từ DWH Data Lakehouse!");
                    }}
                    style={{
                      padding: "8px 14px", borderRadius: 8, background: "#FFFFFF",
                      border: "1px solid #CBD5E1", color: "#334155", fontSize: 12.5, fontWeight: 700,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                    }}
                  >
                    <RefreshCw size={14} /> Làm mới
                  </button>

                  <button
                    onClick={handleExportAdmissionReport}
                    style={{
                      padding: "8px 16px", borderRadius: 8, background: "#EA580C",
                      color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 800,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                      boxShadow: "0 2px 6px rgba(234,88,12,0.3)"
                    }}
                  >
                    <Download size={14} /> Xuất Báo Cáo Excel
                  </button>
                </div>
              </div>

              {/* 5 KPI Metric Ribbon */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
                <div style={{ padding: "16px 18px", background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", borderLeft: "4px solid #2563EB" }}>
                  <div style={{ fontSize: 11.5, color: "#1E40AF", fontWeight: 800 }}>CHỜ THẨM ĐỊNH</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#1D4ED8", margin: "4px 0 2px" }}>142</div>
                  <span style={{ fontSize: 11, color: "#64748B" }}>SUBMITTED & UNDER_REVIEW</span>
                </div>

                <div style={{ padding: "16px 18px", background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", borderLeft: "4px solid #16A34A" }}>
                  <div style={{ fontSize: 11.5, color: "#065F46", fontWeight: 800 }}>ĐÃ DUYỆT HỢP LỆ</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#047857", margin: "4px 0 2px" }}>328</div>
                  <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 700 }}>+18% so với hôm qua</span>
                </div>

                <div style={{ padding: "16px 18px", background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", borderLeft: "4px solid #DC2626" }}>
                  <div style={{ fontSize: 11.5, color: "#991B1B", fontWeight: 800 }}>CẦN BỔ SUNG GIẤY TỜ</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#DC2626", margin: "4px 0 2px" }}>45</div>
                  <span style={{ fontSize: 11, color: "#B91C1C" }}>Sai lệch OCR / Thiếu ảnh CCCD</span>
                </div>

                <div style={{ padding: "16px 18px", background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", borderLeft: "4px solid #D97706" }}>
                  <div style={{ fontSize: 11.5, color: "#92400E", fontWeight: 800 }}>HỌC BỔNG TALENT</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#D97706", margin: "4px 0 2px" }}>86</div>
                  <span style={{ fontSize: 11, color: "#64748B" }}>Đạt chuẩn xét cấp học bổng</span>
                </div>

                <div style={{ padding: "16px 18px", background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", borderLeft: "4px solid #7C3AED" }}>
                  <div style={{ fontSize: 11.5, color: "#5B21B6", fontWeight: 800 }}>TỶ LỆ CHUẨN XÁC OCR</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#6D28D9", margin: "4px 0 2px" }}>98.6%</div>
                  <span style={{ fontSize: 11, color: "#64748B" }}>Mô hình AI Human-in-loop</span>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  
                  {/* Search input */}
                  <div style={{ flex: "1 1 280px", position: "relative" }}>
                    <Search size={16} color="#94A3B8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      type="text"
                      placeholder="Tìm theo Mã hồ sơ, Họ tên, SĐT, Số CCCD..."
                      value={overviewSearch}
                      onChange={e => setOverviewSearch(e.target.value)}
                      style={{
                        width: "100%", padding: "9px 12px 9px 36px", borderRadius: 8,
                        border: "1px solid #CBD5E1", fontSize: 13, outline: "none", boxSizing: "border-box"
                      }}
                    />
                  </div>

                  {/* Campus filter */}
                  <select
                    value={overviewCampusFilter}
                    onChange={e => setOverviewCampusFilter(e.target.value)}
                    style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600, color: "#334155", background: "#FFF", cursor: "pointer" }}
                  >
                    <option value="all">Toàn bộ 5 Phân hiệu</option>
                    <option value="HN">Hà Nội (Hòa Lạc)</option>
                    <option value="HCM">TP. Hồ Chí Minh</option>
                    <option value="DN">Đà Nẵng</option>
                    <option value="CT">Cần Thơ</option>
                    <option value="QN">Quy Nhơn</option>
                  </select>

                  {/* Status filter */}
                  <select
                    value={overviewStatusFilter}
                    onChange={e => setOverviewStatusFilter(e.target.value)}
                    style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600, color: "#334155", background: "#FFF", cursor: "pointer" }}
                  >
                    <option value="all">Tất cả trạng thái hồ sơ</option>
                    <option value="SUBMITTED">Mới nộp (SUBMITTED)</option>
                    <option value="UNDER_REVIEW">Đang thẩm định (UNDER_REVIEW)</option>
                    <option value="VERIFIED_AND_COMPLETE">Đã duyệt hợp lệ (VERIFIED)</option>
                    <option value="NEEDS_UPDATE">Cần bổ sung (NEEDS_UPDATE)</option>
                    <option value="REJECTED">Từ chối (REJECTED)</option>
                  </select>

                  {/* Major filter */}
                  <select
                    value={overviewMajorFilter}
                    onChange={e => setOverviewMajorFilter(e.target.value)}
                    style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600, color: "#334155", background: "#FFF", cursor: "pointer" }}
                  >
                    <option value="all">Tất cả ngành đào tạo</option>
                    <option value="Phần mềm">Kỹ thuật Phần mềm</option>
                    <option value="AI">Trí tuệ Nhân tạo (AI)</option>
                    <option value="Bán dẫn">Thiết kế Vi mạch Bán dẫn</option>
                    <option value="Mỹ thuật">Thiết kế Mỹ thuật số</option>
                    <option value="An toàn">An toàn Thông tin</option>
                    <option value="Kinh doanh">Quản trị Kinh doanh</option>
                    <option value="Fintech">Công nghệ Tài chính</option>
                    <option value="Truyền thông">Truyền thông Đa phương tiện</option>
                  </select>
                </div>

                {/* Bulk Actions Bar if candidates selected */}
                {selectedCandidateIds.length > 0 && (
                  <div style={{ padding: "10px 14px", background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#9A3412" }}>
                      Đã chọn {selectedCandidateIds.length} thí sinh:
                    </span>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => {
                          setCandidateList(prev => prev.map(c => selectedCandidateIds.includes(c.id) ? { ...c, status: "VERIFIED_AND_COMPLETE" } : c));
                          showToast(`✓ Đã duyệt hợp lệ ${selectedCandidateIds.length} hồ sơ thành công!`);
                          setSelectedCandidateIds([]);
                        }}
                        style={{ padding: "6px 14px", borderRadius: 6, background: "#16A34A", color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                      >
                        Duyệt nhanh ({selectedCandidateIds.length})
                      </button>
                      <button
                        onClick={() => {
                          showToast(`✉️ Đã gửi thông báo SMS & Email nhắc nhở tới ${selectedCandidateIds.length} thí sinh!`, "info");
                          setSelectedCandidateIds([]);
                        }}
                        style={{ padding: "6px 14px", borderRadius: 6, background: "#2563EB", color: "#FFF", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
                      >
                        Gửi SMS/Email nhắc nhở
                      </button>
                      <button
                        onClick={() => setSelectedCandidateIds([])}
                        style={{ padding: "6px 10px", borderRadius: 6, background: "#FFF", border: "1px solid #CBD5E1", color: "#64748B", fontSize: 12, cursor: "pointer" }}
                      >
                        Hủy chọn
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Comprehensive Student Applications Table */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      Danh Sách Hồ Sơ Thí Sinh Nộp Trực Tuyến & Thẩm Định
                    </h3>
                    <p style={{ fontSize: 12, color: "#64748B", margin: "2px 0 0" }}>
                      Hiển thị {candidateList.filter(c => {
                        const matchSearch = overviewSearch === "" || c.name.toLowerCase().includes(overviewSearch.toLowerCase()) || c.id.toLowerCase().includes(overviewSearch.toLowerCase()) || c.phone.includes(overviewSearch) || c.citizenId.includes(overviewSearch);
                        const matchCampus = overviewCampusFilter === "all" || c.campusCode === overviewCampusFilter;
                        const matchStatus = overviewStatusFilter === "all" || c.status === overviewStatusFilter;
                        const matchMajor = overviewMajorFilter === "all" || c.major.includes(overviewMajorFilter);
                        return matchSearch && matchCampus && matchStatus && matchMajor;
                      }).length} / {candidateList.length} hồ sơ thí sinh
                    </p>
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", textTransform: "uppercase", fontSize: 11.5 }}>
                        <th style={{ padding: "10px 12px", width: 30 }}>
                          <input
                            type="checkbox"
                            checked={selectedCandidateIds.length === candidateList.length}
                            onChange={e => {
                              if (e.target.checked) setSelectedCandidateIds(candidateList.map(c => c.id));
                              else setSelectedCandidateIds([]);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </th>
                        <th style={{ padding: "10px 12px" }}>Mã Hồ Sơ</th>
                        <th style={{ padding: "10px 12px" }}>Thí Sinh & Liên Hệ</th>
                        <th style={{ padding: "10px 12px" }}>Ngành & Cơ Sở</th>
                        <th style={{ padding: "10px 12px" }}>Phương Thức / Điểm</th>
                        <th style={{ padding: "10px 12px" }}>OCR AI</th>
                        <th style={{ padding: "10px 12px" }}>Trạng Thái</th>
                        <th style={{ padding: "10px 12px", textAlign: "right" }}>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidateList
                        .filter(c => {
                          const matchSearch = overviewSearch === "" || c.name.toLowerCase().includes(overviewSearch.toLowerCase()) || c.id.toLowerCase().includes(overviewSearch.toLowerCase()) || c.phone.includes(overviewSearch) || c.citizenId.includes(overviewSearch);
                          const matchCampus = overviewCampusFilter === "all" || c.campusCode === overviewCampusFilter;
                          const matchStatus = overviewStatusFilter === "all" || c.status === overviewStatusFilter;
                          const matchMajor = overviewMajorFilter === "all" || c.major.includes(overviewMajorFilter);
                          return matchSearch && matchCampus && matchStatus && matchMajor;
                        })
                        .map((cand, idx) => {
                          const isSelected = selectedCandidateIds.includes(cand.id);
                          return (
                            <tr key={cand.id} style={{ borderBottom: "1px solid #F1F5F9", background: isSelected ? "#FFFBEB" : "transparent" }}>
                              <td style={{ padding: "12px" }}>
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={e => {
                                    if (e.target.checked) setSelectedCandidateIds([...selectedCandidateIds, cand.id]);
                                    else setSelectedCandidateIds(selectedCandidateIds.filter(id => id !== cand.id));
                                  }}
                                  style={{ cursor: "pointer" }}
                                />
                              </td>
                              <td style={{ padding: "12px" }}>
                                <div style={{ fontFamily: "monospace", color: "#2563EB", fontWeight: 700, fontSize: 13 }}>
                                  {cand.id}
                                </div>
                                <span style={{
                                  fontSize: 10, fontWeight: 800, padding: "1px 5px", borderRadius: 3,
                                  background: cand.priority === "High" ? "#FEE2E2" : "#F1F5F9",
                                  color: cand.priority === "High" ? "#DC2626" : "#64748B"
                                }}>
                                  {cand.priority}
                                </span>
                              </td>
                              <td style={{ padding: "12px" }}>
                                <strong style={{ color: "#0F172A", fontSize: 13.5, display: "block" }}>{cand.name}</strong>
                                <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
                                  📞 {cand.phone} • CCCD: {cand.citizenId}
                                </div>
                              </td>
                              <td style={{ padding: "12px" }}>
                                <div style={{ fontWeight: 600, color: "#1E293B" }}>{cand.major}</div>
                                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>📍 {cand.campus}</div>
                              </td>
                              <td style={{ padding: "12px" }}>
                                <div style={{ color: "#334155", fontWeight: 500 }}>{cand.method}</div>
                                <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 700, marginTop: 2 }}>
                                  {cand.admissionResult}
                                </div>
                              </td>
                              <td style={{ padding: "12px" }}>
                                <span style={{
                                  fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 6,
                                  background: cand.confidence >= 95 ? "#DCFCE7" : cand.confidence >= 85 ? "#FEF3C7" : "#FEE2E2",
                                  color: cand.confidence >= 95 ? "#15803D" : cand.confidence >= 85 ? "#D97706" : "#DC2626"
                                }}>
                                  {cand.confidence}%
                                </span>
                              </td>
                              <td style={{ padding: "12px" }}>
                                <span style={{
                                  fontSize: 11, fontWeight: 800, padding: "4px 9px", borderRadius: 100,
                                  background: cand.status === "VERIFIED_AND_COMPLETE" ? "#DCFCE7" : cand.status === "NEEDS_UPDATE" ? "#FEE2E2" : cand.status === "REJECTED" ? "#FEE2E2" : "#EFF6FF",
                                  color: cand.status === "VERIFIED_AND_COMPLETE" ? "#15803D" : cand.status === "NEEDS_UPDATE" ? "#B91C1C" : cand.status === "REJECTED" ? "#991B1B" : "#1D4ED8"
                                }}>
                                  {cand.status === "VERIFIED_AND_COMPLETE" ? "✓ Đã Duyệt Hợp Lệ" : cand.status === "NEEDS_UPDATE" ? "⚠️ Cần Bổ Sung" : cand.status === "REJECTED" ? "✕ Từ Chối" : "⏳ Đang Thẩm Định"}
                                </span>
                              </td>
                              <td style={{ padding: "12px", textAlign: "right" }}>
                                <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                                  <button
                                    onClick={() => {
                                      const idx = candidateList.findIndex(c => c.id === cand.id);
                                      if (idx !== -1) setSelectedCandidateIndex(idx);
                                      setActiveTab("verification");
                                    }}
                                    style={{
                                      padding: "6px 12px", borderRadius: 6, background: "#EA580C",
                                      color: "#FFFFFF", border: "none", fontSize: 11.5, fontWeight: 800,
                                      cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4
                                    }}
                                  >
                                    <Eye size={13} /> Thẩm định 3 cột
                                  </button>

                                  {cand.status !== "VERIFIED_AND_COMPLETE" && (
                                    <button
                                      onClick={() => {
                                        setCandidateList(prev => prev.map(c => c.id === cand.id ? { ...c, status: "VERIFIED_AND_COMPLETE" } : c));
                                        showToast(`✓ Đã duyệt hợp lệ hồ sơ của thí sinh ${cand.name}!`);
                                      }}
                                      style={{
                                        padding: "6px 10px", borderRadius: 6, background: "#16A34A",
                                        color: "#FFFFFF", border: "none", fontSize: 11.5, fontWeight: 800, cursor: "pointer"
                                      }}
                                      title="Duyệt nhanh"
                                    >
                                      <Check size={13} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 4: XẾP LỊCH THI TUYỂN & PHÒNG VẤN HỌC BỔNG
             ========================================================================= */}
          {activeTab === "exam_scheduling" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px" }}>
                    Xếp Lịch Thi Tuyển &amp; Phỏng Vấn Học Bổng FPT Talent
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                    Phân bổ phòng thi tự động, cấp SBD và phát hành Giấy Báo Dự Thi điện tử cho thí sinh.
                  </p>
                </div>

                <button
                  onClick={() => setIsExamDispatchModalOpen(true)}
                  style={{
                    padding: "9px 18px", borderRadius: 8, background: "#EA580C",
                    color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 800,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(234,88,12,0.25)"
                  }}
                >
                  <Send size={15} /> Phát Hành Giấy Báo Thi Hàng Loạt
                </button>
              </div>

              {/* Schedule Info Box */}
              <div style={{ background: "#EFF6FF", borderRadius: 12, border: "1px solid #DBEAFE", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#1D4ED8", fontWeight: 800 }}>ĐỢT THI GẦN NHẤT ĐANG SẮP XẾP</div>
                  <strong style={{ fontSize: 16, color: "#1E3A8A", display: "block", marginTop: 2 }}>
                    Chủ Nhật, 10/11/2026 tại 5 Campus FPTU (Tổng: 1,850 Thí sinh)
                  </strong>
                  <span style={{ fontSize: 12, color: "#64748B" }}>Đã chia 48 phòng thi &amp; 12 Hội đồng giám khảo phỏng vấn</span>
                </div>

                <button
                  onClick={() => setIsExamDispatchModalOpen(true)}
                  style={{ padding: "8px 14px", borderRadius: 6, border: "1px solid #2563EB", background: "#FFF", color: "#2563EB", fontWeight: 700, fontSize: 12, cursor: "pointer" }}
                >
                  Xem &amp; Phát Hành Giấy Báo
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 5: KẾT QUẢ TRÚNG TUYỂN & GIẤY BÁO NHẬP HỌC
             ========================================================================= */}
          {activeTab === "results" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#059669", fontWeight: 800, fontSize: 12.5, marginBottom: 4 }}>
                    <ShieldCheck size={16} /> FPTU ADMISSION RESULTS &amp; ENROLLMENT REGISTRATION
                  </div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px" }}>
                    Quản Lý Kết Quả Trúng Tuyển &amp; Gửi Phiếu Đăng Ký Nhập Học
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                    Phê duyệt danh sách trúng tuyển chính thức, phát hành Giấy Báo Nhập Học và gửi Mẫu Phiếu Đăng Ký (Hệ chính quy) cho thí sinh.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => {
                      setCandidateList(prev => prev.map(c => ({ ...c, formSent: true, status: "VERIFIED_AND_COMPLETE" })));
                      showToast("🎉 Đã gửi thông báo kết quả & Mẫu Phiếu Đăng Ký Đại Học FPT tới toàn bộ thí sinh đủ điều kiện!", "success");
                    }}
                    style={{
                      padding: "9px 16px", borderRadius: 8, background: "#0F172A",
                      color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 800,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 6
                    }}
                  >
                    <Send size={15} /> Gửi Phiếu ĐK Hàng Loạt
                  </button>

                  <button
                    onClick={() => setIsAdmissionLetterModalOpen(true)}
                    style={{
                      padding: "9px 18px", borderRadius: 8, background: "#059669",
                      color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 800,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(5,150,105,0.25)"
                    }}
                  >
                    <FileCheck size={15} /> Ký Số &amp; Ban Hành Giấy Báo
                  </button>
                </div>
              </div>

              {/* 3 Summary Statistic Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: "#1E40AF" }}>THÍ SINH ĐẠT ĐIỂM SÀN</span>
                    <Award size={18} color="#2563EB" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", marginTop: 4 }}>4,050</div>
                  <span style={{ fontSize: 11.5, color: "#16A34A", fontWeight: 700 }}>✓ Đạt chuẩn Top40 SchoolRank / Xét tuyển thẳng</span>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: "#065F46" }}>PHIẾU ĐĂNG KÝ ĐÃ GỬI</span>
                    <FileCheck size={18} color="#059669" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#047857", marginTop: 4 }}>3,420</div>
                  <span style={{ fontSize: 11.5, color: "#64748B" }}>Tỷ lệ gửi thành công: 84.4%</span>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: "#9A3412" }}>ĐÃ XÁC NHẬN NHẬP HỌC</span>
                    <CheckCircle2 size={18} color="#EA580C" />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#EA580C", marginTop: 4 }}>2,890</div>
                  <span style={{ fontSize: 11.5, color: "#16A34A", fontWeight: 700 }}>+12% so với cùng kỳ năm 2025</span>
                </div>
              </div>

              {/* Table of Candidate Admission Results & Registration Form Dispatch */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                      Danh Sách Thí Sinh &amp; Quản Lý Kết Quả Trúng Tuyển
                    </h3>
                    <p style={{ fontSize: 12, color: "#64748B", margin: "2px 0 0" }}>
                      Xem trước mẫu biểu, gửi Phiếu Đăng Ký Đại Học FPT và thông báo nhập học tới từng thí sinh
                    </p>
                  </div>
                  <span style={{ fontSize: 11.5, color: "#059669", fontWeight: 800, background: "#ECFDF5", padding: "4px 10px", borderRadius: 6, border: "1px solid #A7F3D0" }}>
                    Biểu mẫu chính thức: 06.03-BM/ĐH/HDCV/FE v1/5
                  </span>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>MÃ THÍ SINH</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>HỌ VÀ TÊN</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>NGÀNH TRÚNG TUYỂN</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>KẾT QUẢ / ĐIỂM SỐ</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700 }}>PHIẾU ĐĂNG KÝ</th>
                      <th style={{ padding: "10px 12px", fontWeight: 700, textAlign: "right" }}>THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidateList.map((row) => (
                      <tr key={row.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "12px", fontFamily: "monospace", color: "#2563EB", fontWeight: 700 }}>{row.id}</td>
                        <td style={{ padding: "12px", fontWeight: 800, color: "#0F172A" }}>
                          {row.name}
                          <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>{row.campus}</div>
                        </td>
                        <td style={{ padding: "12px", color: "#334155", fontWeight: 600 }}>{row.major}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 800,
                            background: "#DCFCE7", color: "#16A34A"
                          }}>
                            {row.admissionResult || "Trúng tuyển chính thức"}
                          </span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          {row.formSent ? (
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", background: "#ECFDF5", padding: "2px 8px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                              ✓ Đã Gửi Phiếu
                            </span>
                          ) : (
                            <span style={{ fontSize: 11, fontWeight: 800, color: "#D97706", background: "#FEF3C7", padding: "2px 8px", borderRadius: 4 }}>
                              Chưa gửi
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                            <button
                              onClick={() => handleOpenEnrollmentDispatch(row)}
                              style={{
                                padding: "6px 12px", borderRadius: 6, background: row.formSent ? "#F1F5F9" : "#059669",
                                color: row.formSent ? "#334155" : "#FFFFFF", border: "1px solid #CBD5E1", fontSize: 11.5, fontWeight: 800,
                                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4
                              }}
                            >
                              <FileCheck size={13} /> {row.formSent ? "Xem & Gửi Lại Phiếu" : "Gửi Kết Quả & Phiếu ĐK"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODULE 6: BÁO CÁO HIỆU SUẤT TUYỂN SINH & TIẾN ĐỘ THẨM ĐỊNH (PERFORMANCE KPI)
             ========================================================================= */}
          {activeTab === "kpis" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px" }}>
                    Báo Cáo Hiệu Suất Tuyển Sinh &amp; Phân Tích Thẩm Định
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                    Năm học 2026-2027 • Đánh giá hiệu suất chuyển đổi toàn kênh tuyển sinh &amp; KPI cán bộ thẩm định Đại học FPT
                  </p>
                </div>

                <button
                  onClick={handleExportAdmissionReport}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 8, background: "#EA580C", color: "#FFFFFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 6px rgba(234,88,12,0.3)" }}
                >
                  <Download size={14} /> Xuất Báo Cáo Tuyển Sinh (Excel)
                </button>
              </div>

              {/* 4 KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#475569" }}>HỒ SƠ ĐÃ TIẾP NHẬN</span>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "1px 6px", borderRadius: 4 }}>+12%</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>14,285</div>
                  <span style={{ fontSize: 11, color: "#64748B" }}>Đạt 95.2% chỉ tiêu toàn khối</span>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#475569" }}>THAM GIA THI / ĐGNL</span>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "1px 6px", borderRadius: 4 }}>+5%</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>8,940</div>
                  <span style={{ fontSize: 11, color: "#64748B" }}>Tỷ lệ tham gia: 62.5%</span>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#475569" }}>PHỎNG VẤN HỌC BỔNG</span>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#2563EB", background: "#EFF6FF", padding: "1px 6px", borderRadius: 4 }}>86 Hội đồng</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A" }}>6,120</div>
                  <span style={{ fontSize: 11, color: "#64748B" }}>Thí sinh đạt chuẩn vòng hồ sơ</span>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#475569" }}>NHẬP HỌC CHÍNH THỨC</span>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "1px 6px", borderRadius: 4 }}>+8%</span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: "#16A34A" }}>4,050</div>
                  <span style={{ fontSize: 11, color: "#16A34A", fontWeight: 700 }}>Yield Rate: 75.5%</span>
                </div>
              </div>

              {/* Chart: Applications by Campus & Major */}
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1.4fr", gap: 20 }}>
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 14px" }}>
                    Phân Bổ Hồ Sơ Tuyển Sinh Theo 5 Phân Hiệu
                  </h3>
                  <div style={{ height: 240 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { campus: "Hà Nội", applications: 5400, target: 5500 },
                          { campus: "TP.HCM", applications: 4950, target: 5000 },
                          { campus: "Đà Nẵng", applications: 1980, target: 2000 },
                          { campus: "Cần Thơ", applications: 1320, target: 1500 },
                          { campus: "Quy Nhơn", applications: 920, target: 1000 },
                        ]}
                        margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="campus" stroke="#64748B" fontSize={12} />
                        <YAxis stroke="#64748B" fontSize={12} />
                        <Tooltip contentStyle={{ background: "#0F172A", borderRadius: 8, color: "#FFF", fontSize: 12 }} />
                        <Bar dataKey="target" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Chỉ tiêu" />
                        <Bar dataKey="applications" fill="#EA580C" radius={[4, 4, 0, 0]} name="Hồ sơ đã nhận" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Admission Officer Performance Leaderboard Table */}
                <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 14px" }}>
                    Hiệu Suất &amp; SLA Cán Bộ Thẩm Định Tuyển Sinh
                  </h3>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B" }}>
                        <th style={{ padding: "8px 10px" }}>Cán Bộ Thẩm Định</th>
                        <th style={{ padding: "8px 10px" }}>Đã Duyệt</th>
                        <th style={{ padding: "8px 10px" }}>Thời Gian TB</th>
                        <th style={{ padding: "8px 10px" }}>Độ Chuẩn Xác</th>
                        <th style={{ padding: "8px 10px" }}>SLA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: "Trần Hoàng Nam (Bạn)", done: 328, time: "4.2 phút/HS", acc: "99.2%", sla: "100%", status: "Xuất sắc" },
                        { name: "Lê Thanh Hà", done: 285, time: "5.1 phút/HS", acc: "98.5%", sla: "98.2%", status: "Tốt" },
                        { name: "Nguyễn Minh Tuấn", done: 240, time: "6.0 phút/HS", acc: "97.8%", sla: "96.5%", status: "Tốt" },
                        { name: "Phạm Thúy Vy", done: 210, time: "6.8 phút/HS", acc: "96.2%", sla: "94.0%", status: "Đạt" },
                      ].map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                          <td style={{ padding: "10px", fontWeight: 700, color: "#0F172A" }}>{row.name}</td>
                          <td style={{ padding: "10px", color: "#16A34A", fontWeight: 800 }}>{row.done}</td>
                          <td style={{ padding: "10px", color: "#475569" }}>{row.time}</td>
                          <td style={{ padding: "10px", color: "#2563EB", fontWeight: 700 }}>{row.acc}</td>
                          <td style={{ padding: "10px" }}>
                            <span style={{ fontSize: 11, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "#DCFCE7", color: "#15803D" }}>
                              {row.sla}
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
              MODULE 8: KHO LƯU TRỮ TUYỂN SINH (DATA LAKEHOUSE & HISTORICAL ARCHIVE)
             ========================================================================= */}
          {activeTab === "archive" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
                <div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", margin: "0 0 4px" }}>
                    Kho Lưu Trữ Tuyển Sinh (Data Lakehouse &amp; Historical Archive)
                  </h1>
                  <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
                    Tra cứu dữ liệu tuyển sinh từ khóa K15 đến K20 phục vụ phân tích học tập và dự báo sinh viên có nguy cơ thôi học.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {["all", "K20", "K19", "K18", "K17", "K16"].map(cohort => (
                    <button
                      key={cohort}
                      onClick={() => setArchiveCohortFilter(cohort)}
                      style={{
                        padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: 700,
                        border: archiveCohortFilter === cohort ? "1px solid #EA580C" : "1px solid #E2E8F0",
                        background: archiveCohortFilter === cohort ? "#FFF7ED" : "#FFFFFF",
                        color: archiveCohortFilter === cohort ? "#EA580C" : "#64748B", cursor: "pointer"
                      }}
                    >
                      {cohort === "all" ? "Tất cả các khóa" : `Khóa ${cohort}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3 Cohort Metric Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                  { cohort: "Khóa K20 (2024 - 2025)", total: "12,450 sinh viên", retention: "96.2% duy trì", risk: "3.8% Nguy cơ thôi học", bg: "#EFF6FF", border: "#DBEAFE" },
                  { cohort: "Khóa K19 (2023 - 2024)", total: "10,800 sinh viên", retention: "95.5% duy trì", risk: "4.5% Nguy cơ thôi học", bg: "#F0FDF4", border: "#DCFCE7" },
                  { cohort: "Khóa K18 (2022 - 2023)", total: "9,200 sinh viên", retention: "94.8% duy trì", risk: "5.2% Nguy cơ thôi học", bg: "#FFF7ED", border: "#FFEDD5" },
                ].map((c, idx) => (
                  <div key={idx} style={{ background: c.bg, borderRadius: 12, border: `1px solid ${c.border}`, padding: "18px 20px" }}>
                    <strong style={{ fontSize: 15, color: "#0F172A", display: "block", marginBottom: 6 }}>{c.cohort}</strong>
                    <div style={{ fontSize: 12.5, color: "#475569" }}>Tổng hồ sơ nhập học: <strong>{c.total}</strong></div>
                    <div style={{ fontSize: 12.5, color: "#16A34A", fontWeight: 700, marginTop: 4 }}>✓ {c.retention}</div>
                    <div style={{ fontSize: 11.5, color: "#DC2626", marginTop: 2 }}>⚠️ {c.risk}</div>
                  </div>
                ))}
              </div>

              {/* Historical Student Records Table */}
              <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                      Dữ Liệu Hồ Sơ Sinh Viên Lịch Sử (Data Lakehouse)
                    </h3>
                    <p style={{ fontSize: 12, color: "#64748B", margin: "2px 0 0" }}>
                      Tích hợp điểm thi tuyển sinh đầu vào và theo dõi kết quả học tập GPA lũy tiến
                    </p>
                  </div>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 12.5 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#64748B", textTransform: "uppercase", fontSize: 11.5 }}>
                        <th style={{ padding: "10px 12px" }}>Mã Sinh Viên</th>
                        <th style={{ padding: "10px 12px" }}>Họ Và Tên</th>
                        <th style={{ padding: "10px 12px" }}>Khóa / Phân Hiệu</th>
                        <th style={{ padding: "10px 12px" }}>Ngành Đào Tạo</th>
                        <th style={{ padding: "10px 12px" }}>Điểm Đầu Vào</th>
                        <th style={{ padding: "10px 12px" }}>GPA Hiện Tại</th>
                        <th style={{ padding: "10px 12px" }}>Tình Trạng Học Vụ</th>
                        <th style={{ padding: "10px 12px" }}>Dự Báo Nguy Cơ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "HE182041", name: "Nguyễn Tuấn Kiệt", cohort: "K18", campus: "Hà Nội", major: "Kỹ thuật Phần mềm", score: "27.5đ (HB 70%)", gpa: "3.68 / 4.0", status: "Đang học (HK7)", risk: "Thấp (1.2%)", riskColor: "#16A34A" },
                        { id: "SE173920", name: "Phan Hoài Nam", cohort: "K17", campus: "TP.HCM", major: "Trí tuệ Nhân tạo", score: "26.0đ (Học bạ)", gpa: "3.45 / 4.0", status: "Đang học (HK9)", risk: "Thấp (2.5%)", riskColor: "#16A34A" },
                        { id: "AI190241", name: "Trịnh Diệu Linh", cohort: "K19", campus: "Quy Nhơn", major: "Khoa học Dữ liệu", score: "28.0đ (HB 100%)", gpa: "3.82 / 4.0", status: "Đang học (HK5)", risk: "Rất thấp (0.5%)", riskColor: "#16A34A" },
                        { id: "BA184512", name: "Lê Minh Trí", cohort: "K18", campus: "Cần Thơ", major: "Quản trị Kinh doanh", score: "21.5đ (THPT)", gpa: "2.10 / 4.0", status: "Cảnh báo học vụ 1", risk: "Cao (48.0%)", riskColor: "#DC2626" },
                        { id: "MC172911", name: "Vũ Phương Uyên", cohort: "K17", campus: "Đà Nẵng", major: "Truyền thông Đa phương tiện", score: "24.5đ (Học bạ)", gpa: "3.55 / 4.0", status: "Đã tốt nghiệp (Giỏi)", risk: "Hoàn thành", riskColor: "#2563EB" },
                      ]
                        .filter(item => archiveCohortFilter === "all" || item.cohort === archiveCohortFilter)
                        .map((st, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                            <td style={{ padding: "12px", fontFamily: "monospace", color: "#2563EB", fontWeight: 700 }}>{st.id}</td>
                            <td style={{ padding: "12px", fontWeight: 700, color: "#0F172A" }}>{st.name}</td>
                            <td style={{ padding: "12px", color: "#475569" }}>{st.cohort} • {st.campus}</td>
                            <td style={{ padding: "12px", color: "#1E293B", fontWeight: 600 }}>{st.major}</td>
                            <td style={{ padding: "12px", color: "#EA580C", fontWeight: 700 }}>{st.score}</td>
                            <td style={{ padding: "12px", fontWeight: 800, color: "#0F172A" }}>{st.gpa}</td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: st.status.includes("Cảnh báo") ? "#FEE2E2" : st.status.includes("tốt nghiệp") ? "#EFF6FF" : "#DCFCE7", color: st.status.includes("Cảnh báo") ? "#DC2626" : st.status.includes("tốt nghiệp") ? "#1D4ED8" : "#15803D" }}>
                                {st.status}
                              </span>
                            </td>
                            <td style={{ padding: "12px" }}>
                              <span style={{ fontSize: 11, fontWeight: 800, color: st.riskColor }}>
                                {st.risk}
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

        </div>
      </main>

      {/* =========================================================================
          MODAL 1: XỬ LÝ THÍ SINH THEO CHỈ THỊ BAN GIÁM HIỆU (EXECUTIVE ACTION MODAL)
         ========================================================================= */}
      {activeActionCandidate && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 640, background: "#FFFFFF",
            borderRadius: 16, border: "1px solid #E2E8F0",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden", animation: "fadeIn 0.2s ease-out"
          }}>
            {/* Modal Header */}
            <div style={{ padding: "18px 24px", background: "#0F172A", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>
                  <Bot size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>
                    Thực Thi Quy Trình Xử Lý Thí Sinh (Chỉ Thị BGH)
                  </h3>
                  <span style={{ fontSize: 11.5, color: "#94A3B8" }}>
                    Chỉ thị: <strong style={{ color: "#FDBA74" }}>{activeActionCandidate.directiveId} - {activeActionCandidate.directiveTitle}</strong>
                  </span>
                </div>
              </div>
              <button onClick={() => setActiveActionCandidate(null)} style={{ border: "none", background: "transparent", color: "#94A3B8", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Candidate Summary Box */}
            <div style={{ padding: "16px 24px", background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 10, fontSize: 12 }}>
                <div>
                  <span style={{ color: "#64748B", fontSize: 11 }}>Họ và tên thí sinh</span>
                  <div style={{ fontWeight: 800, color: "#0F172A", fontSize: 14 }}>{activeActionCandidate.name}</div>
                  <div style={{ color: "#2563EB", fontFamily: "monospace", fontSize: 11 }}>{activeActionCandidate.id}</div>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 11 }}>Khu vực &amp; Điểm số</span>
                  <div style={{ fontWeight: 700, color: "#0F172A" }}>{activeActionCandidate.score}</div>
                  <div style={{ color: "#475569", fontSize: 11 }}>{activeActionCandidate.region}</div>
                </div>
                <div>
                  <span style={{ color: "#64748B", fontSize: 11 }}>Liên hệ</span>
                  <div style={{ color: "#0F172A", fontWeight: 600 }}>📱 {activeActionCandidate.phone}</div>
                  <div style={{ color: "#64748B", fontSize: 11 }}>Phụ huynh: {activeActionCandidate.parentPhone}</div>
                </div>
              </div>
            </div>

            {/* Dynamic Form based on Directive Type */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>

              {/* DIR-01: Cấp Học bổng ĐBSCL */}
              {activeActionCandidate.directiveId === "DIR-01" && (
                <>
                  <div style={{ background: "#ECFDF5", borderRadius: 10, border: "1px solid #A7F3D0", padding: "12px 16px" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: "#065F46", display: "flex", alignItems: "center", gap: 6 }}>
                      <Award size={16} /> Chính Sách Cấp Học Bổng Ưu Tiên ĐBSCL (+5% Quota)
                    </div>
                    <p style={{ fontSize: 11.5, color: "#047857", margin: "4px 0 0" }}>
                      Thí sinh đạt điều kiện điểm THPT {activeActionCandidate.score} &gt; 8.0 và thuộc khu vực ĐBSCL.
                    </p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 5 }}>Mức học bổng đề xuất cấp</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                      {["30%", "50%", "70%", "100%"].map(lvl => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setActionFormData({ ...actionFormData, scholarshipLevel: lvl })}
                          style={{
                            padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 800,
                            border: actionFormData.scholarshipLevel === lvl ? "2px solid #16A34A" : "1px solid #CBD5E1",
                            background: actionFormData.scholarshipLevel === lvl ? "#DCFCE7" : "#FFFFFF",
                            color: actionFormData.scholarshipLevel === lvl ? "#166534" : "#475569",
                            cursor: "pointer"
                          }}
                        >
                          Học bổng {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 5 }}>Mã quyết định cấp học bổng (Tự động sinh)</label>
                    <input
                      type="text"
                      value={actionFormData.decisionCode}
                      onChange={(e) => setActionFormData({ ...actionFormData, decisionCode: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 700, fontFamily: "monospace" }}
                    />
                  </div>
                </>
              )}

              {/* DIR-02: Cảnh báo Hồ sơ Ảo */}
              {activeActionCandidate.directiveId === "DIR-02" && (
                <>
                  <div style={{ background: "#FEF2F2", borderRadius: 10, border: "1px solid #FECACA", padding: "12px 16px" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: "#991B1B", display: "flex", alignItems: "center", gap: 6 }}>
                      <AlertOctagon size={16} /> Cảnh Báo Đối Soát Hồ Sơ Ảo Khu Vực Miền Tây
                    </div>
                    <p style={{ fontSize: 11.5, color: "#B91C1C", margin: "4px 0 0" }}>
                      Phát hiện SĐT phụ huynh trùng với SĐT thí sinh hoặc sai lệch CCCD so với trường THPT khai báo.
                    </p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 5 }}>Hạn chót bổ sung bản sao công chứng</label>
                    <input
                      type="text"
                      value={actionFormData.verificationDeadline}
                      onChange={(e) => setActionFormData({ ...actionFormData, verificationDeadline: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }}
                    />
                  </div>
                </>
              )}

              {/* DIR-03: Telesales Chăm sóc */}
              {activeActionCandidate.directiveId === "DIR-03" && (
                <>
                  <div style={{ background: "#EFF6FF", borderRadius: 10, border: "1px solid #BFDBFE", padding: "12px 16px" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: "#1E40AF", display: "flex", alignItems: "center", gap: 6 }}>
                      <Phone size={16} /> Chiến Dịch Telesales Nhóm Điểm Khá (21đ - 24đ)
                    </div>
                    <p style={{ fontSize: 11.5, color: "#1D4ED8", margin: "4px 0 0" }}>
                      Tư vấn lộ trình học bổng doanh nghiệp và tặng voucher lệ phí nhập học 2,000,000đ.
                    </p>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 5 }}>Trạng thái liên hệ tư vấn</label>
                    <select
                      value={actionFormData.callStatus}
                      onChange={(e) => setActionFormData({ ...actionFormData, callStatus: e.target.value })}
                      style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
                    >
                      <option value="Đã liên hệ - Rất quan tâm">Đã liên hệ - Rất quan tâm (Chốt đăng ký)</option>
                      <option value="Hẹn gọi lại sau 24h">Hẹn gọi lại sau 24h (Đang thảo luận với phụ huynh)</option>
                      <option value="Đã chốt nộp hồ sơ NV1">Đã chốt nộp hồ sơ NV1 vào Đại học FPT</option>
                      <option value="Không nghe máy">Không nghe máy / Máy bận</option>
                    </select>
                  </div>
                </>
              )}

              {/* Common Note */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 5 }}>Ghi chú xử lý &amp; Lưu vết Audit Log</label>
                <textarea
                  rows={2}
                  placeholder="Nhập nội dung trao đổi hoặc lý do quyết định..."
                  value={actionFormData.notes}
                  onChange={(e) => setActionFormData({ ...actionFormData, notes: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12, resize: "none" }}
                />
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setActiveActionCandidate(null)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmCandidateAction}
                style={{ padding: "8px 20px", borderRadius: 6, background: "#EA580C", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 6px rgba(234,88,12,0.3)" }}
              >
                ✓ Xác Nhận Thực Thi &amp; Bắn Thông Báo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: BỘ LỌC & QUÉT THÍ SINH THEO CHỈ THỊ (DIRECTIVE SCANNER MODAL)
         ========================================================================= */}
      {activeFilterDirective && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 680, background: "#FFFFFF",
            borderRadius: 16, border: "1px solid #E2E8F0",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden"
          }}>
            {/* Header */}
            <div style={{ padding: "18px 24px", background: "#9A3412", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Filter size={20} />
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>
                    Bộ Lọc &amp; Quét Dữ Liệu Tự Động Theo Chỉ Thị BGH
                  </h3>
                  <span style={{ fontSize: 11.5, color: "#FED7AA" }}>{activeFilterDirective.id}: {activeFilterDirective.title}</span>
                </div>
              </div>
              <button onClick={() => setActiveFilterDirective(null)} style={{ border: "none", background: "transparent", color: "#FED7AA", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Scan Rule Card */}
              <div style={{ background: "#FFF7ED", borderRadius: 10, border: "1px solid #FED7AA", padding: "14px 16px" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#9A3412", marginBottom: 4 }}>ĐIỀU KIỆN QUÉT DỮ LIỆU TOÀN HỆ THỐNG:</div>
                <div style={{ fontSize: 12.5, color: "#431407" }}>{activeFilterDirective.condition}</div>
                <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 700, marginTop: 6 }}>
                  👉 Chính sách áp dụng: {activeFilterDirective.policyBonus}
                </div>
              </div>

              {/* Scanning Progress */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
                  <span>{isScanning ? "Đang rà soát 14,285 hồ sơ toàn quốc..." : `Đã hoàn tất quét! Tìm thấy ${activeFilterDirective.affectedCount} hồ sơ phù hợp.`}</span>
                  <span style={{ color: "#EA580C" }}>{scanProgress}%</span>
                </div>
                <div style={{ width: "100%", height: 8, borderRadius: 4, background: "#F1F5F9", overflow: "hidden" }}>
                  <div style={{ width: `${scanProgress}%`, height: "100%", background: "#EA580C", transition: "width 0.2s ease" }} />
                </div>
              </div>

              {/* Sample Matched Candidates */}
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>
                  DANH SÁCH MẪU HỒ SƠ KHỚP ĐIỀU KIỆN (TOP 3 HỒ SƠ ĐIỂM CAO NHẤT):
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { id: "TS-2026-0012", name: "Lê Quốc Bảo", score: "25.5đ", campus: "Cần Thơ", status: "Đủ điều kiện nhận học bổng 30%" },
                    { id: "TS-2026-0089", name: "Phan Thanh Trúc", score: "26.0đ", campus: "Cần Thơ", status: "Đủ điều kiện nhận học bổng 50%" },
                    { id: "TS-2026-0142", name: "Nguyễn Văn Đạt", score: "25.0đ", campus: "Cần Thơ", status: "Đủ điều kiện nhận học bổng 30%" }
                  ].map((c, i) => (
                    <div key={i} style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 14px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                      <div>
                        <strong style={{ color: "#0F172A" }}>{c.name}</strong> <span style={{ color: "#64748B" }}>({c.id})</span>
                        <div style={{ fontSize: 11, color: "#16A34A", fontWeight: 600 }}>{c.status}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 800, color: "#EA580C" }}>{c.score}</div>
                        <div style={{ fontSize: 11, color: "#64748B" }}>{c.campus}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setActiveFilterDirective(null)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setActiveFilterDirective(null);
                  showToast(`✅ Đã áp dụng chính sách của ${activeFilterDirective.id} cho toàn bộ ${activeFilterDirective.affectedCount} hồ sơ!`);
                }}
                style={{ padding: "8px 20px", borderRadius: 6, background: "#9A3412", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Áp Dụng Hàng Loạt ({activeFilterDirective.affectedCount} Hồ Sơ)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ĐỒNG BỘ CHỈ THỊ BGH (BOD DIRECTIVES SYNC MODAL)
         ========================================================================= */}
      {isSyncDirectivesModalOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 580, background: "#FFFFFF",
            borderRadius: 16, border: "1px solid #E2E8F0",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden"
          }}>
            <div style={{ padding: "18px 24px", background: "#0F172A", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Bot size={20} color="#FDBA74" />
                <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>
                  Đồng Bộ Chỉ Thị &amp; Quyết Định Ban Giám Hiệu (BOD DSS)
                </h3>
              </div>
              <button onClick={() => setIsSyncDirectivesModalOpen(false)} style={{ border: "none", background: "transparent", color: "#94A3B8", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#ECFDF5", borderRadius: 10, border: "1px solid #A7F3D0", padding: "12px 16px" }}>
                <div style={{ fontSize: 12.5, fontWeight: 800, color: "#065F46" }}>✓ KẾT NỐI MÁY CHỦ BGH HOẠT ĐỘNG TỐT</div>
                <div style={{ fontSize: 11.5, color: "#047857", marginTop: 2 }}>
                  Gói quyết định: <code>BOD_DECISION_PACK_2026.08.19_v3.4</code> • Có 3 chỉ thị mới nhất đã được kích hoạt.
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {activeDirectives.map((d) => (
                  <div key={d.id} style={{ padding: "10px 14px", borderRadius: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ fontSize: 13, color: "#0F172A" }}>{d.id}: {d.title}</strong>
                      <div style={{ fontSize: 11, color: "#64748B" }}>{d.targetGroup}</div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#16A34A", background: "#DCFCE7", padding: "2px 8px", borderRadius: 4 }}>
                      Đang áp dụng
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setIsSyncDirectivesModalOpen(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setIsSyncDirectivesModalOpen(false);
                  showToast("✅ Đã cập nhật và đồng bộ toàn bộ chỉ thị BGH vào hệ thống tuyển sinh!");
                }}
                style={{ padding: "8px 20px", borderRadius: 6, background: "#0F172A", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Lưu &amp; Cập Nhật Toàn Bộ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: PHÁT HÀNH GIẤY BÁO THI HÀNG LOẠT (EXAM DISPATCH MODAL)
         ========================================================================= */}
      {isExamDispatchModalOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 640, background: "#FFFFFF",
            borderRadius: 16, border: "1px solid #E2E8F0",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden"
          }}>
            <div style={{ padding: "18px 24px", background: "#EA580C", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Send size={20} />
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>
                    Phát Hành Giấy Báo Dự Thi &amp; Phỏng Vấn Điện Tử
                  </h3>
                  <span style={{ fontSize: 11.5, color: "#FFEDD5" }}>Đợt thi ĐGNL &amp; Học Bổng FPT Talent 2026</span>
                </div>
              </div>
              <button onClick={() => setIsExamDispatchModalOpen(false)} style={{ border: "none", background: "transparent", color: "#FFEDD5", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Batch info card */}
              <div style={{ background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", padding: "14px 16px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, textAlign: "center" }}>
                <div>
                  <span style={{ fontSize: 11, color: "#64748B" }}>TỔNG THÍ SINH</span>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#0F172A" }}>1,850</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748B" }}>PHÒNG THI</span>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#2563EB" }}>48 Phòng</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "#64748B" }}>CƠ SỞ TỔ CHỨC</span>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#16A34A" }}>5 Campus</div>
                </div>
              </div>

              {/* Channels checkboxes */}
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#334155", display: "block", marginBottom: 6 }}>KÊNH PHÁT HÀNH TỰ ĐỘNG:</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked />
                    <span>📧 Gửi Email thông báo kèm Vé Dự Thi PDF &amp; Mã QR Check-in</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked />
                    <span>📱 Gửi tin nhắn SMS / Zalo ZNS tới số điện thoại Thí sinh &amp; Phụ huynh</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="checkbox" defaultChecked />
                    <span>🔔 Cập nhật lịch thi &amp; sơ đồ phòng thi trực tiếp lên Cổng Thí Sinh (/candidate)</span>
                  </label>
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setIsExamDispatchModalOpen(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setIsExamDispatchModalOpen(false);
                  showToast("🎉 Đã phát hành và gửi Giấy Báo Thi tới 1,850 thí sinh thành công!", "success");
                }}
                style={{ padding: "8px 20px", borderRadius: 6, background: "#EA580C", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Xác Nhận Phát Hành Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: KÝ SỐ & PHÁT HÀNH GIẤY BÁO TRÚNG TUYỂN (DIGITAL ADMISSION LETTER)
         ========================================================================= */}
      {isAdmissionLetterModalOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 640, background: "#FFFFFF",
            borderRadius: 16, border: "1px solid #E2E8F0",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden"
          }}>
            <div style={{ padding: "18px 24px", background: "#059669", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileCheck size={20} />
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>
                    Ký Số &amp; Ban Hành Giấy Báo Trúng Tuyển Chính Thức
                  </h3>
                  <span style={{ fontSize: 11.5, color: "#D1FAE5" }}>Đợt 1 Tuyển Sinh Đại Học FPT 2026</span>
                </div>
              </div>
              <button onClick={() => setIsAdmissionLetterModalOpen(false)} style={{ border: "none", background: "transparent", color: "#D1FAE5", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Digital Certificate Security Badge */}
              <div style={{ background: "#ECFDF5", borderRadius: 10, border: "1px solid #A7F3D0", padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <ShieldCheck size={24} color="#059669" />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: "#065F46" }}>CHỨNG THƯ CHỮ KÝ SỐ HỢP LỆ (FPT EDUCATION CA)</div>
                  <div style={{ fontSize: 11.5, color: "#047857" }}>
                    Người ký: <strong>Hội đồng Tuyển sinh Đại học FPT</strong> • Mã bảo mật QR Code định danh từng thí sinh.
                  </div>
                </div>
              </div>

              <div style={{ background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", padding: "14px 16px" }}>
                <span style={{ fontSize: 11, color: "#64748B", fontWeight: 700 }}>ĐỐI TƯỢNG PHÁT HÀNH:</span>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#0F172A", marginTop: 2 }}>
                  4,050 Thí sinh đủ điểm sàn trúng tuyển chính thức Đợt 1
                </div>
                <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>
                  Tự động cấp Mã Nhập Học (VD: <code>FPTU-2026-K21-8912</code>) và mở cổng đóng học phí trực tuyến VietQR.
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setIsAdmissionLetterModalOpen(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setIsAdmissionLetterModalOpen(false);
                  showToast("🎉 Đã ký số và phát hành 4,050 Giấy Báo Trúng Tuyển Số thành công!", "success");
                }}
                style={{ padding: "8px 20px", borderRadius: 6, background: "#059669", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Ký Số &amp; Ban Hành Toàn Hệ Thống
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 6: TỪ CHỐI TÀI LIỆU & YÊU CẦU BỔ SUNG (REJECT DOCUMENT MODAL)
         ========================================================================= */}
      {isRejectModalOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 540, background: "#FFFFFF",
            borderRadius: 16, border: "1px solid #E2E8F0",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden"
          }}>
            <div style={{ padding: "18px 24px", background: "#DC2626", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <AlertOctagon size={20} />
                <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>
                  Yêu Cầu Thí Sinh Bổ Sung / Sửa Lại Giấy Tờ
                </h3>
              </div>
              <button onClick={() => setIsRejectModalOpen(false)} style={{ border: "none", background: "transparent", color: "#FEE2E2", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>CHỌN LÝ DO TỪ CHỐI (GỬI TRỰC TIẾP CHO THÍ SINH):</span>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={rejectReasons.blurry}
                    onChange={(e) => setRejectReasons({ ...rejectReasons, blurry: e.target.checked })}
                  />
                  <span>Ảnh scan / ảnh chụp bị mờ, lóa sáng hoặc mất góc</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={rejectReasons.discrepancy}
                    onChange={(e) => setRejectReasons({ ...rejectReasons, discrepancy: e.target.checked })}
                  />
                  <span>Điểm số tự khai không khớp với bảng điểm thực tế (Lệch điểm)</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={rejectReasons.missingStamp}
                    onChange={(e) => setRejectReasons({ ...rejectReasons, missingStamp: e.target.checked })}
                  />
                  <span>Thiếu dấu giáp lai hoặc xác nhận của Ban Giám Hiệu THPT</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={rejectReasons.expiredId}
                    onChange={(e) => setRejectReasons({ ...rejectReasons, expiredId: e.target.checked })}
                  />
                  <span>CCCD / Hộ chiếu hết hạn hoặc số định danh không khớp</span>
                </label>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 5 }}>Hướng dẫn cụ thể cho thí sinh</label>
                <textarea
                  rows={3}
                  value={rejectReasons.customNote}
                  onChange={(e) => setRejectReasons({ ...rejectReasons, customNote: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12, resize: "none" }}
                />
              </div>
            </div>

            <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmReject}
                style={{ padding: "8px 20px", borderRadius: 6, background: "#DC2626", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Gửi Yêu Cầu Bổ Sung
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 7: XÁC NHẬN HỒ SƠ ĐẦY ĐỦ & PHÁT HÀNH PHIẾU ĐĂNG KÝ ĐẠI HỌC FPT
         ========================================================================= */}
      {isEnrollmentDispatchModalOpen && enrollmentDispatchCandidate && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(5px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            width: "100%", maxWidth: 760, background: "#FFFFFF",
            borderRadius: 16, border: "1px solid #CBD5E1",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            overflow: "hidden", display: "flex", flexDirection: "column", maxHeight: "90vh"
          }}>
            {/* Header */}
            <div style={{ padding: "18px 24px", background: "#059669", color: "#FFFFFF", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileCheck size={20} color="#FFFFFF" />
                </div>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 900, margin: 0 }}>
                    Xác Nhận Hồ Sơ Đầy Đủ &amp; Ban Hành Phiếu Đăng Ký Đại Học FPT
                  </h3>
                  <span style={{ fontSize: 11.5, color: "#D1FAE5" }}>
                    Biểu mẫu chuẩn: 06.03-BM/ĐH/HDCV/FE v1/5 (Hệ đại học chính quy)
                  </span>
                </div>
              </div>
              <button onClick={() => setIsEnrollmentDispatchModalOpen(false)} style={{ border: "none", background: "transparent", color: "#D1FAE5", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* Body Content */}
            <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Candidate Info Summary Box */}
              <div style={{ background: "#ECFDF5", borderRadius: 12, border: "1px solid #A7F3D0", padding: "14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <strong style={{ fontSize: 14, color: "#065F46" }}>
                    ✓ Thí sinh: {enrollmentDispatchCandidate.name} ({enrollmentDispatchCandidate.id})
                  </strong>
                  <span style={{ fontSize: 11, fontWeight: 800, background: "#059669", color: "#FFFFFF", padding: "2px 8px", borderRadius: 4 }}>
                    HỒ SƠ ĐẠT 100%
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 8, fontSize: 12, color: "#047857" }}>
                  <div>Chuyên ngành: <strong>{enrollmentDispatchCandidate.major}</strong></div>
                  <div>Cơ sở: <strong>{enrollmentDispatchCandidate.campus}</strong></div>
                  <div>CCCD: <strong>{enrollmentDispatchCandidate.citizenId || "001206019842"}</strong></div>
                </div>
              </div>

              {/* Form Content Review Snippet */}
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 6 }}>
                  THÔNG TIN TỰ ĐỘNG ĐIỀN VÀO PHIẾU ĐĂNG KÝ (06.03-BM/ĐH/HDCV/FE):
                </span>
                <div style={{ background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0", padding: "14px 16px", fontSize: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                  <div><strong>1. Họ và tên:</strong> {enrollmentDispatchCandidate.name} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Giới tính:</strong> Nam</div>
                  <div><strong>2. Ngày sinh:</strong> {enrollmentDispatchCandidate.dob || "15/08/2006"} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Năm tốt nghiệp:</strong> 2026</div>
                  <div><strong>3. Trường THPT:</strong> THPT Chuyên Hà Nội - Amsterdam (Cầu Giấy, Hà Nội)</div>
                  <div><strong>5. CMND/CCCD:</strong> {enrollmentDispatchCandidate.citizenId || "001206019842"} (Cấp tại Cục Cảnh sát QLHC về TTXH)</div>
                  <div><strong>7. Ngành đăng ký:</strong> &lt;Kỹ thuật phần mềm&gt; (Khối 7.2 Công nghệ thông tin)</div>
                  <div><strong>8. Đăng ký học tại:</strong> {enrollmentDispatchCandidate.campus}</div>
                  <div><strong>9. Điều kiện trúng tuyển:</strong> ☑ Đạt Top40 theo học bạ THPT 2026 &nbsp;|&nbsp; ☑ IELTS 7.0</div>
                </div>
              </div>

              {/* Multi-channel Dispatch Options */}
              <div>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#334155", display: "block", marginBottom: 8 }}>
                  CHỌN KÊNH THÔNG BÁO &amp; BAN HÀNH PHIẾU:
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={dispatchChannels.portal}
                      onChange={(e) => setDispatchChannels({ ...dispatchChannels, portal: e.target.checked })}
                    />
                    <span>🔔 Đẩy thông báo hoàn tất &amp; Mẫu Phiếu Đăng Ký trực tiếp lên <strong>Cổng Thí Sinh (/candidate)</strong></span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={dispatchChannels.email}
                      onChange={(e) => setDispatchChannels({ ...dispatchChannels, email: e.target.checked })}
                    />
                    <span>📧 Gửi Email thông báo kết quả kèm file <strong>Phiếu Đăng Ký PDF</strong> và hướng dẫn nhập học</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={dispatchChannels.sms}
                      onChange={(e) => setDispatchChannels({ ...dispatchChannels, sms: e.target.checked })}
                    />
                    <span>📱 Gửi tin nhắn SMS / Zalo ZNS tới số điện thoại Thí sinh &amp; Phụ huynh để xác nhận</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: "16px 24px", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
              <button
                onClick={() => setIsEnrollmentDispatchModalOpen(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmEnrollmentDispatch}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 22px", borderRadius: 8, background: "#059669",
                  color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800,
                  cursor: "pointer", boxShadow: "0 4px 12px rgba(5,150,105,0.3)"
                }}
              >
                <FileCheck size={16} /> Xác Nhận Đầy Đủ &amp; Gửi Phiếu Cho Thí Sinh
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
