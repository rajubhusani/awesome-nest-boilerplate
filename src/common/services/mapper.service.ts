import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import type { ClassConstructor } from 'class-transformer/types/interfaces';

@Injectable()
export class MapperService {
  toDto<T, V>(dto: ClassConstructor<T>, entity: V): T {
    return plainToClass(dto, entity, { excludeExtraneousValues: true });
  }

  toDtos<T, V>(dto: ClassConstructor<T>, entities: V[]): T[] {
    return entities.map(entity => this.toDto(dto, entity));
  }
} 