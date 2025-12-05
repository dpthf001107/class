from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Optional
import csv
import os

# 라우터 생성
router = APIRouter(
    tags=["ESG 등급"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

# 응답 모델 정의
class CompanyResponse(BaseModel):
    """회사 정보 응답 모델"""
    no: str
    companyName: str
    companyCode: str
    esgRating: str
    envRating: str
    socRating: str
    govRating: str
    year: str
    rank: int

class Top10Response(BaseModel):
    """상위 10개 응답 모델"""
    success: bool
    data: List[CompanyResponse]
    total: int
    message: str

class ServiceStatusResponse(BaseModel):
    """서비스 상태 응답 모델"""
    message: str
    status: str

def get_top_10_companies() -> List[Dict]:
    """grade.csv에서 리스트 순서대로 상위 10개를 반환"""
    # 현재 파일의 디렉토리 경로
    current_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(current_dir, 'grade.csv')
    
    # CSV 파일 읽기
    companies = []
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            companies.append({
                'no': row['NO'],
                'companyName': row['company_name'],
                'companyCode': row['company_code'],
                'esgRating': row['esg_rating'],
                'envRating': row['env_rating'],
                'socRating': row['soc_rating'],
                'govRating': row['gov_rating'],
                'year': row['year']
            })
    
    # 정렬 없이 리스트에서 순서대로 처음 10개만 반환
    top_10 = companies[:10]
    
    # 순위 추가
    for rank, company in enumerate(top_10, 1):
        company['rank'] = rank
    
    return top_10

@router.get(
    "/",
    response_model=ServiceStatusResponse,
    summary="ESG 등급 서비스 상태 확인",
    description="ESG 등급 서비스의 현재 상태를 확인합니다.",
    response_description="서비스 상태 정보"
)
async def grade_root():
    """
    ESG 등급 서비스 루트 엔드포인트
    
    - **message**: 서비스 메시지
    - **status**: 서비스 상태 (running)
    """
    return {"message": "ESG Grade Service", "status": "running"}

@router.get(
    "/top-10",
    response_model=Top10Response,
    summary="상위 10개 조회",
    description="ESG 등급 데이터 리스트에서 순서대로 상위 10개를 반환합니다.",
    response_description="상위 10개의 회사 정보와 통계"
)
async def get_top_10():
    """
    ESG 등급 데이터 리스트에서 순서대로 상위 10개를 반환합니다.
    
    ### 반환 정보
    - **success**: 요청 성공 여부
    - **data**: 상위 10개의 회사 정보 리스트
        - no: 번호
        - companyName: 회사명
        - companyCode: 회사 코드
        - esgRating: ESG 종합 등급 (S, A+, A, B+, B, C, D)
        - envRating: 환경 등급
        - socRating: 사회 등급
        - govRating: 지배구조 등급
        - year: 연도
        - rank: 순위
    - **total**: 전체 회사 수
    - **message**: 응답 메시지
    
    ### ESG 등급 설명
    - **esg_rating**: 라벨(타겟 변수)로 사용됩니다
    - 등급 종류: S, A+, A, B+, B, C, D (총 7가지)
    - 라벨 매핑: S=0, A+=1, A=2, B+=3, B=4, C=5, D=6
    
    ### 예시
    ```json
    {
        "success": true,
        "data": [
            {
                "no": "1091",
                "companyName": "AJ네트웍스",
                "companyCode": "095570",
                "esgRating": "B+",
                "envRating": "C",
                "socRating": "A",
                "govRating": "A",
                "year": "2025",
                "rank": 1
            }
        ],
        "total": 1091,
        "message": "총 1091개 중 상위 10개를 반환했습니다."
    }
    ```
    """
    top_10 = get_top_10_companies()
    total_count = 1091  # grade.csv의 총 데이터 수
    return {
        "success": True,
        "data": top_10,
        "total": total_count,
        "message": f"총 {total_count}개 중 상위 10개를 반환했습니다."
    }

