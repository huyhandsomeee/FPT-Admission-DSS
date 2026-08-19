import React, { useState } from "react";
import {
  CreditCard, QrCode, CheckCircle2, Copy, X,
  Building, Sparkles, Clock, ShieldCheck
} from "lucide-react";
import { logAuditEvent } from "../../services/candidateAdmissionEngine";

export default function FeePaymentModal({ isOpen, onClose, application, setApplication, showToast }) {
  const [activeMethod, setActiveMethod] = useState("VIETQR");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const appCode = application.applicationId || "FPT-2026-894120";
  const amount = 200000;
  const isPaid = application.feePayment?.status === "PAID";

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const paidTime = new Date().toLocaleString("vi-VN");
      const transId = "FT" + Date.now().toString().slice(-8);

      setApplication(prev => ({
        ...prev,
        feePayment: {
          amount,
          status: "PAID",
          transactionId: transId,
          paidAt: paidTime,
          method: activeMethod
        }
      }));

      logAuditEvent("FEE_PAYMENT", `Thí sinh hoàn tất thanh toán lệ phí 200.000 VNĐ. Mã GD: ${transId}`);
      showToast("🎉 Thanh toán lệ phí xét tuyển thành công! Hệ thống đã ghi nhận biên lai điện tử.", "success");
      onClose();
    }, 1000);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép ${label}: ${text}`);
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(15,23,42,0.7)", zIndex: 9999, display: "flex",
      alignItems: "center", justifyContent: "center", padding: 20
    }}>
      <div style={{ background: "#FFFFFF", borderRadius: 16, maxWidth: 540, width: "100%", padding: "26px 30px", boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
        {/* Modal Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "#FFEDD5", color: "#EA580C", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <CreditCard size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 900, color: "#0F172A", margin: 0 }}>
                Thanh Toán Lệ Phí Xét Tuyển Tuyển Sinh
              </h3>
              <span style={{ fontSize: 12, color: "#64748B" }}>Mã hồ sơ: <strong>{appCode}</strong></span>
            </div>
          </div>

          <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "#64748B" }}>
            <X size={20} />
          </button>
        </div>

        {/* Method Selector Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 18 }}>
          {[
            { id: "VIETQR", label: "VietQR (Mọi Ngân Hàng)", icon: QrCode },
            { id: "VNPAY", label: "VNPAY-QR / Thẻ ATM", icon: CreditCard },
            { id: "MOMO", label: "Ví MoMo", icon: Sparkles },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMethod(tab.id)}
              style={{
                padding: "8px 10px", borderRadius: 8,
                border: activeMethod === tab.id ? "2px solid #EA580C" : "1px solid #E2E8F0",
                background: activeMethod === tab.id ? "#FFF7ED" : "#FFFFFF",
                color: activeMethod === tab.id ? "#9A3412" : "#475569",
                fontWeight: activeMethod === tab.id ? 800 : 600,
                fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6
              }}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Payment QR Code Box */}
        <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "20px", border: "1px solid #E2E8F0", textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>SỐ TIỀN THANH TOÁN</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#EA580C", marginBottom: 14 }}>
            200.000 VNĐ
          </div>

          {/* QR Code Placeholder / Image */}
          <div style={{
            width: 170, height: 170, margin: "0 auto 14px", background: "#FFFFFF",
            borderRadius: 12, border: "1.5px solid #CBD5E1", padding: "10px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}>
            <QrCode size={130} color="#0F172A" />
            <span style={{ fontSize: 10, color: "#64748B", fontWeight: 700, marginTop: 4 }}>Quét mã để thanh toán</span>
          </div>

          {/* Transfer Info */}
          <div style={{ background: "#FFFFFF", borderRadius: 8, padding: "12px 14px", border: "1px solid #E2E8F0", fontSize: 12, display: "flex", flexDirection: "column", gap: 6, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Ngân hàng:</span>
              <strong>TPBank (Ngân hàng Tiên Phong)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#64748B" }}>Số tài khoản:</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <strong style={{ fontFamily: "monospace", fontSize: 13 }}>0888999FPTU</strong>
                <Copy size={13} color="#2563EB" style={{ cursor: "pointer" }} onClick={() => copyToClipboard("0888999FPTU", "STK")} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748B" }}>Chủ tài khoản:</span>
              <strong>TRUONG DAI HOC FPT</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "#64748B" }}>Nội dung chuyển khoản:</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <strong style={{ color: "#EA580C", fontFamily: "monospace" }}>FPTU {appCode}</strong>
                <Copy size={13} color="#2563EB" style={{ cursor: "pointer" }} onClick={() => copyToClipboard(`FPTU ${appCode}`, "Nội dung")} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid #CBD5E1", background: "#FFF", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
          >
            Đóng
          </button>

          <button
            type="button"
            disabled={isProcessing || isPaid}
            onClick={handleConfirmPayment}
            style={{
              padding: "10px 24px", borderRadius: 8,
              background: isPaid ? "#16A34A" : "#EA580C",
              color: "#FFF", border: "none", fontWeight: 800, fontSize: 13,
              cursor: isProcessing || isPaid ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", gap: 6
            }}
          >
            <CheckCircle2 size={16} />
            {isPaid ? "Đã Thanh Toán Thành Công" : isProcessing ? "Đang xác nhận..." : "Tôi Đã Chuyển Tiền Thành Công"}
          </button>
        </div>
      </div>
    </div>
  );
}
