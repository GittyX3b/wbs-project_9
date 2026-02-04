import { fetchOsmData, fetchElevation } from '#services';
import type { ZoneInputDTO, GeoFeature, GeoResponseDTO, OsmElements, OsmElement } from '#types';
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

  //Fix lat/lon to 4 decimal places to standardize zone coordinates
  const latFixed = Math.round(lat * 10000) / 10000;
  const lonFixed = Math.round(lon * 10000) / 10000;

  const bbox = getBBox(latFixed, lonFixed, 0.5); // 0.5 km radius for 1 km diameter

  console.log('Calculated BBox:', bbox);

  try {
    const existingZone = await Zone.findOne({ coordinates: { lat: latFixed, lon: lonFixed } });

    const osmPromise = fetchOsmData(bbox);
    const elevationPromise = existingZone
      ? Promise.resolve(existingZone.stats?.avgElevation ?? 0)
      : fetchElevation(latFixed, lonFixed);

    const [osmData, elevationAvg] = await Promise.all([osmPromise, elevationPromise]);

    //Extract layers from OSM data
    const { buildings, roads, greenAreas } = getLayers(osmData);

    // Save zone data if it doesn't exist
    let zone = existingZone;
    if (!zone) {
      zone = new Zone();
      zone.bbox = bbox;
      zone.coordinates = { lat: latFixed, lon: lonFixed };
      zone.stats = {
        buildingCount: buildings.features.length,
        parkCount: greenAreas.features.length,
        roadCount: roads.features.length,
        avgElevation: elevationAvg
      };
      zone.aiText = 'Sample AI-generated text about the area.';

      await zone.save();
    }

    res.json({
      zoneId: zone._id,
      layers: {
        buildings,
        roads,
        greenAreas
      },
      elevation: { avg: elevationAvg },
      weather: { temperature: 22 }, // Mocked weather data
      aiText: 'Sample AI-generated text about the area.' // Mocked AI text
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message, { cause: { status: 504 } });
    }
    throw new Error('Unknown error occurred while fetching geographical data.');
  }
};

/** Extract layers from OSM data in GEOJson format */
function getLayers(osmData: OsmElements) {
  // Filter and transform OSM data into GeoJSON feature collections
  const features = osmData.elements.filter((el: OsmElement) => el.type === 'way' && el.geometry);
  const layers = {
    buildings: { type: 'FeatureCollection', features: [] as GeoFeature[] },
    roads: { type: 'FeatureCollection', features: [] as GeoFeature[] },
    greenAreas: { type: 'FeatureCollection', features: [] as GeoFeature[] }
  };

  features.forEach((f: any) => {
    const isBuilding = f.tags && f.tags.building;
    const isPark = f.tags && f.tags.leisure === 'park';

    const geometryType = isBuilding || isPark ? 'Polygon' : 'LineString';

    const newFeature = {
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
