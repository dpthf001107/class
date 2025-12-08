import pandas as pd
from pandas import DataFrame
from app.grade.grade_dataset import GradeDataSet

class GradeMethod(object):

    def __init__(self):
        self.dataset = GradeDataSet()


    def new_model(self, fname: str) -> pd.DataFrame:
        # train.csv 파일을 읽어와서 데이터셋 객체에 저장
        return pd.read_csv(fname)

    def create_train(self, df: DataFrame, label: str) -> pd.DataFrame:
        #esg_rating 값을 제거한 데이터프레임 작성
        return df.drop(columns=[label])

    def create_label(self, df: DataFrame, label: str) -> pd.DataFrame:
        #esg_rating 값만 가지는 답안지 데이터프레임 작성
        return df[label]

    def drop_features(self, df: DataFrame, *features: str)-> pd.DataFrame:
        #피쳐를 삭제하는 메소드
        return df.drop(columns=[f for f in features])


    def check_null(self, df: DataFrame) -> int:
        #널을 체크하는 메소드
        return int(df.isnull().sum().sum())

    # 척도: nominal , ordinal , interval , ratio

    def company_name_Nominal(self, df: DataFrame) -> pd.DataFrame:
        # company_name은 이미 삭제되었으므로 그대로 반환
        return df

    def company_code_Nominal(self, df: DataFrame) -> pd.DataFrame:
        """
        company_code: 회사 코드 (nominal 척도)
        - 문자열을 라벨 인코딩으로 변환합니다.
        """
        df = df.copy()
        
        # company_code를 라벨 인코딩 (고유값에 대해 숫자 매핑)
        unique_codes = df["company_code"].unique()
        code_mapping = {code: idx for idx, code in enumerate(unique_codes)}
        df["company_code"] = df["company_code"].map(code_mapping)
        
        return df

    def env_rating_Ordinal(self, df: DataFrame) -> pd.DataFrame:
        """
        env_rating: 환경 등급 (ordinal 척도)
        - 등급을 숫자로 변환합니다 (S=0, A+=1, A=2, B+=3, B=4, C=5, D=6, 등급없음=7)
        """
        df = df.copy()
        
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
        df["env_rating"] = df["env_rating"].map(rating_mapping)
        
        return df

    def soc_rating_Ordinal(self, df: DataFrame) -> pd.DataFrame:
        """
        soc_rating: 사회 등급 (ordinal 척도)
        - 등급을 숫자로 변환합니다 (S=0, A+=1, A=2, B+=3, B=4, C=5, D=6, 등급없음=7)
        """
        df = df.copy()
        
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
        df["soc_rating"] = df["soc_rating"].map(rating_mapping)
        
        return df

    def gov_rating_Ordinal(self, df: DataFrame) -> pd.DataFrame:
        """
        gov_rating: 지배구조 등급 (ordinal 척도)
        - 등급을 숫자로 변환합니다 (S=0, A+=1, A=2, B+=3, B=4, C=5, D=6, 등급없음=7)
        """
        df = df.copy()
        
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
        df["gov_rating"] = df["gov_rating"].map(rating_mapping)
        
        return df

    def year_Ordinal(self, df: DataFrame) -> pd.DataFrame:
        """
        year: 연도 (ordinal 척도)
        - 문자열을 정수로 변환합니다.
        """
        df = df.copy()
        
        # year를 정수로 변환 (pd.to_numeric 사용하여 안전하게 변환)
        df["year"] = pd.to_numeric(df["year"], errors='coerce').astype(int)
        
        return df