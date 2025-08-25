import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './Product';
import { Warehouse } from './Warehouse';

@Entity()
export class ProductLocation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  locationCode!: string; // A-01-01-01 (Zone-Aisle-Rack-Level)

  @Column()
  zone!: string; // A, B, C, etc.

  @Column()
  aisle!: string; // 01, 02, 03, etc.

  @Column()
  rack!: string; // 01, 02, 03, etc.

  @Column()
  level!: string; // 01, 02, 03, etc.

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  capacity?: number; // in cubic meters

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  usedCapacity?: number; // in cubic meters

  @Column({ type: 'int', nullable: true })
  maxPallets?: number;

  @Column({ type: 'int', nullable: true })
  currentPallets?: number;

  @Column({
    type: 'enum',
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  })
  status!: 'available' | 'occupied' | 'reserved' | 'maintenance';

  @Column({ type: 'boolean', default: false })
  hasRefrigeration!: boolean;

  @Column({ type: 'boolean', default: false })
  isHazardousStorage!: boolean;

  @Column({ type: 'text', nullable: true })
  specialRequirements?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Product, { nullable: true })
  product?: Product;

  @Column({ nullable: true })
  productId?: number;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column()
  warehouseId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
