import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { Expense, Income, Summary, User } from '@prisma/client';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteIncome();
    await this.deleteExpense();
    await this.deleteSummary();
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: {
          contains: 'test',
        },
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        password: await bcrypt.hash('test', 10),
        token: 'test',
      },
    });
  }

  async getUser(): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: { username: 'test' },
    });
  }

  async deleteExpense() {
    await this.prismaService.expense.deleteMany();
  }

  async createExpense() {
    const user = await this.getUser();
    await this.prismaService.expense.create({
      data: {
        expense: 3000000,
        expense_name: 'test expense',
        date_of_expense: new Date('2024-01-01'),
        id_user: user.id,
      },
    });
  }

  async getExpense(): Promise<Expense> {
    return await this.prismaService.expense.findFirst({
      where: { expense_name: 'test expense' },
    });
  }

  async deleteIncome() {
    await this.prismaService.income.deleteMany();
  }

  async createIncome(income?: number) {
    const user = await this.getUser();
    await this.prismaService.income.create({
      data: {
        income: income || 3000000,
        income_name: 'test income',
        date_of_income: new Date('2024-01-01'),
        id_user: user.id,
      },
    });
  }

  async getIncome(): Promise<Income> {
    return await this.prismaService.income.findFirst({
      where: { income_name: 'test income' },
    });
  }

  async deleteSummary() {
    await this.prismaService.summary.deleteMany();
  }

  async createSummary() {
    const user = await this.getUser();
    await this.prismaService.summary.create({
      data: {
        incomes_total: 10000000,
        incomes_count: 10,
        expenses_total: 2000000,
        expenses_count: 30,
        id_user: user.id,
      },
    });
  }

  async getSummary(): Promise<Summary> {
    const user = await this.getUser();
    return await this.prismaService.summary.findFirst({
      where: { id_user: user.id },
    });
  }
}
