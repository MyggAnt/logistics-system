import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Order } from './Order';
import { Warehouse } from './Warehouse';
import { User } from './User';
import { PickingListItem } from './PickingListItem';

@Entity()
export class PickingList {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  pickingListId!: string; // PL-001, PL-002, etc.

  @Column()
  name!: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'enum',
    enum: ['draft', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'draft'
  })
  status!: 'draft' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

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
  pickedItems!: number;

  @Column({ type: 'int', default: 0 })
  packedItems!: number;

  @Column({ type: 'text', nullable: true })
  priority?: string;

  @Column({ type: 'text', nullable: true })
  zone?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Order, { nullable: true })
  order?: Order;

  @Column({ nullable: true })
  orderId?: number;

  @ManyToOne(() => Warehouse)
  warehouse!: Warehouse;

  @Column()
  warehouseId!: number;

  @ManyToOne(() => User, { nullable: true })
  assignedTo?: User;

  @Column({ nullable: true })
  assignedToId?: number;

  @OneToMany(() => PickingListItem, item => item.pickingList)
  items?: PickingListItem[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
