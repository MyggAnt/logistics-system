import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class UserActivity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: ['login', 'logout', 'create', 'read', 'update', 'delete', 'export', 'import', 'system'],
    default: 'system'
  })
  action!: 'login' | 'logout' | 'create' | 'read' | 'update' | 'delete' | 'export' | 'import' | 'system';

  @Column()
  resource!: string; // orders, products, vehicles, etc.

  @Column({ nullable: true })
  resourceId?: number;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ type: 'text', nullable: true })
  ipAddress?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ type: 'text', nullable: true })
  sessionId?: string;

  @Column({ type: 'boolean', default: false })
  isSuccessful!: boolean;

  @Column({ type: 'text', nullable: true })
  errorMessage?: string;

  @Column({ type: 'text', nullable: true })
  metadata?: string; // JSON string with additional data

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @Column({ nullable: true })
  userId?: number;

  @CreateDateColumn()
  createdAt!: Date;
}
