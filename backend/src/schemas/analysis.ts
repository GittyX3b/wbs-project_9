import { z } from 'zod/v4';
import { Types } from 'mongoose';

export const analysisInputSchema = z.strictObject({
  bbox: z
    .array(z.number({ error: 'Bounding box must contain only numbers' }))
    .length(4, { message: 'Bounding box must have exactly 4 numbers' }),
  coordinates: z.object({
    lat: z.number({ error: 'Latitude must be a number' }),
    lon: z.number({ error: 'Longitude must be a number' })
  }),
  metrics: z
    .object({
      populationDensity: z.number({ error: 'Population density must be a number' }).optional(),
      greenSpace: z.number({ error: 'Green space must be a number' }).optional(),
      elevation: z.number({ error: 'Elevation must be a number' }).optional(),
      temperature: z.number({ error: 'Temperature must be a number' }).optional(),
      precipitation: z.number({ error: 'Precipitation must be a number' }).optional()
    })
    .optional(),
  aiText: z.string({ error: 'AI text must be a string' }).optional()
});

export const analysisSchema = z.strictObject({
  _id: z.instanceof(Types.ObjectId),
  ...analysisInputSchema.shape,
  createdAt: z.date(),
  updatedAt: z.date(),
  __v: z.number()
});
