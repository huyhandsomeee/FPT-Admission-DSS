import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from "recharts";
import { Download } from "lucide-react";

const DATA = [
  { year: "2021", actual: 12000, predicted: 12000 },
  { year: "2022", actual: 14500, predicted: 13800 },
  { year: "2023", actual: 15000, predicted: 15100 },
  { year: "2024", actual: 17000, predicted: 16800 },
  { year: "2025", actual: 20000, predicted: 19500 },
  { year: "2026", actual: null, predicted: 22500 },
  { year: "2027", actual: null, predicted: 25200 },
];

export default function ForecastReport() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo dự báo tuyển sinh</h1>
          <p className="text-gray-500 text-sm mt-1">Dự báo đến năm 2027 • Mô hình hồi quy tuyến tính</p>
        </div>
        <button className="btn flex items-center gap-2" style={{ background: "#0F172A", color: "white" }}>
          <Download size={16} /> Xuất PDF
        </button>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="font-semibold text-gray-900">Dự báo số lượng tuyển sinh</h3></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip contentStyle={{ borderRadius: 12 }} formatter={(v) => v?.toLocaleString() ?? "N/A"} />
              <Legend />
              <ReferenceLine x="2025" stroke="#FF6B35" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="actual" stroke="#0F172A" strokeWidth={3} dot={{ r: 6 }} name="Thực tế" />
              <Line type="monotone" dataKey="predicted" stroke="#D97706" strokeWidth={2} strokeDasharray="8 4" dot={{ r: 4 }} name="Dự báo" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { year: 2026, value: "22,500", growth: "+12.5%" },
          { year: 2027, value: "25,200", growth: "+12%" },
          { year: 2028, value: "28,200", growth: "+11.9%" },
        ].map((f) => (
          <div key={f.year} className="card p-5 text-center">
            <div className="text-4xl font-black text-gray-900">{f.value}</div>
            <div className="text-gray-500 mt-1">Dự báo năm {f.year}</div>
            <div className="text-green-600 font-bold mt-1">{f.growth}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
