import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../../../config/axiosConfig";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import DocumentViewer from "./components/DocumentViewer";
import StudentProfileCard from "./components/StudentProfileCard";
import AttachedDocuments from "./components/AttachedDocuments";
import EvaluationPanel from "./components/EvaluationPanel";
import QuickActions from "./components/QuickActions";

const MOCK_DOCS = [
  { name: "Học bạ THPT", desc: "Học bạ lên", status: "uploaded" },
  { name: "CCCD/CMND", desc: "Ảnh CCCD 2 mặt", status: "uploaded" },
  { name: "Chứng chỉ Tiếng Anh", desc: "Chứng chỉ IELTS/SAT", status: "pending" },
];

const statusLabelMap = {
  "APPROVED": "Duyệt", "UNDER_REVIEW": "Bổ sung", "REJECTED": "Từ chối", "SUBMITTED": "Duyệt"
};

export default function ApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loadingApp, setLoadingApp] = useState(true);

  const [score, setScore] = useState("");
  const [notes, setNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [decision, setDecision] = useState("Duyệt");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("transcript");
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    setLoadingApp(true);
    api.get(`/api/officer/applications/${id}`)
      .then(r => {
        if (r.data) {
          const data = r.data;
          setApp(data);
          const documentList = data.documents?.length > 0 ? data.documents : MOCK_DOCS;
          setDocs(documentList);
          const firstValid = documentList.find(d => d.filePath);
          if (firstValid) setSelectedDoc(firstValid);
          if (data.officerNotes) setNotes(data.officerNotes);
          if (data.rejectionReason) setRejectionReason(data.rejectionReason);
          if (data.totalScore !== null && data.totalScore !== undefined) setScore(data.totalScore);
          if (data.status) setDecision(statusLabelMap[data.status] || "Duyệt");
        }
      })
      .catch(err => console.error("Lỗi khi tải chi tiết hồ sơ:", err))
      .finally(() => setLoadingApp(false));
  }, [id]);

  const handleSave = async () => {
    const statusMap = { "Duyệt": "APPROVED", "Bổ sung": "UNDER_REVIEW", "Từ chối": "REJECTED" };
    const status = statusMap[decision] || "UNDER_REVIEW";

    if (status === "REJECTED" && !rejectionReason.trim()) {
      alert("Vui lòng nhập lý do từ chối hồ sơ.");
      return;
    }
    if (status === "UNDER_REVIEW" && !notes.trim()) {
      alert("Vui lòng nhập lý do/yêu cầu tài liệu bổ sung.");
      return;
    }

    setLoading(true);
    const payload = {
      status,
      notes: status === "REJECTED" ? "" : notes,
      reason: status === "REJECTED" ? rejectionReason : "",
      score
    };

    try {
      await api.patch(`/api/officer/applications/${id}/status`, payload);
      navigate("/officer/applicants");
    } catch (err) {
      alert(err.response?.data?.message || "Không thể lưu đánh giá.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (status) => {
    setDecision(statusLabelMap[status] || "Duyệt");
    document.getElementById("evaluation-panel")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectDoc = (doc) => {
    if (doc.filePath) { setSelectedDoc(doc); setActiveTab("document"); }
  };

  const getStatusStyle = (status) => {
    const styles = {
      APPROVED: { bg: "#ECFDF5", color: "#059669" },
      REJECTED: { bg: "#FEF2F2", color: "#DC2626" },
      UNDER_REVIEW: { bg: "#FFFBEB", color: "#D97706" },
      default: { bg: "#EFF6FF", color: "#2563EB" }
    };
    return styles[status] || styles.default;
  };

  const getStatusLabel = (status) => {
    const labels = {
      APPROVED: "Đã duyệt", REJECTED: "Từ chối",
      UNDER_REVIEW: "Yêu cầu bổ sung", SUBMITTED: "Chờ xét duyệt"
    };
    return labels[status] || status;
  };

  if (loadingApp || !app) return <LoadingSpinner message="Đang tải dữ liệu hồ sơ thí sinh..." />;

  const statusStyle = getStatusStyle(app.status);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: "1280px", margin: "0 auto", padding: "12px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => navigate(-1)}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "white", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "#475569", cursor: "pointer" }}>
            <ArrowLeft size={16} /> Quay lại
          </button>
          <div>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: "#0F172A" }}>Đánh Giá Hồ Sơ Xét Tuyển</h1>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748B" }}>Cập nhật điểm số và duyệt trạng thái hồ sơ</p>
          </div>
        </div>
        <div style={{ padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, background: statusStyle.bg, color: statusStyle.color }}>
          Trạng thái hiện tại: {getStatusLabel(app.status)}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <DocumentViewer app={app} activeTab={activeTab} setActiveTab={setActiveTab}
            selectedDoc={selectedDoc} setSelectedDoc={setSelectedDoc} docs={docs} />
          <StudentProfileCard app={app} />
          <AttachedDocuments docs={docs} selectedDoc={selectedDoc} handleSelectDoc={handleSelectDoc} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <EvaluationPanel
            score={score} setScore={setScore} notes={notes} setNotes={setNotes}
            rejectionReason={rejectionReason} setRejectionReason={setRejectionReason}
            decision={decision} setDecision={setDecision} onSave={handleSave} loading={loading} app={app} />
          <QuickActions onAction={handleQuickAction} />
        </div>
      </div>
    </div>
  );
}
