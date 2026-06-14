import { useState } from "react";
import { Search, Plus, Edit2, Shield, UserX, UserCheck, MoreVertical, Mail } from "lucide-react";

const INITIAL_USERS = [
  { id: 1, name: "Nguyễn Văn A", email: "student.a@fpt.edu.vn", role: "STUDENT", status: "ACTIVE", lastLogin: "14/06/2026 14:10" },
  { id: 2, name: "Trần Thị B", email: "officer.b@fpt.edu.vn", role: "ADMISSION_OFFICER", status: "ACTIVE", lastLogin: "14/06/2026 09:30" },
  { id: 3, name: "Lê Văn C", email: "manager.c@fpt.edu.vn", role: "ADMISSION_MANAGER", status: "ACTIVE", lastLogin: "14/06/2026 11:45" },
  { id: 4, name: "Hoàng Văn D", email: "bod.d@fpt.edu.vn", role: "BOD", status: "ACTIVE", lastLogin: "13/06/2026 16:20" },
  { id: 5, name: "Nguyễn Quản Trị", email: "admin@fpt.edu.vn", role: "ADMIN", status: "ACTIVE", lastLogin: "14/06/2026 14:35" },
  { id: 6, name: "Phạm Văn E", email: "student.e@fpt.edu.vn", role: "STUDENT", status: "SUSPENDED", lastLogin: "10/06/2026 08:12" },
];

export default function UserManagement() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "STUDENT" });

  const handleToggleStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" };
      }
      return u;
    }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) return;
    const added = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "ACTIVE",
      lastLogin: "Chưa đăng nhập"
    };
    setUsers([added, ...users]);
    setNewUser({ name: "", email: "", role: "STUDENT" });
    setShowAddModal(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Quản lý người dùng</h1>
          <p className="text-slate-400 text-sm mt-1">Cấp quyền, tạo tài khoản và vô hiệu hóa người dùng trong toàn hệ thống.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-all duration-200 shadow-md shadow-emerald-950/20"
        >
          <Plus className="h-4 w-4" />
          Tạo tài khoản mới
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm theo tên, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-850 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="STUDENT">Sinh viên (STUDENT)</option>
            <option value="ADMISSION_OFFICER">Cán bộ tuyển sinh</option>
            <option value="ADMISSION_MANAGER">Trưởng phòng tuyển sinh</option>
            <option value="BOD">Ban giám hiệu (BOD)</option>
            <option value="ADMIN">Quản trị viên (ADMIN)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-850 bg-slate-900/50 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-4 px-6">Họ và Tên</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Vai trò</th>
                <th className="py-4 px-6">Trạng thái</th>
                <th className="py-4 px-6">Lần đăng nhập cuối</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850 text-sm text-slate-200">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-100">{u.name}</td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-400">{u.email}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      u.role === 'ADMIN' ? 'bg-red-950/40 text-red-400 border border-red-900/30' :
                      u.role === 'BOD' ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-900/30' :
                      u.role === 'ADMISSION_MANAGER' ? 'bg-purple-950/40 text-purple-400 border border-purple-900/30' :
                      u.role === 'ADMISSION_OFFICER' ? 'bg-blue-950/40 text-blue-400 border border-blue-900/30' :
                      'bg-orange-950/40 text-orange-400 border border-orange-900/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${
                      u.status === 'ACTIVE' ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/35' : 
                      'bg-red-950/40 text-red-400 border border-red-900/35'
                    }`}>
                      {u.status === 'ACTIVE' ? "Đang hoạt động" : "Vô hiệu hóa"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-450 text-xs">{u.lastLogin}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggleStatus(u.id)}
                        className={`p-1.5 rounded-md border transition-colors ${
                          u.status === 'ACTIVE' 
                            ? 'bg-red-950/30 hover:bg-red-950/60 text-red-400 border-red-905/30' 
                            : 'bg-emerald-950/30 hover:bg-emerald-950/60 text-emerald-400 border-emerald-905/30'
                        }`}
                        title={u.status === 'ACTIVE' ? "Vô hiệu hóa" : "Kích hoạt"}
                      >
                        {u.status === 'ACTIVE' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </button>
                      <button className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200">
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="px-6 py-4 border-b border-slate-850 flex items-center justify-between">
              <h3 className="font-semibold text-slate-100">Cấp tài khoản mới</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Họ và Tên</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email FPT</label>
                <input
                  type="email"
                  required
                  placeholder="name@fpt.edu.vn"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Vai trò quyền hạn</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="STUDENT">Sinh viên (STUDENT)</option>
                  <option value="ADMISSION_OFFICER">Cán bộ tuyển sinh</option>
                  <option value="ADMISSION_MANAGER">Trưởng phòng tuyển sinh</option>
                  <option value="BOD">Ban giám hiệu (BOD)</option>
                  <option value="ADMIN">Quản trị viên (ADMIN)</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-350 rounded-lg text-sm font-semibold transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Cấp tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
