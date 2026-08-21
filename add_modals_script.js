const fs = require('fs');

const file = 'frontend/src/pages/Officer/FinanceOfficerPortal.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state variables inside component
const stateVars = `
  const [showTuitionReminderModal, setShowTuitionReminderModal] = useState(null);
  const [showScholarshipApproveModal, setShowScholarshipApproveModal] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
`;
content = content.replace('export default function FinanceOfficerPortal() {', 'export default function FinanceOfficerPortal() {' + stateVars);

// 2. Arrays to state
content = content.replace(
  'const tuitionDebts = [',
  'const [tuitionDebts, setTuitionDebts] = useState(['
);
content = content.replace(
  /];\s+const scholarshipsData = \[/,
  ']);\n  const [scholarshipsData, setScholarshipsData] = useState(['
);
content = content.replace(
  /];\s+const financialReports = \[/,
  ']);\n  const financialReports = ['
);

// 3. Update buttons
content = content.replace(
  /onClick=\{\(\) => showToast\("Đã gửi thông báo nhắc nợ tới " \+ debt\.name\)\}/g,
  'onClick={() => setShowTuitionReminderModal(debt)}'
);
content = content.replace(
  /onClick=\{\(\) => showToast\("Đã gửi email nhắc nợ tự động tới các sinh viên quá hạn"\)\}/g,
  'onClick={() => setShowTuitionReminderModal("ALL")}'
);
content = content.replace(
  /onClick=\{\(\) => showToast\(`Đã duyệt giải ngân \$\{scholarship\.amount\} cho SV \$\{scholarship\.name\}`\)\}/g,
  'onClick={() => setShowScholarshipApproveModal(scholarship)}'
);
content = content.replace(
  /<button\s+onClick=\{\(\) => showToast\("Mở cài đặt tham số tài chính"\)\}\s+style=\{\{/,
  '<button onClick={() => setShowSettingsModal(true)} style={{'
);
content = content.replace(
  /<button\s+onClick=\{\(\) => showToast\("Mở bộ lọc nâng cao"\)\}\s+style=\{\{/,
  '<button onClick={() => setShowFilterModal(true)} style={{'
);

// 4. Fix undefined errors
content = content.replace(/staff\.teachingPay\.toLocaleString/g, 'staff.teachingPay?.toLocaleString');
content = content.replace(/staff\.deductions\.toLocaleString/g, 'staff.deductions?.toLocaleString');
content = content.replace(/staff\.netPayable\.toLocaleString/g, 'staff.netPayable?.toLocaleString');
content = content.replace(/showTeachingHrsModal\.baseSalary\.toLocaleString/g, 'showTeachingHrsModal.baseSalary?.toLocaleString');

fs.writeFileSync(file, content, 'utf8');
console.log('Processed first batch of replacements.');
