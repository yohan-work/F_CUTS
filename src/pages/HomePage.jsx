import React from 'react';
import { usePhotoBooth } from '../contexts/PhotoBoothContext';
import ConnectionNotice from '../components/ui/ConnectionNotice';
import FrameSelection from '../components/photo-booth/FrameSelection';
import PhotoBooth from '../components/photo-booth/PhotoBooth';
import PhotoSelection from '../components/photo-booth/PhotoSelection';
import PrintArea from '../components/photo-booth/PrintArea';

function HomePage() {
  const { currentStep } = usePhotoBooth();

  return (
    <main>
      <ConnectionNotice />
      
      {currentStep === 'frame-selection' && <FrameSelection />}
      {currentStep === 'photo-booth' && <PhotoBooth />}
      {currentStep === 'photo-selection' && <PhotoSelection />}
      
      <PrintArea />
    </main>
  );
}

export default HomePage; 