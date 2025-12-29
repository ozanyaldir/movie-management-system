import { Movie } from 'src/_repository/_entity';
import { CreateMovieRequestDTO } from 'src/movie/dto/request';
import moment from 'moment';

export function newMovieFromCreateRequestDTO(
  dto: CreateMovieRequestDTO,
): Movie {
  const m = new Movie();
  m.title = dto.title;
  m.minAllowedAge = dto.minAllowedAge;
  return m;
}

export function newMovieFromUpdateRequestDTO(
  dto: CreateMovieRequestDTO,
): Movie {
  const m = new Movie();
  m.title = dto.title ?? undefined;
  m.minAllowedAge = dto.minAllowedAge ?? undefined;
  return m;
}

export function newMovieFromDeleteRequest(): Movie {
  const m = new Movie();
  m.deletedAt = moment().utc().toDate();
  return m;
}
