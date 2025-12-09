from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Optional
import csv
import os
import logging
from .titanic_service import TitanicService

# Logger 설정
logger = logging.getLogger(__name__)

# 라우터 생성
router = APIRouter(
    tags=["타이타닉"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

# 응답 모델 정의
class PassengerResponse(BaseModel):
    """승객 정보 응답 모델"""
    passengerId: str
    name: str
    survived: str
    pclass: str
    sex: str
    age: Optional[str]
    fare: float
    embarked: Optional[str]
    rank: int
    survivedText: str
    pclassText: str

class Top10Response(BaseModel):
    """상위 10명 응답 모델"""
    success: bool
    data: List[PassengerResponse]
    total: int
    message: str

class ServiceStatusResponse(BaseModel):
    """서비스 상태 응답 모델"""
    message: str
    status: str

# 서비스 인스턴스 생성
# 컨테이너 내부 경로에 맞게 조정
def get_service() -> TitanicService:
    """TitanicService 인스턴스 반환"""
    return TitanicService()

def get_top_10_passengers() -> List[Dict]:
    """train.csv에서 리스트 순서대로 상위 10명을 반환"""
    # 현재 파일의 디렉토리 경로
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, 'train.csv')
    
    # CSV 파일 읽기
    passengers = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # 요금을 float로 변환 (빈 값은 0으로 처리)
            try:
                fare = float(row['Fare']) if row['Fare'] else 0.0
            except ValueError:
                fare = 0.0
            passengers.append({
                'passengerId': row['PassengerId'],
                'name': row['Name'],
                'survived': row['Survived'],
                'pclass': row['Pclass'],
                'sex': row['Sex'],
                'age': row['Age'] if row['Age'] else None,
                'fare': fare,
                'embarked': row['Embarked'] if row['Embarked'] else None
            })
    
    # 정렬 없이 리스트에서 순서대로 처음 10명만 반환
    top_10 = passengers[:10]
    
    # 순위 추가
    for rank, passenger in enumerate(top_10, 1):
        passenger['rank'] = rank
        passenger['survivedText'] = '생존' if passenger['survived'] == '1' else '사망'
        passenger['pclassText'] = f"{passenger['pclass']}등급"
    
    return top_10

@router.get(
    "/",
    response_model=ServiceStatusResponse,
    summary="타이타닉 서비스 상태 확인",
    description="타이타닉 서비스의 현재 상태를 확인합니다.",
    response_description="서비스 상태 정보"
)
async def titanic_root():
    """
    타이타닉 서비스 루트 엔드포인트
    
    - **message**: 서비스 메시지
    - **status**: 서비스 상태 (running)
    """
    return {"message": "Titanic Service", "status": "running"}

@router.get(
    "/preprocess",
    summary="데이터 전처리",
    description="타이타닉 데이터를 전처리합니다.",
    response_description="전처리 완료 메시지"
)
async def preprocess_data():
    """
    타이타닉 데이터 전처리를 수행합니다.
    
    - Train 데이터와 Test 데이터를 로드하고 전처리합니다.
    - 각 데이터의 타입, 컬럼, 상위 행, null 개수 등을 확인합니다.
    """
    try:
        service = get_service()
        service.preprocess()
        return {"message": "데이터 전처리가 완료되었습니다."}
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        return {
            "message": "데이터 전처리 중 오류가 발생했습니다.",
            "error": str(e),
            "detail": error_detail
        }

@router.get(
    "/top-10",
    response_model=Top10Response,
    summary="상위 10명 조회",
    description="타이타닉 승객 리스트에서 순서대로 상위 10명을 반환합니다.",
    response_description="상위 10명의 승객 정보와 통계"
)
async def get_top_10():
    """
    타이타닉 승객 리스트에서 순서대로 상위 10명을 반환합니다.
    
    ### 반환 정보
    - **success**: 요청 성공 여부
    - **data**: 상위 10명의 승객 정보 리스트
        - passengerId: 승객 ID
        - name: 승객 이름
        - survived: 생존 여부 (0: 사망, 1: 생존)
        - pclass: 객실 등급
        - sex: 성별
        - age: 나이
        - fare: 요금
        - embarked: 탑승 항구
        - rank: 순위
        - survivedText: 생존 여부 텍스트
        - pclassText: 객실 등급 텍스트
    - **total**: 전체 승객 수
    - **message**: 응답 메시지
    
    ### 예시
    ```json
    {
        "success": true,
        "data": [
            {
                "passengerId": "1",
                "name": "John Doe",
                "survived": "1",
                "pclass": "1",
                "sex": "male",
                "age": "30",
                "fare": 512.33,
                "embarked": "C",
                "rank": 1,
                "survivedText": "생존",
                "pclassText": "1등급"
            }
        ],
        "total": 891,
        "message": "총 891명 중 상위 10명을 반환했습니다."
    }
    ```
    """
    top_10 = get_top_10_passengers()
    total_count = 891  # 타이타닉 데이터셋의 총 승객 수
    return {
        "success": True,
        "data": top_10,
        "total": total_count,
        "message": f"총 {total_count}명 중 상위 10명을 반환했습니다."
    }

@router.get(
    "/evaluate",
    summary="모델 평가",
    description="타이타닉 데이터로 5가지 알고리즘을 학습하고 평가합니다.",
    response_description="각 모델의 평가 결과"
)
async def evaluate_model():
    """
    모델 평가를 수행합니다.
    
    ### 처리 순서
    1. 데이터 전처리 (preprocess)
    2. 모델 초기화 (modeling)
    3. 모델 학습 (learning)
    4. 모델 평가 (evaluate)
    
    ### 반환 정보
    - **success**: 요청 성공 여부
    - **results**: 각 모델의 정확도
        - logistic_regression: 로지스틱 회귀 정확도
        - naive_bayes: 나이브베이즈 정확도
        - random_forest: 랜덤포레스트 정확도
        - lightgbm: LightGBM 정확도
        - svm: SVM 정확도
    - **message**: 응답 메시지
    
    ### 예시
    ```json
    {
        "success": true,
        "results": {
            "logistic_regression": 0.8123,
            "naive_bayes": 0.7865,
            "random_forest": 0.8315,
            "lightgbm": 0.8258,
            "svm": 0.8034
        },
        "message": "모델 평가가 완료되었습니다."
    }
    ```
    """
    try:
        service = get_service()
        
        # 1. 전처리
        logger.info("전처리 시작...")
        service.preprocess()
        
        # 2. 모델링
        logger.info("모델링 시작...")
        service.modeling()
        
        # 3. 학습
        logger.info("학습 시작...")
        service.learning()
        
        # 4. 평가
        logger.info("평가 시작...")
        results = service.evaluate()
        
        return {
            "success": True,
            "results": results,
            "message": "모델 평가가 완료되었습니다."
        }
        
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"모델 평가 중 오류 발생: {str(e)}")
        return {
            "success": False,
            "message": "모델 평가 중 오류가 발생했습니다.",
            "error": str(e),
            "detail": error_detail
        }

