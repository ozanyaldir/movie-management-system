import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TicketOrchestrator } from './ticket.orchestrator';
import { BuyTicketRequestDTO, ListTicketsRequestDTO } from './dto/request';
import { PaginatedTicketResourcesDTO } from './dto/resource';
import { User } from 'src/_repository/_entity';
import { CurrentUser } from 'src/_decorator';
import { CustomerGuard, JWTGuard } from 'src/_guard';
import { TicketResourceDTO } from 'src/_shared/dto/resource';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JWTGuard, CustomerGuard)
export class TicketController {
  constructor(private readonly ticketOrchestrator: TicketOrchestrator) {}

  @Post('buy')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ type: TicketResourceDTO })
  @ApiNotFoundResponse({
    description: 'Movie session not found',
  })
  buyTicket(
    @CurrentUser() currentUser: User,
    @Body() data: BuyTicketRequestDTO,
  ): Promise<TicketResourceDTO> {
    return this.ticketOrchestrator.buyTicket(currentUser, data);
  }

  @Post(':id/use')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: TicketResourceDTO })
  @ApiNotFoundResponse({
    description: 'Ticket not found',
  })
  useTicket(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TicketResourceDTO> {
    return this.ticketOrchestrator.useTicket(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PaginatedTicketResourcesDTO })
  list(
    @CurrentUser() currentUser: User,
    @Query() query: ListTicketsRequestDTO,
  ): Promise<PaginatedTicketResourcesDTO> {
    return this.ticketOrchestrator.list(currentUser, query);
  }
}
