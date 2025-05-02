const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// HTTPS 서버 설정
const PORT = 3443;

// Vite 개발 서버 실행 후 HTTPS 프록시 수행
console.log('Vite 개발 서버 실행 중...');

// 개발 서버 빌드 실행
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('빌드 완료!');
} catch (error) {
  console.error('빌드 실패:', error);
  process.exit(1);
}

// 단순 HTTPS 파일 서버 생성
const server = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'https-cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'https-cert', 'cert.pem'))
}, (req, res) => {
  // URL 경로 확인
  let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
  
  // 경로에 확장자가 없고 /로 끝나지 않으면 index.html 반환 (SPA 라우팅)
  if (!path.extname(filePath) && !filePath.endsWith('/')) {
    filePath = path.join(__dirname, 'dist', 'index.html');
  }
  
  // 파일 존재 확인 후 반환
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // 파일이 없으면 index.html 반환 (SPA 라우팅)
      filePath = path.join(__dirname, 'dist', 'index.html');
    }
    
    // 파일 확장자 확인
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    
    // 확장자별 Content-Type 설정
    switch (ext) {
      case '.js':
        contentType = 'text/javascript';
        break;
      case '.css':
        contentType = 'text/css';
        break;
      case '.json':
        contentType = 'application/json';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.svg':
        contentType = 'image/svg+xml';
        break;
    }
    
    // 파일 읽기 및 응답
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }
      
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

// IP 주소 가져오기
const localIPs = [];
const interfaces = require('os').networkInterfaces();

for (const key in interfaces) {
  for (const item of interfaces[key]) {
    if (!item.internal && item.family === 'IPv4') {
      localIPs.push(item.address);
    }
  }
}

// 서버 시작
server.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTPS 서버가 시작되었습니다. (포트: ${PORT})`);
  console.log(`로컬 접속: https://localhost:${PORT}`);
  
  if (localIPs.length > 0) {
    console.log(`네트워크 접속:`);
    localIPs.forEach(ip => {
      console.log(`  https://${ip}:${PORT}`);
    });
  }
  
  console.log(`주의: 인증서 경고가 표시되면 '고급' -> '안전하지 않은 사이트로 이동' 버튼을 클릭하세요.`);
}); 