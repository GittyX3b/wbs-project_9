import type { GeoFeature, GeoLayers, OsmElements } from '#types';

/** Extract layers from OSM data in GEOJson format */
export function getLayers(osmData: OsmElements): GeoLayers {
  const layers = {
    buildings: { type: 'FeatureCollection' as const, features: [] as GeoFeature[] },
    roads: { type: 'FeatureCollection' as const, features: [] as GeoFeature[] },
    green: { type: 'FeatureCollection' as const, features: [] as GeoFeature[] },
    water: { type: 'FeatureCollection' as const, features: [] as GeoFeature[] }
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

    const coords = el.geometry.map(p => [p.lon, p.lat]) as [number, number][];

    let geometry: GeoFeature['geometry'];
    if (isBuilding || isGreenArea || isLake) {
      // Ensure the polygon is closed by checking if the first and last coordinates are the same
      const first = coords[0];
      const last = coords[coords.length - 1];
      if (!first || !last) return;
      if (first[0] !== last[0] || first[1] !== last[1]) {
        coords.push(first);
      }

      geometry = {
        type: 'Polygon',
        coordinates: [coords]
      };
    } else {
      geometry = {
        type: 'LineString',
        coordinates: coords
      };
    }

    const feature: GeoFeature = {
      type: 'Feature',
      geometry,
      properties: { ...tags, osm_id: el.id, osm_type: el.type }
    };

    if (isBuilding) layers.buildings.features.push(feature);
    else if (isGreenArea) layers.green.features.push(feature);
    else if (isRoad) layers.roads.features.push(feature);
    else if (isRiver || isLake) layers.water.features.push(feature);
  });

  return layers;
}
