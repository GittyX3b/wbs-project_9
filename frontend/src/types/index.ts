import { z } from 'zod';

/* ───────── Session-Context ──────────── */

export type SessionContextType = {
  locationform: LocationFormType;
  dispatchLocationForm: React.Dispatch<LocationFormActionType>;
  responsedata: ResponseDataType;
  dispatchResponseData: React.Dispatch<ResponseDataActionType>;
};

/* ───────── Location-Form ────────────── */

export const LocationFormMaskSchema = z.enum(['address', 'coordinates']);

export const LocationFormInputsSchema = z.object({
  street: z.string().nullable(),
  house: z.string().nullable(),
  city: z.string().nullable(),
  postcode: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

export const LocationFormSchema = z.object({
  mask: LocationFormMaskSchema,
  inputs: LocationFormInputsSchema,
  pending: z.boolean(),
  success: z.boolean(),
});

export const LocationFormActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('SET_MASK'),
    payload: LocationFormMaskSchema,
  }),
  z.object({
    type: z.literal('UPDATE_DATA'),
    payload: LocationFormInputsSchema,
  }),
  z.object({
    type: z.literal('SET_PENDING'),
    payload: z.boolean(),
  }),
  z.object({
    type: z.literal('SET_SUCCESS'),
    payload: z.boolean(),
  }),
]);

export type LocationFormInputsType = z.infer<typeof LocationFormInputsSchema>;
export type LocationFormMaskType = z.infer<typeof LocationFormMaskSchema>;
export type LocationFormType = z.infer<typeof LocationFormSchema>;
export type LocationFormActionType = z.infer<typeof LocationFormActionSchema>;

/* ───────── Respnse-Data ─────────────── */

// TODO: update schemas before rollout

const geoFeatureCollectionsSchema = z.object({
  type: z.literal('FeatureCollection'),
  features: z.any(),
});

export const PoisSchema = z.object({
  restaurant: geoFeatureCollectionsSchema,
  cafe: geoFeatureCollectionsSchema,
  museum: geoFeatureCollectionsSchema,
  theatre: geoFeatureCollectionsSchema,
  bus_stop: geoFeatureCollectionsSchema,
});

export const ResponseDataSchema = z.object({
  zoneId: z.string().nullable(),
  layers: z.object({
    buildings: geoFeatureCollectionsSchema,
    roads: geoFeatureCollectionsSchema,
    green: geoFeatureCollectionsSchema,
    water: geoFeatureCollectionsSchema,
    pois: PoisSchema.optional(),
  }),

  elevation: z.number().nullable(),
  weather: z.record(z.string(), z.any()),
  aiText: z.string().nullable(),
});

export const MapLayerSchema = ResponseDataSchema.shape.layers.partial();

export const ResponseDataActionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('SET_DATA'),
    payload: ResponseDataSchema,
  }),
  z.object({
    type: z.literal('UPDATE_LAYERS'),
    payload: MapLayerSchema,
  }),
]);

export type ResponseDataType = z.infer<typeof ResponseDataSchema>;
export type ResponseDataActionType = z.infer<typeof ResponseDataActionSchema>;
