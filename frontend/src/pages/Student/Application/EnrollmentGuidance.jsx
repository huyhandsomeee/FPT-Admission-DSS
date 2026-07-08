import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../config/axiosConfig";
import {
  CheckCircle, Circle, Download, Calendar,
  Wallet, FileText, Phone, User, ChevronRight, ArrowLeft,
  BookOpen, Upload, Clock, AlertCircle, GraduationCap
} from "lucide-react";

const JOURNEY_STEPS = [
  { key: "SUBMITTED",       label: "Nộp hồ sơ" },
  { key: "APPROVED",        label: "Đủ điều kiện" },
  { key: "REGISTERED_MOET", label: "Xác nhận NV" },
  { key: "ACCEPTED_MOET",   label: "Trúng tuyển" },
  { key: "NOTIF_SENT",      label: "Nhận hướng dẫn" },
  { key: "CONFIRMED",       label: "Đã xác nhận" },
  { key: "ENROLLED",        label: "Hoàn tất" },
];
const STATUS_ORDER = ["SUBMITTED","APPROVED","REGISTERED_MOET","ACCEPTED_MOET","NOTIF_SENT","CONFIRMED","ENROLLED"];

function getJourneyStep(status, notif) {
  if (notif?.completed_at) return "ENROLLED";
  if (notif?.confirmed_at) return "CONFIRMED";
  if (notif?.sent_at)      return "NOTIF_SENT";
  return status || "SUBMITTED";
}

function CheckItem({ label, sublabel, done, onToggle, linkHref, linkLabel, onUpload }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderRadius:12, background:done?"linear-gradient(135deg,#ECFDF5,#D1FAE5)":"white", border:`1.5px solid ${done?"#10B981":"#E2E8F0"}`, transition:"all 0.25s", marginBottom:8 }}>
      <button onClick={onToggle} style={{ background:"none", border:"none", cursor:"pointer", padding:0, display:"flex", flexShrink:0 }}>
        {done ? <CheckCircle size={22} color="#10B981" /> : <Circle size={22} color="#CBD5E1" />}
      </button>
      <div style={{ flex:1 }}>
        <div style={{ fontWeight:700, fontSize:14, color:done?"#065F46":"#1E293B", textDecoration:done?"line-through":"none", opacity:done?0.8:1 }}>{label}</div>
        {sublabel && <div style={{ fontSize:12, color:"#64748B", marginTop:2 }}>{sublabel}</div>}
      </div>
      <div style={{ display:"flex", gap:8, flexShrink:0 }}>
        {linkHref && <a href={linkHref} target="_blank" rel="noreferrer" style={{ padding:"6px 12px", background:"#EFF6FF", color:"#2563EB", borderRadius:8, fontSize:11, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", gap:4 }}><ChevronRight size={11}/>{linkLabel||"Mở"}</a>}
        {onUpload && <label style={{ padding:"6px 12px", background:"#F5F3FF", color:"#7C3AED", borderRadius:8, fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}><Upload size={11}/>Upload<input type="file" style={{display:"none"}} onChange={onUpload}/></label>}
      </div>
    </div>
  );
}

function JourneyTimeline({ currentStep }) {
  const currentIdx = STATUS_ORDER.indexOf(currentStep);
  return (
    <div style={{ display:"flex", alignItems:"center", overflowX:"auto", padding:"4px 0" }}>
      {JOURNEY_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const active = STATUS_ORDER[currentIdx] === step.key;
        return (
          <div key={step.key} style={{ display:"flex", alignItems:"center", flex: i < JOURNEY_STEPS.length-1 ? "1 1 auto" : "0 0 auto" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", minWidth:56 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:done?(active?"#FF6B35":"#10B981"):"#E2E8F0", display:"flex", alignItems:"center", justifyContent:"center", border:active?"3px solid #FF6B3566":"none", flexShrink:0, boxShadow:active?"0 0 12px rgba(255,107,53,0.4)":"none", transition:"all 0.3s" }}>
                {done && !active ? <CheckCircle size={14} color="white"/> : <div style={{ width:10, height:10, borderRadius:"50%", background:done?"white":"#CBD5E1" }}/>}
              </div>
              <div style={{ fontSize:9, fontWeight:700, color:done?"#1E293B":"#94A3B8", marginTop:4, textAlign:"center", lineHeight:1.2, maxWidth:56 }}>{step.label}</div>
            </div>
            {i < JOURNEY_STEPS.length-1 && <div style={{ flex:1, height:2, background: i < currentIdx ? "linear-gradient(90deg,#10B981,#3B82F6)" : "#E2E8F0", marginBottom:16, transition:"background 0.4s" }}/>}
          </div>
        );
      })}
    </div>
  );
}

export default function EnrollmentGuidance() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [checklist, setChecklist] = useState({ READ_GUIDE:false, TUITION_PAID:false, SCHEDULED:false, DOCS_READY:false, ENROLL_CONFIRMED:false });
  const [uploadMsg, setUploadMsg] = useState(null);

  useEffect(() => {
    api.get(`/api/student/enrollment/${id}`)
      .then(r => {
        setData(r.data);
        const n = r.data.notification;
        if (n) {
          setConfirmed(!!n.confirmed_at);
          setChecklist(prev => ({ ...prev, READ_GUIDE:!!n.confirmed_at, TUITION_PAID:!!n.tuition_paid_at, SCHEDULED:!!n.scheduled_at, ENROLL_CONFIRMED:!!n.completed_at }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleConfirmRead = async () => {
    setConfirming(true);
    try {
      await api.post(`/api/student/enrollment/${id}/confirm-read`);
      setConfirmed(true);
      setChecklist(prev => ({ ...prev, READ_GUIDE:true }));
    } catch(e){ console.error(e); } finally { setConfirming(false); }
  };

  const toggleCheck = async (key) => {
    const v = !checklist[key];
    setChecklist(prev => ({ ...prev, [key]:v }));
    try { await api.post(`/api/student/enrollment/${id}/checklist`, { item:key, done:v }); } catch{}
  };

  const handleUpload = (key) => (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadMsg(`✅ Đã tải lên: ${file.name}`);
    toggleCheck(key);
    setTimeout(() => setUploadMsg(null), 4000);
  };

  const doneCount = Object.values(checklist).filter(Boolean).length;
  const totalChecks = Object.keys(checklist).length;
  const progress = Math.round((doneCount / totalChecks) * 100);

  if (loading) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400, gap:12 }}>
      <div style={{ width:40, height:40, border:"4px solid #F1F5F9", borderTopColor:"#FF6B35", borderRadius:"50%", animation:"spin 1s linear infinite" }}/>
      <div style={{ color:"#94A3B8", fontSize:14 }}>Đang tải thông tin nhập học...</div>
    </div>
  );

  const notif = data?.notification;
  const journeyStep = getJourneyStep(data?.status, notif);

  return (
    <div style={{ padding:"20px 24px", maxWidth:800, margin:"0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:"#64748B", fontSize:13, fontWeight:600, marginBottom:20, padding:0 }}>
        <ArrowLeft size={14}/> Quay lại hồ sơ của tôi
      </button>

      {uploadMsg && <div style={{ position:"fixed", top:20, right:20, zIndex:9999, padding:"12px 20px", borderRadius:12, background:"#10B981", color:"white", fontWeight:700, fontSize:14, boxShadow:"0 8px 24px rgba(0,0,0,0.15)" }}>{uploadMsg}</div>}

      {/* Hero */}
      <div style={{ borderRadius:20, background:"linear-gradient(135deg,#FF6B35 0%,#E85A2A 50%,#C84B1E 100%)", padding:"28px 32px", marginBottom:24, boxShadow:"0 12px 36px rgba(255,107,53,0.35)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-30, right:-30, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:28, marginBottom:8 }}>🎉</div>
          <h1 style={{ margin:"0 0 6px", color:"white", fontSize:22, fontWeight:900 }}>Chúc mừng bạn đã trúng tuyển!</h1>
          <p style={{ margin:"0 0 16px", color:"rgba(255,255,255,0.85)", fontSize:14 }}>Đại học FPT trân trọng thông báo bạn đã chính thức trúng tuyển.</p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {[["📋 Mã hồ sơ", data?.applicationCode],["📚 Ngành", data?.majorName],["🏫 Campus", data?.campusName],["📅 Trúng tuyển", data?.acceptedAt ? new Date(data.acceptedAt).toLocaleDateString("vi-VN") : "—"]].map(([lbl,val]) => (
              <div key={lbl} style={{ background:"rgba(255,255,255,0.15)", borderRadius:10, padding:"8px 14px", backdropFilter:"blur(4px)" }}>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.7)", fontWeight:700 }}>{lbl}</div>
                <div style={{ fontSize:13, color:"white", fontWeight:800, marginTop:2 }}>{val||"—"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ background:"white", borderRadius:16, padding:"20px 24px", marginBottom:20, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ fontWeight:700, fontSize:14, color:"#1E293B", marginBottom:16 }}>🗺️ Tiến trình nhập học</div>
        <JourneyTimeline currentStep={journeyStep}/>
      </div>

      {/* Notification */}
      {notif ? (
        <div style={{ background:"white", borderRadius:16, padding:"24px", marginBottom:20, boxShadow:"0 2px 10px rgba(0,0,0,0.06)", border:"1px solid #FEE2E2" }}>
          <div style={{ fontWeight:800, fontSize:18, color:"#1E293B", marginBottom:12 }}>{notif.title}</div>
          <div style={{ fontSize:14, color:"#475569", whiteSpace:"pre-line", lineHeight:1.8, marginBottom:16 }}>{notif.content}</div>
          {(notif.deadline || notif.tuition_amount) && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              {notif.deadline && <div style={{ background:"#FEF2F2", borderRadius:12, padding:"12px 16px", display:"flex", gap:10, alignItems:"center" }}><Clock size={18} color="#DC2626"/><div><div style={{ fontSize:11, fontWeight:700, color:"#DC2626" }}>DEADLINE</div><div style={{ fontWeight:800, color:"#1E293B", marginTop:2 }}>{notif.deadline}</div></div></div>}
              {notif.tuition_amount && <div style={{ background:"#EFF6FF", borderRadius:12, padding:"12px 16px", display:"flex", gap:10, alignItems:"center" }}><Wallet size={18} color="#2563EB"/><div><div style={{ fontSize:11, fontWeight:700, color:"#2563EB" }}>HỌC PHÍ / KỲ</div><div style={{ fontWeight:800, color:"#1E293B", marginTop:2 }}>{notif.tuition_amount}</div></div></div>}
            </div>
          )}
          {notif.documents && <div style={{ background:"#F8FAFC", borderRadius:12, padding:"14px 16px", marginBottom:16 }}><div style={{ fontWeight:700, fontSize:13, color:"#475569", marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><FileText size={14}/>Giấy tờ cần chuẩn bị</div><pre style={{ margin:0, fontSize:13, color:"#334155", whiteSpace:"pre-line", fontFamily:"inherit", lineHeight:1.8 }}>{notif.documents}</pre></div>}
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {notif.tuition_link && <a href={notif.tuition_link} target="_blank" rel="noreferrer" style={{ padding:"8px 14px", background:"#ECFDF5", color:"#059669", borderRadius:10, fontSize:12, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}><Wallet size={13}/>Đóng học phí</a>}
            {notif.schedule_link && <a href={notif.schedule_link} target="_blank" rel="noreferrer" style={{ padding:"8px 14px", background:"#EFF6FF", color:"#2563EB", borderRadius:10, fontSize:12, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}><Calendar size={13}/>Đặt lịch nhập học</a>}
            {notif.download_link && <a href={notif.download_link} target="_blank" rel="noreferrer" style={{ padding:"8px 14px", background:"#F5F3FF", color:"#7C3AED", borderRadius:10, fontSize:12, fontWeight:700, textDecoration:"none", display:"flex", alignItems:"center", gap:6 }}><Download size={13}/>Tải giấy báo</a>}
          </div>
          {(notif.hotline || notif.contact_person) && <div style={{ marginTop:14, fontSize:12, color:"#64748B", display:"flex", gap:16, flexWrap:"wrap" }}>
            {notif.hotline && <span style={{ display:"flex", alignItems:"center", gap:4 }}><Phone size={12}/>Hotline: <strong>{notif.hotline}</strong></span>}
            {notif.contact_person && <span style={{ display:"flex", alignItems:"center", gap:4 }}><User size={12}/>Phụ trách: <strong>{notif.contact_person}</strong></span>}
          </div>}
        </div>
      ) : (
        <div style={{ background:"#FFFBEB", borderRadius:16, padding:"20px 24px", marginBottom:20, border:"1px solid #FDE68A", display:"flex", gap:12, alignItems:"flex-start" }}>
          <AlertCircle size={20} color="#F59E0B" style={{ flexShrink:0, marginTop:2 }}/>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:"#92400E" }}>Chưa nhận được thông báo nhập học</div>
            <div style={{ fontSize:13, color:"#78350F", marginTop:4 }}>Phòng Tuyển sinh chưa gửi hướng dẫn. Liên hệ <strong>1800 6036</strong> nếu cần hỗ trợ gấp.</div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ background:"white", borderRadius:16, padding:"20px 24px", marginBottom:20, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ fontWeight:700, fontSize:14, color:"#1E293B" }}>✅ Tiến độ hoàn thành</div>
          <div style={{ fontWeight:800, fontSize:16, color:progress===100?"#10B981":"#FF6B35" }}>{progress}%</div>
        </div>
        <div style={{ height:10, background:"#F1F5F9", borderRadius:10, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${progress}%`, background:progress===100?"linear-gradient(90deg,#10B981,#059669)":"linear-gradient(90deg,#FF6B35,#FBBF24)", borderRadius:10, transition:"width 0.6s ease" }}/>
        </div>
        <div style={{ fontSize:12, color:"#64748B", marginTop:6 }}>Hoàn thành {doneCount}/{totalChecks} bước</div>
      </div>

      {/* Checklist */}
      <div style={{ background:"white", borderRadius:16, padding:"20px 24px", marginBottom:20, boxShadow:"0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ fontWeight:700, fontSize:15, color:"#1E293B", marginBottom:16, display:"flex", alignItems:"center", gap:8 }}><BookOpen size={16} style={{ color:"#FF6B35" }}/>Danh sách việc cần làm</div>
        <CheckItem done={checklist.READ_GUIDE} onToggle={() => {}} label="Đọc & hiểu hướng dẫn nhập học" sublabel="Bấm nút xác nhận bên dưới sau khi đọc xong"/>
        <CheckItem done={checklist.TUITION_PAID} onToggle={() => toggleCheck("TUITION_PAID")} label="Đóng học phí" sublabel={notif?.tuition_amount ? `Số tiền: ${notif.tuition_amount}` : "Hoàn thành đóng học phí"} linkHref={notif?.tuition_link} linkLabel="Đóng học phí" onUpload={handleUpload("TUITION_PAID")}/>
        <CheckItem done={checklist.SCHEDULED} onToggle={() => toggleCheck("SCHEDULED")} label="Đặt lịch nhập học" sublabel="Chọn ngày, giờ và địa điểm nhập học" linkHref={notif?.schedule_link} linkLabel="Đặt lịch ngay"/>
        <CheckItem done={checklist.DOCS_READY} onToggle={() => toggleCheck("DOCS_READY")} label="Chuẩn bị hồ sơ giấy tờ" sublabel="Theo danh sách giấy tờ trong thông báo" onUpload={handleUpload("DOCS_READY")}/>
        <CheckItem done={checklist.ENROLL_CONFIRMED} onToggle={() => toggleCheck("ENROLL_CONFIRMED")} label="Xác nhận sẽ nhập học" sublabel="Cam kết hoàn thành nhập học đúng thời hạn"/>

        {/* CTA: Điền form nhập học */}
        <div style={{ marginTop:16, padding:"16px 18px", background:"linear-gradient(135deg,#FFF7ED,#FFEDD5)", borderRadius:14, border:"2px solid #FB923C" }}>
          <div style={{ fontWeight:800, fontSize:14, color:"#C2410C", marginBottom:6 }}>📝 Bước 5: Điền form thủ tục nhập học trực tuyến</div>
          <div style={{ fontSize:13, color:"#78350F", marginBottom:12, lineHeight:1.6 }}>Điền đầy đủ thông tin cá nhân, thông tin phụ huynh và xác nhận để hoàn tất thủ tục nhập học chính thức.</div>
          <button onClick={() => navigate(`/student/enrollment-form/${id}`)} style={{ padding:"10px 20px", background:"linear-gradient(135deg,#FF6B35,#E85A2A)", border:"none", borderRadius:10, fontSize:13, fontWeight:800, color:"white", cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 12px rgba(255,107,53,0.35)" }}>
            <GraduationCap size={15}/> Điền form thủ tục nhập học →
          </button>
        </div>
      </div>

      {/* Confirm button */}
      {notif && !confirmed && (
        <div style={{ background:"linear-gradient(135deg,#FFF7ED,#FFEDD5)", borderRadius:16, padding:"24px", textAlign:"center", border:"1px solid #FED7AA", marginBottom:20 }}>
          <div style={{ fontSize:15, fontWeight:700, color:"#92400E", marginBottom:8 }}>📖 Bạn đã đọc xong hướng dẫn?</div>
          <div style={{ fontSize:13, color:"#78350F", marginBottom:16 }}>Bấm xác nhận để thông báo cho Phòng Tuyển sinh biết bạn đã tiếp nhận hướng dẫn nhập học.</div>
          <button onClick={handleConfirmRead} disabled={confirming} style={{ padding:"12px 28px", background:confirming?"#CBD5E1":"linear-gradient(135deg,#FF6B35,#E85A2A)", border:"none", borderRadius:12, fontSize:14, fontWeight:800, color:"white", cursor:confirming?"not-allowed":"pointer", boxShadow:confirming?"none":"0 4px 14px rgba(255,107,53,0.4)" }}>
            {confirming ? "Đang xử lý…" : "✅ Tôi đã đọc và hiểu hướng dẫn"}
          </button>
        </div>
      )}
      {confirmed && (
        <div style={{ background:"linear-gradient(135deg,#ECFDF5,#D1FAE5)", borderRadius:16, padding:"20px 24px", textAlign:"center", border:"1px solid #6EE7B7", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
          <CheckCircle size={22} color="#059669"/>
          <div style={{ fontWeight:700, fontSize:15, color:"#065F46" }}>✓ Đã xác nhận đọc hướng dẫn nhập học</div>
        </div>
      )}

      <div style={{ textAlign:"center", fontSize:12, color:"#94A3B8", marginTop:8 }}>
        Cần hỗ trợ? Liên hệ hotline <strong style={{ color:"#FF6B35" }}>1800 6036</strong> (miễn phí, 8:00 – 17:00)
      </div>
    </div>
  );
}

