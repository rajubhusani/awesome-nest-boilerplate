import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { AllergyEntity } from './allergy.entity';
import { UseDto } from '../../../common/decorators/use-dto.decorator';
import { Gender } from '../enums/gender.enum';
import { PatientDto } from '../dtos/patient.dto';

@Entity({ name: 'patient' })
@UseDto(PatientDto)
export class PatientEntity extends AbstractEntity {
  @Column({ length: 100 })
  firstName!: string;

  @Column({ length: 100 })
  lastName!: string;

  @Column({ type: 'enum', enum: Gender })
  gender!: Gender;

  @Column({ type: 'date' })
  dateOfBirth!: Date;

  @Column({ default: true })
  active!: boolean;

  @OneToMany(() => AllergyEntity, (allergy) => allergy.patient)
  allergies!: AllergyEntity[];
} 