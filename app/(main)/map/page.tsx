'use client';

import { MapContainer } from '@/widgets/map-container';

export default function MapPage() {
  // 테스트용 방문 데이터 (추후 실제 API 연동)
  const visitedCities = ['11', '26', '41', '50']; // 서울, 부산, 경기, 제주

  const handleCityClick = (cityCode: string) => {
    console.log('Clicked city:', cityCode);
    // 추후 도시 상세 정보 모달 또는 사이드바 표시
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 bg-zinc-100 dark:bg-zinc-900">
        <MapContainer visitedCities={visitedCities} onCityClick={handleCityClick} />
      </div>
    </main>
  );
}
