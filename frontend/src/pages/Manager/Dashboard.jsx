import { useEffect, useState } from "react";
import api from "../../config/axiosConfig";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { TrendingUp, Users, CheckCircle, Target, Award } from "lucide-react";

const MOCK_STATS = {
  totalApplications: 20000, approved: 14500, enrolled: 12000, underReview: 2800,
  activeYear: 2025, quota: 20000, enrollmentRate: 60
};

const TREND_DATA = [
  { year: "2021", hồSơ: 12000, nhậpHọc: 9800 },
  { year: "2022", hồSơ: 14500, nhậpHọc: 11200 },
  { year: "2023", hồSơ: 15000, nhậpHọc: 12500 },
  { year: "2024", hồSơ: 17000, nhậpHọc: 14200 },
  { year: "2025", hồSơ: 20000, nhậpHọc: 12000 },
];

const STATUS_DATA = [
  { name: "Đã duyệt", value: 14500, color: "#059669" },
  { name: "Đang xét", value: 2800, color: "#D97706" },
  { name: "Từ chối", value: 1200, color: "#DC2626" },
  { name: "Nhập học", value: 12000, color: "#7C3AED" },
];

const CAMPUS_DATA = [
  { name: "Hà Nội", value: 7500 },
  { name: "TP.HCM", value: 8000 },
  { name: "Đà Nẵng", value: 2500 },
  { name: "Cần Thơ", value: 1200 },
  { name: "Quy Nhơn", value: 800 },
];

export default function ManagerDashboard() {
  const [stats, setStats] = useState(MOCK_STATS);

  useEffect(() => {
    api.get("/api/manager/dashboard").then(r => setStats(r.data)).catch(() => {});
  }, []);

  const kpis = [
    { label: "Tổng hồ sơ 2025", value: "20,000", sub: "+18% vs 2024", icon: Users, color: "#7C3AED" },
    { label: "Đã chấp thuận", value: "14,500", sub: "72.5%", icon: CheckCircle, color: "#059669" },
    { label: "Đã nhập học", value: "12,000", sub: "60% chỉ tiêu", icon: Award, color: "#2563EB" },
    { label: "Chỉ tiêu 2025", value: "20,000", sub: "Đạt 60%", icon: Target, color: "#D97706" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Trưởng phòng</h1>
        <p className="text-gray-500 text-sm mt-1">Tổng quan tuyển sinh năm 2025 - Cập nhật thời gian thực</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="card p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10"
              style={{ background: kpi.color, transform: "translate(30%, -30%)" }}></div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: `${kpi.color}15` }}>
              <kpi.icon size={20} style={{ color: kpi.color }} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <div className="text-sm text-gray-500 mt-0.5">{kpi.label}</div>
            <div className="text-xs font-medium mt-1" style={{ color: kpi.color }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h3 className="font-semibold text-gray-900">Xu hướng tuyển sinh 5 năm</h3>
            <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-lg">Dữ liệu thực</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={TREND_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="year" tick={{ fontSize: 12, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
                  formatter={(v) => v.toLocaleString()}
                />
                <Legend />
                <Line type="monotone" dataKey="hồSơ" stroke="#7C3AED" strokeWidth={3} dot={{ r: 5 }} name="Hồ sơ" />
                <Line type="monotone" dataKey="nhậpHọc" stroke="#059669" strokeWidth={3} dot={{ r: 5 }} name="Nhập học" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie */}
        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-gray-900">Trạng thái hồ sơ 2025</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={STATUS_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  paddingAngle={4} dataKey="value">
                  {STATUS_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => v.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {STATUS_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }}></div>
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campus Bar Chart */}
      <div className="card">
        <div className="card-header"><h3 className="font-semibold text-gray-900">Hồ sơ theo cơ sở</h3></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CAMPUS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }} formatter={(v) => v.toLocaleString()} />
              <Bar dataKey="value" fill="#7C3AED" radius={[6, 6, 0, 0]} name="Hồ sơ" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
