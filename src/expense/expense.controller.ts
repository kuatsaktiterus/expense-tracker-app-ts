import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { ExpenseResponse, InsertExpenseRequest } from "../model/expense.model";
import { WebResponse } from "../model/web.model";

@Controller('/api/v1/expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) { }

  @Post()
  @HttpCode(200)
  async insert(
    @Auth() user: User,
    @Body() request: InsertExpenseRequest
  ): Promise<WebResponse<ExpenseResponse>> {
    const result = await this.expenseService.insertExpense(user, request);

    return {
      data: result
    }
  }
}
