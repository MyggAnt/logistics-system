import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Warehouse } from './Warehouse';
import { ContractItem } from './ContractItem';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  contractNumber!: string; // CON-001, CON-002, etc.

  @Column()
  name!: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'enum',
    enum: ['supplier', 'transport', 'warehouse', 'service'],
    default: 'supplier'
  })
  type!: 'supplier' | 'transport' | 'warehouse' | 'service';

  @Column()
  counterpartyName!: string;

  @Column('text')
  counterpartyAddress!: string;

  @Column()
  counterpartyTaxId!: string;

  @Column()
  counterpartyContactPerson!: string;

  @Column()
  counterpartyPhone!: string;

  @Column()
  counterpartyEmail!: string;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  endDate!: Date;

  @Column({ type: 'date', nullable: true })
  actualEndDate?: Date;

  @Column({
    type: 'enum',
    enum: ['draft', 'active', 'suspended', 'terminated', 'expired'],
    default: 'draft'
  })
  status!: 'draft' | 'active' | 'suspended' | 'terminated' | 'expired';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalValue?: number;

  @Column({ type: 'text', nullable: true })
  currency?: string;

  @Column({ type: 'text', nullable: true })
  paymentTerms?: string;

  @Column({ type: 'text', nullable: true })
  deliveryTerms?: string;

  @Column({ type: 'text', nullable: true })
  qualityStandards?: string;

  @Column({ type: 'text', nullable: true })
  penaltyTerms?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Warehouse, { nullable: true })
  warehouse?: Warehouse;

  @Column({ nullable: true })
  warehouseId?: number;

  @OneToMany(() => ContractItem, item => item.contract)
  items?: ContractItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
