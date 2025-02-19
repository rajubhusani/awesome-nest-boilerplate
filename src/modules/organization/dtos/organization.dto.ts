import { Exclude, Expose } from 'class-transformer';
import { CreateOrganizationDto } from './create-organization.dto';

@Exclude()
export class OrganizationDto extends CreateOrganizationDto {
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