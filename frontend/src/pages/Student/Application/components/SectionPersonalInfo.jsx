import React from "react";
import { User } from "lucide-react";
import LOCATION_DATA from "../../../../data/locationData";

export default function SectionPersonalInfo({
  form, update, provinces, schools, setForm,
  selectedDistrict, setSelectedDistrict, customDistrict, setCustomDistrict,
  selectedWard, setSelectedWard, customWard, setCustomWard,
  streetAddress, setStreetAddress, permanentAddress
}) {
  return (
    <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
      <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#FF6B35", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px", marginBottom: "20px" }}>
        <User size={18} /> 1. Thông tin cá nhân & Địa chỉ thường trú
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ gridColumn: "span 2" }}>
          <label className="form-label">Họ và tên *</label>
          <input className="form-input" value={form.fullName} onChange={update("fullName")} placeholder="Nguyễn Văn A" required />
        </div>
        <div>
          <label className="form-label">Ngày sinh *</label>
          <input type="date" className="form-input" value={form.dob} onChange={update("dob")} required />
        </div>
        <div>
          <label className="form-label">Giới tính</label>
          <select className="form-select" value={form.gender} onChange={update("gender")}>
            <option value="MALE">Nam</option>
            <option value="FEMALE">Nữ</option>
            <option value="OTHER">Khác</option>
          </select>
        </div>
        <div>
          <label className="form-label">Số điện thoại *</label>
          <input className="form-input" value={form.phone} onChange={update("phone")} placeholder="0901234567" required />
        </div>
        <div>
          <label className="form-label">Số CCCD *</label>
          <input className="form-input" value={form.cccd} onChange={update("cccd")} placeholder="012345678901" required />
        </div>
        <div>
          <label className="form-label">Tỉnh/Thành phố *</label>
          <select className="form-select" value={form.provinceId} onChange={(e) => {
            setForm({ ...form, provinceId: e.target.value, schoolName: "" });
            setSelectedDistrict("");
            setCustomDistrict("");
            setSelectedWard("");
            setCustomWard("");
          }} required>
            <option value="">-- Chọn Tỉnh/Thành --</option>
            {provinces.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Quận/Huyện *</label>
          {LOCATION_DATA[form.provinceId] ? (
            selectedDistrict === "OTHER" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <input className="form-input" value={customDistrict} onChange={(e) => setCustomDistrict(e.target.value)} placeholder="Nhập Quận/Huyện..." required />
                <button type="button" onClick={() => { setSelectedDistrict(""); setCustomDistrict(""); }}
                  style={{ fontSize: "11px", color: "#FF6B35", background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start", padding: "0" }}>
                  ← Quay lại chọn danh sách
                </button>
              </div>
            ) : (
              <select className="form-select" value={selectedDistrict} onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setCustomDistrict("");
                setSelectedWard("");
                setCustomWard("");
              }} required>
                <option value="">-- Chọn Quận/Huyện --</option>
                {Object.keys(LOCATION_DATA[form.provinceId].districts).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
                <option value="OTHER">-- Khác (Tự nhập) --</option>
              </select>
            )
          ) : (
            <input className="form-input" value={customDistrict} onChange={(e) => setCustomDistrict(e.target.value)}
              placeholder="Nhập Quận/Huyện..." required disabled={!form.provinceId} />
          )}
        </div>
        <div>
          <label className="form-label">Xã/Phường *</label>
          {LOCATION_DATA[form.provinceId] && selectedDistrict && selectedDistrict !== "OTHER" ? (
            selectedWard === "OTHER" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <input className="form-input" value={customWard} onChange={(e) => setCustomWard(e.target.value)} placeholder="Nhập Xã/Phường..." required />
                <button type="button" onClick={() => { setSelectedWard(""); setCustomWard(""); }}
                  style={{ fontSize: "11px", color: "#FF6B35", background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start", padding: "0" }}>
                  ← Quay lại chọn danh sách
                </button>
              </div>
            ) : (
              <select className="form-select" value={selectedWard} onChange={(e) => {
                setSelectedWard(e.target.value);
                setCustomWard("");
              }} required>
                <option value="">-- Chọn Xã/Phường --</option>
                {LOCATION_DATA[form.provinceId].districts[selectedDistrict]?.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
                <option value="OTHER">-- Khác (Tự nhập) --</option>
              </select>
            )
          ) : (
            <input className="form-input" value={customWard} onChange={(e) => setCustomWard(e.target.value)}
              placeholder="Nhập Xã/Phường..." required disabled={!form.provinceId || (!selectedDistrict && !customDistrict)} />
          )}
        </div>
        <div>
          <label className="form-label">Số nhà, tên đường, thôn/xóm *</label>
          <input className="form-input" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)}
            placeholder="VD: Số 123 Đường Nguyễn Trãi" required
            disabled={!form.provinceId || (!selectedWard && !customWard)} />
        </div>
        <div style={{ gridColumn: "span 2", backgroundColor: "#F8FAFC", border: "1px dashed #CBD5E1", padding: "12px 16px", borderRadius: "8px", fontSize: "13px" }}>
          <span style={{ color: "#64748B", fontWeight: "600" }}>📍 Địa chỉ thường trú đầy đủ sẽ được lưu:</span>
          <div style={{ color: permanentAddress ? "#1E293B" : "#94A3B8", fontWeight: "700", marginTop: "4px" }}>
            {permanentAddress || "— Vui lòng điền thông tin địa chỉ để tự động ghép địa chỉ —"}
          </div>
        </div>
      </div>
    </div>
  );
}
