"""
YOLO11 일반 객체 디텍션 모듈
yolo11n.pt 모델을 사용하여 일반 객체 디텍션 (person, car, dog 등)
"""
import cv2
import os
from pathlib import Path
from ultralytics import YOLO


def detect_objects_yolo(
    image_path: str, 
    model_path: str = None, 
    save_result: bool = True,
    conf_threshold: float = 0.25
) -> dict:
    """
    YOLO11 모델로 일반 객체 디텍션
    
    Args:
        image_path: 이미지 파일 경로
        model_path: YOLO 모델 경로 (None이면 기본 경로)
        save_result: 결과 이미지 저장 여부
        conf_threshold: Confidence 임계값 (0.0 ~ 1.0)
        
    Returns:
        디텍션 결과 딕셔너리
    """
    try:
        # 스크립트 디렉토리 기준 경로 설정
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 모델 경로 설정
        if model_path is None:
            model_path = os.path.join(script_dir, '../data/yolo/yolo11n.pt')
        
        # 모델 존재 확인
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"YOLO 모델을 찾을 수 없습니다: {model_path}")
        
        # 이미지 확인
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"이미지 파일을 찾을 수 없습니다: {image_path}")
        
        print(f"\n[YOLO11] 객체 감지 중: {image_path}")
        print(f"[YOLO11] 모델: {Path(model_path).name}")
        
        # YOLO 모델 로드
        model = YOLO(model_path)
        
        # 추론 실행
        results = model(image_path, conf=conf_threshold, verbose=False)
        
        # 결과 처리
        object_detections = []
        detected_classes = {}
        
        for result in results:
            boxes = result.boxes
            
            for idx, box in enumerate(boxes):
                # Bounding box 정보
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                confidence = float(box.conf[0].cpu().numpy())
                class_id = int(box.cls[0].cpu().numpy())
                class_name = model.names[class_id]
                
                detection = {
                    'bbox': (int(x1), int(y1), int(x2), int(y2)),
                    'confidence': confidence,
                    'class_id': class_id,
                    'class_name': class_name
                }
                
                object_detections.append(detection)
                
                # 클래스별 카운트
                if class_name not in detected_classes:
                    detected_classes[class_name] = []
                detected_classes[class_name].append(confidence)
                
                print(f"[YOLO11] {class_name} {len(detected_classes[class_name])}: "
                      f"좌표 ({int(x1)}, {int(y1)}, {int(x2)}, {int(y2)}), "
                      f"정확도: {confidence:.2%}")
        
        # 결과 이미지 저장
        result_image_path = None
        if save_result:
            # result.save()를 사용하여 자동으로 바운딩 박스 그리기
            result_image_path = os.path.join(os.path.dirname(image_path), 
                                            f"{Path(image_path).stem}_detected.jpg")
            
            # 결과 이미지 저장 (ultralytics가 자동으로 그려줌)
            results[0].save(filename=result_image_path)
            
            print(f"\n{'='*60}")
            print(f"[YOLO11] 결과 이미지 저장 완료!")
            print(f"[YOLO11] 저장 위치: {os.path.abspath(result_image_path)}")
            print(f"{'='*60}")
        
        # 클래스별 통계 계산
        class_stats = {}
        for class_name, confidences in detected_classes.items():
            class_stats[class_name] = {
                'count': len(confidences),
                'average_confidence': sum(confidences) / len(confidences),
                'max_confidence': max(confidences),
                'min_confidence': min(confidences)
            }
        
        # 결과 반환
        detection_results = {
            'success': True,
            'image_path': image_path,
            'model': 'YOLO11',
            'detected_objects': class_stats,
            'total_objects': len(object_detections),
            'detections': object_detections,
            'result_image_path': result_image_path,
            'error': None
        }
        
        # 요약 출력
        print(f"\n[YOLO11] 감지된 객체 (총 {len(object_detections)}개):")
        for class_name, stats in class_stats.items():
            print(f"  - {class_name}: {stats['count']}개 (평균 정확도: {stats['average_confidence']:.2%})")
        
        return detection_results
        
    except Exception as e:
        print(f"[YOLO11] 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        
        return {
            'success': False,
            'image_path': image_path,
            'model': 'YOLO11',
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
        result = detect_objects_yolo(test_image)
        print(f"\n결과: {result['success']}")
    else:
        print("테스트할 이미지가 없습니다.")

