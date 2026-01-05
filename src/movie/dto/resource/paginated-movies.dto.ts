import { Movie } from 'src/_repository/_entity';
import { MovieResourceDTO } from '../../../_shared/dto/resource/movie.dto';

export class PaginatedMovieResourceDTO {
  total: number;
  page: number;
  size: number;
  data: MovieResourceDTO[] | null;

  constructor(movies: Movie[], total: number, page: number, size: number) {
    this.total = total;
    this.page = page;
    this.size = size;

    this.data = Array.isArray(movies)
      ? movies.map((m) => new MovieResourceDTO(m))
      : null;
  }
}
