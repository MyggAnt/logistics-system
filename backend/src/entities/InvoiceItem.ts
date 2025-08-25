import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Invoice } from './Invoice';
import { Product } from './Product';

@Entity()
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountPercent!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxPercent!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Invoice)
  invoice!: Invoice;

  @Column()
  invoiceId!: number;

  @ManyToOne(() => Product, { nullable: true })
  product?: Product;

  @Column({ nullable: true })
  productId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
