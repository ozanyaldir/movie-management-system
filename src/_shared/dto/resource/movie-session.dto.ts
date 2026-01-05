import { MovieSession } from 'src/_repository/_entity';
import { MovieResourceDTO } from './movie.dto';
import { TicketResourceDTO } from './ticket.dto';

export class MovieSessionResourceDTO {
  guid: string;
  room_number: string;
  screening_date: Date;
  screening_time: string;
  movie: MovieResourceDTO | undefined;
  tickets: TicketResourceDTO[] | undefined;

  constructor(session: MovieSession) {
    this.guid = session.guid;
    this.room_number = session.roomNumber;
    this.screening_date = session.screeningDate;
    this.screening_time = session.screeningTime;

    this.movie = session.movie
      ? new MovieResourceDTO(session.movie)
      : undefined;

    this.tickets = Array.isArray(session.tickets)
      ? session.tickets.map((t) => new TicketResourceDTO(t))
      : undefined;
  }
}
