from fastapi import APIRouter
from fastapi.responses import HTMLResponse, JSONResponse
from app.us_unemployment.service import USUnemploymentService
import logging
import os

logger = logging.getLogger(__name__)

# 라우터 생성
router = APIRouter(
    tags=["미국 실업률"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

def get_service() -> USUnemploymentService:
    """USUnemploymentService 인스턴스 반환"""
    return USUnemploymentService()

@router.get(
    "/",
    summary="미국 실업률 서비스 상태 확인",
    description="미국 실업률 서비스의 현재 상태를 확인합니다."
)
async def usa_root():
    """미국 실업률 서비스 루트 엔드포인트"""
    return {
        "message": "US Unemployment Service",
        "status": "running"
    }

@router.get(
    "/map",
    summary="미국 실업률 지도 생성",
    description="미국 각 주의 실업률 데이터를 지도로 시각화합니다.",
    response_class=HTMLResponse
)
async def generate_map(
    location: str = "48,-102",
    zoom_start: int = 3
):
    """
    미국 실업률 지도를 생성하고 HTML로 반환합니다.
    
    Parameters:
    - location: 지도 중심 좌표 (위도,경도 형식, 기본값: "48,-102")
    - zoom_start: 초기 줌 레벨 (기본값: 3)
    """
    try:
        service = get_service()
        
        # location 문자열을 리스트로 변환
        lat, lng = map(float, location.split(','))
        location_list = [lat, lng]
        
        # 지도 생성
        service.generate_map(location=location_list, zoom_start=zoom_start)
        
        # 지도 저장
        saved_path = service.save_map("us_unemployment_map.html")
        logger.info(f"💾 지도 저장 경로: {saved_path}")
        
        # HTML로 변환 (Folium 지도를 HTML 문자열로 변환)
        map_obj = service.get_map()
        map_html = map_obj.get_root().render()
        
        return HTMLResponse(content=map_html)
        
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"❌ 지도 생성 오류: {str(e)}")
        logger.error(error_detail)
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "지도 생성 중 오류가 발생했습니다.",
                "error": str(e),
                "detail": error_detail
            }
        )

@router.get(
    "/map/info",
    summary="지도 생성 정보 조회",
    description="생성된 지도의 데이터 요약 정보를 조회합니다."
)
async def get_map_info():
    """
    지도 생성 정보 조회
    
    - 로드된 데이터 정보
    - 지도 설정 정보
    """
    try:
        service = get_service()
        service.load_data()
        
        return {
            "status": "success",
            "data_summary": {
                "states_count": len(service.state_geo.get('features', [])) if service.state_geo else 0,
                "unemployment_data_rows": len(service.state_data) if service.state_data is not None else 0,
                "unemployment_data_columns": service.state_data.columns.tolist() if service.state_data is not None else [],
                "geo_url": service.geo_url,
                "data_url": service.data_url
            }
        }
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"❌ 정보 조회 오류: {str(e)}")
        logger.error(error_detail)
        return {
            "status": "error",
            "message": "정보 조회 중 오류가 발생했습니다.",
            "error": str(e),
            "detail": error_detail
        }

