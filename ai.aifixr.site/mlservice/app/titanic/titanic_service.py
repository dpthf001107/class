import pandas as pd
import numpy as np
from sklearn import datasets
from sklearn.datasets import load_iris, load_wine, load_breast_cancer
from icecream import ic
import os
from app.titanic.titanic_method import TitanicMethod
from app.titanic.titanic_dataset import TitanicDataSet


class TitanicService:
    """타이타닉 승객 데이터 처리 및 머신러닝 서비스"""
    
    def __init__(self):  # 생성자
        pass

    def preprocess(self):
        
        the_method = TitanicMethod()  #new 생략된
        # 컨테이너 내부 경로 사용
        current_dir = os.path.dirname(os.path.abspath(__file__))
        
        

        ic("❤️❤️ 데이터 읽기 시작")
        df_train, df_test = the_method.read_csv(train_path, test_path)
        
        ic("❤️❤️ 트레인 전처리 시작")
        # Train 데이터는 Survived 컬럼 제거
        train_path = os.path.join(current_dir, 'train.csv')
        df_train = the_method.read_csv(train_path)
        this_train = the_method.create_df(df_train, 'Survived')
        ic(f'1. Train 의 type \n {type(this_train)} ')
        ic(f'2. Train 의 column \n {this_train.columns} ')
        ic(f'3. Train 의 상위 5개 행\n {this_train.head(5)} ')
        ic(f'4. Train 의 null 의 갯수\n {the_method.check_null(this_train)}개')
        
        
        ic("💛💛 테스트 전처리 시작")
        test_path = os.path.join(current_dir, 'test.csv')
        df_test = the_method.read_csv(test_path)
        this_test = the_method.create_df(df_test, 'Survived')
        ic(f'1. test 의 type \n {type(this_test)} ')
        ic(f'2. test 의 column \n {this_test.columns} ')
        ic(f'3. test 의 상위 5개 행\n {this_test.head(5)} ')
        ic(f'4. test 의 null 의 갯수\n {the_method.check_null(this_test)}개')
       
        this = TitanicDataSet()

        this.train = this_train
        this.test = this_test


        drop_features = ['SibSp', 'Parch', 'Ticket', 'Cabin']
        this = the_method.drop_features(this, *drop_features)
        this = the_method.pclass_ordinal(this)
        this = the_method.fare_ordinal(this)
        this = the_method.embarked_nominal(this)
        this = the_method.gender_nominal(this)
        this = the_method.age_ratio(this)
        this = the_method.title_nominal(this)
        
        # 전처리 후 불필요한 원본 컬럼 삭제 (문자열 컬럼들)
        # Title, Embarked, Gender는 숫자로 변환되었으므로 삭제하지 않음
        drop_original = ['Name']
        this_train, this_test = the_method.drop_features(this_train, this_test, *drop_original)
        
        ic("❤️❤️ 트레인 전처리 완료")
        train_null_final, test_null_final = the_method.check_null(this_train, this_test)
        ic(f'1. Train 의 type \n {type(this_train)} ')
        ic(f'2. Train 의 column \n {this_train.columns} ')
        ic(f'3. Train 의 상위 5개 행\n {this_train.head(5)} ')
        ic(f'4. Train 의 null 의 갯수\n {train_null_final}개')

        ic("💛💛 테스트 전처리 완료")
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

