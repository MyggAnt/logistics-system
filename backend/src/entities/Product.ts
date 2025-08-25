import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './Order';
import { Warehouse } from './Warehouse';
import { ProductLocation } from './ProductLocation';
import { ProductBatch } from './ProductBatch';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column()
  sku!: string;

  @Column({ type: 'int', default: 0 })
  quantity!: number;

  @Column({ type: 'int', default: 0 })
  reservedQuantity!: number;

  @Column({ type: 'int', default: 0 })
  availableQuantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight?: number; // in kg

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  volume?: number; // in cubic meters

  @Column({ type: 'text', nullable: true })
  barcode?: string;

  @Column({ type: 'text', nullable: true })
  qrCode?: string;

  @Column({ type: 'text', nullable: true })
  rfidTag?: string;

  @Column({
    type: 'enum',
    enum: ['A', 'B', 'C'],
    default: 'B'
  })
  abcClassification!: 'A' | 'B' | 'C';

  @Column({
    type: 'enum',
    enum: ['X', 'Y', 'Z'],
    default: 'Y'
  })
  xyzClassification!: 'X' | 'Y' | 'Z';

  @Column({ type: 'boolean', default: false })
  isPerishable!: boolean;

  @Column({ type: 'int', nullable: true })
  shelfLifeDays?: number;

  @Column({ type: 'boolean', default: false })
  requiresRefrigeration!: boolean;

  @Column({ type: 'boolean', default: false })
  isHazardous!: boolean;

  @Column({ type: 'text', nullable: true })
  category?: string;

  @Column({ type: 'text', nullable: true })
  brand?: string;

  @Column({ type: 'text', nullable: true })
  manufacturer?: string;

  @Column({ type: 'text', nullable: true })
  countryOfOrigin?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minStockLevel?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxStockLevel?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Warehouse, { nullable: true })
  warehouse?: Warehouse;

  @Column({ nullable: true })
  warehouseId?: number;

  @ManyToMany(() => Order, order => order.products)
  orders!: Order[];

  @OneToMany(() => ProductLocation, location => location.product)
  locations?: ProductLocation[];

  @OneToMany(() => ProductBatch, batch => batch.product)
  batches?: ProductBatch[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}