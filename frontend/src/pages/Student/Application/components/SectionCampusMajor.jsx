import React, { useRef } from "react";
import { Upload, Plus, Trash2 } from "lucide-react";

export default function SectionCampusMajor({
  form,
  setForm,
  update,
  campuses,
  majors,
  files,
  setFiles,
  showDirectSection // Pass this flag from parent: true if form.methodId matches Method 2 (Xét tuyển thẳng)
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, chungChiFile: e.target.files[0] }));
    }
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFiles(prev => ({ ...prev, chungChiFile: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Block 4: Thông tin đăng ký */}
      <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", margin: "0 0 20px 0" }}>
          Thông tin đăng ký
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Cơ sở <span style={{ color: "#EF4444" }}>(*)</span></label>
            <select
              className="form-select"
              value={form.campusId}
              onChange={(e) => {
                setForm(prev => ({ ...prev, campusId: e.target.value, majorId: "" }));
              }}
              required
            >
              <option value="">Chọn thông tin</option>
              {campuses.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.city})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Chuyên ngành quan tâm <span style={{ color: "#EF4444" }}>(*)</span></label>
            <select
              className="form-select"
              value={form.majorId}
              onChange={update("majorId")}
              required
              disabled={!form.campusId}
            >
              <option value="">Lựa chọn ngành học</option>
              {majors.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Block 5: Xét tuyển thẳng/Ưu tiên xét tuyển (Conditional) */}
      {showDirectSection && (
        <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", margin: "0 0 20px 0" }}>
            Xét tuyển thẳng/Ưu tiên xét tuyển
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Thuộc diện */}
            <div>
              <label className="form-label" style={{ fontWeight: "600" }}>
                Thuộc diện <span style={{ color: "#EF4444" }}>(*)</span>
              </label>
              <select
                className="form-select"
                value={form.academicAchievement || ""}
                onChange={update("academicAchievement")}
                required
                style={{ marginTop: "6px" }}
              >
                <option value="">Chọn thông tin</option>
                <option value="Xét tuyển thẳng theo quy định của Bộ GD&ĐT">
                  Xét tuyển thẳng theo quy định của Bộ GD&ĐT
                </option>
                <option value="Chứng chỉ tiếng Anh quốc tế (IELTS từ 6.0 trở lên hoặc tương đương)">
                  Chứng chỉ tiếng Anh quốc tế (IELTS từ 6.0 trở lên hoặc tương đương)
                </option>
                <option value="Đạt giải học sinh giỏi cấp tỉnh/thành phố trở lên">
                  Đạt giải học sinh giỏi cấp tỉnh/thành phố trở lên
                </option>
                <option value="Diện ưu tiên xét tuyển thẳng khác của Trường Đại học FPT">
                  Diện ưu tiên xét tuyển thẳng khác của Trường Đại học FPT
                </option>
              </select>
            </div>

            {/* File Upload minh chứng */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B" }}>
                Upload minh chứng Xét tuyển thẳng/Ưu tiên xét tuyển <span style={{ color: "#EF4444" }}>(*)</span>
              </span>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: files.chungChiFile ? "1px solid #10B981" : "1px dashed #CBD5E1",
                  borderRadius: "10px",
                  padding: "14px 16px",
                  backgroundColor: files.chungChiFile ? "#F0FDF4" : "#F8FAFC",
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
                  <Upload size={18} style={{ color: files.chungChiFile ? "#10B981" : "#FF6B35" }} />
                  <span style={{ fontSize: "14px", color: files.chungChiFile ? "#15803D" : "#475569", fontWeight: files.chungChiFile ? "600" : "400" }}>
                    {files.chungChiFile ? files.chungChiFile.name : "Chọn vào đây để tải ảnh lên"}
                  </span>
                </div>
                {files.chungChiFile && (
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
