import React from 'react';
import styled from 'styled-components';
import { usePhotoBooth } from '../../contexts/PhotoBoothContext';

const FrameSelectionContainer = styled.section`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
`;

const FramesGrid = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FrameItem = styled.div`
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
  width: 200px;
  border: ${props => props.$selected ? '3px solid #ff6b6b' : 'none'};
  border-radius: 10px;
  padding: ${props => props.$selected ? '5px' : '0'};
  
  &:hover {
    transform: scale(1.05);
  }
`;

const FrameImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

const FrameLabel = styled.span`
  display: block;
  font-size: 1rem;
  color: #555;
`;

function FrameSelection() {
  const { selectFrame, isConnectionSecure } = usePhotoBooth();

  const handleFrameSelect = (frame) => {
    if (!isConnectionSecure) {
      alert('웹캠을 사용하려면 HTTPS 또는 localhost로 접속해야 합니다. 현재 연결 방식에서는 웹캠 접근이 제한됩니다.');
      return;
    }
    
    selectFrame(frame);
  };

  return (
    <FrameSelectionContainer>
      <Title>프레임 선택</Title>
      <FramesGrid>
        <FrameItem onClick={() => handleFrameSelect('frame1')}>
          <FrameImage src="/images/frame1.svg" alt="기본 프레임" />
          <FrameLabel>기본 프레임</FrameLabel>
        </FrameItem>
        
        <FrameItem onClick={() => handleFrameSelect('frame2')}>
          <FrameImage src="/images/frame2.svg" alt="꽃 프레임" />
          <FrameLabel>꽃 프레임</FrameLabel>
        </FrameItem>
        
        <FrameItem onClick={() => handleFrameSelect('frame3')}>
          <FrameImage src="/images/frame3.svg" alt="모던 프레임" />
          <FrameLabel>모던 프레임</FrameLabel>
        </FrameItem>
      </FramesGrid>
    </FrameSelectionContainer>
  );
}

export default FrameSelection; 