import type { GeoFeature, OsmElements } from '#types';
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

/** Extract layers from OSM data in GEOJson format */
export function getLayers(osmData: OsmElements) {
  const layers = {
    buildings: { type: 'FeatureCollection', features: [] as GeoFeature[] },
    roads: { type: 'FeatureCollection', features: [] as GeoFeature[] },
    greenAreas: { type: 'FeatureCollection', features: [] as GeoFeature[] },
    water: { type: 'FeatureCollection', features: [] as GeoFeature[] }
  };

  osmData.elements.forEach(el => {
    if (!el.geometry || el.geometry.length < 2) return;
    const tags = el.tags || {};

    const isBuilding = !!tags.building;
    const isGreenArea = tags.leisure === 'park' || tags.landuse === 'forest';
    const isRoad = !!tags.highway;
    const isRiver = tags.waterway === 'river' || tags.waterway === 'stream';
    const isLake = tags.natural === 'water';

    if (!isBuilding && !isGreenArea && !isRoad && !isRiver && !isLake) return;

    let geometryType: 'Polygon' | 'LineString';
    let coordinates: number[][] | number[][][];
    const coords = el.geometry.map(p => [p.lon, p.lat]);

    if (isBuilding || isGreenArea || isLake) {
      geometryType = 'Polygon';
      const first = coords[0];
      const last = coords[coords.length - 1];
      if (!first || !last) return;
      if (first[0] !== last[0] || first[1] !== last[1]) {
        coords.push(first);
      }

      coordinates = [coords];
    } else {
      geometryType = 'LineString';
      coordinates = coords;
    }

    const feature: GeoFeature = {
      type: 'Feature',
      geometry: { type: geometryType, coordinates },
      properties: { ...tags, osm_id: el.id, osm_type: el.type }
    };

    if (isBuilding) layers.buildings.features.push(feature);
    else if (isGreenArea) layers.greenAreas.features.push(feature);
    else if (isRoad) layers.roads.features.push(feature);
    else if (isRiver || isLake) layers.water.features.push(feature);
  });

  return layers;
}
