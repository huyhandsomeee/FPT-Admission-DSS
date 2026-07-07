import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import {
  FileText, Clock, CheckCircle, XCircle,
  ArrowUpRight, ArrowDownRight, Users, GraduationCap, Trophy,
  TrendingUp, BarChart3, Target, Monitor, Briefcase,
  Palette, RefreshCw, Download, Sparkles, Eye, ChevronRight, ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_LABELS = {
  DRAFT: "Bản nháp", SUBMITTED: "Đã nộp", UNDER_REVIEW: "Đang xét",
  APPROVED: "Đã duyệt", REJECTED: "Từ chối", ENROLLED: "Nhập học"
};

const STATUS_COLORS = {
  SUBMITTED:    { bg: "#DBEAFE", color: "#1D4ED8" },
  UNDER_REVIEW: { bg: "#FEF3C7", color: "#92400E" },
  APPROVED:     { bg: "#D1FAE5", color: "#065F46" },
  REJECTED:     { bg: "#FEE2E2", color: "#991B1B" },
  ENROLLED:     { bg: "#EDE9FE", color: "#5B21B6" },
  DRAFT:        { bg: "#F3F4F6", color: "#4B5563" },
};

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Simple SVG bar chart component
function MiniBarChart({ data, colors }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4 }}>
          <div style={{
            width: "100%", maxWidth: 28,
            height: `${(d.value / maxVal) * 80}px`,
            minHeight: 8,
            background: colors?.[i] || "#FF6B35",
            borderRadius: "4px 4px 0 0",
            transition: "height 0.5s ease"
          }} />
          <span style={{ fontSize: 9, color: "#94A3B8", whiteSpace: "nowrap" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// Donut chart component
function DonutChart({ percentage, size = 100, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#FF6B35" strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
}

// Custom SVG Line Chart for AI curve comparison
function AICurveChart({ historical, forecast, quota, predictedTotal }) {
  const allPoints = [
    ...historical.map(p => ({ ...p, isForecast: false })),
    ...forecast.map(p => ({ ...p, isForecast: true }))
  ];
  if (allPoints.length === 0) {
    return (
      <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
        Đang tải dữ liệu biểu đồ...
      </div>
    );
  }
  
  const width = 520;
  const height = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxVal = Math.max(quota, predictedTotal, ...allPoints.map(p => Math.max(p.actual || 0, p.predicted || 0)), 1) * 1.1;
  const minVal = Math.min(...historical.map(p => p.actual || 0)) * 0.9;
  const valRange = maxVal - minVal;

  const getX = (index) => paddingLeft + (index / (allPoints.length - 1)) * chartWidth;
  const getY = (val) => height - paddingBottom - ((val - minVal) / valRange) * chartHeight;

  // Generate SVG path for actual historical cumulative
  let histPath = "";
  historical.forEach((p, idx) => {
    const x = getX(idx);
    const y = getY(p.actual);
    histPath += `${idx === 0 ? "M" : "L"} ${x} ${y}`;
  });

  // Generate SVG path for forecast
  let forePath = "";
  if (historical.length > 0) {
    const lastHistIdx = historical.length - 1;
    forePath += `M ${getX(lastHistIdx)} ${getY(historical[lastHistIdx].actual)}`;
  }
  forecast.forEach((p, idx) => {
    const x = getX(historical.length + idx);
    const y = getY(p.predicted);
    forePath += ` L ${x} ${y}`;
  });

  const quotaY = getY(quota);

  return (
    <div style={{ position: "relative" }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ background: "#FAFBFC", borderRadius: 12, border: "1px solid #E2E8F0" }}>
        {/* Grid Lines */}
        {[0, 0.25, 0.5, 0.75, 1.0].map((ratio, i) => {
          const val = minVal + ratio * valRange;
          const y = getY(val);
          return (
            <g key={i}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
              <text x={paddingLeft - 8} y={y + 3} textAnchor="end" style={{ fontSize: 9, fill: "#94A3B8", fontWeight: 600 }}>
                {Math.round(val).toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Quota Threshold Line */}
        {quotaY >= paddingTop && quotaY <= height - paddingBottom && (
          <g>
            <line x1={paddingLeft} y1={quotaY} x2={width - paddingRight} y2={quotaY} stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 4" />
            <text x={width - paddingRight - 5} y={quotaY - 5} textAnchor="end" style={{ fontSize: 9, fill: "#EF4444", fontWeight: 800 }}>
              CHỈ TIÊU KỲ NÀY ({quota.toLocaleString()})
            </text>
          </g>
        )}

        {/* Historical line (Solid Orange) */}
        {histPath && (
          <path d={histPath} fill="none" stroke="#FF6B35" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Forecast line (Dashed Purple) */}
        {forePath && (
          <path d={forePath} fill="none" stroke="#8B5CF6" strokeWidth={3} strokeDasharray="5 5" strokeLinecap="round" strokeLinejoin="round" />
        )}

        {/* Split Divider line */}
        {historical.length > 0 && (
          <line x1={getX(historical.length - 1)} y1={paddingTop} x2={getX(historical.length - 1)} y2={height - paddingBottom} stroke="#94A3B8" strokeWidth={1} strokeDasharray="2 2" />
        )}

        {/* X Axis Labels */}
        {historical.length > 0 && (
          <text x={getX(0)} y={height - 10} textAnchor="middle" style={{ fontSize: 9, fill: "#64748B" }}>30 ngày trước</text>
        )}
        {historical.length > 0 && (
          <text x={getX(historical.length - 1)} y={height - 10} textAnchor="middle" style={{ fontSize: 9, fill: "#FF6B35", fontWeight: 700 }}>Hôm nay</text>
        )}
        {forecast.length > 0 && (
          <text x={getX(allPoints.length - 1)} y={height - 10} textAnchor="middle" style={{ fontSize: 9, fill: "#64748B" }}>Dự báo +30 ngày</text>
        )}
      </svg>
    </div>
  );
}

export default function OfficerDashboard() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    submitted: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    enrolled: 0,
    activeYear: 2026,
    quota: 18000
  });

  const [statsByMajor, setStatsByMajor] = useState({});
  const [recentApps, setRecentApps] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const navigate = useNavigate();

  // Continuous Updates & AI states
  const [trendDays, setTrendDays] = useState(7);
  const [trendData, setTrendData] = useState([]);
  const [conversionRates, setConversionRates] = useState([]);
  const [overallConversionRate, setOverallConversionRate] = useState(0);
  const [aiPrediction, setAiPrediction] = useState({
    totalNow: 0,
    predictedTotal: 0,
    quota: 18000,
    completionRate: 0,
    targetDate: "Chưa xác định",
    avgDaily7: 0,
    avgDaily30: 0,
    growthRate: 0,
    slope: 0,
    mse: 0,
    r2: 0,
    historicalPoints: [],
    forecastPoints: []
  });
  const [suggestions, setSuggestions] = useState([]);
  
  // Modals state
  const [showSuggestionsModal, setShowSuggestionsModal] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showAIModal, setShowAIModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, byMajorRes, recentRes, suggestionsRes, conversionRes, aiRes] = await Promise.all([
        api.get("/api/officer/dashboard"),
        api.get("/api/officer/dashboard/by-major"),
        api.get("/api/officer/applications?page=0&size=5"),
        api.get("/api/officer/dashboard/smart-suggestions"),
        api.get("/api/officer/dashboard/conversion-rates"),
        api.get("/api/officer/dashboard/ai-prediction")
      ]);

      if (statsRes.data) setStats(statsRes.data);
      if (byMajorRes.data) setStatsByMajor(byMajorRes.data);
      
      const content = recentRes.data?.content;
      if (Array.isArray(content)) setRecentApps(content);
      
      if (Array.isArray(suggestionsRes.data)) setSuggestions(suggestionsRes.data);
      
      if (conversionRes.data) {
        setConversionRates(conversionRes.data.rates || []);
        setOverallConversionRate(conversionRes.data.overallRate || 0);
      }
      
      if (aiRes.data) setAiPrediction(aiRes.data);
    } catch (e) {
      console.error("Lỗi khi tải dữ liệu dashboard: ", e);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchTrend = (days) => {
    api.get(`/api/officer/dashboard/trend?days=${days}`)
      .then(r => {
        if (Array.isArray(r.data)) {
          setTrendData(r.data.map(d => ({
            label: days === 7 ? d.label : d.date.substring(8, 10) + "/" + d.date.substring(5, 7),
            value: d.value
          })));
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchTrend(trendDays);
  }, [trendDays]);

  const handleExportCSV = () => {
    if (recentApps.length === 0) {
      alert("Không có hồ sơ nào để xuất báo cáo");
      return;
    }
    const headers = ["Mã hồ sơ", "Họ tên", "Email", "Ngành học", "Cơ sở", "Phương thức", "Điểm số", "Ngày nộp", "Trạng thái"];
    const rows = recentApps.map(app => [
      app.applicationCode || "", app.studentName || "", app.studentEmail || "",
      app.majorName || "", app.campusName || "", app.methodName || "",
      app.totalScore || "", app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("vi-VN") : "Chưa nộp",
      STATUS_LABELS[app.status] || ""
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bao_cao_tuyen_sinh_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const quotaPercent = Math.round(aiPrediction.completionRate ?? stats.enrollmentRate ?? 0);

  const barColors = Array(7).fill(null).map((_, i) => i === 3 ? "#FF6B35" : "#FFB088");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: "#0F172A" }}>
            Bảng điều khiển - Phân tích Tuyển sinh
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748B" }}>
            Chào mừng trở lại! Hệ thống đã cập nhật dữ liệu phân tích mới nhất cho kỳ tuyển sinh {stats.activeYear || 2026}.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/officer/moet-results")} style={{
            padding: "10px 18px", background: "white", border: "1px solid #E2E8F0",
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
            transition: "all 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}
          >
            <RefreshCw size={15} /> Đồng bộ Bộ GDĐT
          </button>
          <button onClick={handleExportCSV} style={{
            padding: "10px 18px", background: "white", border: "1px solid #E2E8F0",
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
            transition: "all 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}
          >
            <Download size={15} /> Xuất báo cáo
          </button>
          <button onClick={fetchData} disabled={refreshing} style={{
            padding: "10px 18px", background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
            border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "white",
            cursor: refreshing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 7,
            boxShadow: "0 4px 12px rgba(255,107,53,0.3)", transition: "all 0.15s",
            opacity: refreshing ? 0.7 : 1
          }}
            onMouseEnter={e => { if(!refreshing) e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { if(!refreshing) e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <RefreshCw size={15} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            {refreshing ? "Đang phân tích..." : "Làm mới dữ liệu"}
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
        {[
          {
            title: "Tổng số hồ sơ",
            value: stats.totalApplications,
            icon: FileText,
            color: "linear-gradient(135deg, #FFF7ED, #FFEDD5)",
            border: "#FED7AA",
            textColor: "#C2410C",
            iconColor: "#FF6B35",
            pct: 100
          },
          {
            title: "Hồ sơ mới (Đã nộp)",
            value: stats.submitted,
            icon: Clock,
            color: "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
            border: "#BFDBFE",
            textColor: "#1D4ED8",
            iconColor: "#3B82F6",
            pct: stats.totalApplications > 0 ? Math.round((stats.submitted / stats.totalApplications) * 100) : 0
          },
          {
            title: "Đang xét duyệt",
            value: stats.underReview,
            icon: TrendingUp,
            color: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
            border: "#FDE68A",
            textColor: "#B45309",
            iconColor: "#D97706",
            pct: stats.totalApplications > 0 ? Math.round((stats.underReview / stats.totalApplications) * 100) : 0
          },
          {
            title: "Đã duyệt tuyển",
            value: stats.approved,
            icon: CheckCircle,
            color: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
            border: "#A7F3D0",
            textColor: "#047857",
            iconColor: "#10B981",
            pct: stats.totalApplications > 0 ? Math.round((stats.approved / stats.totalApplications) * 100) : 0
          },
          {
            title: "Thí sinh nhập học",
            value: stats.enrolled,
            icon: GraduationCap,
            color: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
            border: "#DDD6FE",
            textColor: "#6D28D9",
            iconColor: "#8B5CF6",
            pct: stats.quota > 0 ? Math.round((stats.enrolled / stats.quota) * 100) : 0,
            isQuotaProgress: true
          }
        ].map((card, i) => (
          <div key={i} style={{
            background: card.color,
            border: `1px solid ${card.border}`,
            borderRadius: 14,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
            transition: "all 0.2s ease-in-out",
            cursor: "pointer",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#475569" }}>{card.title}</span>
              <card.icon size={20} color={card.iconColor} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "#1E293B", lineHeight: 1.1 }}>
                {(card.value ?? 0).toLocaleString()}
              </div>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ flex: 1, height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 99 }}>
                  <div style={{ height: "100%", width: `${card.pct}%`, background: card.iconColor, borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: card.textColor }}>
                  {card.isQuotaProgress ? `${card.pct}% chỉ tiêu` : `${card.pct}%`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights Banner */}
      <div style={{
        background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
        borderRadius: 16, padding: "18px 24px",
        border: "1px solid #FED7AA",
        display: "flex", alignItems: "center", gap: 16
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Sparkles size={22} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", letterSpacing: "0.5px", marginBottom: 6 }}>
            GỢI Ý THÔNG MINH (AI INSIGHTS)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#78350F" }}>
            {suggestions.length > 0 ? (
              suggestions.slice(0, 2).map((sug, idx) => (
                <div key={idx} style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontWeight: 700 }}>{sug.title}:</span>
                  <span>{sug.message}</span>
                </div>
              ))
            ) : (
              <div>Đang học tập và phân tích dữ liệu tuyển sinh...</div>
            )}
          </div>
        </div>
        <button onClick={() => { setActiveSuggestionIndex(0); setShowSuggestionsModal(true); }} style={{
          padding: "8px 18px", background: "#FF6B35", border: "none", borderRadius: 8,
          color: "white", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 5
        }}>
          Xem chi tiết
        </button>
      </div>

      {/* admissions funnel chart widget */}
      <div style={{
        background: "white", borderRadius: 14, padding: 24,
        border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#1E293B" }}>📊 Phễu tiến trình tuyển sinh</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Tỷ lệ chuyển đổi qua các giai đoạn chính thức</div>
          </div>
        </div>
        {stats.funnel ? (() => {
          const f = stats.funnel;
          const totalVal = f.total || 0;
          const steps = [
            { label: "1. Tổng số hồ sơ nộp", val: f.total ?? 0, color: "#FF6B35" },
            { label: "2. Hồ sơ hợp lệ (qua OCR)", val: f.valid ?? 0, color: "#FF8E62" },
            { label: "3. Đủ điều kiện", val: f.eligible ?? 0, color: "#FFA984" },
            { label: "4. Sinh viên đã xác nhận đăng ký NV", val: f.registered ?? 0, color: "#FFC2A8" },
            { label: "5. Chờ đồng bộ Bộ", val: f.waiting ?? 0, color: "#93C5FD" },
            { label: "6. Trúng tuyển chính thức", val: f.accepted ?? 0, color: "#8B5CF6" },
            { label: "7. Đã nhập học", val: f.enrolled ?? 0, color: "#10B981" }
          ];
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {steps.map((step, idx) => {
                const rate = totalVal > 0 ? Math.round((step.val / totalVal) * 100) : 0;
                const widthPercent = totalVal > 0 ? Math.max((step.val / totalVal) * 100, 20) : 20;
                return (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ width: 220, fontSize: 13, fontWeight: 700, color: "#475569" }}>
                      {step.label}
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <div style={{
                        width: `${widthPercent}%`,
                        background: step.color,
                        height: 32,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 14px",
                        justifyContent: "space-between",
                        color: "white",
                        fontWeight: 800,
                        fontSize: 13,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        transition: "width 0.8s ease-in-out"
                      }}>
                        <span>{(step.val).toLocaleString()}</span>
                        <span>{rate}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })() : (
          <div style={{ color: "#94A3B8", fontSize: 13, textAlign: "center", padding: 20 }}>Không có dữ liệu phễu tuyển sinh.</div>
        )}
      </div>

      {/* Analytics Center */}
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <BarChart3 size={18} color="#FF6B35" /> Trung tâm Phân tích
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.2fr 0.9fr", gap: 16 }}>
          
          {/* Xu hướng hồ sơ */}
          <div style={{
            background: "white", borderRadius: 14, padding: 20,
            border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex", flexDirection: "column", justifyContent: "space-between"
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Xu hướng hồ sơ</div>
                <select value={trendDays} onChange={e => setTrendDays(parseInt(e.target.value))} style={{
                  border: "1px solid #E2E8F0", borderRadius: 6, padding: "4px 8px",
                  fontSize: 11, color: "#64748B", background: "white", cursor: "pointer"
                }}>
                  <option value={7}>7 ngày qua</option>
                  <option value={30}>30 ngày qua</option>
                </select>
              </div>
              <MiniBarChart data={trendData} colors={barColors} />
            </div>
            <div>
              <div style={{ textAlign: "center", fontSize: 11, color: "#94A3B8", marginTop: 8 }}>
                Lượng nộp hàng ngày được cập nhật liên tục từ dữ liệu thực tế.
              </div>
              <div style={{ textAlign: "right", marginTop: 6 }}>
                <button onClick={() => setShowAIModal(true)} style={{ fontSize: 11, color: "#FF6B35", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                  Phân tích chuyên sâu AI →
                </button>
              </div>
            </div>
          </div>

          {/* Tỷ lệ chuyển đổi */}
          <div style={{
            background: "white", borderRadius: 14, padding: 20,
            border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Tỷ lệ chuyển đổi tuyển sinh</div>
              <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>TB chung: <strong style={{ color: "#FF6B35" }}>{overallConversionRate}%</strong></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {conversionRates.length > 0 ? (
                conversionRates.slice(0, 5).map((item) => (
                  <div key={item.code} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 12, color: "#1E293B", fontWeight: 600, minWidth: 110, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.name}
                    </span>
                    <div style={{
                      flex: 1, height: 8, background: "#F1F5F9", borderRadius: 99,
                      overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%", width: `${item.rate}%`,
                        background: item.rate > 50 ? "linear-gradient(90deg, #FFB088, #FF6B35)" : "linear-gradient(90deg, #DDD6FE, #8B5CF6)",
                        borderRadius: 99, transition: "width 0.8s ease"
                      }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#FF6B35", minWidth: 35, textAlign: "right" }}>{item.rate}%</span>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: 12, color: "#94A3B8", textAlign: "center", padding: 20 }}>Đang tải tỷ lệ chuyển đổi...</div>
              )}
            </div>
          </div>

          {/* Dự báo chỉ tiêu */}
          <div style={{
            background: "white", borderRadius: 14, padding: 20,
            border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Dự báo AI tuyển sinh</div>
              <button onClick={() => setShowAIModal(true)} style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B35", fontSize: 11, fontWeight: 600 }}>Chi tiết</button>
            </div>
            
            <div style={{ position: "relative", width: 110, height: 110, marginBottom: 10 }}>
              <DonutChart percentage={Math.min(quotaPercent, 100)} size={110} strokeWidth={12} />
              <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                textAlign: "center"
              }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#FF6B35" }}>{quotaPercent}%</div>
                <div style={{ fontSize: 8, color: "#94A3B8", fontWeight: 700 }}>TIẾN ĐỘ</div>
              </div>
            </div>
            
            <div style={{ fontSize: 11, color: "#64748B", textAlign: "center", lineHeight: 1.4, margin: "4px 0" }}>
              {aiPrediction.targetDate !== "Chưa xác định" ? (
                <>AI dự kiến sẽ đạt 100% chỉ tiêu trước ngày <strong style={{ color: "#FF6B35" }}>{aiPrediction.targetDate}</strong>.</>
              ) : (
                <>Dự báo tốc độ hiện tại chưa đủ để đạt chỉ tiêu.</>
              )}
            </div>
            
            <div style={{ display: "flex", gap: 20, width: "100%", justifyContent: "space-around", marginTop: 8, borderTop: "1px solid #F1F5F9", paddingTop: 10 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#94A3B8", fontWeight: 700 }}>ĐANG CÓ</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#1E293B" }}>{(stats.enrolled ?? 0).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#94A3B8", fontWeight: 700 }}>DỰ BÁO CUỐI</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#8B5CF6" }}>{(aiPrediction.predictedTotal ?? 0).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theo dõi theo nhóm ngành */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: 0 }}>Theo dõi theo nhóm ngành</h2>
          <button onClick={() => navigate("/officer/applicants")} style={{
            fontSize: 13, color: "#FF6B35", fontWeight: 600, background: "none",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4
          }}>
            Quản lý ngành học <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            {
              name: "Công nghệ thông tin (IT)",
              desc: "Kỹ thuật phần mềm, Trí tuệ nhân tạo, An toàn thông tin",
              icon: Monitor,
              count: stats.itTotal ?? 0,
              search: "CNTT",
              accent: "#FF6B35",
              iconBg: "#FFF7ED",
              iconColor: "#FF6B35",
            },
            {
              name: "Kinh tế & Quản trị",
              desc: "Quản trị kinh doanh, Digital Marketing, Tài chính - Ngân hàng",
              icon: Briefcase,
              count: (statsByMajor['BA'] ?? 0) + (statsByMajor['MK'] ?? 0) + (statsByMajor['FIN'] ?? 0),
              search: "Kinh tế",
              accent: "#FF6B35",
              iconBg: "#FFF7ED",
              iconColor: "#FF6B35",
            },
            {
              name: "Thiết kế & Nghệ thuật",
              desc: "Thiết kế đồ họa, Truyền thông đa phương tiện",
              icon: Palette,
              count: (statsByMajor['GD'] ?? 0) + (statsByMajor['MC'] ?? 0),
              search: "Thiết kế",
              accent: "#FF6B35",
              iconBg: "#FFF7ED",
              iconColor: "#FF6B35",
            },
            {
              name: "Du lịch & Khách sạn",
              desc: "Quản trị khách sạn, Quản trị du lịch",
              icon: Trophy,
              count: statsByMajor['HT'] ?? 0,
              search: "Khách sạn",
              accent: "#FF6B35",
              iconBg: "#FFF7ED",
              iconColor: "#FF6B35",
            },
          ].map(g => (
            <div key={g.name} style={{
              background: "white", borderRadius: 16, padding: "24px",
              border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: g.iconBg, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <g.icon size={20} color={g.iconColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>{g.desc}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{g.count.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginTop: 4 }}>TỔNG HỒ SƠ</div>
                </div>
                <button onClick={() => navigate(`/officer/applicants?search=${encodeURIComponent(g.search)}`)} style={{
                  padding: "9px 20px",
                  background: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: 10, fontSize: 13, fontWeight: 600,
                  color: "#64748B",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  transition: "all 0.15s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B35"; e.currentTarget.style.color = "#FF6B35"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B"; }}
                >
                  Xem chi tiết <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: 0 }}>Hoạt động gần đây</h2>
          <button onClick={() => navigate("/officer/applicants")} style={{
            fontSize: 13, color: "#FF6B35", fontWeight: 600, background: "none",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4
          }}>
            Xem tất cả <ChevronRight size={14} />
          </button>
        </div>
        <div style={{
          background: "white", borderRadius: 16, border: "1px solid #F1F5F9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["SINH VIÊN", "NGÀNH HỌC", "TRẠNG THÁI", "THỜI GIAN"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "12px 20px", fontSize: 11,
                    fontWeight: 700, letterSpacing: "0.05em", color: "#94A3B8",
                    background: "#FAFBFC", borderBottom: "1px solid #F1F5F9"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingRecent ? (
                <tr>
                  <td colSpan={4} style={{ padding: 30, textAlign: "center", fontSize: 13, color: "#94A3B8" }}>
                    Đang tải hoạt động...
                  </td>
                </tr>
              ) : recentApps.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 30, textAlign: "center", fontSize: 13, color: "#94A3B8" }}>
                    Chưa có hoạt động gần đây
                  </td>
                </tr>
              ) : (
                recentApps.map((app, idx) => {
                  const statusC = STATUS_COLORS[app.status] || STATUS_COLORS.DRAFT;
                  const avatarColors = [
                    { bg: "#FEE2E2", color: "#DC2626" },
                    { bg: "#DBEAFE", color: "#1D4ED8" },
                    { bg: "#D1FAE5", color: "#065F46" },
                    { bg: "#FEF3C7", color: "#92400E" },
                    { bg: "#EDE9FE", color: "#5B21B6" },
                  ];
                  const ac = avatarColors[idx % avatarColors.length];
                  return (
                    <tr key={app.id} style={{ cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#FAFBFC"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      onClick={() => navigate(`/officer/applicants/${app.id}`)}
                    >
                      <td style={{ padding: "14px 20px", borderBottom: "1px solid #F8FAFC" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: ac.bg, color: ac.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: 12, flexShrink: 0
                          }}>{getInitials(app.studentName)}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{app.studentName}</div>
                            <div style={{ fontSize: 11, color: "#94A3B8" }}>{app.applicationCode}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#475569", borderBottom: "1px solid #F8FAFC" }}>
                        {app.majorName || "Kỹ thuật phần mềm"}
                      </td>
                      <td style={{ padding: "14px 20px", borderBottom: "1px solid #F8FAFC" }}>
                        <span style={{
                          display: "inline-block", padding: "4px 10px", borderRadius: 999,
                          fontSize: 11, fontWeight: 700, background: statusC.bg, color: statusC.color
                        }}>
                          {STATUS_LABELS[app.status]}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#94A3B8", borderBottom: "1px solid #F8FAFC" }}>
                        {app.submittedAt ? (() => {
                          const mins = Math.round((Date.now() - new Date(app.submittedAt)) / 60000);
                          if (mins < 60) return `${mins} phút trước`;
                          if (mins < 1440) return `${Math.round(mins / 60)} giờ trước`;
                          return `${Math.round(mins / 1440)} ngày trước`;
                        })() : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS SECTION */}
      
      {/* 1. Smart Suggestions Sidebar-style Dialog */}
      {showSuggestionsModal && suggestions.length > 0 && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 20
        }} onClick={() => setShowSuggestionsModal(false)}>
          <div style={{
            background: "white", borderRadius: 20, width: "100%", maxWidth: 840,
            height: "80vh", display: "grid", gridTemplateColumns: "280px 1fr",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            position: "relative", overflow: "hidden",
            animation: "modalFadeIn 0.2s ease-out"
          }} onClick={e => e.stopPropagation()}>
            {/* Left Column - Suggestions Sidebar */}
            <div style={{
              background: "#F8FAFC", borderRight: "1px solid #E2E8F0",
              display: "flex", flexDirection: "column", overflowY: "auto"
            }}>
              <div style={{ padding: 18, borderBottom: "1px solid #E2E8F0" }}>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  💡 Gợi ý của AI ({suggestions.length})
                </h4>
              </div>
              <div style={{ flex: 1, padding: "10px 0" }}>
                {suggestions.map((sug, idx) => {
                  const isActive = idx === activeSuggestionIndex;
                  const indicatorColor = sug.type === "warning" ? "#EF4444" : sug.type === "opportunity" ? "#3B82F6" : sug.type === "action" ? "#F59E0B" : "#10B981";
                  return (
                    <div key={idx} onClick={() => setActiveSuggestionIndex(idx)} style={{
                      padding: "12px 18px", cursor: "pointer",
                      borderLeft: `4px solid ${isActive ? indicatorColor : "transparent"}`,
                      background: isActive ? "#FFF7ED" : "transparent",
                      transition: "all 0.15s"
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? "#FF6B35" : "#334155", marginBottom: 3 }}>
                        {sug.title}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {sug.message}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Detail Pane */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", background: "white", padding: 24, overflowY: "auto" }}>
              <div>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, borderBottom: "1px solid #F1F5F9", paddingBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 800,
                      background: suggestions[activeSuggestionIndex].type === "warning" ? "#FEE2E2" : suggestions[activeSuggestionIndex].type === "opportunity" ? "#EFF6FF" : "#FFF7ED",
                      color: suggestions[activeSuggestionIndex].type === "warning" ? "#DC2626" : suggestions[activeSuggestionIndex].type === "opportunity" ? "#2563EB" : "#D97706"
                    }}>
                      {suggestions[activeSuggestionIndex].type?.toUpperCase()}
                    </div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 850, color: "#0F172A" }}>
                      {suggestions[activeSuggestionIndex].title}
                    </h3>
                  </div>
                  <button onClick={() => setShowSuggestionsModal(false)} style={{
                    background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94A3B8", fontWeight: 700
                  }}>×</button>
                </div>

                {/* Detail Contents */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase" }}>Tóm tắt phát hiện</label>
                    <p style={{ margin: "4px 0 0", fontSize: 14, color: "#334155", lineHeight: 1.5 }}>
                      {suggestions[activeSuggestionIndex].message}
                    </p>
                  </div>

                  {suggestions[activeSuggestionIndex].details && (
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase" }}>Giải thích của AI</label>
                      <p style={{ margin: "4px 0 0", fontSize: 14, color: "#334155", lineHeight: 1.5, background: "#FAFBFC", padding: 12, borderRadius: 8, borderLeft: "3px solid #FF6B35" }}>
                        {suggestions[activeSuggestionIndex].details}
                      </p>
                    </div>
                  )}

                  {suggestions[activeSuggestionIndex].impact && (
                    <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#047857", marginBottom: 2 }}>TÁC ĐỘNG DỰ BÁO</div>
                      <div style={{ fontSize: 13, color: "#065F46", fontWeight: 600 }}>{suggestions[activeSuggestionIndex].impact}</div>
                    </div>
                  )}

                  {suggestions[activeSuggestionIndex].recommendations && suggestions[activeSuggestionIndex].recommendations.length > 0 && (
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 800, color: "#94A3B8", textTransform: "uppercase" }}>Hành động gợi ý thực thi</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                        {suggestions[activeSuggestionIndex].recommendations.map((rec, rIdx) => (
                          <div key={rIdx} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#475569" }}>
                            <div style={{
                              width: 18, height: 18, borderRadius: "50%", background: "#FFF7ED", color: "#C2410C",
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1
                            }}>{rIdx + 1}</div>
                            <div>{rec}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end", borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
                <button onClick={() => setShowSuggestionsModal(false)} style={{
                  padding: "8px 16px", background: "white", border: "1px solid #E2E8F0", borderRadius: 8,
                  fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer"
                }}>Đóng</button>
                {suggestions[activeSuggestionIndex].actionUrl && (
                  <button onClick={() => { setShowSuggestionsModal(false); navigate(suggestions[activeSuggestionIndex].actionUrl); }} style={{
                    padding: "8px 18px", background: "#FF6B35", border: "none", borderRadius: 8,
                    fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 5
                  }}>
                    Thực thi ngay <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. AI Forecasting Deep Analysis Modal */}
      {showAIModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, padding: 20
        }} onClick={() => setShowAIModal(false)}>
          <div style={{
            background: "white", borderRadius: 20, width: "100%", maxWidth: 960,
            padding: 28, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            position: "relative", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24,
            animation: "modalFadeIn 0.2s ease-out"
          }} onClick={e => e.stopPropagation()}>
            
            {/* Close Button */}
            <button onClick={() => setShowAIModal(false)} style={{
              position: "absolute", top: 20, right: 20, background: "#F1F5F9", border: "none",
              width: 28, height: 28, borderRadius: "50%", cursor: "pointer", color: "#64748B",
              fontWeight: 700, fontSize: 14
            }}>×</button>

            {/* Left Side: Dynamic Regression Curve Chart */}
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                Đồ thị dự đoán tích lũy hồ sơ (AI Regression Curve)
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: 12, color: "#64748B" }}>
                Biểu diễn đường tích lũy thực tế của 30 ngày qua và đường hồi quy dự đoán 30 ngày kế tiếp.
              </p>
              
              <AICurveChart 
                historical={aiPrediction.historicalPoints || []}
                forecast={aiPrediction.forecastPoints || []}
                quota={aiPrediction.quota || 18000}
                predictedTotal={aiPrediction.predictedTotal || 0}
              />
              
              {/* Legend */}
              <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 12, fontSize: 11, color: "#475569" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 3, background: "#FF6B35" }} />
                  <span>Thực tế tích lũy (30 ngày)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 3, borderTop: "3px dashed #8B5CF6" }} />
                  <span>Dự báo hồi quy (30 ngày tới)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 14, height: 2, borderTop: "2px dashed #EF4444" }} />
                  <span>Chỉ tiêu ({aiPrediction.quota?.toLocaleString()})</span>
                </div>
              </div>
            </div>

            {/* Right Side: AI Model learning parameters & explanations */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderLeft: "1px solid #E2E8F0", paddingLeft: 20 }}>
              <div>
                <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                  Mô hình học máy dự báo
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#10B981", fontWeight: 700, marginBottom: 14 }}>
                  <Sparkles size={14} /> TỰ ĐỘNG RETRAIN LIÊN TỤC THEO NGÀY
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Equations */}
                  <div style={{ background: "#F8FAFC", borderRadius: 8, padding: 12, border: "1px solid #E2E8F0" }}>
                    <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, textTransform: "uppercase" }}>Phương trình hồi quy của mô hình</div>
                    <div style={{ fontSize: 14, fontWeight: 850, color: "#0F172A", marginTop: 4, fontFamily: "monospace" }}>
                      y = {aiPrediction.slope} * x + {Math.round(aiPrediction.predictedTotal - aiPrediction.totalNow - aiPrediction.slope * 30)}
                    </div>
                    <div style={{ fontSize: 9, color: "#64748B", marginTop: 2 }}>Trong đó: x là chỉ số ngày (31-60), y là lượng nộp dự kiến bổ sung.</div>
                  </div>

                  {/* Metrics grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div style={{ background: "#F0FDF4", borderRadius: 8, padding: 10, border: "1px solid #DCFCE7" }}>
                      <span style={{ fontSize: 9, color: "#166534", fontWeight: 700 }}>HỆ SỐ PHÙ HỢP (R²)</span>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#15803d", marginTop: 2 }}>{aiPrediction.r2}</div>
                      <div style={{ fontSize: 8, color: "#166534", marginTop: 2 }}>Độ khớp của hàm {aiPrediction.r2 >= 0.9 ? "Xuất sắc" : "Khá tốt"}</div>
                    </div>
                    <div style={{ background: "#FFF1F2", borderRadius: 8, padding: 10, border: "1px solid #FFE4E6" }}>
                      <span style={{ fontSize: 9, color: "#9F1239", fontWeight: 700 }}>SAI SỐ BÌNH PHƯƠNG (MSE)</span>
                      <div style={{ fontSize: 16, fontWeight: 900, color: "#BE123C", marginTop: 2 }}>{aiPrediction.mse}</div>
                      <div style={{ fontSize: 8, color: "#9F1239", marginTop: 2 }}>Sai lệch trung bình của mô hình</div>
                    </div>
                  </div>

                  {/* Summary Lists */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#475569" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 6 }}>
                      <span>Tổng hồ sơ hiện tại:</span>
                      <strong style={{ color: "#0F172A" }}>{aiPrediction.totalNow?.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 6 }}>
                      <span>Dự báo nộp thêm (30 ngày tới):</span>
                      <strong style={{ color: "#FF6B35" }}>{Math.round(aiPrediction.predictedTotal - aiPrediction.totalNow)?.toLocaleString()} hồ sơ</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 6 }}>
                      <span>Dự báo tổng cuối kỳ:</span>
                      <strong style={{ color: "#8B5CF6" }}>{aiPrediction.predictedTotal?.toLocaleString()} hồ sơ</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 6 }}>
                      <span>Tốc độ trung bình (7 ngày qua):</span>
                      <strong style={{ color: "#0F172A" }}>{aiPrediction.avgDaily7} hồ sơ/ngày</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 6 }}>
                      <span>Tốc độ trung bình (30 ngày qua):</span>
                      <strong style={{ color: "#0F172A" }}>{aiPrediction.avgDaily30} hồ sơ/ngày</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9", paddingBottom: 6 }}>
                      <span>Tăng trưởng tốc độ (Growth rate):</span>
                      <strong style={{ color: aiPrediction.growthRate >= 0 ? "#10B981" : "#EF4444" }}>
                        {aiPrediction.growthRate >= 0 ? "+" : ""}{aiPrediction.growthRate}%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close controls */}
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
                <button onClick={() => setShowAIModal(false)} style={{
                  padding: "8px 18px", background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                  border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, color: "white",
                  cursor: "pointer", boxShadow: "0 4px 10px rgba(255,107,53,0.2)"
                }}>
                  Đồng ý & Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
