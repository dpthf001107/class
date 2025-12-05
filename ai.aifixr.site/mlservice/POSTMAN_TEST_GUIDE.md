# Postman 테스트 가이드

ML Service API를 Postman에서 테스트하는 방법입니다.

## 📋 기본 정보

### 서버 주소
- **로컬 서비스**: `http://localhost:9003`
- **Gateway를 통한 접근**: `http://localhost:8080`

### Base URL
- 직접 접근: `http://localhost:9003`
- Gateway 접근: `http://localhost:8080`

---

## 🔌 엔드포인트 목록

### 1. 서비스 루트 (Root)
**GET** `/`

**설명**: ML Service의 기본 상태를 확인합니다.

#### Postman 설정
- **Method**: `GET`
- **URL**: 
  - 직접: `http://localhost:9003/`
  - Gateway: `http://localhost:8080/`

#### Headers
```
Content-Type: application/json
```

#### 예상 응답
```json
{
    "message": "ML Service",
    "status": "running",
    "version": "1.0.0"
}
```

---

### 2. 타이타닉 서비스 상태 확인
**GET** `/api/ml/`

**설명**: 타이타닉 서비스의 현재 상태를 확인합니다.

#### Postman 설정
- **Method**: `GET`
- **URL**: 
  - 직접: `http://localhost:9003/api/ml/`
  - Gateway: `http://localhost:8080/api/ml/`

#### Headers
```
Content-Type: application/json
```

#### 예상 응답
```json
{
    "message": "Titanic Service",
    "status": "running"
}
```

---

### 3. 상위 10명 조회
**GET** `/api/ml/top-10`

**설명**: 타이타닉 승객 리스트에서 순서대로 상위 10명을 반환합니다.

#### Postman 설정
- **Method**: `GET`
- **URL**: 
  - 직접: `http://localhost:9003/api/ml/top-10`
  - Gateway: `http://localhost:8080/api/ml/top-10`

#### Headers
```
Content-Type: application/json
```

#### Query Parameters
없음

#### 예상 응답
```json
{
    "success": true,
    "data": [
        {
            "passengerId": "1",
            "name": "Braund, Mr. Owen Harris",
            "survived": "0",
            "pclass": "3",
            "sex": "male",
            "age": "22",
            "fare": 7.25,
            "embarked": "S",
            "rank": 1,
            "survivedText": "사망",
            "pclassText": "3등급"
        },
        {
            "passengerId": "2",
            "name": "Cumings, Mrs. John Bradley (Florence Briggs Thayer)",
            "survived": "1",
            "pclass": "1",
            "sex": "female",
            "age": "38",
            "fare": 71.2833,
            "embarked": "C",
            "rank": 2,
            "survivedText": "생존",
            "pclassText": "1등급"
        }
        // ... 총 10명
    ],
    "total": 891,
    "message": "총 891명 중 상위 10명을 반환했습니다."
}
```

---

## 📝 Postman 설정 단계별 가이드

### 1. 새 Request 생성
1. Postman을 실행합니다
2. **New** → **HTTP Request** 클릭
3. Request 이름을 입력합니다 (예: "ML Service - Root")

### 2. Method 및 URL 설정
1. Method 드롭다운에서 **GET** 선택
2. URL 입력란에 엔드포인트 URL 입력
   - 예: `http://localhost:9003/api/ml/top-10`

### 3. Headers 설정
1. **Headers** 탭 클릭
2. 다음 헤더 추가:
   - Key: `Content-Type`
   - Value: `application/json`

### 4. 요청 전송
1. **Send** 버튼 클릭
2. 하단에 응답 결과가 표시됩니다

---

## 🧪 Postman Collection 설정

### Collection 생성
1. Postman에서 **New** → **Collection** 클릭
2. Collection 이름: "ML Service API"
3. Description: "ML Service API 테스트 컬렉션"

### Environment 변수 설정 (선택사항)
1. **Environments** → **+** 클릭
2. Environment 이름: "ML Service Local"
3. 변수 추가:
   - `base_url`: `http://localhost:9003`
   - `gateway_url`: `http://localhost:8080`

### Request 추가
Collection에 다음 Request들을 추가하세요:

#### Request 1: Root
- Name: `Root - Service Status`
- Method: `GET`
- URL: `{{base_url}}/`

#### Request 2: Titanic Service Status
- Name: `Titanic Service Status`
- Method: `GET`
- URL: `{{base_url}}/api/ml/`

#### Request 3: Top 10 Passengers
- Name: `Get Top 10 Passengers`
- Method: `GET`
- URL: `{{base_url}}/api/ml/top-10`

---

## 🔍 응답 검증

### 성공 응답 (200 OK)
- Status Code: `200`
- Response Body: JSON 형식의 데이터

### 에러 응답
- **404 Not Found**: 엔드포인트가 존재하지 않음
- **500 Internal Server Error**: 서버 내부 오류

---

## 📊 Postman 테스트 스크립트 예시

### Tests 탭에 추가할 스크립트

```javascript
// 응답 시간 확인
pm.test("Response time is less than 2000ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// 상태 코드 확인
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Content-Type 확인
pm.test("Content-Type is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

// 응답 본문 확인 (top-10 엔드포인트용)
pm.test("Response has success field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
});

pm.test("Response has data array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('data');
    pm.expect(jsonData.data).to.be.an('array');
});

pm.test("Data array has 10 items", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data).to.have.lengthOf(10);
});
```

---

## 🚀 빠른 테스트

### cURL 명령어 (Postman에서 Import 가능)

```bash
# Root
curl -X GET "http://localhost:9003/" \
  -H "Content-Type: application/json"

# Titanic Service Status
curl -X GET "http://localhost:9003/api/ml/" \
  -H "Content-Type: application/json"

# Top 10 Passengers
curl -X GET "http://localhost:9003/api/ml/top-10" \
  -H "Content-Type: application/json"
```

### Postman Collection JSON (Import용)

Postman에서 **Import** → **Raw text**에 아래 JSON을 붙여넣으세요:

```json
{
  "info": {
    "name": "ML Service API",
    "description": "ML Service API 테스트 컬렉션",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Root - Service Status",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:9003/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "9003",
          "path": [""]
        }
      }
    },
    {
      "name": "Titanic Service Status",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:9003/api/ml/",
          "protocol": "http",
          "host": ["localhost"],
          "port": "9003",
          "path": ["api", "ml", ""]
        }
      }
    },
    {
      "name": "Get Top 10 Passengers",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "http://localhost:9003/api/ml/top-10",
          "protocol": "http",
          "host": ["localhost"],
          "port": "9003",
          "path": ["api", "ml", "top-10"]
        }
      }
    }
  ]
}
```

---

## ✅ 체크리스트

테스트 전 확인사항:
- [ ] 서비스가 실행 중인가? (`docker-compose ps ml-service`)
- [ ] 포트 9003이 열려있는가?
- [ ] Gateway를 사용하는 경우 포트 8080이 열려있는가?
- [ ] Postman에서 올바른 URL을 사용하고 있는가?

---

## 📞 문제 해결

### 연결 오류
- 서비스가 실행 중인지 확인: `docker-compose logs ml-service`
- 포트가 올바른지 확인
- 방화벽 설정 확인

### 404 에러
- URL 경로가 정확한지 확인 (`/api/ml/` 또는 `/api/ml/top-10`)
- 서비스가 정상적으로 시작되었는지 확인

### 500 에러
- 서비스 로그 확인: `docker-compose logs -f ml-service`
- CSV 파일이 존재하는지 확인

---

**마지막 업데이트**: 2025-01-XX

