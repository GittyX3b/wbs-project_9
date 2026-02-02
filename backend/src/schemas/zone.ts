import { z } from 'zod/v4';

export const zoneInputSchema = z.strictObject({
  coordinates: z.object({
    lat: z
      .number({ error: 'Latitude must be a number' })
      .min(-90, { message: 'Latitude must be >= -90' })
      .max(90, { message: 'Latitude must be <= 90' }),
    lon: z
      .number({ error: 'Longitude must be a number' })
      .min(-180, { message: 'Longitude must be >= -180' })
      .max(180, { message: 'Longitude must be <= 180' })
  })
});
