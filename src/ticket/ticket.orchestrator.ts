import { Injectable } from '@nestjs/common';
import { MovieSessionService } from 'src/_service/';
import { BuyTicketRequestDTO } from './dto/request';
import { newTicketResourceFromEntity, TicketResourceDTO } from './dto/resource';
import { MovieSessionNotFoundException } from 'src/_exception';
import { User } from 'src/_repository/_entity';
import { newTicketFromUserAndSession } from 'src/_factory/ticket.factory';
import { TicketService } from 'src/_service';

@Injectable()
export class TicketOrchestrator {
  constructor(
    private readonly movieSessionService: MovieSessionService,
    private readonly ticketService: TicketService,
  ) {}

  async buy(user: User, data: BuyTicketRequestDTO): Promise<TicketResourceDTO> {
    const movieSession = await this.movieSessionService.getByGuid(
      data.session_id,
    );
    if (!movieSession) {
      throw new MovieSessionNotFoundException(data.session_id);
    }

    const m = newTicketFromUserAndSession(user, movieSession);
    const createdTicket = await this.ticketService.create(m);
    return newTicketResourceFromEntity(createdTicket);
  }
}
