import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './Product';
import { Warehouse } from './Warehouse';

@Entity()
export class ProductBatch {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  batchNumber!: string; // BATCH-001, BATCH-002, etc.

  @Column()
  name!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'int', default: 0 })
  reservedQuantity!: number;

  @Column({ type: 'int', default: 0 })
  availableQuantity!: number;

  @Column({ type: 'date' })
  productionDate!: Date;

  @Column({ type: 'date' })
  expiryDate!: Date;

  @Column({ type: 'date', nullable: true })
  bestBeforeDate?: Date;

  @Column({ type: 'text', nullable: true })
  lotNumber?: string;

  @Column({ type: 'text', nullable: true })
  serialNumber?: string;

  @Column({ type: 'text', nullable: true })
  certificateNumber?: string;

  @Column({ type: 'text', nullable: true })
  supplier?: string;

  @Column({ type: 'text', nullable: true })
  manufacturer?: string;

  @Column({ type: 'text', nullable: true })
  countryOfOrigin?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitCost?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalCost?: number;

  @Column({ type: 'text', nullable: true })
  qualityStatus?: string;

  @Column({ type: 'text', nullable: true })
  inspectionNotes?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Product)
  product!: Product;

  @Column()
  productId!: number;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column()
  warehouseId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
