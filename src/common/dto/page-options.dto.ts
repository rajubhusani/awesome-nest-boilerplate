import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Order } from '../../constants/order.ts';
import {
  EnumFieldOptional,
  NumberFieldOptional,
  StringFieldOptional,
} from '../../decorators/field.decorators.ts';

export class PageOptionsDto {
  @EnumFieldOptional(() => Order, {
    default: Order.ASC,
  })
  readonly order!: Order;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  readonly page?: number = 1;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  readonly take?: number = 10;

  get skip(): number {
    const page = this.page ?? 1;
    const take = this.take ?? 10;
    return (page - 1) * take;
  }

  @StringFieldOptional()
  readonly q?: string;
}
