// ==============================================================================
// FPT UNIVERSITY - DATA WAREHOUSE & DECISION SUPPORT SYSTEM (DWH DSS SERVICE)
// Star & Snowflake Schema Data Access Layer connecting all Portals
// ==============================================================================

export const DWH_DIMENSIONS = {
  campuses: [
    { key: 1, code: "FU-HN", name: "FPT University Hà Nội (Hòa Lạc)", location: "Hà Nội", capacity: 8500, current: 8200 },
    { key: 2, code: "FU-HCM", name: "FPT University TP.HCM", location: "TP.HCM", capacity: 7000, current: 6850 },
    { key: 3, code: "FU-DN", name: "FPT University Đà Nẵng", location: "Đà Nẵng", capacity: 4000, current: 3750 },
    { key: 4, code: "FU-CT", name: "FPT University Cần Thơ", location: "Cần Thơ", capacity: 3500, current: 3200 },
    { key: 5, code: "FU-QN", name: "FPT University Quy Nhơn (AI Campus)", location: "Quy Nhơn", capacity: 2500, current: 2200 },
  ],

  faculties: [
    { key: 1, code: "FIT", name: "Khoa Công Nghệ Thông Tin" },
    { key: 2, code: "FBA", name: "Khoa Quản Trị Kinh Doanh" },
    { key: 3, code: "FDN", name: "Khoa Thiết Kế & Mỹ Thuật Số" },
    { key: 4, code: "FLA", name: "Khoa Ngôn Ngữ & Văn Hóa" },
  ],

  programs: [
    { key: 1, code: "7480103", name: "Kỹ thuật Phần mềm (Software Engineering)", faculty: "FIT", quota: 4200, benchmark: 24.5 },
    { key: 2, code: "7480107", name: "Trí tuệ Nhân tạo (Artificial Intelligence)", faculty: "FIT", quota: 1500, benchmark: 25.0 },
    { key: 3, code: "7480108", name: "An toàn Thông tin (Information Assurance)", faculty: "FIT", quota: 800, benchmark: 23.5 },
    { key: 4, code: "7340120", name: "Thiết kế Vi mạch Bán dẫn (Semiconductor)", faculty: "FIT", quota: 600, benchmark: 24.0 },
    { key: 5, code: "7340101", name: "Quản trị Kinh doanh Quốc tế (International Business)", faculty: "FBA", quota: 2500, benchmark: 23.0 },
    { key: 6, code: "7210403", name: "Thiết kế Mỹ thuật số (Digital Art & Design)", faculty: "FDN", quota: 1200, benchmark: 22.5 },
    { key: 7, code: "7220201", name: "Ngôn ngữ Anh - Thương mại (Business English)", faculty: "FLA", quota: 1400, benchmark: 22.0 },
  ],

  admissionMethods: [
    { key: 1, code: "THPT", name: "Xét điểm thi Tốt nghiệp THPT Quốc gia", weight: "45%" },
    { key: 2, code: "SCHOOLRANK", name: "Xét Học bạ THPT (Top 30 SchoolRank)", weight: "35%" },
    { key: 3, code: "DGNL", name: "Xét điểm thi Đánh giá Năng lực (ĐHQG)", weight: "15%" },
    { key: 4, code: "DIRECT", name: "Tuyển thẳng & Học bổng Tài năng", weight: "5%" },
  ]
};

// 7 BẢNG FACT TẬP TRUNG (CENTRALIZED DWH FACTS)
export const DWH_FACTS = {
  // 1. FACT_ADMISSION (Tuyển sinh)
  admission: {
    totalApplications: 14285,
    verifiedApplications: 12150,
    examsTaken: 8940,
    interviews: 6120,
    enrolled: 4050,
    conversionRate: "28.3%",
    totalScholarshipAwarded: "45.2 Tỷ VNĐ",
    targetAchievement: "102.4%",
  },

  // 2. FACT_FINANCE (Tài chính & Thu học phí)
  finance: {
    totalTuitionBilled: "2,450 Tỷ VNĐ",
    totalCollected: "2,308 Tỷ VNĐ",
    collectionRate: "94.2%",
    totalScholarshipsDisbursed: "112.5 Tỷ VNĐ",
    infrastructureInvestment: "450 Tỷ VNĐ",
    operatingMargin: "14.8%",
  },

  // 3. FACT_LEARNING (Học thuật & Điểm số)
  learning: {
    averageGpa: 3.24,
    creditCompletionRate: "91.8%",
    retentionRate: "94.2%",
    academicWarningRate: "2.1%",
    totalCoursesActive: 480,
  },

  // 4. FACT_HR (Nhân sự & Định biên)
  hr: {
    totalHeadcount: 1245,
    lecturers: 820,
    officers: 425,
    phdRatio: "42.8%",
    studentLecturerRatio: "1 : 18.2",
    turnoverRate: "1.2%",
  },

  // 5. FACT_LMS (Hệ thống Học tập trực tuyến)
  lms: {
    dailyActiveStudents: 18450,
    averageStudyTimeHours: 3.4,
    assignmentSubmissionRate: "96.5%",
    interactiveQuizAvg: 8.4,
  },

  // 6. FACT_RESEARCH (Nghiên cứu khoa học)
  research: {
    scopusPublications: 320,
    activeProjects: 45,
    totalBudget: "28.5 Tỷ VNĐ",
    citationCount: 1450,
  },

  // 7. FACT_LIBRARY (Thư viện số)
  library: {
    digitalBooksBorrowed: 64200,
    ebookDownloads: 128500,
    activeReaders: 15200,
  }
};

// Hàm tra cứu DWH tổng hợp cho BOD & Cán bộ
export function getDWHSummaryMetrics() {
  return {
    dimensions: DWH_DIMENSIONS,
    facts: DWH_FACTS,
    updatedAt: new Date().toISOString(),
    status: "HEALTHY (Synchronized via ETL Pipe)",
  };
}
