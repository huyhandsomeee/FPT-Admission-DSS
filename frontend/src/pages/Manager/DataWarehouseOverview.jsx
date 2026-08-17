import { useState } from "react";
import { Database, Table2, GitBranch, Layers, Activity, RefreshCcw, ArrowRight, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

/* ── Data Warehouse Schema visualization ── */
const FACT_TABLES = [
  { name: "FACT_ADMISSION", rows: "2.4M", size: "1.2GB", lastUpdate: "17/08/2026 14:30", status: "healthy", dims: ["DIM_STUDENT", "DIM_PROGRAM", "DIM_CAMPUS", "DIM_DATE", "DIM_ADMISSION_METHOD", "DIM_STATUS"], color: "#FF6B35" },
  { name: "FACT_LEARNING", rows: "18.7M", size: "4.1GB", lastUpdate: "17/08/2026 12:00", status: "healthy", dims: ["DIM_STUDENT", "DIM_COURSE", "DIM_LECTURER", "DIM_DATE", "DIM_SEMESTER", "DIM_CAMPUS"], color: "#2563EB" },
  { name: "FACT_FINANCE", rows: "5.2M", size: "2.3GB", lastUpdate: "17/08/2026 08:00", status: "healthy", dims: ["DIM_STUDENT", "DIM_DATE", "DIM_PAYMENT", "DIM_CAMPUS", "DIM_SEMESTER"], color: "#16A34A" },
  { name: "FACT_LMS", rows: "8.9M", size: "3.4GB", lastUpdate: "17/08/2026 13:15", status: "healthy", dims: ["DIM_STUDENT", "DIM_COURSE", "DIM_DATE", "DIM_CAMPUS"], color: "#7C3AED" },
  { name: "FACT_LIBRARY", rows: "1.1M", size: "0.4GB", lastUpdate: "16/08/2026 22:00", status: "warning", dims: ["DIM_STUDENT", "DIM_DATE", "DIM_LIBRARY_RESOURCE"], color: "#D97706" },
  { name: "FACT_RESEARCH", rows: "0.8M", size: "0.6GB", lastUpdate: "16/08/2026 20:00", status: "healthy", dims: ["DIM_EMPLOYEE", "DIM_DATE", "DIM_RESEARCH_PROJECT", "DIM_DEPARTMENT"], color: "#059669" },
  { name: "FACT_HR", rows: "3.2M", size: "1.8GB", lastUpdate: "17/08/2026 07:00", status: "healthy", dims: ["DIM_EMPLOYEE", "DIM_DATE", "DIM_DEPARTMENT", "DIM_POSITION", "DIM_CAMPUS"], color: "#DC2626" },
];

const DIM_TABLES = [
  { name: "DIM_STUDENT", rows: "18,423", desc: "Thông tin sinh viên" },
  { name: "DIM_EMPLOYEE", rows: "1,247", desc: "Nhân viên & giảng viên" },
  { name: "DIM_COURSE", rows: "347", desc: "Danh mục môn học" },
  { name: "DIM_PROGRAM", rows: "47", desc: "Chương trình đào tạo" },
  { name: "DIM_CAMPUS", rows: "8", desc: "Cơ sở đào tạo" },
  { name: "DIM_DATE", rows: "3,652", desc: "Bảng ngày tháng" },
  { name: "DIM_FACULTY", rows: "12", desc: "Khoa / Bộ môn" },
  { name: "DIM_DEPARTMENT", rows: "28", desc: "Phòng ban" },
  { name: "DIM_SEMESTER", rows: "16", desc: "Học kỳ" },
  { name: "DIM_POSITION", rows: "45", desc: "Chức vụ" },
  { name: "DIM_STATUS", rows: "12", desc: "Trạng thái" },
  { name: "DIM_PROVINCE", rows: "63", desc: "Tỉnh thành" },
  { name: "DIM_PAYMENT", rows: "8", desc: "Phương thức thanh toán" },
  { name: "DIM_ADMISSION_METHOD", rows: "6", desc: "Phương thức tuyển sinh" },
];

const ETL_JOBS = [
  { name: "Admission → DW ETL", source: "MySQL OLTP", target: "FACT_ADMISSION", schedule: "*/15 * * * *", lastRun: "14:30", status: "success", duration: "2m 14s" },
  { name: "LMS Sync", source: "Canvas LMS API", target: "FACT_LMS", schedule: "0 * * * *", lastRun: "14:00", status: "success", duration: "5m 48s" },
  { name: "Finance ETL", source: "SAP Finance", target: "FACT_FINANCE", schedule: "0 8,20 * * *", lastRun: "08:00", status: "success", duration: "12m 06s" },
  { name: "HR Payroll Sync", source: "Oracle HR", target: "FACT_HR", schedule: "0 7 * * *", lastRun: "07:00", status: "success", duration: "8m 32s" },
  { name: "Library System", source: "KOHA ILS API", target: "FACT_LIBRARY", schedule: "0 22 * * *", lastRun: "22:00 (kemarin)", status: "warning", duration: "3m 55s" },
  { name: "Research DB Sync", source: "Research Portal", target: "FACT_RESEARCH", schedule: "0 20 * * *", lastRun: "20:00 (kemarin)", status: "success", duration: "1m 22s" },
];

const DW_STATS = { totalRows: "40.3M", totalSize: "13.8GB", tables: 21, etlJobs: 6, successRate: "98.7%", lastSync: "14:30" };

export default function DataWarehouseOverview() {
  const [selectedFact, setSelectedFact] = useState(null);
  const [view, setView] = useState("schema"); // schema | etl | tables

  const StatusIcon = ({ status, size = 14 }) => status === "healthy" || status === "success"
    ? <CheckCircle size={size} color="#16A34A" />
    : <AlertCircle size={size} color="#D97706" />;

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#0891B2,#0E7490)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Database size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Data Warehouse Overview</h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>Star Schema • FPT University DW • Cập nhật: {DW_STATS.lastSync}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["schema", "etl", "tables"].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
              background: view === v ? "#0891B2" : "#fff",
              color: view === v ? "#fff" : "#374151",
              border: `1.5px solid ${view === v ? "#0891B2" : "#E5E7EB"}`
            }}>
              {v === "schema" ? "Schema" : v === "etl" ? "ETL Jobs" : "Bảng dữ liệu"}
            </button>
          ))}
        </div>
      </div>

      {/* DW Stats bar */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Tổng số hàng", val: DW_STATS.totalRows, icon: "📊" },
          { label: "Tổng dung lượng", val: DW_STATS.totalSize, icon: "💾" },
          { label: "Số bảng", val: DW_STATS.tables, icon: "📋" },
          { label: "ETL Jobs", val: DW_STATS.etlJobs, icon: "⚙️" },
          { label: "Tỷ lệ thành công", val: DW_STATS.successRate, icon: "✅" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "14px 18px", border: "1px solid #E5E7EB", display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 22 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Schema View */}
      {view === "schema" && (
        <div>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 18 }}>
              📐 Star Schema — Fact Tables ({FACT_TABLES.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {FACT_TABLES.map((fact) => (
                <div key={fact.name}
                  onClick={() => setSelectedFact(selectedFact?.name === fact.name ? null : fact)}
                  style={{
                    padding: 16, borderRadius: 12, border: `2px solid ${selectedFact?.name === fact.name ? fact.color : "#E5E7EB"}`,
                    background: selectedFact?.name === fact.name ? `${fact.color}08` : "#F9FAFB",
                    cursor: "pointer", transition: "all 0.2s"
                  }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: fact.color }} />
                      <span style={{ fontSize: 13.5, fontWeight: 800, color: "#111827", fontFamily: "monospace" }}>{fact.name}</span>
                    </div>
                    <StatusIcon status={fact.status} />
                  </div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>📊 {fact.rows} hàng</span>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>💾 {fact.size}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>Cập nhật: {fact.lastUpdate}</div>

                  {selectedFact?.name === fact.name && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E5E7EB" }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#374151", marginBottom: 6 }}>Liên kết Dimension:</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {fact.dims.map(d => (
                          <span key={d} style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, background: `${fact.color}14`, color: fact.color, fontWeight: 600, fontFamily: "monospace" }}>
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DIM tables */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 18 }}>
              📦 Dimension Tables ({DIM_TABLES.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {DIM_TABLES.map((dim) => (
                <div key={dim.name} style={{ padding: "12px 14px", borderRadius: 10, background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "#374151", fontFamily: "monospace", marginBottom: 3 }}>{dim.name}</div>
                  <div style={{ fontSize: 11.5, color: "#6B7280" }}>{dim.desc}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 3 }}>{dim.rows} bản ghi</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ETL View */}
      {view === "etl" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>ETL Pipeline Jobs</div>
            <button style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#0891B2", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
              <RefreshCcw size={13} /> Làm mới
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["ETL Job", "Nguồn", "Đích", "Lịch chạy", "Lần cuối", "Thời gian", "Trạng thái"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ETL_JOBS.map((job, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "13px 16px", fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{job.name}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#6B7280", fontFamily: "monospace" }}>{job.source}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#0891B2", fontWeight: 700, fontFamily: "monospace" }}>{job.target}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: "#9CA3AF", fontFamily: "monospace" }}>{job.schedule}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#374151" }}>{job.lastRun}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#374151" }}>{job.duration}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <StatusIcon status={job.status} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: job.status === "success" || job.status === "healthy" ? "#16A34A" : "#D97706" }}>
                        {job.status === "success" ? "Thành công" : "Cảnh báo"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tables view */}
      {view === "tables" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Bảng", "Loại", "Số hàng", "Kích thước", "Cập nhật lần cuối", "Trạng thái"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...FACT_TABLES.map(f => ({ ...f, type: "FACT" })), ...DIM_TABLES.map(d => ({ name: d.name, type: "DIM", rows: d.rows, size: "—", lastUpdate: "—", status: "healthy", color: "#9CA3AF" }))].map((t, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <td style={{ padding: "12px 16px", fontSize: 13.5, fontWeight: 700, color: "#111827", fontFamily: "monospace" }}>{t.name}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 800,
                      background: t.type === "FACT" ? "#FFF7F4" : "#F0FDF4",
                      color: t.type === "FACT" ? "#FF6B35" : "#16A34A"
                    }}>{t.type}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{t.rows}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151" }}>{t.size}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12.5, color: "#9CA3AF" }}>{t.lastUpdate || "—"}</td>
                  <td style={{ padding: "12px 16px" }}><StatusIcon status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
