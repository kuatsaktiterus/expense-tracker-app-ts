import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [CommonModule, UserModule, ExpenseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
