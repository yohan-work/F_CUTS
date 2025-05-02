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
  margin-bottom: 1.5rem;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin: 2rem 0;
  
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

const PreviewContainer = styled.div`
  max-width: 300px;
  margin: 2rem auto;
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
`;

function PhotoSelection() {
  const { 
    capturedPhotos, 
    selectedPhotos, 
    togglePhotoSelection, 
    printPhotos, 
    resetSession 
  } = usePhotoBooth();

  return (
    <SelectionContainer>
      <Title>사진 선택</Title>
      <Subtitle>마음에 드는 4장의 사진을 선택하세요</Subtitle>
      
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
      
      <PreviewContainer>
        <GridContainer>
          {[...Array(4)].map((_, index) => {
            const selectedPhotoIndex = selectedPhotos[index];
            const photoSrc = selectedPhotoIndex !== undefined ? capturedPhotos[selectedPhotoIndex] : null;
            
            return (
              <GridItem 
                key={index}
                style={photoSrc ? { backgroundImage: `url(${photoSrc})` } : {}}
              />
            );
          })}
        </GridContainer>
      </PreviewContainer>
      
      <Controls>
        <Button onClick={printPhotos}>인쇄하기</Button>
        <Button onClick={resetSession}>처음으로</Button>
      </Controls>
    </SelectionContainer>
  );
}

export default PhotoSelection; 