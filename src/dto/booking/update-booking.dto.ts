import { IsDateString, IsEnum, IsInt, IsNumberString, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { BookingStatus } from '../../entity/booking.entity';
export class UpdateBookingDto { @IsOptional() @IsInt() @Min(1) userId?: number; @IsOptional() @IsString() @MaxLength(150) service?: string; @IsOptional() @IsDateString() serviceDate?: string; @IsOptional() @IsInt() @Min(1) duration?: number; @IsOptional() @IsEnum(BookingStatus) status?: BookingStatus; @IsOptional() @IsNumberString() amount?: string; }
