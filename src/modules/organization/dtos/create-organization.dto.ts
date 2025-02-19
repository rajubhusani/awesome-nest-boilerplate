import { IsString, IsOptional, IsObject, IsBoolean, IsUUID } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsObject()
  address?: Record<string, any>;

  @IsOptional()
  @IsObject()
  contact?: Record<string, any>;

  @IsOptional()
  @IsUUID()
  parent_organization?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
} 