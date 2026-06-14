import { useState, useEffect } from "react";
import api from "../../../config/axiosConfig";
import { Search, Filter, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STATUSES = ["", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "ENROLLED"];
const STATUS_LABELS = { "": "Tất cả", SUBMITTED: "Đã nộp", UNDER_REVIEW: "Đang xét", APPROVED: "Đã duyệt", REJECTED: "Từ chối", ENROLLED: "Nhập học" };
const STATUS_BADGES = { SUBMITTED: "badge-submitted", UNDER_REVIEW: "badge-review", APPROVED: "badge-approved", REJECTED: "badge-rejected", ENROLLED: "badge-enrolled", DRAFT: "badge-draft" };

const MOCK_APPS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  applicationCode: `APP2025${String(i + 1).padStart(6, "0")}`,
  studentName: ["Phạm Hữu Hân", "Lê Thị Mai", "Hoàng Nam", "Nguyễn Hoa", "Trần Tùng", "Đinh Lan", "Vũ Kiên", "Bùi Nhi", "Dương Anh", "Phan Hùng"][i % 10],
  studentEmail: `student${i + 1}@gmail.com`,
  majorName: ["Kỹ thuật phần mềm", "Trí tuệ nhân tạo", "Quản trị kinh doanh", "Thiết kế đồ họa"][i % 4],
  campusName: ["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ"][i % 4],
  methodName: ["THPT", "Học bạ", "DGNL"][i % 3],
  status: ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"][i % 4],
  totalScore: (20 + Math.random() * 10).toFixed(2),
  submittedAt: "2025-03-" + String(10 + (i % 20)),
}));

export default function ApplicantList() {
  const navigate = useNavigate();
  const [apps, setApps] = useState(MOCK_APPS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/officer/applications?status=${statusFilter}&search=${search}`)
      .then(r => setApps(r.data.content || MOCK_APPS))
      .catch(() => setApps(MOCK_APPS))
      .finally(() => setLoading(false));
  }, [statusFilter, search]);

  const filtered = apps.filter(a =>
    (statusFilter === "" || a.status === statusFilter) &&
    (search === "" || a.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      a.applicationCode?.includes(search))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Danh sách hồ sơ</h1>
        <p className="text-gray-500 text-sm mt-1">{filtered.length} hồ sơ tìm thấy</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tên, mã hồ sơ..."
            className="form-input pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border
                ${statusFilter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Thí sinh</th>
                <th>Mã hồ sơ</th>
                <th>Ngành - Cơ sở</th>
                <th>Phương thức</th>
                <th>Điểm</th>
                <th>Ngày nộp</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-blue-50/30 cursor-pointer" onClick={() => navigate(`/officer/applicants/${app.id}`)}>
                  <td>
                    <div className="font-semibold text-gray-900 text-sm">{app.studentName}</div>
                    <div className="text-xs text-gray-400">{app.studentEmail}</div>
                  </td>
                  <td><code className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{app.applicationCode}</code></td>
                  <td>
                    <div className="text-sm font-medium text-gray-800">{app.majorName}</div>
                    <div className="text-xs text-gray-500">{app.campusName}</div>
                  </td>
                  <td className="text-sm text-gray-600">{app.methodName}</td>
                  <td className="font-bold text-blue-700">{app.totalScore}</td>
                  <td className="text-xs text-gray-500">{app.submittedAt}</td>
                  <td><span className={`badge ${STATUS_BADGES[app.status] || "badge-draft"}`}>{STATUS_LABELS[app.status]}</span></td>
                  <td>
                    <button
                      className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline"
                      onClick={(e) => { e.stopPropagation(); navigate(`/officer/applicants/${app.id}`); }}>
                      <Eye size={14} /> Xét duyệt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
