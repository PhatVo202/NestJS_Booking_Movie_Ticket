import { Module } from '@nestjs/common';
import { FilmManagementService } from './film-management.service';
import { FilmManagementController } from './film-management.controller';

@Module({
  controllers: [FilmManagementController],
  providers: [FilmManagementService],
})
export class FilmManagementModule {}
