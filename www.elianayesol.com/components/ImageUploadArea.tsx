'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface ImageUploadAreaProps {
  onUpload?: (file: File) => void;
  showBackButton?: boolean;
}

export default function ImageUploadArea({
  onUpload,
  showBackButton = false,
}: ImageUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = useCallback((file: File) => {
    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    setUploadedFile(file);
    
    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // 업로드 콜백 호출
    if (onUpload) {
      onUpload(file);
    }
  }, [onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setUploadedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[144px] pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          {showBackButton && (
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
          )}
          <h1 className="text-3xl font-bold text-[#1a2332] mb-2">
            사진 업로드
          </h1>
          <p className="text-gray-600">
            이미지를 드래그 앤 드롭하거나 클릭하여 선택하세요
          </p>
        </div>

        {/* 드래그 앤 드롭 영역 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleButtonClick}
            className={`
              relative border-2 border-dashed rounded-xl p-16
              transition-all duration-200 cursor-pointer
              ${
                isDragging
                  ? 'border-[#0D4ABB] bg-[#0D4ABB]/5 scale-[1.01]'
                  : uploadedFile
                  ? 'border-green-500 bg-green-50/50'
                  : 'border-gray-300 bg-gray-50/50 hover:border-[#0D4ABB] hover:bg-[#0D4ABB]/5'
              }
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {preview ? (
              <div className="space-y-6">
                <div className="relative inline-block mx-auto block">
                  <img
                    src={preview}
                    alt="미리보기"
                    className="max-h-[400px] max-w-full rounded-lg object-contain mx-auto shadow-md"
                  />
                  {uploadedFile && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2 shadow-lg">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-base font-medium text-gray-700">
                    {uploadedFile?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile?.size ? uploadedFile.size / 1024 / 1024 : 0).toFixed(2)} MB
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    업로드 완료!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div
                  className={`
                    w-24 h-24 rounded-full flex items-center justify-center
                    transition-colors duration-200
                    ${
                      isDragging
                        ? 'bg-[#0D4ABB] text-white'
                        : 'bg-gray-200 text-gray-400'
                    }
                  `}
                >
                  <Upload className="w-12 h-12" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-gray-700">
                    {isDragging ? '여기에 파일을 놓으세요' : '이미지를 드래그하거나 클릭하세요'}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF 파일 (최대 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 업로드 상태 메시지 */}
          {uploadStatus && (
            <div className={`mt-4 p-3 rounded-lg ${
              uploadStatus.success 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <p className="text-sm font-medium">{uploadStatus.message}</p>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!uploadedFile}
              className="px-6"
            >
              <X className="w-4 h-4 mr-2" />
              초기화
            </Button>
            <Button
              onClick={handleButtonClick}
              variant="outline"
              className="px-6"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              파일 선택
            </Button>
            {uploadedFile && (
              <Button
                onClick={async () => {
                  if (!uploadedFile) return;
                  
                  setIsUploading(true);
                  setUploadStatus(null);
                  
                  try {
                    const formData = new FormData();
                    formData.append('file', uploadedFile);
                    
                    // FastAPI 서버 URL (환경 변수 또는 기본값)
                    const fastApiUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';
                    
                    let response: Response;
                    let result: any;
                    
                    try {
                      // FastAPI 서버로 시도
                      response = await fetch(`${fastApiUrl}/api/cv/yolo/upload`, {
                        method: 'POST',
                        body: formData,
                        // Content-Type 헤더는 자동으로 설정되므로 명시하지 않음 (멀티파트)
                      });
                      
                      // 응답이 없거나 연결 실패한 경우
                      if (!response) {
                        throw new Error('FastAPI 서버에 연결할 수 없습니다.');
                      }
                      
                      result = await response.json();
                    } catch (fetchError: any) {
                      // FastAPI 서버가 실행되지 않은 경우, Next.js API Route로 Fallback
                      console.warn('FastAPI 서버 연결 실패, Next.js API Route로 전환:', fetchError.message);
                      
                      response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      });
                      
                      if (!response.ok) {
                        throw new Error(`FastAPI 서버가 실행되지 않았습니다. (${fastApiUrl})\n\nFastAPI 서버를 실행하려면:\n1. cd cv.aifixr.site/app/yolo\n2. python main.py\n\n또는 Next.js API Route를 사용하려면 서버를 재시작하세요.`);
                      }
                      
                      result = await response.json();
                    }
                    
                    if (response.ok) {
                      setUploadStatus({
                        success: true,
                        message: `파일이 성공적으로 업로드되었습니다: ${result.fileName}`,
                      });
                      
                      // 업로드 콜백 호출
                      if (onUpload) {
                        onUpload(uploadedFile);
                      }
                      
                      // 디텍션이 완료되었으면 결과 페이지로 이동
                      if (result.detection?.completed && result.detectedFileName) {
                        // 결과 페이지로 리다이렉트
                        router.push(`/upload/result?file=${encodeURIComponent(result.fileName)}`);
                      } else if (result.detectedFileName) {
                        // detectedFileName이 있으면 결과 페이지로 이동
                        router.push(`/upload/result?file=${encodeURIComponent(result.fileName)}`);
                      } else {
                        alert(`파일 업로드 완료!\n파일명: ${result.fileName}\n크기: ${(result.fileSize / 1024 / 1024).toFixed(2)} MB\n저장 경로: ${result.targetPath}\n\n디텍션이 진행 중입니다. 잠시 후 결과 페이지를 확인하세요.`);
                      }
                    } else {
                      setUploadStatus({
                        success: false,
                        message: result.error || '파일 업로드에 실패했습니다.',
                      });
                      alert(`업로드 실패: ${result.error || '알 수 없는 오류가 발생했습니다.'}`);
                    }
                  } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
                    setUploadStatus({
                      success: false,
                      message: errorMessage,
                    });
                    alert(`업로드 중 오류 발생: ${errorMessage}`);
                  } finally {
                    setIsUploading(false);
                  }
                }}
                disabled={isUploading}
                className="px-6 bg-gradient-to-r from-[#0D4ABB] to-[#00D4FF] text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? '업로드 중...' : '업로드'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

