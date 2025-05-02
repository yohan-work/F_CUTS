import React from 'react';
import styled from 'styled-components';
import { usePhotoBooth } from '../../contexts/PhotoBoothContext';

const NoticeContainer = styled.div`
  background-color: ${props => props.$isSecure ? '#e8f5e9' : '#fff3cd'};
  border: 1px solid ${props => props.$isSecure ? '#c8e6c9' : '#ffeeba'};
  color: ${props => props.$isSecure ? '#388e3c' : '#856404'};
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: 5px;
  text-align: center;
`;

const NoticeText = styled.p`
  margin: 0.5rem 0;
`;

const StrongText = styled.strong`
  font-weight: bold;
`;

const ConnectionStatus = styled.span`
  color: ${props => props.$isSecure ? '#28a745' : '#dc3545'};
  font-weight: bold;
`;

function ConnectionNotice() {
  const { isConnectionSecure, connectionStatus } = usePhotoBooth();

  return (
    <NoticeContainer $isSecure={isConnectionSecure}>
      <NoticeText>
        <StrongText>📢 주의사항:</StrongText> 웹캠 기능을 사용하려면 <StrongText>HTTPS</StrongText> 또는 <StrongText>localhost</StrongText>로 접속해야 합니다.
      </NoticeText>
      <NoticeText>
        현재 연결: <ConnectionStatus $isSecure={isConnectionSecure}>{connectionStatus}</ConnectionStatus>
      </NoticeText>
    </NoticeContainer>
  );
}

export default ConnectionNotice; 