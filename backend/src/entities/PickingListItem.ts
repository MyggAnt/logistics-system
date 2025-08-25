import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { PickingList } from './PickingList';
import { Product } from './Product';
import { ProductLocation } from './ProductLocation';

@Entity()
export class PickingListItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  sequenceNumber!: number; // порядковый номер в сборочном листе

  @Column({ type: 'int' })
  requiredQuantity!: number;

  @Column({ type: 'int', default: 0 })
  pickedQuantity!: number;

  @Column({ type: 'int', default: 0 })
  packedQuantity!: number;

  @Column({ type: 'text', nullable: true })
  locationCode?: string;

  @Column({ type: 'text', nullable: true })
  zone?: string;

  @Column({ type: 'text', nullable: true })
  aisle?: string;

  @Column({ type: 'text', nullable: true })
  rack?: string;

  @Column({ type: 'text', nullable: true })
  level?: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'picking', 'picked', 'packing', 'packed', 'verified'],
    default: 'pending'
  })
  status!: 'pending' | 'picking' | 'picked' | 'packing' | 'packed' | 'verified';

  @Column({ type: 'timestamp', nullable: true })
  pickingStartTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  pickingEndTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  packingStartTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  packingEndTime?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => PickingList)
  pickingList!: PickingList;

  @Column()
  pickingListId!: number;

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
