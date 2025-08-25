import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Warehouse } from './Warehouse';
import { User } from './User';
import { InventoryItem } from './InventoryItem';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  inventoryId!: string; // INV-001, INV-002, etc.

  @Column()
  name!: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'enum',
    enum: ['full', 'selective', 'cycle', 'spot'],
    default: 'full'
  })
  type!: 'full' | 'selective' | 'cycle' | 'spot';

  @Column({
    type: 'enum',
    enum: ['planned', 'in_progress', 'completed', 'cancelled'],
    default: 'planned'
  })
  status!: 'planned' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ type: 'date' })
  plannedDate!: Date;

  @Column({ type: 'date', nullable: true })
  actualStartDate?: Date;

  @Column({ type: 'date', nullable: true })
  actualEndDate?: Date;

  @Column({ type: 'int', nullable: true })
  estimatedDuration?: number; // в минутах

  @Column({ type: 'int', nullable: true })
  actualDuration?: number; // в минутах

  @Column({ type: 'int' })
  totalItems!: number;

  @Column({ type: 'int', default: 0 })
  countedItems!: number;

  @Column({ type: 'int', default: 0 })
  discrepancies!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  accuracyPercentage!: number;

  @Column({ type: 'text', nullable: true })
  reason?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column()
  warehouseId!: number;

  @ManyToOne(() => User, { nullable: true })
  assignedTo?: User;

  @Column({ nullable: true })
  assignedToId?: number;

  @ManyToOne(() => User, { nullable: true })
  conductedBy?: User;

  @Column({ nullable: true })
  conductedById?: number;

  @OneToMany(() => InventoryItem, item => item.inventory)
  items?: InventoryItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
