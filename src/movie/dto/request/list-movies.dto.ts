import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsEnum } from 'class-validator';
import { SortMoviesBy } from 'src/_shared/constant';

export class ListMoviesRequestDTO {
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

  @IsOptional()
  @IsEnum(SortMoviesBy)
  sort_by: SortMoviesBy;
}
