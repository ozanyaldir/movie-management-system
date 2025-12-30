import { Ticket } from 'src/_repository/_entity';
import {
  MovieSessionResourceDTO,
  newMovieSessionResourceFromEntity,
} from './movie-session.dto';

export class TicketResourceDTO {
  guid: string;
  is_used: boolean;
  session: MovieSessionResourceDTO | undefined;
}

export function newTicketResourceFromEntity(m: Ticket): TicketResourceDTO {
  return {
    guid: m.guid,
    is_used: m.isUsed,
    session: m.session
      ? newMovieSessionResourceFromEntity(m.session)
      : undefined,
  } as TicketResourceDTO;
}
