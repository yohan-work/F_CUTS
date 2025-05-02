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
    
    window.print();
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