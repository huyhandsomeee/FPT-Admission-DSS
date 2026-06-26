import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { getInitials } from "../../../../utils/fileUtils";
import { AVATAR_COLORS, STATUS_COLORS, STATUS_LABELS } from "../../../../utils/statusUtils";
import { formatDate } from "../../../../utils/dateUtils";

export default function ApplicationTable({ apps, loading }) {
  const navigate = useNavigate();

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Đang tải dữ liệu...</div>;
  }

  if (apps.length === 0) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Không tìm thấy hồ sơ nào</div>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Mã hồ sơ", "Họ và tên", "Ngành - Cơ sở", "Phương thức", "Điểm", "Ngày nộp", "Trạng thái", "Thao tác"].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#94A3B8", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {apps.map((app, idx) => {
            const avatarC = AVATAR_COLORS[idx % AVATAR_COLORS.length];
            const statusC = STATUS_COLORS[app.status] || STATUS_COLORS.DRAFT;
            return (
              <tr key={app.id} style={{ cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                onClick={() => navigate(`/officer/applicants/${app.id}`)}>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                  <code style={{ fontSize: 12, fontWeight: 700, color: "#1E293B", background: "#F1F5F9", padding: "2px 8px", borderRadius: 6 }}>{app.applicationCode}</code>
                </td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: avatarC.bg, color: avatarC.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                      {getInitials(app.studentName)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{app.studentName}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8" }}>{app.studentEmail}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                  <div style={{ fontWeight: 600, color: "#1E293B", fontSize: 13 }}>{app.majorName}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{app.campusName}</div>
                </td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#64748B", borderBottom: "1px solid #F8FAFC" }}>{app.methodName}</td>
                <td style={{ padding: "14px 16px", fontWeight: 800, fontSize: 14, color: "#2563EB", borderBottom: "1px solid #F8FAFC" }}>{app.totalScore}</td>
                <td style={{ padding: "14px 16px", fontSize: 13, color: "#94A3B8", borderBottom: "1px solid #F8FAFC" }}>
                  {app.submittedAt ? formatDate(app.submittedAt) : "Chưa nộp"}
                </td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                  <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: statusC.bg, color: statusC.color }}>
                    {STATUS_LABELS[app.status]}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", borderBottom: "1px solid #F8FAFC" }}>
                  <button onClick={e => { e.stopPropagation(); navigate(`/officer/applicants/${app.id}`); }}
                    style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#2563EB", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                    <Eye size={14} /> Xét duyệt
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
