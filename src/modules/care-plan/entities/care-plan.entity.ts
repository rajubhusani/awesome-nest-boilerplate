import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';
import { Encounter } from '../../encounter/entities/encounter.entity';

@Entity('care_plan')
export class CarePlan extends BaseEntity {
  @ManyToOne(() => Patient, patient => patient.carePlans)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ManyToOne(() => Encounter)
  @JoinColumn({ name: 'encounter_id' })
  encounter?: Encounter;

  @Column({ length: 200, nullable: true })
  title?: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['draft', 'active', 'on-hold', 'revoked', 'completed', 'entered-in-error'],
    default: 'draft'
  })
  status!: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['proposal', 'plan', 'order', 'option'],
    default: 'plan'
  })
  intent!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  goals?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  activities?: Record<string, any>;
} 