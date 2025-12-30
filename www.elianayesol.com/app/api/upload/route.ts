import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { spawn } from 'child_process';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '파일이 제공되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 10MB 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '이미지 파일만 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // cv.aifixr.site/app/data/yolo 경로로 저장
    // 프로젝트 루트 기준으로 상대 경로 계산
    const projectRoot = process.cwd();
    const targetDir = join(projectRoot, '..', 'cv.aifixr.site', 'app', 'data', 'yolo');
    
    // 디렉토리가 없으면 생성
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true });
    }

    // 파일 저장
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = file.name;
    const targetPath = join(targetDir, fileName);

    await writeFile(targetPath, buffer);

    // YOLO 디텍션 자동 실행
    // 주의: yolo_detection.py는 삭제되었습니다.
    // FastAPI 서버(main.py)를 사용해야 합니다.
    // Fallback 기능은 더 이상 지원하지 않습니다.
    const detectionResult = {
      started: false,
      completed: false,
      error: 'yolo_detection.py가 삭제되었습니다. FastAPI 서버(cv.aifixr.site/app/yolo/main.py)를 실행하세요.',
    };
    console.warn('[YOLO] yolo_detection.py가 삭제되었습니다. FastAPI 서버를 사용하세요.');

    return NextResponse.json({
      success: true,
      message: '파일이 성공적으로 업로드되었습니다.',
      fileName: fileName,
      fileSize: file.size,
      fileType: file.type,
      targetPath: targetPath,
      detection: detectionResult,
      // 디텍션 완료 여부와 결과 파일명 포함
      detectedFileName: detectionResult?.completed ? fileName.replace(/\.(jpg|jpeg|png)$/i, '_detected.$1') : null,
    });
  } catch (error) {
    console.error('파일 업로드 오류:', error);
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다.', details: String(error) },
      { status: 500 }
    );
  }
}

