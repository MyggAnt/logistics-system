import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { Permission } from './Permission';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column('text')
  description?: string;

  @Column({
    type: 'enum',
    enum: ['system', 'custom'],
    default: 'custom'
  })
  type!: 'system' | 'custom';

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToMany(() => User, user => user.roles)
  users?: User[];

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions?: Permission[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
