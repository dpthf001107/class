from fastapi import FastAPI, APIRouter
import uvicorn

# 서브라우터 생성
crawler_router = APIRouter(tags=["crawler"])

@crawler_router.get("/")
async def crawler_root():
    return {"message": "Crawler Service", "status": "running"}

@crawler_router.get("/bugsmusic")
async def get_bugsmusic_chart():
    """
    Bugs Music 실시간 차트를 크롤링하여 반환합니다.
    """
    # lazy import: 엔드포인트 호출 시에만 import
    # gateway와 crawlerservice 컨테이너 모두에서 동작하도록 경로 처리
    try:
        # crawlerservice 컨테이너에서 직접 실행될 때
        from app.bs_demo.bugsmusic import crawl_bugs_chart
    except ImportError:
        # gateway 컨테이너에서 실행될 때
        from services.crawlerservice.app.bs_demo.bugsmusic import crawl_bugs_chart
    
    try:
        songs = crawl_bugs_chart()
        return {
            "success": True,
            "count": len(songs),
            "data": songs
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "data": []
        }

@crawler_router.get("/danawa")
async def get_danawa_prices():
    """
    다나와 상품 가격 정보를 크롤링하여 반환합니다.
    """
    # lazy import: 엔드포인트 호출 시에만 import
    # gateway와 crawlerservice 컨테이너 모두에서 동작하도록 경로 처리
    try:
        # crawlerservice 컨테이너에서 직접 실행될 때
        from app.sel_demo.danawa import crawl_danawa_prices
    except ImportError:
        # gateway 컨테이너에서 실행될 때
        from services.crawlerservice.app.sel_demo.danawa import crawl_danawa_prices
    
    try:
        prices = crawl_danawa_prices()
        return {
            "success": True,
            "count": len(prices),
            "data": prices
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "data": []
        }

app = FastAPI(
    title="Crawler Service API",
    description="Crawler 서비스 API 문서",
    version="1.0.0"
)

# 서브라우터를 앱에 포함
app.include_router(crawler_router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9001)