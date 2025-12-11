import pandas as pd
from pandas import DataFrame
from app.seoul_crime.seoul_data import SeoulData   
import logging
import os
import matplotlib
matplotlib.use('Agg')  # GUI 백엔드 없이 사용
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import MinMaxScaler

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

    def _clean_population_data(self, df_pop):
        """인구 데이터 정리 메서드"""
        logger.info("\n🧹 인구 데이터 컬럼 및 행 정리")
        
        # 1. axis=1: 자치구 컬럼과 좌로부터 4번째 컬럼만 남기고 나머지 삭제
        if '자치구' in df_pop.columns:
            # 자치구 컬럼의 인덱스 찾기
            자치구_idx = df_pop.columns.get_loc('자치구')
            # 좌로부터 4번째 컬럼 (인덱스 3)
            if len(df_pop.columns) > 3:
                cols_to_keep = [df_pop.columns[자치구_idx], df_pop.columns[3]]
                df_pop = df_pop[cols_to_keep]
                logger.info(f"  유지된 컬럼: {cols_to_keep}")
            else:
                logger.warning("  컬럼이 4개 미만입니다.")
        
        # 2. axis=0: 위로부터 2, 3, 4 번째 행 제거 (인덱스 1, 2, 3)
        if len(df_pop) > 3:
            df_pop = df_pop.drop(df_pop.index[1:4])  # 인덱스 1, 2, 3 제거
            logger.info(f"  인덱스 1, 2, 3 행 제거 완료")
        else:
            logger.warning("  행이 4개 미만입니다.")
        
        # 3. 인구수 컬럼명을 '인구'로 변경 및 데이터 타입 변환
        if len(df_pop.columns) >= 2:
            # 두 번째 컬럼이 인구수 컬럼
            pop_col = df_pop.columns[1]
            df_pop = df_pop.rename(columns={pop_col: '인구'})
            
            # 숫자가 아닌 행 제거 (예: '계', '합계' 등)
            df_pop = df_pop[df_pop['인구'].astype(str).str.replace(',', '').str.isdigit()]
            
            # 인구수 데이터 타입 변환 (쉼표 제거)
            df_pop['인구'] = df_pop['인구'].astype(str).str.replace(',', '').astype(float)
            logger.info(f"  인구 데이터 정리 완료")
        
        return df_pop

    def generate_heatmap(self, crime_csv_path: str, pop_path: str, save_dir: str, 
                         df_pop_cleaned: pd.DataFrame = None,
                         crime_type: str = '발생') -> dict:
        """
        서울 범죄 데이터 히트맵 생성 (전체 프로세스 포함)
        
        Args:
            crime_csv_path: 범죄 데이터 CSV 파일 경로
            pop_path: 인구 데이터 Excel 파일 경로
            save_dir: 저장 경로
            df_pop_cleaned: 정리된 인구 데이터 (선택사항, 있으면 재사용)
            crime_type: 범죄 유형 ('발생' 또는 '검거'), 기본값: '발생'
        
        Returns:
            생성된 히트맵 파일 경로와 데이터 요약 정보를 포함한 딕셔너리
        """
        try:
            # crime_type 검증
            if crime_type not in ['발생', '검거']:
                raise ValueError(f"crime_type은 '발생' 또는 '검거'여야 합니다. 현재 값: {crime_type}")
            
            # crime_type에 따른 컬럼명 설정
            if crime_type == '검거':
                numeric_cols = ['살인 검거', '강도 검거', '강간 검거', '절도 검거', '폭력 검거']
                required_cols = ['자치구', '살인 검거', '강도 검거', '강간 검거', '절도 검거', '폭력 검거']
                crime_cols = ['살인 검거', '강도 검거', '강간 검거', '절도 검거', '폭력 검거']
                title_prefix = "서울시 범죄 검거률 정규화 히트맵 (인구수 대비"
                cbar_label = '정규화된 범죄 검거률 (인구수 대비)'
                heatmap_filename = 'heatmap_arrest.png'
                log_prefix = "검거"
            else:  # crime_type == '발생'
                numeric_cols = ['살인 발생', '강도 발생', '강간 발생', '절도 발생', '폭력 발생']
                required_cols = ['자치구', '살인 발생', '강도 발생', '강간 발생', '절도 발생', '폭력 발생']
                crime_cols = ['살인 발생', '강도 발생', '강간 발생', '절도 발생', '폭력 발생']
                title_prefix = "서울시 범죄 발생률 정규화 히트맵 (인구수 대비"
                cbar_label = '정규화된 범죄 발생률 (인구수 대비)'
                heatmap_filename = 'heatmap.png'
                log_prefix = "발생"
            
            # 1. CSV 파일 읽기
            logger.info(f"\n📂 CSV 파일 읽기: {crime_csv_path}")
            
            if not os.path.exists(crime_csv_path):
                raise FileNotFoundError(f"파일을 찾을 수 없습니다: {crime_csv_path}")
            
            # CSV 파일 읽기 (쉼표로 구분)
            df = pd.read_csv(crime_csv_path, encoding='utf-8-sig')
            logger.info(f"  원본 데이터 shape: {df.shape}")
            logger.info(f"  원본 컬럼: {df.columns.tolist()}")
            
            # 숫자 컬럼에서 쉼표 제거 및 숫자 변환
            for col in numeric_cols:
                if col in df.columns:
                    # 문자열인 경우 쉼표 제거 후 숫자 변환
                    df[col] = df[col].astype(str).str.replace(',', '').astype(float)
            
            logger.info(f"\n✅ CSV 파일 읽기 완료")
            logger.info(f"  데이터 shape: {df.shape}")
            logger.info(f"  상위 3개:\n{df.head(3).to_string()}")
            
            # 2. 히트맵 생성에 필요한 컬럼만 남기기
            logger.info(f"\n🧹 히트맵 생성에 필요한 컬럼만 선택 ({log_prefix} 데이터)")
            
            # 필수 컬럼이 모두 있는지 확인
            missing_cols = [col for col in required_cols if col not in df.columns]
            if missing_cols:
                raise ValueError(f"필수 컬럼이 없습니다: {missing_cols}")
            
            df_selected = df[required_cols].copy()
            logger.info(f"  선택된 컬럼: {df_selected.columns.tolist()}")
            logger.info(f"  데이터 shape: {df_selected.shape}")
            
            # 3. 동일 자치구에 여러 관서가 있는 경우 건수 합산
            logger.info(f"\n📊 자치구별 {log_prefix} 건수 합산")
            logger.info(f"  합산 전 행 수: {len(df_selected)}")
            logger.info(f"  자치구별 관서 수:\n{df_selected.groupby('자치구').size()}")
            
            df_grouped = df_selected.groupby('자치구')[crime_cols].sum()
            
            logger.info(f"  합산 후 행 수: {len(df_grouped)}")
            logger.info(f"  합산 결과 (상위 5개):\n{df_grouped.head(5).to_string()}")
            
            # 4. 인구 데이터 로드 및 머지
            logger.info("\n📊 인구 데이터 로드 및 머지")
            
            # 이미 정리된 인구 데이터가 있으면 사용, 없으면 로드 및 정리
            if df_pop_cleaned is not None:
                logger.info("  ✅ 정리된 인구 데이터 재사용")
                df_pop = df_pop_cleaned.copy()
            else:
                logger.info("  📂 인구 데이터 로드 및 정리")
                df_pop = self.xlsx_to_df(pop_path)
                
                # 자치구 컬럼 확인 및 매핑
                if '자치구' not in df_pop.columns:
                    if '자치구_자치구' in df_pop.columns:
                        df_pop = df_pop.rename(columns={'자치구_자치구': '자치구'})
                    else:
                        if len(df_pop.columns) > 0:
                            first_col = df_pop.columns[0]
                            if '기간' not in str(first_col) and '합계' not in str(first_col):
                                df_pop = df_pop.rename(columns={first_col: '자치구'})
                
                # 인구 데이터 정리
                df_pop = self._clean_population_data(df_pop)
            
            logger.info(f"  인구 데이터 shape: {df_pop.shape}")
            logger.info(f"  인구 데이터 (상위 5개):\n{df_pop.head(5).to_string()}")
            
            # 범죄 데이터와 인구 데이터 머지
            df_merged = df_grouped.reset_index().merge(df_pop, on='자치구', how='inner')
            df_merged = df_merged.set_index('자치구')
            logger.info(f"  머지 후 shape: {df_merged.shape}")
            logger.info(f"  머지 결과 (상위 3개):\n{df_merged.head(3).to_string()}")
            
            # 5. 인구수 대비 비율 계산 (인구 10만명당)
            logger.info(f"\n📊 인구수 대비 {log_prefix}률 계산 (인구 10만명당)")
            df_rate = df_merged[crime_cols].div(df_merged['인구'], axis=0) * 100000
            logger.info(f"  {log_prefix}률 계산 완료")
            logger.info(f"  {log_prefix}률 결과 (상위 3개):\n{df_rate.head(3).to_string()}")
            
            # 6. 총 범죄 비율 컬럼 추가 (폭력 다음에 추가)
            logger.info(f"\n➕ 총 범죄 {log_prefix}률 컬럼 추가")
            df_rate['범죄'] = df_rate.sum(axis=1)
            
            # 컬럼 순서 재정렬: 살인, 강도, 강간, 절도, 폭력, 범죄 순서
            if crime_type == '검거':
                column_order = ['살인 검거', '강도 검거', '강간 검거', '절도 검거', '폭력 검거', '범죄']
            else:
                column_order = ['살인 발생', '강도 발생', '강간 발생', '절도 발생', '폭력 발생', '범죄']
            
            # 존재하는 컬럼만 재정렬
            existing_columns = [col for col in column_order if col in df_rate.columns]
            if len(existing_columns) != len(column_order):
                missing = set(column_order) - set(existing_columns)
                logger.warning(f"⚠️ 일부 컬럼이 없습니다: {missing}")
            
            df_rate = df_rate[existing_columns]
            logger.info(f"  추가된 컬럼: {df_rate.columns.tolist()}")
            logger.info(f"  총 범죄 {log_prefix}률 (상위 5개):\n{df_rate[['범죄']].head(5).to_string()}")
            
            # 7. 정규화(Normalization) 수행
            logger.info(f"\n📐 MinMax 정규화 수행 ({log_prefix}률 기준, 0~1 사이로 스케일링)")
            # 컬럼 순서 저장
            column_order_before_norm = df_rate.columns.tolist()
            
            scaler = MinMaxScaler()
            df_norm = pd.DataFrame(
                scaler.fit_transform(df_rate),
                columns=df_rate.columns,
                index=df_rate.index
            )
            
            # 컬럼 순서가 유지되었는지 확인
            if df_norm.columns.tolist() != column_order_before_norm:
                logger.warning(f"⚠️ 정규화 후 컬럼 순서가 변경되었습니다. 재정렬합니다.")
                df_norm = df_norm[column_order_before_norm]
            
            logger.info(f"  정규화 완료")
            logger.info(f"  정규화 결과 (상위 3개):\n{df_norm.head(3).to_string()}")
            
            # 8. 정규화된 범죄 비율(총 범죄) 기준으로 내림차순 정렬
            logger.info(f"\n📊 정규화된 범죄 {log_prefix}률(총 범죄) 기준으로 내림차순 정렬")
            # 검거일 때는 정규화된 검거율 기준으로 정렬
            df_norm = df_norm.sort_values(by='범죄', ascending=False)
            logger.info(f"  정렬 완료")
            logger.info(f"  정렬 결과 (상위 5개):\n{df_norm[['범죄']].head(5).to_string()}")
            
            # 9. 히트맵 생성 (빨간색 계열-하얀색)
            logger.info("\n🎨 히트맵 생성 중...")
            
            # 저장 경로 설정
            os.makedirs(save_dir, exist_ok=True)
            
            heatmap_files = []
            
            # X축 레이블 생성 (범죄 유형만 표시, '발생' 또는 '검거' 제거)
            x_labels = []
            for col in df_norm.columns:
                if col == '범죄':
                    x_labels.append('범죄')
                else:
                    # '살인 발생' -> '살인', '살인 검거' -> '살인'
                    label = col.replace(' 발생', '').replace(' 검거', '')
                    x_labels.append(label)
            
            # 히트맵 색상 설정: 검거는 파란색, 발생은 빨간색
            cmap_color = "Blues" if crime_type == '검거' else "Reds"
            
            # 히트맵 생성
            plt.figure(figsize=(14, 10))
            sns.heatmap(df_norm, annot=True, fmt=".6f", cmap=cmap_color, 
                       xticklabels=x_labels, yticklabels=True,
                       cbar_kws={'label': cbar_label})
            plt.title(f"{title_prefix})", fontsize=18, pad=20, fontweight='bold')
            plt.xlabel('범죄 유형', fontsize=14, fontweight='bold')
            plt.ylabel('자치구', fontsize=14, fontweight='bold')
            plt.xticks(rotation=45, ha='right', fontsize=11)
            plt.yticks(rotation=0, fontsize=11)
            plt.tight_layout()
            
            heatmap_path = os.path.join(save_dir, heatmap_filename)
            plt.savefig(heatmap_path, dpi=300, bbox_inches='tight', facecolor='white')
            plt.close()
            heatmap_files.append(heatmap_path)
            logger.info(f"  ✅ 히트맵 저장: {heatmap_path}")
            
            logger.info("\n✅ 히트맵 생성 완료!")
            
            # 반환 데이터 구성
            return {
                "status": "success",
                "message": "히트맵 생성이 완료되었습니다",
                "heatmap_files": heatmap_files,
                "data_summary": {
                    "total_districts": len(df_grouped),
                    "crime_types": df_grouped.columns.tolist(),
                    "normalized_data_preview": df_norm.head(5).to_dict(orient='index')
                }
            }
            
        except Exception as e:
            logger.error(f"❌ 히트맵 생성 오류: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            raise