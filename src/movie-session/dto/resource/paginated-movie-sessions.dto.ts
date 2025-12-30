import { MovieSession } from 'src/_repository/_entity';
import {
  MovieSessionResourceDTO,
  newMovieSessionResourceFromEntity,
} from '../../../_shared/dto/resource/movie-session.dto';

export class PaginatedMovieSessionResourcesDTO {
  total?: number;
  page?: number;
  size?: number;
  data?: MovieSessionResourceDTO[];
}

export function newPaginatedMovieSessionResourceDTO(
  m: MovieSession[],
  total: number,
  page: number,
  size: number,
): PaginatedMovieSessionResourcesDTO {
  return {
    total,
    page,
    size,
    data: m.map((m) => newMovieSessionResourceFromEntity(m)),
  };
}
