import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction, TransactionStatus } from "../entity/transaction.entity";
import { User } from "../entity/user.entity";
import { CreateTransactionDto } from "../dto/transaction/create-transaction.dto";
import { UpdateTransactionStatusDto } from "../dto/transaction/update-status.dto";
import { TransactionQueryDto } from "../dto/transaction/transaction-query.dto";
import { success } from "../common/utils/response";
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async getTransactions(query: TransactionQueryDto) {
    const allowed: Record<string, string> = {
      transactionId: "transaction.transactionId",
      transactionDate: "transaction.transactionDate",
      amount: "transaction.amount",
      status: "transaction.status",
      createdAt: "transaction.createdAt",
    };
    const qb = this.transactionRepository
      .createQueryBuilder("transaction")
      .leftJoinAndSelect("transaction.user", "user")
      .select([
        "transaction.id",
        "transaction.transactionId",
        "transaction.type",
        "transaction.amount",
        "transaction.status",
        "transaction.transactionDate",
        "user.id",
        "user.name",
        "user.email",
      ]);
    if (query.search)
      qb.andWhere(
        "(transaction.transactionId ILIKE :search OR user.name ILIKE :search OR user.email ILIKE :search)",
        { search: `%${query.search}%` },
      );
    if (query.status)
      qb.andWhere("transaction.status=:status", { status: query.status });
    if (query.type) qb.andWhere("transaction.type=:type", { type: query.type });
    if (query.dateFrom)
      qb.andWhere("transaction.transactionDate>=:dateFrom", {
        dateFrom: query.dateFrom,
      });
    if (query.dateTo)
      qb.andWhere("transaction.transactionDate<=:dateTo", {
        dateTo: query.dateTo,
      });
    if (query.amountMin)
      qb.andWhere("transaction.amount>=:amountMin", {
        amountMin: query.amountMin,
      });
    if (query.amountMax)
      qb.andWhere("transaction.amount<=:amountMax", {
        amountMax: query.amountMax,
      });
    qb.orderBy(
      allowed[query.sortBy ?? "transactionDate"] ?? allowed.transactionDate,
      query.sortOrder,
    );
    const [transactions, total] = await qb
      .skip((query.page - 1) * query.limit)
      .take(query.limit)
      .getManyAndCount();
    return success(transactions, {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit),
    });
  }
  async getTransactionById(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ["user"],
    });
    if (!transaction) throw new NotFoundException("Transaction not found");
    return success(transaction);
  }
  async createTransaction(dto: CreateTransactionDto) {
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) throw new NotFoundException("User not found");
    const transaction = this.transactionRepository.create({
      ...dto,
      status: dto.status ?? TransactionStatus.PENDING,
      transactionId: `TXN-${Date.now()}`,
      transactionDate: new Date(dto.transactionDate),
    });
    return success(await this.transactionRepository.save(transaction));
  }
  async updateTransactionStatus(id: number, dto: UpdateTransactionStatusDto) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    });
    if (!transaction) throw new NotFoundException("Transaction not found");
    transaction.status = dto.status;
    return success(await this.transactionRepository.save(transaction));
  }
  async getTransactionStats() {
    const row = await this.transactionRepository
      .createQueryBuilder("transaction")
      .select("COUNT(*)", "totalTransactions")
      .addSelect("COALESCE(SUM(transaction.amount),0)", "totalVolume")
      .addSelect("COALESCE(AVG(transaction.amount),0)", "averageTransaction")
      .addSelect(
        `COUNT(*) FILTER (WHERE transaction.status = 'PENDING')`,
        "pendingTransactions",
      )
      .getRawOne();
    return success({
      totalTransactions: Number(row.totalTransactions),
      totalVolume: Number(row.totalVolume).toFixed(2),
      averageTransaction: Number(row.averageTransaction).toFixed(2),
      pendingTransactions: Number(row.pendingTransactions),
    });
  }
}
