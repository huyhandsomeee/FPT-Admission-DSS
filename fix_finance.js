const fs = require('fs');

const file = 'frontend/src/pages/Officer/FinanceOfficerPortal.jsx';
let content = fs.readFileSync(file, 'utf8');
const modalsRaw = fs.readFileSync('modals.txt', 'utf8');

// 1. Check if state imports exist and fix if missing
if (!content.includes('useState')) {
  content = content.replace("import React from 'react';", "import React, { useState } from 'react';");
}

// 2. Add state variables inside component (only if not already there)
if (!content.includes('showTuitionReminderModal')) {
  const stateVars = `
  const [showTuitionReminderModal, setShowTuitionReminderModal] = useState(null);
  const [showScholarshipApproveModal, setShowScholarshipApproveModal] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
`;
  content = content.replace('export default function FinanceOfficerPortal() {', 'export default function FinanceOfficerPortal() {' + stateVars);
}

// 3. Arrays to state
content = content.replace(
  'const tuitionDebts = [',
  'const [tuitionDebts, setTuitionDebts] = useState(['
);
content = content.replace(
  /];\s+const scholarshipsData = \[/,
  ']);\n  const [scholarshipsData, setScholarshipsData] = useState(['
);

// 4. Update buttons
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
  /<button\s+onClick=\{\(\) => showToast\("Mở cài đặt tham số tài chính"\)\}\s+style=\{\{/g,
  '<button onClick={() => setShowSettingsModal(true)} style={{'
);
content = content.replace(
  /<button\s+onClick=\{\(\) => showToast\("Mở bộ lọc nâng cao"\)\}\s+style=\{\{/g,
  '<button onClick={() => setShowFilterModal(true)} style={{'
);

// 5. Fix undefined errors
content = content.replace(/staff\.teachingPay\.toLocaleString/g, 'staff.teachingPay?.toLocaleString');
content = content.replace(/staff\.deductions\.toLocaleString/g, 'staff.deductions?.toLocaleString');
content = content.replace(/staff\.netPayable\.toLocaleString/g, 'staff.netPayable?.toLocaleString');
content = content.replace(/showTeachingHrsModal\.baseSalary\.toLocaleString/g, 'showTeachingHrsModal.baseSalary?.toLocaleString');

// 6. Append Modals
content = content.replace(
  /(\s+)<\/div>\s*<\/div>\s*\)\s*\}\s*$/,
  '$1' + modalsRaw + '\n$1</div>\n    </div>\n  )\n}\n'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully applied fixes via script!');
