import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { Auth } from '../common/auth.decorator';
import {
  IncomeResponse,
  InsertIncomeRequest,
  ListIncomeRequest,
} from '../model/income.model';
import { WebResponse } from '../model/web.model';
import { IncomeService } from './income.service';

@Controller('/api/v1/incomes')
export class IncomeController {
  constructor(private incomeService: IncomeService) {}

  @Post()
  @HttpCode(200)
  async post(
    @Auth() user: User,
    @Body() request: InsertIncomeRequest,
  ): Promise<WebResponse<IncomeResponse>> {
    const result = await this.incomeService.insert(user, request);

    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async list(
    @Auth() user: User,
    @Body() request: ListIncomeRequest,
  ): Promise<WebResponse<IncomeResponse[]>> {
    request.page = request.page || 1;
    request.size = request.size || 10;

    const result = await this.incomeService.list(user, request);

    return result;
  }
}
