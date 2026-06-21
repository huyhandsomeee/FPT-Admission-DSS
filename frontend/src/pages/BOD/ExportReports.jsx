import { useState } from "react";
import { Download, FileText, BarChart3, Users, TrendingUp, Filter, FolderOpen } from "lucide-react";

const REPORTS = [
  {
    name: "Báo cáo tổng hợp tuyển sinh 2026",
    type: "EXCEL", typeColor: "#16A34A", typeBg: "#DCFCE7",
    size: "2.4 MB",
    updated: "Cập nhật 2 giờ trước",
    icon: BarChart3,
    iconBg: "#EFF6FF", iconColor: "#2563EB",
  },
  {
    name: "Danh sách thí sinh nhập học",
    type: "EXCEL", typeColor: "#16A34A", typeBg: "#DCFCE7",
    size: "1.8 MB",
    updated: "Cập nhật 5 giờ trước",
    icon: Users,
    iconBg: "#EFF6FF", iconColor: "#2563EB",
  },
  {
    name: "Báo cáo phân tích theo ngành",
    type: "PDF", typeColor: "#DC2626", typeBg: "#FEE2E2",
    size: "3.2 MB",
    updated: "Cập nhật hôm qua",
    icon: FileText,
    iconBg: "#EFF6FF", iconColor: "#2563EB",
  },
  {
    name: "Dự báo tuyển sinh 2027-2029",
    type: "PDF", typeColor: "#DC2626", typeBg: "#FEE2E2",
    size: "1.5 MB",
    updated: "Cập nhật 3 ngày trước",
    icon: TrendingUp,
    iconBg: "#EFF6FF", iconColor: "#2563EB",
  },
];

const SUMMARY_STATS = [
  {
    label: "Tổng báo cáo sẵn có", value: "12",
    badge: { text: "+4 tệp mới", color: "#16A34A", bg: "#DCFCE7" },
    icon: FileText, iconBg: "#F1F5F9", iconColor: "#475569",
  },
  {
    label: "Lượt tải xuống", value: "48",
    badge: { text: "Hôm nay", color: "#D97706", bg: "#FEF3C7" },
    icon: Download, iconBg: "#FFF7ED", iconColor: "#D97706",
  },
  {
    label: "Cập nhật lần cuối", value: "21/06/2026, 08:30",
    icon: null, iconBg: "#F1F5F9", iconColor: "#475569",
    small: true,
  },
];

export default function ExportReports() {
  const [downloading, setDownloading] = useState(null);

  const handleDownload = (name) => {
    setDownloading(name);
    setTimeout(() => setDownloading(null), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Title */}
      <div>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 26, color: "#0F172A" }}>Trung tâm xuất tài liệu</h1>
        <p style={{ margin: "5px 0 0", fontSize: 13, color: "#64748B", maxWidth: 580 }}>
          Tải xuống báo cáo tuyển sinh và phân tích dữ liệu định kỳ theo nhiều định dạng để hỗ trợ việc ra quyết định chiến lược.
        </p>
      </div>

      {/* Summary KPI cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {SUMMARY_STATS.map((stat, i) => (
          <div key={i} style={{ background: "white", borderRadius: 14, padding: "20px 22px", border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: stat.iconBg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {stat.icon
                  ? <stat.icon size={18} color={stat.iconColor} />
                  : <span style={{ fontSize: 18 }}>🕐</span>
                }
              </div>
              {stat.badge && (
                <span style={{ fontSize: 10, fontWeight: 700, background: stat.badge.bg, color: stat.badge.color, padding: "3px 9px", borderRadius: 999 }}>
                  {stat.badge.text}
                </span>
              )}
            </div>
            <div style={{ fontSize: stat.small ? 16 : 36, fontWeight: stat.small ? 700 : 900, color: "#0F172A", lineHeight: 1.2 }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 5 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Report list */}
      <div style={{ background: "white", borderRadius: 16, border: "1px solid #E8EDF5", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #F1F5F9" }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Danh sách báo cáo mới nhất</h3>
          <button style={{ display: "flex", alignItems: "center", gap: 7, background: "white", border: "1px solid #E2E8F0", borderRadius: 8, padding: "7px 13px", color: "#475569", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <Filter size={13} /> Bộ lọc
          </button>
        </div>

        <div>
          {REPORTS.map((report, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 16,
              padding: "16px 24px",
              borderBottom: i < REPORTS.length - 1 ? "1px solid #F8FAFC" : "none",
              transition: "background 0.15s"
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#FAFBFF"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {/* Icon */}
              <div style={{ width: 44, height: 44, background: report.iconBg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <report.icon size={20} color={report.iconColor} />
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#1E293B", marginBottom: 4 }}>{report.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, background: report.typeBg, color: report.typeColor, padding: "2px 7px", borderRadius: 4 }}>
                    {report.type}
                  </span>
                  <span style={{ fontSize: 12, color: "#94A3B8", display: "flex", alignItems: "center", gap: 4 }}>
                    <FileText size={11} /> {report.size}
                  </span>
                  <span style={{ color: "#CBD5E1" }}>•</span>
                  <span style={{ fontSize: 12, color: "#94A3B8" }}>{report.updated}</span>
                </div>
              </div>

              {/* Download button */}
              <button onClick={() => handleDownload(report.name)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  background: downloading === report.name ? "#E85A2A" : "linear-gradient(135deg, #FF6B35, #E85A2A)",
                  border: "none", borderRadius: 9,
                  padding: "9px 18px", color: "white",
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(255,107,53,0.25)",
                  transition: "all 0.2s", flexShrink: 0
                }}>
                {downloading === report.name
                  ? <div style={{ width: 14, height: 14, borderRadius: "50%", borderTop: "2px solid white", borderRight: "2px solid transparent", animation: "spin 0.7s linear infinite" }} />
                  : <Download size={14} />
                }
                Tải xuống
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk download banner */}
      <div style={{ background: "#0d1b3e", borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 52, height: 52, background: "rgba(255,107,53,0.2)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <FolderOpen size={26} color="#FF6B35" />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: "0 0 6px", fontWeight: 800, fontSize: 17, color: "white" }}>Tải xuống tất cả báo cáo quý</h3>
          <p style={{ margin: 0, fontSize: 13, color: "rgba(200,220,255,0.8)", lineHeight: 1.5 }}>
            Tự động nén tất cả các báo cáo sẵn có trong quý hiện tại thành một tệp duy nhất (.zip).
          </p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
          border: "none", borderRadius: 10, padding: "11px 20px",
          color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
          boxShadow: "0 4px 12px rgba(255,107,53,0.3)", flexShrink: 0, whiteSpace: "nowrap"
        }}>
          <Download size={15} /> Tải về trọn bộ (.zip)
        </button>
      </div>
    </div>
  );
}
