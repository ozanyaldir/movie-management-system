import { validate } from 'class-validator';
import { LoginRequestDTO } from './login.dto';

describe('LoginRequestDTO', () => {
  it('should be valid with proper fields', async () => {
    const dto = new LoginRequestDTO();
    dto.username = 'ozanuser';
    dto.password = 'securepass';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when username is too short', async () => {
    const dto = new LoginRequestDTO();
    dto.username = 'abc';
    dto.password = 'securepass';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when password is too short', async () => {
    const dto = new LoginRequestDTO();
    dto.username = 'ozanuser';
    dto.password = 'short';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when fields are missing', async () => {
    const dto = new LoginRequestDTO();

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
