import { Exclude, Expose } from 'class-transformer';
import { CreateImmunizationDto } from './create-immunization.dto';

@Exclude()
export class ImmunizationDto extends CreateImmunizationDto {
  @Expose()
  id!: string;

  @Expose()
  patient_id!: string;

  @Expose()
  created_at!: Date;

  @Expose()
  updated_at!: Date;

  @Expose()
  version!: number;

  @Expose()
  created_by!: string;

  @Expose()
  updated_by!: string;
} 