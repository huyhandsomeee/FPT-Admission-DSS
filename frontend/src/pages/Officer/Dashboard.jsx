import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import { Users, Clock, CheckCircle, XCircle, FileText, TrendingUp } from "lucide-react";

const MOCK_STATS = {
  totalApplications: 1250,
  submitted: 180,
  underReview: 340,
  approved: 620,
  rejected: 85,
  enrolled: 25,
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

export default function OfficerDashboard() {
  const [stats, setStats] = useState(MOCK_STATS);

  useEffect(() => {
    api.get("/api/officer/dashboard").then(r => setStats(r.data)).catch(() => {});
  }, []);

  const kpis = [
    { label: "Tổng hồ sơ", value: stats.totalApplications, icon: FileText, color: "stat-card-blue", textColor: "#1D4ED8" },
    { label: "Chờ xét duyệt", value: stats.underReview, icon: Clock, color: "stat-card-orange", textColor: "#D97706" },
    { label: "Đã chấp thuận", value: stats.approved, icon: CheckCircle, color: "stat-card-green", textColor: "#059669" },
    { label: "Bị từ chối", value: stats.rejected, icon: XCircle, color: "stat-card-red", textColor: "#DC2626" },
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
          <div key={kpi.label} className={`stat-card ${kpi.color}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${kpi.textColor}15` }}>
                <kpi.icon size={22} style={{ color: kpi.textColor }} />
              </div>
              <TrendingUp size={14} className="text-gray-400" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{kpi.value?.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-gray-900">Phân bổ trạng thái hồ sơ</h3></div>
          <div className="card-body space-y-4">
            {[
              { label: "Đã nộp", count: stats.submitted, color: "#2563EB", pct: Math.round(stats.submitted / stats.totalApplications * 100) },
              { label: "Đang xét", count: stats.underReview, color: "#D97706", pct: Math.round(stats.underReview / stats.totalApplications * 100) },
              { label: "Đã duyệt", count: stats.approved, color: "#059669", pct: Math.round(stats.approved / stats.totalApplications * 100) },
              { label: "Từ chối", count: stats.rejected, color: "#DC2626", pct: Math.round(stats.rejected / stats.totalApplications * 100) },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600 font-medium">{item.label}</span>
                  <span className="text-gray-500">{item.count} ({item.pct}%)</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${item.pct}%`, background: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-gray-900">Thống kê nhanh</h3></div>
          <div className="card-body space-y-4">
            {[
              { label: "Tỷ lệ duyệt", value: `${Math.round(stats.approved / stats.totalApplications * 100)}%`, color: "text-green-600" },
              { label: "Chờ xử lý (Submitted)", value: stats.submitted, color: "text-blue-600" },
              { label: "Đã nhập học", value: stats.enrolled, color: "text-purple-600" },
              { label: "KPI hôm nay", value: "12 hồ sơ", color: "text-orange-600" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">{stat.label}</span>
                <span className={`text-lg font-bold ${stat.color}`}>{stat.value?.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-gray-900">Hồ sơ gần đây</h3>
          <a href="/officer/applicants" className="text-sm text-blue-500 font-medium">Xem tất cả →</a>
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
              {MOCK_RECENT.map((app) => (
                <tr key={app.id}>
                  <td><div className="font-medium text-gray-900">{app.studentName}</div></td>
                  <td><code className="text-xs text-gray-500">{app.applicationCode}</code></td>
                  <td className="text-gray-700">{app.majorName}</td>
                  <td className="text-gray-700">{app.campusName}</td>
                  <td className="text-gray-500 text-xs">{app.submittedAt}</td>
                  <td><span className={`badge ${STATUS_BADGES[app.status]}`}>{STATUS_LABELS[app.status]}</span></td>
                  <td>
                    <a href={`/officer/applicants/${app.id}`} className="text-blue-500 text-sm font-medium hover:underline">Xét duyệt</a>
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
