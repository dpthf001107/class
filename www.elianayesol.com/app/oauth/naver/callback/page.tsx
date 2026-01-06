'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '@/app/services/authservice';

function NaverCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('네이버 로그인 처리 중...');

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
          // Refresh Token은 HttpOnly 쿠키에 저장
          await AuthService.saveTokens({
            accessToken: token,
            refreshToken: refreshToken || undefined,
          });

          setStatus('success');
          setMessage('네이버 로그인 성공!');
          
          // 2초 후 홈으로 리다이렉트
          setTimeout(() => {
            router.push('/');
          }, 2000);
          return;
        }

        throw new Error('네이버 로그인 처리 중 오류가 발생했습니다.');
      } catch (error: any) {
        console.error('네이버 로그인 실패:', error);
        setStatus('error');
        setMessage(error.message || '네이버 로그인 처리 중 오류가 발생했습니다.');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col items-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">네이버 로그인 처리 중</h2>
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
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

export default function NaverCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">로딩 중...</h2>
            <p className="text-gray-600 text-center">페이지를 불러오는 중입니다...</p>
          </div>
        </div>
      </div>
    }>
      <NaverCallbackContent />
    </Suspense>
  );
}

