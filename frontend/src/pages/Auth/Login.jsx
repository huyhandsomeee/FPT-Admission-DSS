import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDefaultPath } from "../../utils/rolePermissions";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
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

  const quickLogins = [
    { email: "student1@gmail.com", role: "Sinh viên", color: "bg-orange-100 text-orange-700 border-orange-200" },
    { email: "officer1@fpt.edu.vn", role: "Nhân viên TS", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { email: "manager@fpt.edu.vn", role: "Trưởng phòng", color: "bg-purple-100 text-purple-700 border-purple-200" },
    { email: "bod@fpt.edu.vn", role: "Ban giám hiệu", color: "bg-slate-100 text-slate-700 border-slate-200" },
    { email: "admin@fpt.edu.vn", role: "Quản trị", color: "bg-green-100 text-green-700 border-green-200" },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #FFF7F4 0%, #FFF 50%, #EFF6FF 100%)" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FF6B35 0%, #E85A2A 40%, #1A3A6C 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-white blur-3xl"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-16 text-center">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
            <span className="text-orange-500 font-black text-4xl">F</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            FPT University<br />
            <span className="text-orange-200">Admission Portal</span>
          </h1>
          <p className="text-orange-100 text-lg mb-12 leading-relaxed">
            Hệ thống quản lý tuyển sinh và hỗ trợ quyết định thông minh
          </p>
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {[
              { label: "Thí sinh đăng ký", value: "20,000+" },
              { label: "Ngành đào tạo", value: "25+" },
              { label: "Cơ sở đào tạo", value: "5" },
              { label: "Tỷ lệ đậu", value: "72%" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-orange-200 text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF6B35, #E85A2A)" }}>
              <span className="text-white font-black text-xl">F</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">FPT University</div>
              <div className="text-sm text-gray-500">Admission Portal</div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
          <p className="text-gray-500 mb-8">Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.</p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@fpt.edu.vn"
                  required
                  className="form-input pl-10"
                  style={{ fontFamily: 'Inter' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label">Mật khẩu</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required
                  className="form-input pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                Ghi nhớ đăng nhập
              </label>
              <Link to="/forgot-password" className="text-sm font-medium" style={{ color: "#FF6B35" }}>
                Quên mật khẩu?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn btn-lg flex items-center justify-center gap-2"
              style={{ background: loading ? "#CBD5E1" : "linear-gradient(135deg, #FF6B35, #E85A2A)", color: "white" }}>
              {loading ? (
                <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Đang đăng nhập...</>
              ) : (
                <><LogIn size={18} /> Đăng nhập</>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">Chưa có tài khoản? </span>
            <Link to="/register" className="text-sm font-semibold" style={{ color: "#FF6B35" }}>
              Đăng ký ngay
            </Link>
          </div>

          {/* Quick Login Demo */}
          <div className="mt-8 p-5 bg-gray-50 rounded-2xl">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              🚀 Demo - Đăng nhập nhanh (mật khẩu: Admin@123)
            </p>
            <div className="flex flex-wrap gap-2">
              {quickLogins.map((ql) => (
                <button
                  key={ql.email}
                  type="button"
                  onClick={() => { setEmail(ql.email); setPassword("Admin@123"); }}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all hover:scale-105 ${ql.color}`}
                >
                  {ql.role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
