'use client';

import { useState } from 'react';
import ImageUploadArea from '@/app/components/ImageUploadArea';
import LoginModal from '@/app/components/LoginModal';

// Next.js 16에서 빌드 타임 정적 생성 방지
export const dynamic = 'force-dynamic';

export default function UploadPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleUpload = (file: File) => {
    console.log('업로드된 파일:', file);
    // 여기에 실제 업로드 로직을 추가할 수 있습니다
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Image Upload Area */}
      <ImageUploadArea 
        onUpload={handleUpload}
        showBackButton={true}
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={() => {
          console.log('Login action triggered');
          setIsLoginModalOpen(false);
        }}
      />
    </div>
  );
}

