import { useState } from "react";
import { DollarSign, CreditCard, Award, AlertCircle, CheckCircle, Clock, Download, ChevronDown, Filter } from "lucide-react";

/* ── Mock data từ FACT_FINANCE ── */
const TUITION_SCHEDULE = [
  { semester: "TH26 (Thu 2026)", dueDate: "15/09/2026", amount: 28500000, paid: 28500000, status: "paid", method: "Chuyển khoản ngân hàng", txId: "TXN20260915-001" },
  { semester: "XU26 (Xuan 2026)", dueDate: "15/02/2026", amount: 28500000, paid: 28500000, status: "paid", method: "Cổng thanh toán VNPay", txId: "TXN20260215-002" },
  { semester: "HE26 (He 2026)", dueDate: "15/06/2026", amount: 22800000, paid: 22800000, status: "paid", method: "Chuyển khoản ngân hàng", txId: "TXN20260615-003" },
  { semester: "FA26 (Thu 2026)", dueDate: "30/08/2026", amount: 29700000, paid: 15000000, status: "partial", method: null, txId: null },
];

const SCHOLARSHIPS = [
  { name: "Học bổng Thủ khoa", type: "academic", amount: 100, unit: "%", sem: "TH26", status: "received", total: 28500000, desc: "GPA 4.0 - Thủ khoa học kỳ" },
  { name: "Học bổng Khuyến khích học tập", type: "academic", amount: 30, unit: "%", sem: "XU26", status: "received", total: 8550000, desc: "GPA >= 3.5" },
  { name: "Học bổng Doanh nghiệp FPT", type: "enterprise", amount: 50, unit: "%", sem: "FA26", status: "pending", total: 14850000, desc: "Đang xét duyệt" },
];

const PAYMENT_HISTORY = [
  { date: "15/09/2026", desc: "Học phí FA25", amount: -28500000, type: "tuition", ref: "TXN20260915-001" },
  { date: "15/09/2026", desc: "Học bổng Thủ khoa FA25", amount: 28500000, type: "scholarship", ref: "SCH-2026-001" },
  { date: "15/02/2026", desc: "Học phí SP25", amount: -28500000, type: "tuition", ref: "TXN20260215-002" },
  { date: "20/02/2026", desc: "Học bổng Khuyến khích SP25", amount: 8550000, type: "scholarship", ref: "SCH-2026-002" },
  { date: "15/06/2026", desc: "Học phí SU25", amount: -22800000, type: "tuition", ref: "TXN20260615-003" },
  { date: "01/08/2026", desc: "Thanh toán một phần FA26", amount: -15000000, type: "tuition", ref: "TXN20260801-001" },
];

const fmt = (n) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
const fmtK = (n) => `${(n / 1000000).toFixed(1)}M`;

export default function FinancialInfo() {
  const [tab, setTab] = useState("overview");
  const [expandedSem, setExpandedSem] = useState(null);

  const totalTuition = TUITION_SCHEDULE.reduce((a, b) => a + b.amount, 0);
  const totalPaid = TUITION_SCHEDULE.reduce((a, b) => a + b.paid, 0);
  const totalScholarship = SCHOLARSHIPS.filter(s => s.status === "received").reduce((a, b) => a + b.total, 0);
  const outstanding = TUITION_SCHEDULE.find(t => t.status === "partial");
  const debtAmount = outstanding ? outstanding.amount - outstanding.paid : 0;

  const StatusBadge = ({ status }) => {
    const cfg = {
      paid: { label: "Đã thanh toán", color: "#16A34A", bg: "#F0FDF4" },
      partial: { label: "Thanh toán một phần", color: "#D97706", bg: "#FFFBEB" },
      unpaid: { label: "Chưa thanh toán", color: "#DC2626", bg: "#FFF1F2" },
      received: { label: "Đã nhận", color: "#16A34A", bg: "#F0FDF4" },
      pending: { label: "Đang xét duyệt", color: "#D97706", bg: "#FFFBEB" },
    }[status];
    return (
      <span style={{ fontSize: 11.5, padding: "3px 10px", borderRadius: 100, fontWeight: 700, background: cfg.bg, color: cfg.color }}>
        {cfg.label}
      </span>
    );
  };

  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "tuition", label: "Học phí" },
    { id: "scholarships", label: "Học bổng" },
    { id: "history", label: "Lịch sử giao dịch" },
  ];

  return (
    <div style={{ padding: "28px 24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg,#16A34A,#15803D)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DollarSign size={20} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#111827", margin: 0 }}>Thông tin tài chính</h1>
            <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>FACT_FINANCE • Student Financial Portal</p>
          </div>
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "#ECFDF5", border: "1.5px solid #A7F3D0", borderRadius: 10, color: "#16A34A", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <Download size={14} /> Tải báo cáo tài chính
        </button>
      </div>

      {/* Alert if outstanding */}
      {debtAmount > 0 && (
        <div style={{ padding: "14px 18px", background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 12, display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
          <AlertCircle size={18} color="#D97706" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#92400E" }}>Còn nợ học phí FA26</div>
            <div style={{ fontSize: 13, color: "#B45309" }}>Vui lòng thanh toán <strong>{fmt(debtAmount)}</strong> trước ngày 30/08/2026 để tránh bị khóa kết quả học tập.</div>
          </div>
          <button style={{ marginLeft: "auto", padding: "8px 18px", background: "#D97706", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
            Thanh toán ngay
          </button>
        </div>
      )}

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

      {/* Overview tab */}
      {tab === "overview" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
            {[
              { label: "Tổng học phí", val: fmtK(totalTuition), sub: "Toàn khóa học", icon: DollarSign, color: "#374151", bg: "#F9FAFB" },
              { label: "Đã thanh toán", val: fmtK(totalPaid), sub: `${Math.round(totalPaid / totalTuition * 100)}% tổng học phí`, icon: CheckCircle, color: "#16A34A", bg: "#F0FDF4" },
              { label: "Học bổng nhận được", val: fmtK(totalScholarship), sub: "Tổng các học kỳ", icon: Award, color: "#7C3AED", bg: "#F5F3FF" },
              { label: "Còn nợ", val: fmtK(debtAmount), sub: "Hạn: 30/08/2026", icon: Clock, color: debtAmount > 0 ? "#DC2626" : "#16A34A", bg: debtAmount > 0 ? "#FFF1F2" : "#F0FDF4" },
            ].map((c, i) => (
              <div key={i} style={{ background: c.bg, borderRadius: 14, padding: "18px 20px", border: `1px solid ${c.color}18` }}>
                <c.icon size={18} color={c.color} style={{ marginBottom: 10 }} />
                <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{c.val}</div>
                <div style={{ fontSize: 12.5, color: "#6B7280", marginTop: 2 }}>{c.label}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{c.sub}</div>
              </div>
            ))}
          </div>

          {/* Payment status by semester */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Trạng thái học phí theo học kỳ</div>
            </div>
            {TUITION_SCHEDULE.map((t, i) => {
              const pct = (t.paid / t.amount) * 100;
              return (
                <div key={i} style={{ padding: "16px 20px", borderBottom: i < TUITION_SCHEDULE.length - 1 ? "1px solid #F9FAFB" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{t.semester}</div>
                      <div style={{ fontSize: 12, color: "#9CA3AF" }}>Hạn: {t.dueDate}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{fmt(t.paid)}</div>
                        <div style={{ fontSize: 11.5, color: "#9CA3AF" }}>/ {fmt(t.amount)}</div>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                  <div style={{ height: 5, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? "#16A34A" : "#D97706", borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scholarships tab */}
      {tab === "scholarships" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SCHOLARSHIPS.map((s, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: 22,
              display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap"
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12, flexShrink: 0,
                background: s.type === "academic" ? "linear-gradient(135deg,#7C3AED,#6D28D9)" : "linear-gradient(135deg,#FF6B35,#E85A2A)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Award size={22} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{s.name}</div>
                <div style={{ fontSize: 12.5, color: "#6B7280", marginTop: 2 }}>{s.desc} • Học kỳ {s.sem}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                  Mức hỗ trợ: <strong style={{ color: "#7C3AED" }}>{s.amount}{s.unit} học phí</strong>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#7C3AED" }}>{fmt(s.total)}</div>
                <StatusBadge status={s.status} />
              </div>
            </div>
          ))}
          <div style={{ padding: 18, background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#5B21B6" }}>💡 Tổng học bổng đã nhận</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#7C3AED", marginTop: 4 }}>{fmt(totalScholarship)}</div>
          </div>
        </div>
      )}

      {/* History tab */}
      {tab === "history" && (
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                {["Ngày", "Mô tả", "Mã tham chiếu", "Số tiền"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11.5, fontWeight: 700, color: "#6B7280", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYMENT_HISTORY.map((p, i) => (
                <tr key={i} style={{ borderTop: "1px solid #F9FAFB" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FAFAFA"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <td style={{ padding: "13px 16px", fontSize: 13, color: "#374151" }}>{p.date}</td>
                  <td style={{ padding: "13px 16px", fontSize: 13.5, color: "#111827", fontWeight: 500 }}>{p.desc}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: "#9CA3AF", fontFamily: "monospace" }}>{p.ref}</td>
                  <td style={{ padding: "13px 16px", textAlign: "right" }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: p.amount > 0 ? "#16A34A" : "#DC2626" }}>
                      {p.amount > 0 ? "+" : ""}{fmt(p.amount)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "tuition" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {TUITION_SCHEDULE.map((t, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #E5E7EB", padding: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{t.semester}</div>
                  <div style={{ fontSize: 12.5, color: "#9CA3AF", marginTop: 2 }}>Hạn thanh toán: {t.dueDate}</div>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { label: "Học phí", val: fmt(t.amount) },
                  { label: "Đã thanh toán", val: fmt(t.paid) },
                  { label: "Còn lại", val: fmt(t.amount - t.paid) },
                ].map((f, j) => (
                  <div key={j} style={{ padding: "12px 14px", background: "#F9FAFB", borderRadius: 8 }}>
                    <div style={{ fontSize: 11.5, color: "#9CA3AF", marginBottom: 4 }}>{f.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{f.val}</div>
                  </div>
                ))}
              </div>
              {t.method && (
                <div style={{ marginTop: 12, fontSize: 12.5, color: "#6B7280", display: "flex", gap: 8 }}>
                  <CreditCard size={13} /> Phương thức: {t.method} • Mã GD: {t.txId}
                </div>
              )}
              {t.status === "partial" && (
                <button style={{ marginTop: 14, width: "100%", padding: "12px", background: "linear-gradient(135deg,#16A34A,#15803D)", border: "none", borderRadius: 10, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                  Thanh toán {fmt(t.amount - t.paid)} còn lại
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
