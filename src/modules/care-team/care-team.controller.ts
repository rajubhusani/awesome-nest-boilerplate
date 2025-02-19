import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CareTeamService } from './care-team.service';
import { CreateCareTeamDto } from './dtos/create-care-team.dto';
import { CareTeamDto } from './dtos/care-team.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from 'common/decorators/current-user.decorator';

@Controller('patients/:patientId/care-teams')
@ApiTags('care-teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CareTeamController {
  constructor(private readonly careTeamService: CareTeamService) {}

  @Post()
  create(
    @Param('patientId') patientId: string,
    @Body() createCareTeamDto: CreateCareTeamDto,
    @CurrentUser('id') userId: string,
  ): Promise<CareTeamDto> {
    return this.careTeamService.create(createCareTeamDto, patientId, userId);
  }

  @Get()
  findAll(@Param('patientId') patientId: string): Promise<CareTeamDto[]> {
    return this.careTeamService.findAll(patientId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Param('patientId') patientId: string,
  ): Promise<CareTeamDto> {
    return this.careTeamService.findOne(id, patientId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Param('patientId') patientId: string,
    @Body() updateCareTeamDto: Partial<CreateCareTeamDto>,
    @CurrentUser('id') userId: string,
  ): Promise<CareTeamDto> {
    return this.careTeamService.update(id, updateCareTeamDto, patientId, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Param('patientId') patientId: string,
  ): Promise<void> {
    return this.careTeamService.remove(id, patientId);
  }
} 