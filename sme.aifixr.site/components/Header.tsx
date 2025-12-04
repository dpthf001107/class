'use client';

import { Sparkles, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  onLoginClick?: () => void;
}

export default function Header({ onLoginClick }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[72px] backdrop-blur-[20px] bg-white/85 border-b border-gray-200/50">
      <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D4ABB] to-[#00D4FF] flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#1a2332] whitespace-nowrap" style={{ fontFamily: 'Inter Tight, Arial, sans-serif' }}>
            AIFIX
          </span>
        </Link>

        {/* Right Section - Profile Dropdown */}
        <div className="flex items-center gap-4 flex-shrink-0 ml-auto relative" ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#0D4ABB] to-[#00D4FF] text-white hover:shadow-lg hover:scale-105 transition-all whitespace-nowrap"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <span className="font-medium">내 계정</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <Link
                href="/profile"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[#1a2332] hover:bg-gray-50 transition-colors"
              >
                <User className="w-5 h-5 text-gray-500" />
                <span>프로필</span>
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-[#1a2332] hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-500" />
                <span>설정</span>
              </Link>
              <div className="border-t border-gray-200 my-1" />
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  // 로그아웃 로직 추가
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>로그아웃</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}