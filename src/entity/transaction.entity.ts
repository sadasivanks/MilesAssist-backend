import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum TransactionType { PAYMENT = 'PAYMENT', REFUND = 'REFUND', TRANSFER = 'TRANSFER' }
export enum TransactionStatus { PENDING = 'PENDING', COMPLETED = 'COMPLETED', FAILED = 'FAILED', REFUNDED = 'REFUNDED', CANCELLED = 'CANCELLED' }

@Entity('transactions')
@Index(['status', 'createdAt'])
@Index(['transactionDate'])
export class Transaction {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ name: 'transaction_id', unique: true, length: 40 }) transactionId!: string;
  @Column({ name: 'user_id' }) userId!: number;
  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'RESTRICT' }) @JoinColumn({ name: 'user_id' }) user!: User;
  @Column({ type: 'enum', enum: TransactionType }) type!: TransactionType;
  @Column({ type: 'numeric', precision: 14, scale: 2 }) amount!: string;
  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING }) status!: TransactionStatus;
  @Column({ name: 'transaction_date', type: 'timestamptz' }) transactionDate!: Date;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}
