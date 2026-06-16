import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea
} from "recharts";
import { Download, TrendingUp, ArrowUp } from "lucide-react";

const DATA = [
  { year: "2021", actual: 7000, predicted: null },
  { year: "2022", actual: 9500, predicted: null },
  { year: "2023", actual: 11000, predicted: null },
  { year: "2024", actual: 13500, predicted: null },
  { year: "2025", actual: 14000, predicted: 14000 },
  { year: "2026", actual: null, predicted: 19500 },
  { year: "2027", actual: null, predicted: 22000 },
];

const FORECAST_CARDS = [
  { year: 2026, value: "22,500", growth: "+12.5%", highlighted: false },
  { year: 2027, value: "25,200", growth: "+12%", highlighted: true },
  { year: 2028, value: "28,200", growth: "+11.9%", highlighted: false },
];

export default function ForecastReport() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 28, color: "#0F172A" }}>Báo cáo dự báo tuyển sinh</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#EFF6FF", color: "#1D4ED8", padding: "3px 10px", borderRadius: 5, letterSpacing: "0.4px" }}>
              AI-POWERED
            </span>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Dự báo đến năm 2027 • Mô hình hồi quy tuyến tính (Linear Regression)
            </span>
          </div>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#0d1b3e", border: "none", borderRadius: 10,
          padding: "10px 18px", color: "white",
          fontWeight: 700, fontSize: 13, cursor: "pointer",
          boxShadow: "0 2px 8px rgba(13,27,62,0.25)"
        }}>
          <Download size={15} /> Xuất PDF
        </button>
      </div>

      {/* Main forecast chart */}
      <div style={{ background: "white", borderRadius: 16, padding: 28, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>📊</span>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#1E293B" }}>Dự báo số lượng tuyển sinh</h3>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 16, height: 2, background: "#FF6B35", borderRadius: 99, borderTop: "2px dashed #FF6B35" }} />
              <span style={{ fontSize: 12, color: "#64748B" }}>Dự báo</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1E293B" }} />
              <span style={{ fontSize: 12, color: "#64748B" }}>Thực tế</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={DATA} margin={{ right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false}
              tickFormatter={v => `${v / 1000 > 0 ? (v / 1000).toFixed(1) : v}`}
              domain={[0, 26000]}
              ticks={[0, 6500, 13000, 19500, 26000]}
            />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={v => v?.toLocaleString() ?? "N/A"} />
            {/* shade the forecast area */}
            <ReferenceArea x1="2025" x2="2027" fill="#FFF7ED" fillOpacity={0.6} />
            <ReferenceLine x="2025" stroke="#E2E8F0" strokeDasharray="4 3" />
            <Line type="monotone" dataKey="actual" stroke="#1E293B" strokeWidth={2.5}
              dot={{ r: 6, fill: "white", stroke: "#1E293B", strokeWidth: 2 }} connectNulls={false} name="Thực tế" />
            <Line type="monotone" dataKey="predicted" stroke="#FF6B35" strokeWidth={2}
              strokeDasharray="7 4"
              dot={{ r: 5, fill: "white", stroke: "#FF6B35", strokeWidth: 2 }} connectNulls={false} name="Dự báo" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast year cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {FORECAST_CARDS.map((card) => (
          <div key={card.year} style={{
            background: "white", borderRadius: 14,
            padding: "22px 24px",
            border: card.highlighted ? "2px solid #FF6B35" : "1px solid #E8EDF5",
            boxShadow: card.highlighted ? "0 4px 20px rgba(255,107,53,0.15)" : "0 1px 6px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>Dự báo năm {card.year}</span>
              {card.highlighted
                ? <span style={{ fontSize: 16 }}>✨</span>
                : <TrendingUp size={16} color="#94A3B8" />
              }
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{card.value}</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 10, background: "#DCFCE7", padding: "4px 10px", borderRadius: 999 }}>
              <ArrowUp size={11} color="#16A34A" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#16A34A" }}>{card.growth}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insight banner */}
      <div style={{ background: "#0d1b3e", borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 52, height: 52, background: "rgba(255,107,53,0.2)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 24 }}>🔮</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "white" }}>Nhận định chiến lược AI</h3>
            <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,107,53,0.25)", color: "#FF6B35", padding: "3px 9px", borderRadius: 5, letterSpacing: "0.5px", border: "1px solid rgba(255,107,53,0.4)" }}>
              HIGH CONFIDENCE
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(200,220,255,0.85)", lineHeight: 1.7 }}>
            Dựa trên phân tích mô hình hồi quy, hệ thống ghi nhận xu hướng tăng trưởng ổn định{" "}
            <strong style={{ color: "white" }}>12%/năm</strong>. Khuyến nghị: Ưu tiên mở rộng cơ sở vật chất tại{" "}
            <strong style={{ color: "#FF6B35" }}>Campus Đà Nẵng</strong> và{" "}
            <strong style={{ color: "#FF6B35" }}>TP.HCM</strong> để sẵn sàng đáp ứng quy mô 28,000 sinh viên vào năm 2028.
          </p>
        </div>
        <button style={{
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 10, padding: "10px 18px", color: "white",
          fontWeight: 600, fontSize: 13, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap"
        }}>
          Xem chi tiết đề xuất
        </button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "12px 0", borderTop: "1px solid #F1F5F9" }}>
        <span style={{ fontSize: 12, color: "#94A3B8" }}>
          © 2024 FPT University  •  Hệ thống báo cáo điều hành thông minh (EDIS)  •  Phiên bản 2.4.0
        </span>
      </div>
    </div>
  );
}
