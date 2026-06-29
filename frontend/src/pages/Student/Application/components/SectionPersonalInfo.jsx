import React, { useRef } from "react";
import { Upload, User, Image as ImageIcon, Trash2 } from "lucide-react";

export default function SectionPersonalInfo({
  form,
  update,
  setForm,
  files,
  setFiles
}) {
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleFileChange = (key) => (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files[0] }));
    }
  };

  const removeFile = (key, e) => {
    e.stopPropagation();
    setFiles(prev => ({ ...prev, [key]: null }));
    if (key === "cccdFrontFile" && frontInputRef.current) frontInputRef.current.value = "";
    if (key === "cccdBackFile" && backInputRef.current) backInputRef.current.value = "";
  };

  const renderUploadBox = (key, label, inputRef) => {
    const file = files[key];
    const previewUrl = file ? URL.createObjectURL(file) : null;

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
        <span style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B" }}>
          {label} <span style={{ color: "#EF4444" }}>(*)</span>
        </span>
        <div
          onClick={() => inputRef.current?.click()}
          style={{
            border: file ? "1px solid #10B981" : "1.5px dashed #CBD5E1",
            borderRadius: "14px",
            padding: "24px",
            backgroundColor: file ? "#F0FDF4" : "#F8FAFC",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "160px",
            position: "relative",
            transition: "all 0.25s ease",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            if (!file) {
              e.currentTarget.style.borderColor = "#FF6B35";
              e.currentTarget.style.backgroundColor = "#FFF7F4";
            }
          }}
          onMouseLeave={(e) => {
            if (!file) {
              e.currentTarget.style.borderColor = "#CBD5E1";
              e.currentTarget.style.backgroundColor = "#F8FAFC";
            }
          }}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={handleFileChange(key)}
            accept="image/*"
            style={{ display: "none" }}
          />

          {file ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", width: "100%" }}>
              <img
                src={previewUrl}
                alt={label}
                style={{ maxHeight: "100px", objectFit: "contain", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
              />
              <span style={{ fontSize: "12px", color: "#16A34A", fontWeight: "600", textAlign: "center", maxWidth: "90%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                ✓ {file.name}
              </span>
              <button
                type="button"
                onClick={(e) => removeFile(key, e)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#EF4444",
                  cursor: "pointer"
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#FFF7F4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FF6B35"
              }}>
                <Upload size={20} />
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#1E293B" }}>Chọn ảnh tải lên</div>
              <div style={{ fontSize: "12px", color: "#64748B" }}>JPG, PNG. Tối đa 5MB.</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {/* Block 1: Ảnh CCCD / Thẻ Căn cước */}
      <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", margin: "0 0 20px 0" }}>
          Ảnh CCCD / Thẻ Căn cước
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {renderUploadBox("cccdFrontFile", "Mặt trước", frontInputRef)}
          {renderUploadBox("cccdBackFile", "Mặt sau", backInputRef)}
        </div>
      </div>

      {/* Block 2: Thông tin thí sinh */}
      <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", margin: "0 0 20px 0" }}>
          Thông tin thí sinh
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ gridColumn: "span 2" }}>
            <label className="form-label" style={{ fontWeight: "600" }}>Họ và tên <span style={{ color: "#EF4444" }}>(*)</span></label>
            <input className="form-input" value={form.fullName} onChange={update("fullName")} placeholder="Nguyễn Văn A" required />
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Số điện thoại <span style={{ color: "#EF4444" }}>(*)</span></label>
            <input className="form-input" value={form.phone} onChange={update("phone")} placeholder="0901234567" required />
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Email <span style={{ color: "#EF4444" }}>(*)</span></label>
            <input className="form-input" type="email" value={form.email} onChange={update("email")} placeholder="example@gmail.com" required />
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Giới tính <span style={{ color: "#EF4444" }}>(*)</span></label>
            <select className="form-select" value={form.gender} onChange={update("gender")} required>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Ngày sinh <span style={{ color: "#EF4444" }}>(*)</span></label>
            <input type="date" className="form-input" value={form.dob} onChange={update("dob")} required />
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Số CCCD / Thẻ Căn cước <span style={{ color: "#EF4444" }}>(*)</span></label>
            <input className="form-input" value={form.cccd} onChange={update("cccd")} placeholder="012345678901" required />
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Cấp ngày <span style={{ color: "#EF4444" }}>(*)</span></label>
            <input type="date" className="form-input" value={form.cccdIssueDate} onChange={update("cccdIssueDate")} required />
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Nơi cấp <span style={{ color: "#EF4444" }}>(*)</span></label>
            <select className="form-select" value={form.cccdIssuePlace} onChange={update("cccdIssuePlace")} required>
              <option value="">-- Chọn thông tin --</option>
              <option value="Cục Cảnh sát Quản lý Hành chính về Trật tự Xã hội">Cục Cảnh sát Quản lý Hành chính về Trật tự Xã hội</option>
              <option value="Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư">Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư</option>
              <option value="Công an tỉnh thành phố">Công an tỉnh/thành phố nơi cư trú</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
