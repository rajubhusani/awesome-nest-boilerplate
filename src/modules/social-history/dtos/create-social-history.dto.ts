import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateSocialHistoryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @IsOptional()
  @IsString()
  notes?: string;
} 