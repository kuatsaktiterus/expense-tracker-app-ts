import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { ExpenseModule } from './expense/expense.module';
import { IncomeModule } from './income/income.module';

@Module({
  imports: [CommonModule, UserModule, ExpenseModule, IncomeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
