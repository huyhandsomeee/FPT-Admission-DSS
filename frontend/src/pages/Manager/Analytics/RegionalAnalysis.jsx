import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Filter, Download, Landmark, Building2, Palmtree, HelpCircle } from "lucide-react";
import api from "../../../config/axiosConfig";

const MOCK_REGIONS = [
  { name: "Miền Nam", pct: "47.5%", count: 9506, icon: Building2, color: "#92400E", iconBg: "#FEF3C7" },
  { name: "Miền Bắc", pct: "36.1%", count: 7221, icon: Landmark, color: "#1E3A8A", iconBg: "#DBEAFE" },
  { name: "Miền Trung", pct: "16.5%", count: 3300, icon: Palmtree, color: "#065F46", iconBg: "#D1FAE5" },
];

const MOCK_PROVINCES = [
  { province: "TP.HCM", count: 9506 },
  { province: "Hà Nội", count: 7221 },
  { province: "Đà Nẵng", count: 3300 },
  { province: "Đồng Nai", count: 1800 },
  { province: "Bình Dương", count: 1400 },
  { province: "Hải Phòng", count: 1200 },
  { province: "Nghệ An", count: 950 },
  { province: "Thanh Hóa", count: 800 },
  { province: "Cần Thơ", count: 680 },
  { province: "Khánh Hòa", count: 500 },
];

const MOCK_CAMPUSES = [
  { name: "FPT Hòa Lạc", pct: 92.4, status: "92.4% Hoàn thành", target: 8000, actual: 7400 },
  { name: "FPT Hồ Chí Minh", pct: 105, status: "Vượt chỉ tiêu", target: 8500, actual: 8950 },
  { name: "FPT Đà Nẵng", pct: 65, status: "65.0% Hoàn thành", target: 4000, actual: 2600 },
  { name: "FPT Cần Thơ", pct: 52.2, status: "52.2% Hoàn thành", target: 3000, actual: 1566 },
];

export default function RegionalAnalysis() {
  const [selectedRegion, setSelectedRegion] = useState("Tất cả vùng miền");
  const [selectedProvince, setSelectedProvince] = useState("Tất cả tỉnh thành");
  const [dbData, setDbData] = useState(null);

  useEffect(() => {
    // Fetch regional analytics from database
    api.get("/api/manager/analytics/regional")
      .then(r => {
        if (r.data) {
          setDbData(r.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleExport = () => {
    window.open(`${api.defaults.baseURL || ""}/api/manager/reports/export?name=phan_tich_vung_mien`, "_blank");
  };

  // Bind values dynamically if database has entries
  const regions = dbData?.regions || MOCK_REGIONS;
  const provinces = dbData?.provinces || MOCK_PROVINCES;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Route & Title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94A3B8", display: "flex", gap: 5 }}>
            <span style={{ color: "#E28743" }}>Phân tích</span>
            <span>&gt;</span>
            <span>Phân tích theo vùng địa lý</span>
          </div>
          <h1 style={{ margin: "6px 0 0", fontWeight: 800, fontSize: 26, color: "#1E293B" }}>Phân tích theo vùng địa lý</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
            Phân bố thí sinh theo vùng miền và tỉnh thành cả nước năm 2024
          </p>
        </div>

        {/* Year Dropdown & Export buttons */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{
            background: "white", border: "1px solid #E2E8F0", borderRadius: 10,
            padding: "8px 14px", fontSize: 13, color: "#334155", fontWeight: 600
          }}>
            Năm học 2024
          </div>
          <button 
            onClick={handleExport}
            style={{
              display: "flex", alignItems: "center", gap: 8, background: "#854D0E", border: "none",
              borderRadius: 10, padding: "8px 16px", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
              boxShadow: "0 2px 6px rgba(133,77,14,0.15)"
            }}
          >
            <Download size={14} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* 3 Regional KPI Cards at the Top */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {regions.map((r, i) => {
          // Fallback to standard icons if database returns string icons
          const Icon = typeof r.icon === "function" ? r.icon : (MOCK_REGIONS[i]?.icon || Landmark);
          const bg = r.iconBg || MOCK_REGIONS[i]?.iconBg || "#EFF6FF";
          const textCol = r.color || MOCK_REGIONS[i]?.color || "#1E3A8A";

          return (
            <div key={r.name} style={{
              background: "white", borderRadius: 16, padding: "20px 24px", border: "1px solid #E8EDF5",
              boxShadow: "0 1px 6px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: 18
            }}>
              {/* Icon box */}
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: bg,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Icon size={22} color={textCol} />
              </div>

              {/* Data content */}
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "#0F172A", lineHeight: 1.1 }}>{r.pct}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginTop: 4 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{r.count.toLocaleString("vi-VN")} thí sinh</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Sidebar filter + Bar chart */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: 20 }}>
        {/* Left Side: Filter box & Potential area callout */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Region Filters */}
          <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
            <h3 style={{ margin: "0 0 14px", fontWeight: 700, fontSize: 14, color: "#1E293B", display: "flex", alignItems: "center", gap: 6 }}>
              <Filter size={14} color="#64748B" /> Bộ lọc khu vực
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 6 }}>Vùng miền</label>
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1",
                    fontSize: 13, color: "#334155", background: "white", outline: "none"
                  }}
                >
                  <option>Tất cả vùng miền</option>
                  <option>Miền Bắc</option>
                  <option>Miền Trung</option>
                  <option>Miền Nam</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 6 }}>Tỉnh thành</label>
                <select 
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #CBD5E1",
                    fontSize: 13, color: "#334155", background: "white", outline: "none"
                  }}
                >
                  <option>Tất cả tỉnh thành</option>
                  <option>TP.HCM</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                  <option>Đồng Nai</option>
                  <option>Bình Dương</option>
                </select>
              </div>
            </div>
          </div>

          {/* Potential area callout (screenshot 4 left bottom card) */}
          <div style={{
            background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 16, padding: 20,
            display: "flex", flexDirection: "column", gap: 10
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 800, color: "#B45309" }}>
              <span>📈 Khu vực tiềm năng</span>
            </div>
            <p style={{ margin: 0, fontSize: 12.5, color: "#92400E", lineHeight: 1.5, fontWeight: 600 }}>
              Khu vực Miền Nam đang có mức tăng trưởng hồ sơ cao nhất (+12% so với 2023).
            </p>
            <a href="#" style={{ fontSize: 12.5, fontWeight: 700, color: "#B45309", textDecoration: "underline" }}>
              Xem chi tiết chiến dịch
            </a>
          </div>
        </div>

        {/* Right Side: Bar chart */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
          <h3 style={{ margin: "0 0 20px", fontWeight: 700, fontSize: 15, color: "#1E293B" }}>
            Top 10 tỉnh thành có nhiều thí sinh nhất
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={provinces} barSize={26}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="province" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E2E8F0" }} formatter={v => v.toLocaleString()} />
              <Bar dataKey="count" fill="#1D4ED8" radius={[5, 5, 0, 0]} name="Thí sinh" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Card: Campus targets vs actual progress bars */}
      <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Hồ sơ theo cơ sở (Chỉ tiêu vs Thực tế)</h3>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#94A3B8" }}>So sánh tỷ lệ lấp đầy tại các cơ sở đào tạo</p>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: 14, fontSize: 12, fontWeight: 600 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1D4ED8" }} />
              <span style={{ color: "#64748B" }}>Mục tiêu</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E2E8F0" }} />
              <span style={{ color: "#64748B" }}>Thực tế</span>
            </div>
          </div>
        </div>

        {/* Campuses progress bars list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {MOCK_CAMPUSES.map((c) => {
            // Cap percentage at 100 for visual bar, but label shows real text
            const barPct = Math.min(c.pct, 100);
            const isExceeded = c.status === "Vượt chỉ tiêu";

            return (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* Campus title */}
                <div style={{ width: 140, fontSize: 13, fontWeight: 700, color: "#334155" }}>{c.name}</div>
                
                {/* Progress bar container */}
                <div style={{ flex: 1, height: 26, background: "#F1F5F9", borderRadius: 6, position: "relative", overflow: "hidden", border: "1px solid #E2E8F0" }}>
                  <div style={{
                    width: `${barPct}%`, height: "100%",
                    background: isExceeded ? "linear-gradient(90deg, #1D4ED8, #FF6B35)" : "#1D4ED8",
                    borderRadius: "6px 0 0 6px", transition: "width 0.4s"
                  }} />
                  {/* Status label text overlay */}
                  <span style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    fontSize: 11, fontWeight: 700, color: isExceeded ? "#C2410C" : "#64748B"
                  }}>
                    {c.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Academic Fidelity footer */}
      <div style={{ textAlignment: "center", fontSize: 11, color: "#94A3B8", textAlign: "center", borderTop: "1px solid #E2E8F0", paddingTop: 16, marginTop: 10 }}>
        Academic Fidelity © 2024 Admissions Intelligence Engine. Xây dựng vì liêm chính học thuật.
      </div>
    </div>
  );
}
