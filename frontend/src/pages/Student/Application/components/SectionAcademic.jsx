import React, { useRef } from "react";
import { Upload, Info, FileText, Plus, Trash2 } from "lucide-react";

export default function SectionAcademic({
  form,
  update,
  setForm,
  provinces,
  schools,
  files,
  setFiles,
  fetchSchools,
  showHocBaSection // Pass this flag from parent: true if form.methodId matches Method 1 (Học bạ)
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, hocBaFile: e.target.files[0] }));
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFiles(prev => ({ ...prev, hocBaFile: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Block 3: Thông tin trường THPT */}
      <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", margin: "0 0 20px 0" }}>
          Thông tin trường THPT
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Tỉnh/Thành phố THPT <span style={{ color: "#EF4444" }}>(*)</span></label>
            <select
              className="form-select"
              value={form.provinceId}
              onChange={(e) => {
                const val = e.target.value;
                setForm(prev => ({ ...prev, provinceId: val, schoolName: "" }));
                if (fetchSchools) fetchSchools(val);
              }}
              required
            >
              <option value="">Chọn thông tin</option>
              {provinces.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Trường THPT <span style={{ color: "#EF4444" }}>(*)</span></label>
            <select
              className="form-select"
              value={form.schoolName}
              onChange={update("schoolName")}
              required
              disabled={!form.provinceId}
            >
              <option value="">Chọn thông tin</option>
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
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Năm tốt nghiệp <span style={{ color: "#EF4444" }}>(*)</span></label>
            <select className="form-select" value={form.graduationYear} onChange={update("graduationYear")} required>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Block 5: Nộp học bạ (Conditional) */}
      {showHocBaSection && (
        <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", margin: "0 0 20px 0" }}>
            Nộp học bạ
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Input GPA 12 */}
            <div style={{ maxWidth: "320px", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "16px", backgroundColor: "#F8FAFC" }}>
              <label className="form-label" style={{ fontWeight: "600", fontSize: "13px" }}>
                Điểm trung bình năm lớp 12 <span style={{ color: "#EF4444" }}>(*)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-input"
                value={form.gpa12}
                onChange={update("gpa12")}
                placeholder="VD: 8.25"
                required
                style={{ marginTop: "6px" }}
              />
              <span style={{ fontSize: "11px", color: "#64748B", marginTop: "4px", display: "block" }}>
                Thang điểm 10.
              </span>
            </div>

            {/* Instruction Card (Orange) */}
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              padding: "16px",
              background: "#FFF7F4",
              border: "1px solid #FFEDD5",
              borderRadius: "12px",
              color: "#C2410C"
            }}>
              <Info size={18} style={{ color: "#FF6B35", flexShrink: 0, marginTop: "2px" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontWeight: "700", fontSize: "12px", color: "#FF6B35", textTransform: "uppercase" }}>
                  HƯỚNG DẪN UPLOAD
                </span>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: "#64748B" }}>
                  Với thí sinh tốt nghiệp năm 2026, upload "Phiếu đăng ký xét công nhận tốt nghiệp THPT" trên trang{" "}
                  <a
                    href="https://thisinh.thitotnghiepthpt.edu.vn"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#FF6B35", fontWeight: "600", textDecoration: "underline" }}
                  >
                    thisinh.thitotnghiepthpt.edu.vn
                  </a>.
                </p>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: "1.5", color: "#64748B" }}>
                  Với thí sinh tốt nghiệp trước năm 2026, upload học bạ lớp 12.
                </p>
              </div>
            </div>

            {/* File Upload minh chứng */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B" }}>
                Upload minh chứng điểm trung bình lớp 12 <span style={{ color: "#EF4444" }}>(*)</span>
              </span>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: files.hocBaFile ? "1px solid #10B981" : "1px dashed #CBD5E1",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  backgroundColor: files.hocBaFile ? "#F0FDF4" : "#F8FAFC",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.2s ease"
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                  style={{ display: "none" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Upload size={18} style={{ color: files.hocBaFile ? "#10B981" : "#FF6B35" }} />
                  <span style={{ fontSize: "14px", color: files.hocBaFile ? "#15803D" : "#475569", fontWeight: files.hocBaFile ? "600" : "400" }}>
                    {files.hocBaFile ? files.hocBaFile.name : "Chọn vào đây để tải ảnh lên"}
                  </span>
                </div>
                {files.hocBaFile && (
                  <button
                    type="button"
                    onClick={removeFile}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#EF4444",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Add other files button (Static representation as in image) */}
              <div style={{ alignSelf: "flex-start", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    backgroundColor: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "6px 12px",
                    fontSize: "13px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer"
                  }}
                >
                  <Plus size={14} /> Thêm tập tin khác
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
