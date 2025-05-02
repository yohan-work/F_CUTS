# 인생 네컷 (FCUTS)

React 기반의 인생 네컷 사진 촬영 웹 애플리케이션입니다.

## 기능

- 웹캠을 사용해 인생 네컷 스타일의 사진 촬영
- 여러 프레임 중 선택 가능
- 촬영된 여러 사진 중 4장 선택 기능
- 선택한 사진을 인쇄할 수 있는 기능

## Preview
![preview01](https://github.com/user-attachments/assets/b3a0c736-c70c-4667-b0c0-ccb46970fb8c)
![preview02](https://github.com/user-attachments/assets/b36cc47a-7b0e-4416-a781-fcef9ab89086)
![preview04](https://github.com/user-attachments/assets/5e39540e-bff2-4659-a444-e3d7576b1634)


## 기술 스택

- React 19
- React Router
- Styled Components
- Vite

## 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 개발 서버 실행 (HTTP)

```bash
npm run dev
```

### HTTPS 서버 실행 (모바일 카메라 접근용)

웹캠/카메라 기능을 사용하려면 HTTPS 또는 localhost 환경이 필요합니다. 모바일 기기에서 접속하려면 HTTPS가 필요합니다.

```bash
# 빌드 후 HTTPS 서버 실행 (한 번에)
npm run simple-https

# 또는 아래 단계별로 실행
npm run build
node simple-https.cjs
```

HTTPS 서버는 자체 서명 인증서를 사용합니다:
- 포트: 3443
- 로컬 접속: `https://localhost:3443`
- 네트워크 접속: `https://[컴퓨터IP]:3443` (예: `https://10.50.104.97:3443`)

> **주의**: 인증서 경고가 표시되면 '고급' -> '안전하지 않은 사이트로 이동' 버튼을 클릭하세요.

### 빌드

```bash
npm run build
```

### 빌드된 파일 미리보기

```bash
npm run preview
```

## 프로젝트 구조

```
/
├── public/           # 정적 파일
│   └── images/       # 프레임 이미지
├── src/
│   ├── assets/       # 스타일 및 기타 자산
│   ├── components/   # 컴포넌트
│   │   ├── layouts/  # 레이아웃 컴포넌트
│   │   ├── photo-booth/ # 사진 촬영 관련 컴포넌트
│   │   └── ui/       # UI 컴포넌트
│   ├── contexts/     # 컨텍스트 
│   ├── hooks/        # 커스텀 훅
│   ├── pages/        # 페이지 컴포넌트
│   ├── App.jsx       # 앱 진입점
│   └── main.jsx      # React 렌더링 진입점
├── index.html        # HTML 템플릿
├── vite.config.js    # Vite 설정
├── simple-https.cjs  # HTTPS 서버 스크립트
├── package.json      # 프로젝트 메타데이터 및 의존성
└── README.md         # 이 파일
```

## 주의사항

- 웹캠 기능을 사용하려면 HTTPS 또는 localhost 환경에서 접속해야 합니다.
- 보안 정책으로 인해 일반 HTTP 사이트에서는 웹캠 접근이 제한됩니다.
- 모바일 기기에서 접속할 때는 HTTPS가 필요하며, `simple-https.cjs` 스크립트를 사용해 HTTPS 서버를 실행할 수 있습니다.

## 라이센스
Yohan Choi.
