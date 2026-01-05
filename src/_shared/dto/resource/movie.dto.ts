import { Movie } from 'src/_repository/_entity';
import { MovieSessionResourceDTO } from './movie-session.dto';

export class MovieResourceDTO {
  guid: string;
  title: string;
  min_allowed_age: number;
  sessions: MovieSessionResourceDTO[] | undefined;

  constructor(movie: Movie) {
    this.guid = movie.guid;
    this.title = movie.title;
    this.min_allowed_age = movie.minAllowedAge;

    this.sessions = Array.isArray(movie.sessions)
      ? movie.sessions.map((s) => new MovieSessionResourceDTO(s))
      : undefined;
  }
}
