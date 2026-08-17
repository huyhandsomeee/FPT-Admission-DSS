import { useState, useCallback } from "react";
import { Calculator, Info, CheckCircle, AlertCircle, ChevronDown, RotateCcw, BookOpen, Award } from "lucide-react";

/* ── Dữ liệu ngưỡng điểm FPT ── */
const PROGRAMS = [
  { id: "it", name: "Công nghệ thông tin", code: "7480201", min2026: 24.5, coeff: { toan: 2, ly: 1, hoa: 1, van: 1, anh: 2 } },
  { id: "ai", name: "Trí tuệ nhân tạo", code: "7480201AI", min2026: 25.5, coeff: { toan: 2, ly: 1.5, hoa: 0.5, van: 0.5, anh: 1.5 } },
  { id: "se", name: "Kỹ thuật phần mềm", code: "7480103", min2026: 22.5, coeff: { toan: 2, ly: 1, hoa: 1, van: 1, anh: 1 } },
  { id: "is", name: "An toàn thông tin", code: "7480202", min2026: 23.8, coeff: { toan: 2, ly: 1.5, hoa: 0.5, van: 0.5, anh: 1.5 } },
  { id: "ba", name: "Quản trị kinh doanh", code: "7340101", min2026: 22.0, coeff: { toan: 1, ly: 0.5, hoa: 0.5, van: 1.5, anh: 2.5 } },
  { id: "mk", name: "Marketing", code: "7340115", min2026: 22.5, coeff: { toan: 1, ly: 0.5, hoa: 0.5, van: 2, anh: 2 } },
  { id: "en", name: "Ngôn ngữ Anh", code: "7220201", min2026: 23.0, coeff: { toan: 0.5, ly: 0.5, hoa: 0.5, van: 2, anh: 2.5 } },
  { id: "fi", name: "Tài chính - Ngân hàng", code: "7340201", min2026: 21.0, coeff: { toan: 2, ly: 0.5, hoa: 0.5, van: 1, anh: 2 } },
  { id: "gd", name: "Thiết kế đồ họa", code: "7210403", min2026: 22.0, coeff: { toan: 0.5, ly: 0.5, hoa: 0.5, van: 1.5, anh: 2 } },
];

const METHODS = [
  { id: "thpt", label: "THPT Quốc Gia", desc: "Xét tuyển theo điểm thi THPT Quốc Gia", icon: "📝" },
  { id: "hocba", label: "Xét học bạ THPT", desc: "Xét theo điểm trung bình các học kỳ", icon: "📚" },
  { id: "dgnl", label: "Đánh giá năng lực", desc: "Theo kết quả thi ĐGNL ĐHQG", icon: "🎯" },
  { id: "sat", label: "SAT/ACT Quốc tế", desc: "Dành cho học sinh quốc tế và SAT", icon: "🌐" },
];

const SUBJECTS_THPT = [
  { key: "toan", label: "Toán", max: 10 },
  { key: "van", label: "Ngữ văn", max: 10 },
  { key: "anh", label: "Tiếng Anh", max: 10 },
  { key: "ly", label: "Vật Lý", max: 10 },
  { key: "hoa", label: "Hóa học", max: 10 },
  { key: "sinh", label: "Sinh học", max: 10 },
  { key: "su", label: "Lịch sử", max: 10 },
  { key: "dia", label: "Địa lý", max: 10 },
];

const SUBJECT_COMBOS = [
  { id: "A00", label: "A00", subjects: ["toan", "ly", "hoa"] },
  { id: "A01", label: "A01", subjects: ["toan", "ly", "anh"] },
  { id: "D01", label: "D01", subjects: ["toan", "van", "anh"] },
  { id: "D07", label: "D07", subjects: ["toan", "hoa", "anh"] },
  { id: "C00", label: "C00", subjects: ["van", "su", "dia"] },
];

export default function ScoreCalculator() {
  const [method, setMethod] = useState("thpt");
  const [combo, setCombo] = useState("A01");
  const [scores, setScores] = useState({});
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [ielts, setIelts] = useState("");
  const [dgnlScore, setDgnlScore] = useState("");

  const activeCombo = SUBJECT_COMBOS.find(c => c.id === combo);

  const totalTHPT = useCallback(() => {
    if (!activeCombo) return 0;
    const sum = activeCombo.subjects.reduce((acc, s) => acc + (parseFloat(scores[s]) || 0), 0);
    // IELTS bonus
    const ieltsVal = parseFloat(ielts) || 0;
    let bonus = 0;
    if (ieltsVal >= 7.5) bonus = 2.0;
    else if (ieltsVal >= 7.0) bonus = 1.5;
    else if (ieltsVal >= 6.5) bonus = 1.0;
    else if (ieltsVal >= 6.0) bonus = 0.5;
    return Math.min(30, sum + bonus);
  }, [scores, combo, ielts, activeCombo]);

  const total = method === "thpt" ? totalTHPT() : method === "dgnl" ? (parseFloat(dgnlScore) || 0) : 0;

  const getResult = (prog) => {
    const min = prog.min2026;
    const diff = total - min;
    if (total === 0) return null;
    if (diff >= 1.5) return { label: "Rất cao", color: "#16A34A", bg: "#F0FDF4", icon: "🟢" };
    if (diff >= 0.5) return { label: "Cao", color: "#2563EB", bg: "#EFF6FF", icon: "🔵" };
    if (diff >= 0) return { label: "Đạt ngưỡng", color: "#D97706", bg: "#FFFBEB", icon: "🟡" };
    if (diff >= -1.5) return { label: "Gần đạt", color: "#EA580C", bg: "#FFF7ED", icon: "🟠" };
    return { label: "Chưa đạt", color: "#DC2626", bg: "#FFF1F2", icon: "🔴" };
  };

  const reset = () => { setScores({}); setIelts(""); setDgnlScore(""); setSelectedProgram(null); };

  return (
    <div style={{ padding: "32px 24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#7C3AED,#6D28D9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Calculator size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0d1b3e", margin: 0 }}>Máy tính điểm xét tuyển</h1>
            <p style={{ fontSize: 13.5, color: "#6B7280", margin: 0 }}>Tính điểm và đánh giá cơ hội trúng tuyển FPT University 2026</p>
          </div>
        </div>
        <button onClick={reset} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 10, border: "1.5px solid #E5E7EB", background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <RotateCcw size={14} /> Làm lại
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        {/* Left — Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Method selection */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>1. Chọn phương thức xét tuyển</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {METHODS.map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)} style={{
                  padding: "14px", borderRadius: 12, border: `2px solid ${method === m.id ? "#7C3AED" : "#E5E7EB"}`,
                  background: method === m.id ? "#F5F3FF" : "#fff", cursor: "pointer", textAlign: "left", transition: "all 0.2s"
                }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: method === m.id ? "#7C3AED" : "#111827" }}>{m.label}</div>
                  <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Score input */}
          {method === "thpt" && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>2. Nhập điểm thi</h3>

              {/* Combo select */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Tổ hợp môn</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {SUBJECT_COMBOS.map(c => (
                    <button key={c.id} onClick={() => setCombo(c.id)} style={{
                      padding: "7px 14px", borderRadius: 8, border: `2px solid ${combo === c.id ? "#FF6B35" : "#E5E7EB"}`,
                      background: combo === c.id ? "#FFF7F4" : "#fff", color: combo === c.id ? "#FF6B35" : "#374151",
                      fontWeight: 700, fontSize: 13, cursor: "pointer"
                    }}>
                      {c.label}<br />
                      <span style={{ fontSize: 10, fontWeight: 500, color: "#9CA3AF" }}>
                        {c.subjects.map(s => SUBJECTS_THPT.find(x => x.key === s)?.label).join("+")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Score inputs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {(activeCombo?.subjects || []).map(sk => {
                  const sub = SUBJECTS_THPT.find(s => s.key === sk);
                  return (
                    <div key={sk}>
                      <label style={{ fontSize: 12.5, fontWeight: 600, color: "#6B7280", display: "block", marginBottom: 5 }}>{sub?.label}</label>
                      <input
                        type="number" min={0} max={10} step={0.1}
                        value={scores[sk] ?? ""}
                        onChange={e => setScores(prev => ({ ...prev, [sk]: e.target.value }))}
                        placeholder="0 – 10"
                        style={{
                          width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                          border: `1.5px solid ${parseFloat(scores[sk]) >= 0 && scores[sk] !== "" ? "#FF6B35" : "#E5E7EB"}`,
                          outline: "none", boxSizing: "border-box"
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* IELTS bonus */}
              <div style={{ marginTop: 16, padding: 14, background: "#EFF6FF", borderRadius: 10, border: "1px solid #BFDBFE" }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: "#1E40AF", display: "block", marginBottom: 6 }}>
                  🌐 Điểm IELTS (nếu có — cộng điểm ưu tiên)
                </label>
                <input
                  type="number" min={0} max={9} step={0.5}
                  value={ielts}
                  onChange={e => setIelts(e.target.value)}
                  placeholder="Nhập điểm IELTS (VD: 6.5)"
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, fontSize: 13.5, border: "1.5px solid #93C5FD", outline: "none", boxSizing: "border-box" }}
                />
                <div style={{ fontSize: 11, color: "#2563EB", marginTop: 6 }}>IELTS ≥ 7.5: +2.0đ | ≥7.0: +1.5đ | ≥6.5: +1.0đ | ≥6.0: +0.5đ</div>
              </div>
            </div>
          )}

          {method === "dgnl" && (
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>2. Nhập điểm ĐGNL</h3>
              <input
                type="number" min={0} max={1000}
                value={dgnlScore}
                onChange={e => setDgnlScore(e.target.value)}
                placeholder="Điểm Đánh giá năng lực (0–1000)"
                style={{ width: "100%", padding: "12px 16px", borderRadius: 10, fontSize: 15, border: "1.5px solid #E5E7EB", outline: "none", boxSizing: "border-box" }}
              />
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>
                Điểm ĐGNL ĐHQG HCM • Thi năm 2026
              </div>
            </div>
          )}

          {/* Total score */}
          {(method === "thpt" && activeCombo?.subjects.some(s => scores[s])) || (method === "dgnl" && dgnlScore) ? (
            <div style={{
              background: "linear-gradient(135deg,#0d1b3e,#1A3A6C)", borderRadius: 16, padding: 24,
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>Tổng điểm xét tuyển</div>
                <div style={{ fontSize: 42, fontWeight: 900, color: "#FF6B35" }}>{total.toFixed(2)}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{method === "thpt" ? `Tổ hợp ${combo}` : "ĐGNL ĐHQG"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <Award size={48} color="rgba(255,107,53,0.4)" />
              </div>
            </div>
          ) : null}
        </div>

        {/* Right — Results */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
              Kết quả đánh giá — {PROGRAMS.length} ngành học
            </h3>
            {total > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {PROGRAMS.map(prog => {
                  const res = getResult(prog);
                  if (!res) return null;
                  const diff = (total - prog.min2026).toFixed(2);
                  return (
                    <div key={prog.id}
                      onClick={() => setSelectedProgram(selectedProgram?.id === prog.id ? null : prog)}
                      style={{
                        padding: "14px 16px", borderRadius: 12, background: res.bg,
                        border: `1.5px solid ${selectedProgram?.id === prog.id ? res.color : "transparent"}`,
                        cursor: "pointer", transition: "all 0.2s"
                      }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 16 }}>{res.icon}</span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{prog.name}</div>
                            <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>{prog.code}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: res.color, padding: "3px 10px", background: "#fff", borderRadius: 100, border: `1px solid ${res.color}` }}>
                            {res.label}
                          </div>
                          <div style={{ fontSize: 11.5, color: "#9CA3AF", marginTop: 4 }}>
                            Chuẩn {prog.min2026} | {parseFloat(diff) >= 0 ? "+" : ""}{diff}
                          </div>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div style={{ marginTop: 10, height: 4, background: "#E5E7EB", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(100, (total / prog.min2026) * 100)}%`, height: "100%", background: res.color, borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#9CA3AF" }}>
                <Calculator size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
                <div style={{ fontSize: 14 }}>Nhập điểm để xem kết quả đánh giá</div>
              </div>
            )}
          </div>

          {/* Note box */}
          <div style={{ padding: 16, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, display: "flex", gap: 10 }}>
            <Info size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: 12.5, color: "#92400E", lineHeight: 1.6 }}>
              Điểm chuẩn tham khảo năm <strong>2026</strong>. Kết quả chỉ mang tính chất ước tính — FPT University sẽ công bố điểm chuẩn chính thức sau kỳ thi. Liên hệ tuyển sinh: <strong>1800 6616</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
