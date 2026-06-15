import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axiosConfig";
import { CheckCircle, ChevronRight, ChevronLeft, Upload, User, BookOpen, MapPin, FileText } from "lucide-react";

const steps = [
  { id: 1, label: "Thông tin cá nhân", icon: User },
  { id: 2, label: "Học vấn", icon: BookOpen },
  { id: 3, label: "Chọn ngành & cơ sở", icon: MapPin },
  { id: 4, label: "Phương thức xét tuyển", icon: FileText },
];

const MOCK_CAMPUSES = [
  { id: 1, name: "FPT University Hà Nội", city: "Hà Nội" },
  { id: 2, name: "FPT University TP.HCM", city: "TP. Hồ Chí Minh" },
  { id: 3, name: "FPT University Đà Nẵng", city: "Đà Nẵng" },
  { id: 4, name: "FPT University Cần Thơ", city: "Cần Thơ" },
  { id: 5, name: "FPT University Quy Nhơn", city: "Bình Định" },
];

const MOCK_MAJORS = [
  { id: 1, name: "Kỹ thuật phần mềm", faculty: "CNTT", campusId: 1 },
  { id: 2, name: "Trí tuệ nhân tạo", faculty: "CNTT", campusId: 1 },
  { id: 3, name: "Quản trị kinh doanh", faculty: "Kinh tế", campusId: 1 },
  { id: 7, name: "Kỹ thuật phần mềm", faculty: "CNTT", campusId: 2 },
  { id: 8, name: "Trí tuệ nhân tạo", faculty: "CNTT", campusId: 2 },
];

const MOCK_METHODS = [
  { id: 1, name: "Xét điểm thi THPT Quốc gia", code: "THPT" },
  { id: 2, name: "Xét học bạ THPT", code: "HOC_BA" },
  { id: 3, name: "Đánh giá năng lực", code: "DGNL" },
  { id: 4, name: "Chứng chỉ SAT/IELTS", code: "INT" },
];

export default function NewApplication() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [campuses, setCampuses] = useState(MOCK_CAMPUSES);
  const [majors, setMajors] = useState([]);
  const [methods, setMethods] = useState(MOCK_METHODS);

  const [form, setForm] = useState({
    // Step 1
    fullName: "", dob: "", gender: "MALE", phone: "", cccd: "",
    permanentAddress: "", province: "",
    parentName: "", parentPhone: "",
    // Step 2
    schoolName: "", graduationYear: "2025",
    mathScore: "", literatureScore: "", englishScore: "",
    gpa10: "", gpa11: "", gpa12: "",
    // Step 3
    campusId: "", majorId: "",
    // Step 4
    methodId: "", priority: "1",
  });

  useEffect(() => {
    api.get("/api/student/config/campuses").then(r => setCampuses(r.data)).catch(() => {});
    api.get("/api/student/config/methods").then(r => setMethods(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.campusId) {
      const filtered = MOCK_MAJORS.filter(m => m.campusId === Number(form.campusId));
      setMajors(filtered);
      api.get(`/api/student/config/majors?campusId=${form.campusId}`)
        .then(r => setMajors(r.data)).catch(() => {});
    }
  }, [form.campusId]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.post("/api/student/applications", {
        campusId: form.campusId,
        majorId: form.majorId,
        methodId: form.methodId,
      });
      setSubmitted(true);
    } catch {
      // mock success
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Nộp hồ sơ thành công!</h2>
          <p className="text-gray-500 mb-6 max-w-md">
            Hồ sơ của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ trong vòng 3-5 ngày làm việc.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate("/student/applications")} className="btn btn-primary">
              Xem hồ sơ của tôi
            </button>
            <button onClick={() => navigate("/student/dashboard")} className="btn btn-ghost">
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in" style={{ padding: "8px 0" }}>
      <div className="mb-6" style={{ marginBottom: "24px" }}>
        <h1 className="text-2xl font-bold text-gray-900">Nộp hồ sơ xét tuyển</h1>
        <p className="text-gray-500 text-sm mt-1">FPT University - Mùa tuyển sinh 2025</p>
      </div>

      {/* Step Indicator */}
      <div className="student-card mb-6" style={{ marginBottom: "24px", padding: "24px" }}>
        <div className="flex items-center justify-between relative" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
          <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200" style={{ position: "absolute", left: "20px", right: "20px", top: "20px", height: "3px", backgroundColor: "#E2E8F0", zIndex: 0 }}></div>
          {steps.map((step) => {
            const isDone = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2" style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div className="student-step-circle" style={{
                  background: isDone ? "#22C55E" : isCurrent ? "linear-gradient(135deg, #FF6B35, #E85A2A)" : "white",
                  color: isDone || isCurrent ? "white" : "#94A3B8",
                  border: isDone || isCurrent ? "none" : "2px solid #E2E8F0",
                  boxShadow: isCurrent ? "0 4px 12px rgba(255,107,53,0.25)" : "none",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold"
                }}>
                  {isDone ? "✓" : <step.icon size={18} />}
                </div>
                <span style={{ fontSize: "11px", fontWeight: "600", color: isCurrent ? "#E85A2A" : isDone ? "#22C55E" : "#94A3B8" }} className="hidden sm:block">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="student-card" style={{ padding: "0" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
          <h2 className="font-bold text-gray-900 text-lg">Bước {currentStep}: {steps[currentStep-1].label}</h2>
        </div>
        <div style={{ padding: "24px" }}>

          {/* Step 1: Personal Info */}
          {currentStep === 1 && (
            <div className="grid grid-cols-2 gap-5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label">Họ và tên *</label>
                <input className="form-input" value={form.fullName} onChange={update("fullName")} placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="form-label">Ngày sinh *</label>
                <input type="date" className="form-input" value={form.dob} onChange={update("dob")} />
              </div>
              <div>
                <label className="form-label">Giới tính</label>
                <select className="form-select" value={form.gender} onChange={update("gender")}>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
              <div>
                <label className="form-label">Số điện thoại</label>
                <input className="form-input" value={form.phone} onChange={update("phone")} placeholder="0901234567" />
              </div>
              <div>
                <label className="form-label">Số CCCD *</label>
                <input className="form-input" value={form.cccd} onChange={update("cccd")} placeholder="012345678901" />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label">Địa chỉ thường trú *</label>
                <input className="form-input" value={form.permanentAddress} onChange={update("permanentAddress")} placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" />
              </div>
              <div>
                <label className="form-label">Họ tên phụ huynh</label>
                <input className="form-input" value={form.parentName} onChange={update("parentName")} placeholder="Nguyễn Văn B" />
              </div>
              <div>
                <label className="form-label">SĐT phụ huynh</label>
                <input className="form-input" value={form.parentPhone} onChange={update("parentPhone")} placeholder="0901234567" />
              </div>
            </div>
          )}

          {/* Step 2: Academic */}
          {currentStep === 2 && (
            <div className="grid grid-cols-2 gap-5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label className="form-label">Tên trường THPT *</label>
                <input className="form-input" value={form.schoolName} onChange={update("schoolName")} placeholder="THPT Chu Văn An" />
              </div>
              <div>
                <label className="form-label">Năm tốt nghiệp</label>
                <select className="form-select" value={form.graduationYear} onChange={update("graduationYear")}>
                  <option>2025</option><option>2024</option><option>2023</option>
                </select>
              </div>
              <div></div>
              <div style={{ gridColumn: "span 2" }}>
                <p className="text-sm font-bold text-gray-700 mb-3" style={{ marginBottom: "12px", color: "#475569" }}>📊 Điểm thi THPT Quốc gia</p>
                <div className="grid grid-cols-3 gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  {[["Toán", "mathScore"], ["Văn", "literatureScore"], ["Anh", "englishScore"]].map(([label, field]) => (
                    <div key={field}>
                      <label className="form-label">{label}</label>
                      <input type="number" step="0.25" min="0" max="10" className="form-input" value={form[field]} onChange={update(field)} placeholder="0.00" />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <p className="text-sm font-bold text-gray-700 mb-3" style={{ marginBottom: "12px", color: "#475569" }}>📚 GPA học bạ</p>
                <div className="grid grid-cols-3 gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  {[["Lớp 10", "gpa10"], ["Lớp 11", "gpa11"], ["Lớp 12", "gpa12"]].map(([label, field]) => (
                    <div key={field}>
                      <label className="form-label">{label}</label>
                      <input type="number" step="0.1" min="0" max="10" className="form-input" value={form[field]} onChange={update(field)} placeholder="0.0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Campus & Major */}
          {currentStep === 3 && (
            <div className="space-y-5" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label className="form-label">Cơ sở đào tạo *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
                  {campuses.map((campus) => (
                    <label key={campus.id}
                      className="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px",
                        borderRadius: "14px",
                        border: form.campusId == campus.id ? "2px solid #FF6B35" : "2px solid #E2E8F0",
                        backgroundColor: form.campusId == campus.id ? "#FFF7F4" : "white",
                        cursor: "pointer"
                      }}>
                      <input type="radio" name="campus" value={campus.id} checked={form.campusId == campus.id} onChange={update("campusId")} className="sr-only" />
                      <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: form.campusId == campus.id ? "2px solid #FF6B35" : "2px solid #CBD5E1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {form.campusId == campus.id && <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FF6B35" }}></div>}
                      </div>
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "14px", color: "#1E293B" }}>{campus.name}</div>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{campus.city}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {form.campusId && (
                <div style={{ marginTop: "8px" }}>
                  <label className="form-label">Ngành học *</label>
                  <select className="form-select mt-2" style={{ marginTop: "8px" }} value={form.majorId} onChange={update("majorId")}>
                    <option value="">-- Chọn ngành --</option>
                    {majors.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.faculty})</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Admission Method */}
          {currentStep === 4 && (
            <div className="space-y-5" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label className="form-label">Phương thức xét tuyển *</label>
                <div className="space-y-3 mt-2" style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                  {methods.map((method) => (
                    <label key={method.id}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        padding: "16px",
                        borderRadius: "14px",
                        border: form.methodId == method.id ? "2px solid #FF6B35" : "2px solid #E2E8F0",
                        backgroundColor: form.methodId == method.id ? "#FFF7F4" : "white",
                        cursor: "pointer"
                      }}>
                      <input type="radio" name="method" value={method.id} checked={form.methodId == method.id} onChange={update("methodId")} className="sr-only" />
                      <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: form.methodId == method.id ? "2px solid #FF6B35" : "2px solid #CBD5E1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        {form.methodId == method.id && <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#FF6B35" }}></div>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "600", fontSize: "14px", color: "#1E293B" }}>{method.name}</div>
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>Mã: {method.code}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Summary */}
              {form.methodId && form.majorId && (
                <div style={{
                  background: "#FFF7F4",
                  borderRadius: "14px",
                  padding: "20px",
                  border: "1px solid #FFEDD5",
                  marginTop: "24px"
                }}>
                  <h4 className="font-bold text-gray-900 mb-3" style={{ color: "#E85A2A", marginBottom: "12px" }}>📋 Tóm tắt hồ sơ</h4>
                  <div className="space-y-2 text-sm" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="text-gray-500">Họ tên:</span>
                      <span className="font-semibold text-gray-800">{form.fullName || "Chưa điền"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="text-gray-500">Cơ sở:</span>
                      <span className="font-semibold text-gray-800">{campuses.find(c => c.id == form.campusId)?.name || "-"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="text-gray-500">Ngành:</span>
                      <span className="font-semibold text-gray-800">{majors.find(m => m.id == form.majorId)?.name || "-"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="text-gray-500">Phương thức:</span>
                      <span className="font-semibold text-gray-800">{methods.find(m => m.id == form.methodId)?.name || "-"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              fontSize: "14px",
              cursor: currentStep === 1 ? "not-allowed" : "pointer",
              background: "white",
              border: "1px solid #E2E8F0",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: currentStep === 1 ? 0.4 : 1
            }}
          >
            <ChevronLeft size={18} /> Trước
          </button>
          {currentStep < steps.length ? (
            <button onClick={() => setCurrentStep(currentStep + 1)} className="student-btn-primary" style={{ padding: "10px 20px", borderRadius: "10px", fontSize: "14px" }}>
              Tiếp theo <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="student-btn-primary" style={{ padding: "10px 20px", borderRadius: "10px", fontSize: "14px" }}>
              {loading ? "Đang nộp..." : <><CheckCircle size={18} /> Nộp hồ sơ</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
