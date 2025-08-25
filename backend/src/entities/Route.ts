import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Vehicle } from './Vehicle';
import { Warehouse } from './Warehouse';
import { RoutePoint } from './RoutePoint';

@Entity()
export class Route {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  routeId!: string; // ROUTE-001, ROUTE-002, etc.

  @Column()
  name!: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'enum',
    enum: ['planning', 'active', 'completed', 'cancelled'],
    default: 'planning'
  })
  status!: 'planning' | 'active' | 'completed' | 'cancelled';

  @Column({ type: 'date' })
  plannedStartDate!: Date;

  @Column({ type: 'date', nullable: true })
  actualStartDate?: Date;

  @Column({ type: 'date' })
  plannedEndDate!: Date;

  @Column({ type: 'date', nullable: true })
  actualEndDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalDistance?: number; // in km

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedDuration?: number; // in hours

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualDuration?: number; // in hours

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedFuelConsumption?: number; // in liters

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualFuelConsumption?: number; // in liters

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCost?: number;

  @Column({ type: 'text', nullable: true })
  trafficConditions?: string;

  @Column({ type: 'text', nullable: true })
  weatherConditions?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Vehicle, { nullable: true })
  vehicle?: Vehicle;

  @Column({ nullable: true })
  vehicleId?: number;

  @ManyToOne(() => Warehouse)
  startWarehouse!: Warehouse;

  @Column()
  startWarehouseId!: number;

  @ManyToOne(() => Warehouse)
  endWarehouse!: Warehouse;

  @Column()
  endWarehouseId!: number;

  @OneToMany(() => RoutePoint, point => point.route)
  points?: RoutePoint[];

  @OneToMany(() => Vehicle, vehicle => vehicle.currentRoute)
  vehicles?: Vehicle[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
