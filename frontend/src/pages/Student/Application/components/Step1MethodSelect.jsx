import React from "react";

export default function Step1MethodSelect({ methods, form, setForm }) {
  const selectedMethod = methods.find(m => m.id == form.methodId);

  return (
    <>
      <div style={{ padding: "24px 28px", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#FF6B35", textTransform: "uppercase", letterSpacing: "0.8px" }}>NỘP HỒ SƠ</span>
        </div>
        <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1E293B", margin: "0" }}>Bước 1 — Chọn phương thức tuyển sinh</h2>
        <p style={{ fontSize: "14px", color: "#64748B", marginTop: "6px" }}>Chọn phương thức phù hợp để tiếp tục điền hồ sơ.</p>
      </div>
      <div style={{ padding: "28px" }}>
        <label style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", display: "block", marginBottom: "16px" }}>
          Chọn phương thức tuyển sinh <span style={{ color: "#EF4444" }}>(*)</span>
        </label>
        <div style={{ display: "grid", gridTemplateColumns: methods.length <= 2 ? "1fr 1fr" : "1fr", gap: "16px" }}>
          {methods.map((method) => {
            const isSelected = form.methodId == method.id;
            return (
              <div key={method.id}
                onClick={() => setForm({ ...form, methodId: method.id })}
                style={{
                  display: "flex", alignItems: "flex-start", gap: "16px",
                  padding: "20px 24px", borderRadius: "16px",
                  border: isSelected ? "2px solid #FF6B35" : "2px solid #E2E8F0",
                  backgroundColor: isSelected ? "#FFF7F4" : "white",
                  cursor: "pointer", transition: "all 0.25s ease",
                  boxShadow: isSelected ? "0 4px 16px rgba(255,107,53,0.12)" : "0 1px 3px rgba(0,0,0,0.04)"
                }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  border: isSelected ? "2px solid #FF6B35" : "2px solid #CBD5E1",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, marginTop: "2px", transition: "all 0.2s ease"
                }}>
                  {isSelected && <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FF6B35" }}></div>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", fontSize: "15px", color: isSelected ? "#E85A2A" : "#1E293B", marginBottom: "4px" }}>
                    {method.name}
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.5" }}>
                    {method.description || "Chọn phương thức xét tuyển phù hợp và upload giấy tờ minh chứng"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedMethod && (
          <div style={{
            marginTop: "20px", padding: "16px 20px",
            background: "linear-gradient(135deg, #FFF7F4, #FEF3E2)",
            borderRadius: "14px", border: "1px solid #FFEDD5",
            display: "flex", alignItems: "center", gap: "12px"
          }}>
            <div style={{ fontSize: "22px" }}>✅</div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#E85A2A" }}>Phương thức đã chọn</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", marginTop: "2px" }}>{selectedMethod.name}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
