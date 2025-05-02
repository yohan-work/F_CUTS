import React from 'react';
import styled from 'styled-components';
import { usePhotoBooth } from '../../contexts/PhotoBoothContext';

const BoothContainer = styled.section`
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const PhotoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PhotoFrame = styled.div`
  flex: 1;
  position: relative;
`;

const CameraView = styled.div`
  flex: 1;
  position: relative;
`;

const Video = styled.video`
  width: 100%;
  border-radius: 5px;
  background-color: #000;
`;

const Canvas = styled.canvas`
  display: none;
`;

const CountdownDisplay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 8rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PhotoNumberLabel = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #ff5252;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  aspect-ratio: 1 / 2;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const GridItem = styled.div`
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
`;

const ProgressInfo = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
  color: #ff6b6b;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #ff6b6b;
  border-radius: 5px;
  transition: width 0.3s ease-in-out;
`;

function PhotoBooth() {
  const { 
    capturedPhotos,
    isCountingDown,
    countdown,
    videoRef,
    canvasRef,
    startCapturing,
    retakePhotos,
    currentPhotoIndex,
    totalPhotos
  } = usePhotoBooth();

  return (
    <BoothContainer>
      <PhotoContainer>
        <PhotoFrame>
          <GridContainer>
            {[...Array(4)].map((_, index) => (
              <GridItem 
                key={index}
                style={
                  capturedPhotos[index] 
                    ? { backgroundImage: `url(${capturedPhotos[index]})` } 
                    : {}
                }
              />
            ))}
          </GridContainer>
        </PhotoFrame>
        
        <CameraView>
          <Video ref={videoRef} autoPlay playsInline />
          <Canvas ref={canvasRef} />
          {isCountingDown && (
            <CountdownDisplay>
              <PhotoNumberLabel>{currentPhotoIndex}번째 사진</PhotoNumberLabel>
              {countdown}
            </CountdownDisplay>
          )}
        </CameraView>
      </PhotoContainer>
      
      {/* 촬영 진행 상황 표시 */}
      {capturedPhotos.length > 0 && (
        <>
          <ProgressInfo>
            총 {totalPhotos}장 중 {capturedPhotos.length}장 촬영 완료
            {currentPhotoIndex > 0 && capturedPhotos.length < totalPhotos && (
              <span> (현재 {currentPhotoIndex}번째 사진 촬영 중)</span>
            )}
          </ProgressInfo>
          <ProgressBarContainer>
            <ProgressBarFill style={{ width: `${(capturedPhotos.length / totalPhotos) * 100}%` }} />
          </ProgressBarContainer>
        </>
      )}
      
      <Controls>
        {capturedPhotos.length === 0 ? (
          <Button onClick={startCapturing}>촬영 시작</Button>
        ) : (
          <Button onClick={retakePhotos}>다시 촬영</Button>
        )}
      </Controls>
    </BoothContainer>
  );
}

export default PhotoBooth; 