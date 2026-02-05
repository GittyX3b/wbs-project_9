import { z } from 'zod';

export const openMeteoSchema = z.object({
  current: z.object({
    time: z.date(),
    temperature_2m: z.number(),
    relative_humidity_2m: z.number(),
    precipitation: z.number(),
    wind_speed_10m: z.number(),
    snowfall: z.number(),
    is_day: z.boolean()
  }),
  daily: z.object({
    time: z.array(z.date()),
    temperature_2m_max: z.array(z.number()),
    temperature_2m_min: z.array(z.number()),
    sunshine_duration: z.array(z.number())
  })
});
