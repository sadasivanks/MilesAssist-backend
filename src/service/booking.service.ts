import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Booking, BookingStatus } from "../entity/booking.entity";
import { User } from "../entity/user.entity";
import { CreateBookingDto } from "../dto/booking/create-booking.dto";
import { UpdateBookingDto } from "../dto/booking/update-booking.dto";
import { BookingQueryDto } from "../dto/booking/booking-query.dto";
import { success } from "../common/utils/response";
@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getBookings(query: BookingQueryDto) {
    const allowed: Record<string, string> = {
      bookingId: "booking.bookingId",
      service: "booking.service",
      serviceDate: "booking.serviceDate",
      amount: "booking.amount",
      status: "booking.status",
      createdAt: "booking.createdAt",
    };
    const qb = this.bookingRepository
      .createQueryBuilder("booking")
      .leftJoinAndSelect("booking.user", "user")
      .select([
        "booking.id",
        "booking.bookingId",
        "booking.service",
        "booking.serviceDate",
        "booking.duration",
        "booking.status",
        "booking.amount",
        "user.id",
        "user.name",
        "user.email",
      ]);
    if (query.search)
      qb.andWhere(
        "(booking.bookingId ILIKE :search OR user.name ILIKE :search OR user.email ILIKE :search)",
        { search: `%${query.search}%` },
      );
    if (query.status)
      qb.andWhere("booking.status=:status", { status: query.status });
    if (query.service)
      qb.andWhere("booking.service ILIKE :service", {
        service: `%${query.service}%`,
      });
    if (query.dateFrom)
      qb.andWhere("booking.serviceDate>=:dateFrom", {
        dateFrom: query.dateFrom,
      });
    if (query.dateTo)
      qb.andWhere("booking.serviceDate<=:dateTo", { dateTo: query.dateTo });
    qb.orderBy(
      allowed[query.sortBy ?? "serviceDate"] ?? allowed.serviceDate,
      query.sortOrder,
    );
    const [bookings, total] = await qb
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();
    return success(bookings, {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    });
  }
  async getBookingById(id: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ["user"],
    });
    if (!booking) throw new NotFoundException("Booking not found");
    return success(booking);
  }
  async createBooking(dto: CreateBookingDto) {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException("User not found");
    const booking = this.bookingRepository.create({
      ...dto,
      serviceDate: new Date(dto.serviceDate),
      bookingId: `BOOK-${Date.now()}`,
      amount: dto.amount,
    });
    return success(await this.bookingRepository.save(booking));
  }
  async updateBooking(id: number, dto: UpdateBookingDto) {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) throw new NotFoundException("Booking not found");
    if (dto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: dto.userId },
      });
      if (!user) throw new NotFoundException("User not found");
    }
    Object.assign(booking, dto);
    if (dto.serviceDate) booking.serviceDate = new Date(dto.serviceDate);
    return success(await this.bookingRepository.save(booking));
  }
  async getBookingStats() {
    const row = await this.bookingRepository
      .createQueryBuilder("booking")
      .select("COUNT(*)", "totalBookings")
      .addSelect(
        `COUNT(*) FILTER (WHERE booking.status = 'ACTIVE')`,
        "activeBookings",
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE booking.status = 'COMPLETED')`,
        "completedBookings",
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE booking.status = 'CANCELLED')`,
        "cancelledBookings",
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE booking.createdAt >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND booking.createdAt < DATE_TRUNC('month', CURRENT_DATE))`,
        "previousMonthBookings",
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE booking.status = 'ACTIVE' AND booking.createdAt >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND booking.createdAt < DATE_TRUNC('month', CURRENT_DATE))`,
        "previousMonthActive",
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE booking.status = 'COMPLETED' AND booking.createdAt >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND booking.createdAt < DATE_TRUNC('month', CURRENT_DATE))`,
        "previousMonthCompleted",
      )
      .getRawOne();
    return success({
      totalBookings: Number(row.totalBookings),
      activeBookings: Number(row.activeBookings),
      completedBookings: Number(row.completedBookings),
      cancelledBookings: Number(row.cancelledBookings),
      changes: {
        totalBookings: this.percentChange(
          Number(row.totalBookings),
          Number(row.previousMonthBookings),
        ),
        activeBookings: this.percentChange(
          Number(row.activeBookings),
          Number(row.previousMonthActive),
        ),
        completedBookings: this.percentChange(
          Number(row.completedBookings),
          Number(row.previousMonthCompleted),
        ),
      },
    });
  }
  private percentChange(current: number, previous: number) {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Number(
      (((current - previous) / Math.abs(previous)) * 100).toFixed(1),
    );
  }
}
