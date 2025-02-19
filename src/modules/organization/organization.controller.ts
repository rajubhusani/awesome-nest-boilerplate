import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { OrganizationDto } from './dtos/organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'common/decorators/current-user.decorator';

@Controller('organizations')
@ApiTags('organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
    @CurrentUser('id') userId: string,
  ): Promise<OrganizationDto> {
    return this.organizationService.create(createOrganizationDto, userId);
  }

  @Get()
  findAll(): Promise<OrganizationDto[]> {
    return this.organizationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OrganizationDto> {
    return this.organizationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: Partial<CreateOrganizationDto>,
    @CurrentUser('id') userId: string,
  ): Promise<OrganizationDto> {
    return this.organizationService.update(id, updateOrganizationDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.organizationService.remove(id);
  }
} 