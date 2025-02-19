import { Exclude, Expose } from 'class-transformer';
import { CreatePractitionerDto } from './create-practitioner.dto';

@Exclude()
export class PractitionerDto extends CreatePractitionerDto {
  @Expose()
  id!: string;

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