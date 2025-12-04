import csv
import os
from fastapi import FastAPI, APIRouter
import uvicorn
from typing import List, Dict

# FastAPI 앱 생성
app = FastAPI(
    title="Titanic Service API",
    description="타이타닉 승객 정보 조회 서비스 API",
    version="1.0.0"
)

# CORS는 Gateway에서 처리하므로 여기서는 제거

# 서브라우터 생성
titanic_router = APIRouter(tags=["titanic"])

def get_top_10_passengers() -> List[Dict]:
    """train.csv에서 요금이 높은 상위 10명을 반환"""
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
    
    # 요금 기준으로 내림차순 정렬
    passengers_sorted = sorted(passengers, key=lambda x: x['fare'], reverse=True)
    top_10 = passengers_sorted[:10]
    
    # 순위 추가
    for rank, passenger in enumerate(top_10, 1):
        passenger['rank'] = rank
        passenger['survivedText'] = '생존' if passenger['survived'] == '1' else '사망'
        passenger['pclassText'] = f"{passenger['pclass']}등급"
    
    return top_10

@titanic_router.get("/")
async def titanic_root():
    return {"message": "Titanic Service", "status": "running"}

@titanic_router.get("/top-10")
async def get_top_10():
    """
    타이타닉 승객 중 요금이 높은 상위 10명을 반환합니다.
    """
    top_10 = get_top_10_passengers()
    total_count = 891  # 타이타닉 데이터셋의 총 승객 수
    return {
        "success": True,
        "data": top_10,
        "total": total_count,
        "message": f"총 {total_count}명 중 상위 10명을 반환했습니다."
    }

# 서브라우터를 앱에 포함
app.include_router(titanic_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9003)

