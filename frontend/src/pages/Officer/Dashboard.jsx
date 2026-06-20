import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import {
  FileText, Clock, CheckCircle, XCircle,
  ArrowUpRight, ArrowDownRight, Users, GraduationCap, Trophy, Percent
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MOCK_STATS = {
  totalApplications: 1248,
  submitted: 450,
  underReview: 210,
  approved: 320,
  rejected: 88,
  enrolled: 180,
};

const MOCK_RECENT = [
  { id: 1, studentName: "Nguyễn Văn Hiếu", email: "hieunv@student.fpt.edu.vn", applicationCode: "FPT2024-001", majorName: "Kỹ thuật phần mềm", campusName: "Hà Nội", status: "APPROVED", submittedAt: "12/05/2024" },
  { id: 2, studentName: "Trần Thị Thanh", email: "thanhtt@gmail.com", applicationCode: "FPT2024-002", majorName: "Kỹ thuật phần mềm", campusName: "TP.HCM", status: "UNDER_REVIEW", submittedAt: "15/05/2024" },
  { id: 3, studentName: "Lê Văn Minh", email: "minhiv@outlook.com", applicationCode: "FPT2024-003", majorName: "Quản trị kinh doanh", campusName: "Đà Nẵng", status: "REJECTED", submittedAt: "18/05/2024" },
  { id: 4, studentName: "Phạm Quang Huy", email: "huyphuquang@student.fpt.edu.vn", applicationCode: "FPT2024-004", majorName: "AI", campusName: "Hà Nội", status: "ENROLLED", submittedAt: "20/05/2024" },
];

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

const AVATAR_COLORS = [
  { bg: "#DBEAFE", color: "#1D4ED8" },
  { bg: "#FEF3C7", color: "#92400E" },
  { bg: "#D1FAE5", color: "#065F46" },
  { bg: "#EDE9FE", color: "#5B21B6" },
];

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function OfficerDashboard() {
  const [stats, setStats] = useState(MOCK_STATS);
  const [recentApps, setRecentApps] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/officer/dashboard")
      .then(r => {
        if (r.data) setStats(r.data);
      })
      .catch(() => {});

    setLoadingRecent(true);
    api.get("/api/officer/applications?page=0&size=5")
      .then(r => {
        const data = r.data?.content;
        if (Array.isArray(data)) {
          setRecentApps(data);
        }
      })
      .catch(err => console.error("Error fetching recent apps:", err))
      .finally(() => setLoadingRecent(false));
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
      label: "Đã nộp",
      value: stats.submitted,
      icon: Users,
      iconBg: "#FFFBEB",
      iconColor: "#D97706",
      badge: { text: "Chờ xét", neutral: true },
      borderColor: "#D97706",
    },
    {
      label: "Đã duyệt",
      value: stats.approved,
      icon: CheckCircle,
      iconBg: "#ECFDF5",
      iconColor: "#059669",
      badge: { text: "+8%", positive: true },
      borderColor: "#059669",
    },
    {
      label: "Từ chối",
      value: stats.rejected,
      icon: XCircle,
      iconBg: "#FEF2F2",
      iconColor: "#DC2626",
      badge: { text: "-2%", positive: false },
      borderColor: "#DC2626",
    },
  ];

  const tabStats = [
    { label: "Tất cả", count: stats.totalApplications },
    { label: "Đã nộp", count: stats.submitted },
    { label: "Đang xét", count: stats.underReview },
    { label: "Đã duyệt", count: stats.approved },
    { label: "Từ chối", count: stats.rejected },
    { label: "Nhập học", count: stats.enrolled },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Page Header */}
      <div>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: "#0F172A" }}>
          Dashboard - Nhân viên tuyển sinh
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
          Tổng quan tình hình tuyển sinh năm học {stats.activeYear || 2026}
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{
            background: "white", borderRadius: 16, padding: "20px 20px 18px",
            border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            borderTop: `3px solid ${kpi.borderColor}`, transition: "all 0.2s"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: kpi.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <kpi.icon size={22} color={kpi.iconColor} />
              </div>
              {kpi.badge?.positive === true && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: "#16A34A", background: "#DCFCE7", padding: "3px 8px", borderRadius: 999 }}>
                  <ArrowUpRight size={11} /> {kpi.badge.text}
                </span>
              )}
              {kpi.badge?.positive === false && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: "#DC2626", background: "#FEE2E2", padding: "3px 8px", borderRadius: 999 }}>
                  <ArrowDownRight size={11} /> {kpi.badge.text}
                </span>
              )}
              {kpi.badge?.neutral && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 600, color: "#D97706", background: "#FEF3C7", padding: "3px 8px", borderRadius: 999 }}>
                  {kpi.badge.text}
                </span>
              )}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
              {kpi.value?.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 6, fontWeight: 500 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Main content: table + sidebar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>

        {/* Left: Danh sách hồ sơ */}
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          {/* Search + Actions */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, flex: 1,
              background: "#F8FAFC", border: "1px solid #E2E8F0",
              borderRadius: 10, padding: "8px 14px"
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="text" placeholder="Tìm kiếm theo tên thí sinh, SĐT hoặc mã hồ sơ..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%" }} />
            </div>
            <button style={{ padding: "9px 16px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Xuất báo cáo
            </button>
            <button
              onClick={() => navigate("/officer/applicants")}
              style={{ padding: "9px 16px", background: "#FF6B35", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              + Thêm hồ sơ mới
            </button>
          </div>

          {/* Status Tabs */}
          <div style={{ display: "flex", gap: 0, padding: "0 20px", borderBottom: "1px solid #F1F5F9", overflowX: "auto" }}>
            {tabStats.map((tab, i) => (
              <button key={tab.label} style={{
                padding: "12px 16px", background: "none", border: "none",
                borderBottom: i === 0 ? "2px solid #FF6B35" : "2px solid transparent",
                fontWeight: i === 0 ? 700 : 500,
                fontSize: 13, color: i === 0 ? "#FF6B35" : "#64748B",
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s"
              }}>
                {tab.label} ({(tab.count || 0).toLocaleString()})
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Mã hồ sơ", "Họ và tên", "Ngày nộp", "Trạng thái", "Thao tác"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#94A3B8", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(recentApps.length > 0 ? recentApps : MOCK_RECENT).map((app, idx) => {
                  const avatarC = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  const statusC = STATUS_COLORS[app.status] || STATUS_COLORS.DRAFT;
                  return (
                    <tr key={app.id} style={{ cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      onClick={() => navigate(`/officer/applicants/${app.id}`)}>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B", borderBottom: "1px solid #F8FAFC" }}>
                        <div style={{ fontWeight: 700, color: "#1E293B", fontSize: 12 }}>{app.applicationCode}</div>
                      </td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: avatarC.bg, color: avatarC.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: 12, flexShrink: 0
                          }}>
                            {getInitials(app.studentName)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{app.studentName}</div>
                            <div style={{ fontSize: 11, color: "#94A3B8" }}>{app.studentEmail || app.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B", borderBottom: "1px solid #F8FAFC" }}>
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("vi-VN") : "Chưa nộp"}
                      </td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        <span style={{
                          display: "inline-block", padding: "4px 10px", borderRadius: 999,
                          fontSize: 11, fontWeight: 700,
                          background: statusC.bg, color: statusC.color
                        }}>
                          {STATUS_LABELS[app.status]}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/officer/applicants/${app.id}`); }}
                          style={{ fontSize: 13, color: "#2563EB", fontWeight: 600, background: "none", border: "none", cursor: "pointer", textDecoration: "none" }}>
                          Xét duyệt →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Hiển thị {recentApps.length} trong tổng số {(stats.totalApplications || recentApps.length).toLocaleString()} hồ sơ
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              {["‹", "1", "2", "3", "›"].map((p, i) => (
                <button key={i} style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: p === "1" ? "none" : "1px solid #E2E8F0",
                  background: p === "1" ? "#FF6B35" : "white",
                  color: p === "1" ? "white" : "#475569",
                  fontWeight: p === "1" ? 700 : 500,
                  fontSize: 13, cursor: "pointer"
                }}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Chỉ tiêu tuyển sinh */}
          <div style={{
            background: "#0d1b3e", borderRadius: 16, padding: 20,
            position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: "rgba(255,107,53,0.15)", borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: -30, right: 20, width: 60, height: 60, background: "rgba(255,107,53,0.08)", borderRadius: "50%" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 4 }}>Chỉ tiêu Tuyển sinh</div>
            <div style={{ fontSize: 11, color: "rgba(148,163,184,0.8)", marginBottom: 14 }}>Năm học {stats.activeYear || 2026}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 34, fontWeight: 900, color: "white" }}>
                {stats.quota > 0 ? Math.round((stats.enrolled / stats.quota) * 100) : 0}%
              </span>
              <span style={{ fontSize: 13, color: "#22C55E", fontWeight: 700 }}>↑ Động</span>
            </div>
            <div style={{ fontSize: 11, color: "rgba(148,163,184,0.7)", marginBottom: 12 }}>
              Đã đạt {(stats.enrolled || 0).toLocaleString()} / {(stats.quota || 18000).toLocaleString()} chỉ tiêu
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                width: `${stats.quota > 0 ? Math.min(100, Math.round((stats.enrolled / stats.quota) * 100)) : 0}%`,
                height: "100%",
                background: "linear-gradient(90deg, #FF6B35, #FF8C5A)",
                borderRadius: 99
              }} />
            </div>
            {/* Graduation icon */}
            <div style={{ position: "absolute", bottom: 14, right: 16, opacity: 0.15 }}>
              <GraduationCap size={40} color="white" />
            </div>
          </div>

          {/* Thống kê nhanh */}
          <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
              <Trophy size={15} color="#FF6B35" /> Hiệu suất hôm nay
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Hồ sơ đã xét", value: "12/15", color: "#2563EB", bg: "#EFF6FF" },
                { label: "Tỉ lệ duyệt", value: "80%", color: "#059669", bg: "#ECFDF5" },
                { label: "Chờ xử lý", value: stats.underReview, color: "#D97706", bg: "#FFFBEB" },
                { label: "Đã nhập học", value: stats.enrolled, color: "#7C3AED", bg: "#F5F3FF" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: item.bg, borderRadius: 10 }}>
                  <span style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: item.color }}>{typeof item.value === "number" ? item.value.toLocaleString() : item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phân bổ trạng thái */}
          <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", marginBottom: 14 }}>Bộ lọc nhanh</div>
            {[
              { label: "Hồ sơ có học bổng", checked: false },
              { label: "Ưu tiên khu vực 1", checked: false },
              { label: "Cần bổ sung giấy tờ", checked: false },
            ].map(item => (
              <label key={item.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, cursor: "pointer" }}>
                <input type="checkbox" defaultChecked={item.checked} style={{ width: 15, height: 15, accentColor: "#FF6B35" }} />
                <span style={{ fontSize: 13, color: "#475569" }}>{item.label}</span>
              </label>
            ))}
            <button style={{ width: "100%", marginTop: 8, padding: "9px", background: "white", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 13, color: "#64748B", cursor: "pointer", fontWeight: 600 }}>
              Xóa tất cả bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
