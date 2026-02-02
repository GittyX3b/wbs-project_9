import { z } from 'zod/v4';
import type { zoneInputSchema } from '#schemas';

export type ZoneInputDTO = z.infer<typeof zoneInputSchema>;

export type GeoFeatureCollections = {
  features: {
    type: 'Feature';
    geometry: any;
    properties: Record<string, any>;
  }[];
};

export type GeoResponseDTO = {
  layers: {
    buildings: GeoFeatureCollections;
    roads: GeoFeatureCollections;
    greenAreas: GeoFeatureCollections;
  };
  elevation: {
    avg: number;
  };
  weather: {
    temperature: number;
  };
  aiText: string;
};
