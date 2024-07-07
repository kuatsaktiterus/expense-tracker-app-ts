import { Injectable } from '@nestjs/common';
import { Expense, Income, User } from '@prisma/client';
import { PrismaService } from '../common/prisma.service';
import { SummaryResponse } from './summary.model';

@Injectable()
export class SummaryService {
  constructor(private prismaService: PrismaService) {}

  async get(user: User): Promise<SummaryResponse> {
    const summary = await this.prismaService.summary.findFirst({
      where: { id_user: user.id },
    });

    return summary;
  }
}
