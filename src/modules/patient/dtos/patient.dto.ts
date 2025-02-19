import { Exclude, Expose, Type } from 'class-transformer';
import { CreatePatientDto } from './create-patient.dto';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class PatientDto extends CreatePatientDto {
  @ApiProperty({
    description: 'Unique identifier of the patient',
    example: 'uuid-string'
  })
  @Expose()
  declare id: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00Z'
  })
  @Expose()
  declare created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00Z'
  })
  @Expose()
  declare updated_at: Date;

  @ApiProperty({
    description: 'Record version number',
    example: 1
  })
  @Expose()
  declare version: number;

  @ApiProperty({
    description: 'User ID who created the record',
    example: 'user-uuid'
  })
  @Expose()
  declare created_by: string;

  @ApiProperty({
    description: 'User ID who last updated the record',
    example: 'user-uuid'
  })
  @Expose()
  declare updated_by: string;

  // Relationships
  @ApiProperty({
    description: 'Patient allergies',
    type: 'array',
    required: false
  })
  @Expose()
  declare allergies?: any[];

  @Expose()
  declare encounters?: any[];

  @Expose()
  declare problems?: any[];

  @Expose()
  declare immunizations?: any[];

  @Expose()
  declare familyHistories?: any[];

  @Expose()
  declare socialHistories?: any[];

  @Expose()
  declare careTeams?: any[];

  @Expose()
  declare carePlans?: any[];

  @ApiProperty({
    description: 'The first name of the patient',
    example: 'John'
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the patient',
    example: 'Doe'
  })
  lastName: string;

  @ApiProperty({
    description: 'The email address of the patient',
    example: 'john.doe@example.com'
  })
  email: string;
} 