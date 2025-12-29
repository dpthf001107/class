# diffuzers/main.py
# FastAPI 엔트리 + 정적 파일 서빙(/outputs/...) + 라우팅 등록입니다.
import sys
from pathlib import Path

# cv.aifixr.site 디렉토리를 Python 경로에 추가
_current_dir = Path(__file__).resolve().parent
_project_root = _current_dir.parent.parent  # app/diffuzers -> app -> cv.aifixr.site
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.diffuzers.api.v1.routes.generate import router as generate_router
from app.diffuzers.core.config import OUTPUTS_DIR, IMAGES_DIR, META_DIR

app = FastAPI(title="Diffusers API", version="1.0.0")

# CORS 설정 (모든 origin 허용 - 개발용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# outputs 디렉토리 생성 (없으면 생성)
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
IMAGES_DIR.mkdir(parents=True, exist_ok=True)
META_DIR.mkdir(parents=True, exist_ok=True)

# outputs 정적 서빙 (로컬 개발/단독 서버에서 편리)
app.mount("/outputs", StaticFiles(directory=str(OUTPUTS_DIR)), name="outputs")

app.include_router(generate_router, prefix="/api/v1")


@app.get("/health")
def health():
    return {"ok": True}