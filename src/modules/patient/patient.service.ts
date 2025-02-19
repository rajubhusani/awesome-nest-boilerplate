import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm';
import { PatientEntity } from './entities/patient.entity';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';
import { SearchPatientDto } from './dtos/search-patient.dto';
import { PageDto } from '../../common/dto/page.dto';
import type { PageOptionsDto } from '../../common/dto/page-options.dto';
import { GeneralException } from '../../exceptions/general.exception';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<PatientEntity> {
    try {
      const patient = this.patientRepository.create({
        ...createPatientDto,
        active: true,
        allergies: [],
      });
      return await this.patientRepository.save(patient);
    } catch (error) {
      throw new GeneralException('PATIENT.CREATE_ERROR', error);
    }
  }

  async findOne(id: string): Promise<PatientEntity> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<PatientEntity> {
    const patient = await this.findOne(id);
    try {
      const updatedPatient = { ...patient, ...updatePatientDto };
      return await this.patientRepository.save(updatedPatient);
    } catch (error) {
      throw new GeneralException('PATIENT.UPDATE_ERROR', error);
    }
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    patient.active = false;
    await this.patientRepository.save(patient);
  }

  async search(searchDto: SearchPatientDto, pageOptionsDto: PageOptionsDto): Promise<PageDto<PatientEntity>> {
    const queryBuilder = this.patientRepository.createQueryBuilder('patient');

    if (searchDto.mrn) {
      queryBuilder.andWhere('patient.mrn ILIKE :mrn', { mrn: `%${searchDto.mrn}%` });
    }

    if (searchDto.name) {
      queryBuilder.andWhere(
        '(patient.nameGiven ILIKE :name OR patient.nameFamily ILIKE :name)',
        { name: `%${searchDto.name}%` },
      );
    }

    // Add other search conditions...

    const [items, totalItems] = await queryBuilder
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .getManyAndCount();

    return new PageDto(items, totalItems, pageOptionsDto);
  }
} 