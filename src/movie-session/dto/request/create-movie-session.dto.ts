import {
  IsString,
  IsIn,
  IsDateString,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { SCREENING_TIME_SLOTS } from 'src/movie-session/constants';

export class CreateMovieSessionRequestDTO {
  @IsUUID('4')
  movie_id: string;

  @IsString()
  @MinLength(1)
  @MaxLength(4)
  room_number: string;

  @IsDateString()
  screening_date: Date;

  @IsIn(SCREENING_TIME_SLOTS)
  screening_time: string;
}
