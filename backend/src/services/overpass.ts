import { OVERPASS_API_URL } from '#config';
import type { BBox, OsmElements, PoiType } from '#types';

/* Fetch OSM data from Overpass API based on a custom query */
export async function fetchOsmData(query: string): Promise<OsmElements> {
  const response = await fetch(OVERPASS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: query
  });

  if (!response.ok) throw new Error(`Failed to fetch OSM data`, { cause: { status: response.status } });

  return (await response.json()) as OsmElements;
}

/* Build Overpass query for base layers (buildings, roads, green spaces, water) based on a bounding box */
export function buildBaseLayersQuery(bbox: BBox): string {
  const bboxStr = bbox.join(',');
  return `
          [out:json][timeout:25];
            (
              way["building"]["building"!~"^(garage|shed|annex)$"](${bboxStr});
              way["highway"]["highway"!~"^(path|footway|cycleway|track|steps)$"](${bboxStr});
              way["leisure"="park"](${bboxStr});
              way["landuse"="forest"](${bboxStr});
              way["waterway"~"^(river|stream)$"](${bboxStr});
              way["natural"="water"](${bboxStr});
            );
            
          out geom qt;`;
}

/* Build Overpass query for specified POIs based on a bounding box and list of POI types */
export function buildPoisQuery(bbox: BBox, pois: string[]): string {
  const querys: string[] = [];

  for (const poi of pois) {
    const key = poi === 'museum' ? 'tourism' : poi === 'bus_stop' ? 'highway' : 'amenity';
    querys.push(`node["${key}"="${poi}"](${bbox.join(',')});`);
  }

  return `
        [out:json][timeout:25];
          (
            ${querys.join('\n')}
          );  
          out body;
          >;
          out skel qt;`;
}
