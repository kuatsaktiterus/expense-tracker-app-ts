import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';

@Module({
  providers: [IncomeService],
  controllers: [IncomeController],
})
export class IncomeModule {}
