import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const MAJOR_DATA = [
  { name: "Kỹ thuật phần mềm", count: 7200, rate: "76%" },
  { name: "Trí tuệ nhân tạo", count: 4500, rate: "82%" },
  { name: "Quản trị kinh doanh", count: 3800, rate: "71%" },
  { name: "Thiết kế đồ họa", count: 1900, rate: "68%" },
  { name: "Tài chính ngân hàng", count: 1500, rate: "65%" },
  { name: "Marketing", count: 1100, rate: "70%" },
];

const COLORS = ["#7C3AED","#6D28D9","#5B21B6","#4C1D95","#3B1590","#2D1480"];

export default function MajorAnalysis() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Phân tích theo ngành</h1>
        <p className="text-gray-500 text-sm mt-1">Số lượng hồ sơ và tỷ lệ duyệt theo từng ngành</p>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="font-semibold text-gray-900">Số hồ sơ theo ngành học</h3></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MAJOR_DATA} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v) => v.toLocaleString()} />
              <Bar dataKey="count" radius={[0,6,6,0]} name="Hồ sơ">
                {MAJOR_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-3">
        {MAJOR_DATA.map((major, i) => (
          <div key={major.name} className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ background: COLORS[i % COLORS.length] }}>{i + 1}</div>
              <div>
                <div className="font-semibold text-gray-900">{major.name}</div>
                <div className="text-sm text-gray-500">{major.count.toLocaleString()} hồ sơ đăng ký</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-purple-600">{major.rate}</div>
              <div className="text-xs text-gray-400">Tỷ lệ duyệt</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
