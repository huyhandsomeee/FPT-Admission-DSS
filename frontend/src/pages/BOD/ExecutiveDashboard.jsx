import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Users, Award, Target, ArrowUp, ArrowDown } from "lucide-react";

const TREND = [
  { year: "2021", applications: 12000, enrolled: 9800 },
  { year: "2022", applications: 14500, enrolled: 11200 },
  { year: "2023", applications: 15000, enrolled: 12500 },
  { year: "2024", applications: 17000, enrolled: 14200 },
  { year: "2025", applications: 20000, enrolled: 12000 },
];

const KPIS = [
  { label: "Tổng hồ sơ 2025", value: "20,000", change: "+18%", up: true, icon: Users, color: "#0F172A" },
  { label: "Tỷ lệ nhập học", value: "60%", change: "+3%", up: true, icon: Award, color: "#059669" },
  { label: "Chỉ tiêu đạt được", value: "12,000/20,000", change: "Đang tuyển", up: null, icon: Target, color: "#2563EB" },
  { label: "Dự báo 2026", value: "22,500", change: "+12.5%", up: true, icon: TrendingUp, color: "#7C3AED" },
];

export default function ExecutiveDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng quan chiến lược tuyển sinh 2025 • Cập nhật: hôm nay</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: "#ECFDF5", color: "#065F46" }}>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Dữ liệu thực tế
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map((kpi) => (
          <div key={kpi.label} className="card p-5 border-l-4" style={{ borderLeftColor: kpi.color }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}10` }}>
                <kpi.icon size={20} style={{ color: kpi.color }} />
              </div>
              {kpi.up !== null && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${kpi.up ? "text-green-600" : "text-red-600"}`}>
                  {kpi.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {kpi.change}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <div className="text-xs text-gray-500 mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-gray-900">Xu hướng tuyển sinh 5 năm</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={TREND}>
                <defs>
                  <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v) => v.toLocaleString()} />
                <Area type="monotone" dataKey="applications" stroke="#0F172A" strokeWidth={2.5} fill="url(#grad1)" name="Hồ sơ" />
                <Area type="monotone" dataKey="enrolled" stroke="#059669" strokeWidth={2} fill="none" strokeDasharray="4 2" name="Nhập học" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Objectives */}
        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-gray-900">Mục tiêu chiến lược 2025</h3></div>
          <div className="card-body space-y-4">
            {[
              { label: "Chỉ tiêu tổng", current: 12000, target: 20000, color: "#0F172A" },
              { label: "Tỷ lệ nhập học", current: 60, target: 75, color: "#059669", suffix: "%" },
              { label: "Hài lòng thí sinh", current: 88, target: 95, color: "#7C3AED", suffix: "%" },
              { label: "Thời gian xét duyệt (ngày)", current: 8, target: 5, color: "#2563EB", reverse: true },
            ].map((obj) => {
              const pct = obj.reverse ? Math.round(obj.target / obj.current * 100) : Math.round(obj.current / obj.target * 100);
              return (
                <div key={obj.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-700 font-medium">{obj.label}</span>
                    <span className="text-gray-500">
                      {obj.current}{obj.suffix || ""} / {obj.target}{obj.suffix || ""}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(pct, 100)}%`, background: obj.color }}></div>
                  </div>
                  <div className="text-xs text-right mt-0.5" style={{ color: obj.color }}>{pct}% mục tiêu</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { emoji: "📈", title: "Tăng trưởng", desc: "Hồ sơ tăng 18% so với 2024, vượt mục tiêu đề ra" },
          { emoji: "⚠️", title: "Điểm chú ý", desc: "Tỷ lệ nhập học 60% thấp hơn mục tiêu 75%. Cần can thiệp" },
          { emoji: "🎯", title: "Ưu tiên Q3", desc: "Tập trung tuyển sinh miền Trung và tăng chuyển đổi nhập học" },
        ].map((item) => (
          <div key={item.title} className="card p-5">
            <div className="text-2xl mb-2">{item.emoji}</div>
            <div className="font-bold text-gray-900 text-sm mb-1">{item.title}</div>
            <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
