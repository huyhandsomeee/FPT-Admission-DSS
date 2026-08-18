import { useState, useMemo } from "react";
import { Users, Search, Filter, Download, ChevronDown, Eye, Mail, Phone, AlertCircle, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Mock data — DIM_STUDENT + FACT_LEARNING ── */
const PROGRAMS = ["Tất cả", "Công nghệ thông tin", "Quản trị kinh doanh", "Ngôn ngữ Anh", "Thiết kế đồ họa", "Kỹ thuật phần mềm"];
const SEMESTERS = ["Tất cả", "FA26", "HE26", "XU26"];
const STATUSES = ["Tất cả", "Đang học", "Bảo lưu", "Thôi học", "Tốt nghiệp"];

const STUDENTS = Array.from({ length: 48 }, (_, i) => ({
  id: `STU${2023 + Math.floor(i / 20)}-${String(1000 + i).padStart(6, "0")}`,
  code: `HS${172000 + i}`,
  name: ["Nguyễn Văn An", "Trần Thị Bình", "Lê Minh Cường", "Phạm Thu Dung", "Hoàng Văn Em", "Đặng Thị Phương", "Vũ Hồng Hà", "Bùi Thị Lan", "Đỗ Văn Minh", "Ngô Thị Nga"][i % 10],
  program: ["Công nghệ thông tin", "Quản trị kinh doanh", "Ngôn ngữ Anh", "Thiết kế đồ họa", "Kỹ thuật phần mềm"][i % 5],
  class: `SE${1715 + Math.floor(i / 5)}`,
  campus: ["Hà Nội", "TP.HCM", "Đà Nẵng"][i % 3],
  gpa: parseFloat((2.0 + Math.random() * 2).toFixed(2)),
  status: ["Đang học", "Đang học", "Đang học", "Bảo lưu", "Thôi học"][Math.floor(Math.random() * 5)],
  email: `sv${i + 1}@fpt.edu.vn`,
  phone: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
  attend: Math.floor(60 + Math.random() * 40),
  admissionYear: 2022 + Math.floor(i / 16),
  warning: Math.random() < 0.15,
}));

const PAGE_SIZE = 10;

export default function StudentManagement() {
  const [searchQ, setSearchQ] = useState("");
  const [program, setProgram] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    let data = STUDENTS;
    if (searchQ) data = data.filter(s => s.name.toLowerCase().includes(searchQ.toLowerCase()) || s.code.includes(searchQ));
    if (program !== "Tất cả") data = data.filter(s => s.program === program);
    if (status !== "Tất cả") data = data.filter(s => s.status === status);
    data = [...data].sort((a, b) => {
      const va = a[sortCol], vb = b[sortCol];
      if (typeof va === "number") return sortDir === "asc" ? va - vb : vb - va;
      return sortDir === "asc" ? String(va).localeCompare(String(vb), "vi") : String(vb).localeCompare(String(va), "vi");
    });
    return data;
  }, [searchQ, program, status, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === paged.length ? [] : paged.map(s => s.id));

  const STATUS_CFG = {
    "Đang học": { color: "#16A34A", bg: "#F0FDF4" },
    "Bảo lưu": { color: "#D97706", bg: "#FFFBEB" },
    "Thôi học": { color: "#DC2626", bg: "#FFF1F2" },
    "Tốt nghiệp": { color: "#2563EB", bg: "#EFF6FF" },
  };

  const thStyle = (col) => ({
    padding: "11px 14px", textAlign: "left", fontSize: 11.5, fontWeight: 700,
    color: sortCol === col ? "#2563EB" : "#6B7280", letterSpacing: 0.5, textTransform: "uppercase",
    cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
    borderBottom: sortCol === col ? "2px solid #2563EB" : "2px solid transparent"
  });

  const filterSel = (val, setVal, opts) => (
    <div style={{ position: "relative" }}>
      <select value={val} onChange={e => { setVal(e.target.value); setPage(1); }} style={{
        appearance: "none", padding: "9px 32px 9px 12px", borderRadius: 10, fontSize: 13,
        border: val !== "Tất cả" ? "1.5px solid #2563EB" : "1.5px solid #E5E7EB",
        background: "#fff", color: "#374151", cursor: "pointer", fontWeight: 500
      }}>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#9CA3AF" }} />
    </div>
  );

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1300, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#7C3AED,#6D28D9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Users size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Quản lý sinh viên</h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>DIM_STUDENT • {filtered.length} sinh viên được lọc</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {selected.length > 0 && (
            <span style={{ padding: "9px 16px", background: "#EFF6FF", borderRadius: 10, fontSize: 13, color: "#2563EB", fontWeight: 600 }}>
              Đã chọn {selected.length}
            </span>
          )}
          <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            <Download size={14} /> Xuất Excel
          </button>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 20 }}>
        {[
          { label: "Tổng sinh viên", val: STUDENTS.length, color: "#374151" },
          { label: "Đang học", val: STUDENTS.filter(s => s.status === "Đang học").length, color: "#16A34A" },
          { label: "Bảo lưu", val: STUDENTS.filter(s => s.status === "Bảo lưu").length, color: "#D97706" },
          { label: "Cần cảnh báo", val: STUDENTS.filter(s => s.warning).length, color: "#DC2626" },
        ].map((c, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #E5E7EB", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: c.color }}>{c.val}</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: "16px 20px", marginBottom: 18, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
          <input value={searchQ} onChange={e => { setSearchQ(e.target.value); setPage(1); }}
            placeholder="Tìm theo tên hoặc mã SV..."
            style={{ width: "100%", padding: "9px 12px 9px 32px", borderRadius: 10, border: "1.5px solid #E5E7EB", fontSize: 13.5, outline: "none", boxSizing: "border-box" }} />
        </div>
        {filterSel(program, setProgram, PROGRAMS)}
        {filterSel(status, setStatus, STATUSES)}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th style={{ padding: "11px 14px" }}>
                  <input type="checkbox" checked={selected.length === paged.length && paged.length > 0}
                    onChange={toggleAll} style={{ cursor: "pointer" }} />
                </th>
                <th style={thStyle("code")} onClick={() => handleSort("code")}>Mã SV</th>
                <th style={thStyle("name")} onClick={() => handleSort("name")}>Họ và tên</th>
                <th style={thStyle("program")} onClick={() => handleSort("program")}>Ngành</th>
                <th style={thStyle("class")}>Lớp</th>
                <th style={thStyle("gpa")} onClick={() => handleSort("gpa")}>GPA {sortCol === "gpa" ? (sortDir === "asc" ? "↑" : "↓") : ""}</th>
                <th style={thStyle("attend")} onClick={() => handleSort("attend")}>Chuyên cần</th>
                <th style={thStyle("status")}>Trạng thái</th>
                <th style={{ padding: "11px 14px", fontSize: 11.5, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((s, i) => (
                <tr key={s.id} style={{
                  borderTop: "1px solid #F3F4F6",
                  background: selected.includes(s.id) ? "#EFF6FF" : i % 2 === 0 ? "#fff" : "#FAFAFA"
                }}
                  onMouseEnter={e => { if (!selected.includes(s.id)) e.currentTarget.style.background = "#F9FAFB"; }}
                  onMouseLeave={e => { if (!selected.includes(s.id)) e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFAFA"; }}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggleSelect(s.id)} style={{ cursor: "pointer" }} />
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 12.5, color: "#9CA3AF", fontWeight: 600 }}>{s.code}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `hsl(${(i * 37) % 360}, 65%, 55%)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{s.name[0]}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", display: "flex", alignItems: "center", gap: 5 }}>
                          {s.name}
                          {s.warning && <AlertCircle size={12} color="#DC2626" />}
                        </div>
                        <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>{s.campus}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#374151" }}>{s.program}</td>
                  <td style={{ padding: "12px 14px", fontSize: 13, color: "#374151", fontWeight: 600 }}>{s.class}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: s.gpa >= 3.6 ? "#16A34A" : s.gpa >= 3.0 ? "#2563EB" : s.gpa >= 2.0 ? "#D97706" : "#DC2626" }}>
                      {s.gpa}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 40, height: 5, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: `${s.attend}%`, height: "100%", background: s.attend >= 80 ? "#16A34A" : "#DC2626", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: s.attend >= 80 ? "#16A34A" : "#DC2626" }}>{s.attend}%</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span style={{ fontSize: 11.5, padding: "3px 10px", borderRadius: 100, fontWeight: 700, background: STATUS_CFG[s.status]?.bg, color: STATUS_CFG[s.status]?.color }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 12 }}>
                        <Eye size={12} color="#6B7280" />
                      </button>
                      <button style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid #E5E7EB", background: "#fff", cursor: "pointer", fontSize: 12 }}>
                        <Mail size={12} color="#6B7280" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12.5, color: "#6B7280" }}>
            Trang {page}/{totalPages} • {filtered.length} sinh viên
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{
              padding: "6px 10px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: page === 1 ? "#F9FAFB" : "#fff",
              cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? "#9CA3AF" : "#374151"
            }}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
              return (
                <button key={p} onClick={() => setPage(p)} style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 13.5, fontWeight: 600,
                  border: `1.5px solid ${page === p ? "#2563EB" : "#E5E7EB"}`,
                  background: page === p ? "#2563EB" : "#fff",
                  color: page === p ? "#fff" : "#374151", cursor: "pointer"
                }}>{p}</button>
              );
            })}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{
              padding: "6px 10px", borderRadius: 8, border: "1.5px solid #E5E7EB", background: page === totalPages ? "#F9FAFB" : "#fff",
              cursor: page === totalPages ? "not-allowed" : "pointer", color: page === totalPages ? "#9CA3AF" : "#374151"
            }}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
