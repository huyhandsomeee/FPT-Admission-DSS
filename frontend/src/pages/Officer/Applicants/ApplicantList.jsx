import { useState, useEffect } from "react";
import api from "../../../config/axiosConfig";
import { Search, Eye, Download, Plus, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUSES = ["", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "ENROLLED"];
const STATUS_LABELS = {
  "": "Tất cả", SUBMITTED: "Đã nộp", UNDER_REVIEW: "Đang xét",
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
  { bg: "#FEE2E2", color: "#991B1B" },
  { bg: "#EDE9FE", color: "#5B21B6" },
  { bg: "#FFF7ED", color: "#C2410C" },
];

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

// View mode: "applications" hoặc "students"
const VIEW_MODES = [
  { key: "applications", label: "Hồ sơ xét tuyển", icon: FileText },
  { key: "students", label: "Danh sách thí sinh", icon: Users },
];

export default function ApplicantList() {
  const navigate = useNavigate();

  // View mode
  const [viewMode, setViewMode] = useState("applications");

  // Applications state
  const [apps, setApps] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    "": 0, SUBMITTED: 0, UNDER_REVIEW: 0, APPROVED: 0, REJECTED: 0, ENROLLED: 0
  });

  // Students state
  const [students, setStudents] = useState([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentTotal, setStudentTotal] = useState(0);

  // Load dashboard stats
  useEffect(() => {
    api.get("/api/officer/dashboard")
      .then(r => {
        if (r.data) {
          const d = r.data;
          setStatusCounts({
            "": d.totalApplications || 0,
            SUBMITTED: d.submitted || 0,
            UNDER_REVIEW: d.underReview || 0,
            APPROVED: d.approved || 0,
            REJECTED: d.rejected || 0,
            ENROLLED: d.enrolled || 0
          });
        }
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, [apps]);

  // Load applications
  useEffect(() => {
    if (viewMode !== "applications") return;
    setLoading(true);
    api.get(`/api/officer/applications?status=${statusFilter}&search=${search}&size=100`)
      .then(r => {
        const data = r.data?.content;
        setApps(Array.isArray(data) ? data : []);
      })
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, [statusFilter, search, viewMode]);

  // Load students
  useEffect(() => {
    if (viewMode !== "students") return;
    setStudentLoading(true);
    api.get(`/api/officer/students?search=${studentSearch}&size=100`)
      .then(r => {
        const data = r.data?.content;
        setStudents(Array.isArray(data) ? data : []);
        setStudentTotal(r.data?.totalElements || 0);
      })
      .catch(() => setStudents([]))
      .finally(() => setStudentLoading(false));
  }, [studentSearch, viewMode]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: "#0F172A" }}>Quản lý thí sinh & hồ sơ</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
            Tuyển sinh năm 2026 • Cơ sở dữ liệu thí sinh toàn hệ thống
          </p>
        </div>
        {/* View Mode Toggle */}
        <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 12, padding: 4, gap: 2 }}>
          {VIEW_MODES.map(m => (
            <button
              key={m.key}
              onClick={() => setViewMode(m.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 9, border: "none",
                background: viewMode === m.key ? "white" : "transparent",
                color: viewMode === m.key ? "#FF6B35" : "#64748B",
                fontWeight: viewMode === m.key ? 700 : 500,
                fontSize: 13, cursor: "pointer",
                boxShadow: viewMode === m.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.15s"
              }}
            >
              <m.icon size={14} /> {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= APPLICATIONS VIEW ================= */}
      {viewMode === "applications" && (
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          {/* Search + Actions */}
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, flex: 1,
              background: "#F8FAFC", border: "1px solid #E2E8F0",
              borderRadius: 10, padding: "9px 14px"
            }}>
              <Search size={15} color="#94A3B8" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Tìm kiếm theo tên thí sinh, SĐT hoặc mã hồ sơ..."
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%" }}
              />
            </div>
            <button style={{
              padding: "9px 16px", background: "#F1F5F9", border: "1px solid #E2E8F0",
              borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6
            }}>
              <Download size={14} /> Xuất báo cáo
            </button>
            <button style={{
              padding: "9px 16px", background: "#FF6B35", border: "none",
              borderRadius: 10, fontSize: 13, fontWeight: 600, color: "white",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6
            }}>
              <Plus size={14} /> Thêm hồ sơ mới
            </button>
          </div>

          {/* Status Tabs */}
          <div style={{ display: "flex", gap: 0, padding: "0 20px", borderBottom: "1px solid #F1F5F9", overflowX: "auto" }}>
            {STATUSES.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: "12px 16px", background: "none", border: "none",
                borderBottom: statusFilter === s ? "2px solid #FF6B35" : "2px solid transparent",
                fontWeight: statusFilter === s ? 700 : 500,
                fontSize: 13,
                color: statusFilter === s ? "#FF6B35" : "#64748B",
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s"
              }}>
                {STATUS_LABELS[s]} ({(statusCounts[s] || 0).toLocaleString()})
              </button>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
                Đang tải dữ liệu...
              </div>
            ) : apps.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
                Không tìm thấy hồ sơ nào
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Mã hồ sơ", "Họ và tên", "Ngành - Cơ sở", "Phương thức", "Điểm", "Ngày nộp", "Trạng thái", "Thao tác"].map(h => (
                      <th key={h} style={{
                        textAlign: "left", padding: "10px 16px",
                        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "0.05em", color: "#94A3B8",
                        background: "#F8FAFC", borderBottom: "1px solid #F1F5F9"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app, idx) => {
                    const avatarC = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                    const statusC = STATUS_COLORS[app.status] || STATUS_COLORS.DRAFT;
                    return (
                      <tr key={app.id}
                        style={{ cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        onClick={() => navigate(`/officer/applicants/${app.id}`)}>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                          <code style={{ fontSize: 12, fontWeight: 700, color: "#1E293B", background: "#F1F5F9", padding: "2px 8px", borderRadius: 6 }}>{app.applicationCode}</code>
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
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                          <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 13 }}>{app.majorName}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>{app.campusName}</div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B", borderBottom: "1px solid #F8FAFC" }}>{app.methodName}</td>
                        <td style={{ padding: "14px 16px", fontWeight: 800, fontSize: 14, color: "#2563EB", borderBottom: "1px solid #F8FAFC" }}>{app.totalScore}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#94A3B8", borderBottom: "1px solid #F8FAFC" }}>
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
                            style={{
                              display: "flex", alignItems: "center", gap: 5,
                              fontSize: 13, color: "#2563EB", fontWeight: 600,
                              background: "none", border: "none", cursor: "pointer"
                            }}>
                            <Eye size={14} /> Xét duyệt
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Hiển thị {apps.length} trong tổng số {(statusCounts[statusFilter] || apps.length).toLocaleString()} hồ sơ
            </span>
          </div>
        </div>
      )}

      {/* ================= STUDENTS VIEW ================= */}
      {viewMode === "students" && (
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          {/* Search */}
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #F1F5F9" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, flex: 1,
              background: "#F8FAFC", border: "1px solid #E2E8F0",
              borderRadius: 10, padding: "9px 14px"
            }}>
              <Search size={15} color="#94A3B8" />
              <input
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email thí sinh..."
                style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%" }}
              />
            </div>
            <div style={{ fontSize: 13, color: "#64748B", whiteSpace: "nowrap" }}>
              Tổng: <strong style={{ color: "#1E293B" }}>{studentTotal.toLocaleString()}</strong> thí sinh
            </div>
          </div>

          {/* Students Table */}
          <div style={{ overflowX: "auto" }}>
            {studentLoading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
                Đang tải dữ liệu...
              </div>
            ) : students.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>
                Không tìm thấy thí sinh nào
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Thí sinh", "Email", "Số điện thoại", "Mã thí sinh", "Hồ sơ", "Trạng thái hồ sơ", "Ngày đăng ký"].map(h => (
                      <th key={h} style={{
                        textAlign: "left", padding: "10px 16px",
                        fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                        letterSpacing: "0.05em", color: "#94A3B8",
                        background: "#F8FAFC", borderBottom: "1px solid #F1F5F9"
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((stu, idx) => {
                    const avatarC = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                    const latestStatusC = stu.latestStatus
                      ? (STATUS_COLORS[stu.latestStatus] || STATUS_COLORS.DRAFT)
                      : null;
                    return (
                      <tr key={stu.id}
                        style={{ transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              background: avatarC.bg, color: avatarC.color,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontWeight: 700, fontSize: 12, flexShrink: 0
                            }}>
                              {getInitials(stu.fullName)}
                            </div>
                            <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{stu.fullName}</div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B", borderBottom: "1px solid #F8FAFC" }}>{stu.email}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B", borderBottom: "1px solid #F8FAFC" }}>{stu.phone || "—"}</td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                          {stu.studentCode
                            ? <code style={{ fontSize: 12, fontWeight: 700, color: "#1E293B", background: "#F1F5F9", padding: "2px 8px", borderRadius: 6 }}>{stu.studentCode}</code>
                            : <span style={{ fontSize: 12, color: "#CBD5E1" }}>Chưa có</span>
                          }
                        </td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                          {stu.hasProfile ? (
                            <span style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>
                              {stu.totalApplications} hồ sơ
                            </span>
                          ) : (
                            <span style={{ fontSize: 12, color: "#F59E0B", fontWeight: 600 }}>Chưa có hồ sơ</span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                          {stu.latestStatus && latestStatusC ? (
                            <span style={{
                              display: "inline-block", padding: "4px 10px", borderRadius: 999,
                              fontSize: 11, fontWeight: 700,
                              background: latestStatusC.bg, color: latestStatusC.color
                            }}>
                              {STATUS_LABELS[stu.latestStatus] || stu.latestStatus}
                            </span>
                          ) : (
                            <span style={{ fontSize: 12, color: "#CBD5E1" }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#94A3B8", borderBottom: "1px solid #F8FAFC" }}>
                          {stu.createdAt ? new Date(stu.createdAt).toLocaleDateString("vi-VN") : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ padding: "14px 20px", borderTop: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Hiển thị {students.length} trong tổng số {studentTotal.toLocaleString()} thí sinh đã đăng ký
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
