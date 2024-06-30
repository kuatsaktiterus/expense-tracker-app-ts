import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Expense, User } from '@prisma/client';
import {
  ExpenseResponse,
  InsertExpenseRequest,
  ListExpenseRequest,
} from '../model/expense.model';
import { expenseValidation } from './expense.validation';
import { WebResponse } from '../model/web.model';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class ExpenseService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationServide: ValidationService,
  ) { }

  async insert(
    user: User,
    request: InsertExpenseRequest,
  ): Promise<ExpenseResponse> {
    const insertExpense = this.validationServide.validate(
      expenseValidation.INSERT,
      request,
    );

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
    };
  }

  async list(user: User, request: ListExpenseRequest,
  ): Promise<WebResponse<ExpenseResponse[]>> {
    this.logger.debug(`expenseService.list(${request.size} ${request.page})`);
    const listRequest = this.validationServide.validate(
      expenseValidation.LIST,
      request,
    );

    const skip = (listRequest.page - 1) * listRequest.size;

    const [totalOfExpenses, expenses] = await this.prismaService.$transaction([
      this.prismaService.expense.count(),
      this.prismaService.expense.findMany({
        where: { id_user: user.id },
        skip: skip,
        take: listRequest.size,
      }),
    ]);

    this.logger.debug(`${expenses}, skip ${skip}`);

    return {
      data: expenses.map((expense) => this.toExpenseResponse(expense)),
      paging: {
        size: listRequest.size,
        total_page: Math.ceil(totalOfExpenses / listRequest.size),
        current_page: listRequest.page,
      },
    };
  }

  toExpenseResponse(expense: Expense): ExpenseResponse {
    return {
      id: expense.id,
      expense: expense.expense,
      expense_name: expense.expense_name,
      date_of_expense: expense.date_of_expense,
      id_user: expense.id_user,
    };
  }

  async get(user: User, idExpense: string): Promise<ExpenseResponse> {
    return this.prismaService.expense.findUnique({
      where: {
        id: idExpense,
        user: {
          id: user.id,
        }
      },
    });
  }
}
