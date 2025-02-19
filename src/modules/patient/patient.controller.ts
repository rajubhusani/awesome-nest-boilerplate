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

@Controller('patients')
@ApiTags('Patients')
@UseGuards(AuthGuard, RolesGuard)
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @Roles(['admin', 'doctor', 'nurse'])
  @ApiOperation({ summary: 'Create patient' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Patient created successfully' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @Get(':id')
  @Roles(['admin', 'doctor', 'nurse'])
  @ApiOperation({ summary: 'Get patient by id' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Patient found' })
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Put(':id')
  @Roles(['admin', 'doctor', 'nurse'])
  @ApiOperation({ summary: 'Update patient' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Patient updated successfully' })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete patient' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Patient deleted successfully' })
  remove(@Param('id') id: string) {
    return this.patientService.remove(id);
  }

  @Get()
  @Roles(['admin', 'doctor', 'nurse'])
  @ApiOperation({ summary: 'Search patients' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Patients found' })
  search(
    @Query() searchDto: SearchPatientDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.patientService.search(searchDto, pageOptionsDto);
  }
} 