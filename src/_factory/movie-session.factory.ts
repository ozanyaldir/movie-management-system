import { Movie, MovieSession } from 'src/_repository/_entity';
import moment from 'moment';
import {
  CreateMovieSessionRequestDTO,
  UpdateMovieSessionRequestDTO,
} from 'src/movie-session/dto/request';

export function newMovieSessionFromCreateRequestDTO(
  dto: CreateMovieSessionRequestDTO,
  movie: Movie,
): MovieSession {
  const screeningTime = moment(
    `${dto.screening_date} ${dto.screening_time}`,
    'YYYY-MM-DD HH:mm',
    true,
  )
    .toDate();

  const m = new MovieSession();
  m.movieId = movie.id;
  m.screeningTime = screeningTime;
  m.roomNumber = dto.room_number;
  return m;
}

export function newMovieSessionFromUpdateRequestDTO(
  dto: UpdateMovieSessionRequestDTO,
): MovieSession {
  const m = new MovieSession();
  m.roomNumber = dto.room_number ?? undefined;
  return m;
}

export function newMovieSessionFromDeleteRequest(): MovieSession {
  const m = new MovieSession();
  m.deletedAt = moment().utc().toDate();
  return m;
}
