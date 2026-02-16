import { z } from 'zod';

export const cacheEntrySchema = z.object({
  data: z.unknown(),
  expiresAt: z.number()
});
