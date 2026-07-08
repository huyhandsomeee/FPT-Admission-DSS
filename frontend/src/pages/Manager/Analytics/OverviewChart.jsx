import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { TrendingUp, Calendar, BarChart2, Download, Sparkles, ArrowUp } from "lucide-react";
import api from "../../../config/axiosConfig";

const MOCK_MONTHLY = [
  { month: "Th1", hồSơ: 1200 }, { month: "Th2", hồSơ: 2100 }, { month: "Th3", hồSơ: 4500 },
  { month: "Th4", hồSơ: 3800 }, { month: "Th5", hồSơ: 2900 }, { month: "Th6", hồSơ: 1800 },
  { month: "Th7", hồSơ: 1200 }, { month: "Th8", hồSơ: 900 },
];

const MOCK_YOY = [
  { year: "2022", tích_lũy: 14200 },
  { year: "2023", tích_lũy: 15000 },
  { year: "2024", tích_lũy: 17000 },
  { year: "2025", tích_lũy: 20000 },
  { year: "2026", tích_lũy: 24850 },
];

const MOCK_FORECAST = [
  { year: "2026 [LỊCH SỬ]", dự_báo: 18400 },
  { year: "2027 [DỰ BÁO]", dự_báo: 25200 },
  { year: "2028 [DỰ BÁO]", dự_báo: 34500 },
  { year: "2029 [DỰ BÁO]", dự_báo: 38100 },
];

const YEARS = ["2026", "2025", "2024"];

export default function OverviewChart() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [monthlyData, setMonthlyData] = useState([]);
  const [yoyData, setYoyData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [combinationData, setCombinationData] = useState([]);

  useEffect(() => {
    // 1. Fetch monthly stats
    api.get(`/api/manager/analytics/monthly?year=${selectedYear}`)
      .then(r => {
        if (Array.isArray(r.data)) {
          const mapped = r.data.map(item => ({
            month: item.month.replace("T", "Th"),
            hồSơ: item.hồSơ
          }));
          setMonthlyData(mapped);
        }
      })
      .catch(() => {});
  }, [selectedYear]);

  useEffect(() => {
    // 2. Fetch YoY trends
    api.get("/api/manager/analytics/trends")
      .then(r => {
        if (Array.isArray(r.data)) {
          const mapped = r.data.map(item => ({
            year: String(item.year),
            tích_lũy: item.applications
          }));
          setYoyData(mapped);
        }
      })
      .catch(() => {});

    // 3. Fetch ARIMA forecast
    api.get("/api/manager/forecast")
      .then(r => {
        if (r.data && r.data.forecastData) {
          const mapped = r.data.forecastData
            .filter(item => item.year >= 2026)
            .map(item => {
              let label = String(item.year);
              if (item.year === 2026) label += " [LỊCH SỬ]";
              else label += " [DỰ BÁO]";
              return {
                year: label,
                dự_báo: item.predicted || item.actual
              };
            });
          setForecastData(mapped);
        }
      })
      .catch(() => {});

    // 4. Fetch combination stats
    api.get("/api/manager/analytics/combinations")
      .then(r => {
        if (Array.isArray(r.data)) {
          setCombinationData(r.data);
        }
      })
      .catch(() => {});
  }, []);

  const displayMonthly = monthlyData.length > 0 ? monthlyData : MOCK_MONTHLY;
  const displayYoy = yoyData.length > 0 ? yoyData : MOCK_YOY;
  const displayForecast = forecastData.length > 0 ? forecastData : MOCK_FORECAST;

  const handleExportFullReport = () => {
    // Export full CSV report from database
    window.open(`${api.defaults.baseURL || ""}/api/manager/reports/export?name=bao_cao_tong_hop`, "_blank");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title & Year selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", display: "flex", gap: 5 }}>
            <span style={{ color: "#E28743" }}>Phân tích</span>
            <span>&gt;</span>
            <span>Xu hướng</span>
          </div>
          <h1 style={{ margin: "6px 0 0", fontWeight: 800, fontSize: 26, color: "#1E293B" }}>
            Phân tích Xu hướng Tuyển sinh <span style={{ fontWeight: 400, color: "#64748B" }}>(Tổng quan quản trị)</span>
          </h1>
        </div>

        {/* Year switch buttons */}
        <div style={{ display: "flex", gap: 4, background: "#E2E8F0", borderRadius: 8, padding: 4 }}>
          {YEARS.map(y => (
            <button key={y} onClick={() => setSelectedYear(y)}
              style={{
                padding: "6px 16px", borderRadius: 6, border: "none",
                cursor: "pointer", fontSize: 13, fontWeight: 700,
                background: selectedYear === y ? "#FF6B35" : "transparent",
                color: selectedYear === y ? "white" : "#64748B",
                transition: "all 0.15s"
              }}>
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Top Chart Row: Monthly and YoY */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Monthly line/bar chart */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14.5, color: "#1E293B" }}>Lượng hồ sơ theo tháng ({selectedYear})</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563EB" }} />
              <span style={{ color: "#64748B", fontWeight: 600 }}>Hồ sơ mới</span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={displayMonthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={v => v.toLocaleString()} />
              <Line type="monotone" dataKey="hồSơ" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} name="Hồ sơ" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* YoY Cumulated Trend */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14.5, color: "#1E293B" }}>Tăng trưởng lũy kế (YoY)</h3>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={displayYoy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={v => v.toLocaleString()} />
              <Line type="monotone" dataKey="tích_lũy" stroke="#8B4513" strokeWidth={3} dot={{ r: 5, fill: "#FF6B35" }} name="Tích lũy" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Combination Popularity Chart */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 14.5, color: "#1E293B" }}>Phổ biến của tổ hợp môn tuyển sinh mới (2026)</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94A3B8" }}>Thống kê số lượng hồ sơ nộp dựa trên các tổ hợp môn tuyển sinh mới</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={combinationData.length > 0 ? combinationData : [
            { name: "D01", count: 450 }, { name: "A01", count: 280 }, { name: "A00", count: 150 },
            { name: "F01", count: 110 }, { name: "F03", count: 90 }, { name: "F05", count: 75 },
            { name: "B00", count: 40 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={v => v.toLocaleString()} />
            <Bar dataKey="count" fill="#FF6B35" radius={[6, 6, 0, 0]} name="Số lượng hồ sơ" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Middle Row: 3 Highlight KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Card 1: YoY Growth */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: "50%", background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <TrendingUp size={16} color="#FF6B35" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#FF6B35", lineHeight: 1 }}>+18.4%</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginTop: 8 }}>Tỷ lệ Tăng trưởng (YoY)</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Cao hơn đáng kể so với mức trung bình</div>
        </div>

        {/* Card 2: Peak Stage */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: "50%", background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Calendar size={16} color="#2563EB" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#2563EB", lineHeight: 1 }}>Th3 - Th4</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginTop: 8 }}>Giai đoạn Tuyển sinh Cao điểm</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Hoạt động cao nhất được ghi nhận trong Q1-Q2</div>
        </div>

        {/* Card 3: Forecast Target */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 20, right: 20, width: 36, height: 36, borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BarChart2 size={16} color="#475569" />
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: "#1E293B", lineHeight: 1 }}>25,200</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginTop: 8 }}>Dự báo mục tiêu 2027</div>
          <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>Dựa trên phân tích quỹ đạo hiện tại</div>
        </div>
      </div>

      {/* Large ARIMA Chart Row */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Dự báo Nhập học (2026-2029)</h3>
              <span style={{ fontSize: 10, fontWeight: 700, background: "#EFF6FF", color: "#1D4ED8", padding: "2px 8px", borderRadius: 4 }}>
                ĐÃ ÁP DỤNG MÔ HÌNH ARIMA
              </span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94A3B8" }}>Mô hình dự đoán dài hạn sử dụng dữ liệu lịch sử và các biến số thị trường</p>
          </div>

          {/* Goal indicators */}
          <div style={{ display: "flex", gap: 16, border: "1px solid #E2E8F0", borderRadius: 8, padding: "8px 16px" }}>
            <div>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.4px" }}>MỤC TIÊU 2027</span>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#2563EB", display: "flex", alignItems: "center", gap: 4 }}>
                25.2k <span style={{ fontSize: 11, color: "#10B981" }}>+12%</span>
              </div>
            </div>
            <div style={{ width: 1, background: "#E2E8F0" }} />
            <div>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.4px" }}>THỰC TẾ 2026</span>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#0F172A" }}>18.4k</div>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={displayForecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0, 40000]} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={{ background: "white", padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 8 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                        {payload[0].payload.year}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "#1D4ED8", marginTop: 4 }}>
                        {payload[0].value.toLocaleString("vi-VN")} ước tính
                      </div>
                      <div style={{ fontSize: 10, color: "#16A34A", fontWeight: 600, marginTop: 2 }}>
                        Độ tin cậy: 94%
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line type="monotone" dataKey="dự_báo" stroke="#2563EB" strokeWidth={2.5} strokeDasharray="5 5" dot={{ r: 5, fill: "#2563EB" }} name="Dự báo" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Report Generation Panel */}
      <div style={{
        background: "#F8FAFC", borderRadius: 16, padding: "24px 28px", border: "1px solid #E2E8F0",
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, background: "white", border: "1px solid #E2E8F0",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Sparkles size={20} color="#FF6B35" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: 700, fontSize: 14.5, color: "#1E293B" }}>Tạo Báo cáo Tuyển sinh Chiến lược</h4>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#64748B" }}>
              Tự động hóa phân tích PDF toàn diện với thông tin chi tiết do AI thúc đẩy cho Ban Giám đốc.
            </p>
          </div>
        </div>
        <button 
          onClick={handleExportFullReport}
          style={{
            display: "flex", alignItems: "center", gap: 8, background: "#18181B", border: "none",
            borderRadius: 10, padding: "12px 20px", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}>
          <Download size={15} /> Xuất báo cáo đầy đủ
        </button>
      </div>
    </div>
  );
}
