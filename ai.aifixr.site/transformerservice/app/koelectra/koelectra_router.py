from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional
import logging
from app.koelectra.koelectra_service import get_service

logger = logging.getLogger(__name__)

router = APIRouter(
    tags=["KoELECTRA 감성분석"],
    responses={
        404: {"description": "Not found"},
        500: {"description": "Internal server error"}
    }
)


class SentimentRequest(BaseModel):
    """감성 분석 요청 스키마"""
    text: str = Field(..., min_length=1, max_length=1000, description="분석할 텍스트")
    
    class Config:
        json_schema_extra = {
            "example": {
                "text": "이 영화 정말 재미있어요! 강력 추천합니다."
            }
        }


class SentimentResponse(BaseModel):
    """감성 분석 응답 스키마"""
    sentiment: str = Field(..., description="감성 결과 (positive/negative)")
    confidence: float = Field(..., description="신뢰도 (0.0 ~ 1.0)")
    scores: dict = Field(..., description="긍정/부정 점수")
    text: str = Field(..., description="분석한 텍스트")
    
    class Config:
        json_schema_extra = {
            "example": {
                "sentiment": "positive",
                "confidence": 0.9876,
                "scores": {
                    "positive": 0.9876,
                    "negative": 0.0124
                },
                "text": "이 영화 정말 재미있어요! 강력 추천합니다."
            }
        }


@router.post(
    "/analyze",
    summary="영화 리뷰 감성 분석",
    description="KoELECTRA 모델을 사용하여 영화 리뷰 텍스트의 감성을 분석합니다.",
    response_model=SentimentResponse
)
async def analyze_sentiment(request: SentimentRequest):
    """
    단일 텍스트 감성 분석
    
    - 텍스트를 입력받아 긍정/부정 감성을 분석합니다.
    - 신뢰도와 상세 점수를 함께 반환합니다.
    
    **예시 요청:**
    ```json
    {
        "text": "이 영화 정말 재미있어요! 강력 추천합니다."
    }
    ```
    
    **예시 응답:**
    ```json
    {
        "sentiment": "positive",
        "confidence": 0.9876,
        "scores": {
            "positive": 0.9876,
            "negative": 0.0124
        },
        "text": "이 영화 정말 재미있어요! 강력 추천합니다."
    }
    ```
    """
    try:
        service = get_service()
        result = service.analyze_sentiment(request.text)
        
        return JSONResponse(
            status_code=200,
            content=result
        )
        
    except ValueError as e:
        logger.error(f"❌ 잘못된 요청: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"잘못된 요청: {str(e)}"
        )
    except Exception as e:
        import traceback
        error_detail = traceback.format_exc()
        logger.error(f"❌ 감성 분석 오류: {str(e)}")
        logger.error(error_detail)
        raise HTTPException(
            status_code=500,
            detail=f"감성 분석 중 오류가 발생했습니다: {str(e)}"
        )


@router.get(
    "/health",
    summary="서비스 상태 확인",
    description="KoELECTRA 감성 분석 서비스의 상태를 확인합니다."
)
async def health_check():
    """서비스 상태 확인"""
    try:
        service = get_service()
        return {
            "status": "healthy",
            "message": "KoELECTRA 감성 분석 서비스가 정상 작동 중입니다.",
            "model_loaded": service._model is not None
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"서비스 오류: {str(e)}"
        }

