import { MovieSession } from 'src/_repository/_entity';
import { MovieResourceDTO, newMovieResourceFromEntity } from './movie.dto';
import { newTicketResourceFromEntity, TicketResourceDTO } from './ticket.dto';

export class MovieSessionResourceDTO {
  guid: string;
  room_number: string;
  screening_date: Date;
  screening_time: string;
  movie: MovieResourceDTO | undefined;
  tickets: TicketResourceDTO[] | undefined;
}

export function newMovieSessionResourceFromEntity(
  m: MovieSession,
): MovieSessionResourceDTO {
  const tickets = m.tickets ?? [];
  return {
    guid: m.guid,
    room_number: m.roomNumber,
    screening_date: m.screeningDate,
    screening_time: m.screeningTime,
    movie: m.movie ? newMovieResourceFromEntity(m.movie) : undefined,
    ...(tickets.length > 0 && {
      tickets: tickets.map((t) => newTicketResourceFromEntity(t)),
    }),
  } as MovieSessionResourceDTO;
}
