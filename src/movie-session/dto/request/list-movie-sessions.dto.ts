import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsUUID } from 'class-validator';

export class ListMovieSessionsRequestDTO {
  @IsUUID('4')
  movie_id: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => (value ? Number(value) : undefined))
  page: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  @Transform(({ value }) => (value ? Number(value) : undefined))
  size: number;
}
