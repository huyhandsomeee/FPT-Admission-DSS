const fs = require('fs');
let code = fs.readFileSync('frontend/src/pages/Officer/FinanceOfficerPortal.jsx', 'utf8');

// Use static string replacements to avoid template literal issues

const origTuition = `  const tuitionDebts = [
    { id: "DEBT-01", name: "Nguyễn Văn A", code: "HE150123", amount: "25,500,000", deadline: "15/09/2026", status: "Quá hạn", color: "#DC2626", bg: "#FEE2E2" },
    { id: "DEBT-02", name: "Trần Thị B", code: "SS160456", amount: "12,000,000", deadline: "20/09/2026", status: "Đã nhắc nợ", color: "#2563EB", bg: "#DBEAFE" },
    { id: "DEBT-03", name: "Lê Văn C", code: "SE170789", amount: "5,500,000", deadline: "30/09/2026", status: "Chờ xử lý", color: "#D97706", bg: "#FEF3C7" },
    { id: "DEBT-04", name: "Hoàng Minh D", code: "SE180234", amount: "18,200,000", deadline: "25/09/2026", status: "Đã nhắc nợ", color: "#2563EB", bg: "#DBEAFE" },
    { id: "DEBT-05", name: "Đỗ Thu E", code: "GD170990", amount: "29,700,000", deadline: "10/09/2026", status: "Quá hạn", color: "#DC2626", bg: "#FEE2E2" }
  ];`;
  
const origScholars = `  const scholarshipsData = [
    { name: "Nguyễn Văn A", code: "SE150123", major: "CNTT", type: "Tài năng", rate: "100%", amount: "25.000.000đ", remaining: "0đ", status: "Đủ điều kiện", gpa: 9.2, gpaReq: 8.5, conduct: "Tốt", conductReq: "Tốt", discipline: "Không" },
    { name: "Trần Thị B", code: "IA150456", major: "ATTT", type: "Khuyến khích", rate: "50%", amount: "12.500.000đ", remaining: "12.500.000đ", status: "Chờ duyệt", gpa: 8.5, gpaReq: 8.0, conduct: "Khá", conductReq: "Tốt", discipline: "Không" },
    { name: "Lê Hoàng C", code: "SS150789", major: "QTKD", type: "Hỗ trợ TC", rate: "—", amount: "10.000.000đ", remaining: "10.000.000đ", status: "Vi phạm", gpa: 7.2, gpaReq: 7.5, conduct: "Trung bình", conductReq: "Khá", discipline: "Cảnh cáo" }
  ];`;

const newTuition = `  const [tuitionDebts, setTuitionDebts] = useState([
    { id: "DEBT-01", name: "Nguyễn Văn A", code: "HE150123", amount: "25,500,000", deadline: "15/09/2026", status: "Quá hạn", color: "#DC2626", bg: "#FEE2E2" },
    { id: "DEBT-02", name: "Trần Thị B", code: "SS160456", amount: "12,000,000", deadline: "20/09/2026", status: "Đã nhắc nợ", color: "#2563EB", bg: "#DBEAFE" },
    { id: "DEBT-03", name: "Lê Văn C", code: "SE170789", amount: "5,500,000", deadline: "30/09/2026", status: "Chờ xử lý", color: "#D97706", bg: "#FEF3C7" },
    { id: "DEBT-04", name: "Hoàng Minh D", code: "SE180234", amount: "18,200,000", deadline: "25/09/2026", status: "Đã nhắc nợ", color: "#2563EB", bg: "#DBEAFE" },
    { id: "DEBT-05", name: "Đỗ Thu E", code: "GD170990", amount: "29,700,000", deadline: "10/09/2026", status: "Quá hạn", color: "#DC2626", bg: "#FEE2E2" }
  ]);`;

const newScholars = `  const [scholarshipsData, setScholarshipsData] = useState([
    { id: "SCH-01", name: "Nguyễn Văn A", code: "SE150123", major: "CNTT", type: "Tài năng", rate: "100%", amount: "25.000.000đ", remaining: "0đ", status: "Đủ điều kiện", gpa: 9.2, gpaReq: 8.5, conduct: "Tốt", conductReq: "Tốt", discipline: "Không" },
    { id: "SCH-02", name: "Trần Thị B", code: "IA150456", major: "ATTT", type: "Khuyến khích", rate: "50%", amount: "12.500.000đ", remaining: "12.500.000đ", status: "Chờ duyệt", gpa: 8.5, gpaReq: 8.0, conduct: "Khá", conductReq: "Tốt", discipline: "Không" },
    { id: "SCH-03", name: "Lê Hoàng C", code: "SS150789", major: "QTKD", type: "Hỗ trợ TC", rate: "—", amount: "10.000.000đ", remaining: "10.000.000đ", status: "Vi phạm", gpa: 7.2, gpaReq: 7.5, conduct: "Trung bình", conductReq: "Khá", discipline: "Cảnh cáo" }
  ]);
  
  const [showTuitionReminderModal, setShowTuitionReminderModal] = useState(null);
  const [showScholarshipApproveModal, setShowScholarshipApproveModal] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);`;

code = code.replace(origTuition, newTuition);
code = code.replace(origScholars, newScholars);

code = code.replace(
  'onClick={() => showToast("Đã gửi email nhắc nợ tự động tới 5 sinh viên quá hạn")}',
  'onClick={() => setShowTuitionReminderModal("ALL")}'
);
code = code.replace(
  'onClick={() => showToast("Đã xuất danh sách công nợ ra file Excel")}',
  'onClick={() => { showToast("Đang chuẩn bị file Excel..."); setTimeout(() => showToast("Đã xuất danh sách công nợ ra file Excel thành công!"), 1500); }}'
);
code = code.replace(
  'onClick={() => showToast(`Đã gửi thông báo nhắc nợ tới ${item.name}`)}',
  'onClick={() => setShowTuitionReminderModal(item)} disabled={item.status === "Đã nhắc nợ"}'
);
code = code.replace(
  'Nhắc nợ\n                          </button>',
  '{item.status === "Đã nhắc nợ" ? "Đã nhắc" : "Nhắc nợ"}\n                          </button>'
);
code = code.replace(
  'onClick={() => showToast(`Đã duyệt giải ngân học bổng cho sinh viên ${s.name}`)}',
  'onClick={() => setShowScholarshipApproveModal(s)} disabled={s.status !== "Chờ duyệt" && s.status !== "Đủ điều kiện"}'
);
code = code.replace(
  'Duyệt\n                          </button>',
  '{s.status === "Đã giải ngân" ? "Đã duyệt" : s.status === "Vi phạm" ? "Từ chối" : "Duyệt"}\n                          </button>'
);
code = code.replace(
  'onClick={() => showToast("Đã mở cấu hình tham số thuế & phụ cấp")}',
  'onClick={() => setShowSettingsModal(true)}'
);
code = code.replace(
  'onClick={() => showToast("Đã kích hoạt bộ lọc phòng ban và mức lương")}',
  'onClick={() => setShowFilterModal(true)}'
);

const fs2 = require('fs');
let modalCode = fs2.readFileSync('update_finance.js', 'utf8');

// I will just append the modals string at the end manually
