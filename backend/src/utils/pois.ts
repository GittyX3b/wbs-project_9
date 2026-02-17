import type { GeoFeature, GeoFeatureCollection, OsmElement } from '#types';
import * as turf from '@turf/turf';

/* Extract points of interest (POIs) and organizes them into GeoJSON FeatureCollections by type. */
export function getPois(elements: OsmElement[]): Record<string, GeoFeatureCollection> {
  const pois: Record<string, GeoFeatureCollection> = {};

  elements.forEach(el => {
    const tags = el.tags || {};
    const type = tags.shop || tags.amenity || tags.tourism || tags.highway || tags.leisure;

    if (!type) return;

    let coords: [number, number] | null = null;

    if (el.type === 'node') {
      coords = [el.lon, el.lat];
    } else if (el.type === 'way' && el.geometry.length > 0) {
      // For ways, use the centroid of the geometry as the POI location
      const line = turf.lineString(el.geometry.map(p => [p.lon, p.lat]));
      coords = turf.center(line).geometry.coordinates as [number, number];
    } else if (el.type === 'relation') {
      // For relations, use the centroid of all member geometries
      const points = el.members
        .filter(m => m.geometry && m.geometry.length > 0)
        .flatMap(m => m.geometry!.map(p => [p.lon, p.lat]));

      if (points.length > 0) {
        const centerFeature = turf.center(turf.multiPoint(points));
        coords = centerFeature.geometry.coordinates as [number, number];
      }
    }

    if (!coords) return;

    const feature: GeoFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coords
      },
      properties: { ...tags, osm_id: el.id, osm_type: el.type }
    };

    if (!pois[type]) {
      pois[type] = { type: 'FeatureCollection', features: [] };
    }
    pois[type].features.push(feature);
  });

  return pois;
}
