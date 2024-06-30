import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import {
  ExpenseResponse,
  InsertExpenseRequest,
  ListExpenseRequest,
} from '../model/expense.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/v1/expenses')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) { }

  @Post()
  @HttpCode(200)
  async insert(
    @Auth() user: User,
    @Body() request: InsertExpenseRequest,
  ): Promise<WebResponse<ExpenseResponse>> {
    const result = await this.expenseService.insert(user, request);

    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Auth() user: User,
    @Body() request: ListExpenseRequest,
  ): Promise<WebResponse<ExpenseResponse[]>> {
    request.page = request.page || 1;
    request.size = request.size || 10;
    const result = await this.expenseService.list(user, request);

    return result;
  }

  @Get('/:id')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('id') id: string,
  ): Promise<WebResponse<ExpenseResponse>> {
    const result = await this.expenseService.get(user, id);

    return {
      data: result,
    };
  }
}
