import { validate } from 'class-validator';
import { UserType } from 'src/_repository/_entity';
import { RegisterRequestDTO } from './register.dto';

describe('RegisterRequestDTO', () => {
  it('should be valid with required fields', async () => {
    const dto = new RegisterRequestDTO();
    dto.username = 'ozanuser';
    dto.password = 'securepass';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be valid when optional fields are provided', async () => {
    const dto = new RegisterRequestDTO();
    dto.username = 'ozanuser';
    dto.password = 'securepass';
    dto.dob = '1995-01-01' as any;
    dto.type = UserType.Customer;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when username is too short', async () => {
    const dto = new RegisterRequestDTO();
    dto.username = 'abc';
    dto.password = 'securepass';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when password is too short', async () => {
    const dto = new RegisterRequestDTO();
    dto.username = 'ozanuser';
    dto.password = 'short';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when dob is not a valid date string', async () => {
    const dto = new RegisterRequestDTO();
    dto.username = 'ozanuser';
    dto.password = 'securepass';
    dto.dob = 'invalid-date' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when type is not valid enum', async () => {
    const dto = new RegisterRequestDTO();
    dto.username = 'ozanuser';
    dto.password = 'securepass';
    dto.type = 'wrong' as any;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
