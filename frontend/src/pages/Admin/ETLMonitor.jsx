import { useState } from "react";
import { Server, Play, Pause, RefreshCw, CheckCircle, AlertTriangle, Clock, Terminal } from "lucide-react";

const PIPELINES = [
  { id: "pipe-01", name: "Pipeline Tích Hợp Cổng Tuyển Sinh", cron: "*/15 * * * *", lastRun: "15:15:00", duration: "1m 45s", records: "12,400", status: "Success" },
  { id: "pipe-02", name: "Pipeline Đồng Bộ Điểm Thi THPT (LGSP)", cron: "0 */2 * * *", lastRun: "14:00:00", duration: "4m 20s", records: "45,000", status: "Success" },
  { id: "pipe-03", name: "Pipeline LMS & Chuyên Cần Canvas", cron: "0 * * * *", lastRun: "15:00:00", duration: "2m 10s", records: "28,900", status: "Success" },
  { id: "pipe-04", name: "Pipeline Doanh Thu SAP Finance", cron: "0 8,20 * * *", lastRun: "08:00:00", duration: "8m 15s", records: "5,800", status: "Success" },
  { id: "pipe-05", name: "Pipeline Nhân Sự Oracle HR", cron: "0 7 * * *", lastRun: "07:00:00", duration: "3m 30s", records: "1,248", status: "Warning" },
];

export default function ETLMonitor() {
  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0 }}>Giám Sát Đường Ống ETL / ELT Data Pipeline</h1>
          <p style={{ fontSize: 13.5, color: "#64748B", margin: "3px 0 0" }}>Điều phối Apache Airflow & AGN Agent Node tích hợp dữ liệu thời gian thực</p>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "#059669", color: "#fff", border: "none", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
          <RefreshCw size={15} /> Làm Mới Trạng Thái
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13.5 }}>
          <thead>
            <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "12px 20px", fontWeight: 700 }}>MÃ PIPELINE</th>
              <th style={{ padding: "12px 20px", fontWeight: 700 }}>TÊN TIẾN TRÌNH</th>
              <th style={{ padding: "12px 20px", fontWeight: 700 }}>LỊCH CHẠY</th>
              <th style={{ padding: "12px 20px", fontWeight: 700 }}>LẦN CHẠY GẦN NHẤT</th>
              <th style={{ padding: "12px 20px", fontWeight: 700 }}>THỜI GIAN CHẠY</th>
              <th style={{ padding: "12px 20px", fontWeight: 700 }}>BẢN GHI</th>
              <th style={{ padding: "12px 20px", fontWeight: 700 }}>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            {PIPELINES.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "14px 20px", fontFamily: "monospace", fontWeight: 700, color: "#475569" }}>{p.id}</td>
                <td style={{ padding: "14px 20px", fontWeight: 700, color: "#0F172A" }}>{p.name}</td>
                <td style={{ padding: "14px 20px", fontFamily: "monospace", color: "#64748B" }}>{p.cron}</td>
                <td style={{ padding: "14px 20px", color: "#475569" }}>{p.lastRun}</td>
                <td style={{ padding: "14px 20px", color: "#475569" }}>{p.duration}</td>
                <td style={{ padding: "14px 20px", fontWeight: 700, color: "#2563EB" }}>{p.records}</td>
                <td style={{ padding: "14px 20px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 800, background: p.status === "Success" ? "#DCFCE7" : "#FEF3C7", color: p.status === "Success" ? "#16A34A" : "#D97706" }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
