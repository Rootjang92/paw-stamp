/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { motion, AnimatePresence } from 'motion/react';
import koreaGeoData from '@/public/data/korea_city_wgs84.json';

interface KoreaMapProps {
  visitedCities?: string[];
  onCityClick?: (cityCode: string) => void;
  className?: string;
  selectedProvinceCode?: string | null;
  onDistrictClick?: (districtCode: string) => void;
}

interface GeoJSON {
  type: string;
  properties?: {
    provinceCode: string;
    provinceName: string;
    year: number;
  };
  features: Array<{
    type: string;
    properties: {
      adm_cd: string;
      adm_nm: string;
      [key: string]: any;
    };
    geometry: any;
  }>;
}

// 시/도별 지도 중심점과 확대율
const MAP_CONFIGS: Record<string, { center: [number, number]; scale: number }> = {
  '11': { center: [126.98, 37.57], scale: 70000 }, // 서울
  '21': { center: [129.08, 35.18], scale: 50000 }, // 부산
  '22': { center: [128.60, 35.87], scale: 50000 }, // 대구
  '23': { center: [126.71, 37.46], scale: 35000 }, // 인천
  '24': { center: [126.85, 35.16], scale: 60000 }, // 광주
  '25': { center: [127.38, 36.35], scale: 60000 }, // 대전
  '26': { center: [129.31, 35.54], scale: 50000 }, // 울산
  '29': { center: [127.29, 36.48], scale: 60000 }, // 세종
  '31': { center: [127.25, 37.40], scale: 15000 }, // 경기
  '32': { center: [128.30, 37.50], scale: 10000 }, // 강원
  '33': { center: [127.70, 36.80], scale: 20000 }, // 충북
  '34': { center: [126.80, 36.52], scale: 18000 }, // 충남
  '35': { center: [127.15, 35.72], scale: 20000 }, // 전북
  '36': { center: [126.99, 34.87], scale: 13000 }, // 전남
  '37': { center: [128.89, 36.49], scale: 11000 }, // 경북
  '38': { center: [128.21, 35.46], scale: 15000 }, // 경남
  '39': { center: [126.50, 33.45], scale: 40000 }, // 제주
};

export function KoreaMap({
  visitedCities = [],
  onCityClick,
  className,
  selectedProvinceCode = null,
  onDistrictClick
}: KoreaMapProps) {
  const [districtGeoData, setDistrictGeoData] = useState<GeoJSON | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedProvinceCode) {
      setDistrictGeoData(null);
      return;
    }

    async function loadDistrictData() {
      setLoading(true);
      try {
        const response = await fetch(`/data/districts_wgs84/${selectedProvinceCode}.json`);
        if (response.ok) {
          const data: GeoJSON = await response.json();
          setDistrictGeoData(data);
        }
      } catch (err) {
        console.error('Failed to load district data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDistrictData();
  }, [selectedProvinceCode]);

  const mapConfig = selectedProvinceCode && MAP_CONFIGS[selectedProvinceCode]
    ? MAP_CONFIGS[selectedProvinceCode]
    : { center: [127.5, 36.5] as [number, number], scale: 5500 };

  return (
    <div className={className} style={{ touchAction: 'none', width: '500px', height: '650px' }}>
      <AnimatePresence mode="wait">
        {!selectedProvinceCode ? (
          // 전국 지도
          <motion.div
            key="korea"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                center: [127.5, 36.5],
                scale: 5500,
              }}
              width={500}
              height={650}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <ZoomableGroup
                zoom={1}
                center={[127.5, 36.5]}
                minZoom={1}
                maxZoom={1}
              >
                <Geographies geography={koreaGeoData}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const provinceCode = geo.properties.id;
                      const isVisited = visitedCities.includes(provinceCode);

                      return (
                        <Geography
                          key={provinceCode}
                          geography={geo}
                          fill={isVisited ? '#0891B2' : '#E5E7EB'}
                          stroke="#FFFFFF"
                          strokeWidth={1.5}
                          style={{
                            default: { outline: 'none' },
                            hover: {
                              fill: isVisited ? '#0E7490' : '#D1D5DB',
                              outline: 'none',
                              cursor: 'pointer'
                            },
                            pressed: { fill: '#155E75', outline: 'none' },
                          }}
                          onClick={() => onCityClick?.(provinceCode)}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </motion.div>
        ) : loading ? (
          // 로딩 중
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full w-full items-center justify-center"
          >
            <div className="border-primary-600 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          </motion.div>
        ) : districtGeoData ? (
          // 상세 지역 지도
          <motion.div
            key={`district-${selectedProvinceCode}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                center: mapConfig.center,
                scale: mapConfig.scale,
              }}
              width={500}
              height={650}
              style={{
                width: '100%',
                height: '100%',
              }}
            >
              <Geographies geography={districtGeoData}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const districtCode = geo.properties.adm_cd;
                    const isVisited = visitedCities.includes(districtCode);

                    return (
                      <Geography
                        key={districtCode}
                        geography={geo}
                        fill={isVisited ? '#0891B2' : '#E5E7EB'}
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: 'none' },
                          hover: {
                            fill: isVisited ? '#0E7490' : '#D1D5DB',
                            outline: 'none',
                            cursor: 'pointer',
                          },
                          pressed: { fill: '#155E75', outline: 'none' },
                        }}
                        onClick={() => onDistrictClick?.(districtCode)}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
