import { MovieSession } from 'src/_repository/_entity';
import { MovieSessionResourceDTO } from '../../../_shared/dto/resource/movie-session.dto';

export class PaginatedMovieSessionResourceDTO {
  total: number;
  page: number;
  size: number;
  data: MovieSessionResourceDTO[] | null;

  constructor(
    sessions: MovieSession[],
    total: number,
    page: number,
    size: number,
  ) {
    this.total = total;
    this.page = page;
    this.size = size;

    this.data = Array.isArray(sessions)
      ? sessions.map((s) => new MovieSessionResourceDTO(s))
      : null;
  }
}
