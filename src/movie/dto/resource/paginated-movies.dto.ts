import { Movie } from 'src/_repository/_entity';
import { MovieResourceDTO, newMovieResourceFromEntity } from './movie.dto';

export type PaginatedMovieResourcesDTO = {
  total?: number;
  page?: number;
  size?: number;
  data?: MovieResourceDTO[];
};

export function newPaginatedMovieResourceDTO(
  m: Movie[],
  total: number,
  page: number,
  size: number,
): PaginatedMovieResourcesDTO {
  return {
    total,
    page,
    size,
    data: m.map((m) => newMovieResourceFromEntity(m)),
  };
}
