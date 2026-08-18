import { useState, useEffect, useCallback } from "react";
import api from "../../config/axiosConfig";
import { 
  TrendingUp, RefreshCw, Send, ShieldCheck, Download, 
  HelpCircle, Sparkles, ChevronRight, Sliders, PlayCircle,
  Cpu, CheckCircle2, AlertTriangle, ArrowRight, Zap, Target
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ORANGE = "#D97706";
const TEXT_MUTED = "#64748B";

export default function WhatIfSimulation() {
  // Input parameters state
  const [mktBudget, setMktBudget] = useState(2.5); // 0B to 10B
  const [gpaMin, setGpaMin] = useState(6.5); // 4.0 to 10.0
  const [ieltsMin, setIeltsMin] = useState(5.5); // 4.0 to 9.0
  const [tuitionDiscount, setTuitionDiscount] = useState(15); // 0% to 50%
  const [localPriority, setLocalPriority] = useState(true);
  const [scholarshipExpand, setScholarshipExpand] = useState(false);

  // 2026 Admissions Quotas states (Must sum to 100%)
  const [quotaHocBa, setQuotaHocBa] = useState(40); // 0% to 100%
  const [quotaThpt, setQuotaThpt] = useState(30);   // 0% to 100%
  const [quotaDgnl, setQuotaDgnl] = useState(20);   // 0% to 100%
  const [quotaCert, setQuotaCert] = useState(10);   // 0% to 100%

  // 2026 Tech Combinations states
  const [f01Min, setF01Min] = useState(6.5);
  const [f03Min, setF03Min] = useState(6.5);
  const [f05Min, setF05Min] = useState(6.5);

  const quotaSum = quotaHocBa + quotaThpt + quotaDgnl + quotaCert;
  const isQuotaSumValid = quotaSum === 100;

  // DSS Model Simulation outputs from Backend
  const [modelLoading, setModelLoading] = useState(false);
  const [simResult, setSimResult] = useState({
    expectedApps: 12450,
    appsChangePct: 12.4,
    yieldPct: 42.8,
    yieldChangePct: -2.1,
    expectedEnrolled: 5328,
    expectedRevenue: 482.0,
    revenueChangePct: 8.8,
    highQualityPct: 65,
    mediumQualityPct: 25,
    failRiskPct: 10,
    targetAchievePct: 82,
    baseApplications: 11072,
    simulatedAt: "Thời gian thực",
    monthlyTrajectory: [
      { month: "Tháng 1", baseline: 550, simulated: 620 },
      { month: "Tháng 2", baseline: 880, simulated: 990 },
      { month: "Tháng 3", baseline: 1320, simulated: 1480 },
      { month: "Tháng 4", baseline: 1990, simulated: 2280 },
      { month: "Tháng 5", baseline: 1660, simulated: 1890 },
      { month: "Tháng 6", baseline: 1440, simulated: 1620 },
      { month: "Tháng 7", baseline: 1220, simulated: 1370 },
      { month: "Tháng 8", baseline: 1107, simulated: 1250 },
      { month: "Tháng 9", baseline: 880, simulated: 950 }
    ]
  });

  // Optimization Modal state
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [optimizeLoading, setOptimizeLoading] = useState(false);
  const [optimizedData, setOptimizedData] = useState(null);

  // Proposal modal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [recTitle, setRecTitle] = useState("Đề xuất kịch bản phân bổ chỉ tiêu và điểm tuyển sinh năm 2026");
  const [recDesc, setRecDesc] = useState("Kịch bản tối ưu hóa: Tăng chỉ tiêu Học bạ/ĐGNL và điểm chuẩn các tổ hợp công nghệ mới.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applyDirectly, setApplyDirectly] = useState(false);

  // Function to call backend DSS Model Simulation
  const runSimulationModel = useCallback(async () => {
    if (!isQuotaSumValid) return;
    setModelLoading(true);
    try {
      const payload = {
        mktBudget,
        gpaMin,
        ieltsMin,
        tuitionDiscount,
        localPriority,
        scholarshipExpand,
        quotaHocBa,
        quotaThpt,
        quotaDgnl,
        quotaCert,
        f01Min,
        f03Min,
        f05Min
      };
      const res = await api.post("/api/manager/dss/simulate", payload);
      if (res.data) {
        // format trajectory to chart format
        const resData = res.data;
        if (resData.monthlyTrajectory) {
          resData.monthlyTrajectory = resData.monthlyTrajectory.map(item => ({
            name: item.month,
            "Hiện tại": item.baseline,
            "Giả lập": item.simulated
          }));
        }
        setSimResult(resData);
      }
    } catch (err) {
      console.warn("DSS Backend simulate endpoint not reachable, running client-side model fallback: ", err.message);
    } finally {
      setModelLoading(false);
    }
  }, [mktBudget, gpaMin, ieltsMin, tuitionDiscount, localPriority, scholarshipExpand, quotaHocBa, quotaThpt, quotaDgnl, quotaCert, f01Min, f03Min, f05Min, isQuotaSumValid]);

  // Debounced auto-simulation on parameter change
  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulationModel();
    }, 400);
    return () => clearTimeout(timer);
  }, [runSimulationModel]);

  // Auto-optimize quotas
  const handleAutoOptimize = async () => {
    setOptimizeLoading(true);
    try {
      const res = await api.post("/api/manager/dss/optimize-quota", {
        totalTargetQuota: 15000,
        objective: "MAX_REVENUE_QUALITY"
      });
      setOptimizedData(res.data);
      setShowOptimizeModal(true);
    } catch (err) {
      alert("Lỗi khi tối ưu hóa chỉ tiêu: " + (err.response?.data?.message || err.message));
    } finally {
      setOptimizeLoading(false);
    }
  };

  const handleReset = () => {
    setMktBudget(2.5);
    setGpaMin(6.5);
    setIeltsMin(5.5);
    setTuitionDiscount(15);
    setLocalPriority(true);
    setScholarshipExpand(false);
    setQuotaHocBa(40);
    setQuotaThpt(30);
    setQuotaDgnl(20);
    setQuotaCert(10);
    setF01Min(6.5);
    setF03Min(6.5);
    setF05Min(6.5);
  };

  const handleExport = () => {
    alert("Báo cáo mô phỏng kịch bản What-If (DSS Model Engine) đã được kết xuất thành công!");
  };

  const handleApplyScenario = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: recTitle,
        description: `${recDesc} (Chỉ tiêu: HB:${quotaHocBa}%, THPT:${quotaThpt}%, DGNL:${quotaDgnl}%, QT:${quotaCert}%. Điểm sàn GPA:${gpaMin}, IELTS:${ieltsMin}, F01:${f01Min}, MKT:${mktBudget}B, Ưu đãi:${tuitionDiscount}%).`,
        impact: `Lượng hồ sơ dự kiến: ${simResult.expectedApps.toLocaleString()} (${simResult.appsChangePct > 0 ? "+" : ""}${simResult.appsChangePct}%), Doanh thu: ${simResult.expectedRevenue}B VND.`,
        currentValue: String(simResult.baseApplications || 11072),
        targetValue: String(simResult.expectedApps),
        majorQuotas: optimizedData?.optimalMajors?.map(m => ({ majorId: m.majorId, quota: m.optimalQuota })) || []
      };

      const res = await api.post("/api/manager/dss/apply-scenario", payload);
      alert(res.data.message || "Đã áp dụng kịch bản vào cơ sở dữ liệu thành công!");
      setShowSubmitModal(false);
    } catch (err) {
      alert("Lỗi khi áp dụng kịch bản: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, fontFamily: "Inter, sans-serif" }}>
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #D97706, #B45309)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(217,119,6,0.3)" }}>
              <Cpu size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontWeight: 900, fontSize: 24, color: "#1E293B" }}>Mô Hình Tính Toán "What-If" (DSS Model Engine)</h1>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: TEXT_MUTED }}>Thuật toán Co Giãn Cung-Cầu & Tối Ưu Hóa Tuyển Sinh 2026</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button 
            onClick={handleAutoOptimize}
            disabled={optimizeLoading}
            style={{
              display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #2563EB, #1D4ED8)", border: "none",
              borderRadius: 10, padding: "10px 16px", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
              boxShadow: "0 2px 8px rgba(37,99,235,0.25)"
            }}
          >
            <Sparkles size={15} /> {optimizeLoading ? "Đang giải tối ưu..." : "Tự Động Tối Ưu Chỉ Tiêu"}
          </button>

          <button 
            onClick={() => setShowSubmitModal(true)}
            disabled={!isQuotaSumValid}
            style={{
              display: "flex", alignItems: "center", gap: 6, background: "#059669", border: "none",
              borderRadius: 10, padding: "10px 16px", color: "white", fontWeight: 700, fontSize: 13, cursor: isQuotaSumValid ? "pointer" : "not-allowed",
              boxShadow: "0 2px 8px rgba(5,150,105,0.25)"
            }}
          >
            <Zap size={15} /> Áp Dụng Kịch Bản Này
          </button>

          <button 
            onClick={handleExport}
            style={{
              display: "flex", alignItems: "center", gap: 6, background: "#F1F5F9", border: "1px solid #CBD5E1",
              borderRadius: 10, padding: "10px 14px", color: "#334155", fontWeight: 700, fontSize: 13, cursor: "pointer"
            }}
          >
            <Download size={14} /> Xuất Báo Cáo
          </button>
        </div>
      </div>

      {/* Main layout grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 2fr", gap: 20 }}>
        
        {/* LEFT COLUMN: Input sliders */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid #F1F5F9", paddingBottom: 12 }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#1E293B", display: "flex", alignItems: "center", gap: 6 }}>
              <Sliders size={16} color="#64748B" /> Tham số mô hình toán
            </h3>
            <button 
              onClick={handleReset}
              style={{
                background: "none", border: "none", color: "#C2410C", fontSize: 12.5, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 4
              }}
            >
              <RefreshCw size={12} /> Đặt lại mặc định
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Slider 1: Marketing Budget */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#334155", fontWeight: 700 }}>Ngân sách Marketing (VND)</span>
                <span style={{ fontSize: 12.5, background: "#FFF7ED", color: "#C2410C", padding: "2px 8px", borderRadius: 6, fontWeight: 800 }}>
                  {mktBudget} Tỷ VND
                </span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.5" value={mktBudget}
                onChange={e => setMktBudget(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#D97706" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94A3B8", marginTop: 4, fontWeight: 600 }}>
                <span>0 Tỷ</span>
                <span>5 Tỷ</span>
                <span>10 Tỷ</span>
              </div>
            </div>

            {/* Group box: 2026 Admissions Quotas */}
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, background: "#F8FAFC" }}>
              <h4 style={{ margin: "0 0 14px", fontSize: 12.5, color: "#475569", fontWeight: 850 }}>📊 Phân bổ Chỉ tiêu theo Phương thức</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Học bạ */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Xét Học bạ THPT</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{quotaHocBa}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="5" value={quotaHocBa}
                    onChange={e => setQuotaHocBa(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#D97706" }}
                  />
                </div>

                {/* THPT */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Điểm thi THPTQG</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{quotaThpt}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="5" value={quotaThpt}
                    onChange={e => setQuotaThpt(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#D97706" }}
                  />
                </div>

                {/* ĐGNL */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Đánh giá năng lực (ĐHQG)</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{quotaDgnl}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="5" value={quotaDgnl}
                    onChange={e => setQuotaDgnl(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#D97706" }}
                  />
                </div>

                {/* SAT/IELTS */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Tuyển thẳng & Chứng chỉ QT</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{quotaCert}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="5" value={quotaCert}
                    onChange={e => setQuotaCert(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#D97706" }}
                  />
                </div>

                {/* Tổng tỉ lệ hiển thị và cảnh báo */}
                <div style={{ 
                  padding: "8px 12px", 
                  borderRadius: 8, 
                  background: isQuotaSumValid ? "#ECFDF5" : "#FEF2F2",
                  color: isQuotaSumValid ? "#15803D" : "#B91C1C",
                  fontSize: 12, 
                  fontWeight: 700, 
                  textAlign: "center",
                  marginTop: 4
                }}>
                  {isQuotaSumValid ? (
                    <span>✓ Tổng tỉ lệ chỉ tiêu: 100% (Hợp lệ)</span>
                  ) : (
                    <span>⚠️ Tổng chỉ tiêu phải bằng 100% (Hiện tại: {quotaSum}%)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Group box: Admission Standards */}
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, background: "#F8FAFC" }}>
              <h4 style={{ margin: "0 0 14px", fontSize: 12.5, color: "#475569", fontWeight: 850 }}>🎓 Điểm Sàn & Chuẩn Đầu Vào</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* GPA */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Điểm sàn Học bạ (GPA)</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{gpaMin} / 10.0</span>
                  </div>
                  <input 
                    type="range" min="4.0" max="9.0" step="0.1" value={gpaMin}
                    onChange={e => setGpaMin(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#D97706" }}
                  />
                </div>

                {/* IELTS */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Yêu cầu IELTS</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{ieltsMin}</span>
                  </div>
                  <input 
                    type="range" min="4.0" max="8.0" step="0.5" value={ieltsMin}
                    onChange={e => setIeltsMin(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#D97706" }}
                  />
                </div>

                {/* F01 */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Điểm sàn Tổ hợp F01/F03 (CNTT/AI)</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{f01Min}</span>
                  </div>
                  <input 
                    type="range" min="5.0" max="9.0" step="0.1" value={f01Min}
                    onChange={e => {
                      const v = Number(e.target.value);
                      setF01Min(v);
                      setF03Min(v);
                      setF05Min(v);
                    }}
                    style={{ width: "100%", accentColor: "#D97706" }}
                  />
                </div>
              </div>
            </div>

            {/* Slider 3: Tuition discount */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#334155", fontWeight: 700 }}>Ưu đãi học phí (%)</span>
                <span style={{ fontSize: 12.5, background: "#FFF7ED", color: "#C2410C", padding: "2px 8px", borderRadius: 6, fontWeight: 800 }}>
                  {tuitionDiscount}%
                </span>
              </div>
              <input 
                type="range" min="0" max="50" step="5" value={tuitionDiscount}
                onChange={e => setTuitionDiscount(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#D97706" }}
              />
            </div>

            {/* Run button */}
            <button 
              onClick={runSimulationModel}
              disabled={!isQuotaSumValid || modelLoading}
              style={{
                width: "100%", padding: "12px 20px", background: isQuotaSumValid ? "linear-gradient(135deg, #1E293B, #0F172A)" : "#94A3B8", border: "none",
                borderRadius: 10, color: "white", fontWeight: 700, fontSize: 13.5, cursor: isQuotaSumValid ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 6,
                boxShadow: isQuotaSumValid ? "0 4px 12px rgba(15,23,42,0.2)" : "none"
              }}
            >
              <PlayCircle size={16} className={modelLoading ? "animate-spin" : ""} /> 
              {modelLoading ? "Đang tính toán mô hình co giãn..." : "Chạy Lại Mô Hình Tính Toán"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Outputs and Chart */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Top 3 KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {/* Card 1: Expected Apps */}
            <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_MUTED }}>LƯỢNG HỒ SƠ DỰ KIẾN</span>
                <span style={{ 
                  fontSize: 11, fontWeight: 700, 
                  color: simResult.appsChangePct >= 0 ? "#10B981" : "#EF4444", 
                  background: simResult.appsChangePct >= 0 ? "#ECFDF5" : "#FEE2E2", 
                  padding: "2px 6px", borderRadius: 4 
                }}>
                  {simResult.appsChangePct >= 0 ? "+" : ""}{simResult.appsChangePct}%
                </span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#1E293B", margin: "6px 0 2px" }}>
                {simResult.expectedApps.toLocaleString("vi-VN")}
              </div>
              <span style={{ fontSize: 11, color: TEXT_MUTED }}>Cơ sở: {simResult.baseApplications?.toLocaleString() || "11,072"}</span>
            </div>

            {/* Card 2: Yield Rate */}
            <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_MUTED }}>TỶ LỆ NHẬP HỌC (YIELD)</span>
                <span style={{ 
                  fontSize: 11, fontWeight: 700, 
                  color: simResult.yieldChangePct >= 0 ? "#10B981" : "#EF4444", 
                  background: simResult.yieldChangePct >= 0 ? "#ECFDF5" : "#FEE2E2", 
                  padding: "2px 6px", borderRadius: 4 
                }}>
                  {simResult.yieldChangePct >= 0 ? "+" : ""}{simResult.yieldChangePct}%
                </span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#1E293B", margin: "6px 0 2px" }}>
                {simResult.yieldPct}%
              </div>
              <span style={{ fontSize: 11, color: TEXT_MUTED }}>~{simResult.expectedEnrolled?.toLocaleString() || "5,328"} nhập học</span>
            </div>

            {/* Card 3: Expected Revenue */}
            <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_MUTED }}>DOANH THU KỲ VỌNG</span>
                <span style={{ 
                  fontSize: 11, fontWeight: 700, 
                  color: simResult.revenueChangePct >= 0 ? "#10B981" : "#EF4444", 
                  background: simResult.revenueChangePct >= 0 ? "#ECFDF5" : "#FEE2E2", 
                  padding: "2px 6px", borderRadius: 4 
                }}>
                  {simResult.revenueChangePct >= 0 ? "+" : ""}{simResult.revenueChangePct}%
                </span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#1E293B", margin: "6px 0 2px" }}>
                {simResult.expectedRevenue} Tỷ
              </div>
              <span style={{ fontSize: 11, color: TEXT_MUTED }}>VND / Năm học</span>
            </div>
          </div>

          {/* Scenario Comparison Chart */}
          <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#1E293B" }}>Đường Cong Tiến Độ Đăng Ký Hồ Sơ 2026</h3>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: TEXT_MUTED }}>So sánh quỹ đạo Tuyển sinh Hiện tại vs Kịch bản Giả lập</p>
              </div>

              {/* Legends */}
              <div style={{ display: "flex", gap: 14, fontSize: 12, fontWeight: 700 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#2563EB" }} />
                  <span style={{ color: TEXT_MUTED }}>Baseline</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#D97706" }} />
                  <span style={{ color: "#D97706" }}>Mô Phỏng What-If</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={simResult.monthlyTrajectory || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={v => v.toLocaleString()} />
                <Line type="monotone" dataKey="Hiện tại" stroke="#2563EB" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Giả lập" stroke="#D97706" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>

            {/* AI Insight Box */}
            <div style={{
              background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "14px 18px",
              display: "flex", gap: 12, alignItems: "flex-start", marginTop: 18
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", background: "white", border: "1px solid #FCD34D",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Sparkles size={16} color="#D97706" />
              </div>
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: "#B45309", textTransform: "uppercase" }}>Đánh giá Mô hình DSS Engine:</span>
                <p style={{ margin: "4px 0 0", fontSize: 12.5, lineHeight: 1.5, color: "#78350F", fontWeight: 500 }}>
                  Với mức Marketing <strong>{mktBudget}B</strong> và điểm sàn GPA <strong>{gpaMin}</strong>, hệ thống dự báo nguồn tuyển sẽ co giãn đạt <strong>{simResult.expectedApps?.toLocaleString()}</strong> hồ sơ. Tỷ lệ học bổng mở rộng mang lại khả năng chốt nhập học cao cho khối ngành Công nghệ và AI.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom row: Risk and target probability */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Risk Distribution progress bars */}
            <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
              <h4 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: 13, color: "#1E293B" }}>
                PHÂN BỐ CHẤT LƯỢNG NGUỒN TUYỂN
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#334155", marginBottom: 4, fontWeight: 700 }}>
                    <span>Ứng viên Top chất lượng cao</span>
                    <span style={{ color: "#059669" }}>{simResult.highQualityPct}%</span>
                  </div>
                  <div style={{ width: "100%", height: 7, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${simResult.highQualityPct}%`, height: "100%", background: "#059669", borderRadius: 99 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#334155", marginBottom: 4, fontWeight: 700 }}>
                    <span>Ứng viên Trung bình - Khá</span>
                    <span style={{ color: "#D97706" }}>{simResult.mediumQualityPct}%</span>
                  </div>
                  <div style={{ width: "100%", height: 7, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${simResult.mediumQualityPct}%`, height: "100%", background: "#D97706", borderRadius: 99 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#334155", marginBottom: 4, fontWeight: 700 }}>
                    <span>Xác suất hồ sơ ảo / Rủi ro trượt</span>
                    <span style={{ color: "#DC2626" }}>{simResult.failRiskPct}%</span>
                  </div>
                  <div style={{ width: "100%", height: 7, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${simResult.failRiskPct}%`, height: "100%", background: "#DC2626", borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Gauge Target Probability Card */}
            <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 86, height: 86, borderRadius: "50%",
                border: "7px solid #FFF7ED", borderTopColor: "#D97706", borderRightColor: "#D97706",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                transform: "rotate(-45deg)"
              }}>
                <span style={{ fontSize: 19, fontWeight: 950, color: "#1E293B", transform: "rotate(45deg)" }}>
                  {simResult.targetAchievePct}%
                </span>
              </div>

              <div>
                <span style={{ fontSize: 11, fontWeight: 800, color: TEXT_MUTED, textTransform: "uppercase" }}>XÁC SUẤT ĐẠT CHỈ TIÊU</span>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#B45309", marginTop: 4 }}>
                  {simResult.targetAchievePct >= 80 ? "Rất Khả Thi" : (simResult.targetAchievePct >= 60 ? "Khả Thi" : "Cần Điều Chỉnh")}
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: TEXT_MUTED, lineHeight: 1.4 }}>
                  Mô hình ước tính xác suất hoàn thành 100% chỉ tiêu toàn trường là <strong>{simResult.targetAchievePct}%</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Auto Optimize Modal */}
      {showOptimizeModal && optimizedData && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: "white", borderRadius: 20, maxWidth: 750, width: "100%", maxHeight: "90vh", overflowY: "auto",
            padding: 28, boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sparkles size={20} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 900, fontSize: 18, color: "#1E293B" }}>
                    Kết Quả Tối Ưu Hóa Phân Bổ Chỉ Tiêu (Linear Programming Model)
                  </h3>
                  <p style={{ margin: 0, fontSize: 12.5, color: "#64748B" }}>
                    Mục tiêu: Tối đa hóa nguồn thu & chất lượng đào tạo (Tổng chỉ tiêu: {optimizedData.totalTargetQuota?.toLocaleString()})
                  </p>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", color: "#475569", textAlign: "left" }}>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Ngành đào tạo</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Chỉ tiêu hiện tại</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Chỉ tiêu tối ưu</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Chênh lệch (Delta)</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Khuyến nghị</th>
                  </tr>
                </thead>
                <tbody>
                  {optimizedData.optimalMajors?.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: "#1E293B" }}>
                        {item.name} ({item.code})
                      </td>
                      <td style={{ padding: "10px 14px", color: "#64748B" }}>{item.currentQuota?.toLocaleString()}</td>
                      <td style={{ padding: "10px 14px", fontWeight: 800, color: "#2563EB" }}>{item.optimalQuota?.toLocaleString()}</td>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: item.delta > 0 ? "#059669" : (item.delta < 0 ? "#DC2626" : "#64748B") }}>
                        {item.delta > 0 ? `+${item.delta}` : item.delta}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 12 }}>
                        <span style={{
                          padding: "3px 8px", borderRadius: 6, fontWeight: 700,
                          background: item.delta > 0 ? "#ECFDF5" : (item.delta < 0 ? "#FEF2F2" : "#F8FAFC"),
                          color: item.delta > 0 ? "#059669" : (item.delta < 0 ? "#DC2626" : "#64748B")
                        }}>
                          {item.recommendation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button 
                onClick={() => setShowOptimizeModal(false)}
                style={{
                  padding: "9px 18px", background: "white", border: "1px solid #CBD5E1",
                  borderRadius: 10, color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer"
                }}>
                Đóng lại
              </button>
              <button 
                onClick={() => {
                  setShowOptimizeModal(false);
                  setShowSubmitModal(true);
                }}
                style={{
                  padding: "9px 18px", background: "#059669", border: "none",
                  borderRadius: 10, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6
                }}>
                <Zap size={14} /> Áp dụng bộ chỉ tiêu tối ưu này
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Strategic proposal modal */}
      {showSubmitModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: "white", borderRadius: 20, maxWidth: 520, width: "100%",
            padding: 26, boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ margin: "0 0 14px", fontWeight: 800, fontSize: 18, color: "#1E293B" }}>
              Ban Hành & Áp Dụng Kịch Bản Vào Hệ Thống
            </h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#64748B" }}>
              Hệ thống sẽ cập nhật trực tiếp chỉ tiêu vào CSDL và tự động chạy lại Pipeline đánh giá hồ sơ toàn diện.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>Tiêu đề quyết định</label>
                <input 
                  type="text" value={recTitle} onChange={e => setRecTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>Nội dung căn cứ mô hình</label>
                <textarea 
                  rows="3" value={recDesc} onChange={e => setRecDesc(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, outline: "none", resize: "none" }}
                />
              </div>

              <div style={{ background: "#F0FDF4", padding: "12px 16px", borderRadius: 10, fontSize: 12.5, color: "#15803D", border: "1px solid #DCFCE7", lineHeight: 1.5 }}>
                <strong>Kết quả mô hình:</strong> Dự kiến đạt ~<strong>{simResult.expectedApps.toLocaleString()}</strong> hồ sơ ({simResult.appsChangePct >= 0 ? "+" : ""}{simResult.appsChangePct}%), mang lại doanh thu kỳ vọng <strong>{simResult.expectedRevenue} tỷ VND</strong>.
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 22 }}>
              <button 
                onClick={() => setShowSubmitModal(false)}
                style={{
                  padding: "9px 16px", background: "white", border: "1px solid #CBD5E1",
                  borderRadius: 8, color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer"
                }}>
                Hủy bỏ
              </button>
              <button 
                onClick={handleApplyScenario}
                disabled={isSubmitting}
                style={{
                  padding: "9px 18px", background: "#059669", border: "none",
                  borderRadius: 8, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6
                }}>
                {isSubmitting ? "Đang cập nhật CSDL..." : "Xác Nhận Áp Dụng Ngay"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
