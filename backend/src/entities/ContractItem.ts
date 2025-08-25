import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Contract } from './Contract';
import { Product } from './Product';

@Entity()
export class ContractItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  description!: string;

  @Column({ type: 'int', nullable: true })
  quantity?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitPrice?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalPrice?: number;

  @Column({ type: 'text', nullable: true })
  specifications?: string;

  @Column({ type: 'text', nullable: true })
  qualityStandards?: string;

  @Column({ type: 'text', nullable: true })
  deliverySchedule?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Contract)
  contract!: Contract;

  @Column()
  contractId!: number;

  @ManyToOne(() => Product, { nullable: true })
  product?: Product;

  @Column({ nullable: true })
  productId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
