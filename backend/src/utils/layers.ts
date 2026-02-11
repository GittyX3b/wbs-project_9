import type { GeoFeature, GeoLayers, OsmElement } from '#types';

/** Extract layers from OSM data in GEOJson format */
export function getLayers(elements: OsmElement[]): GeoLayers {
  const layers = {
    buildings: { type: 'FeatureCollection' as const, features: [] as GeoFeature[] },
    roads: { type: 'FeatureCollection' as const, features: [] as GeoFeature[] },
    green: { type: 'FeatureCollection' as const, features: [] as GeoFeature[] },
    water: { type: 'FeatureCollection' as const, features: [] as GeoFeature[] }
  };

  elements.forEach(el => {
    if (el.type === 'node') return; // Skip nodes for base layers

    const tags = el.tags || {};

    const isBuilding = !!tags.building;
    const isGreenArea =
      (tags.leisure && ['park', 'garden', 'playground'].includes(tags.leisure)) ||
      (tags.landuse && ['forest', 'grass', 'meadow'].includes(tags.landuse)) ||
      (tags.natural && ['wood', 'scrub', 'heath'].includes(tags.natural));
    const isRoad = !!tags.highway;
    const isRiver = tags.waterway === 'river' || tags.waterway === 'stream';
    const isLake = tags.natural === 'water';

    if (!isBuilding && !isGreenArea && !isRoad && !isRiver && !isLake) return;

    let geometry: GeoFeature['geometry'] | null = null;

    if (el.type === 'way' && el.geometry) {
      // console.log('Processing way:', el.id, 'with tags:', tags);
      const coords = el.geometry.map(p => [p.lon, p.lat] as [number, number]);

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
    } else if (el.type === 'relation' && el.members) {
      const members = el.members
        .filter(m => m.type === 'way' && m.geometry && m.geometry.length > 0)
        .map(m => m.geometry!.map(p => [p.lon, p.lat] as [number, number]));

      if (members.length === 0) return;
      geometry = {
        type: 'MultiPolygon',
        coordinates: members.map(m => [m])
      };
    }

    if (!geometry) return;

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
