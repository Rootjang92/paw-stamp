#!/usr/bin/env node
/**
 * SGIS API에서 229개 시/군/구 경계 데이터를 가져와서 시/도별로 개별 파일 저장
 * 실행: node scripts/fetch-sgis-boundaries.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// .env.local 파일 로드
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// 환경변수에서 API 키 로드
const KEY = process.env.SGIS_CONSUMER_KEY;
const SECRET = process.env.SGIS_CONSUMER_SECRET;

if (!KEY || !SECRET) {
  console.error('❌ Error: SGIS_CONSUMER_KEY and SGIS_CONSUMER_SECRET must be set');
  console.log('Add them to your .env.local file:');
  console.log('SGIS_CONSUMER_KEY=your_key');
  console.log('SGIS_CONSUMER_SECRET=your_secret');
  process.exit(1);
}

// 17개 광역시/도 정보
const PROVINCES = {
  11: '서울특별시',
  21: '부산광역시',
  22: '대구광역시',
  23: '인천광역시',
  24: '광주광역시',
  25: '대전광역시',
  26: '울산광역시',
  29: '세종특별자치시',
  31: '경기도',
  32: '강원특별자치도',
  33: '충청북도',
  34: '충청남도',
  35: '전북특별자치도',
  36: '전라남도',
  37: '경상북도',
  38: '경상남도',
  39: '제주특별자치도',
};

// 토큰 관리
let accessToken = null;
let tokenExpiry = null;
const MAX_RETRIES = 5;

/**
 * 1. AccessToken 발급 (만료 시 자동 재발급)
 */
async function getAccessToken() {
  // 기존 토큰이 유효하면 재사용
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('♻️  Reusing existing token');
    return accessToken;
  }

  console.log('🔑 Requesting new access token...');

  const url = `https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json?consumer_key=${KEY}&consumer_secret=${SECRET}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.errCd !== 0) {
      throw new Error(`Token error [${data.errCd}]: ${data.errMsg}`);
    }

    accessToken = data.result.accessToken;
    // 토큰 만료 시간 설정 (실제로는 24시간이지만 안전을 위해 23시간)
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;

    console.log('✅ Access token obtained');
    console.log(`   Valid until: ${new Date(tokenExpiry).toLocaleString()}`);

    return accessToken;
  } catch (error) {
    console.error('❌ Failed to get access token:', error.message);
    throw error;
  }
}

/**
 * 2. API 호출 with 자동 재인증 및 재시도
 */
async function fetchWithRetry(url, retryCount = 0) {
  try {
    const res = await fetch(url);
    const data = await res.json();

    // 에러 코드 처리
    switch (data.errCd) {
      case 0:
        // 성공
        return data;

      case -401:
        // 토큰 만료
        if (retryCount >= MAX_RETRIES) {
          throw new Error('Max retries reached for token refresh');
        }

        console.log('⚠️  Token expired, refreshing... (retry ' + (retryCount + 1) + ')');

        // 토큰 강제 만료 후 재발급
        accessToken = null;
        tokenExpiry = null;
        await getAccessToken();

        // 새 토큰으로 URL 재구성
        const newUrl = url.replace(/accessToken=[^&]*/, `accessToken=${accessToken}`);
        return fetchWithRetry(newUrl, retryCount + 1);

      case -100:
        throw new Error(`API error [${data.errCd}]: ${data.errMsg}`);

      default:
        throw new Error(`Unknown error [${data.errCd}]: ${data.errMsg}`);
    }
  } catch (error) {
    if (retryCount >= MAX_RETRIES) {
      throw error;
    }

    console.log(`⚠️  Network error, retry ${retryCount + 1}/${MAX_RETRIES}...`);

    // Exponential backoff
    await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, retryCount)));

    return fetchWithRetry(url, retryCount + 1);
  }
}

/**
 * 3. 특정 시/도의 시/군/구 경계 데이터 가져오기
 */
async function fetchDistricts(provinceCode, provinceName) {
  console.log(`\n📍 Fetching ${provinceName} (${provinceCode})...`);

  const token = await getAccessToken();
  const url = `https://sgisapi.kostat.go.kr/OpenAPI3/boundary/hadmarea.geojson?year=2024&adm_cd=${provinceCode}&low_search=1&accessToken=${token}`;

  const data = await fetchWithRetry(url);

  console.log(`   ✅ Got ${data.features.length} districts`);

  return {
    type: 'FeatureCollection',
    properties: {
      provinceCode: provinceCode,
      provinceName: provinceName,
      year: 2024,
    },
    features: data.features,
  };
}

/**
 * 4. 메인 실행
 */
async function main() {
  console.log('🚀 Starting SGIS boundary data fetch...\n');
  console.log('='.repeat(60));

  // 출력 디렉토리 생성
  const outputDir = path.join(__dirname, '../public/data/districts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created directory: ${outputDir}`);
  }

  let totalDistricts = 0;
  const failedProvinces = [];

  // 각 시/도별로 개별 파일 생성
  for (const [code, name] of Object.entries(PROVINCES)) {
    try {
      const geojson = await fetchDistricts(code, name);

      // 파일명: districts/11.json, districts/31.json 등
      const filename = path.join(outputDir, `${code}.json`);
      fs.writeFileSync(filename, JSON.stringify(geojson, null, 2));

      totalDistricts += geojson.features.length;
      console.log(`   💾 Saved: ${code}.json`);

      // Rate limiting (500ms 대기)
      await new Promise((r) => setTimeout(r, 500));
    } catch (error) {
      console.error(`   ❌ Failed: ${name} - ${error.message}`);
      failedProvinces.push({ code, name, error: error.message });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Fetch Complete!\n');
  console.log(`📊 Statistics:`);
  console.log(`   - Total provinces: ${Object.keys(PROVINCES).length}`);
  console.log(
    `   - Successfully fetched: ${Object.keys(PROVINCES).length - failedProvinces.length}`
  );
  console.log(`   - Total districts: ${totalDistricts}`);
  console.log(`   - Output directory: public/data/districts/`);

  if (failedProvinces.length > 0) {
    console.log(`\n⚠️  Failed provinces (${failedProvinces.length}):`);
    failedProvinces.forEach(({ code, name, error }) => {
      console.log(`   - ${name} (${code}): ${error}`);
    });
  }

  console.log('\n📝 Next step: Run coordinate conversion script');
  console.log('   python3 scripts/convert_districts.py');
}

// 실행
main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
