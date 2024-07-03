import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Income } from '@prisma/client';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class SummaryCalc {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async calculateCreatedIncomesTotal(income: Income) {
    let id: string;
    let newIncome: number;
    const summary = await this.prismaService.summary.findFirst({
      where: { id_user: income.id_user },
    });

    if (!summary) {
      newIncome = income.income;
      id = '';
    } else {
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

  async calculateUpdatedIncomesTotal(income: Income, newIncome: number) {
    const summary = await this.prismaService.summary.findFirst({
      where: { id_user: income.id_user },
    });

    const calculateIncomesTotal = this.calculateIncomesTotal(
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

  calculateIncomesTotal(
    income: number,
    newIncome: number,
    incomesTotal: number,
  ): number {
    let updatedIncome = newIncome - income;
    updatedIncome = incomesTotal + updatedIncome;

    return updatedIncome;
  }
}
