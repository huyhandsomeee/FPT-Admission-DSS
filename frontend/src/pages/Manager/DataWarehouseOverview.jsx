import { useState, useEffect } from "react";
import api from "../../config/axiosConfig";
import { Database, Table2, GitBranch, Layers, Activity, RefreshCcw, ArrowRight, CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

export default function DataWarehouseOverview() {
  const [selectedFact, setSelectedFact] = useState(null);
  const [view, setView] = useState("schema"); // schema | etl | tables
  const [loading, setLoading] = useState(false);

  const [dwStats, setDwStats] = useState({
    totalRows: "40.3M",
    totalSize: "13.8 GB",
    tables: 21,
    etlJobs: 4,
    successRate: "99.8%",
    lastSync: "Vừa xong",
    activeDbApplications: 0
  });

  const [factTables, setFactTables] = useState([
    { name: "FACT_ADMISSION", rows: "2,400,000", size: "1.2GB", lastUpdate: "Vừa xong", status: "healthy", dims: ["DIM_STUDENT", "DIM_HIGH_SCHOOL", "DIM_PROGRAM", "DIM_CAMPUS", "DIM_DATE", "DIM_ADMISSION_METHOD", "DIM_STATUS"], color: "#FF6B35" },
    { name: "FACT_LEARNING", rows: "18,700,000", size: "4.1GB", lastUpdate: "12m trước", status: "healthy", dims: ["DIM_STUDENT", "DIM_COURSE", "DIM_LECTURER", "DIM_DATE", "DIM_SEMESTER", "DIM_CAMPUS"], color: "#2563EB" },
    { name: "FACT_FINANCE", rows: "5,200,000", size: "2.3GB", lastUpdate: "8m trước", status: "healthy", dims: ["DIM_STUDENT", "DIM_DATE", "DIM_PAYMENT", "DIM_CAMPUS", "DIM_SEMESTER"], color: "#16A34A" },
    { name: "FACT_LMS", rows: "8,900,000", size: "3.4GB", lastUpdate: "15m trước", status: "healthy", dims: ["DIM_STUDENT", "DIM_COURSE", "DIM_DATE", "DIM_CAMPUS"], color: "#7C3AED" },
    { name: "FACT_LIBRARY", rows: "1,100,000", size: "0.4GB", lastUpdate: "1h trước", status: "healthy", dims: ["DIM_STUDENT", "DIM_DATE", "DIM_LIBRARY_RESOURCE"], color: "#D97706" },
    { name: "FACT_RESEARCH", rows: "800,000", size: "0.6GB", lastUpdate: "2h trước", status: "healthy", dims: ["DIM_EMPLOYEE", "DIM_DATE", "DIM_RESEARCH_PROJECT", "DIM_DEPARTMENT"], color: "#059669" },
    { name: "FACT_HR", rows: "3,200,000", size: "1.8GB", lastUpdate: "30m trước", status: "healthy", dims: ["DIM_EMPLOYEE", "DIM_DATE", "DIM_DEPARTMENT", "DIM_POSITION", "DIM_CAMPUS"], color: "#DC2626" },
  ]);

  const [dimTables, setDimTables] = useState([
    { name: "DIM_STUDENT", rows: "18,423", desc: "Thông tin sinh viên & Thí sinh ứng tuyển" },
    { name: "DIM_HIGH_SCHOOL", rows: "2,840", desc: "Danh mục trường THPT nguồn tuyển" },
    { name: "DIM_PROGRAM", rows: "47", desc: "Chương trình đào tạo & Ngành học" },
    { name: "DIM_CAMPUS", rows: "5", desc: "5 Cơ sở đào tạo (HN, HCM, DN, CT, QN)" },
    { name: "DIM_ADMISSION_METHOD", rows: "6", desc: "Phương thức tuyển sinh" },
    { name: "DIM_STATUS", rows: "12", desc: "Trạng thái hồ sơ & phễu chuyển đổi" },
    { name: "DIM_EMPLOYEE", rows: "1,247", desc: "Cán bộ tuyển sinh & nhân sự" },
    { name: "DIM_COURSE", rows: "347", desc: "Danh mục môn học & tổ hợp" },
    { name: "DIM_DATE", rows: "3,652", desc: "Bảng ngày tháng chuẩn DWH" },
  ]);

  const [etlJobs, setEtlJobs] = useState([
    { name: "Admission OLTP → DWH ETL", source: "MySQL OLTP (applications)", target: "FACT_ADMISSION", schedule: "*/5 * * * *", lastRun: "Vừa xong", status: "success", duration: "1m 45s" },
    { name: "NDOP / MOET Sync Job", source: "National Data Platform API", target: "STAGING_MOET_SCORES", schedule: "0 * * * *", lastRun: "10m trước", status: "success", duration: "3m 12s" },
    { name: "LMS Academic Sync", source: "Canvas LMS API", target: "FACT_LMS", schedule: "0 */2 * * *", lastRun: "35m trước", status: "success", duration: "4m 20s" },
    { name: "Finance Tuition Sync", source: "Oracle Finance ERP", target: "FACT_FINANCE", schedule: "0 8,20 * * *", lastRun: "08:00", status: "success", duration: "9m 10s" }
  ]);

  const fetchDwMetrics = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/manager/dss/dw-metrics");
      if (res.data) {
        if (res.data.stats) setDwStats(res.data.stats);
        if (res.data.factTables) setFactTables(res.data.factTables);
        if (res.data.dimTables) setDimTables(res.data.dimTables);
        if (res.data.etlJobs) setEtlJobs(res.data.etlJobs);
      }
    } catch (err) {
      console.warn("Could not fetch live DW metrics, using fallback: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDwMetrics();
  }, []);

  const StatusIcon = ({ status, size = 14 }) => status === "healthy" || status === "success"
    ? <CheckCircle size={size} color="#16A34A" />
    : <AlertCircle size={size} color="#D97706" />;

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#0891B2,#0E7490)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(8,145,178,0.25)" }}>
            <Database size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Data Warehouse Overview (Cổng Dữ Liệu FPT)</h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: "2px 0 0" }}>Star Schema • FPT University DW Core • Cập nhật: {dwStats.lastSync}</p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button 
            onClick={fetchDwMetrics} 
            disabled={loading}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10,
              background: "#F1F5F9", border: "1px solid #CBD5E1", color: "#334155", fontWeight: 700, fontSize: 13, cursor: "pointer"
            }}>
            <RefreshCcw size={13} className={loading ? "animate-spin" : ""} /> {loading ? "Đang tải..." : "Đồng Bộ Live"}
          </button>

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
          { label: "Tổng số hàng DW", val: dwStats.totalRows, icon: "📊" },
          { label: "Tổng dung lượng", val: dwStats.totalSize, icon: "💾" },
          { label: "Số bảng (Fact + Dim)", val: dwStats.tables, icon: "📋" },
          { label: "ETL Pipelines", val: dwStats.etlJobs, icon: "⚙️" },
          { label: "Tỷ lệ ETL thành công", val: dwStats.successRate, icon: "✅" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, padding: "16px 20px", border: "1px solid #E5E7EB", display: "flex", gap: 12, alignItems: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
            <span style={{ fontSize: 24 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, color: "#111827" }}>{s.val}</div>
              <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Schema View */}
      {view === "schema" && (
        <div>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 18 }}>
              📐 Star Schema — Fact Tables ({factTables.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {factTables.map((fact) => (
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
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827", marginBottom: 18 }}>
              📦 Dimension Tables ({dimTables.length})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {dimTables.map((dim) => (
                <div key={dim.name} style={{ padding: "14px 16px", borderRadius: 12, background: "#F9FAFB", border: "1px solid #F3F4F6" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#1E293B", fontFamily: "monospace", marginBottom: 4 }}>{dim.name}</div>
                  <div style={{ fontSize: 12, color: "#64748B", minHeight: 34 }}>{dim.desc}</div>
                  <div style={{ fontSize: 11.5, color: "#0891B2", fontWeight: 700, marginTop: 4 }}>{dim.rows} bản ghi</div>
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
            <div style={{ fontSize: 15, fontWeight: 800 }}>ETL Pipeline Jobs & Data Sync Schedule</div>
            <button onClick={fetchDwMetrics} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#0891B2", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>
              <RefreshCcw size={13} className={loading ? "animate-spin" : ""} /> Đồng bộ Pipeline
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["ETL Job", "Nguồn Dữ Liệu", "Bảng Đích (DW)", "Lịch chạy", "Lần chạy cuối", "Thời gian", "Trạng thái"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {etlJobs.map((job, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "14px 16px", fontSize: 13.5, fontWeight: 700, color: "#111827" }}>{job.name}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12.5, color: "#6B7280", fontFamily: "monospace" }}>{job.source}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12.5, color: "#0891B2", fontWeight: 700, fontFamily: "monospace" }}>{job.target}</td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "#9CA3AF", fontFamily: "monospace" }}>{job.schedule}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{job.lastRun}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{job.duration}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <StatusIcon status={job.status} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: job.status === "success" || job.status === "healthy" ? "#16A34A" : "#D97706" }}>
                        {job.status === "success" ? "Hoạt động" : "Cảnh báo"}
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
              {[...factTables.map(f => ({ ...f, type: "FACT" })), ...dimTables.map(d => ({ name: d.name, type: "DIM", rows: d.rows, size: "—", lastUpdate: "—", status: "healthy", color: "#9CA3AF" }))].map((t, i) => (
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
