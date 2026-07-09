import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../config/axiosConfig";
import {
  User, Phone, Mail, MapPin, FileText, GraduationCap,
  ChevronRight, ArrowLeft, CheckCircle, AlertCircle,
  Home, Users, BookOpen, Star, Building
} from "lucide-react";

// ─── Field helpers ────────────────────────────────────────────────────────────
const inp = {
  width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8F0",
  borderRadius: 10, fontSize: 13, color: "#1E293B", outline: "none",
  background: "#FAFBFC", boxSizing: "border-box", transition: "border-color 0.2s"
};
const inpFocus = { borderColor: "#FF6B35" };

function Field({ label, required, children, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}{required && <span style={{ color: "#EF4444", marginLeft: 3 }}>*</span>}
      </label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "#94A3B8" }}>{hint}</div>}
    </div>
  );
}

function Section({ icon: Icon, title, color = "#FF6B35", children }) {
  return (
    <div style={{ background: "white", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 14, borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} color={color} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 15, color: "#1E293B" }}>{title}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function FullRow({ children }) {
  return <div style={{ gridColumn: "1 / -1" }}>{children}</div>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function EnrollmentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [appInfo, setAppInfo] = useState({});
  const [form, setForm] = useState({
    fullName: "", dob: "", gender: "Nam", idNumber: "", idIssuedDate: "", idIssuedPlace: "",
    permanentAddress: "", contactAddress: "", phone: "", email: "",
    parentName: "", parentPhone: "",
    fatherName: "", fatherPhone: "",
    motherName: "", motherPhone: "",
    highSchool: "", graduationYear: new Date().getFullYear().toString(),
    preferredCampus: "", expectedStart: "01/09/2026",
    scholarshipApply: false, dormitoryApply: false, dormitoryRoomType: "", additionalNotes: ""
  });

  useEffect(() => {
    api.get(`/api/student/enrollment/${id}/form`)
      .then(r => {
        const { prefill, form: saved, submitted: isSub } = r.data;
        setAppInfo(prefill || {});
        setSubmitted(isSub);
        if (isSub && saved && Object.keys(saved).length > 0) {
          // Map DB snake_case → camelCase
          setForm({
            fullName: saved.full_name || prefill?.fullName || "",
            dob: saved.dob || prefill?.dob || "",
            gender: saved.gender || prefill?.gender || "Nam",
            idNumber: saved.id_number || prefill?.idNumber || "",
            idIssuedDate: saved.id_issued_date || prefill?.idIssuedDate || "",
            idIssuedPlace: saved.id_issued_place || prefill?.idIssuedPlace || "",
            permanentAddress: saved.permanent_address || prefill?.address || "",
            contactAddress: saved.contact_address || "",
            phone: saved.phone || prefill?.phone || "",
            email: saved.email || prefill?.email || "",
            parentName: saved.parent_name || prefill?.parentName || "",
            parentPhone: saved.parent_phone || prefill?.parentPhone || "",
            fatherName: saved.father_name || prefill?.fatherName || "",
            fatherPhone: saved.father_phone || prefill?.fatherPhone || "",
            motherName: saved.mother_name || prefill?.motherName || "",
            motherPhone: saved.mother_phone || prefill?.motherPhone || "",
            highSchool: saved.high_school || prefill?.highSchool || "",
            graduationYear: saved.graduation_year || prefill?.graduationYear || new Date().getFullYear().toString(),
            preferredCampus: saved.preferred_campus || prefill?.campusName || "",
            expectedStart: saved.expected_start || "01/09/2026",
            scholarshipApply: !!saved.scholarship_apply,
            dormitoryApply: !!saved.dormitory_apply,
            dormitoryRoomType: saved.dormitory_room_type || "",
            additionalNotes: saved.additional_notes || ""
          });
        } else if (prefill) {
          // Pre-fill from profile
          setForm(prev => ({
            ...prev,
            fullName: prefill.fullName || "",
            dob: prefill.dob || "",
            gender: prefill.gender || "Nam",
            idNumber: prefill.idNumber || "",
            idIssuedDate: prefill.idIssuedDate || "",
            idIssuedPlace: prefill.idIssuedPlace || "",
            permanentAddress: prefill.address || "",
            contactAddress: prefill.address || "",
            phone: prefill.phone || "",
            email: prefill.email || "",
            parentName: prefill.parentName || "",
            parentPhone: prefill.parentPhone || "",
            fatherName: prefill.fatherName || "",
            fatherPhone: prefill.fatherPhone || "",
            motherName: prefill.motherName || "",
            motherPhone: prefill.motherPhone || "",
            highSchool: prefill.highSchool || "",
            graduationYear: prefill.graduationYear || new Date().getFullYear().toString(),
            preferredCampus: prefill.campusName || "",
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const set = (key) => (e) => setForm(prev => ({
    ...prev,
    [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.idNumber.trim()) {
      setError("Vui lòng điền đầy đủ họ tên và số CCCD (bắt buộc).");
      return;
    }
    if (form.dormitoryApply && !form.dormitoryRoomType) {
      setError("Vui lòng chọn loại phòng ký túc xá mong muốn.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.post(`/api/student/enrollment/${id}/form`, form);
      setSubmitted(true);
      setSubmitting(false);
    } catch (err) {
      setError(err.response?.data?.error || "Gửi form thất bại. Vui lòng thử lại.");
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 400, gap: 12 }}>
      <div style={{ width: 40, height: 40, border: "4px solid #F1F5F9", borderTopColor: "#FF6B35", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <div style={{ color: "#94A3B8", fontSize: 14 }}>Đang tải form nhập học...</div>
    </div>
  );

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) return (
    <div style={{ padding: "40px 24px", maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#10B981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(16,185,129,0.35)" }}>
        <CheckCircle size={40} color="white" />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: "#065F46", marginBottom: 10 }}>Form đã được nộp! 🎉</h1>
      <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.7, marginBottom: 24 }}>
        Cảm ơn bạn đã hoàn tất form thủ tục nhập học.
        <br />
        Bước tiếp theo là thanh toán lệ phí để hoàn tất hồ sơ.
      </p>
      <div style={{ background: "linear-gradient(135deg,#ECFDF5,#D1FAE5)", borderRadius: 16, padding: "16px 24px", marginBottom: 24, display: "inline-block", border: "1px solid #6EE7B7" }}>
        <div style={{ fontSize: 13, color: "#065F46", fontWeight: 700 }}>Ngành: {appInfo.majorName}</div>
        <div style={{ fontSize: 13, color: "#065F46" }}>Campus: {appInfo.campusName}</div>
        <div style={{ fontSize: 12, color: "#047857", marginTop: 4 }}>Mã hồ sơ: {appInfo.applicationCode}</div>
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => navigate(`/student/fee-payment/${id}`)} style={{ padding: "10px 20px", background: "linear-gradient(135deg,#FF6B35,#E85A2A)", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer" }}>
          Tiến hành thanh toán
        </button>
        <button onClick={() => navigate("/student/applications")} style={{ padding: "10px 20px", background: "white", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer" }}>
          Về danh sách hồ sơ
        </button>
      </div>
    </div>
  );

  // ── Form ────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px 24px", maxWidth: 840, margin: "0 auto" }}>
      {/* Back */}
      <button type="button" onClick={() => navigate(`/student/enrollment/${id}`)} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: 13, fontWeight: 600, marginBottom: 20, padding: 0 }}>
        <ArrowLeft size={14} /> Quay lại hướng dẫn nhập học
      </button>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#FF6B35,#E85A2A)", borderRadius: 20, padding: "24px 28px", marginBottom: 20, boxShadow: "0 8px 24px rgba(255,107,53,0.3)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <GraduationCap size={28} color="white" />
            <div>
              <h1 style={{ margin: 0, color: "white", fontSize: 20, fontWeight: 900 }}>📝 Form thủ tục nhập học</h1>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 3 }}>Điền đầy đủ thông tin để hoàn tất thủ tục nhập học vào Đại học FPT</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[["📚 Ngành", appInfo.majorName], ["🏫 Campus", appInfo.campusName], ["📋 Mã hồ sơ", appInfo.applicationCode]].map(([lbl, val]) => val && (
              <div key={lbl} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "5px 12px", fontSize: 12, color: "white", fontWeight: 700 }}>
                {lbl}: {val}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "#FEF2F2", borderRadius: 12, padding: "12px 16px", marginBottom: 16, border: "1px solid #FECACA", display: "flex", gap: 10, alignItems: "center" }}>
          <AlertCircle size={16} color="#DC2626" />
          <div style={{ fontSize: 13, color: "#DC2626", fontWeight: 600 }}>{error}</div>
        </div>
      )}

      {/* Section 1: Personal info */}
      <Section icon={User} title="Thông tin cá nhân" color="#FF6B35">
        <Field label="Họ và tên" required>
          <input value={form.fullName} onChange={set("fullName")} style={inp} placeholder="Nguyễn Văn A" onFocus={e => e.target.style.borderColor="#FF6B35"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Ngày sinh" required>
          <input type="date" value={form.dob} onChange={set("dob")} style={inp} onFocus={e => e.target.style.borderColor="#FF6B35"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Giới tính" required>
          <select value={form.gender} onChange={set("gender")} style={inp}>
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        </Field>
        <Field label="Số CCCD / CMND" required>
          <input value={form.idNumber} onChange={set("idNumber")} style={inp} placeholder="012345678901" onFocus={e => e.target.style.borderColor="#FF6B35"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Ngày cấp CCCD">
          <input type="date" value={form.idIssuedDate} onChange={set("idIssuedDate")} style={inp} onFocus={e => e.target.style.borderColor="#FF6B35"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Nơi cấp CCCD">
          <input value={form.idIssuedPlace} onChange={set("idIssuedPlace")} style={inp} placeholder="Cục Cảnh sát QLHC về TTXH" onFocus={e => e.target.style.borderColor="#FF6B35"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <FullRow>
          <Field label="Địa chỉ thường trú" required>
            <input value={form.permanentAddress} onChange={set("permanentAddress")} style={inp} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" onFocus={e => e.target.style.borderColor="#FF6B35"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
          </Field>
        </FullRow>
        <FullRow>
          <Field label="Địa chỉ liên hệ (nơi nhận thư)" hint="Để trống nếu giống địa chỉ thường trú">
            <input value={form.contactAddress} onChange={set("contactAddress")} style={inp} placeholder="Địa chỉ nhận thư (nếu khác địa chỉ thường trú)" onFocus={e => e.target.style.borderColor="#FF6B35"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
          </Field>
        </FullRow>
      </Section>

      {/* Section 2: Contact */}
      <Section icon={Phone} title="Thông tin liên hệ" color="#3B82F6">
        <Field label="Số điện thoại" required>
          <input value={form.phone} onChange={set("phone")} style={inp} placeholder="09xxxxxxxx" onFocus={e => e.target.style.borderColor="#3B82F6"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Email" required>
          <input type="email" value={form.email} onChange={set("email")} style={inp} placeholder="example@email.com" onFocus={e => e.target.style.borderColor="#3B82F6"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
      </Section>

      {/* Section 3: Parent info */}
      <Section icon={Users} title="Thông tin phụ huynh" color="#8B5CF6">
        <Field label="Họ tên phụ huynh / người giám hộ">
          <input value={form.parentName} onChange={set("parentName")} style={inp} placeholder="Nguyễn Văn B" onFocus={e => e.target.style.borderColor="#8B5CF6"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Số điện thoại phụ huynh">
          <input value={form.parentPhone} onChange={set("parentPhone")} style={inp} placeholder="09xxxxxxxx" onFocus={e => e.target.style.borderColor="#8B5CF6"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Họ tên bố">
          <input value={form.fatherName} onChange={set("fatherName")} style={inp} placeholder="Họ tên bố" onFocus={e => e.target.style.borderColor="#8B5CF6"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Số điện thoại bố">
          <input value={form.fatherPhone} onChange={set("fatherPhone")} style={inp} placeholder="SĐT bố" onFocus={e => e.target.style.borderColor="#8B5CF6"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Họ tên mẹ">
          <input value={form.motherName} onChange={set("motherName")} style={inp} placeholder="Họ tên mẹ" onFocus={e => e.target.style.borderColor="#8B5CF6"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Số điện thoại mẹ">
          <input value={form.motherPhone} onChange={set("motherPhone")} style={inp} placeholder="SĐT mẹ" onFocus={e => e.target.style.borderColor="#8B5CF6"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
      </Section>

      {/* Section 4: Academic info */}
      <Section icon={BookOpen} title="Thông tin học tập" color="#10B981">
        <Field label="Trường THPT đã tốt nghiệp" required>
          <input value={form.highSchool} onChange={set("highSchool")} style={inp} placeholder="THPT Nguyễn Du, Hà Nội" onFocus={e => e.target.style.borderColor="#10B981"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Năm tốt nghiệp">
          <input value={form.graduationYear} onChange={set("graduationYear")} style={inp} placeholder="2026" onFocus={e => e.target.style.borderColor="#10B981"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
      </Section>

      {/* Section 5: Enrollment preferences */}
      <Section icon={Building} title="Thông tin nhập học" color="#F59E0B">
        <Field label="Campus đăng ký">
          <input value={form.preferredCampus} onChange={set("preferredCampus")} style={inp} placeholder="FPT Hà Nội / FPT Đà Nẵng / FPT TP.HCM / FPT Cần Thơ" onFocus={e => e.target.style.borderColor="#F59E0B"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <Field label="Dự kiến bắt đầu học">
          <input value={form.expectedStart} onChange={set("expectedStart")} style={inp} placeholder="01/09/2026" onFocus={e => e.target.style.borderColor="#F59E0B"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
        </Field>
        <FullRow>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 20 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: form.scholarshipApply ? "#FF6B35" : "#64748B", cursor: "pointer" }}>
                <input type="checkbox" checked={form.scholarshipApply} onChange={set("scholarshipApply")} style={{ accentColor: "#FF6B35", width: 16, height: 16 }} />
                🎓 Đăng ký xét học bổng
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: form.dormitoryApply ? "#FF6B35" : "#64748B", cursor: "pointer" }}>
                <input type="checkbox" checked={form.dormitoryApply} onChange={set("dormitoryApply")} style={{ accentColor: "#FF6B35", width: 16, height: 16 }} />
                🏠 Đăng ký ở ký túc xá
              </label>
            </div>
            
            {form.dormitoryApply && (
              <div style={{ maxWidth: 320, display: "flex", flexDirection: "column", gap: 6, animation: "fadeIn 0.2s" }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Lựa chọn loại phòng Ký túc xá <span style={{ color: "#EF4444", marginLeft: 3 }}>*</span>
                </label>
                <select value={form.dormitoryRoomType} onChange={set("dormitoryRoomType")} style={inp} required>
                  <option value="">-- Chọn loại phòng --</option>
                  <option value="Phòng 4 người (Điều hòa)">Phòng 4 người (Điều hòa) - 1.200.000 VNĐ/tháng</option>
                  <option value="Phòng 6 người (Điều hòa)">Phòng 6 người (Điều hòa) - 800.000 VNĐ/tháng</option>
                  <option value="Phòng 8 người (Quạt)">Phòng 8 người (Quạt) - 600.000 VNĐ/tháng</option>
                </select>
              </div>
            )}
          </div>
        </FullRow>
        <FullRow>
          <Field label="Ghi chú thêm">
            <textarea value={form.additionalNotes} onChange={set("additionalNotes")} rows={3} style={{ ...inp, resize: "vertical" }} placeholder="Các yêu cầu đặc biệt, thông tin bổ sung..." onFocus={e => e.target.style.borderColor="#F59E0B"} onBlur={e => e.target.style.borderColor="#E2E8F0"} />
          </Field>
        </FullRow>
      </Section>

      {/* Consent */}
      <div style={{ background: "#FFFBEB", borderRadius: 14, padding: "16px 20px", marginBottom: 20, border: "1px solid #FDE68A" }}>
        <div style={{ fontSize: 13, color: "#92400E", lineHeight: 1.7 }}>
          📋 <strong>Cam kết của sinh viên:</strong> Tôi xác nhận các thông tin trên là chính xác. Tôi cam kết sẽ hoàn thành các thủ tục nhập học đúng thời hạn và tuân thủ quy định của Đại học FPT.
        </div>
      </div>

      {/* Submit */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button type="button" onClick={() => navigate(`/student/enrollment/${id}`)} style={{ padding: "12px 20px", background: "white", border: "1.5px solid #E2E8F0", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer" }}>
          Hủy
        </button>
        <button type="submit" disabled={submitting} style={{
          padding: "12px 28px",
          background: submitting ? "#CBD5E1" : "linear-gradient(135deg,#FF6B35,#E85A2A)",
          border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, color: "white",
          cursor: submitting ? "not-allowed" : "pointer",
          boxShadow: submitting ? "none" : "0 4px 14px rgba(255,107,53,0.4)",
          display: "flex", alignItems: "center", gap: 8
        }}>
          {submitting
            ? "Đang gửi..."
            : <><GraduationCap size={16} /> Nộp form thủ tục nhập học ✓</>
          }
        </button>
      </div>
    </form>
  );
}

