import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from '../../patient/entities/patient.entity';

@Entity('care_team')
export class CareTeam extends BaseEntity {
  @ManyToOne(() => Patient, patient => patient.careTeams)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @Column({ length: 200, nullable: true })
  name?: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: ['active', 'inactive', 'entered-in-error'],
    default: 'active'
  })
  status!: string;

  @Column({ type: 'jsonb', nullable: true })
  members?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes?: string;
} 