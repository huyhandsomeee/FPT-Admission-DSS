import { useState, useEffect } from "react";
import api from "../../../config/axiosConfig";
import {
  FileText, Users, Download, PlusCircle, TrendingUp,
  ChevronDown, Calendar, Filter, Eye, MoreVertical,
  ArrowUpRight, ArrowDownRight, Sparkles, ChevronLeft,
  ChevronRight, BarChart3, Target, Trash2
} from "lucide-react";
import PendingRequestAlert from "./components/PendingRequestAlert";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  { bg: "#FEE2E2", color: "#991B1B" },
];

function getInitials(name) {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function ApplicantList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [apps, setApps] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    "": 0, SUBMITTED: 0, UNDER_REVIEW: 0, APPROVED: 0, APPROVED_TODAY: 0, REJECTED: 0, ENROLLED: 0
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadRequests = () => {
    api.get("/api/officer/applications/new-requests")
      .then(r => setRequests(r.data || []))
      .catch(err => console.error("Error loading requests:", err));
  };

  const handleAllowRequest = async (userId, allow) => {
    try {
      await api.post(`/api/officer/students/${userId}/allow-new-application?allow=${allow}`);
      alert(allow ? "Đã phê duyệt yêu cầu tạo hồ sơ mới!" : "Đã từ chối yêu cầu!");
      loadRequests();
    } catch (err) {
      alert("Lỗi xử lý yêu cầu: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    loadRequests();
    api.get("/api/officer/dashboard").then(r => {
      if (r.data) {
        const d = r.data;
        setStatusCounts({
          "": d.totalApplications || 0,
          SUBMITTED: d.submitted || 0,
          UNDER_REVIEW: d.underReview || 0,
          APPROVED: d.approved || 0,
          APPROVED_TODAY: d.approvedToday || 0,
          REJECTED: d.rejected || 0,
          ENROLLED: d.enrolled || 0
        });
      }
    }).catch(err => console.error("Error fetching stats:", err));

    // Load available majors dynamically
    api.get("/api/student/config/majors")
      .then(res => {
        if (Array.isArray(res.data)) {
          const names = [...new Set(res.data.map(m => m.name))];
          setMajors(names);
        }
      })
      .catch(err => console.error("Error loading majors:", err));
  }, []);

  const searchVal = searchParams.get("search") || "";
  const statusVal = searchParams.get("status") || "";

  useEffect(() => {
    setLoading(true);
    let url = `/api/officer/applications?page=${currentPage}&size=10`;
    if (searchVal) url += `&search=${encodeURIComponent(searchVal)}`;
    if (statusVal) url += `&status=${statusVal}`;

    api.get(url)
      .then(r => {
        setApps(Array.isArray(r.data?.content) ? r.data.content : []);
        setTotalPages(r.data?.totalPages || 1);
        setTotalElements(r.data?.totalElements || 0);
      })
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, [searchVal, statusVal, currentPage]);

  const handleExportCSV = () => {
    if (apps.length === 0) { alert("Không có hồ sơ nào để xuất"); return; }
    const headers = ["Mã hồ sơ", "Họ tên", "Email", "Ngành học", "Điểm", "Ngày nộp", "Trạng thái"];
    const rows = apps.map(app => [
      app.applicationCode || "", app.studentName || "", app.studentEmail || "",
      app.majorName || "", app.totalScore || "",
      app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("vi-VN") : "Chưa nộp",
      STATUS_LABELS[app.status] || ""
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Danh_sach_ho_so_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const approvalRate = statusCounts[""] > 0
    ? ((statusCounts.APPROVED / statusCounts[""]) * 100).toFixed(1)
    : "0";

  const kpis = [
    { label: "Tổng số hồ sơ", value: statusCounts[""] || 0, badge: "+12%", badgePositive: true, borderColor: "#FF6B35" },
    { label: "Đang chờ duyệt", value: (statusCounts.UNDER_REVIEW || 0) + (statusCounts.SUBMITTED || 0), badge: "Quan trọng", badgeType: "warning", borderColor: "#F59E0B" },
    { label: "Đã duyệt hôm nay", value: statusCounts.APPROVED_TODAY || 0, badge: "Đạt mục tiêu", badgeType: "success", borderColor: "#10B981" },
    { label: "Hồ sơ bị từ chối", value: statusCounts.REJECTED || 0, badge: "-2%", badgePositive: false, borderColor: "#EF4444" },
  ];

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa hồ sơ này? Hành động không thể hoàn tác.")) return;
    setDeleting(true);
    try {
      await api.delete(`/api/officer/applications/${id}`);
      setApps(apps.filter(a => a.id !== id));
      setTotalElements(prev => prev - 1);
      alert("Đã xóa hồ sơ thành công!");
    } catch (err) {
      alert("Lỗi xóa hồ sơ: " + (err.response?.data?.message || err.message));
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  // Pagination logic
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisible = 3;
    for (let i = 0; i < Math.min(maxVisible, totalPages); i++) {
      buttons.push(i);
    }
    if (totalPages > maxVisible + 1) buttons.push(-1); // ellipsis
    if (totalPages > maxVisible) buttons.push(totalPages - 1);
    return buttons;
  };

  // Mock bar chart data for bottom section
  const weekDays = ["THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7", "CN"];
  const weekValues = [45, 52, 38, 85, 120, 65, 30];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: "#94A3B8" }}>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/officer/dashboard")}>Cổng Tuyển Sinh</span>
        <span style={{ margin: "0 6px" }}>›</span>
        <span style={{ color: "#FF6B35", fontWeight: 600 }}>Danh sách hồ sơ</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: "#0F172A" }}>Danh sách hồ sơ tổng hợp</h1>
          <p style={{ margin: "6px 0 0", fontSize: 14, color: "#64748B" }}>
            Quản lý và theo dõi tất cả hồ sơ nhập học của sinh viên theo thời gian thực.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleExportCSV} style={{
            padding: "10px 18px", background: "white", border: "1px solid #E2E8F0",
            borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#475569", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <Download size={15} /> Xuất CSV
          </button>
          <button style={{
            padding: "10px 18px", background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
            border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "white",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            boxShadow: "0 4px 12px rgba(255,107,53,0.3)"
          }}>
            <PlusCircle size={15} /> Hồ sơ mới
          </button>
        </div>
      </div>

      {/* Phân tích tổng quan banner */}
      <div style={{
        background: "linear-gradient(135deg, #2D3748 0%, #1A202C 100%)",
        borderRadius: 16, padding: "18px 24px", color: "white"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(255,107,53,0.2)", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <BarChart3 size={18} color="#FF6B35" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Phân tích Tổng quan</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
              Phân bố vùng miền: 65% Miền Bắc, 20% Miền Trung, 15% Miền Nam
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 12 }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 4, fontSize: 10, fontWeight: 600, letterSpacing: "0.5px" }}>CHẤT LƯỢNG HỒ SƠ</div>
            <span style={{
              background: "#16A34A", color: "white", padding: "3px 10px",
              borderRadius: 999, fontWeight: 700, fontSize: 12
            }}>Cao (+15%)</span>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 4, fontSize: 10, fontWeight: 600, letterSpacing: "0.5px" }}>NGÀNH HOT NHẤT</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Kỹ thuật phần mềm</div>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 4, fontSize: 10, fontWeight: 600, letterSpacing: "0.5px" }}>TỶ LỆ DUYỆT</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{approvalRate}%</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            background: "white", borderRadius: 14, padding: "18px 20px",
            border: "1px solid #F1F5F9", boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            borderLeft: `4px solid ${kpi.borderColor}`
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>{kpi.label}</div>
              {kpi.badgePositive === true && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#16A34A", background: "#DCFCE7", padding: "2px 7px", borderRadius: 99, display: "flex", alignItems: "center", gap: 2 }}>
                  <ArrowUpRight size={10} />{kpi.badge}
                </span>
              )}
              {kpi.badgePositive === false && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", background: "#FEE2E2", padding: "2px 7px", borderRadius: 99, display: "flex", alignItems: "center", gap: 2 }}>
                  <ArrowDownRight size={10} />{kpi.badge}
                </span>
              )}
              {kpi.badgeType === "warning" && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#92400E", background: "#FEF3C7", padding: "2px 7px", borderRadius: 99 }}>
                  {kpi.badge}
                </span>
              )}
              {kpi.badgeType === "success" && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#065F46", background: "#D1FAE5", padding: "2px 7px", borderRadius: 99 }}>
                  {kpi.badge}
                </span>
              )}
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A" }}>
              {(kpi.value || 0).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <PendingRequestAlert requests={requests} onAllowRequest={handleAllowRequest} />

      {/* Filters Row */}
      <div style={{
        background: "white", borderRadius: 14, padding: "14px 20px",
        border: "1px solid #F1F5F9", display: "flex", alignItems: "center",
        justifyContent: "space-between", boxShadow: "0 1px 4px rgba(0,0,0,0.03)"
      }}>
        <div style={{ display: "flex", gap: 10 }}>
          <select
            value={searchParams.get("search") || "all"}
            onChange={e => {
              const val = e.target.value;
              const params = new URLSearchParams(searchParams);
              if (val === "all") {
                params.delete("search");
              } else {
                params.set("search", val);
              }
              params.set("page", "0");
              setSearchParams(params);
              setCurrentPage(0);
            }}
            style={{
              padding: "8px 14px", border: "1px solid #E2E8F0", borderRadius: 8,
              fontSize: 13, color: "#475569", background: "white", cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            <option value="all">Tất cả chuyên ngành</option>
            {majors.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <select
            value={searchParams.get("status") || ""}
            onChange={e => {
              const val = e.target.value;
              const params = new URLSearchParams(searchParams);
              if (!val) {
                params.delete("status");
              } else {
                params.set("status", val);
              }
              params.set("page", "0");
              setSearchParams(params);
              setCurrentPage(0);
            }}
            style={{
              padding: "8px 14px", border: "1px solid #E2E8F0", borderRadius: 8,
              fontSize: 13, color: "#475569", background: "white", cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            <option value="">Trạng thái: Tất cả</option>
            <option value="SUBMITTED">Đã nộp</option>
            <option value="UNDER_REVIEW">Đang xét</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Từ chối</option>
            <option value="ENROLLED">Nhập học</option>
          </select>

          <button style={{
            padding: "8px 14px", border: "1px solid #E2E8F0", borderRadius: 8,
            fontSize: 13, color: "#475569", background: "white", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit"
          }}>
            <Calendar size={14} /> Khoảng thời gian
          </button>
        </div>

        <div style={{ fontSize: 12, color: "#94A3B8" }}>
          Hiển thị <strong style={{ color: "#1E293B" }}>1-{Math.min(10, totalElements)}</strong> trong tổng số{" "}
          <strong style={{ color: "#FF6B35" }}>{totalElements.toLocaleString()}</strong> hồ sơ
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: "white", borderRadius: 16, border: "1px solid #F1F5F9",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden"
      }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["MÃ HỒ SƠ", "HỌ VÀ TÊN", "NGÀNH HỌC", "ĐÁNH GIÁ TIỀM NĂNG", "TRẠNG THÁI", "NGÀY NỘP", "THAO TÁC"].map(h => (
                  <th key={h} style={{
                    textAlign: "left", padding: "12px 16px", fontSize: 10,
                    fontWeight: 700, letterSpacing: "0.06em", color: "#94A3B8",
                    background: "#FAFBFC", borderBottom: "1px solid #F1F5F9"
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Đang tải dữ liệu...</td></tr>
              ) : apps.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Không tìm thấy hồ sơ nào</td></tr>
              ) : (
                apps.map((app, idx) => {
                  const ac = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  const sc = STATUS_COLORS[app.status] || STATUS_COLORS.DRAFT;
                  return (
                    <tr key={app.id} style={{ cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#FAFBFC"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      onClick={() => navigate(`/officer/applicants/${app.id}`)}
                    >
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        <code style={{
                          fontSize: 11, fontWeight: 700, color: "#FF6B35",
                          background: "#FFF7ED", padding: "3px 8px", borderRadius: 6
                        }}>{app.applicationCode}</code>
                      </td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: "50%",
                            background: ac.bg, color: ac.color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: 12, flexShrink: 0
                          }}>{getInitials(app.studentName)}</div>
                          <div>
                            <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{app.studentName}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#475569", borderBottom: "1px solid #F8FAFC" }}>
                        {app.majorName || "—"}
                      </td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        {(() => {
                          const val = parseFloat(app.potentialScore) || 0;
                          const color = val >= 27 ? "#16A34A" : val >= 24 ? "#FF6B35" : "#DC2626";
                          return <span style={{ fontSize: 15, fontWeight: 800, color }}>{val.toFixed(2)}</span>;
                        })()}
                      </td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        <span style={{
                          display: "inline-block", padding: "4px 10px", borderRadius: 999,
                          fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color
                        }}>{STATUS_LABELS[app.status]}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "#94A3B8", borderBottom: "1px solid #F8FAFC" }}>
                        {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString("vi-VN") : "—"}
                      </td>
                      <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button onClick={e => { e.stopPropagation(); navigate(`/officer/applicants/${app.id}`); }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", padding: 4, borderRadius: 6 }}
                            title="Xem chi tiết"><Eye size={16} /></button>
                          <button onClick={e => { e.stopPropagation(); setDeleteConfirm(app.id); }}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", padding: 4, borderRadius: 6 }}
                            title="Xóa hồ sơ"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{
          padding: "14px 20px", display: "flex", alignItems: "center",
          justifyContent: "space-between", borderTop: "1px solid #F1F5F9"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: "1px solid #E2E8F0", background: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: currentPage === 0 ? "not-allowed" : "pointer",
                opacity: currentPage === 0 ? 0.5 : 1, color: "#475569"
              }}
            ><ChevronLeft size={14} /></button>

            {renderPaginationButtons().map((page, i) => (
              page === -1 ? (
                <span key={`ellipsis-${i}`} style={{ padding: "0 4px", color: "#94A3B8" }}>...</span>
              ) : (
                <button key={page} onClick={() => setCurrentPage(page)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    border: currentPage === page ? "none" : "1px solid #E2E8F0",
                    background: currentPage === page ? "#FF6B35" : "white",
                    color: currentPage === page ? "white" : "#475569",
                    fontWeight: currentPage === page ? 700 : 500,
                    fontSize: 13, cursor: "pointer"
                  }}
                >{page + 1}</button>
              )
            ))}

            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                width: 32, height: 32, borderRadius: 8,
                border: "1px solid #E2E8F0", background: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: currentPage >= totalPages - 1 ? "not-allowed" : "pointer",
                opacity: currentPage >= totalPages - 1 ? 0.5 : 1, color: "#475569"
              }}
            ><ChevronRight size={14} /></button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#94A3B8" }}>
            Đi tới trang:
            <input
              type="number" min={1} max={totalPages}
              value={currentPage + 1}
              onChange={e => {
                const val = parseInt(e.target.value) - 1;
                if (val >= 0 && val < totalPages) setCurrentPage(val);
              }}
              style={{
                width: 50, padding: "4px 8px", border: "1px solid #E2E8F0",
                borderRadius: 6, fontSize: 12, textAlign: "center"
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom section: Chart + AI Suggestion */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 16 }}>
        {/* Xu hướng nộp hồ sơ */}
        <div style={{
          background: "white", borderRadius: 16, padding: "20px 24px",
          border: "1px solid #F1F5F9", boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
            Xu hướng nộp hồ sơ
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, padding: "0 4px" }}>
            {weekDays.map((day, i) => {
              const maxVal = Math.max(...weekValues);
              const isHighlight = weekValues[i] === maxVal;
              return (
                <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 6 }}>
                  {isHighlight && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#DC2626" }}>{weekValues[i]}</span>
                  )}
                  <div style={{
                    width: "100%", maxWidth: 32,
                    height: `${(weekValues[i] / maxVal) * 90}px`,
                    background: isHighlight ? "#DC2626" : "#FFD4C0",
                    borderRadius: "4px 4px 0 0", transition: "height 0.5s ease"
                  }} />
                  <span style={{ fontSize: 9, color: "#94A3B8" }}>{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gợi ý thông minh */}
        <div style={{
          background: "linear-gradient(135deg, #2D3748 0%, #1A202C 100%)",
          borderRadius: 16, padding: "24px", color: "white",
          display: "flex", flexDirection: "column", justifyContent: "center"
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "rgba(255,107,53,0.2)", display: "flex",
            alignItems: "center", justifyContent: "center", marginBottom: 14
          }}>
            <Sparkles size={18} color="#FF6B35" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Gợi ý thông minh</div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, margin: "0 0 16px" }}>
            Số lượng hồ sơ ngành Kỹ thuật phần mềm đã tăng 24% so với tuần trước. Hãy ưu tiên phê duyệt các hồ sơ này để đạt chỉ tiêu sớm.
          </p>
          <button style={{
            padding: "10px 20px", background: "white", border: "none",
            borderRadius: 8, fontSize: 13, fontWeight: 600, color: "#1E293B",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-start"
          }}>
            Xem phân tích sâu →
          </button>
        </div>
      </div>
    </div>
  );
}
