import { useState, useEffect } from "react";
import api from "../../config/axiosConfig";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import { Users, Award, Target, TrendingUp, ArrowUp, Monitor } from "lucide-react";

const MOCK_TREND = [
  { year: "2021", thực_tế: 12000, dự_báo: 10000 },
  { year: "2022", thực_tế: 14500, dự_báo: 12500 },
  { year: "2023", thực_tế: 15000, dự_báo: 13000 },
  { year: "2024", thực_tế: 17000, dự_báo: 15000 },
  { year: "2025", thực_tế: 20000, dự_báo: 18000 },
];

const SOURCE_DATA = [
  { label: "Trực tuyến (Web/App)", pct: 65, color: "#1E293B" },
  { label: "Trực tiếp (THPT)", pct: 25, color: "#475569" },
  { label: "Khác", pct: 10, color: "#94A3B8" },
];

export default function ExecutiveDashboard() {
  const [stats, setStats] = useState(null);
  const [trendData, setTrendData] = useState([]);

  useEffect(() => {
    api.get("/api/manager/dashboard")
      .then(r => {
        if (r.data) setStats(r.data);
      })
      .catch(() => {});

    api.get("/api/manager/analytics/trends")
      .then(r => {
        if (Array.isArray(r.data)) {
          const mapped = r.data.map(item => ({
            year: String(item.year),
            thực_tế: item.enrolled,
            dự_báo: item.applications
          }));
          setTrendData(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const displayStats = stats || {
    totalApplications: 20000, approved: 14500, enrolled: 12000,
    underReview: 2800, rejected: 2700, quota: 20000, activeYear: 2026
  };

  const enrolledPercent = displayStats.quota > 0 ? Math.round((displayStats.enrolled / displayStats.quota) * 100) : 0;

  const kpis = [
    {
      label: `TỔNG HỒ SƠ ${displayStats.activeYear || 2026}`,
      value: displayStats.totalApplications?.toLocaleString() || "0",
      badge: { text: `Năm học ${displayStats.activeYear || 2026}`, color: "#16A34A", bg: "#DCFCE7" },
      icon: Users, iconBg: "#F1F5F9", iconColor: "#475569",
      borderColor: "#1E293B",
    },
    {
      label: "TỶ LỆ NHẬP HỌC",
      value: `${enrolledPercent}%`,
      badge: { text: "Trên chỉ tiêu", color: "#16A34A", bg: "#DCFCE7" },
      icon: Award, iconBg: "#ECFDF5", iconColor: "#16A34A",
      borderColor: "#16A34A",
    },
    {
      label: "CHỈ TIÊU ĐẠT ĐƯỢC",
      value: displayStats.enrolled?.toLocaleString() || "0",
      valueSub: `/${(displayStats.quota || 18000).toLocaleString()}`,
      badge: null,
      icon: Target, iconBg: "#EFF6FF", iconColor: "#2563EB",
      borderColor: "#2563EB",
    },
    {
      label: `DỰ BÁO ${displayStats.activeYear + 1 || 2027}`,
      value: Math.round(displayStats.quota * 1.125 || 22500).toLocaleString(),
      badge: { text: "+12.5%", color: "#D97706", bg: "#FEF3C7" },
      icon: TrendingUp, iconBg: "#FFF7ED", iconColor: "#D97706",
      borderColor: "#D97706",
    },
  ];

  const objectives = [
    {
      label: "Chỉ tiêu tổng hồ sơ",
      current: displayStats.totalApplications >= 1000 ? `${(displayStats.totalApplications / 1000).toFixed(1)}k` : displayStats.totalApplications,
      target: displayStats.quota >= 1000 ? `${(displayStats.quota / 1000).toFixed(0)}k` : displayStats.quota,
      progress: displayStats.quota > 0 ? Math.min(100, Math.round((displayStats.totalApplications / displayStats.quota) * 100)) : 0,
      progressLabel: "TIẾN ĐỘ HỒ SƠ",
      progressRight: `${displayStats.quota > 0 ? Math.round((displayStats.totalApplications / displayStats.quota) * 100) : 0}% MỤC TIÊU`,
      progressColor: "#0d1b3e",
    },
    {
      label: "Tỷ lệ nhập học thực tế",
      current: `${enrolledPercent}%`,
      target: "75%",
      progress: Math.min(100, Math.round((enrolledPercent / 75) * 100)),
      progressLabel: "HIỆU QUẢ CHUYỂN ĐỔI",
      progressRight: `${Math.min(100, Math.round((enrolledPercent / 75) * 100))}% MỤC TIÊU`,
      progressColor: "#22C55E",
    },
    {
      label: "Chỉ số hài lòng (CSAT)",
      current: "91%",
      target: "95%",
      progress: 95,
      progressLabel: "TRẢI NGHIỆM THÍ SINH",
      progressRight: "95% MỤC TIÊU",
      progressColor: "#22C55E",
    },
    {
      label: "Thời gian xét duyệt (avg)",
      current: "3.5",
      target: "ngày",
      progress: 85,
      progressLabel: "NĂNG SUẤT VẬN HÀNH",
      progressRight: "85% MỤC TIÊU",
      progressColor: "#3B82F6",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 28, color: "#0F172A" }}>Executive Dashboard</h1>
          <p style={{ margin: "5px 0 0", fontSize: 13, color: "#64748B" }}>
            Phân tích chuyên sâu &amp; Dự báo chiến lược Tuyển sinh {displayStats.activeYear || 2026}
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          background: "#F0FDF4", border: "1px solid #BBF7D0",
          borderRadius: 20, padding: "6px 14px"
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", letterSpacing: "0.4px" }}>
            Hệ thống đang hoạt động • Dữ liệu thời gian thực
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{
            background: "white", borderRadius: 14, padding: "20px 20px 16px",
            border: "1px solid #E8EDF5",
            borderTop: `3px solid ${kpi.borderColor}`,
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, background: kpi.iconBg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <kpi.icon size={20} color={kpi.iconColor} />
              </div>
              {kpi.badge && (
                <span style={{ fontSize: 10, fontWeight: 700, background: kpi.badge.bg, color: kpi.badge.color, padding: "3px 8px", borderRadius: 999, display: "flex", alignItems: "center", gap: 3 }}>
                  <ArrowUp size={9} /> {kpi.badge.text}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
              <span style={{ fontSize: 30, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{kpi.value}</span>
              {kpi.valueSub && <span style={{ fontSize: 14, color: "#94A3B8", fontWeight: 600 }}>{kpi.valueSub}</span>}
            </div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 6, fontWeight: 700, letterSpacing: "0.4px" }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* Trend chart */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: 6 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Xu hướng tuyển sinh 5 năm</h3>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94A3B8" }}>So sánh dữ liệu thực tế và dự báo tăng trưởng</p>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 12, marginTop: 8 }}>
            {[{ color: "#1E293B", label: "Thực tế" }, { color: "#22C55E", label: "Dự báo", dashed: true }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
                <span style={{ fontSize: 12, color: "#64748B" }}>{l.label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData.length > 0 ? trendData : MOCK_TREND} margin={{ right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v / 1000}k` : v} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={v => v.toLocaleString()} />
              <ReferenceLine y={50} stroke="#F1F5F9" />
              <ReferenceLine y={100} stroke="#F1F5F9" />
              <ReferenceLine y={500} stroke="#F1F5F9" />
              <ReferenceLine y={1000} stroke="#F1F5F9" />
              <Line type="monotone" dataKey="thực_tế" stroke="#1E293B" strokeWidth={2.5} dot={{ r: 5, fill: "#1E293B", strokeWidth: 0 }} name="Thực tế" />
              <Line type="monotone" dataKey="dự_báo" stroke="#22C55E" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 4, fill: "white", stroke: "#22C55E", strokeWidth: 2 }} name="Dự báo" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Mục tiêu 2025 */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 34, height: 34, background: "#0d1b3e", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "white", fontWeight: 900, fontSize: 14 }}>F</span>
            </div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Mục tiêu {displayStats.activeYear || 2026}</h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {objectives.map((obj, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 600 }}>{obj.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>
                    {obj.current} {obj.target !== "ngày" ? <span style={{ color: "#94A3B8" }}>/ {obj.target}</span> : <span style={{ color: "#94A3B8" }}>{obj.target}</span>}
                  </span>
                </div>
                <div style={{ width: "100%", height: 6, background: "#F1F5F9", borderRadius: 99, overflow: "hidden", marginBottom: 3 }}>
                  <div style={{ width: `${obj.progress}%`, height: "100%", background: obj.progressColor, borderRadius: 99, transition: "width 0.7s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.4px" }}>{obj.progressLabel}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: "#94A3B8" }}>{obj.progressRight}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: 3 cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Nguồn hồ sơ */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ width: 36, height: 36, background: "#F1F5F9", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Monitor size={17} color="#475569" />
            </div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1E293B" }}>Nguồn hồ sơ</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SOURCE_DATA.map((s) => (
              <div key={s.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: "#475569" }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{s.pct}%</span>
                </div>
                <div style={{ width: "100%", height: 6, background: "#F1F5F9", borderRadius: 99 }}>
                  <div style={{ width: `${s.pct}%`, height: "100%", background: s.color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cảnh báo rủi ro */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "2px solid #FCA5A5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, background: "#FEF2F2", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
            </div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#DC2626" }}>Cảnh báo rủi ro</h3>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
            Tốc độ rút hồ sơ tại khu vực <strong style={{ color: "#DC2626" }}>Miền Trung</strong> tăng 2% so với tuần trước. Cần rà soát ngay chính sách học bổng địa phương.
          </p>
          <div style={{ marginTop: 12, padding: "8px 12px", background: "#FEF2F2", borderRadius: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626" }}>❗ MỨC ĐỘ NGHIÊM TRỌNG: CAO</span>
          </div>
        </div>

        {/* Đề xuất hành động */}
        <div style={{ background: "#0d1b3e", borderRadius: 16, padding: 24, boxShadow: "0 4px 20px rgba(13,27,62,0.3)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -20, bottom: -20, opacity: 0.08 }}>
            <span style={{ fontSize: 120 }}>✨</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, background: "rgba(255,107,53,0.2)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18 }}>✨</span>
            </div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "white" }}>Đề xuất hành động</h3>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(200,220,255,0.85)", lineHeight: 1.6 }}>
            Tăng cường chiến dịch truyền thông "Sống trọn đam mê" tại TP.HCM để bù đáp sự giảm hồ sơ ở khu vực lân cận.
          </p>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
            border: "none", borderRadius: 10, padding: "10px 18px",
            color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
            boxShadow: "0 4px 12px rgba(255,107,53,0.3)"
          }}>
            XEM CHI TIẾT CHIẾN LƯỢC →
          </button>
        </div>
      </div>
    </div>
  );
}
