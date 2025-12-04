'use client';

import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AIFIXRPanel from './AIFIXRPanel';

interface MainNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLoginRequired?: () => void;
}

export default function MainNavigation({ activeTab, setActiveTab, onLoginRequired }: MainNavigationProps) {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const pathname = usePathname();
  const tabs = [
    { id: 'intro', label: 'AIFIX 소개', href: '/intro' },
    { id: 'rating', label: '기업 ESG 등급', href: '#' },
    { id: 'news', label: 'ESG 소식', href: '#' },
    { id: 'notice', label: '공지사항', href: '#' },
    { id: 'self-diagnosis', label: '자가진단', href: '#' },
    { id: 'auto-report', label: '자동화 보고서', href: '#' },
    { id: 'editing', label: '윤문 AI', href: '#' },
  ];

  const handleTabClick = (tab: typeof tabs[0], e: React.MouseEvent) => {
    setActiveTab(tab.id);
  };

  return (
    <>
      <div className="fixed top-[72px] left-0 right-0 z-40 backdrop-blur-[20px] bg-white/85 border-b border-gray-200/50">
        <div className="max-w-[1440px] mx-auto px-8">
          <nav className="flex items-center gap-2 py-4 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href || (activeTab === tab.id && tab.id !== 'intro');
              return (
              <Link
                key={tab.id}
                href={tab.href}
                onClick={(e) => handleTabClick(tab, e)}
                className={`relative px-6 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'text-white bg-[#0D4ABB] shadow-md'
                    : 'text-[#1a2332] hover:text-[#0D4ABB] hover:bg-gray-50'
                }`}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'linear-gradient(90deg, #0D4ABB, #E91E8C, #00D4FF, #8B5CF6, #0D4ABB)';
                    e.currentTarget.style.backgroundSize = '200% 100%';
                    e.currentTarget.style.animation = 'ripple 2s linear infinite';
                    e.currentTarget.style.backgroundClip = 'text';
                    e.currentTarget.style.webkitBackgroundClip = 'text';
                    e.currentTarget.style.webkitTextFillColor = 'transparent';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.backgroundSize = '';
                    e.currentTarget.style.animation = '';
                    e.currentTarget.style.backgroundClip = '';
                    e.currentTarget.style.webkitBackgroundClip = '';
                    e.currentTarget.style.webkitTextFillColor = '';
                  }
                }}
              >
                {tab.label}
              </Link>
            );
          })}
            
            {/* Virtual Human AI Button - Right Side */}
            <button
              onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
              className={`relative px-6 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 whitespace-nowrap ml-auto ${
                isAIPanelOpen
                  ? 'bg-[#0D4ABB] text-white'
                  : 'bg-gradient-to-r from-[#00D4FF] to-[#0D4ABB] text-white hover:shadow-lg hover:scale-105'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">AIFIXR Assistant</span>
            </button>
          </nav>
        </div>
      </div>
      
      {/* AI Panel */}
      <AIFIXRPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
    </>
  );
}
