import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Practitioner } from '../../practitioner/entities/practitioner.entity';
import { Organization } from '../../organization/entities/organization.entity';

@Entity('encounter')
export class Encounter extends BaseEntity {
  @ManyToOne(() => Patient, patient => patient.encounters)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ManyToOne(() => Practitioner)
  @JoinColumn({ name: 'practitioner_id' })
  practitioner?: Practitioner;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization?: Organization;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['inpatient', 'outpatient', 'emergency', 'virtual', 'other']
  })
  encounter_type!: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['planned', 'in-progress', 'onhold', 'finished', 'cancelled'],
    default: 'planned'
  })
  status!: string;

  @Column({ type: 'timestamp', nullable: true })
  start_time?: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_time?: Date;

  @Column({ length: 50, nullable: true })
  reason_code?: string;

  @Column({ type: 'text', nullable: true })
  reason_text?: string;

  @Column({ type: 'jsonb', nullable: true })
  location?: Record<string, any>;
} 