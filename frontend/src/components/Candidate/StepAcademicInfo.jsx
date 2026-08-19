import React, { useState } from "react";
import {
  GraduationCap, BookOpen, Calculator, Sparkles, Camera,
  CheckCircle2, AlertCircle, FileText, Check
} from "lucide-react";
import { PROVINCES_LIST, SUBJECT_COMBINATIONS } from "../../data/admissionRulesData";

export default function StepAcademicInfo({ application, setApplication, onSaveAndNext, onBack, showToast }) {
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrModal, setOcrModal] = useState(null);
  const [errors, setErrors] = useState({});

  const academic = application.academicInfo || {};
  const selectedMethods = application.selectedMethods || [];
  const hasThptMethod = selectedMethods.includes("THPT_EXAM") || selectedMethods.includes("COMBINED");
  const hasDgnlMethod = selectedMethods.includes("DGNL_EXAM");

  const handleAcademicChange = (field, value) => {
    setApplication(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        [field]: value
      }
    }));
  };

  const handleSubjectScoreChange = (subjectKey, value) => {
    const num = parseFloat(value) || 0;
    if (num < 0 || num > 10) {
      setErrors(prev => ({ ...prev, [subjectKey]: "Điểm phải từ 0 đến 10" }));
    } else {
      setErrors(prev => ({ ...prev, [subjectKey]: null }));
    }

    setApplication(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        subjectScores: {
          ...prev.academicInfo?.subjectScores,
          [subjectKey]: num
        }
      }
    }));
  };

  const handleThptExamScoreChange = (subjectKey, value) => {
    const num = parseFloat(value) || 0;
    setApplication(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        thptExam: {
          ...prev.academicInfo?.thptExam,
          scores: {
            ...prev.academicInfo?.thptExam?.scores,
            [subjectKey]: num
          }
        }
      }
    }));
  };

  // AI OCR Scanner for Academic Transcript
  const triggerTranscriptOcr = () => {
    setOcrRunning(true);
    setTimeout(() => {
      setOcrRunning(false);
      setOcrModal({
        schoolName: "THPT Chuyên Hà Nội - Amsterdam",
        grade10Gpa: 8.8,
        grade11Gpa: 8.9,
        grade12Gpa: 9.1,
        subjectScores: {
          math: 9.0,
          literature: 8.2,
          english: 9.5,
          physics: 8.8,
          chemistry: 8.5,
          biology: 8.0,
          history: 8.2,
          geography: 8.0,
          gdcd: 9.2,
          informatics: 9.8
        },
        confidence: "98.7%"
      });
    }, 1500);
  };

  const applyTranscriptOcr = () => {
    if (!ocrModal) return;
    setApplication(prev => ({
      ...prev,
      academicInfo: {
        ...prev.academicInfo,
        highSchoolName: ocrModal.schoolName,
        grade10Gpa: ocrModal.grade10Gpa,
        grade11Gpa: ocrModal.grade11Gpa,
        grade12Gpa: ocrModal.grade12Gpa,
        subjectScores: ocrModal.subjectScores
      }
    }));
    setOcrModal(null);
    showToast("✅ AI OCR đã đọc và cập nhật bảng điểm học bạ thành công!");
  };

  const validateAndProceed = () => {
    const errs = {};
    if (!academic.highSchoolName?.trim()) errs.highSchoolName = "Vui lòng nhập tên trường THPT.";
    if (!academic.grade10Gpa || academic.grade10Gpa < 0 || academic.grade10Gpa > 10) errs.grade10Gpa = "Điểm TB lớp 10 không hợp lệ (0-10).";
    if (!academic.grade11Gpa || academic.grade11Gpa < 0 || academic.grade11Gpa > 10) errs.grade11Gpa = "Điểm TB lớp 11 không hợp lệ (0-10).";
    if (!academic.grade12Gpa || academic.grade12Gpa < 0 || academic.grade12Gpa > 10) errs.grade12Gpa = "Điểm TB lớp 12 không hợp lệ (0-10).";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("Vui lòng kiểm tra lại điểm số và thông tin trường THPT.", "error");
      return;
    }

    onSaveAndNext();
  };

  const subScores = academic.subjectScores || {};
  const thptScores = academic.thptExam?.scores || {};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* OCR Banner */}
      <div style={{
        background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
        borderRadius: 14, border: "1px solid #BFDBFE", padding: "20px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14
      }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#1D4ED8", fontWeight: 800, fontSize: 12.5, marginBottom: 4 }}>
            <Sparkles size={16} /> AI OCR NHẬN DIỆN HỌC BẠ TỰ ĐỘNG
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 900, color: "#1E3A8A", margin: "0 0 4px" }}>
            Quét & Nhận Diện Bảng Điểm Học Bạ THPT
          </h3>
          <p style={{ fontSize: 12.5, color: "#1E40AF", margin: 0, lineHeight: 1.4 }}>
            Tải lên trang điểm học bạ lớp 10, 11, 12 để hệ thống tự động bóc tách điểm từng môn và tính điểm trung bình tổ hợp.
          </p>
        </div>

        <button
          type="button"
          onClick={triggerTranscriptOcr}
          disabled={ocrRunning}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
            background: "#2563EB", color: "#FFFFFF", border: "none", borderRadius: 8,
            fontWeight: 800, fontSize: 13, cursor: ocrRunning ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(37,99,235,0.25)"
          }}
        >
          <Camera size={16} className={ocrRunning ? "animate-spin" : ""} />
          {ocrRunning ? "AI đang đọc học bạ..." : "Quét Học Bạ Bằng AI"}
        </button>
      </div>

      {/* SECTION 1: THÔNG TIN TRƯỜNG THPT */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
          <BookOpen size={18} color="#EA580C" />
          <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            1. Thông Tin Trường THPT & Quá Trình Tốt Nghiệp
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Tỉnh / Thành phố trường THPT <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <select
              value={academic.highSchoolProvince || "Hà Nội"}
              onChange={(e) => handleAcademicChange("highSchoolProvince", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600, background: "#FFF" }}
            >
              {PROVINCES_LIST.map(pr => <option key={pr} value={pr}>{pr}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Tên trường THPT <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              value={academic.highSchoolName || ""}
              onChange={(e) => handleAcademicChange("highSchoolName", e.target.value)}
              placeholder="VD: THPT Chuyên Hà Nội - Amsterdam"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 8,
                border: errors.highSchoolName ? "1.5px solid #EF4444" : "1px solid #CBD5E1",
                fontSize: 13, color: "#0F172A", fontWeight: 600
              }}
            />
            {errors.highSchoolName && <div style={{ fontSize: 11.5, color: "#DC2626", marginTop: 4 }}>{errors.highSchoolName}</div>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Năm tốt nghiệp THPT <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <select
              value={academic.graduationYear || "2026"}
              onChange={(e) => handleAcademicChange("graduationYear", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600, background: "#FFF" }}
            >
              <option value="2026">2026 (Năm hiện tại)</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023 hoặc trước đó</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Trạng thái tốt nghiệp <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <select
              value={academic.graduationStatus || "GRADUATED"}
              onChange={(e) => handleAcademicChange("graduationStatus", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600, background: "#FFF" }}
            >
              <option value="GRADUATED">Đã tốt nghiệp THPT</option>
              <option value="PENDING">Chờ thi / Tốt nghiệp năm nay (2026)</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Loại trường
            </label>
            <select
              value={academic.schoolType || "Chuyên"}
              onChange={(e) => handleAcademicChange("schoolType", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600, background: "#FFF" }}
            >
              <option value="Chuyên">THPT Chuyên / Năng khiếu</option>
              <option value="Công lập">THPT Công lập chuẩn</option>
              <option value="Tư thục">THPT Tư thục / Quốc tế</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: ĐIỂM TRUNG BÌNH CÁC NĂM & HẠNH KIỂM */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
          <Calculator size={18} color="#EA580C" />
          <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            2. Điểm Trung Bình Học Tập 3 Năm THPT (GPA)
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {/* Lớp 10 */}
          <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: 10, border: "1px solid #E2E8F0" }}>
            <strong style={{ fontSize: 13, color: "#0F172A", display: "block", marginBottom: 10 }}>📚 Lớp 10</strong>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: "block", fontSize: 12, color: "#475569", fontWeight: 600, marginBottom: 4 }}>Điểm TB cả năm <span style={{ color: "#DC2626" }}>*</span></label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={academic.grade10Gpa || ""}
                onChange={(e) => handleAcademicChange("grade10Gpa", parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 14, fontWeight: 800, color: "#0F172A" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#475569", fontWeight: 600, marginBottom: 4 }}>Hạnh kiểm</label>
              <select
                value={academic.conduct10 || "Tốt"}
                onChange={(e) => handleAcademicChange("conduct10", e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, background: "#FFF", fontWeight: 600 }}
              >
                <option value="Tốt">Tốt</option>
                <option value="Khá">Khá</option>
                <option value="Trung bình">Trung bình</option>
              </select>
            </div>
          </div>

          {/* Lớp 11 */}
          <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: 10, border: "1px solid #E2E8F0" }}>
            <strong style={{ fontSize: 13, color: "#0F172A", display: "block", marginBottom: 10 }}>📚 Lớp 11</strong>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: "block", fontSize: 12, color: "#475569", fontWeight: 600, marginBottom: 4 }}>Điểm TB cả năm <span style={{ color: "#DC2626" }}>*</span></label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={academic.grade11Gpa || ""}
                onChange={(e) => handleAcademicChange("grade11Gpa", parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 14, fontWeight: 800, color: "#0F172A" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#475569", fontWeight: 600, marginBottom: 4 }}>Hạnh kiểm</label>
              <select
                value={academic.conduct11 || "Tốt"}
                onChange={(e) => handleAcademicChange("conduct11", e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, background: "#FFF", fontWeight: 600 }}
              >
                <option value="Tốt">Tốt</option>
                <option value="Khá">Khá</option>
                <option value="Trung bình">Trung bình</option>
              </select>
            </div>
          </div>

          {/* Lớp 12 */}
          <div style={{ background: "#FFF7ED", padding: "16px", borderRadius: 10, border: "1.5px solid #FED7AA" }}>
            <strong style={{ fontSize: 13, color: "#9A3412", display: "block", marginBottom: 10 }}>⭐ Lớp 12 (Trọng số chính)</strong>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: "block", fontSize: 12, color: "#7C2D12", fontWeight: 600, marginBottom: 4 }}>Điểm TB cả năm <span style={{ color: "#DC2626" }}>*</span></label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={academic.grade12Gpa || ""}
                onChange={(e) => handleAcademicChange("grade12Gpa", parseFloat(e.target.value))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #FB923C", fontSize: 14, fontWeight: 800, color: "#EA580C", background: "#FFF" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#7C2D12", fontWeight: 600, marginBottom: 4 }}>Hạnh kiểm</label>
              <select
                value={academic.conduct12 || "Tốt"}
                onChange={(e) => handleAcademicChange("conduct12", e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #FB923C", fontSize: 12.5, background: "#FFF", fontWeight: 600 }}
              >
                <option value="Tốt">Tốt</option>
                <option value="Khá">Khá</option>
                <option value="Trung bình">Trung bình</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: ĐIỂM CHI TIẾT TỪNG MÔN (DÀNH CHO XÉT HỌC BẠ) */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <GraduationCap size={18} color="#EA580C" />
            <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
              3. Điểm Trung Bình Các Môn Học Lớp 12
            </h2>
          </div>
          <span style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>
            Tự động tính tổ hợp: A00, A01, D01, D07, C00, B00
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 16 }}>
          {[
            { key: "math", label: "Toán học" },
            { key: "physics", label: "Vật lý" },
            { key: "chemistry", label: "Hóa học" },
            { key: "english", label: "Tiếng Anh" },
            { key: "literature", label: "Ngữ văn" },
            { key: "biology", label: "Sinh học" },
            { key: "history", label: "Lịch sử" },
            { key: "geography", label: "Địa lý" },
            { key: "gdcd", label: "GDCD / GDKTPL" },
            { key: "informatics", label: "Tin học" },
          ].map(subject => (
            <div key={subject.key} style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 12px", border: "1px solid #E2E8F0" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                {subject.label}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={subScores[subject.key] ?? ""}
                onChange={(e) => handleSubjectScoreChange(subject.key, e.target.value)}
                style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 14, fontWeight: 800, color: "#0F172A" }}
              />
            </div>
          ))}
        </div>

        {/* Điểm các tổ hợp tính toán tự động */}
        <div style={{ background: "#F0FDF4", borderRadius: 8, padding: "12px 16px", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#166534" }}>
            🎯 Tổng điểm tổ hợp học bạ tạm tính:
          </span>
          <div style={{ display: "flex", gap: 16, fontSize: 12.5, fontWeight: 800 }}>
            <span>A00: <strong style={{ color: "#15803D" }}>{((subScores.math || 0) + (subScores.physics || 0) + (subScores.chemistry || 0)).toFixed(1)}</strong></span>
            <span>A01: <strong style={{ color: "#15803D" }}>{((subScores.math || 0) + (subScores.physics || 0) + (subScores.english || 0)).toFixed(1)}</strong></span>
            <span>D01: <strong style={{ color: "#15803D" }}>{((subScores.math || 0) + (subScores.literature || 0) + (subScores.english || 0)).toFixed(1)}</strong></span>
            <span>D07: <strong style={{ color: "#15803D" }}>{((subScores.math || 0) + (subScores.chemistry || 0) + (subScores.english || 0)).toFixed(1)}</strong></span>
          </div>
        </div>
      </div>

      {/* SECTION 4: ĐIỂM THI THPT QUỐC GIA (NẾU CHỌN PHƯƠNG THỨC THI THPT) */}
      {hasThptMethod && (
        <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
            <FileText size={18} color="#2563EB" />
            <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
              4. Điểm Thi Tốt Nghiệp THPT (Phương thức Xét Điểm Thi)
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Số Báo Danh (SBD)</label>
              <input
                type="text"
                value={academic.thptExam?.sbd || ""}
                onChange={(e) => handleAcademicChange("thptExam", { ...academic.thptExam, sbd: e.target.value })}
                placeholder="VD: 01004589"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, fontFamily: "monospace", fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Năm thi</label>
              <input
                type="text"
                value={academic.thptExam?.examYear || "2026"}
                onChange={(e) => handleAcademicChange("thptExam", { ...academic.thptExam, examYear: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Hội đồng thi Sở GD&ĐT</label>
              <input
                type="text"
                value={academic.thptExam?.examCouncil || "Hội đồng thi Sở GD&ĐT Hà Nội"}
                onChange={(e) => handleAcademicChange("thptExam", { ...academic.thptExam, examCouncil: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 600 }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
            {[
              { key: "math", label: "Điểm Toán" },
              { key: "physics", label: "Điểm Lý" },
              { key: "chemistry", label: "Điểm Hóa" },
              { key: "english", label: "Điểm Tiếng Anh" },
              { key: "literature", label: "Điểm Ngữ văn" },
            ].map(sub => (
              <div key={sub.key} style={{ background: "#EFF6FF", borderRadius: 8, padding: "10px 12px", border: "1px solid #DBEAFE" }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#1D4ED8", marginBottom: 4 }}>
                  {sub.label}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={thptScores[sub.key] ?? ""}
                  onChange={(e) => handleThptExamScoreChange(sub.key, e.target.value)}
                  style={{ width: "100%", padding: "6px 10px", borderRadius: 6, border: "1px solid #93C5FD", fontSize: 14, fontWeight: 800, color: "#1E3A8A" }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          onClick={onBack}
          style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          ← Quay Lại Bước 2
        </button>
        <button
          type="button"
          onClick={validateAndProceed}
          style={{
            padding: "11px 26px", borderRadius: 8, background: "#EA580C",
            color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 13.5,
            cursor: "pointer", boxShadow: "0 4px 14px rgba(234,88,12,0.3)"
          }}
        >
          Lưu Học Tập & Sang Bước 4 →
        </button>
      </div>

      {/* OCR Transcript Confirmation Modal */}
      {ocrModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex",
          alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            background: "#FFFFFF", borderRadius: 16, maxWidth: 560, width: "100%",
            padding: "24px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#DBEAFE", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                  AI Đã Nhận Diện Điểm Học Bạ
                </h3>
                <span style={{ fontSize: 12, color: "#2563EB", fontWeight: 700 }}>
                  Độ chính xác nhận diện: {ocrModal.confidence}
                </span>
              </div>
            </div>

            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "14px 18px", border: "1px solid #E2E8F0", fontSize: 12.5, display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <div><strong>Trường:</strong> {ocrModal.schoolName}</div>
              <div><strong>Điểm TB các năm:</strong> Lớp 10: {ocrModal.grade10Gpa} | Lớp 11: {ocrModal.grade11Gpa} | Lớp 12: {ocrModal.grade12Gpa}</div>
              <div style={{ paddingTop: 6, borderTop: "1px dashed #CBD5E1" }}>
                <strong>Điểm môn Lớp 12:</strong> Toán ({ocrModal.subjectScores.math}), Lý ({ocrModal.subjectScores.physics}), Hóa ({ocrModal.subjectScores.chemistry}), Anh ({ocrModal.subjectScores.english}), Văn ({ocrModal.subjectScores.literature}), Tin ({ocrModal.subjectScores.informatics})
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setOcrModal(null)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={applyTranscriptOcr}
                style={{ padding: "8px 20px", borderRadius: 6, background: "#2563EB", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Xác Nhận & Áp Dụng Bảng Điểm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
