import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { IotSensor } from './IotSensor';

@Entity()
export class SensorReading {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value!: number;

  @Column({ type: 'text', nullable: true })
  unit?: string;

  @Column({ type: 'timestamp' })
  timestamp!: Date;

  @Column({ type: 'text', nullable: true })
  quality?: string; // good, bad, uncertain

  @Column({ type: 'boolean', default: false })
  isAlert!: boolean;

  @Column({ type: 'text', nullable: true })
  alertMessage?: string;

  @Column({ type: 'text', nullable: true })
  metadata?: string; // JSON string with additional data

  @ManyToOne(() => IotSensor)
  sensor!: IotSensor;

  @Column()
  sensorId!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
