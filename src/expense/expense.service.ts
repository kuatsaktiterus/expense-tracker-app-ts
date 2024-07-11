import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Expense, User } from '@prisma/client';
import {
  ExpenseResponse,
  InsertExpenseRequest,
  ListExpenseRequest,
  updateExpenseRequest,
} from '../model/expense.model';
import { ExpenseValidation } from './expense.validation';
import { WebResponse } from '../model/web.model';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { SummaryCalc } from '../common/summary.calc';

@Injectable()
export class ExpenseService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationServide: ValidationService,
    private summaryCalc: SummaryCalc,
  ) { }

  async insert(
    user: User,
    request: InsertExpenseRequest,
  ): Promise<ExpenseResponse> {
    const insertExpense: InsertExpenseRequest = this.validationServide.validate(
      ExpenseValidation.INSERT,
      request,
    );

    const expense = await this.prismaService.expense.create({
      data: {
        ...insertExpense,
        ...{ id_user: user.id },
      },
    });

    await this.summaryCalc.calculateCreatedExpensesTotal(expense);

    return this.toExpenseResponse(expense);
  }

  async list(
    user: User,
    request: ListExpenseRequest,
  ): Promise<WebResponse<ExpenseResponse[]>> {
    this.logger.debug(`expenseService.list(${request.size} ${request.page})`);
    const listRequest: ListExpenseRequest = this.validationServide.validate(
      ExpenseValidation.LIST,
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
      id_category: expense.id_category,
    };
  }

  async get(user: User, idExpense: string): Promise<ExpenseResponse> {
    return this.prismaService.expense.findUnique({
      where: {
        id: idExpense,
        user: {
          id: user.id,
        },
      },
    });
  }

  async checkExpenseMustValid(
    userId: string,
    expenseId: string,
  ): Promise<Expense> {
    return await this.prismaService.expense.findUnique({
      where: { id: expenseId, user: { id: userId } },
    });
  }

  async update(
    user: User,
    request: updateExpenseRequest,
  ): Promise<ExpenseResponse> {
    this.logger.debug(`expenseService.update(request ${request.id})`);
    const updateRequest: updateExpenseRequest = this.validationServide.validate(
      ExpenseValidation.UPDATE,
      request,
    );

    const oldExpense = await this.checkExpenseMustValid(
      user.id,
      updateRequest.id,
    );

    if (!oldExpense) {
      throw new HttpException('Unauthorized', 401);
    }

    const newExpense = await this.prismaService.expense.update({
      where: { id: oldExpense.id },
      data: {
        expense: updateRequest.expense,
        expense_name: updateRequest.expense_name,
        date_of_expense: updateRequest.date_of_expense,
        id_category: updateRequest.id_category
      },
    });

    await this.summaryCalc.calculateUpdatedExpensesTotal(
      oldExpense,
      newExpense.expense,
    );

    return newExpense;
  }

  async remove(user: User, id: string) {
    const expense = await this.checkExpenseMustValid(user.id, id);

    if (!expense) throw new HttpException('Unauthorized', 401);

    await this.prismaService.expense.delete({
      where: { id: id },
    });

    await this.summaryCalc.calculateDeletedExpensesTotal(expense);

    return;
  }
}
