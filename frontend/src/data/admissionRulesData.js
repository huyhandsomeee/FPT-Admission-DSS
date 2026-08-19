// System Configuration & Admission Rules for FPT University Admission Portal

export const CAMPUSES = [
  {
    id: "CAMPUS_HN",
    code: "FPT-HN",
    name: "FPT Hà Nội (Khu CNC Hòa Lạc)",
    city: "Hà Nội",
    address: "Khu Công nghệ cao Hòa Lạc, Km29 Đại lộ Thăng Long, Thạch Thất, Hà Nội",
    description: "Khuôn viên đại học phong cách Silicon Valley với Tòa nhà Alpha đoạt giải kiến trúc quốc tế, KTX xanh, sân trượt băng, trung tâm thể thao hiện đại.",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80",
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    dormAvailable: true,
    dormPrice: "1.200.000 - 1.800.000 VNĐ/tháng",
    tuitionPerSemester: "28.700.000 - 32.500.000 VNĐ",
    scholarshipPolicy: "Học bổng Tài năng FPT (30%, 50%, 70%, 100%, 100%+)",
    highlights: ["Tòa nhà Alpha đoạt giải WAF", "Thư viện 3 tầng hiện đại", "Sân bóng đá & Golf 3D", "Làng phần mềm F-Ville kề bên"],
  },
  {
    id: "CAMPUS_HCM",
    code: "FPT-HCM",
    name: "FPT TP. Hồ Chí Minh (Khu CNC Thủ Đức)",
    city: "TP. Hồ Chí Minh",
    address: "Đường D1, Khu Công nghệ cao, P. Long Thạnh Mỹ, TP. Thủ Đức, TP.HCM",
    description: "Tọa lạc tại trái tim thung lũng công nghệ cao TP.HCM, kết nối trực tiếp hơn 100 tập đoàn đa quốc gia hàng đầu như Intel, Nidec, Samsung, FPT Software.",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80",
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    dormAvailable: true,
    dormPrice: "1.400.000 - 2.000.000 VNĐ/tháng",
    tuitionPerSemester: "31.200.000 - 34.800.000 VNĐ",
    scholarshipPolicy: "Học bổng Nguyễn Văn Đạo & Học bổng Khuyến học miền Nam",
    highlights: ["Không gian khởi nghiệp F-Startup Hub", "Phòng Lab Vi mạch Bán dẫn", "Studio Mỹ thuật số chuyên nghiệp"],
  },
  {
    id: "CAMPUS_DN",
    code: "FPT-DN",
    name: "FPT Đà Nẵng (Khu Đô thị FPT City)",
    city: "Đà Nẵng",
    address: "Khu đô thị công nghệ FPT Đà Nẵng, P. Hòa Hải, Q. Ngũ Hành Sơn, TP. Đà Nẵng",
    description: "Đại học xanh tiêu chuẩn quốc tế bên bờ sông Cổ Cò, môi trường học tập lý tưởng kết hợp trải nghiệm sống năng động tại thành phố đáng sống nhất Việt Nam.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80",
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    dormAvailable: true,
    dormPrice: "1.000.000 - 1.500.000 VNĐ/tháng",
    tuitionPerSemester: "24.500.000 - 28.000.000 VNĐ",
    scholarshipPolicy: "Học bổng Tiếp sức nhân tài miền Trung - Tây Nguyên",
    highlights: ["Campus năng lượng xanh FPT Complex", "Bãi biển riêng cách 1.5km", "KTX chuẩn resort 4 sao"],
  },
  {
    id: "CAMPUS_CT",
    code: "FPT-CT",
    name: "FPT Cần Thơ (Đồng Bằng Sông Cửu Long)",
    city: "Cần Thơ",
    address: "Số 600 đường Nguyễn Văn Cừ (nối dài), P. An Bình, Q. Ninh Kiều, TP. Cần Thơ",
    description: "Trung tâm đào tạo nguồn nhân lực công nghệ thông tin và kinh tế số hàng đầu vùng Đồng bằng Sông Cửu Long với cơ sở vật chất chuẩn quốc tế.",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&auto=format&fit=crop&q=80",
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    dormAvailable: true,
    dormPrice: "900.000 - 1.300.000 VNĐ/tháng",
    tuitionPerSemester: "22.500.000 - 26.000.000 VNĐ",
    scholarshipPolicy: "Học bổng Ươm mầm tài năng Tây Đô",
    highlights: ["Quảng trường nhạc nước FPT", "Hệ thống nhà đa năng thể thao", "Khu trải nghiệm văn hóa Mekong"],
  },
  {
    id: "CAMPUS_QN",
    code: "FPT-QN",
    name: "FPT Quy Nhơn (Trung tâm AI Quốc tế)",
    city: "Bình Định",
    address: "Khu đô thị An Phú Thịnh, P. Nhơn Bình & P. Đống Đa, TP. Quy Nhơn, Bình Định",
    description: "Tổ hợp Không gian Khoa học và Công nghệ Trí tuệ Nhân tạo (AI Campus) đầu tiên tại Việt Nam, hội tụ các chuyên gia AI và kỹ sư dữ liệu quốc tế.",
    image: "https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800&auto=format&fit=crop&q=80",
    videoTourUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    dormAvailable: true,
    dormPrice: "850.000 - 1.200.000 VNĐ/tháng",
    tuitionPerSemester: "20.500.000 - 24.000.000 VNĐ",
    scholarshipPolicy: "Học bổng Đặc biệt AI Hub (Tài trợ 50% - 100% toàn khóa học)",
    highlights: ["Trung tâm Siêu máy tính GPU NVIDIA", "Thung lũng AI Quy Hòa", "Hợp tác Viện nghiên cứu Mila (Canada)"],
  }
];

export const MAJORS = [
  // Công nghệ thông tin
  {
    id: "MAJOR_SE",
    code: "7480103",
    name: "Kỹ thuật Phần mềm (Software Engineering)",
    faculty: "Công nghệ Thông tin",
    benchmarkScoreTHPT: 24.5,
    benchmarkScoreHocBa: 24.0,
    benchmarkScoreDGNL: 800,
    minIeltsScore: 6.0,
    combinations: ["A00", "A01", "D01", "D07"],
    description: "Đào tạo kỹ sư phần mềm chuẩn quốc tế, làm chủ quy trình phát triển Agile/DevOps, Cloud Computing, Microservices và phát triển ứng dụng quy mô lớn.",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_DN", "CAMPUS_CT", "CAMPUS_QN"],
    quota: 2500,
    careerOutcomes: "Kỹ sư phần mềm, Solution Architect, Fullstack Developer, Tech Lead"
  },
  {
    id: "MAJOR_AI",
    code: "7480107",
    name: "Trí tuệ Nhân tạo (Artificial Intelligence)",
    faculty: "Công nghệ Thông tin",
    benchmarkScoreTHPT: 25.0,
    benchmarkScoreHocBa: 25.5,
    benchmarkScoreDGNL: 850,
    minIeltsScore: 6.0,
    combinations: ["A00", "A01", "D01", "D07"],
    description: "Nghiên cứu và ứng dụng Deep Learning, LLM, Computer Vision, Robotics và Generative AI hợp tác cùng Viện Mila và FPT Software.",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_DN", "CAMPUS_QN"],
    quota: 1200,
    careerOutcomes: "AI Engineer, Machine Learning Specialist, Data Scientist, NLP Engineer"
  },
  {
    id: "MAJOR_SEMI",
    code: "7340120",
    name: "Thiết kế Vi mạch Bán dẫn (Semiconductor IC Design)",
    faculty: "Công nghệ Thông tin",
    benchmarkScoreTHPT: 24.0,
    benchmarkScoreHocBa: 24.0,
    benchmarkScoreDGNL: 820,
    minIeltsScore: 6.0,
    combinations: ["A00", "A01", "D07", "A02"],
    description: "Đào tạo kỹ sư thiết kế vi mạch bán dẫn phần cứng, VLSI, FPGA và kiểm thử chip theo chương trình hợp tác với các tập đoàn Hoa Kỳ và Đài Loan.",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_DN"],
    quota: 800,
    careerOutcomes: "IC Design Engineer, Verification Engineer, Embedded System Engineer"
  },
  {
    id: "MAJOR_IS",
    code: "7480201",
    name: "An toàn Thông tin (Cybersecurity)",
    faculty: "Công nghệ Thông tin",
    benchmarkScoreTHPT: 23.5,
    benchmarkScoreHocBa: 23.5,
    benchmarkScoreDGNL: 780,
    minIeltsScore: 6.0,
    combinations: ["A00", "A01", "D01", "D07"],
    description: "Bảo vệ hệ thống dữ liệu, phòng thủ không gian mạng, Ethical Hacking, điều tra số và ứng cứu sự cố an ninh mạng.",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_DN", "CAMPUS_CT"],
    quota: 900,
    careerOutcomes: "Security Analyst, Penetration Tester, SOC Engineer, Chief Information Security Officer"
  },
  {
    id: "MAJOR_DS",
    code: "7480109",
    name: "Khoa học Dữ liệu (Data Science)",
    faculty: "Công nghệ Thông tin",
    benchmarkScoreTHPT: 23.5,
    benchmarkScoreHocBa: 23.5,
    benchmarkScoreDGNL: 780,
    minIeltsScore: 6.0,
    combinations: ["A00", "A01", "D01", "D07"],
    description: "Khai phá dữ liệu lớn (Big Data), xây dựng mô hình dự báo kinh doanh và phân tích dữ liệu chuyên sâu cho doanh nghiệp số.",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_QN"],
    quota: 600,
    careerOutcomes: "Data Analyst, Data Engineer, Business Intelligence Consultant"
  },

  // Kinh tế & Quản trị
  {
    id: "MAJOR_IB",
    code: "7340121",
    name: "Quản trị Kinh doanh Quốc tế (International Business)",
    faculty: "Quản trị Kinh doanh",
    benchmarkScoreTHPT: 23.0,
    benchmarkScoreHocBa: 23.0,
    benchmarkScoreDGNL: 750,
    minIeltsScore: 5.5,
    combinations: ["A00", "A01", "D01", "D09"],
    description: "Đào tạo nhà quản trị toàn cầu, am hiểu thị trường quốc tế, chuỗi cung ứng logistics toàn cầu và chiến lược kinh doanh đa quốc gia.",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_DN", "CAMPUS_CT", "CAMPUS_QN"],
    quota: 1500,
    careerOutcomes: "Global Supply Chain Manager, Export-Import Specialist, Business Developer"
  },
  {
    id: "MAJOR_DM",
    code: "7340115",
    name: "Digital Marketing & Truyền thông Số",
    faculty: "Quản trị Kinh doanh",
    benchmarkScoreTHPT: 23.5,
    benchmarkScoreHocBa: 23.5,
    benchmarkScoreDGNL: 760,
    minIeltsScore: 5.5,
    combinations: ["A00", "A01", "D01", "D07"],
    description: "Thực chiến sáng tạo nội dung số, tối ưu hóa công cụ tìm kiếm (SEO/SEM), Performance Marketing, phân tích hành vi người tiêu dùng qua dữ liệu số.",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_DN", "CAMPUS_CT"],
    quota: 1200,
    careerOutcomes: "Digital Marketing Strategist, Brand Manager, Content Creative Lead"
  },
  {
    id: "MAJOR_FIN",
    code: "7340205",
    name: "Tài chính & Công nghệ Tài chính (Fintech)",
    faculty: "Quản trị Kinh doanh",
    benchmarkScoreTHPT: 23.0,
    benchmarkScoreHocBa: 23.0,
    benchmarkScoreDGNL: 750,
    minIeltsScore: 5.5,
    combinations: ["A00", "A01", "D01", "D07"],
    description: "Giao thoa giữa Tài chính hiện đại và Công nghệ Blockchain, thanh toán điện tử, định lượng tài chính và đầu tư tự động hóa.",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_DN"],
    quota: 700,
    careerOutcomes: "Fintech Analyst, Risk Manager, Investment Consultant, Blockchain Financial Engineer"
  },

  // Thiết kế & Mỹ thuật số
  {
    id: "MAJOR_DAD",
    code: "7210403",
    name: "Thiết kế Mỹ thuật Số (Digital Art & Design)",
    faculty: "Thiết kế & Nghệ thuật",
    benchmarkScoreTHPT: 22.5,
    benchmarkScoreHocBa: 22.5,
    benchmarkScoreDGNL: 720,
    minIeltsScore: 5.5,
    combinations: ["A00", "A01", "D01", "H00", "V00"],
    description: "Đồ họa 2D/3D, UI/UX Design, Kỹ xảo điện ảnh (VFX), Hoạt hình số 3D và Thiết kế Game chuẩn Hollywood.",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_DN", "CAMPUS_CT"],
    quota: 1000,
    careerOutcomes: "UI/UX Designer, 3D Game Artist, Concept Artist, Creative Art Director"
  },

  // Ngôn ngữ Quốc tế
  {
    id: "MAJOR_ENG",
    code: "7220201",
    name: "Ngôn ngữ Anh (English Language Studies)",
    faculty: "Ngôn ngữ",
    benchmarkScoreTHPT: 22.0,
    benchmarkScoreHocBa: 22.0,
    benchmarkScoreDGNL: 700,
    minIeltsScore: 6.0,
    combinations: ["D01", "A01", "D09", "D14"],
    description: "Tiếng Anh thương mại và biên phiên dịch công nghệ cao, kết hợp kỹ năng mềm và tư duy kinh doanh toàn cầu.",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_DN", "CAMPUS_CT"],
    quota: 800,
    careerOutcomes: "Translator/Interpreter, International PR Specialist, Corporate Communications"
  },
  {
    id: "MAJOR_JAP",
    code: "7220209",
    name: "Ngôn ngữ Nhật (Japanese Studies & IT Translation)",
    faculty: "Ngôn ngữ",
    benchmarkScoreTHPT: 22.0,
    benchmarkScoreHocBa: 22.0,
    benchmarkScoreDGNL: 700,
    minIeltsScore: 5.0,
    combinations: ["D01", "D06", "A01", "D14"],
    description: "Đào tạo tiếng Nhật chuyên ngành CNTT (BrSE), sẵn sàng làm việc tại Nhật Bản hoặc các dự án công nghệ lớn với đối tác Nhật.",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_DN", "CAMPUS_CT", "CAMPUS_QN"],
    quota: 700,
    careerOutcomes: "Bridge System Engineer (BrSE), IT Communicator, Trợ lý Giám đốc Nhật Bản"
  },
  {
    id: "MAJOR_KOR",
    code: "7220210",
    name: "Ngôn ngữ Hàn Quốc (Korean Studies)",
    faculty: "Ngôn ngữ",
    benchmarkScoreTHPT: 22.0,
    benchmarkScoreHocBa: 22.0,
    benchmarkScoreDGNL: 700,
    minIeltsScore: 5.0,
    combinations: ["D01", "D06", "A01", "D14"],
    description: "Thành thạo tiếng Hàn thương mại và truyền thông, cơ hội làm việc tại các tập đoàn hàng đầu Hàn Quốc (Samsung, LG, CJ, Hyundai).",
    openCampuses: ["CAMPUS_HN", "CAMPUS_HCM", "CAMPUS_DN", "CAMPUS_CT"],
    quota: 600,
    careerOutcomes: "Korean Corporate Liaison, Translator, K-Business Coordinator"
  }
];

export const ADMISSION_METHODS = [
  {
    id: "ACADEMIC_TRANSCRIPT",
    code: "HB",
    name: "Xét tuyển Học bạ THPT",
    badge: "Phổ biến nhất",
    badgeColor: "#EA580C",
    icon: "GraduationCap",
    status: "OPEN",
    description: "Xét tuyển dựa trên kết quả học tập THPT các năm lớp 10, 11 và học kỳ I lớp 12 hoặc điểm TB 3 môn tổ hợp lớp 12 đạt Top 30 SchoolRank.",
    criteria: "Điểm TB 3 môn tổ hợp xét tuyển >= 21.0 điểm hoặc đạt Top 30 SchoolRank trở lên.",
    scoreFormula: "Điểm xét tuyển = Điểm Môn 1 + Điểm Môn 2 + Điểm Môn 3 + Điểm ưu tiên (nếu có)",
    requiredFields: ["highSchool", "grade10Gpa", "grade11Gpa", "grade12Gpa", "subjectScores"],
    requiredDocuments: [
      { type: "ACADEMIC_TRANSCRIPT", label: "Bản scan/ảnh chụp Học bạ THPT (đủ 3 năm)", required: true },
      { type: "GRADUATION_CERT", label: "Giấy chứng nhận tốt nghiệp THPT (tạm thời/chính thức)", required: true }
    ],
    combinations: ["A00", "A01", "D01", "D07"]
  },
  {
    id: "THPT_EXAM",
    code: "THPT",
    name: "Xét điểm thi Tốt nghiệp THPT",
    badge: "Chính quy Bộ GD&ĐT",
    badgeColor: "#2563EB",
    icon: "FileCheck",
    status: "OPEN",
    description: "Xét tuyển bằng tổng điểm 3 môn thi tốt nghiệp THPT theo tổ hợp môn đăng ký tương ứng với ngành học.",
    criteria: "Tổng điểm 3 môn thi tốt nghiệp THPT đạt ngưỡng đảm bảo chất lượng đầu vào của Trường ĐH FPT (từ 21.0 điểm trở lên).",
    scoreFormula: "Điểm xét tuyển = Điểm Môn thi 1 + Điểm Môn thi 2 + Điểm Môn thi 3 + Điểm ưu tiên",
    requiredFields: ["sbd", "examYear", "examCouncil", "thptSubjectScores"],
    requiredDocuments: [
      { type: "THPT_EXAM_CERT", label: "Giấy chứng nhận kết quả thi Tốt nghiệp THPT", required: true },
      { type: "GRADUATION_CERT", label: "Bằng hoặc Giấy CNTN THPT", required: true }
    ],
    combinations: ["A00", "A01", "D01", "D07", "C00", "B00"]
  },
  {
    id: "DGNL_EXAM",
    code: "DGNL",
    name: "Xét điểm thi Đánh giá Năng lực (ĐGNL)",
    badge: "ĐHQG HN & HCM",
    badgeColor: "#7C3AED",
    icon: "Brain",
    status: "OPEN",
    description: "Dành cho thí sinh tham gia kỳ thi Đánh giá năng lực của ĐHQG Hà Nội (HSA) hoặc ĐHQG TP.HCM (APT) hoặc ĐH Sư phạm Hà Nội.",
    criteria: "HSA ĐHQG HN đạt từ 90/150 điểm; APT ĐHQG TP.HCM đạt từ 750/1200 điểm.",
    scoreFormula: "Điểm quy đổi = (Điểm thi ĐGNL / Tổng điểm kỳ thi) * 30 + Điểm ưu tiên",
    requiredFields: ["dgnlExamProvider", "dgnlExamYear", "dgnlExamRollNo", "dgnlScore"],
    requiredDocuments: [
      { type: "DGNL_CERT", label: "Phiếu điểm kết quả thi Đánh giá Năng lực", required: true }
    ]
  },
  {
    id: "INTERNATIONAL_CERT",
    code: "QUOC_TE",
    name: "Xét Chứng chỉ Quốc tế (IELTS/SAT/TOEFL)",
    badge: "Ưu tiên tuyển thẳng",
    badgeColor: "#059669",
    icon: "Globe",
    status: "OPEN",
    description: "Xét tuyển kết hợp chứng chỉ ngoại ngữ quốc tế (IELTS từ 6.0, TOEFL iBT từ 60, SAT từ 1100, ACT từ 22) cùng điểm học tập THPT.",
    criteria: "IELTS Academic >= 6.0 (hoặc TOEFL iBT >= 60, SAT >= 1100) và tốt nghiệp THPT.",
    scoreFormula: "Điểm xét tuyển = Điểm quy đổi chứng chỉ (tối đa 30đ) + Điểm ưu tiên",
    requiredFields: ["certType", "certScore", "certIssueDate", "certExpiryDate", "certProvider"],
    requiredDocuments: [
      { type: "INTERNATIONAL_CERT_FILE", label: "Bản sao chứng chỉ quốc tế (IELTS/SAT/TOEFL)", required: true },
      { type: "ACADEMIC_TRANSCRIPT", label: "Học bạ THPT minh chứng", required: true }
    ]
  },
  {
    id: "ACHIEVEMENT",
    code: "THANH_TICH",
    name: "Xét Tuyển Thành tích & Năng khiếu",
    badge: "Học bổng Tài năng",
    badgeColor: "#D97706",
    icon: "Award",
    status: "OPEN",
    description: "Dành cho học sinh đạt giải Học sinh giỏi cấp Quốc gia, Cấp Tỉnh/Thành phố, Olympic, Cuộc thi Khoa học Kỹ thuật (ViSEF), Thể thao & Nghệ thuật.",
    criteria: "Đạt giải Nhất, Nhì, Ba, Khuyến khích cấp Tỉnh/Quốc gia hoặc thành tích thể thao/nghệ thuật được công nhận.",
    scoreFormula: "Xét duyệt hồ sơ trực tiếp + Cộng điểm học bổng tài năng từ 30% đến 100%",
    requiredFields: ["achievementName", "achievementType", "achievementLevel", "achievementAward", "achievementYear"],
    requiredDocuments: [
      { type: "ACHIEVEMENT_PROOF", label: "Giấy khen/Bằng chứng nhận giải thưởng thành tích", required: true }
    ]
  },
  {
    id: "DIRECT_ADMISSION",
    code: "TUYEN_THANG",
    name: "Tuyển thẳng theo Quy chế Bộ & Trường",
    badge: "Đặc cách",
    badgeColor: "#DC2626",
    icon: "Zap",
    status: "OPEN",
    description: "Thí sinh thuộc diện tuyển thẳng theo quy chế của Bộ GD&ĐT (đội tuyển Olympic quốc tế, giải KHKT quốc tế, huyện nghèo diện 30a).",
    criteria: "Thuộc danh sách thí sinh được tuyển thẳng theo quy định hiện hành của Bộ GD&ĐT.",
    scoreFormula: "Tuyển thẳng trực tiếp vào ngành học đăng ký",
    requiredFields: ["directAdmissionCategory", "directAdmissionReason"],
    requiredDocuments: [
      { type: "DIRECT_ADMISSION_FILE", label: "Giấy tờ chứng minh diện tuyển thẳng", required: true }
    ]
  },
  {
    id: "COMBINED",
    code: "KET_HOP",
    name: "Phương thức Kết hợp Đa minh chứng",
    badge: "Linh hoạt",
    badgeColor: "#0284C7",
    icon: "Layers",
    status: "OPEN",
    description: "Kết hợp điểm học bạ THPT với chứng chỉ quốc tế và thành tích cá nhân để tối ưu hóa cơ hội trúng tuyển và xét học bổng.",
    criteria: "Học lực THPT Khá trở lên kết hợp có chứng chỉ hoặc giải thưởng.",
    scoreFormula: "Điểm tổng hợp = 50% Điểm Học bạ + 30% Chứng chỉ + 20% Điểm Năng khiếu/Phỏng vấn",
    requiredFields: ["grade12Gpa", "certType", "certScore", "subjectScores"],
    requiredDocuments: [
      { type: "ACADEMIC_TRANSCRIPT", label: "Bản scan Học bạ THPT", required: true },
      { type: "INTERNATIONAL_CERT_FILE", label: "Chứng chỉ quốc tế (nếu có)", required: false },
      { type: "ACHIEVEMENT_PROOF", label: "Minh chứng thành tích (nếu có)", required: false }
    ]
  }
];

export const SUBJECT_COMBINATIONS = [
  { code: "A00", name: "Toán, Vật lý, Hóa học", subjects: ["math", "physics", "chemistry"] },
  { code: "A01", name: "Toán, Vật lý, Tiếng Anh", subjects: ["math", "physics", "english"] },
  { code: "D01", name: "Toán, Ngữ văn, Tiếng Anh", subjects: ["math", "literature", "english"] },
  { code: "D07", name: "Toán, Hóa học, Tiếng Anh", subjects: ["math", "chemistry", "english"] },
  { code: "C00", name: "Ngữ văn, Lịch sử, Địa lý", subjects: ["literature", "history", "geography"] },
  { code: "B00", name: "Toán, Hóa học, Sinh học", subjects: ["math", "chemistry", "biology"] },
  { code: "D09", name: "Toán, Lịch sử, Tiếng Anh", subjects: ["math", "history", "english"] },
  { code: "D14", name: "Ngữ văn, Lịch sử, Tiếng Anh", subjects: ["literature", "history", "english"] },
  { code: "H00", name: "Ngữ văn, Năng khiếu Vẽ 1, Năng khiếu Vẽ 2", subjects: ["literature", "drawing1", "drawing2"] },
  { code: "V00", name: "Toán, Vật lý, Vẽ mỹ thuật", subjects: ["math", "physics", "drawing1"] }
];

export const PRIORITY_AREAS = [
  { code: "KV1", name: "Khu vực 1 (KV1) - Vùng sâu, vùng xa, hải đảo", bonus: 0.75 },
  { code: "KV2_NT", name: "Khu vực 2 Nông thôn (KV2-NT)", bonus: 0.5 },
  { code: "KV2", name: "Khu vực 2 (KV2) - Thị xã, thành phố trực thuộc tỉnh", bonus: 0.25 },
  { code: "KV3", name: "Khu vực 3 (KV3) - Quận nội thành các thành phố lớn", bonus: 0.0 }
];

export const PRIORITY_OBJECTS = [
  { code: "NONE", name: "Không thuộc đối tượng ưu tiên", bonus: 0.0 },
  { code: "DT01", name: "Đối tượng 01: Công dân Việt Nam là người dân tộc thiểu số", bonus: 2.0 },
  { code: "DT02", name: "Đối tượng 02: Công nhân trực tiếp sản xuất...", bonus: 2.0 },
  { code: "DT03", name: "Đối tượng 03: Thương binh, người có công với cách mạng", bonus: 2.0 },
  { code: "DT04", name: "Đối tượng 04: Con liệt sĩ, con thương binh suy giảm KNLĐ >= 81%", bonus: 2.0 },
  { code: "DT05", name: "Đối tượng 05: Thanh niên xung phong, quân nhân hoàn thành nghĩa vụ", bonus: 1.0 },
  { code: "DT06", name: "Đối tượng 06: Con thương binh suy giảm KNLĐ < 81%", bonus: 1.0 },
  { code: "DT07", name: "Đối tượng 07: Người khuyết tật nặng", bonus: 1.0 }
];

export const PROVINCES_LIST = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng",
  "Bình Định", "Khánh Hòa", "Quảng Nam", "Thừa Thiên Huế", "Nghệ An",
  "Thanh Hóa", "Quảng Ninh", "Bắc Ninh", "Hải Dương", "Nam Định",
  "Thái Nguyên", "Vĩnh Phúc", "Bình Dương", "Đồng Nai", "Bà Rịa - Vũng Tàu",
  "Long An", "Tiền Giang", "An Giang", "Kiên Giang", "Đắk Lắk",
  "Lâm Đồng", "Gia Lai", "Phú Thọ", "Hà Nam", "Ninh Bình",
  "Bắc Giang", "Hưng Yên", "Sơn La", "Hòa Bình", "Lào Cai"
];
