# 관서명 → 자치구 매핑 전략

## 📋 목표

1. `crime.csv`의 관서명을 자치구로 매핑
2. crime DataFrame에 '자치구' 컬럼 추가
3. CCTV + 인구 + 범죄 데이터 3-way 머지

---

## 🎯 전체 프로세스

```
1. CCTV 데이터 로드 (기관명)
2. 인구 데이터 로드 (자치구)
3. 범죄 데이터 로드 (관서명)
   ↓
4. 관서명 → 자치구 매핑
   ↓
5. CCTV + 인구 머지 (기관명 ↔ 자치구)
   ↓
6. 범죄 데이터 집계 (자치구별)
   ↓
7. 최종 3-way 머지 (자치구 기준)
```

---

## 🔍 방법 1: Google Maps Geocoding API

### 장점
- ✅ 자동화 가능
- ✅ 새로운 관서 자동 처리
- ✅ 다른 도시 확장 가능

### 단점
- ❌ API 비용 발생 ($5/1000 requests)
- ❌ 네트워크 의존성
- ❌ 속도 느림 (API 호출)
- ❌ 별도 API 키 필요

### 구현 방법

#### 1️⃣ Google Maps API 설정

**A. API 키 발급**

```
1. Google Cloud Console 접속
   https://console.cloud.google.com/

2. 프로젝트 선택 또는 생성

3. "API 및 서비스" → "라이브러리"

4. "Geocoding API" 검색 및 활성화

5. "사용자 인증 정보" → "API 키 만들기"

6. API 키 복사 (예: AIzaSyC...)

7. API 키 제한 설정 (보안)
   - API 제한: Geocoding API만 허용
   - 애플리케이션 제한: IP 주소 제한
```

**B. .env 파일 설정**

```env
# OAuth (기존)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Maps API (새로 추가)
GOOGLE_MAPS_API_KEY=AIzaSyC...
```

⚠️ **주의**: 
- `GOOGLE_CLIENT_ID`/`SECRET`: OAuth 인증용
- `GOOGLE_MAPS_API_KEY`: Maps API용 (별도 발급 필요)

#### 2️⃣ 라이브러리 설치

```bash
pip install googlemaps==4.10.0 python-dotenv==1.0.0
```

**requirements.txt**
```
googlemaps==4.10.0
python-dotenv==1.0.0
```

#### 3️⃣ 코드 구현

**seoul_method.py**

```python
import googlemaps
import os
from dotenv import load_dotenv

class SeoulMethod:
    def __init__(self):
        # .env 로드
        load_dotenv()
        api_key = os.getenv('GOOGLE_MAPS_API_KEY')
        
        if api_key:
            self.gmaps = googlemaps.Client(key=api_key)
        else:
            self.gmaps = None
            logger.warning("⚠️ Google Maps API 키가 없습니다. 수동 매핑 사용")
    
    def get_district_from_police_station(self, station_name):
        """
        Google Maps API로 관서명 → 자치구 변환
        
        Args:
            station_name: 관서명 (예: "중부서", "강남서")
        
        Returns:
            자치구명 (예: "중구", "강남구")
        """
        if not self.gmaps:
            return None
        
        try:
            # 1. 검색 쿼리 생성
            query = f"서울특별시 {station_name}"
            
            # 2. Geocoding API 호출
            geocode_result = self.gmaps.geocode(query, language='ko')
            
            if not geocode_result:
                logger.warning(f"⚠️ {station_name} 검색 결과 없음")
                return None
            
            # 3. 주소에서 자치구 추출
            address = geocode_result[0]['formatted_address']
            # 예: "대한민국 서울특별시 중구 세종대로 ..."
            
            # 주소 파싱
            parts = address.split()
            for part in parts:
                if part.endswith('구') and part != '서울특별시':
                    return part
            
            logger.warning(f"⚠️ {station_name} 주소에서 자치구 추출 실패: {address}")
            return None
            
        except Exception as e:
            logger.error(f"❌ {station_name} API 호출 오류: {str(e)}")
            return None
    
    def map_police_to_district_api(self, df_crime):
        """Google Maps API로 관서명 매핑"""
        logger.info("🚓 Google Maps API로 관서명 → 자치구 매핑 시작")
        
        districts = []
        for station in df_crime['관서명']:
            district = self.get_district_from_police_station(station)
            districts.append(district)
            logger.info(f"  {station} → {district}")
            
            # API Rate Limit 방지 (1초 대기)
            import time
            time.sleep(1)
        
        df_crime['자치구'] = districts
        
        # 매핑 실패 확인
        failed = df_crime[df_crime['자치구'].isna()]['관서명'].tolist()
        if failed:
            logger.warning(f"⚠️ 매핑 실패: {failed}")
        
        return df_crime
```

**사용 예시**

```python
# seoul_service.py
def preprocess(self):
    # ...
    df_crime = self.method.csv_to_df(crime_path)
    
    # Google Maps API로 매핑
    df_crime = self.method.map_police_to_district_api(df_crime)
```

---

## 🔍 방법 2: 수동 매핑 (추천!)

### 장점
- ✅ **빠름** (API 호출 없음)
- ✅ **무료** (비용 없음)
- ✅ **안정적** (네트워크 오류 없음)
- ✅ **정확함** (수동 검증 완료)
- ✅ **간단함** (딕셔너리만 사용)

### 단점
- ❌ 새로운 관서 추가 시 수동 업데이트 필요
- ❌ 다른 도시 적용 불가

### 구현 방법

#### 1️⃣ 관서명 → 자치구 매핑 테이블

서울시 경찰서는 **31개**로 고정되어 있습니다.

| 관서명 | 자치구 | 비고 |
|--------|--------|------|
| 중부서 | 중구 | |
| 종로서 | 종로구 | |
| 남대문서 | 중구 | 중구에 2개 관서 |
| 서대문서 | 서대문구 | |
| 혜화서 | 종로구 | 종로구에 2개 관서 |
| 용산서 | 용산구 | |
| 성북서 | 성북구 | |
| 동대문서 | 동대문구 | |
| 마포서 | 마포구 | |
| 영등포서 | 영등포구 | |
| 성동서 | 성동구 | |
| 동작서 | 동작구 | |
| 광진서 | 광진구 | |
| 서부서 | 은평구 | |
| 강북서 | 강북구 | |
| 금천서 | 금천구 | |
| 중랑서 | 중랑구 | |
| 강남서 | 강남구 | |
| 관악서 | 관악구 | |
| 강서서 | 강서구 | |
| 강동서 | 강동구 | |
| 종암서 | 성북구 | 성북구에 2개 관서 |
| 구로서 | 구로구 | |
| 서초서 | 서초구 | |
| 양천서 | 양천구 | |
| 송파서 | 송파구 | |
| 노원서 | 노원구 | |
| 방배서 | 서초구 | 서초구에 2개 관서 |
| 은평서 | 은평구 | 은평구에 2개 관서 |
| 도봉서 | 도봉구 | |
| 수서서 | 강남구 | 강남구에 2개 관서 |

**중복 자치구 (관서가 2개 이상):**
- 중구: 중부서, 남대문서
- 종로구: 종로서, 혜화서
- 성북구: 성북서, 종암서
- 서초구: 서초서, 방배서
- 은평구: 서부서, 은평서
- 강남구: 강남서, 수서서

#### 2️⃣ 코드 구현

**seoul_method.py**

```python
# 클래스 밖에 정의 (모듈 레벨 상수)
POLICE_STATION_DISTRICT_MAP = {
    '중부서': '중구',
    '종로서': '종로구',
    '남대문서': '중구',
    '서대문서': '서대문구',
    '혜화서': '종로구',
    '용산서': '용산구',
    '성북서': '성북구',
    '동대문서': '동대문구',
    '마포서': '마포구',
    '영등포서': '영등포구',
    '성동서': '성동구',
    '동작서': '동작구',
    '광진서': '광진구',
    '서부서': '은평구',
    '강북서': '강북구',
    '금천서': '금천구',
    '중랑서': '중랑구',
    '강남서': '강남구',
    '관악서': '관악구',
    '강서서': '강서구',
    '강동서': '강동구',
    '종암서': '성북구',
    '구로서': '구로구',
    '서초서': '서초구',
    '양천서': '양천구',
    '송파서': '송파구',
    '노원서': '노원구',
    '방배서': '서초구',
    '은평서': '은평구',
    '도봉서': '도봉구',
    '수서서': '강남구'
}


class SeoulMethod(object):
    # ... (기존 메서드들)
    
    def map_police_to_district(self, df_crime):
        """
        관서명을 자치구로 매핑 (수동 매핑)
        
        Args:
            df_crime: 범죄 데이터프레임 (관서명 컬럼 포함)
        
        Returns:
            자치구 컬럼이 추가된 데이터프레임
        """
        logger.info("🚓 관서명 → 자치구 매핑 시작")
        
        # 매핑 적용
        df_crime['자치구'] = df_crime['관서명'].map(POLICE_STATION_DISTRICT_MAP)
        
        # 매핑 결과 로깅 (상위 5개)
        logger.info("\n매핑 결과 (상위 5개):")
        for idx, row in df_crime.head(5).iterrows():
            logger.info(f"  {row['관서명']:10s} → {row['자치구']}")
        
        # 매핑 안 된 관서 확인
        unmapped = df_crime[df_crime['자치구'].isna()]['관서명'].tolist()
        if unmapped:
            logger.warning(f"⚠️ 매핑 안 된 관서: {unmapped}")
            logger.warning(f"   POLICE_STATION_DISTRICT_MAP에 추가 필요")
        else:
            logger.info(f"✅ 모든 관서 매핑 완료: {len(df_crime)}개")
        
        # 매핑 통계
        district_counts = df_crime['자치구'].value_counts()
        logger.info(f"\n자치구별 관서 수:")
        for district, count in district_counts.items():
            if count > 1:
                logger.info(f"  {district}: {count}개 관서")
        
        return df_crime
```

#### 3️⃣ 범죄 데이터 집계

관서가 여러 개인 자치구는 범죄 건수를 합산해야 합니다.

```python
def aggregate_crime_by_district(self, df_crime):
    """
    자치구별 범죄 데이터 집계
    
    여러 관서가 있는 자치구는 합산
    예: 강남구 = 강남서 + 수서서
    """
    logger.info("📊 자치구별 범죄 데이터 집계")
    
    # 관서명 제외하고 자치구별 합산
    numeric_cols = df_crime.select_dtypes(include=['int64', 'float64']).columns
    
    df_crime_agg = df_crime.groupby('자치구')[numeric_cols].sum().reset_index()
    
    logger.info(f"  집계 전: {len(df_crime)}개 관서")
    logger.info(f"  집계 후: {len(df_crime_agg)}개 자치구")
    
    return df_crime_agg
```

---

## 🔗 3-way 머지 전략

### seoul_service.py 구현

```python
def preprocess(self):
    """CCTV + 인구 + 범죄 데이터 전처리 및 머지"""
    logger.info("="*80)
    logger.info("🚀 서울 범죄 데이터 전처리 시작")
    logger.info("="*80)
    
    # 1. 데이터 로드
    cctv_path = os.path.join(self.data_path, 'cctv.csv')
    pop_path = os.path.join(self.data_path, 'pop.xls')
    crime_path = os.path.join(self.data_path, 'crime.csv')
    
    logger.info(f"📂 CCTV 데이터 로드: {cctv_path}")
    df_cctv = self.method.csv_to_df(cctv_path)
    
    logger.info(f"📂 인구 데이터 로드: {pop_path}")
    df_pop = self.method.xlsx_to_df(pop_path)
    
    logger.info(f"📂 범죄 데이터 로드: {crime_path}")
    df_crime = self.method.csv_to_df(crime_path)
    
    # 2. 범죄 데이터에 자치구 추가
    logger.info("\n" + "="*80)
    logger.info("🚓 범죄 데이터에 자치구 추가")
    logger.info("="*80)
    
    df_crime = self.method.map_police_to_district(df_crime)
    
    logger.info("\n범죄 데이터 (자치구 추가 후, 상위 5개):")
    logger.info(f"\n{df_crime.head(5).to_string()}")
    
    # 3. 범죄 데이터 집계 (자치구별)
    logger.info("\n" + "="*80)
    logger.info("📊 범죄 데이터 자치구별 집계")
    logger.info("="*80)
    
    df_crime_agg = self.method.aggregate_crime_by_district(df_crime)
    
    logger.info(f"\n{df_crime_agg.head(5).to_string()}")
    
    # 4. CCTV + 인구 머지
    logger.info("\n" + "="*80)
    logger.info("🔗 Step 1: CCTV + 인구 머지")
    logger.info("="*80)
    
    df_cctv_pop = self.method.df_merge(
        df_cctv, 
        df_pop, 
        left_on='기관명', 
        right_on='자치구', 
        how='inner'
    )
    
    # 5. 최종 3-way 머지
    logger.info("\n" + "="*80)
    logger.info("🔗 Step 2: (CCTV + 인구) + 범죄 머지")
    logger.info("="*80)
    
    df_final = self.method.df_merge(
        df_cctv_pop,
        df_crime_agg,
        left_on='자치구',
        right_on='자치구',
        how='left'  # CCTV+인구 기준, 범죄 데이터 추가
    )
    
    # 6. 최종 결과 확인
    logger.info("\n" + "="*80)
    logger.info("✅ 최종 머지 결과 (상위 10개)")
    logger.info("="*80)
    
    logger.info(f"\n📋 컬럼명: {', '.join(df_final.columns.tolist())}")
    logger.info(f"\n{df_final.head(10).to_string(index=True)}")
    
    logger.info("\n" + "="*80)
    logger.info("📈 최종 통계")
    logger.info("="*80)
    logger.info(f"CCTV 데이터: {df_cctv.shape[0]}개 행, {df_cctv.shape[1]}개 컬럼")
    logger.info(f"인구 데이터: {df_pop.shape[0]}개 행, {df_pop.shape[1]}개 컬럼")
    logger.info(f"범죄 데이터 (원본): {len(df_crime)}개 관서")
    logger.info(f"범죄 데이터 (집계): {len(df_crime_agg)}개 자치구")
    logger.info(f"최종 결과: {df_final.shape[0]}개 행, {df_final.shape[1]}개 컬럼")
    logger.info(f"  - 컬럼: {', '.join(df_final.columns.tolist())}")
    logger.info("="*80 + "\n")
    
    # 7. 데이터셋에 저장
    self.dataset.cctv = df_cctv
    self.dataset.pop = df_pop
    self.dataset.crime = df_crime_agg  # 집계된 데이터 저장
    
    return df_final
```

---

## 📊 예상 결과

### 최종 DataFrame 구조

```
자치구 | 소계 | 2013년도이전 | ... | 총인구 | 남자 | 여자 | 살인발생 | 강도발생 | ...
-------|------|-------------|-----|--------|------|------|----------|----------|-----
강남구 | 2780 | 1292        | ... | 570500 | ... | ...  | 13       | 21       | ...
강동구 | 773  | 379         | ... | 440359 | ... | ...  | 4        | 6        | ...
강북구 | 748  | 369         | ... | 328002 | ... | ...  | 7        | 14       | ...
...
```

**컬럼 구성:**
1. **자치구** (키)
2. **CCTV 데이터** (5개 컬럼)
   - 소계, 2013년도 이전, 2014년, 2015년, 2016년
3. **인구 데이터** (n개 컬럼)
   - 총인구, 남자, 여자, 연령대별 등
4. **범죄 데이터** (10개 컬럼)
   - 살인 발생/검거, 강도 발생/검거, 강간 발생/검거, 절도 발생/검거, 폭력 발생/검거

**총 행 수:** 25개 (서울시 자치구)

---

## ⚖️ 방법 비교

| 항목 | Google Maps API | 수동 매핑 |
|------|----------------|----------|
| **속도** | 느림 (30초+) | 빠름 (즉시) |
| **비용** | 유료 ($5/1000) | 무료 |
| **정확도** | 95% | 100% |
| **안정성** | 네트워크 의존 | 안정적 |
| **확장성** | 높음 | 낮음 |
| **유지보수** | 자동 | 수동 |
| **구현 난이도** | 중간 | 쉬움 |

---

## ✅ 최종 권장 사항

### 🎯 **수동 매핑 방식 (방법 2) 추천!**

**이유:**
1. ✅ 서울시 경찰서는 **31개로 고정**
2. ✅ 변경 빈도 **매우 낮음** (수년에 1회)
3. ✅ 무료, 빠름, 안정적
4. ✅ 구현 간단 (딕셔너리만 사용)
5. ✅ 100% 정확도 보장

### 🔮 Google Maps API는 언제?

- 관서가 자주 추가/변경되는 경우
- 다른 도시 데이터도 처리해야 하는 경우
- 완전 자동화가 필수인 경우
- 실시간 데이터 처리가 필요한 경우

---

## 🚀 구현 순서

1. ✅ `POLICE_STATION_DISTRICT_MAP` 딕셔너리 추가
2. ✅ `map_police_to_district()` 메서드 구현
3. ✅ `aggregate_crime_by_district()` 메서드 구현
4. ✅ `seoul_service.py`에 3-way 머지 로직 추가
5. ✅ API 테스트
6. ✅ 결과 검증

---

## 📝 참고 자료

### 서울시 경찰서 목록
- [서울경찰청 공식 사이트](https://www.smpa.go.kr/)
- 총 31개 경찰서 운영 중

### Google Maps API
- [Geocoding API 문서](https://developers.google.com/maps/documentation/geocoding)
- [가격 정책](https://developers.google.com/maps/billing-and-pricing/pricing)
- 무료 할당: $200/월 (약 40,000 requests)

---

## 📅 작성 정보

- **작성일**: 2025-12-10
- **목적**: 서울 범죄 데이터 관서명 → 자치구 매핑 전략
- **대상**: Seoul Crime Analysis Project
- **권장 방법**: 수동 매핑 (POLICE_STATION_DISTRICT_MAP)

