import { AuthResourceDTO, newAuthResource } from "./auth.dto";

describe('AuthResourceDTO', () => {
  it('should create a resource dto with token', () => {
    const dto = newAuthResource('abc123');

    expect(dto).toBeInstanceOf(Object);
    expect(dto).toMatchObject<AuthResourceDTO>({
      token: 'abc123',
    });
  });

  it('should allow empty token string', () => {
    const dto = newAuthResource('');

    expect(dto.token).toBe('');
  });
});
