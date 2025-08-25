import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Inventory } from './Inventory';
import { Product } from './Product';
import { ProductLocation } from './ProductLocation';

@Entity()
export class InventoryItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  expectedQuantity!: number;

  @Column({ type: 'int', nullable: true })
  actualQuantity?: number;

  @Column({ type: 'int', default: 0 })
  difference!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  expectedValue?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  actualValue?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  differenceValue?: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'counted', 'verified', 'discrepancy'],
    default: 'pending'
  })
  status!: 'pending' | 'counted' | 'verified' | 'discrepancy';

  @Column({ type: 'timestamp', nullable: true })
  countedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  discrepancyReason?: string;

  @ManyToOne(() => Inventory)
  inventory!: Inventory;

  @Column()
  inventoryId!: number;

  @ManyToOne(() => Product)
  product!: Product;

  @Column()
  productId!: number;

  @ManyToOne(() => ProductLocation, { nullable: true })
  location?: ProductLocation;

  @Column({ nullable: true })
  locationId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
