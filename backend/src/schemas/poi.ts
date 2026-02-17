import { z } from 'zod';

export const poiSchema = z.enum([
  'restaurant',
  'cafe',
  'museum',
  'theatre',
  'bus_stop',
  'supermarket',
  'park',
  'cinema',
  'kindergarten',
  'school',
  'university',
  'hospital',
  'pharmacy',
  'bank',
  'atm',
  'post_office',
  'library'
]);
