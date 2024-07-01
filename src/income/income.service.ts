import { Income, User } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  IncomeResponse,
  InsertIncomeRequest,
  ListIncomeRequest,
  UpdateIncomeRequest,
} from '../model/income.model';
import { IncomeValidation } from './income.validation';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { WebResponse } from '../model/web.model';

@Injectable()
export class IncomeService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async insert(
    user: User,
    request: InsertIncomeRequest,
  ): Promise<IncomeResponse> {
    this.logger.debug(
      `incomeService.insert(${request.income}, ${request.income_name}, ${request.date_of_income})`,
    );
    const incomeRequest: InsertIncomeRequest = this.validationService.validate(
      IncomeValidation.INSERT,
      request,
    );

    const income = await this.prismaService.income.create({
      data: {
        ...incomeRequest,
        ...{ id_user: user.id },
      },
    });

    return {
      id: income.id,
      income: income.income,
      income_name: income.income_name,
      date_of_income: income.date_of_income,
      id_user: income.id_user,
    };
  }

  async list(
    user: User,
    request: ListIncomeRequest,
  ): Promise<WebResponse<IncomeResponse[]>> {
    const listRequest = this.validationService.validate(
      IncomeValidation.LIST,
      request,
    );

    const skip = (listRequest.page - 1) * listRequest.size;

    const [totalOfIncomes, incomes] = await this.prismaService.$transaction([
      this.prismaService.income.count(),
      this.prismaService.income.findMany({
        where: { id_user: user.id },
        skip: skip,
        take: listRequest.size,
      }),
    ]);

    return {
      data: incomes.map((_) => this.toIncomeResponse(_)),
      paging: {
        size: listRequest.size,
        total_page: Math.ceil(totalOfIncomes / listRequest.size),
        current_page: listRequest.page,
      },
    };
  }

  toIncomeResponse(income: Income): Income {
    return {
      id: income.id,
      income: income.income,
      income_name: income.income_name,
      date_of_income: income.date_of_income,
      id_user: income.id_user,
    };
  }

  async checkIncomeMustExist(user: User, id: string): Promise<Income> {
    const income = await this.prismaService.income.findUnique({
      where: { id: id, id_user: user.id },
    });

    if (!income) throw new HttpException('unauthorized', 401);

    return income;
  }

  async get(user: User, id: string): Promise<IncomeResponse> {
    let income = await this.checkIncomeMustExist(user, id);
    return income;
  }

  async update(
    user: User,
    request: UpdateIncomeRequest,
  ): Promise<IncomeResponse> {
    const incomeRequest: UpdateIncomeRequest = this.validationService.validate(
      IncomeValidation.UPDATE,
      request,
    );

    let income = await this.checkIncomeMustExist(user, incomeRequest.id);

    income = await this.prismaService.income.update({
      where: {
        id: request.id,
        id_user: user.id,
      },
      data: {
        income: incomeRequest.income,
        income_name: incomeRequest.income_name,
        date_of_income: incomeRequest.date_of_income,
      },
    });

    return {
      id: income.id,
      income: income.income,
      income_name: income.income_name,
      date_of_income: income.date_of_income,
      id_user: income.id_user,
    };
  }

  async remove(user: User, id: string) {
    await this.checkIncomeMustExist(user, id);

    this.prismaService.income.delete({
      where: { id: id },
    });

    return;
  }
}
