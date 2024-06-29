import { Module } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { UserController } from "../user/user.controller";
import { ExpenseService } from "./expense.service";
import { ExpenseController } from "./expense.controller";

@Module({
  providers: [ExpenseService],
  controllers: [ExpenseController]
})
export class ExpenseModule { }
