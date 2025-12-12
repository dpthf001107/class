import pandas as pd
import logging
import numpy as np
import os
import matplotlib
matplotlib.use('Agg')  # GUI 백엔드 없이 사용
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
from sklearn.preprocessing import MinMaxScaler
from app.seoul_crime.seoul_method import SeoulMethod
from app.seoul_crime.seoul_data import SeoulData
from app.seoul_crime.kakao_map_singletone import KakaoMapSingleton

# 한글 폰트 설정
def setup_korean_font():
    """한글 폰트 설정"""
    _logger = logging.getLogger(__name__)
    try:
        # 나눔고딕 폰트 경로 찾기
        font_paths = [
            '/usr/share/fonts/truetype/nanum/NanumGothic.ttf',
            '/usr/share/fonts/truetype/nanum/NanumGothicCoding.ttf',
            '/System/Library/Fonts/AppleGothic.ttf',  # macOS
            'C:/Windows/Fonts/malgun.ttf',  # Windows
        ]
        
        font_path = None
        for path in font_paths:
            if os.path.exists(path):
                font_path = path
                break
        
        if font_path:
            font_prop = fm.FontProperties(fname=font_path)
            plt.rcParams['font.family'] = font_prop.get_name()
            _logger.info(f"✅ 한글 폰트 설정 완료: {font_path}")
        else:
            # 폰트 파일을 찾지 못한 경우, 시스템 폰트 목록에서 한글 폰트 찾기
            font_list = [f.name for f in fm.fontManager.ttflist]
            korean_fonts = ['NanumGothic', 'NanumGothicCoding', 'Malgun Gothic', 'AppleGothic', 'Noto Sans CJK KR']
            for font_name in korean_fonts:
                if font_name in font_list:
                    plt.rcParams['font.family'] = font_name
                    _logger.info(f"✅ 한글 폰트 설정 완료: {font_name}")
                    return
            
            # 한글 폰트를 찾지 못한 경우 경고
            _logger.warning("⚠️ 한글 폰트를 찾을 수 없습니다. 기본 폰트를 사용합니다.")
            plt.rcParams['font.family'] = 'DejaVu Sans'
    except Exception as e:
        _logger.warning(f"⚠️ 한글 폰트 설정 중 오류: {str(e)}")
        plt.rcParams['font.family'] = 'DejaVu Sans'

# 모듈 로드 시 한글 폰트 설정
setup_korean_font()

# Logger 설정
logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)


class SeoulService:
    """서울 범죄에 따른 구별 cctv 할당 처리 및 머신러닝 서비스"""

    def __init__(self):
        self.method = SeoulMethod()
        self.dataset = SeoulData()
        self.data_path = self.dataset.dname
        self.df_pop_cleaned = None  # 정리된 인구 데이터 저장

    def preprocess(self):
        """CCTV와 인구 데이터 전처리 및 머지"""
        # 1. 데이터 로드
        cctv_path = os.path.join(self.data_path, 'cctv.csv')
        pop_path = os.path.join(self.data_path, 'pop.xls')
        crime_path = os.path.join(self.data_path, 'crime.csv')
        
        df_cctv = self.method.csv_to_df(cctv_path)
        df_pop = self.method.xlsx_to_df(pop_path)
        df_crime = self.method.csv_to_df(crime_path)

        # CCTV 데이터 컬럼 정리: 좌로부터 1, 2번째 컬럼만 유지
        logger.info("\n🧹 CCTV 데이터 컬럼 정리")
        logger.info(f"  원본 컬럼: {df_cctv.columns.tolist()}")
        if len(df_cctv.columns) >= 2:
            cols_to_keep = [df_cctv.columns[0], df_cctv.columns[1]]
            df_cctv = df_cctv[cols_to_keep]
            logger.info(f"  유지된 컬럼: {cols_to_keep}")
        else:
            logger.warning("  컬럼이 2개 미만입니다.")

        # '자치구' 컬럼 확인 및 매핑
        logger.info(f"\n📋 인구 데이터 컬럼: {', '.join(df_pop.columns.tolist())}")
        if '자치구' not in df_pop.columns:
            # '자치구_자치구' 컬럼이 있으면 '자치구'로 rename
            if '자치구_자치구' in df_pop.columns:
                df_pop = df_pop.rename(columns={'자치구_자치구': '자치구'})
                logger.info(f"  '자치구_자치구' → '자치구'로 변경")
            else:
                # 첫 번째 컬럼을 '자치구'로 rename
                if len(df_pop.columns) > 0:
                    first_col = df_pop.columns[0]
                    if '기간' not in str(first_col) and '합계' not in str(first_col):
                        df_pop = df_pop.rename(columns={first_col: '자치구'})
                        logger.info(f"  '{first_col}' → '자치구'로 변경")
        
        if '자치구' not in df_pop.columns:
            raise ValueError(f"'자치구' 컬럼을 찾을 수 없습니다. 사용 가능한 컬럼: {df_pop.columns.tolist()}")
        
        # 인구 데이터 정리 (메서드로 분리)
        df_pop = self._clean_population_data(df_pop)
        
        # 정리된 인구 데이터를 인스턴스 변수로 저장 (generate_heatmap에서 재사용)
        self.df_pop_cleaned = df_pop.copy()
        



        # 2. 데이터 확인 (상위 5개)
        logger.info("📊 CCTV 데이터 (상위 5개)")
        logger.info(f"\n{df_cctv.head(5).to_string()}")
        
        logger.info("\n📊 인구 데이터 (상위 5개)")
        logger.info(f"\n{df_pop.head(5).to_string()}")
        
        logger.info("\n📊 범죄 데이터 (상위 5개)")
        logger.info(f"\n{df_crime.head(5).to_string()}")
        
        # 3. CCTV와 인구 데이터 머지
        df_merged = self.method.df_merge(
            df_cctv, 
            df_pop, 
            left_on='기관명', 
            right_on='자치구', 
            how='inner'
        )
        
        # 4. 머지 결과 확인
        logger.info("\n✅ 머지 결과 (상위 5개)")
        logger.info(f"\n{df_merged.head(5).to_string()}")
        
        # 5. 관서명에 따른 경찰서 주소 찾기
        station_names = []  # 경찰서 관서명 리스트
        
        for name in df_crime['관서명']:
            station_names.append('서울' + str(name[:-1]) + '경찰서')
        
        logger.info(f"🔥💧경찰서 관서명 리스트: {station_names}")
        
        station_addrs = []
        station_lats = []
        station_lngs = []
        
        kakao_map1 = KakaoMapSingleton()
        kakao_map2 = KakaoMapSingleton()
        
        if kakao_map1 is kakao_map2:
            logger.info("동일한 객체 입니다.")
        else:
            logger.info("다른 객체 입니다.")
        
        kakao_map = KakaoMapSingleton()  # 카카오맵 객체 생성
        
        for name in station_names:
            tmp = kakao_map.geocode(name, language='ko')
            if tmp and len(tmp) > 0:
                logger.info(f"{name}의 검색 결과: {tmp[0].get('formatted_address')}")
                station_addrs.append(tmp[0].get("formatted_address"))
                tmp_loc = tmp[0].get("geometry")
                station_lats.append(tmp_loc['location']['lat'])
                station_lngs.append(tmp_loc['location']['lng'])
            else:
                logger.warning(f"⚠️ {name}의 주소를 찾을 수 없습니다.")
                station_addrs.append("")  # 빈 문자열 추가
                station_lats.append(0.0)
                station_lngs.append(0.0)
        
        logger.info(f"🔥💧자치구 리스트: {station_addrs}")
        
        # 위도/경도 정보 출력
        logger.info(f"🔥💧위도(Latitude) 리스트: {station_lats}")
        logger.info(f"🔥💧경도(Longitude) 리스트: {station_lngs}")
        
        # 경찰서별 상세 정보 테이블 형태로 출력
        logger.info("\n" + "="*100)
        logger.info("📍 경찰서 위치 정보 상세")
        logger.info("="*100)
        location_df = pd.DataFrame({
            '경찰서명': station_names,
            '주소': station_addrs,
            '위도(Lat)': station_lats,
            '경도(Lng)': station_lngs
        })
        logger.info(f"\n{location_df.to_string(index=False)}")
        logger.info("="*100 + "\n")
        
        gu_names = []
        for addr in station_addrs:
            if addr:  # 빈 문자열이 아닌 경우만 처리
                tmp = addr.split()
                tmp_gu = [gu for gu in tmp if gu[-1] == '구']
                if tmp_gu:
                    gu_names.append(tmp_gu[0])
                else:
                    logger.warning(f"⚠️ 주소에서 자치구를 찾을 수 없습니다: {addr}")
                    gu_names.append("")  # 빈 문자열 추가
            else:
                gu_names.append("")  # 빈 문자열 추가
        
        logger.info(f"🔥💧자치구 리스트 2: {gu_names}")
        
        # crime 데이터프레임에 '자치구' 컬럼을 제일 앞에 추가
        df_crime.insert(0, '자치구', gu_names)
        
        # 관서명을 '서울ㅇㅇ경찰서' 형식으로 변경
        df_crime['관서명'] = station_names
        logger.info(f"\n✅ 관서명이 '서울ㅇㅇ경찰서' 형식으로 변경되었습니다.")
        
        # save 폴더에 저장
        save_path = os.path.join(self.dataset.sname, 'crime_with_gu.csv')
        df_crime.to_csv(save_path, index=False, encoding='utf-8-sig')
        logger.info(f"\n💾 자치구가 추가된 Crime 데이터 저장 완료: {save_path}")
        logger.info(f"   저장된 데이터 shape: {df_crime.shape}")
        logger.info(f"   컬럼: {df_crime.columns.tolist()}")
        logger.info("\n📊 저장된 Crime 데이터 (상위 5개)")
        logger.info(f"\n{df_crime.head(5).to_string()}")
        
        # 포스트맨 응답용 데이터 구성
        return {
            "status": "success",
            "cctv_rows": len(df_cctv),
            "cctv_columns": df_cctv.columns.tolist(),
            "crime_rows": len(df_crime),
            "crime_columns": df_crime.columns.tolist(),
            "pop_rows": len(df_pop),
            "pop_columns": df_pop.columns.tolist(),
            "cctv_pop_rows": len(df_merged),
            "cctv_pop_columns": df_merged.columns.tolist(),
            "cctv_preview": df_cctv.head(3).to_dict(orient='records'),
            "crime_preview": df_crime.head(3).to_dict(orient='records'),
            "pop_preview": df_pop.head(3).to_dict(orient='records'),
            "cctv_pop_preview": df_merged.head(3).to_dict(orient='records'),
            "saved_crime_file": save_path,
            "message": "데이터 전처리 및 머지가 완료되었습니다"

            
        }
    
    def _clean_population_data(self, df_pop):
        """인구 데이터 정리 메서드 (preprocess와 generate_heatmap에서 공통 사용)"""
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
        
    def generate_heatmap(self):
        """
        서울 범죄 발생 데이터 히트맵 생성
        
        SeoulMethod의 generate_heatmap 메서드를 호출하여 전체 프로세스를 수행합니다.
        """
        try:
            # 한글 폰트 재설정 (히트맵 생성 전)
            setup_korean_font()
            
            # 파일 경로 설정
            crime_csv_path = os.path.join(self.dataset.sname, 'crime_with_gu.csv')
            pop_path = os.path.join(self.data_path, 'pop.xls')
            save_dir = self.dataset.sname
            
            # SeoulMethod의 generate_heatmap 메서드 호출 (전체 프로세스 포함)
            result = self.method.generate_heatmap(
                crime_csv_path=crime_csv_path,
                pop_path=pop_path,
                save_dir=save_dir,
                df_pop_cleaned=self.df_pop_cleaned,
                crime_type='발생'
            )
            
            return result
            
        except Exception as e:
            import traceback
            error_detail = traceback.format_exc()
            logger.error(f"❌ 히트맵 생성 오류: {str(e)}")
            logger.error(error_detail)
            raise
    
    def generate_heatmap_arrest(self):
        """
        서울 범죄 검거 데이터 히트맵 생성
        
        SeoulMethod의 generate_heatmap 메서드를 호출하여 검거 히트맵을 생성합니다.
        """
        try:
            # 한글 폰트 재설정 (히트맵 생성 전)
            setup_korean_font()
            
            # 파일 경로 설정
            crime_csv_path = os.path.join(self.dataset.sname, 'crime_with_gu.csv')
            pop_path = os.path.join(self.data_path, 'pop.xls')
            save_dir = self.dataset.sname
            
            # SeoulMethod의 generate_heatmap 메서드 호출 (검거 데이터)
            result = self.method.generate_heatmap(
                crime_csv_path=crime_csv_path,
                pop_path=pop_path,
                save_dir=save_dir,
                df_pop_cleaned=self.df_pop_cleaned,
                crime_type='검거'
            )
            
            return result
            
        except Exception as e:
            import traceback
            error_detail = traceback.format_exc()
            logger.error(f"❌ 검거 히트맵 생성 오류: {str(e)}")
            logger.error(error_detail)
            raise
    
    def generate_folium_map(self):
        """
        서울시 범죄 발생률 Folium 지도 생성
        
        Returns:
            생성된 지도 파일 경로와 데이터 요약 정보
        """
        try:
            # 파일 경로 설정
            crime_csv_path = os.path.join(self.dataset.sname, 'crime_with_gu.csv')
            pop_path = os.path.join(self.data_path, 'pop.xls')
            geo_json_path = os.path.join(self.data_path, 'kr-state.json')
            save_dir = self.dataset.sname
            
            # SeoulMethod의 generate_folium_map 메서드 호출 (발생 데이터만)
            result = self.method.generate_folium_map(
                crime_csv_path=crime_csv_path,
                pop_path=pop_path,
                geo_json_path=geo_json_path,
                save_dir=save_dir,
                df_pop_cleaned=self.df_pop_cleaned,
                crime_type='발생'
            )
            
            return result
            
        except Exception as e:
            import traceback
            error_detail = traceback.format_exc()
            logger.error(f"❌ Folium 지도 생성 오류: {str(e)}")
            logger.error(error_detail)
            raise

        
