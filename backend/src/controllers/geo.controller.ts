import {
  buildBaseLayersQuery,
  buildPoisQuery,
  fetchElevation,
  fetchOsmData,
  generateGoogleAiText,
  openMeteo
} from '#services';
import type { ZoneInputDTO, GeoResponseDTO, BBox } from '#types';
import { type RequestHandler } from 'express';
import { calculateZoneStats, getBBox, getLayers, getPois } from '#utils';
import { Zone } from '#models';
import { isValidObjectId } from 'mongoose';
import { poiSchema } from '#schemas';

const COORDINATE_PRECISION = 10000;
const BBOX_RADIUS_KM = 1;

/**
 * Get base layers (buildings, roads, green spaces, water) for a specified zone and generate AI text description.
 * @param req - Express request object containing ZoneInputDTO in the body.
 * @param res - Express response object to send GeoResponseDTO.
 */
export const getBaseLayers: RequestHandler<{}, GeoResponseDTO, ZoneInputDTO> = async (req, res) => {
  const { lat, lon } = req.body.coordinates;

  // Fix lat/lon to 4 decimal places to standardize zone coordinates and reduce database duplicates
  const latFixed = Math.round(lat * COORDINATE_PRECISION) / COORDINATE_PRECISION;
  const lonFixed = Math.round(lon * COORDINATE_PRECISION) / COORDINATE_PRECISION;

  const bbox = getBBox(latFixed, lonFixed, BBOX_RADIUS_KM);

  // Check if a zone already exists for these coordinates (within a small tolerance to account for rounding)
  const tolerance = 0.5 / COORDINATE_PRECISION;
  const existingZone = await Zone.findOne({
    'coordinates.lat': { $gte: latFixed - tolerance, $lt: latFixed + tolerance },
    'coordinates.lon': { $gte: lonFixed - tolerance, $lt: lonFixed + tolerance }
  });

  const osmPromise = fetchOsmData(buildBaseLayersQuery(bbox));
  const elevationPromise = existingZone
    ? Promise.resolve(existingZone.stats?.elevation ?? 0)
    : fetchElevation(latFixed, lonFixed);
  const openMeteoPromise = openMeteo(latFixed, lonFixed);

  const [osmData, elevation, weatherData] = await Promise.all([osmPromise, elevationPromise, openMeteoPromise]);

  // Extract layers from OSM data
  const { buildings, roads, green, water } = getLayers(osmData.elements);

  // Generate AI text and save zone data if it doesn't exist
  let zone = existingZone;
  if (!zone) {
    const coordinates = { lat: latFixed, lon: lonFixed };

    const stats = calculateZoneStats({ buildings, roads, green, water }, bbox);

    const aiText = await generateGoogleAiText({
      ...stats,
      elevation,
      temperature: weatherData.current.temperature_2m,
      humidity: weatherData.current.relative_humidity_2m
    });

    zone = await Zone.create({ bbox, coordinates, stats: { ...stats, elevation }, aiText: aiText });
  }

  res.json({
    zoneId: zone._id,
    layers: { buildings, roads, green, water },
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
      min_temp_next7days: weatherData.daily.temperature_2m_min
    },
    aiText: zone.aiText ?? null
  });
};

/**
 * Get points of interest (POIs) for a specified zone.
 * @param req - Express request object with `zoneId` and `types` in the query string.
 * @param res - Express response object returning a JSON payload with `pois`.
 */
export const getPoisByZone: RequestHandler = async (req, res) => {
  const { zoneId, types } = req.query;

  if (!isValidObjectId(zoneId)) throw new Error('Invalid zoneId', { cause: { status: 400 } });
  if (typeof types !== 'string' || !types.trim()) throw new Error('Invalid types', { cause: { status: 400 } });

  const parsedPois = parsePois(types);
  if (parsedPois.length === 0) throw new Error('Invalid types', { cause: { status: 400 } });

  const zone = await Zone.findById(zoneId);
  if (!zone) throw new Error('Zone not found', { cause: { status: 404 } });

  const bbox = zone.bbox as BBox;

  const osmData = await fetchOsmData(buildPoisQuery(bbox, parsedPois));

  const pois = getPois(osmData.elements);

  res.json({ pois });
};

/**
 * Parse pois query parameter into an array of valid pois.
 * @param input - Comma-separated string of pois.
 * @returns Array of valid pois.
 */
function parsePois(input?: string): string[] {
  if (!input) return [];

  const pois = input.split(',');
  const response: string[] = [];

  for (const p of pois) {
    const { data, success } = poiSchema.safeParse(p.trim().toLowerCase());
    if (success) response.push(data);
  }

  return response;
}
