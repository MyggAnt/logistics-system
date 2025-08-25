import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Vehicle } from './Vehicle';

@Entity()
export class GpsTracker {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  trackerId!: string; // GPS-001, GPS-002, etc.

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

  @Column({ type: 'text', nullable: true })
  imei?: string;

  @Column({ type: 'text', nullable: true })
  simCardNumber?: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'maintenance', 'error', 'low_battery'],
    default: 'active'
  })
  status!: 'active' | 'inactive' | 'maintenance' | 'error' | 'low_battery';

  @Column({ type: 'decimal', precision: 3, scale: 1, nullable: true })
  batteryLevel?: number; // в процентах

  @Column({ type: 'timestamp', nullable: true })
  lastSignalTime?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lastLatitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  lastLongitude?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  lastAltitude?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  lastSpeed?: number; // км/ч

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  lastHeading?: number; // градусы

  @Column({ type: 'int', nullable: true })
  signalStrength?: number; // в дБм

  @Column({ type: 'int', nullable: true })
  updateInterval?: number; // в секундах

  @Column({ type: 'boolean', default: false })
  isMoving?: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastMovementTime?: Date;

  @Column({ type: 'text', nullable: true })
  currentLocation?: string; // адрес

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Связи
  @ManyToOne(() => Vehicle, { nullable: true })
  vehicle?: Vehicle;

  @Column({ nullable: true })
  vehicleId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
