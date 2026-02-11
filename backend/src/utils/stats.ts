import type { BBox, GeoFeature, GeoLayers } from '#types';
import * as turf from '@turf/turf';

/** Calculate various statistics for the zone based on its layers */
export function calculateZoneStats(layers: GeoLayers, bbox: BBox) {
  const {
    buildings = layers.buildings,
    roads = layers.roads,
    green = layers.green,
    water = layers.water
  } = layers || {};

  const buildingsFeatures = buildings?.features || [];

  const areaKm2 = turf.area(turf.bboxPolygon(bbox)) / 1e6; // area in km²

  const buildingCount = buildingsFeatures.length;
  const buildingDensity = areaKm2 > 0 ? buildingCount / areaKm2 : null; // buildings per km²

  const totalRoadLength = roads.features.reduce((sum, f) => {
    const length = turf.length(f, { units: 'kilometers' });
    return sum + length;
  }, 0);

  const roadDensity = areaKm2 > 0 ? totalRoadLength / areaKm2 : null; // km of road per km²

  const greenAreaKm2 =
    green.features.reduce((sum: number, feature: GeoFeature) => {
      return sum + turf.area(feature);
    }, 0) / 1e6;

  const greenCoverage = areaKm2 > 0 ? greenAreaKm2 / areaKm2 : null; // proportion of green area

  const waterAreaKm2 =
    water.features.filter(f => f.geometry.type === 'Polygon').reduce((sum, f) => sum + turf.area(f), 0) / 1e6;

  const waterCoverage = areaKm2 > 0 ? waterAreaKm2 / areaKm2 : null; // proportion of water area

  const riverLengthKm = water.features
    .filter(f => f.geometry.type === 'LineString')
    .reduce((sum, f) => sum + turf.length(f, { units: 'kilometers' }), 0);

  const hasRivers = riverLengthKm > 0;

  return {
    areaKm2,
    buildingDensity,
    roadDensity,
    greenCoverage,
    waterCoverage,
    riverLengthKm,
    hasRivers
  };
}
