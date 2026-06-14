import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { 
  LayoutDashboard, Users, Settings, FileSpreadsheet, LogOut, ChevronLeft 
} from "lucide-react";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: "/admin/dashboard", label: "Tổng quan hệ thống", icon: LayoutDashboard },
    { path: "/admin/users", label: "Quản lý người dùng", icon: Users },
    { path: "/admin/config", label: "Cấu hình hệ thống", icon: Settings },
    { path: "/admin/audit-logs", label: "Lịch sử tác vụ (Audit)", icon: FileSpreadsheet },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col justify-between ${collapsed ? 'w-20' : 'w-64'}`}>
        <div>
          {/* Brand/Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
            {!collapsed && (
              <span className="text-orange-600 font-bold tracking-wider text-xl">FPT ADMIN</span>
            )}
            {collapsed && (
              <span className="text-orange-600 font-bold mx-auto text-xl">ADM</span>
            )}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 hover:text-orange-600 transition-colors"
            >
              <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500 pl-2 shadow-sm"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          {!collapsed && (
            <div className="mb-4">
              <p className="text-sm font-semibold truncate text-gray-900">{user?.fullName || "Administrator"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "admin@fpt.edu.vn"}</p>
            </div>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-all duration-200 shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
              Quản trị viên cấp cao
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Trạng thái hệ thống</p>
              <p className="text-xs text-green-600 font-semibold flex items-center gap-1.5 justify-end mt-0.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                Đang hoạt động (Live)
              </p>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
