import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import {
  FileText, Clock, CheckCircle, XCircle,
  Percent, Hourglass, GraduationCap, Trophy,
  ArrowUpRight, ArrowDownRight, PieChart, TrendingUp
} from "lucide-react";

const MOCK_STATS = {
  totalApplications: 1248,
  submitted: 12,
  underReview: 85,
  approved: 1120,
  rejected: 43,
  enrolled: 842,
};

const MOCK_RECENT = [
  { id: 1, studentName: "Phạm Hữu Hân", applicationCode: "APP2025001001", majorName: "Kỹ thuật phần mềm", campusName: "Hà Nội", status: "UNDER_REVIEW", submittedAt: "2025-03-15" },
  { id: 2, studentName: "Lê Thị Mai", applicationCode: "APP2025002001", majorName: "Kỹ thuật phần mềm", campusName: "TP.HCM", status: "APPROVED", submittedAt: "2025-03-10" },
  { id: 3, studentName: "Hoàng Văn Nam", applicationCode: "APP2025003001", majorName: "Kỹ thuật phần mềm", campusName: "Đà Nẵng", status: "SUBMITTED", submittedAt: "2025-03-20" },
  { id: 4, studentName: "Nguyễn Thị Hoa", applicationCode: "APP2025004001", majorName: "AI", campusName: "Hà Nội", status: "REJECTED", submittedAt: "2025-03-18" },
];

const STATUS_BADGES = {
  DRAFT: "badge-draft",
  SUBMITTED: "badge-submitted",
  UNDER_REVIEW: "badge-review",
  APPROVED: "badge-approved",
  REJECTED: "badge-rejected",
  ENROLLED: "badge-enrolled",
};

const STATUS_LABELS = {
  DRAFT: "Bản nháp", SUBMITTED: "Đã nộp", UNDER_REVIEW: "Đang xét",
  APPROVED: "Đã duyệt", REJECTED: "Từ chối", ENROLLED: "Nhập học"
};

// Lấy 2 chữ cái đầu của tên
function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = {
  UNDER_REVIEW: { bg: "#FEF3C7", color: "#92400E" },
  APPROVED:     { bg: "#D1FAE5", color: "#065F46" },
  SUBMITTED:    { bg: "#DBEAFE", color: "#1D4ED8" },
  REJECTED:     { bg: "#FEE2E2", color: "#991B1B" },
};

export default function OfficerDashboard() {
  const [stats, setStats] = useState(MOCK_STATS);

  useEffect(() => {
    api.get("/api/officer/dashboard").then(r => setStats(r.data)).catch(() => {});
  }, []);

  const kpis = [
    {
      label: "Tổng hồ sơ",
      value: stats.totalApplications,
      icon: FileText,
      iconBg: "#EFF6FF",
      iconColor: "#2563EB",
      badge: { text: "+12%", positive: true },
      borderColor: "#2563EB",
    },
    {
      label: "Chờ xét duyệt",
      value: stats.underReview,
      icon: Clock,
      iconBg: "#FFFBEB",
      iconColor: "#D97706",
      badge: { text: "Chờ xét", neutral: true },
      borderColor: "#D97706",
    },
    {
      label: "Đã chấp thuận",
      value: stats.approved,
      icon: CheckCircle,
      iconBg: "#ECFDF5",
      iconColor: "#059669",
      badge: { text: "Tăng", positive: true },
      borderColor: "#059669",
    },
    {
      label: "Bị từ chối",
      value: stats.rejected,
      icon: XCircle,
      iconBg: "#FEF2F2",
      iconColor: "#DC2626",
      badge: { text: "-2%", positive: false },
      borderColor: "#DC2626",
    },
  ];

  const quickStats = [
    {
      label: "Tỷ lệ duyệt",
      value: `${Math.round(stats.approved / stats.totalApplications * 100)}%`,
      icon: Percent,
      iconBg: "#F0FDF4",
      iconColor: "#16A34A",
      valueColor: "#16A34A",
    },
    {
      label: "Chờ xử lý (Submitted)",
      value: `${stats.submitted} Hồ sơ`,
      icon: Hourglass,
      iconBg: "#EFF6FF",
      iconColor: "#2563EB",
      valueColor: "#2563EB",
    },
    {
      label: "Đã nhập học",
      value: stats.enrolled,
      icon: GraduationCap,
      iconBg: "#F5F3FF",
      iconColor: "#7C3AED",
      valueColor: "#374151",
    },
    {
      label: "KPI hôm nay",
      value: "12/15 hồ sơ",
      icon: Trophy,
      iconBg: "#FFF7ED",
      iconColor: "#EA580C",
      valueColor: "#EA580C",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard - Nhân viên tuyển sinh</h1>
        <p className="text-gray-500 text-sm mt-1">Tổng quan tình hình tuyển sinh 2025</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{
            background: "white",
            borderRadius: 16,
            padding: "20px 20px 18px",
            border: "1px solid #F1F5F9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            position: "relative",
            overflow: "hidden",
            transition: "all 0.2s",
            borderTop: `3px solid ${kpi.borderColor}`,
          }}>
            {/* Top row: icon + badge */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: kpi.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <kpi.icon size={22} color={kpi.iconColor} />
              </div>

              {/* Badge */}
              {kpi.badge.positive === true && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  fontSize: 11, fontWeight: 600,
                  color: "#16A34A", background: "#DCFCE7",
                  padding: "3px 8px", borderRadius: 999
                }}>
                  <ArrowUpRight size={11} /> {kpi.badge.text}
                </span>
              )}
              {kpi.badge.positive === false && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  fontSize: 11, fontWeight: 600,
                  color: "#DC2626", background: "#FEE2E2",
                  padding: "3px 8px", borderRadius: 999
                }}>
                  <ArrowDownRight size={11} /> {kpi.badge.text}
                </span>
              )}
              {kpi.badge.neutral && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 3,
                  fontSize: 11, fontWeight: 600,
                  color: "#D97706", background: "#FEF3C7",
                  padding: "3px 8px", borderRadius: 999
                }}>
                  {kpi.badge.text}
                </span>
              )}
            </div>

            {/* Value */}
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
              {kpi.value?.toLocaleString()}
            </div>
            {/* Label */}
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 6, fontWeight: 500 }}>
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Middle row: Progress bars + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phân bổ trạng thái */}
        <div style={{
          background: "white", borderRadius: 16, padding: 24,
          border: "1px solid #F1F5F9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Phân bổ trạng thái hồ sơ</h3>
            <PieChart size={16} color="#94A3B8" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { label: "Đã nộp", count: stats.totalApplications, color: "#2563EB", pct: 100 },
              { label: "Đang xét", count: stats.underReview, color: "#D97706", pct: Math.round(stats.underReview / stats.totalApplications * 100) },
              { label: "Đã duyệt", count: stats.approved, color: "#059669", pct: Math.round(stats.approved / stats.totalApplications * 100) },
              { label: "Từ chối", count: stats.rejected, color: "#DC2626", pct: Math.round(stats.rejected / stats.totalApplications * 100) },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 13, color: "#94A3B8" }}>
                    {item.count.toLocaleString()} ({item.pct}%)
                  </span>
                </div>
                <div style={{ width: "100%", height: 8, background: "#F1F5F9", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{
                    width: `${item.pct}%`, height: "100%",
                    background: item.color, borderRadius: 99,
                    transition: "width 0.7s ease"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div style={{
          background: "white", borderRadius: 16, padding: 24,
          border: "1px solid #F1F5F9",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Thống kê nhanh</h3>
            <TrendingUp size={16} color="#94A3B8" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {quickStats.map((stat) => (
              <div key={stat.label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 14px",
                background: "#F8FAFC",
                borderRadius: 12,
                border: "1px solid #F1F5F9"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9,
                    background: stat.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    <stat.icon size={16} color={stat.iconColor} />
                  </div>
                  <span style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>{stat.label}</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: stat.valueColor }}>
                  {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div style={{
        background: "white", borderRadius: 16,
        border: "1px solid #F1F5F9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "18px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid #F1F5F9"
        }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#1E293B" }}>Hồ sơ gần đây</h3>
          <a href="/officer/applicants" style={{
            fontSize: 13, color: "#2563EB", fontWeight: 600,
            textDecoration: "none", display: "flex", alignItems: "center", gap: 4
          }}>
            Xem tất cả <ArrowUpRight size={13} />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Thí sinh</th>
                <th>Mã hồ sơ</th>
                <th>Ngành học</th>
                <th>Cơ sở</th>
                <th>Ngày nộp</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_RECENT.map((app) => {
                const avatarStyle = AVATAR_COLORS[app.status] || { bg: "#F1F5F9", color: "#475569" };
                return (
                  <tr key={app.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: "50%",
                          background: avatarStyle.bg, color: avatarStyle.color,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontWeight: 700, fontSize: 12, flexShrink: 0
                        }}>
                          {getInitials(app.studentName)}
                        </div>
                        <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{app.studentName}</div>
                      </div>
                    </td>
                    <td><code style={{ fontSize: 12, color: "#64748B" }}>{app.applicationCode}</code></td>
                    <td style={{ color: "#475569" }}>{app.majorName}</td>
                    <td style={{ color: "#475569" }}>{app.campusName}</td>
                    <td style={{ color: "#94A3B8", fontSize: 13 }}>{app.submittedAt}</td>
                    <td><span className={`badge ${STATUS_BADGES[app.status]}`}>{STATUS_LABELS[app.status]}</span></td>
                    <td>
                      <a href={`/officer/applicants/${app.id}`}
                        style={{ color: "#2563EB", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                        Xét duyệt
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
