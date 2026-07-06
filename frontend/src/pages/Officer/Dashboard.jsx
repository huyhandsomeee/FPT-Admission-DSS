import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import {
  FileText, Clock, CheckCircle, XCircle,
  ArrowUpRight, ArrowDownRight, Users, GraduationCap, Trophy,
  TrendingUp, BarChart3, Target, Monitor, Briefcase,
  Languages, Palette, Wrench, ExternalLink, RefreshCw,
  Download, Sparkles, Eye, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUS_LABELS = {
  DRAFT: "Bản nháp", SUBMITTED: "Đã nộp", UNDER_REVIEW: "Đang xét",
  APPROVED: "Đã duyệt", REJECTED: "Từ chối", ENROLLED: "Nhập học"
};

const STATUS_COLORS = {
  SUBMITTED:    { bg: "#DBEAFE", color: "#1D4ED8" },
  UNDER_REVIEW: { bg: "#FEF3C7", color: "#92400E" },
  APPROVED:     { bg: "#D1FAE5", color: "#065F46" },
  REJECTED:     { bg: "#FEE2E2", color: "#991B1B" },
  ENROLLED:     { bg: "#EDE9FE", color: "#5B21B6" },
  DRAFT:        { bg: "#F3F4F6", color: "#4B5563" },
};

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Simple SVG bar chart component
function MiniBarChart({ data, colors }) {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 100, padding: "0 4px" }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 4 }}>
          <div style={{
            width: "100%", maxWidth: 28,
            height: `${(d.value / maxVal) * 80}px`,
            minHeight: 8,
            background: colors?.[i] || "#FF6B35",
            borderRadius: "4px 4px 0 0",
            transition: "height 0.5s ease"
          }} />
          <span style={{ fontSize: 9, color: "#94A3B8", whiteSpace: "nowrap" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// Donut chart component
function DonutChart({ percentage, size = 100, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#F1F5F9" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="#FF6B35" strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
    </svg>
  );
}

export default function OfficerDashboard() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    submitted: 0,
    underReview: 0,
    approved: 0,
    rejected: 0,
    enrolled: 0,
    activeYear: 2026,
    quota: 18000
  });

  const [statsByMajor, setStatsByMajor] = useState({});
  const [recentApps, setRecentApps] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/officer/dashboard")
      .then(r => { if (r.data) setStats(r.data); })
      .catch(() => {});

    api.get("/api/officer/dashboard/by-major")
      .then(r => { if (r.data) setStatsByMajor(r.data); })
      .catch(() => {});

    setLoadingRecent(true);
    api.get("/api/officer/applications?page=0&size=5")
      .then(r => {
        const content = r.data?.content;
        if (Array.isArray(content)) setRecentApps(content);
      })
      .catch(() => {})
      .finally(() => setLoadingRecent(false));
  }, []);

  const handleExportCSV = () => {
    if (recentApps.length === 0) {
      alert("Không có hồ sơ nào để xuất báo cáo");
      return;
    }
    const headers = ["Mã hồ sơ", "Họ tên", "Email", "Ngành học", "Cơ sở", "Phương thức", "Điểm số", "Ngày nộp", "Trạng thái"];
    const rows = recentApps.map(app => [
      app.applicationCode || "", app.studentName || "", app.studentEmail || "",
      app.majorName || "", app.campusName || "", app.methodName || "",
      app.totalScore || "", app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("vi-VN") : "Chưa nộp",
      STATUS_LABELS[app.status] || ""
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Bao_cao_tuyen_sinh_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const quotaPercent = Math.round(stats.enrollmentRate ?? 0);

  const barChartData = [
    { label: "T2", value: 35 }, { label: "T3", value: 50 }, { label: "T4", value: 42 },
    { label: "T5", value: 68 }, { label: "T6", value: 55 }, { label: "T7", value: 30 }, { label: "CN", value: 20 }
  ];
  const barColors = ["#FFB088", "#FFB088", "#FFB088", "#FF6B35", "#FFB088", "#FFB088", "#FFB088"];

  const MAJOR_LABELS = { SE: "Kỹ thuật phần mềm", AI: "Trí tuệ nhân tạo", IS: "An toàn thông tin", BA: "Quản trị kinh doanh", GD: "Thiết kế đồ họa", MC: "Truyền thông đa phương tiện", FIN: "Tài chính", HT: "Khách sạn & Du lịch", MK: "Marketing" };
  const conversionData = Object.entries(statsByMajor).slice(0, 4).map(([code, count]) => ({
    label: MAJOR_LABELS[code] || code,
    percent: stats.totalApplications > 0 ? Math.round((count / stats.totalApplications) * 100) : 0
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: "#0F172A" }}>
            Bảng điều khiển - Phân tích Tuyển sinh
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748B" }}>
            Chào mừng trở lại! Hệ thống đã cập nhật dữ liệu phân tích mới nhất cho kỳ tuyển sinh {stats.activeYear || 2026}.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportCSV} style={{
            padding: "10px 18px", background: "white", border: "1px solid #E2E8F0",
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
            transition: "all 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}
          >
            <Download size={15} /> Xuất báo cáo
          </button>
          <button style={{
            padding: "10px 18px", background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
            border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "white",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 7,
            boxShadow: "0 4px 12px rgba(255,107,53,0.3)", transition: "all 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            <RefreshCw size={15} /> Làm mới dữ liệu
          </button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <div style={{
        background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
        borderRadius: 16, padding: "18px 24px",
        border: "1px solid #FED7AA",
        display: "flex", alignItems: "center", gap: 16
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <Sparkles size={22} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#9A3412", letterSpacing: "0.5px", marginBottom: 6 }}>
            GỢI Ý THÔNG MINH (AI INSIGHTS)
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#78350F" }}>
            <div>
              <span style={{ fontWeight: 600 }}>🔍 Dự báo:</span> Ngành CNTT đang đạt 92% chỉ tiêu. Cân nhắc tăng điều kiện xét tuyển hoặc tạm dừng ưu đãi học phí.
            </div>
            <div>
              <span style={{ fontWeight: 600 }}>💡 Cơ hội:</span> Nhu cầu ngành Ngôn ngữ tăng 15% so với tuần trước. Hãy đẩy mạnh chiến dịch quảng cáo tại khu vực Miền Bắc.
            </div>
          </div>
        </div>
        <button style={{
          padding: "8px 18px", background: "#FF6B35", border: "none", borderRadius: 8,
          color: "white", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 5
        }}>
          Xem chi tiết
        </button>
      </div>

      {/* Analytics Center */}
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <BarChart3 size={18} color="#FF6B35" /> Trung tâm Phân tích
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: 16 }}>
          {/* Xu hướng hồ sơ */}
          <div style={{
            background: "white", borderRadius: 14, padding: 20,
            border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Xu hướng hồ sơ</div>
              <select style={{
                border: "1px solid #E2E8F0", borderRadius: 6, padding: "4px 8px",
                fontSize: 11, color: "#64748B", background: "white", cursor: "pointer"
              }}>
                <option>7 ngày qua</option>
                <option>30 ngày qua</option>
              </select>
            </div>
            <MiniBarChart data={barChartData} colors={barColors} />
            <div style={{ textAlign: "center", fontSize: 11, color: "#94A3B8", marginTop: 8 }}>
              Tổng hồ sơ thực tế tăng 12% so với tuần trước
            </div>
            <div style={{ textAlign: "right", marginTop: 6 }}>
              <button style={{ fontSize: 11, color: "#FF6B35", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                Phân tích chuyên sâu →
              </button>
            </div>
          </div>

          {/* Tỷ lệ chuyển đổi */}
          <div style={{
            background: "white", borderRadius: 14, padding: 20,
            border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Tỷ lệ chuyển đổi</div>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>⋮</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {conversionData.map((item) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    flex: 1, height: 8, background: "#F1F5F9", borderRadius: 99,
                    overflow: "hidden"
                  }}>
                    <div style={{
                      height: "100%", width: `${item.percent}%`,
                      background: item.percent > 50 ? "#FF6B35" : "#FFB088",
                      borderRadius: 99, transition: "width 0.8s ease"
                    }} />
                  </div>
                  <span style={{ fontSize: 12, color: "#1E293B", fontWeight: 600, minWidth: 90 }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#FF6B35", minWidth: 35, textAlign: "right" }}>{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dự báo chỉ tiêu */}
          <div style={{
            background: "white", borderRadius: 14, padding: 20,
            border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex", flexDirection: "column", alignItems: "center"
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 12, alignSelf: "flex-start" }}>Dự báo chỉ tiêu</div>
            <div style={{ position: "relative", width: 110, height: 110, marginBottom: 10 }}>
              <DonutChart percentage={Math.min(quotaPercent, 100)} size={110} strokeWidth={12} />
              <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                textAlign: "center"
              }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#FF6B35" }}>{quotaPercent}%</div>
                <div style={{ fontSize: 9, color: "#94A3B8", fontWeight: 600 }}>TIẾN ĐỘ</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#64748B", textAlign: "center", lineHeight: 1.5 }}>
              Hệ thống dự báo sẽ đạt 100% chỉ tiêu trước ngày 15/08.
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>ĐÃ TUYỂN</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>{(stats.enrolled ?? 0).toLocaleString()}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10, color: "#94A3B8", fontWeight: 600 }}>CÒN LẠI</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>{((stats.quota ?? 0) - (stats.enrolled ?? 0)).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theo dõi theo nhóm ngành */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: 0 }}>Theo dõi theo nhóm ngành</h2>
          <button style={{
            fontSize: 13, color: "#FF6B35", fontWeight: 600, background: "none",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4
          }}>
            Quản lý ngành học <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            {
              name: "Công nghệ thông tin (IT)",
              desc: "Kỹ thuật phần mềm, Trí tuệ nhân tạo, An toàn thông tin",
              icon: Monitor,
              count: stats.itTotal ?? 0,
              search: "CNTT",
              accent: "#FF6B35",
              iconBg: "#FFF7ED",
              iconColor: "#FF6B35",
            },
            {
              name: "Kinh tế & Quản trị",
              desc: "Quản trị kinh doanh, Digital Marketing, Tài chính - Ngân hàng",
              icon: Briefcase,
              count: (statsByMajor['BA'] ?? 0) + (statsByMajor['MK'] ?? 0) + (statsByMajor['FIN'] ?? 0),
              search: "Kinh tế",
              accent: "#FF6B35",
              iconBg: "#FFF7ED",
              iconColor: "#FF6B35",
            },
            {
              name: "Thiết kế & Nghệ thuật",
              desc: "Thiết kế đồ họa, Truyền thông đa phương tiện",
              icon: Palette,
              count: (statsByMajor['GD'] ?? 0) + (statsByMajor['MC'] ?? 0),
              search: "Thiết kế",
              accent: "#FF6B35",
              iconBg: "#FFF7ED",
              iconColor: "#FF6B35",
            },
            {
              name: "Du lịch & Khách sạn",
              desc: "Quản trị khách sạn, Quản trị du lịch",
              icon: Trophy,
              count: statsByMajor['HT'] ?? 0,
              search: "Khách sạn",
              accent: "#FF6B35",
              iconBg: "#FFF7ED",
              iconColor: "#FF6B35",
            },
          ].map(g => (
            <div key={g.name} style={{
              background: "white", borderRadius: 16, padding: "24px",
              border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 16
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: g.iconBg, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <g.icon size={20} color={g.iconColor} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>{g.desc}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 34, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{g.count.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, marginTop: 4 }}>TỔNG HỒ SƠ</div>
                </div>
                <button onClick={() => navigate(`/officer/applicants?search=${encodeURIComponent(g.search)}`)} style={{
                  padding: "9px 20px",
                  background: g.iconBg === "#1E293B" ? "linear-gradient(135deg, #FF6B35, #E85A2A)" : "white",
                  border: g.iconBg === "#1E293B" ? "none" : "1px solid #E2E8F0",
                  borderRadius: 10, fontSize: 13, fontWeight: 600,
                  color: g.iconBg === "#1E293B" ? "white" : "#64748B",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  boxShadow: g.iconBg === "#1E293B" ? "0 4px 12px rgba(255,107,53,0.3)" : "none"
                }}>
                  Xem chi tiết <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0F172A", margin: 0 }}>Hoạt động gần đây</h2>
          <button onClick={() => navigate("/officer/applicants")} style={{
            fontSize: 13, color: "#FF6B35", fontWeight: 600, background: "none",
            border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4
          }}>
            Xem tất cả <ChevronRight size={14} />
          </button>
        </div>
        <div style={{
          background: "white", borderRadius: 16, border: "1px solid #F1F5F9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["SINH VIÊN", "NGÀNH HỌC", "TRẠNG THÁI", "THỜI GIAN"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "12px 20px", fontSize: 11,
                    fontWeight: 700, letterSpacing: "0.05em", color: "#94A3B8",
                    background: "#FAFBFC", borderBottom: "1px solid #F1F5F9"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loadingRecent ? (
                <tr>
                  <td colSpan={4} style={{ padding: 30, textAlign: "center", fontSize: 13, color: "#94A3B8" }}>
                    Đang tải hoạt động...
                  </td>
                </tr>
              ) : recentApps.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 30, textAlign: "center", fontSize: 13, color: "#94A3B8" }}>
                    Chưa có hoạt động gần đây
                  </td>
                </tr>
              ) : (
                recentApps.map((app, idx) => {
                  const statusC = STATUS_COLORS[app.status] || STATUS_COLORS.DRAFT;
                  const avatarColors = [
                    { bg: "#FEE2E2", color: "#DC2626" },
                    { bg: "#DBEAFE", color: "#1D4ED8" },
                    { bg: "#D1FAE5", color: "#065F46" },
                    { bg: "#FEF3C7", color: "#92400E" },
                    { bg: "#EDE9FE", color: "#5B21B6" },
                  ];
                  const ac = avatarColors[idx % avatarColors.length];
                  return (
                    <tr key={app.id} style={{ cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#FAFBFC"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      onClick={() => navigate(`/officer/applicants/${app.id}`)}
                    >
                      <td style={{ padding: "14px 20px", borderBottom: "1px solid #F8FAFC" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: ac.bg, color: ac.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: 12, flexShrink: 0
                          }}>{getInitials(app.studentName)}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{app.studentName}</div>
                            <div style={{ fontSize: 11, color: "#94A3B8" }}>{app.applicationCode}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#475569", borderBottom: "1px solid #F8FAFC" }}>
                        {app.majorName || "Kỹ thuật phần mềm"}
                      </td>
                      <td style={{ padding: "14px 20px", borderBottom: "1px solid #F8FAFC" }}>
                        <span style={{
                          display: "inline-block", padding: "4px 10px", borderRadius: 999,
                          fontSize: 11, fontWeight: 700, background: statusC.bg, color: statusC.color
                        }}>
                          {STATUS_LABELS[app.status]}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "#94A3B8", borderBottom: "1px solid #F8FAFC" }}>
                        {app.submittedAt ? (() => {
                          const mins = Math.round((Date.now() - new Date(app.submittedAt)) / 60000);
                          if (mins < 60) return `${mins} phút trước`;
                          if (mins < 1440) return `${Math.round(mins / 60)} giờ trước`;
                          return `${Math.round(mins / 1440)} ngày trước`;
                        })() : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
