import { Movie } from 'src/_repository/_entity';

export class MovieResourceDTO {
  guid: string;
  title: string;
  min_allowed_age: number;
}

export function newMovieResourceFromEntity(m: Movie): MovieResourceDTO {
  return {
    guid: m.guid,
    title: m.title,
    min_allowed_age: m.minAllowedAge,
  } as MovieResourceDTO;
}
