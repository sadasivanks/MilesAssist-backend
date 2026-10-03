import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Booking } from "../entity/booking.entity";
import { User } from "../entity/user.entity";
import { BookingController } from "../controller/booking.controller";
import { BookingService } from "../service/booking.service";
@Module({
  imports: [TypeOrmModule.forFeature([Booking, User])],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
