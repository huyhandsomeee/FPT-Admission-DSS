// candidateAdmissionEngine.js - Comprehensive Engine for FPT Candidate Admission
import { ADMISSION_METHODS, MAJORS, CAMPUSES, PRIORITY_AREAS, PRIORITY_OBJECTS, SUBJECT_COMBINATIONS } from "../data/admissionRulesData";

const STORAGE_KEY = "fpt_candidate_admission_app_v2";
const AUDIT_KEY = "fpt_candidate_admission_audit_v2";
const NOTIFICATIONS_KEY = "fpt_candidate_admission_notifications_v2";

export const INITIAL_APPLICATION_STATE = {
  applicationId: "FPT-2026-894120",
  status: "DRAFT", // DRAFT, INCOMPLETE, READY_TO_SUBMIT, SUBMITTED, UNDER_REVIEW, NEEDS_UPDATE, VERIFIED, ELIGIBLE, INELIGIBLE, ADMITTED, REJECTED, CANCELLED
  submittedAt: null,
  lastSavedAt: new Date().toISOString(),

  // Step 1: Personal Info
  personalInfo: {
    fullName: "Nguyễn Văn An",
    lastName: "Nguyễn",
    middleName: "Văn",
    firstName: "An",
    dob: "2006-08-15",
    gender: "Nam",
    nationality: "Việt Nam",
    ethnic: "Kinh",
    citizenId: "001206019842",
    citizenIssueDate: "2022-09-10",
    citizenIssuePlace: "Cục Cảnh sát QLHC về TTXH",
    citizenExpiryDate: "2031-08-15",
    email: "nguyenvanan.fpt@gmail.com",
    phone: "0912345678",
    backupPhone: "0987654321",

    // Address
    permanentProvince: "Hà Nội",
    permanentDistrict: "Cầu Giấy",
    permanentWard: "Dịch Vọng Hậu",
    permanentAddress: "Số 8 Tôn Thất Thuyết",
    sameCurrentAddress: true,
    currentProvince: "Hà Nội",
    currentDistrict: "Cầu Giấy",
    currentWard: "Dịch Vọng Hậu",
    currentAddress: "Số 8 Tôn Thất Thuyết",

    // Guardians
    fatherName: "Nguyễn Văn Hùng",
    fatherDob: "1978-04-12",
    fatherPhone: "0912112233",
    fatherEmail: "hung.nv@gmail.com",
    fatherJob: "Kỹ sư",

    motherName: "Trần Thị Mai",
    motherDob: "1980-09-20",
    motherPhone: "0912445566",
    motherEmail: "mai.tt@gmail.com",
    motherJob: "Giáo viên",

    emergencyContactName: "Nguyễn Văn Hùng",
    emergencyContactRelation: "Bố",
    emergencyContactPhone: "0912112233"
  },

  // Step 2: Selected Admission Methods (array of IDs)
  selectedMethods: ["ACADEMIC_TRANSCRIPT", "THPT_EXAM"],

  // Step 3: Academic Information
  academicInfo: {
    highSchoolProvince: "Hà Nội",
    highSchoolDistrict: "Cầu Giấy",
    highSchoolName: "THPT Chuyên Hà Nội - Amsterdam",
    highSchoolCode: "001",
    schoolType: "Chuyên",
    admissionYear: "2023",
    graduationYear: "2026",
    graduationStatus: "GRADUATED", // GRADUATED, PENDING

    // GPA by Grade
    grade10Gpa: 8.7,
    grade11Gpa: 8.9,
    grade12Gpa: 9.0,
    overallGpa: 8.87,
    conduct10: "Tốt",
    conduct11: "Tốt",
    conduct12: "Tốt",

    // Subject Scores (Grade 12)
    subjectScores: {
      math: 8.8,
      literature: 8.0,
      english: 9.2,
      physics: 8.5,
      chemistry: 8.2,
      biology: 7.8,
      history: 8.0,
      geography: 7.9,
      gdcd: 9.0,
      informatics: 9.5
    },

    // THPT Exam Scores (if method THPT_EXAM chosen)
    thptExam: {
      sbd: "01004589",
      examYear: "2026",
      examCouncil: "Hội đồng thi Sở GD&ĐT Hà Nội",
      scores: {
        math: 8.8,
        literature: 8.0,
        english: 9.2,
        physics: 8.5,
        chemistry: 8.2,
        biology: 7.5,
        history: 8.0,
        geography: 7.5,
        gdcd: 9.0
      }
    },

    // DGNL Exam Scores (if method DGNL_EXAM chosen)
    dgnlExam: {
      provider: "ĐHQG Hà Nội (HSA)",
      examYear: "2026",
      rollNo: "HSA-2026-9921",
      examDate: "2026-04-15",
      score: 105,
      maxScore: 150
    }
  },

  // Step 4: Certificates, Achievements & Priorities
  certificates: [
    {
      id: "cert-1",
      type: "IELTS",
      certNumber: "23VN019284FPT",
      score: "7.0",
      issueDate: "2025-05-10",
      expiryDate: "2027-05-10",
      provider: "British Council",
      fileName: "IELTS_Certificate_NguyenVanAn.pdf",
      fileUrl: "https://example.com/ielts.pdf",
      status: "VERIFIED"
    }
  ],

  achievements: [
    {
      id: "ach-1",
      competitionName: "Kỳ thi Học sinh giỏi cấp Tỉnh/Thành phố",
      type: "Học thuật",
      level: "Tỉnh/Thành phố",
      award: "Giải Nhì môn Tin học",
      year: "2025",
      provider: "Sở GD&ĐT Hà Nội",
      fileName: "ChungNhan_HSG_TinHoc.pdf",
      status: "VERIFIED"
    }
  ],

  priorities: {
    areaCode: "KV3", // KV1, KV2_NT, KV2, KV3
    objectCode: "NONE", // NONE, DT01...DT07
    bonusPoints: 0.0,
    proofFile: null
  },

  // Step 5: Document Management
  documents: [
    {
      id: "doc-cccd",
      type: "CITIZEN_ID",
      title: "CCCD / CMND / Hộ chiếu (2 mặt)",
      fileName: "CCCD_NguyenVanAn_Front_Back.pdf",
      fileSize: "2.4 MB",
      mimeType: "application/pdf",
      uploadedAt: "2026-08-10 14:30",
      status: "VERIFIED", // REQUIRED, UPLOADED, UNDER_REVIEW, VERIFIED, REJECTED, NEEDS_UPDATE
      reviewerNotes: "Đã xác minh thông tin trùng khớp với CSDL Quốc gia.",
      reviewedAt: "2026-08-11 09:15"
    },
    {
      id: "doc-transcript",
      type: "ACADEMIC_TRANSCRIPT",
      title: "Học bạ THPT (Bản scan công chứng đủ 3 năm)",
      fileName: "HocBa_THPT_NguyenVanAn.pdf",
      fileSize: "4.1 MB",
      mimeType: "application/pdf",
      uploadedAt: "2026-08-12 10:20",
      status: "UNDER_REVIEW",
      reviewerNotes: "Đang đối soát điểm từng học kỳ.",
      reviewedAt: null
    },
    {
      id: "doc-photo",
      type: "PORTRAIT_PHOTO",
      title: "Ảnh thẻ chân dung 3x4 (Phông nền trắng)",
      fileName: "Anh_The_NguyenVanAn_3x4.jpg",
      fileSize: "1.2 MB",
      mimeType: "image/jpeg",
      uploadedAt: "2026-08-14 16:45",
      status: "NEEDS_UPDATE",
      reviewerNotes: "Ảnh chân dung chụp góc nghiêng và bị mờ. Vui lòng tải lại ảnh chụp chính diện phông nền trắng rõ nét.",
      reviewedAt: "2026-08-15 08:30"
    },
    {
      id: "doc-ielts",
      type: "INTERNATIONAL_CERT_FILE",
      title: "Bản sao Chứng chỉ Quốc tế (IELTS/SAT/TOEFL)",
      fileName: "IELTS_7.0_Certificate.pdf",
      fileSize: "1.8 MB",
      mimeType: "application/pdf",
      uploadedAt: "2026-08-13 11:00",
      status: "VERIFIED",
      reviewerNotes: "Chứng chỉ IELTS 7.0 còn hạn đến 2027.",
      reviewedAt: "2026-08-14 14:00"
    },
    {
      id: "doc-grad",
      type: "GRADUATION_CERT",
      title: "Giấy chứng nhận tốt nghiệp THPT",
      fileName: "GiayChungNhan_TotNghiepTHPT_TamThoi.pdf",
      fileSize: "1.5 MB",
      mimeType: "application/pdf",
      uploadedAt: "2026-08-14 09:00",
      status: "VERIFIED",
      reviewerNotes: "Đã xác thực tốt nghiệp THPT.",
      reviewedAt: "2026-08-14 10:30"
    }
  ],

  // Step 6: Preferences (Up to 10)
  preferences: [
    {
      id: "pref-1",
      priority: 1,
      campusId: "CAMPUS_HN",
      campusName: "FPT Hà Nội (Khu CNC Hòa Lạc)",
      majorId: "MAJOR_SE",
      majorCode: "7480103",
      majorName: "Kỹ thuật Phần mềm (Software Engineering)",
      admissionMethodId: "THPT_EXAM",
      admissionMethodName: "Xét điểm thi THPT",
      combinationCode: "A01",
      combinationName: "Toán, Vật lý, Tiếng Anh",
      myScore: 26.5,
      benchmarkScore: 24.5,
      eligibilityStatus: "ELIGIBLE",
      statusText: "Đủ điều kiện đăng ký xét tuyển",
      scholarshipRecommended: "Học bổng Tài năng 30%"
    },
    {
      id: "pref-2",
      priority: 2,
      campusId: "CAMPUS_QN",
      campusName: "FPT Quy Nhơn (Trung tâm AI Quốc tế)",
      majorId: "MAJOR_AI",
      majorCode: "7480107",
      majorName: "Trí tuệ Nhân tạo (Artificial Intelligence)",
      admissionMethodId: "ACADEMIC_TRANSCRIPT",
      admissionMethodName: "Xét học bạ THPT",
      combinationCode: "A00",
      combinationName: "Toán, Vật lý, Hóa học",
      myScore: 25.5,
      benchmarkScore: 25.0,
      eligibilityStatus: "ELIGIBLE",
      statusText: "Đủ điều kiện đăng ký xét tuyển",
      scholarshipRecommended: "Học bổng Đặc biệt AI Hub"
    },
    {
      id: "pref-3",
      priority: 3,
      campusId: "CAMPUS_HCM",
      campusName: "FPT TP. Hồ Chí Minh (Khu CNC Thủ Đức)",
      majorId: "MAJOR_SEMI",
      majorCode: "7340120",
      majorName: "Thiết kế Vi mạch Bán dẫn (Semiconductor)",
      admissionMethodId: "INTERNATIONAL_CERT",
      admissionMethodName: "Xét chứng chỉ quốc tế (IELTS 7.0)",
      combinationCode: "D07",
      combinationName: "Toán, Hóa học, Tiếng Anh",
      myScore: 27.0,
      benchmarkScore: 24.0,
      eligibilityStatus: "ELIGIBLE",
      statusText: "Đủ điều kiện đăng ký xét tuyển",
      scholarshipRecommended: "Ưu tiên tuyển thẳng"
    }
  ],

  // Fee Payment Info
  feePayment: {
    amount: 200000,
    status: "UNPAID", // UNPAID, PAID, PROCESSING
    transactionId: null,
    paidAt: null,
    method: "VIETQR"
  },

  // Final Acceptance / Confirmation
  confirmation: {
    agreedTerms: false,
    confirmedAt: null,
    enrolledConfirmed: false
  }
};

// ── AUDIT LOG HELPER ──
export const logAuditEvent = (action, details, actor = "Applicant") => {
  try {
    const existingLogs = JSON.parse(localStorage.getItem(AUDIT_KEY) || "[]");
    const newLog = {
      id: "LOG-" + Date.now(),
      action,
      details,
      actor,
      timestamp: new Date().toLocaleString("vi-VN"),
      ip: "118.70.190.12"
    };
    existingLogs.unshift(newLog);
    localStorage.setItem(AUDIT_KEY, JSON.stringify(existingLogs.slice(0, 50)));
  } catch (e) {
    console.error("Audit log error:", e);
  }
};

// ── GET & SAVE APPLICATION DATA ──
export const loadApplicationState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Load state error:", e);
  }
  return INITIAL_APPLICATION_STATE;
};

export const saveApplicationState = (state) => {
  try {
    const nextState = {
      ...state,
      lastSavedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    return nextState;
  } catch (e) {
    console.error("Save state error:", e);
    return state;
  }
};

// ── SCORE CALCULATION ENGINE ──
export const calculateCandidateScore = (application, methodId, combinationCode) => {
  const { academicInfo, priorities, certificates } = application;
  const combo = SUBJECT_COMBINATIONS.find(c => c.code === combinationCode) || SUBJECT_COMBINATIONS[0];
  const area = PRIORITY_AREAS.find(a => a.code === priorities?.areaCode) || PRIORITY_AREAS[3];
  const obj = PRIORITY_OBJECTS.find(o => o.code === priorities?.objectCode) || PRIORITY_OBJECTS[0];
  const priorityBonus = (area.bonus || 0) + (obj.bonus || 0);

  let rawScore = 0;

  if (methodId === "THPT_EXAM") {
    // Sum of 3 subjects in exam
    const examScores = academicInfo.thptExam?.scores || {};
    combo.subjects.forEach(sub => {
      rawScore += Number(examScores[sub] || 0);
    });
  } else if (methodId === "ACADEMIC_TRANSCRIPT") {
    // Sum of 3 subjects in grade 12 transcript
    const transScores = academicInfo.subjectScores || {};
    combo.subjects.forEach(sub => {
      rawScore += Number(transScores[sub] || 0);
    });
  } else if (methodId === "DGNL_EXAM") {
    // Convert DGNL to 30 scale
    const dgnl = academicInfo.dgnlExam;
    if (dgnl?.score && dgnl?.maxScore) {
      rawScore = (dgnl.score / dgnl.maxScore) * 30;
    } else {
      rawScore = 24.0;
    }
  } else if (methodId === "INTERNATIONAL_CERT") {
    // IELTS conversion table
    const ielts = certificates.find(c => c.type === "IELTS");
    const scoreVal = parseFloat(ielts?.score || "6.0");
    if (scoreVal >= 8.0) rawScore = 29.0;
    else if (scoreVal >= 7.5) rawScore = 28.0;
    else if (scoreVal >= 7.0) rawScore = 27.0;
    else if (scoreVal >= 6.5) rawScore = 26.0;
    else if (scoreVal >= 6.0) rawScore = 25.0;
    else rawScore = 22.0;
  } else {
    // General combined / transcript
    const gpa = academicInfo.grade12Gpa || 8.5;
    rawScore = (gpa / 10) * 30;
  }

  const finalScore = Math.min(30, Number((rawScore + priorityBonus).toFixed(2)));
  return {
    rawScore: Number(rawScore.toFixed(2)),
    priorityBonus: Number(priorityBonus.toFixed(2)),
    finalScore
  };
};

// ── ELIGIBILITY ENGINE ──
export const evaluateEligibility = (application, preference) => {
  const { academicInfo, documents, certificates } = application;
  const major = MAJORS.find(m => m.id === preference.majorId);
  const issues = [];
  let isEligible = true;

  // 1. Check Graduation
  if (academicInfo.graduationStatus !== "GRADUATED" && academicInfo.graduationStatus !== "PENDING") {
    issues.push("Chưa hoàn thành hoặc chưa khai báo thông tin tốt nghiệp THPT.");
    isEligible = false;
  }

  // 2. Check Required Document
  const hasTranscript = documents.some(d => d.type === "ACADEMIC_TRANSCRIPT" && d.status !== "REJECTED");
  if (!hasTranscript) {
    issues.push("Chưa tải lên bản scan Học bạ THPT để đối soát.");
    isEligible = false;
  }

  // 3. Check Method Specific Criteria
  if (preference.admissionMethodId === "INTERNATIONAL_CERT") {
    const ielts = certificates.find(c => c.type === "IELTS");
    const minIelts = major?.minIeltsScore || 6.0;
    if (!ielts || parseFloat(ielts.score || "0") < minIelts) {
      issues.push(`Điểm IELTS ${ielts?.score || "0"} chưa đạt mức tối thiểu yêu cầu ${minIelts} của ngành.`);
      isEligible = false;
    }
  }

  // 4. Check Score vs Benchmark
  const scoreCalc = calculateCandidateScore(application, preference.admissionMethodId, preference.combinationCode);
  const benchmark = major?.benchmarkScoreTHPT || 21.0;

  if (scoreCalc.finalScore < benchmark) {
    issues.push(`Điểm xét tuyển (${scoreCalc.finalScore}đ) chưa đạt điểm chuẩn sơ bộ (${benchmark}đ) của ngành.`);
    isEligible = false;
  }

  return {
    isEligible,
    calculatedScore: scoreCalc.finalScore,
    benchmarkScore: benchmark,
    reasons: issues.length > 0 ? issues : ["Hồ sơ đạt đầy đủ điều kiện tuyển sinh, chứng chỉ và điểm sàn quy định."]
  };
};

// ── REAL PROGRESS BAR ENGINE (Weight Based) ──
export const calculateApplicationProgress = (app) => {
  let score = 0;
  const breakdown = {
    personal: 0,
    methods: 0,
    academic: 0,
    certificates: 0,
    documents: 0,
    preferences: 0,
    eligibility: 0,
    confirmation: 0
  };

  // 1. Personal Info (15%)
  const p = app.personalInfo;
  if (p?.fullName && p?.citizenId && p?.dob && p?.phone && p?.email && p?.permanentProvince && p?.fatherName && p?.motherName) {
    breakdown.personal = 15;
    score += 15;
  } else if (p?.fullName && p?.citizenId) {
    breakdown.personal = 8;
    score += 8;
  }

  // 2. Admission Method (10%)
  if (app.selectedMethods && app.selectedMethods.length > 0) {
    breakdown.methods = 10;
    score += 10;
  }

  // 3. Academic Info (20%)
  const a = app.academicInfo;
  if (a?.highSchoolName && a?.grade10Gpa && a?.grade11Gpa && a?.grade12Gpa && a?.subjectScores?.math) {
    breakdown.academic = 20;
    score += 20;
  } else if (a?.highSchoolName) {
    breakdown.academic = 10;
    score += 10;
  }

  // 4. Certificates & Achievements (10%)
  if (app.certificates?.length > 0 || app.achievements?.length > 0 || app.priorities?.areaCode) {
    breakdown.certificates = 10;
    score += 10;
  }

  // 5. Documents (20%)
  const validDocs = app.documents.filter(d => d.status === "VERIFIED" || d.status === "UNDER_REVIEW" || d.status === "UPLOADED");
  const docRatio = Math.min(1, validDocs.length / 3);
  const docScore = Math.round(docRatio * 20);
  breakdown.documents = docScore;
  score += docScore;

  // 6. Preferences (10%)
  if (app.preferences && app.preferences.length > 0) {
    breakdown.preferences = 10;
    score += 10;
  }

  // 7. Eligibility Check (5%)
  if (app.preferences?.length > 0) {
    const hasChecked = app.preferences.every(pref => pref.eligibilityStatus);
    if (hasChecked) {
      breakdown.eligibility = 5;
      score += 5;
    }
  }

  // 8. Confirmation & Fee (10%)
  if (app.status === "SUBMITTED" || app.confirmation?.agreedTerms) {
    breakdown.confirmation = 10;
    score += 10;
  }

  return {
    totalPercent: Math.min(100, score),
    breakdown
  };
};

// ── ACTIONABLE TASKS ENGINE ──
export const generateActionableTasks = (app) => {
  const tasks = [];

  // Task 0: Complete Registration Form (When Officer marks profile as complete)
  if (app.status === "VERIFIED_AND_COMPLETE" || app.status === "ADMITTED") {
    tasks.push({
      id: "task-enrollment-form",
      title: "Hoàn tất Phiếu Đăng Ký Đại Học FPT (Nhập học chính thức)",
      description: "Hồ sơ của bạn đã được Cán bộ Tuyển sinh xác thực ĐẦY ĐỦ YÊU CẦU. Vui lòng mở, kiểm tra và ký nộp Phiếu Đăng Ký Đại Học FPT.",
      priority: "HIGH",
      priorityColor: "#16A34A",
      deadline: "17:00 ngày 25/08/2026",
      targetTab: "enrollment_form",
      actionText: "Mở Phiếu Đăng Ký",
      status: "PENDING"
    });
  }

  // Task 1: Check document needing update
  const blurryDoc = app.documents.find(d => d.status === "NEEDS_UPDATE" || d.status === "REJECTED");
  if (blurryDoc) {
    tasks.push({
      id: "task-doc-update",
      title: `Bổ sung ${blurryDoc.title}`,
      description: blurryDoc.reviewerNotes || "Tài liệu chưa đạt yêu cầu. Vui lòng tải lại bản rõ nét.",
      priority: "HIGH",
      priorityColor: "#DC2626",
      deadline: "17:00 ngày 25/08/2026",
      targetTab: "documents",
      actionText: "Tải lên ngay",
      status: "PENDING"
    });
  }

  // Task 2: Check missing transcript
  const hasTranscript = app.documents.some(d => d.type === "ACADEMIC_TRANSCRIPT");
  if (!hasTranscript) {
    tasks.push({
      id: "task-upload-transcript",
      title: "Bổ sung bản scan Học bạ THPT",
      description: "Yêu cầu đầy đủ 3 năm lớp 10, 11 và 12 để đối soát điểm.",
      priority: "HIGH",
      priorityColor: "#DC2626",
      deadline: "20/08/2026",
      targetTab: "documents",
      actionText: "Bổ sung ngay",
      status: "PENDING"
    });
  }

  // Task 3: Unpaid fee
  if (app.feePayment?.status === "UNPAID") {
    tasks.push({
      id: "task-pay-fee",
      title: "Thanh toán lệ phí xét tuyển (200.000 VNĐ)",
      description: "Thanh toán trực tuyến nhanh qua mã VietQR hoặc VNPAY.",
      priority: "MEDIUM",
      priorityColor: "#EA580C",
      deadline: "28/08/2026",
      targetTab: "review_and_submit",
      actionText: "Thanh toán QR",
      status: "PENDING"
    });
  }

  // Task 4: Submit application
  if (app.status === "DRAFT" || app.status === "READY_TO_SUBMIT") {
    tasks.push({
      id: "task-submit-app",
      title: "Kiểm tra và Nộp hồ sơ chính thức",
      description: "Rà soát thông tin các mục trước khi ký cam đoan và gửi Hội đồng Tuyển sinh.",
      priority: "HIGH",
      priorityColor: "#2563EB",
      deadline: "30/08/2026",
      targetTab: "review_and_submit",
      actionText: "Nộp hồ sơ",
      status: "PENDING"
    });
  }

  return tasks;
};

// ── NOTIFICATION ENGINE ──
export const getInitialNotifications = () => {
  try {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error("Load notifs error:", e);
  }
  return [
    {
      id: "notif-0",
      title: "🎉 Hồ sơ xét tuyển đã đầy đủ & hợp lệ!",
      content: "Cán bộ tuyển sinh đã thẩm định xong: Hồ sơ đạt chuẩn 100%. Mẫu Phiếu đăng ký Đại học FPT (chính quy) đã được gửi đến bạn.",
      type: "SUCCESS",
      read: false,
      createdAt: "Vừa xong",
      targetTab: "enrollment_form"
    },
    {
      id: "notif-1",
      title: "Yêu cầu cập nhật ảnh chân dung 3x4",
      content: "Cán bộ tuyển sinh phản hồi: Ảnh chân dung chụp góc nghiêng và bị mờ. Vui lòng tải lại ảnh chính diện phông trắng.",
      type: "WARNING",
      read: false,
      createdAt: "10 phút trước",
      targetTab: "documents"
    },
    {
      id: "notif-2",
      title: "Hồ sơ sơ tuyển đã được tiếp nhận",
      content: "Mã hồ sơ FPT-2026-894120 đã được lưu thành công trên hệ thống Cổng Tuyển sinh FPT University.",
      type: "SUCCESS",
      read: true,
      createdAt: "2 giờ trước",
      targetTab: "dashboard"
    },
    {
      id: "notif-3",
      title: "Lịch phỏng vấn Học bổng FPT Talent 2026",
      content: "Bạn có lịch phỏng vấn học bổng trực tiếp lúc 09:00 ngày 15/08 tại Tòa nhà Alpha, Campus Hòa Lạc.",
      type: "INFO",
      read: true,
      createdAt: "1 ngày trước",
      targetTab: "dashboard"
    }
  ];
};

export const pushCandidateNotification = (title, content, type = "SUCCESS", targetTab = "enrollment_form") => {
  try {
    const notifs = getInitialNotifications();
    const newNotif = {
      id: "notif-" + Date.now(),
      title,
      content,
      type,
      read: false,
      createdAt: "Vừa xong",
      targetTab
    };
    notifs.unshift(newNotif);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs.slice(0, 30)));
    return newNotif;
  } catch (e) {
    console.error("Push notif error:", e);
  }
};
