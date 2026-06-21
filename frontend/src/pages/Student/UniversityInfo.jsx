import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap, MapPin, ArrowRight, CheckCircle,
  ChevronDown, ChevronUp, Cpu, Globe, Brush, Radio, BarChart3
} from "lucide-react";

// ──────────────────────────────────────────────
// Static Data
// ──────────────────────────────────────────────
const ADMISSION_METHODS = [
  {
    id: 1, title: "Xét điểm thi THPT Quốc gia", icon: "📋", color: "#FF6B35", bg: "#FFF7F4",
    desc: "Sử dụng kết quả thi tốt nghiệp THPT để xét tuyển theo tổ hợp môn phù hợp với ngành đăng ký.",
    requirements: ["Điểm xét tuyển ≥ 15 điểm (3 môn)", "Tốt nghiệp THPT", "Không có môn nào = 0 điểm"],
    note: "Áp dụng cho tất cả ngành đào tạo"
  },
  {
    id: 2, title: "Xét học bạ THPT", icon: "📚", color: "#2563EB", bg: "#EFF6FF",
    desc: "Xét tuyển dựa vào điểm trung bình các môn học 3 năm THPT, phù hợp với tổ hợp môn của ngành.",
    requirements: ["GPA 3 năm ≥ 6.5/10", "Học lực đạt Khá trở lên", "Hạnh kiểm đạt Tốt/Khá"],
    note: "Xét theo học bạ THPT (lớp 10, 11, 12)"
  },
  {
    id: 3, title: "Xét kết quả thi Đánh giá Năng lực", icon: "🎯", color: "#7C3AED", bg: "#F5F3FF",
    desc: "Xét tuyển theo kết quả kỳ thi Đánh giá Năng lực của ĐHQG Hà Nội hoặc TP.HCM.",
    requirements: ["ĐGNL ĐHQG HN: ≥ 75/150 điểm", "ĐGNL ĐHQG HCM: ≥ 600/1200 điểm", "Tốt nghiệp THPT"],
    note: "Ưu tiên điểm cao nhất trong các lần thi"
  },
  {
    id: 4, title: "Xét kết quả thi SAT / ACT", icon: "🌍", color: "#059669", bg: "#ECFDF5",
    desc: "Dành cho học sinh có chứng chỉ quốc tế SAT hoặc ACT, thể hiện năng lực học thuật cao.",
    requirements: ["SAT ≥ 1100/1600 điểm", "ACT ≥ 25/36 điểm", "Tốt nghiệp THPT"],
    note: "Ưu tiên học bổng cho điểm SAT/ACT cao"
  },
];

const MAJORS = [
  {
    faculty: "Công nghệ thông tin", icon: Cpu, color: "#FF6B35",
    programs: [
      { name: "Kỹ thuật phần mềm (SE)", quota: 1200, tuition: "32.700.000" },
      { name: "Trí tuệ nhân tạo (AI)", quota: 800, tuition: "34.500.000" },
      { name: "An toàn thông tin (IS)", quota: 400, tuition: "32.700.000" },
      { name: "Hệ thống thông tin (IT)", quota: 600, tuition: "32.700.000" },
    ]
  },
  {
    faculty: "Quản trị kinh doanh", icon: BarChart3, color: "#2563EB",
    programs: [
      { name: "Quản trị kinh doanh (BA)", quota: 600, tuition: "30.500.000" },
      { name: "Kinh doanh quốc tế (IB)", quota: 400, tuition: "30.500.000" },
      { name: "Digital Marketing", quota: 300, tuition: "30.500.000" },
    ]
  },
  {
    faculty: "Ngôn ngữ & Truyền thông", icon: Globe, color: "#7C3AED",
    programs: [
      { name: "Ngôn ngữ Anh (LL)", quota: 500, tuition: "28.800.000" },
      { name: "Ngôn ngữ Nhật (JL)", quota: 300, tuition: "28.800.000" },
      { name: "Truyền thông đa phương tiện (MC)", quota: 400, tuition: "30.500.000" },
    ]
  },
  {
    faculty: "Thiết kế & Nghệ thuật", icon: Brush, color: "#D97706",
    programs: [
      { name: "Thiết kế mỹ thuật số (GD)", quota: 300, tuition: "32.000.000" },
      { name: "Thiết kế nội thất (ID)", quota: 200, tuition: "32.000.000" },
    ]
  },
  {
    faculty: "Kỹ thuật & Công nghệ", icon: Radio, color: "#059669",
    programs: [
      { name: "Kỹ thuật điện tử - Viễn thông (EE)", quota: 400, tuition: "32.700.000" },
    ]
  },
];

const SCHOLARSHIPS = [
  {
    name: "Học bổng Tài năng FPT", icon: "🏆", color: "#FF6B35", value: "Lên đến 100%",
    conditions: ["Điểm thi THPT ≥ 27 điểm (3 môn)", "SAT ≥ 1400 hoặc ACT ≥ 32", "Huy chương Quốc gia / Quốc tế", "GPA ≥ 9.0 (3 năm THPT)"],
    duration: "Toàn khóa học (miễn giảm tự động)"
  },
  {
    name: "Học bổng Khuyến học", icon: "📖", color: "#2563EB", value: "30% - 70%",
    conditions: ["Điểm THPT từ 24 - 26.99 điểm", "SAT ≥ 1200 hoặc ACT ≥ 27", "GPA ≥ 8.5 (3 năm THPT)"],
    duration: "Học kỳ 1 (gia hạn nếu duy trì GPA ≥ 3.2/4)"
  },
  {
    name: "Học bổng Thể thao & Văn nghệ", icon: "⭐", color: "#7C3AED", value: "20% - 50%",
    conditions: ["Thành tích thể thao cấp tỉnh/quốc gia", "Nghệ sĩ / vận động viên xuất sắc", "Hồ sơ xét duyệt riêng"],
    duration: "Theo kỳ học, gia hạn theo điều kiện"
  },
  {
    name: "Học bổng Doanh nghiệp Đối tác", icon: "🤝", color: "#059669", value: "20% - 100%",
    conditions: ["Do doanh nghiệp đối tác tài trợ", "Cam kết làm việc sau tốt nghiệp", "Điều kiện theo từng doanh nghiệp"],
    duration: "Toàn khóa hoặc theo thỏa thuận"
  },
];

const CAMPUSES = [
  { name: "Hà Nội", address: "Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long", students: "15,000+", color: "#FF6B35" },
  { name: "TP. Hồ Chí Minh", address: "Lô E2a-7, Đường D1, Long Thạnh Mỹ, Quận 9", students: "18,000+", color: "#2563EB" },
  { name: "Đà Nẵng", address: "Khu đô thị FPT City, Ngũ Hành Sơn", students: "8,000+", color: "#7C3AED" },
  { name: "Cần Thơ", address: "Khu đô thị Trường Thịnh, Bình Thủy", students: "4,000+", color: "#059669" },
  { name: "Quy Nhơn", address: "Khu đô thị mới An Phú Thịnh, TP. Quy Nhơn", students: "3,000+", color: "#D97706" },
];

const INFO_TABS = [
  { id: "about", label: "Giới thiệu trường", icon: "🏫" },
  { id: "admission", label: "Phương thức tuyển sinh", icon: "📋" },
  { id: "majors", label: "Ngành học", icon: "🎓" },
  { id: "tuition", label: "Học phí", icon: "💰" },
  { id: "scholarship", label: "Học bổng", icon: "🎁" },
];

// ──────────────────────────────────────────────
// Section Components
// ──────────────────────────────────────────────
function AboutSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{
        background: "linear-gradient(135deg, #FF6B35 0%, #E85A2A 50%, #C8420E 100%)",
        borderRadius: "16px", padding: "28px", color: "white", position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", right: "-30px", top: "-30px", width: "150px", height: "150px", background: "rgba(255,255,255,0.07)", borderRadius: "50%" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <div style={{ width: "48px", height: "48px", background: "white", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#EA580C", fontWeight: 900, fontSize: "22px" }}>F</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "18px" }}>FPT University</div>
              <div style={{ fontSize: "13px", opacity: 0.85 }}>Trường Đại học FPT</div>
            </div>
          </div>
          <p style={{ fontSize: "14px", lineHeight: "1.7", opacity: 0.92, maxWidth: "680px" }}>
            Trường Đại học FPT là trường đại học tư thục đầu tiên do một doanh nghiệp thành lập tại Việt Nam.
            Được thành lập năm 2006 bởi Tập đoàn FPT, nhà trường đào tạo nguồn nhân lực chất lượng cao
            đáp ứng nhu cầu của thị trường lao động trong nước và quốc tế.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {[
          { value: "48,000+", label: "Sinh viên", icon: "👨‍🎓" },
          { value: "5 cơ sở", label: "Toàn quốc", icon: "🏛️" },
          { value: "Top 3", label: "ĐH tư thục VN", icon: "🏆" },
          { value: "500+", label: "Đối tác doanh nghiệp", icon: "🤝" },
        ].map((stat) => (
          <div key={stat.label} className="student-card" style={{ textAlign: "center", padding: "20px 16px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{stat.icon}</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#FF6B35" }}>{stat.value}</div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="student-card" style={{ padding: "24px" }}>
        <h4 style={{ fontWeight: "700", color: "#1E293B", marginBottom: "16px", fontSize: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
          <MapPin size={16} color="#FF6B35" /> Các cơ sở đào tạo
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {CAMPUSES.map((campus) => (
            <div key={campus.name} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 14px", background: "#F8FAFC", borderRadius: "12px", border: "1px solid #F1F5F9" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: `${campus.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <MapPin size={16} color={campus.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "600", color: "#1E293B", fontSize: "13px" }}>{campus.name}</div>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{campus.address}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: campus.color }}>{campus.students}</div>
                <div style={{ fontSize: "11px", color: "#94A3B8" }}>sinh viên</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
          { icon: "🌐", title: "Chuẩn quốc tế", desc: "Chương trình đào tạo tiên tiến, hợp tác với 100+ trường ĐH uy tín thế giới" },
          { icon: "💼", title: "Kết nối doanh nghiệp", desc: "Liên kết với 500+ doanh nghiệp, cơ hội thực tập & việc làm hấp dẫn" },
          { icon: "🏅", title: "Kiểm định chất lượng", desc: "Được kiểm định bởi ABET (Mỹ) - tổ chức kiểm định hàng đầu thế giới" },
          { icon: "🤖", title: "Công nghệ tiên phong", desc: "Đi đầu đào tạo AI, IoT, Blockchain, Data Science tại Việt Nam" },
        ].map((item) => (
          <div key={item.title} className="student-card" style={{ padding: "20px" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>{item.icon}</div>
            <div style={{ fontWeight: "700", color: "#1E293B", fontSize: "14px", marginBottom: "6px" }}>{item.title}</div>
            <div style={{ fontSize: "12px", color: "#64748B", lineHeight: "1.6" }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdmissionSection() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ padding: "16px 20px", background: "#FFF7F4", borderRadius: "14px", border: "1px solid #FFEDD5" }}>
        <div style={{ fontWeight: "700", color: "#C2410C", fontSize: "14px", marginBottom: "4px" }}>📅 Lịch xét tuyển 2026</div>
        <div style={{ fontSize: "13px", color: "#9A3412", lineHeight: "1.6" }}>
          Đợt 1: 01/03 - 30/03/2026 &nbsp;|&nbsp; Đợt 2: 01/04 - 30/04/2026 &nbsp;|&nbsp; Đợt 3: 01/05 - 31/07/2026
        </div>
      </div>

      {ADMISSION_METHODS.map((method) => (
        <div key={method.id} className="student-card" style={{ padding: "0", overflow: "hidden" }}>
          <button
            onClick={() => setExpanded(expanded === method.id ? null : method.id)}
            style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "20px 24px", display: "flex", alignItems: "center", gap: "14px", textAlign: "left" }}
          >
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: method.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
              {method.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", color: "#1E293B", fontSize: "14px" }}>Phương thức {method.id}: {method.title}</div>
              <div style={{ fontSize: "12px", color: "#64748B", marginTop: "3px" }}>{method.note}</div>
            </div>
            <div style={{ color: method.color, flexShrink: 0 }}>
              {expanded === method.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>
          {expanded === method.id && (
            <div style={{ padding: "0 24px 20px", borderTop: "1px solid #F1F5F9" }}>
              <p style={{ fontSize: "13px", color: "#475569", lineHeight: "1.7", margin: "16px 0 14px" }}>{method.desc}</p>
              <div style={{ background: method.bg, borderRadius: "12px", padding: "14px 16px" }}>
                <div style={{ fontWeight: "600", color: method.color, fontSize: "13px", marginBottom: "10px" }}>📌 Điều kiện xét tuyển:</div>
                {method.requirements.map((req, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "6px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: method.color, flexShrink: 0, marginTop: "5px" }} />
                    <span style={{ fontSize: "13px", color: "#374151" }}>{req}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "14px" }}>
                <Link to="/student/apply" className="student-btn-primary" style={{ fontSize: "13px", padding: "10px 20px", borderRadius: "10px", display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}>
                  Nộp hồ sơ theo phương thức này <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MajorsSection() {
  const [selectedFaculty, setSelectedFaculty] = useState(0);
  const current = MAJORS[selectedFaculty];
  const IconComponent = current.icon;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {MAJORS.map((faculty, idx) => {
          const FI = faculty.icon;
          const isActive = idx === selectedFaculty;
          return (
            <button key={faculty.faculty} onClick={() => setSelectedFaculty(idx)} style={{
              padding: "8px 16px", borderRadius: "10px",
              border: `1.5px solid ${isActive ? faculty.color : "#E2E8F0"}`,
              background: isActive ? `${faculty.color}12` : "white",
              color: isActive ? faculty.color : "#64748B",
              fontWeight: isActive ? "700" : "500",
              fontSize: "13px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s"
            }}>
              <FI size={14} /> {faculty.faculty}
            </button>
          );
        })}
      </div>

      <div className="student-card" style={{ padding: "0", overflow: "hidden" }}>
        <div style={{ padding: "18px 22px", borderBottom: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: `${current.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconComponent size={18} color={current.color} />
          </div>
          <div>
            <div style={{ fontWeight: "700", color: "#1E293B", fontSize: "15px" }}>Khoa {current.faculty}</div>
            <div style={{ fontSize: "12px", color: "#64748B" }}>{current.programs.length} chương trình đào tạo</div>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                <th style={{ padding: "12px 22px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Chương trình</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Chỉ tiêu</th>
                <th style={{ padding: "12px 22px", textAlign: "right", fontSize: "12px", fontWeight: "700", color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>Học phí/năm</th>
              </tr>
            </thead>
            <tbody>
              {current.programs.map((prog, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "14px 22px" }}>
                    <div style={{ fontWeight: "600", color: "#1E293B", fontSize: "13px" }}>{prog.name}</div>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "center" }}>
                    <span style={{ padding: "4px 10px", background: `${current.color}12`, color: current.color, borderRadius: "8px", fontSize: "12px", fontWeight: "700" }}>
                      {prog.quota.toLocaleString()} SV
                    </span>
                  </td>
                  <td style={{ padding: "14px 22px", textAlign: "right" }}>
                    <div style={{ fontWeight: "700", color: "#059669", fontSize: "14px" }}>{prog.tuition} đ</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "14px 22px", borderTop: "1px solid #F1F5F9", background: "#FAFAFA" }}>
          <Link to="/student/apply" style={{ color: current.color, fontSize: "13px", fontWeight: "600", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px" }}>
            Đăng ký ngành này <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div style={{ padding: "14px 18px", background: "#F0FDF4", borderRadius: "12px", border: "1px solid #BBF7D0" }}>
        <div style={{ fontSize: "13px", color: "#166534", lineHeight: "1.6" }}>
          <strong>📌 Lưu ý:</strong> Học phí có thể thay đổi theo từng năm học. Chương trình đào tạo bằng tiếng Anh hoàn toàn,
          tích hợp thực tập doanh nghiệp từ năm 3. Sinh viên được tham gia trao đổi quốc tế tại các đối tác của FPT trên toàn thế giới.
        </div>
      </div>
    </div>
  );
}

function TuitionSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {[
          { label: "Học phí thấp nhất/năm", value: "~28.8 triệu", desc: "Ngành Ngôn ngữ", color: "#059669", icon: "💚" },
          { label: "Học phí trung bình/năm", value: "~31 triệu", desc: "Phổ biến các ngành", color: "#FF6B35", icon: "🔶" },
          { label: "Học phí cao nhất/năm", value: "~34.5 triệu", desc: "Ngành AI / Chuyên biệt", color: "#7C3AED", icon: "💜" },
        ].map((item) => (
          <div key={item.label} className="student-card" style={{ textAlign: "center", padding: "22px 16px" }}>
            <div style={{ fontSize: "26px", marginBottom: "8px" }}>{item.icon}</div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: item.color }}>{item.value}</div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "6px" }}>{item.label}</div>
            <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>{item.desc}</div>
          </div>
        ))}
      </div>

      <div className="student-card" style={{ padding: "24px" }}>
        <h4 style={{ fontWeight: "700", color: "#1E293B", marginBottom: "18px", fontSize: "15px" }}>💰 Chi tiết học phí theo khoa</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { faculty: "Công nghệ thông tin (SE, IS, IT)", fee: "32.700.000", color: "#FF6B35", pct: 85 },
            { faculty: "Trí tuệ nhân tạo (AI)", fee: "34.500.000", color: "#7C3AED", pct: 95 },
            { faculty: "Quản trị kinh doanh (BA, IB)", fee: "30.500.000", color: "#2563EB", pct: 78 },
            { faculty: "Truyền thông đa phương tiện (MC)", fee: "30.500.000", color: "#D97706", pct: 78 },
            { faculty: "Thiết kế mỹ thuật số (GD, ID)", fee: "32.000.000", color: "#059669", pct: 82 },
            { faculty: "Ngôn ngữ Anh / Nhật (LL, JL)", fee: "28.800.000", color: "#0891B2", pct: 70 },
            { faculty: "Kỹ thuật điện tử - Viễn thông (EE)", fee: "32.700.000", color: "#4F46E5", pct: 85 },
          ].map((item) => (
            <div key={item.faculty}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>{item.faculty}</span>
                <span style={{ fontSize: "13px", fontWeight: "700", color: item.color }}>{item.fee} đ/năm</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "#F1F5F9", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ width: `${item.pct}%`, height: "100%", background: item.color, borderRadius: "99px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="student-card" style={{ padding: "24px" }}>
        <h4 style={{ fontWeight: "700", color: "#1E293B", marginBottom: "16px", fontSize: "15px" }}>💳 Hình thức đóng học phí</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { icon: "📆", title: "Đóng theo kỳ", desc: "Mỗi học kỳ 1 lần, khoảng 16-17 triệu đồng/kỳ" },
            { icon: "📅", title: "Đóng theo năm", desc: "Đóng toàn bộ 1 năm, được giảm nhẹ phí quản lý" },
            { icon: "🏦", title: "Vay ngân hàng", desc: "Hỗ trợ vay vốn qua Ngân hàng Chính sách xã hội" },
            { icon: "📋", title: "Trả góp 0%", desc: "Hỗ trợ trả góp không lãi suất với đối tác tài chính" },
          ].map((item) => (
            <div key={item.title} style={{ padding: "14px 16px", background: "#F8FAFC", borderRadius: "12px", border: "1px solid #F1F5F9" }}>
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ fontWeight: "600", color: "#1E293B", fontSize: "13px" }}>{item.title}</div>
              <div style={{ fontSize: "12px", color: "#64748B", marginTop: "4px", lineHeight: "1.5" }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "14px 18px", background: "#FFF7F4", borderRadius: "12px", border: "1px solid #FFEDD5" }}>
        <p style={{ fontSize: "13px", color: "#9A3412", lineHeight: "1.6", margin: 0 }}>
          <strong>📌 Lưu ý:</strong> Học phí trên đây là mức của năm học 2025-2026 và có thể điều chỉnh.
          Chưa bao gồm chi phí ký túc xá (~1.5-2 triệu/tháng), giáo trình và các khoản phát sinh khác.
        </p>
      </div>
    </div>
  );
}

function ScholarshipSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ padding: "20px 24px", background: "linear-gradient(135deg, #FF6B35, #E85A2A)", borderRadius: "16px", color: "white" }}>
        <div style={{ fontSize: "20px", fontWeight: "800", marginBottom: "6px" }}>🎁 Chương trình học bổng 2026</div>
        <div style={{ fontSize: "13px", opacity: 0.9 }}>FPT University dành tổng giá trị học bổng <strong>hơn 100 tỷ đồng</strong> mỗi năm cho sinh viên xuất sắc</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {SCHOLARSHIPS.map((sch) => (
          <div key={sch.name} className="student-card" style={{ padding: "22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <div style={{ fontSize: "28px" }}>{sch.icon}</div>
              <div>
                <div style={{ fontWeight: "700", color: "#1E293B", fontSize: "13px" }}>{sch.name}</div>
                <div style={{ fontSize: "20px", fontWeight: "800", color: sch.color, marginTop: "2px" }}>{sch.value}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
              {sch.conditions.map((cond, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                  <CheckCircle size={13} color={sch.color} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "12px", color: "#475569" }}>{cond}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "8px 12px", background: `${sch.color}10`, borderRadius: "8px" }}>
              <span style={{ fontSize: "11px", color: sch.color, fontWeight: "600" }}>⏱ {sch.duration}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="student-card" style={{ padding: "24px" }}>
        <h4 style={{ fontWeight: "700", color: "#1E293B", marginBottom: "20px", fontSize: "15px" }}>📝 Quy trình đăng ký học bổng</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
          <div style={{ position: "absolute", left: "19px", top: "0", bottom: "0", width: "2px", background: "#E2E8F0", zIndex: 0 }} />
          {[
            { step: "1", title: "Nộp hồ sơ xét tuyển", desc: "Hoàn thành hồ sơ đăng ký tuyển sinh trên cổng thông tin" },
            { step: "2", title: "Khai báo thông tin học bổng", desc: "Điền thông tin thành tích, giải thưởng trong mục học bổng" },
            { step: "3", title: "Nộp minh chứng", desc: "Upload bằng chứng thành tích (học bạ, giấy khen, bằng thi...)" },
            { step: "4", title: "Kết quả xét duyệt", desc: "Nhận thông báo kết quả học bổng cùng với kết quả tuyển sinh" },
          ].map((item) => (
            <div key={item.step} style={{ display: "flex", alignItems: "flex-start", gap: "14px", position: "relative", zIndex: 1 }}>
              <div style={{
                width: "38px", height: "38px", borderRadius: "50%",
                background: "linear-gradient(135deg, #FF6B35, #E85A2A)",
                color: "white", fontWeight: "800", fontSize: "14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, boxShadow: "0 4px 12px rgba(255,107,53,0.3)"
              }}>
                {item.step}
              </div>
              <div style={{ paddingTop: "8px" }}>
                <div style={{ fontWeight: "600", color: "#1E293B", fontSize: "13px" }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "3px", lineHeight: "1.5" }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "28px", background: "#F8FAFC", borderRadius: "16px", border: "1px solid #F1F5F9" }}>
        <div style={{ fontSize: "24px", marginBottom: "10px" }}>🚀</div>
        <div style={{ fontWeight: "700", color: "#1E293B", fontSize: "16px", marginBottom: "8px" }}>Đừng bỏ lỡ cơ hội học bổng!</div>
        <div style={{ fontSize: "13px", color: "#64748B", marginBottom: "20px" }}>Nộp hồ sơ sớm để được ưu tiên xét học bổng và tư vấn 1-1 cùng cán bộ nhà trường.</div>
        <Link to="/student/apply" className="student-btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          Nộp hồ sơ & Đăng ký học bổng <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Page Component
// ──────────────────────────────────────────────
export default function UniversityInfo() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px", padding: "8px 0" }}>
      {/* Page Header Banner */}
      <div style={{
        background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
        borderRadius: "20px", padding: "28px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", right: "-20px", top: "-20px", width: "200px", height: "200px", background: "rgba(255,107,53,0.07)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", right: "80px", bottom: "-40px", width: "120px", height: "120px", background: "rgba(255,107,53,0.04)", borderRadius: "50%" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <GraduationCap size={24} color="#FF6B35" />
            <h1 style={{ color: "white", fontWeight: "800", fontSize: "20px", margin: 0 }}>
              Thông tin tuyển sinh FPT University 2026
            </h1>
          </div>
          <p style={{ color: "rgba(148,163,184,1)", fontSize: "13px", margin: 0 }}>
            Tìm hiểu đầy đủ về trường, phương thức xét tuyển, ngành học, học phí & học bổng trước khi nộp hồ sơ
          </p>
        </div>
        <Link to="/student/apply" className="student-btn-primary" style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          textDecoration: "none", flexShrink: 0, position: "relative", zIndex: 1
        }}>
          Nộp hồ sơ ngay <ArrowRight size={16} />
        </Link>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {INFO_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 20px", borderRadius: "12px", cursor: "pointer",
              fontSize: "13px", fontWeight: "600",
              background: activeTab === tab.id
                ? "linear-gradient(135deg, #FF6B35, #E85A2A)"
                : "white",
              color: activeTab === tab.id ? "white" : "#64748B",
              boxShadow: activeTab === tab.id
                ? "0 4px 12px rgba(232,90,42,0.3)"
                : "0 1px 3px rgba(0,0,0,0.06)",
              border: activeTab === tab.id ? "none" : "1px solid #F1F5F9",
              transition: "all 0.2s",
              display: "flex", alignItems: "center", gap: "6px",
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ animation: "fadeIn 0.3s ease-out" }}>
        {activeTab === "about" && <AboutSection />}
        {activeTab === "admission" && <AdmissionSection />}
        {activeTab === "majors" && <MajorsSection />}
        {activeTab === "tuition" && <TuitionSection />}
        {activeTab === "scholarship" && <ScholarshipSection />}
      </div>
    </div>
  );
}
