import { z } from 'zod';

const osmTagsSchema = z.record(z.string(), z.string());

const osmPointSchema = z.object({
  lat: z.number(),
  lon: z.number()
});

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
  geometry: z.array(osmPointSchema),
  tags: osmTagsSchema.optional()
});

const osmRelationSchema = z.object({
  type: z.literal('relation'),
  id: z.number(),
  members: z.array(
    z.object({
      type: z.enum(['node', 'way', 'relation']),
      ref: z.number(),
      role: z.string(),
      geometry: z.array(osmPointSchema).optional()
    })
  ),
  tags: osmTagsSchema.optional()
});

export const osmElementSchema = z.discriminatedUnion('type', [osmNodeSchema, osmWaySchema, osmRelationSchema]);

export const osmElementsSchema = z.object({
  elements: z.array(osmElementSchema)
});
