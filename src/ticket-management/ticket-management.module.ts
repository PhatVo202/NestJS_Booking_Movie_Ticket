import { Module } from '@nestjs/common';
import { TicketManagementService } from './ticket-management.service';
import { TicketManagementController } from './ticket-management.controller';

@Module({
  controllers: [TicketManagementController],
  providers: [TicketManagementService],
})
export class TicketManagementModule {}
