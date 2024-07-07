import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Expense, Income } from '@prisma/client';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class SummaryCalc {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async calculateCreatedIncomesTotal(income: Income) {
    let id: string = '';
    let newIncome: number = income.income;
    const summary = await this.prismaService.summary.findFirst({
      where: { id_user: income.id_user },
    });

    if (summary) {
      newIncome = income.income + (summary.incomes_total || 0);
      id = summary.id;
    }

    await this.prismaService.summary.upsert({
      where: { id_user: income.id_user },
      update: {
        incomes_total: newIncome,
        incomes_count: { increment: 1 },
      },
      create: {
        incomes_total: newIncome,
        incomes_count: 1,
        id_user: income.id_user,
      },
    });
  }

  async calculateCreatedExpensesTotal(expense: Expense) {
    let id: string = '';
    let newExpense: number = expense.expense;
    const summary = await this.prismaService.summary.findFirst({
      where: { id_user: expense.id_user },
    });

    if (summary) {
      newExpense = expense.expense + (summary.expenses_total || 0);
      id = summary.id;
    }

    await this.prismaService.summary.upsert({
      where: { id_user: expense.id_user },
      update: {
        expenses_total: newExpense,
        expenses_count: { increment: 1 },
      },
      create: {
        expenses_total: newExpense,
        expenses_count: 1,
        id_user: expense.id_user,
      },
    });
  }

  async calculateUpdatedIncomesTotal(income: Income, newIncome: number) {
    const summary = await this.prismaService.summary.findFirst({
      where: { id_user: income.id_user },
    });

    const calculateIncomesTotal = this.calculateTotal(
      income.income,
      newIncome,
      summary.incomes_total,
    );

    this.logger.debug(
      `summaryCalc.calculateUpdatedIncomesTotal(${calculateIncomesTotal})`,
    );

    await this.prismaService.summary.update({
      where: { id: summary.id },
      data: {
        incomes_total: calculateIncomesTotal,
      },
    });
  }

  async calculateUpdatedExpensesTotal(expense: Expense, newExpense: number) {
    const summary = await this.prismaService.summary.findFirst({
      where: { id_user: expense.id_user },
    });

    const calculateExpensesTotal = this.calculateTotal(
      expense.expense,
      newExpense,
      summary.expenses_total,
    );

    await this.prismaService.summary.update({
      where: { id: summary.id },
      data: {
        expenses_total: calculateExpensesTotal,
      },
    });
  }

  async calculateDeletedIncomesTotal(income: Income) {
    const summary = await this.prismaService.summary.findFirst({
      where: { id_user: income.id_user },
    });

    const calculateIncomesTotal = summary.incomes_total - income.income;

    await this.prismaService.summary.update({
      where: { id: summary.id },
      data: {
        incomes_total: calculateIncomesTotal,
        incomes_count: { decrement: 1 },
      },
    });
  }

  async calculateDeletedExpensesTotal(expense: Expense) {
    const summary = await this.prismaService.summary.findFirst({
      where: { id_user: expense.id_user },
    });

    const calculateExpensesTotal = summary.expenses_total - expense.expense;

    await this.prismaService.summary.update({
      where: { id: summary.id },
      data: {
        expenses_total: calculateExpensesTotal,
        expenses_count: { decrement: 1 },
      },
    });
  }

  calculateTotal(
    lastValue: number,
    newValue: number,
    valuesTotal: number,
  ): number {
    let updatedValue = newValue - lastValue;
    updatedValue = valuesTotal + updatedValue;

    return updatedValue;
  }
}
