import React from "react";
import { GraduationCap, FileText, CheckCircle } from "lucide-react";

const steps = [
  { id: 1, label: "Phương thức tuyển sinh", icon: GraduationCap },
  { id: 2, label: "Thông tin cá nhân & Đăng ký hồ sơ", icon: FileText },
  { id: 3, label: "Xác nhận hoàn thành", icon: CheckCircle },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className="student-card mb-6" style={{ marginBottom: "24px", padding: "20px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", gap: "0" }}>
        {steps.map((step, idx) => {
          const isDone = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isLast = idx === steps.length - 1;
          const StepIcon = step.icon;
          return (
            <div key={step.id} style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative", zIndex: 2, minWidth: "100px" }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "15px",
                  background: isDone ? "#22C55E" : isCurrent ? "linear-gradient(135deg, #FF6B35, #E85A2A)" : "white",
                  color: isDone || isCurrent ? "white" : "#94A3B8",
                  border: isDone || isCurrent ? "none" : "2px solid #E2E8F0",
                  boxShadow: isCurrent ? "0 4px 14px rgba(255,107,53,0.3)" : "none",
                  transition: "all 0.3s ease"
                }}>
                  {isDone ? "✓" : <StepIcon size={20} />}
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "10px", color: "#94A3B8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    BƯỚC {step.id}
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: isCurrent ? "#E85A2A" : isDone ? "#22C55E" : "#64748B", marginTop: "2px", maxWidth: "130px" }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: "10px", color: isCurrent ? "#FF6B35" : isDone ? "#86EFAC" : "#CBD5E1", marginTop: "2px", fontWeight: "500" }}>
                    {isCurrent ? "Đang thực hiện" : isDone ? "Hoàn thành" : "Chờ xử lý"}
                  </div>
                </div>
              </div>
              {!isLast && (
                <div style={{ flex: 1, height: "3px", background: isDone ? "#22C55E" : "#E2E8F0", borderRadius: "2px", marginBottom: "40px", marginLeft: "-8px", marginRight: "-8px", transition: "background 0.3s ease" }}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
