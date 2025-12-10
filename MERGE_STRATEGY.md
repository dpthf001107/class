# CCTV와 인구 데이터 머지 전략

## 📋 개요

서울시 자치구별 CCTV 데이터와 인구 데이터를 중복 없이 머지하는 전략 문서입니다.

---

## 1️⃣ 데이터 구조 분석

### CCTV 데이터 (cctv.csv)
- **키 컬럼**: `기관명` (예: "강남구", "강동구", ...)
- **데이터**: CCTV 설치 대수 (소계, 연도별)
- **행 수**: 25개 자치구
- **컬럼**:
  - 기관명
  - 소계
  - 2013년도 이전
  - 2014년
  - 2015년
  - 2016년

### 인구 데이터 (pop.xls)
- **키 컬럼**: `자치구` (예상)
- **데이터**: 인구 관련 통계 (총인구, 남/여, 연령대 등)
- **파일 형식**: Excel (.xls)

### 범죄 데이터 (crime.csv)
- **키 컬럼**: `관서명` (예: "중부서", "종로서", ...)
- **주의**: 관서명 ≠ 자치구명 (별도 매핑 필요)

---

## 2️⃣ 머지 전략

### Step 1: 데이터 로드 및 전처리

```python
import pandas as pd

# 1. CCTV 데이터 로드
df_cctv = pd.read_csv('data/cctv.csv', encoding='utf-8')
# 컬럼명: 기관명, 소계, 2013년도 이전, 2014년, 2015년, 2016년

# 2. 인구 데이터 로드 (Excel)
df_pop = pd.read_excel('data/pop.xls', encoding='utf-8')
# 예상 컬럼: 자치구, 총인구, 남자, 여자, 연령대별 등

# 3. 컬럼명 정리
df_cctv = df_cctv.rename(columns={'기관명': '자치구'})
# pop은 이미 '자치구' 컬럼을 가지고 있다고 가정
```

### Step 2: 키 컬럼 정규화

```python
# 공백, 특수문자 제거 및 통일
df_cctv['자치구'] = df_cctv['자치구'].str.strip()
df_pop['자치구'] = df_pop['자치구'].str.strip()

# 데이터 확인
print("CCTV 자치구:", sorted(df_cctv['자치구'].unique()))
print("POP 자치구:", sorted(df_pop['자치구'].unique()))

# 불일치 확인
cctv_districts = set(df_cctv['자치구'])
pop_districts = set(df_pop['자치구'])
print(f"CCTV에만 있는 자치구: {cctv_districts - pop_districts}")
print(f"POP에만 있는 자치구: {pop_districts - cctv_districts}")
```

### Step 3: 머지 수행

```python
# 방법 1: Inner Join (양쪽에 모두 존재하는 자치구만)
df_merged = pd.merge(
    df_cctv, 
    df_pop, 
    on='자치구',                    # 키 컬럼
    how='inner',                   # 양쪽 모두 존재하는 데이터만
    suffixes=('_cctv', '_pop')     # 중복 컬럼명 처리
)

# 방법 2: Left Join (CCTV 기준으로 모든 자치구 유지)
df_merged = pd.merge(
    df_cctv, 
    df_pop, 
    on='자치구', 
    how='left',                    # CCTV 데이터 기준
    suffixes=('_cctv', '_pop')
)

# 방법 3: Outer Join (모든 자치구 포함)
df_merged = pd.merge(
    df_cctv, 
    df_pop, 
    on='자치구', 
    how='outer',                   # 모든 데이터 포함
    suffixes=('_cctv', '_pop')
)
```

### Step 4: 중복 컬럼 처리

```python
# 중복 가능성 있는 컬럼 확인
common_cols = set(df_cctv.columns) & set(df_pop.columns)
print("중복 컬럼:", common_cols - {'자치구'})

# suffixes로 자동 처리되지만, 필요시 수동 제거
# 예: '소계_cctv', '소계_pop' 중 하나만 선택
if '소계_cctv' in df_merged.columns and '소계_pop' in df_merged.columns:
    df_merged = df_merged.drop(columns=['소계_pop'])
    df_merged = df_merged.rename(columns={'소계_cctv': '소계'})

# 또는 중복 컬럼이 없다면 suffixes 불필요
df_merged = pd.merge(df_cctv, df_pop, on='자치구', how='inner')
```

---

## 3️⃣ 검증 단계

### 데이터 무결성 확인

```python
# 1. 머지 결과 확인
print(f"CCTV 행 수: {len(df_cctv)}")
print(f"POP 행 수: {len(df_pop)}")
print(f"머지 후 행 수: {len(df_merged)}")
print(f"머지 후 컬럼 수: {len(df_merged.columns)}")

# 2. 누락된 자치구 확인
missing_in_pop = set(df_cctv['자치구']) - set(df_pop['자치구'])
missing_in_cctv = set(df_pop['자치구']) - set(df_cctv['자치구'])
print(f"POP에 없는 자치구: {missing_in_pop}")
print(f"CCTV에 없는 자치구: {missing_in_cctv}")

# 3. 결측치 확인
print("\n결측치 개수:")
print(df_merged.isnull().sum())

# 4. 데이터 타입 확인
print("\n데이터 타입:")
print(df_merged.dtypes)

# 5. 상위 데이터 확인
print("\n상위 5개 데이터:")
print(df_merged.head())
```

---

## 4️⃣ 최종 전략 요약

| 단계 | 작업 | 목적 | 코드 |
|------|------|------|------|
| 1 | 데이터 로드 | CSV/Excel 파일 읽기 | `pd.read_csv()`, `pd.read_excel()` |
| 2 | 컬럼명 통일 | `기관명` → `자치구` | `df.rename(columns={...})` |
| 3 | 키 정규화 | 공백/특수문자 제거 | `str.strip()` |
| 4 | 머지 수행 | 중복 없이 결합 | `pd.merge(on='자치구', how='inner')` |
| 5 | 중복 처리 | 컬럼명 충돌 방지 | `suffixes=('_cctv', '_pop')` |
| 6 | 검증 | 데이터 무결성 확인 | 행 수, 누락, 결측치 체크 |

---

## 5️⃣ 예상 결과

### 최종 DataFrame 구조

```
자치구 | 소계 | 2013년도 이전 | 2014년 | 2015년 | 2016년 | 총인구 | 남자 | 여자 | ...
-------|------|---------------|--------|--------|--------|--------|------|------|-----
강남구 | 2780 | 1292          | 430    | 584    | 932    | ...    | ...  | ...  | ...
강동구 | 773  | 379           | 99     | 155    | 377    | ...    | ...  | ...  | ...
...
```

- **행 수**: 25개 자치구 (서울시 전체)
- **컬럼 수**: CCTV 컬럼 (6개) + 인구 컬럼 (n개)
- **중복**: 없음 (키 컬럼 `자치구`만 공통)

---

## 6️⃣ 주의사항

### 1. 인코딩 문제
```python
# 한글 깨짐 방지
df_cctv = pd.read_csv('cctv.csv', encoding='utf-8')
df_pop = pd.read_excel('pop.xls', encoding='utf-8')
```

### 2. 자치구명 불일치
```python
# 예: "강남구" vs "강남구 " (공백)
df_cctv['자치구'] = df_cctv['자치구'].str.strip()
df_pop['자치구'] = df_pop['자치구'].str.strip()
```

### 3. 데이터 타입 변환
```python
# 숫자 컬럼이 문자열로 저장된 경우
df_merged['소계'] = pd.to_numeric(df_merged['소계'], errors='coerce')
```

### 4. 결측치 처리
```python
# 머지 후 결측치 확인 및 처리
df_merged = df_merged.fillna(0)  # 또는 df_merged.dropna()
```

---

## 7️⃣ 실전 예제 코드

```python
import pandas as pd
import os

class SeoulDataMerger:
    def __init__(self, data_path):
        self.data_path = data_path
        
    def load_data(self):
        """CCTV와 인구 데이터 로드"""
        cctv_path = os.path.join(self.data_path, 'cctv.csv')
        pop_path = os.path.join(self.data_path, 'pop.xls')
        
        df_cctv = pd.read_csv(cctv_path, encoding='utf-8')
        df_pop = pd.read_excel(pop_path, encoding='utf-8')
        
        return df_cctv, df_pop
    
    def preprocess(self, df_cctv, df_pop):
        """전처리: 컬럼명 통일 및 정규화"""
        # 컬럼명 통일
        df_cctv = df_cctv.rename(columns={'기관명': '자치구'})
        
        # 공백 제거
        df_cctv['자치구'] = df_cctv['자치구'].str.strip()
        df_pop['자치구'] = df_pop['자치구'].str.strip()
        
        return df_cctv, df_pop
    
    def merge(self, df_cctv, df_pop):
        """머지 수행"""
        df_merged = pd.merge(
            df_cctv, 
            df_pop, 
            on='자치구', 
            how='inner',
            suffixes=('_cctv', '_pop')
        )
        return df_merged
    
    def validate(self, df_cctv, df_pop, df_merged):
        """검증"""
        print(f"CCTV 행 수: {len(df_cctv)}")
        print(f"POP 행 수: {len(df_pop)}")
        print(f"머지 후 행 수: {len(df_merged)}")
        print(f"결측치: {df_merged.isnull().sum().sum()}")
        
    def run(self):
        """전체 파이프라인 실행"""
        # 1. 로드
        df_cctv, df_pop = self.load_data()
        
        # 2. 전처리
        df_cctv, df_pop = self.preprocess(df_cctv, df_pop)
        
        # 3. 머지
        df_merged = self.merge(df_cctv, df_pop)
        
        # 4. 검증
        self.validate(df_cctv, df_pop, df_merged)
        
        return df_merged

# 사용 예시
if __name__ == "__main__":
    merger = SeoulDataMerger(data_path='./data')
    df_result = merger.run()
    print(df_result.head())
```

---

## 8️⃣ 참고 자료

- [Pandas merge 공식 문서](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.merge.html)
- [Pandas 한글 인코딩 처리](https://pandas.pydata.org/docs/user_guide/io.html#io-encoding)
- [데이터 전처리 Best Practices](https://pandas.pydata.org/docs/user_guide/cookbook.html)

---

## 📝 작성 정보

- **작성일**: 2025-12-10
- **목적**: 서울시 CCTV-인구 데이터 머지 전략 수립
- **대상**: Seoul Crime Analysis Project

