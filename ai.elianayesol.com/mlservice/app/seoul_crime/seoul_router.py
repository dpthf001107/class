from fastapi import APIRouter
from fastapi.responses import FileResponse, JSONResponse
from app.seoul_crime.seoul_service import SeoulService
import logging
import os

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

@router.get(
    "/heatmap",
    summary="서울 범죄 데이터 히트맵 생성",
    description="서울시 범죄 데이터를 기반으로 정규화된 히트맵을 생성합니다."
)
async def generate_heatmap(style: str = "coolwarm"):
    """
    서울 범죄 데이터 히트맵 생성
    
    - CSV 파일에서 범죄 데이터를 읽어옵니다.
    - 자치구별로 발생 건수를 합산합니다.
    - MinMax 정규화를 수행합니다.
    - coolwarm 또는 viridis 컬러맵으로 히트맵을 생성합니다.
    
    Parameters:
    - style: 히트맵 스타일 ("coolwarm" 또는 "viridis", 기본값: "coolwarm")
    """
    try:
        service = get_service()
        result = service.generate_heatmap()
        
        # style 파라미터에 따라 해당 히트맵 파일 경로 선택
        if style == "viridis":
            heatmap_path = result["heatmap_files"][1]  # viridis
        else:
            heatmap_path = result["heatmap_files"][0]  # coolwarm (기본값)
        
        if os.path.exists(heatmap_path):
            return FileResponse(
                heatmap_path,
                media_type="image/png",
                filename=os.path.basename(heatmap_path)
            )
        else:
            return JSONResponse(
                status_code=404,
                content={
                    "status": "error",
                    "message": f"히트맵 파일을 찾을 수 없습니다: {heatmap_path}"
                }
            )
            
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"❌ 히트맵 생성 오류: {str(e)}")
        logger.error(error_detail)
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "히트맵 생성 중 오류가 발생했습니다.",
                "error": str(e),
                "detail": error_detail
            }
        )

@router.get(
    "/heatmap/arrest",
    summary="서울 범죄 검거 데이터 히트맵 생성",
    description="서울시 범죄 검거 데이터를 기반으로 정규화된 히트맵을 생성합니다."
)
async def generate_heatmap_arrest():
    """
    서울 범죄 검거 데이터 히트맵 생성
    
    - CSV 파일에서 범죄 검거 데이터를 읽어옵니다.
    - 자치구별로 검거 건수를 합산합니다.
    - 인구수 대비 검거률을 계산합니다.
    - MinMax 정규화를 수행합니다.
    - 빨간색 계열 히트맵을 생성합니다.
    """
    try:
        service = get_service()
        result = service.generate_heatmap_arrest()
        
        # 검거 히트맵 파일 경로
        heatmap_path = result["heatmap_files"][0]
        
        if os.path.exists(heatmap_path):
            return FileResponse(
                heatmap_path,
                media_type="image/png",
                filename=os.path.basename(heatmap_path)
            )
        else:
            return JSONResponse(
                status_code=404,
                content={
                    "status": "error",
                    "message": f"히트맵 파일을 찾을 수 없습니다: {heatmap_path}"
                }
            )
            
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"❌ 검거 히트맵 생성 오류: {str(e)}")
        logger.error(error_detail)
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "검거 히트맵 생성 중 오류가 발생했습니다.",
                "error": str(e),
                "detail": error_detail
            }
        )

@router.get(
    "/heatmap/info",
    summary="히트맵 생성 정보 조회",
    description="생성된 히트맵의 데이터 요약 정보를 조회합니다."
)
async def get_heatmap_info():
    """
    히트맵 생성 정보 조회
    
    - 생성된 히트맵 파일 경로
    - 데이터 요약 정보 (자치구 수, 범죄 종류 등)
    """
    try:
        service = get_service()
        result = service.generate_heatmap()
        
        return {
            "status": "success",
            "heatmap_files": result["heatmap_files"],
            "data_summary": result["data_summary"]
        }
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"❌ 히트맵 정보 조회 오류: {str(e)}")
        logger.error(error_detail)
        return {
            "status": "error",
            "message": "히트맵 정보 조회 중 오류가 발생했습니다.",
            "error": str(e),
            "detail": error_detail
        }

