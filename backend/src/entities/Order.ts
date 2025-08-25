import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Vehicle } from './Vehicle';
import { Product } from './Product';
import { Warehouse } from './Warehouse';
import { LogisticBatch } from './LogisticBatch';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  orderId!: string; // ORD-001, ORD-002, etc.

  @Column({
    type: 'enum',
    enum: ['internal', 'retail', 'ecommerce', 'procurement'],
    default: 'internal'
  })
  orderType!: 'internal' | 'retail' | 'ecommerce' | 'procurement';

  @Column({
    type: 'enum',
    enum: ['distribution_center', 'hypermarket', 'online_store', 'external_supplier'],
    default: 'hypermarket'
  })
  sourceChannel!: 'distribution_center' | 'hypermarket' | 'online_store' | 'external_supplier';

  @Column()
  customerName!: string;

  @Column('text')
  destination!: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'confirmed', 'processing', 'picking', 'packed', 'shipped', 'in_transit', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  })
  status!: 'pending' | 'confirmed' | 'processing' | 'picking' | 'packed' | 'shipped' | 'in_transit' | 'delivered' | 'cancelled' | 'returned';

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  })
  priority!: 'low' | 'medium' | 'high' | 'urgent';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalAmount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  deliveryCost?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date' })
  estimatedDelivery!: Date;

  @Column({ type: 'date', nullable: true })
  actualDelivery?: Date;

  @Column({ type: 'date', nullable: true })
  orderDate?: Date;

  @Column({ type: 'date', nullable: true })
  processingDate?: Date;

  @Column({ type: 'date', nullable: true })
  shippingDate?: Date;

  @Column({ type: 'text', nullable: true })
  trackingNumber?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: false })
  isUrgent!: boolean;

  @Column({ type: 'boolean', default: false })
  requiresSignature!: boolean;

  @Column({ type: 'text', nullable: true })
  specialInstructions?: string;

  @ManyToOne(() => Vehicle, { nullable: true })
  vehicle?: Vehicle;

  @Column({ nullable: true })
  vehicleId?: number;

  @ManyToOne(() => Warehouse, { nullable: true })
  sourceWarehouse?: Warehouse;

  @Column({ nullable: true })
  sourceWarehouseId?: number;

  @ManyToOne(() => Warehouse, { nullable: true })
  destinationWarehouse?: Warehouse;

  @Column({ nullable: true })
  destinationWarehouseId?: number;

  @ManyToOne(() => LogisticBatch, { nullable: true })
  logisticBatch?: LogisticBatch;

  @Column({ nullable: true })
  logisticBatchId?: number;

  @ManyToMany(() => Product)
  @JoinTable()
  products?: Product[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}