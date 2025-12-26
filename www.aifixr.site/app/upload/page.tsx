'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import MainNavigation from '@/components/MainNavigation';
import ImageUploadArea from '@/components/ImageUploadArea';
import LoginModal from '@/components/LoginModal';
import { createMainHandlers } from '@/services/mainservice';

export default function UploadPage() {
  const [activeMainTab, setActiveMainTab] = useState('upload');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { handleLoginClick, handleLoginRequired, handleLogin } =  
    createMainHandlers(setIsLoginModalOpen);

  const handleUpload = (file: File) => {
    console.log('업로드된 파일:', file);
    // 여기에 실제 업로드 로직을 추가할 수 있습니다
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header 
        onLoginClick={handleLoginClick}
      />

      {/* Main Navigation */}
      <MainNavigation 
        activeTab={activeMainTab}
        setActiveTab={setActiveMainTab}
        onLoginRequired={handleLoginRequired}
      />

      {/* Image Upload Area */}
      <ImageUploadArea 
        onUpload={handleUpload}
        showBackButton={true}
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

