import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { OrganizationDto } from './dtos/organization.dto';
import { BaseService } from '../../common/services/base.service';
import { MapperService } from '../../common/services/mapper.service';

@Injectable()
export class OrganizationService extends BaseService<
  Organization,
  CreateOrganizationDto,
  Partial<CreateOrganizationDto>,
  OrganizationDto
> {
  constructor(
    @InjectRepository(Organization)
    repository: Repository<Organization>,
    mapperService: MapperService,
  ) {
    super(repository, mapperService, OrganizationDto);
  }

  async findAll(): Promise<OrganizationDto[]> {
    const organizations = await this.repository.find({
      relations: ['created_by', 'updated_by', 'parent_organization'],
    });
    return this.mapperService.toDtos(OrganizationDto, organizations);
  }

  async findOne(id: string): Promise<OrganizationDto> {
    const organization = await this.repository.findOne({
      where: { id },
      relations: ['created_by', 'updated_by', 'parent_organization'],
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID "${id}" not found`);
    }

    return this.mapperService.toDto(OrganizationDto, organization);
  }
} 