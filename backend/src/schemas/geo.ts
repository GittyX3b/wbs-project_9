import { z } from 'zod/v4';
import { Types } from 'mongoose';

export const geoFeatureSchema = z.object({
  type: 'Feature',
  geometry: {
    type: z.enum(['Polygon', 'LineString']),
    coordinates: z.array(z.tuple([z.number(), z.number()]))
  },
  properties: z.record(z.string(), z.any())
});

export const geoFeatureCollectionsSchema = z.object({
  features: z.array(geoFeatureSchema)
});

export const geoResponseSchema = z.object({
  zoneId: z.instanceof(Types.ObjectId),
  layers: {
    buildings: geoFeatureCollectionsSchema,
    roads: geoFeatureCollectionsSchema,
    greenAreas: geoFeatureCollectionsSchema,
    water: geoFeatureCollectionsSchema
  },
  elevation: z.number().nullable(),
  weather: {
    temperature: z.number().nullable()
  },
  aiText: z.string().nullable()
});
