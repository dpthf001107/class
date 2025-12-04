'use client';

import { X, Lock } from 'lucide-react';
import { AuthService } from '@/services/authservice';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    AuthService.handleGoogleLogin();
  };

  const handleKakaoLogin = () => {
    AuthService.handleKakaoLogin();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 p-8 rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E91E8C] to-[#8B5CF6] flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-center text-[#1a2332]">
          로그인이 필요합니다
        </h3>

        {/* Description */}
        <p className="mb-8 text-center text-gray-600" style={{ fontSize: '16px' }}>
          해당 서비스는 로그인 후 이용 가능합니다.
        </p>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleKakaoLogin}
            className="w-full px-6 py-3 rounded-xl bg-[#FEE500] text-[#000000] hover:bg-[#FDD835] hover:shadow-lg transition-all font-medium"
          >
            카카오 로그인하기
          </button>
          <button
            onClick={handleGoogleLogin}
            className="w-full px-6 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            구글 로그인하기
          </button>
          <button
            onClick={onLogin}
            className="w-full px-6 py-3 rounded-xl bg-[#03C75A] text-white hover:bg-[#02B350] hover:shadow-lg transition-all font-medium"
          >
            네이버 로그인하기
          </button>
        </div>
      </div>
    </div>
  );
}
