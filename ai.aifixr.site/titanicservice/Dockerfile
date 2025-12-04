FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# requirements.txt 먼저 복사하고 설치 (캐시 최적화)
COPY app/requrirements.txt .
RUN pip install --no-cache-dir -r requrirements.txt

COPY app ./app

EXPOSE 9003

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9003"]

