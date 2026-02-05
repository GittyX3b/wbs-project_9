import { z } from 'zod/v4';
import type {
  zoneInputSchema,
  geoResponseSchema,
  geoFeatureSchema,
  osmElementsSchema,
  opentopodataSchema,
  osmElementSchema
} from '#schemas';

export type ZoneInputDTO = z.infer<typeof zoneInputSchema>;

export type GeoFeature = z.infer<typeof geoFeatureSchema>;

export type GeoResponseDTO = z.infer<typeof geoResponseSchema>;

export type OsmElement = z.infer<typeof osmElementSchema>;

export type OsmElements = z.infer<typeof osmElementsSchema>;

export type Opentopodata = z.infer<typeof opentopodataSchema>;
