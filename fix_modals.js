const fs = require('fs');

const originalFile = 'frontend/src/pages/Officer/FinanceOfficerPortal.jsx';
const backupFile = 'finance_backup.jsx';
let content = fs.readFileSync(backupFile, 'utf8');

// 1. Add useState imports if not present
if (!content.includes('useState')) {
  content = content.replace("import React from 'react';", "import React, { useState } from 'react';");
}

// 2. Add state variables for the modals just inside the component
const stateVars = `
  const [showTuitionReminderModal, setShowTuitionReminderModal] = useState(null);
  const [showScholarshipApproveModal, setShowScholarshipApproveModal] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
`;
content = content.replace(
  'const FinanceOfficerPortal = () => {', 
  'const FinanceOfficerPortal = () => {' + stateVars
);

// 3. Change hardcoded arrays to useState arrays so we can update them in modals
content = content.replace(
  'const tuitionDebts = [',
  'const [tuitionDebts, setTuitionDebts] = useState(['
);
// Find end of tuitionDebts array and change from ]; to ]);
content = content.replace(
  /];\s+const scholarshipsData = \[/,
  ']);\n  const [scholarshipsData, setScholarshipsData] = useState(['
);
// Change end of scholarshipsData from ]; to ]);
content = content.replace(
  /];\s+const financialReports = \[/,
  ']);\n  const financialReports = ['
);

// 4. Update the buttons to trigger the modals instead of just showing toasts
// Tuition Reminder - "Gửi thông báo"
content = content.replace(
  /onClick=\{\(\) => showToast\("Đã gửi thông báo nhắc nợ tới " \+ debt.name\)\}/g,
  'onClick={() => setShowTuitionReminderModal(debt)}'
);

// Tuition Reminder ALL - "Nhắc nợ hàng loạt"
content = content.replace(
  /onClick=\{\(\) => showToast\("Đã gửi email nhắc nợ tự động tới các sinh viên quá hạn"\)\}/g,
  'onClick={() => setShowTuitionReminderModal("ALL")}'
);

// Scholarship Approve - "Duyệt giải ngân"
content = content.replace(
  /onClick=\{\(\) => showToast\(`Đã duyệt giải ngân \$\{scholarship\.amount\} cho SV \$\{scholarship\.name\}`\)\}/g,
  'onClick={() => setShowScholarshipApproveModal(scholarship)}'
);

// Settings button
content = content.replace(
  /<button\s+onClick=\{\(\) => showToast\("Mở cài đặt tham số tài chính"\)\}\s+style=\{\{/,
  '<button onClick={() => setShowSettingsModal(true)} style={{'
);

// Filter button
content = content.replace(
  /<button\s+onClick=\{\(\) => showToast\("Mở bộ lọc nâng cao"\)\}\s+style=\{\{/,
  '<button onClick={() => setShowFilterModal(true)} style={{'
);

// Fix the undefined errors with optional chaining
content = content.replace(/staff\.teachingPay\.toLocaleString/g, 'staff.teachingPay?.toLocaleString');
content = content.replace(/staff\.deductions\.toLocaleString/g, 'staff.deductions?.toLocaleString');
content = content.replace(/staff\.netPayable\.toLocaleString/g, 'staff.netPayable?.toLocaleString');
content = content.replace(/showTeachingHrsModal\.baseSalary\.toLocaleString/g, 'showTeachingHrsModal.baseSalary?.toLocaleString');

// 5. Append Modals to the end of the JSX just before the final closing div
const modalsJsx = fs.readFileSync('modals.txt', 'utf8');
content = content.replace(
  /(\s+)<\/div>\s*<\/div>\s*\)\s*\}\s*export default FinanceOfficerPortal;/,
  '$1' + modalsJsx + '\n$1</div>\n    </div>\n  )\n}\nexport default FinanceOfficerPortal;'
);

fs.writeFileSync(originalFile, content, 'utf8');
console.log('Successfully patched FinanceOfficerPortal.jsx');
