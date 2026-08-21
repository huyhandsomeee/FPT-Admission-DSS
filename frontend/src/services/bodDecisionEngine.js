// bodDecisionEngine.js - Enterprise Decision Support & Operations Engine for FPT University BOD
// Implements End-to-End Decision State Machine, Multi-Department Workflow Tasks, SLA Tracking, Risk Escalations, Audit Logging

const STORAGE_PROPOSALS = "fpt_bod_proposals_v3";
const STORAGE_DECISIONS = "fpt_bod_decisions_v3";
const STORAGE_TASKS = "fpt_bod_tasks_v3";
const STORAGE_RISKS = "fpt_bod_risks_v3";
const STORAGE_NOTIFS = "fpt_bod_notifications_v3";
const STORAGE_AUDIT = "fpt_bod_audit_v3";
const STORAGE_KPIS = "fpt_bod_kpis_v3";

/* ── Initial Seed Data ── */
export const INITIAL_PROPOSALS = [
  {
    id: "PROP-2026-001",
    decisionId: "DEC-2026-00124",
    title: "Tăng ngân sách Digital Marketing khu vực Miền Tây",
    department: "Ban Tuyển sinh & Marketing",
    proposedBy: "Nguyễn Văn An (Trưởng Ban Tuyển sinh)",
    category: "Marketing / Tuyển sinh",
    priority: "HIGH",
    currentBudget: 8000000000, // 8 Tỷ
    proposedBudget: 8800000000, // 8.8 Tỷ
    budgetDelta: 800000000, // +800 Triệu
    currency: "VND",
    deadline: "2026-08-25",
    urgency: "Hôm nay",
    status: "WAITING_APPROVAL", // WAITING_APPROVAL, APPROVED, CONDITIONAL_APPROVED, REJECTED, REQUEST_MORE_INFO, IN_PROGRESS, COMPLETED
    reason: "Tỷ lệ chuyển đổi Admit → Enrolled tại khu vực Miền Tây (Cần Thơ, An Giang, Cà Mau) giảm 8.2% do cạnh tranh gia tăng.",
    impacts: {
      leads: "+15% (dự kiến +1,800 leads)",
      applicants: "+8% (+320 hồ sơ xét tuyển)",
      enrollment: "+5% (+150 tân sinh viên)",
      revenue: "+4.2 Tỷ VND",
      roi: "3.1x",
      riskLevel: "Medium"
    },
    decisionScore: {
      strategic: 9,
      financial: 8,
      enrollment: 9,
      risk: 3,
      urgency: 8,
      overall: 8.4,
      aiConfidence: 87
    },
    aiRecommendation: {
      status: "SHOULD_APPROVE",
      headline: "NÊN PHÊ DUYỆT CÓ ĐIỀU KIỆN",
      evidence: [
        "CAC (Chi phí mỗi hồ sơ) kênh TikTok Miền Tây thấp hơn 22% so với Facebook",
        "Chỉ tiêu Campus Cần Thơ mới đạt 68% sau đợt 1",
        "ROI dự kiến đạt 3.1x, hoàn vốn sau 4 tháng"
      ],
      suggestedConditions: "Yêu cầu Finance đối soát nguồn tiền sau mỗi tuần và giữ trần CPA dưới 450.000đ/lead."
    },
    createdDate: "2026-08-19 09:30",
    workflowTasks: ["TASK-001", "TASK-002", "TASK-003", "TASK-004"]
  },
  {
    id: "PROP-2026-002",
    decisionId: "DEC-2026-00125",
    title: "Tăng 200 suất học bổng FPT Talent cho khối ngành Trí tuệ Nhân tạo (AI)",
    department: "Ban Tuyển sinh",
    proposedBy: "Trần Thị Mai (Phó Giám đốc Tuyển sinh)",
    category: "Học bổng & Chỉ tiêu",
    priority: "HIGH",
    currentBudget: 42000000000,
    proposedBudget: 44500000000,
    budgetDelta: 2500000000, // +2.5 Tỷ
    currency: "VND",
    deadline: "2026-08-22",
    urgency: "Khẩn cấp",
    status: "WAITING_APPROVAL",
    reason: "Nhu cầu thị trường nhân lực AI tăng 35%, số lượng thí sinh có điểm SAT > 1350 và giải quốc gia ứng tuyển vào FPT tăng đột biến 40%.",
    impacts: {
      leads: "+25%",
      applicants: "+18%",
      enrollment: "+12% (+200 SV chất lượng cao)",
      revenue: "+8.5 Tỷ VND (chu kỳ 4 năm)",
      roi: "3.4x",
      riskLevel: "Low"
    },
    decisionScore: {
      strategic: 10,
      financial: 8,
      enrollment: 9,
      risk: 2,
      urgency: 9,
      overall: 8.9,
      aiConfidence: 93
    },
    aiRecommendation: {
      status: "STRONGLY_APPROVE",
      headline: "KHUYẾN NGHỊ PHÊ DUYỆT NGAY",
      evidence: [
        "Thí sinh Top 10% SchoolRank có tỷ lệ chấp nhận nhập học 89% khi nhận học bổng từ 50%",
        "Nâng cao chỉ số chất lượng đầu vào của Đại học FPT trên bảng xếp hạng QS",
        "Đối thủ cạnh tranh trực tiếp vừa tung gói học bổng 2 Tỷ cho ngành AI"
      ]
    },
    createdDate: "2026-08-19 10:15",
    workflowTasks: ["TASK-005", "TASK-006", "TASK-007"]
  },
  {
    id: "PROP-2026-003",
    decisionId: "DEC-2026-00126",
    title: "Đề xuất mở mới chuyên ngành Công nghệ Bán dẫn & Vi mạch (Semiconductor)",
    department: "Ban Đào tạo & Viện Nghiên cứu",
    proposedBy: "PGS.TS Lê Hải Bằng (Trưởng Ban Đào tạo)",
    category: "Mở ngành mới",
    priority: "MEDIUM",
    currentBudget: 0,
    proposedBudget: 15000000000, // 15 Tỷ CAPEX + OPEX
    budgetDelta: 15000000000,
    currency: "VND",
    deadline: "2026-08-30",
    urgency: "Trong tháng",
    status: "WAITING_APPROVAL",
    reason: "Chiến lược quốc gia về phát triển 50.000 kỹ sư vi mạch đến năm 2030, cơ hội hợp tác trực tiếp với các tập đoàn bán dẫn tại Khu CNC Hòa Lạc & TP.HCM.",
    impacts: {
      leads: "+3,500 leads năm đầu",
      applicants: "+600 hồ sơ",
      enrollment: "350 SV K21 (2 cơ sở HN & HCM)",
      revenue: "+22 Tỷ VND/năm",
      roi: "2.8x (Break-even sau 2.5 năm)",
      riskLevel: "Medium"
    },
    decisionScore: {
      strategic: 10,
      financial: 7,
      enrollment: 8,
      risk: 5,
      urgency: 7,
      overall: 8.1,
      aiConfidence: 89
    },
    aiRecommendation: {
      status: "APPROVE_WITH_FACULTY_CONDITIONS",
      headline: "PHÊ DUYỆT KÈM ĐIỀU KIỆN NHÂN SỰ",
      evidence: [
        "FPT Software & FPT Semiconductor đã cam kết bảo trợ 200 suất thực tập/năm",
        "Cần tuyển bổ sung tối thiểu 4 Tiến sĩ chuyên ngành vật lý chất rắn / thiết kế vi mạch trước Q1/2027",
        "Vốn đầu tư phòng Lab Cleanroom cần chia làm 2 giai đoạn"
      ]
    },
    createdDate: "2026-08-18 14:00",
    workflowTasks: ["TASK-008", "TASK-009", "TASK-010", "TASK-011"]
  },
  {
    id: "PROP-2026-004",
    decisionId: "DEC-2026-00127",
    title: "Điều chuyển 300 chỉ tiêu tuyển sinh từ Ngành Tài chính sang Ngành Trí tuệ Nhân tạo",
    department: "Ban Tuyển sinh",
    proposedBy: "Nguyễn Văn An (Trưởng Ban Tuyển sinh)",
    category: "Điều chỉnh chỉ tiêu",
    priority: "HIGH",
    currentBudget: 0,
    proposedBudget: 0,
    budgetDelta: 0,
    currency: "VND",
    deadline: "2026-08-21",
    urgency: "Khẩn cấp",
    status: "WAITING_APPROVAL",
    reason: "Nguyện vọng ngành Tài chính giảm 12%, trong khi nguyện vọng 1 ngành AI vượt chỉ tiêu 185%. Cần cân đối để tối ưu hóa tỷ lệ nhập học thực tế.",
    impacts: {
      leads: "Không đổi",
      applicants: "+180 hồ sơ",
      enrollment: "+280 SV nhập học thực tế",
      revenue: "+6.8 Tỷ VND",
      roi: "Vô hạn (Không tăng chi phí)",
      riskLevel: "Low"
    },
    decisionScore: {
      strategic: 9,
      financial: 9,
      enrollment: 10,
      risk: 1,
      urgency: 9,
      overall: 9.2,
      aiConfidence: 96
    },
    aiRecommendation: {
      status: "STRONGLY_APPROVE",
      headline: "PHÊ DUYỆT NGAY - TỐI ƯU HÓA CAPACITIES",
      evidence: [
        "Khoa CNTT có đủ giảng viên và phòng thực hành đáp ứng thêm 300 SV",
        "Tránh lãng phí chỉ tiêu Bộ GD&ĐT cấp cho năm học 2026"
      ]
    },
    createdDate: "2026-08-19 11:00",
    workflowTasks: ["TASK-012", "TASK-013"]
  },
  {
    id: "PROP-2026-005",
    decisionId: "DEC-2026-00120",
    title: "Phê duyệt gói đầu tư hạ tầng AI Supercomputing Lab tại Campus Hòa Lạc",
    department: "Phòng Cơ sở Vật chất & IT",
    proposedBy: "Phạm Quốc Hùng (Trưởng phòng IT)",
    category: "Đầu tư / CAPEX",
    priority: "MEDIUM",
    currentBudget: 12000000000,
    proposedBudget: 18500000000,
    budgetDelta: 6500000000, // +6.5 Tỷ
    currency: "VND",
    deadline: "2026-08-28",
    urgency: "Tuần này",
    status: "APPROVED",
    reason: "Trang bị cụm 16 máy chủ NVIDIA H100 phục vụ đào tạo cao học, nghiên cứu sinh và thực hành mô hình AI tạo sinh cho sinh viên K21.",
    impacts: {
      leads: "+20% thương hiệu",
      applicants: "+150 SV cao học",
      enrollment: "+350 SV ngành AI",
      revenue: "+14 Tỷ VND",
      roi: "2.1x",
      riskLevel: "Low"
    },
    decisionScore: {
      strategic: 10,
      financial: 7,
      enrollment: 8,
      risk: 2,
      urgency: 7,
      overall: 8.3,
      aiConfidence: 91
    },
    aiRecommendation: {
      status: "APPROVED",
      headline: "ĐÃ PHÊ DUYỆT - ĐANG TRIỂN KHAI"
    },
    createdDate: "2026-08-16 08:30",
    workflowTasks: ["TASK-014", "TASK-015"]
  }
];

export const INITIAL_TASKS = [
  {
    id: "TASK-001",
    decisionId: "DEC-2026-00124",
    title: "Kiểm tra dự toán ngân sách Q3 & xác nhận giải ngân 800 triệu",
    department: "Ban Tài chính",
    assignee: "Nguyễn Thị Phương (Kế toán trưởng)",
    priority: "CRITICAL",
    deadline: "2026-08-20 17:00",
    slaRemaining: "4h 22m",
    isOverdue: false,
    status: "IN_PROGRESS", // PENDING, IN_PROGRESS, REVIEW, COMPLETED, OVERDUE, ESCALATED
    checklists: [
      { text: "Đối soát hạn mức dự phòng Marketing Q3", done: true },
      { text: "Ký duyệt ủy nhiệm chi bổ sung 800 triệu", done: false }
    ],
    notes: "Nguồn tiền trích từ quỹ dự phòng tăng trưởng tuyển sinh 2026."
  },
  {
    id: "TASK-002",
    decisionId: "DEC-2026-00124",
    title: "Tái phân bổ ngân sách 800M cho các chiến dịch TikTok & Meta Ads Cần Thơ",
    department: "Phòng Marketing",
    assignee: "Lê Hoàng Long (Lead Digital MKT)",
    priority: "HIGH",
    deadline: "2026-08-21 12:00",
    slaRemaining: "23h 10m",
    isOverdue: false,
    status: "IN_PROGRESS",
    checklists: [
      { text: "Tạo chiến dịch TikTok Ads nhắm học sinh lớp 12 ĐBSCL", done: true },
      { text: "Thiết lập UTM Tagging theo dõi tỷ lệ chuyển đổi CRM", done: false },
      { text: "Phối hợp với KOC sinh viên Cần Thơ quay video trải nghiệm", done: false }
    ],
    notes: "Tập trung video giới thiệu học bổng và cơ hội việc làm ngành CNTT & Kinh tế số."
  },
  {
    id: "TASK-003",
    decisionId: "DEC-2026-00124",
    title: "Cập nhật chỉ tiêu Leads và tăng cường 5 nhân sự Telesales phụ trách Miền Tây",
    department: "Ban Tuyển sinh",
    assignee: "Vũ Đình Trọng (Trưởng nhóm Tư vấn Miền Tây)",
    priority: "HIGH",
    deadline: "2026-08-22 17:00",
    slaRemaining: "2 ngày 6h",
    isOverdue: false,
    status: "PENDING",
    checklists: [
      { text: "Phân bổ 1,800 leads mới cho danh sách 12 tư vấn viên", done: false },
      { text: "Tổ chức gọi điện tư vấn trực tiếp 1-1 cho phụ huynh", done: false }
    ],
    notes: "Đảm bảo thời gian phản hồi liên hệ lại phụ huynh dưới 15 phút sau khi đăng ký."
  },
  {
    id: "TASK-004",
    decisionId: "DEC-2026-00124",
    title: "Thiết lập Dashboard theo dõi Conversion Funnel & ROI chiến dịch Miền Tây",
    department: "Phòng IT & Data BI",
    assignee: "Trần Minh Quang (Data Architect)",
    priority: "MEDIUM",
    deadline: "2026-08-21 18:00",
    slaRemaining: "1 ngày 5h",
    isOverdue: false,
    status: "COMPLETED",
    checklists: [
      { text: "Kết nối Google Ads & TikTok API vào Data Warehouse", done: true },
      { text: "Xây dựng biểu đồ Waterfall Lead -> Applicant -> Enrolled", done: true }
    ],
    notes: "Dữ liệu được cập nhật tự động 15 phút/lần."
  },
  {
    id: "TASK-005",
    decisionId: "DEC-2026-00125",
    title: "Cập nhật quy chế xét duyệt 200 suất học bổng FPT Talent ngành AI",
    department: "Ban Tuyển sinh",
    assignee: "Nguyễn Văn An (Trưởng Ban Tuyển sinh)",
    priority: "HIGH",
    deadline: "2026-08-20 10:00",
    slaRemaining: "OVERDUE 2h 15m",
    isOverdue: true,
    status: "ESCALATED",
    checklists: [
      { text: "Bổ sung tiêu chí SAT > 1350 và giải Olympic Tin học", done: true },
      { text: "Gửi thông cáo báo chí và đăng tải cổng thông tin tuyển sinh", done: false }
    ],
    notes: "BOD đã phát cảnh báo đốc thúc do quá hạn SLA."
  }
];

export const INITIAL_RISKS = [
  {
    id: "RISK-00124",
    category: "Tuyển sinh & Chất lượng hồ sơ",
    title: "Tỷ lệ hồ sơ ảo khu vực Miền Tây tăng 15.2%",
    severity: "HIGH", // CRITICAL, HIGH, MEDIUM, LOW
    probability: 82, // %
    impactLevel: "HIGH",
    financialImpact: "-3.6 Tỷ VND (doanh thu học phí)",
    enrollmentImpact: "-140 Sinh viên nhập học",
    owner: "Ban Tuyển sinh (Vũ Đình Trọng)",
    department: "Ban Tuyển sinh",
    detectedAt: "2026-08-19 07:30",
    slaRemaining: "4h 22m",
    status: "ACTION_REQUIRED", // OPEN, INVESTIGATING, ACTION_REQUIRED, MITIGATED, CLOSED
    reason: "Thí sinh nộp hồ sơ đồng thời vào nhiều trường công lập tại Cần Thơ do chính sách xét tuyển sớm.",
    recommendedAction: "Tăng cường xác minh hồ sơ học bạ, yêu cầu nộp xác nhận nhập học bản cứng và cấp học bổng giữ chân thí sinh Top 30% SchoolRank.",
    linkedDecisionId: "DEC-2026-00124"
  },
  {
    id: "RISK-00125",
    category: "Marketing & Chi phí",
    title: "Chi phí chuyển đổi (CAC) kênh Google Ads vượt trần ngân sách 28%",
    severity: "HIGH",
    probability: 76,
    impactLevel: "MEDIUM",
    financialImpact: "-1.2 Tỷ VND chi phí phát sinh",
    enrollmentImpact: "Giảm 5% hiệu quả chiến dịch",
    owner: "Phòng Marketing (Lê Hoàng Long)",
    department: "Phòng Marketing",
    detectedAt: "2026-08-18 16:00",
    slaRemaining: "8h 15m",
    status: "INVESTIGATING",
    reason: "Giá thầu từ khóa ngành CNTT và Quản trị kinh doanh trên Google Search tăng mạnh do các trường đại học đồng loạt đẩy mạnh chạy ads.",
    recommendedAction: "Cắt giảm 30% ngân sách từ khóa tìm kiếm chung, chuyển trọng tâm sang kênh TikTok Video, SEO tự nhiên và sự kiện Open Day tại các trường THPT.",
    linkedDecisionId: null
  },
  {
    id: "RISK-00126",
    category: "Đào tạo & Nhân lực Giảng viên",
    title: "Thiếu hụt 4 Tiến sĩ đầu ngành chuyên sâu Vi mạch & Bán dẫn cho K21",
    severity: "CRITICAL",
    probability: 88,
    impactLevel: "HIGH",
    financialImpact: "Nguy cơ chậm tiến độ cấp phép mở ngành",
    enrollmentImpact: "Ảnh hưởng 350 chỉ tiêu ngành mới",
    owner: "Ban Đào tạo & Phòng Nhân sự",
    department: "Phòng Nhân sự",
    detectedAt: "2026-08-17 11:00",
    slaRemaining: "1 ngày 4h",
    status: "OPEN",
    reason: "Thị trường nhân lực bán dẫn trong nước khan hiếm, mức lương cạnh tranh cao với các tập đoàn nước ngoài.",
    recommendedAction: "Ký thỏa thuận chia sẻ giảng viên kiêm nhiệm với Viện Bán Dẫn Quốc Tế và FPT Semiconductor, đồng thời cấp gói thu hút nhân tài 1 Tỷ/Tiến sĩ.",
    linkedDecisionId: "DEC-2026-00126"
  },
  {
    id: "RISK-00127",
    category: "Cơ sở vật chất & Hạ tầng",
    title: "Tiến độ thi công phòng Lab GPU AI Campus Hòa Lạc chậm 10 ngày",
    severity: "MEDIUM",
    probability: 60,
    impactLevel: "MEDIUM",
    financialImpact: "-400 Triệu phí phạt hợp đồng",
    enrollmentImpact: "Ảnh hưởng trải nghiệm tham quan Open Day",
    owner: "Phòng Cơ sở Vật chất (Hoàng Văn Hải)",
    department: "Phòng CSVC",
    detectedAt: "2026-08-16 09:00",
    slaRemaining: "OVERDUE 2h 15m",
    status: "ACTION_REQUIRED",
    reason: "Nhà thầu gặp chậm trễ trong khâu nhập khẩu thiết bị tản nhiệt máy chủ.",
    recommendedAction: "BOD phát chỉ thị đốc thúc nhà thầu tăng ca 3 ca/ngày và điều động tổ giám sát công trình trực tiếp 24/7.",
    linkedDecisionId: "DEC-2026-00120"
  }
];

export const INITIAL_DEPARTMENT_SLA = [
  {
    id: "dept_admission",
    name: "Ban Tuyển sinh",
    totalRequests: 4250,
    processed: 4180,
    pending: 70,
    overdue: 8,
    avgResponseHours: "2.4h",
    slaRate: 98.3,
    lead: "Nguyễn Văn An",
    topBottleneck: "Xác minh văn bằng & Học bạ bản gốc trực tuyến",
    status: "GOOD"
  },
  {
    id: "dept_finance",
    name: "Ban Tài chính & Kế toán",
    totalRequests: 1890,
    processed: 1845,
    pending: 45,
    overdue: 4,
    avgResponseHours: "3.8h",
    slaRate: 97.6,
    lead: "Nguyễn Thị Phương",
    topBottleneck: "Đối soát tự động chuyển khoản học phí ngân hàng",
    status: "GOOD"
  },
  {
    id: "dept_marketing",
    name: "Phòng Marketing & Truyền thông",
    totalRequests: 820,
    processed: 790,
    pending: 30,
    overdue: 12,
    avgResponseHours: "5.2h",
    slaRate: 96.3,
    lead: "Lê Hoàng Long",
    topBottleneck: "Phê duyệt Creative Ads & duyệt bài viết báo chí",
    status: "WARNING"
  },
  {
    id: "dept_academic",
    name: "Ban Đào tạo & Khảo thí",
    totalRequests: 2150,
    processed: 2090,
    pending: 60,
    overdue: 6,
    avgResponseHours: "4.1h",
    slaRate: 97.2,
    lead: "PGS.TS Lê Hải Bằng",
    topBottleneck: "Xếp lịch hội đồng phỏng vấn học bổng Talent",
    status: "GOOD"
  },
  {
    id: "dept_it",
    name: "Phòng IT & Data Warehouse",
    totalRequests: 950,
    processed: 942,
    pending: 8,
    overdue: 1,
    avgResponseHours: "1.2h",
    slaRate: 99.1,
    lead: "Trần Minh Quang",
    topBottleneck: "Đồng bộ API cổng dữ liệu tuyển sinh Bộ GD&ĐT",
    status: "EXCELLENT"
  },
  {
    id: "dept_hr",
    name: "Phòng Nhân sự & Giảng viên",
    totalRequests: 640,
    processed: 590,
    pending: 50,
    overdue: 15,
    avgResponseHours: "8.6h",
    slaRate: 92.1,
    lead: "Trịnh Hoài Nam",
    topBottleneck: "Tuyển dụng giảng viên Tiến sĩ ngành AI & Vi mạch",
    status: "CRITICAL"
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-001",
    type: "APPROVAL_REQUIRED",
    severity: "HIGH",
    title: "Đề xuất cần BOD phê duyệt",
    content: "Đề xuất Tăng ngân sách Digital Miền Tây (+800M) đang chờ ý kiến phê duyệt của Ban Giám Hiệu.",
    timestamp: "10 phút trước",
    isRead: false,
    targetType: "proposal",
    targetId: "PROP-2026-001"
  },
  {
    id: "NOTIF-002",
    type: "RISK_HIGH",
    severity: "CRITICAL",
    title: "Cảnh báo Rủi ro Tuyển sinh Nghiêm trọng",
    content: "Tỷ lệ hồ sơ ảo khu vực Miền Tây tăng 15.2%. Cần chỉ đạo giải pháp giữ chân thí sinh.",
    timestamp: "35 phút trước",
    isRead: false,
    targetType: "risk",
    targetId: "RISK-00124"
  },
  {
    id: "NOTIF-003",
    type: "TASK_OVERDUE",
    severity: "HIGH",
    title: "Nhiệm vụ quá hạn SLA",
    content: "Ban Tuyển sinh có nhiệm vụ Cập nhật quy chế học bổng AI bị quá hạn SLA 2h 15m.",
    timestamp: "1 giờ trước",
    isRead: false,
    targetType: "task",
    targetId: "TASK-005"
  },
  {
    id: "NOTIF-004",
    type: "DECISION_COMPLETED",
    severity: "LOW",
    title: "Quyết định đã hoàn thành nhiệm vụ",
    content: "Quyết định DEC-2026-00120 (Hạ tầng AI Lab Hòa Lạc) đã hoàn tất mua sắm thiết bị giai đoạn 1.",
    timestamp: "3 giờ trước",
    isRead: true,
    targetType: "decision",
    targetId: "DEC-2026-00120"
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: "AUD-1001",
    timestamp: "2026-08-19 11:30:15",
    actor: "Ban Giám Hiệu (TS. Hoàng Việt Hà)",
    role: "BOD Executive",
    action: "PHÊ DUYỆT QUYẾT ĐỊNH",
    target: "DEC-2026-00120: Gói đầu tư AI Supercomputing Lab Hòa Lạc",
    beforeValue: "Trạng thái: WAITING_APPROVAL | Ngân sách: 12 Tỷ",
    afterValue: "Trạng thái: APPROVED | Ngân sách: 18.5 Tỷ (+6.5 Tỷ)",
    reason: "Cung cấp hạ tầng nghiên cứu trọng điểm cho khối ngành AI và đào tạo sau đại học.",
    ipAddress: "192.168.1.104 (FPT Edu Intranet)"
  },
  {
    id: "AUD-1002",
    timestamp: "2026-08-19 10:45:00",
    actor: "Nguyễn Thị Phương (Kế toán trưởng)",
    role: "Finance Lead",
    action: "THẨM ĐỊNH NGÂN SÁCH",
    target: "PROP-2026-001: Ngân sách Digital Marketing Miền Tây",
    beforeValue: "Chưa thẩm định",
    afterValue: "Xác nhận đủ nguồn tiền dự phòng Q3 (800 Triệu)",
    reason: "Đối soát kế hoạch tài chính đã duyệt đầu năm của Ban Tuyển sinh.",
    ipAddress: "192.168.1.118"
  },
  {
    id: "AUD-1003",
    timestamp: "2026-08-19 09:30:20",
    actor: "Nguyễn Văn An (Trưởng Ban Tuyển sinh)",
    role: "Admission Lead",
    action: "TẠO ĐỀ XUẤT MỚI",
    target: "PROP-2026-001",
    beforeValue: "DRAFT",
    afterValue: "SUBMITTED",
    reason: "Ứng phó với tỷ lệ trúng tuyển ảo và cạnh tranh tuyển sinh tại ĐBSCL.",
    ipAddress: "192.168.2.45"
  }
];

/* ── Helper Storage Functions ── */
function loadStorage(key, defaultData) {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn("Storage load error:", e);
  }
  return defaultData;
}

function saveStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage save error:", e);
  }
}

/* ── BOD Decision Engine Class / Service ── */
class BODDecisionEngine {
  constructor() {
    this.proposals = loadStorage(STORAGE_PROPOSALS, INITIAL_PROPOSALS);
    this.tasks = loadStorage(STORAGE_TASKS, INITIAL_TASKS);
    this.risks = loadStorage(STORAGE_RISKS, INITIAL_RISKS);
    this.notifications = loadStorage(STORAGE_NOTIFS, INITIAL_NOTIFICATIONS);
    this.auditLogs = loadStorage(STORAGE_AUDIT, INITIAL_AUDIT_LOGS);
  }

  // Getters
  getProposals() { return [...this.proposals]; }
  getProposalById(id) { return this.proposals.find(p => p.id === id || p.decisionId === id); }
  getTasks() { return [...this.tasks]; }
  getTasksByDecisionId(decId) { return this.tasks.filter(t => t.decisionId === decId); }
  getRisks() { return [...this.risks]; }
  getDepartmentSLAs() { return INITIAL_DEPARTMENT_SLA; }
  getNotifications() { return [...this.notifications]; }
  getAuditLogs() { return [...this.auditLogs]; }

  // 1. Phê duyệt Đề xuất (Approve Proposal)
  approveProposal(proposalId, bodComment = "", isConditional = false, conditions = {}) {
    const proposalIndex = this.proposals.findIndex(p => p.id === proposalId || p.decisionId === proposalId);
    if (proposalIndex === -1) return { success: false, message: "Không tìm thấy đề xuất" };

    const prop = this.proposals[proposalIndex];
    const decisionId = prop.decisionId || `DEC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newStatus = isConditional ? "CONDITIONAL_APPROVED" : "APPROVED";

    // Cập nhật Proposal
    const updatedProp = {
      ...prop,
      status: newStatus,
      decisionId,
      bodComment,
      approvedAt: new Date().toISOString(),
      approvedBy: "Ban Giám Hiệu (BOD Executive)",
      conditions: isConditional ? conditions : null
    };
    this.proposals[proposalIndex] = updatedProp;
    saveStorage(STORAGE_PROPOSALS, this.proposals);

    // Tự động tạo 3-4 Tasks cho các phòng ban liên quan
    const newTasks = [
      {
        id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
        decisionId,
        title: `[${prop.department}] Triển khai thực thi: ${prop.title}`,
        department: prop.department.includes("Marketing") ? "Phòng Marketing" : prop.department,
        assignee: prop.proposedBy || "Trưởng bộ phận",
        priority: "HIGH",
        deadline: conditions.deadline || prop.deadline,
        slaRemaining: "48h 00m",
        isOverdue: false,
        status: "IN_PROGRESS",
        checklists: [
          { text: "Tiếp nhận quyết định phê duyệt của BOD", done: true },
          { text: "Lập kế hoạch phân bổ chi tiết", done: false },
          { text: "Báo cáo tiến độ sau tuần đầu tiên", done: false }
        ],
        notes: `Ý kiến chỉ đạo của BOD: ${bodComment || "Thực hiện đúng cam kết KPI và ngân sách."}`
      },
      {
        id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
        decisionId,
        title: `[Ban Tài chính] Đối soát ngân sách và giải ngân: ${prop.title}`,
        department: "Ban Tài chính",
        assignee: "Nguyễn Thị Phương (Kế toán trưởng)",
        priority: "CRITICAL",
        deadline: "2026-08-22 17:00",
        slaRemaining: "24h 00m",
        isOverdue: false,
        status: "IN_PROGRESS",
        checklists: [
          { text: `Kiểm tra hạn mức ngân sách bổ sung: ${prop.budgetDelta ? (prop.budgetDelta / 1e6) + " Triệu" : "Không phát sinh"}`, done: true },
          { text: "Ký duyệt giải ngân theo từng đợt", done: false }
        ],
        notes: "Chỉ giải ngân khi có báo cáo nghiệm thu trung gian."
      },
      {
        id: `TASK-${Math.floor(100 + Math.random() * 900)}`,
        decisionId,
        title: `[Data/BI] Giám sát realtime KPI & Hiệu quả ROI: ${prop.title}`,
        department: "Phòng IT & Data BI",
        assignee: "Trần Minh Quang (Data Architect)",
        priority: "MEDIUM",
        deadline: "2026-08-25 18:00",
        slaRemaining: "4 ngày",
        isOverdue: false,
        status: "IN_PROGRESS",
        checklists: [
          { text: "Gắn thẻ theo dõi Decision ID vào hệ thống DWH", done: true },
          { text: "Cập nhật biểu đồ theo dõi tác động lên tuyển sinh và doanh thu", done: false }
        ],
        notes: "Gửi báo cáo tự động cho BOD vào thứ Sáu hàng tuần."
      }
    ];

    this.tasks = [...newTasks, ...this.tasks];
    saveStorage(STORAGE_TASKS, this.tasks);

    // Ghi Audit Log
    const auditEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString("vi-VN"),
      actor: "Ban Giám Hiệu (BOD Executive)",
      role: "BOD",
      action: isConditional ? "PHÊ DUYỆT CÓ ĐIỀU KIỆN" : "PHÊ DUYỆT QUYẾT ĐỊNH",
      target: `${decisionId}: ${prop.title}`,
      beforeValue: `Trạng thái: ${prop.status}`,
      afterValue: `Trạng thái: ${newStatus} | Điều kiện: ${isConditional ? JSON.stringify(conditions) : "Không"}`,
      reason: bodComment || "Phê duyệt theo thẩm quyền Hội đồng Quản trị / Ban Giám Hiệu.",
      ipAddress: "192.168.1.100 (BOD Secure Session)"
    };
    this.auditLogs = [auditEntry, ...this.auditLogs];
    saveStorage(STORAGE_AUDIT, this.auditLogs);

    // Tạo Notification
    const notif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: "DECISION_COMPLETED",
      severity: "LOW",
      title: "Quyết định đã được phê duyệt",
      content: `BOD đã phê duyệt đề xuất: "${prop.title}". Quyết định ${decisionId} đã tự động giao việc cho Ban Tài chính, ${prop.department} và Data/BI.`,
      timestamp: "Vừa xong",
      isRead: false,
      targetType: "decision",
      targetId: decisionId
    };
    this.notifications = [notif, ...this.notifications];
    saveStorage(STORAGE_NOTIFS, this.notifications);

    return {
      success: true,
      decisionId,
      status: newStatus,
      tasksGenerated: newTasks.length,
      message: `Đã phê duyệt thành công quyết định ${decisionId}. Tự động tạo ${newTasks.length} nhiệm vụ liên phòng ban.`
    };
  }

  // 2. Từ chối Đề xuất (Reject Proposal)
  rejectProposal(proposalId, bodComment = "") {
    const proposalIndex = this.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) return { success: false, message: "Không tìm thấy đề xuất" };

    const prop = this.proposals[proposalIndex];
    this.proposals[proposalIndex] = {
      ...prop,
      status: "REJECTED",
      rejectedAt: new Date().toISOString(),
      bodComment
    };
    saveStorage(STORAGE_PROPOSALS, this.proposals);

    // Ghi Audit Log
    this.auditLogs.unshift({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString("vi-VN"),
      actor: "Ban Giám Hiệu (BOD Executive)",
      role: "BOD",
      action: "TỪ CHỐI ĐỀ XUẤT",
      target: `${prop.id}: ${prop.title}`,
      beforeValue: `Trạng thái: ${prop.status}`,
      afterValue: "Trạng thái: REJECTED",
      reason: bodComment || "Chưa phù hợp với định hướng tài chính và chỉ tiêu tuyển sinh hiện tại.",
      ipAddress: "192.168.1.100"
    });
    saveStorage(STORAGE_AUDIT, this.auditLogs);

    return { success: true, message: "Đã từ chối đề xuất và thông báo cho phòng ban đề xuất." };
  }

  // 3. Yêu cầu Bổ sung Thông tin (Request More Info)
  requestMoreInfo(proposalId, bodComment = "") {
    const proposalIndex = this.proposals.findIndex(p => p.id === proposalId);
    if (proposalIndex === -1) return { success: false, message: "Không tìm thấy đề xuất" };

    const prop = this.proposals[proposalIndex];
    this.proposals[proposalIndex] = {
      ...prop,
      status: "REQUEST_MORE_INFO",
      bodComment
    };
    saveStorage(STORAGE_PROPOSALS, this.proposals);

    this.auditLogs.unshift({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString("vi-VN"),
      actor: "Ban Giám Hiệu (BOD Executive)",
      role: "BOD",
      action: "YÊU CẦU BỔ SUNG THÔNG TIN",
      target: `${prop.id}: ${prop.title}`,
      beforeValue: `Trạng thái: ${prop.status}`,
      afterValue: "Trạng thái: REQUEST_MORE_INFO",
      reason: bodComment || "Cần làm rõ ROI và cam kết số lượng sinh viên nhập học.",
      ipAddress: "192.168.1.100"
    });
    saveStorage(STORAGE_AUDIT, this.auditLogs);

    return { success: true, message: "Đã gửi yêu cầu bổ sung thông tin tới phòng ban phụ trách." };
  }

  // 4. Tạo Quyết định từ Mô phỏng What-If (Create Proposal from What-If Scenario)
  createProposalFromWhatIf(scenario) {
    const propId = `PROP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const decId = `DEC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newProposal = {
      id: propId,
      decisionId: decId,
      title: `Áp dụng Kịch bản DSS: Học phí +${scenario.tuitionIncrease}%, Học bổng ${scenario.scholarshipRate}%, Chiến dịch ${scenario.marketingBudgetMode === "attack" ? "Tấn công" : "Cơ bản"}`,
      department: "Ban Giám Hiệu / Ban Tuyển sinh",
      proposedBy: "DSS What-If Simulation Engine",
      category: "Chiến lược Ngân sách & Chỉ tiêu",
      priority: "HIGH",
      currentBudget: 450000000000, // 450 Tỷ
      proposedBudget: 462000000000, // 462 Tỷ
      budgetDelta: 12000000000,
      currency: "VND",
      deadline: "2026-08-25",
      urgency: "Hôm nay",
      status: "WAITING_APPROVAL",
      reason: `Mô phỏng tối ưu hóa doanh thu và số lượng nhập học. Dự báo Doanh thu đạt 2,450 Tỷ (+12.5%), Nhập học đạt 15,200 SV (+8.2%).`,
      impacts: {
        leads: "+18%",
        applicants: "+12%",
        enrollment: "+8.2% (+1,150 SV)",
        revenue: "+250 Tỷ VND",
        roi: "3.8x",
        riskLevel: "Low"
      },
      decisionScore: {
        strategic: 9,
        financial: 9,
        enrollment: 9,
        risk: 2,
        urgency: 8,
        overall: 8.8,
        aiConfidence: 94
      },
      aiRecommendation: {
        status: "SHOULD_APPROVE",
        headline: "KỊCH BẢN TỐI ƯU CÂN BẰNG DOANH THU & CHỈ TIÊU",
        evidence: [
          "Tỷ lệ hoàn vốn nhanh nhờ tối ưu hóa phễu chuyển đổi",
          "Biên lợi nhuận an toàn đạt 14.8%",
          "Học bổng 12% đủ sức giữ chân 85% thí sinh Top 20% SchoolRank"
        ]
      },
      createdDate: new Date().toLocaleString("vi-VN"),
      workflowTasks: []
    };

    this.proposals.unshift(newProposal);
    saveStorage(STORAGE_PROPOSALS, this.proposals);

    this.notifications.unshift({
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: "APPROVAL_REQUIRED",
      severity: "HIGH",
      title: "Đề xuất mới từ Kịch bản What-If",
      content: `Đã tạo đề xuất quyết định ${propId} từ mô phỏng DSS. Vui lòng xem xét và phê duyệt.`,
      timestamp: "Vừa xong",
      isRead: false,
      targetType: "proposal",
      targetId: propId
    });
    saveStorage(STORAGE_NOTIFS, this.notifications);

    return { success: true, proposalId: propId, decisionId: decId, proposal: newProposal };
  }

  // 5. Tạo Action từ Cảnh báo Rủi ro (Risk -> Action Workflow)
  createActionFromRisk(riskId, actionTitle, assignedDept, assignee, deadline) {
    const riskIndex = this.risks.findIndex(r => r.id === riskId);
    if (riskIndex === -1) return { success: false, message: "Không tìm thấy rủi ro" };

    const risk = this.risks[riskIndex];
    const taskId = `TASK-${Math.floor(100 + Math.random() * 900)}`;
    const decId = risk.linkedDecisionId || `DEC-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // Cập nhật trạng thái Risk
    this.risks[riskIndex] = {
      ...risk,
      status: "ACTION_REQUIRED",
      linkedDecisionId: decId
    };
    saveStorage(STORAGE_RISKS, this.risks);

    // Tạo Task giao cho phòng ban
    const newTask = {
      id: taskId,
      decisionId: decId,
      title: `[Xử lý Rủi ro ${risk.id}] ${actionTitle || risk.recommendedAction}`,
      department: assignedDept || risk.department,
      assignee: assignee || risk.owner,
      priority: risk.severity === "CRITICAL" ? "CRITICAL" : "HIGH",
      deadline: deadline || "2026-08-22 17:00",
      slaRemaining: "24h 00m",
      isOverdue: false,
      status: "IN_PROGRESS",
      checklists: [
        { text: `Phân tích nguyên nhân gốc rễ rủi ro: ${risk.title}`, done: true },
        { text: `Triển khai giải pháp: ${actionTitle || risk.recommendedAction}`, done: false },
        { text: "Báo cáo nghiệm thu kết quả giảm thiểu rủi ro cho BOD", done: false }
      ],
      notes: `Rủi ro phát hiện lúc: ${risk.detectedAt}. Tác động dự kiến: ${risk.financialImpact}`
    };

    this.tasks.unshift(newTask);
    saveStorage(STORAGE_TASKS, this.tasks);

    // Ghi Audit
    this.auditLogs.unshift({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString("vi-VN"),
      actor: "Ban Giám Hiệu (BOD Executive)",
      role: "BOD",
      action: "GIAO VIỆC XỬ LÝ RỦI RO",
      target: `${risk.id} ➔ ${newTask.id}`,
      beforeValue: `Rủi ro: ${risk.status}`,
      afterValue: `Đã giao: ${newTask.department} (${newTask.assignee})`,
      reason: actionTitle || risk.recommendedAction,
      ipAddress: "192.168.1.100"
    });
    saveStorage(STORAGE_AUDIT, this.auditLogs);

    return {
      success: true,
      taskId,
      decisionId: decId,
      message: `Đã tạo nhiệm vụ ${taskId} và chuyển tiếp cho ${newTask.department} (${newTask.assignee}) xử lý với hạn chót ${newTask.deadline}.`
    };
  }

  // 6. Đóng Rủi ro (Close / Mitigate Risk)
  mitigateRisk(riskId, resolutionNote = "") {
    const riskIndex = this.risks.findIndex(r => r.id === riskId);
    if (riskIndex === -1) return { success: false, message: "Không tìm thấy rủi ro" };

    const risk = this.risks[riskIndex];
    this.risks[riskIndex] = {
      ...risk,
      status: "CLOSED",
      closedAt: new Date().toLocaleString("vi-VN"),
      resolutionNote
    };
    saveStorage(STORAGE_RISKS, this.risks);

    this.auditLogs.unshift({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString("vi-VN"),
      actor: "Ban Giám Hiệu (BOD Executive)",
      role: "BOD",
      action: "ĐÓNG RỦI RO (MITIGATED)",
      target: `${risk.id}: ${risk.title}`,
      beforeValue: `Trạng thái: ${risk.status}`,
      afterValue: "Trạng thái: CLOSED",
      reason: resolutionNote || "Rủi ro đã được kiểm soát và giảm thiểu về ngưỡng an toàn.",
      ipAddress: "192.168.1.100"
    });
    saveStorage(STORAGE_AUDIT, this.auditLogs);

    return { success: true, message: `Rủi ro ${risk.id} đã được đóng thành công.` };
  }

  // 7. Đốc thúc / Escalate SLA Phòng ban
  urgeDepartment(deptId, message = "") {
    const dept = INITIAL_DEPARTMENT_SLA.find(d => d.id === deptId);
    const deptName = dept ? dept.name : deptId;

    this.notifications.unshift({
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: "SLA_BREACH",
      severity: "HIGH",
      title: `Chỉ thị đốc thúc từ BOD: ${deptName}`,
      content: `BOD yêu cầu ${deptName} khẩn trương xử lý các hồ sơ/nhiệm vụ đang tồn đọng. ${message}`,
      timestamp: "Vừa xong",
      isRead: false,
      targetType: "department",
      targetId: deptId
    });
    saveStorage(STORAGE_NOTIFS, this.notifications);

    this.auditLogs.unshift({
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString("vi-VN"),
      actor: "Ban Giám Hiệu (BOD Executive)",
      role: "BOD",
      action: "PHÁT CHỈ THỊ ĐỐC THÚC SLA",
      target: deptName,
      beforeValue: `SLA hiện tại: ${dept ? dept.slaRate + "%" : "N/A"}`,
      afterValue: "Đã gửi thông báo chỉ đạo khẩn",
      reason: message || "Đốc thúc hoàn thành đúng thời hạn quy định.",
      ipAddress: "192.168.1.100"
    });
    saveStorage(STORAGE_AUDIT, this.auditLogs);

    return { success: true, message: `Đã gửi chỉ thị đốc thúc tới Trưởng ${deptName} (${dept ? dept.lead : ""}).` };
  }

  // 8. Đánh dấu Notification đã đọc
  markNotificationAsRead(notifId) {
    this.notifications = this.notifications.map(n => n.id === notifId ? { ...n, isRead: true } : n);
    saveStorage(STORAGE_NOTIFS, this.notifications);
  }
}

export const bodEngine = new BODDecisionEngine();
