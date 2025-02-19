import { AbstractDto } from '../../../common/abstract.dto';
import { PatientEntity } from '../entities/patient.entity';
import { Gender } from '../enums/gender.enum';

export class PatientDto extends AbstractDto {
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: Date;

  constructor(patient: PatientEntity) {
    super(patient);
    this.firstName = patient.firstName;
    this.lastName = patient.lastName;
    this.gender = patient.gender;
    this.dateOfBirth = patient.dateOfBirth;
  }
} 