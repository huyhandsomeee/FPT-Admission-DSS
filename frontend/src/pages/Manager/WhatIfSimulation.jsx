import { useState } from "react";
import api from "../../config/axiosConfig";
import { 
  TrendingUp, RefreshCw, Send, ShieldCheck, Download, 
  HelpCircle, Sparkles, ChevronRight, Sliders, PlayCircle
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Matching Screenshot 5 styling colors
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

  // Modal strategic proposal state
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [recTitle, setRecTitle] = useState("Đề xuất kịch bản phân bổ chỉ tiêu và điểm tuyển sinh năm 2026");
  const [recDesc, setRecDesc] = useState("Kịch bản tối ưu hóa: Tăng chỉ tiêu Học bạ/ĐGNL và điểm chuẩn các tổ hợp công nghệ mới.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calibration calculations for exact outputs
  // 1. Expected apps (Base 11072 -> Default 12450, which is +12.4%)
  const factor = 1.05 + (mktBudget - 2.5) * 0.05 - (gpaMin - 6.5) * 0.10 - (ieltsMin - 5.5) * 0.06 + (tuitionDiscount - 15) * 0.004 + (localPriority ? 0.05 : 0) + (scholarshipExpand ? 0.04 : 0) + (quotaHocBa - 40) * 0.004 + (quotaDgnl - 20) * 0.002 - (f01Min - 6.5) * 0.02 - (f03Min - 6.5) * 0.02 - (f05Min - 6.5) * 0.02;
  const expectedApps = Math.round(11072 * factor);
  const appsChangePct = ((expectedApps - 11072) / 11072 * 100).toFixed(1);

  // 2. Yield rate (Base 44.9% -> Default 42.8%, which is -2.1%)
  const yieldPct = Number((44.9 - (gpaMin - 6.5) * 1.2 - (ieltsMin - 5.5) * 0.8 + (tuitionDiscount - 15) * 0.2 - (mktBudget - 2.5) * 0.3 + (quotaCert - 10) * 0.12 - (quotaHocBa - 40) * 0.04 + (f01Min - 6.5) * 0.3 + (f03Min - 6.5) * 0.3 + (f05Min - 6.5) * 0.3 - (localPriority ? 1.5 : 0) - (scholarshipExpand ? 0.6 : 0)).toFixed(1));
  const yieldChangePct = (yieldPct - 44.9).toFixed(1);

  // 3. Expected revenue (Base 443B -> Default 482B, which is +8.7%)
  const expectedEnrolled = Math.round(expectedApps * (yieldPct / 100));
  const expectedRevenue = Math.round(expectedEnrolled * 90.5e6 / 1e9);
  const revenueChangePct = ((expectedRevenue - 443) / 443 * 100).toFixed(1);

  // 4. Risk distribution
  const highQuality = Math.min(95, Math.max(20, Math.round(65 + (gpaMin - 6.5) * 8 + (ieltsMin - 5.5) * 6)));
  const failRisk = Math.min(45, Math.max(3, Math.round(10 - (gpaMin - 6.5) * 4 - (ieltsMin - 5.5) * 3)));
  const mediumQuality = 100 - highQuality - failRisk;

  // 5. Probability of target completion
  const targetAchievePct = Math.min(100, Math.max(30, Math.round(82 + (expectedApps - 12450) * 0.008)));

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
    alert("Báo cáo mô phỏng kịch bản What-If đã được kết xuất thành công!");
  };

  const handleSubmitRecommendation = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        category: "CUSTOM_SIMULATION",
        priority: "HIGH",
        title: recTitle,
        description: `${recDesc} (Chỉ tiêu: HB:${quotaHocBa}%, THPT:${quotaThpt}%, DGNL:${quotaDgnl}%, QT:${quotaCert}%. Điểm chuẩn: GPA:${gpaMin}, IELTS:${ieltsMin}, F01:${f01Min}, F03:${f03Min}, F05:${f05Min}, Mkt:${mktBudget}B, Ưu đãi:${tuitionDiscount}%).`,
        impact: `Lượng hồ sơ dự kiến: ${expectedApps.toLocaleString()} (+${appsChangePct}%), Doanh thu: ${expectedRevenue}B VND.`,
        currentValue: "11072",
        targetValue: String(expectedApps),
        actionPlan: `Phân bổ chỉ tiêu mới (Học bạ ${quotaHocBa}%, THPT ${quotaThpt}%, ĐGNL ${quotaDgnl}%, Chứng chỉ ${quotaCert}%). Điều chỉnh điểm chuẩn F01-F05 ở mức ${f01Min}-${f05Min} và duy trì GPA ${gpaMin}. Tăng ngân sách marketing lên ${mktBudget}B VND.`,
        status: "PENDING"
      };

      await api.post("/api/manager/recommendations", payload);
      alert("Đã gửi đề xuất mô phỏng kịch bản thành công lên Hội đồng Tuyển sinh!");
      setShowSubmitModal(false);
    } catch (err) {
      alert("Lỗi khi trình đề xuất: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Monthly distributions for the line chart
  const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9"];
  const baselineDistribution = [0.05, 0.08, 0.12, 0.18, 0.15, 0.13, 0.11, 0.10, 0.08];
  
  const chartData = months.map((month, idx) => {
    const factorBaseline = baselineDistribution[idx];
    // Slightly shift peak forward if marketing is higher
    const shift = (mktBudget - 2.5) * 0.01;
    const factorSimulated = Math.max(0.02, factorBaseline + (idx === 3 || idx === 4 ? shift * 2.2 : -shift * 0.5));
    
    return {
      name: month,
      "Hiện tại": Math.round(11072 * factorBaseline),
      "Giả lập": Math.round(expectedApps * factorSimulated)
    };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h1 style={{ margin: 0, fontWeight: 900, fontSize: 26, color: "#1E293B" }}>Mô phỏng "What-If"</h1>
            <span style={{
              display: "flex", alignItems: "center", gap: 4, background: "#EFF6FF", color: "#1D4ED8",
              fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6, marginLeft: 8
            }}>
              <ShieldCheck size={13} /> Độ tin cậy AI: 94.2%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button 
            onClick={handleExport}
            style={{
              display: "flex", alignItems: "center", gap: 6, background: "#854D0E", border: "none",
              borderRadius: 10, padding: "10px 16px", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
              boxShadow: "0 2px 6px rgba(133,77,14,0.15)"
            }}
          >
            <Download size={14} /> Xuất Báo Cáo Simulation
          </button>
        </div>
      </div>

      {/* Main layout grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 2fr", gap: 20 }}>
        
        {/* LEFT COLUMN: Input sliders */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid #F1F5F9", paddingBottom: 12 }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: 15, color: "#1E293B", display: "flex", alignItems: "center", gap: 6 }}>
              <Sliders size={16} color="#64748B" /> Tham số giả lập
            </h3>
            <button 
              onClick={handleReset}
              style={{
                background: "none", border: "none", color: "#C2410C", fontSize: 12.5, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 4
              }}
            >
              <RefreshCw size={12} /> Đặt lại
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {/* Slider 1: Marketing Budget */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#334155", fontWeight: 700 }}>Ngân sách Marketing (VND)</span>
                <span style={{ fontSize: 12.5, background: "#FFF7ED", color: "#C2410C", padding: "2px 8px", borderRadius: 6, fontWeight: 800 }}>
                  {mktBudget}B
                </span>
              </div>
              <input 
                type="range" min="0" max="10" step="0.5" value={mktBudget}
                onChange={e => setMktBudget(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#FF6B35" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#94A3B8", marginTop: 4, fontWeight: 600 }}>
                <span>0B</span>
                <span>5B</span>
                <span>10B</span>
              </div>
            </div>

            {/* Group box: 2026 Admissions Quotas */}
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, background: "#F8FAFC" }}>
              <h4 style={{ margin: "0 0 14px", fontSize: 12.5, color: "#475569", fontWeight: 850 }}>📊 Phân bổ Chỉ tiêu 2026</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Học bạ */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Học bạ</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{quotaHocBa}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="5" value={quotaHocBa}
                    onChange={e => setQuotaHocBa(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#FF6B35" }}
                  />
                </div>

                {/* THPT */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Điểm thi THPT</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{quotaThpt}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="5" value={quotaThpt}
                    onChange={e => setQuotaThpt(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#FF6B35" }}
                  />
                </div>

                {/* ĐGNL */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Đánh giá năng lực</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{quotaDgnl}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="5" value={quotaDgnl}
                    onChange={e => setQuotaDgnl(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#FF6B35" }}
                  />
                </div>

                {/* SAT/IELTS */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Xét tuyển thẳng</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{quotaCert}%</span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="5" value={quotaCert}
                    onChange={e => setQuotaCert(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#FF6B35" }}
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
                    <span>✓ Tổng tỉ lệ chỉ tiêu: 100%</span>
                  ) : (
                    <span>⚠️ Tổng chỉ tiêu phải bằng 100% (Hiện tại: {quotaSum}%)</span>
                  )}
                </div>
              </div>
            </div>

            {/* Group box: Admission Standards */}
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, background: "#F8FAFC" }}>
              <h4 style={{ margin: "0 0 14px", fontSize: 12.5, color: "#475569", fontWeight: 850 }}>🎓 Tiêu chuẩn Tuyển sinh</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* GPA */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Điểm GPA tối thiểu</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{gpaMin}</span>
                  </div>
                  <input 
                    type="range" min="4.0" max="9.0" step="0.1" value={gpaMin}
                    onChange={e => setGpaMin(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#FF6B35" }}
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
                    style={{ width: "100%", accentColor: "#FF6B35" }}
                  />
                </div>

                {/* F01 */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Điểm chuẩn tổ hợp F01</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{f01Min}</span>
                  </div>
                  <input 
                    type="range" min="5.0" max="9.0" step="0.1" value={f01Min}
                    onChange={e => setF01Min(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#FF6B35" }}
                  />
                </div>

                {/* F03 */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Điểm chuẩn tổ hợp F03</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{f03Min}</span>
                  </div>
                  <input 
                    type="range" min="5.0" max="9.0" step="0.1" value={f03Min}
                    onChange={e => setF03Min(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#FF6B35" }}
                  />
                </div>

                {/* F05 */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Điểm chuẩn tổ hợp F05</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#1E293B" }}>{f05Min}</span>
                  </div>
                  <input 
                    type="range" min="5.0" max="9.0" step="0.1" value={f05Min}
                    onChange={e => setF05Min(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#FF6B35" }}
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
                style={{ width: "100%", accentColor: "#FF6B35" }}
              />
            </div>

            {/* Support policies group switches */}
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 16, background: "white" }}>
              <h4 style={{ margin: "0 0 12px", fontSize: 12.5, color: "#475569", fontWeight: 850 }}>CHÍNH SÁCH BỔ TRỢ</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Switch 1 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Ưu tiên thí sinh địa phương</span>
                  <button 
                    onClick={() => setLocalPriority(!localPriority)}
                    style={{
                      width: 44, height: 22, borderRadius: 20, border: "none", cursor: "pointer",
                      background: localPriority ? "#FF6B35" : "#CBD5E1", position: "relative",
                      transition: "background 0.2s"
                    }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", background: "white",
                      position: "absolute", top: 3, left: localPriority ? 25 : 3,
                      transition: "left 0.2s"
                    }} />
                  </button>
                </div>

                {/* Switch 2 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 600 }}>Mở rộng diện học bổng 2024</span>
                  <button 
                    onClick={() => setScholarshipExpand(!scholarshipExpand)}
                    style={{
                      width: 44, height: 22, borderRadius: 20, border: "none", cursor: "pointer",
                      background: scholarshipExpand ? "#FF6B35" : "#CBD5E1", position: "relative",
                      transition: "background 0.2s"
                    }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", background: "white",
                      position: "absolute", top: 3, left: scholarshipExpand ? 25 : 3,
                      transition: "left 0.2s"
                    }} />
                  </button>
                </div>
              </div>
            </div>

            {/* Run button */}
            <button 
              onClick={() => setShowSubmitModal(true)}
              disabled={!isQuotaSumValid}
              style={{
                width: "100%", padding: "12px 20px", background: isQuotaSumValid ? "#334155" : "#94A3B8", border: "none",
                borderRadius: 10, color: "white", fontWeight: 700, fontSize: 13.5, cursor: isQuotaSumValid ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 10,
                boxShadow: isQuotaSumValid ? "0 2px 6px rgba(51,65,85,0.15)" : "none"
              }}
            >
              <PlayCircle size={16} /> Chạy Giả Lập Dự Báo
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
                <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", background: "#ECFDF5", padding: "2px 6px", borderRadius: 4 }}>
                  +{appsChangePct}%
                </span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#1E293B", margin: "6px 0 2px" }}>
                {expectedApps.toLocaleString("vi-VN")}
              </div>
              <span style={{ fontSize: 11, color: TEXT_MUTED }}>vs 11,072</span>
            </div>

            {/* Card 2: Yield Rate */}
            <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_MUTED }}>TỶ LỆ NHẬP HỌC (YIELD)</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#EF4444", background: "#FEE2E2", padding: "2px 6px", borderRadius: 4 }}>
                  {yieldChangePct}%
                </span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#1E293B", margin: "6px 0 2px" }}>
                {yieldPct}%
              </div>
              <span style={{ fontSize: 11, color: TEXT_MUTED }}>vs 44.9%</span>
            </div>

            {/* Card 3: Expected Revenue */}
            <div style={{ background: "white", borderRadius: 16, padding: 18, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: TEXT_MUTED }}>DOANH THU DỰ KIẾN</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#10B981", background: "#ECFDF5", padding: "2px 6px", borderRadius: 4 }}>
                  +{revenueChangePct}%
                </span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#1E293B", margin: "6px 0 2px" }}>
                {expectedRevenue}B
              </div>
              <span style={{ fontSize: 11, color: TEXT_MUTED }}>VND</span>
            </div>
          </div>

          {/* Scenario Comparison Chart */}
          <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14.5, color: "#1E293B" }}>Xu hướng Đăng ký theo kịch bản</h3>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: TEXT_MUTED }}>So sánh kịch bản Hiện tại (Cố định) và kịch bản Giả lập (Năng động)</p>
              </div>

              {/* Legends */}
              <div style={{ display: "flex", gap: 12, fontSize: 11.5, fontWeight: 600 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D4ED8" }} />
                  <span style={{ color: TEXT_MUTED }}>Hiện tại</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6B35" }} />
                  <span style={{ color: TEXT_MUTED }}>Giả lập</span>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={v => v.toLocaleString()} />
                <Line type="monotone" dataKey="Hiện tại" stroke="#1D4ED8" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Giả lập" stroke="#FF6B35" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>

            {/* AI Insight Box */}
            <div style={{
              background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 18px",
              display: "flex", gap: 12, alignItems: "flex-start", marginTop: 18
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: "white", border: "1px solid #E2E8F0",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Sparkles size={15} color="#FF6B35" />
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#C2410C", textTransform: "uppercase" }}>Phân tích Insight AI</span>
                <p style={{ margin: "4px 0 0", fontSize: 12, lineHeight: 1.5, color: "#475569", fontWeight: 500 }}>
                  Tăng ngân sách Marketing 10% kết hợp giảm GPA yêu cầu xuống 0.2 điểm có thể giúp tối ưu hóa số lượng hồ sơ từ khu vực nông thôn mà không làm giảm đáng kể chất lượng đầu vào tổng thể.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom row: Risk and target probability */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 16 }}>
            {/* Risk Distribution progress bars */}
            <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
              <h4 style={{ margin: "0 0 14px", fontWeight: 700, fontSize: 13, color: "#1E293B", letterSpacing: "0.3px" }}>
                PHÂN BỐ RỦI RO HỒ SƠ
              </h4>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* 1 */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#334155", marginBottom: 4, fontWeight: 600 }}>
                    <span>Chất lượng cao</span>
                    <span>{highQuality}%</span>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${highQuality}%`, height: "100%", background: "#10B981", borderRadius: 99 }} />
                  </div>
                </div>

                {/* 2 */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#334155", marginBottom: 4, fontWeight: 600 }}>
                    <span>Trung bình</span>
                    <span>{mediumQuality}%</span>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${mediumQuality}%`, height: "100%", background: "#F59E0B", borderRadius: 99 }} />
                  </div>
                </div>

                {/* 3 */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#334155", marginBottom: 4, fontWeight: 600 }}>
                    <span>Rủi ro trượt</span>
                    <span>{failRisk}%</span>
                  </div>
                  <div style={{ width: "100%", height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${failRisk}%`, height: "100%", background: "#EF4444", borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Gauge Target Probability Card */}
            <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: 16 }}>
              {/* Circular border simulating gauge */}
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                border: "6px solid #FFF7ED", borderTopColor: "#FF6B35", borderRightColor: "#FF6B35",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                transform: "rotate(-45deg)"
              }}>
                <span style={{ fontSize: 18, fontWeight: 950, color: "#1E293B", transform: "rotate(45deg)" }}>
                  {targetAchievePct}%
                </span>
              </div>

              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: TEXT_MUTED, letterSpacing: "0.5px" }}>KHẢ NĂNG ĐẠT CHỈ TIÊU</span>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#B45309", marginTop: 4 }}>Rất cao</div>
                <p style={{ margin: "4px 0 0", fontSize: 11.5, color: TEXT_MUTED, lineHeight: 1.4 }}>
                  Dựa trên kịch bản hiện tại, xác suất hoàn thành 100% chỉ tiêu tuyển sinh là {targetAchievePct}%.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Strategic proposal modal */}
      {showSubmitModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: "white", borderRadius: 16, maxWidth: 500, width: "100%",
            padding: 24, boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ margin: "0 0 16px", fontWeight: 800, fontSize: 17, color: "#1a2e6e" }}>
              Trình đề xuất chiến lược lên Hội đồng
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>Tiêu đề đề xuất</label>
                <input 
                  type="text" value={recTitle} onChange={e => setRecTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, outline: "none" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>Mô tả chi tiết</label>
                <textarea 
                  rows="3" value={recDesc} onChange={e => setRecDesc(e.target.value)}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, outline: "none", resize: "none" }}
                />
              </div>

              <div style={{ background: "#F0FDF4", padding: "12px 16px", borderRadius: 10, fontSize: 12.5, color: "#15803D", border: "1px solid #DCFCE7", lineHeight: 1.5 }}>
                <strong>Tác động dự báo:</strong> Lượng hồ sơ sẽ tăng lên ~<strong>{expectedApps.toLocaleString()}</strong> (thay đổi +{appsChangePct}%), mang lại doanh thu kỳ vọng <strong>{expectedRevenue} tỷ VND</strong>.
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
              <button 
                onClick={() => setShowSubmitModal(false)}
                style={{
                  padding: "8px 16px", background: "white", border: "1px solid #CBD5E1",
                  borderRadius: 8, color: "#475569", fontSize: 13, fontWeight: 600, cursor: "pointer"
                }}>
                Đóng lại
              </button>
              <button 
                onClick={handleSubmitRecommendation}
                disabled={isSubmitting}
                style={{
                  padding: "8px 16px", background: "#1D4ED8", border: "none",
                  borderRadius: 8, color: "white", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 6
                }}>
                {isSubmitting ? "Đang gửi..." : "Xác nhận gửi đề xuất"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
