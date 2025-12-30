/**
 * Authentication Service
 * Handles OAuth login flows (Google, Kakao, etc.)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  refreshToken?: string;
  user?: any;
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
      
      // 1. Request Google authentication URL from backend
      const response = await fetch(`${API_BASE_URL}/api/oauth/google/auth-url`, {
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
      // TODO: Implement Kakao login
      console.log('Kakao login not implemented yet');
      alert('카카오 로그인은 아직 구현되지 않았습니다.');
    } catch (error) {
      console.error('Kakao login failed:', error);
      alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
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
      return data;
    } catch (error) {
      console.error('Google callback failed:', error);
      throw error;
    }
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  /**
   * Get stored refresh token
   */
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  }

  /**
   * Get stored user info
   */
  getUserInfo(): any | null {
    if (typeof window === 'undefined') return null;
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.getAccessToken() !== null;
  }

  /**
   * Logout user
   */
  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    window.location.href = '/';
  }
}

// Export singleton instance as AuthService
export const AuthService = new AuthServiceClass();

