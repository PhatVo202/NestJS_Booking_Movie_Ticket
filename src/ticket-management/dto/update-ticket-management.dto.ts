import { PartialType } from '@nestjs/swagger';
import { CreateTicketManagementDto } from './create-ticket-management.dto';

export class UpdateTicketManagementDto extends PartialType(CreateTicketManagementDto) {}
