import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { ArrowUpRight } from "lucide-react";

const MAJOR_DATA = [
  { name: "Kỹ thuật phần mềm", count: 7200, rate: "76%", rateNum: 76, isTop: true },
  { name: "Trí tuệ nhân tạo", count: 4500, rate: "82%", rateNum: 82 },
  { name: "Quản trị kinh doanh", count: 3800, rate: "71%", rateNum: 71 },
  { name: "Thiết kế đồ họa", count: 1900, rate: "68%", rateNum: 68 },
  { name: "Tài chính ngân hàng", count: 1500, rate: "65%", rateNum: 65 },
  { name: "Marketing", count: 1100, rate: "70%", rateNum: 70 },
];

const MAX_COUNT = Math.max(...MAJOR_DATA.map(d => d.count));

const RANK_COLORS = ["#1a2e6e", "#1a2e6e", "#1a2e6e", "#94A3B8", "#94A3B8", "#94A3B8"];

export default function MajorAnalysis() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title */}
      <div>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: "#0F172A" }}>Phân tích theo ngành</h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
          Số lượng hồ sơ và tỷ lệ duyệt theo từng ngành đào tạo chính.
        </p>
      </div>

      {/* Horizontal bar chart */}
      <div style={{ background: "white", borderRadius: 16, padding: 28, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Số hồ sơ theo ngành học</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A" }} />
            <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>2024 Applications</span>
          </div>
        </div>

        {/* Custom horizontal bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {MAJOR_DATA.map((major, i) => {
            const barPct = (major.count / MAX_COUNT) * 100;
            return (
              <div key={major.name}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{major.name}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 600 }}>{major.count.toLocaleString()}</span>
                    {major.isTop && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "white", background: "#1a2e6e", padding: "2px 7px", borderRadius: 4 }}>TOP</span>
                    )}
                  </div>
                </div>
                <div style={{ width: "100%", height: 28, background: "#EEF2FF", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    width: `${barPct}%`, height: "100%",
                    background: i < 1 ? "#1a2e6e" : i < 3 ? "#2563EB" : "#7BA4E8",
                    borderRadius: 4,
                    transition: "width 0.7s ease"
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          {[0, 2000, 4000, 6000, 8000].map(v => (
            <span key={v} style={{ fontSize: 11, color: "#94A3B8" }}>{v}</span>
          ))}
        </div>
      </div>

      {/* Rankings Detail */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9" }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Major Rankings Detail</h3>
          <a href="#" style={{ fontSize: 13, color: "#2563EB", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 3 }}>
            View All Stats <ArrowUpRight size={13} />
          </a>
        </div>

        <div>
          {MAJOR_DATA.map((major, i) => (
            <div key={major.name} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 24px",
              borderBottom: i < MAJOR_DATA.length - 1 ? "1px solid #F8FAFC" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: i < 3 ? "#1a2e6e" : "#EEF2FF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: i < 3 ? "white" : "#64748B",
                  fontWeight: 800, fontSize: 15
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1E293B" }}>{major.name}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{major.count.toLocaleString()} hồ sơ đăng ký</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#1D4ED8" }}>{major.rate}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", letterSpacing: "0.4px" }}>TỶ LỆ DUYỆT</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: "12px 24px", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", textAlign: "center" }}>
          <span style={{ fontSize: 12, color: "#94A3B8" }}>© 2024 Academic Fidelity Portal. All rights reserved.</span>
          <button style={{ background: "none", border: "none", color: "#475569", fontSize: 12, cursor: "pointer", marginLeft: 16, display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
            ↪ Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
