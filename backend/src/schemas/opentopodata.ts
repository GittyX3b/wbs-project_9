import { z } from 'zod';

export const opentopodataSchema = z.object({
  results: z.array(
    z.object({
      elevation: z.number(),
      location: z.object({
        lat: z.number(),
        lng: z.number()
      })
    })
  )
});
