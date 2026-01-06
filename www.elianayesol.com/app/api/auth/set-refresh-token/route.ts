import { NextRequest, NextResponse } from 'next/server';

/**
 * Refresh Token을 HttpOnly 쿠키에 저장하는 API Route
 * 클라이언트 측 JavaScript에서 직접 접근 불가 (보안 강화)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh Token이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // HttpOnly 쿠키로 Refresh Token 저장
    const response = NextResponse.json(
      { success: true, message: 'Refresh Token이 쿠키에 저장되었습니다.' },
      { status: 200 }
    );

    // HttpOnly, Secure, SameSite 설정
    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true, // JavaScript에서 접근 불가
      secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송
      sameSite: 'lax', // CSRF 공격 방지
      maxAge: 60 * 60 * 24 * 7, // 7일 (초 단위)
      path: '/', // 모든 경로에서 접근 가능
    });

    return response;
  } catch (error) {
    console.error('Refresh Token 쿠키 설정 실패:', error);
    return NextResponse.json(
      { success: false, error: 'Refresh Token 저장 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * Refresh Token 쿠키 삭제
 */
export async function DELETE() {
  try {
    const response = NextResponse.json(
      { success: true, message: 'Refresh Token 쿠키가 삭제되었습니다.' },
      { status: 200 }
    );

    // 쿠키 삭제
    response.cookies.delete('refresh_token');

    return response;
  } catch (error) {
    console.error('Refresh Token 쿠키 삭제 실패:', error);
    return NextResponse.json(
      { success: false, error: 'Refresh Token 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

