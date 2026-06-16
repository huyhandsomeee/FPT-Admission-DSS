import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { TrendingUp, Calendar, BarChart2 } from "lucide-react";

const MONTHLY_DATA = [
  { month: "T1", hồSơ: 1200 }, { month: "T2", hồSơ: 2100 }, { month: "T3", hồSơ: 4500 },
  { month: "T4", hồSơ: 3800 }, { month: "T5", hồSơ: 2900 }, { month: "T6", hồSơ: 1800 },
  { month: "T7", hồSơ: 1200 }, { month: "T8", hồSơ: 900 },
];

const YOY_DATA = [
  { year: "2021", tích_lũy: 12000 },
  { year: "2022", tích_lũy: 14500 },
  { year: "2023", tích_lũy: 15000 },
  { year: "2024", tích_lũy: 17000 },
  { year: "2025", tích_lũy: 20000 },
];

const FORECAST_ENROLLMENT = [
  { year: "2025", thực_tế: 12000, dự_báo: 12000 },
  { year: "2026", thực_tế: null, dự_báo: 13500 },
  { year: "2027", thực_tế: null, dự_báo: 15200 },
  { year: "2028", thực_tế: null, dự_báo: 17000 },
];

const YEARS = ["2025", "2024", "2023"];

export default function OverviewChart() {
  const [selectedYear, setSelectedYear] = useState("2025");

  const summaryStats = [
    { label: "Tăng trưởng YoY", value: "+18%", color: "#16A34A", iconBg: "#F0FDF4", icon: TrendingUp, borderColor: "#16A34A" },
    { label: "Tháng cao điểm", value: "T3 - T4", color: "#2563EB", iconBg: "#EFF6FF", icon: Calendar, borderColor: "#2563EB" },
    { label: "Dự báo 2026", value: "23,600", color: "#D97706", iconBg: "#FFF7ED", icon: BarChart2, borderColor: "#D97706" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#2563EB", marginBottom: 4 }}>Xu hướng tuyển sinh</div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: "#0F172A" }}>
            Phân tích xu hướng theo tháng và theo năm
            <span style={{ fontWeight: 400, color: "#94A3B8" }}> (Admissions Trend Analysis)</span>
          </h1>
        </div>
        {/* Year switcher */}
        <div style={{ display: "flex", gap: 4, background: "white", border: "1px solid #E2E8F0", borderRadius: 10, padding: 4 }}>
          {YEARS.map(y => (
            <button key={y} onClick={() => setSelectedYear(y)}
              style={{
                padding: "6px 14px", borderRadius: 7, border: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 600,
                background: selectedYear === y ? "#1D4ED8" : "transparent",
                color: selectedYear === y ? "white" : "#64748B",
                transition: "all 0.2s"
              }}>
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Bar chart monthly */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1E293B" }}>Hồ sơ theo tháng ({selectedYear})</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D4ED8" }} />
              <span style={{ fontSize: 12, color: "#64748B" }}>Hồ sơ mới</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={MONTHLY_DATA} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={(v) => v.toLocaleString()} />
              <Bar dataKey="hồSơ" fill="#1D4ED8" radius={[6, 6, 0, 0]} name="Số hồ sơ" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* YoY Line chart */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1E293B" }}>Tổng hồ sơ theo năm (YoY)</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D4ED8" }} />
              <span style={{ fontSize: 12, color: "#64748B" }}>Tổng tích lũy</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={YOY_DATA} margin={{ right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={v => v.toLocaleString()} />
              <Line type="monotone" dataKey="tích_lũy" stroke="#1D4ED8" strokeWidth={2.5}
                dot={{ r: 6, fill: "white", stroke: "#1D4ED8", strokeWidth: 2 }} name="Tổng hồ sơ" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {summaryStats.map((stat) => (
          <div key={stat.label} style={{
            background: "white", borderRadius: 14, padding: "22px 24px",
            border: "1px solid #E8EDF5",
            borderTop: `3px solid ${stat.borderColor}`,
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            textAlign: "center"
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: stat.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px"
            }}>
              <stat.icon size={20} color={stat.color} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 6, fontWeight: 500 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Enrollment forecast */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Dự báo tỷ lệ nhập học (2025-2028)</h3>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94A3B8" }}>Mô hình phân tích xu hướng dài hạn (ARIMA Model applied)</p>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", color: "#7C3AED", background: "#F5F3FF", padding: "4px 10px", borderRadius: 6 }}>
            ARIMA MODEL
          </span>
        </div>

        {/* Forecast preview box */}
        <div style={{
          background: "#EFF6FF", border: "1px solid #BFDBFE",
          borderRadius: 10, padding: "10px 14px", display: "inline-block",
          marginBottom: 16, marginTop: 8
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8", marginBottom: 4 }}>2026</div>
          <div style={{ fontSize: 13, display: "flex", gap: 16 }}>
            <span>Dự báo: <strong style={{ color: "#1D4ED8" }}>13,500</strong></span>
            <span>Thực tế: <strong style={{ color: "#16A34A" }}>12,800</strong></span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={FORECAST_ENROLLMENT} margin={{ right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={v => v?.toLocaleString() ?? "N/A"} />
            <Line type="monotone" dataKey="thực_tế" stroke="#059669" strokeWidth={2.5} dot={{ r: 5, fill: "#059669", strokeWidth: 0 }} name="Thực tế" connectNulls={false} />
            <Line type="monotone" dataKey="dự_báo" stroke="#2563EB" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 4, fill: "white", stroke: "#2563EB", strokeWidth: 2 }} name="Dự báo" connectNulls={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
