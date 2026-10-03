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
import { TransactionService } from "../service/transaction.service";
import { TransactionQueryDto } from "../dto/transaction/transaction-query.dto";
import { CreateTransactionDto } from "../dto/transaction/create-transaction.dto";
import { UpdateTransactionStatusDto } from "../dto/transaction/update-status.dto";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { TRANSACTION_ROUTES } from "../router/transaction.router";
@ApiTags("Transactions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(TRANSACTION_ROUTES.BASE)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Get(TRANSACTION_ROUTES.GET_TRANSACTIONS.path) getTransactions(
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionService.getTransactions(query);
  }
  @Get(TRANSACTION_ROUTES.GET_TRANSACTION_STATS.path) getTransactionStats() {
    return this.transactionService.getTransactionStats();
  }
  @Get(TRANSACTION_ROUTES.GET_TRANSACTION_BY_ID.path) getTransactionById(
    @Param("id", ParseIntPipe) id: number,
  ) {
    return this.transactionService.getTransactionById(id);
  }
  @Post(TRANSACTION_ROUTES.CREATE_TRANSACTION.path) createTransaction(
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionService.createTransaction(dto);
  }
  @Patch(TRANSACTION_ROUTES.UPDATE_TRANSACTION_STATUS.path)
  updateTransactionStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionStatusDto,
  ) {
    return this.transactionService.updateTransactionStatus(id, dto);
  }
}
