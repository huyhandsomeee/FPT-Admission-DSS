import { useState } from "react";
import { Save, Shield, Calendar, MapPin, BookOpen, AlertCircle } from "lucide-react";

export default function SystemConfig() {
  // Config state
  const [sysConfig, setSysConfig] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    allowApplicationSubmission: true,
    maxFileSizeMb: 10,
    allowedExtensions: ".pdf,.jpg,.jpeg,.png",
    jwtExpirationHours: 24,
  });

  const [campuses, setCampuses] = useState([
    { id: 1, code: "FU-HL", name: "FPT Hòa Lạc (Hà Nội)", active: true },
    { id: 2, code: "FU-HCM", name: "FPT TP. Hồ Chí Minh", active: true },
    { id: 3, code: "FU-DN", name: "FPT Đà Nẵng", active: true },
    { id: 4, code: "FU-QN", name: "FPT Quy Nhơn", active: true },
    { id: 5, code: "FU-CT", name: "FPT Cần Thơ", active: true },
  ]);

  const [methods, setMethods] = useState([
    { id: 1, code: "HOC_BA", name: "Xét học bạ THPT", active: true },
    { id: 2, code: "THPT", name: "Xét điểm thi THPT quốc gia", active: true },
    { id: 3, code: "DGNL", name: "Xét điểm thi Đánh giá năng lực", active: true },
    { id: 4, code: "SAT_IELTS", name: "Chứng chỉ quốc tế (IELTS/SAT)", active: true },
  ]);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    alert("Đã lưu các thiết lập hệ thống thành công!");
  };

  const toggleCampus = (id) => {
    setCampuses(campuses.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const toggleMethod = (id) => {
    setMethods(methods.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Cấu hình hệ thống</h1>
        <p className="text-slate-400 text-sm mt-1">Quản lý vòng đời tuyển sinh, tham số hệ thống và danh mục cơ sở, phương thức.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-850 pb-3">
              <Shield className="h-5 w-5 text-emerald-400" />
              <h3 className="font-semibold text-slate-100">Thiết lập chung & Bảo mật</h3>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Chế độ bảo trì</p>
                    <p className="text-[10px] text-slate-505">Khóa toàn bộ truy cập người dùng</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={sysConfig.maintenanceMode}
                    onChange={(e) => setSysConfig({...sysConfig, maintenanceMode: e.target.checked})}
                    className="h-4 w-4 accent-emerald-500 rounded bg-slate-800 border-slate-700 focus:ring-emerald-500" 
                  />
                </div>

                <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Cho phép đăng ký tài khoản</p>
                    <p className="text-[10px] text-slate-505">Mở/khóa đăng ký cho thí sinh mới</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={sysConfig.allowRegistration}
                    onChange={(e) => setSysConfig({...sysConfig, allowRegistration: e.target.checked})}
                    className="h-4 w-4 accent-emerald-500 rounded bg-slate-800 border-slate-700" 
                  />
                </div>

                <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">Mở cổng nộp hồ sơ</p>
                    <p className="text-[10px] text-slate-505">Cho phép thí sinh tạo & gửi hồ sơ mới</p>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={sysConfig.allowApplicationSubmission}
                    onChange={(e) => setSysConfig({...sysConfig, allowApplicationSubmission: e.target.checked})}
                    className="h-4 w-4 accent-emerald-500 rounded bg-slate-800 border-slate-700" 
                  />
                </div>

                <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg">
                  <label className="block text-xs font-semibold text-slate-205 mb-1">Dung lượng file tối đa (MB)</label>
                  <input 
                    type="number"
                    value={sysConfig.maxFileSizeMb}
                    onChange={(e) => setSysConfig({...sysConfig, maxFileSizeMb: parseInt(e.target.value)})}
                    className="w-full px-2.5 py-1 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100" 
                  />
                </div>

                <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-205 mb-1">Định dạng file tài liệu được phép</label>
                  <input 
                    type="text"
                    value={sysConfig.allowedExtensions}
                    onChange={(e) => setSysConfig({...sysConfig, allowedExtensions: e.target.value})}
                    className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 font-mono" 
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Lưu cấu hình
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Campuses & Methods Activation */}
        <div className="space-y-6">
          {/* Campuses */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-850 pb-3">
              <MapPin className="h-5 w-5 text-emerald-400" />
              <h3 className="font-semibold text-slate-100">Các cơ sở đào tạo</h3>
            </div>
            <div className="space-y-3">
              {campuses.map(c => (
                <div key={c.id} className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-850">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">{c.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{c.code}</p>
                  </div>
                  <button
                    onClick={() => toggleCampus(c.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors border ${
                      c.active 
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40' 
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {c.active ? "Đang mở" : "Đã đóng"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Methods */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-850 pb-3">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <h3 className="font-semibold text-slate-100">Phương thức xét tuyển</h3>
            </div>
            <div className="space-y-3">
              {methods.map(m => (
                <div key={m.id} className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-850">
                  <div>
                    <p className="text-xs font-semibold text-slate-205">{m.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{m.code}</p>
                  </div>
                  <button
                    onClick={() => toggleMethod(m.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors border ${
                      m.active 
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40' 
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {m.active ? "Đang mở" : "Đã đóng"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
