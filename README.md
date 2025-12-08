# 🐾 Paw Stamp

대한민국 229개 시/군/구 방문 기록을 추적하고 시각화하는 인터랙티브 여행 지도 서비스

## ✨ 주요 기능

- 🗺️ **인터랙티브 지도**: 방문한 도시를 지도에서 시각적으로 확인
- 📸 **사진 앨범**: 각 방문 기록에 최대 9장의 사진 업로드
- ⭐ **평점 & 메모**: 방문한 곳에 대한 평점과 메모 작성
- 📊 **통계 대시보드**: 방문 현황과 완주율을 차트로 시각화
- 👤 **프로필 공유**: 나만의 여행 기록을 다른 사람과 공유
- 🎨 **3D 시각화**: Three.js 기반 인터랙티브 3D 그래픽

## 🚀 시작하기

### 요구사항

- Node.js 20 이상
- pnpm (권장 패키지 매니저)

### 설치

```bash
# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일을 편집하여 Supabase 정보 입력
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

## 🛠️ 기술 스택

- **프레임워크**: [Next.js 16](https://nextjs.org) (App Router)
- **언어**: [TypeScript](https://www.typescriptlang.org/)
- **스타일링**: [Tailwind CSS v4](https://tailwindcss.com/)
- **데이터베이스**: [Supabase](https://supabase.com/)
- **상태 관리**: [Zustand](https://zustand-demo.pmnd.rs/)
- **데이터 페칭**: [TanStack Query](https://tanstack.com/query)
- **3D 그래픽**: [Three.js](https://threejs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **지도**: [react-simple-maps](https://www.react-simple-maps.io/)
- **차트**: [Recharts](https://recharts.org/)

## 📁 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 따릅니다.

```
paw-stamp/
├── app/              # Next.js App Router (라우팅)
├── pages/            # FSD 페이지 레이어 (조합)
├── widgets/          # 독립적인 UI 블록
├── features/         # 비즈니스 로직 기능
├── entities/         # 도메인 엔티티
└── shared/           # 공유 유틸리티 & 설정
    ├── api/          # Supabase 클라이언트
    ├── config/       # 앱 설정 & 상수
    ├── types/        # TypeScript 타입
    ├── lib/          # 유틸리티 함수
    └── ui/           # 기본 UI 컴포넌트
```

자세한 아키텍처 정보는 [CLAUDE.md](./CLAUDE.md)를 참고하세요.

## 🌐 환경 변수

`.env.local` 파일에 다음 환경 변수를 설정해야 합니다:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 라이선스

MIT

## 🤝 기여

이슈와 PR을 환영합니다!
