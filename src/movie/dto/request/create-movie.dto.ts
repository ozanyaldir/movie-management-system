import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class CreateMovieRequestDTO {
  @IsOptional()
  @IsInt()
  @Min(0)
  minAllowedAge: number;

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(40)
  title: string;
}
