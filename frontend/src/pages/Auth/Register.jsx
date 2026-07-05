import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus, GraduationCap, Star, ShieldCheck } from "lucide-react";

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

export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError("Mật khẩu xác nhận không khớp");
    if (form.password.length < 6) return setError("Mật khẩu phải có ít nhất 6 ký tự");
    setLoading(true);
    setError("");
    try {
      await register(form.email, form.password, form.fullName, form.phone);
      navigate("/student/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
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

  const inputCls = "w-full py-2.5 rounded-xl border border-[#e0c0b2] bg-[#fafafa] focus:bg-white focus:ring-2 focus:ring-[#f37021]/30 focus:border-[#f37021] outline-none transition-all text-sm";

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

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">

        {/* Register form – full width */}
        <div className="w-full flex items-center justify-center overflow-y-auto bg-white px-12 py-8">
          <div className="w-full max-w-md">

            <div className="mb-7">
              <h2 className="text-3xl font-bold text-[#0b1c30]">Tạo tài khoản 🎓</h2>
              <p className="text-[#584237] mt-1.5 text-sm">Điền thông tin để bắt đầu hành trình của bạn</p>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Họ tên */}
              <div>
                <label className="block text-xs font-semibold text-[#584237] mb-1.5">Họ và tên *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7166]" />
                  <input type="text" value={form.fullName} onChange={set("fullName")}
                    placeholder="Nguyễn Văn A" required
                    className={`${inputCls} pl-10 pr-4`} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-[#584237] mb-1.5">Email *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7166]" />
                  <input type="email" value={form.email} onChange={set("email")}
                    placeholder="example@gmail.com" required
                    className={`${inputCls} pl-10 pr-4`} />
                </div>
              </div>

              {/* SĐT */}
              <div>
                <label className="block text-xs font-semibold text-[#584237] mb-1.5">Số điện thoại</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7166]" />
                  <input type="tel" value={form.phone} onChange={set("phone")}
                    placeholder="0901234567"
                    className={`${inputCls} pl-10 pr-4`} />
                </div>
              </div>

              {/* Mật khẩu + Xác nhận — 2 cột */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#584237] mb-1.5">Mật khẩu *</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7166]" />
                    <input value={form.password} onChange={set("password")}
                      type={showPwd ? "text" : "password"}
                      placeholder="Tối thiểu 6 ký tự" required
                      className={`${inputCls} pl-10 pr-9`} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7166] hover:text-[#a04100] transition-colors">
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#584237] mb-1.5">Xác nhận *</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c7166]" />
                    <input value={form.confirm} onChange={set("confirm")}
                      type={showConfirm ? "text" : "password"}
                      placeholder="Nhập lại" required
                      className={`${inputCls} pl-10 pr-9`} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8c7166] hover:text-[#a04100] transition-colors">
                      {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Điều khoản */}
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded accent-[#f37021] shrink-0" />
                <span className="text-xs text-[#584237]">
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-[#a04100] font-semibold hover:underline">Điều khoản sử dụng</a>
                  {" "}và{" "}
                  <a href="#" className="text-[#a04100] font-semibold hover:underline">Chính sách bảo mật</a>
                </span>
              </label>

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#f37021] hover:bg-[#a04100] text-white py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-60">
                {loading
                  ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> Đang tạo tài khoản...</>
                  : <><UserPlus size={15} /> Tạo tài khoản</>}
              </button>
            </form>

            <div className="relative flex items-center my-5">
              <div className="flex-grow border-t border-[#e0c0b2]" />
              <span className="flex-shrink mx-4 text-xs text-[#8c7166]">hoặc tiếp tục với</span>
              <div className="flex-grow border-t border-[#e0c0b2]" />
            </div>

            <button type="button" onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[#e0c0b2] bg-white hover:bg-[#fff7f4] hover:border-[#f37021] transition-all text-sm font-medium text-[#0b1c30] shadow-sm active:scale-[0.98]">
              <GoogleIcon /> Đăng ký với Google
            </button>

            <p className="text-center text-sm text-[#584237] mt-5">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-[#a04100] font-bold hover:underline">Đăng nhập</Link>
            </p>
          </div>
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
