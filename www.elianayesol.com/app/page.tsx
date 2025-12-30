'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import MainNavigation from '@/components/MainNavigation';
import HeroSection from '@/components/HeroSection';
import PainSolutionSection from '@/components/PainSolutionSection';
import PillarSection from '@/components/PillarSection';
import FeatureDemoSection from '@/components/FeatureDemoSection';
import TrustSection from '@/components/TrustSection';
import PricingSection from '@/components/PricingSection';
import FloatingAIButton from '@/components/FloatingAIButton';
import LoginModal from '@/components/LoginModal';
import Footer from '@/components/Footer';
import { createMainHandlers } from '@/services/mainservice';

export default function Home() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState('intro');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 이부분 임포트로 안 바꿔도 되는건가?
  const { handleLoginClick, handleLoginRequired, handleLogin } =  
    createMainHandlers(setIsLoginModalOpen);

  const handleStartDiagnosis = () => {
    // SME 진단 페이지로 이동 (추후 구현)
    router.push('/intro');
  };

  const handleWatchDemo = () => {
    // 데모 영상 모달은 HeroSection 내부에서 처리
    console.log('데모 영상 보기');
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

      {/* ① Hero Section */}
      <HeroSection 
        onStartDiagnosis={handleStartDiagnosis}
        onWatchDemo={handleWatchDemo}
      />

      {/* ② Pain → Solution Section (Key Features) */}
      <PainSolutionSection />

      {/* 구분선 */}
      <div className="border-t border-gray-200"></div>

      {/* ③ AIFix 3 Pillar 솔루션 Section */}
      <PillarSection />

      {/* ④ 핵심 기능 시연 Section */}
      <FeatureDemoSection />

      {/* ⑤ 신뢰/검증 Section */}
      <TrustSection />

      {/* ⑥ 요금제 & CTA Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

