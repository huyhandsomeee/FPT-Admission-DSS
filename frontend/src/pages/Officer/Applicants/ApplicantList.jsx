import { useState, useEffect } from "react";
import api from "../../../config/axiosConfig";
import { FileText, Users } from "lucide-react";
import PendingRequestAlert from "./components/PendingRequestAlert";
import ApplicationFilters from "./components/ApplicationFilters";
import ApplicationTable from "./components/ApplicationTable";
import StudentTable from "./components/StudentTable";

const STATUSES = ["", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "ENROLLED"];
const STATUS_LABELS = {
  "": "Tất cả", SUBMITTED: "Đã nộp", UNDER_REVIEW: "Đang xét",
  APPROVED: "Đã duyệt", REJECTED: "Từ chối", ENROLLED: "Nhập học"
};

const VIEW_MODES = [
  { key: "applications", label: "Hồ sơ xét tuyển", icon: FileText },
  { key: "students", label: "Danh sách thí sinh", icon: Users },
];

export default function ApplicantList() {
  const [viewMode, setViewMode] = useState("applications");

  // Requests
  const [requests, setRequests] = useState([]);

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
          REJECTED: d.rejected || 0,
          ENROLLED: d.enrolled || 0
        });
      }
    }).catch(err => console.error("Error fetching stats:", err));
  }, [apps]);

  useEffect(() => {
    if (viewMode !== "applications") return;
    setLoading(true);
    api.get(`/api/officer/applications?status=${statusFilter}&search=${search}&size=100`)
      .then(r => setApps(Array.isArray(r.data?.content) ? r.data.content : []))
      .catch(() => setApps([]))
      .finally(() => setLoading(false));
  }, [statusFilter, search, viewMode]);

  useEffect(() => {
    if (viewMode !== "students") return;
    setStudentLoading(true);
    api.get(`/api/officer/students?search=${studentSearch}&size=100`)
      .then(r => {
        setStudents(Array.isArray(r.data?.content) ? r.data.content : []);
        setStudentTotal(r.data?.totalElements || 0);
      })
      .catch(() => setStudents([]))
      .finally(() => setStudentLoading(false));
  }, [studentSearch, viewMode]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: "#0F172A" }}>Quản lý thí sinh & hồ sơ</h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
            Tuyển sinh năm 2026 • Cơ sở dữ liệu thí sinh toàn hệ thống
          </p>
        </div>
        <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 12, padding: 4, gap: 2 }}>
          {VIEW_MODES.map(m => (
            <button key={m.key} onClick={() => setViewMode(m.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, border: "none",
                background: viewMode === m.key ? "white" : "transparent",
                color: viewMode === m.key ? "#FF6B35" : "#64748B",
                fontWeight: viewMode === m.key ? 700 : 500, fontSize: 13, cursor: "pointer",
                boxShadow: viewMode === m.key ? "0 1px 4px rgba(0,0,0,0.1)" : "none"
              }}>
              <m.icon size={14} /> {m.label}
            </button>
          ))}
        </div>
      </div>

      <PendingRequestAlert requests={requests} onAllowRequest={handleAllowRequest} />

      {viewMode === "applications" && (
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <ApplicationFilters
            search={search} onSearchChange={setSearch}
            statusFilter={statusFilter} onStatusChange={setStatusFilter}
            statuses={STATUSES} statusLabels={STATUS_LABELS} statusCounts={statusCounts}
          />
          <ApplicationTable apps={apps} loading={loading} />
          <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 13, color: "#64748B" }}>
              Hiển thị {apps.length} trong tổng số {(statusCounts[statusFilter] || apps.length).toLocaleString()} hồ sơ
            </span>
          </div>
        </div>
      )}

      {viewMode === "students" && (
        <StudentTable
          students={students} loading={studentLoading} total={studentTotal}
          search={studentSearch} onSearchChange={setStudentSearch}
        />
      )}
    </div>
  );
}
