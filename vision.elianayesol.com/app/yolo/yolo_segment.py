"""
YOLO Segmentation 모듈
yolov8n-seg.pt 모델을 사용하여 객체 세그멘테이션
"""
import cv2
import os
import numpy as np
from pathlib import Path
from ultralytics import YOLO


def segment_objects_yolo(
    image_path: str, 
    model_path: str = None, 
    save_result: bool = True,
    conf_threshold: float = 0.25,
    iou_threshold: float = 0.45,
    imgsz: int = 640  # 세그멘테이션은 640이 기본 (1280은 너무 느림)
) -> dict:
    """
    YOLO Segmentation 모델로 객체 분할
    
    Args:
        image_path: 이미지 파일 경로
        model_path: YOLO Seg 모델 경로 (None이면 기본 경로)
        save_result: 결과 이미지 저장 여부
        conf_threshold: Confidence 임계값 (0.0 ~ 1.0)
        iou_threshold: IoU 임계값 (NMS용, 0.0 ~ 1.0)
        imgsz: 추론 이미지 크기 (기본 640, 세그멘테이션은 높으면 느림)
        
    Returns:
        세그멘테이션 결과 딕셔너리
    """
    try:
        # 스크립트 디렉토리 기준 경로 설정
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 모델 경로 설정 (YOLOv8n-seg 사용)
        if model_path is None:
            model_path = os.path.join(script_dir, '../data/yolo/yolov8n-seg.pt')
        
        # 모델 존재 확인
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"YOLO Seg 모델을 찾을 수 없습니다: {model_path}")
        
        # 이미지 확인
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"이미지 파일을 찾을 수 없습니다: {image_path}")
        
        print(f"\n[YOLOv8 Seg] 객체 분할 중: {image_path}")
        print(f"[YOLOv8 Seg] 모델: {Path(model_path).name}")
        print(f"[YOLOv8 Seg] 이미지 해상도: {imgsz}px")
        
        # 이미지 로드
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"이미지를 읽을 수 없습니다: {image_path}")
        
        # YOLO 모델 로드
        model = YOLO(model_path)
        
        # 추론 실행
        results = model(
            image_path,
            conf=conf_threshold,
            iou=iou_threshold,
            imgsz=imgsz,
            verbose=False
        )
        
        # 결과 처리
        segmentation_results = []
        detected_objects = {}
        
        for result in results:
            # 마스크가 없으면 스킵
            if result.masks is None:
                print("[YOLOv8 Seg] 경고: 마스크 데이터가 없습니다.")
                continue
            
            boxes = result.boxes
            masks = result.masks
            names = result.names
            
            for idx, (box, mask) in enumerate(zip(boxes, masks)):
                # Bounding box 정보
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                confidence = float(box.conf[0].cpu().numpy())
                class_id = int(box.cls[0].cpu().numpy())
                class_name = names[class_id]
                
                # 마스크 데이터 (원본 해상도로 리사이즈)
                mask_data = mask.data[0].cpu().numpy()
                mask_resized = cv2.resize(mask_data, (img.shape[1], img.shape[0]))
                
                seg_result = {
                    'bbox': (int(x1), int(y1), int(x2), int(y2)),
                    'confidence': confidence,
                    'class': class_name,
                    'class_id': class_id,
                    'mask': mask_resized  # 원본 이미지 크기로 리사이즈된 마스크
                }
                
                segmentation_results.append(seg_result)
                
                # 클래스별 카운트 및 통계
                if class_name not in detected_objects:
                    detected_objects[class_name] = {
                        'count': 0,
                        'confidences': []
                    }
                detected_objects[class_name]['count'] += 1
                detected_objects[class_name]['confidences'].append(confidence)
        
        # 결과 이미지 생성
        result_image_path = None
        if save_result and len(segmentation_results) > 0:
            # 오버레이용 이미지 복사
            overlay = img.copy()
            output = img.copy()
            
            # 각 객체에 랜덤 색상 할당
            np.random.seed(42)  # 일관된 색상을 위해 시드 고정
            colors = np.random.randint(0, 255, size=(len(segmentation_results), 3), dtype=np.uint8)
            
            # 각 객체에 대해 마스크와 바운딩 박스 그리기
            for idx, seg in enumerate(segmentation_results):
                # 마스크 적용
                mask = seg['mask']
                mask_bool = mask > 0.5
                
                # 색상 오버레이 (반투명)
                color = colors[idx].tolist()
                overlay[mask_bool] = color
                
                # 바운딩 박스
                x1, y1, x2, y2 = seg['bbox']
                cv2.rectangle(output, (x1, y1), (x2, y2), color, 2)
                
                # 라벨 (클래스명 + confidence)
                label = f"{seg['class']} {seg['confidence']:.2%}"
                label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                cv2.rectangle(output, (x1, y1 - label_size[1] - 10), 
                            (x1 + label_size[0], y1), color, -1)
                cv2.putText(output, label, (x1, y1 - 5), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            
            # 오버레이 합성 (원본 70% + 마스크 30%)
            result_img = cv2.addWeighted(output, 0.7, overlay, 0.3, 0)
            
            # 결과 이미지 저장
            result_dir = os.path.dirname(image_path)
            image_name = Path(image_path).stem
            result_image_path = os.path.join(result_dir, f"{image_name}_segmented.jpg")
            cv2.imwrite(result_image_path, result_img)
            
            print(f"\n{'='*60}")
            print(f"[YOLOv8 Seg] 결과 이미지 저장 완료!")
            print(f"[YOLOv8 Seg] 저장 위치: {os.path.abspath(result_image_path)}")
            print(f"{'='*60}")
        
        # 클래스별 통계 계산
        for class_name, data in detected_objects.items():
            confidences = data['confidences']
            data['average_confidence'] = sum(confidences) / len(confidences)
            data['max_confidence'] = max(confidences)
            data['min_confidence'] = min(confidences)
            del data['confidences']  # 반환 시 confidences 리스트는 제거
        
        # 결과 반환
        detection_results = {
            'success': True,
            'image_path': image_path,
            'model': 'YOLOv8-Seg',
            'detected_objects': detected_objects,
            'total_objects': len(segmentation_results),
            'segmentations': segmentation_results,
            'result_image_path': result_image_path,
            'error': None
        }
        
        # 요약 출력
        print(f"\n[YOLOv8 Seg] 분할된 객체 (총 {len(segmentation_results)}개):")
        if len(segmentation_results) > 0:
            for class_name, data in detected_objects.items():
                print(f"  - {class_name}: {data['count']}개 (평균 정확도: {data['average_confidence']:.2%})")
        
        return detection_results
        
    except Exception as e:
        print(f"[YOLOv8 Seg] 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        
        return {
            'success': False,
            'image_path': image_path,
            'model': 'YOLOv8-Seg',
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
    
    # 테스트 이미지 찾기 (원본 이미지만)
    test_images = [f for f in os.listdir(data_dir) 
                   if f.endswith(('.jpg', '.jpeg', '.png')) 
                   and not f.endswith('_detected.jpg')
                   and not f.endswith('_face_detected.jpg')
                   and not f.endswith('_segmented.jpg')]
    
    if test_images:
        test_image = os.path.join(data_dir, test_images[0])
        print(f"테스트 이미지: {test_image}")
        result = segment_objects_yolo(test_image)
        print(f"\n결과: {result['success']}")
        if result['success']:
            print(f"감지된 객체: {result['detected_objects']}")
    else:
        print("테스트할 이미지가 없습니다.")

