import pandas as pd
from pandas import DataFrame
from app.grade.grade_dataset import GradeDataSet
from typing import Tuple

class GradeMethod(object):

    def __init__(self):
        self.dataset = GradeDataSet()

    def read_csv(self, train_fname: str, test_fname: str) -> tuple[pd.DataFrame, pd.DataFrame]:
        # train.csv와 test.csv 파일을 읽어와서 반환
        return (pd.read_csv(train_fname), pd.read_csv(test_fname))

    def create_df(self, train_df: DataFrame, test_df: DataFrame, label: str) -> tuple[pd.DataFrame, pd.DataFrame]:
        # esg_rating 값을 제거한 데이터프레임 작성
        # test_df에는 label 컬럼이 없을 수 있으므로 존재할 때만 제거
        train_result = train_df.drop(columns=[label]) if label in train_df.columns else train_df
        test_result = test_df.drop(columns=[label]) if label in test_df.columns else test_df
        return (train_result, test_result)

    def create_label(self, train_df: DataFrame, test_df: DataFrame, label: str) -> tuple[pd.DataFrame, pd.DataFrame]:
        # esg_rating 값만 가지는 답안지 데이터프레임 작성
        train_label = train_df[label] if label in train_df.columns else pd.Series()
        test_label = test_df[label] if label in test_df.columns else pd.Series()
        return (train_label, test_label)

    def drop_features(self, train_df: DataFrame, test_df: DataFrame, *features: str)-> tuple[pd.DataFrame, pd.DataFrame]:
        # 피쳐를 삭제하는 메소드
        # 존재하는 컬럼만 삭제
        features_list = list(features)
        train_cols_to_drop = [col for col in features_list if col in train_df.columns]
        test_cols_to_drop = [col for col in features_list if col in test_df.columns]
        train_result = train_df.drop(columns=train_cols_to_drop) if train_cols_to_drop else train_df
        test_result = test_df.drop(columns=test_cols_to_drop) if test_cols_to_drop else test_df
        return (train_result, test_result)

    def check_null(self, train_df, test_df) -> Tuple[int, int]:
        # 널을 체크하는 메소드
        return (int(train_df.isnull().sum().sum()), int(test_df.isnull().sum().sum()))

    # 척도: nominal , ordinal , interval , ratio

    def company_name_Nominal(self, train_df: DataFrame, test_df: DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
        # company_name은 이미 삭제되었으므로 그대로 반환
        return train_df, test_df

    def company_code_Nominal(self, train_df: DataFrame, test_df: DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
        """
        company_code: 회사 코드 (nominal 척도)
        - 문자열을 라벨 인코딩으로 변환합니다.
        - train 기준으로 매핑을 생성하고 test에도 동일하게 적용합니다.
        """
        train_df = train_df.copy()
        test_df = test_df.copy()
        
        # train 기준으로 company_code 라벨 인코딩(고유값에 숫자 매핑)
        unique_codes = train_df["company_code"].unique()
        code_mapping = {code: idx for idx, code in enumerate(unique_codes)}
        
        # train에 매핑 적용
        train_df["company_code"] = train_df["company_code"].map(code_mapping)
        
        # test에 매핑 적용 (train에 없는 코드는 -1로 처리)
        test_df["company_code"] = test_df["company_code"].map(lambda x: code_mapping.get(x, -1))
        
        return train_df, test_df

    def env_rating_Ordinal(self, train_df: DataFrame, test_df: DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
        """
        env_rating: 환경 등급 (ordinal 척도)
        - 등급을 숫자로 변환합니다 (S=0, A+=1, A=2, B+=3, B=4, C=5, D=6, 등급없음=7)
        """
        train_df = train_df.copy()
        test_df = test_df.copy()
        
        # 등급 매핑
        rating_mapping = {
            'S': 0,
            'A+': 1,
            'A': 2,
            'B+': 3,
            'B': 4,
            'C': 5,
            'D': 6,
            '등급없음': 7
        }
        train_df["env_rating"] = train_df["env_rating"].map(rating_mapping)
        test_df["env_rating"] = test_df["env_rating"].map(rating_mapping)
        
        return train_df, test_df

    def soc_rating_Ordinal(self, train_df: DataFrame, test_df: DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
        """
        soc_rating: 사회 등급 (ordinal 척도)
        - 등급을 숫자로 변환합니다 (S=0, A+=1, A=2, B+=3, B=4, C=5, D=6, 등급없음=7)
        """
        train_df = train_df.copy()
        test_df = test_df.copy()
        
        # 등급 매핑
        rating_mapping = {
            'S': 0,
            'A+': 1,
            'A': 2,
            'B+': 3,
            'B': 4,
            'C': 5,
            'D': 6,
            '등급없음': 7
        }
        train_df["soc_rating"] = train_df["soc_rating"].map(rating_mapping)
        test_df["soc_rating"] = test_df["soc_rating"].map(rating_mapping)
        
        return train_df, test_df

    def gov_rating_Ordinal(self, train_df: DataFrame, test_df: DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
        """
        gov_rating: 지배구조 등급 (ordinal 척도)
        - 등급을 숫자로 변환합니다 (S=0, A+=1, A=2, B+=3, B=4, C=5, D=6, 등급없음=7)
        """
        train_df = train_df.copy()
        test_df = test_df.copy()
        
        # 등급 매핑
        rating_mapping = {
            'S': 0,
            'A+': 1,
            'A': 2,
            'B+': 3,
            'B': 4,
            'C': 5,
            'D': 6,
            '등급없음': 7
        }
        train_df["gov_rating"] = train_df["gov_rating"].map(rating_mapping)
        test_df["gov_rating"] = test_df["gov_rating"].map(rating_mapping)
        
        return train_df, test_df

    def year_Ordinal(self, train_df: DataFrame, test_df: DataFrame) -> tuple[pd.DataFrame, pd.DataFrame]:
        """
        year: 연도 (ordinal 척도)
        - 문자열을 숫자로 변환합니다.
        """
        train_df = train_df.copy()
        test_df = test_df.copy()
        
        # year를 숫자로 변환(pd.to_numeric 사용하여 안전하게 변환)
        train_df["year"] = pd.to_numeric(train_df["year"], errors='coerce').astype(int)
        test_df["year"] = pd.to_numeric(test_df["year"], errors='coerce').astype(int)
        
        return train_df, test_df
