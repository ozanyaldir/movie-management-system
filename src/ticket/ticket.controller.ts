import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TicketOrchestrator } from './ticket.orchestrator';

@ApiTags('tickets')
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketOrchestrator: TicketOrchestrator) {}
}
