import React from 'react';
import styled from 'styled-components';
import { usePhotoBooth } from '../../contexts/PhotoBoothContext';

const SelectionContainer = styled.section`
  margin: 2rem auto;
  padding: 1.5rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Photo = styled.div`
  position: relative;
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
  aspect-ratio: 3/4;
  
  &::after {
    content: '✓';
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ff6b6b;
    color: white;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: ${props => props.$selected ? 'flex' : 'none'};
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PreviewSection = styled.div`
  margin: 2rem 0;
`;

const PreviewTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #555;
`;

const PreviewContainer = styled.div`
  max-width: 300px;
  margin: 0 auto;
  position: relative;
`;

const FrameContainer = styled.div`
  background-color: ${props => props.$style?.backgroundColor || '#f8f8f8'};
  border: 10px solid ${props => props.$style?.borderColor || '#ff6b6b'};
  padding: 15px;
  border-radius: 5px;
  width: 100%;
  aspect-ratio: 1 / 2;
  position: relative;
  box-sizing: border-box;
`;

const FrameHeader = styled.div`
  text-align: center;
  margin-bottom: 15px;
  color: ${props => props.$color || '#ff6b6b'};
  font-weight: bold;
  font-size: 18px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  background-color: transparent;
  margin: 0 auto;
`;

const GridItem = styled.div`
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  border: 2px solid ${props => props.$borderColor || '#ff6b6b'};
  aspect-ratio: 3/4;
`;

const FrameFooter = styled.div`
  text-align: center;
  margin-top: 15px;
  color: ${props => props.$color || '#ff6b6b'};
  font-size: 12px;
`;

const SelectedCount = styled.div`
  font-size: 1.2rem;
  margin: 1rem 0;
  color: ${props => props.$complete ? '#28a745' : props.$hasSelection ? '#ff6b6b' : '#666'};
  font-weight: ${props => props.$hasSelection ? 'bold' : 'normal'};
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
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
  
  &:disabled {
    background-color: #ffb6b6;
    cursor: not-allowed;
  }
`;

function PhotoSelection() {
  const { 
    capturedPhotos, 
    selectedPhotos, 
    togglePhotoSelection, 
    printPhotos, 
    downloadPhotos,
    resetSession,
    selectedFrame,
    frameStyles
  } = usePhotoBooth();
  
  const frameStyle = frameStyles[selectedFrame];
  const isSelectionComplete = selectedPhotos.length === 4;

  return (
    <SelectionContainer>
      <Title>사진 선택</Title>
      <Subtitle>마음에 드는 4장의 사진을 선택하세요</Subtitle>
      
      <SelectedCount 
        $hasSelection={selectedPhotos.length > 0} 
        $complete={isSelectionComplete}
      >
        {isSelectionComplete 
          ? '선택 완료! 아래 미리보기를 확인하세요.' 
          : `${selectedPhotos.length}/4 장 선택됨`}
      </SelectedCount>
      
      <PhotoGrid>
        {capturedPhotos.map((photo, index) => (
          <Photo 
            key={index} 
            onClick={() => togglePhotoSelection(index)}
            $selected={selectedPhotos.includes(index)}
          >
            <PhotoImage src={photo} alt={`촬영된 사진 ${index + 1}`} />
          </Photo>
        ))}
      </PhotoGrid>
      
      <PreviewSection>
        <PreviewTitle>최종 미리보기</PreviewTitle>
        <PreviewContainer>
          <FrameContainer $style={frameStyle}>
            <FrameHeader $color={frameStyle?.textColor}>
              {frameStyle?.headerText}
            </FrameHeader>
            
            <GridContainer>
              {[...Array(4)].map((_, index) => {
                const selectedPhotoIndex = selectedPhotos[index];
                const photoSrc = selectedPhotoIndex !== undefined ? capturedPhotos[selectedPhotoIndex] : null;
                
                return (
                  <GridItem 
                    key={index}
                    style={photoSrc ? { backgroundImage: `url(${photoSrc})` } : {}}
                    $borderColor={frameStyle?.borderColor}
                  />
                );
              })}
            </GridContainer>
            
            <FrameFooter $color={frameStyle?.textColor}>
              {frameStyle?.footerText}
            </FrameFooter>
          </FrameContainer>
        </PreviewContainer>
      </PreviewSection>
      
      <Controls>
        <Button 
          onClick={printPhotos} 
          disabled={!isSelectionComplete}
        >
          인쇄하기
        </Button>
        
        <Button 
          onClick={downloadPhotos} 
          disabled={!isSelectionComplete}
          style={{ backgroundColor: '#4a90e2' }}
        >
          다운로드
        </Button>
        
        <Button onClick={resetSession}>처음으로</Button>
      </Controls>
    </SelectionContainer>
  );
}

export default PhotoSelection; 