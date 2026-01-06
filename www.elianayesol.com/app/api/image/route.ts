import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join, resolve, normalize } from 'path';
import { existsSync } from 'fs';

// Next.js 16에서 API 라우트가 빌드 타임에 정적으로 생성되지 않도록 설정
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imagePath = searchParams.get('path');

    if (!imagePath) {
      return NextResponse.json(
        { error: '이미지 경로가 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 프로젝트 루트 기준으로 경로 계산
    const projectRoot = process.cwd();
    
    // 상대 경로를 절대 경로로 변환 (../ 포함)
    // resolve는 상대 경로를 올바르게 처리합니다
    const resolvedPath = resolve(projectRoot, imagePath);
    
    // 프로젝트 루트의 상위 디렉토리까지 허용 (vision.elianayesol.com 접근을 위해)
    const workspaceRoot = resolve(projectRoot, '..');
    
    // Windows 경로 대소문자 문제 해결을 위해 모두 소문자로 변환
    const normalizedResolved = normalize(resolvedPath).toLowerCase();
    const normalizedWorkspaceRoot = normalize(workspaceRoot).toLowerCase();
    
    console.log('[이미지 API] 경로 정보:', {
      imagePath,
      projectRoot,
      workspaceRoot,
      resolvedPath,
      normalizedResolved,
      normalizedWorkspaceRoot,
      startsWith: normalizedResolved.startsWith(normalizedWorkspaceRoot)
    });
    
    // 보안: 워크스페이스 루트 밖으로 나가는 경로 차단
    if (!normalizedResolved.startsWith(normalizedWorkspaceRoot)) {
      console.error('[이미지 API] 보안 검사 실패:', {
        resolvedPath: normalizedResolved,
        workspaceRoot: normalizedWorkspaceRoot
      });
      return NextResponse.json(
        { error: '잘못된 경로입니다.' },
        { status: 400 }
      );
    }
    
    const fullPath = resolvedPath;

    // 파일 존재 확인
    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: '이미지 파일을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 이미지 파일 읽기
    const imageBuffer = await readFile(fullPath);
    
    // MIME 타입 결정
    const ext = imagePath.toLowerCase().split('.').pop();
    const mimeTypes: { [key: string]: string } = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp',
    };
    const contentType = mimeTypes[ext || ''] || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('이미지 로드 오류:', error);
    return NextResponse.json(
      { error: '이미지를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

