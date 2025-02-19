import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsString, 
  IsOptional, 
  IsDate, 
  IsEnum,
  IsObject,
  Length,
  IsNotEmpty,
  IsBoolean,
  IsUUID
} from 'class-validator';

enum GenderIdentity {
  MALE = 'male',
  FEMALE = 'female',
  TRANSGENDER_MALE = 'transgender-male',
  TRANSGENDER_FEMALE = 'transgender-female',
  NON_BINARY = 'non-binary',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer-not-to-say'
}

enum BiologicalSex {
  MALE = 'male',
  FEMALE = 'female',
  INTERSEX = 'intersex',
  UNKNOWN = 'unknown'
}

export class CreatePatientDto {
  @ApiProperty({
    description: 'Medical Record Number',
    example: 'MRN123456',
    minLength: 1,
    maxLength: 50
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  mrn!: string;

  @ApiProperty({
    description: 'Additional identifiers for the patient',
    example: { 
      ssn: '123-45-6789',
      driverLicense: 'DL123456'
    },
    required: false
  })
  @IsOptional()
  @IsObject()
  identifier?: Record<string, any>;

  @ApiProperty({
    description: 'Name prefix (Mr., Mrs., Dr., etc)',
    example: 'Mr.',
    required: false,
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  name_prefix?: string;

  @ApiProperty({
    description: 'Given name (first name)',
    example: 'John',
    required: true,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name_given!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 100)
  name_middle?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  name_family!: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 10)
  name_suffix?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 100)
  preferred_name?: string;

  @ApiProperty()
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  birth_date!: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  death_date?: Date;

  @ApiProperty({
    description: 'Gender identity of the patient',
    enum: GenderIdentity,
    example: GenderIdentity.MALE,
    required: false
  })
  @IsOptional()
  @IsEnum(GenderIdentity)
  gender_identity?: GenderIdentity;

  @ApiProperty({
    description: 'Biological sex of the patient',
    enum: BiologicalSex,
    example: BiologicalSex.MALE,
    required: false
  })
  @IsOptional()
  @IsEnum(BiologicalSex)
  biological_sex?: BiologicalSex;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  preferred_pronouns?: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  address?: Record<string, any>;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  contact?: Record<string, any>;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  preferred_language?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  interpreter_required?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  marital_status?: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  race?: Record<string, any>;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 50)
  ethnicity?: string;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  emergency_contacts?: Record<string, any>;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  preferred_pharmacy?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  primary_care_provider?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(1, 10)
  blood_type?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  organ_donor?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  advance_directives?: Record<string, any>;
} 