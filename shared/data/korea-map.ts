/**
 * 대한민국 광역시/도 지도 데이터
 * 간단한 지리 좌표 기반 (실제 프로덕션에서는 정확한 GeoJSON/TopoJSON 사용 필요)
 */

export interface ProvinceGeo {
  id: string;
  name: string;
  // SVG path 좌표 (간략화된 형태)
  coordinates: [number, number][];
}

// 대한민국 광역시/도의 대략적인 중심 좌표 (위도, 경도)
export const provinceCoordinates: Record<string, { lat: number; lng: number }> = {
  서울특별시: { lat: 37.5665, lng: 126.978 },
  부산광역시: { lat: 35.1796, lng: 129.0756 },
  대구광역시: { lat: 35.8714, lng: 128.6014 },
  인천광역시: { lat: 37.4563, lng: 126.7052 },
  광주광역시: { lat: 35.1595, lng: 126.8526 },
  대전광역시: { lat: 36.3504, lng: 127.3845 },
  울산광역시: { lat: 35.5384, lng: 129.3114 },
  세종특별자치시: { lat: 36.4801, lng: 127.2890 },
  경기도: { lat: 37.4138, lng: 127.5183 },
  강원특별자치도: { lat: 37.8228, lng: 128.1555 },
  충청북도: { lat: 36.8000, lng: 127.7000 },
  충청남도: { lat: 36.5184, lng: 126.8000 },
  전북특별자치도: { lat: 35.7175, lng: 127.1530 },
  전라남도: { lat: 34.8679, lng: 126.991 },
  경상북도: { lat: 36.4919, lng: 128.8889 },
  경상남도: { lat: 35.4606, lng: 128.2132 },
  제주특별자치도: { lat: 33.4890, lng: 126.4983 },
};

// 지도 뷰포트 설정
export const mapConfig = {
  center: { lat: 36.5, lng: 127.5 } as const,
  zoom: 7,
  minZoom: 6,
  maxZoom: 10,
};

// 대한민국 경계 박스 (위/아래/왼쪽/오른쪽 좌표)
export const koreaBounds = {
  north: 38.612,
  south: 33.1,
  west: 124.6,
  east: 131.9,
} as const;
