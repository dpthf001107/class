import os
from pathlib import Path

# 프로젝트 루트 경로
BASE_DIR = Path(__file__).parent

# 모델 경로
MODEL_DIR = BASE_DIR / "koelectra" / "koelectra_model"

# 모델 설정
MODEL_NAME = str(MODEL_DIR)
MAX_LENGTH = 512
DEVICE = "cuda" if os.getenv("USE_GPU", "false").lower() == "true" else "cpu"

