import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Practitioner } from './entities/practitioner.entity';
import { CreatePractitionerDto } from './dtos/create-practitioner.dto';
import { PractitionerDto } from './dtos/practitioner.dto';

@Injectable()
export class PractitionerService {
  constructor(
    @InjectRepository(Practitioner)
    private practitionerRepository: Repository<Practitioner>,
  ) {}

  async create(createPractitionerDto: CreatePractitionerDto, userId: string): Promise<PractitionerDto> {
    const practitioner = this.practitionerRepository.create({
      ...createPractitionerDto,
      created_by: userId,
      updated_by: userId,
    });

    await this.practitionerRepository.save(practitioner);
    return practitioner;
  }

  async findAll(): Promise<PractitionerDto[]> {
    return this.practitionerRepository.find({
      relations: ['organization'],
    });
  }

  async findOne(id: string): Promise<PractitionerDto> {
    return this.practitionerRepository.findOneOrFail({
      where: { id },
      relations: ['organization'],
    });
  }

  async update(id: string, updatePractitionerDto: Partial<CreatePractitionerDto>, userId: string): Promise<PractitionerDto> {
    await this.practitionerRepository.update(id, {
      ...updatePractitionerDto,
      updated_by: userId,
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.practitionerRepository.delete(id);
  }
} 