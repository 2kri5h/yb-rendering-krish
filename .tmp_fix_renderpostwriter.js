const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'YB-pdf-frontend-main', 'src', 'Pages', 'FinalPages.jsx');
let s = fs.readFileSync(filePath, 'utf8');
const before = '{renderPostWriter(post)}';
const after = '{renderPostWriter(post, typeof leftPost !== \'undefined\' ? leftPost : true)}';
let count = 0;
while (s.indexOf(before) !== -1) {
  s = s.replace(before, after);
  count++;
}
fs.writeFileSync(filePath, s, 'utf8');
console.log('replaced', count);
