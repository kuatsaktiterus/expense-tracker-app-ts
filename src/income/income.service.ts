import { User } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { IncomeResponse, InsertIncomeRequest } from '../model/income.model';
import { IncomeValidation } from './income.validation';
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

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
}
