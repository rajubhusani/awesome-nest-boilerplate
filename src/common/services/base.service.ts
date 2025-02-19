import { Repository } from 'typeorm';
import type { FindOptionsWhere, DeepPartial } from 'typeorm';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { NotFoundException } from '@nestjs/common';
import { BaseEntity } from '../entities/base.entity';
import { MapperService } from './mapper.service';

export abstract class BaseService<T extends BaseEntity, CreateDto, UpdateDto, ResponseDto> {
  protected constructor(
    protected readonly repository: Repository<T>,
    protected readonly mapperService: MapperService,
    protected readonly dtoClass: new () => ResponseDto,
  ) {}

  async create(createDto: CreateDto, userId: string): Promise<ResponseDto> {
    const entity = this.repository.create({
      ...(createDto as DeepPartial<T>),
      created_by: { id: userId },
      updated_by: { id: userId },
    });

    const savedEntity = await this.repository.save(entity);
    return this.mapperService.toDto(this.dtoClass, savedEntity);
  }

  async findAll(where: FindOptionsWhere<T> = {}): Promise<ResponseDto[]> {
    const entities = await this.repository.find({
      where,
      relations: ['created_by', 'updated_by'],
    });
    return this.mapperService.toDtos(this.dtoClass, entities);
  }

  async findOne(id: string, where: FindOptionsWhere<T> = {}): Promise<ResponseDto> {
    const entity = await this.repository.findOne({
      where: { id, ...where } as FindOptionsWhere<T>,
      relations: ['created_by', 'updated_by'],
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ID "${id}" not found`);
    }

    return this.mapperService.toDto(this.dtoClass, entity);
  }

  async update(id: string, updateDto: UpdateDto, userId: string, where: FindOptionsWhere<T> = {}): Promise<ResponseDto> {
    const updateResult = await this.repository.update(
      { id, ...where } as FindOptionsWhere<T>,
      {
        ...(updateDto as DeepPartial<T>),
        updated_by: { id: userId },
      } as QueryDeepPartialEntity<T>
    );

    if (!updateResult.affected) {
      throw new NotFoundException(`Entity with ID "${id}" not found`);
    }

    return this.findOne(id, where);
  }

  async remove(id: string, where: FindOptionsWhere<T> = {}): Promise<void> {
    const deleteResult = await this.repository.delete({ id, ...where } as FindOptionsWhere<T>);

    if (!deleteResult.affected) {
      throw new NotFoundException(`Entity with ID "${id}" not found`);
    }
  }
} 