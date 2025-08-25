import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './Role';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column('text')
  description?: string;

  @Column()
  resource!: string; // orders, products, vehicles, etc.

  @Column()
  action!: string; // create, read, update, delete

  @Column({
    type: 'enum',
    enum: ['allow', 'deny'],
    default: 'allow'
  })
  effect!: 'allow' | 'deny';

  @Column({ type: 'text', nullable: true })
  conditions?: string; // JSON string with additional conditions

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToMany(() => Role, role => role.permissions)
  roles?: Role[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
