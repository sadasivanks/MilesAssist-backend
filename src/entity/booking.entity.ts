import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum BookingStatus { PENDING = 'PENDING', ACTIVE = 'ACTIVE', COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED' }

@Entity('bookings')
@Index(['status', 'serviceDate'])
export class Booking {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ name: 'booking_id', unique: true, length: 40 }) bookingId!: string;
  @Column({ name: 'user_id' }) userId!: number;
  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'RESTRICT' }) @JoinColumn({ name: 'user_id' }) user!: User;
  @Column({ length: 150 }) service!: string;
  @Column({ name: 'service_date', type: 'timestamptz' }) serviceDate!: Date;
  @Column() duration!: number;
  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING }) status!: BookingStatus;
  @Column({ type: 'numeric', precision: 14, scale: 2 }) amount!: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}
