import { useState } from "react";
import { Search, Eye, Filter, ShieldAlert } from "lucide-react";

const INITIAL_LOGS = [
  { id: 1, user: "admin@fpt.edu.vn", action: "UPDATE_CONFIG", target: "allowRegistration", timestamp: "14/06/2026 14:35:12", ip: "192.168.1.100", details: "Changed from false to true" },
  { id: 2, user: "admin@fpt.edu.vn", action: "CREATE_USER", target: "officer.b@fpt.edu.vn", timestamp: "14/06/2026 14:30:45", ip: "192.168.1.100", details: "Created ADMISSION_OFFICER account" },
  { id: 3, user: "officer.b@fpt.edu.vn", action: "REVIEW_APPLICATION", target: "APP-2026-89412", timestamp: "14/06/2026 14:25:00", ip: "192.168.1.102", details: "Approved student transcript verification" },
  { id: 4, user: "student.a@fpt.edu.vn", action: "SUBMIT_APPLICATION", target: "APP-2026-12345", timestamp: "14/06/2026 14:15:30", ip: "10.0.12.44", details: "Submitted application for Software Engineering at HN Campus" },
  { id: 5, user: "admin@fpt.edu.vn", action: "SUSPEND_USER", target: "student.e@fpt.edu.vn", timestamp: "14/06/2026 11:10:15", ip: "192.168.1.100", details: "Suspended due to spam doc uploads" },
  { id: 6, user: "manager.c@fpt.edu.vn", action: "GENERATE_FORECAST", target: "ARIMA_Model_2026", timestamp: "14/06/2026 10:05:22", ip: "192.168.1.105", details: "Run enrollment prediction algorithm" },
];

export default function AuditLog() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [search, setSearch] = useState("");
  const [filterAction, setFilterAction] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase()) || 
                          log.target.toLowerCase().includes(search.toLowerCase()) ||
                          log.details.toLowerCase().includes(search.toLowerCase());
    const matchesAction = filterAction === "ALL" || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Lịch sử tác vụ (Audit Logs)</h1>
        <p className="text-slate-400 text-sm mt-1">Ghi nhận toàn bộ thao tác nhạy cảm, thay đổi dữ liệu của các tài khoản quản trị/cán bộ.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo user, đối tượng, chi tiết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-850 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="ALL">Tất cả hành động</option>
            <option value="UPDATE_CONFIG">UPDATE_CONFIG</option>
            <option value="CREATE_USER">CREATE_USER</option>
            <option value="REVIEW_APPLICATION">REVIEW_APPLICATION</option>
            <option value="SUBMIT_APPLICATION">SUBMIT_APPLICATION</option>
            <option value="SUSPEND_USER">SUSPEND_USER</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-850 bg-slate-900/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Thời gian</th>
                <th className="py-4 px-6">Tài khoản</th>
                <th className="py-4 px-6">Hành động</th>
                <th className="py-4 px-6">Đối tượng</th>
                <th className="py-4 px-6 font-mono text-xs">IP Address</th>
                <th className="py-4 px-6 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-sm text-slate-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs text-slate-450">{log.timestamp}</td>
                  <td className="py-4 px-6 font-semibold text-slate-200">{log.user}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-emerald-400">{log.target}</td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-500">{log.ip}</td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-350 hover:underline"
                    >
                      <Eye className="h-3 w-3" />
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="px-6 py-4 border-b border-slate-850 flex items-center justify-between bg-slate-900/50">
              <h3 className="font-semibold text-slate-100 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-emerald-400" />
                Chi tiết Audit Log
              </h3>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-xs">
                <span className="text-slate-500 font-semibold">Thời gian:</span>
                <span className="col-span-2 text-slate-300 font-mono">{selectedLog.timestamp}</span>
                
                <span className="text-slate-500 font-semibold">Tài khoản:</span>
                <span className="col-span-2 text-slate-300">{selectedLog.user}</span>
                
                <span className="text-slate-500 font-semibold">Hành động:</span>
                <span className="col-span-2 font-mono text-emerald-450">{selectedLog.action}</span>

                <span className="text-slate-500 font-semibold">Đối tượng:</span>
                <span className="col-span-2 font-mono text-blue-400">{selectedLog.target}</span>

                <span className="text-slate-500 font-semibold">Địa chỉ IP:</span>
                <span className="col-span-2 text-slate-300 font-mono">{selectedLog.ip}</span>
              </div>
              <div className="border-t border-slate-850 pt-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">Dữ liệu chi tiết thay đổi:</p>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-850 text-xs font-mono text-slate-300 break-all whitespace-pre-wrap">
                  {selectedLog.details}
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 rounded-lg text-xs font-semibold transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
