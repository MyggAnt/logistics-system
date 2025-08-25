import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './Order';
import { Warehouse } from './Warehouse';
import { User } from './User';
import { ReturnItem } from './ReturnItem';

@Entity()
export class Return {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  returnId!: string; // RET-001, RET-002, etc.

  @Column()
  name!: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'enum',
    enum: ['customer_return', 'supplier_return', 'quality_issue', 'damaged', 'expired'],
    default: 'customer_return'
  })
  type!: 'customer_return' | 'supplier_return' | 'quality_issue' | 'damaged' | 'expired';

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'processing', 'completed', 'rejected', 'cancelled'],
    default: 'pending'
  })
  status!: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected' | 'cancelled';

  @Column({ type: 'date' })
  returnDate!: Date;

  @Column({ type: 'date', nullable: true })
  approvedDate?: Date;

  @Column({ type: 'date', nullable: true })
  processedDate?: Date;

  @Column({ type: 'date', nullable: true })
  completedDate?: Date;

  @Column({ type: 'text' })
  reason!: string;

  @Column({ type: 'text', nullable: true })
  customerNotes?: string;

  @Column({ type: 'text', nullable: true })
  internalNotes?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundAmount?: number;

  @Column({ type: 'text', nullable: true })
  refundMethod?: string;

  @Column({ type: 'text', nullable: true })
  trackingNumber?: string;

  @Column({ type: 'text', nullable: true })
  returnLabel?: string;

  @ManyToOne(() => Order, { nullable: true })
  originalOrder?: Order;

  @Column({ nullable: true })
  originalOrderId?: number;

  @ManyToOne(() => Warehouse)
  returnWarehouse!: Warehouse;

  @Column()
  returnWarehouseId!: number;

  @ManyToOne(() => User, { nullable: true })
  requestedBy?: User;

  @Column({ nullable: true })
  requestedById?: number;

  @ManyToOne(() => User, { nullable: true })
  approvedBy?: User;

  @Column({ nullable: true })
  approvedById?: number;

  @ManyToOne(() => User, { nullable: true })
  processedBy?: User;

  @Column({ nullable: true })
  processedById?: number;

  @OneToMany(() => ReturnItem, item => item.return)
  items?: ReturnItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
