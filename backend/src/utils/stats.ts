import type { GeoFeature, GeoLayers } from '#types';
import * as turf from '@turf/turf';

/** Calculate various statistics for the zone based on its layers */
export function calculateZoneStats(layers: GeoLayers, bbox: [number, number, number, number]) {
  const {
    buildings = layers.buildings,
    roads = layers.roads,
    green = layers.green,
    water = layers.water
  } = layers || {};
  const buildingCount = buildings.features.length;
  const buildingDensity = buildingCount / turf.area(turf.bboxPolygon(bbox)) / 1e6; // buildings per km²

  const totalRoadLength = roads.features.reduce((sum, f) => {
    const length = turf.length(f, { units: 'kilometers' });
    return sum + length;
  }, 0);

  const roadToBuildingRatio = buildingCount > 0 ? totalRoadLength / buildingCount : null;

  const greenAreaKm2 =
    green.features.reduce((sum: number, feature: GeoFeature) => {
      return sum + turf.area(feature);
    }, 0) / 1e6;
  const greenToBuildingRatio = buildingCount > 0 ? greenAreaKm2 / buildingCount : null;

  const waterAreaKm2 =
    water.features.filter(f => f.geometry.type === 'Polygon').reduce((sum, f) => sum + turf.area(f), 0) / 1e6;
  const riverLengthKm = water.features
    .filter(f => f.geometry.type === 'LineString')
    .reduce((sum, f) => sum + turf.length(f, { units: 'kilometers' }), 0);

  const restaurantCount = buildings.features.filter(f => f.properties?.amenity === 'restaurant').length;
  const fastFoodCount = buildings.features.filter(f => f.properties?.amenity === 'fast_food').length;
  const cafeCount = buildings.features.filter(f => f.properties?.amenity === 'cafe').length;
  const supermarketCount = buildings.features.filter(f => f.properties?.shop === 'supermarket').length;

  return {
    buildingDensity,
    roadToBuildingRatio,
    greenToBuildingRatio,
    waterAreaKm2,
    riverLengthKm,
    restaurantCount,
    fastFoodCount,
    cafeCount,
    supermarketCount
  };
}
