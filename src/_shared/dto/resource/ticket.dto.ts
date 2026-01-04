import { Ticket } from 'src/_repository/_entity';
import { MovieSessionResourceDTO } from './movie-session.dto';

export class TicketResourceDTO {
  guid: string;
  is_used: boolean;
  session: MovieSessionResourceDTO | undefined;

  constructor(ticket: Ticket) {
    this.guid = ticket.guid;
    this.is_used = ticket.isUsed;

    this.session = ticket.session
      ? new MovieSessionResourceDTO(ticket.session)
      : undefined;
  }
}
