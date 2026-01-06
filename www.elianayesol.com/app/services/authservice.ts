/**
 * Authentication Service
 * Handles OAuth login flows (Google, Kakao, Naver)
 * Access Token은 Zustand 스토어(메모리)에 저장됨
 */

import { useAuthStore } from '@/app/stores/authStore';
import { UserInfo, AuthTokens } from '@/app/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: UserInfo;
  redirectUrl?: string;
}

class AuthServiceClass {
  /**
   * Handle Google Login
   * Redirects user to Google OAuth page
   */
  async handleGoogleLogin(): Promise<void> {
    try {
      console.log('🔐 Starting Google login...');
      console.log(`📡 API URL: ${API_BASE_URL}/api/oauth/google/auth-url`);
      
      // 1. Request Google authentication URL from backend (POST 방식)
      const response = await fetch(`${API_BASE_URL}/api/oauth/google/auth-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP error! status: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Auth URL received:', data);
      
      if (data.authUrl) {
        // 2. Redirect to Google login page
        console.log('🔄 Redirecting to Google...');
        window.location.href = data.authUrl;
      } else {
        throw new Error('Authentication URL not received');
      }
    } catch (error: any) {
      console.error('❌ Google login failed:', error);
      
      // More detailed error message
      let errorMessage = '구글 로그인에 실패했습니다.';
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요. (http://localhost:8080)';
      } else if (error.message?.includes('HTTP error')) {
        errorMessage = `서버 오류가 발생했습니다: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  }

  /**
   * Handle Kakao Login
   * Redirects user to Kakao OAuth page
   */
  async handleKakaoLogin(): Promise<void> {
    try {
      console.log('🔐 Starting Kakao login...');
      console.log(`📡 API URL: ${API_BASE_URL}/api/oauth/kakao/login`);
      
      // 1. Request Kakao authentication URL from backend
      const response = await fetch(`${API_BASE_URL}/api/oauth/kakao/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP error! status: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Auth URL received:', data);
      
      if (data.authUrl) {
        // 2. Redirect to Kakao login page
        console.log('🔄 Redirecting to Kakao...');
        window.location.href = data.authUrl;
      } else {
        throw new Error('Authentication URL not received');
      }
    } catch (error: any) {
      console.error('❌ Kakao login failed:', error);
      
      let errorMessage = '카카오 로그인에 실패했습니다.';
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
      } else if (error.message?.includes('HTTP error')) {
        errorMessage = `서버 오류가 발생했습니다: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  }

  /**
   * Handle Naver Login
   * Redirects user to Naver OAuth page
   */
  async handleNaverLogin(): Promise<void> {
    try {
      console.log('🔐 Starting Naver login...');
      console.log(`📡 API URL: ${API_BASE_URL}/api/oauth/naver/login`);
      
      // 1. Request Naver authentication URL from backend
      const response = await fetch(`${API_BASE_URL}/api/oauth/naver/login`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ HTTP error! status: ${response.status}`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Auth URL received:', data);
      
      if (data.authUrl) {
        // 2. Redirect to Naver login page
        console.log('🔄 Redirecting to Naver...');
        window.location.href = data.authUrl;
      } else {
        throw new Error('Authentication URL not received');
      }
    } catch (error: any) {
      console.error('❌ Naver login failed:', error);
      
      let errorMessage = '네이버 로그인에 실패했습니다.';
      
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        errorMessage = '백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
      } else if (error.message?.includes('HTTP error')) {
        errorMessage = `서버 오류가 발생했습니다: ${error.message}`;
      }
      
      alert(errorMessage);
    }
  }

  /**
   * Handle Google OAuth Callback
   * Processes the authorization code from Google
   * @param code - Authorization code from Google
   * @param state - State parameter for CSRF protection
   * @returns Login response with token and user info
   */
  async handleGoogleCallback(code: string, state: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/oauth/google/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code, state }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();
      
      // Refresh Token이 있으면 HttpOnly 쿠키에 저장
      if (data.success && data.refreshToken) {
        await this.saveRefreshTokenToCookie(data.refreshToken);
      }
      
      return data;
    } catch (error) {
      console.error('Google callback failed:', error);
      throw error;
    }
  }

  /**
   * Refresh Token을 HttpOnly 쿠키에 저장
   * @param refreshToken - Refresh Token
   */
  private async saveRefreshTokenToCookie(refreshToken: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      const response = await fetch('/api/auth/set-refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn('⚠️ Refresh Token 쿠키 저장 실패:', errorText);
      } else {
        console.log('✅ Refresh Token이 HttpOnly 쿠키에 저장되었습니다.');
      }
    } catch (error) {
      console.error('❌ Refresh Token 쿠키 저장 중 오류:', error);
      // 쿠키 저장 실패해도 로그인은 계속 진행
    }
  }

  /**
   * Get stored access token from Zustand store (메모리)
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return useAuthStore.getState().accessToken;
  }

  /**
   * Get stored refresh token from Zustand store (메모리)
   * 주의: Refresh Token은 HttpOnly 쿠키에 저장되므로 클라이언트에서 직접 읽을 수 없음
   * 이 메서드는 메모리에 저장된 값만 반환 (일반적으로 null)
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    // Refresh Token은 HttpOnly 쿠키에 저장되므로 메모리에는 없음
    // 필요시 서버 측에서만 읽을 수 있음
    return null;
  }

  /**
   * Get stored user info from Zustand store (메모리)
   */
  getUserInfo(): UserInfo | null {
    if (typeof window === 'undefined') return null;
    return useAuthStore.getState().userInfo;
  }

  /**
   * Check if user is logged in (메모리 기반)
   */
  isLoggedIn(): boolean {
    if (typeof window === 'undefined') return false;
    return useAuthStore.getState().isAuthenticated;
  }

  /**
   * Save tokens to Zustand store (메모리에만 저장)
   * Refresh Token은 HttpOnly 쿠키에 저장
   */
  async saveTokens(tokens: AuthTokens): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // Access Token은 Zustand 스토어(메모리)에 저장
    useAuthStore.getState().setTokens(tokens);
    
    // Refresh Token이 있으면 HttpOnly 쿠키에 저장
    if (tokens.refreshToken) {
      try {
        const response = await fetch('/api/auth/set-refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        });

        if (!response.ok) {
          console.warn('⚠️ Refresh Token 쿠키 저장 실패:', await response.text());
        } else {
          console.log('✅ Refresh Token이 HttpOnly 쿠키에 저장되었습니다.');
        }
      } catch (error) {
        console.error('❌ Refresh Token 쿠키 저장 중 오류:', error);
        // 쿠키 저장 실패해도 로그인은 계속 진행 (Access Token은 메모리에 저장됨)
      }
    }
  }

  /**
   * Save user info to Zustand store (메모리에만 저장)
   */
  saveUserInfo(userInfo: UserInfo): void {
    if (typeof window === 'undefined') return;
    useAuthStore.getState().setUserInfo(userInfo);
  }

  /**
   * Logout user (메모리에서 제거 및 HttpOnly 쿠키 삭제)
   */
  async logout(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    // Zustand 스토어에서 인증 정보 제거
    useAuthStore.getState().logout();
    
    // HttpOnly 쿠키에서 Refresh Token 삭제
    try {
      await fetch('/api/auth/set-refresh-token', {
        method: 'DELETE',
        credentials: 'include',
      });
      console.log('✅ Refresh Token 쿠키가 삭제되었습니다.');
    } catch (error) {
      console.error('❌ Refresh Token 쿠키 삭제 중 오류:', error);
    }
    
    window.location.href = '/';
  }
}

// Export singleton instance as AuthService
export const AuthService = new AuthServiceClass();

