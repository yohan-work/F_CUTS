import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 4rem 0;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: #ff6b6b;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #ff6b6b;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #ff5252;
  }
`;

function NotFoundPage() {
  return (
    <NotFoundContainer>
      <Title>404</Title>
      <Message>페이지를 찾을 수 없습니다</Message>
      <HomeLink to="/">홈으로 돌아가기</HomeLink>
    </NotFoundContainer>
  );
}

export default NotFoundPage; 