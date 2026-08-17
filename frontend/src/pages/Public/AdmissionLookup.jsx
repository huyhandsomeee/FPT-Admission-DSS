import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, TrendingUp, TrendingDown, Minus, MapPin, BookOpen, Calendar } from "lucide-react";

/* ── Mock Data — Điểm chuẩn FPT University ── */
const CAMPUSES = ["Tất cả", "Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ", "Quy Nhon", "Bình Định"];
const METHODS = ["Tất cả", "THPT Quốc Gia", "Đánh giá năng lực", "Xét học bạ THPT", "SAT/ACT", "V-SAT"];
const YEARS = ["2026", "2025", "2024", "2023", "2022"];
const FACULTIES = ["Tất cả", "Công nghệ thông tin", "Kinh tế - Quản trị", "Ngôn ngữ", "Điện tử - Viễn thông", "Thiết kế", "Y tế"];

const RAW_DATA = [
  // IT
  { major: "Công nghệ thông tin", code: "7480201", faculty: "Công nghệ thông tin", campus: "Hà Nội", method: "THPT Quốc Gia", y2026: 24.5, y2025: 24.0, y2024: 23.75, y2023: 23.5, y2022: 23.0, quota: 800, enrolled: 756 },
  { major: "Công nghệ thông tin", code: "7480201", faculty: "Công nghệ thông tin", campus: "TP.HCM", method: "THPT Quốc Gia", y2026: 24.2, y2025: 23.8, y2024: 23.5, y2023: 23.0, y2022: 22.75, quota: 900, enrolled: 882 },
  { major: "Trí tuệ nhân tạo", code: "7480201AI", faculty: "Công nghệ thông tin", campus: "Hà Nội", method: "THPT Quốc Gia", y2026: 25.5, y2025: 25.0, y2024: 24.5, y2023: 24.0, y2022: null, quota: 300, enrolled: 298 },
  { major: "An toàn thông tin", code: "7480202", faculty: "Công nghệ thông tin", campus: "Hà Nội", method: "THPT Quốc Gia", y2026: 23.8, y2025: 23.5, y2024: 23.0, y2023: 22.75, y2022: 22.5, quota: 200, enrolled: 198 },
  { major: "Kỹ thuật phần mềm", code: "7480103", faculty: "Công nghệ thông tin", campus: "Đà Nẵng", method: "THPT Quốc Gia", y2026: 22.5, y2025: 22.0, y2024: 21.5, y2023: 21.25, y2022: 21.0, quota: 250, enrolled: 241 },
  // Business
  { major: "Quản trị kinh doanh", code: "7340101", faculty: "Kinh tế - Quản trị", campus: "Hà Nội", method: "THPT Quốc Gia", y2026: 22.0, y2025: 21.75, y2024: 21.5, y2023: 21.0, y2022: 20.75, quota: 500, enrolled: 498 },
  { major: "Marketing", code: "7340115", faculty: "Kinh tế - Quản trị", campus: "TP.HCM", method: "THPT Quốc Gia", y2026: 22.5, y2025: 22.0, y2024: 21.75, y2023: 21.5, y2022: 21.25, quota: 400, enrolled: 392 },
  { major: "Kế toán", code: "7340301", faculty: "Kinh tế - Quản trị", campus: "Cần Thơ", method: "THPT Quốc Gia", y2026: 20.5, y2025: 20.0, y2024: 19.75, y2023: 19.5, y2022: 19.25, quota: 200, enrolled: 187 },
  { major: "Tài chính - Ngân hàng", code: "7340201", faculty: "Kinh tế - Quản trị", campus: "Hà Nội", method: "THPT Quốc Gia", y2026: 21.0, y2025: 20.75, y2024: 20.5, y2023: 20.25, y2022: 20.0, quota: 300, enrolled: 289 },
  // Language
  { major: "Ngôn ngữ Anh", code: "7220201", faculty: "Ngôn ngữ", campus: "Hà Nội", method: "THPT Quốc Gia", y2026: 23.0, y2025: 22.75, y2024: 22.5, y2023: 22.25, y2022: 22.0, quota: 400, enrolled: 396 },
  { major: "Ngôn ngữ Nhật", code: "7220213", faculty: "Ngôn ngữ", campus: "TP.HCM", method: "THPT Quốc Gia", y2026: 21.5, y2025: 21.25, y2024: 21.0, y2023: 20.75, y2022: 20.5, quota: 200, enrolled: 189 },
  { major: "Ngôn ngữ Hàn Quốc", code: "7220210", faculty: "Ngôn ngữ", campus: "Đà Nẵng", method: "THPT Quốc Gia", y2026: 21.0, y2025: 20.75, y2024: 20.5, y2023: 20.25, y2022: 20.0, quota: 150, enrolled: 147 },
  // Design
  { major: "Thiết kế đồ họa", code: "7210403", faculty: "Thiết kế", campus: "Hà Nội", method: "Xét học bạ THPT", y2026: 22.0, y2025: 21.5, y2024: 21.0, y2023: 20.75, y2022: 20.5, quota: 200, enrolled: 198 },
  { major: "Thiết kế nội thất", code: "7580102", faculty: "Thiết kế", campus: "TP.HCM", method: "Xét học bạ THPT", y2026: 21.5, y2025: 21.0, y2024: 20.75, y2023: 20.5, y2022: 20.25, quota: 150, enrolled: 142 },
  // Electronics
  { major: "Kỹ thuật điện tử viễn thông", code: "7520207", faculty: "Điện tử - Viễn thông", campus: "Hà Nội", method: "THPT Quốc Gia", y2026: 21.75, y2025: 21.5, y2024: 21.25, y2023: 21.0, y2022: 20.75, quota: 250, enrolled: 243 },
];

const Trend = ({ current, prev }) => {
  if (!prev) return <Minus size={13} color="#9CA3AF" />;
  const diff = (current - prev).toFixed(2);
  if (diff > 0) return <span style={{ display: "flex", alignItems: "center", gap: 2, color: "#16A34A", fontSize: 11.5, fontWeight: 600 }}><TrendingUp size={12} />+{diff}</span>;
  if (diff < 0) return <span style={{ display: "flex", alignItems: "center", gap: 2, color: "#DC2626", fontSize: 11.5, fontWeight: 600 }}><TrendingDown size={12} />{diff}</span>;
  return <Minus size={13} color="#9CA3AF" />;
};

export default function AdmissionLookup() {
  const [searchQ, setSearchQ] = useState("");
  const [campus, setCampus] = useState("Tất cả");
  const [method, setMethod] = useState("Tất cả");
  const [faculty, setFaculty] = useState("Tất cả");
  const [sortCol, setSortCol] = useState("y2026");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    let data = RAW_DATA;
    if (searchQ) data = data.filter(d => d.major.toLowerCase().includes(searchQ.toLowerCase()) || d.code.includes(searchQ));
    if (campus !== "Tất cả") data = data.filter(d => d.campus === campus);
    if (method !== "Tất cả") data = data.filter(d => d.method === method);
    if (faculty !== "Tất cả") data = data.filter(d => d.faculty === faculty);
    data = [...data].sort((a, b) => {
      const va = a[sortCol] ?? 0, vb = b[sortCol] ?? 0;
      return sortDir === "desc" ? vb - va : va - vb;
    });
    return data;
  }, [searchQ, campus, method, faculty, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortCol(col); setSortDir("desc"); }
  };

  const ScoreBar = ({ score, max = 30 }) => {
    if (!score) return <span style={{ color: "#9CA3AF", fontSize: 12 }}>—</span>;
    const pct = (score / max) * 100;
    const color = pct >= 80 ? "#DC2626" : pct >= 70 ? "#D97706" : "#2563EB";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 5, background: "#E5E7EB", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color, minWidth: 36 }}>{score}</span>
      </div>
    );
  };

  const thStyle = (col) => ({
    padding: "12px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700,
    color: sortCol === col ? "#FF6B35" : "#6B7280", letterSpacing: 0.5,
    textTransform: "uppercase", cursor: "pointer", whiteSpace: "nowrap",
    borderBottom: sortCol === col ? "2px solid #FF6B35" : "2px solid transparent",
    userSelect: "none"
  });

  const filterSelect = (label, val, setVal, opts) => (
    <div style={{ position: "relative" }}>
      <select value={val} onChange={e => setVal(e.target.value)} style={{
        appearance: "none", padding: "9px 36px 9px 12px", borderRadius: 10, fontSize: 13.5,
        border: val !== "Tất cả" ? "1.5px solid #FF6B35" : "1.5px solid #E5E7EB",
        background: val !== "Tất cả" ? "#FFF7F4" : "#fff", color: "#374151",
        cursor: "pointer", fontWeight: 500, minWidth: 160
      }}>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#6B7280" }} />
    </div>
  );

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#FF6B35,#E85A2A)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={19} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0d1b3e", margin: 0 }}>Tra cứu điểm chuẩn</h1>
            <p style={{ fontSize: 13.5, color: "#6B7280", margin: 0 }}>FPT University — Dữ liệu từ Data Mart Tuyển Sinh</p>
          </div>
        </div>

        {/* Summary chips */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Tổng ngành hiển thị", val: filtered.length, color: "#FF6B35" },
            { label: "Điểm chuẩn cao nhất 2026", val: Math.max(...filtered.map(d => d.y2026)).toFixed(1), color: "#DC2626" },
            { label: "Điểm chuẩn thấp nhất 2026", val: Math.min(...filtered.map(d => d.y2026)).toFixed(1), color: "#2563EB" },
          ].map((c, i) => (
            <div key={i} style={{ padding: "8px 16px", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#6B7280" }}>{c.label}:</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: c.color }}>{c.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 24,
        border: "1px solid #E5E7EB", display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center"
      }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Tìm kiếm ngành hoặc mã ngành..."
            style={{ width: "100%", padding: "9px 12px 9px 36px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 13.5, outline: "none", boxSizing: "border-box" }} />
        </div>
        {filterSelect("Cơ sở", campus, setCampus, CAMPUSES)}
        {filterSelect("Phương thức", method, setMethod, METHODS)}
        {filterSelect("Khoa", faculty, setFaculty, FACULTIES)}
        {(campus !== "Tất cả" || method !== "Tất cả" || faculty !== "Tất cả" || searchQ) && (
          <button onClick={() => { setCampus("Tất cả"); setMethod("Tất cả"); setFaculty("Tất cả"); setSearchQ(""); }}
            style={{ padding: "9px 16px", borderRadius: 10, border: "1.5px solid #FECACA", background: "#FFF1F2", color: "#DC2626", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Xóa lọc
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={{ ...thStyle("major"), minWidth: 220 }} onClick={() => handleSort("major")}>Ngành học</th>
                <th style={{ ...thStyle("campus"), minWidth: 100 }}>Cơ sở</th>
                <th style={{ ...thStyle("method"), minWidth: 120 }}>Phương thức</th>
                {YEARS.map(y => (
                  <th key={y} style={{ ...thStyle(`y${y}`), minWidth: 100 }} onClick={() => handleSort(`y${y}`)}>
                    {y} {sortCol === `y${y}` ? (sortDir === "desc" ? "↓" : "↑") : ""}
                  </th>
                ))}
                <th style={{ ...thStyle("quota"), minWidth: 80 }}>Chỉ tiêu</th>
                <th style={{ ...thStyle("enrolled"), minWidth: 90 }}>Trúng tuyển</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} style={{
                  borderTop: "1px solid #F3F4F6",
                  background: i % 2 === 0 ? "#fff" : "#FAFAFA",
                  transition: "background 0.15s"
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FFF7F4"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFAFA"}
                >
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{row.major}</div>
                    <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>{row.code} • {row.faculty}</div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#374151" }}>
                      <MapPin size={12} color="#9CA3AF" />{row.campus}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      fontSize: 11.5, padding: "3px 8px", borderRadius: 100, fontWeight: 600,
                      background: "#EFF6FF", color: "#2563EB"
                    }}>{row.method}</span>
                  </td>
                  {YEARS.map(y => (
                    <td key={y} style={{ padding: "14px 16px", minWidth: 100 }}>
                      {y === "2026" ? (
                        <div>
                          <ScoreBar score={row[`y${y}`]} />
                          <Trend current={row.y2026} prev={row.y2025} />
                        </div>
                      ) : (
                        <span style={{ fontSize: 14, color: row[`y${y}`] ? "#374151" : "#9CA3AF" }}>
                          {row[`y${y}`] ?? "—"}
                        </span>
                      )}
                    </td>
                  ))}
                  <td style={{ padding: "14px 16px", fontSize: 14, color: "#374151" }}>{row.quota.toLocaleString()}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#16A34A" }}>{row.enrolled.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{Math.round(row.enrolled / row.quota * 100)}%</div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ padding: "48px 24px", textAlign: "center", color: "#9CA3AF" }}>
                    <Search size={32} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                    Không tìm thấy kết quả phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 24px", borderTop: "1px solid #F3F4F6", fontSize: 12.5, color: "#9CA3AF", display: "flex", justifyContent: "space-between" }}>
          <span>Hiển thị {filtered.length} / {RAW_DATA.length} ngành • Nguồn: Data Mart Tuyển Sinh (FACT_ADMISSION)</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /> Cập nhật: 17/08/2026</span>
        </div>
      </div>
    </div>
  );
}
