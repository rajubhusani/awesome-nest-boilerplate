import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';

@Entity('social_history')
export class SocialHistory extends BaseEntity {
  @ManyToOne(() => Patient, patient => patient.socialHistories)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @Column({ length: 50, nullable: true })
  category?: string;

  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes?: string;
} 