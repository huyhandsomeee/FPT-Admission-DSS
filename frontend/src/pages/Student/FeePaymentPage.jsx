import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/axiosConfig";
import { CheckCircle, CreditCard, DollarSign, Home, ArrowLeft } from "lucide-react";

export default function FeePaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);
  const [appInfo, setAppInfo] = useState({});
  const [enrollmentData, setEnrollmentData] = useState(null);

  const TUITION_FEE = 15000000;
  const DORMITORY_FEE = 3000000;

  useEffect(() => {
    api.get(`/api/student/enrollment/${id}/form`)
      .then(r => {
        const { prefill, form } = r.data;
        setAppInfo(prefill || {});
        setEnrollmentData(form || {});
      })
      .catch(() => {
        setError("Không thể tải thông tin hồ sơ.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handlePayment = async () => {
    setPaying(true);
    setError(null);
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update enrollment checklist for Tuition payment
      try {
        await api.post(`/api/student/enrollment/${id}/checklist`, { item: "TUITION_PAID", done: true });
      } catch (err) {
        console.error("Failed to update enrollment checklist:", err);
      }

      // Update application checklist for fee payment
      await api.put(`/api/student/applications/${id}/checklist`, { chkPayFee: true });

      setPaid(true);
    } catch (err) {
      setError("Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setPaying(false);
    }
  };

  const hasDormitory = enrollmentData?.dormitory_apply == 1 || enrollmentData?.dormitory_apply === true;
  const totalFee = TUITION_FEE + (hasDormitory ? DORMITORY_FEE : 0);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 12 }}>
      <div style={{ width: 40, height: 40, border: "4px solid #F1F5F9", borderTopColor: "#FF6B35", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <div style={{ color: "#94A3B8", fontSize: 14 }}>Đang tải thông tin thanh toán...</div>
    </div>
  );

  if (paid) return (
    <div style={{ padding: "40px 24px", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#10B981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}>
        <CheckCircle size={40} color="white" />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#065F46", marginBottom: 10 }}>Hoàn tất thủ tục nhập học! 🎓</h1>
      <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>
        Bạn đã thanh toán lệ phí thành công. Chào mừng bạn đến với gia đình FPT University! 🧡
      </p>
      <button onClick={() => navigate("/student/applications")} style={{ padding: "10px 20px", background: "white", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer" }}>
        Về danh sách hồ sơ
      </button>
    </div>
  );

  return (
    <div style={{ padding: "20px 24px", maxWidth: 600, margin: "0 auto" }}>
        <button type="button" onClick={() => navigate(`/student/enrollment/${id}`)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0 }}>
            <ArrowLeft size={14} /> Quay lại
        </button>

        <div style={{ background: "linear-gradient(135deg,#FF6B35,#E85A2A)", borderRadius: 20, padding: "24px 28px", marginBottom: 20, color: "white" }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Thanh toán lệ phí nhập học</h1>
            <p style={{ margin: 0, opacity: 0.85, fontSize: 13, marginTop: 3 }}>Hoàn tất thanh toán để kết thúc thủ tục.</p>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <div style={{ paddingBottom: 14, borderBottom: "1px solid #F1F5F9", marginBottom: 18 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#1E293B" }}>Chi tiết các khoản phí</div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 14, color: "#475569", display: "flex", alignItems: "center", gap: 8 }}><DollarSign size={16} /> Học phí kỳ đầu</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{TUITION_FEE.toLocaleString('vi-VN')} VNĐ</div>
            </div>

            {hasDormitory && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 14, color: "#475569", display: "flex", alignItems: "center", gap: 8 }}><Home size={16} /> Phí ký túc xá ({enrollmentData?.dormitory_room_type || "Tạm tính"})</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{DORMITORY_FEE.toLocaleString('vi-VN')} VNĐ</div>
                </div>
            )}

            <div style={{ height: 1, background: "#E2E8F0", margin: "16px 0" }}></div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1E293B" }}>Tổng cộng</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "#FF6B35" }}>{totalFee.toLocaleString('vi-VN')} VNĐ</div>
            </div>

            {error && <div style={{ color: "red", marginTop: 10, fontSize: 13 }}>{error}</div>}

            <button onClick={handlePayment} disabled={paying || loading} style={{
                width: "100%", padding: "12px 28px", marginTop: 20,
                background: paying ? "#CBD5E1" : "linear-gradient(135deg,#10B981,#059669)",
                border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, color: "white",
                cursor: paying ? "not-allowed" : "pointer",
                boxShadow: paying ? "none" : "0 4px 14px rgba(16,185,129,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
            }}>
                <CreditCard size={16} /> {paying ? "Đang xử lý..." : "Xác nhận thanh toán"}
            </button>
            <div style={{marginTop: "1rem", color: "#64748B", fontSize: "12px", textAlign: "center"}}>
                Lưu ý: Đây là giao diện giả lập. Trong ứng dụng thực tế, bạn sẽ được chuyển đến cổng thanh toán an toàn.
            </div>
        </div>
    </div>
  );
}
