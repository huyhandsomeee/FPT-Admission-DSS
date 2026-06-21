import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import {
  FileText, Clock, CheckCircle, XCircle,
  ArrowUpRight, ArrowDownRight, Users, GraduationCap, Trophy
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

  const [recentApps, setRecentApps] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const navigate = useNavigate();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(""); // "" means All
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchApplications = (search = "", status = "", page = 0) => {
    setLoadingRecent(true);
    let url = `/api/officer/applications?page=${page}&size=10`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status) url += `&status=${status}`;

    api.get(url)
      .then(r => {
        const content = r.data?.content;
        if (Array.isArray(content)) {
          setRecentApps(content);
          setTotalPages(r.data?.totalPages || 1);
          setTotalElements(r.data?.totalElements || 0);
        }
      })
      .catch(err => console.error("Error fetching applications:", err))
      .finally(() => setLoadingRecent(false));
  };

  useEffect(() => {
    // Fetch stats
    api.get("/api/officer/dashboard")
      .then(r => {
        if (r.data) setStats(r.data);
      })
      .catch(() => {});
  }, []);

  // Fetch applications when status filter or page change
  useEffect(() => {
    fetchApplications(searchTerm, selectedStatus, currentPage);
  }, [selectedStatus, currentPage]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    setCurrentPage(0);
    fetchApplications(val, selectedStatus, 0);
  };

  const handleTabClick = (status) => {
    setSelectedStatus(status);
    setCurrentPage(0);
  };

  const handleExportCSV = () => {
    if (recentApps.length === 0) {
      alert("Không có hồ sơ nào để xuất báo cáo");
      return;
    }

    const headers = ["Mã hồ sơ", "Họ tên", "Email", "Ngành học", "Cơ sở", "Phương thức", "Điểm số", "Ngày nộp", "Trạng thái"];
    const rows = recentApps.map(app => [
      app.applicationCode || "",
      app.studentName || "",
      app.studentEmail || "",
      app.majorName || "",
      app.campusName || "",
      app.methodName || "",
      app.totalScore || "",
      app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("vi-VN") : "Chưa nộp",
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
    { label: "Tất cả", count: stats.totalApplications, status: "" },
    { label: "Đã nộp", count: stats.submitted, status: "SUBMITTED" },
    { label: "Đang xét", count: stats.underReview, status: "UNDER_REVIEW" },
    { label: "Đã duyệt", count: stats.approved, status: "APPROVED" },
    { label: "Từ chối", count: stats.rejected, status: "REJECTED" },
    { label: "Nhập học", count: stats.enrolled, status: "ENROLLED" },
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
              {(kpi.value || 0).toLocaleString()}
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
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm theo tên thí sinh, SĐT hoặc mã hồ sơ..."
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%" }}
              />
            </div>
            <button
              onClick={handleExportCSV}
              style={{ padding: "9px 16px", background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Xuất báo cáo
            </button>
            <button
              onClick={() => navigate("/officer/applicants")}
              style={{ padding: "9px 16px", background: "#FF6B35", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              Xem danh sách chi tiết
            </button>
          </div>

          {/* Status Tabs */}
          <div style={{ display: "flex", gap: 0, padding: "0 20px", borderBottom: "1px solid #F1F5F9", overflowX: "auto" }}>
            {tabStats.map((tab) => {
              const isActive = selectedStatus === tab.status;
              return (
                <button
                  key={tab.label}
                  onClick={() => handleTabClick(tab.status)}
                  style={{
                    padding: "12px 16px", background: "none", border: "none",
                    borderBottom: isActive ? "2px solid #FF6B35" : "2px solid transparent",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: 13, color: isActive ? "#FF6B35" : "#64748B",
                    cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s"
                  }}
                >
                  {tab.label} ({(tab.count || 0).toLocaleString()})
                </button>
              );
            })}
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
                {loadingRecent ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "30px", textScale: "center", textAlign: "center", fontSize: "13px", color: "#64748B" }}>
                      Đang tải danh sách hồ sơ tuyển sinh...
                    </td>
                  </tr>
                ) : recentApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "30px", textScale: "center", textAlign: "center", fontSize: "13px", color: "#64748B" }}>
                      Không có hồ sơ nào trùng khớp với bộ lọc hiện tại.
                    </td>
                  </tr>
                ) : (
                  recentApps.map((app, idx) => {
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
                              <div style={{ fontSize: 11, color: "#94A3B8" }}>{app.studentEmail}</div>
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
                            style={{ fontSize: 13, color: "#FF6B35", fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "none" }}>
                            Xét duyệt →
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyItems: "space-between", justifyContent: "space-between", borderTop: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Hiển thị {recentApps.length} trên tổng số {totalElements.toLocaleString()} hồ sơ
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: "1px solid #E2E8F0", background: "white",
                  color: "#475569", cursor: currentPage === 0 ? "not-allowed" : "pointer",
                  opacity: currentPage === 0 ? 0.5 : 1
                }}
              >
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: currentPage === i ? "none" : "1px solid #E2E8F0",
                    background: currentPage === i ? "#FF6B35" : "white",
                    color: currentPage === i ? "white" : "#475569",
                    fontWeight: currentPage === i ? 700 : 500,
                    cursor: "pointer"
                  }}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages - 1 || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  border: "1px solid #E2E8F0", background: "white",
                  color: "#475569", cursor: (currentPage === totalPages - 1 || totalPages === 0) ? "not-allowed" : "pointer",
                  opacity: (currentPage === totalPages - 1 || totalPages === 0) ? 0.5 : 1
                }}
              >
                ›
              </button>
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
                { label: "Hồ sơ đang xét", value: stats.underReview, color: "#D97706", bg: "#FFFBEB" },
                { label: "Hồ sơ đã duyệt", value: stats.approved, color: "#059669", bg: "#ECFDF5" },
                { label: "Hồ sơ từ chối", value: stats.rejected, color: "#DC2626", bg: "#FEF2F2" },
                { label: "Đã nhập học", value: stats.enrolled, color: "#7C3AED", bg: "#F5F3FF" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: item.bg, borderRadius: 10 }}>
                  <span style={{ fontSize: 12, color: "#475569", fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: item.color }}>{(item.value || 0).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bộ lọc nhanh */}
          <div style={{ background: "white", borderRadius: 16, padding: 20, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", marginBottom: 14 }}>Tìm kiếm nhanh</div>
            {[
              { label: "Kỹ thuật phần mềm", query: "Kỹ thuật phần mềm" },
              { label: "Hòa Lạc", query: "Hòa Lạc" },
              { label: "Học bạ", query: "học bạ" },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => { setSearchTerm(item.query); fetchApplications(item.query, selectedStatus, 0); }}
                style={{
                  width: "100%", textAlign: "left", padding: "8px 12px", background: "#F8FAFC",
                  border: "1px solid #E2E8F0", borderRadius: "8px", fontSize: "12px",
                  color: "#475569", marginBottom: "8px", cursor: "pointer", fontWeight: "600",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#F1F5F9"}
                onMouseLeave={e => e.currentTarget.style.background = "#F8FAFC"}
              >
                🔍 Lọc: "{item.label}"
              </button>
            ))}
            <button
              onClick={() => { setSearchTerm(""); setSelectedStatus(""); setCurrentPage(0); fetchApplications("", "", 0); }}
              style={{ width: "100%", marginTop: 8, padding: "9px", background: "white", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: 13, color: "#FF6B35", cursor: "pointer", fontWeight: 700 }}
            >
              Reset tất cả bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
