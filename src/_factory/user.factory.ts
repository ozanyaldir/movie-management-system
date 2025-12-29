import { User } from 'src/_repository/_entity';
import { RegisterRequestDTO } from 'src/auth/dto/request';

export function newUserFromRegisterRequestDTO(
  dto: RegisterRequestDTO,
  passwordHash: string,
): User {
  const user = new User();
  user.username = dto.username;
  user.passwordHash = passwordHash;
  user.type = dto.type;
  user.dob = dto.dob;
  return user;
}
