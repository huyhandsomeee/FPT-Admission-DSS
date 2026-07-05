import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  User, Bell, Shield, Calendar, Camera, Lock,
  Save, CheckCircle
} from "lucide-react";

const TABS = [
  { key: "account", label: "Tài khoản & Hồ sơ", icon: User },
  { key: "notifications", label: "Cấu hình thông báo", icon: Bell },
  { key: "permissions", label: "Quản lý quyền truy cập", icon: Shield },
  { key: "schedule", label: "Thời gian tuyển sinh", icon: Calendar },
];

function getInitials(name) {
  if (!name) return "NV";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function OfficerSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user?.fullName || "Nguyễn Văn A",
    email: user?.email || "anv@fpt.edu.vn",
    phone: "0901 234 567",
    department: "Ban Tuyển sinh - HN",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = () => {
    if (!passwords.current) {
      alert("Vui lòng nhập mật khẩu hiện tại");
      return;
    }
    if (passwords.newPassword.length < 8) {
      alert("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }
    if (passwords.newPassword !== passwords.confirm) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setPasswords({ current: "", newPassword: "", confirm: "" });
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", border: "1px solid #E2E8F0",
    borderRadius: 10, fontSize: 14, color: "#1E293B", outline: "none",
    transition: "border-color 0.2s", boxSizing: "border-box",
    background: "#F8FAFC", fontFamily: "inherit"
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Header */}
      <h1 style={{ margin: 0, fontWeight: 800, fontSize: 24, color: "#FF6B35" }}>
        Cài đặt hệ thống
      </h1>

      {saved && (
        <div style={{
          padding: "12px 20px", background: "#ECFDF5", border: "1px solid #A7F3D0",
          color: "#065F46", borderRadius: 12, display: "flex", alignItems: "center",
          gap: 10, fontSize: 14, fontWeight: 600
        }}>
          <CheckCircle size={18} /> Đã lưu thay đổi thành công!
        </div>
      )}

      {/* Content: sidebar tabs + main */}
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24, alignItems: "flex-start" }}>

        {/* Settings sidebar tabs */}
        <div style={{
          background: "white", borderRadius: 16, padding: "12px",
          border: "1px solid #F1F5F9", boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
        }}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  width: "100%", textAlign: "left", padding: "12px 16px",
                  background: isActive ? "rgba(255,107,53,0.06)" : "transparent",
                  border: "none", borderLeft: isActive ? "3px solid #FF6B35" : "3px solid transparent",
                  borderRadius: 8, fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#FF6B35" : "#64748B", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 10,
                  transition: "all 0.15s", marginBottom: 2
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F7F8FA"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main content area */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {activeTab === "account" && (
            <>
              {/* Thông tin cá nhân */}
              <div style={{
                background: "white", borderRadius: 16, padding: "28px",
                border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}>
                <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 20, background: "#FF6B35", borderRadius: 99, display: "inline-block" }} />
                  Thông tin cá nhân
                </h2>

                {/* Avatar + info */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{
                      width: 80, height: 80, borderRadius: "50%",
                      background: "linear-gradient(135deg, #94A3B8, #64748B)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "white", fontWeight: 800, fontSize: 28
                    }}>
                      {getInitials(profile.fullName)}
                    </div>
                    <button style={{
                      position: "absolute", bottom: -2, right: -2,
                      width: 28, height: 28, borderRadius: "50%",
                      background: "#FF6B35", border: "3px solid white",
                      color: "white", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <Camera size={12} />
                    </button>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A" }}>{profile.fullName}</div>
                    <div style={{ fontSize: 14, color: "#64748B", marginTop: 2 }}>Chuyên viên Tuyển sinh Cao cấp</div>
                    <span style={{
                      display: "inline-block", marginTop: 6, padding: "4px 12px",
                      background: "#F1F5F9", borderRadius: 999, fontSize: 11,
                      fontWeight: 600, color: "#475569"
                    }}>
                      Admin Hệ thống
                    </span>
                  </div>
                </div>

                {/* Form fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
                      Họ và tên
                    </label>
                    <input
                      value={profile.fullName}
                      onChange={e => setProfile({ ...profile, fullName: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#FF6B35"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
                      Email công vụ
                    </label>
                    <input
                      value={profile.email}
                      onChange={e => setProfile({ ...profile, email: e.target.value })}
                      style={{ ...inputStyle, background: "#F1F5F9", color: "#94A3B8" }}
                      readOnly
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
                      Số điện thoại
                    </label>
                    <input
                      value={profile.phone}
                      onChange={e => setProfile({ ...profile, phone: e.target.value })}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#FF6B35"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
                      Phòng ban
                    </label>
                    <input
                      value={profile.department}
                      onChange={e => setProfile({ ...profile, department: e.target.value })}
                      style={{ ...inputStyle, background: "#F1F5F9", color: "#94A3B8" }}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Bảo mật & Đổi mật khẩu */}
              <div style={{
                background: "white", borderRadius: 16, padding: "28px",
                border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}>
                <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 4, height: 20, background: "#FF6B35", borderRadius: 99, display: "inline-block" }} />
                  Bảo mật & Đổi mật khẩu
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="••••••••"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#FF6B35"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                      placeholder="Tối thiểu 8 ký tự"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#FF6B35"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#64748B", marginBottom: 6 }}>
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Nhập lại mật khẩu mới"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = "#FF6B35"}
                      onBlur={e => e.target.style.borderColor = "#E2E8F0"}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                  <button onClick={handleChangePassword} style={{
                    padding: "10px 24px",
                    background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                    border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600,
                    color: "white", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                    boxShadow: "0 4px 12px rgba(255,107,53,0.3)",
                    transition: "all 0.2s"
                  }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    <Lock size={14} /> Cập nhật bảo mật
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <div style={{
              background: "white", borderRadius: 16, padding: "28px",
              border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 20, background: "#FF6B35", borderRadius: 99, display: "inline-block" }} />
                Cấu hình thông báo
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Thông báo hồ sơ mới", desc: "Nhận thông báo khi có hồ sơ mới được nộp", default: true },
                  { label: "Nhắc nhở xét duyệt", desc: "Nhắc nhở khi có hồ sơ chờ duyệt quá 24h", default: true },
                  { label: "Email tóm tắt hàng ngày", desc: "Nhận email tổng hợp cuối ngày", default: false },
                  { label: "Thông báo qua SMS", desc: "Gửi SMS cho các thông báo quan trọng", default: false },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "14px 16px", background: "#FAFBFC", borderRadius: 10, border: "1px solid #F1F5F9"
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <label style={{ position: "relative", display: "inline-block", width: 44, height: 24, cursor: "pointer" }}>
                      <input type="checkbox" defaultChecked={item.default} style={{ opacity: 0, width: 0, height: 0 }} />
                      <span style={{
                        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                        background: item.default ? "#FF6B35" : "#CBD5E1",
                        borderRadius: 99, transition: "0.3s"
                      }}>
                        <span style={{
                          position: "absolute", height: 18, width: 18, left: item.default ? 22 : 3, top: 3,
                          background: "white", borderRadius: "50%", transition: "0.3s"
                        }} />
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "permissions" && (
            <div style={{
              background: "white", borderRadius: 16, padding: "28px",
              border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 20, background: "#FF6B35", borderRadius: 99, display: "inline-block" }} />
                Quản lý quyền truy cập
              </h2>
              <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>
                <Shield size={48} color="#E2E8F0" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>Chức năng đang được phát triển</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Quản lý phân quyền sẽ sớm được cập nhật.</div>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div style={{
              background: "white", borderRadius: 16, padding: "28px",
              border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
            }}>
              <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: "#0F172A", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 4, height: 20, background: "#FF6B35", borderRadius: 99, display: "inline-block" }} />
                Thời gian tuyển sinh
              </h2>
              <div style={{ padding: 40, textAlign: "center", color: "#94A3B8" }}>
                <Calendar size={48} color="#E2E8F0" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 14, fontWeight: 600 }}>Chức năng đang được phát triển</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Cấu hình thời gian tuyển sinh sẽ sớm được cập nhật.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
