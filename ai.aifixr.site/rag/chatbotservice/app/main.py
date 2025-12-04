from fastapi import FastAPI, APIRouter
import uvicorn

# 서브라우터 생성
chatbot_router = APIRouter(tags=["chatbot"])

@chatbot_router.get("/")
async def chatbot_root():
    return {"message": "Chatbot Service", "status": "running"}

app = FastAPI(
    title="Chatbot Service API",
    description="Chatbot 서비스 API 문서",
    version="1.0.0"
)

# 서브라우터를 앱에 포함
app.include_router(chatbot_router)



if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9002)