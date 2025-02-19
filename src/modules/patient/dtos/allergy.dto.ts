import { AbstractDto } from '../../../common/dto/abstract.dto';
import { AllergyEntity } from '../entities/allergy.entity';

export class AllergyDto extends AbstractDto {
  patientId: string;
  substanceCode: string;
  substanceSystem?: string;
  reaction?: Record<string, any>;
  severity?: string;
  clinicalStatus?: string;
  verificationStatus?: string;
  type?: string;
  onsetDate?: Date;
  notes?: string;

  constructor(allergy: AllergyEntity) {
    super(allergy);
    this.patientId = allergy.patientId;
    this.substanceCode = allergy.substanceCode;
    this.substanceSystem = allergy.substanceSystem;
    this.reaction = allergy.reaction;
    this.severity = allergy.severity;
    this.clinicalStatus = allergy.clinicalStatus;
    this.verificationStatus = allergy.verificationStatus;
    this.type = allergy.type;
    this.onsetDate = allergy.onsetDate;
    this.notes = allergy.notes;
  }
} 