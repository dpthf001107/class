'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';

export default function UploadResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generalDetectedUrl, setGeneralDetectedUrl] = useState<string | null>(null);
  const [segmentedUrl, setSegmentedUrl] = useState<string | null>(null);
  const [faceDetectedUrl, setFaceDetectedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fileName = searchParams.get('file');
  // 얼굴 디텍션 결과 파일명
  const faceDetectedFileName = fileName ? fileName.replace(/\.(jpg|jpeg|png)$/i, '_face_detected.$1') : null;
  // 일반 객체 디텍션 결과 파일명
  const generalDetectedFileName = fileName ? fileName.replace(/\.(jpg|jpeg|png)$/i, '_detected.$1') : null;
  // 세그멘테이션 결과 파일명
  const segmentedFileName = fileName ? fileName.replace(/\.(jpg|jpeg|png)$/i, '_segmented.$1') : null;

  useEffect(() => {
    if (!fileName) {
      setError('파일명이 제공되지 않았습니다.');
      setLoading(false);
      return;
    }

    // 이미지 로드 시도
    const loadImages = async () => {
      try {
        // API를 통해 이미지 로드
        const faceDetectedUrl = `/api/image?path=${encodeURIComponent(`../vision.elianayesol.com/app/data/yolo/${faceDetectedFileName}`)}`;
        const originalUrl = `/api/image?path=${encodeURIComponent(`../vision.elianayesol.com/app/data/yolo/${fileName}`)}`;
        const generalDetectedUrl = `/api/image?path=${encodeURIComponent(`../vision.elianayesol.com/app/data/yolo/${generalDetectedFileName}`)}`;
        const segmentedUrl = `/api/image?path=${encodeURIComponent(`../vision.elianayesol.com/app/data/yolo/${segmentedFileName}`)}`;
        
        // 이미지가 실제로 존재하는지 확인
        const checkImage = async (url: string) => {
          try {
            const response = await fetch(url, { cache: 'no-store' });
            return response.ok ? url : null;
          } catch {
            return null;
          }
        };
        
        // 디텍션된 이미지 확인 (최대 10초 대기)
        let faceDetectedUrlValid = null;
        for (let i = 0; i < 20; i++) {
          faceDetectedUrlValid = await checkImage(faceDetectedUrl);
          if (faceDetectedUrlValid) break;
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const originalUrlValid = await checkImage(originalUrl);
        const generalDetectedUrlValid = await checkImage(generalDetectedUrl);
        const segmentedUrlValid = await checkImage(segmentedUrl);
        
        if (faceDetectedUrlValid) {
          setFaceDetectedUrl(faceDetectedUrlValid);
        }
        
        if (originalUrlValid) {
          setOriginalImageUrl(originalUrlValid);
        }
        
        if (generalDetectedUrlValid) {
          setGeneralDetectedUrl(generalDetectedUrlValid);
        }
        
        if (segmentedUrlValid) {
          setSegmentedUrl(segmentedUrlValid);
        }
        
        // 하나라도 이미지가 있으면 성공
        if (faceDetectedUrlValid || originalUrlValid || generalDetectedUrlValid || segmentedUrlValid) {
          setImageUrl(faceDetectedUrlValid || originalUrlValid || generalDetectedUrlValid || segmentedUrlValid);
        } else {
          setError('디텍션 결과 이미지를 찾을 수 없습니다. 잠시 후 다시 시도해주세요.');
        }
        
        setLoading(false);
      } catch (err) {
        setError('이미지를 불러올 수 없습니다.');
        setLoading(false);
      }
    };

    loadImages();
  }, [fileName, faceDetectedFileName, generalDetectedFileName, segmentedFileName]);

  return (
    <div className="min-h-screen bg-white">
      {/* Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/upload')}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              업로드 페이지로 돌아가기
            </Button>
            <h1 className="text-3xl font-bold text-[#1a2332] mb-2">
              디텍션 결과
            </h1>
            <p className="text-gray-600">
              얼굴 디텍션, 객체 디텍션, 세그멘테이션이 완료되었습니다.
            </p>
          </div>

          {/* 결과 영역 */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-16 text-center">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">이미지를 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center text-red-600">
                <p className="text-lg font-medium">{error}</p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {/* 원본 이미지 */}
              {originalImageUrl && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-[#1a2332] mb-4">원본 이미지</h2>
                  <div className="relative">
                    <img
                      src={originalImageUrl}
                      alt="원본 이미지"
                      className="w-full rounded-lg object-contain max-h-[600px] mx-auto"
                      onError={() => setError('원본 이미지를 불러올 수 없습니다.')}
                    />
                  </div>
                  {fileName && (
                    <p className="text-sm text-gray-500 mt-2 text-center">{fileName}</p>
                  )}
                </div>
              )}

              {/* 얼굴 디텍션 결과 이미지 */}
              {faceDetectedUrl && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-[#1a2332] mb-4">얼굴 디텍션 결과</h2>
                  <div className="relative">
                    <img
                      src={faceDetectedUrl}
                      alt="얼굴 디텍션 결과"
                      className="w-full rounded-lg object-contain max-h-[600px] mx-auto"
                      onError={() => setError('얼굴 디텍션 결과 이미지를 불러올 수 없습니다.')}
                    />
                  </div>
                  {faceDetectedFileName && (
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <p className="text-sm text-gray-500">{faceDetectedFileName}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (faceDetectedUrl) {
                            const link = document.createElement('a');
                            link.href = faceDetectedUrl;
                            link.download = faceDetectedFileName || 'face_detected.jpg';
                            link.click();
                          }
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        다운로드
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* 일반 객체 디텍션 결과 이미지 */}
              {generalDetectedUrl && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-[#1a2332] mb-4">객체 디텍션 결과</h2>
                  <div className="relative">
                    <img
                      src={generalDetectedUrl}
                      alt="객체 디텍션 결과"
                      className="w-full rounded-lg object-contain max-h-[600px] mx-auto"
                      onError={() => setError('객체 디텍션 결과 이미지를 불러올 수 없습니다.')}
                    />
                  </div>
                  {generalDetectedFileName && (
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <p className="text-sm text-gray-500">{generalDetectedFileName}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (generalDetectedUrl) {
                            const link = document.createElement('a');
                            link.href = generalDetectedUrl;
                            link.download = generalDetectedFileName || 'detected.jpg';
                            link.click();
                          }
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        다운로드
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* 세그멘테이션 결과 이미지 */}
              {segmentedUrl && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-[#1a2332] mb-4">세그멘테이션 결과</h2>
                  <div className="relative">
                    <img
                      src={segmentedUrl}
                      alt="세그멘테이션 결과"
                      className="w-full rounded-lg object-contain max-h-[600px] mx-auto"
                      onError={() => setError('세그멘테이션 결과 이미지를 불러올 수 없습니다.')}
                    />
                  </div>
                  {segmentedFileName && (
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <p className="text-sm text-gray-500">{segmentedFileName}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (segmentedUrl) {
                            const link = document.createElement('a');
                            link.href = segmentedUrl;
                            link.download = segmentedFileName || 'segmented.jpg';
                            link.click();
                          }
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        다운로드
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

