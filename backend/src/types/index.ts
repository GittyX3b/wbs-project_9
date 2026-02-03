import { z } from 'zod/v4';
import type { zoneInputSchema } from '#schemas';
import { Types } from 'mongoose';

export type ZoneInputDTO = z.infer<typeof zoneInputSchema>;

export type GeoFeature = {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'LineString';
    coordinates: [number, number][];
  };
  properties: Record<string, any>;
};

export type GeoFeatureCollections = {
  features: GeoFeature[];
};

export type GeoResponseDTO = {
  zoneId: Types.ObjectId;
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

export type Opentopodata = {
  results: {
    elevation: number;
    location: {
      lat: number;
      lng: number;
    };
  }[];
};
