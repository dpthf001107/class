# AIFIX ESG Platform SME

Next.js 15 + React + TypeScript + Tailwind CSS 기반의 SPA(Single Page Application) 프로젝트입니다.

## 기술 스택

- **Framework**: Next.js 15
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## 시작하기

### 필수 요구사항

- Node.js 18.17 이상
- pnpm 9.0.0 이상

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3002](http://localhost:3002)을 열어 확인하세요.

### 빌드

```bash
pnpm build
```

### 프로덕션 실행

```bash
pnpm start
```

## 프로젝트 구조

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   └── globals.css        # 전역 스타일
├── src/
│   └── components/        # React 컴포넌트
│       ├── ui/           # UI 컴포넌트
│       └── ...
├── public/                # 정적 파일
├── next.config.js         # Next.js 설정
├── tailwind.config.ts     # Tailwind CSS 설정
└── tsconfig.json          # TypeScript 설정
```

## 주요 기능

- SPA (Single Page Application) 구조
- 정적 파일 export 지원
- 반응형 디자인
- 다크 모드 지원 (next-themes)
- 컴포넌트 기반 아키텍처
- TypeScript 타입 안정성

## SPA 모드

이 프로젝트는 Next.js의 Static Export 모드를 사용하여 SPA로 빌드됩니다.

```bash
# 정적 파일로 빌드
pnpm build

# 빌드된 파일은 out/ 디렉토리에 생성됩니다
```

## 라이선스

Private
