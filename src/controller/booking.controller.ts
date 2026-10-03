import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { BookingService } from "../service/booking.service";
import { BookingQueryDto } from "../dto/booking/booking-query.dto";
import { CreateBookingDto } from "../dto/booking/create-booking.dto";
import { UpdateBookingDto } from "../dto/booking/update-booking.dto";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { BOOKING_ROUTES } from "../router/booking.router";
@ApiTags("Bookings")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(BOOKING_ROUTES.BASE)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Get(BOOKING_ROUTES.GET_BOOKINGS.path) getBookings(
    @Query() query: BookingQueryDto,
  ) {
    return this.bookingService.getBookings(query);
  }
  @Get(BOOKING_ROUTES.GET_BOOKING_STATS.path) getBookingStats() {
    return this.bookingService.getBookingStats();
  }
  @Get(BOOKING_ROUTES.GET_BOOKING_BY_ID.path) getBookingById(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.bookingService.getBookingById(id);
  }
  @Post(BOOKING_ROUTES.CREATE_BOOKING.path) createBooking(
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingService.createBooking(dto);
  }
  @Patch(BOOKING_ROUTES.UPDATE_BOOKING.path) updateBooking(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(id, dto);
  }
}
