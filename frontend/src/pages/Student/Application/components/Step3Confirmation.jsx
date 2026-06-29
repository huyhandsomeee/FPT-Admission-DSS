import React from "react";
import { formatDateDisplay } from "../../../../utils/dateUtils";

export default function Step3Confirmation({ form, campuses, majors, methods, files }) {
  const selectedMethod = methods.find(m => m.id == form.methodId);
  const uploadedCount = Object.values(files).filter(Boolean).length;

  const summary = [
    ["Phương thức xét tuyển", selectedMethod?.name || "—", true],
    ["Họ và tên thí sinh", form.fullName],
    ["Ngày sinh", formatDateDisplay(form.dob)],
    ["Giới tính", form.gender === "MALE" ? "Nam" : form.gender === "FEMALE" ? "Nữ" : "Khác"],
    ["Số điện thoại", form.phone],
    ["Số CCCD", form.cccd],
    ["Trường THPT tốt nghiệp", `${form.schoolName} (${form.graduationYear})`],
  ];

  if (selectedMethod?.code === 'HOC_BA') {
    summary.push(["Điểm TB năm lớp 12", form.gpa12]);
  } else if (selectedMethod?.code === 'SAT_IELTS') {
    summary.push(["Thuộc diện tuyển thẳng", form.academicAchievement || "—"]);
  }

  summary.push(
    ["Cơ sở đăng ký", campuses.find(c => c.id == form.campusId)?.name || "—"],
    ["Ngành học đăng ký", majors.find(m => m.id == form.majorId)?.name || "—"],
    ["Tài liệu đã tải lên", `${uploadedCount} tệp tài liệu đính kèm`]
  );

  return (
    <>
      <div style={{ padding: "24px 28px", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#FF6B35", textTransform: "uppercase", letterSpacing: "0.8px" }}>NỘP HỒ SƠ</span>
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1E293B", margin: "0" }}>Bước 3 — Xác nhận hoàn thành</h2>
        <p style={{ fontSize: "14px", color: "#64748B", marginTop: "6px" }}>Vui lòng kiểm tra lại toàn bộ thông tin trước khi nộp hồ sơ.</p>
      </div>
      <div style={{ padding: "28px" }}>
        <div style={{ background: "#FFF7F4", borderRadius: "14px", padding: "24px", border: "1px solid #FFEDD5" }}>
          <h4 style={{ color: "#E85A2A", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", marginBottom: "20px" }}>
            📋 TÓM TẮT HỒ SƠ ĐĂNG KÝ
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {summary.map(([label, value, isHighlight], idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #FFEDD5", paddingBottom: "8px" }}>
                <span style={{ color: "#64748B", fontSize: "14px" }}>{label}:</span>
                <span style={{ fontWeight: "700", fontSize: "14px", color: isHighlight ? "#E85A2A" : "#1E293B" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "24px", padding: "12px", background: "white", borderRadius: "10px", border: "1px solid #FFEDD5", fontSize: "12px", color: "#64748B" }}>
            ⚠️ <strong>Cam kết:</strong> Thí sinh chịu trách nhiệm hoàn toàn về tính chính xác và trung thực của các thông tin, tài liệu đã cung cấp trong hồ sơ này.
          </div>
        </div>
      </div>
    </>
  );
}
