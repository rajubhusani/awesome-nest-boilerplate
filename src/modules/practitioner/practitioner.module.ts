import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PractitionerController } from './practitioner.controller';
import { PractitionerService } from './practitioner.service';
import { Practitioner } from './entities/practitioner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Practitioner])],
  controllers: [PractitionerController],
  providers: [PractitionerService],
  exports: [PractitionerService],
})
export class PractitionerModule {} 