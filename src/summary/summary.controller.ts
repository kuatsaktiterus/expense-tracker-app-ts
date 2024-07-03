import { Controller, Get, HttpCode } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { WebResponse } from '../model/web.model';
import { Auth } from '../common/auth.decorator';

@Controller('api/v1/summaries')
export class SummaryController {
  constructor(private prismaService: PrismaService) {}

  @Get()
  @HttpCode(200)
  async get(@Auth() user: User): Promise<WebResponse<SummaryResponse>> {
    const summary = await this.prismaService.summary.findFirst({
      where: { id_user: user.id },
    });

    return {
      data: summary,
    };
  }
}

type SummaryResponse = {
  id: string;
  incomes_total: number;
  expenses_total: number;
  incomes_count: number;
  expenses_count: number;
  id_user: string;
};
