import React, { useState } from "react";
import {
  Target, Plus, Trash2, MoveUp, MoveDown, CheckCircle2,
  AlertCircle, Building, Sparkles, HelpCircle, Layers
} from "lucide-react";
import { CAMPUSES, MAJORS, ADMISSION_METHODS, SUBJECT_COMBINATIONS } from "../../data/admissionRulesData";
import { calculateCandidateScore } from "../../services/candidateAdmissionEngine";

export default function StepPreferences({ application, setApplication, onSaveAndNext, onBack, showToast }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCampusId, setSelectedCampusId] = useState("CAMPUS_HN");
  const [selectedMajorId, setSelectedMajorId] = useState("MAJOR_SE");
  const [selectedMethodId, setSelectedMethodId] = useState("THPT_EXAM");
  const [selectedComboCode, setSelectedComboCode] = useState("A01");

  const preferences = application.preferences || [];

  const handleMove = (index, direction) => {
    const newItems = [...preferences];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    newItems.forEach((item, idx) => {
      item.priority = idx + 1;
    });

    setApplication(prev => ({
      ...prev,
      preferences: newItems
    }));
    showToast(`Đã đổi thứ tự ưu tiên: NV1 hiện tại là ${newItems[0].majorName}`);
  };

  const handleDelete = (id) => {
    if (preferences.length <= 1) {
      showToast("Thí sinh cần đăng ký tối thiểu 1 nguyện vọng.", "error");
      return;
    }
    const filtered = preferences.filter(p => p.id !== id).map((item, idx) => ({ ...item, priority: idx + 1 }));
    setApplication(prev => ({
      ...prev,
      preferences: filtered
    }));
    showToast("Đã xóa nguyện vọng.");
  };

  const handleAddPreference = () => {
    if (preferences.length >= 10) {
      showToast("Thí sinh chỉ được đăng ký tối đa 10 nguyện vọng.", "error");
      return;
    }

    const isDuplicate = preferences.some(p => p.campusId === selectedCampusId && p.majorId === selectedMajorId);
    if (isDuplicate) {
      showToast("Không được đăng ký trùng ngành học tại cùng một cơ sở đào tạo.", "error");
      return;
    }

    const campus = CAMPUSES.find(c => c.id === selectedCampusId);
    const major = MAJORS.find(m => m.id === selectedMajorId);
    const method = ADMISSION_METHODS.find(m => m.id === selectedMethodId);
    const combo = SUBJECT_COMBINATIONS.find(c => c.code === selectedComboCode);

    const scoreCalc = calculateCandidateScore(application, selectedMethodId, selectedComboCode);

    const newPref = {
      id: "pref-" + Date.now(),
      priority: preferences.length + 1,
      campusId: selectedCampusId,
      campusName: campus?.name || "FPT Hà Nội",
      majorId: selectedMajorId,
      majorCode: major?.code || "7480103",
      majorName: major?.name || "Kỹ thuật phần mềm",
      admissionMethodId: selectedMethodId,
      admissionMethodName: method?.name || "Xét điểm thi THPT",
      combinationCode: selectedComboCode,
      combinationName: combo?.name || "Toán, Lý, Anh",
      myScore: scoreCalc.finalScore,
      benchmarkScore: major?.benchmarkScoreTHPT || 24.0,
      eligibilityStatus: scoreCalc.finalScore >= (major?.benchmarkScoreTHPT || 24.0) ? "ELIGIBLE" : "INELIGIBLE",
      statusText: scoreCalc.finalScore >= (major?.benchmarkScoreTHPT || 24.0) ? "Đạt ngưỡng xét tuyển" : "Chưa đạt điểm sàn",
      scholarshipRecommended: scoreCalc.finalScore >= 26.0 ? "Học bổng Tài năng 30%" : "Xét tuyển chuẩn"
    };

    setApplication(prev => ({
      ...prev,
      preferences: [...prev.preferences, newPref]
    }));

    setShowAddModal(false);
    showToast(`Đã thêm Nguyện vọng ${newPref.priority}: ${newPref.majorName} (${newPref.campusName})!`);
  };

  const handleProceed = () => {
    if (preferences.length === 0) {
      showToast("Vui lòng đăng ký ít nhất một nguyện vọng.", "error");
      return;
    }
    onSaveAndNext();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header Info */}
      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid #E2E8F0", padding: "22px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Target size={20} color="#EA580C" />
            <h2 style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", margin: 0 }}>
              Đăng Ký & Sắp Xếp Thứ Tự Nguyện Vọng (Tối Đa 10 NV)
            </h2>
          </div>
          <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
            Hệ thống xét tuyển theo thứ tự ưu tiên từ trên xuống dưới (Nguyện vọng 1 là ưu tiên cao nhất).
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
            borderRadius: 8, background: "#EA580C", color: "#FFFFFF", border: "none",
            fontWeight: 800, fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(234,88,12,0.25)"
          }}
        >
          <Plus size={16} /> Thêm Nguyện Vọng Mới
        </button>
      </div>

      {/* Preferences List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {preferences.map((pref, idx) => {
          const isTopPriority = pref.priority === 1;

          return (
            <div
              key={pref.id}
              style={{
                background: "#FFFFFF",
                borderRadius: 12,
                border: isTopPriority ? "2px solid #EA580C" : "1px solid #E2E8F0",
                padding: "18px 22px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                boxShadow: isTopPriority ? "0 4px 16px rgba(234,88,12,0.08)" : "0 1px 3px rgba(0,0,0,0.02)",
                flexWrap: "wrap", gap: 14
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {/* Priority Badge */}
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: isTopPriority ? "#EA580C" : "#F1F5F9",
                  color: isTopPriority ? "#FFFFFF" : "#475569",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, flexShrink: 0
                }}>
                  <span style={{ fontSize: 9.5, opacity: 0.85 }}>NV</span>
                  <span style={{ fontSize: 17, lineHeight: 1 }}>{pref.priority}</span>
                </div>

                {/* Major Info */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <strong style={{ fontSize: 15, color: "#0F172A" }}>{pref.majorName}</strong>
                    <span style={{ fontSize: 11, fontFamily: "monospace", background: "#F1F5F9", padding: "2px 6px", borderRadius: 4, color: "#64748B", fontWeight: 700 }}>
                      Mã: {pref.majorCode}
                    </span>
                    {pref.scholarshipRecommended && (
                      <span style={{ fontSize: 11, background: "#FEF3C7", color: "#B45309", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
                        ⭐ {pref.scholarshipRecommended}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#64748B", display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span>📍 {pref.campusName}</span>
                    <span>🎓 {pref.admissionMethodName}</span>
                    <span>📊 Tổ hợp: {pref.combinationCode}</span>
                  </div>
                </div>
              </div>

              {/* Score & Reorder Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600 }}>Điểm xét của bạn</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#16A34A" }}>
                    {pref.myScore} <span style={{ fontSize: 11.5, color: "#94A3B8" }}>(Chuẩn: {pref.benchmarkScore})</span>
                  </div>
                </div>

                {/* Move & Delete */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "up")}
                      style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: idx === 0 ? "#F8FAFC" : "#FFFFFF", cursor: idx === 0 ? "not-allowed" : "pointer" }}
                    >
                      <MoveUp size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === preferences.length - 1}
                      onClick={() => handleMove(idx, "down")}
                      style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #CBD5E1", background: idx === preferences.length - 1 ? "#F8FAFC" : "#FFFFFF", cursor: idx === preferences.length - 1 ? "not-allowed" : "pointer" }}
                    >
                      <MoveDown size={13} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(pref.id)}
                    style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#DC2626", cursor: "pointer" }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          onClick={onBack}
          style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          ← Quay Lại Bước 5
        </button>
        <button
          type="button"
          onClick={handleProceed}
          style={{
            padding: "11px 26px", borderRadius: 8, background: "#EA580C",
            color: "#FFFFFF", border: "none", fontWeight: 800, fontSize: 13.5,
            cursor: "pointer", boxShadow: "0 4px 14px rgba(234,88,12,0.3)"
          }}
        >
          Kiểm Tra Điều Kiện Xét Tuyển (Bước 7) →
        </button>
      </div>

      {/* Add Preference Modal */}
      {showAddModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15,23,42,0.6)", zIndex: 9999, display: "flex",
          alignItems: "center", justifyContent: "center", padding: 20
        }}>
          <div style={{ background: "#FFFFFF", borderRadius: 14, maxWidth: 580, width: "100%", padding: "24px 28px" }}>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", margin: "0 0 16px" }}>
              Đăng Ký Thêm Nguyện Vọng Mới (NV{preferences.length + 1})
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
              {/* Campus */}
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                  1. Chọn Cơ sở Đào tạo FPTU
                </label>
                <select
                  value={selectedCampusId}
                  onChange={(e) => setSelectedCampusId(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 600, background: "#FFF" }}
                >
                  {CAMPUSES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Major */}
              <div>
                <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                  2. Chọn Ngành / Chương trình đào tạo
                </label>
                <select
                  value={selectedMajorId}
                  onChange={(e) => setSelectedMajorId(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 600, background: "#FFF" }}
                >
                  {MAJORS.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Mã: {m.code} - Điểm chuẩn: {m.benchmarkScoreTHPT}đ)
                    </option>
                  ))}
                </select>
              </div>

              {/* Method */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                    3. Phương thức xét tuyển
                  </label>
                  <select
                    value={selectedMethodId}
                    onChange={(e) => setSelectedMethodId(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 600, background: "#FFF" }}
                  >
                    {ADMISSION_METHODS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 4 }}>
                    4. Tổ hợp môn xét tuyển
                  </label>
                  <select
                    value={selectedComboCode}
                    onChange={(e) => setSelectedComboCode(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #CBD5E1", fontSize: 13, fontWeight: 600, background: "#FFF" }}
                  >
                    {SUBJECT_COMBINATIONS.map(c => <option key={c.code} value={c.code}>{c.code} ({c.name})</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ padding: "9px 18px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleAddPreference}
                style={{ padding: "9px 24px", borderRadius: 6, background: "#EA580C", color: "#FFF", border: "none", fontSize: 12.5, fontWeight: 800, cursor: "pointer" }}
              >
                Thêm Nguyện Vọng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
