import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  IsIn,
} from 'class-validator';
import { SCREENING_TIME_SLOTS } from 'src/movie-session/constants';

export class UpdateMovieSessionRequestDTO {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(4)
  room_number: string;

  @IsOptional()
  @IsDateString()
  screening_date: Date;

  @IsOptional()
  @IsIn(SCREENING_TIME_SLOTS)
  screening_time: string;
}
