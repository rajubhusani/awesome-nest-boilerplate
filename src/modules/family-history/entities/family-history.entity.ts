import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';

@Entity('family_history')
export class FamilyHistory extends BaseEntity {
  @ManyToOne(() => Patient, patient => patient.familyHistories)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @Column({ length: 50, nullable: true })
  relationship?: string;

  @Column({ type: 'text', nullable: true })
  condition?: string;

  @Column({ type: 'int', nullable: true })
  onset_age?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;
} 