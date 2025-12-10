import pandas as pd
from pandas import DataFrame
from app.seoul_crime.seoul_data import SeoulData   
import logging

# Logger 설정
logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)


class SeoulMethod(object):

    def __init__(self):
        pass

    # -----------------------------
    # 기본 처리
    # -----------------------------
    def csv_to_df(self, fname: str) -> pd.DataFrame:
        return pd.read_csv(fname)

    def xlsx_to_df(self, fname: str) -> pd.DataFrame:
        """
        Excel 파일을 DataFrame으로 읽기
        
        Args:
            fname: Excel 파일 경로
        
        Returns:
            DataFrame
        """
        try:
            logger.info(f"📖 Excel 파일 읽기: {fname}")
            
            # .xls 파일인 경우 xlrd 사용
            if fname.endswith('.xls'):
                # MultiIndex 컬럼 처리 (header=[0,1]로 첫 두 행을 헤더로)
                df = pd.read_excel(fname, engine='xlrd', header=[0, 1])
            else:
                # .xlsx 파일인 경우 openpyxl 사용
                df = pd.read_excel(fname, engine='openpyxl')
            
            # MultiIndex 컬럼 처리
            if isinstance(df.columns, pd.MultiIndex):
                logger.info("  MultiIndex 컬럼 변환 중...")
                # 첫 번째 레벨과 두 번째 레벨을 결합
                new_columns = []
                for col in df.columns.values:
                    if isinstance(col, tuple) and len(col) == 2:
                        col0 = str(col[0]).strip() if pd.notna(col[0]) else ''
                        col1 = str(col[1]).strip() if pd.notna(col[1]) and str(col[1]) not in ['nan', ''] else ''
                        
                        if col1:
                            new_col = f"{col0}_{col1}"
                        else:
                            new_col = col0
                    else:
                        new_col = str(col[0]) if isinstance(col, tuple) else str(col)
                    
                    new_columns.append(new_col)
                
                df.columns = new_columns
                # 빈 값 정리
                df.columns = [col.replace('_nan', '').replace('nan_', '').replace('__', '_') 
                             for col in df.columns]
            
            logger.info(f"✅ Excel 읽기 완료: {len(df)}행 × {len(df.columns)}컬럼")
            logger.info(f"  컬럼명: {', '.join(df.columns.tolist()[:15])}")  # 처음 15개만
            return df
            
        except Exception as e:
            logger.error(f"❌ Excel 읽기 오류: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            raise
    

    def df_merge(self, left_df: pd.DataFrame, right_df: pd.DataFrame, 
                 left_on: str, right_on: str, how: str = 'inner') -> pd.DataFrame:
        """
        두 DataFrame을 머지하고 중복 컬럼 처리
        
        Args:
            left_df: 왼쪽 DataFrame
            right_df: 오른쪽 DataFrame
            left_on: 왼쪽 키 컬럼명
            right_on: 오른쪽 키 컬럼명
            how: 머지 방식 ('inner', 'left', 'right', 'outer')
        
        Returns:
            머지된 DataFrame
        """
        # 머지 전 중복 컬럼 확인
        common_cols = set(left_df.columns) & set(right_df.columns)
        common_cols.discard(left_on)
        common_cols.discard(right_on)
        
        if common_cols:
            logger.warning(f"⚠️ 중복 컬럼 발견: {common_cols}")
        
        # 머지 수행
        logger.info(f"📊 머지 시작: {left_on} ↔ {right_on} (방식: {how})")
        df_merged = pd.merge(
            left_df, 
            right_df, 
            left_on=left_on, 
            right_on=right_on, 
            how=how,
            suffixes=('', '_drop')  # 오른쪽에 _drop suffix
        )
        
        # 머지 후 처리
        if left_on != right_on:
            # 값이 동일한지 확인
            if (df_merged[left_on] == df_merged[right_on]).all():
                # left_on을 right_on으로 rename하고 right_on 컬럼 제거
                df_merged = df_merged.drop(columns=[right_on])
                df_merged = df_merged.rename(columns={left_on: right_on})
                logger.info(f"✅ '{left_on}' 컬럼을 '{right_on}'으로 변경 ('{left_on}'과 '{right_on}' 값 동일)")
            else:
                logger.warning(f"⚠️ '{left_on}'과 '{right_on}' 값이 다름. 두 컬럼 모두 유지")
        
        # _drop suffix 컬럼 제거
        drop_cols = [col for col in df_merged.columns if col.endswith('_drop')]
        if drop_cols:
            df_merged = df_merged.drop(columns=drop_cols)
            logger.info(f"🗑️ 중복 컬럼 제거: {drop_cols}")
        
        logger.info(f"✨ 머지 완료: {len(df_merged)}개 행, {len(df_merged.columns)}개 컬럼")
        return df_merged

    def geocode(self, address: str, lang: str = 'ko') -> tuple:
        # 주소를 위도, 경도로 변환하는 메소드
        pass

    def get_api_key(self) -> str:
        # api 키를 가져오는 메소드
        pass