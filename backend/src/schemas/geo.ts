import { z } from 'zod/v4';
import { Types } from 'mongoose';

const positionSchema = z.tuple([z.number(), z.number()]);

const lineStringGeometrySchema = z.object({
  type: z.literal('LineString'),
  coordinates: z.array(positionSchema)
});

const polygonGeometrySchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(positionSchema))
});

const pointGeometrySchema = z.object({
  type: z.literal('Point'),
  coordinates: positionSchema
});

export const geoFeatureSchema = z.object({
  type: z.literal('Feature'),
  geometry: z.union([lineStringGeometrySchema, polygonGeometrySchema, pointGeometrySchema]),
  properties: z.record(z.string(), z.any())
});

export const geoFeatureCollectionsSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.array(geoFeatureSchema)
});

export const geoLayersSchema = z.object({
  buildings: geoFeatureCollectionsSchema,
  roads: geoFeatureCollectionsSchema,
  green: geoFeatureCollectionsSchema,
  water: geoFeatureCollectionsSchema
});

export const geoResponseSchema = z.object({
  zoneId: z.instanceof(Types.ObjectId),
  layers: geoLayersSchema,
  elevation: z.number().nullable(),
  weather: z.record(z.string(), z.any()),
  aiText: z.string().nullable()
});
