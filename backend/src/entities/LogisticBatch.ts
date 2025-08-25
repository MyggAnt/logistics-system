import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './Order';
import { Vehicle } from './Vehicle';
import { Warehouse } from './Warehouse';

@Entity()
export class LogisticBatch {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  batchId!: string; // BATCH-001, BATCH-002, etc.

  @Column()
  name!: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'enum',
    enum: ['planning', 'forming', 'ready', 'in_transit', 'delivered', 'cancelled'],
    default: 'planning'
  })
  status!: 'planning' | 'forming' | 'ready' | 'in_transit' | 'delivered' | 'cancelled';

  @Column({ type: 'date' })
  plannedDepartureDate!: Date;

  @Column({ type: 'date', nullable: true })
  actualDepartureDate?: Date;

  @Column({ type: 'date', nullable: true })
  plannedDeliveryDate?: Date;

  @Column({ type: 'date', nullable: true })
  actualDeliveryDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalWeight?: number; // in kg

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalVolume?: number; // in cubic meters

  @Column({ type: 'int', nullable: true })
  totalPallets?: number;

  @Column({ type: 'int', nullable: true })
  totalPackages?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalValue?: number;

  @Column({ type: 'text', nullable: true })
  route?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Warehouse, { nullable: true })
  sourceWarehouse?: Warehouse;

  @Column({ nullable: true })
  sourceWarehouseId?: number;

  @ManyToOne(() => Warehouse, { nullable: true })
  destinationWarehouse?: Warehouse;

  @Column({ nullable: true })
  destinationWarehouseId?: number;

  @ManyToOne(() => Vehicle, { nullable: true })
  vehicle?: Vehicle;

  @Column({ nullable: true })
  vehicleId?: number;

  @OneToMany(() => Order, order => order.logisticBatch)
  orders?: Order[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
