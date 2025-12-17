'use client';

import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import koreaGeoData from '@/public/data/korea_city_wgs84.json';

interface KoreaMapProps {
  visitedCities?: string[];
  onCityClick?: (cityCode: string) => void;
  className?: string;
}

export function KoreaMap({ visitedCities = [], onCityClick, className }: KoreaMapProps) {
  return (
    <div className={className} style={{ touchAction: 'none', width: '500px', height: '650px' }}>
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
    </div>
  );
}
