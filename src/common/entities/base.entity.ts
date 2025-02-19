import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserAccount } from '../../modules/user/entities/user-account.entity';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'created_by' })
  declare created_by: UserAccount;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'updated_by' })
  declare updated_by: UserAccount;

  @CreateDateColumn()
  declare created_at: Date;

  @UpdateDateColumn()
  declare updated_at: Date;

  @Column({ default: 1 })
  declare version: number;
} 