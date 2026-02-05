import { fetchOsmData, fetchElevation, generateAiText, openMeteo } from '#services';
import type { ZoneInputDTO, GeoResponseDTO } from '#types';
import { type RequestHandler } from 'express';
import { getBBox, getLayers } from '#utils';
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
      ? Promise.resolve(existingZone.stats?.elevation ?? 0)
      : fetchElevation(latFixed, lonFixed);
    const openMeteoPromise = openMeteo(latFixed, lonFixed);

    const [osmData, elevation, weatherData] = await Promise.all([osmPromise, elevationPromise, openMeteoPromise]);

    //Extract layers from OSM data
    const { buildings, roads, green, water } = getLayers(osmData);

    // Generate AI text and save zone data if it doesn't exist
    let zone = existingZone;
    if (!zone) {
      const coordinates = { lat: latFixed, lon: lonFixed };
      const stats = {
        buildingCount: buildings.features.length,
        greenCount: green.features.length,
        roadCount: roads.features.length,
        waterCount: water.features.length,
        elevation: elevation
      };
      const aiText = await generateAiText(stats);
      zone = await Zone.create({ bbox, coordinates, stats, aiText });
    }

    res.json({
      zoneId: zone._id,
      layers: {
        buildings,
        roads,
        green,
        water
      },
      elevation: elevation,
      weather: {
        time: weatherData.current.time,
        is_day: weatherData.current.is_day,
        temperature: weatherData.current.temperature_2m,
        humidity: weatherData.current.relative_humidity_2m,
        wind_speed: weatherData.current.wind_speed_10m,
        precipitation: weatherData.current.precipitation,
        snowfall: weatherData.current.snowfall,
        max_temp_next7days: weatherData.daily.temperature_2m_max,
        min_temp_next7days: weatherData.daily.temperature_2m_min,
        sunshine_next7days: weatherData.daily.sunshine_duration
      },
      aiText: zone.aiText ?? null
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message, { cause: { status: 504 } });
    }
    throw new Error('Unknown error occurred while fetching geographical data.');
  }
};
