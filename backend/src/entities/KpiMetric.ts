import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Warehouse } from './Warehouse';

@Entity()
export class KpiMetric {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'enum',
    enum: ['delivery_speed', 'return_rate', 'vehicle_utilization', 'inventory_turnover', 'order_accuracy', 'cost_per_order'],
    default: 'delivery_speed'
  })
  type!: 'delivery_speed' | 'return_rate' | 'vehicle_utilization' | 'inventory_turnover' | 'order_accuracy' | 'cost_per_order';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value!: number;

  @Column({ type: 'text', nullable: true })
  unit?: string; // hours, %, km, etc.

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  target?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minThreshold?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxThreshold?: number;

  @Column({
    type: 'enum',
    enum: ['excellent', 'good', 'average', 'poor', 'critical'],
    default: 'average'
  })
  performance!: 'excellent' | 'good' | 'average' | 'poor' | 'critical';

  @Column({ type: 'date' })
  measurementDate!: Date;

  @Column({ type: 'text', nullable: true })
  period?: string; // daily, weekly, monthly, yearly

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Warehouse, { nullable: true })
  warehouse?: Warehouse;

  @Column({ nullable: true })
  warehouseId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
