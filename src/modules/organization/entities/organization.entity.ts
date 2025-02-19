import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('organization')
export class Organization extends BaseEntity {
  @Column({ length: 200 })
  name!: string;

  @Column({ length: 50, nullable: true })
  type?: string;

  @Column({ type: 'jsonb', nullable: true })
  address?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  contact?: Record<string, any>;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'parent_organization' })
  parent_organization?: Organization;

  @Column({ default: true })
  active!: boolean;
} 