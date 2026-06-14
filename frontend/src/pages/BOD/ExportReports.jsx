import { Download, FileText, BarChart3, Users } from "lucide-react";
import { useState } from "react";

const REPORTS = [
  { name: "Báo cáo tổng hợp tuyển sinh 2025", type: "Excel", icon: BarChart3, size: "2.4 MB" },
  { name: "Danh sách thí sinh nhập học", type: "Excel", icon: Users, size: "1.8 MB" },
  { name: "Báo cáo phân tích theo ngành", type: "PDF", icon: FileText, size: "3.2 MB" },
  { name: "Dự báo tuyển sinh 2026-2028", type: "PDF", icon: BarChart3, size: "1.5 MB" },
];

export default function ExportReports() {
  const [downloading, setDownloading] = useState(null);

  const handleDownload = (name) => {
    setDownloading(name);
    setTimeout(() => setDownloading(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Xuất báo cáo</h1>
        <p className="text-gray-500 text-sm mt-1">Tải xuống báo cáo tuyển sinh theo nhiều định dạng</p>
      </div>
      <div className="grid gap-4">
        {REPORTS.map((r) => (
          <div key={r.name} className="card p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                <r.icon size={22} className="text-slate-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{r.name}</div>
                <div className="text-sm text-gray-500">{r.type} • {r.size}</div>
              </div>
            </div>
            <button onClick={() => handleDownload(r.name)}
              className="btn flex items-center gap-2 btn-dark">
              {downloading === r.name ? (
                <div className="animate-spin w-4 h-4 border-b-2 border-white rounded-full"></div>
              ) : (
                <><Download size={16} /> Tải xuống</>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
