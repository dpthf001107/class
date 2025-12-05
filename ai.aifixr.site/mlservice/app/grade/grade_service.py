import pandas as pd
import numpy as np
from sklearn import datasets
from sklearn.datasets import load_iris, load_wine, load_breast_cancer
from icecream import ic

class GradeService(object):
    """
    ESG 등급 데이터 처리 및 머신러닝 서비스
    
    참고사항:
    - esg_rating은 라벨(타겟 변수)입니다 (타이타닉의 survived와 동일한 역할)
    - 타이타닉은 이진 분류(0, 1)이지만, ESG 등급은 7개 클래스 다중 분류입니다
    - ESG 등급 종류: S, A+, A, B+, B, C, D (총 7가지)
    - 라벨 매핑: S=0, A+=1, A=2, B+=3, B=4, C=5, D=6
    """
    
    # ESG 등급 라벨 매핑 (문자열 -> 숫자)
    ESG_RATING_MAPPING = {
        'S': 0,
        'A+': 1,
        'A': 2,
        'B+': 3,
        'B': 4,
        'C': 5,
        'D': 6
    }
    
    

    def preprocess(self):
        ic("🩵🩵 데이터 전처리 시작")
        ic("🩵🩵 데이터 전처리 완료")

    def modeling(self):
        ic("🩵🩵 모델링 시작")
        ic("🩵🩵 모델링 완료")

    def learning(self):
        ic("🩵🩵 학습 시작")
        ic("🩵🩵 학습 완료")

    def evaluate(self):
        ic("🩵🩵 평가 시작")
        ic("🩵🩵 평가 완료")

    def submit(self):
        ic("🩵🩵 제출 시작")
        ic("🩵🩵 제출 완료")
