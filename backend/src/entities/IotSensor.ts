import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Warehouse } from './Warehouse';
import { ProductLocation } from './ProductLocation';
import { SensorReading } from './SensorReading';
import { Vehicle } from './Vehicle';

@Entity()
export class IotSensor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  sensorId!: string; // SENSOR-001, SENSOR-002, etc.

  @Column()
  name!: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'enum',
    enum: [
      'temperature', 'humidity', 'door', 'motion', 'light', 'pressure', 'vibration',
      'gps_tracker', 'rfid_reader', 'rfid_tag', 'fuel_level', 'engine_temp', 'speed'
    ],
    default: 'temperature'
  })
  type!: 'temperature' | 'humidity' | 'door' | 'motion' | 'light' | 'pressure' | 'vibration' | 
         'gps_tracker' | 'rfid_reader' | 'rfid_tag' | 'fuel_level' | 'engine_temp' | 'speed';

  @Column()
  model!: string;

  @Column()
  manufacturer!: string;

  @Column({ type: 'text', nullable: true })
  serialNumber?: string;

  @Column({ type: 'text', nullable: true })
  firmwareVersion?: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'maintenance', 'error'],
    default: 'active'
  })
  status!: 'active' | 'inactive' | 'maintenance' | 'error';

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  minThreshold?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxThreshold?: number;

  @Column({ type: 'int', nullable: true })
  readingInterval?: number; // в секундах

  @Column({ type: 'timestamp', nullable: true })
  lastReadingTime?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  lastReadingValue?: number;

  @Column({ type: 'text', nullable: true })
  unit?: string; // °C, %, etc.

  @Column({ type: 'text', nullable: true })
  location?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // GPS специфичные поля
  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  altitude?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  speed?: number; // км/ч

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  heading?: number; // градусы

  // RFID специфичные поля
  @Column({ type: 'text', nullable: true })
  rfidTagId?: string;

  @Column({ type: 'text', nullable: true })
  rfidReaderId?: string;

  @Column({ type: 'int', nullable: true })
  readRange?: number; // в метрах

  // Связи
  @ManyToOne(() => Warehouse, { nullable: true })
  warehouse?: Warehouse;

  @Column({ nullable: true })
  warehouseId?: number;

  @ManyToOne(() => ProductLocation, { nullable: true })
  productLocation?: ProductLocation;

  @Column({ nullable: true })
  productLocationId?: number;

  @ManyToOne(() => Vehicle, { nullable: true })
  vehicle?: Vehicle;

  @Column({ nullable: true })
  vehicleId?: number;

  @OneToMany(() => SensorReading, reading => reading.sensor)
  readings?: SensorReading[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
