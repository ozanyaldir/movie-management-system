import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { UserType } from 'src/_repository/_entity';

export class RegisterRequestDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsOptional()
  @IsDateString()
  dob: Date;

  @IsOptional()
  @IsEnum(UserType)
  type: UserType;
}
