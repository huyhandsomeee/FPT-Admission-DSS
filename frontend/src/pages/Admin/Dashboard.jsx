import { 
  Database, Users, ShieldAlert, Cpu, CheckCircle, AlertTriangle, 
  Activity, Server, ArrowUpRight, ArrowDownRight, TrendingUp
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const SYSTEM_STATS = [
  { name: "CPU Usage", value: "24%", status: "Bình thường", icon: Cpu, color: "stat-card-blue", textColor: "#2563EB" },
  { name: "RAM System", value: "4.8 / 8 GB", status: "Ổn định", icon: Database, color: "stat-card-green", textColor: "#059669" },
  { name: "Truy cập (Live)", value: "184", status: "Đang tăng", icon: Users, color: "stat-card-purple", textColor: "#7C3AED" },
  { name: "Lỗi hệ thống", value: "0.02%", status: "Tuyệt vời", icon: ShieldAlert, color: "stat-card-orange", textColor: "#FF6B35" },
];

const HEALTH_SERVICES = [
  { name: "Gateway API", status: "Hoạt động", latency: "12ms", uptime: "99.98%" },
  { name: "Auth Service (JWT)", status: "Hoạt động", latency: "8ms", uptime: "100%" },
  { name: "Admission Service", status: "Hoạt động", latency: "45ms", uptime: "99.95%" },
  { name: "Notification Engine", status: "Hoạt động", latency: "110ms", uptime: "99.90%" },
  { name: "MySQL DB Pool", status: "Hoạt động", latency: "3ms", uptime: "100%" },
];

const PERFORMANCE_DATA = [
  { time: "10:00", cpu: 18, ram: 52, req: 120 },
  { time: "11:00", cpu: 25, ram: 54, req: 180 },
  { time: "12:00", cpu: 42, ram: 58, req: 310 },
  { time: "13:00", cpu: 30, ram: 57, req: 240 },
  { time: "14:00", cpu: 22, ram: 55, req: 190 },
  { time: "15:00", cpu: 28, ram: 56, req: 220 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Quản trị hệ thống</h1>
        <p className="text-gray-500 text-sm mt-1">Giám sát tài nguyên, dịch vụ và trạng thái hoạt động theo thời gian thực.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SYSTEM_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="card p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10"
                style={{ background: stat.textColor, transform: "translate(30%, -30%)" }}></div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${stat.textColor}15` }}>
                <Icon size={20} style={{ color: stat.textColor }} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.name}</div>
              <div className="text-xs font-medium mt-1" style={{ color: stat.textColor }}>{stat.status}</div>
            </div>
          );
        })}
      </div>

      {/* Charts & Uptime status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 card">
          <div className="card-header border-b pb-4 border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-900">Hiệu năng máy chủ</h3>
              <p className="text-xs text-gray-500 mt-0.5">CPU & RAM Usage (%) trong 6 giờ qua</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Feed
            </span>
          </div>
          <div className="card-body h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="time" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
                  itemStyle={{ fontSize: 13, fontWeight: 500 }}
                />
                <Area type="monotone" dataKey="cpu" name="CPU (%)" stroke="#2563EB" fillOpacity={1} fill="url(#colorCpu)" strokeWidth={3} />
                <Area type="monotone" dataKey="ram" name="RAM (%)" stroke="#059669" fillOpacity={1} fill="url(#colorRam)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Microservices Status */}
        <div className="card">
          <div className="card-header border-b pb-4 border-gray-100">
            <div>
              <h3 className="font-semibold text-gray-900">Trạng thái Microservices</h3>
              <p className="text-xs text-gray-500 mt-0.5">Gateway API & Core Services</p>
            </div>
          </div>
          <div className="card-body space-y-3">
            {HEALTH_SERVICES.map((srv) => (
              <div key={srv.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors border border-transparent hover:border-green-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{srv.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Uptime: {srv.uptime}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700">
                    {srv.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{srv.latency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
