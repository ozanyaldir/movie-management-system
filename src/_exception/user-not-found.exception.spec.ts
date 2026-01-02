import { UserNotFoundException } from './user-not-found.exception';

describe('UserNotFoundException', () => {
  it('creates exception with default message when username is not provided', () => {
    const ex = new UserNotFoundException();

    const response = ex.getResponse() as any;

    expect(response).toEqual({
      code: 'user_not_found',
      message: 'User was not found.',
    });

    expect(ex.getStatus()).toBe(404);
  });

  it('creates exception with username-specific message', () => {
    const ex = new UserNotFoundException('ozan');

    const response = ex.getResponse() as any;

    expect(response).toEqual({
      code: 'user_not_found',
      message: 'User with username "ozan" was not found.',
    });

    expect(ex.getStatus()).toBe(404);
  });
});
