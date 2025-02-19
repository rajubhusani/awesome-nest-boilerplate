import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateFamilyHistoryDto {
  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsNumber()
  onset_age?: number;

  @IsOptional()
  @IsString()
  notes?: string;
} 