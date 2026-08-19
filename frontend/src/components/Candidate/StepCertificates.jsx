import React, { useState } from "react";
import {
  Globe, Award, Shield, Plus, Trash2, CheckCircle2,
  AlertTriangle, Upload, FileText, Sparkles
} from "lucide-react";
import { PRIORITY_AREAS, PRIORITY_OBJECTS } from "../../data/admissionRulesData";

export default function StepCertificates({ application, setApplication, onSaveAndNext, onBack, showToast }) {
  const [newCert, setNewCert] = useState({
    type: "IELTS",
    certNumber: "",
    score: "",
    issueDate: "",
    expiryDate: "",
    provider: "British Council",
    fileName: ""
  });

  const [newAch, setNewAch] = useState({
    competitionName: "",
    type: "Học thuật",
    level: "Tỉnh/Thành phố",
    award: "Giải Nhì",
    year: "2025",
    provider: "",
    fileName: ""
  });

  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [showAddAchModal, setShowAddAchModal] = useState(false);

  const certificates = application.certificates || [];
  const achievements = application.achievements || [];
  const priorities = application.priorities || { areaCode: "KV3", objectCode: "NONE", bonusPoints: 0 };

  const handlePriorityChange = (field, value) => {
    const nextPriorities = { ...priorities, [field]: value };
    const area = PRIORITY_AREAS.find(a => a.code === nextPriorities.areaCode) || PRIORITY_AREAS[3];
    const obj = PRIORITY_OBJECTS.find(o => o.code === nextPriorities.objectCode) || PRIORITY_OBJECTS[0];
    nextPriorities.bonusPoints = (area.bonus || 0) + (obj.bonus || 0);

    setApplication(prev => ({
      ...prev,
      priorities: nextPriorities
    }));
  };

  const handleAddCertificate = () => {
    if (!newCert.score) {
      showToast("Vui lòng nhập điểm chứng chỉ.", "error");
      return;
    }
    const certItem = {
      id: "cert-" + Date.now(),
      ...newCert,
      fileName: newCert.fileName || `${newCert.type}_Certificate_${Date.now()}.pdf`,
      status: "UPLOADED"
    };

    setApplication(prev => ({
      ...prev,
      certificates: [...prev.certificates, certItem]
    }));
    setShowAddCertModal(false);
    setNewCert({ type: "IELTS", certNumber: "", score: "", issueDate: "", expiryDate: "", provider: "British Council", fileName: "" });
    showToast(`Đã thêm chứng chỉ ${certItem.type} (${certItem.score}) thành công!`);
  };

  const handleDeleteCertificate = (id) => {
    setApplication(prev => ({
      ...prev,
      certificates: prev.certificates.filter(c => c.id !== id)
    }));
    showToast("Đã xóa chứng chỉ.");
  };

  const handleAddAchievement = () => {
    if (!newAch.competitionName) {
      showToast("Vui lòng nhập tên cuộc thi / giải thưởng.", "error");
      return;
    }
    const achItem = {
      id: "ach-" + Date.now(),
      ...newAch,
      fileName: newAch.fileName || `MinhChung_${newAch.competitionName.replace(/\s+/g, "_")}.pdf`,
      status: "UPLOADED"
    };

    setApplication(prev => ({
      ...prev,
      achievements: [...prev.achievements, achItem]
    }));
    setShowAddAchModal(false);
    setNewAch({ competitionName: "", type: "Học thuật", level: "Tỉnh/Thành phố", award: "Giải Nhì", year: "2025", provider: "", fileName: "" });
    showToast("Đã thêm thành tích xét học bổng thành công!");
  };

  const handleDeleteAchievement = (id) => {
    setApplication(prev => ({
      ...prev,
      achievements: prev.achievements.filter(a => a.id !== id)
    }));
    showToast("Đã xóa thành tích.");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* SECTION 1: CHỨNG CHỈ QUỐC TẾ */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Globe size={18} color="#EA580C" />
            <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
              1. Chứng Chỉ Ngoại Ngữ & Quốc Tế (IELTS, TOEFL, SAT, ACT...)
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCertModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, background: "#EA580C", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
          >
            <Plus size={15} /> Thêm Chứng Chỉ
          </button>
        </div>

        {certificates.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", background: "#F8FAFC", borderRadius: 8, border: "1.5px dashed #CBD5E1" }}>
            <Globe size={28} color="#94A3B8" style={{ margin: "0 auto 8px" }} />
            <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 6px" }}>Chưa có chứng chỉ quốc tế nào được khai báo.</p>
            <span style={{ fontSize: 11.5, color: "#94A3B8" }}>(Tùy chọn - Có thể bỏ qua nếu không xét bằng chứng chỉ ngoại ngữ)</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {certificates.map(c => (
              <div
                key={c.id}
                style={{
                  background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0",
                  padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14 }}>
                    {c.type}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <strong style={{ fontSize: 14, color: "#0F172A" }}>{c.type} - Điểm: {c.score}</strong>
                      <span style={{ fontSize: 11, background: "#DCFCE7", color: "#16A34A", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                        {c.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
                      Mã: {c.certNumber || "N/A"} • Đơn vị cấp: {c.provider} • Hạn dùng: {c.expiryDate || "2027-05-10"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCertificate(c.id)}
                  style={{ border: "none", background: "transparent", color: "#EF4444", cursor: "pointer", padding: 6 }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: THÀNH TÍCH & NĂNG KHIẾU */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Award size={18} color="#EA580C" />
            <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
              2. Thành Tích Học Sinh Giỏi & Giải Thưởng Năng Khiếu
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setShowAddAchModal(true)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 6, background: "#D97706", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
          >
            <Plus size={15} /> Thêm Giải Thưởng
          </button>
        </div>

        {achievements.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", background: "#F8FAFC", borderRadius: 8, border: "1.5px dashed #CBD5E1" }}>
            <Award size={28} color="#94A3B8" style={{ margin: "0 auto 8px" }} />
            <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 6px" }}>Chưa có thành tích hoặc giải thưởng nào.</p>
            <span style={{ fontSize: 11.5, color: "#94A3B8" }}>(Dành cho thí sinh xét học bổng tài năng hoặc tuyển thẳng)</span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {achievements.map(a => (
              <div
                key={a.id}
                style={{
                  background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0",
                  padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: 14, color: "#0F172A" }}>{a.competitionName}</strong>
                    <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
                      {a.award} • Cấp: {a.level} • Năm: {a.year} • Đơn vị: {a.provider || "Sở GD&ĐT"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteAchievement(a.id)}
                  style={{ border: "none", background: "transparent", color: "#EF4444", cursor: "pointer", padding: 6 }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: ĐỐI TƯỢNG & KHU VỰC ƯU TIÊN */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #F1F5F9", paddingBottom: 12, marginBottom: 20 }}>
          <Shield size={18} color="#EA580C" />
          <h2 style={{ fontSize: 15.5, fontWeight: 800, color: "#0F172A", margin: 0 }}>
            3. Khu Vực Ưu Tiên & Đối Tượng Chính Sách (Cộng Điểm Tuyển Sinh)
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: 18, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Khu vực ưu tiên THPT
            </label>
            <select
              value={priorities.areaCode || "KV3"}
              onChange={(e) => handlePriorityChange("areaCode", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600, background: "#FFF" }}
            >
              {PRIORITY_AREAS.map(ar => (
                <option key={ar.code} value={ar.code}>
                  {ar.name} (+{ar.bonus}đ)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
              Đối tượng chính sách ưu tiên
            </label>
            <select
              value={priorities.objectCode || "NONE"}
              onChange={(e) => handlePriorityChange("objectCode", e.target.value)}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, color: "#0F172A", fontWeight: 600, background: "#FFF" }}
            >
              {PRIORITY_OBJECTS.map(obj => (
                <option key={obj.code} value={obj.code}>
                  {obj.name} {obj.bonus > 0 ? `(+${obj.bonus}đ)` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tổng điểm ưu tiên */}
        <div style={{ background: "#EFF6FF", borderRadius: 8, padding: "12px 18px", border: "1px solid #DBEAFE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 12.5, color: "#1E40AF", fontWeight: 600 }}>
              Tổng điểm ưu tiên quy đổi cộng vào điểm xét tuyển:
            </span>
          </div>
          <strong style={{ fontSize: 18, color: "#1D4ED8", fontWeight: 900 }}>
            +{priorities.bonusPoints.toFixed(2)} Điểm
          </strong>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          onClick={onBack}
          style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          ← Quay Lại Bước 3
        </button>
        <button
          type="button"
          onClick={onSaveAndNext}
          style={{
            padding: "11px 26px", borderRadius: 8, background: "#EA580C",
            color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 13.5,
            cursor: "pointer", boxShadow: "0 4px 14px rgba(234,88,12,0.3)"
          }}
        >
          Lưu Chứng Chỉ & Sang Bước 5 →
        </button>
      </div>

      {/* Modal Thêm Chứng Chỉ */}
      {showAddCertModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex",
          alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{ background: "#FFFFFF", borderRadius: 14, maxWidth: 500, width: "100%", padding: "24px 28px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: "0 0 16px" }}>
              Khai Báo Chứng Chỉ Ngoại Ngữ / Quốc Tế
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Loại chứng chỉ</label>
                <select
                  value={newCert.type}
                  onChange={(e) => setNewCert({ ...newCert, type: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600, background: "#FFF" }}
                >
                  <option value="IELTS">IELTS Academic</option>
                  <option value="TOEFL">TOEFL iBT</option>
                  <option value="TOEIC">TOEIC</option>
                  <option value="SAT">SAT</option>
                  <option value="ACT">ACT</option>
                  <option value="JLPT">JLPT (Tiếng Nhật)</option>
                  <option value="TOPIK">TOPIK (Tiếng Hàn)</option>
                  <option value="HSK">HSK (Tiếng Trung)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Điểm số đạt được</label>
                <input
                  type="text"
                  placeholder="VD: 7.0 hoặc 1350"
                  value={newCert.score}
                  onChange={(e) => setNewCert({ ...newCert, score: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Số hiệu chứng chỉ</label>
                <input
                  type="text"
                  placeholder="VD: 23VN019284"
                  value={newCert.certNumber}
                  onChange={(e) => setNewCert({ ...newCert, certNumber: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Đơn vị cấp</label>
                <input
                  type="text"
                  placeholder="British Council / IDP"
                  value={newCert.provider}
                  onChange={(e) => setNewCert({ ...newCert, provider: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowAddCertModal(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleAddCertificate}
                style={{ padding: "8px 20px", borderRadius: 6, background: "#EA580C", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Lưu Chứng Chỉ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm Thành Tích */}
      {showAddAchModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex",
          alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{ background: "#FFFFFF", borderRadius: 14, maxWidth: 500, width: "100%", padding: "24px 28px" }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0F172A", margin: "0 0 16px" }}>
              Khai Báo Thành Tích & Năng Khiếu
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Tên cuộc thi / Giải thưởng</label>
                <input
                  type="text"
                  placeholder="VD: Kỳ thi Học sinh giỏi cấp Tỉnh/TP"
                  value={newAch.competitionName}
                  onChange={(e) => setNewAch({ ...newAch, competitionName: e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, fontWeight: 600 }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Cấp độ giải</label>
                  <select
                    value={newAch.level}
                    onChange={(e) => setNewAch({ ...newAch, level: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5, background: "#FFF" }}
                  >
                    <option value="Quốc tế">Quốc tế</option>
                    <option value="Quốc gia">Quốc gia</option>
                    <option value="Tỉnh/Thành phố">Tỉnh/Thành phố</option>
                    <option value="Trường">Cấp Trường</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 }}>Giải đạt được</label>
                  <input
                    type="text"
                    placeholder="VD: Giải Nhì môn Tin học"
                    value={newAch.award}
                    onChange={(e) => setNewAch({ ...newAch, award: e.target.value })}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 6, border: "1px solid #CBD5E1", fontSize: 12.5 }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowAddAchModal(false)}
                style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleAddAchievement}
                style={{ padding: "8px 20px", borderRadius: 6, background: "#D97706", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Lưu Thành Tích
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
