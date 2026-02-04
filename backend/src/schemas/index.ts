import { z } from 'zod/v4';
import { Types } from 'mongoose';

export * from './question.ts';
export * from './zone.ts';

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
    greenAreas: geoFeatureCollectionsSchema
  },
  elevation: {
    avg: z.number()
  },
  weather: {
    temperature: z.number()
  },
  aiText: z.string()
});

export const osmElementSchema = z.object({
  type: z.enum(['way', 'node', 'relation']),
  id: z.number(),
  tags: z.record(z.string(), z.string()).optional(),
  geometry: z
    .array(
      z.object({
        lat: z.number(),
        lon: z.number()
      })
    )
    .optional()
});

export const osmElementsSchema = z.object({
  elements: z.array(osmElementSchema)
});

export const opentopodataSchema = z.object({
  results: z.array(
    z.object({
      elevation: z.number(),
      location: z.object({
        lat: z.number(),
        lng: z.number()
      })
    })
  )
});
