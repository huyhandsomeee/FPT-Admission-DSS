import { useState, useEffect } from "react";
import api from "../../../config/axiosConfig";
import {
  FileText, Users, Download, PlusCircle, TrendingUp,
  ChevronDown, Calendar, Filter, Eye, MoreVertical,
  ArrowUpRight, ArrowDownRight, Sparkles, ChevronLeft,
  ChevronRight, BarChart3, Target, Trash2, CheckCircle,
  XCircle, AlertTriangle, AlertCircle, FileQuestion, RefreshCw,
  ShieldAlert, ListFilter, Award
} from "lucide-react";
import PendingRequestAlert from "./components/PendingRequestAlert";
import { useNavigate, useSearchParams } from "react-router-dom";

const STATUS_LABELS = {
  DRAFT: "Bản nháp", SUBMITTED: "Đã nộp", UNDER_REVIEW: "Đang xét",
  APPROVED: "Đủ điều kiện", REGISTERED_MOET: "Sinh viên đã xác nhận đăng ký NV", WAITING_MOET: "Chờ đồng bộ Bộ",
  ACCEPTED_MOET: "Trúng tuyển chính thức", REJECTED: "Không trúng tuyển", ENROLLED: "Đã nhập học"
};

const STATUS_COLORS = {
  SUBMITTED:       { bg: "#DBEAFE", color: "#1D4ED8" },
  UNDER_REVIEW:    { bg: "#FEF3C7", color: "#92400E" },
  APPROVED:        { bg: "#D1FAE5", color: "#065F46" },
  REGISTERED_MOET: { bg: "#F3E8FF", color: "#7C3AED" },
  WAITING_MOET:    { bg: "#FEF3C7", color: "#D97706" },
  ACCEPTED_MOET:   { bg: "#D1FAE5", color: "#059669" },
  REJECTED:        { bg: "#FEE2E2", color: "#991B1B" },
  ENROLLED:        { bg: "#EDE9FE", color: "#5B21B6" },
  DRAFT:           { bg: "#F3F4F6", color: "#4B5563" },
};

const AVATAR_COLORS = [
  { bg: "#DBEAFE", color: "#1D4ED8" },
  { bg: "#FEF3C7", color: "#92400E" },
  { bg: "#D1FAE5", color: "#065F46" },
  { bg: "#EDE9FE", color: "#5B21B6" },
  { bg: "#FEE2E2", color: "#991B1B" },
];

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

const getPreferenceStatusLabel = (status) => {
  if (status === "APPROVED") return { icon: "🔴", text: "Chưa xác nhận" };
  if (status === "REGISTERED_MOET") return { icon: "🟡", text: "Sinh viên đã xác nhận" };
  if (status === "WAITING_MOET") return { icon: "🟢", text: "Đã đồng bộ Bộ" };
  if (status === "ACCEPTED_MOET" || status === "ENROLLED") return { icon: "🔵", text: "Trúng tuyển" };
  if (status === "REJECTED") return { icon: "⚫", text: "Không trúng tuyển" };
  return { icon: "", text: "—" };
};

const isWaitingTooLong = (app) => {
  if (!app.submittedAt) return false;
  const submittedDate = new Date(app.submittedAt);
  const now = new Date();
  const diffTime = Math.abs(now - submittedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 7; // Waiting too long if submitted more than 7 days ago
};

export default function ApplicantList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  
  // Pipeline review queue states
  const [rawQueue, setRawQueue] = useState([]);
  const [filteredQueue, setFilteredQueue] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // stores app ID during action
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [selectedRisk, setSelectedRisk] = useState("all");
  
  const [activePipelineTab, setActivePipelineTab] = useState("all");
  
  const handleTabChange = (tab) => {
    setActivePipelineTab(tab);
    setSelectedStatus(tab === "approved" ? "all" : "PENDING");
  };

  // Pagination inside the queue
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Modals state
  const [rejectAppId, setRejectAppId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [requestDocsAppId, setRequestDocsAppId] = useState(null);
  const [requestNotes, setRequestNotes] = useState("");

  const [statusCounts, setStatusCounts] = useState({
    "": 0, SUBMITTED: 0, UNDER_REVIEW: 0, APPROVED: 0, APPROVED_TODAY: 0, REJECTED: 0, ENROLLED: 0
  });

  const loadRequests = () => {
    api.get("/api/officer/applications/new-requests")
      .then(r => setRequests(r.data || []))
      .catch(err => console.error("Error loading requests:", err));
  };

  const handleAllowRequest = async (userId, allow) => {
    try {
      await api.post(`/api/officer/students/${userId}/allow-new-application?allow=${allow}`);
      alert(allow ? "Đã phê duyệt yêu cầu tạo hồ sơ mới!" : "Đã từ chối yêu cầu!");
      loadRequests();
    } catch (err) {
      alert("Lỗi xử lý yêu cầu: " + (err.response?.data?.message || err.message));
    }
  };

  const fetchQueue = (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    api.get("/api/officer/pipeline")
      .then(res => {
        const data = res.data?.data || [];
        setRawQueue(data);
        // Trigger background recalculate cho hồ sơ chưa có pipeline data
        const needsCalc = data.filter(a => a.needsRecalculate);
        if (needsCalc.length > 0) {
          api.post("/api/officer/pipeline/recalculate-all")
            .then(() => api.get("/api/officer/pipeline"))
            .then(res2 => setRawQueue(res2.data?.data || []))
            .catch(() => {});
        }
      })
      .catch(err => {
        console.error("Error fetching review queue:", err);
        setRawQueue([]);
      })
      .finally(() => {
        if (showSpinner) setLoading(false);
      });
  };

  useEffect(() => {
    loadRequests();
    fetchQueue();

    api.get("/api/officer/dashboard").then(r => {
      if (r.data) {
        const d = r.data;
        setStatusCounts({
          "": d.totalApplications || 0,
          SUBMITTED: d.submitted || 0,
          UNDER_REVIEW: d.underReview || 0,
          APPROVED: d.approved || 0,
          APPROVED_TODAY: d.approvedToday || 0,
          REJECTED: d.rejected || 0,
          ENROLLED: d.enrolled || 0
        });
      }
    }).catch(err => console.error("Error fetching stats:", err));

    api.get("/api/student/config/majors")
      .then(res => {
        if (Array.isArray(res.data)) {
          const names = [...new Set(res.data.map(m => m.name))];
          setMajors(names);
        }
      })
      .catch(err => console.error("Error loading majors:", err));
  }, []);

  // Handle client-side filtering and searching of the queue
  useEffect(() => {
    let result = [...rawQueue];

    // 1. Filter by Active Pipeline Tab
    if (activePipelineTab === "complete") {
      result = result.filter(app => app.validationStatus === "COMPLETE");
    } else if (activePipelineTab === "missing_docs") {
      result = result.filter(app => app.validationStatus === "WARNING");
    } else if (activePipelineTab === "manual_review") {
      result = result.filter(app => app.validationStatus === "ERROR" || app.riskLevel === "High");
    } else if (activePipelineTab === "approved") {
      result = result.filter(app => ["APPROVED", "REGISTERED_MOET", "WAITING_MOET", "ACCEPTED_MOET", "ENROLLED"].includes(app.status));
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(app => 
        app.applicationCode?.toLowerCase().includes(q) ||
        app.studentName?.toLowerCase().includes(q) ||
        app.studentEmail?.toLowerCase().includes(q) ||
        app.majorName?.toLowerCase().includes(q)
      );
    }

    // 3. Dropdown filters
    if (selectedMajor !== "all") {
      result = result.filter(app => app.majorName === selectedMajor);
    }

    if (selectedStatus === "all") {
      // Không lọc theo status khi chọn "Tất cả" — hiển thị hết
    } else if (selectedStatus === "PENDING") {
      result = result.filter(app => app.status === "SUBMITTED" || app.status === "UNDER_REVIEW");
    } else {
      result = result.filter(app => app.status === selectedStatus);
    }

    if (selectedRisk !== "all") {
      result = result.filter(app => app.riskLevel?.toLowerCase() === selectedRisk.toLowerCase());
    }

    setFilteredQueue(result);
    setCurrentPage(0);
  }, [rawQueue, searchQuery, selectedMajor, selectedStatus, selectedRisk, activePipelineTab]);

  const handleRecalculate = async (id, e) => {
    e.stopPropagation();
    setActionLoading(id);
    try {
      await api.post(`/api/officer/pipeline/recalculate/${id}`);
      fetchQueue(false); // Silent sync in background
    } catch (err) {
      alert("Lỗi khi tính toán lại: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleApprove = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Bạn có chắc chắn muốn PHÊ DUYỆT nhanh hồ sơ này?")) return;
    setActionLoading(id);
    try {
      await api.post(`/api/officer/pipeline/approve/${id}`);
      // Remove approved item from state instantly!
      setRawQueue(prev => prev.filter(app => app.id !== id));
      fetchQueue(false); // Silent sync in background
    } catch (err) {
      alert("Lỗi phê duyệt hồ sơ: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleBatchApprove = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Bạn có chắc chắn muốn PHÊ DUYỆT đồng thời ${selectedIds.length} hồ sơ đã chọn?`)) return;
    setLoading(true);
    try {
      await api.post("/api/officer/pipeline/approve-batch", selectedIds);
      alert(`Đã phê duyệt hàng loạt thành công ${selectedIds.length} hồ sơ!`);
      const approvedSet = new Set(selectedIds);
      setRawQueue(prev => prev.filter(app => !approvedSet.has(app.id)));
      setSelectedIds([]);
      fetchQueue(false);
    } catch (err) {
      alert("Lỗi phê duyệt hàng loạt: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const triggerReject = (id, e) => {
    e.stopPropagation();
    setRejectAppId(id);
    setRejectReason("");
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert("Vui lòng điền lý do từ chối");
      return;
    }
    const id = rejectAppId;
    setActionLoading(id);
    try {
      await api.post(`/api/officer/pipeline/reject/${id}`, { reason: rejectReason });
      // Remove rejected item from state instantly!
      setRawQueue(prev => prev.filter(app => app.id !== id));
      setRejectAppId(null);
      fetchQueue(false); // Silent sync in background
    } catch (err) {
      alert("Lỗi từ chối hồ sơ: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const triggerRequestDocs = (id, e) => {
    e.stopPropagation();
    setRequestDocsAppId(id);
    setRequestNotes("");
  };

  const handleRequestDocsSubmit = async () => {
    if (!requestNotes.trim()) {
      alert("Vui lòng nhập chi tiết tài liệu cần bổ sung");
      return;
    }
    const id = requestDocsAppId;
    setActionLoading(id);
    try {
      await api.post(`/api/officer/pipeline/request-docs/${id}`, { notes: requestNotes });
      // Remove item from active queue list locally since status changes to requesting documents
      setRawQueue(prev => prev.filter(app => app.id !== id));
      setRequestDocsAppId(null);
      fetchQueue(false); // Silent sync in background
    } catch (err) {
      alert("Lỗi gửi yêu cầu bổ sung: " + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleExportCSV = () => {
    if (filteredQueue.length === 0) { alert("Không có hồ sơ nào để xuất"); return; }
    const headers = ["Mã hồ sơ", "Họ tên", "Email", "Ngành học", "Thẩm định", "Điểm ưu tiên", "Đề xuất AI", "Rủi ro", "Ngày nộp"];
    const rows = filteredQueue.map(app => [
      app.applicationCode || "", app.studentName || "", app.studentEmail || "",
      app.majorName || "", app.validationStatus || "", app.priorityScore || 0,
      app.aiRecommendation || "", app.riskLevel || "",
      app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("vi-VN") : "Chưa nộp"
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Hang_cho_xet_duyet_Smart_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredQueue.length / pageSize) || 1;
  const paginatedApps = filteredQueue.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 3;
    for (let i = 0; i < Math.min(maxVisible, totalPages); i++) {
      buttons.push(i);
    }
    if (totalPages > maxVisible + 1) buttons.push(-1); // ellipsis
    if (totalPages > maxVisible) buttons.push(totalPages - 1);
    return buttons;
  };

  const getValidationBadge = (status, missingDocs) => {
    if (status === "COMPLETE") {
      return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#16A34A", fontWeight: 700, fontSize: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16A34A" }} /> 🟢 Hợp lệ
        </span>
      );
    } else if (status === "WARNING") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#D97706", fontWeight: 700, fontSize: 12 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D97706" }} /> 🟡 Thiếu tài liệu
          </span>
          {missingDocs && missingDocs.length > 0 && (
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {missingDocs.slice(0, 2).map(code => (
                <span key={code} style={{ background: "#FEF3C7", color: "#92400E", padding: "1px 5px", borderRadius: 4, fontSize: 9, fontWeight: 700 }}>
                  {code}
                </span>
              ))}
              {missingDocs.length > 2 && <span style={{ fontSize: 9, color: "#94A3B8" }}>+{missingDocs.length - 2}</span>}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#DC2626", fontWeight: 700, fontSize: 12 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#DC2626" }} /> 🔴 Lỗi / Trùng lặp
        </span>
      );
    }
  };

  const getAIRecommendationBadge = (rec, confidence) => {
    let text = "Cần Thẩm Định";
    let bg = "#F3F4F6";
    let color = "#4B5563";

    if (rec === "READY_FOR_APPROVAL") {
      text = "Khuyên Duyệt";
      bg = "#D1FAE5";
      color = "#065F46";
    } else if (rec === "NEED_MORE_DOCUMENT") {
      text = "Yêu Cầu Bổ Sung";
      bg = "#FEF3C7";
      color = "#92400E";
    } else if (rec === "REJECT_RECOMMENDED") {
      text = "Khuyên Từ Chối";
      bg = "#FEE2E2";
      color = "#991B1B";
    } else if (rec === "MANUAL_REVIEW") {
      text = "Cần Xét Duyệt";
      bg = "#E0F2FE";
      color = "#0369A1";
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ background: bg, color: color, padding: "4px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, display: "inline-block", textAlign: "center" }}>
          {text}
        </span>
        <span style={{ fontSize: 10, color: "#64748B", fontWeight: 500 }}>Độ tin cậy: {confidence}%</span>
      </div>
    );
  };

  const getRiskBadge = (level) => {
    let bg = "#DCFCE7";
    let color = "#15803D";
    let icon = <CheckCircle size={10} />;

    if (level === "High") {
      bg = "#FEE2E2";
      color = "#B91C1C";
      icon = <AlertCircle size={10} />;
    } else if (level === "Medium") {
      bg = "#FEF3C7";
      color = "#A16207";
      icon = <AlertTriangle size={10} />;
    }

    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: bg, color: color, padding: "2px 6px", borderRadius: 999, fontSize: 10, fontWeight: 700 }}>
        {icon} {level === "High" ? "Rủi ro cao" : level === "Medium" ? "Rủi ro trung bình" : "Rủi ro thấp"}
      </span>
    );
  };

  const getStars = (score) => {
    const stars = Math.round((score / 100.0) * 5);
    return "★".repeat(stars) + "☆".repeat(5 - stars);
  };

  // Pipeline categorization count calculations
  const countAll = rawQueue.length;
  const countHigh = rawQueue.filter(a => a.priorityScore >= 80).length;
  const countWaiting = rawQueue.filter(a => isWaitingTooLong(a)).length;
  const countComplete = rawQueue.filter(a => a.validationStatus === "COMPLETE").length;
  const countMissing = rawQueue.filter(a => a.validationStatus === "WARNING").length;
  const countManual = rawQueue.filter(a => a.validationStatus === "ERROR" || a.riskLevel === "High").length;
  const countApproved = rawQueue.filter(a => ["APPROVED", "REGISTERED_MOET", "WAITING_MOET", "ACCEPTED_MOET", "ENROLLED"].includes(a.status)).length;

  const selectableApps = paginatedApps.filter(app => 
    !(app.validationStatus === "ERROR" || app.riskLevel === "High") && 
    !["APPROVED", "REGISTERED_MOET", "WAITING_MOET", "ACCEPTED_MOET", "ENROLLED", "REJECTED"].includes(app.status)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: "#94A3B8" }}>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/officer/dashboard")}>Cổng Tuyển Sinh</span>
        <span style={{ margin: "0 6px" }}>›</span>
        <span style={{ color: "#FF6B35", fontWeight: 600 }}>Smart Pipeline review</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: "#0F172A" }}>Quy Trình Duyệt Hồ Sơ Thông Minh</h1>
            <span style={{ background: "linear-gradient(135deg, #FF6B35, #FF8E53)", color: "white", padding: "3px 10px", borderRadius: 99, fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>Pipeline active</span>
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748B" }}>
            Hệ thống tự động chấm điểm, xác minh tài liệu, và phân luồng hồ sơ theo các bước thẩm định tối ưu.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={fetchQueue} style={{
            padding: "10px 14px", background: "white", border: "1px solid #E2E8F0",
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <RefreshCw size={15} /> Tải lại dữ liệu
          </button>
          <button onClick={handleExportCSV} style={{
            padding: "10px 18px", background: "white", border: "1px solid #E2E8F0",
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <Download size={15} /> Xuất CSV
          </button>
          <button onClick={() => navigate("/officer/moet-results")} style={{
            padding: "10px 18px", background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
            border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "white",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 4px 12px rgba(255,107,53,0.2)"
          }}>
            <RefreshCw size={15} /> Đồng bộ Bộ GDĐT
          </button>
        </div>
      </div>

      {/* Pipeline Navigation Steps / Tabs */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8,
        background: "#F8FAFC", padding: 6, borderRadius: 12, border: "1px solid #E2E8F0"
      }}>
        {/* Tab 1: All */}
        <button 
          onClick={() => handleTabChange("all")}
          style={{
            border: "none", borderRadius: 8, padding: "10px 8px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: activePipelineTab === "all" ? "white" : "transparent",
            color: activePipelineTab === "all" ? "#FF6B35" : "#64748B",
            boxShadow: activePipelineTab === "all" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            fontWeight: activePipelineTab === "all" ? 700 : 500, transition: "all 0.15s"
          }}
        >
          <ListFilter size={16} />
          <span style={{ fontSize: 12 }}>Tất cả</span>
          <span style={{ fontSize: 10, background: activePipelineTab === "all" ? "#FF6B35" : "#E2E8F0", color: activePipelineTab === "all" ? "white" : "#475569", padding: "1px 6px", borderRadius: 99 }}>
            {countAll}
          </span>
        </button>

        {/* Tab 2: Complete */}
        <button 
          onClick={() => handleTabChange("complete")}
          style={{
            border: "none", borderRadius: 8, padding: "10px 8px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: activePipelineTab === "complete" ? "white" : "transparent",
            color: activePipelineTab === "complete" ? "#FF6B35" : "#64748B",
            boxShadow: activePipelineTab === "complete" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            fontWeight: activePipelineTab === "complete" ? 700 : 500, transition: "all 0.15s"
          }}
        >
          <CheckCircle size={16} color={activePipelineTab === "complete" ? "#FF6B35" : "#10B981"} />
          <span style={{ fontSize: 11, textAlign: "center" }}>1. Đủ tài liệu</span>
          <span style={{ fontSize: 10, background: activePipelineTab === "complete" ? "#FF6B35" : "#D1FAE5", color: activePipelineTab === "complete" ? "white" : "#10B981", padding: "1px 6px", borderRadius: 99, fontWeight: 700 }}>
            {countComplete}
          </span>
        </button>

        {/* Tab 3: Missing docs */}
        <button 
          onClick={() => handleTabChange("missing_docs")}
          style={{
            border: "none", borderRadius: 8, padding: "10px 8px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: activePipelineTab === "missing_docs" ? "white" : "transparent",
            color: activePipelineTab === "missing_docs" ? "#FF6B35" : "#64748B",
            boxShadow: activePipelineTab === "missing_docs" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            fontWeight: activePipelineTab === "missing_docs" ? 700 : 500, transition: "all 0.15s"
          }}
        >
          <FileQuestion size={16} color={activePipelineTab === "missing_docs" ? "#FF6B35" : "#F59E0B"} />
          <span style={{ fontSize: 11, textAlign: "center" }}>2. Thiếu tài liệu</span>
          <span style={{ fontSize: 10, background: activePipelineTab === "missing_docs" ? "#FF6B35" : "#FEF3C7", color: activePipelineTab === "missing_docs" ? "white" : "#F59E0B", padding: "1px 6px", borderRadius: 99, fontWeight: 700 }}>
            {countMissing}
          </span>
        </button>

        {/* Tab 4: Manual verification exceptions */}
        <button 
          onClick={() => handleTabChange("manual_review")}
          style={{
            border: "none", borderRadius: 8, padding: "10px 8px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: activePipelineTab === "manual_review" ? "white" : "transparent",
            color: activePipelineTab === "manual_review" ? "#FF6B35" : "#64748B",
            boxShadow: activePipelineTab === "manual_review" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            fontWeight: activePipelineTab === "manual_review" ? 700 : 500, transition: "all 0.15s"
          }}
        >
          <ShieldAlert size={16} color={activePipelineTab === "manual_review" ? "#FF6B35" : "#EF4444"} />
          <span style={{ fontSize: 11, textAlign: "center" }}>3. Cần xác minh</span>
          <span style={{ fontSize: 10, background: activePipelineTab === "manual_review" ? "#FF6B35" : "#FEE2E2", color: activePipelineTab === "manual_review" ? "white" : "#EF4444", padding: "1px 6px", borderRadius: 99, fontWeight: 700 }}>
            {countManual}
          </span>
        </button>

        {/* Tab 5: Approved/Finalized */}
        <button 
          onClick={() => handleTabChange("approved")}
          style={{
            border: "none", borderRadius: 8, padding: "10px 8px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            background: activePipelineTab === "approved" ? "white" : "transparent",
            color: activePipelineTab === "approved" ? "#FF6B35" : "#64748B",
            boxShadow: activePipelineTab === "approved" ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
            fontWeight: activePipelineTab === "approved" ? 700 : 500, transition: "all 0.15s"
          }}
        >
          <Award size={16} color={activePipelineTab === "approved" ? "#FF6B35" : "#3B82F6"} />
          <span style={{ fontSize: 11, textAlign: "center" }}>4. Đã duyệt</span>
          <span style={{ fontSize: 10, background: activePipelineTab === "approved" ? "#FF6B35" : "#DBEAFE", color: activePipelineTab === "approved" ? "white" : "#3B82F6", padding: "1px 6px", borderRadius: 99, fontWeight: 700 }}>
            {countApproved}
          </span>
        </button>
      </div>

      <PendingRequestAlert requests={requests} onAllowRequest={handleAllowRequest} />

      {/* Search & Dynamic Filters */}
      <div style={{
        background: "white", borderRadius: 14, padding: "16px 20px",
        border: "1px solid #F1F5F9", display: "flex", flexWrap: "wrap", gap: 12,
        alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
      }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", flex: 1 }}>
          <input
            type="text"
            placeholder="Tìm theo mã hồ sơ, tên thí sinh..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              padding: "8px 14px", border: "1px solid #E2E8F0", borderRadius: 8,
              fontSize: 13, color: "#475569", width: 260, fontFamily: "inherit"
            }}
          />

          <select
            value={selectedMajor}
            onChange={e => setSelectedMajor(e.target.value)}
            style={{
              padding: "8px 14px", border: "1px solid #E2E8F0", borderRadius: 8,
              fontSize: 13, color: "#475569", background: "white", cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            <option value="all">Tất cả chuyên ngành</option>
            {majors.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <select
            value={selectedRisk}
            onChange={e => setSelectedRisk(e.target.value)}
            style={{
              padding: "8px 14px", border: "1px solid #E2E8F0", borderRadius: 8,
              fontSize: 13, color: "#475569", background: "white", cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            <option value="all">Mức độ rủi ro: Tất cả</option>
            <option value="Low">Rủi ro thấp</option>
            <option value="Medium">Rủi ro trung bình</option>
            <option value="High">Rủi ro cao</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{
              padding: "8px 14px", border: "1px solid #E2E8F0", borderRadius: 8,
              fontSize: 13, color: "#475569", background: "white", cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            {activePipelineTab === "approved" ? (
              <>
                <option value="all">Trạng thái: Tất cả đã duyệt</option>
                <option value="APPROVED">Đủ điều kiện</option>
                <option value="REGISTERED_MOET">Đã đăng ký NV Bộ</option>
                <option value="WAITING_MOET">Chờ kết quả Bộ</option>
                <option value="ACCEPTED_MOET">Trúng tuyển chính thức</option>
                <option value="ENROLLED">Nhập học</option>
              </>
            ) : (
              <>
                <option value="PENDING">Trạng thái: Đang chờ duyệt</option>
                <option value="all">Trạng thái: Tất cả</option>
                <option value="SUBMITTED">Đã nộp</option>
                <option value="UNDER_REVIEW">Đang xét</option>
                <option value="APPROVED">Đủ điều kiện (Đã duyệt)</option>
                <option value="REGISTERED_MOET">Đã đăng ký NV Bộ</option>
                <option value="WAITING_MOET">Chờ kết quả Bộ</option>
                <option value="ACCEPTED_MOET">Trúng tuyển chính thức</option>
                <option value="REJECTED">Từ chối</option>
                <option value="ENROLLED">Nhập học</option>
              </>
            )}
          </select>
        </div>

        <div style={{ fontSize: 12, color: "#94A3B8" }}>
          Hiển thị <strong style={{ color: "#1E293B" }}>{filteredQueue.length > 0 ? currentPage * pageSize + 1 : 0}-{Math.min((currentPage + 1) * pageSize, filteredQueue.length)}</strong> trong{" "}
          <strong style={{ color: "#FF6B35" }}>{filteredQueue.length}</strong> hồ sơ lọc
        </div>
      </div>

      {/* Smart Review Table */}
      <div style={{
        background: "white", borderRadius: 16, border: "1px solid #F1F5F9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "14px 16px", background: "#FAFBFC", borderBottom: "1px solid #F1F5F9", width: 46 }}>
                  <input
                    type="checkbox"
                    checked={selectableApps.length > 0 && selectableApps.every(app => selectedIds.includes(app.id))}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const newSelections = [...new Set([...selectedIds, ...selectableApps.map(app => app.id)])];
                        setSelectedIds(newSelections);
                      } else {
                        const idsToRemove = selectableApps.map(app => app.id);
                        setSelectedIds(prev => prev.filter(id => !idsToRemove.includes(id)));
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                {["MÃ HỒ SƠ", "HỌ VÀ TÊN", "NGÀNH", "ĐIỂM ƯU TIÊN", "AI ĐỀ XUẤT / RỦI RO", "TRẠNG THÁI", "TÌNH TRẠNG NV", "THAO TÁC DUYỆT NHANH"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "14px 16px", fontSize: 10,
                    fontWeight: 700, letterSpacing: "0.06em", color: "#94A3B8",
                    background: "#FAFBFC", borderBottom: "1px solid #F1F5F9"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                    Đang tải dữ liệu quy trình duyệt hồ sơ...
                  </div>
                </td></tr>
              ) : filteredQueue.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Không tìm thấy hồ sơ nào trong bước quy trình này</td></tr>
              ) : (
                paginatedApps.map((app, idx) => {
                  const ac = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  
                  // Exceptions require detail page manually
                  const hasException = app.validationStatus === "ERROR" || app.riskLevel === "High";
                  const isSelectable = !hasException && app.status !== "APPROVED" && app.status !== "REJECTED" && app.status !== "ENROLLED";

                  return (
                    <tr key={app.id} 
                      style={{ 
                        cursor: "pointer", 
                        transition: "background 0.15s",
                        background: hasException ? "rgba(254, 242, 242, 0.4)" : "transparent"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = hasException ? "rgba(254, 242, 242, 0.7)" : "#FAFBFC"}
                      onMouseLeave={e => e.currentTarget.style.background = hasException ? "rgba(254, 242, 242, 0.4)" : "transparent"}
                      onClick={() => navigate(`/officer/applicants/${app.id}`)}
                    >
                      {/* Checkbox */}
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC", width: 46 }} onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          disabled={!isSelectable}
                          checked={selectedIds.includes(app.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(prev => [...prev, app.id]);
                            } else {
                              setSelectedIds(prev => prev.filter(selectedId => selectedId !== app.id));
                            }
                          }}
                          style={{ cursor: isSelectable ? "pointer" : "not-allowed" }}
                          title={hasException ? "Hồ sơ lỗi/rủi ro bắt buộc duyệt thủ công" : !isSelectable ? "Hồ sơ đã hoàn tất quy trình duyệt" : ""}
                        />
                      </td>
                      {/* Code */}
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <code style={{
                            fontSize: 11, fontWeight: 700, color: "#FF6B35",
                            background: "#FFF7ED", padding: "3px 8px", borderRadius: 6,
                            alignSelf: "flex-start"
                          }}>{app.applicationCode}</code>
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#94A3B8" }}>
                            {isWaitingTooLong(app) ? <span style={{ color: "#EF4444", fontWeight: 600 }}>⏳ {new Date(app.submittedAt).toLocaleDateString("vi-VN")}</span> : new Date(app.submittedAt).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </td>

                      {/* Name & Phone */}
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: ac.bg, color: ac.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: 12, flexShrink: 0
                          }}>{getInitials(app.studentName)}</div>
                          <div>
                            <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 14 }}>{app.studentName}</div>
                            <div style={{ fontSize: 11, color: "#64748B" }}>{app.studentEmail}</div>
                            {app.studentPhone && <div style={{ fontSize: 11, color: "#94A3B8" }}>SĐT: {app.studentPhone}</div>}
                          </div>
                        </div>
                      </td>

                      {/* Major */}
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #F8FAFC" }}>
                        <div style={{ fontWeight: 500 }}>{app.majorName || "—"}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>CS: {app.campusName}</div>
                      </td>



                      {/* Priority Score */}
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ fontSize: 15, fontWeight: 800, color: app.priorityScore >= 80 ? "#16A34A" : app.priorityScore >= 60 ? "#FF6B35" : "#DC2626" }}>
                            {app.priorityScore}/100
                          </span>
                          <span style={{ color: "#F59E0B", fontSize: 12, letterSpacing: 1 }}>
                            {getStars(app.priorityScore)}
                          </span>
                        </div>
                      </td>

                      {/* AI Recommendation & Risk Level */}
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}>
                          {getAIRecommendationBadge(app.aiRecommendation, app.aiConfidence)}
                          {getRiskBadge(app.riskLevel)}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        {app.status && (
                          <span style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            backgroundColor: STATUS_COLORS[app.status]?.bg || "#F3F4F6",
                            color: STATUS_COLORS[app.status]?.color || "#4B5563"
                          }}>
                            {STATUS_LABELS[app.status] || app.status}
                          </span>
                        )}
                      </td>

                      {/* Preference Registration Status */}
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        {(() => {
                          const pref = getPreferenceStatusLabel(app.status);
                          if (!pref.icon) return <span style={{ color: "#94A3B8", fontSize: 13 }}>—</span>;
                          return (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "#334155" }}>
                              <span style={{ fontSize: 14 }}>{pref.icon}</span>
                              <span>{pref.text}</span>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Direct Inline Review Actions */}
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {actionLoading === app.id ? (
                            <span style={{ fontSize: 11, color: "#64748B" }}>Đang xử lý...</span>
                          ) : (
                            <>
                              {["APPROVED", "REGISTERED_MOET", "WAITING_MOET", "ACCEPTED_MOET", "ENROLLED", "REJECTED"].includes(app.status) ? (
                                <button
                                  onClick={() => navigate(`/officer/applicants/${app.id}`)}
                                  style={{
                                    padding: "6px 12px", background: "#3B82F6", color: "white",
                                    border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700,
                                    cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                                  }}
                                >
                                  <Eye size={12} /> Xem chi tiết
                                </button>
                              ) : hasException ? (
                                <button
                                  onClick={() => navigate(`/officer/applicants/${app.id}`)}
                                  style={{
                                    padding: "6px 12px", background: "#EF4444", color: "white",
                                    border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700,
                                    cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                                  }}
                                >
                                  <AlertCircle size={12} /> Bắt buộc Xem chi tiết
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={(e) => handleApprove(app.id, e)}
                                    title="Duyệt nhanh"
                                    style={{
                                      padding: "6px 10px", background: "#10B981", color: "white",
                                      border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700,
                                      cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                                    }}
                                  >
                                    <CheckCircle size={12} /> Duyệt
                                  </button>

                                  <button
                                    onClick={(e) => triggerRequestDocs(app.id, e)}
                                    title="Yêu cầu bổ sung tài liệu"
                                    style={{
                                      padding: "6px 10px", background: "#F59E0B", color: "white",
                                      border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700,
                                      cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                                    }}
                                  >
                                    <FileQuestion size={12} /> Bổ sung
                                  </button>

                                  <button
                                    onClick={(e) => triggerReject(app.id, e)}
                                    title="Từ chối hồ sơ"
                                    style={{
                                      padding: "6px 10px", background: "#EF4444", color: "white",
                                      border: "none", borderRadius: 6, fontSize: 11, fontWeight: 700,
                                      cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                                    }}
                                  >
                                    <XCircle size={12} /> Từ chối
                                  </button>
                                </>
                              )}

                              {!["APPROVED", "REGISTERED_MOET", "WAITING_MOET", "ACCEPTED_MOET", "ENROLLED", "REJECTED"].includes(app.status) && (
                                <button
                                  onClick={(e) => handleRecalculate(app.id, e)}
                                  title="Tính toán lại"
                                  style={{
                                    padding: "6px", background: "#F3F4F6", color: "#4B5563",
                                    border: "1px solid #E5E7EB", borderRadius: 6, cursor: "pointer"
                                  }}
                                >
                                  <RefreshCw size={12} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div style={{
          padding: "14px 20px", display: "flex", alignItems: "center",
          justifyContent: "space-between", borderTop: "1px solid #F1F5F9"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: "1px solid #E2E8F0", background: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                opacity: currentPage === 0 ? 0.5 : 1, color: "#475569"
              }}
            ><ChevronLeft size={14} /></button>

            {renderPaginationButtons().map((page, i) => (
              page === -1 ? (
                <span key={`ellipsis-${i}`} style={{ padding: "0 4px", color: "#94A3B8" }}>...</span>
              ) : (
                <button key={page} onClick={() => setCurrentPage(page)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: currentPage === page ? "none" : "1px solid #E2E8F0",
                    background: currentPage === page ? "#FF6B35" : "white",
                    color: currentPage === page ? "white" : "#475569",
                    fontWeight: currentPage === page ? 700 : 500,
                    fontSize: 13, cursor: "pointer"
                  }}
                >{page + 1}</button>
              )
            ))}

            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: "1px solid #E2E8F0", background: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
                opacity: currentPage >= totalPages - 1 ? 0.5 : 1, color: "#475569"
              }}
            ><ChevronRight size={14} /></button>
          </div>

          <div style={{ fontSize: 12, color: "#94A3B8" }}>
            Trang {currentPage + 1} / {totalPages}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectAppId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "white", borderRadius: 16, padding: 24, width: 450,
            display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1F2937" }}>Từ chối hồ sơ</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: "#4B5563", fontWeight: 600 }}>Lý do từ chối:</label>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối chi tiết gửi tới thí sinh (ví dụ: Điểm học bạ môn Toán chưa đạt yêu cầu xét tuyển)..."
                style={{
                  padding: 10, border: "1px solid #D1D5DB", borderRadius: 8,
                  fontSize: 13, fontFamily: "inherit", resize: "none"
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setRejectAppId(null)}
                style={{
                  padding: "8px 16px", background: "#F3F4F6", border: "1px solid #E5E7EB",
                  borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#4B5563", cursor: "pointer"
                }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleRejectSubmit}
                style={{
                  padding: "8px 16px", background: "#EF4444", border: "none",
                  borderRadius: 8, fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer"
                }}
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Documents Modal */}
      {requestDocsAppId && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)"
        }}>
          <div style={{
            background: "white", borderRadius: 16, padding: 24, width: 450,
            display: "flex", flexDirection: "column", gap: 16, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#1F2937" }}>Yêu cầu bổ sung tài liệu</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 13, color: "#4B5563", fontWeight: 600 }}>Chi tiết yêu cầu bổ sung:</label>
              <textarea
                rows={4}
                value={requestNotes}
                onChange={e => setRequestNotes(e.target.value)}
                placeholder="Nhập thông tin mô tả chi tiết các tài liệu cần bổ sung (ví dụ: Thiếu Bản sao học bạ công chứng lớp 12, vui lòng tải lên bổ sung)..."
                style={{
                  padding: 10, border: "1px solid #D1D5DB", borderRadius: 8,
                  fontSize: 13, fontFamily: "inherit", resize: "none"
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => setRequestDocsAppId(null)}
                style={{
                  padding: "8px 16px", background: "#F3F4F6", border: "1px solid #E5E7EB",
                  borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#4B5563", cursor: "pointer"
                }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleRequestDocsSubmit}
                style={{
                  padding: "8px 16px", background: "#F59E0B", border: "none",
                  borderRadius: 8, fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer"
                }}
              >
                Gửi yêu cầu
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedIds.length > 0 && (
        <div style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1E293B", color: "white", padding: "14px 24px", borderRadius: 16,
          display: "flex", alignItems: "center", gap: 20, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
          zIndex: 100, border: "1px solid #334155"
        }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Đã chọn {selectedIds.length} hồ sơ đủ điều kiện</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleBatchApprove}
              style={{
                padding: "8px 16px", background: "#10B981", color: "white", border: "none",
                borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6
              }}
            >
              <CheckCircle size={15} /> Phê duyệt hàng loạt
            </button>
            <button
              onClick={() => setSelectedIds([])}
              style={{
                padding: "8px 16px", background: "transparent", color: "#94A3B8",
                border: "1px solid #475569", borderRadius: 8, fontSize: 13,
                fontWeight: 600, cursor: "pointer"
              }}
            >
              Hủy chọn
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
