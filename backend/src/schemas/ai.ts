import { z } from 'zod';

export const promptBodySchema = z.object({
  areaKm2: z.number(),
  buildingDensity: z.number().nullable(),
  roadDensity: z.number().nullable(),
  greenCoverage: z.number().nullable(),
  waterCoverage: z.number().nullable(),
  riverLengthKm: z.number(),
  elevation: z.number(),
  temperature: z.number(),
  humidity: z.number()
});

export const aiSummarySchema = z.object({
  response: z.string()
});
