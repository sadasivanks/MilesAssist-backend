import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { Transaction, TransactionStatus } from "../entity/transaction.entity";
import { Booking, BookingStatus } from "../entity/booking.entity";
import { DashboardAlert, AlertStatus } from "../entity/dashboard-alert.entity";
import { DashboardRange } from "../dto/dashboard/chart-query.dto";
import { success } from "../common/utils/response";
@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(DashboardAlert)
    private readonly alertRepository: Repository<DashboardAlert>,
  ) {}
  async getDashboardStats() {
    const [users, revenue, bookings, pending, recent] = await Promise.all([
      this.userRepository
        .createQueryBuilder("user")
        .select("COUNT(*)", "total")
        .addSelect(
          `COUNT(*) FILTER (WHERE user.createdAt >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND user.createdAt < DATE_TRUNC('month', CURRENT_DATE))`,
          "previousMonth",
        )
        .getRawOne(),
      this.getRevenueSummary(),
      this.bookingRepository
        .createQueryBuilder("booking")
        .select(`COUNT(*) FILTER (WHERE booking.status = 'ACTIVE')`, "active")
        .addSelect(
          `COUNT(*) FILTER (WHERE booking.status = 'ACTIVE' AND booking.createdAt >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND booking.createdAt < DATE_TRUNC('month', CURRENT_DATE))`,
          "previousActive",
        )
        .getRawOne(),
      this.transactionRepository
        .createQueryBuilder("transaction")
        .select(
          `COUNT(*) FILTER (WHERE transaction.status = 'PENDING')`,
          "pending",
        )
        .addSelect(
          `COUNT(*) FILTER (WHERE transaction.status = 'PENDING' AND transaction.transactionDate >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND transaction.transactionDate < DATE_TRUNC('month', CURRENT_DATE))`,
          "previousPending",
        )
        .getRawOne(),
      this.transactionRepository
        .createQueryBuilder("transaction")
        .leftJoin("transaction.user", "user")
        .select([
          'transaction.transactionId AS "transactionId"',
          'user.name AS "userName"',
          'transaction.amount AS "amount"',
          'transaction.status AS "status"',
          'transaction.transactionDate AS "date"',
        ])
        .orderBy("transaction.transactionDate", "DESC")
        .limit(10)
        .getRawMany(),
    ]);
    return success({
      kpis: {
        totalUsers: {
          value: Number(users.total),
          changePercent: this.percentChange(
            Number(users.total),
            Number(users.previousMonth),
          ),
        },
        totalRevenue: {
          value: Number(revenue.totalRevenue).toFixed(2),
          changePercent: revenue.changePercent,
        },
        activeBookings: {
          value: Number(bookings.active),
          changePercent: this.percentChange(
            Number(bookings.active),
            Number(bookings.previousActive),
          ),
        },
        pendingTransactions: {
          value: Number(pending.pending),
          changePercent: this.percentChange(
            Number(pending.pending),
            Number(pending.previousPending),
          ),
        },
      },
      recentTransactions: recent.map((item: any) => ({
        ...item,
        amount:
          (item.status === TransactionStatus.REFUNDED ? "-" : "") +
          Number(item.amount).toFixed(2),
      })),
    });
  }
  async getRevenueChart(range: DashboardRange = DashboardRange.MONTH_6) {
    const months =
      range === DashboardRange.YEAR_1
        ? 12
        : range === DashboardRange.MONTH_3
          ? 3
          : range === DashboardRange.MONTH_1
            ? 1
            : 6;
    const rows = await this.transactionRepository
      .createQueryBuilder("transaction")
      .select("DATE_TRUNC('month', transaction.transactionDate)", "period")
      .addSelect(
        `COALESCE(SUM(CASE WHEN transaction.status = 'REFUNDED' OR transaction.type = 'REFUND' THEN -transaction.amount ELSE transaction.amount END),0)`,
        "revenue",
      )
      .where("transaction.status IN (:...statuses)", {
        statuses: [TransactionStatus.COMPLETED, TransactionStatus.REFUNDED],
      })
      .andWhere(
        `transaction.transactionDate >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '${months - 1} months'`,
      )
      .groupBy("period")
      .orderBy("period", "ASC")
      .getRawMany();
    const map = new Map<string, string>();
    for (const row of rows)
      map.set(
        new Date(row.period).toISOString().slice(0, 7),
        Number(row.revenue).toFixed(2),
      );
    const labels: string[] = [];
    const data: string[] = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1),
      );
      const key = date.toISOString().slice(0, 7);
      labels.push(
        date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
      );
      data.push(map.get(key) ?? "0.00");
    }
    return success({ range, labels, datasets: [{ label: "Revenue", data }] });
  }
  async getDashboardAlerts() {
    const alerts = await this.alertRepository.find({
      where: { status: AlertStatus.ACTIVE },
      order: { createdAt: "DESC" },
      take: 10,
    });
    return success(alerts);
  }
  private async getRevenueSummary() {
    const row = await this.transactionRepository
      .createQueryBuilder("transaction")
      .select(
        `COALESCE(SUM(CASE WHEN transaction.status = 'REFUNDED' OR transaction.type = 'REFUND' THEN -transaction.amount ELSE transaction.amount END),0)`,
        "totalRevenue",
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN (transaction.status = 'REFUNDED' OR transaction.type = 'REFUND') THEN -transaction.amount ELSE transaction.amount END) FILTER (WHERE transaction.transactionDate >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND transaction.transactionDate < DATE_TRUNC('month', CURRENT_DATE)),0)`,
        "previousRevenue",
      )
      .where("transaction.status IN (:...statuses)", {
        statuses: [TransactionStatus.COMPLETED, TransactionStatus.REFUNDED],
      })
      .getRawOne();
    const current = Number(row.totalRevenue);
    const previous = Number(row.previousRevenue);
    return {
      totalRevenue: current,
      changePercent:
        previous === 0
          ? 0
          : Number(
              (
                ((Math.abs(current) - Math.abs(previous)) /
                  Math.abs(previous)) *
                100
              ).toFixed(1),
            ),
    };
  }
  private percentChange(current: number, previous: number) {
    if (previous === 0) return current === 0 ? 0 : 100;
    return Number(
      (((current - previous) / Math.abs(previous)) * 100).toFixed(1),
    );
  }
}
