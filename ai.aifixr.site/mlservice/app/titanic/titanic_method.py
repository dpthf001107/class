from ast import Pass
import numpy as np
import pandas as pd
from pandas import DataFrame
from app.titanic.titanic_dataset import TitanicDataset
from typing import Tuple
class TitanicMethod(object):

    def __init__(self):
        # TitanicDataset 객체 생성 DF(MODEL)로 전환하기 위해서
        self.dataset = TitanicDataset()

    def read_csv(self, fname: str) -> pd.DataFrame:
        # train.csv 파일을 읽어와서 데이터셋 객체에 저장
        return pd.read_csv(fname)

    def create_df(self, df: DataFrame, label: str) -> pd.DataFrame:
        #Survived 값을 제거한 데이터프레임 작성
        return df.drop(columns=[label])

    def create_label(self, df: DataFrame, label: str) -> pd.DataFrame:
        #Survived 값만 가지는 답안지 데이터프레임 작성
        return df[[label]]

    def drop_features(self, this, *features: str) -> object:
        for df in [this.train, this.test]:
            df.drop(columns=list(features), inplace=True, errors='ignore')
        return this



    def check_null(self, this) -> None:
        for name, df in [("train", this.train), ("test", this.test)]:
            print(f"🔎 {name} null summary:")
            print(df.isnull().sum())



 # 척도: nominal , ordinal , interval , ratio

    def pclass_ordinal(self, train_df: DataFrame, test_df: DataFrame):
        """
        Pclass: 객실 등급 (1, 2, 3)
        - 이미 ordinal(서열형) 특성을 가진 변수이므로 그대로 사용합니다.
        - 머신러닝 모델 학습에 문제 없도록 int 타입만 확실히 맞춰줍니다.
        """
        train_df = train_df.copy()
        test_df = test_df.copy()

        train_df["Pclass"] = train_df["Pclass"].astype(int)
        test_df["Pclass"] = test_df["Pclass"].astype(int)

        return train_df, test_df


    def fare_ordinal(self, train_df: DataFrame, test_df: DataFrame):
        train_df = train_df.copy()
        test_df = test_df.copy()

        # 1) Fare 중앙값으로 결측치 채우기 (train 기준)
        median_fare = train_df["Fare"].median()
        train_df["Fare"].fillna(median_fare, inplace=True)
        test_df["Fare"].fillna(median_fare, inplace=True)

        # 2) train_df 기준으로 qcut 경계값 생성 (bin edges)
        try:
            train_bins = pd.qcut(train_df["Fare"], q=4, retbins=True, duplicates="drop")[1]
        except ValueError:
            # train 데이터 분포가 특이하면 cut fallback
            train_bins = pd.cut(train_df["Fare"], bins=4, retbins=True)[1]

        # 3) 동일 경계로 train/test 모두 binning
        train_df["Fare"] = pd.cut(train_df["Fare"], bins=train_bins, labels=False, include_lowest=True)
        test_df["Fare"] = pd.cut(test_df["Fare"], bins=train_bins, labels=False, include_lowest=True)

        # category → int
        train_df["Fare"] = train_df["Fare"].astype(int)
        test_df["Fare"] = test_df["Fare"].astype(int)

        return train_df, test_df


    def embarked_nominal(self, train_df: DataFrame, test_df: DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
        train_df = train_df.copy()
        test_df = test_df.copy()

        # 최빈값으로 결측치 처리
        mode_embarked = train_df["Embarked"].mode()[0]
        train_df["Embarked"].fillna(mode_embarked, inplace=True)
        test_df["Embarked"].fillna(mode_embarked, inplace=True)

        # One-Hot Encoding
        train_df = pd.get_dummies(train_df, columns=["Embarked"], prefix="Embarked")
        test_df = pd.get_dummies(test_df, columns=["Embarked"], prefix="Embarked")

        # train/test 컬럼 일치시키기
        test_df = test_df.reindex(columns=train_df.columns, fill_value=0)

        return train_df, test_df

    def gender_nominal(self, train_df: DataFrame, test_df: DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
        train_df = train_df.copy()
        test_df = test_df.copy()

        # 컬럼명 변경
        train_df.rename(columns={"Sex": "Gender"}, inplace=True)
        test_df.rename(columns={"Sex": "Gender"}, inplace=True)

        # One-Hot Encoding
        train_df = pd.get_dummies(train_df, columns=["Gender"], prefix="Gender")
        test_df = pd.get_dummies(test_df, columns=["Gender"], prefix="Gender")

        # train/test의 컬럼 일치시키기
        test_df = test_df.reindex(columns=train_df.columns, fill_value=0)

        return train_df, test_df


    def age_ratio(self, train_df: DataFrame, test_df: DataFrame):
        """
        Age: 나이
        - Ratio(연속형) 척도로 그대로 사용합니다.
        - Age 결측치는 Title(호칭)별 중앙값으로 채웁니다.
          단, Title 그룹에 결측치가 많은 경우를 대비해 전체 중앙값도 fallback으로 사용합니다.
        - 구간화(binning)는 성능 저하 가능성이 있어 사용하지 않습니다.
        """
        train_df = train_df.copy()
        test_df = test_df.copy()

        # train + test 합쳐서 Title별 중앙값 계산 (더 안정적)
        combined = pd.concat([train_df, test_df], ignore_index=True)

        # Title별 중앙값
        title_medians = combined.groupby("Title")["Age"].median()

        # 전체 중앙값 (fallback)
        global_median = combined["Age"].median()

        # 결측치 채우는 함수
        def fill_age(df):
            df["Age"] = df.apply(
                lambda row: title_medians[row["Title"]]
                if pd.isna(row["Age"]) and row["Title"] in title_medians
                else (global_median if pd.isna(row["Age"]) else row["Age"]),
                axis=1
            )
            return df

        train_df = fill_age(train_df)
        test_df = fill_age(test_df)

        # Age는 ratio이므로 float 그대로 두거나 int 변환(선호에 따라)
        train_df["Age"] = train_df["Age"].astype(float)
        test_df["Age"] = test_df["Age"].astype(float)

        return train_df, test_df


    def title_nominal(self, train_df: DataFrame, test_df: DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
        """
        Title: 명칭 (Mr, Mrs, Miss, Master, Dr 등)
        - Name에서 타이틀 추출
        - Nominal → One-Hot Encoding
        """
        train_df = train_df.copy()
        test_df = test_df.copy()

        # 1. Title 추출
        def extract_title(df):
            df["Title"] = df["Name"].str.extract(r',\s*([^\.]+)\.', expand=False)
            return df

        train_df = extract_title(train_df)
        test_df = extract_title(test_df)

        # 2. 드문 타이틀 Other로 묶기
        common_titles = ["Mr", "Mrs", "Miss", "Master"]
        train_df["Title"] = train_df["Title"].apply(lambda x: x if x in common_titles else "Other")
        test_df["Title"] = test_df["Title"].apply(lambda x: x if x in common_titles else "Other")

        # 3. One-Hot Encoding
        train_df = pd.get_dummies(train_df, columns=["Title"], prefix="Title")
        test_df = pd.get_dummies(test_df, columns=["Title"], prefix="Title")

        # 4. train/test 열 맞추기
        test_df = test_df.reindex(columns=train_df.columns, fill_value=0)

        return train_df, test_df
