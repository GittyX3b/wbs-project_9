import { z } from 'zod';

export const promptBodySchema = z.object({
  buildingCount: z.number(),
  greenCount: z.number(),
  roadCount: z.number(),
  waterCount: z.number(),
  elevation: z.number()
});

export const aiSummarySchema = z.object({
  response: z.string()
});
