import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

const TREND = [
  { month: "T1", hồSơ: 1200 },{ month: "T2", hồSơ: 2100 },{ month: "T3", hồSơ: 4500 },
  { month: "T4", hồSơ: 3800 },{ month: "T5", hồSơ: 2900 },{ month: "T6", hồSơ: 1800 },
  { month: "T7", hồSơ: 1200 },{ month: "T8", hồSơ: 900 },
];

const YOY = [
  { year: "2021", applications: 12000 }, { year: "2022", applications: 14500 },
  { year: "2023", applications: 15000 }, { year: "2024", applications: 17000 },
  { year: "2025", applications: 20000 },
];

export default function OverviewChart() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Xu hướng tuyển sinh</h1>
        <p className="text-gray-500 text-sm mt-1">Phân tích xu hướng theo tháng và theo năm</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-gray-900">Hồ sơ theo tháng (2025)</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v) => v.toLocaleString()} />
                <Bar dataKey="hồSơ" fill="#7C3AED" radius={[6,6,0,0]} name="Số hồ sơ" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-gray-900">Tổng hồ sơ theo năm (YoY)</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={YOY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v) => v.toLocaleString()} />
                <Line type="monotone" dataKey="applications" stroke="#7C3AED" strokeWidth={3} dot={{ r: 6 }} name="Hồ sơ" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Tăng trưởng YoY", value: "+18%", color: "text-green-600" },
          { label: "Tháng cao điểm", value: "T3 - T4", color: "text-purple-600" },
          { label: "Dự báo 2026", value: "23,600", color: "text-blue-600" },
        ].map((stat) => (
          <div key={stat.label} className="card p-5 text-center">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
