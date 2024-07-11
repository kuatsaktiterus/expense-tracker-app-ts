import { Controller, Get, HttpCode } from '@nestjs/common';
import { User } from '@prisma/client';
import { WebResponse } from '../model/web.model';
import { Auth } from '../common/auth.decorator';
import { SummaryResponse } from './summary.model';
import { SummaryService } from './summary.service';

@Controller('api/v1/summaries')
export class SummaryController {
  constructor(private summaryService: SummaryService) {}

  @Get()
  @HttpCode(200)
  async get(@Auth() user: User): Promise<WebResponse<SummaryResponse>> {
    const summary = await this.summaryService.get(user);
    return {
      data: summary,
    };
  }
}
