import re

with open("frontend/src/pages/Officer/FinanceOfficerPortal.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add states
states = """  const [showTuitionReminderModal, setShowTuitionReminderModal] = useState(null);
  const [showScholarshipApproveModal, setShowScholarshipApproveModal] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
"""
content = content.replace("export default function FinanceOfficerPortal() {", "export default function FinanceOfficerPortal() {\n" + states)

# Arrays to state
content = content.replace("const tuitionDebts = [", "const [tuitionDebts, setTuitionDebts] = useState([")
content = re.sub(r"];\s+const scholarshipsData = \[", "]);\n  const [scholarshipsData, setScholarshipsData] = useState([", content)
content = re.sub(r"];\s+const financialReports = \[", "]);\n  const financialReports = [", content)

# Buttons
content = re.sub(r'onClick=\{\(\) => showToast\("Đã gửi thông báo nhắc nợ tới " \+ debt\.name\)\}', 'onClick={() => setShowTuitionReminderModal(debt)}', content)
content = re.sub(r'onClick=\{\(\) => showToast\("Đã gửi email nhắc nợ tự động tới các sinh viên quá hạn"\)\}', 'onClick={() => setShowTuitionReminderModal("ALL")}', content)
content = re.sub(r'onClick=\{\(\) => showToast\(`Đã duyệt giải ngân \$\{scholarship\.amount\} cho SV \$\{scholarship\.name\}`\)\}', 'onClick={() => setShowScholarshipApproveModal(scholarship)}', content)
content = re.sub(r'<button\s+onClick=\{\(\) => showToast\("Mở cài đặt tham số tài chính"\)\}\s+style=\{\{', '<button onClick={() => setShowSettingsModal(true)} style={{', content)
content = re.sub(r'<button\s+onClick=\{\(\) => showToast\("Mở bộ lọc nâng cao"\)\}\s+style=\{\{', '<button onClick={() => setShowFilterModal(true)} style={{', content)

# Optional chaining fixes
content = content.replace("staff.teachingPay.toLocaleString", "staff.teachingPay?.toLocaleString")
content = content.replace("staff.deductions.toLocaleString", "staff.deductions?.toLocaleString")
content = content.replace("staff.netPayable.toLocaleString", "staff.netPayable?.toLocaleString")
content = content.replace("showTeachingHrsModal.baseSalary.toLocaleString", "showTeachingHrsModal.baseSalary?.toLocaleString")

with open("modals.txt", "r", encoding="utf-8") as f:
    modals = f.read()

content = re.sub(r'(\s+)</div>\s*</div>\s*\)\s*\}\s*export default FinanceOfficerPortal;', r'\1' + modals + r'\n\1</div>\n    </div>\n  )\n}\nexport default FinanceOfficerPortal;', content)

with open("frontend/src/pages/Officer/FinanceOfficerPortal.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done via python!")
