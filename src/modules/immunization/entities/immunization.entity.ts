import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';

@Entity('immunization')
export class Immunization extends BaseEntity {
  @ManyToOne(() => Patient, patient => patient.immunizations)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @Column({ length: 50 })
  vaccine_code!: string;

  @Column({ length: 50, nullable: true })
  vaccine_system?: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['completed', 'entered-in-error', 'not-done'],
    default: 'completed'
  })
  status!: string;

  @Column({ type: 'date' })
  occurrence_date!: Date;

  @Column({ default: true })
  primary_source!: boolean;

  @Column({ length: 50, nullable: true })
  site?: string;

  @Column({ length: 50, nullable: true })
  route?: string;

  @Column({ type: 'decimal', nullable: true })
  dose_quantity?: number;

  @Column({ length: 20, nullable: true })
  dose_unit?: string;

  @Column({ length: 200, nullable: true })
  manufacturer?: string;

  @Column({ length: 50, nullable: true })
  lot_number?: string;

  @Column({ type: 'date', nullable: true })
  expiration_date?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;
} 