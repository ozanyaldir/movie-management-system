import { RegisterRequestDTO } from 'src/auth/dto/request';
import { UserType, User } from 'src/_repository/_entity';
import { newUserFromRegisterRequestDTO } from './user.factory';

describe('newUserFromRegisterRequestDTO', () => {
  const passwordHash = 'hashed-password-123';

  function makeDto(
    dto: Partial<RegisterRequestDTO> = {},
  ): RegisterRequestDTO {
    return {
      username: 'ozan',
      password: 'plainPassword',
      dob: new Date('1995-06-18') as any,
      type: UserType.Customer,
      ...dto,
    } as RegisterRequestDTO;
  }

  it('should map username, passwordHash, dob and type correctly', () => {
    const dto = makeDto();
    const user = newUserFromRegisterRequestDTO(dto, passwordHash);

    expect(user).toBeInstanceOf(User);
    expect(user.username).toBe(dto.username);
    expect(user.passwordHash).toBe(passwordHash);
    expect(user.dob).toEqual(dto.dob);
    expect(user.type).toBe(dto.type);
  });

  it('should not copy raw password from DTO', () => {
    const dto = makeDto({ password: 'my-secret' });

    const user = newUserFromRegisterRequestDTO(dto, passwordHash);

    expect(user.passwordHash).toBe(passwordHash);
    expect((user as any).password).toBeUndefined();
  });

  it('should allow dob to be undefined', () => {
    const dto = makeDto({ dob: undefined });

    const user = newUserFromRegisterRequestDTO(dto, passwordHash);

    expect(user.dob).toBeUndefined();
  });

  it('should allow type to be undefined (DB default applies later)', () => {
    const dto = makeDto({ type: undefined });

    const user = newUserFromRegisterRequestDTO(dto, passwordHash);

    expect(user.type).toBeUndefined();
  });

  it('should not pre-generate guid (left to TypeORM @BeforeInsert)', () => {
    const dto = makeDto();

    const user = newUserFromRegisterRequestDTO(dto, passwordHash);

    expect(user.guid).toBeUndefined();
  });
});
