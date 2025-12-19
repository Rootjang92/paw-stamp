/**
 * 17개 광역시/도 정보
 */
export const PROVINCE_INFO = {
  '11': { name: '서울특별시', shortName: '서울' },
  '21': { name: '부산광역시', shortName: '부산' },
  '22': { name: '대구광역시', shortName: '대구' },
  '23': { name: '인천광역시', shortName: '인천' },
  '24': { name: '광주광역시', shortName: '광주' },
  '25': { name: '대전광역시', shortName: '대전' },
  '26': { name: '울산광역시', shortName: '울산' },
  '29': { name: '세종특별자치시', shortName: '세종' },
  '31': { name: '경기도', shortName: '경기' },
  '32': { name: '강원특별자치도', shortName: '강원' },
  '33': { name: '충청북도', shortName: '충북' },
  '34': { name: '충청남도', shortName: '충남' },
  '35': { name: '전북특별자치도', shortName: '전북' },
  '36': { name: '전라남도', shortName: '전남' },
  '37': { name: '경상북도', shortName: '경북' },
  '38': { name: '경상남도', shortName: '경남' },
  '39': { name: '제주특별자치도', shortName: '제주' },
} as const;

export type ProvinceCode = keyof typeof PROVINCE_INFO;

/**
 * 광역시/도 코드 목록
 */
export const PROVINCE_CODES = Object.keys(PROVINCE_INFO) as ProvinceCode[];

/**
 * 광역시/도 이름 가져오기
 */
export function getProvinceName(code: string): string {
  return PROVINCE_INFO[code as ProvinceCode]?.name || code;
}

/**
 * 광역시/도 짧은 이름 가져오기
 */
export function getProvinceShortName(code: string): string {
  return PROVINCE_INFO[code as ProvinceCode]?.shortName || code;
}
