# 카카오 맵 호출하는 메소드

import requests
import os
import logging
from pathlib import Path
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

class KakaoMapSingleton:
    _instance = None  # 싱글턴 인스턴스를 저장할 클래스 변수

    def __new__(cls):
        if cls._instance is None:  # 인스턴스가 없으면 생성
            cls._instance = super(KakaoMapSingleton, cls).__new__(cls)
            cls._instance._api_key = cls._instance._retrieve_api_key()  # API 키 가져오기
            cls._instance._base_url = "https://dapi.kakao.com/v2/local"  # 카카오맵 API 기본 URL
        return cls._instance  # 기존 인스턴스 반환

    def _retrieve_api_key(self):
        """API 키를 환경 변수 또는 .env 파일에서 가져오는 내부 메서드"""
        # 1. 먼저 환경 변수에서 직접 읽기 (Docker 환경 변수 우선)
        api_key = os.getenv('KAKAO_REST_API_KEY') or os.getenv('KAKAO_API_KEY')
        
        if api_key:
            return api_key
        
        # 2. .env 파일에서 읽기 시도
        current_file = Path(__file__)
        
        # 여러 경로에서 .env 파일 찾기
        possible_paths = [
            current_file.parent.parent.parent.parent / '.env',  # ai.aifixr.site/.env
            current_file.parent.parent.parent / '.env',  # mlservice/.env
            current_file.parent.parent / '.env',  # app/.env
            Path('.env'),  # 현재 작업 디렉토리
            Path('/app/.env'),  # Docker 컨테이너 내부 경로
        ]
        
        env_file = None
        for path in possible_paths:
            if path.exists():
                env_file = path
                break
        
        if env_file:
            load_dotenv(env_file)
            logger.info(f"📂 .env 파일 로드: {env_file}")
        else:
            # 상위 디렉토리에서도 시도
            load_dotenv()
        
        # 3. 다시 환경 변수에서 읽기
        api_key = os.getenv('KAKAO_REST_API_KEY') or os.getenv('KAKAO_API_KEY')
        
        if not api_key:
            raise ValueError(
                "카카오 REST API 키를 찾을 수 없습니다. "
                "환경 변수 또는 .env 파일에 KAKAO_REST_API_KEY 또는 KAKAO_API_KEY를 설정해주세요. "
                f"시도한 경로: {[str(p) for p in possible_paths]}"
            )
        
        return api_key

    def geocode(self, address, language='ko'):
        """
        주소 또는 장소명을 좌표로 변환 (카카오맵 API)
        
        Args:
            address: 검색할 주소 또는 장소명
            language: 언어 설정 (기본값: 'ko')
        
        Returns:
            Google Maps API와 호환되는 형식의 결과 리스트
        """
        # 키워드 검색 API 사용 (장소명 검색에 더 적합)
        url = f"{self._base_url}/search/keyword.json"
        headers = {'Authorization': f'KakaoAK {self._api_key}'}
        params = {'query': address}
        
        try:
            response = requests.get(url, headers=headers, params=params)
            
            # 403 오류인 경우 상세 정보 로깅
            if response.status_code == 403:
                logger.error(f"카카오맵 API 403 오류 - 응답: {response.text}")
                logger.error(f"사용된 API 키 (처음 10자): {self._api_key[:10]}...")
            
            response.raise_for_status()
            
            result = response.json()
            
            if result.get('documents') and len(result['documents']) > 0:
                doc = result['documents'][0]
                
                # 키워드 검색 API 응답 형식에 맞게 파싱
                # 키워드 검색은 address_name 또는 road_address_name을 직접 제공
                formatted_address = doc.get('address_name', '') or doc.get('road_address_name', '')
                
                # address 객체에서 지역 정보 추출
                address_info = doc.get('address', {})
                if not address_info:
                    # road_address에서 시도
                    address_info = doc.get('road_address', {})
                
                # Google Maps API와 호환되는 형식으로 변환
                formatted_result = [{
                    'formatted_address': formatted_address,
                    'geometry': {
                        'location': {
                            'lat': float(doc.get('y', 0)),
                            'lng': float(doc.get('x', 0))
                        }
                    },
                    'address_components': [
                        {
                            'long_name': address_info.get('region_1depth_name', ''),
                            'short_name': address_info.get('region_1depth_name', ''),
                            'types': ['administrative_area_level_1']
                        },
                        {
                            'long_name': address_info.get('region_2depth_name', ''),
                            'short_name': address_info.get('region_2depth_name', ''),
                            'types': ['administrative_area_level_2']
                        },
                        {
                            'long_name': address_info.get('region_3depth_name', ''),
                            'short_name': address_info.get('region_3depth_name', ''),
                            'types': ['locality']
                        }
                    ]
                }]
                
                return formatted_result
            else:
                return []
                
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403:
                logger.error(f"카카오맵 API 인증 오류 (403 Forbidden): API 키를 확인해주세요. URL: {url}")
            else:
                logger.error(f"카카오맵 API HTTP 오류 ({e.response.status_code}): {str(e)}")
            return []
        except requests.exceptions.RequestException as e:
            logger.error(f"카카오맵 API 호출 오류: {str(e)}")
            return []

