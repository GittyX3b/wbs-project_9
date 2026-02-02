import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from 'zod/v4';
import { z } from 'zod/v4';


export function validateQuestionZod(zodSchema: ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { data, error, success } = zodSchema.safeParse(req.body);

    if (!success) {
      next(new Error(z.prettifyError(error), { cause: 400 }));
    } else {
      req.body = data;
      next();
    }
  };
}
export default validateQuestionZod;