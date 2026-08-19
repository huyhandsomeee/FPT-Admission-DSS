import React from "react";
import {
  GraduationCap, FileCheck, Brain, Globe, Award, Zap, Layers,
  CheckCircle2, AlertCircle, Sparkles, ArrowRight
} from "lucide-react";
import { ADMISSION_METHODS } from "../../data/admissionRulesData";

const ICON_MAP = {
  GraduationCap,
  FileCheck,
  Brain,
  Globe,
  Award,
  Zap,
  Layers
};

export default function StepAdmissionMethod({ application, setApplication, onSaveAndNext, onBack, showToast }) {
  const selectedMethods = application.selectedMethods || [];

  const toggleMethod = (methodId) => {
    let nextMethods = [...selectedMethods];
    if (nextMethods.includes(methodId)) {
      if (nextMethods.length === 1) {
        showToast("Bạn phải chọn ít nhất một phương thức xét tuyển.", "error");
        return;
      }
      nextMethods = nextMethods.filter(id => id !== methodId);
    } else {
      nextMethods.push(methodId);
    }

    setApplication(prev => ({
      ...prev,
      selectedMethods: nextMethods
    }));
  };

  const handleProceed = () => {
    if (!selectedMethods || selectedMethods.length === 0) {
      showToast("Vui lòng chọn ít nhất một phương thức xét tuyển để tiếp tục.", "error");
      return;
    }
    showToast(`Đã lưu ${selectedMethods.length} phương thức tuyển sinh được chọn.`);
    onSaveAndNext();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header Info */}
      <div style={{
        background: "#FFFFFF", borderRadius: 14, border: "1px solid #E2E8F0", padding: "22px 26px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#FFEDD5", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0F172A", margin: 0 }}>
              Chọn Phương Thức Xét Tuyển Vào Đại Học FPT 2026
            </h2>
            <p style={{ fontSize: 13, color: "#64748B", margin: "2px 0 0" }}>
              Thí sinh có thể chọn một hoặc nhiều phương thức tuyển sinh cùng lúc để tối đa hóa cơ hội trúng tuyển và học bổng.
            </p>
          </div>
        </div>

        <div style={{
          marginTop: 14, padding: "10px 14px", borderRadius: 8,
          background: "#EFF6FF", border: "1px solid #DBEAFE",
          display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#1D4ED8", fontWeight: 600
        }}>
          <Sparkles size={16} />
          <span>
            Hệ thống sẽ <strong>tự động cấu hình danh mục giấy tờ và biểu mẫu nhập điểm</strong> tương ứng với các phương thức bạn đã chọn.
          </span>
        </div>
      </div>

      {/* Grid of Methods */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
        {ADMISSION_METHODS.map(method => {
          const isSelected = selectedMethods.includes(method.id);
          const IconComp = ICON_MAP[method.icon] || GraduationCap;

          return (
            <div
              key={method.id}
              onClick={() => toggleMethod(method.id)}
              style={{
                background: isSelected ? "#FFFDF9" : "#FFFFFF",
                borderRadius: 12,
                border: isSelected ? "2px solid #EA580C" : "1px solid #E2E8F0",
                padding: "20px",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.2s ease",
                boxShadow: isSelected ? "0 8px 20px rgba(234,88,12,0.12)" : "0 2px 6px rgba(0,0,0,0.02)",
                display: "flex", flexDirection: "column", justifyContent: "space-between"
              }}
            >
              <div>
                {/* Header of Card */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: isSelected ? "#EA580C" : "#F1F5F9",
                      color: isSelected ? "#FFFFFF" : "#64748B",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <IconComp size={20} />
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <strong style={{ fontSize: 14.5, color: "#0F172A" }}>{method.name}</strong>
                      </div>
                      <span style={{ fontSize: 10.5, fontWeight: 800, color: method.badgeColor, background: `${method.badgeColor}15`, padding: "2px 8px", borderRadius: 4, display: "inline-block", marginTop: 3 }}>
                        {method.badge}
                      </span>
                    </div>
                  </div>

                  {/* Checkbox State */}
                  <div style={{
                    width: 22, height: 22, borderRadius: 6,
                    border: isSelected ? "2px solid #EA580C" : "2px solid #CBD5E1",
                    background: isSelected ? "#EA580C" : "#FFF",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#FFF", fontWeight: 900
                  }}>
                    {isSelected && <CheckCircle2 size={16} />}
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: 12.5, color: "#475569", margin: "0 0 12px", lineHeight: 1.45 }}>
                  {method.description}
                </p>

                {/* Criteria & Formula */}
                <div style={{ background: isSelected ? "#FFF7ED" : "#F8FAFC", borderRadius: 8, padding: "10px 12px", fontSize: 11.5, display: "flex", flexDirection: "column", gap: 5, border: "1px solid #F1F5F9" }}>
                  <div>
                    <span style={{ color: "#64748B", fontWeight: 600 }}>Điều kiện xét: </span>
                    <strong style={{ color: "#0F172A" }}>{method.criteria}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", fontWeight: 600 }}>Cách tính điểm: </span>
                    <span style={{ color: "#EA580C", fontWeight: 700 }}>{method.scoreFormula}</span>
                  </div>
                </div>
              </div>

              {/* Footer Tags */}
              <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, color: "#64748B" }}>
                <span>📁 Hồ sơ yêu cầu: {method.requiredDocuments.length} tài liệu</span>
                <span style={{ color: method.status === "OPEN" ? "#16A34A" : "#DC2626", fontWeight: 700 }}>
                  ● {method.status === "OPEN" ? "Đang mở nhận hồ sơ" : "Đã đóng"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          type="button"
          onClick={onBack}
          style={{ padding: "10px 22px", borderRadius: 8, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          ← Quay Lại Bước 1
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
          Lưu Phương Thức & Sang Bước 3 →
        </button>
      </div>
    </div>
  );
}
