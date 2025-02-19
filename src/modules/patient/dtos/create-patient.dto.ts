import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsString, 
  IsOptional, 
  IsDate, 
  IsEnum,
  IsObject,
  Length
} from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreatePatientDto {
  @ApiProperty()
  @IsString()
  @Length(1, 50)
  mrn!: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  identifier?: Record<string, any>;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 10)
  namePrefix?: string;

  @ApiProperty()
  @IsString()
  @Length(1, 100)
  nameGiven!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 100)
  nameMiddle?: string;

  @ApiProperty()
  @IsString()
  @Length(1, 100)
  nameFamily!: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @ApiProperty()
  @IsString()
  @Length(1, 100)
  firstName!: string;

  @ApiProperty()
  @IsString()
  @Length(1, 100)
  lastName!: string;

  @ApiProperty()
  @IsEnum(Gender)
  gender!: Gender;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  dateOfBirth!: Date;
} 