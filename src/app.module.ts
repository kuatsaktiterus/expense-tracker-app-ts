import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';
import { SummaryModule } from './summary/summary.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    ExpenseModule,
    IncomeModule,
    SummaryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
