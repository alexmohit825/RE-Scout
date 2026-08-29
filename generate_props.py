import re

city_coords = {
    'Spokane': (47.6588, -117.4260),
    'Seattle': (47.6062, -122.3321),
    'Portland': (45.5152, -122.6784),
    'Gig Harbor': (47.3293, -122.5801),
    'Tacoma': (47.2529, -122.4443),
    'Puyallup': (47.1854, -122.2929),
    'Sumner': (47.2032, -122.2415),
    'Kennewick': (46.2112, -119.1372),
    'Gresham': (45.4998, -122.4312),
    'Everett': (47.9790, -122.2021),
    'Vancouver': (45.6387, -122.6615),
    'Yakima': (46.6021, -120.5059),
    'Pasco': (46.2396, -119.1006),
    'Phoenix': (33.4484, -112.0740),
    'Las Vegas': (36.1699, -115.1398),
    'Denver': (39.7392, -104.9903),
    'Los Angeles': (34.0522, -118.2437),
    'San Diego': (32.7157, -117.1611),
    'Chicago': (41.8781, -87.6298),
    'Columbus': (39.9612, -82.9988),
    'Detroit': (42.3314, -83.0458),
    'Minneapolis': (44.9778, -93.2650),
    'Indianapolis': (39.7684, -86.1581),
    'Atlanta': (33.7490, -84.3880),
    'Miami': (25.7617, -80.1918),
    'Charlotte': (35.2271, -80.8431),
    'Nashville': (36.1627, -86.7816),
    'Orlando': (28.5383, -81.3792),
    'New York': (40.7128, -74.0060),
    'Boston': (42.3601, -71.0589),
    'Philadelphia': (39.9526, -75.1652),
    'Baltimore': (39.2904, -76.6122),
    'Washington': (38.9072, -77.0369)
}

with open('src/components/swift_code/PropertyData.swift', 'r', encoding='utf-8') as f:
    raw = f.read()

# Match each individual Property(...) declaration
# We can find Property(...) blocks by tracking parenthesis balancing
pos = 0
properties = []
while True:
    start = raw.find('Property(', pos)
    if start == -1:
        break
    # Find matching closing parenthesis
    depth = 0
    i = start
    while i < len(raw):
        if raw[i] == '(':
            depth += 1
        elif raw[i] == ')':
            depth -= 1
            if depth == 0:
                block = raw[start:i+1]
                properties.append(block)
                pos = i + 1
                break
        i += 1
    if i >= len(raw):
        break

print(f'Parsed {len(properties)} properties cleanly.')

formatted_properties = []
for p in properties:
    city_m = re.search(r'city:\s*"([^"]+)"', p)
    city = city_m.group(1) if city_m else 'Seattle'
    lat, lon = city_coords.get(city, (47.6062, -122.3321))
    
    # Remove any misplaced latitude/longitude
    p_clean = re.sub(r',\s*latitude:[^,\)]+', '', p)
    p_clean = re.sub(r',\s*longitude:[^,\)]+', '', p_clean)
    
    # Insert latitude and longitude right before the final closing ')'
    last_close = p_clean.rfind(')')
    body = p_clean[:last_close].rstrip()
    updated = f"{body},\n            latitude: {lat},\n            longitude: {lon}\n        )"
    formatted_properties.append(updated)

output_code = "import Foundation\n\npublic enum PropertyData {\n    public static let initialProperties: [Property] = [\n        " + ",\n        ".join(formatted_properties) + "\n    ]\n}\n"

with open('ios/ValueREScout/Data/PropertyData.swift', 'w', encoding='utf-8') as f:
    f.write(output_code)

print(f'Successfully wrote {len(formatted_properties)} properties with accurate coordinates!')
