import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Organization } from '../../organization/entities/organization.entity';

@Entity('practitioner')
export class Practitioner extends BaseEntity {
  @Column({ length: 100 })
  first_name!: string;

  @Column({ length: 100 })
  last_name!: string;

  @Column({ length: 100, nullable: true })
  credentials?: string;

  @Column({ length: 50, nullable: true })
  phone?: string;

  @Column({ length: 200, nullable: true })
  email?: string;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization;

  @Column({ default: true })
  active!: boolean;
} 