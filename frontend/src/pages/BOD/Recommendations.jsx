import { useState, useEffect } from "react";
import { TrendingUp, BarChart2, CheckCircle, Send, Brain, Settings, Sliders, History, RefreshCw, Sparkles } from "lucide-react";
import api from "../../config/axiosConfig";

// Recommendation detail page matching image 4
export default function BodRecommendations() {
  const [message, setMessage] = useState("");
  const [aiQuota, setAiQuota] = useState(500);
  const [recs, setRecs] = useState([]);
  const [selectedRecId, setSelectedRecId] = useState(null);

  // AI Model parameters
  const [modelConfig, setModelConfig] = useState({
    quotaThresholdWeight: 1.0,
    regionThresholdWeight: 1.0,
    conversionThresholdWeight: 1.0,
    processOptWeight: 1.0,
    learningRate: 0.05,
    trainingEpochs: 10,
    modelAccuracy: 0.92,
    lastTrainedAt: null,
    totalRuns: 1
  });
  const [modelStats, setModelStats] = useState({
    approved: 0,
    rejected: 0,
    adjusted: 0,
    pending: 0
  });
  const [forecast, setForecast] = useState(null);
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainStep, setRetrainStep] = useState(0);
  const [showConfig, setShowConfig] = useState(false);

  const retrainStepsTexts = [
    "Đang phân tích phản hồi & lịch sử phê duyệt của Hội đồng Tuyển sinh...",
    "Đang cập nhật trọng số liên kết (Reinforcement Learning Feedback loop)...",
    "Đang truy xuất dữ liệu tuyển sinh thực tế từ cơ sở dữ liệu...",
    "Đang tinh chỉnh ngưỡng quyết định thuật toán...",
    "Hoàn tất! Đã lưu trọng số mới và cập nhật danh sách đề xuất."
  ];

  const [boardMessages, setBoardMessages] = useState([
    {
      name: "TS. Nguyễn Văn A",
      time: "10:12 AM",
      text: "Tôi lo ngại về đội ngũ giảng viên. Chúng ta đã có kế hoạch thu hút chuyên gia AI từ nước ngoài chưa?",
      initials: "A",
      color: "#1D4ED8",
    },
    {
      name: "Ths. Lê Thị B",
      time: "10:17 AM",
      text: "Mức đầu tư 12 tỷ cho Infrastructure là hợp lý. Tôi có thể tận dụng hạ tầng Cloud của FPT Smart Cloud để tiết kiệm chi phí.",
      initials: "B",
      color: "#16A34A",
    },
  ]);

  const loadRecommendations = () => {
    api.get("/api/manager/recommendations/ai-quota")
      .then(r => {
        if (r.data && r.data.quota !== undefined) {
          setAiQuota(r.data.quota);
        }
      })
      .catch(err => console.error("Lỗi khi lấy chỉ tiêu AI:", err));

    api.get("/api/manager/recommendations")
      .then(r => {
        if (Array.isArray(r.data)) {
          setRecs(r.data);
          if (r.data.length > 0) {
            // Find pending or first
            const pending = r.data.find(rec => rec.status === "PENDING") || r.data[0];
            setSelectedRecId(pending.id);
          }
        }
      })
      .catch(err => console.error("Lỗi khi lấy danh sách khuyến nghị:", err));
  };

  const loadModelConfig = () => {
    api.get("/api/manager/recommendations/model-config")
      .then(r => {
        if (r.data) {
          if (r.data.config) setModelConfig(r.data.config);
          if (r.data.stats) setModelStats(r.data.stats);
          if (r.data.forecast) setForecast(r.data.forecast);
        }
      })
      .catch(err => console.error("Lỗi lấy cấu hình mô hình:", err));
  };

  useEffect(() => {
    loadRecommendations();
    loadModelConfig();
  }, []);

  const handleRetrain = async () => {
    setIsRetraining(true);
    setRetrainStep(0);

    // Simulate frontend UI step progression
    for (let i = 0; i < 5; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setRetrainStep(prev => prev + 1);
    }

    try {
      const res = await api.post("/api/manager/recommendations/retrain");
      alert(res.data.message || "Đào tạo lại mô hình thành công!");
      loadRecommendations();
      loadModelConfig();
    } catch (err) {
      alert("Lỗi khi đào tạo lại mô hình: " + (err.response?.data?.message || err.message));
    } finally {
      setIsRetraining(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      await api.post("/api/manager/recommendations/model-config", modelConfig);
      alert("Đã lưu cấu hình tham số mô hình thành công!");
      loadModelConfig();
    } catch (err) {
      alert("Lỗi khi lưu tham số: " + err.message);
    }
  };

  const handleAction = async (actionType) => {
    if (!selectedRecId) return;

    try {
      const res = await api.post(`/api/manager/recommendations/${selectedRecId}/action`, { action: actionType });
      alert(res.data.message || "Đã cập nhật trạng thái đề xuất thành công!");
      loadRecommendations();
      loadModelConfig();
    } catch (err) {
      alert("Lỗi khi gửi yêu cầu hành động: " + (err.response?.data?.message || err.message));
    }
  };

  const handleApprove = () => handleAction("APPROVE");
  const handleReject = () => handleAction("REJECT");
  const handleAdjust = () => handleAction("ADJUST");

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const newMessage = {
      name: "Ban Giám Hiệu (BOD)",
      time: timeStr,
      text: message,
      initials: "BOD",
      color: "#FF6B35",
    };
    setBoardMessages([...boardMessages, newMessage]);
    setMessage("");
  };

  const currentRec = recs.find(r => r.id === selectedRecId) || {
    title: "Phê duyệt tăng chỉ tiêu AI 2026",
    description: "Hiện tại, nguồn cung nhân lực AI tại Việt Nam đang thiếu nghiêm trọng. Với tốc độ phát triển của hệ sinh thái FPT, nhu cầu tuyển dụng kỹ sư AI dự kiến tăng gấp 3 lần trong giai đoạn 2025-2028. Các đối thủ cạnh tranh đang mở rộng quy mô đào tạo nhanh chóng.",
    impact: "Tăng quy mô đào tạo lên 1,500 sinh viên ngành AI, tăng doanh thu dự kiến ~5.6 tỷ VNĐ/năm.",
    actionPlan: "Nâng chỉ tiêu tuyển sinh ngành AI lên 1,500 sinh viên/năm. Đào tạo liên kết quốc tế và tối ưu phòng thí nghiệm GPU chuyên sâu.",
    status: "PENDING"
  };

  const feasData = forecast ? [
    { label: "NHU CẦU NHÂN LỰC AI", value: `${forecast.aiWorkforceDemand || 45}%`, sub: "Tỷ lệ hồ sơ/Chỉ tiêu", desc: "Hồ sơ AI", descValue: `${forecast.aiApplications || 0}`, color: "#1D4ED8", barPct: Math.min(forecast.aiWorkforceDemand || 45, 100) },
    { label: "TỔNG HỒ SƠ QUAN TÂM", value: `${(forecast.applicationInterest || 12.5).toLocaleString()}`, sub: "Quy đổi", desc: "Tổng hồ sơ", descValue: `${forecast.totalApplications || 0}`, color: "#16A34A", barPct: Math.min(100, Math.round(((forecast.applicationInterest || 12.5) / 150) * 100)) },
    { label: "CÔNG SUẤT CƠ HẠ TẦNG", value: `${forecast.infrastructureCapacity || 85}%`, sub: "Đã tối ưu", desc: forecast.infrastructureCapacity > 80 ? "Cần bổ sung thêm phòng Lab GPU để đáp ứng quy mô 2026." : "Hạ tầng hiện tại đáp ứng tốt nhu cầu tuyển sinh.", color: "#D97706", barPct: forecast.infrastructureCapacity || 85 },
  ] : [
    { label: "NHU CẦU NHÂN LỰC AI", value: "+45%", sub: "Hàng năm", desc: "Tỷ lệ chọi", descValue: "1:8.4", color: "#1D4ED8", barPct: 65 },
    { label: "TỶ LỆ HỒ SƠ QUAN TÂM", value: "12.5k", sub: "Đăng ký/Năm", desc: "Tỷ lệ chọi", descValue: "1:8.4", color: "#16A34A", barPct: 80 },
    { label: "CÔNG SUẤT CƠ HẠ TẦNG", value: "85%", sub: "Đã tối ưu", desc: "Cần bổ sung 3 phòng Lab GPU thế hệ mới để đáp ứng quy mô 2026.", color: "#D97706", barPct: 85 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header: Selector + Model Status + Config toggle */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, background: "white", padding: "16px 20px", borderRadius: 12, border: "1px solid #E2E8F0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 280 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#475569", whiteSpace: "nowrap" }}>Chọn Kịch bản / Đề xuất cần duyệt:</span>
          <select
            value={selectedRecId || ""}
            onChange={e => setSelectedRecId(Number(e.target.value))}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 600, color: "#1E293B", flex: 1, outline: "none" }}
          >
            {recs.map(r => (
              <option key={r.id} value={r.id}>
                [{r.status}] {r.title} ({r.category === "AI_QUOTA" ? "Chỉ tiêu AI" : r.category === "REGION_MID" ? "Miền Trung" : r.category === "CONVERSION_RATE" ? "Chuyển đổi" : "Quy trình"})
              </option>
            ))}
          </select>
        </div>

        {/* Model Accuracy indicator + Config toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F8FAFC", padding: "6px 14px", borderRadius: 8, border: "1px solid #E2E8F0" }}>
          <Brain size={14} color="#FF6B35" />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "#475569" }}>
            Độ chính xác AI: <span style={{ color: "#16A34A" }}>R² = {modelConfig.modelAccuracy || "0.92"}</span>
          </span>
          <button
            onClick={() => setShowConfig(!showConfig)}
            style={{
              background: showConfig ? "#1D4ED8" : "#FF6B35", border: "none", borderRadius: 6, padding: "4px 10px",
              color: "white", fontWeight: 700, fontSize: 10.5, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4
            }}>
            <Settings size={11} /> {showConfig ? "Ẩn cấu hình" : "Cấu hình & Retrain"}
          </button>
        </div>
      </div>

      {/* ── COLLAPSIBLE AI TRAINING CONFIG PANEL ── */}
      {showConfig && (
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          display: "flex",
          flexDirection: "column",
          gap: 20
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9", paddingBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Brain size={18} color="#FF6B35" />
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#1E293B" }}>
                Bảng điều khiển Học máy & Tham số Quyết định (Decision Engine)
              </h4>
            </div>
            <div style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>
              Lần cuối đào tạo: <span style={{ fontWeight: 700, color: "#0F172A" }}>
                {modelConfig.lastTrainedAt ? new Date(modelConfig.lastTrainedAt).toLocaleString("vi-VN") : "Chưa khả dụng"}
              </span> | Tổng số lần: <span style={{ fontWeight: 700, color: "#0F172A" }}>{modelConfig.totalRuns || 0}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.8fr 1.2fr", gap: 24 }}>
            {/* Sliders column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: 4 }}>
                <Sliders size={13} /> TRỌNG SỐ THAM CHIẾU CÁC QUY LUẬT ĐỀ XUẤT (AI BIASES)
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11.5, color: "#475569", fontWeight: 600 }}>1. Trọng số chỉ tiêu AI</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#2563EB" }}>x{modelConfig.quotaThresholdWeight || 1.0}</span>
                  </div>
                  <input
                    type="range" min="0.2" max="3.0" step="0.1"
                    value={modelConfig.quotaThresholdWeight || 1.0}
                    onChange={e => setModelConfig({ ...modelConfig, quotaThresholdWeight: parseFloat(e.target.value) })}
                    style={{ width: "100%", accentColor: "#2563EB" }}
                  />
                  <div style={{ fontSize: 9.5, color: "#94A3B8", marginTop: 2 }}>Ảnh hưởng độ nhạy đề xuất tăng chỉ tiêu ngành AI</div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11.5, color: "#475569", fontWeight: 600 }}>2. Trọng số vùng Miền Trung</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#16A34A" }}>x{modelConfig.regionThresholdWeight || 1.0}</span>
                  </div>
                  <input
                    type="range" min="0.2" max="3.0" step="0.1"
                    value={modelConfig.regionThresholdWeight || 1.0}
                    onChange={e => setModelConfig({ ...modelConfig, regionThresholdWeight: parseFloat(e.target.value) })}
                    style={{ width: "100%", accentColor: "#16A34A" }}
                  />
                  <div style={{ fontSize: 9.5, color: "#94A3B8", marginTop: 2 }}>Tác động mức đề xuất mở rộng marketing Miền Trung</div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11.5, color: "#475569", fontWeight: 600 }}>3. Trọng số Tỷ lệ chuyển đổi</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#7C3AED" }}>x{modelConfig.conversionThresholdWeight || 1.0}</span>
                  </div>
                  <input
                    type="range" min="0.2" max="3.0" step="0.1"
                    value={modelConfig.conversionThresholdWeight || 1.0}
                    onChange={e => setModelConfig({ ...modelConfig, conversionThresholdWeight: parseFloat(e.target.value) })}
                    style={{ width: "100%", accentColor: "#7C3AED" }}
                  />
                  <div style={{ fontSize: 9.5, color: "#94A3B8", marginTop: 2 }}>Ngưỡng cảnh báo và đề xuất tỷ lệ chuyển đổi nhập học</div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11.5, color: "#475569", fontWeight: 600 }}>4. Trọng số tối ưu quy trình</span>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#D97706" }}>x{modelConfig.processOptWeight || 1.0}</span>
                  </div>
                  <input
                    type="range" min="0.2" max="3.0" step="0.1"
                    value={modelConfig.processOptWeight || 1.0}
                    onChange={e => setModelConfig({ ...modelConfig, processOptWeight: parseFloat(e.target.value) })}
                    style={{ width: "100%", accentColor: "#D97706" }}
                  />
                  <div style={{ fontSize: 9.5, color: "#94A3B8", marginTop: 2 }}>Độ nhạy trong đề xuất giảm thời gian duyệt học bạ</div>
                </div>
              </div>

              {/* Advanced config */}
              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 14, display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Tốc độ học (Learning Rate)</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0F172A" }}>{modelConfig.learningRate || 0.05}</span>
                  </div>
                  <input
                    type="range" min="0.01" max="0.30" step="0.01"
                    value={modelConfig.learningRate || 0.05}
                    onChange={e => setModelConfig({ ...modelConfig, learningRate: parseFloat(e.target.value) })}
                    style={{ width: "100%", accentColor: "#475569" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Epochs huấn luyện</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0F172A" }}>{modelConfig.trainingEpochs || 10} vòng</span>
                  </div>
                  <input
                    type="range" min="5" max="100" step="5"
                    value={modelConfig.trainingEpochs || 10}
                    onChange={e => setModelConfig({ ...modelConfig, trainingEpochs: parseInt(e.target.value) })}
                    style={{ width: "100%", accentColor: "#475569" }}
                  />
                </div>
              </div>
            </div>

            {/* Reinforcement learning metrics column */}
            <div style={{
              background: "#F8FAFC",
              borderRadius: 12,
              padding: 16,
              border: "1px solid #E2E8F0",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: 5, marginBottom: 10 }}>
                  <History size={13} /> PHẢN HỒI QUYẾT ĐỊNH BOD (LEARNED)
                </div>
                <p style={{ margin: "0 0 12px", fontSize: 11, color: "#64748B", lineHeight: 1.4 }}>
                  Mô hình tự động cập nhật trọng số (Reinforcement Learning) dựa trên kết quả phê duyệt của BOD đối với các đề xuất trước:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                    <span style={{ color: "#16A34A", fontWeight: 600 }}>✓ Đã phê duyệt (Reinforce +):</span>
                    <span style={{ fontWeight: 800 }}>{modelStats.approved || 0}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                    <span style={{ color: "#DC2626", fontWeight: 600 }}>✕ Đã từ chối (Reinforce -):</span>
                    <span style={{ fontWeight: 800 }}>{modelStats.rejected || 0}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                    <span style={{ color: "#1D4ED8", fontWeight: 600 }}>ℹ Yêu cầu điều chỉnh (Correction):</span>
                    <span style={{ fontWeight: 800 }}>{modelStats.adjusted || 0}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5 }}>
                    <span style={{ color: "#64748B", fontWeight: 600 }}>☉ Đang chờ phê duyệt:</span>
                    <span style={{ fontWeight: 800 }}>{modelStats.pending || 0}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button
                  onClick={handleSaveConfig}
                  style={{
                    flex: 1,
                    background: "white",
                    border: "1px solid #CBD5E1",
                    borderRadius: 8,
                    padding: "7px 0",
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "#475569",
                    cursor: "pointer"
                  }}
                >
                  Lưu tham số
                </button>
                <button
                  onClick={handleRetrain}
                  disabled={isRetraining}
                  style={{
                    flex: 1.5,
                    background: "#FF6B35",
                    border: "none",
                    borderRadius: 8,
                    padding: "7px 0",
                    fontSize: 11.5,
                    fontWeight: 800,
                    color: "white",
                    cursor: isRetraining ? "not-allowed" : "pointer",
                    boxShadow: "0 2px 6px rgba(255,107,53,0.25)"
                  }}
                >
                  {isRetraining ? "Đang huấn luyện..." : "Đào tạo lại AI"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb + Title */}
      <div>
        <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }}>
          <span style={{ color: "#64748B" }}>Chiến lược</span>
          <span style={{ margin: "0 6px" }}>›</span>
          <span style={{ color: "#FF6B35", fontWeight: 600 }}>Duyệt kịch bản tuyển sinh 2026</span>
        </div>
        <h1 style={{ margin: "0 0 4px", fontWeight: 800, fontSize: 22, color: "#0F172A" }}>
          {currentRec.title}
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          {currentRec.status === "PENDING" && (
            <>
              <span style={{ fontSize: 11, fontWeight: 700, background: "#FEE2E2", color: "#DC2626", padding: "3px 9px", borderRadius: 5, border: "1px solid #FCA5A5" }}>
                ✕ Cần quyết định
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, background: "#FFF7ED", color: "#D97706", padding: "3px 9px", borderRadius: 5, border: "1px solid #FCD34D" }}>
                ❗ Mức độ: Cao
              </span>
            </>
          )}
          {currentRec.status === "APPROVED" && (
            <span style={{ fontSize: 11, fontWeight: 700, background: "#DCFCE7", color: "#16A34A", padding: "3px 9px", borderRadius: 5, border: "1px solid #86EFAC" }}>
              ✓ Đã phê duyệt kịch bản
            </span>
          )}
          {currentRec.status === "REJECTED" && (
            <span style={{ fontSize: 11, fontWeight: 700, background: "#FEE2E2", color: "#DC2626", padding: "3px 9px", borderRadius: 5, border: "1px solid #FCA5A5" }}>
              ✕ Đã từ chối
            </span>
          )}
          {currentRec.status === "ADJUST_REQUESTED" && (
            <span style={{ fontSize: 11, fontWeight: 700, background: "#EFF6FF", color: "#1D4ED8", padding: "3px 9px", borderRadius: 5, border: "1px solid #93C5FD" }}>
              ℹ Đang yêu cầu điều chỉnh
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleAdjust}
            disabled={currentRec.status !== "PENDING"}
            style={{
              padding: "9px 18px",
              background: currentRec.status === "ADJUST_REQUESTED" ? "#EFF6FF" : "white",
              border: "1px solid #E2E8F0",
              borderRadius: 9,
              color: currentRec.status === "ADJUST_REQUESTED" ? "#1D4ED8" : "#475569",
              fontWeight: 600,
              fontSize: 13,
              cursor: currentRec.status === "PENDING" ? "pointer" : "not-allowed",
              opacity: currentRec.status !== "PENDING" && currentRec.status !== "ADJUST_REQUESTED" ? 0.5 : 1
            }}>
            Yêu cầu điều chỉnh
          </button>
          <button
            onClick={handleReject}
            disabled={currentRec.status !== "PENDING"}
            style={{
              padding: "9px 18px",
              background: currentRec.status === "REJECTED" ? "#FEE2E2" : "white",
              border: "1px solid #E2E8F0",
              borderRadius: 9,
              color: "#DC2626",
              fontWeight: 600,
              fontSize: 13,
              cursor: currentRec.status === "PENDING" ? "pointer" : "not-allowed",
              opacity: currentRec.status !== "PENDING" && currentRec.status !== "REJECTED" ? 0.5 : 1
            }}>
            Từ chối
          </button>
          <button
            onClick={handleApprove}
            disabled={currentRec.status !== "PENDING"}
            style={{
              padding: "9px 18px",
              background: currentRec.status === "APPROVED" ? "#10B981" : "#FF6B35",
              border: "none",
              borderRadius: 9,
              color: "white",
              fontWeight: 700,
              fontSize: 13,
              cursor: currentRec.status === "PENDING" ? "pointer" : "not-allowed",
              boxShadow: currentRec.status === "APPROVED" ? "0 2px 8px rgba(16,185,129,0.3)" : "0 2px 8px rgba(255,107,53,0.3)",
              opacity: currentRec.status !== "PENDING" && currentRec.status !== "APPROVED" ? 0.5 : 1
            }}>
            {currentRec.status === "APPROVED" ? "Đã phê duyệt" : "Phê duyệt"}
          </button>
        </div>
      </div>

      {/* Main 3-column grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Tổng quan đề xuất */}
        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <BarChart2 size={15} color="#64748B" />
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#1E293B" }}>Tổng quan đề xuất</h3>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.3px", marginBottom: 5 }}>Vấn đề & Bối cảnh</div>
            <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.7 }}>
              {currentRec.description}
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.3px", marginBottom: 8 }}>Kế hoạch hành động</div>
            <p style={{ margin: 0, fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
              {currentRec.actionPlan}
            </p>
          </div>
        </div>

        {/* AI Forecast */}
        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "2px solid #16A34A", boxShadow: "0 4px 16px rgba(22,163,74,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 32, height: 32, background: "#ECFDF5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={16} color="#16A34A" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#1E293B" }}>Dự báo kịch bản</span>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, background: "#DCFCE7", color: "#16A34A", padding: "3px 8px", borderRadius: 5, letterSpacing: "0.5px" }}>LIVE</span>
          </div>
          <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6, marginBottom: 16 }}>
            Tác động dự kiến về lượng hồ sơ & tài chính:
          </div>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: "#16A34A", lineHeight: 1.6, marginBottom: 8 }}>
            {currentRec.impact}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 16 }}>DỰ BÁO DOANH THU</div>

          {/* Confidence bar */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: "#64748B", fontWeight: 500 }}>Độ tin cậy dự báo</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A" }}>
                {modelConfig.modelAccuracy ? (modelConfig.modelAccuracy * 100).toFixed(1) + "%" : "92.4%"}
              </span>
            </div>
            <div style={{ width: "100%", height: 5, background: "#F1F5F9", borderRadius: 99 }}>
              <div style={{
                width: modelConfig.modelAccuracy ? (modelConfig.modelAccuracy * 100) + "%" : "92.4%",
                height: "100%",
                background: "#16A34A",
                borderRadius: 99
              }} />
            </div>
          </div>

          {/* Live metrics from DB */}
          {forecast && (
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid #F1F5F9", paddingTop: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: "#64748B" }}>Tỷ lệ chuyển đổi</span>
                <span style={{ fontWeight: 700, color: forecast.conversionRate > 70 ? "#16A34A" : "#D97706" }}>{forecast.conversionRate || "—"}%</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: "#64748B" }}>Thời gian duyệt TB</span>
                <span style={{ fontWeight: 700, color: "#1E293B" }}>{forecast.avgReviewDays || "—"} ngày</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11 }}>
                <span style={{ color: "#64748B" }}>Thị phần Miền Trung</span>
                <span style={{ fontWeight: 700, color: forecast.centralShare > 15 ? "#16A34A" : "#DC2626" }}>{forecast.centralShare || "—"}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Risk assessment */}
        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "2px solid #FF6B35", boxShadow: "0 4px 16px rgba(255,107,53,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 32, height: 32, background: "#FFF7ED", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 13, color: "#1E293B" }}>Đánh giá rủi ro & Thách thức</span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, background: forecast && forecast.riskScore > 50 ? "#FEE2E2" : "#FFF7ED", color: forecast && forecast.riskScore > 50 ? "#DC2626" : "#D97706", padding: "3px 8px", borderRadius: 5 }}>
              {forecast && forecast.riskScore > 50 ? "Cao" : "Trung bình"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {forecast && forecast.conversionRate < 70 ? (
              <div style={{ padding: "10px 12px", background: "#FFF7ED", borderRadius: 9, borderLeft: "3px solid #FF6B35" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#D97706", marginBottom: 4 }}>Tỷ lệ chuyển đổi thấp</div>
                <div style={{ fontSize: 11, color: "#92400E", lineHeight: 1.5 }}>Giải pháp: Tăng cường tư vấn hậu trúng tuyển qua hotline và email cá nhân hóa.</div>
              </div>
            ) : (
              <div style={{ padding: "10px 12px", background: "#ECFDF5", borderRadius: 9, borderLeft: "3px solid #16A34A" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#16A34A", marginBottom: 4 }}>Thiếu hụt giảng viên chuyên môn</div>
                <div style={{ fontSize: 11, color: "#065F46", lineHeight: 1.5 }}>Giải pháp: Hợp tác với chuyên gia AI nước ngoài và đào tạo nội bộ cấp tốc.</div>
              </div>
            )}
            <div style={{ padding: "10px 12px", background: forecast && forecast.centralShare < 15 ? "#FFF7ED" : "#F0FDF4", borderRadius: 9, borderLeft: `3px solid ${forecast && forecast.centralShare < 15 ? "#FF6B35" : "#16A34A"}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: forecast && forecast.centralShare < 15 ? "#D97706" : "#16A34A", marginBottom: 4 }}>{forecast && forecast.centralShare < 15 ? "Biến động thị trường Miền Trung" : "Cơ hội mở rộng thị trường"}</div>
              <div style={{ fontSize: 11, color: "#92400E", lineHeight: 1.5 }}>
                {forecast && forecast.centralShare < 15
                  ? "Giải pháp: Đẩy mạnh chiến dịch marketing và học bổng địa phương tại khu vực Miền Trung."
                  : "Thị phần Miền Trung đang tăng trưởng, tiếp tục duy trì chiến dịch tuyển sinh hiện tại."}
              </div>
            </div>
          </div>

          {/* Risk score */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: "#64748B" }}>Chỉ số rủi ro tổng hợp</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: forecast && forecast.riskScore > 50 ? "#DC2626" : "#D97706" }}>{forecast ? forecast.riskScore + "%" : "45%"}</span>
            </div>
            <div style={{ width: "100%", height: 5, background: "#F1F5F9", borderRadius: 99 }}>
              <div style={{
                width: (forecast ? forecast.riskScore : 45) + "%",
                height: "100%",
                background: "linear-gradient(90deg, #FF6B35, #D97706)",
                borderRadius: 99
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Evidence + roadmap */}
      <div style={{ background: "white", borderRadius: 14, padding: 22, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <BarChart2 size={15} color="#64748B" />
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1E293B" }}>Chứng minh tính khả thi</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {feasData.map((stat, i) => (
            <div key={i} style={{ padding: "14px 0", borderRight: i < 2 ? "1px solid #F1F5F9" : "none", paddingRight: i < 2 ? 20 : 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.4px", marginBottom: 6 }}>{stat.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: stat.color }}>{stat.value}</span>
                <span style={{ fontSize: 11, color: "#64748B", display: "flex", alignItems: "center", gap: 3 }}>
                  {i === 0 && <TrendingUp size={11} color={stat.color} />}
                  {i === 1 && <CheckCircle size={11} color={stat.color} />}
                  {stat.sub}
                </span>
              </div>
              {i < 2 ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "#64748B" }}>{stat.desc}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: stat.color }}>{stat.descValue}</span>
                  </div>
                  <div style={{ width: "100%", height: 5, background: "#F1F5F9", borderRadius: 99 }}>
                    <div style={{ width: `${stat.barPct}%`, height: "100%", background: stat.color, borderRadius: 99 }} />
                  </div>
                </>
              ) : (
                <p style={{ margin: 0, fontSize: 11, color: "#64748B", lineHeight: 1.6 }}>{stat.desc}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom analytics widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 16 }}>
        <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#64748B", letterSpacing: "0.5px" }}>XU HƯỚNG ĐỘ CHÍNH XÁC</span>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#10B981", margin: "6px 0" }}>
            {modelConfig.totalRuns > 1 ? `+${Math.round((modelConfig.modelAccuracy - 0.92) * 100)}%` : "+2.4%"}
          </div>
          <span style={{ fontSize: 11, color: "#64748B" }}>so với chu kỳ trước</span>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#64748B", letterSpacing: "0.5px" }}>HIỆU SUẤT XỬ LÝ</span>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1E293B", margin: "8px 0" }}>
            {forecast ? `${forecast.avgReviewDays || "—"} ngày/hồ sơ` : "—"}
          </div>
          <span style={{ fontSize: 11, color: forecast && forecast.avgReviewDays && forecast.avgReviewDays < 5 ? "#16A34A" : "#D97706", fontWeight: 600 }}>
            {forecast && forecast.avgReviewDays && forecast.avgReviewDays < 5 ? "✓ Đang trong ngưỡng tối ưu" : "⚠ Cần cải thiện quy trình"}
          </span>
        </div>

        <div style={{
          background: "#0d1b3e", borderRadius: 16, padding: 20, color: "white",
          display: "flex", flexDirection: "column", justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" }}>TỔNG HỢP CHIỀU SÂU</div>
            <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.4, color: "rgba(255,255,255,0.85)" }}>
              {forecast
                ? `Hệ thống đang xử lý ${forecast.totalApplications || 0} hồ sơ với tỷ lệ chuyển đổi ${forecast.conversionRate || "—"}%. Thời gian duyệt TB ${forecast.avgReviewDays || "—"} ngày.`
                : "Các xu hướng hiện tại cho thấy sự chuyển dịch sang sở thích học tập kết hợp ở các ứng viên khối kỹ thuật."}
            </p>
          </div>
          <a href="#" style={{ color: "#FF6B35", fontWeight: 700, fontSize: 12.5, textDecoration: "none", marginTop: 12, display: "inline-block" }}>
            TẠO BÁO CÁO →
          </a>
        </div>
      </div>

      {/* Bottom: Roadmap + Board chat */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Roadmap */}
        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <BarChart2 size={15} color="#64748B" />
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1E293B" }}>Lộ trình triển khai & Nguồn lực</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                phase: 1, title: "Chuẩn bị cơ sở hạ tầng (Q1/2026)",
                desc: "Mua sắm thiết bị GPU, thiết kế lại chương trình AI nâng cao.",
                budget: "Ngân sách dự toán: 12 tỷ VNĐ",
                active: true,
              },
              {
                phase: 2, title: "Truyền thông & Tuyển sinh (Q2/2026)",
                desc: "Chiến dịch FPT Pioneer thu hút học sinh giỏi từ các trường chuyên.",
                budget: "Nhân sự: 15 chuyên viên Marketing",
                active: false,
              },
              {
                phase: 3, title: "Triển khai đào tạo khóa I (Q3/2026)",
                desc: "Chính thức áp dụng chỉ tiêu mới với 1,500 sinh viên.",
                active: false, future: true,
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: item.active ? "#FF6B35" : item.future ? "#F1F5F9" : "#E2E8F0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: item.active ? "white" : "#94A3B8",
                  fontWeight: 700, fontSize: 12
                }}>
                  {item.active ? item.phase : item.phase}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1E293B", marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5, marginBottom: item.budget ? 4 : 0 }}>{item.desc}</div>
                  {item.budget && <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{item.budget}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Board chat */}
        <div style={{ background: "white", borderRadius: 14, padding: 22, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Send size={15} color="#64748B" />
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1E293B" }}>Thảo luận Ban Giám hiệu</h3>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, overflowY: "auto" }}>
            {boardMessages.map((msg, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: msg.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                    {msg.initials}
                  </div>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{msg.name}</span>
                    <span style={{ fontSize: 11, color: "#94A3B8", marginLeft: 8 }}>{msg.time}</span>
                  </div>
                </div>
                <div style={{ marginLeft: 38, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{msg.text}</div>
              </div>
            ))}
          </div>
          {/* Input */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid #F1F5F9", paddingTop: 14 }}>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSendMessage(); }}
              placeholder="Nhập ý kiến của bạn..."
              style={{ flex: 1, border: "1px solid #E2E8F0", borderRadius: 9, padding: "8px 12px", fontSize: 13, outline: "none", color: "#475569" }}
            />
            <button onClick={handleSendMessage} style={{ width: 34, height: 34, background: "#FF6B35", border: "none", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Send size={15} color="white" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Retraining Step Progress Modal ── */}
      {isRetraining && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.7)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            background: "white", borderRadius: 16, maxWidth: 440, width: "100%",
            padding: 28, textAlign: "center", boxShadow: "0 15px 30px rgba(0,0,0,0.25)"
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: "50%", background: "#FFF7ED",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px"
            }}>
              <RefreshCw style={{ animation: "spin 1.5s linear infinite" }} size={24} color="#FF6B35" />
            </div>
            <h4 style={{ margin: "0 0 10px", fontWeight: 800, fontSize: 16, color: "#0F172A" }}>
              Đang huấn luyện lại mô hình...
            </h4>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748B", minHeight: 40, lineHeight: 1.5 }}>
              {retrainStepsTexts[Math.min(retrainStep, 4)]}
            </p>
            <div style={{ width: "100%", height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
              <div style={{
                width: `${(retrainStep + 1) * 20}%`, height: "100%",
                background: "linear-gradient(90deg, #FF6B35, #FF8F6B)", borderRadius: 99,
                transition: "width 0.4s ease-out"
              }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8" }}>
              Tiến trình: {Math.min((retrainStep + 1) * 20, 100)}% hoàn thành
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
