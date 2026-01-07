import { createStore, StoreApi } from 'zustand/vanilla';

// ============================================
// Ducks Pattern: Types + Actions + Reducer + Store
// ============================================

// ============================================
// Types (Ducks Pattern: 모든 관련 타입을 한 파일에)
// ============================================

export interface UserInfo {
  email: string;
  name: string;
  picture?: string;
  sub?: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn?: number;
}

// Zustand State 타입
export interface AuthState {
  accessToken: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
}

// Zustand Actions 타입
export interface AuthActions {
  setAccessToken: (token: string) => void;
  setUserInfo: (userInfo: UserInfo) => void;
  setAuth: (tokens: AuthTokens, userInfo?: UserInfo) => void;
  clearAuth: () => void;
  logout: () => void;
}

// 전체 스토어 타입
export type AuthStore = AuthState & AuthActions;

// 초기 상태
const initialState = {
  accessToken: null,
  userInfo: null,
  isAuthenticated: false,
};

// Zustand Vanilla Store 생성 함수 (Next.js 16 호환)
export const createAuthStore = () => {
  return createStore<AuthStore>((set) => ({
    // State
    ...initialState,

    // Actions
    // Access Token 설정 (메모리에만 저장, 5-15분 유효)
    setAccessToken: (token: string) => {
      console.log('🔐 [Zustand Store] setAccessToken 호출 - Access Token 저장 중...');
      console.log('   - Token (일부):', token.substring(0, Math.min(50, token.length)) + '...');
      set((state) => {
        const newState = {
          accessToken: token,
          isAuthenticated: true,
        };
        console.log('✅ [Zustand Store] setAccessToken 완료');
        console.log('   - 저장된 Token 확인:', newState.accessToken ? newState.accessToken.substring(0, Math.min(50, newState.accessToken.length)) + '...' : 'null');
        console.log('   - isAuthenticated:', newState.isAuthenticated);
        return newState;
      });
    },

    // 사용자 정보 설정
    setUserInfo: (userInfo: UserInfo) =>
      set({
        userInfo,
      }),

    // 토큰과 사용자 정보 한번에 설정
    setAuth: (tokens: AuthTokens, userInfo?: UserInfo) => {
      console.log('🔐 [Zustand Store] setAuth 호출 - Access Token 저장 중...');
      console.log('   - Token (일부):', tokens.accessToken.substring(0, Math.min(50, tokens.accessToken.length)) + '...');
      console.log('   - UserInfo:', userInfo ? `${userInfo.name} (${userInfo.email})` : '없음');
      set((state) => {
        const newState = {
          accessToken: tokens.accessToken,
          userInfo: userInfo || state.userInfo,
          isAuthenticated: true,
        };
        console.log('✅ [Zustand Store] setAuth 완료 - Access Token 저장 확인');
        console.log('   - 저장된 Token 확인:', newState.accessToken ? newState.accessToken.substring(0, Math.min(50, newState.accessToken.length)) + '...' : 'null');
        console.log('   - isAuthenticated:', newState.isAuthenticated);
        return newState;
      });
    },

    // 인증 정보 초기화 (메모리에서 제거)
    clearAuth: () =>
      set({
        accessToken: null,
        userInfo: null,
        isAuthenticated: false,
      }),

    // 로그아웃 (메모리 초기화, refreshToken은 서버에서 httpOnly 쿠키 삭제)
    logout: () =>
      set({
        accessToken: null,
        userInfo: null,
        isAuthenticated: false,
      }),
  }));
};

// 스토어 타입 export
export type AuthStoreType = StoreApi<AuthStore>;

// 싱글톤 스토어 인스턴스 (서비스 레이어에서 사용)
// 클라이언트 사이드에서만 생성되도록 체크
let authStoreInstance: AuthStoreType | null = null;

export const getAuthStore = (): AuthStoreType => {
  if (typeof window === 'undefined') {
    throw new Error('AuthStore can only be accessed on the client side');
  }
  
  if (!authStoreInstance) {
    authStoreInstance = createAuthStore();
  }
  
  return authStoreInstance;
};

