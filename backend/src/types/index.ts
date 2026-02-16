import { z } from 'zod/v4';
import type {
  zoneInputSchema,
  geoResponseSchema,
  geoFeatureSchema,
  geoFeatureCollectionsSchema,
  geoLayersSchema,
  osmElementsSchema,
  opentopodataSchema,
  osmElementSchema,
  openMeteoSchema,
  aiToolsPromptBodySchema,
  promptBodySchema,
  bboxSchema,
  poiSchema,
  cacheEntrySchema
} from '#schemas';
import e from 'cors';

export type ZoneInputDTO = z.infer<typeof zoneInputSchema>;

export type GeoFeature = z.infer<typeof geoFeatureSchema>;

export type GeoFeatureCollection = z.infer<typeof geoFeatureCollectionsSchema>;

export type GeoLayers = z.infer<typeof geoLayersSchema>;

export type GeoResponseDTO = z.infer<typeof geoResponseSchema>;

export type OsmElement = z.infer<typeof osmElementSchema>;

export type OsmElements = z.infer<typeof osmElementsSchema>;

export type Opentopodata = z.infer<typeof opentopodataSchema>;

export type openMeteoDTO = z.infer<typeof openMeteoSchema>;

export type aiToolsIncomingPrompt = z.infer<typeof aiToolsPromptBodySchema>;
export type PromptBody = z.infer<typeof promptBodySchema>;

export type BBox = z.infer<typeof bboxSchema>;

export type PoiType = z.infer<typeof poiSchema>;

export type CacheEntry = z.infer<typeof cacheEntrySchema>;
