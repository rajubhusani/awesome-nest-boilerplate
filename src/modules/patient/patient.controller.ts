import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { SearchPatientDto } from './dtos/search-patient.dto';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { PatientDto } from './dtos/patient.dto';

@Controller('patients')
@ApiTags('Patients')
@UseGuards(AuthGuard, RolesGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ 
    status: 201, 
    description: 'The patient has been successfully created.',
    type: PatientDto 
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  @Roles(['admin', 'doctor', 'nurse'])
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of all patients',
    type: [PatientDto]
  })
  @Get()
  @Roles(['admin', 'doctor', 'nurse'])
  search(
    @Query() searchDto: SearchPatientDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.patientService.search(searchDto, pageOptionsDto);
  }

  @ApiOperation({ summary: 'Get a patient by id' })
  @ApiResponse({
    status: 200,
    description: 'Returns the patient with the specified id',
    type: PatientDto
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  @Get(':id')
  @Roles(['admin', 'doctor', 'nurse'])
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a patient' })
  @ApiResponse({
    status: 200,
    description: 'The patient has been successfully updated.',
    type: PatientDto
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  @Put(':id')
  @Roles(['admin', 'doctor', 'nurse'])
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @ApiOperation({ summary: 'Delete a patient' })
  @ApiResponse({
    status: 200,
    description: 'The patient has been successfully deleted.'
  })
  @ApiResponse({ status: 404, description: 'Patient not found.' })
  @Delete(':id')
  @Roles(['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }
} 