import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { usePhotoBooth } from '../../contexts/PhotoBoothContext';

const PrintAreaContainer = styled.div`
  display: none;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const PrintContent = styled.div`
  background-color: ${props => props.$style?.backgroundColor || '#f8f8f8'};
  border: 10px solid ${props => props.$style?.borderColor || '#ff6b6b'};
  padding: 20px;
  border-radius: 5px;
  width: 100%;
  aspect-ratio: 1 / 2;
  position: relative;
  box-sizing: border-box;
`;

const PrintHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;
  color: ${props => props.$color || '#ff6b6b'};
  font-weight: bold;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const HeaderLogo = styled.img`
  max-width: 175px;
  max-height: 60px;
  margin-bottom: 10px;
`;

const PrintFooter = styled.div`
  text-align: center;
  margin-top: 20px;
  color: ${props => props.$color || '#ff6b6b'};
  font-size: 16px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  aspect-ratio: 1 / 2;
  background-color: transparent;
  box-shadow: none;
  margin: 0 auto;
  max-width: 300px;
`;

const GridItem = styled.div`
  border-radius: 5px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  border: 3px solid ${props => props.$borderColor || '#ff6b6b'};
  aspect-ratio: 3/4;
`;

function PrintArea() {
  const { selectedFrame, capturedPhotos, selectedPhotos, frameStyles } = usePhotoBooth();
  const printAreaRef = useRef(null);
  
  const style = frameStyles[selectedFrame];
  
  // 인쇄 시 화면에 표시되도록 스크립트 설정
  useEffect(() => {
    const beforePrintHandler = () => {
      if (printAreaRef.current) {
        printAreaRef.current.style.display = 'block';
      }
    };
    
    const afterPrintHandler = () => {
      if (printAreaRef.current) {
        printAreaRef.current.style.display = 'none';
      }
    };
    
    window.addEventListener('beforeprint', beforePrintHandler);
    window.addEventListener('afterprint', afterPrintHandler);
    
    return () => {
      window.removeEventListener('beforeprint', beforePrintHandler);
      window.removeEventListener('afterprint', afterPrintHandler);
    };
  }, []);
  
  return (
    <PrintAreaContainer ref={printAreaRef}>
      <PrintContent $style={style}>
        <PrintHeader $color={style?.textColor}>
          {style?.headerText}
        </PrintHeader>
        
        <GridContainer>
          {selectedPhotos.map((photoIndex, index) => (
            index < 4 && (
              <GridItem 
                key={index}
                style={{ backgroundImage: `url(${capturedPhotos[photoIndex]})` }}
                $borderColor={style?.borderColor}
              />
            )
          ))}
        </GridContainer>
        
        <PrintFooter $color={style?.textColor}>{style?.footerText}</PrintFooter>
      </PrintContent>
    </PrintAreaContainer>
  );
}

export default PrintArea; 