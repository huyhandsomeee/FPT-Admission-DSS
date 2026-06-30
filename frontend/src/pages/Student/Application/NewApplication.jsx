import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import api from "../../../config/axiosConfig";
import { formatDateDisplay } from "../../../utils/dateUtils";
import useConfigData from "../../../hooks/useConfigData";
import useFileUpload from "../../../hooks/useFileUpload";
import { useAuth } from "../../../context/AuthContext";
import StepIndicator from "./components/StepIndicator";
import Step1MethodSelect from "./components/Step1MethodSelect";
import SectionPersonalInfo from "./components/SectionPersonalInfo";
import SectionAcademic from "./components/SectionAcademic";
import SectionCampusMajor from "./components/SectionCampusMajor";
import Step3Confirmation from "./components/Step3Confirmation";
import ExistingApplicationView from "./components/ExistingApplicationView";
import SubmitSuccessView from "./components/SubmitSuccessView";

const steps = [
  { id: 1, label: "Phương thức tuyển sinh" },
  { id: 2, label: "Thông tin cá nhân & Đăng ký hồ sơ" },
  { id: 3, label: "Xác nhận hoàn thành" },
];

export default function NewApplication() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Config data
  const { campuses, majors, methods, provinces, dbProvinces, schools, schoolsLoading, fetchMajors, fetchSchools } = useConfigData();

  // Existing application states
  const [hasExistingApp, setHasExistingApp] = useState(false);
  const [existingApp, setExistingApp] = useState(null);
  const [allowNew, setAllowNew] = useState(false);
  const [requestStatus, setRequestStatus] = useState("NONE");

  // Form state
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    dob: "",
    gender: "MALE",
    phone: user?.phone || "",
    cccd: "",
    permanentAddress: "",
    provinceId: "",
    openApiProvinceCode: "",
    parentName: "",
    parentPhone: "",
    schoolName: "",
    graduationYear: "2026",
    gpa10: "0",
    gpa11: "0",
    gpa12: "",
    campusId: "",
    majorId: "",
    methodId: "",
    email: user?.email || "",
    cccdIssueDate: "",
    cccdIssuePlace: "",
    academicAchievement: "",
  });

  // File upload
  const { files, setFiles } = useFileUpload();

  // Load existing application
  useEffect(() => {
    api.get("/api/student/dashboard").then(r => {
      if (r.data) {
        setAllowNew(r.data.allowNewApplication);
        setRequestStatus(r.data.newApplicationRequest);
        const appsList = r.data.applications || [];
        const submittedApp = appsList.find(a => a.status !== "DRAFT");
        if (submittedApp) {
          setHasExistingApp(true);
          api.get(`/api/student/applications/${submittedApp.id}`).then(res => {
            setExistingApp(res.data);
          }).catch(() => {});
        }
      }
    }).catch(() => {});
  }, []);

  // Fetch majors by campus
  useEffect(() => {
    fetchMajors(form.campusId);
  }, [form.campusId, fetchMajors]);

  // Fetch schools by province
  useEffect(() => {
    fetchSchools(form.provinceId);
  }, [form.provinceId, fetchSchools]);

  const update = useCallback((field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const validateStep = () => {
    if (currentStep === 1) {
      if (!form.methodId) {
        alert("Vui lòng chọn phương thức tuyển sinh trước khi tiếp tục");
        return false;
      }
    } else if (currentStep === 2) {
      const selectedMethod = methods.find(m => m.id == form.methodId);

      // Basic info validation
      if (!form.fullName || !form.dob || !form.cccd || !form.phone || !form.email || !form.cccdIssueDate || !form.cccdIssuePlace) {
        alert("Vui lòng điền đầy đủ thông tin cá nhân và số CCCD bắt buộc");
        return false;
      }
      // THPT validation
      if (!form.schoolName || !form.provinceId || !form.graduationYear) {
        alert("Vui lòng nhập đầy đủ thông tin học vấn trường THPT");
        return false;
      }
      // Registration validation
      if (!form.campusId || !form.majorId) {
        alert("Vui lòng chọn cơ sở và ngành học");
        return false;
      }
      // CCCD files validation
      if (!files.cccdFrontFile || !files.cccdBackFile) {
        alert("Vui lòng tải lên đầy đủ ảnh CCCD mặt trước và mặt sau");
        return false;
      }

      // Method specific validation
      if (selectedMethod?.code === 'HOC_BA') {
        if (!form.gpa12) {
          alert("Vui lòng nhập điểm trung bình năm lớp 12");
          return false;
        }
        if (!files.hocBaFile) {
          alert("Vui lòng tải lên minh chứng điểm trung bình lớp 12");
          return false;
        }
      } else if (selectedMethod?.code === 'SAT_IELTS') {
        if (!form.academicAchievement) {
          alert("Vui lòng chọn diện xét tuyển thẳng");
          return false;
        }
        if (!files.chungChiFile) {
          alert("Vui lòng tải lên minh chứng xét tuyển thẳng");
          return false;
        }
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
      
      const provinceName = provinces.find(p => p.id == form.provinceId)?.name || "";
      const finalAddress = form.permanentAddress || `Tỉnh/Thành phố THPT: ${provinceName}`;

      const finalForm = {
        ...form,
        permanentAddress: finalAddress,
        gpa10: form.gpa10 || "0",
        gpa11: form.gpa11 || "0",
        gpa12: form.gpa12 || "0",
      };

      Object.entries(finalForm).forEach(([key, value]) => {
        if (value !== "" && value !== null) formData.append(key, value);
      });
      // Append files
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      await api.post("/api/student/applications", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Lỗi khi nộp hồ sơ. Vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNew = async () => {
    try {
      await api.post("/api/student/applications/request-new");
      setRequestStatus("PENDING");
      alert("Gửi yêu cầu tạo hồ sơ mới thành công! Vui lòng chờ cán bộ duyệt.");
    } catch (err) {
      alert("Lỗi gửi yêu cầu: " + (err.response?.data?.message || err.message));
    }
  };

  // ── Existing application view ──
  if (hasExistingApp && !allowNew) {
    return (
      <ExistingApplicationView
        existingApp={existingApp}
        allowNew={allowNew}
        requestStatus={requestStatus}
        showDetailModal={showDetailModal}
        setShowDetailModal={setShowDetailModal}
        handleRequestNew={handleRequestNew}
      />
    );
  }

  // ── Submitted success view ──
  if (submitted) {
    return <SubmitSuccessView />;
  }

  // ── Main form view ──
  return (
    <div className="max-w-3xl mx-auto animate-fade-in" style={{ padding: "8px 0" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nộp hồ sơ xét tuyển</h1>
        <p className="text-gray-500 text-sm mt-1">FPT University - Mùa tuyển sinh 2026</p>
      </div>

      <StepIndicator currentStep={currentStep} />

      <div className="student-card" style={{ padding: "0" }}>
        {/* Step 1 */}
        {currentStep === 1 && (
          <Step1MethodSelect methods={methods} form={form} setForm={setForm} />
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#FF6B35", textTransform: "uppercase", letterSpacing: "0.8px" }}>NỘP HỒ SƠ</span>
                <span style={{ fontSize: "11px", background: "#FFF7F4", color: "#E85A2A", padding: "2px 10px", borderRadius: "20px", fontWeight: "600" }}>
                  {methods.find(m => m.id == form.methodId)?.name}
                </span>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1E293B", margin: "0" }}>Bước 2 — Thông tin cá nhân & Đăng ký hồ sơ</h2>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "6px" }}>Điền đầy đủ thông tin và tải lên các tài liệu cần thiết.</p>
            </div>
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "32px" }}>
              <SectionPersonalInfo
                form={form}
                update={update}
                setForm={setForm}
                files={files}
                setFiles={setFiles}
              />
              <SectionAcademic
                form={form}
                update={update}
                setForm={setForm}
                provinces={provinces}
                dbProvinces={dbProvinces}
                schools={schools}
                schoolsLoading={schoolsLoading}
                files={files}
                setFiles={setFiles}
                fetchSchools={fetchSchools}
                showHocBaSection={methods.find(m => m.id == form.methodId)?.code === 'HOC_BA'}
              />
              <SectionCampusMajor
                form={form}
                setForm={setForm}
                update={update}
                campuses={campuses}
                majors={majors}
                files={files}
                setFiles={setFiles}
                showDirectSection={methods.find(m => m.id == form.methodId)?.code === 'SAT_IELTS'}
              />
            </div>
          </>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <Step3Confirmation form={form} campuses={campuses} majors={majors} methods={methods} files={files} />
        )}

        {/* Navigation */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            style={{
              padding: "10px 20px", borderRadius: "10px", fontSize: "14px",
              cursor: currentStep === 1 ? "not-allowed" : "pointer",
              background: "white", border: "1px solid #E2E8F0", color: "#475569",
              display: "flex", alignItems: "center", gap: "8px",
              opacity: currentStep === 1 ? 0.4 : 1, fontWeight: "600"
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
              {loading ? (
                <><span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></span>Đang xử lý...</>
              ) : (
                <><CheckCircle size={18} /> Xác nhận & Nộp</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
