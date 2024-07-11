import ObjectID from 'bson-objectid';
import { z, ZodType } from 'zod';

export class CategoryValidation {
  static readonly INSERT: ZodType = z.object({
    category: z.string().min(1).max(255),
    id_user: z.string(),
  });

  static readonly LIST: ZodType = z.object({
    page: z.number().positive().optional(),
    size: z.number().positive().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    category: z.string().min(1).max(255).optional(),
    id: z.string().refine((data) => ObjectID.isValid(data), {
      message: 'Id is not valid',
    }),
  });

  static readonly GET: ZodType = z.object({
    id: z.string().refine((data) => ObjectID.isValid(data), {
      message: 'Id is not valid',
    }),
  });
}
