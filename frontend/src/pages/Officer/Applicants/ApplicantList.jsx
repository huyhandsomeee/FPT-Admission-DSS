import { useState, useEffect } from "react";
import api from "../../../config/axiosConfig";
import { Search, Eye, Download, Plus, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUSES = ["", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "ENROLLED"];
const STATUS_LABELS = {
  "": "Tất cả", SUBMITTED: "Đã nộp", UNDER_REVIEW: "Đang xét",
  APPROVED: "Đã duyệt", REJECTED: "Từ chối", ENROLLED: "Nhập học"
};
const STATUS_COUNTS = {
  "": 1248, SUBMITTED: 450, UNDER_REVIEW: 210, APPROVED: 320, REJECTED: 88, ENROLLED: 180
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

const MOCK_APPS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  applicationCode: `FPT2024-${String(i + 1).padStart(3, "0")}`,
  studentName: ["Nguyễn Văn Hiếu", "Trần Thị Thanh", "Lê Văn Minh", "Phạm Quang Huy", "Đinh Thị Lan", "Vũ Quốc Kiên", "Bùi Thị Nhi", "Dương Văn Anh", "Phan Thị Hùng", "Hoàng Minh Tuấn"][i % 10],
  email: `student${i + 1}@gmail.com`,
  majorName: ["Kỹ thuật phần mềm", "Trí tuệ nhân tạo", "Quản trị kinh doanh", "Thiết kế đồ họa"][i % 4],
  campusName: ["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ"][i % 4],
  methodName: ["THPT", "Học bạ", "ĐGNL"][i % 3],
  status: ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"][i % 4],
  totalScore: (20 + Math.random() * 10).toFixed(2),
  submittedAt: `${10 + (i % 20)}/05/2024`,
}));

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ApplicantList() {
  const navigate = useNavigate();
  const [apps, setApps] = useState(MOCK_APPS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/officer/applications?status=${statusFilter}&search=${search}`)
      .then(r => {
        const data = r.data?.content;
        setApps(Array.isArray(data) && data.length > 0 ? data : MOCK_APPS);
      })
      .catch(() => setApps(MOCK_APPS))
      .finally(() => setLoading(false));
  }, [statusFilter, search]);

  const filtered = apps.filter(a =>
    (statusFilter === "" || a.status === statusFilter) &&
    (search === "" || a.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      a.applicationCode?.includes(search))
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: "#0F172A" }}>Danh sách quản lý hồ sơ chi tiết</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>{filtered.length.toLocaleString()} hồ sơ tìm thấy</p>
        </div>
      </div>

      {/* Main Panel */}
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
              {STATUS_LABELS[s]} ({(STATUS_COUNTS[s] || 0).toLocaleString()})
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
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
              {filtered.map((app, idx) => {
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
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                      <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 13 }}>{app.majorName}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{app.campusName}</div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B", borderBottom: "1px solid #F8FAFC" }}>{app.methodName}</td>
                    <td style={{ padding: "14px 16px", fontWeight: 800, fontSize: 14, color: "#2563EB", borderBottom: "1px solid #F8FAFC" }}>{app.totalScore}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#94A3B8", borderBottom: "1px solid #F8FAFC" }}>{app.submittedAt}</td>
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
        </div>

        {/* Pagination */}
        <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F1F5F9" }}>
          <span style={{ fontSize: 13, color: "#64748B" }}>
            Hiển thị 10 trong tổng số {filtered.length.toLocaleString()} hồ sơ
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
    </div>
  );
}
