import { Exclude, Expose } from 'class-transformer';
import { CreateCarePlanDto } from './create-care-plan.dto';

@Exclude()
export class CarePlanDto extends CreateCarePlanDto {
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