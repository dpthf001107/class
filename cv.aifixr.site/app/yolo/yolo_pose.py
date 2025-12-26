"""
YOLO Pose Estimation 모듈
yolov8n-pose.pt 모델을 사용하여 포즈 에스티메이션 (스켈레톤 그리기)
"""
import cv2
import os
import numpy as np
from pathlib import Path
from ultralytics import YOLO


def estimate_pose_yolo(
    image_path: str, 
    model_path: str = None, 
    save_result: bool = True,
    conf_threshold: float = 0.25,
    iou_threshold: float = 0.45,
    imgsz: int = 640  # 포즈 에스티메이션은 640이 기본
) -> dict:
    """
    YOLO Pose Estimation 모델로 포즈 추정 및 스켈레톤 그리기
    
    Args:
        image_path: 이미지 파일 경로
        model_path: YOLO Pose 모델 경로 (None이면 기본 경로)
        save_result: 결과 이미지 저장 여부
        conf_threshold: Confidence 임계값 (0.0 ~ 1.0)
        iou_threshold: IoU 임계값 (NMS용, 0.0 ~ 1.0)
        imgsz: 추론 이미지 크기 (기본 640)
        
    Returns:
        포즈 에스티메이션 결과 딕셔너리
    """
    try:
        # 스크립트 디렉토리 기준 경로 설정
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 모델 경로 설정 (YOLOv8n-pose 사용)
        if model_path is None:
            model_path = os.path.join(script_dir, '../data/yolo/yolov8n-pose.pt')
        
        # 모델 존재 확인
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"YOLO Pose 모델을 찾을 수 없습니다: {model_path}")
        
        # 이미지 확인
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"이미지 파일을 찾을 수 없습니다: {image_path}")
        
        print(f"\n[YOLOv8 Pose] 포즈 추정 중: {image_path}")
        print(f"[YOLOv8 Pose] 모델: {Path(model_path).name}")
        print(f"[YOLOv8 Pose] 이미지 해상도: {imgsz}px")
        
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
        
        # COCO 포즈 키포인트 인덱스 (17개 키포인트)
        # 0: 코, 1-2: 왼쪽/오른쪽 눈, 3-4: 왼쪽/오른쪽 귀
        # 5-6: 왼쪽/오른쪽 어깨, 7-8: 왼쪽/오른쪽 팔꿈치
        # 9-10: 왼쪽/오른쪽 손목, 11-12: 왼쪽/오른쪽 엉덩이
        # 13-14: 왼쪽/오른쪽 무릎, 15-16: 왼쪽/오른쪽 발목
        KEYPOINT_NAMES = [
            'nose', 'left_eye', 'right_eye', 'left_ear', 'right_ear',
            'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
            'left_wrist', 'right_wrist', 'left_hip', 'right_hip',
            'left_knee', 'right_knee', 'left_ankle', 'right_ankle'
        ]
        
        # 스켈레톤 연결 정보 (키포인트 인덱스 쌍)
        SKELETON_CONNECTIONS = [
            # 머리
            (0, 1), (0, 2), (1, 3), (2, 4),  # 코-눈-귀
            # 상체
            (5, 6),  # 어깨
            (5, 7), (7, 9),  # 왼쪽 팔
            (6, 8), (8, 10),  # 오른쪽 팔
            (5, 11), (6, 12),  # 어깨-엉덩이
            (11, 12),  # 엉덩이
            # 하체
            (11, 13), (13, 15),  # 왼쪽 다리
            (12, 14), (14, 16),  # 오른쪽 다리
        ]
        
        # 결과 처리
        pose_results = []
        detected_objects = {}
        
        for result in results:
            # 키포인트가 없으면 스킵
            if result.keypoints is None:
                print("[YOLOv8 Pose] 경고: 키포인트 데이터가 없습니다.")
                continue
            
            boxes = result.boxes
            keypoints = result.keypoints
            names = result.names
            
            for idx, (box, kpts) in enumerate(zip(boxes, keypoints)):
                # Bounding box 정보
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                confidence = float(box.conf[0].cpu().numpy())
                class_id = int(box.cls[0].cpu().numpy())
                class_name = names[class_id]
                
                # 키포인트 데이터 추출
                kpts_data = kpts.xy[0].cpu().numpy()  # (17, 2) 형태
                kpts_confidence = kpts.conf[0].cpu().numpy() if hasattr(kpts, 'conf') else np.ones(17)  # 키포인트 신뢰도
                
                # 키포인트를 딕셔너리 형태로 변환
                keypoint_list = []
                for i, (kp, conf) in enumerate(zip(kpts_data, kpts_confidence)):
                    keypoint_list.append({
                        'name': KEYPOINT_NAMES[i] if i < len(KEYPOINT_NAMES) else f'keypoint_{i}',
                        'x': float(kp[0]),
                        'y': float(kp[1]),
                        'confidence': float(conf),
                        'visible': float(conf) > 0.5  # 신뢰도 0.5 이상이면 보이는 것으로 간주
                    })
                
                pose_result = {
                    'bbox': (int(x1), int(y1), int(x2), int(y2)),
                    'confidence': confidence,
                    'class': class_name,
                    'class_id': class_id,
                    'keypoints': keypoint_list,
                    'keypoints_data': kpts_data,  # 원본 데이터 (그리기용)
                    'keypoints_confidence': kpts_confidence
                }
                
                pose_results.append(pose_result)
                
                # 클래스별 카운트 및 통계
                if class_name not in detected_objects:
                    detected_objects[class_name] = {
                        'count': 0,
                        'confidences': []
                    }
                detected_objects[class_name]['count'] += 1
                detected_objects[class_name]['confidences'].append(confidence)
        
        # 결과 이미지 생성 (스켈레톤 그리기)
        result_image_path = None
        if save_result and len(pose_results) > 0:
            # 원본 이미지 복사
            output = img.copy()
            
            # 각 사람에 대해 스켈레톤 그리기
            for idx, pose in enumerate(pose_results):
                # 바운딩 박스 색상 (각 사람마다 다른 색상)
                color = (0, 255, 0) if idx == 0 else (255, 0, 0) if idx == 1 else (0, 0, 255)
                
                # 바운딩 박스 그리기
                x1, y1, x2, y2 = pose['bbox']
                cv2.rectangle(output, (x1, y1), (x2, y2), color, 2)
                
                # 라벨
                label = f"{pose['class']} {pose['confidence']:.2%}"
                label_size, _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                cv2.rectangle(output, (x1, y1 - label_size[1] - 10), 
                            (x1 + label_size[0], y1), color, -1)
                cv2.putText(output, label, (x1, y1 - 5), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                
                # 키포인트 그리기
                kpts_data = pose['keypoints_data']
                kpts_conf = pose['keypoints_confidence']
                
                # 스켈레톤 연결선 그리기
                for connection in SKELETON_CONNECTIONS:
                    pt1_idx, pt2_idx = connection
                    pt1 = kpts_data[pt1_idx]
                    pt2 = kpts_data[pt2_idx]
                    conf1 = kpts_conf[pt1_idx]
                    conf2 = kpts_conf[pt2_idx]
                    
                    # 두 키포인트 모두 신뢰도가 충분히 높을 때만 선 그리기
                    if conf1 > 0.5 and conf2 > 0.5:
                        pt1_int = (int(pt1[0]), int(pt1[1]))
                        pt2_int = (int(pt2[0]), int(pt2[1]))
                        cv2.line(output, pt1_int, pt2_int, color, 2)
                
                # 키포인트 점 그리기
                for i, (kp, conf) in enumerate(zip(kpts_data, kpts_conf)):
                    if conf > 0.5:  # 신뢰도가 충분히 높을 때만 그리기
                        kp_int = (int(kp[0]), int(kp[1]))
                        # 키포인트 종류에 따라 다른 색상/크기
                        if i == 0:  # 코
                            cv2.circle(output, kp_int, 5, (0, 255, 255), -1)
                        elif i in [1, 2]:  # 눈
                            cv2.circle(output, kp_int, 4, (255, 255, 0), -1)
                        elif i in [3, 4]:  # 귀
                            cv2.circle(output, kp_int, 4, (255, 0, 255), -1)
                        else:  # 나머지 키포인트
                            cv2.circle(output, kp_int, 3, color, -1)
            
            # 결과 이미지 저장
            result_dir = os.path.dirname(image_path)
            image_name = Path(image_path).stem
            result_image_path = os.path.join(result_dir, f"{image_name}_pose.jpg")
            cv2.imwrite(result_image_path, output)
            
            print(f"\n{'='*60}")
            print(f"[YOLOv8 Pose] 결과 이미지 저장 완료!")
            print(f"[YOLOv8 Pose] 저장 위치: {os.path.abspath(result_image_path)}")
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
            'model': 'YOLOv8-Pose',
            'detected_objects': detected_objects,
            'total_objects': len(pose_results),
            'poses': pose_results,
            'result_image_path': result_image_path,
            'error': None
        }
        
        # 요약 출력
        print(f"\n[YOLOv8 Pose] 감지된 포즈 (총 {len(pose_results)}개):")
        if len(pose_results) > 0:
            for class_name, data in detected_objects.items():
                print(f"  - {class_name}: {data['count']}개 (평균 정확도: {data['average_confidence']:.2%})")
            # 각 포즈의 키포인트 개수 출력
            for i, pose in enumerate(pose_results):
                visible_kpts = sum(1 for kp in pose['keypoints'] if kp['visible'])
                print(f"  - 포즈 {i+1}: {visible_kpts}/17 키포인트 감지")
        
        return detection_results
        
    except Exception as e:
        print(f"[YOLOv8 Pose] 오류 발생: {e}")
        import traceback
        traceback.print_exc()
        
        return {
            'success': False,
            'image_path': image_path,
            'model': 'YOLOv8-Pose',
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
                   and not f.endswith('_segmented.jpg')
                   and not f.endswith('_pose.jpg')]
    
    if test_images:
        test_image = os.path.join(data_dir, test_images[0])
        print(f"테스트 이미지: {test_image}")
        result = estimate_pose_yolo(test_image)
        print(f"\n결과: {result['success']}")
        if result['success']:
            print(f"감지된 객체: {result['detected_objects']}")
            if result['poses']:
                print(f"첫 번째 포즈의 키포인트 개수: {len(result['poses'][0]['keypoints'])}")
    else:
        print("테스트할 이미지가 없습니다.")

