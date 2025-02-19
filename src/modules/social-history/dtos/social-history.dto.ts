import { Exclude, Expose } from 'class-transformer';
import { CreateSocialHistoryDto } from './create-social-history.dto';

@Exclude()
export class SocialHistoryDto extends CreateSocialHistoryDto {
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