# Supabase 데이터베이스 설정 가이드

이 문서는 paw-stamp 프로젝트의 Supabase 데이터베이스 스키마와 설정을 안내합니다.

## 목차
1. [데이터베이스 스키마](#1-데이터베이스-스키마)
2. [테이블 생성 SQL](#2-테이블-생성-sql)
3. [Row Level Security (RLS) 설정](#3-row-level-security-rls-설정)
4. [Database Triggers 설정](#4-database-triggers-설정)
5. [Storage 버킷 설정](#5-storage-버킷-설정)

---

## 1. 데이터베이스 스키마

### 테이블 구조

#### `users` (공개 프로필 테이블)
```sql
users
├── id (uuid, PK, references auth.users)
├── email (text)
├── username (text, unique)
├── display_name (text)
├── avatar_url (text)
├── bio (text)
├── is_public (boolean, default: false)
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

#### `cities` (대한민국 행정구역)
```sql
cities
├── code (text, PK) -- 행정구역 코드
├── name (text) -- 시/군/구 이름
├── province (text) -- 광역시/도
└── created_at (timestamptz)
```

#### `visits` (방문 기록)
```sql
visits
├── id (uuid, PK)
├── user_id (uuid, FK -> users.id)
├── city_code (text, FK -> cities.code)
├── visit_date (date)
├── rating (integer, 1-5)
├── memo (text)
├── photos (text[]) -- Storage URL 배열
├── created_at (timestamptz)
└── updated_at (timestamptz)
```

---

## 2. 테이블 생성 SQL

Supabase Dashboard → **SQL Editor**에서 다음 SQL을 실행하세요.

### Step 1: Users 테이블 생성

```sql
-- Users 테이블 생성
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

### Step 2: Cities 테이블 생성

```sql
-- Cities 테이블 생성
CREATE TABLE IF NOT EXISTS public.cities (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  province TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_cities_province ON public.cities(province);

-- RLS 활성화 (읽기 전용)
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
```

### Step 3: Visits 테이블 생성

```sql
-- Visits 테이블 생성
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  city_code TEXT NOT NULL REFERENCES public.cities(code) ON DELETE RESTRICT,
  visit_date DATE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  memo TEXT,
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON public.visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_city_code ON public.visits(city_code);
CREATE INDEX IF NOT EXISTS idx_visits_visit_date ON public.visits(visit_date);

-- RLS 활성화
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
```

---

## 3. Row Level Security (RLS) 설정

### Users 테이블 RLS 정책

```sql
-- 모든 사용자가 공개 프로필 읽기 가능
CREATE POLICY "Public profiles are viewable by everyone"
ON public.users FOR SELECT
USING (is_public = true);

-- 자신의 프로필은 항상 읽기 가능
CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id);

-- 자신의 프로필만 삭제 가능
CREATE POLICY "Users can delete own profile"
ON public.users FOR DELETE
USING (auth.uid() = id);
```

### Cities 테이블 RLS 정책

```sql
-- 모든 사용자가 도시 목록 읽기 가능
CREATE POLICY "Cities are viewable by everyone"
ON public.cities FOR SELECT
TO authenticated
USING (true);

-- 익명 사용자도 도시 목록 읽기 가능
CREATE POLICY "Cities are viewable by anonymous users"
ON public.cities FOR SELECT
TO anon
USING (true);
```

### Visits 테이블 RLS 정책

```sql
-- 공개 프로필의 방문 기록은 모두가 읽기 가능
CREATE POLICY "Public visits are viewable by everyone"
ON public.visits FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = visits.user_id
    AND users.is_public = true
  )
);

-- 자신의 방문 기록은 항상 읽기 가능
CREATE POLICY "Users can view own visits"
ON public.visits FOR SELECT
USING (auth.uid() = user_id);

-- 로그인한 사용자만 방문 기록 생성 가능
CREATE POLICY "Users can insert own visits"
ON public.visits FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 자신의 방문 기록만 수정 가능
CREATE POLICY "Users can update own visits"
ON public.visits FOR UPDATE
USING (auth.uid() = user_id);

-- 자신의 방문 기록만 삭제 가능
CREATE POLICY "Users can delete own visits"
ON public.visits FOR DELETE
USING (auth.uid() = user_id);
```

---

## 4. Database Triggers 설정

### 4.1 신규 사용자 자동 프로필 생성

OAuth 로그인 시 자동으로 프로필을 생성하는 트리거입니다.

```sql
-- 신규 사용자 프로필 자동 생성 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, avatar_url, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 4.2 Updated_at 자동 업데이트

```sql
-- Updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users 테이블 트리거
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Visits 테이블 트리거
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

## 5. Storage 버킷 설정

### 5.1 Visit Photos 버킷 생성

Supabase Dashboard → **Storage** → **Create a new bucket**

```
버킷 이름: visit-photos
공개 여부: Public
파일 크기 제한: 5MB
허용된 MIME 타입: image/jpeg, image/png, image/webp
```

또는 SQL로 생성:

```sql
-- Storage 버킷 생성 (Dashboard에서 수동으로 생성 권장)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'visit-photos',
  'visit-photos',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);
```

### 5.2 Storage RLS 정책

```sql
-- 모든 사용자가 공개 사진 읽기 가능
CREATE POLICY "Public photos are accessible by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'visit-photos');

-- 로그인한 사용자만 업로드 가능
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'visit-photos'
  AND auth.role() = 'authenticated'
);

-- 자신이 업로드한 사진만 삭제 가능
CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'visit-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 6. 초기 데이터 삽입

### Cities 데이터 삽입 (229개 시/군/구)

```sql
-- 서울특별시 (25개 구)
INSERT INTO public.cities (code, name, province) VALUES
('11010', '종로구', '서울특별시'),
('11020', '중구', '서울특별시'),
('11030', '용산구', '서울특별시'),
('11040', '성동구', '서울특별시'),
('11050', '광진구', '서울특별시'),
('11060', '동대문구', '서울특별시'),
('11070', '중랑구', '서울특별시'),
('11080', '성북구', '서울특별시'),
('11090', '강북구', '서울특별시'),
('11100', '도봉구', '서울특별시'),
('11110', '노원구', '서울특별시'),
('11120', '은평구', '서울특별시'),
('11130', '서대문구', '서울특별시'),
('11140', '마포구', '서울특별시'),
('11150', '양천구', '서울특별시'),
('11160', '강서구', '서울특별시'),
('11170', '구로구', '서울특별시'),
('11180', '금천구', '서울특별시'),
('11190', '영등포구', '서울특별시'),
('11200', '동작구', '서울특별시'),
('11210', '관악구', '서울특별시'),
('11220', '서초구', '서울특별시'),
('11230', '강남구', '서울특별시'),
('11240', '송파구', '서울특별시'),
('11250', '강동구', '서울특별시');

-- 부산광역시 (16개 구/군)
INSERT INTO public.cities (code, name, province) VALUES
('21010', '중구', '부산광역시'),
('21020', '서구', '부산광역시'),
('21030', '동구', '부산광역시'),
('21040', '영도구', '부산광역시'),
('21050', '부산진구', '부산광역시'),
('21060', '동래구', '부산광역시'),
('21070', '남구', '부산광역시'),
('21080', '북구', '부산광역시'),
('21090', '해운대구', '부산광역시'),
('21100', '사하구', '부산광역시'),
('21110', '금정구', '부산광역시'),
('21120', '강서구', '부산광역시'),
('21130', '연제구', '부산광역시'),
('21140', '수영구', '부산광역시'),
('21150', '사상구', '부산광역시'),
('21160', '기장군', '부산광역시');

-- 나머지 도시들도 동일한 방식으로 추가...
-- 전체 229개 시/군/구 데이터는 별도 파일로 제공
```

> **참고**: 전체 229개 시/군/구 데이터는 `/docs/cities_data.sql` 파일을 참조하세요.

---

## 7. 설정 확인

모든 설정이 완료되면 다음 항목을 확인하세요:

### Supabase Dashboard 확인 사항

1. **Table Editor**:
   - ✅ `users` 테이블 존재
   - ✅ `cities` 테이블 존재 (229개 행)
   - ✅ `visits` 테이블 존재

2. **Authentication**:
   - ✅ Google Provider 활성화
   - ✅ Kakao Provider 활성화
   - ✅ Email confirmations 설정 (선택사항)

3. **Storage**:
   - ✅ `visit-photos` 버킷 생성
   - ✅ RLS 정책 적용

4. **Database** → **Triggers**:
   - ✅ `on_auth_user_created` 트리거 활성화
   - ✅ `set_updated_at` 트리거들 활성화

---

## 8. 테스트

### 테스트 순서

1. **신규 사용자 OAuth 로그인**:
   ```
   Google 또는 Kakao로 로그인
   → auth.users 테이블에 사용자 생성
   → public.users 테이블에 프로필 자동 생성 (트리거)
   ```

2. **프로필 확인**:
   ```sql
   SELECT * FROM public.users WHERE email = 'your-email@example.com';
   ```

3. **방문 기록 추가 테스트**:
   ```sql
   INSERT INTO public.visits (user_id, city_code, visit_date, rating, memo)
   VALUES (
     'your-user-id',
     '11010', -- 서울 종로구
     '2024-01-01',
     5,
     '좋았어요!'
   );
   ```

---

## 문제 해결

### 트리거가 작동하지 않을 때

```sql
-- 트리거 상태 확인
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- 함수 재생성
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
-- 위의 함수와 트리거를 다시 생성
```

### RLS 정책 문제

```sql
-- 현재 RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename IN ('users', 'visits', 'cities');

-- 모든 RLS 정책 삭제 후 재생성
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

---

## 다음 단계

1. ✅ OAuth 설정 완료 ([OAUTH_SETUP.md](./OAUTH_SETUP.md) 참조)
2. ✅ 데이터베이스 스키마 설정 완료
3. ⬜ 사용자 프로필 페이지 구현
4. ⬜ 방문 기록 CRUD 기능 구현
5. ⬜ 사진 업로드 기능 구현
