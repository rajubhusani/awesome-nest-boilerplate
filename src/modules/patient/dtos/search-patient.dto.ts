import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '../enums/gender.enum';

export class SearchPatientDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mrn?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthDate?: Date;

  @ApiProperty({ required: false, enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  // Add other search parameters...
} 