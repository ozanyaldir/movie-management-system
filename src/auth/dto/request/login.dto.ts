import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(16)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;
}
