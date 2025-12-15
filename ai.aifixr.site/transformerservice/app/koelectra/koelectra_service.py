import torch
import logging
from typing import Dict, Optional
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from pathlib import Path
from app.config import MODEL_DIR, MAX_LENGTH, DEVICE

logger = logging.getLogger(__name__)


class KoELECTRAService:
    """KoELECTRA 모델을 사용한 감성 분석 서비스"""
    
    _instance: Optional['KoELECTRAService'] = None
    _model = None
    _tokenizer = None
    
    def __new__(cls):
        """싱글톤 패턴"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        """서비스 초기화"""
        if self._model is None:
            self._load_model()
    
    def _load_model(self):
        """모델과 토크나이저 로드"""
        try:
            logger.info(f"📥 KoELECTRA 모델 로딩 중... (경로: {MODEL_DIR})")
            
            # 모델 경로 확인
            if not MODEL_DIR.exists():
                raise FileNotFoundError(f"모델 디렉토리를 찾을 수 없습니다: {MODEL_DIR}")
            
            # 토크나이저 로드
            self._tokenizer = AutoTokenizer.from_pretrained(
                str(MODEL_DIR),
                local_files_only=True
            )
            
            # 모델 로드 (SequenceClassification으로 로드)
            # 만약 모델이 다른 타입이면 에러가 발생할 수 있음
            try:
                self._model = AutoModelForSequenceClassification.from_pretrained(
                    str(MODEL_DIR),
                    local_files_only=True
                )
            except Exception as e:
                logger.warning(f"SequenceClassification 로드 실패: {e}")
                logger.info("ElectraForPreTraining으로 시도 중...")
                # PreTraining 모델인 경우, 분류 헤드를 추가해야 할 수 있음
                from transformers import ElectraForPreTraining
                base_model = ElectraForPreTraining.from_pretrained(
                    str(MODEL_DIR),
                    local_files_only=True
                )
                # 분류 헤드 추가 (2개 클래스: 긍정/부정)
                from transformers import ElectraForSequenceClassification
                self._model = ElectraForSequenceClassification.from_pretrained(
                    str(MODEL_DIR),
                    num_labels=2,
                    local_files_only=True
                )
            
            # 디바이스 설정
            self._device = torch.device(DEVICE)
            self._model.to(self._device)
            self._model.eval()  # 평가 모드
            
            logger.info(f"✅ 모델 로딩 완료! (디바이스: {self._device})")
            
        except Exception as e:
            logger.error(f"❌ 모델 로딩 오류: {str(e)}")
            raise
    
    def analyze_sentiment(self, text: str) -> Dict:
        """
        텍스트 감성 분석
        
        Args:
            text: 분석할 텍스트
            
        Returns:
            {
                "sentiment": "positive" or "negative",
                "confidence": float (0.0 ~ 1.0),
                "scores": {
                    "positive": float,
                    "negative": float
                },
                "text": str
            }
        """
        try:
            if not text or not text.strip():
                raise ValueError("텍스트가 비어있습니다.")
            
            # 텍스트 전처리
            text = text.strip()
            
            # 토크나이징
            inputs = self._tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                padding=True,
                max_length=MAX_LENGTH
            )
            
            # 디바이스로 이동
            inputs = {k: v.to(self._device) for k, v in inputs.items()}
            
            # 추론
            with torch.no_grad():
                outputs = self._model(**inputs)
                logits = outputs.logits
            
            # Softmax로 확률 계산
            probabilities = torch.nn.functional.softmax(logits, dim=-1)
            probs = probabilities[0].cpu().numpy()
            
            # 결과 해석
            # 일반적으로 [negative, positive] 순서이지만, 모델에 따라 다를 수 있음
            negative_score = float(probs[0])
            positive_score = float(probs[1])
            
            # 더 높은 확률의 감성 선택
            if positive_score > negative_score:
                sentiment = "positive"
                confidence = positive_score
            else:
                sentiment = "negative"
                confidence = negative_score
            
            return {
                "sentiment": sentiment,
                "confidence": round(confidence, 4),
                "scores": {
                    "positive": round(positive_score, 4),
                    "negative": round(negative_score, 4)
                },
                "text": text
            }
            
        except Exception as e:
            logger.error(f"❌ 감성 분석 오류: {str(e)}")
            raise


def get_service() -> KoELECTRAService:
    """KoELECTRAService 인스턴스 반환"""
    return KoELECTRAService()

