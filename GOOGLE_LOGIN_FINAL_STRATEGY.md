# AIFIXR 구글 로그인 최종 구현 전략 및 문제 해결 가이드

> **프로젝트 특성**: 프론트엔드(Next.js)와 백엔드(Spring Boot)가 동일 레포지토리에 존재하는 모놀리스 레포 구조

**작성일**: 2025-12-04  
**프로젝트**: AIFIXR ESG Platform  
**아키텍처**: Monorepo (Frontend + Backend)  
**상태**: ✅ 구현 완료 및 검증됨

---

## 📋 목차

1. [프로젝트 구조 분석](#프로젝트-구조-분석)
2. [아키텍처 개요](#아키텍처-개요)
3. [구현 전략](#구현-전략)
4. [실제 구현 과정](#실제-구현-과정)
5. [발생한 오류 및 해결 방법](#발생한-오류-및-해결-방법)
6. [최종 설정](#최종-설정)
7. [로깅 및 모니터링](#로깅-및-모니터링)
8. [테스트 가이드](#테스트-가이드)
9. [보안 고려사항](#보안-고려사항)

---

## 🏗️ 프로젝트 구조 분석

### 현재 프로젝트 구조

```
feature-ys/
├── api.aifixr.site/              # Spring Cloud Gateway
│   ├── gateway/
│   │   ├── src/main/
│   │   │   ├── java/.../gateway/
│   │   │   └── resources/application.yaml
│   │   └── Dockerfile
│   ├── settings.gradle
│   └── build.gradle
│
├── core.aifixr.site/             # Spring Boot Microservices
│   ├── oauthservice/             # ⭐ 구글 로그인 서비스
│   │   ├── src/main/
│   │   │   ├── java/.../oauthservice/
│   │   │   │   ├── google/
│   │   │   │   │   ├── GoogleAuthService.java
│   │   │   │   │   ├── GoogleController.java
│   │   │   │   │   └── dto/
│   │   │   │   │       ├── GoogleTokenResponse.java
│   │   │   │   │       ├── GoogleUserInfo.java
│   │   │   │   │       └── LoginResponse.java
│   │   │   │   ├── jwt/
│   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   └── JwtProperties.java
│   │   │   │   ├── config/
│   │   │   │   │   └── RestTemplateConfig.java
│   │   │   │   └── OAuthServiceApplication.java
│   │   │   └── resources/application.yaml
│   │   ├── build.gradle
│   │   └── Dockerfile
│   ├── user/                     # 사용자 정보 관리
│   ├── common/                   # 공통 유틸리티
│   ├── environment/
│   ├── social/
│   ├── governance/
│   ├── settings.gradle
│   └── build.gradle
│
├── www.aifixr.site/              # 메인 프론트엔드 (포트 3000)
│   ├── app/
│   │   ├── oauth/google/callback/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── services/
│   │   └── authservice.ts        # ⭐ 구글 로그인 서비스
│   └── components/
│       └── LoginModal.tsx
│
├── sme.aifixr.site/              # SME용 프론트엔드 (포트 3002)
│   └── (www.aifixr.site와 동일 구조)
│
├── docker-compose.yaml           # 통합 Docker Compose
├── .env                          # 통합 환경 변수
└── application-production.yaml   # Neon/Upstash 설정
```

### 핵심 특징

1. **통합 레포지토리**: 모든 프론트엔드와 백엔드가 같은 레포에 존재
2. **Spring Cloud Gateway**: 모든 API 요청이 Gateway(8080)를 통해 라우팅
3. **마이크로서비스**: OAuth 전용 서비스(`oauthservice`) 분리 구조
4. **멀티 프론트엔드**: 여러 Next.js 앱 (www, sme, admin, enterprise)
5. **Docker 기반**: 모든 서비스가 Docker Compose로 통합 관리
6. **환경 변수 중앙화**: 프론트엔드 `.env.local` 제거, 백엔드 `.env`에서 통합 관리

---

## 🎯 아키텍처 개요

### OAuth 2.0 플로우

```
┌─────────────┐
│   Browser   │
│ (localhost) │
└──────┬──────┘
       │
       │ 1. GET /api/oauth/google/auth-url
       ▼
┌─────────────────┐
│  Spring Gateway │
│   (Port 8080)   │
└──────┬──────────┘
       │
       │ 2. Forward to /google/auth-url
       ▼
┌──────────────────┐
│  OAuth Service   │
│   (Port 8085)    │
└──────┬───────────┘
       │
       │ 3. Return Google Auth URL
       ▼
┌─────────────┐
│   Browser   │
│ (localhost) │
└──────┬──────┘
       │
       │ 4. Redirect to Google
       ▼
┌─────────────┐
│   Google    │
│  OAuth 2.0  │
└──────┬──────┘
       │
       │ 5. User Login & Consent
       │
       │ 6. Redirect with code
       │    http://localhost:8080/oauth/google/callback?code=...
       ▼
┌─────────────────┐
│  Spring Gateway │
│   (Port 8080)   │
└──────┬──────────┘
       │
       │ 7. Forward to /google/callback
       ▼
┌──────────────────┐
│  OAuth Service   │
│   (Port 8085)    │
└──────┬───────────┘
       │
       │ 8. Exchange code for token
       │ 9. Get user info
       │ 10. Generate JWT
       │
       │ 11. Return LoginResponse with redirectUrl
       ▼
┌─────────────┐
│   Browser   │
│ (localhost) │
└──────┬──────┘
       │
       │ 12. Redirect to frontend
       │     http://localhost:3002/oauth/google/callback
       ▼
┌──────────────────┐
│  Frontend        │
│  (Port 3002)     │
└──────────────────┘
```

### 주요 컴포넌트

1. **Spring Cloud Gateway** (Port 8080)
   - 모든 API 요청 라우팅
   - Rate Limiting
   - Circuit Breaker
   - CORS 처리

2. **OAuth Service** (Port 8085)
   - 구글 OAuth 2.0 처리
   - JWT 토큰 생성
   - 사용자 정보 관리

3. **Frontend** (Port 3000, 3002, etc.)
   - 사용자 인터페이스
   - OAuth 콜백 처리
   - 토큰 저장 및 관리

---

## 🚀 구현 전략

### 1. 백엔드 구현 전략

#### 1.1 OAuth Service 생성

**목표**: 구글 로그인 전용 마이크로서비스 생성

**구현 내용**:
- Spring Boot 3.x 기반 서비스
- 구글 OAuth 2.0 클라이언트 구현
- JWT 토큰 생성 및 관리
- RESTful API 엔드포인트 제공

#### 1.2 주요 클래스 구조

```
oauthservice/
├── OAuthServiceApplication.java      # 메인 애플리케이션
├── google/
│   ├── GoogleController.java         # REST 컨트롤러
│   ├── GoogleAuthService.java        # 구글 OAuth 로직
│   └── dto/
│       ├── GoogleTokenResponse.java  # 구글 토큰 응답 DTO
│       ├── GoogleUserInfo.java       # 구글 사용자 정보 DTO
│       └── LoginResponse.java        # 로그인 응답 DTO
├── jwt/
│   ├── JwtTokenProvider.java         # JWT 생성/검증
│   └── JwtProperties.java            # JWT 설정
└── config/
    └── RestTemplateConfig.java       # RestTemplate 설정
```

#### 1.3 API 엔드포인트

| Method | Path | 설명 | 접근 경로 |
|--------|------|------|-----------|
| GET | `/google/auth-url` | 구글 인증 URL 생성 | `/api/oauth/google/auth-url` |
| POST | `/google/login` | 구글 로그인 처리 | `/api/oauth/google/login` |
| GET | `/google/callback` | 구글 콜백 처리 | `/oauth/google/callback` |

### 2. 프론트엔드 구현 전략

#### 2.1 환경 변수 관리

**중요**: 프론트엔드에는 `.env.local` 파일을 사용하지 않음
- 모든 환경 변수는 백엔드 `.env`에서 관리
- API Base URL은 하드코딩 (`http://localhost:8080`)
- 리디렉션 URL은 백엔드에서 제공

#### 2.2 주요 컴포넌트

```
www.aifixr.site/
├── services/
│   └── authservice.ts          # 인증 서비스
├── components/
│   └── LoginModal.tsx          # 로그인 모달
└── app/
    ├── oauth/google/callback/
    │   └── page.tsx            # OAuth 콜백 페이지
    └── dashboard/
        └── page.tsx            # 대시보드
```

### 3. Gateway 통합 전략

#### 3.1 라우팅 설정

**두 가지 경로 지원**:
1. `/api/oauth/**` - 프론트엔드에서 직접 호출
2. `/oauth/**` - 구글 콜백용 (브라우저 리디렉션)

#### 3.2 보안 설정

- Rate Limiting: 10 req/s, burst 20
- Circuit Breaker: 타임아웃 30초
- CORS: 모든 origin 허용 (개발 환경)

---

## 🔧 실제 구현 과정

### Step 1: OAuth Service 생성

#### 1.1 프로젝트 구조 생성

```bash
core.aifixr.site/
└── oauthservice/
    ├── src/main/java/site/aifixr/api/oauthservice/
    │   ├── OAuthServiceApplication.java
    │   ├── google/
    │   ├── jwt/
    │   └── config/
    └── src/main/resources/
        └── application.yaml
```

#### 1.2 build.gradle 설정

```gradle
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0'
    
    // JWT
    implementation 'io.jsonwebtoken:jjwt-api:0.12.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.5'
    
    developmentOnly 'org.springframework.boot:spring-boot-devtools'
}
```

#### 1.3 application.yaml 설정

```yaml
server:
  port: 8085

spring:
  application:
    name: oauth-service

# 구글 OAuth 설정
google:
  client-id: ${GOOGLE_CLIENT_ID}
  client-secret: ${GOOGLE_CLIENT_SECRET}
  redirect-uri: ${GOOGLE_REDIRECT_URI:http://localhost:8080/oauth/google/callback}
  frontend-redirect-uri: ${GOOGLE_FRONTEND_REDIRECT_URI:http://localhost:3002/oauth/google/callback}

# JWT 설정
jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:86400000}  # 24시간
  refresh-expiration: ${JWT_REFRESH_EXPIRATION:2592000000}  # 30일
```

### Step 2: Gateway 라우팅 설정

#### 2.1 OAuth Service 라우트 추가

```yaml
spring:
  cloud:
    gateway:
      routes:
        # OAuth Service - 프론트엔드 호출용
        - id: oauth-service
          uri: http://oauth-service:8085
          predicates:
            - Path=/api/oauth/**
          filters:
            - StripPrefix=2  # /api/oauth 제거
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
                redis-rate-limiter.requestedTokens: 1
                key-resolver: "#{@ipKeyResolver}"
            - name: CircuitBreaker
              args:
                name: oauthCircuitBreaker
        
        # OAuth Service - 구글 콜백용
        - id: oauth-service-callback
          uri: http://oauth-service:8085
          predicates:
            - Path=/oauth/**
          filters:
            - StripPrefix=1  # /oauth 제거
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
                redis-rate-limiter.requestedTokens: 1
                key-resolver: "#{@ipKeyResolver}"
            - name: CircuitBreaker
              args:
                name: oauthCircuitBreaker
```

### Step 3: Docker Compose 통합

#### 3.1 oauth-service 컨테이너 추가

```yaml
services:
  oauth-service:
    build:
      context: .
      dockerfile: ./core.aifixr.site/oauthservice/Dockerfile
    container_name: oauth-service
    ports:
      - "8085:8085"
    depends_on:
      - redis
    env_file:
      - .env
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD:-Redis0930!}
    networks:
      aifixr-network:
        aliases:
          - oauth-service.local
    restart: unless-stopped
```

### Step 4: 프론트엔드 구현

#### 4.1 AuthService 생성

```typescript
// www.aifixr.site/services/authservice.ts
export const AuthService = (() => {
  const API_BASE_URL = 'http://localhost:8080'; // 하드코딩

  const handleGoogleLogin = async () => {
    try {
      // 1. 구글 인증 URL 요청
      const response = await fetch(`${API_BASE_URL}/api/oauth/google/auth-url`);
      const data = await response.json();
      
      // 2. 구글 로그인 페이지로 리디렉션
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('구글 로그인 실패:', error);
    }
  };

  return {
    handleGoogleLogin,
  };
})();
```

#### 4.2 콜백 페이지 구현

```typescript
// www.aifixr.site/app/oauth/google/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      setStatus('error');
      setMessage('인가 코드가 없습니다.');
      return;
    }

    // 백엔드에 로그인 요청
    fetch('http://localhost:8080/api/oauth/google/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, state }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.token) {
          // 토큰 저장
          localStorage.setItem('token', data.token);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          setStatus('success');
          setMessage('로그인 성공!');
          
          // 백엔드에서 제공한 리디렉션 URL 사용
          const redirectUrl = data.redirectUrl || 'http://localhost:3002/dashboard';
          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 1500);
        } else {
          setStatus('error');
          setMessage(data.message || '로그인 실패');
        }
      })
      .catch(error => {
        setStatus('error');
        setMessage('로그인 처리 중 오류가 발생했습니다.');
        console.error(error);
      });
  }, [searchParams]);

  return (
    <div>
      {status === 'loading' && <p>로그인 처리 중...</p>}
      {status === 'success' && <p>{message}</p>}
      {status === 'error' && <p>{message}</p>}
    </div>
  );
}
```

---

## ❌ 발생한 오류 및 해결 방법

### 오류 1: 404 Not Found - Redirect URI 불일치

#### 문제 상황

```
브라우저에서 구글 로그인 후 콜백 시 404 오류 발생
```

#### 원인 분석

1. **구글 Cloud Console 설정**: `http://localhost:8080/api/oauth/google/callback`
2. **실제 Gateway 라우팅**: `/oauth/**` 경로만 처리
3. **불일치**: 구글이 `/api/oauth/google/callback`로 리디렉션했지만 Gateway가 처리하지 못함

#### 해결 방법

**Option 1: 구글 Cloud Console 수정 (선택)**
- Redirect URI를 `http://localhost:8080/oauth/google/callback`로 변경

**Option 2: Gateway 라우팅 추가 (최종 선택)**
- `/oauth/**` 경로에 대한 라우팅 추가
- `StripPrefix=1`로 설정하여 `/oauth`만 제거

**최종 설정**:

```yaml
# Gateway application.yaml
spring:
  cloud:
    gateway:
      routes:
        # 구글 콜백용 라우트 추가
        - id: oauth-service-callback
          uri: http://oauth-service:8085
          predicates:
            - Path=/oauth/**
          filters:
            - StripPrefix=1  # /oauth 제거
```

**구글 Cloud Console 설정**:
```
승인된 리디렉션 URI: http://localhost:8080/oauth/google/callback
```

### 오류 2: 504 Gateway Timeout

#### 문제 상황

```
구글 로그인 콜백 처리 중 Gateway Timeout 발생
로그: "Did not observe any item or terminal signal within 1000ms in 'circuitBreaker'"
```

#### 원인 분석

1. **Circuit Breaker 타임아웃**: 기본값 1초로 설정됨
2. **구글 API 호출 시간**: 액세스 토큰 요청 및 사용자 정보 조회에 시간 소요
3. **Gateway HTTP 클라이언트 타임아웃**: 기본값이 너무 짧음

#### 해결 방법

**Step 1: Circuit Breaker 타임아웃 설정**

```yaml
# Gateway application.yaml
resilience4j:
  circuitbreaker:
    instances:
      oauthCircuitBreaker:
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 30s  # 10s → 30s로 증가
        permitted-number-of-calls-in-half-open-state: 3
        automatic-transition-from-open-to-half-open-enabled: true
  timelimiter:  # ⭐ 추가: 실제 타임아웃 제어
    instances:
      oauthCircuitBreaker:
        timeout-duration: 30s  # 30초 타임아웃
```

**Step 2: Gateway HTTP 클라이언트 타임아웃 설정**

```yaml
# Gateway application.yaml
spring:
  cloud:
    gateway:
      httpclient:
        connect-timeout: 5000  # 5초 연결 타임아웃
        response-timeout: 30s  # 30초 응답 타임아웃
```

**Step 3: RestTemplate 타임아웃 설정**

```java
// OAuth Service - RestTemplateConfig.java
@Configuration
public class RestTemplateConfig {
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .setConnectTimeout(Duration.ofSeconds(5))  // 5초 연결 타임아웃
                .setReadTimeout(Duration.ofSeconds(20))      // 20초 읽기 타임아웃
                .build();
    }
}
```

### 오류 3: JWT 라이브러리 버전 호환성 문제

#### 문제 상황

```
JwtTokenProvider에서 deprecated 메서드 사용 오류
- parserBuilder() undefined
- setClaims() deprecated
```

#### 원인 분석

- `jjwt` 라이브러리 버전 0.11.5 → 0.12.5로 업그레이드 시 API 변경

#### 해결 방법

**build.gradle 수정**:

```gradle
dependencies {
    // JWT - 최신 버전 사용
    implementation 'io.jsonwebtoken:jjwt-api:0.12.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.5'
}
```

**JwtTokenProvider 수정**:

```java
// 이전 (0.11.5)
Jwts.builder()
    .setClaims(claims)
    .setSubject(subject)
    .signWith(secretKey)
    .compact();

// 수정 후 (0.12.5)
Jwts.builder()
    .subject(subject)
    .claims(claims)
    .issuedAt(now)
    .expiration(expiryDate)
    .signWith(secretKey)
    .compact();
```

### 오류 4: StripPrefix 설정 오류

#### 문제 상황

```
/api/oauth/** 경로에서 StripPrefix=2로 설정했지만 실제로는 1이어야 함
```

#### 원인 분석

- `/api/oauth/google/auth-url` → `StripPrefix=2` → `/google/auth-url` ✅
- `/api/oauth/google/login` → `StripPrefix=2` → `/google/login` ✅
- 하지만 `/oauth/google/callback` → `StripPrefix=1` → `/google/callback` ✅

#### 해결 방법

**두 가지 라우트 분리**:

```yaml
# 프론트엔드 호출용: /api/oauth/**
- id: oauth-service
  predicates:
    - Path=/api/oauth/**
  filters:
    - StripPrefix=2  # /api/oauth 제거

# 구글 콜백용: /oauth/**
- id: oauth-service-callback
  predicates:
    - Path=/oauth/**
  filters:
    - StripPrefix=1  # /oauth 제거
```

---

## ✅ 최종 설정

### 1. Gateway 설정 (application.yaml)

```yaml
spring:
  cloud:
    gateway:
      httpclient:
        connect-timeout: 5000
        response-timeout: 30s
      routes:
        # OAuth Service - 프론트엔드 호출용
        - id: oauth-service
          uri: http://oauth-service:8085
          predicates:
            - Path=/api/oauth/**
          filters:
            - StripPrefix=2
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
                redis-rate-limiter.requestedTokens: 1
                key-resolver: "#{@ipKeyResolver}"
            - name: CircuitBreaker
              args:
                name: oauthCircuitBreaker
        
        # OAuth Service - 구글 콜백용
        - id: oauth-service-callback
          uri: http://oauth-service:8085
          predicates:
            - Path=/oauth/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
                redis-rate-limiter.requestedTokens: 1
                key-resolver: "#{@ipKeyResolver}"
            - name: CircuitBreaker
              args:
                name: oauthCircuitBreaker

resilience4j:
  circuitbreaker:
    instances:
      oauthCircuitBreaker:
        sliding-window-size: 10
        failure-rate-threshold: 50
        wait-duration-in-open-state: 30s
        permitted-number-of-calls-in-half-open-state: 3
        automatic-transition-from-open-to-half-open-enabled: true
  timelimiter:
    instances:
      oauthCircuitBreaker:
        timeout-duration: 30s
```

### 2. OAuth Service 설정 (application.yaml)

```yaml
server:
  port: 8085

spring:
  application:
    name: oauth-service

google:
  client-id: ${GOOGLE_CLIENT_ID}
  client-secret: ${GOOGLE_CLIENT_SECRET}
  redirect-uri: ${GOOGLE_REDIRECT_URI:http://localhost:8080/oauth/google/callback}
  frontend-redirect-uri: ${GOOGLE_FRONTEND_REDIRECT_URI:http://localhost:3002/oauth/google/callback}

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:86400000}
  refresh-expiration: ${JWT_REFRESH_EXPIRATION:2592000000}
```

### 3. 환경 변수 설정 (.env)

```bash
# 구글 OAuth 설정
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8080/oauth/google/callback
GOOGLE_FRONTEND_REDIRECT_URI=http://localhost:3002/oauth/google/callback

# JWT 설정
JWT_SECRET=your-64-character-random-string
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=2592000000
```

### 4. 구글 Cloud Console 설정

```
승인된 리디렉션 URI:
- http://localhost:8080/oauth/google/callback

승인된 JavaScript 원본:
- http://localhost:3000
- http://localhost:3002
```

---

## 📊 로깅 및 모니터링

### 1. System.out.println 로깅 추가

구글 로그인 과정의 각 단계를 터미널에서 확인할 수 있도록 로깅 추가:

```java
// GoogleController.java
@GetMapping("/callback")
public ResponseEntity<LoginResponse> googleCallback(...) {
    System.out.println("\n========================================");
    System.out.println("🔄 [Google Callback] 콜백 요청 수신");
    System.out.println("========================================");
    // ...
}

@PostMapping("/login")
public ResponseEntity<LoginResponse> googleLogin(...) {
    System.out.println("\n========================================");
    System.out.println("🔐 [Google Login] 로그인 요청 시작");
    System.out.println("========================================");
    System.out.println("📝 [Step 1] 인가 코드 수신");
    System.out.println("📝 [Step 2] 구글 액세스 토큰 요청 중...");
    System.out.println("✅ [Step 2] 구글 액세스 토큰 획득 성공");
    // ...
}
```

### 2. 로그 확인 방법

```bash
# 실시간 로그 확인
docker-compose logs -f oauth-service

# 최근 로그만 확인
docker-compose logs --tail=100 oauth-service
```

### 3. 예상 로그 출력

```
========================================
🔄 [Google Callback] 콜백 요청 수신
========================================

========================================
🔐 [Google Login] 로그인 요청 시작
========================================
📝 [Step 1] 인가 코드 수신
   - Code: 4/0Ab32j93OL25ALMJEl...
   - State: 10daec39-49da-41f7-a941-adba79be3d72

📝 [Step 2] 구글 액세스 토큰 요청 중...
   → 구글 토큰 API 호출: https://oauth2.googleapis.com/token
   → 액세스 토큰 획득 성공 (길이: 150자)
   → 리프레시 토큰도 획득됨
✅ [Step 2] 구글 액세스 토큰 획득 성공

📝 [Step 3] 구글 사용자 정보 조회 중...
   → 구글 사용자 정보 API 호출: https://www.googleapis.com/oauth2/v2/userinfo
   → 사용자 정보 조회 성공
      - ID: 1234567890
      - Email: user@example.com
      - Name: 홍길동
✅ [Step 3] 사용자 정보 조회 성공
   - Google ID: 1234567890
   - Email: user@example.com
   - Name: 홍길동

📝 [Step 4] JWT 토큰 생성 중...
✅ [Step 4] JWT 토큰 생성 완료
   - JWT Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - Refresh Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

✅ [Success] 구글 로그인 성공!
   - 사용자: 홍길동 (user@example.com)
   - 리디렉션 URL: http://localhost:3002/oauth/google/callback
========================================
```

---

## 🧪 테스트 가이드

### 1. 사전 준비

1. **구글 Cloud Console 설정**
   - OAuth 2.0 클라이언트 ID 생성
   - 승인된 리디렉션 URI 설정: `http://localhost:8080/oauth/google/callback`

2. **환경 변수 설정**
   - `.env` 파일에 구글 OAuth 정보 입력
   - JWT_SECRET 생성 (64자 랜덤 문자열)

3. **서비스 실행**
   ```bash
   docker-compose up -d
   ```

### 2. 테스트 시나리오

#### 시나리오 1: 정상 로그인 플로우

1. 브라우저에서 `http://localhost:3000` 접속
2. 로그인 버튼 클릭
3. "구글 로그인하기" 버튼 클릭
4. 구글 로그인 페이지에서 로그인 및 동의
5. 콜백 페이지에서 로그인 성공 확인
6. `http://localhost:3002/dashboard`로 자동 리디렉션 확인

#### 시나리오 2: 로그 확인

```bash
# 터미널에서 로그 확인
docker-compose logs -f oauth-service
```

#### 시나리오 3: API 직접 테스트

```bash
# 1. 구글 인증 URL 요청
curl http://localhost:8080/api/oauth/google/auth-url

# 2. 응답 확인
# {
#   "authUrl": "https://accounts.google.com/o/oauth2/v2/auth?..."
# }
```

### 3. 문제 해결 체크리스트

- [ ] Gateway가 실행 중인가? (`docker-compose ps gateway`)
- [ ] OAuth Service가 실행 중인가? (`docker-compose ps oauth-service`)
- [ ] 환경 변수가 올바르게 설정되었는가? (`.env` 파일 확인)
- [ ] 구글 Cloud Console의 리디렉션 URI가 올바른가?
- [ ] 네트워크 연결이 정상인가? (`docker-compose logs gateway` 확인)
- [ ] Circuit Breaker가 열려있지 않은가? (로그 확인)

---

## 🔒 보안 고려사항

### 1. 환경 변수 관리

- ✅ `.env` 파일은 `.gitignore`에 포함
- ✅ 프로덕션 환경에서는 환경 변수 관리 시스템 사용 (AWS Secrets Manager, Azure Key Vault 등)
- ✅ JWT_SECRET은 충분히 긴 랜덤 문자열 사용 (최소 64자)

### 2. HTTPS 사용

- ⚠️ **개발 환경**: HTTP 사용 가능
- ✅ **프로덕션 환경**: 반드시 HTTPS 사용
- ✅ 구글 Cloud Console에서 프로덕션 도메인 등록

### 3. CORS 설정

- ⚠️ **개발 환경**: 모든 origin 허용 (`allowed-origin-patterns: "*"`)
- ✅ **프로덕션 환경**: 특정 도메인만 허용

```yaml
# 프로덕션 설정 예시
globalcors:
  cors-configurations:
    '[/**]':
      allowed-origin-patterns:
        - "https://www.aifixr.site"
        - "https://sme.aifixr.site"
```

### 4. Rate Limiting

- ✅ OAuth 엔드포인트에 Rate Limiting 적용 (10 req/s)
- ✅ Redis를 통한 분산 Rate Limiting

### 5. Circuit Breaker

- ✅ 외부 API 호출 실패 시 Circuit Breaker로 보호
- ✅ 타임아웃 설정으로 무한 대기 방지

### 6. JWT 토큰 보안

- ✅ 토큰은 `localStorage`에 저장 (프로덕션에서는 `httpOnly` 쿠키 고려)
- ✅ Refresh Token을 통한 토큰 갱신
- ✅ 토큰 만료 시간 설정 (24시간)

---

## 📝 요약

### 구현 완료 항목

1. ✅ OAuth Service 마이크로서비스 생성
2. ✅ 구글 OAuth 2.0 클라이언트 구현
3. ✅ JWT 토큰 생성 및 관리
4. ✅ Gateway 라우팅 설정
5. ✅ 프론트엔드 통합
6. ✅ Docker Compose 통합
7. ✅ 환경 변수 중앙화
8. ✅ 오류 처리 및 로깅
9. ✅ 타임아웃 설정 최적화
10. ✅ Circuit Breaker 설정

### 주요 해결 사항

1. ✅ 404 오류 해결 (Redirect URI 불일치)
2. ✅ 504 Gateway Timeout 해결 (타임아웃 설정)
3. ✅ JWT 라이브러리 호환성 문제 해결
4. ✅ StripPrefix 설정 최적화

### 최종 아키텍처

```
Browser → Gateway (8080) → OAuth Service (8085) → Google OAuth 2.0
                                                      ↓
Browser ← Frontend (3002) ← JWT Token ←──────────────┘
```

---

## 📚 참고 자료

- [Google OAuth 2.0 문서](https://developers.google.com/identity/protocols/oauth2)
- [Spring Cloud Gateway 문서](https://spring.io/projects/spring-cloud-gateway)
- [Resilience4j 문서](https://resilience4j.readme.io/)
- [JJWT 문서](https://github.com/jwtk/jjwt)

---

**작성자**: AI Assistant  
**최종 업데이트**: 2025-12-04  
**버전**: 1.0.0

