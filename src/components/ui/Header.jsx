import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #ff6b6b;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

function Header() {
  return (
    <HeaderContainer>
      <Title>인생 네컷</Title>
      <Subtitle>나만의 특별한 순간을 네 장의 사진으로 담아보세요</Subtitle>
    </HeaderContainer>
  );
}

export default Header; 