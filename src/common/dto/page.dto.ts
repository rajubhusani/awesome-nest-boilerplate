import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page-meta.dto';
import type { PageOptionsDto } from './page-options.dto';

export class PageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: T[], total: number, pageOptionsDto: PageOptionsDto) {
    this.data = data;
    this.meta = new PageMetaDto(pageOptionsDto, total);
  }
}
