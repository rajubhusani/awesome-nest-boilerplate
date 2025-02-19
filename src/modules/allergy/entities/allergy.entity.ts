import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';

@Entity('allergy')
export class Allergy extends BaseEntity {
  @ManyToOne(() => Patient, patient => patient.allergies)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @Column({ length: 50 })
  substance_code!: string;

  @Column({ length: 50, nullable: true })
  substance_system?: string;

  @Column({ type: 'jsonb', nullable: true })
  reaction?: Record<string, any>;

  @Column({
    length: 50,
    nullable: true,
    enum: ['mild', 'moderate', 'severe', 'life-threatening']
  })
  severity?: string;

  @Column({
    length: 50,
    nullable: true,
    enum: ['active', 'inactive', 'resolved']
  })
  clinical_status?: string;

  @Column({
    length: 50,
    nullable: true,
    enum: ['unconfirmed', 'confirmed', 'refuted', 'entered-in-error']
  })
  verification_status?: string;

  @Column({
    length: 50,
    nullable: true,
    enum: ['food', 'medication', 'environment', 'biologic', 'other']
  })
  type?: string;

  @Column({ type: 'timestamp', nullable: true })
  onset_date?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;
} 