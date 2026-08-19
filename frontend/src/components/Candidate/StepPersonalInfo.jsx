import React, { useState } from "react";
import {
  User, ShieldCheck, Sparkles, AlertCircle, Check, Camera,
  FileCheck, MapPin, Phone, Mail, Users, Home, AlertTriangle
} from "lucide-react";
import { PROVINCES_LIST } from "../../data/admissionRulesData";

export default function StepPersonalInfo({ application, setApplication, onSaveAndNext, onBack, showToast }) {
  const [ocrRunning, setOcrRunning] = useState(false);
  const [ocrResultModal, setOcrResultModal] = useState(null);
  const [errors, setErrors] = useState({});

  const p = application.personalInfo || {};

  const handleFieldChange = (field, value) => {
    setApplication(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Checkbox: "Địa chỉ hiện tại giống địa chỉ thường trú"
  const handleSameAddressToggle = (e) => {
    const isChecked = e.target.checked;
    setApplication(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        sameCurrentAddress: isChecked,
        currentProvince: isChecked ? prev.personalInfo.permanentProvince : "",
        currentDistrict: isChecked ? prev.personalInfo.permanentDistrict : "",
        currentWard: isChecked ? prev.personalInfo.permanentWard : "",
        currentAddress: isChecked ? prev.personalInfo.permanentAddress : ""
      }
    }));
  };

  // AI OCR Simulation for Citizen ID (CCCD)
  const triggerCccdOcr = () => {
    setOcrRunning(true);
    setTimeout(() => {
      setOcrRunning(false);
      setOcrResultModal({
        fullName: "NGUYỄN VĂN AN",
        citizenId: "001206019842",
        dob: "2006-08-15",
        gender: "Nam",
        nationality: "Việt Nam",
        permanentProvince: "Hà Nội",
        permanentDistrict: "Cầu Giấy",
        permanentWard: "Dịch Vọng Hậu",
        permanentAddress: "Số 8 Tôn Thất Thuyết",
        confidence: "99.4%"
      });
    }, 1400);
  };

  const applyOcrData = () => {
    if (!ocrResultModal) return;
    setApplication(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        fullName: "Nguyễn Văn An",
        citizenId: ocrResultModal.citizenId,
        dob: ocrResultModal.dob,
        gender: ocrResultModal.gender,
        nationality: ocrResultModal.nationality,
        permanentProvince: ocrResultModal.permanentProvince,
        permanentDistrict: ocrResultModal.permanentDistrict,
        permanentWard: ocrResultModal.permanentWard,
        permanentAddress: ocrResultModal.permanentAddress,
        currentProvince: ocrResultModal.permanentProvince,
        currentDistrict: ocrResultModal.permanentDistrict,
        currentWard: ocrResultModal.permanentWard,
        currentAddress: ocrResultModal.permanentAddress
      }
    }));
    setOcrResultModal(null);
    showToast("✅ AI OCR đã trích xuất và điền thông tin CCCD thành công!");
  };

  const validateAndProceed = () => {
    const errs = {};
    if (!p.fullName?.trim()) errs.fullName = "Vui lòng nhập họ và tên thí sinh.";
    if (!p.citizenId?.trim() || p.citizenId.length < 9) errs.citizenId = "Số CCCD/CMND không hợp lệ (tối thiểu 9-12 số).";
    if (!p.dob) errs.dob = "Vui lòng chọn ngày tháng năm sinh.";
    if (!p.phone?.trim() || p.phone.length < 10) errs.phone = "Số điện thoại phải từ 10 chữ số.";
    if (!p.email?.trim() || !p.email.includes("@")) errs.email = "Email không hợp lệ.";
    if (!p.permanentProvince) errs.permanentProvince = "Vui lòng chọn Tỉnh/Thành phố thường trú.";
    if (!p.permanentAddress?.trim()) errs.permanentAddress = "Vui lòng nhập địa chỉ chi tiết.";
    if (!p.fatherName?.trim() && !p.motherName?.trim()) errs.guardian = "Vui lòng khai báo thông tin Cha hoặc Mẹ/Người giám hộ.";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showToast("Vui lòng hoàn thiện các trường thông tin bắt buộc còn thiếu.", "error");
      return;
    }

    onSaveAndNext();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header Banner & OCR Tool */}
      <div style={{
        background: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
        borderRadius: 14, border: "1px solid #FED7AA", padding: "20px 24px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14
      }}>
        <div style={{ maxWidth: 640 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#EA580C", fontWeight: 800, fontSize: 12.5, marginBottom: 4 }}>
            <Sparkles size={16} /> AI OCR HỖ TRỢ TỰ ĐỘNG NHẬP LIỆU
          </div>
          <h3 style={{ fontSize: 17, fontWeight: 900, color: "#9A3412", margin: "0 0 4px" }}>
            Quét Căn cước công dân (CCCD / Chip Card)
          </h3>
          <p style={{ fontSize: 12.5, color: "#7C2D12", margin: 0, lineHeight: 1.4 }}>
            Tải ảnh mặt trước & mặt sau CCCD để AI tự động nhận diện và điền nhanh thông tin định danh, hạn chế sai sót.
          </p>
        </div>

        <button
          type="button"
          onClick={triggerCccdOcr}
          disabled={ocrRunning}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
            background: "#EA580C", color: "#FFFFFF", border: "none", borderRadius: 8,
            fontWeight: 800, fontSize: 13, cursor: ocrRunning ? "not-allowed" : "pointer",
            boxShadow: "0 4px 12px rgba(234,88,12,0.25)"
          }}
        >
          <Camera size={16} className={ocrRunning ? "animate-spin" : ""} />
          {ocrRunning ? "AI đang quét CCCD..." : "Quét CCCD bằng AI"}
        </button>
      </div>

      {/* SECTION 1: THÔNG TIN ĐỊNH DANH */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
          <User size={18} color="#EA580C" />
          <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            1. Thông Tin Định Danh Cá Nhân
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {/* Họ và tên */}
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Họ và tên thí sinh (theo CCCD) <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              value={p.fullName || ""}
              onChange={(e) => handleFieldChange("fullName", e.target.value)}
              placeholder="VD: NGUYỄN VĂN AN"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 8,
                border: errors.fullName ? "1.5px solid #EF4444" : "1px solid #CBD5E1",
                fontSize: 13, color: "#0F172A", fontWeight: 600, outline: "none"
              }}
            />
            {errors.fullName && <div style={{ fontSize: 11.5, color: "#DC2626", marginTop: 4 }}>{errors.fullName}</div>}
          </div>

          {/* Ngày sinh */}
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Ngày sinh <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="date"
              value={p.dob || ""}
              onChange={(e) => handleFieldChange("dob", e.target.value)}
              style={{
                width: "100%", padding: "9px 14px", borderRadius: 8,
                border: errors.dob ? "1.5px solid #EF4444" : "1px solid #CBD5E1",
                fontSize: 13, color: "#0F172A", fontWeight: 600, outline: "none"
              }}
            />
            {errors.dob && <div style={{ fontSize: 11.5, color: "#DC2626", marginTop: 4 }}>{errors.dob}</div>}
          </div>

          {/* Giới tính */}
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Giới tính <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <select
              value={p.gender || "Nam"}
              onChange={(e) => handleFieldChange("gender", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600, background: "#FFF" }}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Quốc tịch */}
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Quốc tịch
            </label>
            <input
              type="text"
              value={p.nationality || "Việt Nam"}
              onChange={(e) => handleFieldChange("nationality", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600 }}
            />
          </div>

          {/* Dân tộc */}
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Dân tộc
            </label>
            <input
              type="text"
              value={p.ethnic || "Kinh"}
              onChange={(e) => handleFieldChange("ethnic", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600 }}
            />
          </div>

          {/* Số CCCD */}
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Số CCCD / CMND / Hộ chiếu <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              value={p.citizenId || ""}
              onChange={(e) => handleFieldChange("citizenId", e.target.value)}
              placeholder="VD: 001206019842"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 8,
                border: errors.citizenId ? "1.5px solid #EF4444" : "1px solid #CBD5E1",
                fontSize: 13, color: "#0F172A", fontWeight: 600
              }}
            />
            {errors.citizenId && <div style={{ fontSize: 11.5, color: "#DC2626", marginTop: 4 }}>{errors.citizenId}</div>}
          </div>

          {/* Ngày cấp */}
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Ngày cấp
            </label>
            <input
              type="date"
              value={p.citizenIssueDate || ""}
              onChange={(e) => handleFieldChange("citizenIssueDate", e.target.value)}
              style={{ width: "100%", padding: "9px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600 }}
            />
          </div>

          {/* Nơi cấp */}
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Nơi cấp
            </label>
            <input
              type="text"
              value={p.citizenIssuePlace || "Cục Cảnh sát QLHC về TTXH"}
              onChange={(e) => handleFieldChange("citizenIssuePlace", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600 }}
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: THÔNG TIN LIÊN HỆ & ĐỊA CHỈ */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
          <MapPin size={18} color="#EA580C" />
          <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            2. Thông Tin Liên Hệ & Địa Chỉ Cư Trú
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Số điện thoại thí sinh <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="tel"
              value={p.phone || ""}
              onChange={(e) => handleFieldChange("phone", e.target.value)}
              placeholder="VD: 0912345678"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 8,
                border: errors.phone ? "1.5px solid #EF4444" : "1px solid #CBD5E1",
                fontSize: 13, color: "#0F172A", fontWeight: 600
              }}
            />
            {errors.phone && <div style={{ fontSize: 11.5, color: "#DC2626", marginTop: 4 }}>{errors.phone}</div>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Email thí sinh <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="email"
              value={p.email || ""}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              placeholder="VD: thi_sinh@gmail.com"
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 8,
                border: errors.email ? "1.5px solid #EF4444" : "1px solid #CBD5E1",
                fontSize: 13, color: "#0F172A", fontWeight: 600
              }}
            />
            {errors.email && <div style={{ fontSize: 11.5, color: "#DC2626", marginTop: 4 }}>{errors.email}</div>}
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              SĐT dự phòng (nếu có)
            </label>
            <input
              type="tel"
              value={p.backupPhone || ""}
              onChange={(e) => handleFieldChange("backupPhone", e.target.value)}
              placeholder="VD: 0987654321"
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600 }}
            />
          </div>
        </div>

        {/* Địa chỉ Thường Trú */}
        <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "16px", border: "1px solid #E2E8F0", marginBottom: 16 }}>
          <strong style={{ fontSize: 13, color: "#0F172A", display: "block", marginBottom: 12 }}>
            🏠 Địa chỉ thường trú (theo hộ khẩu / CCCD)
          </strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Tỉnh / Thành phố <span style={{ color: "#DC2626" }}>*</span>
              </label>
              <select
                value={p.permanentProvince || ""}
                onChange={(e) => handleFieldChange("permanentProvince", e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, background: "#FFF", fontWeight: 600 }}
              >
                <option value="">-- Chọn Tỉnh/Thành --</option>
                {PROVINCES_LIST.map(pr => <option key={pr} value={pr}>{pr}</option>)}
              </select>
              {errors.permanentProvince && <div style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>{errors.permanentProvince}</div>}
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Quận / Huyện
              </label>
              <input
                type="text"
                value={p.permanentDistrict || ""}
                onChange={(e) => handleFieldChange("permanentDistrict", e.target.value)}
                placeholder="VD: Cầu Giấy"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
                Phường / Xã
              </label>
              <input
                type="text"
                value={p.permanentWard || ""}
                onChange={(e) => handleFieldChange("permanentWard", e.target.value)}
                placeholder="VD: Dịch Vọng Hậu"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>
              Địa chỉ chi tiết (Số nhà, tên đường, thôn/xóm) <span style={{ color: "#DC2626" }}>*</span>
            </label>
            <input
              type="text"
              value={p.permanentAddress || ""}
              onChange={(e) => handleFieldChange("permanentAddress", e.target.value)}
              placeholder="VD: Số 8 Tôn Thất Thuyết"
              style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
            />
            {errors.permanentAddress && <div style={{ fontSize: 11, color: "#DC2626", marginTop: 2 }}>{errors.permanentAddress}</div>}
          </div>
        </div>

        {/* Checkbox sao chép địa chỉ */}
        <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#334155", cursor: "pointer", marginBottom: 16 }}>
          <input
            type="checkbox"
            checked={p.sameCurrentAddress || false}
            onChange={handleSameAddressToggle}
            style={{ width: 16, height: 16, accentColor: "#EA580C" }}
          />
          Địa chỉ hiện tại giống địa chỉ thường trú
        </label>

        {/* Địa chỉ Hiện tại (nếu khác thường trú) */}
        {!p.sameCurrentAddress && (
          <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "16px", border: "1px solid #E2E8F0" }}>
            <strong style={{ fontSize: 13, color: "#0F172A", display: "block", marginBottom: 12 }}>
              📍 Địa chỉ liên lạc hiện tại (nơi nhận giấy báo nhập học)
            </strong>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Tỉnh / Thành</label>
                <select
                  value={p.currentProvince || ""}
                  onChange={(e) => handleFieldChange("currentProvince", e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, background: "#FFF", fontWeight: 600 }}
                >
                  <option value="">-- Chọn Tỉnh/Thành --</option>
                  {PROVINCES_LIST.map(pr => <option key={pr} value={pr}>{pr}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Quận / Huyện</label>
                <input
                  type="text"
                  value={p.currentDistrict || ""}
                  onChange={(e) => handleFieldChange("currentDistrict", e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Phường / Xã</label>
                <input
                  type="text"
                  value={p.currentWard || ""}
                  onChange={(e) => handleFieldChange("currentWard", e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Địa chỉ chi tiết</label>
              <input
                type="text"
                value={p.currentAddress || ""}
                onChange={(e) => handleFieldChange("currentAddress", e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: THÔNG TIN GIA ĐÌNH / NGƯỜI GIÁM HỘ */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
          <Users size={18} color="#EA580C" />
          <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            3. Thông Tin Gia Đình / Người Giám Hộ
          </h2>
        </div>

        {errors.guardian && <div style={{ fontSize: 12.5, color: "#DC2626", background: "#FEF2F2", padding: "8px 12px", borderRadius: 6, marginBottom: 14 }}>{errors.guardian}</div>}

        {/* Thông tin Cha */}
        <div style={{ marginBottom: 18 }}>
          <strong style={{ fontSize: 13, color: "#0F172A", display: "block", marginBottom: 10 }}>👨 Thông tin Cha:</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <div style={{ gridColumn: "span 1" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Họ và tên Cha</label>
              <input
                type="text"
                value={p.fatherName || ""}
                onChange={(e) => handleFieldChange("fatherName", e.target.value)}
                placeholder="VD: Nguyễn Văn Hùng"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Số điện thoại Cha</label>
              <input
                type="tel"
                value={p.fatherPhone || ""}
                onChange={(e) => handleFieldChange("fatherPhone", e.target.value)}
                placeholder="0912..."
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Email Cha</label>
              <input
                type="email"
                value={p.fatherEmail || ""}
                onChange={(e) => handleFieldChange("fatherEmail", e.target.value)}
                placeholder="hung.nv@gmail.com"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Nghề nghiệp</label>
              <input
                type="text"
                value={p.fatherJob || ""}
                onChange={(e) => handleFieldChange("fatherJob", e.target.value)}
                placeholder="VD: Kỹ sư"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
              />
            </div>
          </div>
        </div>

        {/* Thông tin Mẹ */}
        <div style={{ marginBottom: 18 }}>
          <strong style={{ fontSize: 13, color: "#0F172A", display: "block", marginBottom: 10 }}>👩 Thông tin Mẹ:</strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <div style={{ gridColumn: "span 1" }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Họ và tên Mẹ</label>
              <input
                type="text"
                value={p.motherName || ""}
                onChange={(e) => handleFieldChange("motherName", e.target.value)}
                placeholder="VD: Trần Thị Mai"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Số điện thoại Mẹ</label>
              <input
                type="tel"
                value={p.motherPhone || ""}
                onChange={(e) => handleFieldChange("motherPhone", e.target.value)}
                placeholder="0912..."
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Email Mẹ</label>
              <input
                type="email"
                value={p.motherEmail || ""}
                onChange={(e) => handleFieldChange("motherEmail", e.target.value)}
                placeholder="mai.tt@gmail.com"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Nghề nghiệp</label>
              <input
                type="text"
                value={p.motherJob || ""}
                onChange={(e) => handleFieldChange("motherJob", e.target.value)}
                placeholder="VD: Giáo viên"
                style={{ width: "100%", padding: "9px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
              />
            </div>
          </div>
        </div>

        {/* Người liên hệ khẩn cấp */}
        <div style={{ background: "#FEF2F2", borderRadius: 8, padding: "14px 16px", border: "1px solid #FEE2E2" }}>
          <strong style={{ fontSize: 13, color: "#991B1B", display: "block", marginBottom: 8 }}>
            🚨 Người liên hệ khẩn cấp:
          </strong>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7F1D1D", marginBottom: 4 }}>Họ tên người liên hệ</label>
              <input
                type="text"
                value={p.emergencyContactName || ""}
                onChange={(e) => handleFieldChange("emergencyContactName", e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #FCA5A5", fontSize: 12.5, background: "#FFF", fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7F1D1D", marginBottom: 4 }}>Mối quan hệ</label>
              <input
                type="text"
                value={p.emergencyContactRelation || "Bố"}
                onChange={(e) => handleFieldChange("emergencyContactRelation", e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #FCA5A5", fontSize: 12.5, background: "#FFF", fontWeight: 600 }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#7F1D1D", marginBottom: 4 }}>Số điện thoại khẩn cấp</label>
              <input
                type="tel"
                value={p.emergencyContactPhone || ""}
                onChange={(e) => handleFieldChange("emergencyContactPhone", e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #FCA5A5", fontSize: 12.5, background: "#FFF", fontWeight: 600 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 14 }}>
        <button
          type="button"
          onClick={validateAndProceed}
          style={{
            padding: "11px 26px", borderRadius: 8, background: "#EA580C",
            color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 13.5,
            cursor: "pointer", boxShadow: "0 4px 14px rgba(234,88,12,0.3)"
          }}
        >
          Lưu & Tiếp Tục Sang Bước 2 →
        </button>
      </div>

      {/* OCR Preview Confirmation Modal */}
      {ocrResultModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex",
          alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{
            background: "#FFFFFF", borderRadius: 16, maxWidth: 540, width: "100%",
            padding: "24px 28px", boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                  AI Đã Nhận Diện Thông Tin CCCD
                </h3>
                <span style={{ fontSize: 12, color: "#16A34A", fontWeight: 700 }}>
                  Độ chính xác nhận diện: {ocrResultModal.confidence}
                </span>
              </div>
            </div>

            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "14px 18px", border: "1px solid #E2E8F0", fontSize: 12.5, display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <div><strong>Họ và tên:</strong> {ocrResultModal.fullName}</div>
              <div><strong>Số CCCD:</strong> {ocrResultModal.citizenId}</div>
              <div><strong>Ngày sinh:</strong> {ocrResultModal.dob} • Giới tính: {ocrResultModal.gender}</div>
              <div><strong>Địa chỉ thường trú:</strong> {ocrResultModal.permanentAddress}, {ocrResultModal.permanentWard}, {ocrResultModal.permanentDistrict}, {ocrResultModal.permanentProvince}</div>
            </div>

            <p style={{ fontSize: 12, color: "#64748B", margin: "0 0 18px" }}>
              ⚠️ Vui lòng kiểm tra lại thông tin trên trước khi xác nhận để áp dụng vào hồ sơ tuyển sinh.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setOcrResultModal(null)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={applyOcrData}
                style={{ padding: "8px 20px", borderRadius: 6, background: "#16A34A", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Xác Nhận & Áp Dụng Dữ Liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
