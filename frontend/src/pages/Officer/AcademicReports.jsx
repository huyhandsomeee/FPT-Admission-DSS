import { useState } from "react";
import { BarChart3, Download, Filter, TrendingUp, TrendingDown, Award, AlertCircle, CheckCircle, Users, BookOpen, Calendar } from "lucide-react";

/* ── Mock data từ FACT_LEARNING aggregated ── */
const SEMESTER = "SU25";

const OVERVIEW = {
  totalStudents: 2847, passRate: 87.3, avgGpa: 3.24, failRate: 5.2,
  retakeCount: 148, excellentCount: 312, warningCount: 89
};

const BY_PROGRAM = [
  { name: "Công nghệ thông tin", students: 980, passRate: 89.2, avgGpa: 3.31, excellent: 112, fail: 48, retake: 52 },
  { name: "Quản trị kinh doanh", students: 624, passRate: 85.7, avgGpa: 3.18, excellent: 68, fail: 38, retake: 41 },
  { name: "Ngôn ngữ Anh", students: 412, passRate: 91.3, avgGpa: 3.42, excellent: 78, fail: 24, retake: 18 },
  { name: "Thiết kế đồ họa", students: 287, passRate: 88.5, avgGpa: 3.27, excellent: 34, fail: 19, retake: 22 },
  { name: "Kỹ thuật phần mềm", students: 200, passRate: 90.1, avgGpa: 3.38, excellent: 28, fail: 14, retake: 15 },
  { name: "Điện tử Viễn thông", students: 344, passRate: 83.4, avgGpa: 3.09, excellent: 42, fail: 32, retake: 38 },
];

const BY_COURSE = [
  { code: "MAE101", name: "Mathematics for Engineering", credits: 3, enrolled: 380, passed: 304, avgScore: 7.2, difficult: true },
  { code: "PRF192", name: "Programming Fundamentals", credits: 3, enrolled: 350, passed: 329, avgScore: 8.1, difficult: false },
  { code: "CEA201", name: "Computer Organization", credits: 3, enrolled: 280, passed: 218, avgScore: 6.9, difficult: true },
  { code: "DBM302", name: "Database Management", credits: 3, enrolled: 320, passed: 300, avgScore: 8.4, difficult: false },
  { code: "WED201", name: "Web Development", credits: 3, enrolled: 290, passed: 275, avgScore: 8.0, difficult: false },
  { code: "NET201", name: "Computer Networking", credits: 3, enrolled: 240, passed: 184, avgScore: 7.0, difficult: true },
  { code: "MAD101", name: "Discrete Mathematics", credits: 3, enrolled: 310, passed: 233, avgScore: 6.8, difficult: true },
  { code: "OOP201", name: "Object-Oriented Programming", credits: 3, enrolled: 300, passed: 270, avgScore: 7.8, difficult: false },
];

const GPA_DIST = [
  { label: "Xuất sắc (3.6–4.0)", count: 312, color: "#16A34A" },
  { label: "Giỏi (3.2–3.59)", count: 684, color: "#2563EB" },
  { label: "Khá (2.5–3.19)", count: 1124, color: "#7C3AED" },
  { label: "Trung bình (2.0–2.49)", count: 579, color: "#D97706" },
  { label: "Yếu (< 2.0)", count: 148, color: "#DC2626" },
];

export default function AcademicReports() {
  const [tab, setTab] = useState("overview");
  const [semFilter, setSemFilter] = useState(SEMESTER);

  const total = GPA_DIST.reduce((a, b) => a + b.count, 0);

  const tabs = ["Tổng quan", "Theo ngành", "Theo môn học", "Phân phối GPA"];

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#059669,#047857)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Báo cáo học vụ — {SEMESTER}</h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>FACT_LEARNING • Kết quả học tập học kỳ Hè 2025</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select value={semFilter} onChange={e => setSemFilter(e.target.value)} style={{ padding: "9px 14px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 13, background: "#fff", cursor: "pointer" }}>
            {["SU25", "SP25", "FA25", "SU24"].map(s => <option key={s}>{s}</option>)}
          </select>
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 10, color: "#059669", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <Download size={14} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Tổng sinh viên", val: OVERVIEW.totalStudents.toLocaleString(), icon: Users, color: "#374151", bg: "#F9FAFB" },
          { label: "Tỷ lệ qua môn", val: `${OVERVIEW.passRate}%`, icon: CheckCircle, color: "#16A34A", bg: "#F0FDF4" },
          { label: "GPA trung bình", val: OVERVIEW.avgGpa, icon: Award, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Xuất sắc", val: OVERVIEW.excellentCount, icon: TrendingUp, color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Học lại", val: OVERVIEW.retakeCount, icon: AlertCircle, color: "#D97706", bg: "#FFFBEB" },
          { label: "Cảnh báo học vụ", val: OVERVIEW.warningCount, icon: AlertCircle, color: "#DC2626", bg: "#FFF1F2" },
        ].map((c, i) => (
          <div key={i} style={{ background: c.bg, borderRadius: 12, padding: "16px 18px", border: `1px solid ${c.color}14` }}>
            <c.icon size={18} color={c.color} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{c.val}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#F3F4F6", borderRadius: 12, padding: 4, marginBottom: 24, width: "fit-content" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(t)} style={{
            padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
            background: tab === t ? "#fff" : "transparent", color: tab === t ? "#111827" : "#6B7280",
            border: "none", cursor: "pointer", boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s", whiteSpace: "nowrap"
          }}>{t}</button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "Tổng quan" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Tổng quan kết quả học kỳ {SEMESTER}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
            {/* Pass/fail pie */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Tỷ lệ kết quả</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Đạt", pct: 87.3, color: "#16A34A" },
                  { label: "Học lại", pct: 5.2, color: "#D97706" },
                  { label: "Cảnh báo HV", pct: 3.1, color: "#DC2626" },
                  { label: "Bảo lưu", pct: 4.4, color: "#9CA3AF" },
                ].map((r, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 13.5, color: "#374151" }}>{r.label}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: r.color }}>{r.pct}%</span>
                    </div>
                    <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ width: `${r.pct}%`, height: "100%", background: r.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Top performers */}
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Sinh viên xuất sắc nhất</div>
              {["Nguyễn Minh Khoa — GPA 4.0 (SE1715)", "Trần Thị Thu — GPA 3.98 (KD1720)", "Lê Văn Nam — GPA 3.95 (SE1716)", "Phạm Lan Anh — GPA 3.93 (NN1718)", "Vũ Hồng Hà — GPA 3.91 (SE1715)"].map((sv, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: i === 0 ? "#FFFBEB" : "#F9FAFB", marginBottom: 8, border: "1px solid #F3F4F6" }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: i === 0 ? "#D97706" : "#9CA3AF", width: 20, textAlign: "center" }}>#{i + 1}</span>
                  <span style={{ fontSize: 13.5, color: "#374151" }}>{sv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* By Program tab */}
      {tab === "Theo ngành" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Ngành học", "Sinh viên", "Tỷ lệ đạt", "GPA TB", "Xuất sắc", "Học lại", "Cảnh báo HV"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BY_PROGRAM.map((p, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "#111827" }}>{p.name}</td>
                  <td style={{ padding: "14px 16px", fontSize: 14, color: "#374151" }}>{p.students.toLocaleString()}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: "#F3F4F6", borderRadius: 3, overflow: "hidden", maxWidth: 80 }}>
                        <div style={{ width: `${p.passRate}%`, height: "100%", background: p.passRate >= 90 ? "#16A34A" : p.passRate >= 85 ? "#2563EB" : "#D97706", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: p.passRate >= 90 ? "#16A34A" : p.passRate >= 85 ? "#2563EB" : "#D97706" }}>{p.passRate}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: p.avgGpa >= 3.5 ? "#16A34A" : p.avgGpa >= 3.0 ? "#2563EB" : "#D97706" }}>{p.avgGpa}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#16A34A", fontWeight: 600 }}>{p.excellent}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#D97706", fontWeight: 600 }}>{p.retake}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#DC2626", padding: "2px 8px", borderRadius: 100, background: "#FFF1F2" }}>{p.fail}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* By Course tab */}
      {tab === "Theo môn học" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Mã môn", "Tên môn", "TC", "SV đăng ký", "Đạt", "Điểm TB", "Độ khó"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BY_COURSE.map((c, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F3F4F6" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <td style={{ padding: "13px 16px", fontSize: 12.5, color: "#9CA3AF", fontWeight: 700 }}>{c.code}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13.5, fontWeight: 600, color: "#111827" }}>{c.name}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#374151", textAlign: "center" }}>{c.credits}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#374151" }}>{c.enrolled}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#16A34A" }}>{c.passed}</span>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}> ({Math.round(c.passed / c.enrolled * 100)}%)</span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: c.avgScore >= 8 ? "#16A34A" : c.avgScore >= 7 ? "#2563EB" : "#DC2626" }}>
                      {c.avgScore}
                    </span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    {c.difficult ? (
                      <span style={{ fontSize: 11.5, padding: "3px 8px", borderRadius: 100, background: "#FFF1F2", color: "#DC2626", fontWeight: 700 }}>Khó</span>
                    ) : (
                      <span style={{ fontSize: 11.5, padding: "3px 8px", borderRadius: 100, background: "#F0FDF4", color: "#16A34A", fontWeight: 700 }}>Bình thường</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* GPA Distribution tab */}
      {tab === "Phân phối GPA" && (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 24 }}>Phân phối GPA — {SEMESTER}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {GPA_DIST.map((d, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: d.color }} />
                    <span style={{ fontSize: 14, color: "#374151" }}>{d.label}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: d.color }}>{d.count.toLocaleString()}</span>
                    <span style={{ fontSize: 12.5, color: "#9CA3AF" }}> ({Math.round(d.count / total * 100)}%)</span>
                  </div>
                </div>
                <div style={{ height: 16, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${(d.count / total) * 100}%`, height: "100%", background: d.color, borderRadius: 4, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: 16, background: "#F9FAFB", borderRadius: 10, display: "flex", justifyContent: "space-around" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{OVERVIEW.avgGpa}</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>GPA trung bình</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#16A34A" }}>{((312 / total) * 100).toFixed(1)}%</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Tỷ lệ xuất sắc</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#DC2626" }}>{((148 / total) * 100).toFixed(1)}%</div>
              <div style={{ fontSize: 12, color: "#6B7280" }}>Tỷ lệ yếu kém</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
