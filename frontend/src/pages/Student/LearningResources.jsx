import { useState } from "react";
import { BookOpen, Video, FileText, Search, Star, Clock, Download, ExternalLink, Book, Headphones, Monitor, Filter } from "lucide-react";

/* ── Mock data từ FACT_LMS + FACT_LIBRARY ── */
const COURSES_LMS = [
  { id: 1, code: "AIB201", name: "AI & Big Data", lecturer: "Dr. Nguyễn Văn An", progress: 72, totalLessons: 36, completedLessons: 26, nextDeadline: "20/08/2026", type: "video", thumbnail: null, rating: 4.8 },
  { id: 2, code: "SWR302", name: "Software Testing", lecturer: "ThS. Trần Thị Bình", progress: 55, totalLessons: 30, completedLessons: 16, nextDeadline: "18/08/2026", type: "video", thumbnail: null, rating: 4.5 },
  { id: 3, code: "IOT301", name: "Internet of Things", lecturer: "Dr. Lê Minh Cường", progress: 40, totalLessons: 24, completedLessons: 10, nextDeadline: "22/08/2026", type: "video", thumbnail: null, rating: 4.7 },
  { id: 4, code: "ENT496", name: "Entrepreneurship", lecturer: "ThS. Phạm Thanh Dương", progress: 88, totalLessons: 20, completedLessons: 18, nextDeadline: "25/08/2026", type: "video", thumbnail: null, rating: 4.9 },
  { id: 5, code: "CAP201", name: "Capstone Project 1", lecturer: "Dr. Vũ Hồng Hà", progress: 30, totalLessons: 15, completedLessons: 4, nextDeadline: "30/11/2026", type: "project", thumbnail: null, rating: null },
];

const LIBRARY_BOOKS = [
  { id: 1, title: "Artificial Intelligence: A Modern Approach", author: "Russell & Norvig", isbn: "978-0134610993", status: "borrowed", dueDate: "25/08/2026", location: "Kệ A-12", overdue: false },
  { id: 2, title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", status: "borrowed", dueDate: "15/08/2026", location: "Kệ B-05", overdue: true },
  { id: 3, title: "Design Patterns", author: "Gang of Four", isbn: "978-0201633610", status: "returned", dueDate: "10/07/2026", location: "Kệ B-08", overdue: false },
  { id: 4, title: "The Pragmatic Programmer", author: "Hunt & Thomas", isbn: "978-0135957059", status: "returned", dueDate: "20/06/2026", location: "Kệ C-03", overdue: false },
];

const EBOOKS = [
  { id: 1, title: "Machine Learning with Python", type: "ebook", source: "O'Reilly", access: "Unlimited" },
  { id: 2, title: "Deep Learning", type: "ebook", source: "MIT Press Online", access: "Campus" },
  { id: 3, title: "Cloud Architecture Patterns", type: "ebook", source: "IEEE Xplore", access: "Unlimited" },
  { id: 4, title: "IoT Security", type: "ebook", source: "Springer Link", access: "Campus" },
];

const DATABASES = [
  { name: "IEEE Xplore", desc: "Cơ sở dữ liệu khoa học kỹ thuật", count: "5M+ bài báo", icon: "🔬" },
  { name: "ACM Digital Library", desc: "Khoa học máy tính", count: "3M+ tài liệu", icon: "💻" },
  { name: "Springer Link", desc: "Đa ngành khoa học", count: "10M+ tài liệu", icon: "📖" },
  { name: "Scopus", desc: "Trích dẫn & tóm tắt", count: "87M+ tài liệu", icon: "🔍" },
];

export default function LearningResources() {
  const [tab, setTab] = useState("lms");
  const [searchQ, setSearchQ] = useState("");

  const ProgressRing = ({ pct, size = 44 }) => {
    const r = size * 0.4;
    const circ = 2 * Math.PI * r;
    const fill = (pct / 100) * circ;
    const color = pct >= 80 ? "#16A34A" : pct >= 50 ? "#2563EB" : "#D97706";
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={4} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" />
        <text x={size / 2} y={size / 2 + 5} textAnchor="middle"
          style={{ fontSize: size * 0.25, fontWeight: 800, fill: color, transform: `rotate(90deg)`, transformOrigin: "center" }}>
          {/* pct% rendered below */}
        </text>
      </svg>
    );
  };

  const tabs = [
    { id: "lms", label: "📹 LMS Khóa học", icon: Video },
    { id: "library", label: "📚 Thư viện", icon: Book },
    { id: "ebooks", label: "💻 E-books & CSDL", icon: Monitor },
  ];

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#7C3AED,#6D28D9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Tài nguyên học tập</h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>FACT_LMS + FACT_LIBRARY • Learning Resources Portal</p>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Tìm tài nguyên..."
            style={{ padding: "9px 12px 9px 32px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 13.5, outline: "none", width: 220 }} />
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Khóa học LMS", val: COURSES_LMS.length, color: "#7C3AED", bg: "#F5F3FF" },
          { label: "Bài học hoàn thành", val: COURSES_LMS.reduce((a, c) => a + c.completedLessons, 0), color: "#16A34A", bg: "#F0FDF4" },
          { label: "Sách đang mượn", val: LIBRARY_BOOKS.filter(b => b.status === "borrowed").length, color: "#2563EB", bg: "#EFF6FF" },
          { label: "E-books truy cập được", val: EBOOKS.length, color: "#FF6B35", bg: "#FFF7F4" },
          { label: "CSDL khoa học", val: DATABASES.length, color: "#D97706", bg: "#FFFBEB" },
        ].map((c, i) => (
          <div key={i} style={{ background: c.bg, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{c.val}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#F3F4F6", borderRadius: 12, padding: 4, marginBottom: 24, width: "fit-content" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "9px 18px", borderRadius: 8, fontSize: 13.5, fontWeight: 600,
            background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#111827" : "#6B7280",
            border: "none", cursor: "pointer", boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s", whiteSpace: "nowrap"
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* LMS Tab */}
      {tab === "lms" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {COURSES_LMS.map((c) => {
            const color = c.progress >= 80 ? "#16A34A" : c.progress >= 50 ? "#2563EB" : "#D97706";
            return (
              <div key={c.id} style={{
                background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: 20,
                display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap"
              }}>
                {/* Icon */}
                <div style={{ width: 52, height: 52, borderRadius: 12, background: c.type === "project" ? "linear-gradient(135deg,#FF6B35,#E85A2A)" : "linear-gradient(135deg,#7C3AED,#6D28D9)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {c.type === "project" ? <FileText size={22} color="#fff" /> : <Video size={22} color="#fff" />}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>{c.code}</span>
                    {c.rating && (
                      <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: "#D97706" }}>
                        <Star size={11} fill="#D97706" />{c.rating}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: "#6B7280", marginTop: 2 }}>{c.lecturer}</div>
                  {c.nextDeadline && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#D97706", marginTop: 4 }}>
                      <Clock size={11} /> Deadline: {c.nextDeadline}
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div style={{ textAlign: "right", minWidth: 120 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{c.completedLessons}/{c.totalLessons} bài</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color }}>{c.progress}%</span>
                      </div>
                      <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${c.progress}%`, height: "100%", background: color, borderRadius: 3 }} />
                      </div>
                    </div>
                  </div>
                  <button style={{ marginTop: 10, padding: "7px 16px", background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 8, color: "#7C3AED", fontWeight: 600, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
                    <ExternalLink size={12} /> Vào học
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Library Tab */}
      {tab === "library" && (
        <div>
          {LIBRARY_BOOKS.filter(b => b.status === "borrowed").some(b => b.overdue) && (
            <div style={{ padding: "14px 18px", background: "#FFF1F2", border: "1.5px solid #FECACA", borderRadius: 12, display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
              <Clock size={18} color="#DC2626" />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>Sách quá hạn</div>
                <div style={{ fontSize: 13, color: "#B91C1C" }}>Bạn có sách quá hạn. Vui lòng trả sách để tránh phí phạt.</div>
              </div>
            </div>
          )}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  {["Tên sách", "Tác giả", "ISBN", "Vị trí", "Hạn trả", "Trạng thái"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {LIBRARY_BOOKS.map((b, i) => (
                  <tr key={i} style={{ borderTop: "1px solid #F9FAFB" }}>
                    <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#111827" }}>{b.title}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13.5, color: "#374151" }}>{b.author}</td>
                    <td style={{ padding: "14px 16px", fontSize: 12, color: "#9CA3AF", fontFamily: "monospace" }}>{b.isbn}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#374151" }}>{b.location}</td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: b.overdue ? "#DC2626" : "#374151", fontWeight: b.overdue ? 700 : 400 }}>
                      {b.dueDate} {b.overdue && "⚠️"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{
                        fontSize: 11.5, padding: "3px 10px", borderRadius: 100, fontWeight: 700,
                        background: b.status === "borrowed" ? (b.overdue ? "#FFF1F2" : "#EFF6FF") : "#F0FDF4",
                        color: b.status === "borrowed" ? (b.overdue ? "#DC2626" : "#2563EB") : "#16A34A"
                      }}>
                        {b.status === "borrowed" ? (b.overdue ? "Quá hạn" : "Đang mượn") : "Đã trả"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* E-books Tab */}
      {tab === "ebooks" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, marginBottom: 28 }}>
            {EBOOKS.map((e) => (
              <div key={e.id} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: 20, transition: "all 0.2s" }}
                onMouseEnter={ev => ev.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"}
                onMouseLeave={ev => ev.currentTarget.style.boxShadow = "none"}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#1D4ED8)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <BookOpen size={18} color="#fff" />
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{e.title}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 10 }}>{e.source}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 11.5, padding: "3px 8px", borderRadius: 100, background: "#EFF6FF", color: "#2563EB", fontWeight: 600 }}>{e.access}</span>
                  <button style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", background: "#F5F3FF", border: "none", borderRadius: 7, color: "#7C3AED", fontWeight: 600, fontSize: 12, cursor: "pointer" }}>
                    <ExternalLink size={11} /> Đọc ngay
                  </button>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 14 }}>Cơ sở dữ liệu khoa học</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {DATABASES.map((d, i) => (
              <div key={i} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: 18, display: "flex", gap: 14, alignItems: "center" }}>
                <div style={{ fontSize: 28 }}>{d.icon}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{d.name}</div>
                  <div style={{ fontSize: 12.5, color: "#6B7280" }}>{d.desc}</div>
                  <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>{d.count}</div>
                </div>
                <ExternalLink size={14} color="#9CA3AF" style={{ marginLeft: "auto", cursor: "pointer" }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
