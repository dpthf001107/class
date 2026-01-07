'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '@/app/services/authservice';
import { useAuth } from '@/app/hooks/useAuth';

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('구글 로그인 처리 중...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 백엔드에서 리디렉션된 경우 (토큰이 쿼리 파라미터로 전달됨)
        const token = searchParams.get('token');
        const refreshToken = searchParams.get('refreshToken');
        const success = searchParams.get('success');
        const error = searchParams.get('error');

        // 에러 처리
        if (error) {
          setStatus('error');
          setMessage(`로그인 실패: ${decodeURIComponent(error)}`);
          return;
        }

        // 백엔드에서 리디렉션된 경우 (토큰이 이미 전달됨)
        if (success === 'true' && token) {
          // Access Token은 Zustand 스토어(메모리)에 저장
          await AuthService.saveTokens({
            accessToken: token,
          });
          
          // Refresh Token이 있으면 HttpOnly 쿠키에 저장
          if (refreshToken) {
            await AuthService.saveRefreshTokenToCookie(refreshToken);
          }

          setStatus('success');
          setMessage('로그인 성공!');
          
          // 2초 후 홈으로 리다이렉트
          setTimeout(() => {
            router.push('/');
          }, 2000);
          return;
        }

        // 기존 방식: code와 state로 백엔드에 요청
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          throw new Error('인가 코드 또는 state가 없습니다.');
        }

        // 백엔드로 code 전송
        // handleGoogleCallback 내부에서 이미 토큰 저장 처리됨
        const data = await AuthService.handleGoogleCallback(code, state);

        if (data.success && data.token) {
          // handleGoogleCallback에서 이미 처리됨:
          // - Access Token은 Zustand Store에 저장
          // - Refresh Token은 httpOnly 쿠키에 저장
          // - 사용자 정보도 저장됨
          
          setStatus('success');
          setMessage('로그인 성공!');
          
          // 2초 후 홈으로 리다이렉트
          setTimeout(() => {
            router.push('/');
          }, 2000);
        } else {
          throw new Error(data.message || '로그인 실패');
        }
      } catch (error: any) {
        console.error('로그인 실패:', error);
        setStatus('error');
        setMessage(error.message || '로그인 처리 중 오류가 발생했습니다.');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col items-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">로그인 처리 중</h2>
              <p className="text-gray-600 text-center">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">로그인 성공!</h2>
              <p className="text-gray-600 text-center">{message}</p>
              <p className="text-sm text-gray-500 mt-4">잠시 후 홈으로 이동합니다...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">로그인 실패</h2>
              <p className="text-gray-600 text-center mb-6">{message}</p>
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                홈으로 돌아가기
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">로딩 중...</h2>
            <p className="text-gray-600 text-center">페이지를 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}

