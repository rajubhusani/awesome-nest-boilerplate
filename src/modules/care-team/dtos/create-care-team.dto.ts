import { IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

enum CareTeamStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ENTERED_IN_ERROR = 'entered-in-error'
}

export class CreateCareTeamDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(CareTeamStatus)
  status?: CareTeamStatus;

  @IsOptional()
  @IsObject()
  members?: Record<string, any>;

  @IsOptional()
  @IsString()
  notes?: string;
} 