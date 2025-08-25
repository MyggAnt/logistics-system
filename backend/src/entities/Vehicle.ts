import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Order } from './Order';
import { LogisticBatch } from './LogisticBatch';
import { Route } from './Route';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  vehicleId!: string; // VEH-001, VEH-002, etc.

  @Column()
  plateNumber!: string;

  @Column()
  model!: string;

  @Column()
  brand!: string;

  @Column({ type: 'int' })
  year!: number;

  @Column({ type: 'int' })
  capacity!: number; // in kg

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  volumeCapacity?: number; // in cubic meters

  @Column({
    type: 'enum',
    enum: ['truck', 'van', 'trailer', 'container', 'railway', 'aircraft', 'vessel'],
    default: 'truck'
  })
  type!: 'truck' | 'van' | 'trailer' | 'container' | 'railway' | 'aircraft' | 'vessel';

  @Column({
    type: 'enum',
    enum: ['available', 'in_use', 'maintenance', 'out_of_service', 'loading', 'unloading'],
    default: 'available'
  })
  status!: 'available' | 'in_use' | 'maintenance' | 'out_of_service' | 'loading' | 'unloading';

  @Column({ nullable: true })
  driverName?: string;

  @Column({ nullable: true })
  driverPhone?: string;

  @Column({ nullable: true })
  driverLicense?: string;

  @Column({ type: 'date' })
  lastMaintenance!: Date;

  @Column({ type: 'date' })
  nextMaintenance!: Date;

  @Column({ type: 'int', default: 100 })
  fuelLevel!: number; // percentage

  @Column({ type: 'int', default: 0 })
  mileage!: number; // in km

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentLatitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  currentLongitude?: number;

  @Column({ type: 'timestamp', nullable: true })
  lastGpsUpdate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageSpeed?: number; // km/h

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fuelConsumption?: number; // liters per 100 km

  @Column({ type: 'text', nullable: true })
  currentLocation?: string;

  @Column({ type: 'text', nullable: true })
  destination?: string;

  @Column({ type: 'date', nullable: true })
  estimatedArrival?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Route, { nullable: true })
  currentRoute?: Route;

  @Column({ nullable: true })
  currentRouteId?: number;

  @OneToMany(() => Order, order => order.vehicle)
  orders?: Order[];

  @OneToMany(() => LogisticBatch, batch => batch.vehicle)
  logisticBatches?: LogisticBatch[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
