import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  })
  type!: 'info' | 'success' | 'warning' | 'error';

  @Column()
  title!: string;

  @Column('text')
  message!: string;

  @Column({ default: false })
  read!: boolean;

  @Column({ type: 'json', nullable: true })
  action?: {
    text: string;
    url?: string;
    orderId?: number;
    vehicleId?: number;
  };

  @Column({ type: 'json', nullable: true })
  metadata?: {
    orderId?: number;
    vehicleId?: number;
    userId?: number;
  };

  @CreateDateColumn()
  createdAt!: Date;
}
