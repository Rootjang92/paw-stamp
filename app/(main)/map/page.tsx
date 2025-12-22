import { MapContainer } from '@/widgets/map-container';

export default async function MapPage() {
  // 서버에서 방문 데이터 가져오기 (추후 Supabase 연동)
  // const { data: visits } = await supabase.from('visits').select('city_code');
  // const visitedCities = visits?.map(v => v.city_code) || [];

  // 테스트용 방문 데이터
  const visitedCities = ['11', '26', '41', '50']; // 서울, 부산, 경기, 제주

  return (
    <main className="flex-1 flex flex-col overflow-hidden min-h-screen">
      <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-950">
        <MapContainer visitedCities={visitedCities} />
      </div>
    </main>
  );
}
