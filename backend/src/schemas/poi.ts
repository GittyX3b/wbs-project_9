import { z } from 'zod';

export const poiSchema = z.enum(['restaurant', 'cafe', 'museum', 'theatre', 'bus_stop']);
