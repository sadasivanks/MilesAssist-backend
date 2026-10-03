import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Booking } from './booking.entity';
import { Transaction } from './transaction.entity';

export enum UserRole { VIEWER = 'Viewer', EDITOR = 'Editor', ADMIN = 'Admin' }
export enum UserStatus { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }

@Entity('users')
@Index(['status', 'createdAt'])
export class User {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 120 }) name!: string;
  @Column({ unique: true, length: 180 }) email!: string;
  @Column({ length: 30, nullable: true }) phone?: string;
  @Column({ type: 'enum', enum: UserRole, default: UserRole.VIEWER }) role!: UserRole;
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE }) status!: UserStatus;
  @Column({ name: 'last_active_at', type: 'timestamptz', nullable: true }) lastActiveAt?: Date;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true }) deletedAt?: Date;
  @OneToMany(() => Transaction, (transaction) => transaction.user) transactions!: Transaction[];
  @OneToMany(() => Booking, (booking) => booking.user) bookings!: Booking[];
}
