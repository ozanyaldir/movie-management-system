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
  const screeningTime = moment(dto.screening_time, 'HH:mm', true).format(
    'HH:mm:ss',
  );

  const m = new MovieSession();
  m.movieId = movie.id;
  m.screeningDate = dto.screening_date;
  m.screeningTime = screeningTime;
  m.roomNumber = dto.room_number;
  return m;
}

export function newMovieSessionFromUpdateRequestDTO(
  dto: UpdateMovieSessionRequestDTO,
): MovieSession {
  const m = new MovieSession();
  m.roomNumber = dto.room_number ?? undefined;
  m.screeningDate = dto.screening_date ?? undefined;

  if ((dto.screening_time?.length ?? 0) > 0) {
    const screeningTime = moment(dto.screening_time, 'HH:mm', true).format(
      'HH:mm:ss',
    );
    m.screeningTime = screeningTime;
  }

  return m;
}
