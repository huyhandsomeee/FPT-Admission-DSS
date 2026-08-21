import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, UserPlus, Users, Clock, Plus, Edit, Trash2, Calendar, Download, CheckCircle, Settings, LogOut, Search, Filter, Briefcase, FileText
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from "recharts";
import * as XLSX from "xlsx";

export default function HROfficerPortal() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");

  const [toastMessage, setToastMessage] = useState(null);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [selectedCandidateCV, setSelectedCandidateCV] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const showToast = (msg, type = "success") => {
    setToastMessage({ text: msg, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [staffList, setStaffList] = useState([
    { id: "FPT-10024", name: "Nguyễn Văn A", dept: "Công nghệ thông tin", role: "Trưởng phòng IT", status: "Active", email: "anv@fpt.edu.vn", joinDate: "15/03/2020", phone: "0901234567" },
    { id: "FPT-10045", name: "Trần Thị B", dept: "Nhân sự", role: "Chuyên viên Tuyển dụng", status: "Active", email: "btt@fpt.edu.vn", joinDate: "10/06/2021", phone: "0912345678" },
    { id: "FPT-10088", name: "Lê Văn C", dept: "Đào tạo", role: "Giảng viên", status: "On Leave", email: "clv@fpt.edu.vn", joinDate: "01/09/2019", phone: "0923456789" },
    { id: "FPT-10112", name: "Phạm Thị D", dept: "Tài chính", role: "Kế toán trưởng", status: "Active", email: "dpt@fpt.edu.vn", joinDate: "20/11/2018", phone: "0934567890" },
    { id: "FPT-10156", name: "Hoàng Minh Đức", dept: "Tuyển sinh", role: "Trưởng nhóm Telesales", status: "Active", email: "duchm@fpt.edu.vn", joinDate: "05/01/2022", phone: "0945678901" },
    { id: "FPT-10190", name: "Vũ Thị Hương", dept: "CTSV", role: "Chuyên viên Hoạt động", status: "Active", email: "huongvt@fpt.edu.vn", joinDate: "12/04/2022", phone: "0956789012" },
  ]);

  const handleDeleteStaff = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân sự này?")) {
      setStaffList(staffList.filter(s => s.id !== id));
      showToast("Đã xóa nhân sự");
    }
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase()) || s.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = filterDepartment === "all" || s.dept.includes(filterDepartment);
      return matchSearch && matchDept;
    });
  }, [staffList, searchTerm, filterDepartment]);

  const [candidates] = useState({
    newApplied: [
      { id: "CAND-01", name: "Nguyễn Văn An", position: "Giảng Viên IT", time: "2h trước", exp: "5 years", edu: "Thạc sĩ KHTN", status: "Reviewing", testScore: 92 },
      { id: "CAND-02", name: "Trần Thị Bích", position: "Chuyên Viên ĐT", time: "5h trước", exp: "2 years", edu: "ĐH Ngoại Thương", status: "Reviewing", testScore: 85 },
      { id: "CAND-03", name: "Đặng Quang Huy", position: "Chuyên Viên MKT", time: "1 ngày trước", exp: "3 years", edu: "ĐH FPT", status: "Reviewing", testScore: 88 },
    ],
  });

  const deptHeadcountData = [
    { department: "Tuyển sinh", count: 320, fill: "#EA580C" }, // Orange-600
    { department: "Đào tạo", count: 540, fill: "#2563EB" },   // Blue-600
    { department: "Tài chính", count: 185, fill: "#EA580C" }, // Orange-600
    { department: "CTSV", count: 200, fill: "#2563EB" },      // Blue-600
  ];

  const handleExportHRExcel = () => {
    const wsData = [
      ["BÁO CÁO NHÂN SỰ & QUẢN LÝ ĐỊNH BIÊN - FPT UNIVERSITY"],
      ["Thời gian xuất:", new Date().toLocaleString("vi-VN")],
      ["Người thực hiện:", "Phòng Nhân Sự (HR Management Module)"],
      [],
      ["DANH SÁCH CÁN BỘ & GIẢNG VIÊN"],
      ["MÃ NV", "HỌ VÀ TÊN", "PHÒNG BAN", "CHỨC VỤ", "TRẠNG THÁI", "EMAIL", "SỐ ĐIỆN THOẠI"],
      ...staffList.map(s => [s.id, s.name, s.dept, s.role, s.status, s.email, s.phone])
    ];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FPT_HR_Staff_List");
    XLSX.writeFile(wb, `FPT_HR_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast("Đã xuất báo cáo nhân sự thành công (Excel)!");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-7 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg text-[13px] font-semibold text-white ${toastMessage.type === "success" ? "bg-slate-900" : "bg-red-700"}`}>
          <CheckCircle size={17} className={toastMessage.type === "success" ? "text-green-400" : "text-red-400"} />
          {toastMessage.text}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 z-30">
        <div>
          {/* Logo Section */}
          <div className="p-[20px_20px_16px] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-[15px] shadow-[0_2px_10px_rgba(234,88,12,0.3)]">
              FPT
            </div>
            <div>
              <div className="text-[16px] font-black text-slate-900 tracking-tight leading-tight">
                Cổng Nhân Sự FPT
              </div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                Quản trị Nguồn nhân lực
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 flex flex-col gap-1.5 mt-2">
            {[
              { id: "overview", icon: LayoutDashboard, label: "Tổng Quan & KPI" },
              { id: "personnel", icon: Users, label: "Hồ Sơ & Danh Bạ" },
              { id: "recruitment", icon: UserPlus, label: "Quản Lý Tuyển Dụng" },
              { id: "timekeeping", icon: Clock, label: "Chấm Công & Phúc Lợi" },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] text-left transition-all duration-200 ${
                    isActive
                      ? "font-bold text-orange-700 bg-orange-50 border-l-[3.5px] border-orange-600"
                      : "font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 border-l-[3.5px] border-transparent"
                  }`}
                >
                  <tab.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-orange-600" : "text-slate-500"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-[16px_20px_20px] border-t border-slate-200 flex flex-col gap-1.5">
          <button
            onClick={() => showToast("Cấu hình hệ thống")}
            className="flex items-center gap-3 w-full p-2 text-[13px] text-slate-600 font-semibold hover:bg-slate-100 hover:text-slate-900 rounded-lg transition-colors"
          >
            <Settings size={17} /> Cài Đặt Hệ Thống
          </button>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-3 w-full p-2 text-[13px] text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={17} /> Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto flex flex-col bg-[#F8FAFC]">
        {/* Top Header */}
        <header className="h-[64px] bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-sm">
          <div className="text-[18px] font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Briefcase size={22} className="text-orange-600" />
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">Phân Hệ Quản Trị Nhân Sự</span>
          </div>

          <div className="flex items-center gap-4">
             <button
                onClick={handleExportHRExcel}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[13px] font-bold hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Download size={15} /> Xuất Báo Cáo
              </button>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-[24px_32px_48px] max-w-[1440px] w-full mx-auto box-border">

          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mb-6 flex justify-between items-end">
                <div>
                   <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Tổng quan Nhân sự</h1>
                   <p className="text-slate-500 text-sm font-medium">Số liệu thống kê nhân sự toàn trường cập nhật mới nhất.</p>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-5 mb-6">
                {[
                  { label: "Tổng Nhân Sự", value: "1,245", trend: "+2.4%", trendUp: true, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Tuyển Mới (Tháng)", value: "32", trend: "Đạt mục tiêu", trendUp: true, color: "text-orange-600", bg: "bg-orange-50" },
                  { label: "Tỷ Lệ Nghỉ Việc", value: "1.2%", trend: "Mức an toàn", trendUp: true, color: "text-green-600", bg: "bg-green-50" },
                  { label: "Hoàn Thành Đào Tạo", value: "87%", trend: "+5% vs Tháng trước", trendUp: true, color: "text-purple-600", bg: "bg-purple-50" },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-[13px] font-bold text-slate-500 mb-2">{kpi.label}</div>
                    <div className="flex items-end justify-between">
                       <div className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</div>
                       <div className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{kpi.trend}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-[15px] font-black text-slate-800 mb-5 flex items-center gap-2">
                     <Users size={18} className="text-orange-500" />
                     Phân bổ Nhân sự theo Phòng ban
                  </h3>
                  <div className="w-full h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={deptHeadcountData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B', fontWeight: 600 }} />
                        <Tooltip cursor={{fill: '#F1F5F9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 600 }} />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={45}>
                          {deptHeadcountData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center h-full min-h-[350px]">
                   <div className="text-slate-400 text-sm font-semibold">Khu vực hiển thị biểu đồ phân tích bổ sung</div>
                   <div className="mt-2 text-xs text-slate-300">(Đang phát triển)</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PERSONNEL */}
          {activeTab === "personnel" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-end mb-6">
                <div>
                   <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Hồ Sơ & Danh Bạ</h1>
                   <p className="text-slate-500 text-sm font-medium">Quản lý danh sách, thông tin chi tiết của cán bộ nhân viên.</p>
                </div>
                <button onClick={() => setShowAddStaffModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-lg text-[13.5px] font-bold hover:bg-orange-700 transition-colors shadow-sm shadow-orange-200">
                  <Plus size={16} strokeWidth={3} /> Thêm Nhân Sự Mới
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 mb-5 flex gap-4 shadow-sm">
                <div className="flex-1 relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo Tên, Mã NV, Chức vụ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-medium"
                  />
                </div>
                <div className="relative">
                  <Filter size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="pl-10 pr-8 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-orange-500 appearance-none bg-white font-medium min-w-[200px]"
                  >
                    <option value="all">Tất cả Phòng ban</option>
                    <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                    <option value="Nhân sự">Nhân sự</option>
                    <option value="Đào tạo">Đào tạo</option>
                    <option value="Tài chính">Tài chính</option>
                    <option value="Tuyển sinh">Tuyển sinh</option>
                    <option value="CTSV">CTSV</option>
                  </select>
                </div>
              </div>

              {/* Staff Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200">
                        <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Nhân sự</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Mã NV</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Phòng ban</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Vai trò</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider">Trạng thái</th>
                        <th className="px-6 py-4 text-[11px] font-black text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStaff.map((staff) => (
                        <tr key={staff.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                   {staff.name.split(' ').pop().charAt(0)}
                                </div>
                                <div>
                                   <div className="text-[14px] font-bold text-slate-800">{staff.name}</div>
                                   <div className="text-[12px] text-slate-500 font-medium">{staff.email}</div>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4 text-[13px] font-bold text-slate-700">{staff.id}</td>
                          <td className="px-6 py-4">
                             <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-bold bg-slate-100 text-slate-700">
                                {staff.dept}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-[13px] font-semibold text-slate-600">{staff.role}</td>
                          <td className="px-6 py-4">
                             <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${staff.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                {staff.status}
                             </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setEditingStaff(staff)} className="p-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDeleteStaff(staff.id)} className="p-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredStaff.length === 0 && (
                        <tr>
                           <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">Không tìm thấy kết quả phù hợp.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: RECRUITMENT */}
          {activeTab === "recruitment" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="mb-6 flex justify-between items-end">
                <div>
                   <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Quản lý Tuyển dụng</h1>
                   <p className="text-slate-500 text-sm font-medium">Theo dõi hồ sơ ứng viên và quy trình tuyển dụng.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                       <FileText size={18} className="text-blue-500"/> Hồ sơ mới ứng tuyển
                    </h3>
                    <div className="space-y-3">
                      {candidates.newApplied.map((cand) => (
                      <div key={cand.id} className="bg-slate-50 rounded-lg p-4 border border-slate-100 hover:border-slate-300 transition-colors flex justify-between items-center group">
                          <div>
                             <div className="font-bold text-slate-800 text-[15px]">{cand.name}</div>
                             <div className="text-sm text-slate-500 font-medium mt-0.5">{cand.position} • {cand.edu}</div>
                             <div className="text-xs text-slate-400 font-medium mt-1">Kinh nghiệm: {cand.exp} • Nộp {cand.time}</div>
                          </div>
                          <button
                            onClick={() => setSelectedCandidateCV(cand)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-md text-[13px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                          >
                            Xem CV
                          </button>
                      </div>
                      ))}
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TIMEKEEPING */}
          {activeTab === "timekeeping" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="mb-6 flex justify-between items-end">
                <div>
                   <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Chấm công & Phúc lợi</h1>
                   <p className="text-slate-500 text-sm font-medium">Quản lý ngày phép, lịch làm việc và phúc lợi nhân viên.</p>
                </div>
                <button onClick={() => setShowLeaveModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-[13.5px] font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                  <Calendar size={16} strokeWidth={3} /> Tạo Đơn Xin Phép
                </button>
              </div>

               <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                 <Clock size={48} className="text-slate-200 mb-4" />
                 <h3 className="text-lg font-bold text-slate-700 mb-2">Chưa có dữ liệu chấm công</h3>
                 <p className="text-sm text-slate-500 font-medium">Lịch biểu và dữ liệu chấm công sẽ được đồng bộ tại đây.</p>
               </div>
            </div>
          )}

        </div>
      </main>

      {/* MODALS */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-black text-lg text-slate-800 m-0">Thêm Nhân Sự Mới</h3>
             </div>
             <div className="p-6 space-y-4">
                <p className="text-sm text-slate-500 font-medium">Tính năng đang được cập nhật...</p>
             </div>
             <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setShowAddStaffModal(false)} className="px-4 py-2 rounded-lg font-bold text-[13px] text-slate-600 hover:bg-slate-200 transition-colors">Đóng</button>
             </div>
          </div>
        </div>
      )}

      {selectedCandidateCV && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-black text-lg text-slate-800 m-0">Hồ Sơ Ứng Viên</h3>
             </div>
             <div className="p-6">
                 <div className="mb-6">
                    <div className="text-xl font-bold text-slate-900">{selectedCandidateCV.name}</div>
                    <div className="text-sm text-blue-600 font-bold mt-1">{selectedCandidateCV.position}</div>
                    <div className="text-sm text-slate-600 mt-2 font-medium">Học vấn: {selectedCandidateCV.edu}</div>
                    <div className="text-sm text-slate-600 mt-1 font-medium">Kinh nghiệm: {selectedCandidateCV.exp}</div>
                 </div>

                 <div className="flex gap-3">
                   <button onClick={() => { showToast("Đã loại ứng viên"); setSelectedCandidateCV(null); }} className="flex-1 py-2.5 bg-red-50 text-red-600 font-bold rounded-lg text-sm hover:bg-red-100 transition-colors">Từ chối</button>
                   <button onClick={() => { showToast("Đã chuyển sang vòng Phỏng vấn"); setSelectedCandidateCV(null); }} className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">Phỏng vấn</button>
                 </div>
             </div>
             <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setSelectedCandidateCV(null)} className="px-4 py-2 rounded-lg font-bold text-[13px] text-slate-600 hover:bg-slate-200 transition-colors">Đóng</button>
             </div>
          </div>
        </div>
      )}

      {editingStaff && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-black text-lg text-slate-800 m-0">Chỉnh sửa Thông tin</h3>
             </div>
             <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Họ và tên</label>
                  <input defaultValue={editingStaff.name} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Vai trò / Chức vụ</label>
                  <input defaultValue={editingStaff.role} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium" />
                </div>
             </div>
             <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setEditingStaff(null)} className="px-4 py-2 rounded-lg font-bold text-[13px] text-slate-600 hover:bg-slate-200 transition-colors">Hủy</button>
                <button onClick={() => { showToast("Cập nhật thông tin thành công"); setEditingStaff(null); }} className="px-5 py-2 rounded-lg font-bold text-[13px] text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">Lưu Thay Đổi</button>
             </div>
          </div>
        </div>
      )}

      {showLeaveModal && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
             <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-black text-lg text-slate-800 m-0">Tạo Đơn Xin Phép</h3>
             </div>
             <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Loại nghỉ phép</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium bg-white">
                      <option>Nghỉ phép năm</option>
                      <option>Nghỉ ốm</option>
                      <option>Nghỉ không lương</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Từ ngày</label>
                  <input type="date" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Lý do chi tiết</label>
                  <textarea rows={3} placeholder="Nhập lý do xin nghỉ..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium resize-none"></textarea>
                </div>
             </div>
             <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setShowLeaveModal(false)} className="px-4 py-2 rounded-lg font-bold text-[13px] text-slate-600 hover:bg-slate-200 transition-colors">Hủy</button>
                <button onClick={() => { showToast("Gửi đơn xin phép thành công"); setShowLeaveModal(false); }} className="px-5 py-2 rounded-lg font-bold text-[13px] text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">Gửi Đơn</button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}