import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { PatientEntity } from './patient.entity';
import { UseDto } from '../../../common/decorators/use-dto.decorator';
import { AllergyDto } from '../dtos/allergy.dto';

@Entity({ name: 'allergy' })
@UseDto(AllergyDto)
export class AllergyEntity extends AbstractEntity {
  @Column({ type: 'uuid' })
  patientId!: string;

  @Column({ length: 50 })
  substanceCode!: string;

  @Column({ length: 50, nullable: true })
  substanceSystem!: string;

  @Column({ type: 'jsonb', nullable: true })
  reaction!: Record<string, any>;

  @Column({ length: 50, nullable: true })
  severity!: string;

  @Column({ length: 50, nullable: true })
  clinicalStatus!: string;

  @Column({ length: 50, nullable: true })
  verificationStatus!: string;

  @Column({ length: 50, nullable: true })
  type!: string;

  @Column({ type: 'timestamp', nullable: true })
  onsetDate!: Date;

  @Column({ type: 'text', nullable: true })
  notes!: string;

  @ManyToOne(() => PatientEntity, (patient) => patient.allergies)
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientEntity;
} 