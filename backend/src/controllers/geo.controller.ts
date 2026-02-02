import { fetchOsmData } from '#services';
import type { ZoneInputDTO, GeoFeatureCollections, GeoResponseDTO } from '#types';
import { type RequestHandler } from 'express';
import { getBBox } from '#utils';
import { Zone } from '#models';
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

  // Separate features into buildings, roads, and green areas
  const buildings = features
    .filter((el: any) => el.tags && el.tags.building)
    .map((b: any) => ({ type: 'Feature', geometry: b.geometry, properties: b.tags }));
  const roads = features
    .filter((el: any) => el.tags && el.tags.highway)
    .map((r: any) => ({ type: 'Feature', geometry: r.geometry, properties: r.tags }));
  const greenAreas = features
    .filter((el: any) => el.tags && el.tags.leisure === 'park')
    .map((g: any) => ({ type: 'Feature', geometry: g.geometry, properties: g.tags }));

  return {
    buildings: {
      features: buildings
    },
    roads: { features: roads },
    greenAreas: {
      features: greenAreas
    }
  };
}
