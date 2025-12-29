"""
FastAPI 서버 - 멀티파트 파일 업로드 및 YOLO 디텍션 처리
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import shutil
from pathlib import Path
import sys

# 프로젝트 루트 경로 계산 (먼저 계산)
current_dir = Path(__file__).parent  # app/yolo
project_root = current_dir.parent.parent  # cv.aifixr.site
data_dir = project_root / "app" / "data" / "yolo"

# 디텍션 모듈 import
sys.path.insert(0, str(current_dir))
from yolo_face_detection import detect_faces_yolo
from yolo_general_detection import detect_objects_yolo
from yolo_segment import segment_objects_yolo

app = FastAPI(title="YOLO Face Detection API")

# CORS 설정 (Next.js에서 접근 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """헬스 체크 엔드포인트"""
    return {"message": "YOLO Face Detection API", "status": "running"}


@app.post("/api/cv/yolo/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    멀티파트 파일 업로드 및 자동 디텍션
    
    Args:
        file: 업로드된 이미지 파일 (multipart/form-data)
    
    Returns:
        업로드 및 디텍션 결과
    """
    try:
        # 파일 유효성 검사
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="이미지 파일만 업로드 가능합니다.")
        
        # 파일 크기 제한 (10MB)
        file_content = await file.read()
        if len(file_content) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="파일 크기는 10MB 이하여야 합니다.")
        
        # 데이터 디렉토리 생성
        data_dir.mkdir(parents=True, exist_ok=True)
        
        # 파일 저장
        file_path = data_dir / file.filename
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        print(f"[FastAPI] 파일 저장 완료: {file_path}")
        
        # 파일명 기반 경로 생성
        file_stem = Path(file.filename).stem
        
        # 1. YOLOv8 Face 디텍션 실행 (얼굴 전용)
        face_detection_result = None
        face_detected_file_path = None
        try:
            print(f"\n[FastAPI] 얼굴 디텍션 시작...")
            # 정확도 최적화: 낮은 conf로 후보 찾고 최고 confidence 선택
            face_detection_result = detect_faces_yolo(
                str(file_path),
                conf_threshold=0.3,   # 최종 필터링용 (적절한 임계값)
                iou_threshold=0.45,
                imgsz=1280,           # 높은 해상도로 정확도 향상
                draw_keypoints=True
            )
            face_detected_file_path = data_dir / f"{file_stem}_face_detected.jpg"
            print(f"[FastAPI] 얼굴 디텍션 완료")
        except Exception as e:
            print(f"[FastAPI] 얼굴 디텍션 오류: {e}")
            import traceback
            traceback.print_exc()
        
        # 2. YOLO11 일반 객체 디텍션 실행 (person, car 등)
        general_detection_result = None
        general_detected_file_path = None
        try:
            print(f"\n{'='*60}")
            print(f"[FastAPI] 일반 객체 디텍션 시작...")
            print(f"[FastAPI] 이미지 경로: {file_path}")
            print(f"[FastAPI] 파일 존재 여부: {file_path.exists()}")
            general_detection_result = detect_objects_yolo(str(file_path))
            general_detected_file_path = data_dir / f"{file_stem}_detected.jpg"
            print(f"[FastAPI] 일반 객체 디텍션 완료")
            print(f"[FastAPI] 결과 파일 경로: {general_detected_file_path}")
            print(f"[FastAPI] 결과 파일 존재 여부: {general_detected_file_path.exists() if general_detected_file_path else False}")
            print(f"{'='*60}\n")
        except Exception as e:
            print(f"\n{'='*60}")
            print(f"[FastAPI] 일반 객체 디텍션 오류: {e}")
            import traceback
            traceback.print_exc()
            print(f"{'='*60}\n")
        
        # 3. YOLOv8 Segmentation 실행 (객체 분할)
        segmentation_result = None
        segmented_file_path = None
        try:
            print(f"\n{'='*60}")
            print(f"[FastAPI] 세그멘테이션 시작...")
            print(f"[FastAPI] 이미지 경로: {file_path}")
            segmentation_result = segment_objects_yolo(str(file_path))
            segmented_file_path = data_dir / f"{file_stem}_segmented.jpg"
            print(f"[FastAPI] 세그멘테이션 완료")
            print(f"[FastAPI] 결과 파일 경로: {segmented_file_path}")
            print(f"[FastAPI] 결과 파일 존재 여부: {segmented_file_path.exists() if segmented_file_path else False}")
            print(f"{'='*60}\n")
        except Exception as e:
            print(f"\n{'='*60}")
            print(f"[FastAPI] 세그멘테이션 오류: {e}")
            import traceback
            traceback.print_exc()
            print(f"{'='*60}\n")
        
        # 결과 반환
        return JSONResponse({
            "success": True,
            "message": "파일 업로드 및 디텍션이 완료되었습니다.",
            "fileName": file.filename,
            "fileSize": len(file_content),
            "fileType": file.content_type,
            "targetPath": str(file_path),
            "faceDetection": {
                "completed": face_detection_result.get("success", False) if face_detection_result else False,
                "totalFaces": face_detection_result.get("total_objects", 0) if face_detection_result else 0,
                "resultPath": str(face_detected_file_path) if face_detected_file_path and face_detected_file_path.exists() else None,
                "averageConfidence": face_detection_result.get("detected_objects", {}).get("face", {}).get("average_confidence", 0) if face_detection_result else 0,
                "maxConfidence": face_detection_result.get("detected_objects", {}).get("face", {}).get("max_confidence", 0) if face_detection_result else 0,
            },
            "generalDetection": {
                "completed": general_detection_result.get("success", False) if general_detection_result else False,
                "totalObjects": general_detection_result.get("total_objects", 0) if general_detection_result else 0,
                "resultPath": str(general_detected_file_path) if general_detected_file_path and general_detected_file_path.exists() else None,
            },
            "segmentation": {
                "completed": segmentation_result.get("success", False) if segmentation_result else False,
                "totalObjects": segmentation_result.get("total_objects", 0) if segmentation_result else 0,
                "resultPath": str(segmented_file_path) if segmented_file_path and segmented_file_path.exists() else None,
            },
            "faceDetectedFileName": f"{file_stem}_face_detected.jpg" if face_detected_file_path and face_detected_file_path.exists() else None,
            "detectedFileName": f"{file_stem}_detected.jpg" if general_detected_file_path and general_detected_file_path.exists() else None,
            "segmentedFileName": f"{file_stem}_segmented.jpg" if segmented_file_path and segmented_file_path.exists() else None,
        })
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[FastAPI] 업로드 오류: {e}")
        raise HTTPException(status_code=500, detail=f"파일 업로드 중 오류가 발생했습니다: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
