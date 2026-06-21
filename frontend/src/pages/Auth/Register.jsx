import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const user = await register(form.email, form.password, form.fullName, form.phone);
      navigate("/student/dashboard", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8"
      style={{ background: "linear-gradient(135deg, #FFF7F4 0%, #FFF 50%, #EFF6FF 100%)" }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg, #FF6B35, #E85A2A)" }}>
            <span className="text-white font-black text-2xl">F</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Đăng ký tài khoản</h1>
          <p className="text-gray-500 mt-2">Tạo tài khoản thí sinh để bắt đầu hành trình vào FPT University</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="form-label">Họ và tên *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={form.fullName} onChange={handleChange("fullName")}
                    placeholder="Nguyễn Văn A" required className="form-input pl-10" />
                </div>
              </div>
              <div className="col-span-2">
                <label className="form-label">Email *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={form.email} onChange={handleChange("email")}
                    placeholder="email@gmail.com" required className="form-input pl-10" />
                </div>
              </div>
              <div className="col-span-2">
                <label className="form-label">Số điện thoại</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" value={form.phone} onChange={handleChange("phone")}
                    placeholder="0901234567" className="form-input pl-10" />
                </div>
              </div>
              <div>
                <label className="form-label">Mật khẩu *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showPwd ? "text" : "password"} value={form.password} onChange={handleChange("password")}
                    placeholder="Tối thiểu 6 ký tự" required className="form-input pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="form-label">Xác nhận mật khẩu *</label>
                <input type="password" value={form.confirm} onChange={handleChange("confirm")}
                  placeholder="Nhập lại mật khẩu" required className="form-input" />
              </div>
            </div>

            <div className="flex items-start gap-2 mt-2">
              <input type="checkbox" required className="mt-1 w-4 h-4 accent-orange-500" />
              <label className="text-sm text-gray-600">
                Tôi đồng ý với{" "}
                <a href="#" className="text-orange-500 font-medium">Điều khoản sử dụng</a>
                {" "}và{" "}
                <a href="#" className="text-orange-500 font-medium">Chính sách bảo mật</a>
              </label>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn btn-lg flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #FF6B35, #E85A2A)", color: "white" }}>
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <><UserPlus size={18} /> Tạo tài khoản</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">Đã có tài khoản? </span>
            <Link to="/login" className="text-sm font-semibold text-orange-500">Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
