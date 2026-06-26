import React from "react";
import { Building2 } from "lucide-react";

export default function SectionCampusMajor({ form, setForm, update, campuses, majors }) {
  return (
    <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#FF6B35", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px", marginBottom: "20px" }}>
        <Building2 size={18} /> 3. Đăng ký Cơ sở & Ngành học
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div>
          <label className="form-label">Cơ sở đào tạo *</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
            {campuses.map((campus) => (
              <div key={campus.id}
                onClick={() => setForm({ ...form, campusId: campus.id, majorId: "" })}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "16px", borderRadius: "14px",
                  border: form.campusId == campus.id ? "2px solid #FF6B35" : "2px solid #E2E8F0",
                  backgroundColor: form.campusId == campus.id ? "#FFF7F4" : "white",
                  cursor: "pointer", transition: "all 0.2s ease"
                }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  border: form.campusId == campus.id ? "2px solid #FF6B35" : "2px solid #CBD5E1",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  {form.campusId == campus.id && <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FF6B35" }}></div>}
                </div>
                <div>
                  <div style={{ fontWeight: "600", fontSize: "14px", color: "#1E293B" }}>{campus.name}</div>
                  <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{campus.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {form.campusId && (
          <div>
            <label className="form-label">Ngành học *</label>
            <select className="form-select" style={{ marginTop: "8px" }} value={form.majorId} onChange={update("majorId")} required>
              <option value="">-- Chọn ngành học --</option>
              {majors.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
