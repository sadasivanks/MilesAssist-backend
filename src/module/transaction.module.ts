import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "../entity/transaction.entity";
import { User } from "../entity/user.entity";
import { TransactionController } from "../controller/transaction.controller";
import { TransactionService } from "../service/transaction.service";
@Module({
  imports: [TypeOrmModule.forFeature([Transaction, User])],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
