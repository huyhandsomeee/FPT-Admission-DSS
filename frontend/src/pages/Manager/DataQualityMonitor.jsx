import { useState } from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle, RefreshCw, Layers, Database, ArrowRight, Activity } from "lucide-react";

const QUALITY_METRICS = [
  { label: "Điểm chất lượng dữ liệu tổng thể", val: "99.4%", status: "EXCELLENT", color: "#16A34A", bg: "#F0FDF4" },
  { label: "Độ đầy đủ (Completeness)", val: "99.8%", status: "GOOD", color: "#2563EB", bg: "#EFF6FF" },
  { label: "Độ chính xác (Accuracy)", val: "99.2%", status: "GOOD", color: "#7C3AED", bg: "#F5F3FF" },
  { label: "Độ tươi mới (Freshness)", val: "< 5 phút", status: "REALTIME", color: "#FF6B35", bg: "#FFF7F4" },
];

const TABLE_HEALTH = [
  { table: "FACT_ADMISSION", completeness: 99.9, validity: 99.8, freshness: "2m trước", errors: 0, status: "Tốt" },
  { table: "FACT_LEARNING", completeness: 99.6, validity: 99.4, freshness: "10m trước", errors: 3, status: "Cảnh báo nhẹ" },
  { table: "FACT_FINANCE", completeness: 100.0, validity: 99.9, freshness: "5m trước", errors: 0, status: "Tốt" },
  { table: "FACT_HR", completeness: 99.2, validity: 98.7, freshness: "1h trước", errors: 12, status: "Cảnh báo nhẹ" },
  { table: "FACT_LMS", completeness: 98.5, validity: 99.1, freshness: "15m trước", errors: 8, status: "Tốt" },
  { table: "DIM_STUDENT", completeness: 99.8, validity: 99.9, freshness: "1m trước", errors: 1, status: "Tốt" },
];

const ANOMALY_LOGS = [
  { time: "15:10:22", table: "FACT_LEARNING", rule: "Điểm GPA ngoài khoảng [0, 4.0]", count: "3 bản ghi", action: "Đã tự động cách ly vào bảng Staging", status: "Resolved" },
  { time: "14:45:00", table: "FACT_HR", rule: "Trùng số CCCD trong bảng DIM_EMPLOYEE", count: "2 bản ghi", action: "Đã gửi thông báo tới phòng Nhân sự", status: "Pending" },
  { time: "13:20:18", table: "FACT_FINANCE", rule: "Số tiền thanh toán âm không hợp lệ", count: "1 bản ghi", action: "Đã rollback giao dịch", status: "Resolved" }
];

export default function DataQualityMonitor() {
  const [isChecking, setIsChecking] = useState(false);

  const runCheck = () => {
    setIsChecking(true);
    setTimeout(() => setIsChecking(false), 1200);
  };

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #059669, #047857)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(5,150,105,0.3)" }}>
            <ShieldCheck size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: 0 }}>Giám Sát Chất Lượng Dữ Liệu (Data Quality)</h1>
            <p style={{ fontSize: 13.5, color: "#64748B", margin: "2px 0 0" }}>Kiểm thử tính toàn vẹn, tính nhất quán & độ trễ của Data Warehouse</p>
          </div>
        </div>

        <button onClick={runCheck} disabled={isChecking} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 10, background: "#059669", color: "#fff", border: "none", fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}>
          <RefreshCw size={15} className={isChecking ? "animate-spin" : ""} /> {isChecking ? "Đang quét kiểm thử..." : "Quét Kiểm Tra Ngay"}
        </button>
      </div>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18, marginBottom: 28 }}>
        {QUALITY_METRICS.map((item, idx) => (
          <div key={idx} style={{ background: item.bg, borderRadius: 16, padding: "20px 22px", border: `1px solid ${item.color}25` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#64748B", marginBottom: 8 }}>{item.label}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>{item.val}</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: item.color, marginTop: 6 }}>{item.status}</div>
          </div>
        ))}
      </div>

      {/* Table Health */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 28, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: 0 }}>Sức Khỏe Các Bảng Dữ Liệu Chính (Data Health Score)</h3>
          <span style={{ fontSize: 12.5, color: "#64748B" }}>Tự động kiểm tra mỗi 15 phút</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13.5 }}>
            <thead>
              <tr style={{ background: "#F8FAFC", color: "#64748B", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>TÊN BẢNG</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>ĐỘ ĐẦY ĐỦ</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>HỢP LỆ (VALIDITY)</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>ĐỘ TƯƠI (FRESHNESS)</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>BẢN GHI LỖI</th>
                <th style={{ padding: "12px 20px", fontWeight: 700 }}>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_HEALTH.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "14px 20px", fontFamily: "monospace", fontWeight: 700, color: "#0F172A" }}>{row.table}</td>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: "#16A34A" }}>{row.completeness}%</td>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: "#2563EB" }}>{row.validity}%</td>
                  <td style={{ padding: "14px 20px", color: "#64748B" }}>{row.freshness}</td>
                  <td style={{ padding: "14px 20px", fontWeight: 700, color: row.errors > 0 ? "#D97706" : "#16A34A" }}>{row.errors} lỗi</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: row.errors === 0 ? "#DCFCE7" : "#FEF3C7", color: row.errors === 0 ? "#16A34A" : "#D97706" }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomaly Detection Log */}
      <div style={{ background: "#fff", borderRadius: 18, border: "1px solid #E2E8F0", padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0F172A", margin: "0 0 16px 0" }}>Nhật Ký Phát Hiện Bất Thường Dữ Liệu (Anomaly Rules)</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ANOMALY_LOGS.map((log, idx) => (
            <div key={idx} style={{ padding: 16, background: "#F8FAFC", borderRadius: 12, border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#64748B" }}>{log.time}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: "#0F172A", fontFamily: "monospace", background: "#E2E8F0", padding: "2px 8px", borderRadius: 6 }}>{log.table}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#DC2626" }}>• {log.rule}</span>
                </div>
                <div style={{ fontSize: 12.5, color: "#475569" }}>{log.action} ({log.count})</div>
              </div>
              <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 700, background: log.status === "Resolved" ? "#DCFCE7" : "#FEF3C7", color: log.status === "Resolved" ? "#16A34A" : "#D97706" }}>
                {log.status === "Resolved" ? "Đã xử lý" : "Chờ phê duyệt"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
