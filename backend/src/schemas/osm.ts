import { z } from 'zod';

const osmTagsSchema = z.record(z.string(), z.string());

export const osmNodeSchema = z.object({
  type: z.literal('node'),
  id: z.number(),
  lat: z.number(),
  lon: z.number(),
  tags: osmTagsSchema.optional()
});

export const osmWaySchema = z.object({
  type: z.literal('way'),
  id: z.number(),
  geometry: z.array(
    z.object({
      lat: z.number(),
      lon: z.number()
    })
  ),
  tags: osmTagsSchema.optional()
});

export const osmElementSchema = z.discriminatedUnion('type', [osmNodeSchema, osmWaySchema]);

export const osmElementsSchema = z.object({
  elements: z.array(osmElementSchema)
});
