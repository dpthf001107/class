'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (file: File) => void;
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  onUpload,
}: ImageUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1a2332]">
            사진 업로드
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            이미지를 드래그 앤 드롭하거나 클릭하여 선택하세요
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 드래그 앤 드롭 영역 */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleButtonClick}
            className={`
              relative border-2 border-dashed rounded-xl p-12
              transition-all duration-200 cursor-pointer
              ${
                isDragging
                  ? 'border-blue-600 bg-blue-50 scale-[1.02]'
                  : uploadedFile
                  ? 'border-green-500 bg-green-50/50'
                  : 'border-gray-300 bg-gray-50/50 hover:border-blue-600 hover:bg-blue-50'
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
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={preview}
                    alt="미리보기"
                    className="max-h-[300px] max-w-full rounded-lg object-contain mx-auto"
                  />
                  {uploadedFile && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    {uploadedFile?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile?.size ? uploadedFile.size / 1024 / 1024 : 0).toFixed(2)} MB
                  </p>
                  <p className="text-sm text-green-600 font-medium">
                    업로드 완료!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div
                  className={`
                    w-20 h-20 rounded-full flex items-center justify-center
                    transition-colors duration-200
                    ${
                      isDragging
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }
                  `}
                >
                  <Upload className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">
                    {isDragging ? '여기에 파일을 놓으세요' : '이미지를 드래그하거나 클릭하세요'}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF 파일 (최대 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex items-center justify-end gap-3">
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
            <Button
              onClick={handleClose}
              className="px-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-lg"
            >
              완료
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

