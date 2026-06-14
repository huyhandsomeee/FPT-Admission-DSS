import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const REGIONAL = [
  { name: "Miền Nam", count: 9500, pct: "47.5%" },
  { name: "Miền Bắc", count: 7200, pct: "36%" },
  { name: "Miền Trung", count: 3300, pct: "16.5%" },
];

const PROVINCE_DATA = [
  { province: "Hà Nội", count: 4200 },
  { province: "TP.HCM", count: 5800 },
  { province: "Đà Nẵng", count: 1900 },
  { province: "Đồng Nai", count: 1200 },
  { province: "Bình Dương", count: 900 },
  { province: "Hải Phòng", count: 850 },
  { province: "Nghệ An", count: 750 },
  { province: "Thanh Hóa", count: 720 },
  { province: "Cần Thơ", count: 680 },
  { province: "Khánh Hòa", count: 500 },
];

const REGION_COLORS = ["#7C3AED", "#2563EB", "#D97706"];

export default function RegionalAnalysis() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Phân tích theo vùng địa lý</h1>
        <p className="text-gray-500 text-sm mt-1">Phân bố thí sinh theo vùng miền và tỉnh thành</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {REGIONAL.map((r, i) => (
          <div key={r.name} className="card p-5 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-3"
              style={{ background: REGION_COLORS[i] }}>
              {i === 0 ? "🏙️" : i === 1 ? "🏛️" : "⛰️"}
            </div>
            <div className="text-3xl font-bold text-gray-900">{r.pct}</div>
            <div className="font-semibold text-gray-700 mt-1">{r.name}</div>
            <div className="text-sm text-gray-500">{r.count.toLocaleString()} thí sinh</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h3 className="font-semibold text-gray-900">Top 10 tỉnh thành có nhiều thí sinh nhất</h3></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={PROVINCE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="province" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v) => v.toLocaleString()} />
              <Bar dataKey="count" fill="#7C3AED" radius={[6,6,0,0]} name="Số thí sinh" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
