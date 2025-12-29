import { MovieSession } from 'src/_repository/_entity';

export class MovieSessionResourceDTO {
  guid: string;
  room_number: string;
  screening_time: Date;
}

export function newMovieSessionResourceFromEntity(
  m: MovieSession,
): MovieSessionResourceDTO {
  return {
    guid: m.guid,
    room_number: m.roomNumber,
    screening_time: m.screeningTime,
  } as MovieSessionResourceDTO;
}
