import { z } from 'zod';

export const promptBodySchema = z.object({
  buildingCount: z.number(),
  greenAreas: z.number(),
  roadCount: z.number(),
  water: z.number(),
  elevation: z.number()
});

export const aiSummarySchema = z.object({
  response: z.string()
});
