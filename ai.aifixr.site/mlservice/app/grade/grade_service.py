import pandas as pd
import numpy as np
from sklearn import datasets
from sklearn.datasets import load_iris, load_wine, load_breast_cancer
from icecream import ic
import os
from app.grade.grade_method import GradeMethod

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
        the_method = GradeMethod()
        
        # 컨테이너 내부 경로 사용
        current_dir = os.path.dirname(os.path.abspath(__file__))
        grade_path = os.path.join(current_dir, 'grade.csv')
        df_grade = the_method.new_model(grade_path)
        
        # esg_rating 컬럼 제거 (라벨)
        this_grade = the_method.create_train(df_grade, 'esg_rating')
        
        ic(f'1. Grade 의 type \n {type(this_grade)} ')
        ic(f'2. Grade 의 column \n {this_grade.columns} ')
        ic(f'3. Grade 의 상위 5개 행\n {this_grade.head(5)} ')
        ic(f'4. Grade 의 null 의 갯수\n {the_method.check_null(this_grade)}개')
        
        # 불필요한 컬럼 삭제 (company_name은 company_code와 중복)
        drop_features = ['company_name']
        this_grade = the_method.drop_features(this_grade, *drop_features)
        this_grade = the_method.company_code_Nominal(this_grade)
        this_grade = the_method.env_rating_Ordinal(this_grade)
        this_grade = the_method.soc_rating_Ordinal(this_grade)
        this_grade = the_method.gov_rating_Ordinal(this_grade)
        this_grade = the_method.year_Ordinal(this_grade)
        
        ic("🩵🩵 데이터 전처리 완료")
        ic(f'1. Grade 의 type \n {type(this_grade)} ')
        ic(f'2. Grade 의 column \n {this_grade.columns} ')
        ic(f'3. Grade 의 상위 5개 행\n {this_grade.head(5)} ')
        ic(f'4. Grade 의 null 의 갯수\n {the_method.check_null(this_grade)}개')

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
