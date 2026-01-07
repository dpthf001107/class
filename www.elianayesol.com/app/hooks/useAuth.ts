import { useEffect } from 'react';
import { useAuthStore } from '@/app/stores/auth.provider';
import { UserInfo, AuthTokens } from '@/app/stores/auth.store';

// 인증 관련 커스텀 훅 (Ducks Pattern)
export const useAuth = () => {
  // Selector를 사용한 최적화된 상태 구독
  const accessToken = useAuthStore((state) => state.accessToken);
  const userInfo = useAuthStore((state) => state.userInfo);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // 디버깅: 상태 변경 시 로그 출력 (한 번만 실행되도록)
  useEffect(() => {
    if (typeof window !== 'undefined' && accessToken) {
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔍 [useAuth] Access Token 상태 확인');
      console.log('   ✅ Access Token:', accessToken.substring(0, Math.min(50, accessToken.length)) + '...');
      console.log('   ✅ isAuthenticated:', isAuthenticated);
      console.log('   ✅ userInfo:', userInfo ? `${userInfo.name} (${userInfo.email})` : 'null');
      console.log('═══════════════════════════════════════════════════════');
    }
  }, [accessToken, isAuthenticated, userInfo]);
  
  // Actions
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const logout = useAuthStore((state) => state.logout);

  // 토큰 저장 (메모리에만 저장, refreshToken은 httpOnly 쿠키)
  const saveTokens = (tokens: AuthTokens) => {
    setAuth(tokens);
  };

  // 사용자 정보 저장
  const saveUserInfo = (user: UserInfo) => {
    setUserInfo(user);
  };

  // 로그인 처리
  const login = (tokens: AuthTokens, user?: UserInfo) => {
    setAuth(tokens, user);
  };

  // 로그아웃 처리 (메모리 초기화, refreshToken은 서버에서 쿠키 삭제)
  const handleLogout = async () => {
    // 서버에 로그아웃 요청 (httpOnly 쿠키 삭제)
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // 쿠키 포함
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    // 메모리 상태 초기화
    logout();
  };

  return {
    // 상태
    accessToken,
    userInfo,
    isAuthenticated,
    
    // 액션
    saveTokens,
    saveUserInfo,
    login,
    logout: handleLogout,
    clearAuth,
  };
};

