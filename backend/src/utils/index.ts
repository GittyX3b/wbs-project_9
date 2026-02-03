import { point, buffer, bbox } from '@turf/turf';

/** Calculate bounding box [minLat, minLon, maxLat, maxLon] given center coordinates and radius in kilometers */
export function getBBox(lat: number, lon: number, radiusInKm: number): number[] {
  const center = point([lon, lat]);

  // Create a buffer (circle) around the center point
  const zone = buffer(center, radiusInKm, { units: 'kilometers' });
  if (!zone) throw new Error('Buffer calculation failed');

  // Get the bounding box of the buffered area
  const box = bbox(zone.geometry); // [minLon, minLat, maxLon, maxLat]
  const rawBBox = [box[1], box[0], box[3], box[2]];

  return rawBBox.map(coord => Math.round(coord * 10000) / 10000); // Round to 4 decimal places
}
