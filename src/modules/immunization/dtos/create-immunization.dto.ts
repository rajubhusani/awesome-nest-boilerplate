import { IsNotEmpty, IsString, IsOptional, IsDate, IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

enum ImmunizationStatus {
  COMPLETED = 'completed',
  ENTERED_IN_ERROR = 'entered-in-error',
  NOT_DONE = 'not-done'
}

export class CreateImmunizationDto {
  @IsNotEmpty()
  @IsString()
  vaccine_code!: string;

  @IsOptional()
  @IsString()
  vaccine_system?: string;

  @IsOptional()
  @IsEnum(ImmunizationStatus)
  status?: ImmunizationStatus;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  occurrence_date!: Date;

  @IsOptional()
  @IsBoolean()
  primary_source?: boolean;

  @IsOptional()
  @IsString()
  site?: string;

  @IsOptional()
  @IsString()
  route?: string;

  @IsOptional()
  @IsNumber()
  dose_quantity?: number;

  @IsOptional()
  @IsString()
  dose_unit?: string;

  @IsOptional()
  @IsString()
  manufacturer?: string;

  @IsOptional()
  @IsString()
  lot_number?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiration_date?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
} 