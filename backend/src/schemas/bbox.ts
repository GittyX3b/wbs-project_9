import { z } from 'zod';

export const bboxSchema = z.tuple([
  z.number().refine(num => num >= -180 && num <= 180, {
    message: 'Longitude must be between -180 and 180'
  }),
  z.number().refine(num => num >= -90 && num <= 90, {
    message: 'Latitude must be between -90 and 90'
  }),
  z.number().refine(num => num >= -180 && num <= 180, {
    message: 'Longitude must be between -180 and 180'
  }),
  z.number().refine(num => num >= -90 && num <= 90, {
    message: 'Latitude must be between -90 and 90'
  })
]);
