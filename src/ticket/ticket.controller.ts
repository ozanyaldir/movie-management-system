import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TicketOrchestrator } from './ticket.orchestrator';
import { BuyTicketRequestDTO } from './dto/request';
import { TicketResourceDTO } from './dto/resource';
import { User } from 'src/_repository/_entity';
import { CurrentUser } from 'src/_decorator';
import { CustomerGuard, JWTGuard } from 'src/_guard';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JWTGuard)
export class TicketController {
  constructor(private readonly ticketOrchestrator: TicketOrchestrator) {}

  @Post('buy')
  @UseGuards(CustomerGuard)
  @ApiCreatedResponse({ type: TicketResourceDTO })
  @ApiNotFoundResponse({
    description: 'Movie session not found',
  })
  buy(
    @CurrentUser() currentUser: User,
    @Body() data: BuyTicketRequestDTO,
  ): Promise<TicketResourceDTO> {
    return this.ticketOrchestrator.buy(currentUser, data);
  }
}
