import { useAuthStore } from '@/app/stores/authStore';
import { UserInfo, AuthTokens } from '@/app/types/auth';

// 인증 관련 커스텀 훅
export const useAuth = () => {
  const {
    accessToken,
    refreshToken,
    userInfo,
    isAuthenticated,
    setAccessToken,
    setRefreshToken,
    setUserInfo,
    setTokens,
    clearAuth,
    logout,
  } = useAuthStore();

  // 토큰 저장 (메모리에만 저장)
  const saveTokens = (tokens: AuthTokens) => {
    setTokens(tokens);
  };

  // 사용자 정보 저장
  const saveUserInfo = (user: UserInfo) => {
    setUserInfo(user);
  };

  // 로그인 처리
  const login = (tokens: AuthTokens, user?: UserInfo) => {
    setTokens(tokens);
    if (user) {
      setUserInfo(user);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    logout();
  };

  return {
    // 상태
    accessToken,
    refreshToken,
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

