import { useState, useEffect } from "react";
import { TrendingUp, Map, CheckCircle, Clock, Sparkles, FileText, Users, Download, ArrowRight, RefreshCw, BarChart2, Shield, Sliders, Settings, Brain, Info, History } from "lucide-react";
import api from "../../config/axiosConfig";

const SLATE = "#64748B";

const getCategoryIcon = (category) => {
  switch (category) {
    case "AI_QUOTA": return TrendingUp;
    case "REGION_MID": return Map;
    case "CONVERSION_RATE": return CheckCircle;
    case "PROCESS_OPT": return Clock;
    default: return TrendingUp;
  }
};

const getCategoryIconStyle = (category) => {
  switch (category) {
    case "AI_QUOTA": return { bg: "#EFF6FF", color: "#2563EB" };
    case "REGION_MID": return { bg: "#ECFDF5", color: "#16A34A" };
    case "CONVERSION_RATE": return { bg: "#F5F3FF", color: "#7C3AED" };
    case "PROCESS_OPT": return { bg: "#FFF7ED", color: "#D97706" };
    default: return { bg: "#EFF6FF", color: "#2563EB" };
  }
};

const getPriorityStyle = (priority) => {
  if (priority === "HIGH") {
    return { label: "ƯU TIÊN CAO", bg: "#FEE2E2", color: "#EF4444" };
  } else if (priority === "MEDIUM") {
    return { label: "ƯU TIÊN TRUNG BÌNH", bg: "#FFF7ED", color: "#C2410C" };
  } else {
    return { label: "ƯU TIÊN THẤP", bg: "#ECFDF5", color: "#047857" };
  }
};

export default function ManagerRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  
  // New state variables for training model dashboard
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

  const loadRecommendations = () => {
    api.get("/api/manager/recommendations")
      .then(r => {
        if (Array.isArray(r.data)) {
          setRecommendations(r.data);
        }
      })
      .catch(err => console.error("Lỗi lấy danh sách khuyến nghị:", err));
  };

  const loadModelConfig = () => {
    api.get("/api/manager/recommendations/model-config")
      .then(r => {
        if (r.data) {
          if (r.data.config) setModelConfig(r.data.config);
          if (r.data.stats) setModelStats(r.data.stats);
        }
      })
      .catch(err => console.error("Lỗi lấy cấu hình mô hình:", err));
  };

  useEffect(() => {
    loadRecommendations();
    loadModelConfig();
  }, []);

  const handleAction = async (id, actionType) => {
    try {
      const res = await api.post(`/api/manager/recommendations/${id}/action`, { action: actionType });
      alert(res.data.message || "Đã cập nhật đề xuất thành công!");
      loadRecommendations();
      loadModelConfig();
      if (selectedDetail && selectedDetail.id === id) {
        setSelectedDetail({ ...selectedDetail, status: res.data.status || actionType + "ED" });
      }
    } catch (err) {
      alert("Lỗi khi xử lý đề xuất: " + (err.response?.data?.message || err.message));
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

  // Static/Fallback data aligned with Screenshot 3
  const MOCK_RECOMMENDATIONS = [
    {
      id: 1,
      category: "AI_QUOTA",
      priority: "HIGH",
      title: "Tăng chỉ tiêu ngành AI",
      description: "Nhu cầu tăng 35% so với cùng kỳ. Đề xuất tăng 200 chỉ tiêu cho năm 2026 tại cơ sở Hà Nội và TP.HCM.",
      impact: "Tiềm năng doanh thu: ~5.6 tỷ VNĐ",
      status: "APPROVED"
    },
    {
      id: 2,
      category: "REGION_MID",
      priority: "HIGH",
      title: "Mở rộng tuyển sinh khu vực Miền Trung",
      description: "Thị phần miền Trung chỉ 16.5%. Đề xuất tăng cường marketing tại Nghệ An, Huế và Đà Nẵng.",
      impact: "Tiềm năng: +2.000 hồ sơ",
      status: "PENDING"
    },
    {
      id: 3,
      category: "CONVERSION_RATE",
      priority: "MEDIUM",
      title: "Cải thiện tỷ lệ chuyển đổi (Duyệt → Nhập học)",
      description: "Tỷ lệ nhập học hiện tại là 83%. Cần tư vấn chủ động sau khi duyệt hồ sơ.",
      impact: "Tiềm năng: +800 sinh viên nhập học",
      status: "PENDING"
    },
    {
      id: 4,
      category: "PROCESS_OPT",
      priority: "MEDIUM",
      title: "Tối ưu quy trình xét duyệt hồ sơ",
      description: "Giảm thời gian chờ đợi từ 5 ngày xuống còn 48h thông qua tự động hóa xác thực căn cước.",
      impact: "Tăng 15% hiệu suất vận hành",
      status: "PENDING"
    }
  ];

  const displayList = recommendations.length > 0 ? recommendations : MOCK_RECOMMENDATIONS;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* AI Decision Support Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)",
        borderRadius: 16, padding: "24px 28px", color: "white",
        boxShadow: "0 4px 18px rgba(30,64,175,0.25)",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: 18, color: "white" }}>Hệ thống Hỗ trợ Ra quyết định AI</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "6px 0 10px", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
              <span>☉ Đang phân tích 78.500 hồ sơ lịch sử</span>
              <span>•</span>
              <span>⟳ Cập nhật hàng tuần</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.6, maxWidth: 650 }}>
              Hệ thống đã xử lý 78.500 hồ sơ và đề xuất {displayList.length} can thiệp chiến lược để tối ưu chu kỳ tuyển sinh 2026.
            </p>
          </div>
        </div>

        {/* Model stats badges */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "6px 14px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>ĐỘ CHÍNH XÁC MÔ HÌNH</div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#10B981", marginTop: 2 }}>{modelConfig.modelAccuracy ? `R² = ${modelConfig.modelAccuracy}` : "R² = 0.92"}</div>
          </div>
          <button 
            onClick={() => setShowConfig(!showConfig)}
            style={{ 
              background: showConfig ? "rgba(255,255,255,0.2)" : "#FF6B35", 
              border: "none", 
              borderRadius: 10, 
              padding: "8px 14px", 
              color: "white", 
              fontWeight: 700, 
              fontSize: 12, 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 6,
              boxShadow: showConfig ? "none" : "0 2px 8px rgba(255,107,53,0.3)" 
            }}>
            <Settings size={13} /> {showConfig ? "Ẩn cấu hình AI" : "Cấu hình & Retrain"}
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

      {/* Main Section Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #E2E8F0", paddingBottom: 12 }}>
        <h3 style={{ margin: 0, fontWeight: 800, fontSize: 17, color: "#1E293B" }}>
          Đề xuất Chiến lược <span style={{ color: "#EF4444", fontSize: 12, fontWeight: 700, padding: "2px 8px", background: "#FEE2E2", borderRadius: 6, marginLeft: 8 }}>{displayList.length} MỚI</span>
        </h3>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{
            background: "white", border: "1px solid #CBD5E1", borderRadius: 8,
            padding: "6px 12px", fontSize: 12.5, fontWeight: 600, color: "#334155", cursor: "pointer"
          }}>
            Mức ưu tiên
          </button>
          <button style={{
            background: "white", border: "1px solid #CBD5E1", borderRadius: 8,
            padding: "6px 12px", fontSize: 12.5, fontWeight: 600, color: "#334155", cursor: "pointer"
          }}>
            Xuất PDF
          </button>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {displayList.map((rec) => {
          const Icon = getCategoryIcon(rec.category);
          const iStyle = getCategoryIconStyle(rec.category);
          const pStyle = getPriorityStyle(rec.priority);

          return (
            <div key={rec.id} style={{
              background: "white", borderRadius: 16, border: "1px solid #E8EDF5", padding: "20px 24px",
              boxShadow: "0 1px 6px rgba(0,0,0,0.03)", display: "flex", gap: 18, alignItems: "flex-start",
              transition: "transform 0.2s"
            }}>
              {/* Category Icon */}
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: iStyle.bg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Icon size={20} color={iStyle.color} />
              </div>

              {/* Central Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <h4 style={{ margin: 0, fontWeight: 700, fontSize: 14.5, color: "#1E293B" }}>{rec.title}</h4>
                  
                  {/* Status Badge */}
                  {rec.status === "APPROVED" && (
                    <span style={{ fontSize: 10, background: "#D1FAE5", color: "#065F46", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                      ✓ ĐÃ PHÊ DUYỆT
                    </span>
                  )}
                  {rec.status === "REJECTED" && (
                    <span style={{ fontSize: 10, background: "#FEE2E2", color: "#991B1B", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                      ✕ ĐÃ TỪ CHỐI
                    </span>
                  )}
                  {rec.status === "ADJUST_REQUESTED" && (
                    <span style={{ fontSize: 10, background: "#EFF6FF", color: "#1D4ED8", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>
                      ℹ ĐANG YÊU CẦU ĐIỀU CHỈNH
                    </span>
                  )}
                </div>
                
                <p style={{ margin: "0 0 10px", fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
                  {rec.description}
                </p>

                {/* Simulated ROI value */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#059669" }}>
                  <span>💵</span>
                  <span>{rec.impact}</span>
                </div>

                {/* Inline Action buttons for PENDING recommendations */}
                {rec.status === "PENDING" && (
                  <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                    <button 
                      onClick={() => handleAction(rec.id, "APPROVE")}
                      style={{
                        background: "#10B981", border: "none", borderRadius: 8,
                        color: "white", padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(16,185,129,0.2)"
                      }}
                    >
                      Phê duyệt
                    </button>
                    <button 
                      onClick={() => handleAction(rec.id, "REJECT")}
                      style={{
                        background: "white", border: "1px solid #EF4444", borderRadius: 8,
                        color: "#EF4444", padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer"
                      }}
                    >
                      Từ chối
                    </button>
                    <button 
                      onClick={() => handleAction(rec.id, "ADJUST")}
                      style={{
                        background: "white", border: "1px solid #3B82F6", borderRadius: 8,
                        color: "#3B82F6", padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer"
                      }}
                    >
                      Yêu cầu điều chỉnh
                    </button>
                  </div>
                )}
              </div>

              {/* Priority & "Xem chi tiết" links on Right */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12, flexShrink: 0 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, background: pStyle.bg, color: pStyle.color,
                  padding: "4px 8px", borderRadius: 5, letterSpacing: "0.3px"
                }}>
                  {pStyle.label}
                </span>
                
                <button 
                  onClick={() => setSelectedDetail(rec)}
                  style={{
                    background: "none", border: "none", color: "#2563EB", fontWeight: 700, fontSize: 12.5,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "2px 0"
                  }}
                >
                  Xem chi tiết →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Row Analytics Widgets (Screenshot 3 footer cards) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 16, marginTop: 10 }}>
        {/* Column 1: Accuracy trend */}
        <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: SLATE, letterSpacing: "0.5px" }}>XU HƯỚNG ĐỘ CHÍNH XÁC</span>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#10B981", margin: "6px 0" }}>+2.4%</div>
          <span style={{ fontSize: 11, color: SLATE }}>so với chu kỳ trước</span>
        </div>

        {/* Column 2: Running simulations */}
        <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: SLATE, letterSpacing: "0.5px" }}>MÔ PHỎNG ĐANG CHẠY</span>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1E293B", margin: "8px 0" }}>Kịch bản A-12</div>
          <span style={{ fontSize: 11, color: "#2563EB", fontWeight: 600 }}>3/4 Đang tối ưu hóa...</span>
        </div>

        {/* Column 3: Deep Insights callout */}
        <div style={{ 
          background: "#0d1b3e", borderRadius: 16, padding: 20, color: "white",
          display: "flex", flexDirection: "column", justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px" }}>TỔNG HỢP CHIỀU SÂU</div>
            <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.4, color: "rgba(255,255,255,0.85)" }}>
              "Các xu hướng hiện tại cho thấy sự chuyển dịch sang sở thích học tập kết hợp ở các ứng viên khối kỹ thuật."
            </p>
          </div>
          <a href="#" style={{ color: "#FF6B35", fontWeight: 700, fontSize: 12.5, textDecoration: "none", marginTop: 12, display: "inline-block" }}>
            TẠO BÁO CÁO →
          </a>
        </div>
      </div>

      {/* Interactive Detail Modal: Avoids BOD page redirect */}
      {selectedDetail && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: "white", borderRadius: 16, maxWidth: 520, width: "100%",
            padding: 26, boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            position: "relative"
          }}>
            <h3 style={{ margin: "0 0 10px", fontWeight: 800, fontSize: 18, color: "#1a2e6e" }}>
              Chi tiết đề xuất: {selectedDetail.title}
            </h3>
            
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <span style={{
                fontSize: 10.5, fontWeight: 700, 
                background: selectedDetail.priority === "HIGH" ? "#FEE2E2" : "#FFF7ED",
                color: selectedDetail.priority === "HIGH" ? "#EF4444" : "#C2410C",
                padding: "3px 8px", borderRadius: 5
              }}>
                MỨC ƯU TIÊN: {selectedDetail.priority === "HIGH" ? "CAO" : "TRUNG BÌNH"}
              </span>
              <span style={{
                fontSize: 10.5, fontWeight: 700,
                background: selectedDetail.status === "APPROVED" ? "#D1FAE5" : selectedDetail.status === "REJECTED" ? "#FEE2E2" : "#FEF3C7",
                color: selectedDetail.status === "APPROVED" ? "#065F46" : selectedDetail.status === "REJECTED" ? "#991B1B" : "#92400E",
                padding: "3px 8px", borderRadius: 5
              }}>
                TRẠNG THÁI: {selectedDetail.status === "APPROVED" ? "ĐÃ PHÊ DUYỆT" : selectedDetail.status === "REJECTED" ? "ĐÃ TỪ CHỐI" : "ĐANG CHỜ"}
              </span>
            </div>

            <div style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6, marginBottom: 16 }}>
              <strong>Mô tả chiến lược:</strong>
              <p style={{ margin: "4px 0 0" }}>{selectedDetail.description}</p>
            </div>

            <div style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6, marginBottom: 16, background: "#ECFDF5", padding: "10px 14px", borderRadius: 10 }}>
              <strong>Tác động dự kiến:</strong>
              <p style={{ margin: "4px 0 0", color: "#047857", fontWeight: 600 }}>{selectedDetail.impact}</p>
            </div>

            {selectedDetail.actionPlan && (
              <div style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6, marginBottom: 20, background: "#EFF6FF", padding: "10px 14px", borderRadius: 10 }}>
                <strong>Kế hoạch hành động cụ thể:</strong>
                <p style={{ margin: "4px 0 0", color: "#1D4ED8" }}>{selectedDetail.actionPlan}</p>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button 
                onClick={() => setSelectedDetail(null)}
                style={{
                  padding: "8px 16px", background: "white", border: "1px solid #CBD5E1",
                  borderRadius: 8, color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer"
                }}>
                Đóng lại
              </button>
              
              {selectedDetail.status === "PENDING" && (
                <>
                  <button 
                    onClick={() => handleAction(selectedDetail.id, "REJECT")}
                    style={{
                      padding: "8px 16px", background: "white", border: "1px solid #EF4444",
                      borderRadius: 8, color: "#EF4444", fontSize: 13, fontWeight: 700, cursor: "pointer"
                    }}>
                    Từ chối
                  </button>
                  <button 
                    onClick={() => handleAction(selectedDetail.id, "APPROVE")}
                    style={{
                      padding: "8px 16px", background: "#10B981", border: "none",
                      borderRadius: 8, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer"
                    }}>
                    Phê duyệt
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

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
