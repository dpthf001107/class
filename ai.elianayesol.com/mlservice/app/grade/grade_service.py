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
        ic("❤️❤️ 데이터 읽기 시작")
        the_method = GradeMethod()
        
        # 컨테이너 내부 경로 사용
        current_dir = os.path.dirname(os.path.abspath(__file__))
        train_path = os.path.join(current_dir, 'train.csv')
        test_path = os.path.join(current_dir, 'test.csv')
        
        df_train, df_test = the_method.read_csv(train_path, test_path)
        
        ic("❤️❤️ 트레인 전처리 시작")
        # Train 데이터는 esg_rating 컬럼 제거
        this_train, this_test = the_method.create_df(df_train, df_test, 'esg_rating')
        train_null, test_null = the_method.check_null(this_train, this_test)
        ic(f'1. Train 의 type \n {type(this_train)} ')
        ic(f'2. Train 의 column \n {this_train.columns} ')
        ic(f'3. Train 의 상위 5개 행\n {this_train.head(5)} ')
        ic(f'4. Train 의 null 의 갯수\n {train_null}개')
        
        ic("🧡🧡 테스트 전처리 시작")
        ic(f'1. test 의 type \n {type(this_test)} ')
        ic(f'2. test 의 column \n {this_test.columns} ')
        ic(f'3. test 의 상위 5개 행\n {this_test.head(5)} ')
        ic(f'4. test 의 null 의 갯수\n {test_null}개')
        
        # 불필요한 컬럼 삭제 (company_name은 company_code와 중복)
        drop_features = ['company_name']
        this_train, this_test = the_method.drop_features(this_train, this_test, *drop_features)
        this_train, this_test = the_method.company_code_Nominal(this_train, this_test)
        this_train, this_test = the_method.env_rating_Ordinal(this_train, this_test)
        this_train, this_test = the_method.soc_rating_Ordinal(this_train, this_test)
        this_train, this_test = the_method.gov_rating_Ordinal(this_train, this_test)
        this_train, this_test = the_method.year_Ordinal(this_train, this_test)
        
        ic("❤️❤️ 트레인 전처리 완료")
        train_null_final, test_null_final = the_method.check_null(this_train, this_test)
        ic(f'1. Train 의 type \n {type(this_train)} ')
        ic(f'2. Train 의 column \n {this_train.columns} ')
        ic(f'3. Train 의 상위 5개 행\n {this_train.head(5)} ')
        ic(f'4. Train 의 null 의 갯수\n {train_null_final}개')

        ic("🧡🧡 테스트 전처리 완료")
        ic(f'1. test 의 type \n {type(this_test)} ')
        ic(f'2. test 의 column \n {this_test.columns} ')
        ic(f'3. test 의 상위 5개 행\n {this_test.head(5)} ')
        ic(f'4. test 의 null 의 갯수\n {test_null_final}개')

    def modeling(self):
        ic("❤️❤️ 모델링 시작")
        ic("❤️❤️ 모델링 완료")

    def learning(self):
        ic("❤️❤️ 학습 시작")
        ic("❤️❤️ 학습 완료")

    def evaluate(self):
        ic("❤️❤️ 평가 시작")
        ic("❤️❤️ 평가 완료")

    def submit(self):
        ic("❤️❤️ 제출 시작")
        ic("❤️❤️ 제출 완료")
