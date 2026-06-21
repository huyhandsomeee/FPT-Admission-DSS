import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axiosConfig";
import { CheckCircle, ChevronRight, ChevronLeft, Upload, User, BookOpen, MapPin, FileText } from "lucide-react";

const steps = [
  { id: 1, label: "Thông tin cá nhân", icon: User },
  { id: 2, label: "Học vấn", icon: BookOpen },
  { id: 3, label: "Ngành & Phương thức", icon: MapPin },
  { id: 4, label: "Tài liệu đính kèm", icon: Upload },
  { id: 5, label: "Xác nhận & Nộp", icon: FileText },
];

export default function NewApplication() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [campuses, setCampuses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [methods, setMethods] = useState([]);
  const [provinces, setProvinces] = useState([]);

  const [form, setForm] = useState({
    // Step 1
    fullName: "", dob: "", gender: "MALE", phone: "", cccd: "",
    permanentAddress: "", provinceId: "",
    parentName: "", parentPhone: "",
    // Step 2
    schoolName: "", graduationYear: "2026",
    mathScore: "", literatureScore: "", englishScore: "",
    gpa10: "", gpa11: "", gpa12: "",
    // Step 3
    campusId: "", majorId: "", methodId: "", priority: "1",
  });

  const [files, setFiles] = useState({
    cccdFile: null,
    hocBaFile: null,
    bangTNFile: null,
    anhTheFile: null,
    giayKhaiSinhFile: null,
    chungChiFile: null,
    hoKhauFile: null
  });

  useEffect(() => {
    api.get("/api/student/config/campuses").then(r => setCampuses(r.data)).catch(() => {});
    api.get("/api/student/config/methods").then(r => setMethods(r.data)).catch(() => {});
    api.get("/api/student/config/provinces").then(r => setProvinces(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.campusId) {
      api.get(`/api/student/config/majors?campusId=${form.campusId}`)
        .then(r => setMajors(r.data)).catch(() => {});
    } else {
      setMajors([]);
    }
  }, [form.campusId]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validateStep = () => {
    if (currentStep === 1) {
      if (!form.fullName || !form.dob || !form.cccd || !form.permanentAddress || !form.provinceId) {
        alert("Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
        return false;
      }
    } else if (currentStep === 2) {
      if (!form.schoolName || !form.mathScore || !form.literatureScore || !form.englishScore || !form.gpa10 || !form.gpa11 || !form.gpa12) {
        alert("Vui lòng nhập đầy đủ thông tin học vấn và điểm số xét tuyển");
        return false;
      }
    } else if (currentStep === 3) {
      if (!form.campusId || !form.majorId || !form.methodId) {
        alert("Vui lòng chọn cơ sở, ngành học và phương thức xét tuyển");
        return false;
      }
    } else if (currentStep === 4) {
      if (!files.cccdFile || !files.hocBaFile || !files.bangTNFile || !files.anhTheFile || !files.giayKhaiSinhFile) {
        alert("Vui lòng tải lên đầy đủ các tài liệu bắt buộc (*)");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(Math.min(steps.length, currentStep + 1));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("dob", form.dob);
      formData.append("gender", form.gender);
      formData.append("phone", form.phone);
      formData.append("cccd", form.cccd);
      formData.append("permanentAddress", form.permanentAddress);
      formData.append("provinceId", form.provinceId);
      formData.append("parentName", form.parentName || "");
      formData.append("parentPhone", form.parentPhone || "");

      formData.append("schoolName", form.schoolName);
      formData.append("graduationYear", form.graduationYear);
      formData.append("mathScore", form.mathScore);
      formData.append("literatureScore", form.literatureScore);
      formData.append("englishScore", form.englishScore);
      formData.append("gpa10", form.gpa10);
      formData.append("gpa11", form.gpa11);
      formData.append("gpa12", form.gpa12);

      formData.append("campusId", form.campusId);
      formData.append("majorId", form.majorId);
      formData.append("methodId", form.methodId);

      formData.append("cccdFile", files.cccdFile);
      formData.append("hocBaFile", files.hocBaFile);
      formData.append("bangTNFile", files.bangTNFile);
      formData.append("anhTheFile", files.anhTheFile);
      formData.append("giayKhaiSinhFile", files.giayKhaiSinhFile);
      if (files.chungChiFile) formData.append("chungChiFile", files.chungChiFile);
      if (files.hoKhauFile) formData.append("hoKhauFile", files.hoKhauFile);

      await api.post("/api/student/applications", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi khi nộp hồ sơ. Vui lòng kiểm tra lại dữ liệu.");
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
            Hồ sơ tuyển sinh của bạn đã được lưu và đồng bộ sang trang quản trị của cán bộ tuyển sinh. Chúng tôi sẽ phản hồi sớm nhất!
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
        <p className="text-gray-500 text-sm mt-1">FPT University - Mùa tuyển sinh 2026</p>
      </div>

      {/* Step Indicator */}
      <div className="student-card mb-6" style={{ marginBottom: "24px", padding: "24px" }}>
        <div className="flex items-center justify-between relative" style={{ display: "flex", alignItems: "center", justifyItems: "space-between", position: "relative" }}>
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
                <input className="form-input" value={form.fullName} onChange={update("fullName")} placeholder="Nguyễn Văn A" required />
              </div>
              <div>
                <label className="form-label">Ngày sinh *</label>
                <input type="date" className="form-input" value={form.dob} onChange={update("dob")} required />
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
                <label className="form-label">Số điện thoại *</label>
                <input className="form-input" value={form.phone} onChange={update("phone")} placeholder="0901234567" required />
              </div>
              <div>
                <label className="form-label">Số CCCD *</label>
                <input className="form-input" value={form.cccd} onChange={update("cccd")} placeholder="012345678901" required />
              </div>
              <div>
                <label className="form-label">Tỉnh/Thành phố (nơi thường trú) *</label>
                <select className="form-select" value={form.provinceId} onChange={update("provinceId")} required>
                  <option value="">-- Chọn Tỉnh/Thành --</option>
                  {provinces.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Địa chỉ chi tiết (thường trú) *</label>
                <input className="form-input" value={form.permanentAddress} onChange={update("permanentAddress")} placeholder="Số nhà, Tên đường, Phường/Xã..." required />
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
                <input className="form-input" value={form.schoolName} onChange={update("schoolName")} placeholder="THPT Chu Văn An" required />
              </div>
              <div>
                <label className="form-label">Năm tốt nghiệp</label>
                <select className="form-select" value={form.graduationYear} onChange={update("graduationYear")}>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <div></div>
              <div style={{ gridColumn: "span 2" }}>
                <p className="text-sm font-bold text-gray-700 mb-3" style={{ marginBottom: "12px", color: "#475569" }}>📊 Điểm thi tốt nghiệp THPT</p>
                <div className="grid grid-cols-3 gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  {[["Toán *", "mathScore"], ["Văn *", "literatureScore"], ["Anh *", "englishScore"]].map(([label, field]) => (
                    <div key={field}>
                      <label className="form-label">{label}</label>
                      <input type="number" step="0.01" min="0" max="10" className="form-input" value={form[field]} onChange={update(field)} placeholder="0.00" required />
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <p className="text-sm font-bold text-gray-700 mb-3" style={{ marginBottom: "12px", color: "#475569" }}>📚 GPA học bạ lớp 10, 11, 12</p>
                <div className="grid grid-cols-3 gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                  {[["Lớp 10 *", "gpa10"], ["Lớp 11 *", "gpa11"], ["Lớp 12 *", "gpa12"]].map(([label, field]) => (
                    <div key={field}>
                      <label className="form-label">{label}</label>
                      <input type="number" step="0.01" min="0" max="10" className="form-input" value={form[field]} onChange={update(field)} placeholder="0.00" required />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Campus, Major, Method */}
          {currentStep === 3 && (
            <div className="space-y-5" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label className="form-label">Cơ sở đào tạo *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
                  {campuses.map((campus) => (
                    <div key={campus.id}
                      onClick={() => setForm({ ...form, campusId: campus.id, majorId: "" })}
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
                    </div>
                  ))}
                </div>
              </div>

              {form.campusId && (
                <div style={{ marginTop: "8px" }}>
                  <label className="form-label">Ngành học *</label>
                  <select className="form-select mt-2" style={{ marginTop: "8px" }} value={form.majorId} onChange={update("majorId")} required>
                    <option value="">-- Chọn ngành học --</option>
                    {majors.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="form-label">Phương thức xét tuyển *</label>
                <div className="space-y-3 mt-2" style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                  {methods.map((method) => (
                    <div key={method.id}
                      onClick={() => setForm({ ...form, methodId: method.id })}
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
                        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{method.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents Upload */}
          {currentStep === 4 && (
            <div className="space-y-6" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "14px", padding: "16px", fontSize: "13px", color: "#1E40AF" }}>
                💡 <strong>Yêu cầu tải tài liệu:</strong> Vui lòng đính kèm các tài liệu liên quan để cán bộ kiểm tra và đối chiếu. Tài liệu bắt buộc có dấu sao (*).
              </div>
              <div className="space-y-4" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { name: "Căn cước công dân (CCCD) *", key: "cccdFile", desc: "Bản chụp rõ 2 mặt của CCCD" },
                  { name: "Học bạ THPT *", key: "hocBaFile", desc: "Bản sao học bạ 3 năm cấp 3" },
                  { name: "Bằng/Giấy chứng nhận tốt nghiệp *", key: "bangTNFile", desc: "Bản sao bằng tốt nghiệp hoặc giấy CNTN tạm thời" },
                  { name: "Ảnh thẻ 3x4 *", key: "anhTheFile", desc: "Ảnh chân dung nền trắng (định dạng JPG/PNG)" },
                  { name: "Giấy khai sinh *", key: "giayKhaiSinhFile", desc: "Bản sao giấy khai sinh" },
                  { name: "Chứng chỉ ngoại ngữ (Tùy chọn)", key: "chungChiFile", desc: "Chứng chỉ IELTS, SAT, TOEFL,... nếu có" },
                  { name: "Sổ hộ khẩu (Tùy chọn)", key: "hoKhauFile", desc: "Bản sao sổ hộ khẩu" }
                ].map((doc) => (
                  <div key={doc.key} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px", borderRadius: "14px", border: "1px solid #E2E8F0",
                    background: files[doc.key] ? "#F0FDF4" : "white",
                    transition: "all 0.2s"
                  }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontWeight: "600", fontSize: "14px", color: "#1E293B" }}>{doc.name}</span>
                      <span style={{ fontSize: "12px", color: "#64748B" }}>{doc.desc}</span>
                      {files[doc.key] && (
                        <span style={{ fontSize: "12px", color: "#16A34A", fontWeight: "600", marginTop: "4px", display: "block" }}>
                          ✓ Đã chọn: {files[doc.key].name} ({(files[doc.key].size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      )}
                    </div>
                    <label style={{
                      padding: "8px 16px", background: files[doc.key] ? "#DCFCE7" : "#F1F5F9",
                      color: files[doc.key] ? "#15803D" : "#475569",
                      borderRadius: "10px", fontSize: "13px", fontWeight: "600",
                      cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                    }}>
                      <Upload size={16} /> Chọn tệp
                      <input type="file" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFiles({ ...files, [doc.key]: e.target.files[0] });
                        }
                      }} style={{ display: "none" }} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Summary */}
          {currentStep === 5 && (
            <div style={{
              background: "#FFF7F4",
              borderRadius: "14px",
              padding: "24px",
              border: "1px solid #FFEDD5"
            }}>
              <h4 className="font-bold text-gray-900 mb-4" style={{ color: "#E85A2A", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                📋 TÓM TẮT HỒ SƠ ĐĂNG KÝ
              </h4>
              <div className="space-y-3 text-sm" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #FFEDD5", paddingBottom: "8px" }}>
                  <span className="text-gray-500">Họ và tên thí sinh:</span>
                  <span className="font-bold text-gray-800">{form.fullName}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #FFEDD5", paddingBottom: "8px" }}>
                  <span className="text-gray-500">Số điện thoại:</span>
                  <span className="font-bold text-gray-800">{form.phone}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #FFEDD5", paddingBottom: "8px" }}>
                  <span className="text-gray-500">Số CCCD:</span>
                  <span className="font-bold text-gray-800">{form.cccd}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #FFEDD5", paddingBottom: "8px" }}>
                  <span className="text-gray-500">Trường THPT tốt nghiệp:</span>
                  <span className="font-bold text-gray-800">{form.schoolName} ({form.graduationYear})</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #FFEDD5", paddingBottom: "8px" }}>
                  <span className="text-gray-500">Cơ sở đăng ký:</span>
                  <span className="font-bold text-gray-800">{campuses.find(c => c.id == form.campusId)?.name || "-"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #FFEDD5", paddingBottom: "8px" }}>
                  <span className="text-gray-500">Ngành học đăng ký:</span>
                  <span className="font-bold text-gray-800">{majors.find(m => m.id == form.majorId)?.name || "-"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #FFEDD5", paddingBottom: "8px" }}>
                  <span className="text-gray-500">Phương thức xét tuyển:</span>
                  <span className="font-bold text-gray-800">{methods.find(m => m.id == form.methodId)?.name || "-"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #FFEDD5", paddingBottom: "8px" }}>
                  <span className="text-gray-500">Tài liệu đã tải lên:</span>
                  <span className="font-bold text-green-600">
                    {Object.values(files).filter(Boolean).length} tệp tài liệu đính kèm
                  </span>
                </div>
              </div>
              <div style={{ marginTop: "24px", padding: "12px", background: "white", borderRadius: "10px", border: "1px solid #FFEDD5", fontSize: "12px", color: "#64748B" }}>
                ⚠️ <strong>Cam kết:</strong> Thí sinh chịu trách nhiệm hoàn toàn về tính chính xác và trung thực của các thông tin, tài liệu đã cung cấp trong hồ sơ này.
              </div>
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
            <button onClick={handleNext} className="student-btn-primary" style={{ padding: "10px 20px", borderRadius: "10px", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              Tiếp theo <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="student-btn-primary" style={{ padding: "10px 20px", borderRadius: "10px", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
              {loading ? "Đang nộp..." : <><CheckCircle size={18} /> Xác nhận & Nộp</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
