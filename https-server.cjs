const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const serveStatic = require('serve-static');
const selfSigned = require('selfsigned');

// 자체 서명 인증서 생성
const attrs = [{ name: 'commonName', value: 'localhost' }];
const pems = selfSigned.generate(attrs, { days: 365 });

// 저장 경로
const certDir = path.join(__dirname, 'https-cert');
const keyPath = path.join(certDir, 'key.pem');
const certPath = path.join(certDir, 'cert.pem');

// 인증서 저장
fs.writeFileSync(keyPath, pems.private);
fs.writeFileSync(certPath, pems.cert);

const app = express();

// dist 폴더 서빙
app.use(express.static(path.join(__dirname, 'dist')));

// 모든 경로를 index.html로 라우팅 (SPA 대응)
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// HTTPS 서버 생성
const httpsServer = https.createServer({
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
}, app);

const PORT = 3443;
httpsServer.listen(PORT, '0.0.0.0', () => {
  const localIPs = [];
  const interfaces = require('os').networkInterfaces();
  
  // IP 주소 추출 로직 수정
  for (const key in interfaces) {
    for (const item of interfaces[key]) {
      if (!item.internal && item.family === 'IPv4') {
        localIPs.push(item.address);
      }
    }
  }
  
  console.log(`HTTPS 서버가 시작되었습니다.`);
  console.log(`로컬 접속: https://localhost:${PORT}`);
  console.log(`네트워크 접속: https://${localIPs.join(' 또는 https://')}:${PORT}`);
  console.log(`(인증서 경고가 표시되면 '고급 -> 안전하지 않은 사이트로 이동' 버튼을 클릭하세요.)`);
}); 