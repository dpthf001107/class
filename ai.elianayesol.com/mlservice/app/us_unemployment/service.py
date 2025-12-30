import pandas as pd
import requests
import folium
import logging
import os
from pathlib import Path

# Logger 설정
logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)


class USUnemploymentService:
    """미국 실업률 데이터를 지도로 시각화하는 서비스"""

    def __init__(self):
        """서비스 초기화"""
        self.state_geo = None
        self.state_data = None
        self.map = None
        
        # 데이터 URL
        self.geo_url = "https://raw.githubusercontent.com/python-visualization/folium-example-data/main/us_states.json"
        self.data_url = "https://raw.githubusercontent.com/python-visualization/folium-example-data/main/us_unemployment_oct_2012.csv"
        
        # Save 폴더 경로 설정
        self.save_path = str(Path(__file__).parent / 'save')
        os.makedirs(self.save_path, exist_ok=True)

    def load_data(self):
        """지리 데이터와 실업률 데이터 로드"""
        try:
            logger.info("📂 데이터 로드 중...")
            
            # 지리 데이터 로드
            response = requests.get(self.geo_url)
            response.raise_for_status()
            self.state_geo = response.json()
            logger.info(f"  ✅ 지리 데이터 로드 완료: {len(self.state_geo.get('features', []))}개 주")
            
            # 실업률 데이터 로드
            self.state_data = pd.read_csv(self.data_url)
            logger.info(f"  ✅ 실업률 데이터 로드 완료: {len(self.state_data)}개 행")
            logger.info(f"  컬럼: {self.state_data.columns.tolist()}")
            
            return True
        except Exception as e:
            logger.error(f"❌ 데이터 로드 오류: {str(e)}")
            raise

    def create_map(self, location=[48, -102], zoom_start=3):
        """Folium 지도 생성"""
        try:
            logger.info("🗺️ 지도 생성 중...")
            
            if self.state_geo is None or self.state_data is None:
                raise ValueError("데이터가 로드되지 않았습니다. load_data()를 먼저 호출하세요.")
            
            # 기본 지도 생성
            self.map = folium.Map(location=location, zoom_start=zoom_start)
            
            # Choropleth 레이어 추가
            folium.Choropleth(
                geo_data=self.state_geo,
                name="choropleth",
                data=self.state_data,
                columns=["State", "Unemployment"],
                key_on="feature.id",
                fill_color="YlGn",
                fill_opacity=0.7,
                line_opacity=0.2,
                legend_name="Unemployment Rate (%)",
            ).add_to(self.map)
            
            # 레이어 컨트롤 추가
            folium.LayerControl().add_to(self.map)
            
            logger.info("  ✅ 지도 생성 완료")
            return self.map
            
        except Exception as e:
            logger.error(f"❌ 지도 생성 오류: {str(e)}")
            raise

    def generate_map(self, location=[48, -102], zoom_start=3):
        """데이터 로드 및 지도 생성 (통합 메서드)"""
        self.load_data()
        return self.create_map(location=location, zoom_start=zoom_start)

    def save_map(self, filename="us_unemployment_map.html"):
        """지도를 HTML 파일로 저장"""
        try:
            if self.map is None:
                raise ValueError("지도가 생성되지 않았습니다. create_map() 또는 generate_map()을 먼저 호출하세요.")
            
            # save 폴더에 저장
            filepath = os.path.join(self.save_path, filename)
            self.map.save(filepath)
            logger.info(f"💾 지도 저장 완료: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"❌ 지도 저장 오류: {str(e)}")
            raise

    def get_map(self):
        """생성된 지도 객체 반환"""
        if self.map is None:
            raise ValueError("지도가 생성되지 않았습니다. create_map() 또는 generate_map()을 먼저 호출하세요.")
        return self.map