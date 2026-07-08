import React, { useRef } from "react";
import { Upload, Info, FileText, Plus, Trash2 } from "lucide-react";
import SearchableSelect from "../../../../components/SearchableSelect";

export default function SectionAcademic({
  form,
  update,
  setForm,
  provinces,
  dbProvinces,
  schools,
  schoolsLoading,
  files,
  setFiles,
  fetchSchools,
  showHocBaSection,
  showThptSection
}) {
  const fileInputRef = useRef(null);
  const gpa10FileRef = useRef(null);
  const gpa11FileRef = useRef(null);

  const handleFileChange = (key, ref) => (e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files[0] }));
    }
  };

  const removeFile = (key, ref) => (e) => {
    e.stopPropagation();
    setFiles(prev => ({ ...prev, [key]: null }));
    if (ref?.current) ref.current.value = "";
  };

  const renderUploadRow = (key, label, ref) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B" }}>
        {label} <span style={{ color: "#EF4444" }}>(*)</span>
      </span>
      <div
        onClick={() => ref.current?.click()}
        style={{
          border: files[key] ? "1px solid #10B981" : "1px dashed #CBD5E1",
          borderRadius: "10px", padding: "14px 16px",
          backgroundColor: files[key] ? "#F0FDF4" : "#F8FAFC",
          cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "space-between", transition: "all 0.2s ease"
        }}
      >
        <input type="file" ref={ref} onChange={handleFileChange(key, ref)} accept="image/*,application/pdf" style={{ display: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Upload size={18} style={{ color: files[key] ? "#10B981" : "#FF6B35" }} />
          <span style={{ fontSize: "14px", color: files[key] ? "#15803D" : "#475569", fontWeight: files[key] ? "600" : "400" }}>
            {files[key] ? files[key].name : "Chọn vào đây để tải ảnh lên"}
          </span>
        </div>
        {files[key] && (
          <button type="button" onClick={removeFile(key, ref)} style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center" }}>
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );

  const getCombinationSubjects = (combinationCode) => {
    switch (combinationCode) {
      case "A00":
        return [
          { field: "mathScore", label: "Điểm môn Toán" },
          { field: "physicsScore", label: "Điểm môn Vật lí" },
          { field: "chemistryScore", label: "Điểm môn Hóa học" },
        ];
      case "A01":
        return [
          { field: "mathScore", label: "Điểm môn Toán" },
          { field: "physicsScore", label: "Điểm môn Vật lí" },
          { field: "englishScore", label: "Điểm môn Tiếng Anh" },
        ];
      case "B00":
        return [
          { field: "mathScore", label: "Điểm môn Toán" },
          { field: "chemistryScore", label: "Điểm môn Hóa học" },
          { field: "biologyScore", label: "Điểm môn Sinh học" },
        ];
      case "C00":
        return [
          { field: "literatureScore", label: "Điểm môn Ngữ văn" },
          { field: "historyScore", label: "Điểm môn Lịch sử" },
          { field: "geographyScore", label: "Điểm môn Địa lí" },
        ];
      case "F01":
        return [
          { field: "mathScore", label: "Điểm môn Toán" },
          { field: "literatureScore", label: "Điểm môn Ngữ văn" },
          { field: "itScore", label: "Điểm môn Tin học" },
          { field: "technologyScore", label: "Điểm môn Công nghệ" },
        ];
      case "F02":
        return [
          { field: "mathScore", label: "Điểm môn Toán" },
          { field: "literatureScore", label: "Điểm môn Ngữ văn" },
          { field: "gdplScore", label: "Điểm môn GDPL" },
          { field: "historyScore", label: "Điểm môn Lịch sử" },
        ];
      case "F03":
        return [
          { field: "mathScore", label: "Điểm môn Toán" },
          { field: "literatureScore", label: "Điểm môn Ngữ văn" },
          { field: "physicsScore", label: "Điểm môn Vật lí" },
          { field: "itScore", label: "Điểm môn Tin học" },
        ];
      case "F05":
        return [
          { field: "mathScore", label: "Điểm môn Toán" },
          { field: "literatureScore", label: "Điểm môn Ngữ văn" },
          { field: "englishScore", label: "Điểm môn Tiếng Anh" },
          { field: "gdplScore", label: "Điểm môn GDPL" },
        ];
      case "D01":
      default:
        return [
          { field: "mathScore", label: "Điểm môn Toán" },
          { field: "literatureScore", label: "Điểm môn Ngữ văn" },
          { field: "englishScore", label: "Điểm môn Tiếng Anh" },
        ];
    }
  };

  const getCombinationTotal = () => {
    const code = form.combinationCode || "D01";
    const math = parseFloat(form.mathScore) || 0;
    const lit = parseFloat(form.literatureScore) || 0;
    const eng = parseFloat(form.englishScore) || 0;
    const phy = parseFloat(form.physicsScore) || 0;
    const chem = parseFloat(form.chemistryScore) || 0;
    const bio = parseFloat(form.biologyScore) || 0;
    const hist = parseFloat(form.historyScore) || 0;
    const geo = parseFloat(form.geographyScore) || 0;
    const gdpl = parseFloat(form.gdplScore) || 0;
    const it = parseFloat(form.itScore) || 0;
    const tech = parseFloat(form.technologyScore) || 0;

    switch (code) {
      case "A00": return (math + phy + chem).toFixed(2);
      case "A01": return (math + phy + eng).toFixed(2);
      case "B00": return (math + chem + bio).toFixed(2);
      case "C00": return (lit + geo + hist).toFixed(2);
      case "F01": return ((math + lit + it + tech) * 3 / 4).toFixed(2);
      case "F02": return ((math + lit + gdpl + hist) * 3 / 4).toFixed(2);
      case "F03": return ((math + lit + phy + it) * 3 / 4).toFixed(2);
      case "F05": return ((math + lit + eng + gdpl) * 3 / 4).toFixed(2);
      case "D01":
      default:
        return (math + lit + eng).toFixed(2);
    }
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
            <SearchableSelect
              id="province-select"
              options={provinces.map(p => ({ value: String(p.code || p.id), label: p.name }))}
              value={form.openApiProvinceCode ? String(form.openApiProvinceCode) : ""}
              placeholder="Tìm tỉnh/thành phố..."
              required
              onChange={(val) => {
                const selectedProv = provinces.find(p => String(p.code || p.id) === val);
                let matchedDbId = "";
                let provName = "";
                let provCodename = "";

                if (selectedProv) {
                  provName = selectedProv.name;
                  provCodename = selectedProv.codename || "";
                  const cleanName = selectedProv.name
                    .replace(/^Thành phố\s+/i, "")
                    .replace(/^Tỉnh\s+/i, "")
                    .trim()
                    .toLowerCase();

                  const dbMatch = dbProvinces.find(p => {
                    const dbClean = p.name
                      .replace(/^TP\.\s+/i, "")
                      .replace(/^Thành phố\s+/i, "")
                      .replace(/^Tỉnh\s+/i, "")
                      .trim()
                      .toLowerCase();
                    return dbClean === cleanName || cleanName.includes(dbClean) || dbClean.includes(cleanName);
                  });
                  if (dbMatch) matchedDbId = dbMatch.id;
                }

                setForm(prev => ({
                  ...prev,
                  openApiProvinceCode: val,
                  provinceId: matchedDbId,
                  schoolName: ""
                }));

                if (fetchSchools) fetchSchools(matchedDbId, provName, provCodename);
              }}
            />
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: "600" }}>Trường THPT <span style={{ color: "#EF4444" }}>(*)</span></label>
            {schoolsLoading ? (
              <div style={{ color: "#F97316", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", height: "42px" }}>
                <span style={{
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid #F97316",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite"
                }}></span>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                Đang tải danh sách trường...
              </div>
            ) : schools.length > 0 ? (
              <SearchableSelect
                id="school-select"
                options={schools.map(s => ({ value: s.name, label: s.name }))}
                value={form.schoolName || ""}
                placeholder="Tìm trường THPT..."
                required
                onChange={(val) => {
                  setForm(prev => ({ ...prev, schoolName: val }));
                }}
              />
            ) : (
              <input
                className="form-input"
                value={form.schoolName}
                onChange={update("schoolName")}
                placeholder="Nhập tên trường THPT..."
                required
                disabled={!form.openApiProvinceCode}
              />
            )}
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
            {/* GPA 10, 11, 12 — 3 cột */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              {[
                { field: "gpa10", label: "GPA Lớp 10" },
                { field: "gpa11", label: "GPA Lớp 11" },
                { field: "gpa12", label: "GPA Lớp 12" },
              ].map(({ field, label }) => (
                <div key={field} style={{ border: "1px solid #E2E8F0", borderRadius: "12px", padding: "16px", backgroundColor: "#F8FAFC" }}>
                  <label className="form-label" style={{ fontWeight: "600", fontSize: "13px" }}>
                    {label} <span style={{ color: "#EF4444" }}>(*)</span>
                  </label>
                  <input
                    type="number" step="0.01" min="0" max="10"
                    className="form-input"
                    value={form[field] || ""}
                    onChange={update(field)}
                    placeholder="VD: 8.25"
                    required
                    style={{ marginTop: "6px" }}
                  />
                  <span style={{ fontSize: "11px", color: "#64748B", marginTop: "4px", display: "block" }}>Thang điểm 10</span>
                </div>
              ))}
            </div>

            {/* Tổng điểm xét tuyển */}
            {(form.gpa10 || form.gpa11 || form.gpa12) && (
              <div style={{ padding: "14px 18px", background: "#FFF7F4", border: "1px solid #FFEDD5", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#C2410C" }}>Tổng điểm xét tuyển (GPA 10 + 11 + 12):</span>
                <span style={{ fontSize: "20px", fontWeight: "800", color: "#FF6B35" }}>
                  {((parseFloat(form.gpa10) || 0) + (parseFloat(form.gpa11) || 0) + (parseFloat(form.gpa12) || 0)).toFixed(2)}
                </span>
              </div>
            )}

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
            {renderUploadRow("gpa10File", "Upload minh chứng điểm trung bình lớp 10", gpa10FileRef)}
            {renderUploadRow("gpa11File", "Upload minh chứng điểm trung bình lớp 11", gpa11FileRef)}

            {/* File Upload lớp 12 */}
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
                  onChange={handleFileChange("hocBaFile", fileInputRef)}
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
                    onClick={removeFile("hocBaFile", fileInputRef)}
                    style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Add other files button */}
              <div style={{ alignSelf: "flex-start", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    backgroundColor: "#10B981", color: "white", border: "none",
                    borderRadius: "6px", padding: "6px 12px", fontSize: "13px",
                    fontWeight: "600", display: "flex", alignItems: "center",
                    gap: "6px", cursor: "pointer"
                  }}
                >
                  <Plus size={14} /> Thêm tập tin khác
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block 6: Nộp điểm thi THPT tốt nghiệp (Conditional) */}
      {showThptSection && (
        <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", margin: "0 0 20px 0" }}>
            Xét điểm thi tốt nghiệp THPT năm 2026
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Hộp chọn tổ hợp môn */}
            <div style={{ border: "1px solid #E2E8F0", borderRadius: "12px", padding: "16px", backgroundColor: "#F8FAFC" }}>
              <label className="form-label" style={{ fontWeight: "600", fontSize: "13px" }}>
                Tổ hợp môn đăng ký <span style={{ color: "#EF4444" }}>(*)</span>
              </label>
              <select
                className="form-select"
                value={form.combinationCode || "D01"}
                onChange={update("combinationCode")}
                required
                style={{ marginTop: "6px", width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
              >
                <option value="D01">D01: Toán, Ngữ văn, Tiếng Anh</option>
                <option value="A00">A00: Toán, Vật lí, Hóa học</option>
                <option value="A01">A01: Toán, Vật lí, Tiếng Anh</option>
                <option value="B00">B00: Toán, Hóa học, Sinh học</option>
                <option value="C00">C00: Ngữ văn, Lịch sử, Địa lí</option>
                <option value="F01">F01: Toán, Ngữ văn, Tin học, Công nghệ</option>
                <option value="F02">F02: Toán, Ngữ văn, GDPL, Lịch sử</option>
                <option value="F03">F03: Toán, Ngữ văn, Vật lí, Tin học</option>
                <option value="F05">F05: Toán, Ngữ văn, Tiếng Anh, GDPL</option>
              </select>
              <span style={{ fontSize: "11px", color: "#64748B", marginTop: "4px", display: "block" }}>
                Chọn tổ hợp môn thi phù hợp với 2 môn bắt buộc và 2 môn tự chọn của bạn.
              </span>
            </div>

            {/* Các ô nhập điểm động theo tổ hợp môn đã chọn */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
              {getCombinationSubjects(form.combinationCode || "D01").map(({ field, label }) => (
                <div key={field} style={{ border: "1px solid #E2E8F0", borderRadius: "12px", padding: "16px", backgroundColor: "#F8FAFC" }}>
                  <label className="form-label" style={{ fontWeight: "600", fontSize: "13px" }}>
                    {label} <span style={{ color: "#EF4444" }}>(*)</span>
                  </label>
                  <input
                    type="number" step="0.01" min="0" max="10"
                    className="form-input"
                    value={form[field] || ""}
                    onChange={update(field)}
                    placeholder="VD: 8.5"
                    required
                    style={{ marginTop: "6px", width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #CBD5E1" }}
                  />
                  <span style={{ fontSize: "11px", color: "#64748B", marginTop: "4px", display: "block" }}>Thang điểm 10</span>
                </div>
              ))}
            </div>

            {/* Tổng điểm tạm tính quy đổi */}
            <div style={{ padding: "14px 18px", background: "#FFF7F4", border: "1px solid #FFEDD5", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#C2410C" }}>
                Tổng điểm xét tuyển tạm tính (quy đổi về thang 30):
              </span>
              <span style={{ fontSize: "20px", fontWeight: "800", color: "#FF6B35" }}>
                {getCombinationTotal()}
              </span>
            </div>

            {/* Minh chứng điểm thi THPT */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B" }}>
                Upload Phiếu báo điểm thi tốt nghiệp THPT <span style={{ color: "#EF4444" }}>(*)</span>
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
                  onChange={handleFileChange("hocBaFile", fileInputRef)}
                  accept="image/*,application/pdf"
                  style={{ display: "none" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <FileText size={18} style={{ color: files.hocBaFile ? "#10B981" : "#FF6B35" }} />
                  <span style={{ fontSize: "14px", color: files.hocBaFile ? "#15803D" : "#475569", fontWeight: files.hocBaFile ? "600" : "400" }}>
                    {files.hocBaFile ? files.hocBaFile.name : "Chọn vào đây để tải ảnh chụp/PDF phiếu báo điểm lên"}
                  </span>
                </div>
                {files.hocBaFile && (
                  <button
                    type="button"
                    onClick={removeFile("hocBaFile", fileInputRef)}
                    style={{ background: "none", border: "none", color: "#EF4444", cursor: "pointer", display: "flex", alignItems: "center" }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
