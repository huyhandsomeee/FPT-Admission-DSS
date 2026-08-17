import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Camera, Shield, CheckCircle, Clock, Award, BookOpen, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

/* ── Mock profile data (DIM_STUDENT) ── */
const MOCK_PROFILE = {
  student_key: "STU2023-001234",
  student_code: "HS172345",
  full_name: "Nguyễn Minh Khoa",
  citizen_id: "079203012345",
  date_of_birth: "15/03/2005",
  gender: "Nam",
  email: "khoamn@fpt.edu.vn",
  phone: "0912345678",
  personal_email: "khoamn2005@gmail.com",
  religion_code: "Không",
  priority_group: "UT1",
  ethnicity_code: "Kinh",
  admission_year: 2023,
  current_status: "Đang học",
  campus: "Hà Nội",
  program: "Công nghệ thông tin",
  faculty: "Khoa Công nghệ thông tin",
  class_code: "SE1715",
  academic_advisor: "ThS. Nguyễn Văn Hùng",
  address: {
    province: "Hà Nội",
    district: "Cầu Giấy",
    ward: "Dịch Vọng Hậu",
    detail: "123 Trần Thái Tông"
  },
  hometown: {
    province: "Nghệ An",
    district: "TP. Vinh",
    ward: "Trường Thi"
  },
  father: { name: "Nguyễn Văn Bình", phone: "0923456789", job: "Kỹ sư" },
  mother: { name: "Trần Thị Lan", phone: "0934567890", job: "Giáo viên" },
  high_school: "THPT Phan Đình Phùng, Hà Nội",
  admission_score: 24.75,
  admission_method: "THPT Quốc Gia 2023",
  scholarship: "Học bổng Thủ khoa FA25",
};

const Field = ({ label, val, icon: Icon, full = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4, gridColumn: full ? "1 / -1" : undefined }}>
    <label style={{ fontSize: 11.5, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>
      {label}
    </label>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#F9FAFB", borderRadius: 8, border: "1px solid #F3F4F6" }}>
      {Icon && <Icon size={14} color="#9CA3AF" />}
      <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{val || "—"}</span>
    </div>
  </div>
);

export default function StudentProfile() {
  const { user } = useAuth();
  const p = MOCK_PROFILE;
  const [editMode, setEditMode] = useState(false);
  const [tab, setTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Thông tin cá nhân" },
    { id: "academic", label: "Học vụ" },
    { id: "family", label: "Gia đình" },
    { id: "admission", label: "Tuyển sinh" },
  ];

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1000, margin: "0 auto" }}>
      {/* Profile hero */}
      <div style={{
        background: "linear-gradient(135deg, #0d1b3e 0%, #1A3A6C 100%)", borderRadius: 20,
        padding: 28, marginBottom: 24, position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,107,53,0.1)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div style={{
              width: 84, height: 84, borderRadius: 20, background: "linear-gradient(135deg,#FF6B35,#E85A2A)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "3px solid rgba(255,255,255,0.2)"
            }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>
                {p.full_name.split(" ").pop()[0]}
              </span>
            </div>
            <button style={{ position: "absolute", bottom: -4, right: -4, width: 26, height: 26, borderRadius: "50%", background: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
              <Camera size={13} color="#374151" />
            </button>
          </div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>{p.full_name}</div>
            <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{p.student_code}</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>•</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{p.class_code}</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>•</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{p.campus}</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,107,53,0.9)", marginTop: 4 }}>{p.program}</div>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { label: p.current_status, color: "#16A34A" },
              { label: p.priority_group, color: "#7C3AED" },
            ].map((b, i) => (
              <span key={i} style={{
                padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700,
                background: `${b.color}20`, color: b.color, border: `1px solid ${b.color}44`
              }}>
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginTop: 20 }}>
          {[
            { label: "Mã sinh viên", val: p.student_key },
            { label: "Năm nhập học", val: p.admission_year },
            { label: "Điểm đầu vào", val: p.admission_score },
            { label: "Học bổng", val: "Có" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.07)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit toggle */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button onClick={() => setEditMode(m => !m)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "9px 18px",
          background: editMode ? "linear-gradient(135deg,#FF6B35,#E85A2A)" : "#fff",
          border: "1.5px solid #E5E7EB", borderRadius: 10,
          color: editMode ? "#fff" : "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer"
        }}>
          {editMode ? <Save size={14} /> : <Edit2 size={14} />}
          {editMode ? "Lưu thông tin" : "Chỉnh sửa"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#F3F4F6", borderRadius: 12, padding: 4, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "9px 12px", borderRadius: 8, fontSize: 13.5, fontWeight: 600,
            background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#111827" : "#6B7280",
            border: "none", cursor: "pointer", boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s"
          }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 28 }}>
        {tab === "personal" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Field label="Họ và tên" val={p.full_name} icon={User} full />
            <Field label="Ngày sinh" val={p.date_of_birth} icon={Calendar} />
            <Field label="Giới tính" val={p.gender} icon={User} />
            <Field label="Số CCCD/CMND" val={p.citizen_id} icon={Shield} />
            <Field label="Dân tộc" val={p.ethnicity_code} />
            <Field label="Email trường" val={p.email} icon={Mail} />
            <Field label="Email cá nhân" val={p.personal_email} icon={Mail} />
            <Field label="Số điện thoại" val={p.phone} icon={Phone} />
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 12, paddingTop: 8, borderTop: "1px solid #F3F4F6" }}>Địa chỉ thường trú</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field label="Tỉnh/Thành phố" val={p.address.province} icon={MapPin} />
                <Field label="Quận/Huyện" val={p.address.district} />
                <Field label="Phường/Xã" val={p.address.ward} />
                <Field label="Địa chỉ chi tiết" val={p.address.detail} />
              </div>
            </div>
          </div>
        )}

        {tab === "academic" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Field label="Mã lớp" val={p.class_code} icon={BookOpen} />
            <Field label="Cơ sở" val={p.campus} icon={MapPin} />
            <Field label="Ngành học" val={p.program} full />
            <Field label="Khoa" val={p.faculty} full />
            <Field label="Cố vấn học tập" val={p.academic_advisor} icon={User} full />
            <Field label="Trạng thái" val={p.current_status} icon={CheckCircle} />
            <Field label="Năm nhập học" val={p.admission_year} icon={Calendar} />
            <Field label="THPT" val={p.high_school} icon={BookOpen} full />
          </div>
        )}

        {tab === "family" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[{ label: "Cha", data: p.father }, { label: "Mẹ", data: p.mother }].map((f, i) => (
              <div key={i}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 14 }}>Thông tin {f.label}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                  <Field label="Họ và tên" val={f.data.name} icon={User} />
                  <Field label="Số điện thoại" val={f.data.phone} icon={Phone} />
                  <Field label="Nghề nghiệp" val={f.data.job} />
                </div>
              </div>
            ))}
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 14 }}>Quê quán</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
                <Field label="Tỉnh/Thành" val={p.hometown.province} icon={MapPin} />
                <Field label="Quận/Huyện" val={p.hometown.district} />
                <Field label="Phường/Xã" val={p.hometown.ward} />
              </div>
            </div>
          </div>
        )}

        {tab === "admission" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <Field label="Phương thức xét tuyển" val={p.admission_method} icon={Shield} full />
            <Field label="Điểm đầu vào" val={`${p.admission_score} điểm`} icon={Award} />
            <Field label="Nhóm ưu tiên" val={p.priority_group} />
            <Field label="Học bổng" val={p.scholarship} icon={Award} full />
            <Field label="Trường THPT" val={p.high_school} icon={BookOpen} full />
          </div>
        )}
      </div>

      {/* DIM_STUDENT source note */}
      <div style={{ marginTop: 16, padding: 12, background: "#F0FDF4", borderRadius: 10, display: "flex", gap: 8, alignItems: "center" }}>
        <CheckCircle size={14} color="#16A34A" />
        <span style={{ fontSize: 12, color: "#15803D" }}>
          Dữ liệu từ <strong>DIM_STUDENT</strong> trong Data Warehouse • Đồng bộ lần cuối: 17/08/2026 14:30
        </span>
      </div>
    </div>
  );
}
