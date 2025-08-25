import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './Order';
import { LogisticBatch } from './LogisticBatch';
import { InvoiceItem } from './InvoiceItem';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  invoiceNumber!: string; // INV-001, INV-002, etc.

  @Column({
    type: 'enum',
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  })
  status!: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

  @Column({
    type: 'enum',
    enum: ['customer', 'supplier', 'transport', 'warehouse'],
    default: 'customer'
  })
  type!: 'customer' | 'supplier' | 'transport' | 'warehouse';

  @Column()
  customerName!: string;

  @Column('text')
  customerAddress!: string;

  @Column()
  customerTaxId!: string;

  @Column({ type: 'date' })
  issueDate!: Date;

  @Column({ type: 'date' })
  dueDate!: Date;

  @Column({ type: 'date', nullable: true })
  paymentDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance!: number;

  @Column({ type: 'text', nullable: true })
  paymentTerms?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  reference?: string;

  @ManyToOne(() => Order, { nullable: true })
  order?: Order;

  @Column({ nullable: true })
  orderId?: number;

  @ManyToOne(() => LogisticBatch, { nullable: true })
  logisticBatch?: LogisticBatch;

  @Column({ nullable: true })
  logisticBatchId?: number;

  @OneToMany(() => InvoiceItem, item => item.invoice)
  items?: InvoiceItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
