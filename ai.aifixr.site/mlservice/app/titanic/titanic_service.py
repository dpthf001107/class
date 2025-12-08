import pandas as pd
import numpy as np
from sklearn import datasets
from sklearn.datasets import load_iris, load_wine, load_breast_cancer
from icecream import ic
import os
from app.titanic.titanic_method import TitanicMethod


class TitanicService:
    """타이타닉 승객 데이터 처리 및 머신러닝 서비스"""
    
    def __init__(self):  # 생성자
        pass

    def preprocess(self):
        ic("❤️❤️ 데이터 전처리 시작")
        the_method = TitanicMethod()  #new 생략된
        # 컨테이너 내부 경로 사용
        current_dir = os.path.dirname(os.path.abspath(__file__))
        train_path = os.path.join(current_dir, 'train.csv')
        test_path = os.path.join(current_dir, 'test.csv')
        df_train = TitanicMethod().new_model(train_path)
        df_test = TitanicMethod().new_model(test_path)
        
        # Train 데이터는 Survived 컬럼 제거
        this_train = the_method.create_train(df_train, 'Survived')
        # Test 데이터는 이미 Survived 컬럼이 없으므로 그대로 사용
        # test 하게되면 여기 주석 풀면 돼 this_test = df_test
        
        ic(f'1. Train 의 type \n {type(this_train)} ')
        ic(f'2. Train 의 column \n {this_train.columns} ')
        ic(f'3. Train 의 상위 5개 행\n {this_train.head(5)} ')
        ic(f'4. Train 의 null 의 갯수\n {the_method.check_null(this_train)}개')
       
        drop_features = ['SibSp', 'Parch', 'Ticket', 'Cabin']
        this_train = the_method.drop_features(this_train, *drop_features)
        this_train = the_method.pclass_ordinal(this_train)
        this_train = the_method.fare_ordinal(this_train)
        this_train = the_method.embarked_ordinal(this_train)
        this_train = the_method.gender_nominal(this_train)
        this_train = the_method.age_ratio(this_train)
        this_train = the_method.title_nominal(this_train)
        
        # 전처리 후 불필요한 원본 컬럼 삭제 (문자열 컬럼들)
        # Title, Embarked, Gender는 숫자로 변환되었으므로 삭제하지 않음
        drop_original = ['Name']
        this_train = the_method.drop_features(this_train, *drop_original)
        ic("❤️❤️ 데이터 전처리 완료")
        ic(f'1. Train 의 type \n {type(this_train)} ')
        ic(f'2. Train 의 column \n {this_train.columns} ')
        ic(f'3. Train 의 상위 5개 행\n {this_train.head(5)} ')
        ic(f'4. Train 의 null 의 갯수\n {the_method.check_null(this_train)}개')

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

