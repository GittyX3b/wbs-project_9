import { z } from 'zod';

export const poiSchema = z.enum(['restaurant', 'cafe', 'bar', 'museum', 'theatre', 'cinema', 'bus_station', 'library']);
