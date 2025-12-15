"""
KoELECTRA 모델 학습 스크립트
영화 리뷰 데이터로 감성 분석 모델을 fine-tuning합니다.
"""
import os
import json
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
    EarlyStoppingCallback
)
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
import numpy as np
from pathlib import Path
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class MovieReviewDataset(Dataset):
    """영화 리뷰 데이터셋"""
    
    def __init__(self, texts, labels, tokenizer, max_length=512):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]
        
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }


def load_data(data_dir):
    """JSON 파일들에서 데이터 로드"""
    texts = []
    labels = []
    
    data_path = Path(data_dir)
    json_files = list(data_path.glob("*.json"))
    
    logger.info(f"📂 데이터 파일 {len(json_files)}개 발견")
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                for item in data:
                    review = item.get('review', '').strip()
                    rating = item.get('rating', '')
                    
                    if not review or not rating:
                        continue
                    
                    try:
                        rating_int = int(rating)
                        
                        # 감성 라벨 변환
                        # rating 1-5: negative (0), rating 6-10: positive (1)
                        if rating_int <= 5:
                            label = 0  # negative
                        else:
                            label = 1  # positive
                        
                        texts.append(review)
                        labels.append(label)
                    except ValueError:
                        continue
                        
        except Exception as e:
            logger.warning(f"⚠️ 파일 로드 실패 {json_file}: {str(e)}")
            continue
    
    logger.info(f"✅ 총 {len(texts)}개 리뷰 로드 완료")
    logger.info(f"   - Negative: {labels.count(0)}개")
    logger.info(f"   - Positive: {labels.count(1)}개")
    
    return texts, labels


def compute_metrics(eval_pred):
    """평가 메트릭 계산"""
    predictions, labels = eval_pred
    predictions = np.argmax(predictions, axis=1)
    
    precision, recall, f1, _ = precision_recall_fscore_support(
        labels, predictions, average='weighted'
    )
    accuracy = accuracy_score(labels, predictions)
    
    return {
        'accuracy': accuracy,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }


def train_model(
    model_dir: str,
    data_dir: str,
    output_dir: str,
    num_epochs: int = 5,
    batch_size: int = 16,
    learning_rate: float = 2e-5,
    train_split: float = 0.8
):
    """
    KoELECTRA 모델 학습
    
    Args:
        model_dir: 사전 학습된 모델 경로
        data_dir: 학습 데이터 디렉토리
        output_dir: 학습된 모델 저장 경로
        num_epochs: 학습 에포크 수
        batch_size: 배치 크기
        learning_rate: 학습률
        train_split: 학습/검증 데이터 분할 비율
    """
    logger.info("🚀 KoELECTRA 모델 학습 시작")
    
    # 디바이스 설정
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    logger.info(f"📱 사용 디바이스: {device}")
    
    # 모델 및 토크나이저 로드
    logger.info(f"📥 모델 로딩 중: {model_dir}")
    tokenizer = AutoTokenizer.from_pretrained(model_dir, local_files_only=True)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_dir,
        num_labels=2,  # negative, positive
        local_files_only=True
    )
    model.to(device)
    
    # 데이터 로드
    logger.info(f"📂 데이터 로딩 중: {data_dir}")
    texts, labels = load_data(data_dir)
    
    if len(texts) == 0:
        raise ValueError("학습 데이터가 없습니다!")
    
    # 학습/검증 데이터 분할
    split_idx = int(len(texts) * train_split)
    train_texts = texts[:split_idx]
    train_labels = labels[:split_idx]
    val_texts = texts[split_idx:]
    val_labels = labels[split_idx:]
    
    logger.info(f"📊 데이터 분할:")
    logger.info(f"   - 학습: {len(train_texts)}개")
    logger.info(f"   - 검증: {len(val_texts)}개")
    
    # 데이터셋 생성
    train_dataset = MovieReviewDataset(train_texts, train_labels, tokenizer)
    val_dataset = MovieReviewDataset(val_texts, val_labels, tokenizer)
    
    # 학습 인자 설정
    training_args = TrainingArguments(
        output_dir=output_dir,
        num_train_epochs=num_epochs,
        per_device_train_batch_size=batch_size,
        per_device_eval_batch_size=batch_size,
        learning_rate=learning_rate,
        weight_decay=0.01,
        logging_dir=f"{output_dir}/logs",
        logging_steps=100,
        eval_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        greater_is_better=True,
        save_total_limit=2,
        warmup_steps=500,
        fp16=torch.cuda.is_available(),  # GPU 사용 시 FP16 활성화
    )
    
    # Trainer 생성
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
        callbacks=[EarlyStoppingCallback(early_stopping_patience=2)]
    )
    
    # 학습 시작
    logger.info("🎓 학습 시작...")
    trainer.train()
    
    # 최종 평가
    logger.info("📊 최종 평가 중...")
    eval_results = trainer.evaluate()
    logger.info(f"✅ 최종 결과:")
    logger.info(f"   - Accuracy: {eval_results['eval_accuracy']:.4f}")
    logger.info(f"   - F1 Score: {eval_results['eval_f1']:.4f}")
    logger.info(f"   - Precision: {eval_results['eval_precision']:.4f}")
    logger.info(f"   - Recall: {eval_results['eval_recall']:.4f}")
    
    # 모델 저장
    logger.info(f"💾 모델 저장 중: {output_dir}")
    trainer.save_model(output_dir)
    tokenizer.save_pretrained(output_dir)
    
    logger.info("✅ 학습 완료!")
    return trainer, eval_results


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="KoELECTRA 모델 학습")
    parser.add_argument(
        "--model_dir",
        type=str,
        default="./app/koelectra/koelectra_model",
        help="사전 학습된 모델 경로"
    )
    parser.add_argument(
        "--data_dir",
        type=str,
        default="./app/koelectra/data",
        help="학습 데이터 디렉토리"
    )
    parser.add_argument(
        "--output_dir",
        type=str,
        default="./app/koelectra/koelectra_model_finetuned",
        help="학습된 모델 저장 경로"
    )
    parser.add_argument(
        "--epochs",
        type=int,
        default=5,
        help="학습 에포크 수"
    )
    parser.add_argument(
        "--batch_size",
        type=int,
        default=16,
        help="배치 크기"
    )
    parser.add_argument(
        "--learning_rate",
        type=float,
        default=2e-5,
        help="학습률"
    )
    
    args = parser.parse_args()
    
    # 절대 경로로 변환
    base_dir = Path(__file__).parent.parent.parent.parent
    model_dir = base_dir / args.model_dir if not os.path.isabs(args.model_dir) else Path(args.model_dir)
    data_dir = base_dir / args.data_dir if not os.path.isabs(args.data_dir) else Path(args.data_dir)
    output_dir = base_dir / args.output_dir if not os.path.isabs(args.output_dir) else Path(args.output_dir)
    
    # 출력 디렉토리 생성
    output_dir.mkdir(parents=True, exist_ok=True)
    
    train_model(
        model_dir=str(model_dir),
        data_dir=str(data_dir),
        output_dir=str(output_dir),
        num_epochs=args.epochs,
        batch_size=args.batch_size,
        learning_rate=args.learning_rate
    )

