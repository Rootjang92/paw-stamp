# OAuth 소셜 로그인 설정 가이드

이 문서는 paw-stamp 프로젝트에서 Google과 Kakao 소셜 로그인을 설정하는 방법을 안내합니다.

## 목차
1. [Supabase 프로젝트 설정](#1-supabase-프로젝트-설정)
2. [Google OAuth 설정](#2-google-oauth-설정)
3. [Kakao OAuth 설정](#3-kakao-oauth-설정)
4. [테스트 방법](#4-테스트-방법)
5. [문제 해결](#5-문제-해결)

---

## 1. Supabase 프로젝트 설정

### 현재 Supabase 프로젝트 정보
- **프로젝트 URL**: `https://whbopfxhqhicwauxctke.supabase.co`
- **프로젝트 레퍼런스**: `whbopfxhqhicwauxctke`

### Supabase Dashboard 접속
1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 해당 프로젝트 선택 (`whbopfxhqhicwauxctke`)
3. 좌측 메뉴에서 **Authentication** → **Providers** 선택

---

## 2. Google OAuth 설정

### 2.1 Google Cloud Console에서 OAuth 클라이언트 생성

#### Step 1: Google Cloud Console 접속
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 기존 프로젝트 선택

#### Step 2: OAuth 동의 화면 구성
1. 좌측 메뉴에서 **APIs & Services** → **OAuth consent screen** 선택
2. User Type: **External** 선택 후 **CREATE**
3. 앱 정보 입력:
   - **App name**: `한국 여행 지도` (또는 원하는 앱 이름)
   - **User support email**: 본인의 이메일
   - **Developer contact information**: 본인의 이메일
4. **SAVE AND CONTINUE**

#### Step 3: Scopes 설정
1. **ADD OR REMOVE SCOPES** 클릭
2. 다음 스코프 선택:
   - `userinfo.email`
   - `userinfo.profile`
3. **UPDATE** → **SAVE AND CONTINUE**

#### Step 4: 테스트 사용자 추가 (선택사항)
- 개발 중에는 테스트 사용자로 본인의 Google 계정 추가
- **SAVE AND CONTINUE**

#### Step 5: OAuth 클라이언트 ID 생성
1. 좌측 메뉴에서 **Credentials** 선택
2. **+ CREATE CREDENTIALS** → **OAuth client ID** 선택
3. Application type: **Web application** 선택
4. Name: `paw-stamp-web-client` (또는 원하는 이름)
5. **Authorized redirect URIs** 추가:
   ```
   https://whbopfxhqhicwauxctke.supabase.co/auth/v1/callback
   ```
6. **CREATE** 클릭
7. 생성된 **Client ID**와 **Client Secret** 복사 (중요!)

### 2.2 Supabase에 Google OAuth 설정

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Google** 찾아서 클릭
3. 다음 정보 입력:
   - **Enable Sign in with Google**: ON (토글 활성화)
   - **Client ID**: Google Cloud Console에서 복사한 Client ID
   - **Client Secret**: Google Cloud Console에서 복사한 Client Secret
4. **Save** 클릭

---

## 3. Kakao OAuth 설정

### 3.1 Kakao Developers에서 애플리케이션 생성

#### Step 1: Kakao Developers 접속
1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인
3. 우측 상단 **내 애플리케이션** 클릭

#### Step 2: 애플리케이션 추가
1. **애플리케이션 추가하기** 클릭
2. 앱 정보 입력:
   - **앱 이름**: `한국 여행 지도`
   - **사업자명**: 본인 이름 또는 회사명
3. **저장** 클릭

#### Step 3: 앱 키 확인
1. 생성된 애플리케이션 선택
2. **앱 설정** → **요약 정보**에서 다음 키 확인:
   - **REST API 키**: 나중에 사용
   - **Client Secret**: 아래에서 생성 예정

#### Step 4: 플랫폼 설정
1. **앱 설정** → **플랫폼** 선택
2. **Web 플랫폼 등록** 클릭
3. 사이트 도메인 입력:
   ```
   http://localhost:3000
   ```
   (프로덕션 배포 시 실제 도메인 추가 필요)
4. **저장** 클릭

#### Step 5: Redirect URI 설정
1. **제품 설정** → **카카오 로그인** 선택
2. **활성화 설정**의 상태를 **ON**으로 변경
3. **Redirect URI** 등록:
   ```
   https://whbopfxhqhicwauxctke.supabase.co/auth/v1/callback
   ```
4. **저장** 클릭

#### Step 6: 동의 항목 설정
1. **제품 설정** → **카카오 로그인** → **동의 항목** 선택
2. 다음 항목 설정:
   - **닉네임**: 필수 동의
   - **프로필 사진**: 선택 동의
   - **카카오계정(이메일)**: 필수 동의
3. **저장** 클릭

#### Step 7: Client Secret 생성 (권장)
1. **제품 설정** → **카카오 로그인** → **보안** 선택
2. **Client Secret** 섹션에서 **코드 생성** 클릭
3. 생성된 **Client Secret** 복사
4. **활성화** 상태를 **사용함**으로 변경
5. **저장** 클릭

### 3.2 Supabase에 Kakao OAuth 설정

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Kakao** 찾아서 클릭
3. 다음 정보 입력:
   - **Enable Sign in with Kakao**: ON (토글 활성화)
   - **Client ID**: Kakao Developers의 **REST API 키**
   - **Client Secret**: 위에서 생성한 Client Secret
4. **Save** 클릭

---

## 4. 테스트 방법

### 로컬 환경에서 테스트

1. **개발 서버 실행**:
   ```bash
   pnpm dev
   ```

2. **브라우저에서 접속**:
   ```
   http://localhost:3000
   ```

3. **로그인 테스트**:
   - Google 로그인 버튼 클릭 → Google 계정으로 로그인
   - 카카오 로그인 버튼 클릭 → 카카오 계정으로 로그인

4. **성공 시 동작**:
   - 로그인 성공 → `/map` 페이지로 리다이렉트
   - Supabase Dashboard → **Authentication** → **Users**에서 사용자 확인 가능

### 프로덕션 환경 설정 (배포 시)

배포 후에는 다음 설정을 업데이트해야 합니다:

1. **환경 변수 업데이트** (`.env.production` 또는 Vercel/배포 플랫폼):
   ```env
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

2. **Google Cloud Console**:
   - Authorized redirect URIs에 추가:
     ```
     https://your-domain.com/auth/callback
     ```

3. **Kakao Developers**:
   - 플랫폼에 프로덕션 도메인 추가:
     ```
     https://your-domain.com
     ```
   - Redirect URI에 추가:
     ```
     https://your-domain.com/auth/callback
     ```

4. **Supabase Dashboard**:
   - **Authentication** → **URL Configuration**에서
   - **Site URL** 업데이트:
     ```
     https://your-domain.com
     ```
   - **Redirect URLs** 추가:
     ```
     https://your-domain.com/**
     ```

---

## 5. 문제 해결

### Google 로그인이 안 될 때

1. **"redirect_uri_mismatch" 에러**:
   - Google Cloud Console의 Redirect URI가 정확한지 확인
   - 정확한 URI: `https://whbopfxhqhicwauxctke.supabase.co/auth/v1/callback`

2. **"Access blocked" 에러**:
   - OAuth consent screen이 "In production"이 아닌 "Testing" 상태인지 확인
   - 테스트 사용자로 본인 계정이 추가되어 있는지 확인

3. **Supabase 설정 확인**:
   ```bash
   # Supabase 로그 확인
   # Dashboard → Logs → Auth Logs에서 에러 확인
   ```

### Kakao 로그인이 안 될 때

1. **"invalid_request" 에러**:
   - Kakao Developers의 Redirect URI가 정확한지 확인
   - 카카오 로그인 활성화 상태 확인

2. **"KOE101" (잘못된 앱 키) 에러**:
   - Supabase의 Client ID에 REST API 키가 정확히 입력되었는지 확인

3. **동의 항목 에러**:
   - 카카오 로그인 → 동의 항목에서 필수 항목이 올바르게 설정되었는지 확인

### 일반적인 문제

1. **로그인 후 리다이렉트가 안 될 때**:
   - `/app/auth/callback/route.ts` 파일 확인
   - 브라우저 콘솔에서 에러 메시지 확인

2. **세션이 유지되지 않을 때**:
   - 브라우저 쿠키 설정 확인 (3rd party cookies 허용)
   - Supabase 클라이언트 설정 확인

3. **CORS 에러**:
   - Supabase Dashboard → **Settings** → **API**
   - **CORS allowed origins**에 도메인 추가

---

## 참고 자료

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Kakao Login Documentation](https://developers.kakao.com/docs/latest/ko/kakaologin/common)

---

## 다음 단계

OAuth 설정이 완료되면:
1. 사용자 프로필 자동 생성 로직 구현
2. 사용자 메타데이터 추가 (username, display_name 등)
3. 소셜 로그인 시 추가 정보 입력 페이지 구현 (선택사항)
