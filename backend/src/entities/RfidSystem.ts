import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Warehouse } from './Warehouse';
import { ProductLocation } from './ProductLocation';

@Entity()
export class RfidSystem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  systemId!: string; // RFID-001, RFID-002, etc.

  @Column()
  name!: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'enum',
    enum: ['reader', 'tag', 'antenna', 'gate'],
    default: 'reader'
  })
  type!: 'reader' | 'tag' | 'antenna' | 'gate';

  @Column()
  model!: string;

  @Column()
  manufacturer!: string;

  @Column({ type: 'text', nullable: true })
  serialNumber?: string;

  @Column({ type: 'text', nullable: true })
  tagId?: string; // для RFID тегов

  @Column({ type: 'text', nullable: true })
  readerId?: string; // для RFID ридеров

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'maintenance', 'error'],
    default: 'active'
  })
  status!: 'active' | 'inactive' | 'maintenance' | 'error';

  @Column({ type: 'int', nullable: true })
  frequency?: number; // в МГц

  @Column({ type: 'int', nullable: true })
  readRange?: number; // в метрах

  @Column({ type: 'int', nullable: true })
  readPower?: number; // в дБм

  @Column({ type: 'timestamp', nullable: true })
  lastReadTime?: Date;

  @Column({ type: 'text', nullable: true })
  lastReadTagId?: string;

  @Column({ type: 'text', nullable: true })
  lastReadLocation?: string;

  @Column({ type: 'int', nullable: true })
  readCount?: number; // количество успешных считываний

  @Column({ type: 'int', nullable: true })
  errorCount?: number; // количество ошибок

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature?: number; // температура сенсора

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Связи
  @ManyToOne(() => Warehouse, { nullable: true })
  warehouse?: Warehouse;

  @Column({ nullable: true })
  warehouseId?: number;

  @ManyToOne(() => ProductLocation, { nullable: true })
  productLocation?: ProductLocation;

  @Column({ nullable: true })
  productLocationId?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
