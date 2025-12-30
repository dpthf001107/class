from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from contextlib import asynccontextmanager
from app.koelectra.koelectra_router import router as koelectra_router
from app.koelectra.koelectra_service import get_service

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 시작/종료 시 실행"""
    # 시작 시: 모델 미리 로드
    logger.info("🚀 Transformer Service 시작 중...")
    try:
        service = get_service()
        logger.info("✅ 모델 로딩 완료 (시작 시)")
    except Exception as e:
        logger.error(f"❌ 모델 로딩 실패: {str(e)}")
        # 모델 로딩 실패해도 서비스는 시작 (지연 로딩)
    
    yield
    
    # 종료 시: 리소스 정리
    logger.info("🔻 Transformer Service 종료 중...")

# FastAPI 앱 생성
app = FastAPI(
    title="Transformer Service API",
    description="""
    ## KoELECTRA 감성 분석 서비스 API
    
    KoELECTRA 모델을 사용한 영화 리뷰 감성 분석 서비스입니다.
    
    ### 주요 기능
    - 영화 리뷰 텍스트 감성 분석 (긍정/부정)
    - 신뢰도 및 상세 점수 제공
    
    ### Swagger 문서
    - **Swagger UI**: `/docs`
    - **ReDoc**: `/redoc`
    - **OpenAPI JSON**: `/openapi.json`
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS 미들웨어 추가 (Gateway에서 처리하지만 추가 보안)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 루트 엔드포인트
@app.get("/")
async def root():
    """서비스 루트 엔드포인트"""
    return {
        "message": "Transformer Service",
        "status": "running",
        "version": "1.0.0",
        "service": "KoELECTRA 감성 분석"
    }

# KoELECTRA 라우터 연결
# 게이트웨이에서 /api/transformer/** → /koelectra/**로 RewritePath 변환되므로
# Transformer 서비스에서는 /koelectra prefix로 받음
app.include_router(koelectra_router, prefix="/koelectra")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9020)

