import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum AdminStatus { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 120 }) name!: string;
  @Column({ unique: true, length: 180 }) email!: string;
  @Column({ name: 'password_hash', length: 255, select: false }) passwordHash!: string;
  @Column({ type: 'enum', enum: AdminStatus, default: AdminStatus.ACTIVE }) status!: AdminStatus;
  @Column({ length: 30, default: 'ADMIN' }) role!: string;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) updatedAt!: Date;
}
