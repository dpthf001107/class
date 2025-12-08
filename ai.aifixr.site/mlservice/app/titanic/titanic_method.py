from ast import Pass
import numpy as np
import pandas as pd
from pandas import DataFrame
from app.titanic.titanic_dataset import TitanicDataset
class TitanicMethod(object):

    def __init__(self):
        # TitanicDataset 객체 생성 DF(MODEL)로 전환하기 위해서
        self.dataset = TitanicDataset()

    def new_model(self, fname: str) -> pd.DataFrame:
        # train.csv 파일을 읽어와서 데이터셋 객체에 저장
        return pd.read_csv(fname)

    def create_train(self, df: DataFrame, label: str) -> pd.DataFrame:
        #Survived 값을 제거한 데이터프레임 작성
        return df.drop(columns=[label])

    def create_label(self, df: DataFrame, label: str) -> pd.DataFrame:
        #Survived 값만 가지는 답안지 데이터프레임 작성
        return df[label]

    def drop_features(self, df: DataFrame, *features: str)-> pd.DataFrame:
        #피쳐를 삭제하는 메소드
        return df.drop(columns=[f for f in features])


    def check_null(self, df: DataFrame) -> int:
        #널을 체크하는 메소드
        return int(df.isnull().sum().sum())

    # 척도: nominal , ordinal , interval , ratio

    def pclass_ordinal(self, df: DataFrame) -> pd.DataFrame:
        """
        Pclass: 객실 등급 (1, 2, 3)
        - 서열형 척도(ordinal)로 처리합니다.
        - 1등석 > 2등석 > 3등석이므로, 생존률 관점에서 1이 가장 좋고 3이 가장 안 좋습니다.
        - 기존 Pclass를 유지하고, Pclass_ordinal 컬럼을 추가합니다.
        """
        # Pclass는 이미 1, 2, 3의 서열형 값이므로 그대로 사용
        # 생존률 관점에서 1이 가장 좋으므로, 값이 작을수록 좋은 것으로 인코딩
        # 실제로는 이미 1 > 2 > 3 순서이므로 그대로 사용하거나, 역순으로 변환할 수 있음
        # 여기서는 기존 값을 유지하되, 명시적으로 ordinal 컬럼 생성
        df = df.copy()
        df["Pclass"] = df["Pclass"].astype(int) #이름은 CSV 파일에 있는 것과 똑같이 맞춰준다.
        return df

    def fare_ordinal(self, df: DataFrame) -> pd.DataFrame:
        """
        Fare: 요금 (연속형 ratio 척도이지만, 여기서는 구간화하여 서열형으로 사용)
        - 결측치가 있으면 중앙값으로 채웁니다.
        - Fare를 사분위수로 binning 하여 ordinal 피처를 만듭니다.
        - 원래 Fare 컬럼은 그대로 유지하고, Fare_band 컬럼만 추가합니다.
        """
        df = df.copy()
        
        # 결측치를 중앙값으로 채우기
        if df["Fare"].isnull().any():
            median_fare = df["Fare"].median()
            df["Fare"].fillna(median_fare, inplace=True)
        
        # 사분위수로 binning (q=4로 4개 구간 생성)
        # labels=[0,1,2,3]으로 낮은 값이 0, 높은 값이 3
        try:
            df["Fare"] = pd.qcut(df["Fare"], q=4, labels=[0, 1, 2, 3], duplicates='drop')
            # qcut이 실패할 경우 (중복값 등) cut 사용
        except ValueError:
            # 중복값이 많아 qcut이 실패하면 cut 사용
            df["Fare"] = pd.cut(df["Fare"], bins=4, labels=[0, 1, 2, 3], duplicates='drop')
        
        # 범주형을 정수로 변환
        df["Fare"] = df["Fare"].astype(int)
        
        return df

    def embarked_ordinal(self, df: DataFrame) -> pd.DataFrame:
        """
        Embarked: 탑승 항구 (C, Q, S)
        - 본질적으로는 nominal(명목) 척도입니다.
        - 결측치는 가장 많이 등장하는 값으로 채웁니다 (mode).
        - 라벨 인코딩으로 변환합니다 (C=0, Q=1, S=2).
        """
        df = df.copy()
        
        # 결측치를 최빈값으로 채우기
        if df["Embarked"].isnull().any():
            mode_embarked = df["Embarked"].mode()[0] if not df["Embarked"].mode().empty else 'S'
            df["Embarked"].fillna(mode_embarked, inplace=True)
        
        # 라벨 인코딩 (문자열을 숫자로 변환)
        embarked_mapping = {"C": 0, "Q": 1, "S": 2}
        df["Embarked"] = df["Embarked"].map(embarked_mapping)
        
        return df

    def gender_nominal(self, df: DataFrame) -> pd.DataFrame:
        """
        Sex: 성별 (male, female)
        - nominal 척도입니다.
        - 라벨 인코딩으로 변환합니다 (male=0, female=1)
        - 원본 "Sex" 컬럼을 "Gender"로 변경하고 숫자로 변환합니다.
        """
        df = df.copy()
        
        # 라벨 인코딩: male=0, female=1
        gender_mapping = {"male": 0, "female": 1}
        df["Gender"] = df["Sex"].map(gender_mapping)
        
        # 원본 Sex 컬럼 삭제
        df.drop(columns=["Sex"], inplace=True)
        
        return df

    def age_ratio(self, df: DataFrame) -> pd.DataFrame:
        """
        Age: 나이
        - 원래는 ratio 척도지만, 여기서는 나이를 구간으로 나눈 ordinal 피처를 만듭니다.
        - Age 결측치는 중앙값으로 채웁니다.
        - bins를 사용해서 나이를 구간화합니다.
        - 원본 Age 컬럼은 유지하고, Age_band 컬럼을 추가합니다.
        
        bins 의미:
        - [-1, 0]: 미상 (Unknown)
        - [0, 5]: 유아 (Infant)
        - [5, 12]: 어린이 (Child)
        - [12, 18]: 청소년 (Teenager)
        - [18, 24]: 청년 (Young Adult)
        - [24, 35]: 성인 (Adult)
        - [35, 60]: 중년 (Middle Age)
        - [60, inf]: 노년 (Senior)
        """
        df = df.copy()
        bins = [-1, 0, 5, 12, 18, 24, 35, 60, np.inf]
        
        # 결측치를 중앙값으로 채우기
        if df["Age"].isnull().any():
            median_age = df["Age"].median()
            df["Age"].fillna(median_age, inplace=True)
        
        # bins를 사용해서 나이를 구간화
        df["Age"] = pd.cut(df["Age"], bins=bins, labels=[0, 1, 2, 3, 4, 5, 6, 7], right=False)
        
        # 범주형을 정수로 변환 (NaN이 있으면 -1로 처리)
        df["Age"] = df["Age"].cat.codes
        df["Age"] = df["Age"].replace(-1, 0)  # -1을 0으로 (미상)
        
        return df

    def title_nominal(self, df: DataFrame) -> pd.DataFrame:
        """
        Title: 명칭 (Mr, Mrs, Miss, Master, Dr, etc.)
        - Name 컬럼에서 추출한 타이틀입니다.
        - nominal 척도입니다.
        - 희소한 타이틀은 "Rare" 그룹으로 묶습니다.
        - 라벨 인코딩으로 변환합니다 (0: Master, 1: Miss, 2: Mr, 3: Mrs, 4: Rare).
        """
        df = df.copy()
        
        # Name 컬럼에서 Title 추출 (정규표현식 사용)
        # 예: "Braund, Mr. Owen Harris" -> "Mr"
        df["Title"] = df["Name"].str.extract(r',\s*([^\.]+)\.', expand=False)
        
        # 희소한 타이틀을 "Rare"로 묶기
        # 일반적인 타이틀: Mr, Mrs, Miss, Master
        # 그 외는 Rare로 처리
        common_titles = ["Mr", "Mrs", "Miss", "Master"]
        df["Title"] = df["Title"].apply(lambda x: x if x in common_titles else "Rare")
        
        # 결측치가 있으면 "Rare"로 처리
        df["Title"].fillna("Rare", inplace=True)
        
        # 라벨 인코딩 (문자열을 숫자로 변환)
        title_mapping = {"Master": 0, "Miss": 1, "Mr": 2, "Mrs": 3, "Rare": 4}
        df["Title"] = df["Title"].map(title_mapping)
        
        return df

