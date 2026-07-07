import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle, XCircle, AlertTriangle, 
  Sparkles, RefreshCw, ShieldAlert, Star, AlertCircle
} from "lucide-react";
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

  // Pipeline state
  const [pipelineData, setPipelineData] = useState(null);
  const [loadingPipeline, setLoadingPipeline] = useState(false);

  const fetchPipelineInfo = () => {
    setLoadingPipeline(true);
    api.get("/api/officer/pipeline")
      .then(res => {
        const queue = res.data?.data || [];
        const matched = queue.find(item => item.id === parseInt(id));
        if (matched) {
          setPipelineData(matched);
        }
      })
      .catch(err => console.error("Error loading pipeline data:", err))
      .finally(() => setLoadingPipeline(false));
  };

  const recalculatePipeline = () => {
    setLoadingPipeline(true);
    api.post(`/api/officer/pipeline/recalculate/${id}`)
      .then(() => {
        fetchPipelineInfo();
        fetchData();
      })
      .catch(err => alert("Lỗi khi tính toán lại: " + err.message))
      .finally(() => setLoadingPipeline(false));
  };

  const fetchData = () => {
    api.get(`/api/officer/applications/${id}`)
      .then(r => {
        if (r.data) {
          const data = r.data;
          setApp(data);
          const documentList = data.documents?.length > 0 ? data.documents : MOCK_DOCS;
          setDocs(documentList);
          
          if (selectedDoc) {
            const updatedSelected = documentList.find(d => d.filePath === selectedDoc.filePath);
            if (updatedSelected) setSelectedDoc(updatedSelected);
          } else {
            const firstValid = documentList.find(d => d.filePath);
            if (firstValid) setSelectedDoc(firstValid);
          }
          
          if (data.officerNotes) setNotes(data.officerNotes);
          if (data.rejectionReason) setRejectionReason(data.rejectionReason);
          // Auto calculate from GPA
          const bg = data.academicBackground;
          if (bg) {
            const gpaTotal = ((parseFloat(bg.gpa10) || 0) + (parseFloat(bg.gpa11) || 0) + (parseFloat(bg.gpa12) || 0)).toFixed(2);
            setScore(gpaTotal);
          } else if (data.totalScore !== null && data.totalScore !== undefined) {
            setScore(data.totalScore);
          }
          if (data.status) setDecision(statusLabelMap[data.status] || "Duyệt");
        }
      })
      .catch(err => console.error("Lỗi khi tải chi tiết hồ sơ:", err))
      .finally(() => setLoadingApp(false));
  };

  useEffect(() => {
    setLoadingApp(true);
    fetchData();
    fetchPipelineInfo();
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
      // Recalculate pipeline for this application as it was edited
      await api.post(`/api/officer/pipeline/recalculate/${id}`);
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
      ENROLLED: { bg: "#EDE9FE", color: "#5B21B6" },
      SUBMITTED: { bg: "#EFF6FF", color: "#2563EB" },
      default: { bg: "#EFF6FF", color: "#2563EB" }
    };
    return styles[status] || styles.default;
  };

  const getStatusLabel = (status) => {
    const labels = {
      APPROVED: "Đã duyệt", REJECTED: "Từ chối",
      UNDER_REVIEW: "Yêu cầu bổ sung", SUBMITTED: "Chờ xét duyệt",
      ENROLLED: "Nhập học"
    };
    return labels[status] || status;
  };

  const getRecommendationStyle = (rec) => {
    if (rec === "READY_FOR_APPROVAL") return { bg: "#D1FAE5", color: "#065F46", text: "Khuyên Duyệt" };
    if (rec === "NEED_MORE_DOCUMENT") return { bg: "#FEF3C7", color: "#92400E", text: "Yêu Cầu Bổ Sung" };
    if (rec === "REJECT_RECOMMENDED") return { bg: "#FEE2E2", color: "#991B1B", text: "Khuyên Từ Chối" };
    return { bg: "#E0F2FE", color: "#0369A1", text: "Cần Thẩm Định" };
  };

  if (loadingApp || !app) return <LoadingSpinner message="Đang tải dữ liệu hồ sơ thí sinh..." />;

  const statusStyle = getStatusStyle(app.status);
  const recStyle = pipelineData ? getRecommendationStyle(pipelineData.aiRecommendation) : null;

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
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {pipelineData && (
            <span style={{ 
              background: pipelineData.riskLevel === "High" ? "#FEE2E2" : pipelineData.riskLevel === "Medium" ? "#FEF3C7" : "#DCFCE7",
              color: pipelineData.riskLevel === "High" ? "#B91C1C" : pipelineData.riskLevel === "Medium" ? "#A16207" : "#15803D",
              padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700
            }}>
              Mức độ rủi ro: {pipelineData.riskLevel === "High" ? "Cao ⚠" : pipelineData.riskLevel === "Medium" ? "Trung bình ⚠" : "Thấp ✓"}
            </span>
          )}
          <div style={{ padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, background: statusStyle.bg, color: statusStyle.color }}>
            Trạng thái hiện tại: {getStatusLabel(app.status)}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <DocumentViewer app={app} activeTab={activeTab} setActiveTab={setActiveTab}
            selectedDoc={selectedDoc} setSelectedDoc={setSelectedDoc} docs={docs} />
          <StudentProfileCard app={app} />
          <AttachedDocuments docs={docs} selectedDoc={selectedDoc} handleSelectDoc={handleSelectDoc} onRefresh={fetchData} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Smart Review Pipeline Assistant Widget */}
          <div style={{
            background: "white", borderRadius: 16, border: "1px solid #E2E8F0",
            boxShadow: "0 4px 15px rgba(0,0,0,0.05)", overflow: "hidden", display: "flex",
            flexDirection: "column"
          }}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
              padding: "16px 20px", borderBottom: "1px solid #FFEDD5",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sparkles size={18} color="#FF6B35" />
                <span style={{ fontWeight: 800, fontSize: 14, color: "#7C2D12" }}>TRỢ LÝ REVIEW THÔNG MINH</span>
              </div>
              <button 
                onClick={recalculatePipeline}
                disabled={loadingPipeline}
                style={{
                  background: "white", border: "1px solid #FFE0B2", borderRadius: 6,
                  padding: "4px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4
                }}
              >
                <RefreshCw size={12} className={loadingPipeline ? "animate-spin" : ""} color="#FF6B35" />
              </button>
            </div>

            {/* Content */}
            {pipelineData ? (
              <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                
                {/* AI Recommendation Box */}
                <div style={{
                  background: recStyle.bg, color: recStyle.color,
                  padding: 14, borderRadius: 12, border: `1px solid ${recStyle.color}20`
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>Đề xuất từ Rule Engine</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontWeight: 800, fontSize: 18 }}>{recStyle.text}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, background: "rgba(255,255,255,0.6)", padding: "2px 8px", borderRadius: 99 }}>
                      Tin cậy: {pipelineData.aiConfidence}%
                    </span>
                  </div>
                </div>

                {/* Priority Score Component */}
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>Điểm số ưu tiên</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#FF6B35" }}>
                      {pipelineData.priorityScore}/100
                    </span>
                  </div>
                  <div style={{ height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${pipelineData.priorityScore}%`, height: "100%", background: "#FF6B35", borderRadius: 99 }} />
                  </div>
                </div>

                {/* Validation Checklist */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>KẾT QUẢ THẨM ĐỊNH TỰ ĐỘNG</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                    
                    {/* Checklist bullets */}
                    {pipelineData.aiSummaryText.split("\n").map((line, idx) => {
                      const isOk = line.startsWith("✔");
                      const isWarn = line.startsWith("⚠");
                      const isErr = line.startsWith("✖");

                      let icon = <CheckCircle size={14} color="#10B981" />;
                      if (isWarn) icon = <AlertTriangle size={14} color="#F59E0B" />;
                      if (isErr) icon = <XCircle size={14} color="#EF4444" />;

                      // Strip prefix char
                      const cleanText = line.substring(1).trim();

                      return (
                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ marginTop: 2, flexShrink: 0 }}>{icon}</div>
                          <span style={{ 
                            color: isErr ? "#EF4444" : isWarn ? "#D97706" : "#1E293B",
                            fontWeight: isErr || isWarn ? 600 : 500
                          }}>
                            {cleanText}
                          </span>
                        </div>
                      );
                    })}

                  </div>
                </div>

                {/* Quick decision tip */}
                {pipelineData.riskLevel === "High" && (
                  <div style={{ 
                    background: "#FEF2F2", color: "#991B1B", padding: "10px 12px", 
                    borderRadius: 8, fontSize: 12, border: "1px solid #FEE2E2",
                    display: "flex", gap: 6, alignItems: "flex-start"
                  }}>
                    <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <strong>Cảnh báo:</strong> Phát hiện hồ sơ trùng lặp thông tin hoặc lỗi định dạng. Bắt buộc kiểm tra chi tiết học bạ/CCCD trước khi phê duyệt.
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div style={{ padding: 20, textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
                Đang nạp phân tích thông minh...
              </div>
            )}
          </div>

          {app.status === "APPROVED" || app.status === "REJECTED" || app.status === "ENROLLED" ? (
            <div style={{
              background: "white", borderRadius: 16, padding: 24,
              border: "1px solid #E2E8F0", boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
            }}>
              <h3 style={{ margin: "0 0 18px", fontWeight: 800, fontSize: 16, color: "#0F172A" }}>Thông Tin Đánh Giá</h3>
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Kết quả xét duyệt:</span>
                <span style={{
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 700,
                  backgroundColor: getStatusStyle(app.status).bg,
                  color: getStatusStyle(app.status).color
                }}>
                  {getStatusLabel(app.status)}
                </span>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Tổng điểm GPA đã duyệt:</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                  {app.totalScore != null ? `${app.totalScore}/100` : "Chưa chấm"}
                </span>
              </div>

              {app.officerNotes && (
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Ghi chú / Nhận xét:</span>
                  <div style={{ padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 13, color: "#334155", background: "#F8FAFC", whiteSpace: "pre-wrap" }}>
                    {app.officerNotes}
                  </div>
                </div>
              )}

              {app.rejectionReason && (
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Lý do từ chối:</span>
                  <div style={{ padding: "10px 14px", border: "1px solid #FEE2E2", borderRadius: 10, fontSize: 13, color: "#991B1B", background: "#FEF2F2", whiteSpace: "pre-wrap" }}>
                    {app.rejectionReason}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <EvaluationPanel
                score={score} setScore={setScore} notes={notes} setNotes={setNotes}
                rejectionReason={rejectionReason} setRejectionReason={setRejectionReason}
                decision={decision} setDecision={setDecision} onSave={handleSave} loading={loading} app={app} />
              <QuickActions onAction={handleQuickAction} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
