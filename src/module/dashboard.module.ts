import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Transaction } from "../entity/transaction.entity";
import { Booking } from "../entity/booking.entity";
import { DashboardAlert } from "../entity/dashboard-alert.entity";
import { DashboardController } from "../controller/dashboard.controller";
import { DashboardService } from "../service/dashboard.service";
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Transaction, Booking, DashboardAlert]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
