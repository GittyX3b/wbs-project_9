import { z } from 'zod';

export const promptBodySchema = z.object({
  buildingDensity: z.number(),
  greenToBuildingRatio: z.number().nullable(),
  roadToBuildingRatio: z.number().nullable(),
  waterAreaKm2: z.number(),
  riverLengthKm: z.number(),
  restaurantCount: z.number(),
  fastFoodCount: z.number(),
  cafeCount: z.number(),
  supermarketCount: z.number(),
  elevation: z.number(),
  temperature: z.number(),
  humidity: z.number()
});

export const aiSummarySchema = z.object({
  response: z.string()
});
