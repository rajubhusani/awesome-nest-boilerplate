import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Encounter } from '../../encounter/entities/encounter.entity';
import { UserAccount } from '../../user/entities/user-account.entity';

@Entity('problem')
export class Problem extends BaseEntity {
  @ManyToOne(() => Patient, patient => patient.problems)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ManyToOne(() => Encounter)
  @JoinColumn({ name: 'encounter_id' })
  encounter?: Encounter;

  @Column({ type: 'uuid', nullable: true })
  concept_id?: string;

  @Column({ length: 50, nullable: true })
  code?: string;

  @Column({ length: 50, nullable: true })
  coding_system?: string;

  @Column({ length: 200, nullable: true })
  display_name?: string;

  @Column({ type: 'timestamp', nullable: true })
  onset_date?: Date;

  @Column({ type: 'timestamp', nullable: true })
  abatement_date?: Date;

  @Column({
    length: 50,
    nullable: true,
    enum: ['active', 'recurrence', 'relapse', 'inactive', 'remission', 'resolved']
  })
  clinical_status?: string;

  @Column({ length: 50, nullable: true })
  verification_status?: string;

  @Column({ length: 50, nullable: true })
  severity?: string;

  @Column({ type: 'jsonb', nullable: true })
  body_site?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  stage?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  evidence?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  related_problems?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'created_by' })
  created_by: UserAccount;

  @ManyToOne(() => UserAccount)
  @JoinColumn({ name: 'updated_by' })
  updated_by: UserAccount;

  @Column({ default: 1 })
  version: number;
} 