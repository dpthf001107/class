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
    "/samsung/process",
    summary="삼성 지속가능경영보고서 전처리 및 빈도 분석",
    description="삼성전자 2018년 지속가능경영보고서를 전처리하고 빈도 분석 결과를 JSON으로 반환합니다."
)
async def process_samsung_text():
    """
    삼성 지속가능경영보고서 전처리 및 빈도 분석
    
    - 삼성전자 2018년 지속가능경영보고서를 분석합니다.
    - 한국어 형태소 분석을 통해 명사를 추출합니다.
    - 빈도 분석 결과와 워드클라우드를 생성합니다.
    - 전처리 결과와 빈도 분포를 JSON으로 반환합니다.
    
    Returns:
        JSON 형태의 전처리 결과 및 빈도 분석 데이터
    """
    try:
        # SamsungWordCloud 인스턴스 생성
        samsung = get_samsung_service()
        
        # 전처리 및 빈도 분석 수행
        result = samsung.text_process()
        
        # FreqDist 객체를 딕셔너리로 변환 (JSON 직렬화 가능하도록)
        if 'freq_txt' in result and hasattr(result['freq_txt'], 'most_common'):
            freq_dist = result['freq_txt']
            # 전체 단어 수 저장
            total_words = freq_dist.N() if hasattr(freq_dist, 'N') else len(freq_dist)
            # 상위 100개 빈도만 반환 (너무 크면 JSON 직렬화 문제 발생 가능)
            freq_dict = dict(freq_dist.most_common(100))
            result['freq_txt'] = freq_dict
            result['total_words'] = total_words
            result['top_count'] = 100  # 반환된 상위 단어 개수
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "전처리 및 빈도 분석이 완료되었습니다.",
                "data": result
            }
        )
            
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"❌ 전처리 및 빈도 분석 오류: {str(e)}")
        logger.error(error_detail)
        return JSONResponse(
            status_code=500,
            content={
                "status": "error",
                "message": "전처리 및 빈도 분석 중 오류가 발생했습니다.",
                "error": str(e),
                "detail": error_detail
            }
        )

