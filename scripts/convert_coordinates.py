#!/usr/bin/env python3
"""
Convert korea_city.json from projected coordinates (EPSG:5179) to WGS84 (lat/lon)
"""
import json
from pyproj import Transformer

# Create transformer from EPSG:5179 (Korean Central Belt) to EPSG:4326 (WGS84)
transformer = Transformer.from_crs("EPSG:5179", "EPSG:4326", always_xy=True)

def convert_coordinates(coords):
    """Recursively convert coordinates from projected to lat/lon"""
    if not coords:
        return coords

    # Check if this is a coordinate pair [x, y]
    if isinstance(coords[0], (int, float)):
        x, y = coords
        lon, lat = transformer.transform(x, y)
        return [lon, lat]

    # Recursively process nested arrays
    return [convert_coordinates(item) for item in coords]

# Read input file
with open('/Users/mac/Desktop/paw-stamp/public/data/korea_city.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Converting {len(data['features'])} features...")

# Convert each feature's coordinates
for i, feature in enumerate(data['features']):
    print(f"Converting {feature['properties']['title']} ({feature['properties']['id']})...")
    feature['geometry']['coordinates'] = convert_coordinates(feature['geometry']['coordinates'])

# Write output file
output_path = '/Users/mac/Desktop/paw-stamp/public/data/korea_city_wgs84.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\nConversion complete! Saved to: {output_path}")

# Print sample of first feature
print(f"\nSample converted coordinates (first feature):")
print(f"Original properties: {data['features'][0]['properties']}")
print(f"First coordinate: {data['features'][0]['geometry']['coordinates'][0][0][0]}")
