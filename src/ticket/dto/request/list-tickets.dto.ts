import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min, Max, IsBoolean } from 'class-validator';

export class ListTicketsRequestDTO {
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
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'string') {
      if (value === 'true' || value === '1') return true;
      if (value === 'false' || value === '0') return false;
    }
    return Boolean(value);
  })
  is_used?: boolean;
}
