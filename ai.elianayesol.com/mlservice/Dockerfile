FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# 시스템 패키지 업데이트 및 필요한 도구 설치
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    fonts-nanum \
    default-jdk \
    && rm -rf /var/lib/apt/lists/*

# requirements.txt 먼저 복사하고 설치 (캐시 최적화)
COPY requrirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requrirements.txt

# 앱 파일 복사
COPY app ./app

EXPOSE 9003

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:9003/api/ml/')" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9003"]

