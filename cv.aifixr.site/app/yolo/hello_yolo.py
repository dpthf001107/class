from ultralytics import YOLO
import torch
import os

print("HELLO YOLO!")

# 스크립트 파일의 디렉토리 기준으로 경로 설정
script_dir = os.path.dirname(os.path.abspath(__file__))

# 걸어가는 사람들이 나오는 이미지 (YOLO 공식 샘플 이미지)
# 버스와 보행자들이 있는 이미지 사용
sample_image_url = 'https://ultralytics.com/images/bus.jpg'

# 로컬 이미지 경로 (선택사항)
image_path = os.path.join(script_dir, '../data/opencv/family.jpg')

# YOLO 모델 로드
try:
    model_path = os.path.join(script_dir, 'yolo11n.pt')
    model = YOLO(model_path)
    print(f"YOLO11 모델 로드 성공!")
    print(f"PyTorch 버전: {torch.__version__}")
    print(f"CUDA 사용 가능: {torch.cuda.is_available()}")
    if torch.cuda.is_available():
        print(f"CUDA 버전: {torch.version.cuda}")
        print(f"GPU: {torch.cuda.get_device_name(0)}")
    
    # 걸어가는 사람들이 나오는 이미지 사용 (온라인 샘플 이미지)
    print(f"이미지 소스: {sample_image_url}")
    print("(버스와 보행자들이 있는 이미지)")
    source = sample_image_url
    
    # YOLO 추론 수행
    print("\n객체 감지 중...")
    results = model(source)
        
    # 결과 시각화 및 저장
    for i, result in enumerate(results):
        # 결과 이미지 표시
        result.show()  # 이미지 창에 표시
        
        # 결과 이미지 저장
        output_path = os.path.join(script_dir, 'yolo_result.jpg')
        result.save(filename=output_path)
        print(f"결과 이미지 저장: {output_path}")
        
        # 감지된 객체 정보 출력
        print(f"\n감지된 객체:")
        detected_objects = {}
        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            class_name = model.names[class_id]
            
            # 같은 클래스의 객체 수 카운트
            if class_name not in detected_objects:
                detected_objects[class_name] = []
            detected_objects[class_name].append(confidence)
        
        # 객체별로 정리해서 출력
        for obj_name, confidences in detected_objects.items():
            count = len(confidences)
            avg_conf = sum(confidences) / len(confidences)
            print(f"  - {obj_name}: {count}개 (평균 신뢰도: {avg_conf:.2%})")
    
    print("\n아무 키나 누르면 창이 닫힙니다...")
    input()  # 사용자 입력 대기
        
except Exception as e:
    print(f"오류 발생: {e}")
    import traceback
    traceback.print_exc()

