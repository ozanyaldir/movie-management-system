import { AuthResourceDTO } from './auth.dto';

describe('AuthResourceDTO (constructor mapping)', () => {
  it('should create a resource dto with token', () => {
    const dto = new AuthResourceDTO('abc123');

    expect(dto).toBeInstanceOf(AuthResourceDTO);
    expect(dto.token).toBe('abc123');
  });

  it('should allow empty token string', () => {
    const dto = new AuthResourceDTO('');

    expect(dto.token).toBe('');
  });
});
