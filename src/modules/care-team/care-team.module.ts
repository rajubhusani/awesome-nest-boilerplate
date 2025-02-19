import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareTeamController } from './care-team.controller';
import { CareTeamService } from './care-team.service';
import { CareTeam } from './entities/care-team.entity';
import { MapperService } from '../../common/services/mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([CareTeam])],
  controllers: [CareTeamController],
  providers: [CareTeamService, MapperService],
  exports: [CareTeamService],
})
export class CareTeamModule {} 