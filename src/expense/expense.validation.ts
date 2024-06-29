import { z, ZodType } from "zod";

export class expenseValidation {
  static readonly INSERT: ZodType = z.object({
    expense: z.number().positive(),
    expense_name: z.string().min(1).max(255),
    date_of_expense: z.coerce.date(),
  });
}
