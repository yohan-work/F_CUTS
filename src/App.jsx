import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PhotoBoothProvider } from './contexts/PhotoBoothContext';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <PhotoBoothProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </PhotoBoothProvider>
  );
}

export default App; 