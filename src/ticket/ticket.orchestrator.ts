import { Injectable } from '@nestjs/common';
import { MovieSessionService } from 'src/_service/';
import { BuyTicketRequestDTO, ListTicketsRequestDTO } from './dto/request';
import {
  newPaginatedTicketResourceDTO,
  PaginatedTicketResourcesDTO,
} from './dto/resource';
import {
  MovieSessionNotFoundException,
  TicketNotFoundException,
} from 'src/_exception';
import { User } from 'src/_repository/_entity';
import { newTicketFromUserAndSession } from 'src/_factory/ticket.factory';
import { TicketService } from 'src/_service';
import {
  newTicketResourceFromEntity,
  TicketResourceDTO,
} from 'src/_shared/dto/resource';

@Injectable()
export class TicketOrchestrator {
  constructor(
    private readonly movieSessionService: MovieSessionService,
    private readonly ticketService: TicketService,
  ) {}

  async buyTicket(
    user: User,
    data: BuyTicketRequestDTO,
  ): Promise<TicketResourceDTO> {
    const movieSession = await this.movieSessionService.getPlainByGuid(
      data.session_id,
    );
    if (!movieSession) {
      throw new MovieSessionNotFoundException(data.session_id);
    }

    const m = newTicketFromUserAndSession(user, movieSession);
    const createdTicket = await this.ticketService.create(m);

    const detailedTicket = await this.ticketService.getDetailedById(
      createdTicket.id,
    );
    if (!detailedTicket) {
      throw new TicketNotFoundException(createdTicket.guid);
    }
    return newTicketResourceFromEntity(detailedTicket);
  }

  async useTicket(id: string): Promise<TicketResourceDTO> {
    const ticket = await this.ticketService.getPlainByGuid(id);
    if (!ticket) {
      throw new TicketNotFoundException(id);
    }

    await this.ticketService.setUsed(ticket.id);

    const updatedTicket = await this.ticketService.getDetailedById(ticket.id);
    if (!updatedTicket) {
      throw new TicketNotFoundException(id);
    }
    return newTicketResourceFromEntity(updatedTicket);
  }

  async list(
    user: User,
    query: ListTicketsRequestDTO,
  ): Promise<PaginatedTicketResourcesDTO> {
    const [result, total, page, size] = await this.ticketService.list(
      user.id,
      query.is_used,
      query.page,
      query.size,
    );

    return newPaginatedTicketResourceDTO(result, total, page, size);
  }
}
