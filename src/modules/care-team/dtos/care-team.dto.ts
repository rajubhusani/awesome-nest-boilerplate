import { Exclude, Expose } from 'class-transformer';
import { CreateCareTeamDto } from './create-care-team.dto';

@Exclude()
export class CareTeamDto extends CreateCareTeamDto {
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