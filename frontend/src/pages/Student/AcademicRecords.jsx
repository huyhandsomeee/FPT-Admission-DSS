import { useState } from "react";
import { BookOpen, TrendingUp, Award, ChevronDown, Calendar, Star, AlertCircle, CheckCircle, Download } from "lucide-react";

/* ── Mock data từ FACT_LEARNING + DIM tables ── */
const SEMESTERS = [
  {
    id: "FA25", label: "FA25 (Thu 2025)", status: "completed",
    gpa: 3.7, credits: 15,
    courses: [
      { code: "MAE101", name: "Mathematics for Engineering", credits: 3, grade: "A", point: 4.0, midterm: 9.2, final: 9.5, attend: 95 },
      { code: "PRF192", name: "Programming Fundamentals", credits: 3, grade: "A+", point: 4.0, midterm: 9.8, final: 9.9, attend: 100 },
      { code: "CEA201", name: "Computer Organization", credits: 3, grade: "B+", point: 3.5, midterm: 8.0, final: 8.3, attend: 90 },
      { code: "ENW492", name: "English Writing 1", credits: 3, grade: "A", point: 4.0, midterm: 9.0, final: 9.2, attend: 98 },
      { code: "OSG202", name: "Operating System", credits: 3, grade: "B+", point: 3.5, midterm: 7.8, final: 8.1, attend: 88 },
    ]
  },
  {
    id: "SP25", label: "SP25 (Spring 2025)", status: "completed",
    gpa: 3.5, credits: 15,
    courses: [
      { code: "MAD101", name: "Discrete Mathematics", credits: 3, grade: "A", point: 4.0, midterm: 9.0, final: 9.3, attend: 96 },
      { code: "OOP201", name: "Object-Oriented Programming", credits: 3, grade: "B+", point: 3.5, midterm: 8.2, final: 8.4, attend: 92 },
      { code: "DBM302", name: "Database Management", credits: 3, grade: "A", point: 4.0, midterm: 9.5, final: 9.7, attend: 100 },
      { code: "ENW392", name: "English Writing 2", credits: 3, grade: "B", point: 3.0, midterm: 7.2, final: 7.5, attend: 85 },
      { code: "SWE201", name: "Software Engineering", credits: 3, grade: "A-", point: 3.7, midterm: 8.5, final: 8.8, attend: 94 },
    ]
  },
  {
    id: "SU25", label: "SU25 (Summer 2025)", status: "completed",
    gpa: 3.8, credits: 12,
    courses: [
      { code: "WED201", name: "Web Development", credits: 3, grade: "A+", point: 4.0, midterm: 9.7, final: 9.8, attend: 100 },
      { code: "NET201", name: "Computer Networking", credits: 3, grade: "A", point: 4.0, midterm: 9.0, final: 9.2, attend: 97 },
      { code: "MLN111", name: "Machine Learning Fundamentals", credits: 3, grade: "A-", point: 3.7, midterm: 8.3, final: 8.6, attend: 93 },
      { code: "PRO192", name: "Programming OOP", credits: 3, grade: "B+", point: 3.5, midterm: 8.0, final: 8.2, attend: 89 },
    ]
  },
  {
    id: "FA26", label: "FA26 (Thu 2026 — Hiện tại)", status: "current",
    gpa: null, credits: 15,
    courses: [
      { code: "SWR302", name: "Software Testing", credits: 3, grade: null, point: null, midterm: 8.5, final: null, attend: 92 },
      { code: "IOT301", name: "Internet of Things", credits: 3, grade: null, point: null, midterm: 7.8, final: null, attend: 87 },
      { code: "AIB201", name: "AI & Big Data", credits: 3, grade: null, point: null, midterm: 9.2, final: null, attend: 98 },
      { code: "ENT496", name: "Entrepreneurship", credits: 3, grade: null, point: null, midterm: 8.0, final: null, attend: 90 },
      { code: "CAP201", name: "Capstone Project 1", credits: 3, grade: null, point: null, midterm: null, final: null, attend: 100 },
    ]
  },
];

const GRADE_COLOR = { "A+": "#16A34A", "A": "#16A34A", "A-": "#059669", "B+": "#2563EB", "B": "#2563EB", "B-": "#7C3AED", "C+": "#D97706", "C": "#D97706", null: "#9CA3AF" };
const GPA_DATA = [{ sem: "SP25", gpa: 3.5 }, { sem: "SU25", gpa: 3.8 }, { sem: "FA25", gpa: 3.7 }];
const cumulativeGpa = 3.67;
const totalCredits = 42;
const completedCredits = 42;
const requiredCredits = 150;

export default function AcademicRecords() {
  const [expandedSem, setExpandedSem] = useState("FA26");
  const [view, setView] = useState("table"); // table | grid

  const GpaBar = ({ gpa }) => {
    const pct = (gpa / 4) * 100;
    const color = gpa >= 3.6 ? "#16A34A" : gpa >= 3.2 ? "#2563EB" : gpa >= 2.5 ? "#D97706" : "#DC2626";
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, height: 6, background: "#E5E7EB", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 3 }} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{gpa}</span>
      </div>
    );
  };

  const MiniChart = () => {
    const maxH = 60;
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: maxH, padding: "0 4px" }}>
        {GPA_DATA.map((d, i) => {
          const h = (d.gpa / 4) * maxH;
          const color = d.gpa >= 3.6 ? "#16A34A" : "#2563EB";
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color }}>{d.gpa}</div>
              <div style={{ width: "100%", height: h, background: color, borderRadius: "4px 4px 0 0", opacity: 0.85 }} />
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{d.sem}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Kết quả học tập</h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>FACT_LEARNING • Academic Records Portal</p>
          </div>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#EFF6FF", border: "1.5px solid #BFDBFE", borderRadius: 10, color: "#2563EB", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Download size={14} /> Tải bảng điểm
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "GPA Tích lũy", val: cumulativeGpa, sub: "Thang điểm 4.0", icon: Star, color: "#16A34A", bg: "#F0FDF4" },
          { label: "Tín chỉ đã hoàn thành", val: `${completedCredits}`, sub: `/ ${requiredCredits} tín chỉ`, icon: CheckCircle, color: "#2563EB", bg: "#EFF6FF" },
          { label: "Học kỳ đã hoàn thành", val: "3", sub: "+ 1 đang học", icon: Calendar, color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Tiến độ học tập", val: `${Math.round(completedCredits / requiredCredits * 100)}%`, sub: "Hoàn thành chương trình", icon: TrendingUp, color: "#FF6B35", bg: "#FFF7F4" },
        ].map((c, i) => (
          <div key={i} style={{ background: c.bg, borderRadius: 14, padding: "18px 20px", border: `1px solid ${c.color}22` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <c.icon size={18} color={c.color} />
              <span style={{ fontSize: 10.5, color: c.color, fontWeight: 600 }}>DATA MART</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: "#111827" }}>{c.val}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{c.label}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>
        {/* Semester list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {SEMESTERS.map(sem => (
            <div key={sem.id} style={{ background: "#fff", borderRadius: 14, border: sem.status === "current" ? "2px solid #FF6B35" : "1px solid #E5E7EB", overflow: "hidden" }}>
              {/* Sem header */}
              <button
                onClick={() => setExpandedSem(expandedSem === sem.id ? null : sem.id)}
                style={{ width: "100%", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {sem.status === "current" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF6B35", animation: "pulse 1.5s infinite" }} />}
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{sem.label}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{sem.courses.length} môn học • {sem.credits} tín chỉ</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {sem.gpa && (
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: sem.gpa >= 3.6 ? "#16A34A" : "#2563EB" }}>{sem.gpa}</div>
                      <div style={{ fontSize: 10.5, color: "#9CA3AF" }}>GPA</div>
                    </div>
                  )}
                  {sem.status === "current" && (
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 100, background: "#FFF7F4", color: "#FF6B35", fontWeight: 700, border: "1px solid #FECABA" }}>Đang học</span>
                  )}
                  <ChevronDown size={16} color="#9CA3AF" style={{ transform: expandedSem === sem.id ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </div>
              </button>

              {/* Course table */}
              {expandedSem === sem.id && (
                <div style={{ borderTop: "1px solid #F3F4F6", overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#F9FAFB" }}>
                        {["Mã môn", "Tên môn học", "TC", "Giữa kỳ", "Cuối kỳ", "Điểm chữ", "Chuyên cần"].map(h => (
                          <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#6B7280", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sem.courses.map((c, i) => (
                        <tr key={i} style={{ borderTop: "1px solid #F9FAFB" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                          onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                        >
                          <td style={{ padding: "12px 14px", fontSize: 12.5, color: "#9CA3AF", fontWeight: 600 }}>{c.code}</td>
                          <td style={{ padding: "12px 14px", fontSize: 13.5, color: "#111827", fontWeight: 500, minWidth: 220 }}>{c.name}</td>
                          <td style={{ padding: "12px 14px", fontSize: 13, color: "#374151", textAlign: "center" }}>{c.credits}</td>
                          <td style={{ padding: "12px 14px", fontSize: 14, color: "#374151", fontWeight: 600, textAlign: "center" }}>
                            {c.midterm ?? <span style={{ color: "#9CA3AF" }}>—</span>}
                          </td>
                          <td style={{ padding: "12px 14px", fontSize: 14, color: "#374151", fontWeight: 600, textAlign: "center" }}>
                            {c.final ?? <span style={{ color: "#9CA3AF" }}>—</span>}
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <span style={{
                              fontSize: 13, fontWeight: 800, padding: "4px 12px", borderRadius: 100,
                              background: c.grade ? `${GRADE_COLOR[c.grade]}18` : "#F3F4F6",
                              color: GRADE_COLOR[c.grade] || "#9CA3AF"
                            }}>
                              {c.grade ?? "Chưa có"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px", textAlign: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                              <div style={{ width: 36, height: 5, background: "#E5E7EB", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ width: `${c.attend}%`, height: "100%", background: c.attend >= 90 ? "#16A34A" : "#D97706", borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{c.attend}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* GPA Chart sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 16 }}>GPA theo học kỳ</div>
            <MiniChart />
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #F3F4F6" }}>
              <GpaBar gpa={cumulativeGpa} />
              <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 4 }}>GPA tích lũy</div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>Tiến độ tín chỉ</div>
            <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 16px" }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#FF6B35" strokeWidth="3"
                  strokeDasharray={`${(completedCredits / requiredCredits) * 100} 100`}
                  strokeDashoffset="0" strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#FF6B35" }}>{Math.round(completedCredits / requiredCredits * 100)}%</div>
                <div style={{ fontSize: 9, color: "#9CA3AF" }}>{completedCredits}/{requiredCredits} TC</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", textAlign: "center" }}>Cần thêm {requiredCredits - completedCredits} tín chỉ để tốt nghiệp</div>
          </div>

          <div style={{ background: "#FFFBEB", borderRadius: 14, border: "1px solid #FDE68A", padding: 16, display: "flex", gap: 10 }}>
            <AlertCircle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 12.5, color: "#92400E" }}>
              Học kỳ <strong>FA26</strong> đang diễn ra. Điểm cuối kỳ sẽ được cập nhật sau khi thi kết thúc.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
