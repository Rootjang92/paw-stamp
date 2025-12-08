# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

"paw-stamp"는 대한민국의 229개 시/군/구 방문 기록을 추적하고 시각화하는 Next.js 16 애플리케이션입니다. 사용자는 방문한 도시에 사진, 평점, 메모를 기록하고 인터랙티브 지도와 통계 대시보드에서 여행 데이터를 확인할 수 있습니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router + 라우트 그룹)
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS v4
- **데이터베이스**: Supabase (PostgreSQL + SSR 지원)
- **상태 관리**: Zustand
- **데이터 페칭**: TanStack Query (React Query)
- **3D 그래픽**: Three.js + React Three Fiber
- **지도**: react-simple-maps
- **차트**: Recharts
- **UI**: Lucide React 아이콘, class-variance-authority, clsx, tailwind-merge

## 개발 명령어

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행 (http://localhost:3000)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 시작
pnpm start

# 린터 실행
pnpm lint
```

## 아키텍처

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따르며, 추상화 수준에 따라 레이어가 구성되어 있습니다.

### 레이어 구조

1. **`app/`** - Next.js App Router 페이지 및 레이아웃
   - `(auth)/` - 인증 페이지 (라우트 그룹)
   - `(main)/` - 메인 앱 페이지: `/map`, `/profile`, `/stats` (라우트 그룹)
   - `@[username]/` - 동적 공개 프로필 페이지 (병렬 라우트)
   - `api/` - API 라우트
   - 루트 파일: `page.tsx`, `layout.tsx`, `globals.css`

2. **`pages/`** - 페이지 레벨 조합 (Next.js pages가 아닌 FSD 레이어)
   - 위젯과 피처를 결합하여 전체 페이지 레이아웃 구성
   - `/home`, `/map`, `/profile`, `/stats`

3. **`widgets/`** - 독립적인 UI 블록
   - 각 위젯은 `ui/` 및 선택적으로 `model/` 하위 디렉토리를 가짐
   - 예시: `filter-bar`, `header`, `map-container`, `profile-card`, `stats-widget`

4. **`features/`** - 비즈니스 로직을 포함한 사용자 대면 기능
   - 도메인별로 구성: `auth`, `filter`, `photo`, `search`, `share`, `visit`
   - 각 기능은 특정 기능을 가진 자체 하위 디렉토리를 가짐
   - 예시: `add-visit`, `city-filter`, `upload-photo`, `share-profile`

5. **`entities/`** - 비즈니스 엔티티 (도메인 모델)
   - 각 엔티티는 `api/`, `model/`, `ui/` 하위 디렉토리를 가짐
   - 핵심 엔티티: `city`, `photo`, `profile`, `user`, `visit`
   - 엔티티 타입은 `shared/types/common.ts`에 정의됨

6. **`shared/`** - 비즈니스 로직이 없는 재사용 가능한 코드
   - `api/supabase/` - Supabase 클라이언트 초기화
     - `client.ts` - 클라이언트 컴포넌트용 브라우저 클라이언트
     - `server.ts` - 서버 컴포넌트용 서버 클라이언트 (쿠키 처리 포함)
   - `config/` - 앱 전체 설정
     - `constants.ts` - 비즈니스 상수 (TOTAL_CITIES=229, PROVINCES, MAX_PHOTOS_PER_VISIT=9 등)
     - `routes.ts` - 라우트 경로 상수
   - `types/` - TypeScript 타입 정의
     - `api.ts` - API 관련 타입
     - `common.ts` - 핵심 도메인 타입 (User, City, Visit, Photo, Profile)
   - `lib/` - 유틸리티 함수 (날짜 포맷팅, cn 헬퍼 등)
   - `ui/` - 기본 UI 컴포넌트
   - `hooks/` - 재사용 가능한 React 훅

### Import 규칙 (FSD)

레이어는 하위 레이어에서만 import 가능:
- `app` → `pages` → `widgets` → `features` → `entities` → `shared`
- 상위로 import 금지 (예: `shared`는 `features`에서 import 불가)
- 프로젝트 루트에서 절대 import를 위해 `@/*` 경로 별칭 사용

## Supabase 통합

### 클라이언트 사용법

**클라이언트 컴포넌트**:
```typescript
import { createClient } from '@/shared/api/supabase/client';
const supabase = createClient();
```

**서버 컴포넌트/액션**:
```typescript
import { createClient } from '@/shared/api/supabase/server';
const supabase = await createClient();
```

### 환경 변수

`.env.local`에 필수로 설정:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase 프로젝트 URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase 익명 키
- `SUPABASE_SERVICE_ROLE_KEY` - 서비스 롤 키 (서버 사이드 전용)
- `NEXT_PUBLIC_APP_URL` - 애플리케이션 URL

## 도메인 모델

### 핵심 엔티티

**User**: 인증 및 프로필 데이터
- 필드: id, email, username, display_name, avatar_url, bio, is_public

**City**: 대한민국 행정구역 (총 229개)
- 필드: code, name, province
- 광역시/도: 서울, 부산, 경기도, 제주 등

**Visit**: 사용자의 도시 방문 기록
- 필드: id, user_id, city_code, visit_date, rating (1-5), memo, photos[]
- 각 방문은 최대 9장의 사진 포함 가능 (MAX_PHOTOS_PER_VISIT)

**Photo**: Supabase Storage에 저장된 방문 사진
- 최대 크기: 5MB (MAX_PHOTO_SIZE_MB)
- 허용 형식: JPEG, PNG, WebP

**Profile**: 통계가 포함된 확장 사용자 데이터
- 포함: visit_count, completion_rate, average_rating

## 스타일링 규칙

- **디자인 시스템 색상**:
  - Primary: Cyan 계열 (primary.600: #0891B2)
  - Secondary: Emerald (#10B981 방문 지역용), Amber (#F59E0B 강조용)
- **폰트**: Pretendard + 시스템 폴백
- **Border Radius**: lg=12px, md=8px, sm=6px
- Tailwind 클래스 병합을 위해 `@/shared/lib/cn`의 `cn()` 유틸리티 사용
- Tailwind v4 설정은 모든 FSD 레이어 디렉토리에서 클래스를 찾음

## 라우트 구조

- `/` - 홈 페이지
- `/login` - 인증
- `/map` - 방문한 도시 인터랙티브 지도 뷰
- `/stats` - 통계 및 차트 대시보드
- `/profile` - 사용자 자신의 프로필
- `/@[username]` - 공개 프로필 페이지

네비게이션을 위해 `@/shared/config/routes`의 `ROUTES` 상수 사용.

## 주요 패턴

### 데이터 페칭
- 서버 상태 관리를 위해 TanStack Query 사용
- Supabase 쿼리는 React Query 훅으로 래핑
- FSD 준수: API 호출은 `entities/*/api/`에, 훅은 `features/*/model/`에 위치

### 상태 관리
- 클라이언트 사이드 전역 상태는 Zustand 사용
- Store 파일은 일반적으로 `model/` 하위 디렉토리에 위치 (예: `widgets/map-container/model/`)

### 컴포넌트 구성
- UI 컴포넌트는 각 FSD 레이어의 `ui/` 하위 디렉토리에 배치
- 비즈니스 로직(model)과 프레젠테이션(ui) 분리
- 동일한 FSD 슬라이스 내에서 관련 코드 공동 배치

### 이미지 최적화
- Next.js Image 컴포넌트는 Supabase Storage용으로 설정됨
- 리모트 패턴: `https://*.supabase.co/storage/v1/object/public/**`

## 참고 사항

- 프로젝트는 pnpm을 패키지 매니저로 사용
- React Strict Mode 활성화됨
- 코드베이스 전체에 한글 주석 존재
- 앱은 17개 광역시/도의 229개 시/군/구를 추적
