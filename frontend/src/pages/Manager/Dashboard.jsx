import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";
import { Users, CheckCircle, Target, Award, ArrowUpRight, Wifi, MoreHorizontal } from "lucide-react";

const MOCK_STATS = {
  totalApplications: 20000, approved: 14500, enrolled: 12000,
  underReview: 2800, rejected: 2700, quota: 20000,
};

const TREND_DATA = [
  { year: "2020", hồSơ: 10200, nhậpHọc: 8100 },
  { year: "2021", hồSơ: 12000, nhậpHọc: 9800 },
  { year: "2022", hồSơ: 14500, nhậpHọc: 11200 },
  { year: "2023", hồSơ: 15000, nhậpHọc: 12500 },
  { year: "2024", hồSơ: 17000, nhậpHọc: 14200 },
  { year: "2025", hồSơ: 20000, nhậpHọc: 12000 },
];

const STATUS_DATA = [
  { name: "Đã duyệt", value: 14500, color: "#16613A" },
  { name: "Đang xét", value: 2800, color: "#C8960C" },
  { name: "Từ chối", value: 2700, color: "#DC2626" },
];

const RECENT_RECORDS = [
  { name: "Nguyễn Văn Linh", initials: "NL", major: "Computer Science", region: "Hà Nội", status: "APPROVED", gpa: "3.85" },
  { name: "Phạm Minh Tú", initials: "PT", major: "Digital Marketing", region: "Đà Nẵng", status: "PENDING", gpa: "3.40" },
  { name: "Lê Hoàng Thảo", initials: "LT", major: "Business Admin", region: "TP. HCM", status: "APPROVED", gpa: "3.92" },
];

const INITIALS_COLORS = {
  NL: { bg: "#DBEAFE", color: "#1D4ED8" },
  PT: { bg: "#D1FAE5", color: "#065F46" },
  LT: { bg: "#FEE2E2", color: "#991B1B" },
};

const STATUS_STYLE = {
  APPROVED: { bg: "#D1FAE5", color: "#065F46", label: "APPROVED" },
  PENDING:  { bg: "#FEF3C7", color: "#92400E", label: "PENDING" },
  REJECTED: { bg: "#FEE2E2", color: "#991B1B", label: "REJECTED" },
};

// Custom donut center label
const DonutLabel = ({ viewBox, total }) => {
  const { cx, cy } = viewBox;
  return (
    <g>
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#1E293B" fontSize={22} fontWeight={800}>
        20k
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#94A3B8" fontSize={11} fontWeight={500}>
        TOTAL
      </text>
    </g>
  );
};

export default function ManagerDashboard() {
  const [stats, setStats] = useState(MOCK_STATS);

  useEffect(() => {
    api.get("/api/manager/dashboard").then(r => setStats(r.data)).catch(() => {});
  }, []);

  const kpis = [
    {
      label: "Tổng hồ sơ 2025", value: "20,000",
      badge: { text: "+18% VS 2024", bg: "#E8F0FD", color: "#1D4ED8" },
      icon: "👥", iconBg: "#EFF6FF",
      borderColor: "#2563EB",
    },
    {
      label: "Đã chấp thuận", value: "14,500",
      badge: { text: "72.5% APPROVED", bg: "#D1FAE5", color: "#065F46" },
      icon: "✅", iconBg: "#ECFDF5",
      borderColor: "#059669",
    },
    {
      label: "Đã nhập học", value: "12,000",
      badge: { text: "60% CHỈ TIÊU", bg: "#EFF6FF", color: "#1D4ED8" },
      icon: "🎓", iconBg: "#EFF6FF",
      borderColor: "#2563EB",
    },
    {
      label: "Chỉ tiêu 2025", value: "20,000",
      badge: { text: "ĐẠT 60%", bg: "#FEF3C7", color: "#92400E" },
      icon: "🎯", iconBg: "#FFF7ED",
      borderColor: "#D97706",
    },
  ];

  const totalStatus = STATUS_DATA.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 26, color: "#0F172A" }}>Dashboard Trưởng phòng</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
            Tổng quan tuyển sinh năm 2025 - Cập nhật thời gian thực
          </p>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#F0FDF4", border: "1px solid #BBF7D0",
          borderRadius: 20, padding: "5px 12px"
        }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#16A34A" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", letterSpacing: "0.5px" }}>LIVE: DATA SYNCED</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{
            background: "white", borderRadius: 14,
            padding: "20px 20px 18px",
            border: "1px solid #E8EDF5",
            borderTop: `3px solid ${kpi.borderColor}`,
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{
                width: 42, height: 42, background: kpi.iconBg, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
              }}>
                {kpi.icon}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.3px",
                background: kpi.badge.bg, color: kpi.badge.color,
                padding: "3px 8px", borderRadius: 999
              }}>
                {kpi.badge.text}
              </span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 6, fontWeight: 500 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Trend Line Chart */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: 6 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Xu hướng tuyển sinh 5 năm</h3>
            <p style={{ margin: "3px 0 0", fontSize: 12, color: "#94A3B8" }}>Phân tích so sánh hồ sơ và nhập học thực tế</p>
          </div>
          {/* Legend */}
          <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
            {[{ color: "#1D4ED8", label: "Hồ sơ" }, { color: "#16A34A", label: "Nhập học" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: l.color }} />
                <span style={{ fontSize: 12, color: "#64748B" }}>{l.label}</span>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={TREND_DATA} margin={{ right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}
                formatter={(v) => v.toLocaleString()}
              />
              <Line type="monotone" dataKey="hồSơ" stroke="#1D4ED8" strokeWidth={2.5} dot={{ r: 5, fill: "#1D4ED8", strokeWidth: 0 }} name="Hồ sơ" />
              <Line type="monotone" dataKey="nhậpHọc" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 5, fill: "#16A34A", strokeWidth: 0 }} name="Nhập học" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut Chart */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Trạng thái hồ sơ 2025</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={STATUS_DATA}
                cx="50%" cy="50%"
                innerRadius={62} outerRadius={90}
                paddingAngle={3} dataKey="value"
                startAngle={90} endAngle={-270}
              >
                {STATUS_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" fill="#1E293B" fontSize={22} fontWeight={800}>20k</text>
              <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" fill="#94A3B8" fontSize={11}>TOTAL</text>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
            {STATUS_DATA.map(item => (
              <div key={item.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
                  <span style={{ fontSize: 13, color: "#475569" }}>{item.name}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9" }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Hồ sơ gần đây</h3>
          <a href="/manager/analytics/overview" style={{ fontSize: 13, color: "#2563EB", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            View All Records <ArrowUpRight size={13} />
          </a>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#F8FAFC" }}>
              {["STUDENT NAME", "MAJOR", "REGION", "STATUS", "GPA", "ACTIONS"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.06em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_RECORDS.map((rec, i) => {
              const avatarStyle = INITIALS_COLORS[rec.initials] || { bg: "#F1F5F9", color: "#475569" };
              const statusStyle = STATUS_STYLE[rec.status] || STATUS_STYLE.PENDING;
              return (
                <tr key={i} style={{ borderTop: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "14px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", background: avatarStyle.bg, color: avatarStyle.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                        {rec.initials}
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "#1E293B" }}>{rec.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 14, color: "#475569" }}>{rec.major}</td>
                  <td style={{ padding: "14px 20px", fontSize: 14, color: "#475569" }}>{rec.region}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.5px", background: statusStyle.bg, color: statusStyle.color }}>
                      {statusStyle.label}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{rec.gpa}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 4, borderRadius: 4 }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
