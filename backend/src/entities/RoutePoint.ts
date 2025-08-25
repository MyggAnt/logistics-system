import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Route } from './Route';
import { Warehouse } from './Warehouse';

@Entity()
export class RoutePoint {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  sequenceNumber!: number; // порядковый номер точки в маршруте

  @Column()
  name!: string;

  @Column('text')
  address!: string;

  @Column()
  city!: string;

  @Column()
  country!: string;

  @Column()
  postalCode!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  longitude!: number;

  @Column({
    type: 'enum',
    enum: ['pickup', 'delivery', 'transit', 'rest', 'fuel', 'customs'],
    default: 'delivery'
  })
  type!: 'pickup' | 'delivery' | 'transit' | 'rest' | 'fuel' | 'customs';

  @Column({ type: 'date', nullable: true })
  plannedArrival?: Date;

  @Column({ type: 'date', nullable: true })
  actualArrival?: Date;

  @Column({ type: 'date', nullable: true })
  plannedDeparture?: Date;

  @Column({ type: 'date', nullable: true })
  actualDeparture?: Date;

  @Column({ type: 'int', nullable: true })
  plannedDuration?: number; // в минутах

  @Column({ type: 'int', nullable: true })
  actualDuration?: number; // в минутах

  @Column({ type: 'text', nullable: true })
  contactPerson?: string;

  @Column({ type: 'text', nullable: true })
  contactPhone?: string;

  @Column({ type: 'text', nullable: true })
  specialInstructions?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Route)
  route!: Route;

  @Column()
  routeId!: number;

  @ManyToOne(() => Warehouse, { nullable: true })
  warehouse?: Warehouse;

  @Column({ nullable: true })
  warehouseId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
