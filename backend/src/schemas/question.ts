import { z } from 'zod/v4';
import { Types } from 'mongoose';
 
export const questionInputSchema = z
  .object({
    question: z.string({ error: 'Question must be a string' }).min(1, {
      message: 'Question is required'
    }),
    answer: z.string({ error: 'Answer must be a string' }).min(1, {
      message: 'Answer is required'
    })
  })
  .strict();
 
export const questionSchema = z
  .object({
    _id: z.instanceof(Types.ObjectId),
    ...questionInputSchema.shape,
    createdAt: z.date()
  })
  .strict();