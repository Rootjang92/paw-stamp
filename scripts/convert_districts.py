#!/usr/bin/env python3
"""
시/도별 시/군/구 GeoJSON 파일의 좌표를 EPSG:5179에서 WGS84로 변환
실행: python3 scripts/convert_districts.py
"""
import json
import os
from pathlib import Path
from pyproj import Transformer

# 좌표 변환기: EPSG:5179 (Korean Central Belt) -> EPSG:4326 (WGS84)
transformer = Transformer.from_crs("EPSG:5179", "EPSG:4326", always_xy=True)

def convert_coordinates(coords):
    """재귀적으로 좌표 변환"""
    if not coords:
        return coords

    # 좌표 쌍 [x, y]인 경우
    if isinstance(coords[0], (int, float)):
        x, y = coords
        lon, lat = transformer.transform(x, y)
        return [lon, lat]

    # 중첩 배열인 경우 재귀 호출
    return [convert_coordinates(item) for item in coords]

def convert_file(input_path, output_path):
    """단일 파일 변환"""
    print(f"📄 Converting {input_path.name}...")

    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 각 feature의 좌표 변환
    feature_count = len(data['features'])
    for i, feature in enumerate(data['features'], 1):
        if i % 10 == 0 or i == feature_count:
            print(f"   Progress: {i}/{feature_count}", end='\r')

        feature['geometry']['coordinates'] = convert_coordinates(
            feature['geometry']['coordinates']
        )

    # 변환된 데이터 저장
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"   ✅ Converted {feature_count} features")
    return feature_count

def main():
    print("🚀 Starting coordinate conversion (EPSG:5179 → WGS84)\n")
    print("=" * 60)

    # 디렉토리 경로
    script_dir = Path(__file__).parent
    input_dir = script_dir / '../public/data/districts'
    output_dir = script_dir / '../public/data/districts_wgs84'

    # 입력 디렉토리 확인
    if not input_dir.exists():
        print(f"❌ Error: Input directory not found: {input_dir}")
        print("Please run fetch-sgis-boundaries.mjs first")
        return 1

    # 출력 디렉토리 생성
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"📁 Input:  {input_dir}")
    print(f"📁 Output: {output_dir}\n")

    # 모든 JSON 파일 변환
    json_files = sorted(input_dir.glob('*.json'))

    if not json_files:
        print(f"❌ Error: No JSON files found in {input_dir}")
        return 1

    total_features = 0
    converted_count = 0

    for input_path in json_files:
        output_path = output_dir / input_path.name

        try:
            feature_count = convert_file(input_path, output_path)
            total_features += feature_count
            converted_count += 1
        except Exception as e:
            print(f"   ❌ Failed: {e}")

    print("\n" + "=" * 60)
    print("\n✨ Conversion Complete!\n")
    print(f"📊 Statistics:")
    print(f"   - Files processed: {converted_count}/{len(json_files)}")
    print(f"   - Total features: {total_features}")
    print(f"   - Output directory: {output_dir}")

    # 샘플 좌표 출력
    if json_files:
        sample_file = output_dir / json_files[0].name
        with open(sample_file, 'r') as f:
            sample_data = json.load(f)
            if sample_data['features']:
                first_coord = sample_data['features'][0]['geometry']['coordinates'][0][0][0]
                print(f"\n📍 Sample coordinate (first feature):")
                print(f"   {first_coord}")
                print(f"   Format: [longitude, latitude] (WGS84)")

    return 0

if __name__ == '__main__':
    exit(main())
