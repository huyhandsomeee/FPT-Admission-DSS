const fs = require('fs');
const path = require('path');

const filePath = path.join('e:', 'OJT26', 'FPT-Admission-DSS', 'frontend', 'src', 'pages', 'Officer', 'FinanceOfficerPortal.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Thêm import
if (!content.includes('import { useStaff }')) {
  content = content.replace(
    'import { useNavigate } from "react-router-dom";',
    'import { useNavigate } from "react-router-dom";\nimport { useStaff } from "../../context/StaffContext";'
  );
}

// 2. Sửa hàm FinanceOfficerPortal ()
content = content.replace(
  'export default function FinanceOfficerPortal() {\n  const navigate = useNavigate();',
  'export default function FinanceOfficerPortal() {\n  const navigate = useNavigate();\n  const { staffList, isPayrollApproved, approvePayroll } = useStaff();'
);

// 3. Comment out / xóa các state cũ bị trùng
content = content.replace(
  /const \[isPayrollApproved, setIsPayrollApproved\] = useState\(false\);/,
  '// const [isPayrollApproved, setIsPayrollApproved] = useState(false); // Using Context'
);

// Remove the hardcoded staffList completely to use the context one
const startStaffListIdx = content.indexOf('const [staffList, setStaffList] = useState([');
const endStaffListIdx = content.indexOf('  ]);', startStaffListIdx) + 5;
if (startStaffListIdx !== -1) {
    const hardcodedStaff = content.substring(startStaffListIdx, endStaffListIdx);
    content = content.replace(hardcodedStaff, '// staffList is now managed by StaffContext');
}


// 4. Update handleApprovePayroll
content = content.replace(
  /const handleApprovePayroll = \(\) => \{\n    setIsPayrollApproved\(true\);\n    setShowApprovePayrollModal\(false\);\n    showToast\("🎉 Bảng lương Tháng 10\/2023 đã được PHÊ DUYỆT thành công và chuyển sang giải ngân!"\);\n  \};/,
  'const handleApprovePayroll = async () => {\n    await approvePayroll();\n    setShowApprovePayrollModal(false);\n    showToast("🎉 Bảng lương Tháng 10/2023 đã được PHÊ DUYỆT thành công và chuyển sang giải ngân!");\n  };'
);

fs.writeFileSync(filePath, content, 'utf-8');
console.log('FinanceOfficerPortal updated.');