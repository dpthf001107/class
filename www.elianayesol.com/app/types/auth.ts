// 인증 관련 타입 정의

export interface UserInfo {
  email: string;
  name: string;
  picture?: string;
  sub?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface AuthState {
  // 상태
  accessToken: string | null;
  refreshToken: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  
  // 액션
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
  logout: () => void;
}

