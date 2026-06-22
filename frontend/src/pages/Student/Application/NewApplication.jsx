import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../config/axiosConfig";
import { CheckCircle, ChevronRight, ChevronLeft, Upload, User, BookOpen, MapPin, FileText, GraduationCap, Building2, FolderUp } from "lucide-react";

const LOCATION_DATA = {
  1: { // Hà Nội
    districts: {
      "Quận Ba Đình": ["Phường Trúc Bạch", "Phường Vĩnh Phúc", "Phường Cống Vị", "Phường Kim Mã", "Phường Liễu Giai", "Phường Ngọc Hà", "Phường Quán Thánh", "Phường Giảng Võ"],
      "Quận Hoàn Kiếm": ["Phường Hàng Bạc", "Phường Hàng Đào", "Phường Tràng Tiền", "Phường Lý Thái Tổ", "Phường Hàng Bông", "Phường Cửa Đông", "Phường Đồng Xuân"],
      "Quận Tây Hồ": ["Phường Quảng An", "Phường Nhật Tân", "Phường Yên Phụ", "Phường Bưởi", "Phường Xuân La", "Phường Thuỵ Khuê", "Phường Phú Thượng"],
      "Quận Cầu Giấy": ["Phường Dịch Vọng", "Phường Quan Hoa", "Phường Nghĩa Tân", "Phường Mai Dịch", "Phường Trung Hoà", "Phường Yên Hoà", "Phường Nghĩa Đô"],
      "Huyện Thạch Thất": ["Xã Bình Yên", "Xã Tân Xã", "Xã Hạ Bằng", "Thị trấn Liên Quan", "Xã Thạch Hòa", "Xã Canh Nậu", "Xã Phùng Xá"],
      "Huyện Quốc Oai": ["Thị trấn Quốc Oai", "Xã Sài Sơn", "Xã Ngọc Mỹ", "Xã Thạch Thán", "Xã Đông Yên", "Xã Liệp Tuyết"]
    }
  },
  2: { // TP. Hồ Chí Minh
    districts: {
      "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Phạm Ngũ Lão", "Phường Đa Kao", "Phường Tân Định", "Phường Nguyễn Thái Bình"],
      "Quận 3": ["Phường Võ Thị Sáu", "Phường 1", "Phường 2", "Phường 3", "Phường 4", "Phường 5"],
      "Quận Bình Thạnh": ["Phường 1", "Phường 2", "Phường 3", "Phường 25", "Phường 26", "Phường 19", "Phường 21"],
      "TP. Thủ Đức": ["Phường Hiệp Phú", "Phường Tăng Nhơn Phú A", "Phường Linh Trung", "Phường Bình Thọ", "Phường Thảo Điền", "Phường Linh Tây"],
      "Quận 7": ["Phường Tân Phong", "Phường Tân Kiểng", "Phường Phú Mỹ", "Phường Bình Thuận", "Phường Tân Thuận Đông"]
    }
  },
  3: { // Đà Nẵng
    districts: {
      "Quận Hải Châu": ["Phường Thuận Phước", "Phường Thạch Thang", "Phường Hòa Thuận Đông", "Phường Nam Dương", "Phường Phước Ninh", "Phường Bình Thuận"],
      "Quận Thanh Khê": ["Phường Vĩnh Trung", "Phường Tân Chính", "Phường Chính Gián", "Phường Thạc Gián", "Phường Hòa Khê", "Phường An Khê"],
      "Quận Sơn Trà": ["Phường An Hải Bắc", "Phường An Hải Tây", "Phường Thọ Quang", "Phường Mân Thái", "Phường Phước Mỹ", "Phường Nại Hiên Đông"],
      "Quận Ngũ Hành Sơn": ["Phường Hòa Hải", "Phường Hòa Quý", "Phường Khuê Mỹ", "Phường Mỹ An"]
    }
  },
  4: { // Cần Thơ
    districts: {
      "Quận Ninh Kiều": ["Phường An Khánh", "Phường Xuân Khánh", "Phường An Hòa", "Phường Cái Khế", "Phường Tân An", "Phường Hưng Lợi"],
      "Quận Cái Răng": ["Phường Lê Bình", "Phường Hưng Phú", "Phường Ba Láng", "Phường Thường Thạnh", "Phường Phú Thứ", "Phường Tân Phú"],
      "Quận Bình Thủy": ["Phường Bình Thủy", "Phường Trà An", "Phường Trà Nóc", "Phường An Thới", "Phường Bùi Hữu Nghĩa"]
    }
  },
  5: { // Bình Định
    districts: {
      "Thành phố Quy Nhơn": ["Phường Nguyễn Văn Cừ", "Phường Ngô Mây", "Phường Quang Trung", "Phường Trần Hưng Đạo", "Phường Ghềnh Ráng", "Phường Đống Đa"],
      "Thị xã An Nhơn": ["Phường Bình Định", "Phường Nhơn Hưng", "Phường Đập Đá", "Xã Nhơn An", "Xã Nhơn Phong"],
      "Huyện Tuy Phước": ["Thị trấn Tuy Phước", "Xã Phước Lộc", "Xã Phước Sơn", "Xã Phước Hưng", "Xã Phước Nghĩa"]
    }
  }
};

const steps = [
  { id: 1, label: "Phương thức tuyển sinh", icon: GraduationCap },
  { id: 2, label: "Thông tin cá nhân & Đăng ký hồ sơ", icon: FileText },
  { id: 3, label: "Xác nhận hoàn thành", icon: CheckCircle },
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

  // New Application Permission states
  const [hasExistingApp, setHasExistingApp] = useState(false);
  const [existingApp, setExistingApp] = useState(null);
  const [allowNew, setAllowNew] = useState(false);
  const [requestStatus, setRequestStatus] = useState("NONE");
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [customDistrict, setCustomDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [customWard, setCustomWard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "—";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`; // DD-MM-YYYY
    }
    return dateStr;
  };

  const [schools, setSchools] = useState([]);

  const [form, setForm] = useState({
    // Personal Info
    fullName: "", dob: "", gender: "MALE", phone: "", cccd: "",
    permanentAddress: "", provinceId: "",
    parentName: "", parentPhone: "",
    // Academic
    schoolName: "", graduationYear: "2026",
    gpa10: "", gpa11: "", gpa12: "",
    // Campus / Major / Method
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
    api.get("/api/student/config/methods").then(r => setMethods(r.data.filter(m => m.code !== 'THPT'))).catch(() => {});
    api.get("/api/student/config/provinces").then(r => setProvinces(r.data)).catch(() => {});

    // Load existing application & requests
    api.get("/api/student/dashboard").then(r => {
      if (r.data) {
        setAllowNew(r.data.allowNewApplication);
        setRequestStatus(r.data.newApplicationRequest);
        
        const appsList = r.data.applications || [];
        const submittedApp = appsList.find(a => a.status !== "DRAFT");
        if (submittedApp) {
          setHasExistingApp(true);
          // Fetch complete details
          api.get(`/api/student/applications/${submittedApp.id}`).then(res => {
            setExistingApp(res.data);
          }).catch(() => {});
        }
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.campusId) {
      api.get(`/api/student/config/majors?campusId=${form.campusId}`)
        .then(r => setMajors(r.data)).catch(() => {});
    } else {
      setMajors([]);
    }
  }, [form.campusId]);

  // Fetch schools when province changes
  useEffect(() => {
    if (form.provinceId) {
      api.get(`/api/student/config/schools?provinceId=${form.provinceId}`)
        .then(r => setSchools(r.data)).catch(() => setSchools([]));
    } else {
      setSchools([]);
    }
  }, [form.provinceId]);

  // Compile permanent address automatically from components
  useEffect(() => {
    const parts = [];
    if (streetAddress) parts.push(streetAddress);
    
    const wardName = selectedWard === "OTHER" ? customWard : selectedWard;
    if (wardName) parts.push(wardName);
    
    const districtName = selectedDistrict === "OTHER" ? customDistrict : selectedDistrict;
    if (districtName) parts.push(districtName);
    
    const prov = provinces.find(p => p.id == form.provinceId);
    if (prov) parts.push(prov.name);
    
    setForm(prev => ({
      ...prev,
      permanentAddress: parts.join(", ")
    }));
  }, [selectedDistrict, customDistrict, selectedWard, customWard, streetAddress, form.provinceId, provinces]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const validateStep = () => {
    if (currentStep === 1) {
      if (!form.methodId) {
        alert("Vui lòng chọn phương thức tuyển sinh trước khi tiếp tục");
        return false;
      }
    } else if (currentStep === 2) {
      // Validate personal info
      const districtName = selectedDistrict === "OTHER" ? customDistrict : selectedDistrict;
      const wardName = selectedWard === "OTHER" ? customWard : selectedWard;
      if (!form.fullName || !form.dob || !form.cccd || !form.provinceId || !districtName || !wardName || !streetAddress || !form.phone) {
        alert("Vui lòng điền đầy đủ thông tin cá nhân và địa chỉ thường trú bắt buộc (*)");
        return false;
      }
      // Validate academic
      if (!form.schoolName || !form.gpa10 || !form.gpa11 || !form.gpa12) {
        alert("Vui lòng nhập đầy đủ thông tin học vấn và điểm GPA");
        return false;
      }
      // Validate campus/major
      if (!form.campusId || !form.majorId) {
        alert("Vui lòng chọn cơ sở và ngành học");
        return false;
      }
      // Validate required documents
      if (!files.cccdFile || !files.hocBaFile || !files.bangTNFile || !files.anhTheFile) {
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
      if (files.giayKhaiSinhFile) formData.append("giayKhaiSinhFile", files.giayKhaiSinhFile);
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

  const STATUS_LABELS = {
    DRAFT: "Bản nháp",
    SUBMITTED: "Đã nộp",
    UNDER_REVIEW: "Đang xét duyệt",
    APPROVED: "Được chấp thuận",
    REJECTED: "Bị từ chối",
    ENROLLED: "Đã nhập học"
  };

  const STATUS_STEP_INDEX = {
    DRAFT: 0,
    SUBMITTED: 1,
    UNDER_REVIEW: 2,
    APPROVED: 3,
    REJECTED: 3,
    ENROLLED: 4
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

  // ───────────────────── EXISTING APPLICATION VIEW ─────────────────────
  if (hasExistingApp && !allowNew) {
    const appStatus = existingApp?.status || "SUBMITTED";
    const stepIdx = STATUS_STEP_INDEX[appStatus] || 1;
    const stepsList = ["DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "ENROLLED"];
    
    return (
      <div className="max-w-3xl mx-auto animate-fade-in" style={{ padding: "8px 0" }}>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Nộp hồ sơ xét tuyển</h1>
          <p className="text-gray-500 text-sm mt-1">FPT University - Mùa tuyển sinh 2026</p>
        </div>

        <div className="student-card text-center p-8 mb-6" style={{ padding: "40px" }}>
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6" style={{ color: "#22C55E", width: "80px", height: "80px" }}>
            <CheckCircle size={44} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hồ sơ xét tuyển đã được nộp hoàn tất!</h2>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            Hệ thống ghi nhận bạn đã nộp hồ sơ đăng ký xét tuyển. Bạn có thể theo dõi tiến độ xét duyệt dưới đây hoặc yêu cầu cán bộ tạo hồ sơ mới nếu có nhu cầu thay đổi thông tin.
          </p>

          {/* Progress Tracker */}
          <div className="relative mb-8 max-w-xl mx-auto" style={{ border: "1px solid #E2E8F0", padding: "24px", borderRadius: "16px", backgroundColor: "#F8FAFC" }}>
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3" style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
              {stepsList.map((s, i) => {
                const isCurrent = s === appStatus;
                const isDone = i <= stepIdx;
                let label = STATUS_LABELS[s];
                if (s === "APPROVED" && appStatus === "REJECTED") {
                  label = "Bị từ chối";
                }
                return (
                  <span key={s} className={isCurrent ? "text-orange-600 font-bold" : isDone ? "text-green-600 font-semibold" : ""}>
                    {label}
                  </span>
                );
              })}
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${((stepIdx + 1) / 5) * 100}%`,
                  background: appStatus === "REJECTED" ? "#EF4444" : "linear-gradient(90deg, #FF6B35, #E85A2A)"
                }}
              ></div>
            </div>
            <div className="mt-4 text-xs text-left text-gray-500">
              * Trạng thái hiện tại: <strong className={appStatus === "APPROVED" || appStatus === "ENROLLED" ? "text-green-600" : appStatus === "REJECTED" ? "text-red-500" : "text-blue-600"}>{STATUS_LABELS[appStatus]}</strong>
              {existingApp?.officerNotes && <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700"><strong>Nhận xét:</strong> {existingApp.officerNotes}</div>}
              {existingApp?.rejectionReason && <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-500 text-red-700"><strong>Lý do từ chối:</strong> {existingApp.rejectionReason}</div>}
            </div>
          </div>

          {/* Quick info card */}
          {existingApp && (
            <div className="text-left text-sm space-y-3 max-w-xl mx-auto mb-8 p-6 bg-white rounded-xl border border-gray-100" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Mã hồ sơ:</span> <strong className="text-gray-800">{existingApp.applicationCode}</strong></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Ngành học:</span> <strong className="text-gray-800">{existingApp.majorName}</strong></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Cơ sở:</span> <strong className="text-gray-800">{existingApp.campusName}</strong></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Phương thức:</span> <strong className="text-gray-800">{existingApp.methodName}</strong></div>
              <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Điểm xét tuyển:</span> <strong className="text-orange-600 font-bold">{existingApp.totalScore}</strong></div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => setShowDetailModal(true)} className="student-btn-primary" style={{ padding: "10px 24px", borderRadius: "10px" }}>
              Xem chi tiết hồ sơ
            </button>
            
            {requestStatus === "PENDING" ? (
              <button disabled className="px-5 py-2.5 bg-gray-100 text-gray-500 font-semibold rounded-xl cursor-not-allowed border border-gray-200">
                ⌛ Đang chờ duyệt tạo hồ sơ mới
              </button>
            ) : requestStatus === "REJECTED" ? (
              <div className="flex flex-col items-center gap-1">
                <button onClick={handleRequestNew} className="px-5 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-100 transition-colors">
                  Yêu cầu lại tạo hồ sơ mới
                </button>
                <span className="text-xs text-red-500">* Yêu cầu trước bị từ chối</span>
              </div>
            ) : (
              <button onClick={handleRequestNew} className="px-5 py-2.5 bg-orange-50 text-orange-600 font-semibold rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors">
                Yêu cầu tạo hồ sơ mới
              </button>
            )}
          </div>
        </div>

        {/* Detailed Application Modal */}
        {showDetailModal && existingApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 relative" style={{ position: "relative", backgroundColor: "white", padding: "24px", borderRadius: "16px", maxWidth: "768px", width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
              <div className="flex items-center justify-between border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900">Chi tiết hồ sơ đăng ký</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>✕</button>
              </div>

              {/* Modal Body */}
              <div className="space-y-6" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Personal Information */}
                <div>
                  <h4 className="font-bold text-orange-600 text-sm mb-3 uppercase tracking-wider">👤 Thông tin cá nhân</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div><span className="text-gray-500">Họ và tên:</span> <strong className="text-gray-800">{existingApp.fullName}</strong></div>
                    <div><span className="text-gray-500">Ngày sinh:</span> <strong className="text-gray-800">{formatDateDisplay(existingApp.dob)}</strong></div>
                    <div><span className="text-gray-500">Giới tính:</span> <strong className="text-gray-800">{existingApp.gender === "MALE" ? "Nam" : "Nữ"}</strong></div>
                    <div><span className="text-gray-500">CCCD/CMND:</span> <strong className="text-gray-800">{existingApp.cccd}</strong></div>
                    <div><span className="text-gray-500">Số điện thoại:</span> <strong className="text-gray-800">{existingApp.phone}</strong></div>
                    <div><span className="text-gray-500">Địa chỉ:</span> <strong className="text-gray-800">{existingApp.permanentAddress}</strong></div>
                    <div><span className="text-gray-500">Họ tên phụ huynh:</span> <strong className="text-gray-800">{existingApp.parentName || "—"}</strong></div>
                    <div><span className="text-gray-500">SĐT phụ huynh:</span> <strong className="text-gray-800">{existingApp.parentPhone || "—"}</strong></div>
                  </div>
                </div>

                {/* Academic Profile */}
                {existingApp.academicBackground && (
                  <div>
                    <h4 className="font-bold text-orange-600 text-sm mb-3 uppercase tracking-wider">📚 Kết quả học tập</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div><span className="text-gray-500">Trường THPT:</span> <strong className="text-gray-800">{existingApp.academicBackground.schoolName}</strong></div>
                      <div><span className="text-gray-500">Năm tốt nghiệp:</span> <strong className="text-gray-800">{existingApp.academicBackground.graduationYear}</strong></div>
                      <div><span className="text-gray-500">Điểm Toán / Văn / Anh:</span> <strong className="text-gray-800">{existingApp.academicBackground.mathScore} / {existingApp.academicBackground.literatureScore} / {existingApp.academicBackground.englishScore}</strong></div>
                      <div><span className="text-gray-500">GPA Lớp 10 / 11 / 12:</span> <strong className="text-gray-800">{existingApp.academicBackground.gpa10} / {existingApp.academicBackground.gpa11} / {existingApp.academicBackground.gpa12}</strong></div>
                      <div className="col-span-2"><span className="text-gray-500">Tổng điểm xét tuyển:</span> <strong className="text-orange-600 font-bold">{existingApp.academicBackground.totalScore}</strong></div>
                    </div>
                  </div>
                )}

                {/* Documents list */}
                {existingApp.documents && existingApp.documents.length > 0 && (
                  <div>
                    <h4 className="font-bold text-orange-600 text-sm mb-3 uppercase tracking-wider">📄 Tài liệu minh chứng</h4>
                    <div className="space-y-2" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {existingApp.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", backgroundColor: "#F9FAFB", borderRadius: "8px" }}>
                          <div>
                            <span className="font-semibold text-gray-800">{doc.desc || doc.name}</span>
                            <div className="text-xs text-gray-400 mt-0.5">{doc.name}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${doc.status === "VERIFIED" || doc.status === "verified" ? "bg-green-100 text-green-700" : doc.status === "REJECTED" || doc.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {doc.status === "VERIFIED" || doc.status === "verified" ? "Đã duyệt" : doc.status === "REJECTED" || doc.status === "rejected" ? "Từ chối" : "Chờ duyệt"}
                            </span>
                            {doc.filePath && (
                              <a href={`http://localhost:8081${doc.filePath}`} target="_blank" rel="noreferrer" className="text-orange-600 font-semibold hover:underline">
                                Xem file
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button onClick={() => setShowDetailModal(false)} className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors" style={{ padding: "8px 20px", borderRadius: "10px", border: "none", cursor: "pointer" }}>
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ───────────────────── SUBMITTED SUCCESS VIEW ─────────────────────
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

  // ───────────────────── MAIN FORM VIEW ─────────────────────
  const selectedMethod = methods.find(m => m.id == form.methodId);

  // Step 2 section tabs configuration
  const sectionTabs = [
    { key: "personal", label: "Thông tin cá nhân", icon: User },
    { key: "academic", label: "Học vấn & Điểm số", icon: BookOpen },
    { key: "campus", label: "Cơ sở & Ngành học", icon: Building2 },
    { key: "documents", label: "Tài liệu đính kèm", icon: FolderUp },
  ];

  return (
    <div className="max-w-3xl mx-auto animate-fade-in" style={{ padding: "8px 0" }}>
      <div className="mb-6" style={{ marginBottom: "24px" }}>
        <h1 className="text-2xl font-bold text-gray-900">Nộp hồ sơ xét tuyển</h1>
        <p className="text-gray-500 text-sm mt-1">FPT University - Mùa tuyển sinh 2026</p>
      </div>

      {/* ─── Step Indicator (3 steps) ─── */}
      <div className="student-card mb-6" style={{ marginBottom: "24px", padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", gap: "0" }}>
          {steps.map((step, idx) => {
            const isDone = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            const isLast = idx === steps.length - 1;
            return (
              <div key={step.id} style={{ display: "flex", alignItems: "center", flex: isLast ? "0 0 auto" : 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative", zIndex: 2, minWidth: "100px" }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "15px",
                    background: isDone ? "#22C55E" : isCurrent ? "linear-gradient(135deg, #FF6B35, #E85A2A)" : "white",
                    color: isDone || isCurrent ? "white" : "#94A3B8",
                    border: isDone || isCurrent ? "none" : "2px solid #E2E8F0",
                    boxShadow: isCurrent ? "0 4px 14px rgba(255,107,53,0.3)" : "none",
                    transition: "all 0.3s ease"
                  }}>
                    {isDone ? "✓" : <step.icon size={20} />}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "10px", color: "#94A3B8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      BƯỚC {step.id}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "600", color: isCurrent ? "#E85A2A" : isDone ? "#22C55E" : "#64748B", marginTop: "2px", maxWidth: "130px" }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: "10px", color: isCurrent ? "#FF6B35" : isDone ? "#86EFAC" : "#CBD5E1", marginTop: "2px", fontWeight: "500" }}>
                      {isCurrent ? "Đang thực hiện" : isDone ? "Hoàn thành" : "Chờ xử lý"}
                    </div>
                  </div>
                </div>
                {!isLast && (
                  <div style={{ flex: 1, height: "3px", background: isDone ? "#22C55E" : "#E2E8F0", borderRadius: "2px", marginBottom: "40px", marginLeft: "-8px", marginRight: "-8px", transition: "background 0.3s ease" }}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Form Content ─── */}
      <div className="student-card" style={{ padding: "0" }}>

        {/* ─────────── STEP 1: ADMISSION METHOD ─────────── */}
        {currentStep === 1 && (
          <>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#FF6B35", textTransform: "uppercase", letterSpacing: "0.8px" }}>NỘP HỒ SƠ</span>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1E293B", margin: "0" }}>Bước 1 — Chọn phương thức tuyển sinh</h2>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "6px" }}>Chọn phương thức phù hợp để tiếp tục điền hồ sơ.</p>
            </div>
            <div style={{ padding: "28px" }}>
              <label style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", display: "block", marginBottom: "16px" }}>
                Chọn phương thức tuyển sinh <span style={{ color: "#EF4444" }}>(*)</span>
              </label>
              <div style={{ display: "grid", gridTemplateColumns: methods.length <= 2 ? "1fr 1fr" : "1fr", gap: "16px" }}>
                {methods.map((method) => {
                  const isSelected = form.methodId == method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setForm({ ...form, methodId: method.id })}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                        padding: "20px 24px",
                        borderRadius: "16px",
                        border: isSelected ? "2px solid #FF6B35" : "2px solid #E2E8F0",
                        backgroundColor: isSelected ? "#FFF7F4" : "white",
                        cursor: "pointer",
                        transition: "all 0.25s ease",
                        boxShadow: isSelected ? "0 4px 16px rgba(255,107,53,0.12)" : "0 1px 3px rgba(0,0,0,0.04)"
                      }}
                    >
                      {/* Radio circle */}
                      <div style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        border: isSelected ? "2px solid #FF6B35" : "2px solid #CBD5E1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "2px",
                        transition: "all 0.2s ease"
                      }}>
                        {isSelected && <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#FF6B35" }}></div>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "700", fontSize: "15px", color: isSelected ? "#E85A2A" : "#1E293B", marginBottom: "4px" }}>
                          {method.name}
                        </div>
                        <div style={{ fontSize: "13px", color: "#64748B", lineHeight: "1.5" }}>
                          {method.description || "Chọn phương thức xét tuyển phù hợp và upload giấy tờ minh chứng"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Method selection hint */}
              {selectedMethod && (
                <div style={{
                  marginTop: "20px",
                  padding: "16px 20px",
                  background: "linear-gradient(135deg, #FFF7F4, #FEF3E2)",
                  borderRadius: "14px",
                  border: "1px solid #FFEDD5",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}>
                  <div style={{ fontSize: "22px" }}>✅</div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: "#E85A2A" }}>Phương thức đã chọn</div>
                    <div style={{ fontSize: "14px", fontWeight: "600", color: "#1E293B", marginTop: "2px" }}>{selectedMethod.name}</div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ─────────── STEP 2: FULL FORM ─────────── */}
        {currentStep === 2 && (
          <>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#FF6B35", textTransform: "uppercase", letterSpacing: "0.8px" }}>NỘP HỒ SƠ</span>
                <span style={{ fontSize: "11px", background: "#FFF7F4", color: "#E85A2A", padding: "2px 10px", borderRadius: "20px", fontWeight: "600" }}>
                  {selectedMethod?.name}
                </span>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1E293B", margin: "0" }}>Bước 2 — Thông tin cá nhân & Đăng ký hồ sơ</h2>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "6px" }}>Điền đầy đủ thông tin và tải lên các tài liệu cần thiết.</p>
            </div>

            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "32px" }}>
              {/* ── Section 1: Thông tin cá nhân ── */}
              <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#FF6B35", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px", marginBottom: "20px" }}>
                  <User size={18} /> 1. Thông tin cá nhân & Địa chỉ thường trú
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
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
                    <label className="form-label">Tỉnh/Thành phố *</label>
                    <select className="form-select" value={form.provinceId} onChange={(e) => {
                      setForm({ ...form, provinceId: e.target.value, schoolName: "" });
                      setSelectedDistrict("");
                      setCustomDistrict("");
                      setSelectedWard("");
                      setCustomWard("");
                    }} required>
                      <option value="">-- Chọn Tỉnh/Thành --</option>
                      {provinces.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Quận/Huyện *</label>
                    {LOCATION_DATA[form.provinceId] ? (
                      selectedDistrict === "OTHER" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <input className="form-input" value={customDistrict} onChange={(e) => setCustomDistrict(e.target.value)} placeholder="Nhập Quận/Huyện..." required />
                          <button type="button" onClick={() => { setSelectedDistrict(""); setCustomDistrict(""); }} style={{ fontSize: "11px", color: "#FF6B35", background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start", padding: "0" }}>
                            ← Quay lại chọn danh sách
                          </button>
                        </div>
                      ) : (
                        <select className="form-select" value={selectedDistrict} onChange={(e) => {
                          setSelectedDistrict(e.target.value);
                          setCustomDistrict("");
                          setSelectedWard("");
                          setCustomWard("");
                        }} required>
                          <option value="">-- Chọn Quận/Huyện --</option>
                          {Object.keys(LOCATION_DATA[form.provinceId].districts).map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                          <option value="OTHER">-- Khác (Tự nhập) --</option>
                        </select>
                      )
                    ) : (
                      <input className="form-input" value={customDistrict} onChange={(e) => setCustomDistrict(e.target.value)} placeholder="Nhập Quận/Huyện..." required disabled={!form.provinceId} />
                    )}
                  </div>
                  <div>
                    <label className="form-label">Xã/Phường *</label>
                    {LOCATION_DATA[form.provinceId] && selectedDistrict && selectedDistrict !== "OTHER" ? (
                      selectedWard === "OTHER" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <input className="form-input" value={customWard} onChange={(e) => setCustomWard(e.target.value)} placeholder="Nhập Xã/Phường..." required />
                          <button type="button" onClick={() => { setSelectedWard(""); setCustomWard(""); }} style={{ fontSize: "11px", color: "#FF6B35", background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start", padding: "0" }}>
                            ← Quay lại chọn danh sách
                          </button>
                        </div>
                      ) : (
                        <select className="form-select" value={selectedWard} onChange={(e) => {
                          setSelectedWard(e.target.value);
                          setCustomWard("");
                        }} required>
                          <option value="">-- Chọn Xã/Phường --</option>
                          {LOCATION_DATA[form.provinceId].districts[selectedDistrict]?.map(w => (
                            <option key={w} value={w}>{w}</option>
                          ))}
                          <option value="OTHER">-- Khác (Tự nhập) --</option>
                        </select>
                      )
                    ) : (
                      <input className="form-input" value={customWard} onChange={(e) => setCustomWard(e.target.value)} placeholder="Nhập Xã/Phường..." required disabled={!form.provinceId || (!selectedDistrict && !customDistrict)} />
                    )}
                  </div>
                  <div>
                    <label className="form-label">Số nhà, tên đường, thôn/xóm *</label>
                    <input className="form-input" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} placeholder="VD: Số 123 Đường Nguyễn Trãi" required disabled={!form.provinceId || (!selectedWard && !customWard)} />
                  </div>
                  <div style={{ gridColumn: "span 2", backgroundColor: "#F8FAFC", border: "1px dashed #CBD5E1", padding: "12px 16px", borderRadius: "8px", fontSize: "13px" }}>
                    <span style={{ color: "#64748B", fontWeight: "600" }}>📍 Địa chỉ thường trú đầy đủ sẽ được lưu:</span>
                    <div style={{ color: form.permanentAddress ? "#1E293B" : "#94A3B8", fontWeight: "700", marginTop: "4px" }}>
                      {form.permanentAddress || "— Vui lòng điền thông tin địa chỉ để tự động ghép địa chỉ —"}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 2: Học vấn & Điểm số ── */}
              <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#FF6B35", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px", marginBottom: "20px" }}>
                  <BookOpen size={18} /> 2. Học vấn & Điểm số GPA
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  {!form.provinceId && (
                    <div style={{ gridColumn: "span 2" }}>
                      <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: "12px", padding: "14px 18px", fontSize: "13px", color: "#92400E", display: "flex", alignItems: "center", gap: "10px" }}>
                        ⚠️ Vui lòng chọn <strong>Tỉnh/Thành phố</strong> ở phần "Thông tin cá nhân" trước để hiển thị danh sách trường THPT.
                      </div>
                    </div>
                  )}
                  <div style={{ gridColumn: "span 2" }}>
                    <label className="form-label">Trường THPT *</label>
                    {form.provinceId ? (
                      <>
                        <select
                          className="form-select"
                          value={form.schoolName}
                          onChange={update("schoolName")}
                          required
                          style={{ marginTop: "6px" }}
                        >
                          <option value="">-- Chọn trường THPT --</option>
                          {schools.filter(s => s.schoolType === "PUBLIC").length > 0 && (
                            <optgroup label="🏫 Trường công lập">
                              {schools.filter(s => s.schoolType === "PUBLIC").map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                              ))}
                            </optgroup>
                          )}
                          {schools.filter(s => s.schoolType === "PRIVATE").length > 0 && (
                            <optgroup label="🏠 Trường tư thục">
                              {schools.filter(s => s.schoolType === "PRIVATE").map(s => (
                                <option key={s.id} value={s.name}>{s.name}</option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                        {form.schoolName && (
                          <div style={{ marginTop: "8px", fontSize: "12px", color: "#16A34A", fontWeight: "600" }}>
                            ✓ Đã chọn: {form.schoolName}
                          </div>
                        )}
                      </>
                    ) : (
                      <select className="form-select" disabled style={{ marginTop: "6px", opacity: 0.5, cursor: "not-allowed" }}>
                        <option>-- Chọn tỉnh/thành trước --</option>
                      </select>
                    )}
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
                    <p style={{ marginBottom: "12px", color: "#475569", fontSize: "14px", fontWeight: "700" }}>📚 GPA học bạ lớp 10, 11, 12</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                      {[["Lớp 10 *", "gpa10"], ["Lớp 11 *", "gpa11"], ["Lớp 12 *", "gpa12"]].map(([label, field]) => (
                        <div key={field}>
                          <label className="form-label">{label}</label>
                          <input type="number" step="0.01" min="0" max="10" className="form-input" value={form[field]} onChange={update(field)} placeholder="0.00" required />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Section 3: Cơ sở & Ngành học ── */}
              <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#FF6B35", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px", marginBottom: "20px" }}>
                  <Building2 size={18} /> 3. Đăng ký Cơ sở & Ngành học
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <label className="form-label">Cơ sở đào tạo *</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
                      {campuses.map((campus) => (
                        <div key={campus.id}
                          onClick={() => setForm({ ...form, campusId: campus.id, majorId: "" })}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "16px",
                            borderRadius: "14px",
                            border: form.campusId == campus.id ? "2px solid #FF6B35" : "2px solid #E2E8F0",
                            backgroundColor: form.campusId == campus.id ? "#FFF7F4" : "white",
                            cursor: "pointer",
                            transition: "all 0.2s ease"
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
                    <div>
                      <label className="form-label">Ngành học *</label>
                      <select className="form-select" style={{ marginTop: "8px" }} value={form.majorId} onChange={update("majorId")} required>
                        <option value="">-- Chọn ngành học --</option>
                        {majors.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Section 4: Tài liệu đính kèm ── */}
              <div style={{ border: "1px solid #E2E8F0", borderRadius: "16px", padding: "24px", backgroundColor: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#FF6B35", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #F1F5F9", paddingBottom: "12px", marginBottom: "20px" }}>
                  <FolderUp size={18} /> 4. Tài liệu đính kèm minh chứng
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "14px", padding: "16px", fontSize: "13px", color: "#1E40AF" }}>
                    💡 <strong>Yêu cầu tải tài liệu:</strong> Vui lòng đính kèm các tài liệu liên quan để cán bộ kiểm tra và đối chiếu. Tài liệu bắt buộc có dấu sao (*).
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {[
                      { name: "Căn cước công dân (CCCD) *", key: "cccdFile", desc: "Bản chụp rõ 2 mặt của CCCD" },
                      { name: "Học bạ THPT *", key: "hocBaFile", desc: "Bản sao học bạ 3 năm cấp 3" },
                      { name: "Bằng/Giấy chứng nhận tốt nghiệp *", key: "bangTNFile", desc: "Bản sao bằng tốt nghiệp hoặc giấy CNTN tạm thời" },
                      { name: "Ảnh thẻ 3x4 *", key: "anhTheFile", desc: "Ảnh chân dung nền trắng (định dạng JPG/PNG)" },
                      { name: "Chứng chỉ ngoại ngữ (Tùy chọn)", key: "chungChiFile", desc: "Chứng chỉ IELTS, SAT, TOEFL,... nếu có" }
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
                          cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
                          flexShrink: 0
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
              </div>
            </div>
          </>
        )}

        {/* ─────────── STEP 3: CONFIRMATION & SUBMIT ─────────── */}
        {currentStep === 3 && (
          <>
            <div style={{ padding: "24px 28px", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#FF6B35", textTransform: "uppercase", letterSpacing: "0.8px" }}>NỘP HỒ SƠ</span>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1E293B", margin: "0" }}>Bước 3 — Xác nhận hoàn thành</h2>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "6px" }}>Vui lòng kiểm tra lại toàn bộ thông tin trước khi nộp hồ sơ.</p>
            </div>
            <div style={{ padding: "28px" }}>
              <div style={{
                background: "#FFF7F4",
                borderRadius: "14px",
                padding: "24px",
                border: "1px solid #FFEDD5"
              }}>
                <h4 style={{ color: "#E85A2A", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", marginBottom: "20px" }}>
                  📋 TÓM TẮT HỒ SƠ ĐĂNG KÝ
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {[
                    ["Phương thức xét tuyển", selectedMethod?.name || "—", true],
                    ["Họ và tên thí sinh", form.fullName],
                    ["Ngày sinh", formatDateDisplay(form.dob)],
                    ["Giới tính", form.gender === "MALE" ? "Nam" : form.gender === "FEMALE" ? "Nữ" : "Khác"],
                    ["Số điện thoại", form.phone],
                    ["Số CCCD", form.cccd],
                    ["Trường THPT tốt nghiệp", `${form.schoolName} (${form.graduationYear})`],
                    ["GPA Lớp 10 / 11 / 12", `${form.gpa10} / ${form.gpa11} / ${form.gpa12}`],
                    ["Cơ sở đăng ký", campuses.find(c => c.id == form.campusId)?.name || "—"],
                    ["Ngành học đăng ký", majors.find(m => m.id == form.majorId)?.name || "—"],
                    ["Tài liệu đã tải lên", `${Object.values(files).filter(Boolean).length} tệp tài liệu đính kèm`, false, true],
                  ].map(([label, value, isHighlight, isGreen], idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #FFEDD5", paddingBottom: "8px" }}>
                      <span style={{ color: "#64748B", fontSize: "14px" }}>{label}:</span>
                      <span style={{ fontWeight: "700", fontSize: "14px", color: isHighlight ? "#E85A2A" : isGreen ? "#16A34A" : "#1E293B" }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "24px", padding: "12px", background: "white", borderRadius: "10px", border: "1px solid #FFEDD5", fontSize: "12px", color: "#64748B" }}>
                  ⚠️ <strong>Cam kết:</strong> Thí sinh chịu trách nhiệm hoàn toàn về tính chính xác và trung thực của các thông tin, tài liệu đã cung cấp trong hồ sơ này.
                </div>
              </div>
            </div>
          </>
        )}

        {/* ─── Navigation ─── */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button
            onClick={() => {
              setCurrentStep(Math.max(1, currentStep - 1));
            }}
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
              opacity: currentStep === 1 ? 0.4 : 1,
              fontWeight: "600"
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
                <>
                  <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></span>
                  Đang xử lý...
                </>
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
