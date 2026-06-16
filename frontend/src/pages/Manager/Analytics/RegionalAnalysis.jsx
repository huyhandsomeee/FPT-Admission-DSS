import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import { Filter, MoreHorizontal } from "lucide-react";

const REGIONAL = [
  {
    name: "Miền Nam", pct: "47.5%", count: 9500,
    icon: "🏙️", iconBg: "#1a2e6e", color: "#1D4ED8", borderColor: "#1D4ED8"
  },
  {
    name: "Miền Bắc", pct: "36%", count: 7200,
    icon: "🏛️", iconBg: "#065F46", color: "#16A34A", borderColor: "#059669"
  },
  {
    name: "Miền Trung", pct: "16.5%", count: 3300,
    icon: "⛰️", iconBg: "#92400E", color: "#D97706", borderColor: "#D97706"
  },
];

const PROVINCE_DATA = [
  { province: "Hà Nội", count: 4200 },
  { province: "TP.HCM", count: 5800 },
  { province: "Đà Nẵng", count: 1900 },
  { province: "Đồng Nai", count: 1200 },
  { province: "Bình Dương", count: 900 },
  { province: "Hải Phòng", count: 850 },
  { province: "Nghệ An", count: 750 },
  { province: "Thanh Hóa", count: 720 },
  { province: "Cần Thơ", count: 680 },
  { province: "Khánh Hòa", count: 500 },
];

const CAMPUS_DATA = [
  { campus: "Hà Nội", mụcTiêu: 7000, thựcTế: 7500 },
  { campus: "TP.HCM", mụcTiêu: 7500, thựcTế: 8000 },
  { campus: "Đà Nẵng", mụcTiêu: 2500, thựcTế: 1900 },
  { campus: "Cần Thơ", mụcTiêu: 1500, thựcTế: 1200 },
  { campus: "Quy Nhơn", mụcTiêu: 1000, thựcTế: 800 },
];

export default function RegionalAnalysis() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title */}
      <div>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: "#0F172A" }}>Phân tích theo vùng địa lý</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
          Phân bố thí sinh theo vùng miền và tỉnh thành
        </p>
      </div>

      {/* Region KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {REGIONAL.map((r) => (
          <div key={r.name} style={{
            background: "white", borderRadius: 14, padding: "22px 24px",
            border: "1px solid #E8EDF5",
            borderTop: `3px solid ${r.borderColor}`,
            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
            textAlign: "center"
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: r.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, margin: "0 auto 14px"
            }}>
              {r.icon}
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: r.color, lineHeight: 1 }}>{r.pct}</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1E293B", marginTop: 6 }}>{r.name}</div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 3 }}>{r.count.toLocaleString()} thí sinh</div>
          </div>
        ))}
      </div>

      {/* Top 10 province bar chart */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Top 10 tỉnh thành có nhiều thí sinh nhất</h3>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "none", border: "1px solid #E2E8F0", borderRadius: 7, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center", color: "#64748B" }}>
              <Filter size={14} />
            </button>
            <button style={{ background: "none", border: "1px solid #E2E8F0", borderRadius: 7, padding: "5px 8px", cursor: "pointer", display: "flex", alignItems: "center", color: "#64748B" }}>
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        {/* Divider lines (mimicking the image) */}
        <div style={{ borderTop: "1px solid #F1F5F9", marginBottom: 8 }} />
        <div style={{ borderTop: "1px solid #F1F5F9", marginBottom: 8 }} />
        <div style={{ borderTop: "1px solid #F1F5F9", marginBottom: 8 }} />

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={PROVINCE_DATA} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="province" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={(v) => v.toLocaleString()} />
            <Bar dataKey="count" fill="#1D4ED8" radius={[5, 5, 0, 0]} name="Số thí sinh" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Campus chart */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Hồ sơ theo cơ sở</h3>
          <div style={{ display: "flex", gap: 14 }}>
            {[{ color: "#1D4ED8", label: "Mục tiêu" }, { color: "#94A3B8", label: "Thực tế" }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
                <span style={{ fontSize: 12, color: "#64748B" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={CAMPUS_DATA} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="campus" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={(v) => v.toLocaleString()} />
            <Bar dataKey="mụcTiêu" fill="#1D4ED8" radius={[5, 5, 0, 0]} name="Mục tiêu" />
            <Bar dataKey="thựcTế" fill="#CBD5E1" radius={[5, 5, 0, 0]} name="Thực tế" />
          </BarChart>
        </ResponsiveContainer>

        {/* Footer */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #F1F5F9", textAlign: "center" }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>Academic Fidelity © 2024 Admissions Intelligence Engine. Built for Institutional Integrity.</span>
        </div>
      </div>
    </div>
  );
}
