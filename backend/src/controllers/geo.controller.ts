import { fetchOsmData } from '#services';
import type { ZoneInputDTO, GeoFeature, GeoFeatureCollections, GeoResponseDTO } from '#types';
import { type RequestHandler } from 'express';
import { getBBox } from '#utils';
import { Zone } from '#models';
import type { any } from 'zod';
/**
 * Controller to get geographical data for a specified zone.
 * @param req - Express request object containing ZoneInputDTO in the body.
 * @param res - Express response object to send GeoResponseDTO.
 */
export const getGeoData: RequestHandler<{}, GeoResponseDTO, ZoneInputDTO> = async (req, res) => {
  const { lat, lon } = req.body.coordinates;

  const bbox = getBBox(lat, lon, 0.5); // 0.5 km radius for 1 km diameter

  console.log('Calculated BBox:', bbox);

  try {
    // Fetch OSM data and process it to extract relevant layers.
    const osmData = await fetchOsmData(bbox);
    const { buildings, roads, greenAreas } = getLayers(osmData);

    //Fetch elevation data
    //Fetch weather data

    //Save zone data to the database
    const zone = new Zone();
    zone.bbox = bbox;
    zone.coordinates = { lat, lon };
    zone.stats = {
      buildingCount: buildings.features.length,
      parkCount: greenAreas.features.length
    };
    zone.aiText = 'Sample AI-generated text about the area.';

    await zone.save();

    res.json({
      zoneId: zone._id,
      layers: {
        buildings,
        roads,
        greenAreas
      },
      elevation: { avg: 34.5 }, // Mocked elevation data
      weather: { temperature: 22 }, // Mocked weather data
      aiText: 'Sample AI-generated text about the area.' // Mocked AI text
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message, { cause: { status: 500 } });
    } else {
      throw new Error('Unknown error occurred while fetching geographical data.');
    }
  }
};

/** Extract layers from OSM data in GEOJson format */
function getLayers(osmData: any): {
  buildings: GeoFeatureCollections;
  roads: GeoFeatureCollections;
  greenAreas: GeoFeatureCollections;
} {
  // Filter and transform OSM data into GeoJSON feature collections
  const features = osmData.elements.filter((el: any) => el.type === 'way' && el.geometry);
  const layers = {
    buildings: { type: 'FeatureCollection', features: [] as any },
    roads: { type: 'FeatureCollection', features: [] as any },
    greenAreas: { type: 'FeatureCollection', features: [] as any }
  };

  features.forEach((f: any) => {
    const isBuilding = f.tags && f.tags.building;
    const isPark = f.tags && f.tags.leisure === 'park';

    const geometryType = isBuilding || isPark ? 'Polygon' : 'LineString';

    const newFeature: GeoFeature = {
      type: 'Feature',
      geometry: { type: geometryType, coordinates: f.geometry.map((point: any) => [point.lon, point.lat]) },
      properties: f.tags || {}
    };

    if (isBuilding) {
      layers.buildings.features.push(newFeature);
    } else if (isPark) {
      layers.greenAreas.features.push(newFeature);
    } else {
      layers.roads.features.push(newFeature);
    }
    return layers;
  });

  const { buildings, roads, greenAreas } = layers;

  return {
    buildings,
    roads,
    greenAreas
  };
}
