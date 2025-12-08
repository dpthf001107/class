from fastapi import FastAPI  # pyright: ignore[reportMissingImports]
from fastapi.openapi.utils import get_openapi  # pyright: ignore[reportMissingImports]
import uvicorn  # pyright: ignore[reportMissingImports]
from app.titanic.titanic_router import router as titanic_router
from app.grade.grade_router import router as grade_router

# FastAPI 앱 생성
app = FastAPI(
    title="ML Service API",
    description="""
    ## 머신러닝 서비스 API
    
    타이타닉 승객 데이터를 기반으로 한 머신러닝 서비스입니다.
    
    ### 주요 기능
    - 타이타닉 승객 정보 조회
    - ESG 등급 회사 정보 조회
    - 상위 데이터 조회
    - 데이터 CRUD 작업
    
    ### Swagger 문서
    - **Swagger UI**: `/docs`
    - **ReDoc**: `/redoc`
    - **OpenAPI JSON**: `/openapi.json`
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS는 Gateway에서 처리하므로 여기서는 제거

# 루트 엔드포인트
@app.get("/")
async def root():
    """서비스 루트 엔드포인트"""
    return {
        "message": "ML Service",
        "status": "running",
        "version": "1.0.0"
    }

# Health check 엔드포인트 (게이트웨이용)
@app.get("/api/ml/")
async def ml_health():
    """ML 서비스 Health Check 엔드포인트"""
    return {
        "message": "ML Service",
        "status": "healthy",
        "version": "1.0.0"
    }

# 타이타닉 라우터 연결
app.include_router(titanic_router, prefix="/api/titanic")

# ESG 등급 라우터 연결
app.include_router(grade_router, prefix="/api/grade")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9003)
