import React from "react";
import { Search } from "lucide-react";
import { getInitials } from "../../../../utils/fileUtils";
import { AVATAR_COLORS, STATUS_COLORS, STATUS_LABELS } from "../../../../utils/statusUtils";
import { formatDate } from "../../../../utils/dateUtils";

export default function StudentTable({ students, loading, total, search, onSearchChange }) {
  return (
    <div style={{ background: "white", borderRadius: 16, border: "1px solid #F1F5F9", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "9px 14px" }}>
          <Search size={15} color="#94A3B8" />
          <input value={search} onChange={e => onSearchChange(e.target.value)} type="text"
            placeholder="Tìm kiếm theo tên hoặc email thí sinh..."
            style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: "#475569", width: "100%" }} />
        </div>
        <div style={{ fontSize: 13, color: "#64748B", whiteSpace: "nowrap" }}>
          Tổng: <strong style={{ color: "#1E293B" }}>{total.toLocaleString()}</strong> thí sinh
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Đang tải dữ liệu...</div>
        ) : students.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Không tìm thấy thí sinh nào</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Thí sinh", "Email", "Số điện thoại", "Mã thí sinh", "Hồ sơ", "Trạng thái", "Ngày đăng ký"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#94A3B8", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((stu, idx) => {
                const avatarC = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                return (
                  <tr key={stu.id}
                    onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: avatarC.bg, color: avatarC.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                          {getInitials(stu.fullName)}
                        </div>
                        <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{stu.fullName}</div>
                      </div>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B", borderBottom: "1px solid #F8FAFC" }}>{stu.email}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B", borderBottom: "1px solid #F8FAFC" }}>{stu.phone || "—"}</td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                      {stu.studentCode ? (
                        <code style={{ fontSize: 12, fontWeight: 700, color: "#1E293B", background: "#F1F5F9", padding: "2px 8px", borderRadius: 6 }}>{stu.studentCode}</code>
                      ) : <span style={{ fontSize: 12, color: "#CBD5E1" }}>Chưa có</span>}
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                      {stu.hasProfile ? (
                        <span style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>{stu.totalApplications} hồ sơ</span>
                      ) : <span style={{ fontSize: 12, color: "#F59E0B", fontWeight: 600 }}>Chưa có hồ sơ</span>}
                    </td>
                    <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                      {stu.latestStatus ? (
                        <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: (STATUS_COLORS[stu.latestStatus] || STATUS_COLORS.DRAFT).bg, color: (STATUS_COLORS[stu.latestStatus] || STATUS_COLORS.DRAFT).color }}>
                          {STATUS_LABELS[stu.latestStatus]}
                        </span>
                      ) : <span style={{ fontSize: 12, color: "#CBD5E1" }}>—</span>}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#94A3B8", borderBottom: "1px solid #F8FAFC" }}>
                      {stu.createdAt ? formatDate(stu.createdAt) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
