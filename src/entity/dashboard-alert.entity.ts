import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum AlertStatus { ACTIVE = 'ACTIVE', DISMISSED = 'DISMISSED' }
@Entity('dashboard_alerts')
export class DashboardAlert {
  @PrimaryGeneratedColumn() id!: number;
  @Column({ length: 180 }) title!: string;
  @Column({ length: 180, nullable: true }) action?: string;
  @Column({ type: 'enum', enum: AlertStatus, default: AlertStatus.ACTIVE }) status!: AlertStatus;
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) createdAt!: Date;
}
