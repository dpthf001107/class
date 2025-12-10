from fastapi import APIRouter
from app.seoul_crime.seoul_service import SeoulService
import logging

logger = logging.getLogger(__name__)

# 라우터 생성
router = APIRouter(
    tags=["서울 범죄"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

def get_service() -> SeoulService:
    """SeoulService 인스턴스 반환"""
    return SeoulService()

@router.get(
    "/",
    summary="서울 범죄 서비스 상태 확인",
    description="서울 범죄 서비스의 현재 상태를 확인합니다."
)
async def seoul_root():
    """서울 범죄 서비스 루트 엔드포인트"""
    return {
        "message": "Seoul Crime Service",
        "status": "running"
    }

@router.get(
    "/preprocess",
    summary="데이터 전처리 및 머지",
    description="CCTV와 인구 데이터를 전처리하고 머지합니다."
)
async def preprocess_data():
    """
    서울 범죄 데이터 전처리를 수행합니다.
    
    - CCTV 데이터와 인구 데이터를 로드합니다.
    - 기관명과 자치구를 키로 머지합니다.
    - 중복 컬럼을 자동으로 처리합니다.
    """
    try:
        service = get_service()
        result = service.preprocess()
        
        # 서비스에서 반환된 딕셔너리를 그대로 반환
        return result
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"❌ 전처리 오류: {str(e)}")
        logger.error(error_detail)
        return {
            "status": "error",
            "message": "데이터 전처리 중 오류가 발생했습니다.",
            "error": str(e),
            "detail": error_detail
        }

