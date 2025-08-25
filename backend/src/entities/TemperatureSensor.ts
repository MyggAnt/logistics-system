import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Vehicle } from './Vehicle';
import { Warehouse } from './Warehouse';

@Entity()
export class TemperatureSensor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  sensorId!: string; // TEMP-001, TEMP-002, etc.

  @Column()
  name!: string;

  @Column('text')
  description?: string;

  @Column()
  model!: string;

  @Column()
  manufacturer!: string;

  @Column({ type: 'text', nullable: true })
  serialNumber?: string;

  @Column({
    type: 'enum',
    enum: ['cargo_area', 'engine', 'refrigerator', 'external', 'driver_cabin'],
    default: 'cargo_area'
  })
  location!: 'cargo_area' | 'engine' | 'refrigerator' | 'external' | 'driver_cabin';

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'maintenance', 'error', 'calibration_needed'],
    default: 'active'
  })
  status!: 'active' | 'inactive' | 'maintenance' | 'error' | 'calibration_needed';

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  currentTemperature!: number; // текущая температура в °C

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  minTemperature?: number; // минимальная температура

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxTemperature?: number; // максимальная температура

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  targetTemperature?: number; // целевая температура

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidity?: number; // влажность в %

  @Column({ type: 'int', nullable: true })
  updateInterval?: number; // интервал обновления в секундах

  @Column({ type: 'timestamp' })
  lastReadingTime!: Date;

  @Column({ type: 'boolean', default: false })
  isAlert!: boolean; // есть ли предупреждение

  @Column({ type: 'text', nullable: true })
  alertMessage?: string; // сообщение предупреждения

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  batteryLevel?: number; // уровень заряда в %

  @Column({ type: 'text', nullable: true })
  calibrationDate?: string; // дата последней калибровки

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Связи
  @ManyToOne(() => Vehicle, { nullable: true })
  vehicle?: Vehicle;

  @Column({ nullable: true })
  vehicleId?: number;

  @ManyToOne(() => Warehouse, { nullable: true })
  warehouse?: Warehouse;

  @Column({ nullable: true })
  warehouseId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
