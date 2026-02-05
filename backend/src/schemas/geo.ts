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
    green: geoFeatureCollectionsSchema,
    water: geoFeatureCollectionsSchema
  },
  elevation: z.number().nullable(),
  weather: z.record(z.string(), z.any()),
  aiText: z.string().nullable()
});
