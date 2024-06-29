import { Injectable } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { User } from "@prisma/client";
import { ExpenseResponse, InsertExpenseRequest } from "../model/expense.model";
import { expenseValidation } from "./expense.validation";

@Injectable()
export class ExpenseService {
  constructor(
    private prismaService: PrismaService,
    private validationServide: ValidationService,
  ) { }

  async insertExpense(user: User, request: InsertExpenseRequest): Promise<ExpenseResponse> {
    const insertExpense = this.validationServide.validate(expenseValidation.INSERT, request);

    const expense = await this.prismaService.expense.create({
      data: {
        ...insertExpense,
        ...{ id_user: user.id },
      },
    });

    return {
      id: expense.id,
      expense: expense.expense,
      expense_name: expense.expense_name,
      date_of_expense: expense.date_of_expense,
      id_user: expense.id_user,
    }
  }
}
