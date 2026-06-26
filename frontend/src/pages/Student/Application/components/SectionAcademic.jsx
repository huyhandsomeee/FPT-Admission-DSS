import React from "react";
import { BookOpen } from "lucide-react";

export default function SectionAcademic({ form, update, schools }) {
  return (
    <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#FF6B35", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px", marginBottom: "20px" }}>
        <BookOpen size={18} /> 2. Học vấn & Điểm số GPA
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {!form.provinceId && (
          <div style={{ gridColumn: "span 2" }}>
            <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: "12px", padding: "14px 18px", fontSize: "13px", color: "#92400E", display: "flex", alignItems: "center", gap: "10px" }}>
              ⚠️ Vui lòng chọn <strong>Tỉnh/Thành phố</strong> ở phần "Thông tin cá nhân" trước để hiển thị danh sách trường THPT.
            </div>
          </div>
        )}
        <div style={{ gridColumn: "span 2" }}>
          <label className="form-label">Trường THPT *</label>
          {form.provinceId ? (
            <>
              <select className="form-select" value={form.schoolName} onChange={update("schoolName")} required style={{ marginTop: "6px" }}>
                <option value="">-- Chọn trường THPT --</option>
                {schools.filter(s => s.schoolType === "PUBLIC").length > 0 && (
                  <optgroup label="🏫 Trường công lập">
                    {schools.filter(s => s.schoolType === "PUBLIC").map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </optgroup>
                )}
                {schools.filter(s => s.schoolType === "PRIVATE").length > 0 && (
                  <optgroup label="🏠 Trường tư thục">
                    {schools.filter(s => s.schoolType === "PRIVATE").map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </optgroup>
                )}
              </select>
              {form.schoolName && (
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#16A34A", fontWeight: "600" }}>
                  ✓ Đã chọn: {form.schoolName}
                </div>
              )}
            </>
          ) : (
            <select className="form-select" disabled style={{ marginTop: "6px", opacity: 0.5, cursor: "not-allowed" }}>
              <option>-- Chọn tỉnh/thành trước --</option>
            </select>
          )}
        </div>
        <div>
          <label className="form-label">Năm tốt nghiệp</label>
          <select className="form-select" value={form.graduationYear} onChange={update("graduationYear")}>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
        <div></div>
        <div style={{ gridColumn: "span 2" }}>
          <p style={{ marginBottom: "12px", color: "#475569", fontSize: "14px", fontWeight: "700" }}>📚 GPA học bạ lớp 10, 11, 12</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {[["Lớp 10 *", "gpa10"], ["Lớp 11 *", "gpa11"], ["Lớp 12 *", "gpa12"]].map(([label, field]) => (
              <div key={field}>
                <label className="form-label">{label}</label>
                <input type="number" step="0.01" min="0" max="10" className="form-input" value={form[field]} onChange={update(field)} placeholder="0.00" required />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
