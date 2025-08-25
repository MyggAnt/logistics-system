import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Return } from './Return';
import { Product } from './Product';

@Entity()
export class ReturnItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalPrice?: number;

  @Column({
    type: 'enum',
    enum: ['good_condition', 'damaged', 'expired', 'defective', 'wrong_item'],
    default: 'good_condition'
  })
  condition!: 'good_condition' | 'damaged' | 'expired' | 'defective' | 'wrong_item';

  @Column({
    type: 'enum',
    enum: ['refund', 'replacement', 'repair', 'disposal', 'resale'],
    default: 'refund'
  })
  disposition!: 'refund' | 'replacement' | 'repair' | 'disposal' | 'resale';

  @Column({ type: 'text', nullable: true })
  conditionNotes?: string;

  @Column({ type: 'text', nullable: true })
  dispositionNotes?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Return)
  return!: Return;

  @Column()
  returnId!: number;

  @ManyToOne(() => Product)
  product!: Product;

  @Column()
  productId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
