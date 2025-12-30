import { Movie } from 'src/_repository/_entity';
import {
  MovieSessionResourceDTO,
  newMovieSessionResourceFromEntity,
} from './movie-session.dto';

export class MovieResourceDTO {
  guid: string;
  title: string;
  min_allowed_age: number;
  sessions: MovieSessionResourceDTO[] | undefined;
}

export function newMovieResourceFromEntity(m: Movie): MovieResourceDTO {
  const sessions = m.sessions ?? [];
  return {
    guid: m.guid,
    title: m.title,
    min_allowed_age: m.minAllowedAge,
    ...(sessions.length > 0 && {
      sessions: sessions.map((s) => newMovieSessionResourceFromEntity(s)),
    }),
  } as MovieResourceDTO;
}
