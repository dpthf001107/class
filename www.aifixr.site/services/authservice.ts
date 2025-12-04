// services/authservice.ts
export const AuthService = (() => {
  // 백엔드에서 모든 설정을 처리하므로 하드코딩
  const API_BASE_URL = 'http://localhost:8080';

  /**
   * 구글 로그인 시작
   */
  async function handleGoogleLogin() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/oauth/google/auth-url`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error("구글 인증 URL을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("구글 로그인 URL 요청 실패:", error);
      alert("구글 로그인을 시작할 수 없습니다.");
    }
  }

  /**
   * 구글 로그인 콜백 처리
   */
  async function handleGoogleCallback(code: string, state: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/oauth/google/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, state }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "로그인 실패");

      return data;
    } catch (error) {
      console.error("구글 로그인 처리 실패:", error);
      throw error;
    }
  }

  /**
   * 카카오 로그인 시작
   */
  async function handleKakaoLogin() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/oauth/kakao/auth-url`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error("카카오 인증 URL을 받지 못했습니다.");
      }
    } catch (error) {
      console.error("카카오 로그인 URL 요청 실패:", error);
      alert("카카오 로그인을 시작할 수 없습니다.");
    }
  }

  /**
   * 로그아웃
   */
  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_info");
  }

  /**
   * 인증 상태 확인
   */
  function isAuthenticated(): boolean {
    const token = localStorage.getItem("access_token");
    return !!token;
  }

  /**
   * 현재 사용자 정보 조회
   */
  function getCurrentUser() {
    const userInfo = localStorage.getItem("user_info");
    return userInfo ? JSON.parse(userInfo) : null;
  }

  return {
    handleGoogleLogin,
    handleGoogleCallback,
    handleKakaoLogin,
    logout,
    isAuthenticated,
    getCurrentUser,
  };
})();

