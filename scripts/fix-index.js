const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'out');
const indexPath = path.join(outDir, 'index.html');
const indexDirPath = path.join(outDir, 'index', 'index.html');

// Check if index.html exists in root
if (fs.existsSync(indexPath)) {
  console.log('✓ index.html already exists in root');
  process.exit(0);
}

// Check if index/index.html exists and copy it
if (fs.existsSync(indexDirPath)) {
  fs.copyFileSync(indexDirPath, indexPath);
  console.log('✓ Copied index/index.html to root/index.html');
  process.exit(0);
}

// If neither exists, create a basic index.html that redirects
console.log('⚠ No index.html found, creating redirect...');
const redirectHtml = `<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=/index/">
  <script>window.location.href = '/index/';</script>
</head>
<body>
  <p>Redirecting to <a href="/index/">/index/</a></p>
</body>
</html>`;
fs.writeFileSync(indexPath, redirectHtml);
console.log('✓ Created redirect index.html');

