import { UserType } from 'src/_repository/_entity';

describe('newJWTPayload', () => {
  let newJWTPayload: any;

  beforeEach(() => {
    jest.resetModules();

    newJWTPayload = require('./jwt.model').newJWTPayload;
  });

  it('maps fields correctly', () => {
    const dto = newJWTPayload(
      'user-guid-1',
      UserType.Customer,
      'session-123',
    );

    expect(dto).toEqual({
      sub: 'user-guid-1',
      user_type: UserType.Customer,
      session_id: 'session-123',
    });
  });

  it('preserves enum value for Manager', () => {
    const dto = newJWTPayload(
      'admin-guid-1',
      UserType.Manager,
      'session-abc',
    );

    expect(dto.user_type).toBe(UserType.Manager);
  });

  it('returns a plain immutable-like object structure', () => {
    const dto = newJWTPayload(
      'user-guid-2',
      UserType.Customer,
      's-999',
    );

    expect(Object.keys(dto)).toEqual(['sub', 'user_type', 'session_id']);

    expect(dto).not.toHaveProperty('guid');
    expect(dto).not.toHaveProperty('type');
    expect(dto).not.toHaveProperty('tickets');
  });
});
