# 시/군/구 경계 데이터 가져오기

이 가이드는 SGIS API를 사용하여 229개 시/군/구 경계 데이터를 가져오는 방법을 설명합니다.

## 1. SGIS API 키 발급

1. [통계지리정보서비스](https://sgis.kostat.go.kr) 접속
2. 회원가입 및 로그인
3. 마이페이지 > 인증키 발급
4. Consumer Key와 Consumer Secret 복사

## 2. 환경 변수 설정

`.env.local` 파일에 API 키 추가:

```bash
SGIS_CONSUMER_KEY=your_consumer_key
SGIS_CONSUMER_SECRET=your_consumer_secret
```

## 3. 데이터 가져오기

### 전체 프로세스 실행 (권장)

```bash
pnpm fetch-boundaries
```

이 명령은:
1. SGIS API에서 17개 시/도별 시/군/구 데이터를 가져옵니다
2. 좌표를 EPSG:5179에서 WGS84로 자동 변환합니다

### 개별 실행

**1단계: 데이터 페칭**
```bash
pnpm fetch-only
```
- 출력: `public/data/districts/*.json` (17개 파일, EPSG:5179 좌표)

**2단계: 좌표 변환**
```bash
pnpm convert-only
```
- 출력: `public/data/districts_wgs84/*.json` (17개 파일, WGS84 좌표)

## 4. 결과 파일 구조

```
public/data/
├── korea_city_wgs84.json          # 17개 광역시/도 (전국 지도용)
├── districts/                      # EPSG:5179 원본 (임시)
│   ├── 11.json                     # 서울특별시
│   ├── 21.json                     # 부산광역시
│   └── ...
└── districts_wgs84/                # WGS84 변환 (실제 사용)
    ├── 11.json                     # 서울특별시 (25개 구)
    ├── 21.json                     # 부산광역시 (16개 구/군)
    ├── 31.json                     # 경기도 (31개 시/군)
    └── ...
```

## 5. 사용 방법

### 프론트엔드에서 시/도 클릭 시 시/군/구 모달 표시

```typescript
// 자동으로 /data/districts_wgs84/{provinceCode}.json 로드
<DistrictModal
  provinceCode="11"
  provinceName="서울특별시"
  visitedDistricts={['11010', '11020']}
  onClose={() => {}}
/>
```

## 6. 문제 해결

### pyproj 설치 오류
```bash
pip3 install pyproj
```

### 토큰 만료 에러
- 스크립트는 자동으로 토큰을 재발급받습니다
- MAX_RETRIES=5까지 재시도

### Rate Limit
- 각 요청 사이에 500ms 대기 시간이 적용되어 있습니다
- 실패 시 exponential backoff 재시도

## 7. 데이터 업데이트 주기

- 행정구역 경계는 연 1-2회 변경됩니다
- 매년 1월에 최신 데이터로 업데이트하는 것을 권장합니다

## 8. 스크립트 동작 방식

### fetch-sgis-boundaries.mjs
1. AccessToken 발급 (24시간 유효)
2. 17개 광역시/도에 대해 순차적으로:
   - `hadmarea.geojson` API 호출
   - low_search=1로 한 단계 하위(시/군/구) 포함
   - 개별 JSON 파일로 저장
3. 에러 발생 시 자동 재시도 (토큰 만료 포함)

### convert_districts.py
1. `districts/*.json` 파일 읽기
2. 재귀적으로 모든 좌표 변환 (EPSG:5179 → WGS84)
3. `districts_wgs84/*.json`으로 저장

## 9. 라이센스

SGIS 데이터는 통계청의 오픈 API로 제공됩니다.
사용 전 [SGIS 이용약관](https://sgis.kostat.go.kr)을 확인하세요.
