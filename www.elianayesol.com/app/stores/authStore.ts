import { create } from 'zustand';
import { AuthState, UserInfo, AuthTokens } from '@/app/types/auth';

// Zustand 스토어 생성 - 메모리 기반 상태 관리
export const useAuthStore = create<AuthState>((set) => ({
  // 초기 상태
  accessToken: null,
  refreshToken: null,
  userInfo: null,
  isAuthenticated: false,

  // Access Token 설정 (메모리에만 저장, 5-15분 유효)
  setAccessToken: (token: string) =>
    set({
      accessToken: token,
      isAuthenticated: true,
    }),

  // Refresh Token 설정 (필요시 서버에서 새 Access Token 발급용)
  setRefreshToken: (token: string) =>
    set({
      refreshToken: token,
    }),

  // 사용자 정보 설정
  setUserInfo: (userInfo: UserInfo) =>
    set({
      userInfo,
    }),

  // 토큰과 사용자 정보 한번에 설정
  setTokens: (tokens: AuthTokens) =>
    set((state) => ({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || state.refreshToken,
      isAuthenticated: true,
    })),

  // 인증 정보 초기화 (메모리에서 제거)
  clearAuth: () =>
    set({
      accessToken: null,
      refreshToken: null,
      userInfo: null,
      isAuthenticated: false,
    }),

  // 로그아웃
  logout: () =>
    set({
      accessToken: null,
      refreshToken: null,
      userInfo: null,
      isAuthenticated: false,
    }),
}));

