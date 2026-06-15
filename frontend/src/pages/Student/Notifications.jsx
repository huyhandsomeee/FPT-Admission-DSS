import { useState, useEffect } from "react";
import api from "../../config/axiosConfig";
import { Bell, CheckCheck, Info, Trophy, Clock, MessageSquare } from "lucide-react";

const TYPE_CONFIG = {
  ADMISSION_UPDATE: { icon: Clock, color: "bg-blue-100 text-blue-600", label: "Cập nhật tuyển sinh" },
  SYSTEM: { icon: Info, color: "bg-gray-100 text-gray-600", label: "Hệ thống" },
  RESULT: { icon: Trophy, color: "bg-green-100 text-green-600", label: "Kết quả" },
  REMINDER: { icon: Bell, color: "bg-yellow-100 text-yellow-600", label: "Nhắc nhở" },
  MESSAGE: { icon: MessageSquare, color: "bg-purple-100 text-purple-600", label: "Tin nhắn" },
};

const MOCK_NOTIFS = [
  { id: 1, title: "Hồ sơ đang được xét duyệt", message: "Hồ sơ APP2025001001 của bạn đang được xem xét. Chúng tôi sẽ thông báo kết quả trong 3-5 ngày làm việc.", type: "ADMISSION_UPDATE", isRead: false, createdAt: "2025-03-20T10:00:00" },
  { id: 2, title: "Chào mừng đến với FPT University!", message: "Cảm ơn bạn đã đăng ký xét tuyển vào FPT University năm 2025.", type: "SYSTEM", isRead: true, createdAt: "2025-03-15T08:00:00" },
  { id: 3, title: "Nhắc nhở: Deadline nộp hồ sơ", message: "Đợt 1 kết thúc vào 30/03/2025. Bạn có 5 ngày để hoàn thiện hồ sơ.", type: "REMINDER", isRead: false, createdAt: "2025-03-14T09:00:00" },
];

export default function StudentNotifications() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/api/student/notifications").then(r => setNotifs(r.data.content || MOCK_NOTIFS)).catch(() => {});
  }, []);

  const markAll = () => setNotifs(notifs.map(n => ({ ...n, isRead: true })));
  const unread = notifs.filter(n => !n.isRead).length;
  const filtered = filter === "unread" ? notifs.filter(n => !n.isRead) : notifs;

  return (
    <div className="space-y-6 animate-fade-in" style={{ padding: "8px 0" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
          <p className="text-gray-500 text-sm mt-1">{unread} thông báo chưa đọc</p>
        </div>
        {unread > 0 && (
          <button onClick={markAll} className="student-btn-primary" style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "13px" }}>
            <CheckCheck size={16} /> Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      <div className="flex gap-2" style={{ display: "flex", gap: "8px" }}>
        {[["all", "Tất cả"], ["unread", "Chưa đọc"]].map(([val, label]) => {
          const isActive = filter === val;
          return (
            <button key={val} onClick={() => setFilter(val)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: isActive ? "linear-gradient(135deg, #FF6B35, #E85A2A)" : "white",
                color: isActive ? "white" : "#475569",
                border: isActive ? "none" : "1px solid #E2E8F0",
                boxShadow: isActive ? "0 4px 12px rgba(255,107,53,0.15)" : "none",
                cursor: "pointer"
              }}>
              {label} {val === "unread" && unread > 0 && <span className="ml-1 bg-white bg-opacity-30 rounded-full px-1.5" style={{ marginLeft: "4px", backgroundColor: "rgba(255,255,255,0.25)", padding: "2px 6px", borderRadius: "999px" }}>{unread}</span>}
            </button>
          );
        })}
      </div>

      <div className="space-y-3" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((notif) => {
          const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.SYSTEM;
          return (
            <div key={notif.id}
              className="student-card"
              style={{
                cursor: "pointer",
                padding: "20px 24px",
                border: !notif.isRead ? "1px solid #FFD8A8" : "1px solid #F1F5F9",
                background: !notif.isRead ? "#FFF9F6" : "white"
              }}
              onClick={() => setNotifs(notifs.map(n => n.id === notif.id ? { ...n, isRead: true } : n))}>
              <div className="flex items-start gap-4" style={{ display: "flex", gap: "16px" }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                  <cfg.icon size={18} />
                </div>
                <div className="flex-1 min-w-0" style={{ flex: 1 }}>
                  <div className="flex items-start justify-between gap-2" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h4 className="font-bold text-sm" style={{ color: !notif.isRead ? "#1E293B" : "#475569", margin: 0 }}>
                      {notif.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-shrink-0" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-orange-500" style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FF6B35" }}></span>}
                      <span className="text-xs text-gray-400">{new Date(notif.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed" style={{ marginTop: "4px", color: "#64748B", lineHeight: "1.6" }}>{notif.message}</p>
                  <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${cfg.color}`} style={{ display: "inline-block", marginTop: "8px", borderRadius: "20px", padding: "2px 8px" }}>{cfg.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
