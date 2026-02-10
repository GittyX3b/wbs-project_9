import type { GeoFeature, GeoFeatureCollection, OsmElement } from '#types';

/* Extract points of interest (POIs) and organizes them into GeoJSON FeatureCollections by type. */
export function getPois(elements: OsmElement[]): Record<string, GeoFeatureCollection> {
  const pois: Record<string, GeoFeatureCollection> = {};

  elements.forEach(el => {
    if (el.type !== 'node') return;
    const tags = el.tags || {};
    const poi = tags.amenity || tags.tourism;
    if (!poi) return;

    const feature: GeoFeature = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [el.lon, el.lat]
      },
      properties: { ...tags, osm_id: el.id, osm_type: el.type }
    };

    if (!pois[poi]) {
      pois[poi] = { type: 'FeatureCollection', features: [] };
    }
    pois[poi].features.push(feature);
  });

  return pois;
}
