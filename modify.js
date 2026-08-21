const fs = require("fs");
let code = fs.readFileSync("finance_backup.jsx", "utf8");
code = code.replace("  const tuitionDebts = [", "  const [tuitionDebts, setTuitionDebts] = useState([");
code = code.replace("Quá hạn\", color: \"#DC2626\", bg: \"#FEE2E2\" }\n  ];", "Quá hạn\", color: \"#DC2626\", bg: \"#FEE2E2\" }\n  ]);");
code = code.replace("  const scholarshipsData = [", "  const [scholarshipsData, setScholarshipsData] = useState([");
code = code.replace("{ name: \"Nguyễn Văn A\"", "{ id: \"SCH-01\", name: \"Nguyễn Văn A\"");
code = code.replace("{ name: \"Trần Thị B\"", "{ id: \"SCH-02\", name: \"Trần Thị B\"");
code = code.replace("{ name: \"Lê Hoàng C\"", "{ id: \"SCH-03\", name: \"Lê Hoàng C\"");
code = code.replace("conductReq: \"Khá\", discipline: \"Cảnh cáo\" }\n  ];", "conductReq: \"Khá\", discipline: \"Cảnh cáo\" }\n  ]);");
const stateBlock = "  const [showViewAllExpenditures, setShowViewAllExpenditures] = useState(false);\n  const [showTuitionReminderModal, setShowTuitionReminderModal] = useState(null);\n  const [showScholarshipApproveModal, setShowScholarshipApproveModal] = useState(null);\n  const [showSettingsModal, setShowSettingsModal] = useState(false);\n  const [showFilterModal, setShowFilterModal] = useState(false);";
code = code.replace("  const [showViewAllExpenditures, setShowViewAllExpenditures] = useState(false);", stateBlock);
code = code.replace("onClick={() => showToast(\"Đã gửi email nhắc nợ tự động tới 5 sinh viên quá hạn\")}", "onClick={() => setShowTuitionReminderModal(\"ALL\")}");
code = code.replace("onClick={() => showToast(\"Đã xuất danh sách công nợ ra file Excel\")}", "onClick={() => { showToast(\"Đang chuẩn bị file Excel...\"); setTimeout(() => showToast(\"Đã xuất danh sách công nợ ra file Excel thành công!\"), 1500); }}");
code = code.replace("onClick={() => showToast(\`Đã gửi thông báo nhắc nợ tới ${item.name}\`)}", "onClick={() => setShowTuitionReminderModal(item)} disabled={item.status === \"Đã nhắc nợ\"}");
code = code.replace("Nhắc nợ\n                          </button>", "{item.status === \"Đã nhắc nợ\" ? \"Đã nhắc\" : \"Nhắc nợ\"}\n                          </button>");
code = code.replace("onClick={() => showToast(\`Đã duyệt giải ngân học bổng cho sinh viên ${s.name}\`)}", "onClick={() => setShowScholarshipApproveModal(s)} disabled={s.status !== \"Chờ duyệt\" && s.status !== \"Đủ điều kiện\"}");
code = code.replace("Duyệt\n                          </button>", "{s.status === \"Đã giải ngân\" ? \"Đã duyệt\" : s.status === \"Vi phạm\" ? \"Từ chối\" : \"Duyệt\"}\n                          </button>");
code = code.replace("onClick={() => showToast(\"Đã mở cấu hình tham số thuế & phụ cấp\")}", "onClick={() => setShowSettingsModal(true)}");
code = code.replace("onClick={() => showToast(\"Đã kích hoạt bộ lọc phòng ban và mức lương\")}", "onClick={() => setShowFilterModal(true)}");
const modals = fs.readFileSync('modals.txt', 'utf8');
const replaceTarget = '    </div>\n  );\n}';
if (code.includes(replaceTarget)) {
  const lastIndex = code.lastIndexOf(replaceTarget);
  code = code.substring(0, lastIndex) + modals + '\n' + code.substring(lastIndex);
  fs.writeFileSync('frontend/src/pages/Officer/FinanceOfficerPortal.jsx', code);
  console.log('Success');
} else {
  console.log('Could not find insertion point');
}
