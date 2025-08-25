import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './Role';
import { Warehouse } from './Warehouse';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column()
  email!: string;

  @Column()
  passwordHash!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ type: 'text', nullable: true })
  middleName?: string;

  @Column({ type: 'text', nullable: true })
  phone?: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'suspended', 'locked'],
    default: 'active'
  })
  status!: 'active' | 'inactive' | 'suspended' | 'locked';

  @Column({ type: 'date', nullable: true })
  lastLoginDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastActivity?: Date;

  @Column({ type: 'boolean', default: false })
  isEmailVerified!: boolean;

  @Column({ type: 'boolean', default: false })
  isPhoneVerified!: boolean;

  @Column({ type: 'text', nullable: true })
  avatar?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToMany(() => Role)
  @JoinTable()
  roles?: Role[];

  @ManyToMany(() => Warehouse)
  @JoinTable()
  accessibleWarehouses?: Warehouse[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
