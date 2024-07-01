import { z, ZodType } from 'zod';

export class IncomeValidation {
  static readonly INSERT: ZodType = z.object({
    income: z.number().positive(),
    income_name: z.string().min(1).max(255),
    date_of_income: z.coerce.date(),
  });

  static readonly LIST: ZodType = z.object({
    page: z.number().positive(),
    size: z.number().positive(),
  });
}
