import { useState } from "react";
import {
  FileText, CheckCircle2, User, Mail, Phone, MapPin,
  GraduationCap, Award, UploadCloud, Calendar, ArrowRight,
  ShieldCheck, AlertCircle, HelpCircle, Sparkles, Check
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OnlineApplication() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    citizenId: "",
    dob: "",
    gender: "Nam",
    phone: "",
    email: "",
    province: "Hà Nội",
    highSchool: "",
    graduationYear: "2026",
    campus: "FPT Hà Nội (Hoà Lạc)",
    major: "Kỹ thuật phần mềm (Software Engineering)",
    method: "Xét tuyển điểm thi THPT 2026",
    scoreToan: "",
    scoreVan: "",
    scoreAnh: "",
    ieltsScore: "",
    note: ""
  });

  const majorsList = [
    "Kỹ thuật phần mềm (Software Engineering)",
    "Trí tuệ nhân tạo (Artificial Intelligence)",
    "An toàn thông tin (Cybersecurity)",
    "Thiết kế Mỹ thuật số (Digital Art & Design)",
    "Quản trị kinh doanh Quốc tế",
    "Digital Marketing",
    "Tài chính - Ngân hàng (Fintech)",
    "Ngôn ngữ Anh",
    "Ngôn ngữ Nhật",
    "Ngôn ngữ Hàn Quốc",
    "Thiết kế Vi mạch Bán dẫn (Semiconductor)"
  ];

  const campuses = [
    "FPT Hà Nội (Hoà Lạc)",
    "FPT TP. Hồ Chí Minh (Q9)",
    "FPT Đà Nẵng (Ngũ Hành Sơn)",
    "FPT Cần Thơ (An Bình)",
    "FPT Quy Nhơn (AI Campus)"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(s => s + 1);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ padding: "40px 24px 60px", maxWidth: 960, margin: "0 auto", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 100, background: "#FFF7F4", border: "1px solid #FFD8CC", color: "#FF6B35", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
          <Sparkles size={15} /> Tuyển Sinh Đại Học FPT 2026
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", margin: "0 0 10px 0" }}>
          Nộp Hồ Sơ Xét Tuyển Trực Tuyến
        </h1>
        <p style={{ fontSize: 15, color: "#64748B", maxWidth: 580, margin: "0 auto" }}>
          Đăng ký xét tuyển trực tuyến nhanh chóng trong 3 bước — Kết quả sơ tuyển sẽ được gửi qua SMS & Email trong 24h.
        </p>
      </div>

      {!submitted ? (
        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E2E8F0", padding: "36px 40px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
          {/* Step Indicator */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", marginBottom: 36 }}>
            <div style={{ position: "absolute", top: 18, left: "10%", right: "10%", height: 3, background: "#E2E8F0", zIndex: 1 }}>
              <div style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "100%", height: "100%", background: "#FF6B35", transition: "width 0.4s ease" }} />
            </div>
            {[
              { num: 1, title: "Thông tin cá nhân" },
              { num: 2, title: "Nguyện vọng & Điểm số" },
              { num: 3, title: "Minh chứng & Hoàn tất" }
            ].map(s => (
              <div key={s.num} style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: step >= s.num ? "#FF6B35" : "#fff",
                  border: `2px solid ${step >= s.num ? "#FF6B35" : "#CBD5E1"}`,
                  color: step >= s.num ? "#fff" : "#64748B",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15
                }}>
                  {step > s.num ? <Check size={18} /> : s.num}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: step >= s.num ? "#0F172A" : "#94A3B8", marginTop: 8 }}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: "0 0 4px 0" }}>Bước 1: Thông Tin Thí Sinh</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Họ và tên thí sinh *</label>
                  <input
                    type="text" required placeholder="VD: NGUYỄN VĂN A"
                    value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Số CCCD / Mã định danh *</label>
                  <input
                    type="text" required placeholder="12 chữ số trên CCCD"
                    value={formData.citizenId} onChange={e => setFormData({ ...formData, citizenId: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Số điện thoại liên hệ *</label>
                  <input
                    type="tel" required placeholder="VD: 0912345678"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Địa chỉ Email nhận thông báo *</label>
                  <input
                    type="email" required placeholder="VD: thisinh@gmail.com"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Trường THPT đang học / Tốt nghiệp</label>
                  <input
                    type="text" placeholder="VD: THPT Chuyên Phan Bội Châu"
                    value={formData.highSchool} onChange={e => setFormData({ ...formData, highSchool: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Tỉnh / Thành phố thường trú</label>
                  <input
                    type="text" placeholder="VD: Hà Nội"
                    value={formData.province} onChange={e => setFormData({ ...formData, province: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Major & Scores */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: "0 0 4px 0" }}>Bước 2: Chọn Nguyện Vọng & Phương Thức</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Chọn Cơ Sở Đào Tạo Mong Muốn *</label>
                  <select
                    value={formData.campus} onChange={e => setFormData({ ...formData, campus: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 14, outline: "none", background: "#fff" }}
                  >
                    {campuses.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Ngành Đào Tạo Đăng Ký (Nguyện vọng 1) *</label>
                  <select
                    value={formData.major} onChange={e => setFormData({ ...formData, major: e.target.value })}
                    style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 14, outline: "none", background: "#fff" }}
                  >
                    {majorsList.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Phương Thức Xét Tuyển Chính *</label>
                <select
                  value={formData.method} onChange={e => setFormData({ ...formData, method: e.target.value })}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #CBD5E1", fontSize: 14, outline: "none", background: "#fff" }}
                >
                  <option>Xét tuyển điểm thi THPT 2026 (Tổ hợp Toán + Lý + Anh / Toán + Văn + Anh)</option>
                  <option>Xét học bạ THPT (Điểm tổng kết 3 học kỳ ≥ 21.0)</option>
                  <option>Xét điểm thi Đánh Giá Năng Lực ĐHQG (≥ 750 điểm)</option>
                  <option>Xét tuyển thẳng thí sinh có chứng chỉ IELTS ≥ 6.0 / SAT ≥ 1100</option>
                  <option>Xét học bổng tài năng FPT Talent Scholarship</option>
                </select>
              </div>

              <div style={{ padding: 18, background: "#F8FAFC", borderRadius: 14, border: "1px solid #E2E8F0" }}>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", margin: "0 0 10px 0" }}>Điểm số ước tính / Đạt được</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Điểm Toán</label>
                    <input type="number" step="0.1" placeholder="8.5" value={formData.scoreToan} onChange={e => setFormData({ ...formData, scoreToan: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #CBD5E1", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Điểm Văn/Lý</label>
                    <input type="number" step="0.1" placeholder="8.0" value={formData.scoreVan} onChange={e => setFormData({ ...formData, scoreVan: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #CBD5E1", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>Điểm Ngoại Ngữ</label>
                    <input type="number" step="0.1" placeholder="9.0" value={formData.scoreAnh} onChange={e => setFormData({ ...formData, scoreAnh: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #CBD5E1", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: "#64748B", fontWeight: 600 }}>IELTS (nếu có)</label>
                    <input type="number" step="0.5" placeholder="6.5" value={formData.ieltsScore} onChange={e => setFormData({ ...formData, ieltsScore: e.target.value })} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid #CBD5E1", boxSizing: "border-box" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Evidence & Confirm */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", margin: "0 0 4px 0" }}>Bước 3: Tải Minh Chứng & Xác Nhận</h3>
              
              <div style={{ border: "2px dashed #CBD5E1", borderRadius: 16, padding: "28px 20px", textAlign: "center", background: "#F8FAFC", cursor: "pointer" }}>
                <UploadCloud size={36} color="#FF6B35" style={{ margin: "0 auto 8px" }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Kéo thả hoặc bấm để tải ảnh chụp CCCD / Học bạ / Chứng chỉ</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Định dạng hỗ trợ: JPG, PNG, PDF (Tối đa 15MB)</div>
              </div>

              <div style={{ padding: 18, background: "#EFF6FF", borderRadius: 14, border: "1px solid #BFDBFE" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <ShieldCheck size={20} color="#2563EB" style={{ flexShrink: 0 }} />
                  <div style={{ fontSize: 13, color: "#1E40AF", lineHeight: 1.5 }}>
                    Hồ sơ của bạn sẽ được mã hóa an toàn và đưa vào hệ thống <strong>Data Mart Tuyển Sinh Đại học FPT</strong>. Cán bộ tuyển sinh sẽ đối soát dữ liệu với CSDL Quốc gia và liên hệ hướng dẫn trong vòng 24 giờ.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 20, borderTop: "1px solid #F1F5F9" }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s - 1)}
                style={{ padding: "11px 22px", borderRadius: 12, border: "1.5px solid #CBD5E1", background: "#fff", color: "#475569", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
              >
                ← Quay lại
              </button>
            ) : <div />}

            <button
              type="button"
              onClick={handleSubmit}
              style={{
                padding: "12px 30px", borderRadius: 12, background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                color: "#fff", border: "none", fontWeight: 800, fontSize: 14.5, cursor: "pointer", boxShadow: "0 6px 18px rgba(255,107,53,0.4)"
              }}
            >
              {step === 3 ? "Gửi Hồ Sơ Xét Tuyển Ngay 🚀" : "Tiếp theo →"}
            </button>
          </div>
        </div>
      ) : (
        /* Success Screen */
        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E2E8F0", padding: "48px 36px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#DCFCE7", color: "#16A34A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: "0 0 10px 0" }}>Nộp Hồ Sơ Thành Công!</h2>
          <p style={{ fontSize: 15, color: "#64748B", maxWidth: 500, margin: "0 auto 24px", lineHeight: 1.6 }}>
            Mã hồ sơ tuyển sinh của bạn: <strong style={{ color: "#FF6B35", fontSize: 18 }}>FPT-2026-{Math.floor(100000 + Math.random() * 900000)}</strong>.
            Hệ thống đã gửi email xác nhận và hướng dẫn chi tiết đến <strong>{formData.email || "email của bạn"}</strong>.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button
              onClick={() => navigate("/portal/admission-lookup")}
              style={{ padding: "12px 24px", borderRadius: 12, background: "#0F172A", color: "#fff", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              Tra Cứu Điểm Chuẩn Các Ngành
            </button>
            <button
              onClick={() => navigate("/portal")}
              style={{ padding: "12px 24px", borderRadius: 12, background: "#F1F5F9", color: "#334155", border: "1px solid #CBD5E1", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
            >
              Về Trang Chủ Cổng Dữ Liệu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
