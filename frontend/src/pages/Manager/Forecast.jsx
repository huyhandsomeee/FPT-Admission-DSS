import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import { LayoutGrid, CheckCircle, FileText, TrendingUp, Monitor, Cpu, Target, MoreHorizontal } from "lucide-react";

const FORECAST_DATA = [
  { year: "2021", actual: 12000, predicted: null },
  { year: "2022", actual: 14500, predicted: null },
  { year: "2023", actual: 15000, predicted: null },
  { year: "2024", actual: 17000, predicted: null },
  { year: "2025", actual: 20000, predicted: 20000 },
  { year: "2026", actual: null, predicted: 22500 },
  { year: "2027", actual: null, predicted: 25200 },
  { year: "2028", actual: null, predicted: 28200 },
];

const MODEL_CARDS = [
  {
    label: "Mô hình dự báo hiện tại",
    value: "Linear Regression + ARIMA",
    badge: { text: "ACTIVE", color: "#16A34A", bg: "#DCFCE7" },
    icon: LayoutGrid,
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    borderColor: "#2563EB",
  },
  {
    label: "Độ chính xác mô hình",
    value: "R² = 0.94",
    badge: { text: "↑ 0.02%", color: "#16A34A", bg: "#DCFCE7" },
    icon: CheckCircle,
    iconBg: "#ECFDF5",
    iconColor: "#16A34A",
    borderColor: "#16A34A",
  },
  {
    label: "Dự báo mục tiêu 2026",
    value: "22,500 hồ sơ",
    badge: null,
    icon: FileText,
    iconBg: "#FFF7ED",
    iconColor: "#D97706",
    borderColor: "#D97706",
  },
];

const INSIGHTS = [
  {
    icon: TrendingUp,
    iconBg: "#EFF6FF", iconColor: "#2563EB",
    title: "Xu hướng tăng trưởng ổn định ~12% mỗi năm",
    desc: "Dựa trên dữ liệu 5 năm gần nhất và biến động kinh tế vĩ mô.",
  },
  {
    icon: Monitor,
    iconBg: "#ECFDF5", iconColor: "#16A34A",
    title: "Ngành CNTT tiếp tục dẫn đầu về nhu cầu",
    desc: "Chiếm tỷ trọng >45% tổng hồ sơ dự kiến năm 2026.",
  },
  {
    icon: Target,
    iconBg: "#FFF7ED", iconColor: "#D97706",
    title: "Khuyến nghị tăng chỉ tiêu 15%",
    desc: "Đáp ứng nhu cầu tăng cao tại cơ sở TP.HCM và Hà Nội.",
  },
];

export default function ManagerForecast() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title */}
      <div>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: "#0F172A" }}>Analytics &amp; Decision Support</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
          Manager Portal - FPT Admission •{" "}
          <a href="#" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 600 }}>Dự báo tuyển sinh</a>
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94A3B8" }}>Mô hình hồi quy tuyến tính + ARIMA dự báo 3 năm tới</p>
      </div>

      {/* Model cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {MODEL_CARDS.map((card) => (
          <div key={card.label} style={{
            background: "white", borderRadius: 14, padding: "20px 22px",
            border: "1px solid #E8EDF5",
            borderTop: `3px solid ${card.borderColor}`,
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{
                width: 42, height: 42, borderRadius: 10,
                background: card.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <card.icon size={20} color={card.iconColor} />
              </div>
              {card.badge && (
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.3px",
                  background: card.badge.bg, color: card.badge.color,
                  padding: "3px 8px", borderRadius: 999
                }}>
                  {card.badge.text}
                </span>
              )}
            </div>
            <div style={{ fontWeight: 800, fontSize: 17, color: "#0F172A", lineHeight: 1.2 }}>{card.value}</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 5 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Forecast chart */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>
            Dự báo số lượng hồ sơ (2021-2028)
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {[
              { color: "#1D4ED8", label: "Thực tế" },
              { color: "#D97706", label: "Dự báo", dashed: true },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{
                  width: l.dashed ? 14 : 8,
                  height: l.dashed ? 2 : 8,
                  borderRadius: l.dashed ? 0 : "50%",
                  background: l.color,
                  borderTop: l.dashed ? `2px dashed ${l.color}` : undefined
                }} />
                <span style={{ fontSize: 12, color: "#64748B" }}>{l.label}</span>
              </div>
            ))}
            <span style={{ fontSize: 10, fontWeight: 700, background: "#F5F3FF", color: "#7C3AED", padding: "3px 9px", borderRadius: 5, letterSpacing: "0.5px" }}>
              LINEAR REGRESSION
            </span>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={FORECAST_DATA} margin={{ right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={v => v?.toLocaleString() ?? "N/A"} />
              <ReferenceLine x="2025" stroke="#E2E8F0" strokeDasharray="5 3" />
              <Line type="monotone" dataKey="actual" stroke="#1D4ED8" strokeWidth={2.5}
                dot={{ r: 5, fill: "#1D4ED8", strokeWidth: 0 }} connectNulls={false} name="Thực tế" />
              <Line type="monotone" dataKey="predicted" stroke="#D97706" strokeWidth={2}
                strokeDasharray="7 4" dot={{ r: 4, fill: "white", stroke: "#D97706", strokeWidth: 2 }}
                connectNulls={false} name="Dự báo" />
            </LineChart>
          </ResponsiveContainer>

          {/* Decision support callout */}
          <div style={{
            position: "absolute", right: 20, top: "30%",
            background: "white", borderRadius: 12, padding: "14px 16px",
            border: "1px solid #E2E8F0", boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            width: 220, zIndex: 10
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#7C3AED", letterSpacing: "0.5px", marginBottom: 8 }}>
              💡 DECISION SUPPORT
            </div>
            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#475569", lineHeight: 1.5 }}>
              Dựa trên mô hình ARIMA, hệ thống dự báo sự bùng nổ hồ sơ vào Q2-2026.
            </p>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 6 }}>
              <span style={{ display: "block" }}>● Tăng trưởng dự kiến: <strong>+12.4%</strong></span>
              <span style={{ display: "block" }}>● Độ tin cậy mô hình: <strong>Cao</strong></span>
            </div>
            <button style={{
              width: "100%", padding: "8px", background: "#1D4ED8",
              border: "none", borderRadius: 8, color: "white",
              fontWeight: 600, fontSize: 12, cursor: "pointer"
            }}>
              Xem chi tiết ARIMA
            </button>
          </div>
        </div>
      </div>

      {/* Bottom row: Insights + Predictive Health */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        {/* Insights */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Nhận định từ mô hình</h3>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {INSIGHTS.map((ins, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px", background: "#F8FAFC", borderRadius: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: ins.iconBg,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <ins.icon size={17} color={ins.iconColor} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#1E293B", marginBottom: 3 }}>{ins.title}</div>
                  <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{ins.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Health */}
        <div style={{
          background: "#1a2e6e", borderRadius: 16, padding: 24,
          boxShadow: "0 4px 20px rgba(26,46,110,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "white" }}>Predictive Health</h3>
            <button style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)", border: "none",
              color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700
            }}>+</button>
          </div>
          <p style={{ margin: "0 0 18px", fontSize: 11, color: "rgba(180,195,230,0.8)" }}>Model maintenance &amp; status</p>

          {/* Data Consistency */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Data Consistency</span>
              <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>98%</span>
            </div>
            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 99 }}>
              <div style={{ width: "98%", height: "100%", background: "#16A34A", borderRadius: 99 }} />
            </div>
          </div>

          {/* Model Drift */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>Model Drift</span>
              <span style={{ fontSize: 12, color: "white", fontWeight: 700 }}>Low (2%)</span>
            </div>
            <div style={{ width: "100%", height: 6, background: "rgba(255,255,255,0.15)", borderRadius: 99 }}>
              <div style={{ width: "2%", height: "100%", background: "#3B82F6", borderRadius: 99 }} />
            </div>
          </div>

          <button style={{
            width: "100%", padding: "10px",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10, color: "white",
            fontWeight: 600, fontSize: 13, cursor: "pointer",
            transition: "all 0.2s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            Retrain Model
          </button>
        </div>
      </div>
    </div>
  );
}
