import { z, ZodType } from 'zod';

export class ExpenseValidation {
  static readonly INSERT: ZodType = z.object({
    expense: z.number().positive(),
    expense_name: z.string().min(1).max(255),
    date_of_expense: z.coerce.date(),
  });

  static readonly LIST: ZodType = z.object({
    page: z.number().positive().min(1).max(100),
    size: z.number().positive().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string(),
    expense: z.number().positive(),
    expense_name: z.string().min(1).max(255),
    date_of_expense: z.coerce.date(),
  });
}
