import { OVERPASS_API_URL } from '#config';
import type { BBox, OsmElements } from '#types';
import { cache } from '#cache';
import crypto from 'node:crypto';

const generateCacheKey = (query: string): string => {
  const normalizedQuery = query.replace(/\s+/g, ' ').trim();
  return crypto.createHash('sha256').update(normalizedQuery).digest('hex');
};

/* Fetch OSM data from Overpass API based on a custom query */
export async function fetchOsmData(query: string): Promise<OsmElements> {
  // console.log('Fetching OSM data with query:', query);

  // Check cache first
  const cacheKey = `overpass:${generateCacheKey(query)}`;

  // console.log('Generated cache key:', cacheKey);
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    // console.log('Cache hit for query');
    return cachedData as OsmElements;
  }

  // console.log('Cache miss for query, fetching from Overpass API');

  const response = await fetch(OVERPASS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: query
  });

  if (!response.ok) throw new Error(`Failed to fetch OSM data`, { cause: { status: response.status } });

  const data = (await response.json()) as OsmElements;
  cache.set(cacheKey, data);

  return data;
}

/* Build Overpass query for base layers (buildings, roads, green spaces, water) based on a bounding box */
export function buildBaseLayersQuery(bbox: BBox): string {
  const bboxStr = bbox.join(',');
  return `
          [out:json][timeout:25];
            (
              way["building"]["building"!~"^(garage|shed|annex)$"](${bboxStr});
              relation["building"]["building"!~"^(garage|shed|annex)$"](${bboxStr});
              way["highway"]["highway"!~"^(path|footway|cycleway|track|steps)$"](${bboxStr});
              way["leisure"~"park|garden|playground"](${bboxStr});
              relation["leisure"~"park|garden|playground"](${bboxStr});
              way["landuse"~"forest|grass|meadow"](${bboxStr});
              relation["landuse"~"forest|grass|meadow"](${bboxStr});
              way["natural"~"wood|scrub|heath"](${bboxStr});
              relation["natural"~"wood|scrub|heath"](${bboxStr});
              way["waterway"="river"](${bboxStr});
              way["natural"="water"](${bboxStr});
              relation["natural"="water"](${bboxStr});
            );
            
          out geom;`;
}

/* Mapping of POI types to their corresponding OSM tags */
const poiObject: Record<string, string> = {
  museum: 'tourism',
  bus_stop: 'highway',
  supermarket: 'shop',
  park: 'leisure',
  restaurant: 'amenity',
  cafe: 'amenity',
  theatre: 'amenity',
  cinema: 'amenity',
  kindergarten: 'amenity',
  school: 'amenity',
  university: 'amenity',
  hospital: 'amenity',
  pharmacy: 'amenity',
  bank: 'amenity',
  atm: 'amenity',
  post_office: 'amenity',
  library: 'amenity'
};

/* Build Overpass query for specified POIs based on a bounding box and list of POI types */
export function buildPoisQuery(bbox: BBox, pois: string[]): string {
  const queries: string[] = [];

  for (const poi of pois) {
    const key = poiObject[poi] ?? null;
    if (!key) continue;
    queries.push(`nwr["${key}"="${poi}"](${bbox.join(',')});`);
  }

  return `
        [out:json][timeout:25];
          (
            ${queries.join('\n')}
          );  
          out geom;`;
}
