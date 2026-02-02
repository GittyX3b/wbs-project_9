/* Fetch OSM data from Overpass API based on a bounding box */
export async function fetchOsmData(bbox: number[]): Promise<any> {
  const body = `
          [out:json][timeout:25];
              (
              way["building"][building!=garage][building!=shed][building!=annex](${bbox.join(',')});
              way["highway"][highway!=path][highway!=footway][highway!=cycleway][highway!=track][highway!=steps](${bbox.join(',')});
              way["leisure"="park"]["access"~"public|yes"](${bbox.join(',')});
              );
          out geom qt;`;

  const response = await fetch(process.env.OVERPASS_API_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: body
  });

  if (!response.ok) {
    throw new Error(`Overpass API request failed with status ${response.status}`);
  }

  return await response.json();
}
