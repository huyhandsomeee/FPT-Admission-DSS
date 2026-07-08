import React, { useEffect, useState, useCallback } from "react";
import api from "../../config/axiosConfig";
import {
  GraduationCap, Send, Search, RefreshCw, CheckCircle,
  X, Mail, Bell, Smartphone, AlertCircle, List
} from "lucide-react";

// ─── Status config ───────────────────────────────────────────────────────────
const NOTIF_STATUS = {
  NOT_SENT:    { label: "Chưa gửi",           color: "#94A3B8", bg: "#F1F5F9" },
  SENT:        { label: "Đã gửi",             color: "#3B82F6", bg: "#EFF6FF" },
  READ:        { label: "Sinh viên đã xem",   color: "#8B5CF6", bg: "#F5F3FF" },
  CONFIRMED:   { label: "Đã xác nhận",        color: "#10B981", bg: "#ECFDF5" },
  IN_PROGRESS: { label: "Đang xử lý",         color: "#F59E0B", bg: "#FFFBEB" },
  COMPLETED:   { label: "Hoàn tất nhập học",  color: "#059669", bg: "#D1FAE5" },
};

const STATUS_FILTERS = [
  { value: "ALL",         label: "Tất cả" },
  { value: "NOT_SENT",    label: "Chưa gửi" },
  { value: "SENT",        label: "Đã gửi" },
  { value: "READ",        label: "Đã xem" },
  { value: "CONFIRMED",   label: "Đã xác nhận" },
  { value: "IN_PROGRESS", label: "Đang xử lý" },
  { value: "COMPLETED",   label: "Hoàn tất" },
];

const DEFAULT_TEMPLATES = [
  {
    name: "Thông báo nhập học chính thức 2026",
    title: "🎓 Thông báo nhập học – Đại học FPT 2026",
    content: `Chúc mừng bạn đã chính thức trúng tuyển vào Đại học FPT năm học 2026!\n\nVui lòng đọc kỹ hướng dẫn nhập học dưới đây và hoàn thành các bước theo đúng thời hạn để đảm bảo suất học của bạn.\n\n🏫 Thời gian nhập học: 01/09/2026 – 15/09/2026\n📋 Vui lòng chuẩn bị đầy đủ giấy tờ và hoàn thành đóng học phí trước ngày quy định.`,
    deadline: "15/09/2026",
    documents: "- Căn cước công dân (bản gốc + 2 bản sao)\n- Bằng tốt nghiệp THPT (bản gốc)\n- Học bạ THPT (bản gốc)\n- 4 ảnh thẻ 3x4 (nền trắng)\n- Giấy khai sinh (bản sao công chứng)",
    tuitionAmount: "22.000.000 VNĐ/kỳ",
    tuitionLink: "https://payments.fpt.edu.vn",
    scheduleLink: "https://nhaphoc.fpt.edu.vn",
    downloadLink: "https://tuyensinh.fpt.edu.vn/giaybao",
    hotline: "1800 6036",
    contactPerson: "Phòng Tuyển sinh",
    channels: "PORTAL,EMAIL",
  },
  {
    name: "Nhắc nhở hạn chót nhập học",
    title: "⚠️ Nhắc nhở – Hạn chót nhập học còn 7 ngày",
    content: `Bạn ơi! Hạn chót nhập học vào Đại học FPT đang đến gần.\n\nVui lòng hoàn thành các bước còn lại (đóng học phí, đặt lịch nhập học) trước ngày 15/09/2026 để giữ suất học của mình.\n\nNếu cần hỗ trợ, hãy liên hệ hotline ngay!`,
    deadline: "15/09/2026",
    documents: "",
    tuitionAmount: "22.000.000 VNĐ/kỳ",
    tuitionLink: "https://payments.fpt.edu.vn",
    scheduleLink: "https://nhaphoc.fpt.edu.vn",
    downloadLink: "",
    hotline: "1800 6036",
    contactPerson: "Phòng Tuyển sinh",
    channels: "PORTAL,EMAIL",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = NOTIF_STATUS[status] || NOTIF_STATUS.NOT_SENT;
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.color}44`, borderRadius: 20,
      padding: "3px 10px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap"
    }}>{cfg.label}</span>
  );
}

function InputRow({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
      {children}
    </div>
  );
}

const inp = {
  padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8,
  fontSize: 13, color: "#1E293B", outline: "none", background: "#FAFBFC",
};

// ─── Send Modal ───────────────────────────────────────────────────────────────
function SendModal({ selectedIds, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: "", content: "", deadline: "", documents: "",
    tuitionAmount: "", tuitionLink: "", scheduleLink: "",
    downloadLink: "", hotline: "1800 6036", contactPerson: "",
    channels: { PORTAL: true, EMAIL: true, SMS: false },
  });
  const [sending, setSending] = useState(false);

  const applyTemplate = (tpl) => {
    const ch = {};
    (tpl.channels || "PORTAL").split(",").forEach(c => { ch[c.trim()] = true; });
    setForm({ title: tpl.title, content: tpl.content, deadline: tpl.deadline,
      documents: tpl.documents, tuitionAmount: tpl.tuitionAmount,
      tuitionLink: tpl.tuitionLink, scheduleLink: tpl.scheduleLink,
      downloadLink: tpl.downloadLink, hotline: tpl.hotline,
      contactPerson: tpl.contactPerson,
      channels: { PORTAL: !!ch.PORTAL, EMAIL: !!ch.EMAIL, SMS: !!ch.SMS },
    });
    setStep(2);
  };

  const handleSend = async () => {
    if (!form.title.trim()) { alert("Vui lòng nhập tiêu đề thông báo."); return; }
    setSending(true);
    try {
      const chStr = Object.entries(form.channels).filter(([, v]) => v).map(([k]) => k).join(",");
      await api.post("/api/officer/enrollment/send", { applicationIds: selectedIds, ...form, channels: chStr });
      onSuccess();
    } catch (e) {
      alert(e.response?.data?.error || "Gửi thất bại. Vui lòng thử lại.");
    } finally { setSending(false); }
  };

  const STEPS = ["Chọn mẫu", "Soạn nội dung", "Xem trước & Gửi"];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.65)", zIndex: 2000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 640, maxHeight: "92vh",
        display: "flex", flexDirection: "column", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg,#FF6B35,#E85A2A)", padding: "18px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ color: "white", fontWeight: 800, fontSize: 16 }}>📩 Soạn thông báo nhập học</div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 2 }}>Gửi cho <strong>{selectedIds.length}</strong> thí sinh trúng tuyển chính thức</div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, color: "white", cursor: "pointer", padding: "6px 8px", display: "flex" }}><X size={18} /></button>
        </div>

        {/* Step tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", background: "#FAFBFC" }}>
          {STEPS.map((s, i) => (
            <button key={i} onClick={() => i < 2 && setStep(i + 1)}
              style={{ flex: 1, padding: "12px 8px", fontSize: 12, fontWeight: 700, border: "none", background: "none", cursor: i < 2 ? "pointer" : "default",
                color: step === i + 1 ? "#FF6B35" : "#94A3B8",
                borderBottom: step === i + 1 ? "2px solid #FF6B35" : "2px solid transparent" }}>
              {i + 1}. {s}
            </button>
          ))}
        </div>

        <div style={{ overflowY: "auto", flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Step 1: Templates */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>Chọn mẫu có sẵn hoặc <strong>soạn mới</strong>:</p>
              {DEFAULT_TEMPLATES.map((tpl, idx) => (
                <div key={idx} onClick={() => applyTemplate(tpl)} style={{
                  border: "1.5px solid #E2E8F0", borderRadius: 12, padding: "14px 16px", cursor: "pointer",
                  transition: "all 0.15s", background: "#FAFBFC" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "#E2E8F0"}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#1E293B", marginBottom: 4 }}>{tpl.name}</div>
                  <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>{tpl.content.slice(0, 100)}…</div>
                  <div style={{ marginTop: 8, fontSize: 11, color: "#FF6B35", fontWeight: 700 }}>→ Chọn mẫu này</div>
                </div>
              ))}
              <button onClick={() => setStep(2)} style={{ padding: "10px 16px", border: "1.5px dashed #CBD5E1", borderRadius: 12, background: "none", fontSize: 13, fontWeight: 600, color: "#64748B", cursor: "pointer" }}>
                + Soạn thông báo mới (không dùng mẫu)
              </button>
            </div>
          )}

          {/* Step 2: Compose */}
          {step === 2 && (
            <>
              <InputRow label="Tiêu đề *">
                <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} style={inp} placeholder="Ví dụ: Thông báo nhập học ĐH FPT 2026" />
              </InputRow>
              <InputRow label="Nội dung hướng dẫn *">
                <textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} rows={5}
                  style={{...inp, resize: "vertical"}} placeholder="Nội dung hướng dẫn nhập học cho thí sinh..." />
              </InputRow>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <InputRow label="Deadline nhập học">
                  <input value={form.deadline} onChange={e => setForm(f => ({...f, deadline: e.target.value}))} style={inp} placeholder="VD: 15/09/2026" />
                </InputRow>
                <InputRow label="Học phí / kỳ">
                  <input value={form.tuitionAmount} onChange={e => setForm(f => ({...f, tuitionAmount: e.target.value}))} style={inp} placeholder="VD: 22.000.000 VNĐ" />
                </InputRow>
              </div>
              <InputRow label="Danh sách giấy tờ cần mang">
                <textarea value={form.documents} onChange={e => setForm(f => ({...f, documents: e.target.value}))} rows={3}
                  style={{...inp, resize: "vertical"}} placeholder="- Căn cước công dân&#10;- Bằng tốt nghiệp&#10;…" />
              </InputRow>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <InputRow label="Link đóng học phí">
                  <input value={form.tuitionLink} onChange={e => setForm(f => ({...f, tuitionLink: e.target.value}))} style={inp} placeholder="https://…" />
                </InputRow>
                <InputRow label="Link đặt lịch nhập học">
                  <input value={form.scheduleLink} onChange={e => setForm(f => ({...f, scheduleLink: e.target.value}))} style={inp} placeholder="https://…" />
                </InputRow>
                <InputRow label="Link tải giấy báo">
                  <input value={form.downloadLink} onChange={e => setForm(f => ({...f, downloadLink: e.target.value}))} style={inp} placeholder="https://…" />
                </InputRow>
                <InputRow label="Hotline hỗ trợ">
                  <input value={form.hotline} onChange={e => setForm(f => ({...f, hotline: e.target.value}))} style={inp} placeholder="1800 6036" />
                </InputRow>
              </div>
              <InputRow label="Người phụ trách">
                <input value={form.contactPerson} onChange={e => setForm(f => ({...f, contactPerson: e.target.value}))} style={inp} placeholder="Phòng Tuyển sinh" />
              </InputRow>
              <InputRow label="Kênh gửi">
                <div style={{ display: "flex", gap: 16 }}>
                  {[["PORTAL", "🔔 Portal"], ["EMAIL", "📧 Email"], ["SMS", "📱 SMS"]].map(([k, lbl]) => (
                    <label key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: form.channels[k] ? "#FF6B35" : "#64748B", cursor: "pointer" }}>
                      <input type="checkbox" checked={!!form.channels[k]} onChange={e => setForm(f => ({...f, channels: {...f.channels, [k]: e.target.checked}}))} style={{ accentColor: "#FF6B35" }} />
                      {lbl}
                    </label>
                  ))}
                </div>
              </InputRow>
            </>
          )}

          {/* Step 3: Preview */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "linear-gradient(135deg,#FFF7ED,#FFEDD5)", borderRadius: 12, padding: 16, border: "1px solid #FED7AA" }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#C2410C", marginBottom: 8 }}>{form.title || "(Chưa có tiêu đề)"}</div>
                <div style={{ fontSize: 13, color: "#7C2D12", whiteSpace: "pre-line", lineHeight: 1.7 }}>{form.content}</div>
              </div>
              {(form.deadline || form.tuitionAmount) && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {form.deadline && <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626" }}>DEADLINE NHẬP HỌC</div><div style={{ fontWeight: 700, color: "#1E293B", marginTop: 4 }}>{form.deadline}</div></div>}
                  {form.tuitionAmount && <div style={{ background: "#EFF6FF", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#2563EB" }}>HỌC PHÍ</div><div style={{ fontWeight: 700, color: "#1E293B", marginTop: 4 }}>{form.tuitionAmount}</div></div>}
                </div>
              )}
              {form.documents && <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 6 }}>GIẤY TỜ CẦN MANG</div><pre style={{ margin: 0, fontSize: 12, color: "#334155", whiteSpace: "pre-line", fontFamily: "inherit" }}>{form.documents}</pre></div>}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {form.tuitionLink && <a href={form.tuitionLink} target="_blank" rel="noreferrer" style={{ padding: "6px 12px", background: "#ECFDF5", color: "#059669", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>💳 Đóng học phí</a>}
                {form.scheduleLink && <a href={form.scheduleLink} target="_blank" rel="noreferrer" style={{ padding: "6px 12px", background: "#EFF6FF", color: "#2563EB", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>📅 Đặt lịch nhập học</a>}
                {form.downloadLink && <a href={form.downloadLink} target="_blank" rel="noreferrer" style={{ padding: "6px 12px", background: "#F5F3FF", color: "#7C3AED", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>⬇️ Tải giấy báo</a>}
              </div>
              {(form.hotline || form.contactPerson) && <div style={{ fontSize: 12, color: "#64748B" }}>📞 Hotline: <strong>{form.hotline}</strong> {form.contactPerson && <>| 👤 Phụ trách: <strong>{form.contactPerson}</strong></>}</div>}
              <div style={{ padding: 12, background: "#FFFBEB", borderRadius: 10, border: "1px solid #FDE68A" }}>
                <div style={{ fontSize: 12, color: "#92400E", fontWeight: 700 }}>📤 Kênh gửi: {Object.entries(form.channels).filter(([,v]) => v).map(([k]) => k).join(", ") || "Chưa chọn"}</div>
                <div style={{ fontSize: 12, color: "#92400E", marginTop: 4 }}>👥 Sẽ gửi đến: <strong>{selectedIds.length}</strong> thí sinh</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", background: "#F8FAFC", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>{step > 1 && <button onClick={() => setStep(s => s - 1)} style={{ padding: "8px 16px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#64748B", cursor: "pointer", background: "white" }}>← Quay lại</button>}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{ padding: "8px 16px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 12, fontWeight: 600, color: "#64748B", cursor: "pointer", background: "white" }}>Hủy</button>
            {step < 3
              ? <button onClick={() => setStep(s => s + 1)} style={{ padding: "8px 20px", background: "linear-gradient(135deg,#FF6B35,#E85A2A)", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "white", cursor: "pointer" }}>Tiếp theo →</button>
              : <button onClick={handleSend} disabled={sending} style={{ padding: "8px 20px", background: sending ? "#CBD5E1" : "linear-gradient(135deg,#10B981,#059669)", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "white", cursor: sending ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  {sending ? "Đang gửi…" : <><Send size={13} /> Gửi ngay ({selectedIds.length} thí sinh)</>}
                </button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EnrollmentNotification() {
  const [list, setList] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState(new Set());
  const [showSendModal, setShowSendModal] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter !== "ALL" ? `?status=${statusFilter}` : "";
      const res = await api.get(`/api/officer/enrollment/notifications${params}`);
      setList(res.data.content || []);
      setTotalElements(res.data.totalElements || 0);
    } catch { setList([]); } finally { setLoading(false); }
  }, [statusFilter]);

  const fetchLogs = async () => {
    try {
      const res = await api.get("/api/officer/enrollment/logs");
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch { setLogs([]); }
  };

  useEffect(() => { fetchList(); }, [fetchList]);

  const filtered = list.filter(a =>
    !search ||
    a.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.application_code?.toLowerCase().includes(search.toLowerCase()) ||
    a.major_name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map(a => a.id)));

  const handleSendSuccess = () => {
    setShowSendModal(false);
    const cnt = selected.size;
    setSelected(new Set());
    showToast(`✅ Đã gửi thông báo nhập học cho ${cnt} thí sinh!`);
    fetchList();
  };

  // Stats
  const counts = {};
  STATUS_FILTERS.slice(1).forEach(f => {
    counts[f.value] = list.filter(a => (a.notif_status || "NOT_SENT") === f.value).length;
  });

  const statCfg = [
    { label: "Tổng trúng tuyển", value: totalElements, color: "#FF6B35", bg: "#FFF7ED" },
    { label: "Chưa gửi",         value: counts.NOT_SENT || 0,    color: "#94A3B8", bg: "#F8FAFC" },
    { label: "Đã gửi",           value: counts.SENT || 0,        color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Đã xem",           value: counts.READ || 0,        color: "#8B5CF6", bg: "#F5F3FF" },
    { label: "Đã xác nhận",      value: counts.CONFIRMED || 0,   color: "#10B981", bg: "#ECFDF5" },
    { label: "Hoàn tất",         value: counts.COMPLETED || 0,   color: "#059669", bg: "#D1FAE5" },
  ];

  return (
    <div style={{ padding: "24px 28px", minHeight: "100vh", background: "#F5F6FA" }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, padding: "12px 20px", borderRadius: 12,
          background: toast.type === "success" ? "#10B981" : "#EF4444", color: "white", fontWeight: 700, fontSize: 14,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8, animation: "fadeIn 0.3s" }}>
          <CheckCircle size={16} /> {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#FF6B35,#E85A2A)",
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(255,107,53,0.35)" }}>
            <GraduationCap size={24} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#1E293B" }}>Thông báo nhập học</h1>
            <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>Quản lý & theo dõi thông báo nhập học cho toàn bộ thí sinh trúng tuyển chính thức</p>
          </div>
        </div>
        {selected.size > 0 && (
          <button onClick={() => setShowSendModal(true)} style={{
            padding: "10px 22px", background: "linear-gradient(135deg,#FF6B35,#E85A2A)", border: "none",
            borderRadius: 12, fontSize: 13, fontWeight: 700, color: "white", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(255,107,53,0.4)", animation: "pulse 2s infinite" }}>
            <Send size={15} /> Gửi thông báo ({selected.size} đã chọn)
          </button>
        )}
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 24 }}>
        {statCfg.map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 14, padding: "16px 14px", textAlign: "center",
            boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: `2px solid ${s.bg}`, cursor: i > 0 ? "pointer" : "default",
            transition: "transform 0.15s" }}
            onClick={() => { if (i > 0) setStatusFilter(STATUS_FILTERS[i].value); }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginTop: 2, lineHeight: 1.3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ background: "white", borderRadius: 14, padding: "14px 18px", marginBottom: 14,
        boxShadow: "0 1px 6px rgba(0,0,0,0.06)", display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tên, mã hồ sơ, ngành..."
            style={{ width: "100%", padding: "8px 12px 8px 32px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: "8px 12px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 13, background: "white", cursor: "pointer" }}>
          {STATUS_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
        <button onClick={fetchList} style={{ padding: "8px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 12, background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "#64748B" }}>
          <RefreshCw size={13} /> Làm mới
        </button>
        <button onClick={() => { setShowLogs(l => !l); if (!showLogs) fetchLogs(); }}
          style={{ padding: "8px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10, fontSize: 12, background: showLogs ? "#F1F5F9" : "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: "#64748B" }}>
          <List size={13} /> Nhật ký
        </button>
      </div>

      {/* Log Panel */}
      {showLogs && (
        <div style={{ background: "white", borderRadius: 14, padding: 20, marginBottom: 14, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1E293B", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <List size={16} style={{ color: "#FF6B35" }} /> Nhật ký gửi thông báo ({logs.length} bản ghi)
          </div>
          {logs.length === 0
            ? <div style={{ textAlign: "center", color: "#94A3B8", padding: "24px 0", fontSize: 13 }}>Chưa có nhật ký gửi thông báo.</div>
            : logs.map((log, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", borderRadius: 8, background: i % 2 === 0 ? "#FAFBFC" : "white", marginBottom: 2 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{log.title}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>Đến: <strong>{log.full_name}</strong> ({log.email}) · Kênh: <strong>{log.channels}</strong></div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                    Gửi: {log.sent_at ? new Date(log.sent_at).toLocaleString("vi-VN") : "—"} |
                    Đọc: {log.read_at ? new Date(log.read_at).toLocaleString("vi-VN") : "—"} |
                    XN: {log.confirmed_at ? new Date(log.confirmed_at).toLocaleString("vi-VN") : "—"}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 600, whiteSpace: "nowrap" }}>{log.sent_by_name}</div>
              </div>
            ))}
        </div>
      )}

      {/* Table */}
      <div style={{ background: "white", borderRadius: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "linear-gradient(135deg,#F8FAFC,#F1F5F9)", borderBottom: "1px solid #E8ECF1" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", width: 40 }}>
                <input type="checkbox" checked={filtered.length > 0 && selected.size === filtered.length} onChange={toggleAll} style={{ accentColor: "#FF6B35", cursor: "pointer" }} />
              </th>
              {["Thí sinh", "Ngành / Campus", "Ngày trúng tuyển", "Trạng thái thông báo", "Thời gian gửi", "Thao tác"].map(h => (
                <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "56px 0", color: "#94A3B8" }}>
                <RefreshCw size={24} style={{ animation: "spin 1s linear infinite", marginBottom: 8 }} /><br/>Đang tải dữ liệu...
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: "56px 0" }}>
                <GraduationCap size={40} style={{ color: "#E2E8F0", display: "block", margin: "0 auto 12px" }} />
                <div style={{ color: "#94A3B8", fontSize: 14 }}>
                  {totalElements === 0
                    ? "Chưa có thí sinh trúng tuyển chính thức nào.\nHãy đồng bộ kết quả từ Bộ GD&ĐT trước."
                    : "Không tìm thấy kết quả phù hợp với bộ lọc hiện tại."}
                </div>
              </td></tr>
            ) : filtered.map((a) => {
              const ns = a.notif_status || "NOT_SENT";
              return (
                <tr key={a.id} style={{ borderBottom: "1px solid #F8FAFC", background: selected.has(a.id) ? "#FFF7ED" : "white", transition: "background 0.15s" }}>
                  <td style={{ padding: "13px 16px" }}>
                    <input type="checkbox" checked={selected.has(a.id)} onChange={() => toggleSelect(a.id)} style={{ accentColor: "#FF6B35", cursor: "pointer" }} />
                  </td>
                  <td style={{ padding: "13px 14px" }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#1E293B" }}>{a.full_name || "—"}</div>
                    <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 700, marginTop: 1 }}>{a.application_code}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{a.email}</div>
                  </td>
                  <td style={{ padding: "13px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{a.major_name}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{a.campus_name}</div>
                  </td>
                  <td style={{ padding: "13px 14px", fontSize: 12, color: "#64748B" }}>
                    {a.accepted_at ? new Date(a.accepted_at).toLocaleDateString("vi-VN") : "—"}
                  </td>
                  <td style={{ padding: "13px 14px" }}>
                    <StatusBadge status={ns} />
                    {ns === "NOT_SENT" && (
                      <div style={{ fontSize: 10, color: "#F59E0B", marginTop: 4, display: "flex", alignItems: "center", gap: 3 }}>
                        <AlertCircle size={10} /> Cần gửi hướng dẫn nhập học
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "13px 14px", fontSize: 11, color: "#94A3B8" }}>
                    {a.sent_at ? new Date(a.sent_at).toLocaleString("vi-VN") : "—"}
                    {a.sent_by_name && <div style={{ fontWeight: 600, color: "#64748B" }}>bởi {a.sent_by_name}</div>}
                  </td>
                  <td style={{ padding: "13px 14px" }}>
                    <button onClick={() => { setSelected(new Set([a.id])); setShowSendModal(true); }} style={{
                      padding: "6px 12px", background: "linear-gradient(135deg,#FF6B35,#E85A2A)", border: "none",
                      borderRadius: 8, fontSize: 11, fontWeight: 700, color: "white", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4 }}>
                      <Send size={11} /> {ns === "NOT_SENT" ? "Gửi" : "Gửi lại"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <SendModal
          selectedIds={[...selected]}
          onClose={() => setShowSendModal(false)}
          onSuccess={handleSendSuccess}
        />
      )}
    </div>
  );
}

