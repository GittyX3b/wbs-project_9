import { z } from 'zod/v4';

export const zoneInputSchema = z.strictObject({
  coordinates: z.object({
    lat: z.number({ error: 'Latitude must be a number' }),
    lon: z.number({ error: 'Longitude must be a number' })
  })
});
