import { IsString, IsOptional, IsEnum, IsObject, IsUUID } from 'class-validator';

enum CarePlanStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ON_HOLD = 'on-hold',
  REVOKED = 'revoked',
  COMPLETED = 'completed',
  ENTERED_IN_ERROR = 'entered-in-error'
}

enum CarePlanIntent {
  PROPOSAL = 'proposal',
  PLAN = 'plan',
  ORDER = 'order',
  OPTION = 'option'
}

export class CreateCarePlanDto {
  @IsOptional()
  @IsUUID()
  encounter_id?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(CarePlanStatus)
  status?: CarePlanStatus;

  @IsOptional()
  @IsEnum(CarePlanIntent)
  intent?: CarePlanIntent;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  goals?: Record<string, any>;

  @IsOptional()
  @IsObject()
  activities?: Record<string, any>;
} 