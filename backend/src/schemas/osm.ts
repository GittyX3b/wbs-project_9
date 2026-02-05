import { z } from 'zod';

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
