@echo off
REM KoELECTRA 모델 학습 스크립트 (Windows)

python -m app.koelectra.train_model ^
    --model_dir ./app/koelectra/koelectra_model ^
    --data_dir ./app/koelectra/data ^
    --output_dir ./app/koelectra/koelectra_model_finetuned ^
    --epochs 5 ^
    --batch_size 16 ^
    --learning_rate 2e-5

