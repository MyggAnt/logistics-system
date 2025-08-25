import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  warehouseId!: string; // WH-001, WH-002, etc.

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

  @Column({
    type: 'enum',
    enum: ['distribution_center', 'hypermarket', 'warehouse', 'cross_dock'],
    default: 'warehouse'
  })
  type!: 'distribution_center' | 'hypermarket' | 'warehouse' | 'cross_dock';

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  })
  status!: 'active' | 'inactive' | 'maintenance';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalCapacity?: number; // in cubic meters

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  usedCapacity?: number; // in cubic meters

  @Column({ type: 'text', nullable: true })
  contactPerson?: string;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  email?: string;

  @Column({ type: 'text', nullable: true })
  operatingHours?: string;

  @Column({ type: 'boolean', default: true })
  hasRefrigeration!: boolean;

  @Column({ type: 'boolean', default: false })
  hasHazardousStorage!: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Warehouse, { nullable: true })
  parentWarehouse?: Warehouse;

  @Column({ nullable: true })
  parentWarehouseId?: number;

  @OneToMany(() => Order, order => order.sourceWarehouse)
  sourceOrders?: Order[];

  @OneToMany(() => Order, order => order.destinationWarehouse)
  destinationOrders?: Order[];

  @OneToMany(() => Product, product => product.warehouse)
  products?: Product[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
