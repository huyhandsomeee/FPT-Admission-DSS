const fs = require('fs');
const file = 'frontend/src/pages/Officer/FinanceOfficerPortal.jsx';
let content = fs.readFileSync(file, 'utf8');

const modalsCode = fs.readFileSync('modals_source.txt', 'utf8');

content = content.replace(
  /(\s+)<\/div>\s*<\/div>\s*\)\s*\}\s*export default FinanceOfficerPortal;?/,
  '$1' + modalsCode + '\n$1</div>\n    </div>\n  )\n}\nexport default FinanceOfficerPortal;'
);
fs.writeFileSync(file, content, 'utf8');
console.log('Done!');
