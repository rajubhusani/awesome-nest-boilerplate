import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CareTeam } from './entities/care-team.entity';
import { CreateCareTeamDto } from './dtos/create-care-team.dto';
import { CareTeamDto } from './dtos/care-team.dto';
import { MapperService } from '../../common/services/mapper.service';

@Injectable()
export class CareTeamService {
  constructor(
    @InjectRepository(CareTeam)
    private careTeamRepository: Repository<CareTeam>,
    private mapperService: MapperService,
  ) {}

  async create(createCareTeamDto: CreateCareTeamDto, patientId: string, userId: string): Promise<CareTeamDto> {
    const careTeam = this.careTeamRepository.create({
      ...createCareTeamDto,
      patient: { id: patientId },
      created_by: { id: userId },
      updated_by: { id: userId },
    });

    const savedCareTeam = await this.careTeamRepository.save(careTeam);
    return this.mapperService.toDto(CareTeamDto, savedCareTeam);
  }

  async findAll(patientId: string): Promise<CareTeamDto[]> {
    const careTeams = await this.careTeamRepository.find({
      where: { patient: { id: patientId } },
      relations: ['patient', 'created_by', 'updated_by'],
    });
    return this.mapperService.toDtos(CareTeamDto, careTeams);
  }

  async findOne(id: string, patientId: string): Promise<CareTeamDto> {
    const careTeam = await this.careTeamRepository.findOneOrFail({
      where: { id, patient: { id: patientId } },
      relations: ['patient', 'created_by', 'updated_by'],
    });
    return this.mapperService.toDto(CareTeamDto, careTeam);
  }

  async update(id: string, updateCareTeamDto: Partial<CreateCareTeamDto>, patientId: string, userId: string): Promise<CareTeamDto> {
    await this.careTeamRepository.update(
      { id, patient: { id: patientId } },
      {
        ...updateCareTeamDto,
        updated_by: { id: userId },
      },
    );

    return this.findOne(id, patientId);
  }

  async remove(id: string, patientId: string): Promise<void> {
    await this.careTeamRepository.delete({ id, patient: { id: patientId } });
  }
} 