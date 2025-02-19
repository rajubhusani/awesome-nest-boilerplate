import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PractitionerService } from './practitioner.service';
import { CreatePractitionerDto } from './dtos/create-practitioner.dto';
import { PractitionerDto } from './dtos/practitioner.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('practitioners')
@ApiTags('practitioners')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PractitionerController {
  constructor(private readonly practitionerService: PractitionerService) {}

  @Post()
  create(
    @Body() createPractitionerDto: CreatePractitionerDto,
    @CurrentUser('id') userId: string,
  ): Promise<PractitionerDto> {
    return this.practitionerService.create(createPractitionerDto, userId);
  }

  @Get()
  findAll(): Promise<PractitionerDto[]> {
    return this.practitionerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PractitionerDto> {
    return this.practitionerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePractitionerDto: Partial<CreatePractitionerDto>,
    @CurrentUser('id') userId: string,
  ): Promise<PractitionerDto> {
    return this.practitionerService.update(id, updatePractitionerDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.practitionerService.remove(id);
  }
} 