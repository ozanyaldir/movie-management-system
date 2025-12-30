import { Movie } from 'src/_repository/_entity';
import { CreateMovieRequestDTO } from 'src/movie/dto/request';

export function newMovieFromCreateRequestDTO(
  dto: CreateMovieRequestDTO,
): Movie {
  const m = new Movie();
  m.title = dto.title;
  m.minAllowedAge = dto.min_allowed_age;
  return m;
}

export function newMovieFromUpdateRequestDTO(
  dto: CreateMovieRequestDTO,
): Movie {
  const m = new Movie();
  m.title = dto.title ?? undefined;
  m.minAllowedAge = dto.min_allowed_age ?? undefined;
  return m;
}
