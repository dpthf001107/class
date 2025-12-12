from fastapi import APIRouter
from fastapi.responses import FileResponse, JSONResponse
from app.nlp.emma.emma_wordcloud import EmmaWordCloud
from app.nlp.samsung.samsung_wordcloud import SamsungWordCloud
import logging
import os

logger = logging.getLogger(__name__)

# 라우터 생성
router = APIRouter(
    tags=["NLP"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)

def get_emma_service() -> EmmaWordCloud:
    """EmmaWordCloud 인스턴스 반환"""
    return EmmaWordCloud()

def get_samsung_service() -> SamsungWordCloud:
    """SamsungWordCloud 인스턴스 반환"""
    return SamsungWordCloud()

@router.get(
    "/",
    summary="NLP 서비스 상태 확인",
    description="NLP 서비스의 현재 상태를 확인합니다."
)
async def nlp_root():
    """NLP 서비스 루트 엔드포인트"""
    return {
        "message": "NLP Service",
        "status": "running"
    }

@router.get(
    "/emma",
    summary="엠마 소설 워드클라우드 생성",
    description="제인 오스틴의 '엠마' 소설을 분석하여 워드클라우드를 생성합니다."
)
async def generate_emma_wordcloud(
    width: int = 1000,
    height: int = 600,
    background_color: str = "white",
    random_state: int = 0
):
    """
    엠마 소설 워드클라우드 생성
    
    - 제인 오스틴의 '엠마' 소설을 분석합니다.
    - 고유명사(이름)를 추출하여 빈도 분석을 수행합니다.
    - 워드클라우드 이미지를 생성하여 반환합니다.
    
    Parameters:
    - width: 이미지 너비 (기본값: 1000)
    - height: 이미지 높이 (기본값: 600)
    - background_color: 배경색 (기본값: "white")
    - random_state: 랜덤 시드 (기본값: 0)
    """
    try:
        # EmmaWordCloud 인스턴스 생성
        emma = get_emma_service()
        
        # 워드클라우드 생성 (자동으로 save 폴더에 저장됨)
        wc = emma.generate_wordcloud(
            width=width,
            height=height,
            background_color=background_color,
            random_state=random_state,
            show=False,
            auto_save=True,
            filename="emma_wordcloud.png"
        )
        
        # save 폴더에서 파일 경로 가져오기
        save_file_path = os.path.join(emma.save_dir, "emma_wordcloud.png")
        
        # 파일이 존재하는지 확인
        if os.path.exists(save_file_path):
            return FileResponse(
                save_file_path,
                media_type="image/png",
                filename="emma_wordcloud.png"
            )
        else:
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "message": "워드클라우드 파일 생성에 실패했습니다."
                }
            )
            
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"❌ 워드클라우드 생성 오류: {str(e)}")
        logger.error(error_detail)
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "워드클라우드 생성 중 오류가 발생했습니다.",
                "error": str(e),
                "detail": error_detail
            }
        )

@router.get(
    "/samsung",
    summary="삼성 지속가능경영보고서 워드클라우드 생성",
    description="삼성전자 2018년 지속가능경영보고서를 분석하여 워드클라우드를 생성합니다."
)
async def generate_samsung_wordcloud(
    filename: str = "samsung_wordcloud.png"
):
    """
    삼성 지속가능경영보고서 워드클라우드 생성
    
    - 삼성전자 2018년 지속가능경영보고서를 분석합니다.
    - 한국어 형태소 분석을 통해 명사를 추출합니다.
    - 워드클라우드 이미지를 생성하여 반환합니다.
    
    Parameters:
    - filename: 저장할 파일명 (기본값: "samsung_wordcloud.png")
    """
    try:
        # SamsungWordCloud 인스턴스 생성
        samsung = get_samsung_service()
        
        # 워드클라우드 생성 (자동으로 save 폴더에 저장됨)
        wc = samsung.draw_wordcloud(
            filename=filename,
            auto_save=True,
            show=False
        )
        
        # save 폴더에서 파일 경로 가져오기
        save_file_path = os.path.join(samsung.save_dir, filename)
        
        # 파일이 존재하는지 확인
        if os.path.exists(save_file_path):
            return FileResponse(
                save_file_path,
                media_type="image/png",
                filename=filename
            )
        else:
            return JSONResponse(
                status_code=500,
                content={
                    "status": "error",
                    "message": "워드클라우드 파일 생성에 실패했습니다."
                }
            )
            
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"❌ 워드클라우드 생성 오류: {str(e)}")
        logger.error(error_detail)
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "워드클라우드 생성 중 오류가 발생했습니다.",
                "error": str(e),
                "detail": error_detail
            }
        )

