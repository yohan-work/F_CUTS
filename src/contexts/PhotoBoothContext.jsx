import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// 컨텍스트 생성
const PhotoBoothContext = createContext();

// 프레임 스타일 설정
const frameStyles = {
  frame1: {
    backgroundColor: '#f8f8f8',
    borderColor: '#ff6b6b',
    textColor: '#ff6b6b',
    headerText: '인생 네컷',
    footerText: '나만의 특별한 순간'
  },
  frame2: {
    backgroundColor: '#fff8f8',
    borderColor: '#ff8da1',
    textColor: '#ff8da1',
    headerText: '꽃길만 걷자',
    footerText: '특별한 너와 함께'
  },
  frame3: {
    backgroundColor: '#333333',
    borderColor: '#ffffff',
    textColor: '#ffffff',
    headerText: 'MOMENTS',
    footerText: 'CAPTURED FOREVER'
  },
  frameCNX: {
    backgroundColor: '#003d5b',
    borderColor: '#25e2cc',
    textColor: '#ffffff',
    headerText: 'CNX CATALYST',
    footerText: 'CNX 만세'
  }
};

export function PhotoBoothProvider({ children }) {
  const [selectedFrame, setSelectedFrame] = useState('frame1');
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [currentStep, setCurrentStep] = useState('frame-selection'); // 'frame-selection', 'photo-booth', 'photo-selection'
  const [stream, setStream] = useState(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isConnectionSecure, setIsConnectionSecure] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0); // 현재 촬영 중인 사진 인덱스
  const [totalPhotos] = useState(8); // 총 촬영할 사진 수
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // 연결 상태 확인
  useEffect(() => {
    checkConnectionSecurity();
  }, []);
  
  function checkConnectionSecurity() {
    const isSecureContext = window.isSecureContext;
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
    
    let securityStatus = '';
    let secure = false;
    
    if (isSecureContext || protocol === 'https:') {
      securityStatus = 'HTTPS (안전한 연결)';
      secure = true;
    } else if (isLocalhost) {
      securityStatus = 'Localhost (웹캠 사용 가능)';
      secure = true;
    } else {
      securityStatus = 'HTTP (웹캠 사용 불가)';
      secure = false;
    }
    
    setConnectionStatus(securityStatus);
    setIsConnectionSecure(secure);
    
    return secure;
  }
  
  // 프레임 선택 처리
  const selectFrame = (frame) => {
    setSelectedFrame(frame);
    setCurrentStep('photo-booth');
    startCamera();
  };
  
  // 카메라 시작
  const startCamera = async () => {
    if (!navigator.mediaDevices) {
      alert('이 브라우저에서는 카메라를 지원하지 않습니다. 최신 Chrome, Firefox, Edge를 사용해주세요.');
      return;
    }
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        
        // 캔버스 크기 설정
        setTimeout(() => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
        }, 500);
      }
    } catch (err) {
      console.error('카메라 접근 오류:', err);
      alert('카메라에 접근할 수 없습니다. 카메라 권한을 확인해주세요.');
    }
  };
  
  // 카메라 중지
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };
  
  // 촬영 시작
  const startCapturing = () => {
    setCapturedPhotos([]);
    setCurrentPhotoIndex(1); // 첫 번째 사진 촬영 시작
    startCountdown();
  };
  
  // 카운트다운 시작
  const startCountdown = () => {
    setIsCountingDown(true);
    setCountdown(5);
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsCountingDown(false);
          capturePhoto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // 사진 촬영
  const capturePhoto = () => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    
    const imageData = canvasRef.current.toDataURL('image/png');
    setCapturedPhotos(prev => {
      const newPhotos = [...prev, imageData];
      
      if (newPhotos.length < totalPhotos) {
        setCurrentPhotoIndex(newPhotos.length + 1); // 다음 사진 인덱스로 업데이트
        setTimeout(startCountdown, 1000);
      } else {
        setCurrentPhotoIndex(0); // 촬영 완료 후 초기화
        setCurrentStep('photo-selection');
        stopCamera();
      }
      
      return newPhotos;
    });
  };
  
  // 사진 선택 토글
  const togglePhotoSelection = (index) => {
    setSelectedPhotos(prev => {
      const isSelected = prev.includes(index);
      
      if (isSelected) {
        return prev.filter(i => i !== index);
      } else {
        if (prev.length >= 4) {
          alert('최대 4장까지 선택할 수 있습니다.');
          return prev;
        }
        return [...prev, index];
      }
    });
  };
  
  // 다시 촬영
  const retakePhotos = () => {
    setCurrentStep('photo-booth');
    setCapturedPhotos([]);
    setSelectedPhotos([]);
    setCurrentPhotoIndex(0); // 인덱스 초기화
    startCamera();
  };
  
  // 인쇄 처리
  const printPhotos = () => {
    if (selectedPhotos.length !== 4) {
      alert('4장의 사진을 선택해주세요.');
      return;
    }
    
    // 인쇄용 캔버스 생성
    const printCanvas = document.createElement('canvas');
    const ctx = printCanvas.getContext('2d');
    
    // 프레임 스타일
    const style = frameStyles[selectedFrame];
    
    // 캔버스 크기 설정
    const canvasWidth = 1000; // 인쇄에 적합한 크기로 조정
    const canvasHeight = 2000; 
    printCanvas.width = canvasWidth;
    printCanvas.height = canvasHeight;
    
    // 안티앨리어싱 활성화
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // 배경색 채우기
    ctx.fillStyle = style.backgroundColor || '#f8f8f8';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 테두리 그리기
    ctx.strokeStyle = style.borderColor || '#ff6b6b';
    ctx.lineWidth = 24;
    ctx.strokeRect(12, 12, canvasWidth - 24, canvasHeight - 24);
    
    // 인쇄 영역 생성 및 렌더링
    const renderPrintArea = async () => {
      // 헤더 텍스트 추가
      ctx.fillStyle = style.textColor || '#ff6b6b';
      ctx.font = 'bold 60px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(style.headerText || '', canvasWidth / 2, 90);
      
      // 사진 영역 계산
      const padding = 80;
      const photoAreaWidth = canvasWidth - (padding * 2);
      
      // 사진의 총 영역 계산
      const totalPhotoArea = canvasHeight - 200; // 헤더와 푸터를 위한 공간 제외
      
      // 각 사진의 크기와 간격 계산
      const photoCount = 4; // 항상 4장
      const gap = 40; // 사진 사이 간격
      const totalGapHeight = gap * (photoCount - 1);
      const availableHeightForPhotos = totalPhotoArea - totalGapHeight;
      const photoHeight = Math.floor(availableHeightForPhotos / photoCount);
      const photoWidth = photoAreaWidth;
      
      // 첫 번째 사진의 y 위치 (헤더 아래 여백 포함)
      const startY = 150;
      
      // 이미지 로드 및 그리기를 위한 프로미스 배열
      const imagePromises = selectedPhotos.map((photoIndex, index) => {
        return new Promise((resolve) => {
          const photoSrc = capturedPhotos[photoIndex];
          const img = new Image();
          img.crossOrigin = 'Anonymous'; // CORS 이슈 방지
          img.src = photoSrc;
          
          img.onload = () => {
            // 원본 이미지의 비율 계산
            const originalRatio = img.width / img.height;
            
            // 사진 위치 계산
            const y = startY + index * (photoHeight + gap);
            
            // 이미지 비율을 유지하면서 그리기 위한 계산
            let drawWidth = photoWidth - 20; // 테두리 고려
            let drawHeight = photoHeight - 20; // 테두리 고려
            let offsetX = 10;
            let offsetY = 10;
            
            if (originalRatio > drawWidth / drawHeight) {
              // 이미지가 더 넓은 경우
              const newHeight = drawWidth / originalRatio;
              offsetY += (drawHeight - newHeight) / 2;
              drawHeight = newHeight;
            } else {
              // 이미지가 더 높은 경우
              const newWidth = drawHeight * originalRatio;
              offsetX += (drawWidth - newWidth) / 2;
              drawWidth = newWidth;
            }
            
            // 사진 영역 배경 (테두리용)
            ctx.fillStyle = style.borderColor || '#ff6b6b';
            ctx.fillRect(padding, y, photoWidth, photoHeight);
            
            // 사진 내부 배경 (여백용)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(padding + 5, y + 5, photoWidth - 10, photoHeight - 10);
            
            // 이미지 그리기 전에 클리핑 경로 설정 (모서리 둥글게)
            ctx.save();
            ctx.beginPath();
            const radius = 8;
            const rectX = padding + offsetX;
            const rectY = y + offsetY;
            ctx.moveTo(rectX + radius, rectY);
            ctx.lineTo(rectX + drawWidth - radius, rectY);
            ctx.quadraticCurveTo(rectX + drawWidth, rectY, rectX + drawWidth, rectY + radius);
            ctx.lineTo(rectX + drawWidth, rectY + drawHeight - radius);
            ctx.quadraticCurveTo(rectX + drawWidth, rectY + drawHeight, rectX + drawWidth - radius, rectY + drawHeight);
            ctx.lineTo(rectX + radius, rectY + drawHeight);
            ctx.quadraticCurveTo(rectX, rectY + drawHeight, rectX, rectY + drawHeight - radius);
            ctx.lineTo(rectX, rectY + radius);
            ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
            ctx.closePath();
            ctx.clip();
            
            // 사진 그리기 (비율 유지)
            ctx.drawImage(
              img, 
              padding + offsetX, 
              y + offsetY, 
              drawWidth, 
              drawHeight
            );
            
            // 클리핑 복원
            ctx.restore();
            
            resolve();
          };
          
          // 이미지 로드 실패 시 처리
          img.onerror = () => {
            console.error('이미지 로드 실패:', photoSrc);
            resolve();
          };
        });
      });
      
      // 모든 이미지가 로드될 때까지 기다림
      await Promise.all(imagePromises);
      
      // 푸터 텍스트 추가
      ctx.fillStyle = style.textColor || '#ff6b6b';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(style.footerText || '', canvasWidth / 2, canvasHeight - 70);
      
      // 인쇄용 이미지를 DOM에 추가
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.');
        return;
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>포토부스 인쇄</title>
            <style>
              @media print {
                body, html {
                  margin: 0;
                  padding: 0;
                  height: 100%;
                  width: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                }
                img {
                  max-width: 100%;
                  max-height: 100%;
                  object-fit: contain;
                  page-break-inside: avoid;
                }
                @page {
                  size: auto;
                  margin: 0mm;
                }
              }
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0;
                padding: 0;
                height: 100vh;
                background-color: #f0f0f0;
              }
              img {
                max-width: 100%;
                max-height: 100vh;
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
              }
              .print-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 20px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                z-index: 1000;
              }
              .print-btn:hover {
                background-color: #45a049;
              }
              @media print {
                .print-btn {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <button class="print-btn" onclick="window.print(); setTimeout(function() { window.close(); }, 500);">인쇄하기</button>
            <img src="${printCanvas.toDataURL('image/png', 1.0)}" alt="포토부스 프린트" />
          </body>
        </html>
      `);
      printWindow.document.close();
    };
    
    renderPrintArea();
  };
  
  // 사진 다운로드 처리
  const downloadPhotos = () => {
    if (selectedPhotos.length !== 4) {
      alert('4장의 사진을 선택해주세요.');
      return;
    }
    
    // 다운로드를 위한 캔버스 생성
    const downloadCanvas = document.createElement('canvas');
    const ctx = downloadCanvas.getContext('2d');
    
    // 프레임 스타일
    const style = frameStyles[selectedFrame];
    
    // 캔버스 크기 설정 (더 높은 해상도로 조정)
    const canvasWidth = 1600;
    const canvasHeight = 3200;
    downloadCanvas.width = canvasWidth;
    downloadCanvas.height = canvasHeight;
    
    // 안티앨리어싱 활성화
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // 배경색 채우기
    ctx.fillStyle = style.backgroundColor || '#f8f8f8';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 테두리 그리기
    ctx.strokeStyle = style.borderColor || '#ff6b6b';
    ctx.lineWidth = 40;
    ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);
    
    // 사진 그리기
    const drawPhotos = async () => {
      // 헤더 텍스트 추가 (더 위로 이동)
      ctx.fillStyle = style.textColor || '#ff6b6b';
      ctx.font = 'bold 96px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(style.headerText || '', canvasWidth / 2, 140);
      
      // 사진 영역 계산
      const padding = 120;
      const photoAreaWidth = canvasWidth - (padding * 2);
      
      // 사진의 총 영역 계산
      const totalPhotoArea = canvasHeight - 300; // 헤더와 푸터를 위한 공간 제외
      
      // 각 사진의 크기와 간격 계산
      const photoCount = 4; // 항상 4장
      const gap = 60; // 사진 사이 간격
      const totalGapHeight = gap * (photoCount - 1);
      const availableHeightForPhotos = totalPhotoArea - totalGapHeight;
      const photoHeight = Math.floor(availableHeightForPhotos / photoCount);
      const photoWidth = photoAreaWidth;
      
      // 첫 번째 사진의 y 위치 (헤더 아래 여백 포함)
      const startY = 200;
      
      // 이미지 로드 및 그리기를 위한 프로미스 배열
      const imagePromises = selectedPhotos.map((photoIndex, index) => {
        return new Promise((resolve) => {
          const photoSrc = capturedPhotos[photoIndex];
          const img = new Image();
          img.crossOrigin = 'Anonymous'; // CORS 이슈 방지
          img.src = photoSrc;
          
          img.onload = () => {
            // 원본 이미지의 비율 계산
            const originalRatio = img.width / img.height;
            
            // 사진 위치 계산
            const y = startY + index * (photoHeight + gap);
            
            // 이미지 비율을 유지하면서 그리기 위한 계산
            let drawWidth = photoWidth - 20; // 테두리 고려
            let drawHeight = photoHeight - 20; // 테두리 고려
            let offsetX = 10;
            let offsetY = 10;
            
            if (originalRatio > drawWidth / drawHeight) {
              // 이미지가 더 넓은 경우
              const newHeight = drawWidth / originalRatio;
              offsetY += (drawHeight - newHeight) / 2;
              drawHeight = newHeight;
            } else {
              // 이미지가 더 높은 경우
              const newWidth = drawHeight * originalRatio;
              offsetX += (drawWidth - newWidth) / 2;
              drawWidth = newWidth;
            }
            
            // 사진 영역 배경 (테두리용)
            ctx.fillStyle = style.borderColor || '#ff6b6b';
            ctx.fillRect(padding, y, photoWidth, photoHeight);
            
            // 사진 내부 배경 (여백용)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(padding + 5, y + 5, photoWidth - 10, photoHeight - 10);
            
            // 이미지 그리기 전에 클리핑 경로 설정 (모서리 둥글게)
            ctx.save();
            ctx.beginPath();
            const radius = 10;
            const rectX = padding + offsetX;
            const rectY = y + offsetY;
            ctx.moveTo(rectX + radius, rectY);
            ctx.lineTo(rectX + drawWidth - radius, rectY);
            ctx.quadraticCurveTo(rectX + drawWidth, rectY, rectX + drawWidth, rectY + radius);
            ctx.lineTo(rectX + drawWidth, rectY + drawHeight - radius);
            ctx.quadraticCurveTo(rectX + drawWidth, rectY + drawHeight, rectX + drawWidth - radius, rectY + drawHeight);
            ctx.lineTo(rectX + radius, rectY + drawHeight);
            ctx.quadraticCurveTo(rectX, rectY + drawHeight, rectX, rectY + drawHeight - radius);
            ctx.lineTo(rectX, rectY + radius);
            ctx.quadraticCurveTo(rectX, rectY, rectX + radius, rectY);
            ctx.closePath();
            ctx.clip();
            
            // 사진 그리기 (비율 유지)
            ctx.drawImage(
              img, 
              padding + offsetX, 
              y + offsetY, 
              drawWidth, 
              drawHeight
            );
            
            // 클리핑 복원
            ctx.restore();
            
            resolve();
          };
          
          // 이미지 로드 실패 시 처리
          img.onerror = () => {
            console.error('이미지 로드 실패:', photoSrc);
            resolve();
          };
        });
      });
      
      // 모든 이미지가 로드될 때까지 기다림
      await Promise.all(imagePromises);
      
      // 푸터 텍스트 추가
      ctx.fillStyle = style.textColor || '#ff6b6b';
      ctx.font = 'bold 72px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(style.footerText || '', canvasWidth / 2, canvasHeight - 100);
      
      // 다운로드 처리
      try {
        const dataURL = downloadCanvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `포토부스_${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataURL;
        document.body.appendChild(link); // Safari 호환성을 위해 추가
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 100);
      } catch (err) {
        console.error('다운로드 에러:', err);
        alert('이미지 다운로드 중 오류가 발생했습니다.');
      }
    };
    
    drawPhotos();
  };
  
  // 처음으로 이동
  const resetSession = () => {
    stopCamera();
    setCurrentStep('frame-selection');
    setCapturedPhotos([]);
    setSelectedPhotos([]);
  };
  
  return (
    <PhotoBoothContext.Provider
      value={{
        selectedFrame,
        capturedPhotos,
        selectedPhotos,
        currentStep,
        isCountingDown,
        countdown,
        isConnectionSecure,
        connectionStatus,
        frameStyles,
        currentPhotoIndex,
        totalPhotos,
        videoRef,
        canvasRef,
        selectFrame,
        startCapturing,
        togglePhotoSelection,
        retakePhotos,
        printPhotos,
        downloadPhotos,
        resetSession
      }}
    >
      {children}
    </PhotoBoothContext.Provider>
  );
}

export function usePhotoBooth() {
  const context = useContext(PhotoBoothContext);
  if (!context) {
    throw new Error('usePhotoBooth must be used within a PhotoBoothProvider');
  }
  return context;
} 