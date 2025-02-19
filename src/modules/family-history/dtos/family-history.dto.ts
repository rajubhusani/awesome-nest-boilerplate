import { Exclude, Expose } from 'class-transformer';
import { CreateFamilyHistoryDto } from './create-family-history.dto';

@Exclude()
export class FamilyHistoryDto extends CreateFamilyHistoryDto {
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