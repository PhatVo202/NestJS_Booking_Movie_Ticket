import { Module } from '@nestjs/common';
import { TheaterManagementService } from './theater-management.service';
import { TheaterManagementController } from './theater-management.controller';

@Module({
  controllers: [TheaterManagementController],
  providers: [TheaterManagementService],
})
export class TheaterManagementModule {}
