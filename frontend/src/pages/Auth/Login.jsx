import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDefaultPath } from "../../utils/rolePermissions";
import { Eye, EyeOff, Mail, Lock, LogIn, ShieldCheck, Star, GraduationCap } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

export default function Login() {
  const [tab, setTab] = useState("thisinh");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user = await login(email, password);
      navigate(getDefaultPath(user.role), { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE}/api/auth/google`;
  };

  const features = [
    { icon: <GraduationCap size={18} />, title: "Môi trường học tập chuẩn quốc tế", desc: "Chương trình đào tạo hiện đại, cập nhật theo xu hướng toàn cầu." },
    { icon: <Star size={18} />, title: "Cơ hội việc làm toàn cầu", desc: "Kết nối doanh nghiệp rộng khắp, mở cửa sự nghiệp quốc tế." },
    { icon: <ShieldCheck size={18} />, title: "Cộng đồng sinh viên năng động", desc: "Hàng trăm câu lạc bộ và hoạt động ngoại khóa bùng nổ." },
  ];

  const stats = [
    { val: "100%", label: "Cơ hội việc làm" },
    { val: "QS 3★", label: "Chuẩn Quốc Tế" },
    { val: "25+", label: "Ngành đào tạo" },
  ];

  /* ─── Form (dùng chung mobile + desktop) ─── */
  const LoginForm = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-7">
        <h2 className="text-2xl md:text-3xl font-bold text-[#0b1c30]">Chào mừng trở lại 👋</h2>
        <p className="text-[#584237] mt-1.5 text-sm">Vui lòng đăng nhập để tiếp tục</p>
      </div>

      {/* Segmented Control */}
      <div className="p-1 bg-[#e5eeff] rounded-xl flex mb-5">
        {[{ key: "thisinh", label: "🎓 Thí sinh" }, { key: "canbo", label: "🏢 Cán bộ" }].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === key ? "bg-[#f37021] text-white shadow-sm" : "text-[#584237] hover:bg-[#dce9ff]"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#584237] mb-1.5" htmlFor="email">
            {tab === "thisinh" ? "Số CCCD / Email" : "Email cán bộ"}
          </label>
          <div className="relative">
            <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7166]" />
            <input id="email" type="email" value={email} required
              onChange={(e) => setEmail(e.target.value)}
              placeholder={tab === "thisinh" ? "example@gmail.com" : "example@fpt.edu.vn"}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#e0c0b2] bg-[#fafafa] focus:bg-white focus:ring-2 focus:ring-[#f37021]/30 focus:border-[#f37021] outline-none transition-all text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#584237] mb-1.5" htmlFor="password">Mật khẩu</label>
          <div className="relative">
            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7166]" />
            <input id="password" value={password} required
              type={showPwd ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-[#e0c0b2] bg-[#fafafa] focus:bg-white focus:ring-2 focus:ring-[#f37021]/30 focus:border-[#f37021] outline-none transition-all text-sm" />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8c7166] hover:text-[#a04100] transition-colors">
              {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-[#584237]">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-[#e0c0b2] accent-[#f37021]" />
            Ghi nhớ đăng nhập
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-[#a04100] hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        <button type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#f37021] hover:bg-[#a04100] text-white py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-60">
          {loading
            ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Đang đăng nhập...</>
            : <><LogIn size={15} /> Đăng nhập</>}
        </button>
      </form>

      <div className="relative flex items-center my-5">
        <div className="flex-grow border-t border-[#e0c0b2]" />
        <span className="flex-shrink mx-4 text-xs text-[#8c7166]">hoặc tiếp tục với</span>
        <div className="flex-grow border-t border-[#e0c0b2]" />
      </div>

      <button type="button" onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[#e0c0b2] bg-white hover:bg-[#fff7f4] hover:border-[#f37021] transition-all text-sm font-medium text-[#0b1c30] shadow-sm active:scale-[0.98]">
        <GoogleIcon /> Đăng nhập với Google
      </button>

      <div className="relative flex items-center my-4">
        <div className="flex-grow border-t border-[#e0c0b2]" />
        <span className="flex-shrink mx-3 text-xs font-bold text-[#f37021] uppercase tracking-wider">Demo Nhanh Từng Phân Hệ</span>
        <div className="flex-grow border-t border-[#e0c0b2]" />
      </div>

      {/* Demo Roles Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => navigate("/portal")}
          className="p-2.5 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 text-left text-xs transition-all"
        >
          <div className="font-bold text-orange-900">🌐 Thí sinh</div>
          <div className="text-[11px] text-orange-700">Nộp hồ sơ & tra cứu</div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/student/dashboard")}
          className="p-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-left text-xs transition-all"
        >
          <div className="font-bold text-blue-900">🎓 Sinh viên</div>
          <div className="text-[11px] text-blue-700">Học tập, học phí, LMS</div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/officer/finance")}
          className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-left text-xs transition-all"
        >
          <div className="font-bold text-emerald-900">💰 NV Tài chính</div>
          <div className="text-[11px] text-emerald-700">Công nợ, GD & học bổng</div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/officer/admission")}
          className="p-2.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-left text-xs transition-all"
        >
          <div className="font-bold text-amber-900">🏢 NV Tuyển sinh</div>
          <div className="text-[11px] text-amber-700">Thẩm định & giấy báo</div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/officer/academic")}
          className="p-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-left text-xs transition-all"
        >
          <div className="font-bold text-indigo-900">📚 NV Đào tạo</div>
          <div className="text-[11px] text-indigo-700">Sổ điểm & phúc khảo</div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/officer/student-affairs")}
          className="p-2.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-left text-xs transition-all"
        >
          <div className="font-bold text-teal-900">🎓 NV Dịch vụ SV</div>
          <div className="text-[11px] text-teal-700">KTX & giấy xác nhận</div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/officer/department")}
          className="p-2.5 rounded-xl border border-violet-200 bg-violet-50 hover:bg-violet-100 text-left text-xs transition-all"
        >
          <div className="font-bold text-violet-900">👔 Trưởng phòng ban</div>
          <div className="text-[11px] text-violet-700">Phê duyệt & KPI khoa</div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/bod/dashboard")}
          className="p-2.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-left text-xs transition-all"
        >
          <div className="font-bold text-slate-900">🏛️ Ban Giám Đốc</div>
          <div className="text-[11px] text-slate-700">Chỉ thị & điều hành</div>
        </button>
      </div>

      <p className="text-center text-sm text-[#584237] mt-3">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-[#a04100] font-bold hover:underline">Đăng ký ngay</Link>
      </p>
    </div>
  );

  return (
      <div className="flex flex-col" style={{ height: "100dvh" }}>
        {/* Header */}
        <header className="shrink-0 bg-white border-b border-[#e0c0b2] flex items-center justify-between px-8 h-16 z-50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#f37021] flex items-center justify-center text-white font-black shadow">F</div>
            <span className="text-lg font-bold text-[#a04100] tracking-tight">FPT University</span>
          </div>
          <button className="p-2 hover:bg-[#eff4ff] rounded-full transition-colors text-[#a04100]">
            <span className="material-symbols-outlined text-xl" style={{ fontFamily: "'Material Symbols Outlined'" }}>language</span>
          </button>
        </header>

        {/* Body: 2 cột */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT */}
          <div className="w-1/2 relative overflow-hidden bg-[#0b1c30]">
            <div className="absolute inset-0 bg-cover bg-center opacity-50"
              style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida/AP1WRLtOdvPy5OC1UHGT1a1oR8n07FdVKH0SnZTyaOWjD5eMxlcVmlOP1s59Qw4avzae0tMQyNJ-c50KyR4NWQ3UnGqfIn2vFSRIw32atSEXQE_vAgNGadKauQLaPTs0vTm8I5z4Gg9gaUeMbyeW-cM-1EwObYcLLr5AipqZajMlquLJCU_RzPKUmG4WaRtRCBIc9F3qQxUgHWTAxqLb5zdjG1c_dclB2C2FLkIGhi7VegPRaIEWn9bohnttol8")` }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0b1c30] via-[#0b1c30]/60 to-transparent" />
            <div className="relative z-10 h-full flex flex-col justify-center px-12 text-white">
              <div className="w-14 h-14 bg-[#f37021] rounded-2xl flex items-center justify-center mb-7 shadow-xl">
                <span className="text-white font-black text-2xl">F</span>
              </div>
              <h1 className="text-4xl font-bold mb-3 leading-tight">
                Khám phá tương lai tại <br />
                <span className="text-[#f37021]">FPT University</span>
              </h1>
              <p className="text-[#d3e4fe] text-sm mb-8 leading-relaxed max-w-xs opacity-90">
                Hệ thống quản lý tuyển sinh và hỗ trợ quyết định thông minh dành cho thí sinh và cán bộ.
              </p>
              <div className="space-y-4 mb-10">
                {features.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f37021]/20 flex items-center justify-center text-[#f37021] shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="text-xs text-[#d3e4fe] opacity-75 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-6">
                {stats.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-6">
                    <div>
                      <div className="text-2xl font-bold text-[#f37021]">{s.val}</div>
                      <div className="text-xs uppercase tracking-wider opacity-50 mt-0.5">{s.label}</div>
                    </div>
                    {i < stats.length - 1 && <div className="w-px h-8 bg-white/20" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-1/2 flex items-center justify-center overflow-y-auto bg-white px-12 py-8">
            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <footer className="shrink-0 bg-[#eff4ff] border-t border-[#e0c0b2]">
          <div className="flex items-center justify-center gap-8 py-4 px-8">
            <p className="text-xs text-[#584237]">© 2024 FPT University Admission Portal</p>
            <div className="flex gap-6">
              {["Chính sách bảo mật", "Điều khoản sử dụng", "Liên hệ"].map((item) => (
                <a key={item} href="#" className="text-xs text-[#584237] hover:text-[#a04100] transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
  );
}
