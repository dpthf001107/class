"""
YOLOv8 Face 디텍션 모듈
yolov8n-face.pt 모델을 사용하여 얼굴만 디텍션
"""
import cv2
import os
import numpy as np
from pathlib import Path
from ultralytics import YOLO


def detect_faces_yolo(
    image_path: str, 
    model_path: str = None, 
    save_result: bool = True,
    conf_threshold: float = 0.25,
    iou_threshold: float = 0.45,
    draw_keypoints: bool = True,
    imgsz: int = 1280  # 높은 해상도 = 높은 정확도 (640 기본, 1280 권장)
) -> dict:
    """
    YOLOv8 Face 모델로 얼굴 디텍션
    
    Args:
        image_path: 이미지 파일 경로
        model_path: YOLO Face 모델 경로 (None이면 기본 경로)
        save_result: 결과 이미지 저장 여부
        conf_threshold: Confidence 임계값 (0.0 ~ 1.0, 낮을수록 더 많은 후보 감지)
        iou_threshold: IoU 임계값 (NMS용, 0.0 ~ 1.0)
        draw_keypoints: Keypoint 그릴지 여부
        imgsz: 추론 이미지 크기 (높을수록 정확도 향상, 기본 640)
        
    Returns:
        디텍션 결과 딕셔너리
    """
    try:
        # 스크립트 디렉토리 기준 경로 설정
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 모델 경로 설정
        if model_path is None:
            model_path = os.path.join(script_dir, '../data/yolo/yolov8n-face.pt')
        
        # 모델 존재 확인
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"YOLO Face 모델을 찾을 수 없습니다: {model_path}")
        
        # 이미지 확인
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"이미지 파일을 찾을 수 없습니다: {image_path}")
        
        print(f"\n[YOLOv8 Face] 얼굴 감지 중: {image_path}")
        print(f"[YOLOv8 Face] 모델: {Path(model_path).name}")
        print(f"[YOLOv8 Face] 이미지 해상도: {imgsz}px (높을수록 정확도 향상)")
        
        # 이미지 확인 (결과 그리기용으로만 사용)
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"이미지를 읽을 수 없습니다: {image_path}")
        
        # YOLO 모델 로드
        model = YOLO(model_path)
        
        # 추론 실행 (정확도 최적화)
        # conf를 낮춰서 더 많은 후보를 찾고, 최고 confidence를 선택
        results = model(
            image_path,
            conf=0.1,  # 낮은 임계값으로 더 많은 후보 찾기
            iou=iou_threshold,
            imgsz=imgsz,
            verbose=False
        )
        
        # 결과 처리
        face_detections = []
        img = cv2.imread(image_path)
        
        if img is None:
            raise ValueError(f"이미지를 읽을 수 없습니다: {image_path}")
        
        for result in results:
            boxes = result.boxes
            keypoints = result.keypoints if hasattr(result, 'keypoints') and result.keypoints is not None else None
            
            for idx, box in enumerate(boxes):
                # Bounding box 정보
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                confidence = float(box.conf[0].cpu().numpy())
                
                detection = {
                    'bbox': (int(x1), int(y1), int(x2), int(y2)),
                    'confidence': confidence
                }
                
                # Keypoint 정보 추가
                if keypoints is not None and len(keypoints) > idx:
                    try:
                        kpts = keypoints[idx].xy[0].cpu().numpy()
                        detection['keypoints'] = [
                            {'x': float(kpt[0]), 'y': float(kpt[1])} 
                            for kpt in kpts
                        ]
                    except:
                        detection['keypoints'] = []
                else:
                    detection['keypoints'] = []
                
                face_detections.append(detection)
        
        # 최고 confidence만 선택 (항상 최고값 사용)
        if face_detections:
            # 모든 후보 중 최고 confidence 선택
            all_detections = face_detections.copy()
            best = max(all_detections, key=lambda x: x['confidence'])
            face_detections = [best]
            
            if len(all_detections) > 1:
                all_confidences = [d['confidence'] for d in all_detections]
                print(f"[YOLOv8 Face] 후보 {len(all_detections)}개 중 최고 confidence 선택: {best['confidence']:.2%}")
                print(f"[YOLOv8 Face] 후보 confidence 범위: {min(all_confidences):.2%} ~ {max(all_confidences):.2%}")
        
        # 결과 이미지 그리기
        result_image_path = None
        if save_result and len(face_detections) > 0:
            for detection in face_detections:
                x1, y1, x2, y2 = detection['bbox']
                conf = detection['confidence']
                
                # 바운딩 박스 (녹색)
                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                
                # Confidence 라벨
                label = f'face {conf:.2%}'
                label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                cv2.rectangle(img, (x1, y1 - label_size[1] - 10), 
                            (x1 + label_size[0], y1), (0, 255, 0), -1)
                cv2.putText(img, label, (x1, y1 - 5), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                
                # Keypoints 그리기
                if draw_keypoints and 'keypoints' in detection and len(detection['keypoints']) > 0:
                    for kpt in detection['keypoints']:
                        x, y = int(kpt['x']), int(kpt['y'])
                        cv2.circle(img, (x, y), 3, (255, 0, 0), -1)
            
            # 결과 이미지 저장 (얼굴 디텍션 전용 파일명)
            result_dir = os.path.dirname(image_path)
            image_name = Path(image_path).stem
            result_image_path = os.path.join(result_dir, f"{image_name}_face_detected.jpg")
            cv2.imwrite(result_image_path, img)
            
            print(f"\n{'='*60}")
            print(f"[YOLOv8 Face] 결과 이미지 저장 완료!")
            print(f"[YOLOv8 Face] 저장 위치: {os.path.abspath(result_image_path)}")
            print(f"{'='*60}")
        
        # 결과 반환
        detection_results = {
            'success': True,
            'image_path': image_path,
            'model': 'YOLOv8-Face',
            'detected_objects': {
                'face': {
                    'count': len(face_detections),
                    'average_confidence': sum(d['confidence'] for d in face_detections) / len(face_detections) if face_detections else 0,
                    'max_confidence': max((d['confidence'] for d in face_detections), default=0),
                    'min_confidence': min((d['confidence'] for d in face_detections), default=0),
                }
            },
            'total_objects': len(face_detections),
            'detections': face_detections,
            'result_image_path': result_image_path,
            'error': None
        }
        
        # 요약 출력
        print(f"\n[YOLOv8 Face] 감지된 얼굴 (총 {len(face_detections)}개):")
        if len(face_detections) > 0:
            face_info = detection_results['detected_objects']['face']
            print(f"  - 평균 정확도: {face_info['average_confidence']:.2%}")
            print(f"  - 최대 정확도: {face_info['max_confidence']:.2%}")
            print(f"  - 최소 정확도: {face_info['min_confidence']:.2%}")
        
        return detection_results
        
    except Exception as e:
        print(f"[YOLOv8 Face] 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        
        return {
            'success': False,
            'image_path': image_path,
            'model': 'YOLOv8-Face',
            'detected_objects': {},
            'total_objects': 0,
            'result_image_path': None,
            'error': str(e)
        }


if __name__ == "__main__":
    # 테스트
    import sys
    script_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.join(script_dir, '../data/yolo')
    
    # 테스트 이미지 찾기
    test_images = [f for f in os.listdir(data_dir) 
                   if f.endswith(('.jpg', '.jpeg', '.png')) 
                   and not f.endswith('_detected.jpg')
                   and not f.endswith('_face_detected.jpg')]
    
    if test_images:
        test_image = os.path.join(data_dir, test_images[0])
        print(f"테스트 이미지: {test_image}")
        result = detect_faces_yolo(test_image)
        print(f"\n결과: {result['success']}")
    else:
        print("테스트할 이미지가 없습니다.")

